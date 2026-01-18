'use client';

import { useState } from 'react';
import { demoScenarios, DemoScenario } from '@/data/demoScenarios';

interface DemoModeProps {
  onScenarioSelect: (scenario: DemoScenario) => void;
  isLoading?: boolean;
}

export default function DemoMode({ onScenarioSelect, isLoading }: DemoModeProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  const handleScenarioClick = (scenario: DemoScenario) => {
    setSelectedScenarioId(scenario.id);
    onScenarioSelect(scenario);
  };

  return (
    <div className="w-full mb-8">
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 rounded-xl shadow-2xl mb-6 border border-blue-500/30 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
            <span className="text-blue-200 font-mono text-xs tracking-widest uppercase">Demo System</span>
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Demo Mode</h2>
          <p className="text-blue-100 font-light">Select a pre-loaded emergency scenario to demonstrate IGNIS capabilities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoScenarios.map((scenario) => {
          const isSelected = selectedScenarioId === scenario.id;
          const isProcessing = isLoading && isSelected;

          return (
            <button
              key={scenario.id}
              onClick={() => handleScenarioClick(scenario)}
              disabled={isLoading}
              className={`
                relative text-left p-6 rounded-xl border-2 transition-all duration-300 group
                ${isSelected
                  ? 'border-orange-500 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl shadow-orange-500/20 scale-105'
                  : 'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10'
                }
                ${isLoading && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500/50 group-hover:border-orange-500 transition-colors" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500/50 group-hover:border-orange-500 transition-colors" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500/50 group-hover:border-orange-500 transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500/50 group-hover:border-orange-500 transition-colors" />
              
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">{scenario.name}</h3>
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider
                    ${scenario.environmentType === 'apartment' && 'bg-purple-500/20 text-purple-300 border border-purple-500/50'}
                    ${scenario.environmentType === 'office' && 'bg-blue-500/20 text-blue-300 border border-blue-500/50'}
                    ${scenario.environmentType === 'school' && 'bg-green-500/20 text-green-300 border border-green-500/50'}
                    ${scenario.environmentType === 'forest' && 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'}
                  `}
                >
                  {scenario.environmentType}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-3 leading-relaxed">{scenario.description}</p>
              {isProcessing && (
                <div className="flex items-center text-orange-400 mt-3 pt-3 border-t border-slate-700">
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-sm font-mono">Analyzing emergency transcript...</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
