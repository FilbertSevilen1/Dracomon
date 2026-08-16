'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Lock,
  Play,
  Skull,
  Globe,
  Sparkles,
  ChevronRight,
  Layers,
  Compass,
  Search,
} from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';
import { Footer } from '../../components/Footer';
import { WORLDS } from '../../game/LevelManager';

export default function MapsPage() {
  const router = useRouter();
  const {
    saveData,
    setCurrentStage,
    setLastWorldId,
  } = useGameState();

  const currentTier = saveData.tier || 'Free';
  const [activeWorldId, setActiveWorldId] = useState<number>(1);
  const [worldSearch, setWorldSearch] = useState<string>('');

  const rightContentRef = useRef<HTMLDivElement>(null);
  const [rightContentHeight, setRightContentHeight] = useState<number | null>(null);

  useEffect(() => {
    if (saveData && saveData.lastWorldId) {
      setActiveWorldId(saveData.lastWorldId);
    }
  }, [saveData.lastWorldId]);

  useEffect(() => {
    if (!rightContentRef.current) return;
    const updateHeight = () => {
      if (rightContentRef.current) {
        setRightContentHeight(rightContentRef.current.offsetHeight);
      }
    };
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(rightContentRef.current);
    return () => observer.disconnect();
  }, [activeWorldId, worldSearch]);

  const activeWorld = WORLDS.find(w => w.id === activeWorldId) || WORLDS[0];

  const filteredWorlds = WORLDS.filter(w =>
    w.name.toLowerCase().includes(worldSearch.toLowerCase()) ||
    w.description.toLowerCase().includes(worldSearch.toLowerCase()) ||
    w.bossName.toLowerCase().includes(worldSearch.toLowerCase()) ||
    `world ${w.id}`.toLowerCase().includes(worldSearch.toLowerCase()) ||
    `w${w.id}`.toLowerCase().includes(worldSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-display flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-amber-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-10 space-y-8 z-10">
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 text-center md:text-left border-b border-stone-800 pb-8"
        >
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white font-display uppercase">
            Campaign Worlds <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">&amp; Stages</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-400 max-w-2xl leading-relaxed font-mono">
            Explore 11 distinct worlds featuring progressive drop rewards (up to 5.0x in Space!). Boss battles await exclusively on the final stage of each world.
          </p>
        </motion.div>

        {/* ACTIVE WORLD BANNER */}
        <motion.div
          key={activeWorld.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-stone-800 backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none group-hover:bg-amber-500/10 transition-all duration-500" />
          <div className="space-y-2">
            <div className="flex items-center gap-3.5">
              <span className="text-4xl p-3 bg-stone-950/90 border border-amber-500/30 rounded-2xl shadow-inner shadow-amber-500/10">
                {activeWorld.icon}
              </span>
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  WORLD {activeWorld.id} / 11 • {activeWorld.stages.length} STAGES
                </span>
                <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-wider text-stone-100">{activeWorld.name}</h2>
              </div>
            </div>
            <p className="text-xs md:text-sm text-stone-400 max-w-2xl leading-relaxed pt-1 font-mono">
              {activeWorld.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-stone-950/90 p-4 rounded-2xl border border-stone-800/90 shrink-0 shadow-inner">
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

        {/* MAIN LAYOUT: LEFT WORLD MENU SIDEBAR + RIGHT STAGES GRID LIST */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
          {/* LEFT SIDEBAR */}
          <div
            style={
              rightContentHeight
                ? { height: `${rightContentHeight}px`, maxHeight: `${rightContentHeight}px` }
                : undefined
            }
            className="w-full lg:w-80 bg-stone-900/90 border border-stone-800 rounded-3xl p-4 shadow-2xl shrink-0 flex flex-col overflow-hidden space-y-3 backdrop-blur-md"
          >
            {/* SIDEBAR HEADER */}
            <div className="px-1 py-1 border-b border-stone-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-mono font-black text-stone-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
                <Compass className="w-3.5 h-3.5 text-amber-400" /> Select World Realm
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md">
                {filteredWorlds.length}/{WORLDS.length}
              </span>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full shrink-0">
              <input
                type="text"
                value={worldSearch}
                onChange={(e) => setWorldSearch(e.target.value)}
                placeholder="Search worlds or bosses..."
                className="w-full pl-8 pr-7 py-2 bg-stone-950/90 border border-stone-800 rounded-2xl text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-stone-500 shadow-inner"
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

            {/* SEARCHABLE WORLDS LIST */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-stone-800">
              {filteredWorlds.map((world) => {
                const isActive = world.id === activeWorldId;
                return (
                  <button
                    key={world.id}
                    onClick={() => {
                      soundService.playClick();
                      setActiveWorldId(world.id);
                      setLastWorldId(world.id);
                    }}
                    className={`w-full p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between gap-3 text-left group relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-stone-900/90 text-white border-amber-500/80 ring-2 ring-amber-500/30 shadow-lg border-l-4 border-l-amber-400'
                        : 'bg-stone-950/60 text-stone-300 border-stone-800/80 hover:bg-stone-800/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`text-xl p-1.5 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'bg-stone-900 border border-amber-500/50 shadow-inner' : 'bg-stone-900 border border-stone-800'
                      }`}>
                        {world.icon}
                      </span>
                      <div className="min-w-0">
                        <span className={`text-[10px] font-mono block ${isActive ? 'text-amber-400 font-bold' : 'text-stone-500'}`}>
                          WORLD {world.id}
                        </span>
                        <h4 className="font-black truncate leading-tight text-xs uppercase font-display text-stone-100">
                          {world.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                          : 'bg-stone-800/90 text-stone-400'
                      }`}>
                        {world.rewardMultiplier}x
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? 'text-amber-400 translate-x-0.5' : 'text-stone-500 group-hover:translate-x-0.5'
                      }`} />
                    </div>
                  </button>
                );
              })}

              {filteredWorlds.length === 0 && (
                <div className="py-8 text-center space-y-1">
                  <p className="text-xs font-mono text-stone-500">No worlds match &quot;{worldSearch}&quot;</p>
                  <button
                    onClick={() => setWorldSearch('')}
                    className="text-[11px] font-bold text-amber-400 hover:underline"
                  >
                    Clear search filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT MAIN AREA: STAGES GRID LIST */}
          <div ref={rightContentRef} className="flex-1 w-full min-h-[580px]">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeWorld.stages.map((stg, idx) => {
                const stageNum = stg.globalStageNum;
                const completed = saveData.completedStages || [];
                const isUnlocked = stageNum === 1 || currentTier === 'Premium' || currentTier === 'Basic' || completed.includes(stageNum - 1);
                const isBossStage = stg.stageInWorld === stg.totalStagesInWorld;

                return (
                  <motion.div
                    key={stageNum}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden ${
                      isUnlocked
                        ? isBossStage
                          ? 'bg-gradient-to-b from-rose-950/40 via-stone-900/90 to-stone-950/95 border-rose-800/80 hover:border-rose-500 shadow-rose-950/30 ring-1 ring-rose-500/20'
                          : 'bg-gradient-to-b from-stone-900/95 to-stone-950/95 border-stone-800 hover:border-amber-400/80 shadow-black/60'
                        : 'bg-stone-950/50 border-stone-900 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-black text-amber-400/90 uppercase tracking-wider">
                          STAGE {stg.worldId}-{stg.stageInWorld}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {stg.maps && stg.maps.length > 0 && (
                            <span className="px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded-lg bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 flex items-center gap-1 shadow-sm">
                              <Layers className="w-2.5 h-2.5" /> {stg.maps.length} Sub-Areas
                            </span>
                          )}
                          <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-mono rounded-lg border font-bold shadow-sm ${stg.diffClass}`}>
                            {stg.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <span className="text-3xl p-2.5 bg-stone-950 rounded-2xl border border-stone-800 shadow-inner shrink-0">
                          {stg.icon}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-xl font-black text-white leading-tight font-display uppercase truncate">
                            {stg.name.replace(/^World \d+-\d+:\s*/, '')}
                          </h3>
                          {isBossStage ? (
                            <span className="text-xs font-bold text-rose-400 mt-0.5 flex items-center gap-1 font-display">
                              <Skull className="w-3.5 h-3.5" /> Boss: {stg.boss}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-stone-400 mt-0.5 block font-mono">
                              Miniboss / Exit Portal Stage
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-stone-300 leading-relaxed p-3.5 bg-stone-950/80 border border-stone-800/90 rounded-2xl font-mono shadow-inner">
                        {stg.description}
                      </p>
                    </div>

                    <div className="mt-6">
                      {isUnlocked ? (
                        <button
                          onClick={() => {
                            soundService.playClick();
                            setCurrentStage(stageNum);
                            setLastWorldId(stg.worldId);
                            router.push(`/play?stage=${stageNum}`);
                          }}
                          className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider font-display shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                            isBossStage
                              ? 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-950/50 hover:shadow-rose-500/25'
                              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-amber-500/20 hover:shadow-amber-500/35'
                          }`}
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>PLAY STAGE {stg.worldId}-{stg.stageInWorld} NOW</span>
                        </button>
                      ) : (
                        <div className="w-full py-3 bg-stone-950/90 text-stone-500 rounded-2xl font-bold text-xs border border-stone-800/80 flex items-center justify-center gap-1.5 cursor-not-allowed font-mono">
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
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
