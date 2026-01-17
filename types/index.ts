// Core data models for IGNIS

export type EnvironmentType = 'apartment' | 'office' | 'school' | 'forest' | 'warehouse';

export type UrgencyLevel = 'critical' | 'high' | 'medium';

export type Severity = 'high' | 'medium' | 'low';

export interface Transcript {
  text: string;
  timestamp?: Date;
}

export interface FireOrigin {
  floor: number;
  area: string;
  coordinates?: { x: number; y: number };
  confidence: number; // 0-100
}

export interface Landmark {
  name: string;
  type: string;
  location: string;
}

export interface Hazard {
  type: string;
  location: string;
  severity: Severity;
  confidence: number; // 0-100
}

export interface SituationAnalysis {
  environmentType: EnvironmentType;
  environmentConfidence: number; // 0-100
  fireOrigin: FireOrigin;
  landmarks: Landmark[];
  hazards: Hazard[];
  urgency: UrgencyLevel;
  inferred: boolean; // indicates if data was inferred vs. explicitly stated
}

export interface Room {
  id: string;
  name: string;
  type: string;
  coordinates: { x: number; y: number; width: number; height: number };
}

export interface Exit {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
  type: 'door' | 'stairwell' | 'elevator' | 'window';
}

export interface LayoutTemplate {
  id: string;
  environmentType: EnvironmentType;
  name: string;
  floors: number;
  rooms: Room[];
  exits: Exit[];
  coordinateSystem: { width: number; height: number }; // normalized coordinates
}

export interface RiskZone {
  id: string;
  coordinates: { x: number; y: number; width: number; height: number };
  severity: Severity;
  confidence: number;
}

export interface SafePath {
  id: string;
  points: { x: number; y: number }[];
  priority: number; // lower number = higher priority
  description: string;
}

export interface StrikeNode {
  id: string;
  coordinates: { x: number; y: number };
  type: string;
  priority: number;
  description: string;
}

export interface VisualizationData {
  layout: LayoutTemplate;
  fireOrigin: FireOrigin;
  riskZones: RiskZone[];
  safePaths: SafePath[];
  strikeNodes: StrikeNode[];
}

export interface DecisionReasoning {
  riskZoneReasoning: { zoneId: string; explanation: string; confidence: number }[];
  pathReasoning: { pathId: string; explanation: string; recommended: boolean }[];
  strikeNodeReasoning: { nodeId: string; explanation: string; priority: number }[];
  uncertaintyMarkers: { field: string; explanation: string; confidence: number }[];
}
