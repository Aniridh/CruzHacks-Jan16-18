import OpenAI from 'openai';
import { SituationAnalysis, EnvironmentType, UrgencyLevel, Severity } from '@/types';

/**
 * Runs situation analysis on transcript.
 * Tries OpenAI first, falls back to keyword-based mock analysis if OpenAI fails.
 */
export async function runAnalysis(transcript: string): Promise<SituationAnalysis> {
  // Try OpenAI if API key is available
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes emergency call transcripts and extracts structured information about fire situations. Extract:
1. Environment type (apartment, office, school, forest, warehouse)
2. Fire origin location
3. Landmarks mentioned
4. Hazards and their severity
5. Overall urgency level

Be precise and extract only information explicitly stated or strongly implied in the transcript.`,
          },
          {
            role: 'user',
            content: `Analyze this emergency transcript and extract structured information:

"${transcript}"

Respond ONLY with valid JSON matching this structure:
{
  "environmentType": "apartment" | "office" | "school" | "forest" | "warehouse",
  "environmentConfidence": 0-100,
  "fireOrigin": {
    "floor": number,
    "area": "string description",
    "coordinates": { "x": 0-100, "y": 0-100 } (optional),
    "confidence": 0-100
  },
  "landmarks": [
    { "name": "string", "type": "string", "location": "string" }
  ],
  "hazards": [
    { "type": "string", "location": "string", "severity": "high" | "medium" | "low", "confidence": 0-100 }
  ],
  "urgency": "critical" | "high" | "medium",
  "inferred": boolean
}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (responseContent) {
        const analysis: SituationAnalysis = JSON.parse(responseContent);
        
        // Validate required fields
        if (analysis.environmentType && analysis.fireOrigin && analysis.hazards) {
          console.log('OpenAI analysis successful');
          return analysis;
        }
      }
    } catch (error) {
      console.warn('OpenAI analysis failed, falling back to mock:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Fallback: keyword-based mock analysis
  console.log('Using fallback mock analysis');
  return generateMockAnalysis(transcript);
}

/**
 * Generates a deterministic mock analysis based on keywords in the transcript
 */
function generateMockAnalysis(transcript: string): SituationAnalysis {
  const lowerTranscript = transcript.toLowerCase();

  // Detect environment type
  let environmentType: EnvironmentType = 'apartment';
  let environmentConfidence = 70;

  if (lowerTranscript.includes('office') || lowerTranscript.includes('cubicle') || lowerTranscript.includes('conference room')) {
    environmentType = 'office';
    environmentConfidence = 85;
  } else if (lowerTranscript.includes('school') || lowerTranscript.includes('classroom') || lowerTranscript.includes('cafeteria') || lowerTranscript.includes('gym')) {
    environmentType = 'school';
    environmentConfidence = 85;
  } else if (lowerTranscript.includes('forest') || lowerTranscript.includes('woods') || lowerTranscript.includes('trail') || lowerTranscript.includes('camping')) {
    environmentType = 'forest';
    environmentConfidence = 85;
  } else if (lowerTranscript.includes('warehouse') || lowerTranscript.includes('storage') || lowerTranscript.includes('facility')) {
    environmentType = 'warehouse';
    environmentConfidence = 85;
  } else if (lowerTranscript.includes('apartment') || lowerTranscript.includes('unit') || lowerTranscript.includes('building')) {
    environmentType = 'apartment';
    environmentConfidence = 85;
  }

  // Detect floor
  let floor = 1;
  const floorMatch = lowerTranscript.match(/(\d+)(?:st|nd|rd|th)?\s+floor/i);
  if (floorMatch) {
    floor = parseInt(floorMatch[1], 10);
  } else if (lowerTranscript.includes('second floor')) {
    floor = 2;
  } else if (lowerTranscript.includes('third floor')) {
    floor = 3;
  } else if (lowerTranscript.includes('fourth floor') || lowerTranscript.includes('4th floor')) {
    floor = 4;
  } else if (lowerTranscript.includes('fifth floor') || lowerTranscript.includes('5th floor')) {
    floor = 5;
  }

  // Detect area
  let area = 'unknown area';
  let areaConfidence = 60;

  if (lowerTranscript.includes('kitchen')) {
    area = 'kitchen';
    areaConfidence = 90;
  } else if (lowerTranscript.includes('bedroom')) {
    area = 'bedroom';
    areaConfidence = 90;
  } else if (lowerTranscript.includes('hallway') || lowerTranscript.includes('corridor')) {
    area = 'hallway';
    areaConfidence = 90;
  } else if (lowerTranscript.includes('stairwell') || lowerTranscript.includes('stairs')) {
    area = 'near stairwell';
    areaConfidence = 85;
  } else if (lowerTranscript.includes('break room')) {
    area = 'break room';
    areaConfidence = 90;
  } else if (lowerTranscript.includes('science lab') || lowerTranscript.includes('laboratory')) {
    area = 'science lab';
    areaConfidence = 90;
  } else if (lowerTranscript.includes('apartment') && lowerTranscript.match(/\d+[a-z]/i)) {
    const aptMatch = lowerTranscript.match(/apartment\s+(\d+[a-z])/i);
    if (aptMatch) {
      area = `apartment ${aptMatch[1]}`;
      areaConfidence = 85;
    }
  }

  // Detect landmarks
  const landmarks = [];
  if (lowerTranscript.includes('elevator')) {
    landmarks.push({ name: 'Elevator', type: 'exit', location: 'main hallway' });
  }
  if (lowerTranscript.includes('stairwell') || lowerTranscript.includes('stairs')) {
    landmarks.push({ name: 'Main Stairwell', type: 'exit', location: `floor ${floor}` });
  }
  if (lowerTranscript.includes('exit')) {
    landmarks.push({ name: 'Emergency Exit', type: 'exit', location: `floor ${floor}` });
  }

  // Detect hazards
  const hazards = [];
  let urgency: UrgencyLevel = 'medium';

  if (lowerTranscript.includes('smoke') || lowerTranscript.includes('thick smoke') || lowerTranscript.includes('can\'t see')) {
    hazards.push({
      type: 'Dense smoke',
      location: area,
      severity: 'high' as Severity,
      confidence: 90,
    });
    urgency = 'critical';
  }

  if (lowerTranscript.includes('trapped') || lowerTranscript.includes('can\'t get out')) {
    hazards.push({
      type: 'Blocked evacuation route',
      location: 'exit path',
      severity: 'high' as Severity,
      confidence: 85,
    });
    urgency = 'critical';
  }

  if (lowerTranscript.includes('flames') || lowerTranscript.includes('fire') || lowerTranscript.includes('burning')) {
    hazards.push({
      type: 'Active fire',
      location: area,
      severity: 'high' as Severity,
      confidence: 95,
    });
    if (urgency !== 'critical') urgency = 'high';
  }

  if (lowerTranscript.includes('spreading')) {
    hazards.push({
      type: 'Rapidly spreading fire',
      location: area,
      severity: 'high' as Severity,
      confidence: 80,
    });
    urgency = 'critical';
  }

  if (lowerTranscript.includes('chemical') || lowerTranscript.includes('gas') || lowerTranscript.includes('electrical')) {
    hazards.push({
      type: 'Hazardous materials',
      location: area,
      severity: 'high' as Severity,
      confidence: 75,
    });
  }

  // Default hazard if none detected
  if (hazards.length === 0) {
    hazards.push({
      type: 'Fire reported',
      location: area,
      severity: 'medium' as Severity,
      confidence: 70,
    });
  }

  return {
    environmentType,
    environmentConfidence,
    fireOrigin: {
      floor,
      area,
      confidence: areaConfidence,
    },
    landmarks,
    hazards,
    urgency,
    inferred: true,
  };
}
