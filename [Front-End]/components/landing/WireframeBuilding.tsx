'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function WireframeBuilding() {
  return (
    <div className="absolute inset-0 z-0 flex items-end justify-center opacity-40 pointer-events-none">
      <svg
        viewBox="0 0 1200 600"
        className="w-full h-full max-w-7xl"
        preserveAspectRatio="xMidYBottom"
      >
        <defs>
          <linearGradient id="wireframe-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Building 1 - Left */}
        <motion.g
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <path
            d="M100,600 L100,300 L250,250 L250,600"
            fill="url(#wireframe-fade)"
            stroke="#0ea5e9"
            strokeWidth="1"
            className="opacity-50"
          />
          <rect x="98" y="298" width="4" height="4" fill="#ef4444" />
          <rect x="248" y="248" width="4" height="4" fill="#ef4444" />
          <line x1="100" y1="350" x2="250" y2="300" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="100" y1="400" x2="250" y2="350" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="100" y1="450" x2="250" y2="400" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="4 4" />
        </motion.g>

        {/* Building 2 - Center Left */}
        <motion.g
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <path
            d="M300,600 L300,200 L450,150 L450,600"
            fill="url(#wireframe-fade)"
            stroke="#0ea5e9"
            strokeWidth="1"
            className="opacity-70"
          />
          <rect x="298" y="198" width="4" height="4" fill="#ef4444" />
          <rect x="448" y="148" width="4" height="4" fill="#ef4444" />
          <line x1="300" y1="250" x2="450" y2="200" stroke="#0ea5e9" strokeWidth="0.5" />
          <line x1="300" y1="300" x2="450" y2="250" stroke="#0ea5e9" strokeWidth="0.5" />
          <line x1="300" y1="350" x2="450" y2="300" stroke="#0ea5e9" strokeWidth="0.5" />
        </motion.g>

        {/* Building 3 - Center (Tallest) */}
        <motion.g
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <path
            d="M500,600 L500,100 L600,50 L700,100 L700,600"
            fill="url(#wireframe-fade)"
            stroke="#0ea5e9"
            strokeWidth="1.5"
          />
          <rect x="498" y="98" width="4" height="4" fill="#ef4444" />
          <rect x="598" y="48" width="4" height="4" fill="#ef4444" />
          <rect x="698" y="98" width="4" height="4" fill="#ef4444" />
          <line x1="600" y1="50" x2="600" y2="600" stroke="#0ea5e9" strokeWidth="0.5" />
          <line x1="550" y1="75" x2="550" y2="600" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="650" y1="75" x2="650" y2="600" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="4 4" />
        </motion.g>

        {/* Building 4 - Right */}
        <motion.g
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <path
            d="M750,600 L750,250 L950,200 L950,600"
            fill="url(#wireframe-fade)"
            stroke="#0ea5e9"
            strokeWidth="1"
            className="opacity-60"
          />
          <rect x="748" y="248" width="4" height="4" fill="#ef4444" />
          <rect x="948" y="198" width="4" height="4" fill="#ef4444" />
          <line x1="750" y1="300" x2="950" y2="250" stroke="#0ea5e9" strokeWidth="0.5" />
          <line x1="750" y1="350" x2="950" y2="300" stroke="#0ea5e9" strokeWidth="0.5" />
        </motion.g>
      </svg>
    </div>
  );
}
