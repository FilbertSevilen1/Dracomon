'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  ScrollText,
  ArrowLeft,
  Calendar,
  Layers,
  Gamepad2,
  Shield,
  Zap,
} from 'lucide-react';
import { soundService } from '../../services/sound';
import { Footer } from '../../components/Footer';
import versionsData from '../../data/versions.json';

interface VersionLog {
  version: string;
  date: string;
  tag: string;
  badgeColor: string;
  summary: string;
  highlights: string[];
}

const VERSION_LOGS: VersionLog[] = versionsData as VersionLog[];

export default function VersionPage() {
  const [openVersion, setOpenVersion] = useState<string | null>(() => VERSION_LOGS[0]?.version || null);

  const toggleVersion = (version: string) => {
    soundService.playClick();
    setOpenVersion(prev => (prev === version ? null : version));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-display flex flex-col justify-between relative overflow-hidden select-none">

      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-amber-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-10 space-y-8 z-10">

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 text-center md:text-left border-b border-stone-800 pb-8"
        >
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white font-display">
            Patch Notes <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">& Updates</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-400 max-w-2xl leading-relaxed font-mono">
            Detailed logs for every major expansion, hero release, and system update in Dracoman RPG.
            Click any version panel below to expand its full changelog.
          </p>
        </motion.div>

        <div className="space-y-4">
          {VERSION_LOGS.map((log, index) => {
            const isOpen = openVersion === log.version;

            return (
              <motion.div
                key={log.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-stone-900/90 border-amber-400/80 ring-2 ring-amber-500/30 shadow-2xl shadow-amber-950/20 backdrop-blur-md'
                    : 'bg-stone-900/50 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900/80'
                }`}
              >
                <button
                  onClick={() => toggleVersion(log.version)}
                  className={`w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors ${
                    isOpen ? 'bg-amber-500/10' : 'bg-transparent'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl font-black text-stone-100 font-mono">v{log.version}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold shadow-sm ${log.badgeColor}`}>
                      {log.tag}
                    </span>
                    <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {log.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOpen ? (
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        <ChevronUp className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-stone-800 text-stone-400 border border-stone-700">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="border-t border-stone-800/80 bg-stone-950/60 px-6 py-6"
                    >
                      <div className="mb-5 p-4 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs text-amber-300/90 italic font-mono shadow-inner">
                        "{log.summary}"
                      </div>

                      <ul className="space-y-3">
                        {log.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs text-stone-200 leading-relaxed font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
