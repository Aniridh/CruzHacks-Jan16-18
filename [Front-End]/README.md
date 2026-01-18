# Front-End Files

This folder contains all front-end/client-side code for IGNIS.

## Contents

- **components/** - React components
  - **Dashboard Components:**
    - `DemoMode.tsx` - Demo scenario selector
    - `SituationReport.tsx` - Main situation report component
    - `SituationVisualizer.tsx` - SVG visualization component
    - `ReasoningLog.tsx` - Decision reasoning display
  - **landing/** - Tactical landing page components
    - `TacticalButton.tsx` - Animated tactical-style buttons
    - `TacticalGrid.tsx` - Animated background grid
    - `WireframeBuilding.tsx` - SVG building wireframes
    - `TargetingReticle.tsx` - HUD overlay elements

- **app/** - Next.js pages
  - `landing-page.tsx` - Tactical landing page route
  
- **page.tsx** - Main dashboard page (also in `app/page.tsx` for Next.js)
- **layout.tsx** - Root layout (also in `app/layout.tsx` for Next.js)
- **globals.css** - Global styles (also in `app/globals.css` for Next.js)

## Technologies

- **React** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations (landing page)
- **Lucide React** - Icons

## Note

These files are also present in the `app/` and `components/` directories at the project root for Next.js routing. The root directories are the working directories that Next.js uses at runtime.
