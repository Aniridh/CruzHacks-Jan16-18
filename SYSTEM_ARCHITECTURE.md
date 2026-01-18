# IGNIS System Architecture

## 🎯 Design Principles

1. **NO DATABASE** - All state in memory and UI only
2. **Demo-First** - Works offline without any API keys
3. **Progressive Enhancement** - OpenAI when available, rule-based fallback always works
4. **Visual Intelligence** - Not physics simulation, but probabilistic reasoning visualization

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Voice Input  │  │  Demo Mode   │  │  Dashboard   │  │
│  │  (Vapi AI)   │  │  (Offline)   │  │      UI      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                            │                             │
└────────────────────────────┼─────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Routes    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  /api/analyze  │  │ /api/vapi/      │  │  /api/ingest   │
│                │  │   webhook       │  │  (Manual Test) │
└───────┬────────┘  └────────┬────────┘  └───────┬────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  runAnalysis()  │
                    │  (Core Engine)  │
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
        ┌────────▼────────┐     ┌───────▼────────┐
        │  OpenAI GPT-4   │     │  Rule-Based    │
        │   (If Available)│     │   (Always)     │
        └─────────────────┘     └────────────────┘
                 │                       │
                 └───────────┬───────────┘
                             │
                    ┌────────▼────────┐
                    │ SituationAnalysis│
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
        ┌────────▼────────┐     ┌───────▼────────┐
        │  Visualization  │     │  Fire Spread   │
        │   (SVG Layout)  │     │  (Canvas/SVG)  │
        └─────────────────┘     └────────────────┘
```

---

## 🔌 API Endpoints

### 1. `/api/analyze` (Primary Analysis)

**Purpose**: Analyze emergency call transcripts

**Input**:
```json
{
  "transcript": "There's a fire on the second floor near the stairwell..."
}
```

**Output**:
```json
{
  "environmentType": "apartment",
  "environmentConfidence": 95,
  "fireOrigin": {
    "floor": 2,
    "area": "near stairwell",
    "confidence": 85
  },
  "hazards": [...],
  "urgency": "high",
  "spreadProbability": 75,
  "inferred": false
}
```

**Fallback Strategy**:
- ✅ Try OpenAI GPT-4 first
- ✅ Fall back to rule-based if OpenAI fails
- ✅ Always returns valid `SituationAnalysis`

---

### 2. `/api/vapi/webhook` (Vapi Integration)

**Purpose**: Receive transcripts from Vapi AI voice calls

**Headers**:
```
X-Vapi-Secret: <your_webhook_secret>
```

**Input** (Vapi event payload):
```json
{
  "type": "end-of-call-report",
  "call": { "id": "..." },
  "transcript": { "text": "..." }
}
```

**Output**:
```json
{
  "success": true,
  "analysis": { ... },
  "callId": "..."
}
```

**Security**:
- ✅ Validates webhook secret
- ✅ Never throws non-JSON errors
- ✅ Returns 200 for partial events

---

### 3. `/api/ingest` (Manual Testing)

**Purpose**: Test analysis without Vapi (for debugging/demos)

**Input**:
```json
{
  "transcript": "Emergency transcript here..."
}
```

**Output**:
```json
{
  "success": true,
  "analysis": { ... },
  "source": "manual_ingest",
  "timestamp": "2026-01-18T..."
}
```

---

## 🧠 Analysis Pipeline (`runAnalysis()`)

### Flow Chart

```
Input: transcript (string)
         │
         ▼
    ┌────────────────┐
    │ OpenAI Available?│
    └────┬──────┬────┘
         │ YES  │ NO
         ▼      ▼
    ┌─────┐  ┌──────────┐
    │ GPT-4│  │Rule-Based│
    └──┬──┘  └─────┬────┘
       │           │
       │  ┌────────┘
       │  │ (on error)
       ▼  ▼
    ┌─────────────┐
    │Rule-Based   │
    │(Fallback)   │
    └──────┬──────┘
           │
           ▼
    SituationAnalysis
