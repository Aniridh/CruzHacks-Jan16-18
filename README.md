# IGNIS (Emergency Insight System)

IGNIS is an AI-powered decision-support system that helps first responders gain clarity during fire emergencies by transforming emergency calls into structured spatial insight.

When a victim calls for help, their spoken description is often chaotic, emotional, and unstructured. IGNIS listens to the call, extracts critical details, and visualizes the situation in a clear layout so responders can act faster, safer, and with better situational awareness.

## Project Overview

This is a training and decision-support prototype designed to reduce confusion during high-stress emergencies. It is **not** an automated response system or a real 911 system replacement.

## Tech Stack

- **Voice**: Vapi AI (future integration)
- **AI**: OpenAI GPT-4 (analysis only)
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Visualization**: SVG rendering
- **Layouts**: Local JSON templates
- **Demo**: Preloaded scenarios with one-click run
- **Deploy**: Vercel

## Features

- **AI-Powered Analysis**: Extracts structured insights from emergency call transcripts
  - Environment type detection (apartment, office, school, forest)
  - Fire origin identification with confidence scores
  - Hazard assessment
  - Urgency classification

- **Spatial Visualization**: Clear 2D layout visualization showing:
  - Fire origin location (with simple pulsing animation)
  - Risk zones (heat map: red = high, orange = medium, yellow = low)
  - Safe path recommendations (green dashed lines)
  - Strike nodes (high-priority intervention points)

- **Decision Reasoning**: Transparent explanations for all AI-driven decisions
  - Risk zone reasoning
  - Path recommendations
  - Strike node priorities
  - Uncertainty markers with confidence scores

- **Demo Mode**: Pre-loaded emergency scenarios for quick hackathon demos
  - One-click scenario loading
  - Realistic emergency call transcripts
  - All environment types covered

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CruzHacks-Jan16-18
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Landing Page

Visit `/landing` for the tactical-themed landing page featuring:
- Military-style HUD interface
- Animated wireframe buildings
- Tactical grid and targeting reticle
- Quick access to dashboard and GitHub

### Dashboard

1. **Select a Demo Scenario**: Click on any scenario card to load a pre-recorded emergency call
2. **View Analysis**: The system automatically analyzes the transcript using GPT-4
3. **Explore Visualization**: See the spatial visualization with fire zones, safe paths, and strike nodes
4. **Review Reasoning**: Expand sections in the reasoning log to understand AI decisions

## Project Structure

```
/
├── app/
│   ├── api/analyze/route.ts    # GPT-4 analysis API
│   ├── page.tsx                # Main dashboard
│   └── layout.tsx              # Root layout
├── components/
│   ├── DemoMode.tsx            # Demo scenario selector
│   ├── SituationReport.tsx     # Main situation report component
│   ├── SituationVisualizer.tsx # SVG visualization
│   └── ReasoningLog.tsx        # Decision reasoning display
├── data/
│   ├── layouts/                # JSON layout templates
│   └── demoScenarios.ts        # Pre-loaded scenarios
├── types/
│   └── index.ts                # TypeScript type definitions
└── utils/
    ├── layoutSelector.ts       # Layout template loader
    ├── visualizationLogic.ts   # Risk zones, paths, strike nodes
    └── reasoningGenerator.ts   # Decision reasoning generator
```

## Git Workflow & SSH

The repository is configured to use SSH for git operations. Helper scripts are provided for easy commits:

### Quick Commit Commands

```bash
# Commit changes with a message
./commit.sh "Your commit message here"

# Push committed changes to remote
./push.sh

# Commit and push in one command
./commit-and-push.sh "Your commit message here"
```

### Examples

```bash
# Commit all changes
./commit.sh "Add new visualization component"

# Commit and push together
./commit-and-push.sh "Update API endpoint with confidence scores"

# Just push if you've already committed
./push.sh
```

**Note:** The remote is configured to use SSH (`git@github.com`), so make sure your SSH keys are set up with GitHub.

## Deploy on Vercel

1. Push your code to GitHub (use `./push.sh` or `git push`)
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable: `OPENAI_API_KEY`
4. Deploy!

## Hackathon Track Alignment

✅ **Main Track**: Justice Hacks
- Public safety
- Emergency response
- Crisis clarity
- Equitable outcomes in life-threatening situations

✅ **Sponsor Alignment**:
- **Unwrap**: Extracts structured insights from unstructured language
- **Opennote**: Captures reasoning behind decisions
- **Framer**: Clean, professional product presentation
- **Mobbin**: UX designed for high-stress environments

## License

See LICENSE file for details.

## Disclaimer

This is a training and simulation prototype. It is **not**:
- A real 911 system
- Fully autonomous
- Replacing human judgment
- Deployed in live emergency networks
