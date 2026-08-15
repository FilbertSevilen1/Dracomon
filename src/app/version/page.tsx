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
    <div className="min-h-screen bg-stone-50 text-stone-900 font-display flex flex-col justify-between relative overflow-hidden select-none">

      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-rose-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-indigo-100/50 rounded-full blur-3xl -z-10" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-10 space-y-8 z-10">

        <div className="space-y-3 text-center md:text-left border-b border-stone-200 pb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-stone-900 font-display">
            Patch Notes <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">& Updates</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-2xl leading-relaxed">
            Detailed logs for every major expansion, hero release, and system update in Dracoman RPG.
            Click any version panel below to expand its full changelog.
          </p>
        </div>

        <div className="space-y-4">
          {VERSION_LOGS.map((log) => {
            const isOpen = openVersion === log.version;

            return (
              <div
                key={log.version}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-white border-amber-300 ring-2 ring-amber-400/20 shadow-xl'
                    : 'bg-white/90 border-stone-200/90 hover:border-stone-300 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleVersion(log.version)}
                  className={`w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors ${
                    isOpen ? 'bg-amber-500/5' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl font-black text-stone-900 font-mono">v{log.version}</span>
                    <span className={`text-xs px-3 py-1 rounded-full ${log.badgeColor}`}>
                      {log.tag}
                    </span>
                    <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {log.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOpen ? (
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
                        <ChevronUp className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-stone-100 text-stone-500 border border-stone-200">
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
                      className="border-t border-stone-100 bg-stone-50/70 px-6 py-6"
                    >
                      <div className="mb-5 p-3.5 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-600 italic font-mono shadow-sm">
                        "{log.summary}"
                      </div>

                      <ul className="space-y-3">
                        {log.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs text-stone-700 leading-relaxed font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
