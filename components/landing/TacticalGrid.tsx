'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function TacticalGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(2, 132, 199, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(2, 132, 199, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Large Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(2, 132, 199, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(2, 132, 199, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)]" />

      {/* Scanline Animation */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
        animate={{ top: ['0%', '100%'] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Scanline Gradient Trail */}
      <motion.div
        className="absolute inset-x-0 h-[100px] bg-gradient-to-b from-cyan-500/0 to-cyan-500/5"
        animate={{ top: ['-100px', 'calc(100% - 100px)'] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
