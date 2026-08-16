'use client';

import React from 'react';
import Link from 'next/link';
import { Footer } from '../../components/Footer';
import { DracoSelection } from '../../components/DracoSelection';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';
import { ActivationModal } from '../../components/ActivationModal';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function HeroesPage() {
  const {
    saveData,
    selectDraco,
    unlockDraco,
    levelUpDracoWithCoins,
    switchTier,
    showLevelUp,
    levelUpInfo,
    applyLevelUpBonus,
    pendingLevelUps,
    activationTier,
    setActivationTier,
    activationCodeInput,
    setActivationCodeInput,
    activationError,
    setActivationError,
    handleVerifyCode,
  } = useGameState();

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
            Hero Roster <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">&amp; Selection</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-400 max-w-2xl leading-relaxed font-mono">
            View all dracos, compare base attributes, unlock new companions, and equip your active partner.
          </p>
        </motion.div>

        {/* DRACO SELECTION GRID & INSPECT PANEL (WITH 2 TABS: DETAILS / COMBAT PREVIEW) */}
        <div className="w-full">
          <DracoSelection
            saveData={saveData}
            isFullPage={true}
            onSelect={(name) => {
              soundService.playClick();
              selectDraco(name);
            }}
            onUnlock={(name, cost) => {
              soundService.playLevelUp();
              unlockDraco(name, cost);
            }}
            onLevelUpWithCoins={(name) => {
              soundService.playLevelUp();
              levelUpDracoWithCoins(name);
            }}
            onSwitchTier={switchTier}
            showLevelUp={showLevelUp}
            levelUpInfo={levelUpInfo}
            onApplyBonus={applyLevelUpBonus}
            pendingLevelUps={pendingLevelUps}
          />
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
