import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayerStats } from '../types/game';
import { Sparkles, Dices, Award } from 'lucide-react';
import { soundService } from '../services/sound';

interface LevelUpModalProps {
  dracoName: string;
  oldLevel: number;
  newLevel: number;
  baseIncrease: Partial<PlayerStats>;
  bonusRoll: number;
  currentStats?: PlayerStats;
  onApplyBonus: (stat: keyof PlayerStats) => void;
  pendingCount?: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  dracoName,
  oldLevel,
  newLevel,
  baseIncrease,
  bonusRoll,
  currentStats,
  onApplyBonus,
  pendingCount,
}) => {
  const [diceRolling, setDiceRolling] = useState(true);
  const [currentDiceVal, setCurrentDiceVal] = useState(1);

  useEffect(() => {
    setDiceRolling(true);
    setCurrentDiceVal(1);
    let count = 0;
    const interval = setInterval(() => {
      setCurrentDiceVal(Math.round(((Math.floor(Math.random() * 10) + 1) * 0.1) * 10) / 10);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setCurrentDiceVal(bonusRoll);
        setDiceRolling(false);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [bonusRoll, oldLevel, newLevel]);

  const handleSelectStat = (stat: keyof PlayerStats) => {
    if (diceRolling) return;
    const val = currentStats ? (currentStats as any)[stat] || 0 : 0;
    if (stat === 'speed' && val >= 20) return;
    if (stat === 'jump' && val >= 14) return;
    soundService.playClick();
    onApplyBonus(stat);
  };

  const statDetails: { key: keyof PlayerStats; name: string; icon: string }[] = [
    { key: 'hp', name: 'HP (Health)', icon: '❤️' },
    { key: 'attack', name: 'Attack Power', icon: '⚔️' },
    { key: 'defense', name: 'Defense Rating', icon: '🛡️' },
    { key: 'speed', name: 'Movement Speed', icon: '👟' },
    { key: 'jump', name: 'Jump Velocity', icon: '🥾' },
    { key: 'range', name: 'Attack Range', icon: '🎯' },
    { key: 'energyRegen', name: 'Energy Regen', icon: '⚡' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="w-full max-w-md max-h-[96vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-amber-500/50 bg-stone-900/95 rounded-3xl p-4 sm:p-5 md:p-6 shadow-2xl relative text-center text-stone-100 backdrop-blur-xl select-none"
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="mx-auto w-10 h-10 sm:w-11 sm:h-11 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-1.5 border border-amber-500/30 shadow-inner">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
        </div>

        {pendingCount && pendingCount > 1 && (
          <div className="mb-1 inline-block px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-[10px] font-bold font-mono">
            Level Up Bonus ({pendingCount} Remaining)
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-display leading-tight">
          LEVEL UP!
        </h2>
        <p className="text-[11px] sm:text-xs font-bold text-amber-400 font-display uppercase tracking-wider mt-0.5">
          {dracoName} reached Level {newLevel}!
        </p>

        {/* Level Progression badges */}
        <div className="mt-1 flex items-center justify-center gap-2 text-stone-400 font-mono font-bold text-xs">
          <span>Lv.{oldLevel}</span>
          <span>→</span>
          <span className="text-amber-400 font-black text-base">Lv.{newLevel}</span>
        </div>

        {/* Base stats panel */}
        <div className="mt-2.5 p-2 sm:p-2.5 rounded-2xl border border-stone-800 bg-stone-950/80 max-w-sm mx-auto">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1 px-1 font-display">
            <span>Base Stat Upgrades:</span>
            <span className="text-emerald-400 font-mono font-bold text-[9px]">Auto-Applied</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-mono font-bold">
            <div className="flex flex-col items-center py-1 px-1 bg-stone-900 rounded-xl border border-stone-800">
              <span className="text-[9px] text-stone-400">HP</span>
              <span className="text-emerald-400 text-xs">+{baseIncrease.hp}</span>
            </div>
            <div className="flex flex-col items-center py-1 px-1 bg-stone-900 rounded-xl border border-stone-800">
              <span className="text-[9px] text-stone-400">Attack</span>
              <span className="text-emerald-400 text-xs">+{baseIncrease.attack}</span>
            </div>
            <div className="flex flex-col items-center py-1 px-1 bg-stone-900 rounded-xl border border-stone-800">
              <span className="text-[9px] text-stone-400">Defense</span>
              <span className="text-emerald-400 text-xs">+{baseIncrease.defense}</span>
            </div>
            <div className="flex flex-col items-center py-1 px-1 bg-stone-900 rounded-xl border border-stone-800">
              <span className="text-[9px] text-stone-400">Speed</span>
              <span className="text-emerald-400 text-xs">+{baseIncrease.speed}</span>
            </div>
          </div>
        </div>

        {/* Dice roll animation banner */}
        <div className="mt-2.5 mb-2.5 flex items-center justify-between px-3 py-2 border border-dashed border-amber-500/40 rounded-2xl bg-amber-950/20 max-w-sm mx-auto">
          <div className="flex items-center gap-2.5 text-left">
            <motion.div
              animate={diceRolling ? { rotate: 360 } : { scale: [1, 1.15, 1] }}
              transition={diceRolling ? { repeat: Infinity, duration: 0.5, ease: 'linear' } : { duration: 0.3 }}
              className="w-9 h-9 bg-stone-950 border border-amber-400 rounded-xl shadow-inner flex items-center justify-center font-mono font-black text-sm text-amber-400 shrink-0"
            >
              +{currentDiceVal}
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold font-mono">
                <Dices className={`w-3 h-3 ${diceRolling ? 'animate-spin' : ''}`} />
                <span>{diceRolling ? 'ROLLING BONUS...' : 'BONUS ROLLED!'}</span>
              </div>
              <p className="text-[9px] text-amber-300/90 font-mono">
                {diceRolling ? 'Calculating random boost...' : `Select 1 attribute to apply +${bonusRoll}`}
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono font-black text-amber-400 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-lg shrink-0">
            🎲 +{bonusRoll}
          </div>
        </div>

        {/* Bonus Stat selection buttons */}
        <div className="grid grid-cols-2 gap-1.5 max-w-sm mx-auto">
          {statDetails.map(({ key, name, icon }, idx) => {
            const val = currentStats ? (currentStats as any)[key] || 0 : 0;
            const isCapped = (key === 'speed' && val >= 20) || (key === 'jump' && val >= 14);
            const isDisabled = diceRolling || isCapped;
            const isLastOdd = idx === statDetails.length - 1 && statDetails.length % 2 !== 0;

            return (
              <button
                key={key}
                disabled={isDisabled}
                onClick={() => handleSelectStat(key)}
                className={`py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl border text-[11px] font-bold transition-all text-left flex justify-between items-center bg-stone-950 ${
                  isLastOdd ? 'col-span-2' : ''
                } ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed border-stone-900 text-stone-500'
                    : 'border-stone-800 text-stone-200 hover:border-amber-400 hover:bg-amber-950/40 active:scale-95'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="text-xs">{icon}</span>
                  <span className="truncate">{name}</span>
                </span>
                {isCapped ? (
                  <span className="font-mono text-stone-500 text-[8px] font-extrabold uppercase bg-stone-900 px-1 py-0.2 rounded shrink-0">
                    CAPPED
                  </span>
                ) : !diceRolling ? (
                  <span className="font-mono text-emerald-400 font-bold text-[11px] shrink-0">+{bonusRoll}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
export default LevelUpModal;
