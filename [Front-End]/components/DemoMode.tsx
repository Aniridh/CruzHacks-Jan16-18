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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-lg mb-4">
        <h2 className="text-2xl font-bold mb-2">Demo Mode</h2>
        <p className="text-blue-100">Select a pre-loaded emergency scenario to demonstrate IGNIS</p>
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
                text-left p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
                }
                ${isLoading && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{scenario.name}</h3>
                <span
                  className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${scenario.environmentType === 'apartment' && 'bg-purple-100 text-purple-700'}
                    ${scenario.environmentType === 'office' && 'bg-blue-100 text-blue-700'}
                    ${scenario.environmentType === 'school' && 'bg-green-100 text-green-700'}
                    ${scenario.environmentType === 'forest' && 'bg-yellow-100 text-yellow-700'}
                  `}
                >
                  {scenario.environmentType}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
              {isProcessing && (
                <div className="flex items-center text-blue-600 mt-2">
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
                  <span className="text-sm">Analyzing...</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
