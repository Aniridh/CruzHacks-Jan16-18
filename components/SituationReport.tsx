'use client';

import { useState, useEffect } from 'react';
import { SituationAnalysis, VisualizationData, DecisionReasoning } from '@/types';
import { loadLayoutTemplate } from '@/utils/layoutSelector';
import { calculateRiskZones, calculateSafePaths, identifyStrikeNodes } from '@/utils/visualizationLogic';
import { generateDecisionReasoning } from '@/utils/reasoningGenerator';
import SituationVisualizer from './SituationVisualizer';
import ReasoningLog from './ReasoningLog';

interface SituationReportProps {
  transcript: string;
  analysis: SituationAnalysis | null;
  isLoading: boolean;
}

export default function SituationReport({ transcript, analysis, isLoading }: SituationReportProps) {
  const [visualizationData, setVisualizationData] = useState<VisualizationData | null>(null);
  const [reasoning, setReasoning] = useState<DecisionReasoning | null>(null);
  const [showTranscript, setShowTranscript] = useState(true);

  // Generate visualization when analysis is available
  useEffect(() => {
    async function generateVisualization() {
      if (!analysis) {
        setVisualizationData(null);
        setReasoning(null);
        return;
      }

      try {
        // Load layout template
        const layout = await loadLayoutTemplate(analysis.environmentType);
        if (!layout) {
          console.error('Failed to load layout template');
          return;
        }

        // Calculate risk zones
        const riskZones = calculateRiskZones(layout, analysis.fireOrigin);

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9bc112d7-a119-445f-a014-5e4f2664b6d3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/SituationReport.tsx:40',message:'Before safe path calculation',data:{hasFireOrigin:!!analysis.fireOrigin,hasFireOriginArea:!!analysis.fireOrigin?.area,fireOriginArea:analysis.fireOrigin?.area,fireOriginAreaType:typeof analysis.fireOrigin?.area},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        // Calculate safe paths (starting from a room if specified)
        // Guard against missing area field (matches pattern in SituationVisualizer.tsx)
        const startRoomId = analysis.fireOrigin.area
          ? layout.rooms.find((r) =>
              r.name.toLowerCase().includes(analysis.fireOrigin.area.toLowerCase())
            )?.id
          : undefined;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9bc112d7-a119-445f-a014-5e4f2664b6d3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/SituationReport.tsx:48',message:'After safe path calculation',data:{startRoomId:startRoomId,areaUsed:analysis.fireOrigin?.area,areaGuardPassed:!!analysis.fireOrigin?.area},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        const safePaths = calculateSafePaths(layout, analysis.fireOrigin, riskZones, startRoomId);

        // Identify strike nodes
        const strikeNodes = identifyStrikeNodes(layout, analysis.fireOrigin, riskZones);

        // Create visualization data
        const vizData: VisualizationData = {
          layout,
          fireOrigin: analysis.fireOrigin,
          riskZones,
          safePaths,
          strikeNodes,
        };

        setVisualizationData(vizData);

        // Generate reasoning
        const decisionReasoning = generateDecisionReasoning(vizData, analysis);
        setReasoning(decisionReasoning);
      } catch (error) {
        console.error('Error generating visualization:', error);
      }
    }

    generateVisualization();
  }, [analysis]);

  return (
    <div className="w-full space-y-6">
      {/* Transcript Display */}
      {transcript && (
        <div className="bg-white rounded-lg border-2 border-gray-300 shadow-lg p-4">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between mb-2"
          >
            <h2 className="text-xl font-bold text-gray-800">Emergency Call Transcript</h2>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                showTranscript ? 'transform rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTranscript && (
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{transcript}</p>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="w-full bg-white rounded-lg border-2 border-blue-300 shadow-lg p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Analyzing emergency situation...</p>
          <p className="text-sm text-gray-500 mt-2">Extracting insights from transcript</p>
        </div>
      )}

      {/* Confidence Summary */}
      {analysis && (
        <div className="bg-white rounded-lg border-2 border-blue-300 shadow-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Analysis Confidence Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <div className="text-sm text-blue-700 font-medium mb-1">Environment Type</div>
              <div className="flex items-center">
                <div className="w-full bg-blue-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${analysis.environmentConfidence}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-blue-900">{analysis.environmentConfidence}%</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded border border-orange-200">
              <div className="text-sm text-orange-700 font-medium mb-1">Fire Origin</div>
              <div className="flex items-center">
                <div className="w-full bg-orange-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all"
                    style={{ width: `${analysis.fireOrigin.confidence}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-orange-900">{analysis.fireOrigin.confidence}%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <div className="text-sm text-purple-700 font-medium mb-1">Urgency Level</div>
              <div className="text-lg font-bold text-purple-900 capitalize">{analysis.urgency}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="text-sm text-gray-700 font-medium mb-1">Hazards Detected</div>
              <div className="text-lg font-bold text-gray-900">{analysis.hazards.length}</div>
              {analysis.hazards.length > 0 ? (
                <div className="text-xs text-gray-600 mt-1">
                  Avg confidence: {Math.round(analysis.hazards.reduce((sum, h) => sum + h.confidence, 0) / analysis.hazards.length)}%
                </div>
              ) : (
                <div className="text-xs text-gray-500 mt-1">No hazards detected</div>
              )}
            </div>
          </div>
          {analysis.inferred && (
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Some information was inferred from context. Verify critical details before action.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Situation Visualization */}
      <SituationVisualizer visualizationData={visualizationData} />

      {/* Decision Reasoning Log */}
      <ReasoningLog visualizationData={visualizationData} reasoning={reasoning} />
    </div>
  );
}
