// Analysis pipeline with OpenAI + deterministic fallback
// NO DATABASE - pure function only

import { SituationAnalysis, EnvironmentType } from '@/types';

/**
 * Run analysis on transcript text
 * - Try OpenAI first (if API key exists)
 * - Fallback to rule-based analysis if OpenAI fails
 * - ALWAYS returns valid SituationAnalysis
 */
export async function runAnalysis(transcriptText: string): Promise<SituationAnalysis> {
  // Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    try {
      const openaiResult = await runOpenAIAnalysis(transcriptText);
      if (openaiResult) {
        console.log('OpenAI analysis successful');
        return openaiResult;
      }
    } catch (error) {
      console.warn('OpenAI analysis failed, falling back to rule-based:', error);
    }
  }

  // Fallback to deterministic rule-based analysis
  console.log('Using rule-based analysis');
  return runRuleBasedAnalysis(transcriptText);
}

/**
 * OpenAI-powered analysis
 */
async function runOpenAIAnalysis(transcriptText: string): Promise<SituationAnalysis | null> {
  try {
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an emergency situation analyzer. Extract structured fire emergency data from transcripts.

Return JSON with:
- environmentType: "apartment" | "office" | "school" | "forest"
- environmentConfidence: 0-100
- fireOrigin: { floor: number, area: string, confidence: 0-100 }
- landmarks: [{ name: string, type: string, location: string }]
- hazards: [{ type: string, severity: "low" | "medium" | "high", location: string, confidence: 0-100 }]
- urgency: "low" | "medium" | "high" | "critical"
- spreadProbability: 0-100 (likelihood of rapid fire spread)
- inferred: boolean (true if guessing from context)

Respond ONLY with valid JSON.`,
        },
        {
          role: 'user',
          content: transcriptText,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (responseContent) {
      const analysis: SituationAnalysis = JSON.parse(responseContent);
      
      // Validate required fields - including fireOrigin.area
      if (analysis.environmentType && analysis.fireOrigin && analysis.fireOrigin.area && analysis.hazards) {
        console.log('OpenAI analysis successful');
        return analysis;
      }
    }
  } catch (error) {
    console.error('OpenAI error:', error);
  }

  return null;
}

/**
 * Rule-based deterministic analysis
 * Uses keywords and heuristics - NO AI required
 */
function runRuleBasedAnalysis(transcriptText: string): SituationAnalysis {
  const lower = transcriptText.toLowerCase();
  
  // Determine environment type
  const environmentType = detectEnvironment(lower);
  
  // Detect floor
  const floor = detectFloor(lower);
  
  // Detect area/room
  const area = detectArea(lower);
  
  // Detect hazards
  const hazards = detectHazards(lower);
  
  // Determine urgency
  const urgency = determineUrgency(lower, hazards);
  
  // Estimate spread probability
  const spreadProbability = estimateSpreadProbability(lower, hazards);
  
  // Extract landmarks
  const landmarks = detectLandmarks(lower);
  
  return {
    environmentType,
    environmentConfidence: 85, // Rule-based has high confidence for keywords
    fireOrigin: {
      floor,
      area,
      confidence: 80,
    },
    landmarks,
    hazards,
    urgency,
    spreadProbability,
    inferred: true, // Rule-based is always inferred
  };
}

/**
 * Detect environment type from keywords
 */
function detectEnvironment(text: string): EnvironmentType {
  if (text.includes('apartment') || text.includes('unit') || text.includes('bedroom') || text.includes('kitchen')) {
    return 'apartment';
  }
  if (text.includes('office') || text.includes('cubicle') || text.includes('conference') || text.includes('desk')) {
    return 'office';
  }
  if (text.includes('school') || text.includes('classroom') || text.includes('cafeteria') || text.includes('gym')) {
    return 'school';
  }
  if (text.includes('forest') || text.includes('tree') || text.includes('woods') || text.includes('wildfire')) {
    return 'forest';
  }
  
  // Default to apartment (most common indoor fire)
  return 'apartment';
}

/**
 * Detect floor number
 */
function detectFloor(text: string): number {
  // Look for explicit floor numbers
  const floorMatch = text.match(/(?:floor|level)\s*(\d+)|(\d+)(?:st|nd|rd|th)\s*floor/i);
  if (floorMatch) {
    return parseInt(floorMatch[1] || floorMatch[2]);
  }
  
  // Look for ordinal numbers
  if (text.includes('first')) return 1;
  if (text.includes('second')) return 2;
  if (text.includes('third')) return 3;
  if (text.includes('fourth')) return 4;
  if (text.includes('fifth')) return 5;
  
  // Look for just numbers in context
  const numberMatch = text.match(/\b([1-5])\b/);
  if (numberMatch) {
    return parseInt(numberMatch[1]);
  }
  
  // Default to ground floor
  return 1;
}

/**
 * Detect area/room
 */
function detectArea(text: string): string {
  // Room types
  const roomKeywords = [
    'kitchen', 'bedroom', 'living room', 'bathroom', 'hallway', 'stairwell',
    'break room', 'conference room', 'lobby', 'storage', 'closet',
    'classroom', 'cafeteria', 'gymnasium', 'library', 'lab',
  ];
  
  for (const keyword of roomKeywords) {
    if (text.includes(keyword)) {
      return keyword;
    }
  }
  
  // Location descriptors
  if (text.includes('near the stairs')) return 'near stairwell';
  if (text.includes('by the door')) return 'near entrance';
  if (text.includes('back of')) return 'rear area';
  if (text.includes('front of')) return 'front area';
  if (text.includes('corner')) return 'corner room';
  
  // Default
  return 'main area';
}

/**
 * Detect hazards
 */
function detectHazards(text: string): Array<{
  type: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
  confidence: number;
}> {
  const hazards: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    location: string;
    confidence: number;
  }> = [];
  
  // Smoke
  if (text.includes('smoke')) {
    hazards.push({
      type: 'Heavy smoke',
      severity: text.includes('heavy') || text.includes('thick') ? 'high' : 'medium',
      location: 'Spreading from fire origin',
      confidence: 90,
    });
  }
  
  // Blocked exits
  if (text.includes('blocked') || text.includes('can\'t see') || text.includes('cannot see')) {
    hazards.push({
      type: 'Blocked visibility',
      severity: 'high',
      location: 'Exit paths',
      confidence: 85,
    });
  }
  
  // Structural
  if (text.includes('ceiling') || text.includes('wall') || text.includes('collapse')) {
    hazards.push({
      type: 'Structural damage',
      severity: 'high',
      location: 'Fire origin area',
      confidence: 75,
    });
  }
  
  // Heat
  if (text.includes('hot') || text.includes('heat')) {
    hazards.push({
      type: 'Extreme heat',
      severity: 'high',
      location: 'Throughout affected area',
      confidence: 80,
    });
  }
  
  // Electrical
  if (text.includes('electrical') || text.includes('sparks') || text.includes('wiring')) {
    hazards.push({
      type: 'Electrical hazard',
      severity: 'high',
      location: 'Fire origin',
      confidence: 85,
    });
  }
  
  // Default hazard if none detected
  if (hazards.length === 0) {
    hazards.push({
      type: 'Fire spread',
      severity: 'medium',
      location: 'Unknown',
      confidence: 60,
    });
  }
  
  return hazards;
}

/**
 * Detect landmarks
 */
function detectLandmarks(text: string): Array<{ name: string; type: string; location: string }> {
  const landmarks: Array<{ name: string; type: string; location: string }> = [];
  
  if (text.includes('stair')) {
    landmarks.push({ name: 'Stairwell', type: 'vertical_access', location: 'Central' });
  }
  if (text.includes('elevator')) {
    landmarks.push({ name: 'Elevator', type: 'vertical_access', location: 'Near stairs' });
  }
  if (text.includes('exit') || text.includes('door')) {
    landmarks.push({ name: 'Emergency exit', type: 'exit', location: 'End of hallway' });
  }
  if (text.includes('window')) {
    landmarks.push({ name: 'Windows', type: 'emergency_access', location: 'Exterior walls' });
  }
  
  return landmarks;
}

/**
 * Determine urgency level
 */
function determineUrgency(text: string, hazards: Array<{ severity: string }>): 'low' | 'medium' | 'high' | 'critical' {
  const urgentKeywords = ['help', 'trapped', 'can\'t breathe', 'spreading', 'quickly', 'fast'];
  const criticalKeywords = ['trapped', 'can\'t escape', 'losing consciousness'];
  
  // Check for critical keywords
  for (const keyword of criticalKeywords) {
    if (text.includes(keyword)) {
      return 'critical';
    }
  }
  
  // Check for high hazards
  const hasHighHazard = hazards.some(h => h.severity === 'high');
  if (hasHighHazard) {
    return 'high';
  }
  
  // Check for urgent keywords
  for (const keyword of urgentKeywords) {
    if (text.includes(keyword)) {
      return 'high';
    }
  }
  
  // Check for multiple hazards
  if (hazards.length >= 3) {
    return 'high';
  }
  
  // Default to medium (fire is always urgent)
  return 'medium';
}

/**
 * Estimate spread probability (0-100)
 */
function estimateSpreadProbability(text: string, hazards: Array<{ type: string }>): number {
  let probability = 50; // Base probability
  
  // Increase for rapid spread indicators
  if (text.includes('spreading') || text.includes('growing')) probability += 20;
  if (text.includes('fast') || text.includes('quickly')) probability += 15;
  if (text.includes('out of control')) probability += 25;
  
  // Increase for flammable materials
  if (text.includes('gas') || text.includes('chemical')) probability += 20;
  if (text.includes('wood') || text.includes('paper')) probability += 10;
  
  // Increase for multiple hazards
  probability += Math.min(hazards.length * 5, 20);
  
  // Decrease for contained fires
  if (text.includes('small') || text.includes('contained')) probability -= 20;
  
  // Clamp to 0-100
  return Math.max(10, Math.min(probability, 95));
}
