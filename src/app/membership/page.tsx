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
  Lock,
} from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';
import { Footer } from '../../components/Footer';
import { ActivationModal } from '../../components/ActivationModal';

const TIER_RANKS: Record<string, number> = {
  Free: 0,
  Basic: 1,
  Premium: 2,
};

export default function MembershipPage() {
  const {
    saveData,
    switchTier,
    activationTier,
    setActivationTier,
    activationCodeInput,
    setActivationCodeInput,
    activationError,
    setActivationError,
    handleVerifyCode,
  } = useGameState();

  const currentTier = saveData.tier || 'Free';
  const currentRank = TIER_RANKS[currentTier] ?? 0;

  const isFreeActive = currentTier === 'Free';
  const isFreeLower = currentRank > 0;

  const isBasicActive = currentTier === 'Basic';
  const isBasicLower = currentRank > 1;

  const isPremiumActive = currentTier === 'Premium';

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
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white font-display uppercase">
            Membership <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">&amp; Power Perks</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-400 max-w-2xl leading-relaxed font-mono">
            Choose your membership tier to instantly unlock dragon guardians, boost starting levels, and gain permanent stats bonuses!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* FREE TIER CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`p-8 rounded-3xl border transition-all flex flex-col justify-between backdrop-blur-md ${
              isFreeActive
                ? 'bg-stone-900/90 border-stone-700 ring-2 ring-stone-600/40 shadow-2xl'
                : isFreeLower
                ? 'bg-stone-950/60 border-stone-900 opacity-60 shadow-none'
                : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 shadow-xl'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-400 uppercase">Standard Tier</span>
                {isFreeActive ? (
                  <span className="text-[10px] font-mono font-black bg-stone-800 text-stone-200 border border-stone-700 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                ) : isFreeLower ? (
                  <span className="text-[10px] font-mono font-bold bg-stone-950/80 text-stone-500 border border-stone-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> INCLUDED
                  </span>
                ) : null}
              </div>
              <h3 className="text-2xl font-black text-white font-display uppercase">Free Tier</h3>
              <div className="text-3xl font-black text-stone-300 font-mono">Standard Progression</div>
              <ul className="space-y-2.5 text-xs text-stone-300 pt-4 border-t border-stone-800/80 font-mono">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Start with Jumpmon, Archermon &amp; Shieldmon</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlock remaining roster with earned coins</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Standard Level 1 starting stats</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Complete campaign stages sequentially</li>
              </ul>
            </div>
            <button
              disabled={isFreeActive || isFreeLower}
              onClick={() => {
                soundService.playClick();
                switchTier('Free');
              }}
              className={`w-full py-3.5 mt-8 rounded-2xl font-black text-xs uppercase tracking-wider font-display transition-all ${
                isFreeActive
                  ? 'bg-stone-800 text-stone-500 cursor-default'
                  : isFreeLower
                  ? 'bg-stone-900/60 text-stone-600 border border-stone-800 cursor-not-allowed opacity-75'
                  : 'bg-stone-800 text-white hover:bg-stone-700 shadow-md active:scale-95'
              }`}
            >
              {isFreeActive
                ? 'Current Active Tier'
                : isFreeLower
                ? `Included in ${currentTier} Tier`
                : 'Activate Free Tier'}
            </button>
          </motion.div>

          {/* BASIC TIER CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`p-8 rounded-3xl border transition-all flex flex-col justify-between backdrop-blur-md ${
              isBasicActive
                ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/30 shadow-2xl shadow-emerald-950/50'
                : isBasicLower
                ? 'bg-stone-950/60 border-stone-900 opacity-60 shadow-none'
                : 'bg-stone-900/60 border-stone-800 hover:border-emerald-500/50 shadow-xl'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-emerald-400 uppercase">Recommended</span>
                {isBasicActive ? (
                  <span className="text-[10px] font-mono font-black bg-emerald-500 text-stone-950 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                ) : isBasicLower ? (
                  <span className="text-[10px] font-mono font-bold bg-stone-950/80 text-stone-500 border border-stone-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> INCLUDED
                  </span>
                ) : null}
              </div>
              <h3 className="text-2xl font-black text-white font-display uppercase">Basic Tier</h3>
              <div className="text-3xl font-black text-emerald-400 font-mono">Starter Boost</div>
              <ul className="space-y-2.5 text-xs text-stone-300 pt-4 border-t border-stone-800/80 font-mono">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Starts with 5,000 Gold Coins 🪙</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> All Heroes unlocked @ Level 5</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> +1 Bonus to ALL attributes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> All Campaign Stages unlocked</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Faster energy regeneration rate</li>
              </ul>
            </div>
            <button
              disabled={isBasicActive || isBasicLower}
              onClick={() => {
                soundService.playLevelUp();
                switchTier('Basic');
              }}
              className={`w-full py-3.5 mt-8 rounded-2xl font-black text-xs uppercase tracking-wider font-display transition-all ${
                isBasicActive
                  ? 'bg-stone-800 text-stone-500 cursor-default'
                  : isBasicLower
                  ? 'bg-stone-900/60 text-stone-600 border border-stone-800 cursor-not-allowed opacity-75'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/50 active:scale-95'
              }`}
            >
              {isBasicActive
                ? 'Current Active Tier'
                : isBasicLower
                ? `Included in ${currentTier} Tier`
                : 'Activate Basic Tier'}
            </button>
          </motion.div>

          {/* PREMIUM TIER CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`p-8 rounded-3xl border transition-all flex flex-col justify-between backdrop-blur-md ${
              isPremiumActive
                ? 'bg-purple-950/40 border-purple-500/80 ring-2 ring-purple-500/30 shadow-2xl shadow-purple-950/50'
                : 'bg-stone-900/60 border-stone-800 hover:border-purple-500/50 shadow-xl'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-purple-400 uppercase">God Tier</span>
                {isPremiumActive && (
                  <span className="text-[10px] font-mono font-black bg-purple-600 text-white px-2.5 py-0.5 rounded-full">ACTIVE</span>
                )}
              </div>
              <h3 className="text-2xl font-black text-white font-display uppercase">Premium Tier</h3>
              <div className="text-3xl font-black text-purple-400 font-mono">Max Roster Boost</div>
              <ul className="space-y-2.5 text-xs text-stone-300 pt-4 border-t border-stone-800/80 font-mono">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Starts with 25,000 Gold Coins 🪙</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> All Heroes unlocked @ Level 10</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Maximized +2 to ALL attributes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Full Energy &amp; Ultimate Perks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Infinite Stage Access &amp; God Mode perks</li>
              </ul>
            </div>
            <button
              disabled={isPremiumActive}
              onClick={() => {
                soundService.playLevelUp();
                switchTier('Premium');
              }}
              className={`w-full py-3.5 mt-8 rounded-2xl font-black text-xs uppercase tracking-wider font-display transition-all ${
                isPremiumActive
                  ? 'bg-stone-800 text-stone-500 cursor-default'
                  : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-950/50 active:scale-95'
              }`}
            >
              {isPremiumActive ? 'Current Active Tier' : 'Activate Premium Tier'}
            </button>
          </motion.div>
        </div>
      </main>

      <ActivationModal
        activationTier={activationTier}
        activationCodeInput={activationCodeInput}
        activationError={activationError}
        onCodeChange={setActivationCodeInput}
        onVerify={handleVerifyCode}
        onClose={() => {
          setActivationTier(null);
          setActivationCodeInput('');
          setActivationError(false);
        }}
      />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
