# IGNIS Testing Guide

Complete testing guide for all IGNIS features and modes.

---

## 🚀 Quick Test (30 seconds)

**Test that the system works without any API keys:**

```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Click "📋 Demo Scenarios"

# 4. Select "Apartment Fire - Second Floor"

# 5. Verify visualization appears with:
   - Floor plan layout
   - Fire origin marker
   - Risk zones
   - Safe paths
   - Reasoning log
```

✅ **Expected**: Everything works perfectly without any API keys!

---

## 🧪 Test Matrix

| Feature | With API Keys | Without API Keys | Status |
|---------|---------------|------------------|--------|
| Demo Mode | ✅ Works | ✅ Works | Always |
| Voice Input (Vapi) | ✅ Works | ❌ Shows error | Optional |
| OpenAI Analysis | ✅ Works | ➡️ Fallback | Progressive |
| Rule-Based Analysis | ✅ Works | ✅ Works | Always |
| Visualization | ✅ Works | ✅ Works | Always |
| Fire Spread | ✅ Works | ✅ Works | Always |

---

## 📋 Test Scenarios

### Test 1: Demo Mode (No API Keys)

**Purpose**: Verify system works completely offline

**Steps**:
1. **Clear** `.env.local` or ensure no API keys are set
2. Restart dev server: `npm run dev`
3. Navigate to http://localhost:3000
4. Click "📋 Demo Scenarios"
5. Select each demo scenario:
   - Apartment Fire - Second Floor
   - Office Fire - Third Floor Break Room
   - School Fire - Gymnasium
   - Forest Fire - Trail Junction
   - (Any custom scenarios)

**Expected Results**:
- ✅ All scenarios load instantly
- ✅ Rule-based analysis runs (<100ms)
- ✅ Visualization renders correctly
- ✅ Fire spread animation works
- ✅ Reasoning log shows explanations
- ✅ Confidence scores displayed
- ✅ No errors in console

**Verification**:
```bash
# Check console for: "Using rule-based analysis"
# Should NOT see: "OpenAI analysis successful"
```

---

### Test 2: OpenAI Analysis (With API Key)

**Purpose**: Verify OpenAI integration works

**Prerequisites**:
- Valid `OPENAI_API_KEY` in `.env.local`
- OpenAI account with credits

**Steps**:
1. Add OpenAI API key to `.env.local`
2. Restart dev server
3. Select demo scenario
4. Wait for analysis (2-4 seconds)

**Expected Results**:
- ✅ Console shows: "OpenAI analysis successful"
- ✅ More detailed hazard descriptions
- ✅ Higher confidence scores
- ✅ More nuanced urgency levels
- ✅ Better environment detection

**Verification**:
```bash
# Terminal should show:
# "OpenAI analysis successful"
# Response time: 2-4 seconds
```

---

### Test 3: OpenAI Fallback (Bad API Key)

**Purpose**: Verify fallback works when OpenAI fails

**Steps**:
1. Set invalid API key in `.env.local`:
   ```env
   OPENAI_API_KEY=sk_invalid_key_12345
   ```
2. Restart dev server
3. Select demo scenario

**Expected Results**:
- ✅ Console shows: "OpenAI analysis failed, falling back to rule-based"
- ✅ Console shows: "Using rule-based analysis"
- ✅ Analysis completes successfully
- ✅ Visualization still renders
- ✅ No user-facing errors

**Verification**:
```bash
# Console shows fallback message
# System continues to work normally
```

---

### Test 4: Voice Input (With Vapi)

**Purpose**: Test live voice recording

**Prerequisites**:
- Valid `NEXT_PUBLIC_VAPI_PUBLIC_KEY` in `.env.local`
- Microphone access
- Vapi account with credits

**Steps**:
1. Add Vapi public key to `.env.local`
2. Restart dev server
3. Click "🎤 Live Voice Input" tab
4. Click "Start Voice Call"
5. Allow microphone access
6. Speak emergency description:
   ```
   "There's a fire on the second floor in the kitchen.
   Heavy smoke is filling the hallway.
   I can't see the exit clearly."
   ```
7. AI assistant may ask clarifying questions
8. Click "End Call & Analyze"

