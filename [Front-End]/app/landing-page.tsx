'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TacticalGrid } from '@/components/landing/TacticalGrid';
import { WireframeBuilding } from '@/components/landing/WireframeBuilding';
import { TargetingReticle } from '@/components/landing/TargetingReticle';
import { TacticalButton } from '@/components/landing/TacticalButton';
import { Shield, Radio, Crosshair } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative w-full h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Background Layers */}
      <TacticalGrid />
      <WireframeBuilding />
      <TargetingReticle />

      {/* Content Container */}
      <div className="relative z-20 w-full h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Tactical Label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-orange-500 font-mono text-xs tracking-[0.3em] uppercase mb-4"
          >
            <span className="w-2 h-2 bg-orange-500 animate-pulse" />
            System Online
            <span className="w-2 h-2 bg-orange-500 animate-pulse" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase"
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              IGNIS
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600 mt-2">
              Emergency Insight System
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto text-lg text-slate-400 font-light leading-relaxed border-l-2 border-orange-500/30 pl-6 text-left md:text-center md:border-l-0 md:pl-0"
          >
            AI-powered decision-support system transforming emergency calls into
            structured spatial insights for first responders. Real-time analysis,
            visualization, and strategic coordination when every second matters.
          </motion.p>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto py-8"
          >
            <div className="bg-slate-900/40 border border-slate-800 p-4 backdrop-blur-sm flex flex-col items-center gap-2 group hover:border-orange-500/50 transition-colors">
              <Shield className="w-6 h-6 text-orange-500 mb-1" />
              <h3 className="font-mono text-sm text-slate-300 uppercase">
                AI Analysis
              </h3>
              <p className="text-xs text-slate-500 text-center">
                GPT-4 powered situational awareness extraction
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 backdrop-blur-sm flex flex-col items-center gap-2 group hover:border-orange-500/50 transition-colors">
              <Radio className="w-6 h-6 text-orange-500 mb-1" />
              <h3 className="font-mono text-sm text-slate-300 uppercase">
                Spatial Mapping
              </h3>
              <p className="text-xs text-slate-500 text-center">
                Real-time fire zone and safe path visualization
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 backdrop-blur-sm flex flex-col items-center gap-2 group hover:border-orange-500/50 transition-colors">
              <Crosshair className="w-6 h-6 text-orange-500 mb-1" />
              <h3 className="font-mono text-sm text-slate-300 uppercase">
                Decision Support
              </h3>
              <p className="text-xs text-slate-500 text-center">
                Transparent reasoning with confidence scores
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <TacticalButton
              variant="primary"
              onClick={() => router.push('/')}
            >
              Launch Dashboard
            </TacticalButton>
            <TacticalButton
              variant="secondary"
              onClick={() => window.open('https://github.com/Aniridh/CruzHacks-Jan16-18', '_blank')}
            >
              View on GitHub
            </TacticalButton>
          </motion.div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between px-6 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500">
          <span className="text-orange-500">● LIVE SYSTEM</span>
          <span>CRUZHACKS 2026 - JUSTICE TRACK</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500">
          <span>V.1.0.0</span>
          <span className="hidden sm:inline">TRAINING PROTOTYPE</span>
        </div>
      </div>
    </main>
  );
}
