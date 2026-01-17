'use client';

import { useState } from 'react';
import { DecisionReasoning, VisualizationData } from '@/types';

interface ReasoningLogProps {
  visualizationData: VisualizationData | null;
  reasoning: DecisionReasoning | null;
}

export default function ReasoningLog({ visualizationData, reasoning }: ReasoningLogProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['risk', 'paths', 'strike', 'uncertainty']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (!visualizationData || !reasoning) {
    return (
      <div className="w-full bg-white rounded-lg border-2 border-gray-300 shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Decision Reasoning Log</h2>
        <p className="text-gray-500">Select a demo scenario to view reasoning explanations</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border-2 border-gray-300 shadow-lg p-4 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Decision Reasoning Log</h2>
      <p className="text-sm text-gray-600 mb-4">
        Transparent explanations for all AI-driven decisions and recommendations
      </p>

      <div className="space-y-4">
        {/* Risk Zone Reasoning */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('risk')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
          >
            <h3 className="font-semibold text-gray-800">Risk Zone Analysis</h3>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                expandedSections.has('risk') ? 'transform rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.has('risk') && (
            <div className="p-4 space-y-3">
              {reasoning.riskZoneReasoning.map((item) => (
                <div key={item.zoneId} className="border-l-4 border-red-500 pl-3 py-2 bg-red-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Zone: {item.zoneId}</span>
                    <span className="text-sm text-gray-600">Confidence: {item.confidence}%</span>
                  </div>
                  <p className="text-sm text-gray-700">{item.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Path Reasoning */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('paths')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
          >
            <h3 className="font-semibold text-gray-800">Safe Path Recommendations</h3>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                expandedSections.has('paths') ? 'transform rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.has('paths') && (
            <div className="p-4 space-y-3">
              {reasoning.pathReasoning.map((item) => (
                <div
                  key={item.pathId}
                  className={`border-l-4 pl-3 py-2 ${
                    item.recommended
                      ? 'border-green-500 bg-green-50'
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Path: {item.pathId}</span>
                    <span
                      className={`text-sm font-medium ${
                        item.recommended ? 'text-green-700' : 'text-yellow-700'
                      }`}
                    >
                      {item.recommended ? '✓ Recommended' : '⚠ Alternative'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{item.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strike Node Reasoning */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('strike')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
          >
            <h3 className="font-semibold text-gray-800">Strike Node Priorities</h3>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                expandedSections.has('strike') ? 'transform rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.has('strike') && (
            <div className="p-4 space-y-3">
              {reasoning.strikeNodeReasoning
                .sort((a, b) => a.priority - b.priority)
                .map((item) => (
                  <div key={item.nodeId} className="border-l-4 border-orange-500 pl-3 py-2 bg-orange-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">Node: {item.nodeId}</span>
                      <span className="text-sm text-orange-700 font-medium">Priority: {item.priority}</span>
                    </div>
                    <p className="text-sm text-gray-700">{item.explanation}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Uncertainty Markers */}
        {reasoning.uncertaintyMarkers.length > 0 && (
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('uncertainty')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
            >
              <h3 className="font-semibold text-gray-800">Uncertainty & Inferences</h3>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSections.has('uncertainty') ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.has('uncertainty') && (
              <div className="p-4 space-y-3">
                {reasoning.uncertaintyMarkers.map((marker, index) => (
                  <div key={index} className="border-l-4 border-yellow-500 pl-3 py-2 bg-yellow-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{marker.field}</span>
                      <span className="text-sm text-gray-600">Confidence: {marker.confidence}%</span>
                    </div>
                    <p className="text-sm text-gray-700">{marker.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
