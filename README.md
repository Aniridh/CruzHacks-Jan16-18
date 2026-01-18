# IGNIS (Emergency Insight System)

IGNIS is an AI-powered decision-support system that helps first responders gain clarity during fire emergencies by transforming emergency calls into structured spatial insight.

When a victim calls for help, their spoken description is often chaotic, emotional, and unstructured. IGNIS listens to the call, extracts critical details, and visualizes the situation in a clear layout so responders can act faster, safer, and with better situational awareness.

## Project Overview

This is a training and decision-support prototype designed to reduce confusion during high-stress emergencies. It is **not** an automated response system or a real 911 system replacement.

### 🚀 Key Innovation: Works Offline!

IGNIS is designed **demo-first** with **zero dependencies**:
- ✅ **No database** - All processing in-memory
- ✅ **No API keys required** - Built-in rule-based analysis fallback
- ✅ **Works offline** - Demo mode runs completely locally
- ✅ **Progressive enhancement** - OpenAI when available, deterministic fallback always works

Perfect for hackathon demos, presentations, and rapid prototyping!

## Tech Stack

- **Voice**: Vapi AI (live voice input and transcription)
- **AI**: OpenAI GPT-4 (situation analysis)
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Visualization**: SVG rendering
- **Layouts**: Local JSON templates
- **Demo**: Preloaded scenarios with one-click run
- **Deploy**: Vercel

## Features

- **Live Voice Input**: Record emergency calls in real-time using Vapi AI
  - Live voice transcription with Deepgram
  - Interactive AI assistant for clarifying questions
  - Real-time transcript display
  - Seamless integration with analysis pipeline

- **AI-Powered Analysis** (with Rule-Based Fallback): Extracts structured insights from emergency call transcripts
  - **OpenAI GPT-4**: Primary analysis engine (when API key available)
  - **Rule-Based Fallback**: Deterministic keyword/heuristic analysis (always works)
  - Environment type detection (apartment, office, school, forest)
  - Fire origin identification with confidence scores
  - Hazard assessment
  - Urgency classification
  - Fire spread probability estimation
  - **Guaranteed results**: System NEVER fails due to missing API keys

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

**Required:**
- Node.js 18+ and npm

**Optional** (for enhanced features):
- OpenAI API key (for GPT-4 analysis, falls back to rule-based if missing)
- Vapi AI Public Key (for live voice input, demo mode available without it)

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

3. **(Optional)** Create `.env.local` file with your API keys:
```env
# OpenAI (Optional - falls back to rule-based analysis)
OPENAI_API_KEY=your_openai_api_key_here

# Vapi AI (Optional - demo mode works without it)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here

# Vapi Webhook Secret (Optional - for production webhook validation)
VAPI_WEBHOOK_SECRET=your_webhook_secret_here
```

**How to get API keys** (optional):
- **OpenAI**: https://platform.openai.com/api-keys
- **Vapi AI**: https://dashboard.vapi.ai/ → Settings → Public Key

**Note**: The system works perfectly without any API keys! Demo mode uses local analysis.

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

The dashboard offers two input modes:

#### Live Voice Input Mode (🎤)
1. **Start Voice Call**: Click "Start Voice Call" to begin recording
2. **Speak Clearly**: Describe the emergency situation naturally
3. **AI Assistant**: The system will ask clarifying questions about location, fire origin, and hazards
4. **End Call**: Click "End Call & Analyze" when finished
5. **View Analysis**: The system automatically analyzes your transcript using GPT-4

#### Demo Scenarios Mode (📋)
1. **Select a Demo Scenario**: Click on any scenario card to load a pre-recorded emergency call
2. **View Analysis**: The system automatically analyzes the transcript using GPT-4

#### Analysis Results (Both Modes)
3. **Explore Visualization**: See the spatial visualization with fire zones, safe paths, and strike nodes
4. **Review Reasoning**: Expand sections in the reasoning log to understand AI decisions
5. **Check Confidence**: View confidence scores for each AI prediction

