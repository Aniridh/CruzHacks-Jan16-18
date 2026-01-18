// Vapi AI webhook endpoint
// Receives transcripts from Vapi calls
// NO DATABASE - returns analysis directly

import { NextRequest, NextResponse } from 'next/server';
import { runAnalysis } from '@/utils/runAnalysis';

export async function POST(request: NextRequest) {
  try {
    // Validate webhook secret
    const secret = request.headers.get('x-vapi-secret');
    const expectedSecret = process.env.VAPI_WEBHOOK_SECRET;
    
    if (expectedSecret && secret !== expectedSecret) {
      console.warn('Invalid Vapi webhook secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse payload
    const payload = await request.json();
    console.log('Vapi webhook received:', payload.type || 'unknown event');

    // Extract key fields
    const { type, call, transcript, message } = payload;

    // Handle different event types
    if (type === 'end-of-call-report' || type === 'transcript') {
      // Extract transcript from various possible locations
      const transcriptText = 
        transcript?.text ||
        message?.transcript ||
        call?.transcript ||
        payload.transcriptText ||
        '';

      if (transcriptText && transcriptText.trim()) {
        console.log('Processing transcript:', transcriptText.substring(0, 100) + '...');
        
        // Run analysis pipeline
        const analysis = await runAnalysis(transcriptText);
        
        console.log('Analysis complete:', {
          environmentType: analysis.environmentType,
          urgency: analysis.urgency,
          spreadProbability: analysis.spreadProbability,
        });

        // Return structured analysis
        return NextResponse.json({
          success: true,
          analysis,
          callId: call?.id || payload.callId || 'unknown',
        });
      } else {
        console.log('No transcript in payload');
      }
    }

    // For partial events or events without transcript, acknowledge receipt
    return NextResponse.json({
      success: true,
      message: 'Event received',
    });

  } catch (error) {
    // NEVER throw - always return JSON
    console.error('Webhook error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also handle GET for webhook verification
export async function GET() {
  return NextResponse.json({
    service: 'IGNIS Vapi Webhook',
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
}
