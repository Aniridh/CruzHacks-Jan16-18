'use client';

import { useState } from 'react';

interface FireSpreadControlsProps {
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  intensity: number;
  onIntensityChange: (intensity: number) => void;
}

export default function FireSpreadControls({
  isRunning,
  onToggleRunning,
  onReset,
  speed,
  onSpeedChange,
  intensity,
  onIntensityChange,
}: FireSpreadControlsProps) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-700">Fire Spread Simulation</h3>
        <div className="flex gap-2">
          <button
            onClick={onToggleRunning}
            className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 rounded font-medium text-sm bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Speed Control */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-700">Speed</label>
            <span className="text-xs text-gray-600">{speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.25x</span>
            <span>1x</span>
            <span>3x</span>
          </div>
        </div>

        {/* Intensity Control */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-700">Intensity</label>
            <span className="text-xs text-gray-600">{Math.round(intensity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.1"
            value={intensity}
            onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          The simulation shows probabilistic fire spread based on room layout, corridors, and risk zones.
        </p>
      </div>
    </div>
  );
}
