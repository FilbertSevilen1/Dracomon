'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Sparkles,
  Crown,
  Shield,
  Zap,
  Coins,
  Award,
  Layers,
} from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';
import { Navbar } from '../../components/Navbar';

export default function MembershipPage() {
  const { saveData, switchTier } = useGameState();

  const currentTier = saveData.tier || 'Free';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-display flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Lighting */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-purple-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-amber-100/50 rounded-full blur-3xl -z-10" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-10 space-y-8 z-10">
        {/* Page Title Banner */}
        <div className="text-center md:text-left border-b border-stone-200 pb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-bold">
            <Crown className="w-4 h-4 text-purple-600" />
            <span>PLAYER PROGRESSION TIERS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight">
            Membership <span className="text-purple-600">& Power Perks</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-2xl leading-relaxed">
            Choose your membership tier to instantly unlock dragon guardians, boost starting levels, and gain permanent stats bonuses!
          </p>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between ${
            currentTier === 'Free'
              ? 'bg-white border-stone-300 ring-2 ring-stone-400/30 shadow-lg'
              : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-400 uppercase">Standard Tier</span>
                {currentTier === 'Free' && (
                  <span className="text-[10px] font-mono font-black bg-stone-200 text-stone-800 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                )}
              </div>
              <h3 className="text-2xl font-black text-stone-900">Free Tier</h3>
              <div className="text-3xl font-black text-stone-800 font-mono">Standard Progression</div>
              <ul className="space-y-2.5 text-xs text-stone-600 pt-4 border-t border-stone-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Start with Jumpmon unlocked</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlock heroes with earned coins</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard Level 1 starting stats</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Complete campaign stages sequentially</li>
              </ul>
            </div>
            <button
              onClick={() => {
                soundService.playClick();
                switchTier('Free');
              }}
              className={`w-full py-3.5 mt-8 rounded-2xl font-extrabold text-xs transition-all ${
                currentTier === 'Free'
                  ? 'bg-stone-200 text-stone-600 cursor-default'
                  : 'bg-stone-900 text-white hover:bg-stone-800 shadow-md active:scale-95'
              }`}
            >
              {currentTier === 'Free' ? 'Current Active Tier' : 'Activate Free Tier'}
            </button>
          </div>

          {/* Basic Tier */}
          <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between ${
            currentTier === 'Basic'
              ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-400/30 shadow-lg'
              : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-emerald-600 uppercase">Recommended</span>
                {currentTier === 'Basic' && (
                  <span className="text-[10px] font-mono font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">ACTIVE</span>
                )}
              </div>
              <h3 className="text-2xl font-black text-stone-900">Basic Tier</h3>
              <div className="text-3xl font-black text-emerald-600 font-mono">Starter Boost</div>
              <ul className="space-y-2.5 text-xs text-stone-600 pt-4 border-t border-stone-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> All Heroes unlocked @ Level 5</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> +1 Bonus to ALL attributes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> All Campaign Stages unlocked</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Faster energy regeneration rate</li>
              </ul>
            </div>
            <button
              onClick={() => {
                soundService.playLevelUp();
                switchTier('Basic');
              }}
              className={`w-full py-3.5 mt-8 rounded-2xl font-extrabold text-xs transition-all ${
                currentTier === 'Basic'
                  ? 'bg-stone-200 text-stone-600 cursor-default'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md active:scale-95'
              }`}
            >
              {currentTier === 'Basic' ? 'Current Active Tier' : 'Activate Basic Tier'}
            </button>
          </div>

          {/* Premium Tier */}
          <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between ${
            currentTier === 'Premium'
              ? 'bg-purple-50/40 border-purple-300 ring-2 ring-purple-400/30 shadow-lg'
              : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-purple-600 uppercase">God Tier</span>
                {currentTier === 'Premium' && (
                  <span className="text-[10px] font-mono font-black bg-purple-600 text-white px-2.5 py-0.5 rounded-full">ACTIVE</span>
                )}
              </div>
              <h3 className="text-2xl font-black text-stone-900">Premium Tier</h3>
              <div className="text-3xl font-black text-purple-600 font-mono">Max Roster Boost</div>
              <ul className="space-y-2.5 text-xs text-stone-600 pt-4 border-t border-stone-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-500" /> All Heroes unlocked @ Level 10</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-500" /> Maximized +2 to ALL attributes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-500" /> Full Energy & Ultimate Perks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-500" /> Infinite Stage Access & God Mode perks</li>
              </ul>
            </div>
            <button
              onClick={() => {
                soundService.playLevelUp();
                switchTier('Premium');
              }}
              className={`w-full py-3.5 mt-8 rounded-2xl font-extrabold text-xs transition-all ${
                currentTier === 'Premium'
                  ? 'bg-stone-200 text-stone-600 cursor-default'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md active:scale-95'
              }`}
            >
              {currentTier === 'Premium' ? 'Current Active Tier' : 'Activate Premium Tier'}
            </button>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full border-t border-stone-200 bg-white py-6 px-6 md:px-12 text-center text-xs font-mono text-stone-500 z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Dracomon RPG • FilbertSevilen1</span>
          <Link
            href="/"
            onClick={() => soundService.playClick()}
            className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
          >
            <span>Launch Campaign Game</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
