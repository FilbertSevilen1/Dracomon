'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Play,
  Skull,
  Globe,
  Sparkles,
  Award,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';
import { Footer } from '../../components/Footer';
import { WORLDS, WorldData, LevelData } from '../../game/LevelManager';

export default function MapsPage() {
  const router = useRouter();
  const {
    saveData,
    setCurrentStage,
    setLastWorldId,
  } = useGameState();

  const currentTier = saveData.tier || 'Free';
  const [activeWorldId, setActiveWorldId] = useState<number>(1);

  useEffect(() => {
    if (saveData && saveData.lastWorldId) {
      setActiveWorldId(saveData.lastWorldId);
    }
  }, [saveData.lastWorldId]);

  const activeWorld = WORLDS.find(w => w.id === activeWorldId) || WORLDS[0];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-display flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-rose-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-emerald-100/50 rounded-full blur-3xl -z-10" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-16 space-y-10 z-10">
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

        {/* WORLD SELECTOR TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {WORLDS.map((world) => {
            const isActive = world.id === activeWorldId;
            return (
              <button
                key={world.id}
                onClick={() => {
                  soundService.playClick();
                  setActiveWorldId(world.id);
                  setLastWorldId(world.id);
                }}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-105'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                }`}
              >
                <span>{world.icon}</span>
                <span>W{world.id}: {world.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                  isActive ? 'bg-amber-400 text-stone-900' : 'bg-stone-100 text-stone-500'
                }`}>
                  {world.rewardMultiplier}x Drops
                </span>
              </button>
            );
          })}
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

        {/* STAGES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
