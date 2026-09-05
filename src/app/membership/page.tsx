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
  Users,
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
          {/* FREE TIER CARD - Adventurer Pass */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`p-7 rounded-2xl border transition-all flex flex-col justify-between ${
              isFreeActive
                ? 'bg-gradient-to-b from-stone-900 to-stone-950 border-amber-500/50 ring-1 ring-amber-500/30 shadow-xl'
                : isFreeLower
                ? 'bg-stone-950/40 border-stone-800/60 opacity-60 shadow-none'
                : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 shadow-lg'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded bg-stone-800/80 text-stone-400 border border-stone-700/60 font-display">
                  Adventurer
                </span>
                {isFreeActive ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500 text-stone-950 flex items-center gap-1 font-display shadow-xs">
                    <Check className="w-3 h-3 stroke-[2.5]" /> Active
                  </span>
                ) : isFreeLower ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-stone-900 text-stone-500 border border-stone-800 font-display">
                    Included
                  </span>
                ) : null}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white font-display">Free Tier</h3>
                <p className="text-xs text-stone-400 mt-0.5">Starter Roster &amp; Standard Progression</p>
              </div>
              <div className="text-2xl font-black text-stone-200 font-display flex items-baseline gap-1.5">
                0 <span className="text-xs font-semibold text-stone-400">Coins required</span>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-300 pt-4 border-t border-stone-800/80">
                <li className="flex items-center gap-2.5"><Users className="w-4 h-4 text-stone-400 shrink-0" /> Start with Jumpmon, Archermon &amp; Shieldmon</li>
                <li className="flex items-center gap-2.5"><Coins className="w-4 h-4 text-stone-400 shrink-0" /> Unlock remaining roster with earned coins</li>
                <li className="flex items-center gap-2.5"><Shield className="w-4 h-4 text-stone-400 shrink-0" /> Standard Level 1 starting stats</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-stone-400 shrink-0" /> Complete campaign stages sequentially</li>
              </ul>
            </div>
            <button
              disabled={isFreeActive || isFreeLower}
              onClick={() => {
                soundService.playClick();
                switchTier('Free');
              }}
              className={`w-full py-3 mt-8 rounded-xl font-bold text-xs uppercase tracking-wider font-display transition-all ${
                isFreeActive
                  ? 'bg-stone-900 border border-stone-800 text-stone-500 cursor-default shadow-inner'
                  : isFreeLower
                  ? 'bg-stone-950 text-stone-600 border border-stone-800/60 cursor-not-allowed'
                  : 'bg-stone-100 hover:bg-white text-stone-950 shadow-md active:translate-y-0.5'
              }`}
            >
              {isFreeActive
                ? 'Current Active Tier'
                : isFreeLower
                ? `Included in ${currentTier} Tier`
                : 'Activate Free Tier'}
            </button>
          </motion.div>

          {/* BASIC TIER CARD - Guild Champion */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`p-7 rounded-2xl border transition-all flex flex-col justify-between ${
              isBasicActive
                ? 'bg-gradient-to-b from-stone-900 to-stone-950 border-amber-500/60 ring-1 ring-amber-500/40 shadow-xl'
                : isBasicLower
                ? 'bg-stone-950/40 border-stone-800/60 opacity-60 shadow-none'
                : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 shadow-lg'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-display">
                  Guild Champion
                </span>
                {isBasicActive ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500 text-stone-950 flex items-center gap-1 font-display shadow-xs">
                    <Check className="w-3 h-3 stroke-[2.5]" /> Active
                  </span>
                ) : isBasicLower ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-stone-900 text-stone-500 border border-stone-800 font-display">
                    Included
                  </span>
                ) : null}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white font-display">Basic Tier</h3>
                <p className="text-xs text-stone-400 mt-0.5">Instant Level 5 Boost &amp; Full Campaign</p>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-display flex items-baseline gap-1.5">
                Level 5 <span className="text-xs font-semibold text-stone-400">All Unlocked</span>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-300 pt-4 border-t border-stone-800/80">
                <li className="flex items-center gap-2.5"><Coins className="w-4 h-4 text-emerald-400 shrink-0" /> Starts with 5,000 Gold Coins</li>
                <li className="flex items-center gap-2.5"><Users className="w-4 h-4 text-emerald-400 shrink-0" /> All Heroes unlocked @ Level 5</li>
                <li className="flex items-center gap-2.5"><Sparkles className="w-4 h-4 text-emerald-400 shrink-0" /> +1 Bonus to ALL attributes</li>
                <li className="flex items-center gap-2.5"><Shield className="w-4 h-4 text-emerald-400 shrink-0" /> All Campaign Stages unlocked</li>
                <li className="flex items-center gap-2.5"><Zap className="w-4 h-4 text-emerald-400 shrink-0" /> Faster energy regeneration rate</li>
              </ul>
            </div>
            <button
              disabled={isBasicActive || isBasicLower}
              onClick={() => {
                soundService.playLevelUp();
                switchTier('Basic');
              }}
              className={`w-full py-3 mt-8 rounded-xl font-bold text-xs uppercase tracking-wider font-display transition-all ${
                isBasicActive
                  ? 'bg-stone-900 border border-stone-800 text-stone-500 cursor-default shadow-inner'
                  : isBasicLower
                  ? 'bg-stone-950 text-stone-600 border border-stone-800/60 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:translate-y-0.5 border border-emerald-500/50'
              }`}
            >
              {isBasicActive
                ? 'Current Active Tier'
                : isBasicLower
                ? `Included in ${currentTier} Tier`
                : 'Activate Basic Tier'}
            </button>
          </motion.div>

          {/* PREMIUM TIER CARD - God Tier */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`p-7 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
              isPremiumActive
                ? 'bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-amber-500/60 ring-1 ring-amber-400/40 shadow-2xl shadow-amber-950/30'
                : 'bg-stone-900/80 border-stone-800 hover:border-amber-500/40 shadow-xl'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-amber-500/15 text-amber-300 border border-amber-500/40 font-display flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> God Tier
                </span>
                {isPremiumActive && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500 text-stone-950 flex items-center gap-1 font-display shadow-xs">
                    <Check className="w-3 h-3 stroke-[2.5]" /> Active
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white font-display">Premium Tier</h3>
                <p className="text-xs text-stone-400 mt-0.5">Maximum Power &amp; Full Arsenal</p>
              </div>
              <div className="text-2xl font-black text-amber-400 font-display flex items-baseline gap-2">
                Max Boost <span className="text-xs font-semibold text-stone-400">Full Roster</span>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-300 pt-4 border-t border-stone-800/80">
                <li className="flex items-center gap-2.5"><Coins className="w-4 h-4 text-amber-400 shrink-0" /> Starts with 25,000 Gold Coins</li>
                <li className="flex items-center gap-2.5"><Users className="w-4 h-4 text-amber-400 shrink-0" /> Complete Roster unlocked immediately</li>
                <li className="flex items-center gap-2.5"><Zap className="w-4 h-4 text-amber-400 shrink-0" /> Level 10 Starting Power on all heroes</li>
                <li className="flex items-center gap-2.5"><Sparkles className="w-4 h-4 text-amber-400 shrink-0" /> Maximized +2 to ALL attributes</li>
                <li className="flex items-center gap-2.5"><Shield className="w-4 h-4 text-amber-400 shrink-0" /> Full Energy &amp; Ultimate Perks</li>
              </ul>
            </div>
            <button
              disabled={isPremiumActive}
              onClick={() => {
                soundService.playLevelUp();
                switchTier('Premium');
              }}
              className={`w-full py-3 mt-8 rounded-xl font-bold text-xs uppercase tracking-wider font-display transition-all ${
                isPremiumActive
                  ? 'bg-stone-900 border border-stone-800 text-stone-500 cursor-default shadow-inner'
                  : 'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg active:translate-y-0.5 border border-amber-400/80'
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
