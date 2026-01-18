'use client';

import { useEffect, useRef, useCallback } from 'react';
import { LayoutTemplate, RiskZone, Room } from '@/types';

interface FireParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  birthTime: number;
  maxRadius: number;
}

interface FireSpreadParams {
  spreadProb: number; // 0-1, probability of spawning new particles
  decayMs: number; // time for particle to fade
  particleRate: number; // particles spawned per frame
  maxParticles: number;
  seed?: number;
}

interface FireSpreadOverlayProps {
  layout: LayoutTemplate;
  origin: { x: number; y: number };
  riskZones: RiskZone[];
  params: FireSpreadParams;
  isRunning: boolean;
  speed: number;
}

// Simple seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  gaussian(): number {
    // Box-Muller transform for gaussian distribution
    const u1 = this.next();
    const u2 = this.next();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}

export default function FireSpreadOverlay({
  layout,
  origin,
  riskZones,
  params,
  isRunning,
  speed,
}: FireSpreadOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FireParticle[]>([]);
  const frontierRef = useRef<{ x: number; y: number }[]>([origin]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const rngRef = useRef<SeededRandom>(new SeededRandom(params.seed || 42));

  // Initialize lastTimeRef in useEffect to avoid calling Date.now() during render
  useEffect(() => {
    lastTimeRef.current = Date.now();
  }, []);

  // Point-in-rectangle check
  const isInRoom = (x: number, y: number, room: Room): boolean => {
    return (
      x >= room.coordinates.x &&
      x <= room.coordinates.x + room.coordinates.width &&
      y >= room.coordinates.y &&
      y <= room.coordinates.y + room.coordinates.height
    );
  };

  // Check if point is in any room or hallway (valid spread area)
  const isInValidArea = useCallback((x: number, y: number): boolean => {
    return layout.rooms.some((room) => isInRoom(x, y, room));
  }, [layout.rooms]);

  // Get spread probability based on location
  const getSpreadProbability = useCallback((x: number, y: number): number => {
    let prob = params.spreadProb;

    // Higher probability in hallways (corridors)
    const inHallway = layout.rooms.some(
      (room) => room.type === 'hallway' && isInRoom(x, y, room)
    );
    if (inHallway) {
      prob *= 1.5;
    }

    // Reduce probability near exits (fire less likely to spread toward escape routes)
    const nearExit = layout.exits.some((exit) => {
      const dx = exit.coordinates.x - x;
      const dy = exit.coordinates.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 10;
    });
    if (nearExit) {
      prob *= 0.3;
    }

    // Increase probability in high-risk zones
    const inHighRiskZone = riskZones.some(
      (zone) =>
        zone.severity === 'high' &&
        x >= zone.coordinates.x &&
        x <= zone.coordinates.x + zone.coordinates.width &&
        y >= zone.coordinates.y &&
        y <= zone.coordinates.y + zone.coordinates.height
    );
    if (inHighRiskZone) {
      prob *= 1.3;
    }

    return Math.min(prob, 1);
  }, [layout.rooms, layout.exits, params.spreadProb, riskZones]);

  // Reset to initial state
  const reset = useCallback(() => {
    particlesRef.current = [];
    frontierRef.current = [origin];
    rngRef.current = new SeededRandom(params.seed || 42);
    lastTimeRef.current = Date.now();
  }, [origin, params.seed]);

  // Animate particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const now = Date.now();
      const deltaTime = ((now - lastTimeRef.current) * speed) / 1000; // seconds
      lastTimeRef.current = now;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isRunning) {
        // Update particles
        const newParticles: FireParticle[] = [];
        particlesRef.current.forEach((particle) => {
          const age = now - particle.birthTime;
          const lifespan = params.decayMs;
          const progress = Math.min(age / lifespan, 1);

          if (progress < 1) {
            // Update particle
            particle.radius = particle.maxRadius * (0.2 + progress * 0.8);
            particle.alpha = 1 - progress;
            newParticles.push(particle);
          }
        });

        // Spawn new particles from frontier
        if (newParticles.length < params.maxParticles) {
          const particlesToSpawn = Math.floor(params.particleRate * deltaTime * 60);
          
          for (let i = 0; i < particlesToSpawn; i++) {
            if (newParticles.length >= params.maxParticles) break;

            // Pick random frontier point
            const frontierPoint = frontierRef.current[Math.floor(rngRef.current.next() * frontierRef.current.length)];
            if (!frontierPoint) continue;

            // Spawn with gaussian jitter
            const jitterX = rngRef.current.gaussian() * 3;
            const jitterY = rngRef.current.gaussian() * 3;
            const newX = frontierPoint.x + jitterX;
            const newY = frontierPoint.y + jitterY;

            // Check bounds
            if (newX < 0 || newX > 100 || newY < 0 || newY > 100) continue;

            // Check if in valid area
            if (!isInValidArea(newX, newY)) continue;

            // Check spread probability
            if (rngRef.current.next() > getSpreadProbability(newX, newY)) continue;

            // Create particle - larger for better visibility
            const maxRadius = 1.5 + rngRef.current.next() * 2;
            newParticles.push({
              x: newX,
              y: newY,
              radius: maxRadius * 0.2,
              alpha: 1,
              birthTime: now,
              maxRadius,
            });

            // Maybe add to frontier
            if (rngRef.current.next() < 0.1) {
              frontierRef.current = [...frontierRef.current, { x: newX, y: newY }];
            }
          }
        }

        particlesRef.current = newParticles;
      
        // Render particles
        const scaleX = canvas.width / 100;
        const scaleY = canvas.height / 100;

        newParticles.forEach((particle) => {
          const px = particle.x * scaleX;
          const py = particle.y * scaleY;
          const pr = particle.radius * scaleX;

          ctx.save();
          
          // Outer glow - more visible
          ctx.globalAlpha = particle.alpha * 0.6;
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, pr * 3);
          gradient.addColorStop(0, '#ff0000');
          gradient.addColorStop(0.3, '#ff3300');
          gradient.addColorStop(0.7, '#cc0000');
          gradient.addColorStop(1, 'rgba(204, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.shadowBlur = pr * 3;
          ctx.shadowColor = '#ff0000';
          ctx.beginPath();
          ctx.arc(px, py, pr * 3, 0, Math.PI * 2);
          ctx.fill();

          // Core - darker and more opaque
          ctx.globalAlpha = particle.alpha * 0.95;
          ctx.fillStyle = '#cc0000';
          ctx.shadowBlur = pr * 2;
          ctx.shadowColor = '#990000';
          ctx.beginPath();
          ctx.arc(px, py, pr * 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      } else {
        // Still render when paused
        const scaleX = canvas.width / 100;
        const scaleY = canvas.height / 100;

        particlesRef.current.forEach((particle) => {
          const px = particle.x * scaleX;
          const py = particle.y * scaleY;
          const pr = particle.radius * scaleX;

          ctx.save();
          
          // Outer glow - more visible
          ctx.globalAlpha = particle.alpha * 0.6;
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, pr * 3);
          gradient.addColorStop(0, '#ff0000');
          gradient.addColorStop(0.3, '#ff3300');
          gradient.addColorStop(0.7, '#cc0000');
          gradient.addColorStop(1, 'rgba(204, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.shadowBlur = pr * 3;
          ctx.shadowColor = '#ff0000';
          ctx.beginPath();
          ctx.arc(px, py, pr * 3, 0, Math.PI * 2);
          ctx.fill();

          // Core - darker and more opaque
          ctx.globalAlpha = particle.alpha * 0.95;
          ctx.fillStyle = '#cc0000';
          ctx.shadowBlur = pr * 2;
          ctx.shadowColor = '#990000';
          ctx.beginPath();
          ctx.arc(px, py, pr * 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, speed, params, layout, riskZones, getSpreadProbability, isInValidArea]);

  // Reset when origin changes
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
