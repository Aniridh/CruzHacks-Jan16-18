import { NextRequest, NextResponse } from 'next/server';
import { runAnalysis } from '@/utils/runAnalysis';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Invalid transcript' },
        { status: 400 }
      );
    }

    const analysis = await runAnalysis(transcript);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
