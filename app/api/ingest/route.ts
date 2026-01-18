// Manual transcript ingestion endpoint
// For testing without Vapi
// NO DATABASE - returns analysis directly

import { NextRequest, NextResponse } from 'next/server';
import { runAnalysis } from '@/utils/runAnalysis';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Invalid transcript', details: 'Transcript must be a non-empty string' },
        { status: 400 }
      );
    }

    console.log('Manual ingest - analyzing transcript:', transcript.substring(0, 100) + '...');

    // Run analysis pipeline
    const analysis = await runAnalysis(transcript);

    console.log('Analysis complete:', {
      environmentType: analysis.environmentType,
      urgency: analysis.urgency,
      spreadProbability: analysis.spreadProbability,
    });

    return NextResponse.json({
      success: true,
      analysis,
      source: 'manual_ingest',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in ingest API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET for testing
export async function GET() {
  return NextResponse.json({
    service: 'IGNIS Manual Ingest',
    status: 'ready',
    usage: 'POST { "transcript": "your transcript here" }',
    timestamp: new Date().toISOString(),
  });
}
