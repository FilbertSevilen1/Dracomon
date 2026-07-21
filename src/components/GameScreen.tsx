import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from '../game/GameEngine';
import { SaveData, PlayerStats } from '../types/game';
import { Pause, RotateCcw, Home, Settings, Briefcase, Zap, Heart, Sword, Shield, Play } from 'lucide-react';
import { soundService } from '../services/sound';

interface GameScreenProps {
  saveData: SaveData;
  stageNum: number;
  onCoinCollect: (amount: number) => void;
  onItemCollect: (itemId: string) => void;
  onEnemyDefeat: (exp: number, coins: number) => void;
  onStageClear: () => void;
  onQuit: () => void;
  openSettings: () => void;
  openInventory: () => void;
  activePotionCount: number;
  onUsePotion: (dracoName: string, activeEngineRef: any) => boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  saveData,
  stageNum,
  onCoinCollect,
  onItemCollect,
  onEnemyDefeat,
  onStageClear,
  onQuit,
  openSettings,
  openInventory,
  activePotionCount,
  onUsePotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Local UI states synced from game engine events
  const [hp, setHp] = useState(10);
  const [maxHp, setMaxHp] = useState(10);
  const [energy, setEnergy] = useState(() => {
    const selected = saveData.selectedDraco;
    return selected === 'Archermon' ? 60 : selected === 'Shieldmon' ? 80 : selected === 'Assassinmon' ? 150 : selected === 'Flymon' ? 200 : 100;
  });
  const [maxEnergy, setMaxEnergy] = useState(() => {
    const selected = saveData.selectedDraco;
    return selected === 'Archermon' ? 60 : selected === 'Shieldmon' ? 80 : selected === 'Assassinmon' ? 150 : selected === 'Flymon' ? 200 : 100;
  });
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameover' | 'victory'>('playing');

  const selectedDraco = saveData.selectedDraco;
  const dracoStats = saveData.dracos[selectedDraco];

  // Resolve stats with safety defaults
  const level = dracoStats?.level || 1;
  const exp = dracoStats?.exp || 0;
  const requiredExp = level * 30;
  const expPercent = Math.min(100, Math.max(0, (exp / requiredExp) * 100));
  const hpPercent = Math.min(100, Math.max(0, (hp / maxHp) * 100));

  // Keep callbacks stable using a mutable ref to prevent GameEngine recreation during React state updates
  const callbacksRef = useRef({ onCoinCollect, onItemCollect, onEnemyDefeat, onStageClear });
  useEffect(() => {
    callbacksRef.current = { onCoinCollect, onItemCollect, onEnemyDefeat, onStageClear };
  });

  // Initialize Canvas Game Engine
  useEffect(() => {
    if (!canvasRef.current) return;

    // Set level-specific music tracks in sound service
    soundService.setStageMusic(stageNum);

    // Retrieve active Draco stats
    const stats: PlayerStats = {
      hp: dracoStats?.hp || 18,
      attack: dracoStats?.attack || 4,
      defense: dracoStats?.defense || 3,
      speed: dracoStats?.speed || 7,
      jump: dracoStats?.jump || 10,
      range: dracoStats?.range || 1,
      energyRegen: (dracoStats as any)?.energyRegen || 1.0,
      level: dracoStats?.level || 1,
    } as any;

    const engine = new GameEngine(
      canvasRef.current,
      stageNum,
      selectedDraco,
      stats,
      {
        onCoinCollect: (amount) => callbacksRef.current.onCoinCollect(amount),
        onItemCollect: (itemId) => callbacksRef.current.onItemCollect(itemId),
        onEnemyDefeat: (exp, coins) => callbacksRef.current.onEnemyDefeat(exp, coins),
        onHpChange: (currentHp, totalHp) => {
          setHp(currentHp);
          setMaxHp(totalHp);
        },
        onEnergyChange: (currentEnergy, totalEnergy) => {
          setEnergy(currentEnergy);
          setMaxEnergy(totalEnergy);
        },
        onStageClear: () => {
          setGameState('victory');
          callbacksRef.current.onStageClear();
        },
        onPlayerDeath: () => {
          setGameState('gameover');
          engine.pause();
        },
      }
    );

    engineRef.current = engine;

    return () => {
      engine.destroy();
    };
  }, [stageNum, selectedDraco]);

  // Handle updates to stats while active in-game (from items usage e.g. Upgrade stone or potion)
  useEffect(() => {
    if (engineRef.current && dracoStats) {
      const stats: PlayerStats = {
        hp: dracoStats.hp || 18,
        attack: dracoStats.attack || 4,
        defense: dracoStats.defense || 3,
        speed: dracoStats.speed || 7,
        jump: dracoStats.jump || 10,
        range: dracoStats.range || 1,
        energyRegen: (dracoStats as any).energyRegen || 1.0,
        level: dracoStats.level || 1,
      } as any;
      engineRef.current.triggerStatUpdate(stats);
    }
  }, [dracoStats]);

