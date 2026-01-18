'use client';

import { useEffect, useRef, useState } from 'react';
import { VisualizationData, Severity } from '@/types';
import FireSpreadOverlay from './FireSpreadOverlay';
import FireSpreadControls from './FireSpreadControls';

interface SituationVisualizerProps {
  visualizationData: VisualizationData | null;
}

export default function SituationVisualizer({ visualizationData }: SituationVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const firePulseRef = useRef<SVGCircleElement>(null);
  
  // Fire spread animation state
  const [isFireSpreadRunning, setIsFireSpreadRunning] = useState(false);
  const [fireSpreadSpeed, setFireSpreadSpeed] = useState(1);
  const [fireSpreadIntensity, setFireSpreadIntensity] = useState(1);
  const [fireSpreadKey, setFireSpreadKey] = useState(0);

  // Reset fire spread when visualization data changes
  // Combined into single effect to ensure atomic state updates and prevent race conditions
  useEffect(() => {
    if (visualizationData) {
      // Reset both state values atomically in the same effect
      setIsFireSpreadRunning(false);
      setFireSpreadKey((prev) => prev + 1);
    }
  }, [visualizationData]);

  useEffect(() => {
    // Simple pulsing animation for fire origin
    if (firePulseRef.current) {
      const element = firePulseRef.current;
      const animate = () => {
        element.style.opacity = '0.6';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 1000);
      };
      const interval = setInterval(animate, 2000);
      return () => clearInterval(interval);
    }
  }, [visualizationData]);

  if (!visualizationData) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
        <p className="text-gray-500 text-lg">Select a demo scenario to visualize the situation</p>
      </div>
    );
  }

  const { layout, fireOrigin, riskZones, safePaths, strikeNodes } = visualizationData;

  // Get fire origin coordinates
  let fireX = fireOrigin.coordinates?.x || 50;
  let fireY = fireOrigin.coordinates?.y || 50;

  if (fireOrigin.area) {
    const fireRoom = layout.rooms.find((r) =>
      r.name.toLowerCase().includes(fireOrigin.area.toLowerCase()) ||
      r.id.toLowerCase().includes(fireOrigin.area.toLowerCase())
    );
    if (fireRoom) {
      fireX = fireRoom.coordinates.x + fireRoom.coordinates.width / 2;
      fireY = fireRoom.coordinates.y + fireRoom.coordinates.height / 2;
    }
  }

  const getRiskColor = (severity: Severity): string => {
    switch (severity) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f97316'; // orange
      case 'low':
        return '#eab308'; // yellow
      default:
        return '#9ca3af'; // gray-400 (valid hex color)
    }
  };

  const getRiskOpacity = (severity: Severity): number => {
    switch (severity) {
      case 'high':
        return 0.4;
      case 'medium':
        return 0.25;
      case 'low':
        return 0.15;
      default:
        return 0.1;
    }
  };

  const handleResetFireSpread = () => {
    setIsFireSpreadRunning(false);
    setFireSpreadKey((prev) => prev + 1);
  };

  return (
    <div className="w-full bg-white rounded-lg border-2 border-gray-300 shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Situation Visualization</h2>
      
      {/* Fire Spread Controls */}
      <div className="mb-4">
        <FireSpreadControls
          isRunning={isFireSpreadRunning}
          onToggleRunning={() => setIsFireSpreadRunning(!isFireSpreadRunning)}
          onReset={handleResetFireSpread}
          speed={fireSpreadSpeed}
          onSpeedChange={setFireSpreadSpeed}
          intensity={fireSpreadIntensity}
          onIntensityChange={setFireSpreadIntensity}
        />
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full h-[600px] border border-gray-200 rounded bg-gray-50"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Render rooms */}
          {layout.rooms.map((room) => (
            <g key={room.id}>
              <rect
                x={room.coordinates.x}
                y={room.coordinates.y}
                width={room.coordinates.width}
                height={room.coordinates.height}
                fill="#f3f4f6"
                stroke="#9ca3af"
                strokeWidth="0.5"
              />
              <text
                x={room.coordinates.x + room.coordinates.width / 2}
                y={room.coordinates.y + room.coordinates.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="2"
                fill="#6b7280"
                className="font-semibold"
              >
                {room.name}
              </text>
            </g>
          ))}

          {/* Render risk zones (heat map overlay) */}
          {riskZones.map((zone) => {
            const color = getRiskColor(zone.severity);
            const opacity = getRiskOpacity(zone.severity);
            return (
              <rect
                key={zone.id}
                x={zone.coordinates.x}
                y={zone.coordinates.y}
                width={zone.coordinates.width}
                height={zone.coordinates.height}
                fill={color}
                opacity={opacity}
              />
            );
          })}

          {/* Render exits */}
          {layout.exits.map((exit) => (
            <g key={exit.id}>
              <circle
                cx={exit.coordinates.x}
                cy={exit.coordinates.y}
                r="2"
                fill="#10b981"
                stroke="#059669"
                strokeWidth="0.3"
              />
              <text
                x={exit.coordinates.x}
                y={exit.coordinates.y - 3}
                textAnchor="middle"
                fontSize="1.5"
                fill="#059669"
                className="font-medium"
              >
                {exit.name}
              </text>
            </g>
          ))}

          {/* Render safe paths */}
          {safePaths.map((path, index) => (
            <g key={path.id}>
              <polyline
                points={path.points.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="0.5"
                strokeDasharray="1,1"
                opacity="0.7"
              />
              {/* Path arrow marker */}
              {path.points.length >= 2 && (
                <text
                  x={(path.points[0].x + path.points[path.points.length - 1].x) / 2}
                  y={(path.points[0].y + path.points[path.points.length - 1].y) / 2 - 2}
                  textAnchor="middle"
                  fontSize="1.2"
                  fill="#059669"
                  className="font-medium"
                >
                  Route {index + 1}
                </text>
              )}
            </g>
          ))}

          {/* Render strike nodes */}
          {strikeNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.coordinates.x}
                cy={node.coordinates.y}
                r="2.5"
                fill="#dc2626"
                stroke="#991b1b"
                strokeWidth="0.5"
              />
              <text
                x={node.coordinates.x}
                y={node.coordinates.y - 4}
                textAnchor="middle"
                fontSize="1.3"
                fill="#dc2626"
                className="font-bold"
              >
                ⚠
              </text>
            </g>
          ))}

          {/* Render fire origin with pulsing animation */}
          <g>
            {/* Outer pulsing ring */}
            <circle
              ref={firePulseRef}
              cx={fireX}
              cy={fireY}
              r="3"
              fill="#dc2626"
              opacity="0.8"
              className="transition-opacity duration-1000"
            />
            {/* Inner core */}
            <circle cx={fireX} cy={fireY} r="2" fill="#ef4444" />
            {/* Fire icon */}
            <text
              x={fireX}
              y={fireY + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="2"
              fill="white"
              className="font-bold"
            >
              🔥
            </text>
            <text
              x={fireX}
              y={fireY - 4}
              textAnchor="middle"
              fontSize="1.5"
              fill="#dc2626"
              className="font-bold"
            >
              Fire Origin
            </text>
          </g>
        </svg>

        {/* Fire Spread Overlay */}
        <FireSpreadOverlay
          key={fireSpreadKey}
          layout={layout}
          origin={{ x: fireX, y: fireY }}
          riskZones={riskZones}
          params={{
            spreadProb: 0.3 * fireSpreadIntensity,
            decayMs: 2000,
            particleRate: 5 * fireSpreadIntensity,
            maxParticles: 500,
            seed: 42,
          }}
          isRunning={isFireSpreadRunning}
          speed={fireSpreadSpeed}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-semibold text-sm mb-2 text-gray-700">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
              <span>High Risk Zone</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 mr-2 rounded"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 mr-2 rounded"></div>
              <span>Low Risk</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-green-600 mr-2 rounded-full"></div>
              <span>Exit/Safe Zone</span>
            </div>
            <div className="flex items-center">
              <svg width="16" height="4" className="mr-2">
                <line x1="0" y1="2" x2="16" y2="2" stroke="#10b981" strokeDasharray="2,2" strokeWidth="2" />
              </svg>
              <span>Safe Path</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
              <span>Strike Node</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 rounded-full mr-2 animate-pulse"></div>
              <span>Fire Origin</span>
            </div>
          </div>
        </div>
    </div>
  );
}
