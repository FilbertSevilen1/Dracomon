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
    <div className="min-h-screen bg-stone-50 text-stone-900 font-display flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-rose-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-emerald-100/50 rounded-full blur-3xl -z-10" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-16 space-y-8 z-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-800 rounded-full text-xs font-mono font-bold mb-3">
              <Globe className="w-3.5 h-3.5" /> 11 CAMPAIGN WORLDS OVERHAUL
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight">
              Campaign <span className="text-rose-500">Worlds &amp; Stages</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-500 mt-2 max-w-2xl leading-relaxed">
              Explore 11 distinct worlds featuring progressive drop rewards (up to 5.0x in Space!). Boss battles await exclusively on the final stage of each world.
            </p>
          </div>
        </div>

        {/* ACTIVE WORLD BANNER */}
        <motion.div
          key={activeWorld.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-stone-700"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 bg-stone-800/80 border border-stone-700 rounded-2xl shadow-inner">
                {activeWorld.icon}
              </span>
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  WORLD {activeWorld.id} / 11 • {activeWorld.stages.length} STAGES
                </span>
                <h2 className="text-2xl md:text-3xl font-black">{activeWorld.name}</h2>
              </div>
            </div>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl leading-relaxed pt-1">
              {activeWorld.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-stone-800/90 p-4 rounded-2xl border border-stone-700 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-stone-400 uppercase block">World Boss</span>
              <span className="text-xs font-black text-rose-400 flex items-center gap-1">
                <Skull className="w-3.5 h-3.5" /> {activeWorld.bossName}
              </span>
            </div>
            <div className="h-8 w-px bg-stone-700" />
            <div className="text-left">
              <span className="text-[10px] font-mono text-stone-400 uppercase block">Reward Multiplier</span>
              <span className="text-sm font-black text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {activeWorld.rewardMultiplier}x Drops
              </span>
            </div>
          </div>
        </motion.div>

        {/* MAIN LAYOUT: LEFT WORLD MENU SIDEBAR + RIGHT STAGES GRID LIST */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
          {/* LEFT SIDEBAR: DYNAMIC HEIGHT MATCHING EXACT HEIGHT OF RIGHT-HAND GRID CONTENT */}
          <div
            style={
              rightContentHeight
                ? { height: `${rightContentHeight}px`, maxHeight: `${rightContentHeight}px` }
                : undefined
            }
            className="w-full lg:w-80 bg-white border border-stone-200 rounded-3xl p-4 shadow-sm shrink-0 flex flex-col overflow-hidden space-y-3"
          >
            {/* SIDEBAR HEADER */}
            <div className="px-1 py-1 border-b border-stone-100 flex items-center justify-between shrink-0">
              <span className="text-xs font-mono font-black text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-500" /> Select World Realm
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
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
                className="w-full pl-8 pr-7 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-stone-400"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {worldSearch && (
                <button
                  onClick={() => setWorldSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center bg-stone-200/60"
                >
                  ✕
                </button>
              )}
            </div>

            {/* SEARCHABLE WORLDS LIST (INNER SCROLLABLE) */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-stone-200">
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
                    className={`w-full p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between gap-3 text-left group ${
                      isActive
                        ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900/20'
                        : 'bg-stone-50/70 text-stone-700 border-stone-200/80 hover:bg-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`text-xl p-1.5 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'bg-stone-800' : 'bg-white border border-stone-200'
                      }`}>
                        {world.icon}
                      </span>
                      <div className="min-w-0">
                        <span className={`text-[10px] font-mono block ${isActive ? 'text-amber-400' : 'text-stone-400'}`}>
                          WORLD {world.id}
                        </span>
                        <h4 className="font-extrabold truncate leading-tight text-xs">
                          {world.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-amber-400 text-stone-950 shadow-xs'
                          : 'bg-stone-200/70 text-stone-600'
                      }`}>
                        {world.rewardMultiplier}x
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? 'text-amber-400 translate-x-0.5' : 'text-stone-400 group-hover:translate-x-0.5'
                      }`} />
                    </div>
                  </button>
                );
              })}

              {filteredWorlds.length === 0 && (
                <div className="py-8 text-center space-y-1">
                  <p className="text-xs font-mono text-stone-400">No worlds match &quot;{worldSearch}&quot;</p>
                  <button
                    onClick={() => setWorldSearch('')}
                    className="text-[11px] font-bold text-amber-600 hover:underline"
                  >
                    Clear search filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT MAIN AREA: STAGES GRID LIST (HEIGHT TARGET REF WITH MINIMUM 2 ROWS HEIGHT) */}
          <div ref={rightContentRef} className="flex-1 w-full min-h-[580px]">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeWorld.stages.map((stg) => {
                const stageNum = stg.globalStageNum;
                const completed = saveData.completedStages || [];
                const isUnlocked = stageNum === 1 || currentTier === 'Premium' || currentTier === 'Basic' || completed.includes(stageNum - 1);
                const isBossStage = stg.stageInWorld === stg.totalStagesInWorld;

                return (
                  <motion.div
                    key={stageNum}
                    whileHover={{ y: -4 }}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                      isUnlocked
                        ? isBossStage
                          ? 'bg-white border-rose-300 hover:border-rose-500 shadow-lg ring-1 ring-rose-200'
                          : 'bg-white border-stone-200 hover:border-amber-400 shadow-md'
                        : 'bg-stone-100/70 border-stone-200 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-black text-stone-500 uppercase">
                          STAGE {stg.worldId}-{stg.stageInWorld}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {stg.maps && stg.maps.length > 0 && (
                            <span className="px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded bg-cyan-100 text-cyan-800 border border-cyan-300 flex items-center gap-1">
                              <Layers className="w-2.5 h-2.5" /> {stg.maps.length} Sub-Areas
                            </span>
                          )}
                          <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider rounded-md border ${stg.diffClass}`}>
                            {stg.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 bg-stone-100 rounded-2xl border border-stone-200 shadow-inner">
                          {stg.icon}
                        </span>
                        <div>
                          <h3 className="text-xl font-black text-stone-900 leading-tight">
                            {stg.name.replace(/^World \d+-\d+:\s*/, '')}
                          </h3>
                          {isBossStage ? (
                            <span className="text-xs font-bold text-rose-600 block mt-0.5 flex items-center gap-1">
                              <Skull className="w-3.5 h-3.5" /> Boss: {stg.boss}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-stone-400 block mt-0.5">
                              Miniboss / Exit Portal Stage
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-stone-600 leading-relaxed p-3.5 bg-stone-50 border border-stone-200/60 rounded-2xl">
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
                          className={`w-full py-3 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                            isBossStage
                              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                              : 'bg-stone-900 hover:bg-stone-800'
                          }`}
                        >
                          <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span>PLAY STAGE {stg.worldId}-{stg.stageInWorld} NOW</span>
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
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
