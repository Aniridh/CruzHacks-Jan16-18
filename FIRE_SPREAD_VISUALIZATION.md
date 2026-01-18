# Fire Spread Visualization Feature

## Overview
The Fire Spread Visualization is an animated overlay that simulates probabilistic fire spread on the 2D floor plan in real-time. It creates a "video replay" effect showing how fire might spread through a building based on room layout, corridors, and risk zones.

## Components

### 1. FireSpreadOverlay (`components/FireSpreadOverlay.tsx`)
The main visualization component that renders animated fire particles on a canvas overlay.

**Features:**
- Canvas-based rendering for smooth performance
- Particle system with expansion and fade effects
- Frontier-based spread algorithm
- Room/corridor-aware spread logic
- Deterministic seeded random for consistent demos
- No GPU-heavy operations (demo-safe)

**Props:**
```typescript
{
  layout: LayoutTemplate;          // Floor plan with rooms and exits
  origin: { x: number; y: number }; // Fire starting point (0-100 coords)
  riskZones: RiskZone[];           // High-risk areas for spread bias
  params: {
    spreadProb: number;            // Base probability (0-1)
    decayMs: number;               // Particle lifetime in ms
    particleRate: number;          // Particles spawned per frame
    maxParticles: number;          // Maximum active particles
    seed?: number;                 // Random seed for consistency
  };
  isRunning: boolean;              // Animation state
  speed: number;                   // Playback speed multiplier
}
```

### 2. FireSpreadControls (`components/FireSpreadControls.tsx`)
UI controls for managing the fire spread simulation.

**Features:**
- Start/Pause toggle
- Reset button
- Speed slider (0.25x - 3x)
- Intensity slider (20% - 200%)

## How It Works

### Particle System
1. **Initialization**: Starts with the fire origin as the initial frontier point
2. **Spawning**: Each frame, new particles spawn around frontier points with gaussian jitter
3. **Growth**: Particles expand from 2px to ~10px radius over their lifetime
4. **Fade**: Alpha decreases from 1.0 to 0.0 as particles age
5. **Cleanup**: Particles are removed when they fully fade

### Spread Logic
The simulation uses several factors to determine fire spread:

1. **Room Layout**
   - Fire only spreads within room boundaries
   - Uses point-in-rectangle checks for validity
   - Prevents spread into walls or outside areas

2. **Corridor Bias**
   - 1.5x higher spread probability in hallways
   - Simulates faster fire spread in corridors

3. **Exit Repulsion**
   - 0.3x probability within 10 units of exits
   - Reflects fire being less likely near ventilated areas

4. **Risk Zone Amplification**
   - 1.3x probability in high-risk zones
   - Represents areas with more flammable materials

5. **Gaussian Jitter**
   - Particles spawn with random offset from frontier
   - Creates organic, natural-looking spread pattern

### Frontier System
- The "frontier" tracks the active spreading edge
- 10% of new particles are added to the frontier
- Frontier points serve as spawn locations for future particles
- This creates a wave-like propagation effect

## Performance

### Optimizations
- Canvas-based rendering (faster than SVG for many elements)
- Bounded particle count (max 500 by default)
- Efficient point-in-rect checks
- RequestAnimationFrame for smooth 60fps
- No WebGL or heavy shaders (hackathon laptop safe)

### Typical Performance
- **Particle count**: 200-400 active particles
- **Frame rate**: 60 FPS on modern laptops
- **CPU usage**: Low (<10% on typical i5/M1)
- **Memory**: Minimal (<10MB for particle arrays)

## Integration

The fire spread overlay is integrated into `SituationVisualizer.tsx`:

```tsx
<div className="relative">
  <svg>
    {/* Floor plan SVG */}
  </svg>
  
  <FireSpreadOverlay
    layout={layout}
    origin={{ x: fireX, y: fireY }}
    riskZones={riskZones}
    params={{
      spreadProb: 0.3 * intensity,
      decayMs: 2000,
      particleRate: 5 * intensity,
      maxParticles: 500,
      seed: 42,
    }}
    isRunning={isRunning}
    speed={speed}
  />
</div>
```

## Demo Mode

### Deterministic Seeding
- Uses seed value `42` for consistent behavior
- Same scenario always produces same spread pattern
- Critical for hackathon demonstrations and judging

### Fallback Behavior
- If fire origin coordinates missing, defaults to room center
- If no room found, uses coordinate (50, 50)
- Always provides a valid origin point

### No API Dependency
- Runs entirely client-side
- Works without OpenAI API key
- Perfect for offline demos

## Usage

1. **Select a scenario** from the demo mode
2. **Click "Start"** to begin fire spread animation
3. **Adjust speed** using the speed slider (0.25x - 3x)
4. **Adjust intensity** to control spread rate and density
5. **Click "Pause"** to freeze the animation
6. **Click "Reset"** to return to initial state

## Visual Design

### Particle Rendering
- **Core**: Solid red circle (#ff2222)
- **Glow**: Radial gradient with shadowBlur
- **Colors**: Red (#ff4444) fading to orange (#ff6644)
- **Blend mode**: Screen (for additive blending)

### Canvas Positioning
- Absolutely positioned over SVG
- Full size matching SVG container
- `pointer-events: none` for click-through
- Z-index ensures proper layering

## Future Enhancements

Potential improvements for post-hackathon:
- [ ] Smoke overlay (gray particles with different physics)
- [ ] Temperature gradient visualization
- [ ] 3D fire spread (multi-floor)
- [ ] Wind/ventilation effects
- [ ] Fire intensity zones (color-coded)
- [ ] Particle trail effects
- [ ] Sound effects (crackle, alarms)
- [ ] Export animation as video/GIF
- [ ] Historical playback with timeline scrubbing

## Technical Details

### Coordinate System
- Floor plan uses 0-100 normalized coordinates
- Canvas renders at 600x600 pixels
- Conversion: `pixelX = coordX * (canvasWidth / 100)`

### Random Number Generation
Uses a seeded Linear Congruential Generator (LCG):
```typescript
next() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
```

Box-Muller transform for gaussian distribution:
```typescript
gaussian() {
  const u1 = next();
  const u2 = next();
  return sqrt(-2 * ln(u1)) * cos(2 * PI * u2);
}
```

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires Canvas2D support (universally available)
- No WebGL required
- Mobile-friendly (responsive design)

## Troubleshooting

**Animation not starting?**
- Check that `isRunning` prop is true
- Verify origin coordinates are valid (0-100 range)
- Ensure layout has rooms defined

**Poor performance?**
- Reduce `maxParticles` (try 250-300)
- Lower `particleRate` (try 3-4)
- Reduce speed multiplier

**Fire not spreading?**
- Check that origin is inside a room
- Verify `spreadProb` is reasonable (0.2-0.5)
- Ensure frontier is being populated

**Particles disappearing immediately?**
- Check `decayMs` is reasonable (1000-3000)
- Verify canvas is rendering (check z-index)
- Ensure particle alpha is being calculated correctly
