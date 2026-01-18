import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongo';
import IncidentModel from '@/models/Incident';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Connect to MongoDB (will return null if not configured)
    const db = await connectDB();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const incident = await IncidentModel.findById(id).lean();

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(incident);
  } catch (error) {
    console.error('Error fetching incident:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch incident',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