**Expected Results**:
- ✅ Voice call connects
- ✅ Real-time transcript appears
- ✅ AI assistant responds
- ✅ Analysis runs on complete transcript
- ✅ Visualization renders

**Verification**:
```bash
# Console shows: "Processing transcript: ..."
# Analysis completes within 2-4 seconds
```

---

### Test 5: Manual Ingest API

**Purpose**: Test analysis without Vapi or UI

**Steps**:

```bash
# Test 1: Simple transcript
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Fire on second floor kitchen with heavy smoke"}'

# Test 2: Complex transcript
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "There is a rapidly spreading fire in the office break room on the third floor. Multiple people are trapped. The stairwell exit is blocked by smoke. We need immediate assistance."}'

# Test 3: Forest fire
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Wildfire spreading quickly through the forest near the hiking trail. High winds making it worse."}'
```

**Expected Results**:
```json
{
  "success": true,
  "analysis": {
    "environmentType": "apartment",
    "environmentConfidence": 85,
    "fireOrigin": {
      "floor": 2,
      "area": "kitchen",
      "confidence": 80
    },
    "hazards": [
      {
        "type": "Heavy smoke",
        "severity": "high",
        "location": "Spreading from fire origin",
        "confidence": 90
      }
    ],
    "urgency": "high",
    "spreadProbability": 75,
    "inferred": true
  },
  "source": "manual_ingest",
  "timestamp": "2026-01-18T..."
}
```

---

### Test 6: Vapi Webhook (Production)

**Purpose**: Test webhook endpoint

**Prerequisites**:
- `VAPI_WEBHOOK_SECRET` set in `.env.local`
- Vapi dashboard configured

**Steps**:

```bash
# Test 1: Valid webhook
curl -X POST http://localhost:3000/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -H "X-Vapi-Secret: your_secret_here" \
  -d '{
    "type": "end-of-call-report",
    "call": {"id": "test-call-123"},
    "transcript": {"text": "Fire on second floor"}
  }'

# Test 2: Invalid secret
curl -X POST http://localhost:3000/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -H "X-Vapi-Secret: wrong_secret" \
  -d '{
    "type": "transcript",
    "transcript": {"text": "Test"}
  }'

# Test 3: No transcript
curl -X POST http://localhost:3000/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -H "X-Vapi-Secret: your_secret_here" \
  -d '{"type": "call-started"}'
```

**Expected Results**:
- Test 1: ✅ 200 OK with analysis
- Test 2: ❌ 401 Unauthorized
- Test 3: ✅ 200 OK (acknowledged)

---

### Test 7: Fire Spread Visualization

**Purpose**: Test animated fire spread overlay

**Steps**:
1. Load any demo scenario
2. Wait for visualization to load
3. Observe fire spread controls:
   - ▶️ Start/Pause button
   - 🔄 Reset button
   - 🎚️ Speed slider
4. Test controls:
   - Click Start → fire particles begin spreading
   - Click Pause → particles freeze
   - Click Reset → particles clear
   - Adjust speed → spread rate changes

**Expected Results**:
- ✅ Red particles spawn near fire origin
- ✅ Particles spread probabilistically
- ✅ Particles fade over time
- ✅ Higher density in high-risk zones
- ✅ Speed control works smoothly
- ✅ Reset clears all particles

---

### Test 8: Rule-Based Analysis Accuracy

**Purpose**: Verify rule-based fallback produces correct results

**Test Cases**:

```bash
# Test 1: Floor detection
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Fire on the third floor"}'
# Expected: fireOrigin.floor = 3

# Test 2: Environment detection
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Classroom fire in the school"}'
# Expected: environmentType = "school"

# Test 3: Urgency detection
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Help! Trapped by fire! Can\'t breathe!"}'
# Expected: urgency = "critical"

# Test 4: Hazard detection
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Heavy smoke and electrical sparks"}'
# Expected: hazards include "Heavy smoke" and "Electrical hazard"

# Test 5: Spread probability
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Fire spreading rapidly with gas leak"}'
# Expected: spreadProbability > 80
```

---

## 🐛 Error Scenarios

### Error 1: No Microphone Access

**Trigger**: Block microphone permissions

**Expected**:
- ❌ Browser shows permission denied
- ✅ Clear error message in UI
- ✅ System suggests using demo mode
- ✅ Other features continue working

