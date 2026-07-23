'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { DracoSelection } from '../../components/DracoSelection';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';

export default function HeroesPage() {
  const {
    saveData,
    selectDraco,
    unlockDraco,
    levelUpDracoWithCoins,
    switchTier,
  } = useGameState();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-display flex flex-col justify-between relative overflow-hidden select-none">
      {}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-amber-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-purple-100/40 rounded-full blur-3xl -z-10" />

      {}
      <Navbar />

      {}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-10 space-y-8 z-10">

        {}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight font-display">
              Hero Roster <span className="text-amber-500">& Selection</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Inspect all 8 dragon guardians, compare base attributes, unlock new companions with coins, and equip your active partner for campaign combat.
            </p>
          </div>
        </div>

        {}
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
          />
        </div>
      </main>

      {}
      <footer className="w-full border-t border-stone-200 bg-white py-6 px-6 md:px-12 text-center text-xs font-mono text-stone-500 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
