'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Lock,
  Sparkles,
  Play,
  Coins,
  Shield,
  Compass,
  Flame,
  Waves,
  Swords,
  Skull,
} from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';
import { Navbar } from '../../components/Navbar';
import { InventoryModal } from '../../components/InventoryModal';
import { SettingsModal } from '../../components/SettingsModal';

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

  const STAGES = [
    {
      num: 1,
      name: 'Whispering Woods',
      difficulty: 'EASY',
      diffClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-mono',
      desc: 'Lush forest filled with platforming blocks, coins, and friendly slime enemies.',
      boss: 'King Slime',
      icon: '🌲',
    },
    {
      num: 2,
      name: 'Mystic Ruins',
      difficulty: 'EASY',
      diffClass: 'bg-stone-100 text-stone-800 border-stone-300 font-mono',
      desc: 'Ancient ruin structures with solid stone platforms and goblin archers.',
      boss: 'Fire Golem',
      icon: '🏛️',
    },
    {
      num: 3,
      name: 'Volcanic Peak',
      difficulty: 'MEDIUM',
      diffClass: 'bg-amber-100 text-amber-800 border-amber-300 font-mono',
      desc: 'Molten magma caverns with fiery liquid pools and lava hazard zones.',
      boss: 'Magma Guard',
      icon: '🌋',
    },
    {
      num: 4,
      name: 'Frozen Citadel',
      difficulty: 'HARD',
      diffClass: 'bg-sky-100 text-sky-800 border-sky-300 font-mono',
      desc: 'Glacial ice fortress with sub-zero freezing hazards and slippery platforms.',
      boss: 'Frost Wyvern',
      icon: '❄️',
    },
    {
      num: 5,
      name: 'Shadow Abyss',
      difficulty: 'EXPERT',
      diffClass: 'bg-purple-900 text-purple-200 border-purple-600 font-mono',
      desc: 'Dark void domain populated by nether soul flames and shadow monsters.',
      boss: 'Shadow Overlord',
      icon: '🌑',
    },
    {
      num: 6,
      name: 'Celestial Dragon Temple',
      difficulty: 'INSANE',
      diffClass: 'bg-amber-100 text-amber-900 border-amber-400 font-mono',
      desc: 'Sacred celestial temple featuring thunderbolts and divine lightning traps.',
      boss: 'Primordial Dragon King',
      icon: '⚡',
    },
    {
      num: 7,
      name: 'Sky Heavens',
      difficulty: 'HARD',
      diffClass: 'bg-blue-100 text-blue-800 border-blue-300 font-mono',
      desc: 'High-altitude sky platforms with trampolines and floating cloud islands.',
      boss: 'Demonic Grenadier',
      icon: '☁️',
    },
    {
      num: 8,
      name: 'Primordial Core',
      difficulty: 'NIGHTMARE',
      diffClass: 'bg-rose-900 text-rose-200 border-rose-600 font-mono',
      desc: 'Volcanic magma core featuring exploding fire torrents and landmines.',
      boss: 'Core Guardian',
      icon: '💥',
    },
    {
      num: 9,
      name: 'Underwater Abyss',
      difficulty: 'WATER WORLD (FLOAT PHYSICS)',
      diffClass: 'bg-cyan-100 text-cyan-900 border-cyan-300 font-mono',
      desc: 'Submerged ocean abyss featuring swimming currents, whirlpools, anchors, and scallop traps.',
      boss: 'Killer Whale',
      icon: '🌊',
    },
    {
      num: 10,
      name: 'Primordial Jungle Sanctuary',
      difficulty: 'JUNGLE HAZARDS',
      diffClass: 'bg-emerald-900 text-emerald-200 border-emerald-600 font-mono',
      desc: 'Dense primordial jungle with climbable tree vines, vine traps, and toxic swamp chasms.',
      boss: 'King Kong',
      icon: '🌴',
    },
    {
      num: 11,
      name: 'Gladiator Arena',
      difficulty: 'SURVIVAL DEFENSE (3 MIN)',
      diffClass: 'bg-rose-600 text-white font-black border-rose-400',
      desc: 'Roman Colosseum defense map! Endless gladiator enemy waves spawn for 3 full minutes. Survive the 180s timer to spawn the Exit Portal!',
      boss: 'Immortal Gladiator Champion',
      icon: '🛡️',
    },
  ];

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
              Campaign <span className="text-rose-500">Maps & Stages</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Discover all 11 campaign stages across Volcanic Peaks, Underwater Abyss, Jungle Vine Swamps, and the Gladiator Arena.
              Launch any unlocked stage directly into campaign action!
            </p>
          </div>
        </div>

        {}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STAGES.map((stg) => {
            const isUnlocked = stg.num <= maxUnlockedStage || currentTier === 'Premium' || currentTier === 'Basic';

            return (
              <motion.div
                key={stg.num}
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
                      STAGE {stg.num}
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
                      <h3 className="text-2xl font-black text-stone-900 leading-tight">{stg.name}</h3>
                      <span className="text-xs font-bold text-rose-600 block mt-0.5 flex items-center gap-1">
                        <Skull className="w-3.5 h-3.5" /> Boss: {stg.boss}
                      </span>
                    </div>
                  </div>

                  {}
                  <p className="mt-4 text-xs text-stone-600 leading-relaxed p-3.5 bg-stone-50 border border-stone-200/60 rounded-2xl">
                    {stg.desc}
                  </p>
                </div>

                {}
                <div className="mt-6">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundService.playClick();
                        setCurrentStage(stg.num);
                        router.push(`/play?stage=${stg.num}`);
                      }}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>PLAY STAGE {stg.num} NOW</span>
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-stone-100 text-stone-400 rounded-2xl font-bold text-xs border border-stone-200 flex items-center justify-center gap-1.5 cursor-not-allowed">
                      <Lock className="w-4 h-4 text-stone-400" />
                      <span>CLEAR STAGE {stg.num - 1} TO UNLOCK</span>
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
