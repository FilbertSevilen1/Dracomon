'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Lock,
  Play,
  Skull,
  Sparkles,
  Layers,
  Compass,
  Search,
  Zap,
  Swords,
  Trophy,
} from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';
import { Footer } from '../../components/Footer';
import { WORLDS, parseWorlds, WorldData } from '../../game/LevelManager';

const WORLD_BG_THEMES: Record<number, { bg: string; border: string; glow: string; text: string }> = {
  1: { bg: 'from-emerald-950/60 via-stone-900/90 to-stone-950', border: 'border-emerald-500/50 hover:border-emerald-400', glow: 'bg-emerald-500/10', text: 'text-emerald-400' },
  2: { bg: 'from-purple-950/60 via-stone-900/90 to-stone-950', border: 'border-purple-500/50 hover:border-purple-400', glow: 'bg-purple-500/10', text: 'text-purple-400' },
  3: { bg: 'from-cyan-950/60 via-stone-900/90 to-stone-950', border: 'border-cyan-500/50 hover:border-cyan-400', glow: 'bg-cyan-500/10', text: 'text-cyan-400' },
  4: { bg: 'from-rose-950/60 via-stone-900/90 to-stone-950', border: 'border-rose-500/50 hover:border-rose-400', glow: 'bg-rose-500/10', text: 'text-rose-400' },
  5: { bg: 'from-amber-950/60 via-stone-900/90 to-stone-950', border: 'border-amber-500/50 hover:border-amber-400', glow: 'bg-amber-500/10', text: 'text-amber-400' },
  6: { bg: 'from-blue-950/60 via-stone-900/90 to-stone-950', border: 'border-blue-500/50 hover:border-blue-400', glow: 'bg-blue-500/10', text: 'text-blue-400' },
  7: { bg: 'from-pink-950/60 via-stone-900/90 to-stone-950', border: 'border-pink-500/50 hover:border-pink-400', glow: 'bg-pink-500/10', text: 'text-pink-400' },
  8: { bg: 'from-red-950/60 via-stone-900/90 to-stone-950', border: 'border-red-500/50 hover:border-red-400', glow: 'bg-red-500/10', text: 'text-red-400' },
  9: { bg: 'from-orange-950/60 via-stone-900/90 to-stone-950', border: 'border-orange-500/50 hover:border-orange-400', glow: 'bg-orange-500/10', text: 'text-orange-400' },
  10: { bg: 'from-indigo-950/60 via-stone-900/90 to-stone-950', border: 'border-indigo-500/50 hover:border-indigo-400', glow: 'bg-indigo-500/10', text: 'text-indigo-400' },
  11: { bg: 'from-sky-950/60 via-stone-900/90 to-stone-950', border: 'border-sky-500/50 hover:border-sky-400', glow: 'bg-sky-500/10', text: 'text-sky-400' },
  12: { bg: 'from-fuchsia-950/60 via-stone-900/90 to-stone-950', border: 'border-fuchsia-500/50 hover:border-fuchsia-400', glow: 'bg-fuchsia-500/10', text: 'text-fuchsia-400' },
  13: { bg: 'from-amber-950/60 via-stone-900/90 to-stone-950', border: 'border-amber-500/50 hover:border-amber-400', glow: 'bg-amber-500/10', text: 'text-amber-400' },
};

