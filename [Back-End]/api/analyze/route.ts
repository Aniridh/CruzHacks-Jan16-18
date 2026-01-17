import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SituationAnalysis } from '@/types';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Use GPT-4 with structured output to extract insights
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an emergency situation analyst. Extract structured insights from emergency call transcripts related to fire emergencies.

Analyze the transcript and extract:
1. Environment type (apartment, office, school, forest, warehouse)
2. Fire origin location (floor, area description, approximate coordinates if possible)
3. Mentioned landmarks (stairs, hallways, rooms, exits)
4. Hazards (smoke, blocked exits, heat, etc.)
5. Urgency level (critical, high, medium)

For each extracted piece of information:
- Provide confidence scores (0-100) indicating how certain you are
- Mark inferred=true if you're making educated guesses based on context
- For coordinates, estimate based on common building layouts if not explicitly stated

Respond ONLY with valid JSON matching this structure:
{
  "environmentType": "apartment" | "office" | "school" | "forest" | "warehouse",
  "environmentConfidence": 0-100,
  "fireOrigin": {
    "floor": number,
    "area": "string description",
    "coordinates": { "x": number, "y": number } (optional),
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
        {
          role: 'user',
          content: `Analyze this emergency call transcript and extract structured insights:\n\n${transcript}`,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent extraction
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    let analysis: SituationAnalysis;
    try {
      analysis = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON response from AI' },
        { status: 500 }
      );
    }

    // Validate and ensure all required fields are present
    if (!analysis.environmentType || !analysis.fireOrigin || !analysis.hazards) {
      return NextResponse.json(
        { error: 'Incomplete analysis from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