  // Pause / Resume triggers
  const handlePauseToggle = () => {
    soundService.playClick();
    if (gameState === 'playing') {
      engineRef.current?.pause();
      setGameState('paused');
    } else if (gameState === 'paused') {
      engineRef.current?.resume();
      setGameState('playing');
    }
  };

  const handleRestart = () => {
    soundService.playClick();
    setGameState('playing');
    const defaultMaxEnergy = selectedDraco === 'Archermon' ? 60 : selectedDraco === 'Shieldmon' ? 80 : selectedDraco === 'Assassinmon' ? 150 : selectedDraco === 'Flymon' ? 200 : 100;
    setEnergy(defaultMaxEnergy); // Reset UI energy state to 100% full
    
    // Re-initialize level
    if (engineRef.current) {
      engineRef.current.destroy();
    }
    // Simple state reset triggers
    const stats: PlayerStats = {
      hp: dracoStats?.hp || 18,
      attack: dracoStats?.attack || 4,
      defense: dracoStats?.defense || 3,
      speed: dracoStats?.speed || 7,
      jump: dracoStats?.jump || 10,
      range: dracoStats?.range || 1,
      energyRegen: (dracoStats as any)?.energyRegen || 1.0,
      level: dracoStats?.level || 1,
    } as any;
    
    if (canvasRef.current) {
      engineRef.current = new GameEngine(
        canvasRef.current,
        stageNum,
        selectedDraco,
        stats,
        {
          onCoinCollect,
          onItemCollect,
          onEnemyDefeat,
          onHpChange: (currentHp, totalHp) => {
            setHp(currentHp);
            setMaxHp(totalHp);
          },
          onEnergyChange: (currentEnergy, totalEnergy) => {
            setEnergy(currentEnergy);
            setMaxEnergy(totalEnergy);
          },
          onStageClear: () => {
            setGameState('victory');
            onStageClear();
          },
          onPlayerDeath: () => {
            setGameState('gameover');
            engineRef.current?.pause();
          },
        }
      );
    }
  };

  const handleQuickHeal = () => {
    if (activePotionCount > 0) {
      onUsePotion(selectedDraco, engineRef);
    }
  };

  // Button Action handlers for on-screen joystick overlays (mobile touch support)
  const triggerMobileAction = (action: 'left' | 'right' | 'jump' | 'attack' | 'special' | 'down') => {
    engineRef.current?.triggerAction(action);
  };