export default function MapsPage() {
  const router = useRouter();
  const {
    saveData,
    setCurrentStage,
    setLastWorldId,
  } = useGameState();

  const [mounted, setMounted] = useState<boolean>(false);
  const [worlds, setWorlds] = useState<WorldData[]>(WORLDS);
  const [activeWorldId, setActiveWorldId] = useState<number>(1);
  const [worldSearch, setWorldSearch] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    setWorlds(parseWorlds());
    if (saveData && saveData.lastWorldId) {
      setActiveWorldId(saveData.lastWorldId);
    }

    const handleLevelsUpdate = () => {
      setWorlds(parseWorlds());
    };
    window.addEventListener('dracoman_levels_updated', handleLevelsUpdate);
    return () => window.removeEventListener('dracoman_levels_updated', handleLevelsUpdate);
  }, [saveData.lastWorldId]);

  const currentTier = mounted ? (saveData.tier || 'Free') : 'Free';
  const completedStages = mounted ? (saveData.completedStages || []) : [];
  const effectiveActiveWorldId = mounted ? activeWorldId : 1;
  const currentWorlds = mounted ? worlds : WORLDS;

  const activeWorld = currentWorlds.find(w => w.id === effectiveActiveWorldId) || currentWorlds[0] || WORLDS[0];
  const activeTheme = WORLD_BG_THEMES[activeWorld?.id] || WORLD_BG_THEMES[1];

  const filteredWorlds = currentWorlds.filter(w =>
    w.name.toLowerCase().includes(worldSearch.toLowerCase()) ||
    w.description.toLowerCase().includes(worldSearch.toLowerCase()) ||
    w.bossName.toLowerCase().includes(worldSearch.toLowerCase()) ||
    `world ${w.id}`.toLowerCase().includes(worldSearch.toLowerCase()) ||
    `w${w.id}`.toLowerCase().includes(worldSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-display flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Ambient Lighting */}
      <div className="absolute top-0 right-0 w-[55rem] h-[55rem] bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[55rem] h-[55rem] bg-amber-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] bg-stone-900/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-12 space-y-8 z-10">
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800/80 pb-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Compass className="w-3.5 h-3.5" /> Campaign Realm Explorer
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-display uppercase">
              Campaign Worlds <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">&amp; Stages</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-400 max-w-2xl leading-relaxed font-mono">
              Explore 13 distinct elemental realms featuring progressive drop rewards (up to 5.0x in Space &amp; Desert!). Defeat world bosses to conquer each region.
            </p>
          </div>

          {/* STAT BADGES */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-stone-900/90 border border-stone-800 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-lg">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[9px] font-mono text-stone-500 uppercase block font-semibold">Cleared Stages</span>
                <span className="text-xs font-black text-amber-400 font-display">{completedStages.length} / 61</span>
              </div>
            </div>
            <div className="px-4 py-2.5 bg-stone-900/90 border border-stone-800 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-lg">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[9px] font-mono text-stone-500 uppercase block font-semibold">Max Multiplier</span>
                <span className="text-xs font-black text-cyan-400 font-display">5.0x Drops</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TOP WORLD REALM SELECTION BAR */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" /> Select World Realm
            </h3>
            {/* SEARCH INPUT */}
            <div className="relative w-64">
              <input
                type="text"
                value={worldSearch}
                onChange={(e) => setWorldSearch(e.target.value)}
                placeholder="Search worlds or bosses..."
                className="w-full pl-8 pr-7 py-1.5 bg-stone-900/90 border border-stone-800 rounded-xl text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-stone-500 shadow-inner"
              />
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {worldSearch && (
                <button
                  onClick={() => setWorldSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center bg-stone-800"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* UN-SQUISHED WORLD CARDS GRID (6 COLS = 2 CLEAN ROWS FOR 12 WORLDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredWorlds.map((world) => {
              const isActive = world.id === effectiveActiveWorldId;
              const wTheme = WORLD_BG_THEMES[world.id] || WORLD_BG_THEMES[1];
              return (
                <button
                  key={world.id}
                  onClick={() => {
                    soundService.playClick();
                    setActiveWorldId(world.id);
                    setLastWorldId(world.id);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative group flex flex-col justify-between h-32 overflow-hidden backdrop-blur-md ${
                    isActive
                      ? `bg-gradient-to-b ${wTheme.bg} ${wTheme.border} ring-2 ring-amber-400/50 scale-[1.02] shadow-xl z-10`
                      : 'bg-stone-900/60 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900/90 hover:scale-[1.01]'
                  }`}
                >
                  {/* Background Ambient Glow */}
                  <div className={`absolute top-0 right-0 w-24 h-24 ${wTheme.glow} rounded-full blur-2xl pointer-events-none group-hover:opacity-100 transition-opacity`} />

                  <div className="flex items-center justify-between gap-1.5 relative z-10">
                    <span className={`text-2xl p-1.5 bg-stone-950/90 rounded-xl border ${isActive ? 'border-amber-400/50 shadow-inner' : 'border-stone-800'}`}>
                      {world.icon}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                      isActive ? 'bg-amber-500 text-stone-950 font-black shadow-sm' : 'bg-stone-800/90 text-stone-400'
                    }`}>
                      {world.rewardMultiplier}x
                    </span>
                  </div>

                  <div className="relative z-10 mt-1">
                    <span className={`text-[10px] font-mono font-bold block ${isActive ? 'text-amber-400' : 'text-stone-500'}`}>
                      WORLD {world.id}
                    </span>
                    <h4 className="font-black text-xs sm:text-sm uppercase font-display text-stone-100 leading-tight">
                      {world.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE WORLD SHOWCASE HERO BANNER */}
        <motion.div
          key={activeWorld.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${activeTheme.bg} border ${activeTheme.border} text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl relative overflow-hidden group`}
        >
          <div className={`absolute top-0 right-0 w-96 h-96 ${activeTheme.glow} rounded-full blur-3xl -z-10 pointer-events-none`} />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-4">
              <span className="text-4xl p-3 bg-stone-950/90 border border-stone-800 rounded-2xl shadow-inner shadow-amber-500/10 shrink-0">
                {activeWorld.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                    WORLD {activeWorld.id} / 13
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="text-xs font-mono font-bold text-stone-400">
                    {activeWorld.stages.length} STAGES AVAILABLE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display uppercase tracking-wider text-stone-100">
                  {activeWorld.name}
                </h2>
              </div>
            </div>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl leading-relaxed font-mono">
              {activeWorld.description}
            </p>
          </div>

          {/* RIGHT INFO CARDS */}
          <div className="flex items-center gap-4 bg-stone-950/90 p-4 rounded-2xl border border-stone-800/90 shrink-0 shadow-xl relative z-10">
            <div className="text-right">
              <span className="text-[10px] font-mono text-stone-500 uppercase block font-semibold">World Boss</span>
              <span className="text-xs font-black text-rose-400 flex items-center gap-1 font-display">
                <Skull className="w-3.5 h-3.5" /> {activeWorld.bossName}
              </span>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div className="text-left">
              <span className="text-[10px] font-mono text-stone-500 uppercase block font-semibold">Reward Multiplier</span>
              <span className="text-sm font-black text-amber-400 flex items-center gap-1 font-display">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400/20" /> {activeWorld.rewardMultiplier}x Drops
              </span>
            </div>
          </div>
        </motion.div>

        {/* STAGES GRID LIST (3 COLUMNS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" /> Stage Roster &amp; Battlegrounds
            </h3>
            <span className="text-xs font-mono font-bold text-stone-500">
              Showing {activeWorld.stages.length} Stages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeWorld.stages.map((stg, idx) => {
              const stageNum = stg.globalStageNum;
              const isUnlocked = stageNum === 1 || currentTier === 'Premium' || currentTier === 'Basic' || completedStages.includes(stageNum - 1);
              const isBossStage = stg.stageInWorld === stg.totalStagesInWorld;

              return (
                <motion.div
                  key={stageNum}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between backdrop-blur-xl shadow-2xl relative overflow-hidden ${
                    isUnlocked
                      ? isBossStage
                        ? 'bg-gradient-to-b from-rose-950/40 via-stone-900/90 to-stone-950 border-rose-800/80 hover:border-rose-500 shadow-rose-950/30 ring-1 ring-rose-500/20'
                        : 'bg-gradient-to-b from-stone-900/95 to-stone-950 border-stone-800 hover:border-amber-400/80 shadow-black/60'
                      : 'bg-stone-950/60 border-stone-900 opacity-60'
                  }`}
                >
                  <div className="space-y-4">
                    {/* STAGE HEADER */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        STAGE {stg.worldId}-{stg.stageInWorld}
                      </span>
                      <div className="flex items-center gap-2">
                        {stg.maps && stg.maps.length > 0 && (
                          <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold rounded-lg bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 flex items-center gap-1 shadow-sm">
                            <Layers className="w-3 h-3" /> {stg.maps.length} Sub-Areas
                          </span>
                        )}
                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono rounded-lg border font-bold shadow-sm ${stg.diffClass}`}>
                          {stg.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* STAGE ICON & TITLE */}
                    <div className="flex items-center gap-4">
                      <span className="text-4xl p-3 bg-stone-950 rounded-2xl border border-stone-800 shadow-inner shrink-0">
                        {stg.icon}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-white leading-tight font-display uppercase truncate">
                          {stg.name.replace(/^World \d+-\d+:\s*/, '')}
                        </h3>
                        {isBossStage ? (
                          <span className="text-xs font-bold text-rose-400 mt-1 flex items-center gap-1 font-display">
                            <Skull className="w-3.5 h-3.5" /> Boss: {stg.boss}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-stone-400 mt-1 block font-mono">
                            Miniboss / Exit Portal Stage
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DESCRIPTION BOX */}
                    <p className="text-xs text-stone-300 leading-relaxed p-3.5 bg-stone-950/80 border border-stone-800/90 rounded-2xl font-mono shadow-inner">
                      {stg.description}
                    </p>
                  </div>

                  {/* LAUNCH CTA BUTTON */}
                  <div className="mt-6">
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          soundService.playClick();
                          setCurrentStage(stageNum);
                          setLastWorldId(stg.worldId);
                          router.push(`/play?stage=${stageNum}`);
                        }}
                        className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider font-display shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                          isBossStage
                            ? 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-950/50 hover:shadow-rose-500/25'
                            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-amber-500/20 hover:shadow-amber-500/35'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY STAGE {stg.worldId}-{stg.stageInWorld} NOW</span>
                      </button>
                    ) : (
                      <div className="w-full py-3.5 bg-stone-950/90 text-stone-500 rounded-2xl font-bold text-xs border border-stone-800/80 flex items-center justify-center gap-1.5 cursor-not-allowed font-mono">
                        <Lock className="w-4 h-4 text-stone-500" />
                        <span>CLEAR STAGE {stageNum - 1} TO UNLOCK</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
