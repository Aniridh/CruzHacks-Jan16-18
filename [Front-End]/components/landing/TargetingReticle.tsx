'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function TargetingReticle() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-30">
        <motion.div
          className="w-full h-full border border-orange-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Ticks */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-orange-500" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-orange-500" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-orange-500" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-1 bg-orange-500" />
        </motion.div>

        {/* Inner Ring */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-orange-500/40 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Top Left Data Block */}
      <div className="absolute top-8 left-8 font-mono text-xs text-orange-500/80">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between w-32 border-b border-orange-500/30 pb-1 mb-1">
            <span>SYS.01</span>
            <span>ONLINE</span>
          </div>
          <div className="flex justify-between w-32">
            <span>LAT</span>
            <span>36.9741° N</span>
          </div>
          <div className="flex justify-between w-32">
            <span>LNG</span>
            <span>122.0308° W</span>
          </div>
          <div className="flex justify-between w-32">
            <span>ALT</span>
            <span>364 FT</span>
          </div>
        </div>
      </div>

      {/* Top Right Data Block */}
      <div className="absolute top-8 right-8 font-mono text-xs text-orange-500/80 text-right">
        <div className="flex flex-col gap-1 items-end">
          <div className="flex justify-between w-32 border-b border-orange-500/30 pb-1 mb-1">
            <span>TARGET</span>
            <span>LOCKED</span>
          </div>
          <div className="flex justify-between w-32">
            <span>DIST</span>
            <span>4.2 KM</span>
          </div>
          <div className="flex justify-between w-32">
            <span>WIND</span>
            <span>12 KTS</span>
          </div>
        </div>
      </div>

      {/* Bottom Left Status */}
      <div className="absolute bottom-8 left-8 flex items-end gap-4">
        <div className="w-1 h-16 bg-orange-500/20 relative overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-orange-500"
            animate={{
              height: ['20%', '60%', '40%', '80%', '30%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </div>
        <div className="w-1 h-12 bg-orange-500/20 relative overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-orange-500"
            animate={{
              height: ['50%', '30%', '70%', '40%', '60%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </div>
        <div className="font-mono text-xs text-orange-500/60">SIGNAL STRENGTH</div>
      </div>

      {/* Crosshairs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-orange-500/50" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-orange-500/50" />
      </div>
    </div>
  );
}