  const stopMobileAction = (action: 'left' | 'right' | 'down') => {
    engineRef.current?.stopAction(action);
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* HUD Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-2xl mb-4 shadow-sm">
        {/* Left Side: Companion Avatar & Level */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center border border-stone-200 font-display text-xl">
              {selectedDraco === 'Jumpmon' ? '🦎' : selectedDraco === 'Archermon' ? '🦖' : selectedDraco === 'Shieldmon' ? '🐢' : selectedDraco === 'Assassinmon' ? '🥷' : '🐝'}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-stone-900 border border-white text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md">
              Lv.{level}
            </div>
          </div>
          <div>
            <div className="font-bold text-sm text-stone-900 leading-none flex items-center gap-1.5">
              {selectedDraco}
              <span className="text-[10px] uppercase font-semibold text-stone-400">
                {selectedDraco === 'Jumpmon' ? 'Leaper' : selectedDraco === 'Archermon' ? 'Ranger' : selectedDraco === 'Shieldmon' ? 'Guardian' : selectedDraco === 'Assassinmon' ? 'Assassin' : 'Aerialist'}
              </span>
            </div>
            {/* EXP Bar */}
            <div className="w-32 mt-1.5">
              <div className="flex justify-between text-[8px] font-bold text-stone-400 font-mono">
                <span>EXP</span>
                <span>{exp}/{requiredExp}</span>
              </div>
              <div className="w-full h-1 bg-stone-100 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: HP & Ultimate Status Bars */}
        <div className="flex-1 max-w-xs mx-6 space-y-2.5">
          {/* Health Bar */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold text-stone-600 font-mono mb-0.5">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                HEALTH
              </span>
              <span>{hp}/{maxHp}</span>
            </div>
            <div className="h-2.5 w-full bg-stone-100 border border-stone-200/50 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${hpPercent}%` }}
                className={`h-full rounded-full ${
                  hpPercent < 25 ? 'bg-red-500 animate-pulse' : hpPercent < 50 ? 'bg-amber-400' : 'bg-rose-500'
                }`}
              />
            </div>
          </div>

          {/* Ultimate Energy Bar */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold text-stone-600 font-mono mb-0.5">
              <span className="flex items-center gap-1 text-amber-600">
                {level < 5 ? (
                  <span className="text-purple-600 flex items-center gap-1 font-bold">
                    🔒 ULTIMATE LOCKED (REQ. LV.5)
                  </span>
                ) : (
                  <>⚡ {selectedDraco === 'Jumpmon' ? 'Meteor Smackdown' : selectedDraco === 'Archermon' ? 'Arrow Shower' : selectedDraco === 'Shieldmon' ? 'Avatar' : selectedDraco === 'Assassinmon' ? 'Death of 1000 Knives' : 'Laser Beam'}</>
                )}
              </span>
              <span>{Math.floor(energy)}/{maxEnergy}</span>
            </div>
            <div className="h-2.5 w-full bg-stone-100 border border-stone-200/50 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${level < 5 ? 0 : Math.min(100, (energy / maxEnergy) * 100)}%` }}
                className={`h-full rounded-full ${
                  level < 5 ? 'bg-stone-300' : energy >= maxEnergy ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse border border-amber-300' : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Inventory triggers, Settings, Pause */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-xs font-mono font-bold text-amber-700 shadow-sm">
            🪙 <span>{saveData.player.coins}</span>
          </div>

          <button
            onClick={handleQuickHeal}
            disabled={activePotionCount <= 0}
            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all active:scale-95 ${
              activePotionCount > 0
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 shadow-sm'
                : 'bg-stone-50 border-stone-200 text-stone-300 cursor-not-allowed'
            }`}
            title={`Use Potion (${activePotionCount} left)`}
          >
            <Heart className="w-4 h-4" />
            {activePotionCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 border border-white text-white text-[9px] font-bold font-mono px-1 rounded-full">
                {activePotionCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { soundService.playClick(); openInventory(); }}
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 shadow-sm transition-all active:scale-95"
            title="Open Bag"
          >
            <Briefcase className="w-4 h-4" />
          </button>

          <button
            onClick={handlePauseToggle}
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-900 shadow-sm transition-all active:scale-95"
            title="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Wrapper & Canvas */}
      <div className="relative w-full max-w-4xl border border-stone-200/80 rounded-3xl overflow-hidden bg-stone-950 shadow-2xl aspect-[5/3] md:aspect-[8/4.8]">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="w-full h-full block bg-emerald-50"
        />

        {/* OVERLAYS */}
        <AnimatePresence>
          {/* Pause Menu Overlay */}
          {gameState === 'paused' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            >
              <div className="w-72 bg-white rounded-3xl p-6 border border-stone-200 shadow-xl text-center space-y-4">
                <h3 className="text-xl font-bold text-stone-950 font-display">Adventure Suspended</h3>
                <p className="text-xs text-stone-400 leading-normal">Your journey is paused. Equip items or change options.</p>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={handlePauseToggle}
                    className="w-full py-2.5 px-4 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Resume Adventure
                  </button>

                  <button
                    onClick={handleRestart}
                    className="w-full py-2.5 px-4 bg-stone-50 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-100 transition-all border border-stone-200 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restart Level
                  </button>

                  <button
                    onClick={() => { soundService.playClick(); openSettings(); }}
                    className="w-full py-2.5 px-4 bg-stone-50 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-100 transition-all border border-stone-200 flex items-center justify-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Settings
                  </button>

                  <button
                    onClick={() => { soundService.playClick(); onQuit(); }}
                    className="w-full py-2.5 px-4 bg-white text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all border border-rose-200 flex items-center justify-center gap-2"
                  >
                    <Home className="w-3.5 h-3.5" />
                    Return to Camp
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Game Over Defeat Overlay */}
          {gameState === 'gameover' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-950/70 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            >
              <div className="w-72 bg-white rounded-3xl p-6 border border-red-200 shadow-xl text-center space-y-4">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-xl mx-auto">
                  💀
                </div>
                <h3 className="text-xl font-bold text-rose-950 font-display">Draco Defeated</h3>
                <p className="text-xs text-stone-400 leading-normal">
                  Your companion fell in battle. You lose no progress, but must restart the stage.
                </p>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={handleRestart}
                    className="w-full py-2.5 px-4 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Try Again
                  </button>

                  <button
                    onClick={() => { soundService.playClick(); onQuit(); }}
                    className="w-full py-2.5 px-4 bg-stone-50 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-100 transition-all border border-stone-200 flex items-center justify-center gap-2"
                  >
                    <Home className="w-3.5 h-3.5" />
                    Return to Camp
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stage Cleared Victory Overlay */}
          {gameState === 'victory' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-950/70 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            >
              <div className="w-72 bg-white rounded-3xl p-6 border border-emerald-200 shadow-xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl mx-auto animate-bounce">
                  ✨
                </div>
                <h3 className="text-xl font-bold text-emerald-950 font-display">Portal Cleared</h3>
                <p className="text-xs text-stone-400 leading-normal">
                  Excellent work! The next portal is ready to explore.
                </p>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => { soundService.playClick(); onQuit(); }}
                    className="w-full py-2.5 px-4 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all"
                  >
                    Return to Camp
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Instruction Banner */}
      <div className="w-full max-w-4xl mt-3 flex items-center justify-between text-xs text-stone-400 px-2 select-none">
        <div className="flex flex-wrap gap-4 items-center">
          <span><span className="font-bold border border-stone-200 rounded px-1.5 py-0.5 bg-stone-50 text-stone-600 mr-1 font-mono shadow-sm">A</span>/
                <span className="font-bold border border-stone-200 rounded px-1.5 py-0.5 bg-stone-50 text-stone-600 mr-1 font-mono shadow-sm">D</span> Move</span>
          <span><span className="font-bold border border-stone-200 rounded px-1.5 py-0.5 bg-stone-50 text-stone-600 mr-1 font-mono shadow-sm">SPACE</span> Jump</span>
          <span><span className="font-bold border border-stone-200 rounded px-1.5 py-0.5 bg-stone-50 text-stone-600 mr-1 font-mono shadow-sm">S</span> Drop Platform</span>
          <span><span className="font-bold border border-stone-200 rounded px-1.5 py-0.5 bg-stone-50 text-stone-600 mr-1 font-mono shadow-sm">J</span> Attack (Swing)</span>
          <span><span className="font-bold border border-stone-200 rounded px-1.5 py-0.5 bg-stone-50 text-stone-600 mr-1 font-mono shadow-sm">K</span> Special</span>
          {selectedDraco === 'Jumpmon' && <span className="text-amber-600 font-semibold">(Double tap jump for 2x leap)</span>}
        </div>
        <div>
          <span>Scroll down for mobile touch layout.</span>
        </div>
      </div>

      {/* Mobile Touch Controller Panel */}
      <div className="w-full max-w-xl grid grid-cols-2 gap-8 mt-6 p-4 border border-stone-200 bg-white/50 backdrop-blur-md rounded-3xl shadow-inner select-none select-none">
        {/* Left Side: Joystick D-Pad */}
        <div className="flex items-center justify-center gap-3">
          <button
            onMouseDown={() => triggerMobileAction('left')}
            onMouseUp={() => stopMobileAction('left')}
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('left'); }}
            onTouchEnd={() => stopMobileAction('left')}
            className="w-14 h-14 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-center text-white active:bg-stone-700 transition-all font-mono font-bold select-none"
          >
            ◀
          </button>
          
          <div className="flex flex-col gap-3">
            <button
              onMouseDown={() => triggerMobileAction('down')}
              onMouseUp={() => stopMobileAction('down')}
              onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('down'); }}
              onTouchEnd={() => stopMobileAction('down')}
              className="w-14 h-14 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-center text-white active:bg-stone-700 transition-all font-mono font-bold select-none"
            >
              ▼
            </button>
          </div>

