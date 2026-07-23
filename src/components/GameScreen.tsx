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
    return selected === 'Archermon' ? 60 : selected === 'Shieldmon' ? 80 : selected === 'Assassinmon' ? 150 : selected === 'Flymon' ? 200 : selected === 'Whitemon' ? 120 : selected === 'Magemon' ? 300 : selected === 'Bombamon' ? 120 : 100;
  });
  const [maxEnergy, setMaxEnergy] = useState(() => {
    const selected = saveData.selectedDraco;
    return selected === 'Archermon' ? 60 : selected === 'Shieldmon' ? 80 : selected === 'Assassinmon' ? 150 : selected === 'Flymon' ? 200 : selected === 'Whitemon' ? 120 : selected === 'Magemon' ? 300 : selected === 'Bombamon' ? 120 : 100;
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
    const defaultMaxEnergy = selectedDraco === 'Archermon' ? 60 : selectedDraco === 'Shieldmon' ? 80 : selectedDraco === 'Assassinmon' ? 150 : selectedDraco === 'Flymon' ? 200 : selectedDraco === 'Whitemon' ? 120 : selectedDraco === 'Magemon' ? 300 : selectedDraco === 'Bombamon' ? 120 : 100;
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

  // Dynamic Canvas Resolution Scaling matching Device (capped at 1920px max width)
  useEffect(() => {
    const updateCanvasDimensions = () => {
      if (canvasRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const displayW = Math.min(1920, Math.floor(rect.width || window.innerWidth));
        const displayH = Math.floor(rect.height || window.innerHeight);
        if (displayW > 0 && displayH > 0) {
          canvasRef.current.width = displayW;
          canvasRef.current.height = displayH;
        }
      }
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => window.removeEventListener('resize', updateCanvasDimensions);
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
    <div ref={containerRef} className="w-full h-full z-50 bg-stone-950 overflow-hidden select-none relative flex justify-center items-center">
      {/* 100% Full Viewport Canvas (Dynamic device resolution, max 1920px width) */}
      <div className="w-full h-full max-w-[1920px] mx-auto relative overflow-hidden flex items-center justify-center bg-stone-950 z-10">
        <canvas
          ref={canvasRef}
          className="w-full h-full block bg-stone-950"
        />
      </div>

      {/* Transparent Floating Overlapping Top HUD Header Bar */}
      <div className="absolute top-1 left-1 right-1 sm:top-3 sm:left-4 sm:right-4 max-w-[1920px] mx-auto z-30 flex items-center justify-between pointer-events-none gap-1 sm:gap-2">
        {/* Left Side: Companion Avatar & Level & EXP */}
        <div className="flex items-center gap-1.5 sm:gap-3 pointer-events-auto bg-stone-950/80 backdrop-blur-md px-1.5 py-1 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-stone-800/80 shadow-xl shrink-0">
          <div className="relative shrink-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-stone-800/90 flex items-center justify-center border border-stone-700 font-display text-xs sm:text-base">
              {selectedDraco === 'Jumpmon' ? '🦎' : selectedDraco === 'Archermon' ? '🦖' : selectedDraco === 'Shieldmon' ? '🐢' : selectedDraco === 'Assassinmon' ? '🥷' : selectedDraco === 'Flymon' ? '🐝' : selectedDraco === 'Whitemon' ? '🦅' : selectedDraco === 'Magemon' ? '🧙' : selectedDraco === 'Bombamon' ? '💣' : '🐲'}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 border border-stone-900 text-stone-950 text-[7px] sm:text-[9px] font-extrabold font-mono px-0.5 sm:px-1 py-0.2 rounded">
              Lv.{level}
            </div>
          </div>
          <div className="min-w-0 hidden min-[360px]:block">
            <div className="font-bold text-[10px] sm:text-sm text-stone-100 leading-none flex items-center gap-1 truncate">
              <span className="truncate">{selectedDraco}</span>
            </div>
            {/* EXP Bar */}
            <div className="w-12 sm:w-24 mt-0.5 sm:mt-1">
              <div className="flex justify-between text-[6px] sm:text-[8px] font-bold text-stone-400 font-mono">
                <span>EXP</span>
                <span>{exp}/{requiredExp}</span>
              </div>
              <div className="w-full h-0.5 sm:h-1 bg-stone-800 rounded-full mt-0.5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Space-Saving Circular Health & Energy Gauges */}
        <div className="flex items-center gap-1 sm:gap-3 pointer-events-auto bg-stone-950/80 backdrop-blur-md px-1.5 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-stone-800/80 shadow-xl shrink-0">
          {/* Circular Health Gauge */}
          <div className="flex flex-col items-center justify-center relative group" title={`Health: ${hp}/${maxHp}`}>
            <div className="relative w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-stone-800/90"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={hpPercent < 25 ? "text-red-500 animate-pulse" : hpPercent < 50 ? "text-amber-400" : "text-rose-500"}
                  strokeDasharray={`${hpPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-500 fill-rose-500 mb-0.5" />
                <span className="text-[7px] sm:text-[9px] font-black font-mono text-white tracking-tighter">
                  {hp}/{maxHp}
                </span>
              </div>
            </div>
          </div>

          {/* Circular Laser Beam / Energy Gauge */}
          <div className="flex flex-col items-center justify-center relative group" title={`Laser/Energy: ${Math.floor(energy)}/${maxEnergy}`}>
            <div className="relative w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-stone-800/90"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={level < 5 ? "text-stone-600" : energy >= maxEnergy ? "text-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse" : "text-amber-500"}
                  strokeDasharray={`${level < 5 ? 0 : Math.min(100, (energy / maxEnergy) * 100)}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <Zap className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mb-0.5 ${energy >= maxEnergy ? 'text-amber-300 fill-amber-300' : 'text-amber-400'}`} />
                <span className="text-[7px] sm:text-[9px] font-black font-mono text-amber-300 tracking-tighter">
                  {Math.floor(energy)}/{maxEnergy}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Gold, Potion Inventory, Bag, Pause, Fullscreen */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 pointer-events-auto bg-stone-950/80 backdrop-blur-md p-1 sm:p-2 rounded-xl sm:rounded-2xl border border-stone-800/80 shadow-xl shrink-0">
          {/* Gold */}
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-[9px] sm:text-xs font-mono font-bold text-amber-400 shadow-sm">
            🪙 <span>{saveData.player.coins}</span>
          </div>

          {/* Potion inventory */}
          <button
            onClick={handleQuickHeal}
            disabled={activePotionCount <= 0}
            className={`p-1 sm:p-1.5 rounded-lg sm:rounded-xl border flex items-center justify-center relative transition-all active:scale-95 ${
              activePotionCount > 0
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border-rose-500/50 shadow-sm'
                : 'bg-stone-800 border-stone-700 text-stone-600 cursor-not-allowed'
            }`}
            title={`Use Potion [H] (${activePotionCount} left)`}
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
            {activePotionCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 border border-stone-900 text-white text-[7px] sm:text-[9px] font-bold font-mono px-0.5 sm:px-1 rounded-full">
                {activePotionCount}
              </span>
            )}
          </button>

          {/* Bag Inventory */}
          <button
            onClick={() => { soundService.playClick(); openInventory(); }}
            className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-300 shadow-sm transition-all active:scale-95"
            title="Open Bag"
          >
            <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Pause */}
          <button
            onClick={handlePauseToggle}
            className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-white shadow-sm transition-all active:scale-95"
            title="Pause Game"
          >
            <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-amber-400 shadow-sm transition-all active:scale-95 flex items-center justify-center"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>

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

        {/* Right Side: Action Buttons (Top: Jump & Slay, Bottom: Skill & Ult) */}
        <div className="pointer-events-auto flex flex-col gap-2.5 items-end select-none">
          {/* Top Row: Jump (left) & Slay (right) */}
          <div className="flex items-center gap-3 justify-end">
            {/* Jump */}
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('jump'); }}
              onMouseDown={() => triggerMobileAction('jump')}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/90 border-2 border-amber-400 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white font-black text-[10px] sm:text-xs active:bg-amber-600 active:scale-95 transition-all shadow-xl"
            >
              <span>JUMP</span>
            </button>

            {/* Slay */}
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('attack'); }}
              onMouseDown={() => triggerMobileAction('attack')}
              className="w-13 h-13 sm:w-15 sm:h-15 bg-rose-500/90 border-2 border-rose-400 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white font-black text-xs sm:text-sm active:bg-rose-600 active:scale-95 transition-all shadow-xl"
            >
              <Sword className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
              <span>SLAY</span>
            </button>
          </div>

          {/* Bottom Row: Skill (left) & Ult (right) */}
          <div className="flex items-center gap-3 justify-end">
            {/* Skill */}
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('special'); }}
              onMouseDown={() => triggerMobileAction('special')}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-600/90 border-2 border-purple-500 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-white font-black text-[9px] sm:text-[10px] active:bg-purple-700 active:scale-95 transition-all shadow-xl"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SKILL</span>
            </button>

            {/* Ultimate */}
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerMobileAction('ultimate'); }}
              onMouseDown={() => triggerMobileAction('ultimate')}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center font-black text-[9px] sm:text-[10px] active:scale-95 transition-all shadow-xl border-2 backdrop-blur-md ${
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameScreen;
