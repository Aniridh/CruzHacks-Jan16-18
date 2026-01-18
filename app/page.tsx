'use client';

import { useState } from 'react';
import DemoMode from '@/components/DemoMode';
import SituationReport from '@/components/SituationReport';
import { DemoScenario } from '@/data/demoScenarios';
import { SituationAnalysis } from '@/types';

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [analysis, setAnalysis] = useState<SituationAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScenarioSelect = async (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    setTranscript(scenario.transcript.text);
    setAnalysis(null);
    setError(null);
    setIsLoading(true);

    try {
      // Call the analyze API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: scenario.transcript.text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze transcript');
      }

      const analysisData: SituationAnalysis = await response.json();
      setAnalysis(analysisData);
    } catch (err) {
      console.error('Error analyzing transcript:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">IGNIS</h1>
            <p className="text-red-100 text-lg">
              Emergency Insight System — Transforming emergency calls into clear spatial insight
            </p>
          </div>
          <a
            href="/landing"
            className="hidden md:block px-4 py-2 bg-red-800 hover:bg-red-900 rounded border border-red-600 text-sm font-medium transition-colors"
          >
            Landing Page
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Mode */}
        <DemoMode onScenarioSelect={handleScenarioSelect} isLoading={isLoading} />

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg shadow-md">
            <h3 className="font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Situation Report */}
        {selectedScenario && (
          <SituationReport transcript={transcript} analysis={analysis} isLoading={isLoading} />
        )}

        {/* Welcome Message */}
        {!selectedScenario && !isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-block p-8 bg-white rounded-lg border-2 border-gray-300 shadow-lg max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to IGNIS
              </h2>
              <p className="text-gray-600 mb-4">
                Select a demo scenario above to see how IGNIS transforms emergency calls into structured spatial insights.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> IGNIS analyzes emergency call transcripts using AI to extract
                  critical details, then visualizes the situation with fire zones, safe paths, and strike nodes
                  to help first responders make faster, safer decisions.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-gray-800 text-gray-300 text-center text-sm">
        <p>IGNIS — Decision-support prototype for emergency response training</p>
        <p className="mt-2 text-gray-500">Not a real 911 system — Training and simulation prototype</p>
      </footer>
    </div>
  );
}