          <button
            onMouseDown={() => triggerMobileAction('right')}
            onMouseUp={() => stopMobileAction('right')}
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('right'); }}
            onTouchEnd={() => stopMobileAction('right')}
            className="w-14 h-14 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-center text-white active:bg-stone-700 transition-all font-mono font-bold select-none"
          >
            ▶
          </button>
        </div>

        {/* Right Side: Skill Buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Jump */}
          <button
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('jump'); }}
            onMouseDown={() => triggerMobileAction('jump')}
            className="w-14 h-14 bg-amber-500 border border-amber-400 rounded-full flex flex-col items-center justify-center text-white font-semibold text-xs active:bg-amber-600 transition-all shadow-md select-none"
          >
            <span>LEAP</span>
          </button>

          {/* Special */}
          <button
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('special'); }}
            onMouseDown={() => triggerMobileAction('special')}
            className="w-12 h-12 bg-purple-600 border border-purple-500 rounded-full flex flex-col items-center justify-center text-white font-semibold text-[10px] active:bg-purple-700 transition-all shadow-md select-none"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>SKILL</span>
          </button>

          {/* Attack */}
          <button
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('attack'); }}
            onMouseDown={() => triggerMobileAction('attack')}
            className="w-16 h-16 bg-rose-500 border border-rose-400 rounded-full flex flex-col items-center justify-center text-white font-bold text-sm active:bg-rose-600 transition-all shadow-lg select-none"
          >
            <Sword className="w-5 h-5 mb-0.5" />
            <span>SLAY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default GameScreen;
