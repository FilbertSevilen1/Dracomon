import React, { useEffect, useRef, useState } from 'react';
import { Sword, Sparkles, Zap } from 'lucide-react';
import { GameEngine } from '../game/GameEngine';
import { PlayerStats } from '../types/game';

interface HeroDemoCanvasProps {
  selectedDraco: string;
}

export const HeroDemoCanvas: React.FC<HeroDemoCanvasProps> = ({ selectedDraco }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [actionType, setActionType] = useState<'attack' | 'special' | 'ultimate'>('ultimate');
  const [loopProgress, setLoopProgress] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = 480;
    canvas.height = 240;

    const stats: PlayerStats = {
      hp: 9999,
      attack: 12,
      defense: 10,
      speed: 8,
      jump: 11,
      range: 8,
      energyRegen: 100,
      level: 15,
    } as any;

    const dummyCallbacks = {
      onCoinCollect: () => {},
      onItemCollect: () => {},
      onEnemyDefeat: () => {},
      onHpChange: () => {},
      onEnergyChange: () => {},
      onStageClear: () => {},
      onPlayerDeath: () => {},
    };

    // Initialize Game Engine in demo mode
    const engine = new GameEngine(
      canvas,
      1,
      selectedDraco,
      stats,
      dummyCallbacks,
      true
    );

    engineRef.current = engine;

    // Trigger action immediately
    const firstTimer = setTimeout(() => {
      engine.triggerAction(actionType);
    }, 300);

    // 10-second loop duration
    const LOOP_DURATION = 7000;
    let startTime = performance.now();
    let loopAnimId: number;

    const updateLoopBar = (now: number) => {
      const elapsed = (now - startTime) % LOOP_DURATION;
      setLoopProgress(elapsed / LOOP_DURATION);
      loopAnimId = requestAnimationFrame(updateLoopBar);
    };

    loopAnimId = requestAnimationFrame(updateLoopBar);

    const loopInterval = setInterval(() => {
      if (engineRef.current) {
        engineRef.current.triggerAction(actionType);
      }
    }, LOOP_DURATION);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(loopInterval);
      cancelAnimationFrame(loopAnimId);
      engine.destroy();
      engineRef.current = null;
    };
  }, [selectedDraco, actionType]);

  return (
    <div className="w-full space-y-2 select-none">
      {/* 3 PREVIEW TABS: BASIC ATTACK / SPECIAL SKILL / ULTIMATE */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800">
        <button
          onClick={() => setActionType('attack')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
            actionType === 'attack'
              ? 'bg-amber-500 text-stone-950 shadow-md ring-1 ring-amber-300'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <Sword className="w-3 h-3" />
          <span>Basic Attack</span>
        </button>

        <button
          onClick={() => setActionType('special')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
            actionType === 'special'
              ? 'bg-sky-500 text-stone-950 shadow-md ring-1 ring-sky-300'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Skill Preview</span>
        </button>

        <button
          onClick={() => setActionType('ultimate')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
            actionType === 'ultimate'
              ? 'bg-rose-500 text-white shadow-md ring-1 ring-rose-300 animate-pulse'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>Ultimate</span>
        </button>
      </div>

      {/* CLEAN CANVAS CONTAINER (NO OVERLAY TEXT OR CHARACTER HEADERS) */}
      <div className="w-full relative rounded-2xl overflow-hidden border border-stone-800 shadow-xl bg-stone-950" style={{ aspectRatio: '2 / 1' }}>
        <canvas
          ref={canvasRef}
          width={480}
          height={240}
          className="absolute inset-0 w-full h-full block bg-stone-950 cursor-pointer"
          onClick={() => engineRef.current?.triggerAction(actionType)}
          title="Click canvas to trigger action!"
        />

        {/* BOTTOM LOOP PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-900 overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ${
              actionType === 'attack'
                ? 'bg-amber-400'
                : actionType === 'special'
                ? 'bg-sky-400'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400'
            }`}
            style={{ width: `${loopProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroDemoCanvas;
