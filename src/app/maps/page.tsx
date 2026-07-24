'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Lock,
  Play,
  Skull,
} from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';
import { Navbar } from '../../components/Navbar';
import { InventoryModal } from '../../components/InventoryModal';
import { SettingsModal } from '../../components/SettingsModal';
import { STAGES } from '../../game/LevelManager';

export default function MapsPage() {
  const router = useRouter();
  const {
    saveData,
    setCurrentStage,
    usePotion,
    useUpgradeStone,
    buyItem,
    updateSettings,
    resetGameSave,
    exportSave,
    importSave,
  } = useGameState();

  const [showInventory, setShowInventory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const currentTier = saveData.tier || 'Free';
  const maxUnlockedStage = saveData.player.level || 1;

  // Strip the "Stage N: " prefix from the name to get the display title
  const getDisplayName = (fullName: string) => {
    const match = fullName.match(/^Stage \d+:\s*(.+)$/);
    return match ? match[1] : fullName;
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-display flex flex-col justify-between relative overflow-hidden select-none">
      {}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-rose-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-emerald-100/50 rounded-full blur-3xl -z-10" />

      {}
      <Navbar onOpenInventory={() => setShowInventory(true)} />

      {}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-10 space-y-8 z-10">
        {}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight">
              Campaign <span className="text-rose-500">Maps &amp; Stages</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Discover all {STAGES.length} campaign stages across Volcanic Peaks, Underwater Abyss, Jungle Vine Swamps, and the Gladiator Arena.
              Launch any unlocked stage directly into campaign action!
            </p>
          </div>
        </div>

        {}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STAGES.map((stg, index) => {
            const stageNum = index + 1;
            const isUnlocked = stageNum <= maxUnlockedStage || currentTier === 'Premium' || currentTier === 'Basic';
            const displayName = getDisplayName(stg.name);

            return (
              <motion.div
                key={stageNum}
                whileHover={{ y: -5 }}
                className={`p-7 rounded-3xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-stone-200/90 hover:border-amber-400 hover:shadow-xl shadow-md'
                    : 'bg-stone-50/70 border-stone-200/80 opacity-80'
                }`}
              >
                <div>
                  {}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-black text-stone-500 uppercase">
                      STAGE {stageNum}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider rounded-md border ${stg.diffClass}`}>
                      {stg.difficulty}
                    </span>
                  </div>

                  {}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-stone-100 rounded-2xl border border-stone-200 shadow-inner">
                      {stg.icon}
                    </span>
                    <div>
                      <h3 className="text-2xl font-black text-stone-900 leading-tight">{displayName}</h3>
                      <span className="text-xs font-bold text-rose-600 block mt-0.5 flex items-center gap-1">
                        <Skull className="w-3.5 h-3.5" /> Boss: {stg.boss}
                      </span>
                    </div>
                  </div>

                  {}
                  <p className="mt-4 text-xs text-stone-600 leading-relaxed p-3.5 bg-stone-50 border border-stone-200/60 rounded-2xl">
                    {stg.description}
                  </p>
                </div>

                {}
                <div className="mt-6">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundService.playClick();
                        setCurrentStage(stageNum);
                        router.push(`/play?stage=${stageNum}`);
                      }}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>PLAY STAGE {stageNum} NOW</span>
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-stone-100 text-stone-400 rounded-2xl font-bold text-xs border border-stone-200 flex items-center justify-center gap-1.5 cursor-not-allowed">
                      <Lock className="w-4 h-4 text-stone-400" />
                      <span>CLEAR STAGE {stageNum - 1} TO UNLOCK</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {}
      {showInventory && (
        <InventoryModal
          saveData={saveData}
          onUsePotion={usePotion}
          onUseUpgradeStone={useUpgradeStone}
          onBuyItem={buyItem}
          onClose={() => setShowInventory(false)}
        />
      )}

      {}
      {showSettings && (
        <SettingsModal
          saveData={saveData}
          onUpdateSettings={updateSettings}
          onResetSave={resetGameSave}
          onExportSave={exportSave}
          onImportSave={importSave}
          onClose={() => setShowSettings(false)}
        />
      )}

      {}
      <footer className="w-full border-t border-stone-200 bg-white py-6 px-6 md:px-12 text-center text-xs font-mono text-stone-500 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Dracomon RPG • FilbertSevilen1</span>
          <Link
            href="/"
            onClick={() => soundService.playClick()}
            className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
          >
            <span>Return Home</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