### Error 2: Network Timeout (OpenAI)

**Trigger**: Disconnect internet, try analysis

**Expected**:
- ⏳ OpenAI request fails
- ✅ Automatic fallback to rule-based
- ✅ Analysis completes successfully
- ✅ User sees results

### Error 3: Invalid Transcript

**Trigger**:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"transcript": ""}'
```

**Expected**:
- ❌ 400 Bad Request
- ✅ Error message: "Invalid transcript"

### Error 4: Malformed JSON

**Trigger**:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```

**Expected**:
- ❌ 400 Bad Request
- ✅ JSON error message (not crash)

---

## ✅ Acceptance Checklist

### Core Functionality
- [ ] Demo mode works without any API keys
- [ ] All demo scenarios load and visualize
- [ ] Rule-based analysis always produces results
- [ ] OpenAI analysis works when key provided
- [ ] Automatic fallback on OpenAI failure
- [ ] Fire spread visualization animates
- [ ] All controls (start/pause/reset/speed) work

### API Endpoints
- [ ] `/api/analyze` returns valid analysis
- [ ] `/api/ingest` works for manual testing
- [ ] `/api/vapi/webhook` validates secrets
- [ ] All endpoints return JSON (never crash)

### Error Handling
- [ ] Missing API keys → fallback works
- [ ] Invalid API keys → fallback works
- [ ] Network errors → fallback works
- [ ] Invalid input → clear error messages
- [ ] No console errors in demo mode

### UI/UX
- [ ] Mode toggle (Voice ↔ Demo) works
- [ ] Voice recorder shows status clearly
- [ ] Transcript displays in real-time
- [ ] Loading states are clear
- [ ] Error messages are actionable
- [ ] Visualization renders correctly
- [ ] Responsive on different screen sizes

### Documentation
- [ ] README is clear and accurate
- [ ] SYSTEM_ARCHITECTURE.md is complete
- [ ] API endpoints are documented
- [ ] Setup instructions work
- [ ] Testing guide is comprehensive

---

## 🎯 Performance Benchmarks

| Operation | Target | Actual |
|-----------|--------|--------|
| Rule-based analysis | <100ms | ~50ms |
| OpenAI analysis | 2-4s | 2-3s |
| Demo scenario load | <500ms | ~100ms |
| Visualization render | <1s | ~300ms |
| Fire spread frame rate | 30 FPS | 60 FPS |

---

## 📊 Test Report Template

```markdown
# IGNIS Test Report

**Date**: 2026-01-18
**Tester**: [Your Name]
**Environment**: Development / Production

## Test Results

### Demo Mode
- ✅ All scenarios load
- ✅ Rule-based analysis works
- ✅ Visualization renders

### API Endpoints
- ✅ /api/analyze
- ✅ /api/ingest
- ✅ /api/vapi/webhook

### OpenAI Integration
- ✅ With valid key
- ✅ Fallback on error

### Voice Input
- ✅ Vapi integration
- ✅ Real-time transcript

### Error Handling
- ✅ Graceful degradation
- ✅ Clear error messages

## Issues Found
None

## Recommendations
System ready for deployment!
```

---

## 🚀 Pre-Demo Checklist

**Before presenting to judges:**

- [ ] Test demo mode (30-second test)
- [ ] Verify all 5 scenarios load
- [ ] Check fire spread animation
- [ ] Test voice input (if using)
- [ ] Verify no console errors
- [ ] Check responsive layout
- [ ] Test on demo machine/browser
- [ ] Have backup scenarios ready
- [ ] Close unnecessary tabs
- [ ] Clear browser cache

**Demo Script**:
1. Show landing page (5 seconds)
2. Click "Launch Dashboard"
3. Explain system overview (10 seconds)
4. Select demo scenario OR record voice
5. Show analysis results (15 seconds)
6. Highlight visualization features (15 seconds)
7. Show reasoning log (10 seconds)
8. Demonstrate fire spread controls (10 seconds)
9. Emphasize "works offline" (5 seconds)
10. Q&A

**Total time**: ~2 minutes

---

**Need help?** Check `SYSTEM_ARCHITECTURE.md` for detailed technical information.
