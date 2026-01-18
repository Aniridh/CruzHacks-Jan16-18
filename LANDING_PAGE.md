# IGNIS Landing Page

## Overview

The IGNIS landing page features a tactical/military-themed design with animations to create an engaging first impression for the emergency response system.

## Features

- **Tactical Grid Background**: Animated scanning grid with cyan accent colors
- **Wireframe Building**: SVG-based building wireframes representing emergency scenarios
- **Targeting Reticle**: Military-style HUD overlay with system information
- **Tactical Buttons**: Animated buttons with corner brackets and hover effects
- **Framer Motion Animations**: Smooth entrance animations and interactive elements

## Tech Stack

- **Framework**: Next.js 16 with React
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Theme**: Dark tactical/military aesthetic

## Components

### Location: `components/landing/`

1. **TacticalButton.tsx**
   - Animated button with corner brackets
   - Primary (orange) and secondary (slate) variants
   - Hover effects with bracket movement
   - Glitch/scan effect on primary buttons

2. **TacticalGrid.tsx**
   - Base grid pattern (40px squares)
   - Large grid overlay (200px squares)
   - Animated scanline moving vertically
   - Radial vignette effect

3. **WireframeBuilding.tsx**
   - SVG wireframe buildings
   - Four building structures of varying heights
   - Staggered entrance animations
   - Red markers at key points
   - Cyan wireframe aesthetic

4. **TargetingReticle.tsx**
   - Center reticle with rotating outer ring
   - Counter-rotating inner ring
   - Top-left system data (coordinates, altitude)
   - Top-right target data (distance, wind)
   - Bottom-left signal strength bars
   - Center crosshairs

## Routes

- **Landing Page**: `/landing`
- **Dashboard**: `/` (main IGNIS application)

## Navigation

The dashboard header includes a "Landing Page" link to view the tactical landing page. The landing page has:
- "Launch Dashboard" button → navigates to main application
- "View on GitHub" button → opens GitHub repository

## Color Scheme

- **Background**: Deep navy (`#020617`)
- **Primary Accent**: Orange (`#f97316`, `#ef4444`)
- **Secondary**: Cyan/Sky Blue (`#0ea5e9`, `#06b6d4`)
- **Text**: Slate variations (`#e2e8f0`, `#94a3b8`)
- **Grid**: Cyan with low opacity

## Coordinates

The landing page displays Santa Cruz, CA coordinates:
- **LAT**: 36.9741° N
- **LNG**: 122.0308° W
- **ALT**: 364 FT

(Location of UC Santa Cruz / CruzHacks)

## Typography

- **Headings**: Sans-serif, bold, uppercase
- **Data Labels**: Monospace font for tactical feel
- **Body**: Light sans-serif for readability

## Animations

All animations use Framer Motion:
- Entrance animations with staggered delays (0.2s - 1s)
- Continuous scanline animation (8s loop)
- Rotating reticles (40s - 60s loops)
- Signal strength bars (1.5s - 2s loops)
- Hover effects on buttons and feature cards

## Accessibility

- High contrast color scheme
- Clear visual hierarchy
- Keyboard navigation support
- Screen reader friendly structure

## Usage

```bash
# Navigate to landing page
http://localhost:3000/landing

# Or click "Landing Page" link in dashboard header
```

## Development

To modify the landing page:

1. Edit components in `components/landing/`
2. Update route in `app/landing/page.tsx`
3. Adjust colors/animations in Tailwind classes
4. Test animations across different screen sizes

## Deployment Notes

The landing page works seamlessly with:
- Static export (Vercel)
- Server-side rendering
- Client-side navigation
- All modern browsers

No additional configuration needed beyond base Next.js setup.
