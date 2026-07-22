import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngine } from '../game/GameEngine';
import { SaveData, PlayerStats } from '../types/game';
import { Pause, RotateCcw, Home, Settings, Briefcase, Zap, Heart, Sword, Shield, Play, Maximize, Minimize } from 'lucide-react';
import { soundService } from '../services/sound';

interface GameScreenProps {
  saveData: SaveData;
  stageNum: number;
  onCoinCollect: (amount: number) => void;
  onItemCollect: (itemId: string) => void;
  onEnemyDefeat: (exp: number, coins: number) => void;
  onStageClear: () => void;
  onNextLevel: () => void;
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
  onNextLevel,
  onQuit,
  openSettings,
  openInventory,
  activePotionCount,
  onUsePotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Local UI states synced from game engine events
  const [hp, setHp] = useState(10);
  const [maxHp, setMaxHp] = useState(10);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [energy, setEnergy] = useState(() => {
    const selected = saveData.selectedDraco;
    return selected === 'Archermon' ? 60 : selected === 'Shieldmon' ? 80 : selected === 'Assassinmon' ? 150 : selected === 'Flymon' ? 200 : selected === 'Whitemon' ? 120 : selected === 'Magemon' ? 300 : 100;
  });
  const [maxEnergy, setMaxEnergy] = useState(() => {
    const selected = saveData.selectedDraco;
    return selected === 'Archermon' ? 60 : selected === 'Shieldmon' ? 80 : selected === 'Assassinmon' ? 150 : selected === 'Flymon' ? 200 : selected === 'Whitemon' ? 120 : selected === 'Magemon' ? 300 : 100;
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
  const ultCost = selectedDraco === 'Magemon' ? 150 : maxEnergy;

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
        onPauseToggle: () => handlePauseToggle(),
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

  // Reset game state to 'playing' when stage changes (Next Level button)
  useEffect(() => {
    setGameState('playing');
  }, [stageNum]);

  // Global Key Listener: context-aware per game state
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (gameState === 'victory' || gameState === 'gameover') {
          soundService.playClick();
          onQuit();
        } else {
          handlePauseToggle(); // toggles pause/resume
        }
      } else if (e.key === 'Enter') {
        if (gameState === 'victory') {
          e.preventDefault();
          soundService.playClick();
          onNextLevel();
        } else if (gameState === 'gameover') {
          e.preventDefault();
          handleRestart();
        } else if (gameState === 'paused') {
          e.preventDefault();
          handlePauseToggle(); // resume
        }
      } else if (e.key.toLowerCase() === 'r' && gameState === 'paused') {
        e.preventDefault();
        handleRestart();
      } else if (e.key.toLowerCase() === 'q' && gameState === 'paused') {
        e.preventDefault();
        soundService.playClick();
        onQuit();
      } else if (e.key.toLowerCase() === 'h' && gameState === 'playing') {
        e.preventDefault();
        handleQuickHeal();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [gameState, activePotionCount, selectedDraco]);

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
    const defaultMaxEnergy = selectedDraco === 'Archermon' ? 60 : selectedDraco === 'Shieldmon' ? 80 : selectedDraco === 'Assassinmon' ? 150 : selectedDraco === 'Flymon' ? 200 : selectedDraco === 'Whitemon' ? 120 : selectedDraco === 'Magemon' ? 300 : 100;
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
          onPauseToggle: () => handlePauseToggle(),
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

  const handleToggleFullscreen = () => {
    soundService.playClick();
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else if ((containerRef.current as any)?.webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const handleQuickHeal = () => {
    if (activePotionCount > 0) {
      onUsePotion(selectedDraco, engineRef);
    }
  };

  // Button Action handlers for on-screen joystick overlays (mobile touch support)
  const triggerMobileAction = (action: 'left' | 'right' | 'jump' | 'attack' | 'special' | 'ultimate' | 'down') => {
    engineRef.current?.triggerAction(action);
  };

  const stopMobileAction = (action: 'left' | 'right' | 'down') => {
    engineRef.current?.stopAction(action);
  };

  const isUltimateReady = level >= 5 && energy >= ultCost;

  return (
    <div ref={containerRef} className="w-full h-full z-50 bg-stone-950 overflow-hidden select-none relative flex flex-col justify-between">
      {/* Top Fixed HUD Header Bar (Does NOT block or overlap canvas) */}
      <div className="w-full shrink-0 z-20 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 bg-stone-900 border-b border-stone-800 text-white pointer-events-auto shadow-md">
        {/* Left Side: Companion Avatar & Level */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-stone-800 flex items-center justify-center border border-stone-700 font-display text-base sm:text-lg">
              {selectedDraco === 'Jumpmon' ? '🦎' : selectedDraco === 'Archermon' ? '🦖' : selectedDraco === 'Shieldmon' ? '🐢' : selectedDraco === 'Assassinmon' ? '🥷' : '🐝'}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 border border-stone-900 text-stone-950 text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded">
              Lv.{level}
            </div>
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-stone-100 leading-none flex items-center gap-1.5">
              {selectedDraco}
              <span className="text-[9px] uppercase font-semibold text-stone-400 hidden sm:inline">
                {selectedDraco === 'Jumpmon' ? 'Leaper' : selectedDraco === 'Archermon' ? 'Ranger' : selectedDraco === 'Shieldmon' ? 'Guardian' : selectedDraco === 'Assassinmon' ? 'Assassin' : 'Aerialist'}
              </span>
            </div>
            {/* EXP Bar */}
            <div className="w-24 sm:w-32 mt-1">
              <div className="flex justify-between text-[8px] font-bold text-stone-400 font-mono">
                <span>EXP</span>
                <span>{exp}/{requiredExp}</span>
              </div>
              <div className="w-full h-1 bg-stone-800 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: HP & Ultimate Status Bars */}
        <div className="flex-1 max-w-xs mx-3 sm:mx-6 space-y-1 sm:space-y-1.5">
          {/* Health Bar */}
          <div>
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-stone-300 font-mono mb-0.5">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                HEALTH
              </span>
              <span>{hp}/{maxHp}</span>
            </div>
            <div className="h-2 sm:h-2.5 w-full bg-stone-800 border border-stone-700/50 rounded-full overflow-hidden relative shadow-inner">
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
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-stone-300 font-mono mb-0.5">
              <span className="flex items-center gap-1 text-amber-400 truncate max-w-[170px] sm:max-w-none">
                {level < 5 ? (
                  <span className="text-purple-400 flex items-center gap-1 font-bold text-[8px] sm:text-[10px]">
                    🔒 ULT LOCKED (LV.5)
                  </span>
                ) : (
                  <>⚡ {selectedDraco === 'Jumpmon' ? 'Meteor Smackdown' : selectedDraco === 'Archermon' ? 'Arrow Shower' : selectedDraco === 'Shieldmon' ? 'Avatar' : selectedDraco === 'Assassinmon' ? 'Single Slash of Death' : selectedDraco === 'Whitemon' ? 'Primal Roar' : selectedDraco === 'Magemon' ? 'Trio Orb Blast' : 'Laser Beam'}</>
                )}
              </span>
              <span>{Math.floor(energy)}/{maxEnergy}</span>
            </div>
            <div className="h-2 sm:h-2.5 w-full bg-stone-800 border border-stone-700/50 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${level < 5 ? 0 : Math.min(100, (energy / maxEnergy) * 100)}%` }}
                className={`h-full rounded-full ${
                  level < 5 ? 'bg-stone-600' : energy >= maxEnergy ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse border border-amber-300' : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Inventory triggers, Settings, Pause */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs font-mono font-bold text-amber-400 shadow-sm">
            🪙 <span>{saveData.player.coins}</span>
          </div>

          <button
            onClick={handleQuickHeal}
            disabled={activePotionCount <= 0}
            className={`p-1.5 sm:p-2 rounded-xl border flex items-center justify-center relative transition-all active:scale-95 ${
              activePotionCount > 0
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border-rose-500/50 shadow-sm'
                : 'bg-stone-800 border-stone-700 text-stone-600 cursor-not-allowed'
            }`}
            title={`Use Potion [H] (${activePotionCount} left)`}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {activePotionCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 border border-stone-900 text-white text-[9px] font-bold font-mono px-1 rounded-full">
                {activePotionCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { soundService.playClick(); openInventory(); }}
            className="p-1.5 sm:p-2 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-300 shadow-sm transition-all active:scale-95"
            title="Open Bag"
          >
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={handlePauseToggle}
            className="p-1.5 sm:p-2 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-white shadow-sm transition-all active:scale-95"
            title="Pause Game"
          >
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 sm:p-2 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-amber-400 shadow-sm transition-all active:scale-95 flex items-center justify-center"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>

      {/* Center Canvas View Area */}
      <div className="flex-1 w-full h-full relative flex items-center justify-center bg-stone-950 overflow-hidden">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="w-full h-full object-contain block bg-stone-950"
        />

      {/* OVERLAYS (Pause / Defeat / Victory) */}
      <AnimatePresence>
        {/* Pause Menu Overlay */}
        {gameState === 'paused' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-md flex flex-col items-center justify-center z-30"
          >
            <div className="w-80 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl text-center space-y-4">
              <h3 className="text-xl font-bold text-stone-950 font-display">Adventure Suspended</h3>
              <p className="text-xs text-stone-400 leading-normal">Your journey is paused. Equip items or change options.</p>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  autoFocus
                  onClick={handlePauseToggle}
                  className="w-full py-3 px-4 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-stone-800 active:scale-95 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><Play className="w-3.5 h-3.5" /> Resume Adventure</span>
                  <span className="text-[10px] font-mono bg-stone-700 px-2 py-0.5 rounded-lg">ESC / ENTER</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 px-4 bg-stone-50 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-100 active:scale-95 transition-all border border-stone-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5" /> Restart Level</span>
                  <span className="text-[10px] font-mono bg-stone-200 px-2 py-0.5 rounded-lg">R</span>
                </button>

                <button
                  onClick={() => { soundService.playClick(); openSettings(); }}
                  className="w-full py-2.5 px-4 bg-stone-50 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-100 active:scale-95 transition-all border border-stone-200 flex items-center justify-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>

                <button
                  onClick={() => { soundService.playClick(); onQuit(); }}
                  className="w-full py-2.5 px-4 bg-white text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 active:scale-95 transition-all border border-rose-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><Home className="w-3.5 h-3.5" /> Return to Camp</span>
                  <span className="text-[10px] font-mono bg-rose-100 text-rose-400 px-2 py-0.5 rounded-lg">Q</span>
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
            className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center z-30"
          >
            <div className="w-80 bg-white rounded-3xl p-6 border border-red-200 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-xl mx-auto">
                💀
              </div>
              <h3 className="text-xl font-bold text-rose-950 font-display">Draco Defeated</h3>
              <p className="text-xs text-stone-400 leading-normal">
                Your companion fell in battle. You lose no progress, but must restart the stage.
              </p>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  autoFocus
                  onClick={handleRestart}
                  className="w-full py-3 px-4 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 active:scale-95 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5" /> Try Again</span>
                  <span className="text-[10px] font-mono bg-rose-700/50 px-2 py-0.5 rounded-lg">ENTER</span>
                </button>

                <button
                  onClick={() => { soundService.playClick(); onQuit(); }}
                  className="w-full py-2.5 px-4 bg-stone-50 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-100 active:scale-95 transition-all border border-stone-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><Home className="w-3.5 h-3.5" /> Return to Camp</span>
                  <span className="text-[10px] font-mono bg-stone-300 px-2 py-0.5 rounded-lg">ESC</span>
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
            className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center z-30"
          >
            <div className="w-80 bg-white rounded-3xl p-6 border border-emerald-200 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl mx-auto animate-bounce">
                ✨
              </div>
              <h3 className="text-xl font-bold text-emerald-950 font-display">Stage Cleared!</h3>
              <p className="text-xs text-stone-400 leading-normal">
                Portal entered! Excellent work, warrior!
              </p>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  autoFocus
                  onClick={() => { soundService.playClick(); onNextLevel(); }}
                  className="w-full py-3 px-4 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-between shadow-lg"
                >
                  <span>Next Level</span>
                  <span className="text-[10px] font-mono bg-emerald-700/50 px-2 py-0.5 rounded-lg">ENTER</span>
                </button>

                <button
                  onClick={() => { soundService.playClick(); onQuit(); }}
                  className="w-full py-2.5 px-4 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 active:scale-95 transition-all border border-stone-200 flex items-center justify-between"
                >
                  <span>Return to Camp</span>
                  <span className="text-[10px] font-mono bg-stone-300 px-2 py-0.5 rounded-lg">ESC</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating In-Game Mobile / On-Screen Action Controls Overlay */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 z-20 flex items-end justify-between pointer-events-none">
        {/* Left Side: Joystick D-Pad */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onMouseDown={() => triggerMobileAction('left')}
            onMouseUp={() => stopMobileAction('left')}
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('left'); }}
            onTouchEnd={() => stopMobileAction('left')}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-stone-900/80 border-2 border-stone-700/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-white active:bg-stone-700 active:scale-95 transition-all font-mono font-bold shadow-xl select-none"
          >
            ◀
          </button>
          
          <button
            onMouseDown={() => triggerMobileAction('down')}
            onMouseUp={() => stopMobileAction('down')}
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('down'); }}
            onTouchEnd={() => stopMobileAction('down')}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-stone-900/80 border-2 border-stone-700/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-white active:bg-stone-700 active:scale-95 transition-all font-mono font-bold shadow-xl select-none"
          >
            ▼
          </button>

          <button
            onMouseDown={() => triggerMobileAction('right')}
            onMouseUp={() => stopMobileAction('right')}
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('right'); }}
            onTouchEnd={() => stopMobileAction('right')}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-stone-900/80 border-2 border-stone-700/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-white active:bg-stone-700 active:scale-95 transition-all font-mono font-bold shadow-xl select-none"
          >
            ▶
          </button>
        </div>

        {/* Right Side: Skill & Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Jump */}
          <button
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('jump'); }}
            onMouseDown={() => triggerMobileAction('jump')}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/90 border-2 border-amber-400 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white font-black text-[10px] sm:text-xs active:bg-amber-600 active:scale-95 transition-all shadow-xl select-none"
          >
            <span>JUMP</span>
          </button>

          {/* Special Skill */}
          <button
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('special'); }}
            onMouseDown={() => triggerMobileAction('special')}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-600/90 border-2 border-purple-500 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white font-black text-[9px] sm:text-[10px] active:bg-purple-700 active:scale-95 transition-all shadow-xl select-none"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>SKILL</span>
          </button>

          {/* Ultimate */}
          <button
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('ultimate'); }}
            onMouseDown={() => triggerMobileAction('ultimate')}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center font-black text-[9px] sm:text-[10px] active:scale-95 transition-all shadow-xl select-none border-2 backdrop-blur-md ${
              isUltimateReady
                ? 'bg-amber-400/90 border-amber-300 text-amber-950 animate-pulse shadow-[0_0_14px_#fbbf24]'
                : level < 5
                ? 'bg-stone-900/80 border-stone-800 text-stone-600 cursor-not-allowed'
                : 'bg-indigo-950/90 border-purple-500 text-purple-300'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isUltimateReady ? 'text-amber-950 fill-amber-950' : 'text-purple-300 fill-purple-300'}`} />
            <span>ULT</span>
          </button>

          {/* Attack */}
          <button
            onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('attack'); }}
            onMouseDown={() => triggerMobileAction('attack')}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-500/90 border-2 border-rose-400 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white font-black text-xs sm:text-sm active:bg-rose-600 active:scale-95 transition-all shadow-xl select-none"
          >
            <Sword className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span>SLAY</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};
export default GameScreen;