## API Endpoints

The system provides three API endpoints:

### 1. `/api/analyze` (Primary Analysis)
- **Input**: Emergency call transcript
- **Output**: Structured `SituationAnalysis` with confidence scores
- **Fallback**: OpenAI GPT-4 → Rule-based analysis
- **Always works**: Never fails due to missing API keys

### 2. `/api/vapi/webhook` (Vapi Integration)
- **Purpose**: Receives transcripts from Vapi AI voice calls
- **Security**: Validates webhook secret (optional)
- **Processing**: Runs full analysis pipeline
- **Output**: Structured analysis + callId

### 3. `/api/ingest` (Manual Testing)
- **Purpose**: Test analysis without Vapi (debugging/demos)
- **Input**: Raw transcript text
- **Output**: Complete analysis results
- **Usage**: `curl -X POST /api/ingest -d '{"transcript": "..."}'`

## Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts          # Primary analysis endpoint
│   │   ├── vapi/webhook/route.ts     # Vapi webhook handler
│   │   └── ingest/route.ts           # Manual testing endpoint
│   ├── page.tsx                      # Main dashboard
│   ├── landing/page.tsx              # Tactical landing page
│   └── layout.tsx                    # Root layout
├── components/
│   ├── VoiceRecorder.tsx             # Live voice input with Vapi AI
│   ├── DemoMode.tsx                  # Demo scenario selector
│   ├── SituationReport.tsx           # Main situation report component
│   ├── SituationVisualizer.tsx       # SVG visualization
│   ├── FireSpreadOverlay.tsx         # Animated fire spread
│   ├── ReasoningLog.tsx              # Decision reasoning display
│   └── landing/                      # Landing page components
├── data/
│   ├── layouts/                      # JSON layout templates
│   └── demoScenarios.ts              # Pre-loaded scenarios
├── types/
│   └── index.ts                      # TypeScript type definitions
├── utils/
│   ├── runAnalysis.ts                # Analysis pipeline (OpenAI + fallback)
│   ├── layoutSelector.ts             # Layout template loader
│   ├── visualizationLogic.ts         # Risk zones, paths, strike nodes
│   └── reasoningGenerator.ts         # Decision reasoning generator
└── [Back-End]/                       # Backend files mirror
    ├── api/                          # API routes
    └── utils/                        # Utilities
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
3. **(Optional)** Add environment variables:
   - `OPENAI_API_KEY` - for GPT-4 analysis
   - `NEXT_PUBLIC_VAPI_PUBLIC_KEY` - for voice input
   - `VAPI_WEBHOOK_SECRET` - for webhook validation
4. Deploy!

**Note**: The system works without API keys! Demo mode uses rule-based analysis.

## Documentation

### Core Documentation
- **README.md** (this file) - Project overview and quick start
- **SYSTEM_ARCHITECTURE.md** - Complete system architecture, data flow, and API reference
- **SETUP_INSTRUCTIONS.md** - Detailed setup guide with troubleshooting
- **VAPI_SETUP.md** - Vapi AI integration guide
- **GIT_WORKFLOW.md** - Git workflow and SSH setup
- **IMPLEMENTATION_SUMMARY.md** - Implementation progress and status

### Key Concepts

**No Database Architecture**:
- All state in memory and UI only
- Stateless API routes
- No persistent storage
- Pure functions only

**Progressive Enhancement**:
```
OpenAI GPT-4 (best) → Rule-Based Analysis (always works) → Default Values
```

**Analysis Pipeline** (`utils/runAnalysis.ts`):
1. Check if OpenAI API key exists
2. Try OpenAI analysis first
3. On failure, use rule-based fallback
4. Always return valid `SituationAnalysis`

**Rule-Based Analysis**:
- Keyword matching for environment type
- Pattern matching for floor/area
- Heuristic hazard detection
- Urgency calculation from indicators
- Spread probability estimation
- 80-90% confidence scores
- Works 100% offline

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
