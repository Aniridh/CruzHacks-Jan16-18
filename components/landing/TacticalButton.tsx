'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TacticalButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export function TacticalButton({
  children,
  variant = 'primary',
  onClick,
  className = '',
}: TacticalButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      className={`relative group px-8 py-4 font-mono text-sm tracking-widest uppercase outline-none ${className}`}
      onClick={onClick}
      whileHover="hover"
      initial="initial"
    >
      {/* Background & Border */}
      <div
        className={`absolute inset-0 border transition-colors duration-300 ${
          isPrimary
            ? 'border-orange-500/50 bg-orange-500/10 group-hover:bg-orange-500/20 group-hover:border-orange-500'
            : 'border-slate-600 bg-slate-800/50 group-hover:bg-slate-700/50 group-hover:border-slate-400'
        }`}
      />

      {/* Corner Brackets */}
      {/* Top Left */}
      <motion.div
        variants={{
          initial: { x: 0, y: 0 },
          hover: { x: -2, y: -2 },
        }}
        className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${
          isPrimary ? 'border-orange-500' : 'border-slate-400'
        }`}
      />
      {/* Top Right */}
      <motion.div
        variants={{
          initial: { x: 0, y: 0 },
          hover: { x: 2, y: -2 },
        }}
        className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${
          isPrimary ? 'border-orange-500' : 'border-slate-400'
        }`}
      />
      {/* Bottom Right */}
      <motion.div
        variants={{
          initial: { x: 0, y: 0 },
          hover: { x: 2, y: 2 },
        }}
        className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${
          isPrimary ? 'border-orange-500' : 'border-slate-400'
        }`}
      />
      {/* Bottom Left */}
      <motion.div
        variants={{
          initial: { x: 0, y: 0 },
          hover: { x: -2, y: 2 },
        }}
        className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${
          isPrimary ? 'border-orange-500' : 'border-slate-400'
        }`}
      />

      {/* Text Content */}
      <span
        className={`relative z-10 font-bold ${
          isPrimary ? 'text-orange-500' : 'text-slate-300'
        }`}
      >
        {children}
      </span>

      {/* Glitch/Scan effect on hover */}
      {isPrimary && (
        <motion.div
          className="absolute inset-0 bg-orange-500/10 z-0"
          variants={{
            initial: { scaleX: 0, opacity: 0 },
            hover: {
              scaleX: 1,
              opacity: 1,
              transition: { duration: 0.2 },
            },
          }}
          style={{ originX: 0 }}
        />
      )}
    </motion.button>
  );
}
