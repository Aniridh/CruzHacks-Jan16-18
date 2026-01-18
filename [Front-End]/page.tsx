'use client';

import { useState } from 'react';
import DemoMode from '@/components/DemoMode';
import VoiceRecorder from '@/components/VoiceRecorder';
import SituationReport from '@/components/SituationReport';
import { DemoScenario } from '@/data/demoScenarios';
import { SituationAnalysis } from '@/types';

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [analysis, setAnalysis] = useState<SituationAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'demo' | 'voice'>('voice'); // Default to voice mode

  const analyzeTranscript = async (transcriptText: string) => {
    setTranscript(transcriptText);
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
          transcript: transcriptText,
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

  const handleScenarioSelect = async (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    await analyzeTranscript(scenario.transcript.text);
  };

  const handleVoiceTranscript = async (transcriptText: string) => {
    setSelectedScenario(null);
    await analyzeTranscript(transcriptText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white shadow-2xl border-b-2 border-orange-500/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <h1 className="text-4xl font-bold tracking-tight">IGNIS</h1>
              </div>
              <p className="text-orange-100 text-lg font-light">
                Emergency Insight System — Transforming emergency calls into clear spatial insight
              </p>
            </div>
            <a
              href="/landing"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-900/50 hover:bg-slate-900 backdrop-blur-sm rounded border border-orange-500/50 hover:border-orange-400 text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Landing Page
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mode Toggle */}
        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setInputMode('voice')}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              inputMode === 'voice'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                : 'bg-slate-800/50 text-gray-400 hover:text-gray-200 border border-slate-700'
            }`}
          >
            🎤 Live Voice Input
          </button>
          <button
            onClick={() => setInputMode('demo')}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              inputMode === 'demo'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                : 'bg-slate-800/50 text-gray-400 hover:text-gray-200 border border-slate-700'
            }`}
          >
            📋 Demo Scenarios
          </button>
        </div>

        {/* Voice Recorder */}
        {inputMode === 'voice' && (
          <div className="mb-8 relative">
            <VoiceRecorder onTranscriptComplete={handleVoiceTranscript} />
          </div>
        )}

        {/* Demo Mode */}
        {inputMode === 'demo' && (
          <DemoMode onScenarioSelect={handleScenarioSelect} isLoading={isLoading} />
        )}

        {/* Error Display */}
        {error && (
          <div className="relative mb-6 p-6 bg-gradient-to-br from-red-900/50 to-red-950/50 border-2 border-red-500/50 rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500" />
            
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <h3 className="font-bold text-red-400 font-mono uppercase tracking-wider text-sm">System Error</h3>
            </div>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Situation Report */}
        {transcript && (
          <SituationReport transcript={transcript} analysis={analysis} isLoading={isLoading} />
        )}

        {/* Welcome Message */}
        {!transcript && !isLoading && (
          <div className="mt-12 text-center">
            <div className="relative inline-block p-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 border-orange-500/30 shadow-2xl max-w-2xl backdrop-blur-sm">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-500 font-mono text-xs tracking-widest uppercase">System Ready</span>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">IGNIS</span>
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {inputMode === 'voice' 
                  ? 'Click "Start Voice Call" above to begin recording an emergency call simulation.'
                  : 'Select a demo scenario above to see how IGNIS transforms emergency calls into structured spatial insights.'
                }
              </p>
              <div className="mt-6 p-6 bg-slate-950/50 rounded-lg border border-orange-500/20 backdrop-blur-sm">
                <p className="text-sm text-slate-400 leading-relaxed">
                  <strong className="text-orange-400">How it works:</strong> IGNIS analyzes emergency call transcripts using AI to extract
                  critical details, then visualizes the situation with fire zones, safe paths, and strike nodes
                  to help first responders make faster, safer decisions.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 bg-slate-950/80 border-t border-slate-800 text-slate-400 text-center text-sm backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4 font-mono text-xs mb-2">
          <span className="text-orange-500">● LIVE SYSTEM</span>
          <span>CRUZHACKS 2026 - JUSTICE TRACK</span>
        </div>
        <p className="text-slate-500 mt-2">Decision-support prototype for emergency response training</p>
        <p className="text-slate-600 mt-1 text-xs">Not a real 911 system — Training and simulation prototype</p>
      </footer>
    </div>
  );
}
