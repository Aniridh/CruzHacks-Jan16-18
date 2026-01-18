import mongoose, { Schema, Document, Model } from 'mongoose';
import { SituationAnalysis, VisualizationData } from '@/types';

export type IncidentStatus = 'received' | 'transcribed' | 'analyzed' | 'failed';

export interface IIncident extends Document {
  createdAt: Date;
  updatedAt: Date;
  callId: string;
  callerPhone?: string;
  transcriptText: string;
  analysis?: SituationAnalysis;
  layoutId?: string;
  visualizationData?: VisualizationData;
  status: IncidentStatus;
  error?: {
    code?: string;
    message?: string;
    raw?: unknown;
  };
}

const IncidentSchema = new Schema<IIncident>(
  {
    callId: {
      type: String,
      required: true,
      index: true,
    },
    callerPhone: {
      type: String,
      required: false,
    },
    transcriptText: {
      type: String,
      required: true,
      default: '',
    },
    analysis: {
      type: Schema.Types.Mixed,
      required: false,
    },
    layoutId: {
      type: String,
      required: false,
    },
    visualizationData: {
      type: Schema.Types.Mixed,
      required: false,
    },
    status: {
      type: String,
      enum: ['received', 'transcribed', 'analyzed', 'failed'],
      default: 'received',
      index: true,
    },
    error: {
      code: String,
      message: String,
      raw: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
let IncidentModel: Model<IIncident>;

try {
  IncidentModel = mongoose.model<IIncident>('Incident');
} catch {
  IncidentModel = mongoose.model<IIncident>('Incident', IncidentSchema);
}

export default IncidentModel;