```

### OpenAI Analysis

**Model**: GPT-4o

**Prompt**: Extract structured fire emergency data

**Returns**: JSON with confidence scores

**Failure Modes**:
- API key missing
- Rate limit exceeded (429)
- Network timeout
- Invalid response

**Fallback**: Automatic rule-based analysis

---

### Rule-Based Analysis (Deterministic)

**Algorithm**: Keyword matching + heuristics

**Steps**:

1. **Environment Detection**
   - Keywords: apartment, office, school, forest
   - Default: apartment

2. **Floor Detection**
   - Patterns: "floor 2", "second floor", "2nd floor"
   - Numbers: extract digits in context
   - Default: 1

3. **Area Detection**
   - Room types: kitchen, bedroom, hallway, etc.
   - Descriptors: "near stairs", "by the door"
   - Default: "main area"

4. **Hazard Detection**
   - Smoke: "smoke", "heavy", "thick"
   - Blocked: "blocked", "can't see"
   - Structural: "ceiling", "collapse"
   - Heat: "hot", "heat"
   - Electrical: "electrical", "sparks"

5. **Urgency Calculation**
   - Critical: "trapped", "can't escape"
   - High: "help", "spreading", high hazards
   - Medium: multiple hazards
   - Low: default

6. **Spread Probability**
   - Base: 50%
   - +20% for "spreading", "growing"
   - +15% for "fast", "quickly"
   - +25% for "out of control"
   - +20% for gas/chemicals
   - +10% for wood/paper
   - +5% per hazard (max +20%)
   - -20% for "small", "contained"

**Confidence**: 80-90% (high for keyword matches)

---

## 🎨 Visualization System

### Components

1. **SituationVisualizer** (SVG)
   - Floor plan layout
   - Rooms and exits
   - Fire origin marker
   - Risk zones (heatmap)
   - Safe paths (dashed lines)
   - Strike nodes (priority points)

2. **FireSpreadOverlay** (Canvas/SVG)
   - Red particle system
   - Probabilistic spread
   - Fading over time
   - Speed control
   - NOT physics-based
   - Visual reasoning tool

3. **Control Panel**
   - Start/Pause/Reset
   - Speed slider
   - Real-time updates

---

## 🎮 Demo Mode

### Purpose
- Works **completely offline**
- No API keys required
- Deterministic results
- Perfect for presentations

### Implementation

**Pre-loaded Scenarios**:
```typescript
{
  title: "Apartment Fire - Second Floor",
  transcript: "There's a fire on the second floor...",
  environmentType: "apartment"
}
```

**Guaranteed Results**:
- ✅ Rule-based analysis always works
- ✅ Layout templates are local JSON
- ✅ Visualization is client-side only
- ✅ No network calls

---

## 🔐 Security

### API Keys

**Required** (with fallbacks):
- `OPENAI_API_KEY`: Optional, falls back to rule-based
- `NEXT_PUBLIC_VAPI_PUBLIC_KEY`: Optional, demo mode available
- `VAPI_WEBHOOK_SECRET`: Optional, validates webhooks if set

**Storage**:
- Server-side only (except Vapi public key)
- Never committed to git (`.gitignore`)
- Environment variables only

### Webhook Validation

**Vapi Webhook**:
```typescript
const secret = request.headers.get('x-vapi-secret');
if (expectedSecret && secret !== expectedSecret) {
  return 401 Unauthorized
}
```

---

## 💾 Data Flow (No Database)

### State Management

**Server**:
- Stateless API routes
- No sessions
- No persistent storage
- Pure functions only

**Client**:
- React state (`useState`)
- Temporary analysis results
- Visualization data in memory
- Cleared on refresh

### Why No Database?

1. **Simplicity**: Pure demo/prototype
2. **Speed**: Instant responses
3. **Privacy**: No data retention
4. **Cost**: No database hosting
5. **Hackathon-friendly**: Deploy anywhere

---

## 🚀 Deployment

### Vercel (Recommended)

**Requirements**:
- Environment variables configured
- `OPENAI_API_KEY` (optional)
- `NEXT_PUBLIC_VAPI_PUBLIC_KEY` (optional)
- `VAPI_WEBHOOK_SECRET` (optional)

**Deployment**:
```bash
vercel --prod
```

**Environment**:
- Serverless functions
- Edge runtime compatible
- No persistent storage
- Stateless by design

---

## 📊 Performance

### Response Times

| Endpoint | Time | Method |
|----------|------|--------|
| `/api/analyze` (OpenAI) | 2-4s | GPT-4 API call |
| `/api/analyze` (Rule-based) | <100ms | Keyword matching |
| `/api/vapi/webhook` | 2-4s | Analysis pipeline |
| `/api/ingest` | 2-4s | Analysis pipeline |

### Optimization

- ✅ Rule-based fallback is instant
- ✅ Demo mode has no API calls
- ✅ Visualization is client-side
- ✅ No database queries

---

## 🐛 Error Handling

### Principles

1. **Never crash**: Always return valid JSON
2. **Graceful degradation**: OpenAI → Rule-based
3. **User-friendly errors**: Clear messages
4. **No sensitive data**: Don't leak API keys
5. **Log everything**: Console for debugging

### Error Categories

**API Errors**:
- 400: Invalid input
- 401: Unauthorized (webhook)
- 429: Rate limit (OpenAI)
- 500: Internal error

**Fallback Chain**:
```
OpenAI → Rule-Based → Default Values
```

---

## 🧪 Testing

### Manual Testing

**Test `/api/ingest`**:
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Fire on second floor kitchen"}'
```

**Test Webhook**:
```bash
curl -X POST http://localhost:3000/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -H "X-Vapi-Secret: your_secret" \
  -d '{"type": "transcript", "transcript": {"text": "Emergency!"}}'
```

### Demo Mode Testing

1. Open dashboard
2. Click "Demo Scenarios"
3. Select any scenario
4. Verify visualization appears
5. No network calls should be made

---

## 📝 Future Enhancements

**Phase 1 (Current)**:
- ✅ Voice input (Vapi)
- ✅ OpenAI analysis
- ✅ Rule-based fallback
- ✅ Demo mode
- ✅ Fire spread visualization

**Phase 2 (Future)**:
- [ ] Multi-language support
- [ ] Historical call playback
- [ ] Export to PDF reports
- [ ] Real-time collaboration
- [ ] Mobile app

**Phase 3 (Production)**:
- [ ] 911 integration
- [ ] Real building blueprints API
- [ ] Live sensor data
- [ ] Multi-responder coordination
- [ ] Database for analytics

---

## 🎓 Learning Resources

- **Vapi AI Docs**: https://docs.vapi.ai/
- **OpenAI API**: https://platform.openai.com/docs
- **Next.js App Router**: https://nextjs.org/docs
- **SVG Visualization**: https://developer.mozilla.org/en-US/docs/Web/SVG

---

## ⚡ Quick Start

```bash
# Install
npm install

# Configure (optional)
cp .env.example .env.local
# Add OPENAI_API_KEY (optional)

# Run
npm run dev

# Test demo mode (no API keys needed!)
# Open http://localhost:3000
# Click "Demo Scenarios"
# Select any scenario
```

**Demo mode works immediately with zero configuration!** 🎉
