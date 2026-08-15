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

  const statDetails: { key: keyof PlayerStats; name: string; color: string }[] = [
    { key: 'hp', name: 'HP (Health Points)', color: 'bg-rose-500 text-rose-700 hover:bg-rose-50 border-rose-200' },
    { key: 'attack', name: 'Attack Power', color: 'bg-amber-500 text-amber-700 hover:bg-amber-50 border-amber-200' },
    { key: 'defense', name: 'Defense Rating', color: 'bg-blue-500 text-blue-700 hover:bg-blue-50 border-blue-200' },
    { key: 'speed', name: 'Movement Speed', color: 'bg-emerald-500 text-emerald-700 hover:bg-emerald-50 border-emerald-200' },
    { key: 'jump', name: 'Jump Velocity', color: 'bg-indigo-500 text-indigo-700 hover:bg-indigo-50 border-indigo-200' },
    { key: 'range', name: 'Attack Range', color: 'bg-purple-500 text-purple-700 hover:bg-purple-50 border-purple-200' },
    { key: 'energyRegen', name: 'Energy Regen', color: 'bg-yellow-500 text-yellow-700 hover:bg-yellow-50 border-yellow-200' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, rotate: -1, y: 30 }}
        animate={{ scale: 1, rotate: 0, y: 0 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-amber-500/50 bg-stone-900/95 rounded-3xl p-6 md:p-8 shadow-2xl relative text-center scrollbar-thin scrollbar-thumb-stone-800 text-stone-100 backdrop-blur-xl"
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-3 border border-amber-500/30 shadow-inner animate-bounce">
          <Award className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
        </div>

        {pendingCount && pendingCount > 1 && (
          <div className="mb-2 inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-xs font-bold font-mono">
            Level Up Bonus ({pendingCount} Remaining)
          </div>
        )}

        <h2 className="text-2xl md:text-3xl font-black tracking-wider text-white uppercase font-display">LEVEL UP!</h2>
        <p className="text-xs md:text-sm font-semibold text-amber-400 mt-1 uppercase tracking-wider font-display">
          {dracoName} reached Level {newLevel}!
        </p>

        {/* Level Progression badges */}
        <div className="mt-1 md:mt-2 flex items-center justify-center gap-3 text-stone-400 font-mono font-bold text-sm">
          <span>Lv.{oldLevel}</span>
          <span>→</span>
          <span className="text-amber-400 font-black text-lg">Lv.{newLevel}</span>
        </div>

        {/* Base stats panel */}
        <div className="mt-4 p-3 md:p-4 rounded-2xl border border-stone-800 bg-stone-950/80 max-w-sm mx-auto text-left space-y-1">
          <h4 className="text-[10px] md:text-xs font-black uppercase tracking-wider text-stone-400 mb-1 font-display">Base Stat Upgrades:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold text-stone-300">
            <div className="flex justify-between p-1.5 md:p-2 bg-stone-900 rounded-lg border border-stone-800">
              <span>HP</span>
              <span className="text-emerald-400">+{baseIncrease.hp}</span>
            </div>
            <div className="flex justify-between p-1.5 md:p-2 bg-stone-900 rounded-lg border border-stone-800">
              <span>Attack</span>
              <span className="text-emerald-400">+{baseIncrease.attack}</span>
            </div>
            <div className="flex justify-between p-1.5 md:p-2 bg-stone-900 rounded-lg border border-stone-800">
              <span>Defense</span>
              <span className="text-emerald-400">+{baseIncrease.defense}</span>
            </div>
            <div className="flex justify-between p-1.5 md:p-2 bg-stone-900 rounded-lg border border-stone-800">
              <span>Speed</span>
              <span className="text-emerald-400">+{baseIncrease.speed}</span>
            </div>
          </div>
        </div>

        {/* Dice roll animation */}
        <div className="mt-4 md:mt-6 mb-4 flex flex-col items-center justify-center p-3 md:p-4 border border-dashed border-amber-500/40 rounded-2xl bg-amber-950/20 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-1.5 text-amber-400 text-[10px] md:text-xs font-bold font-mono">
            <Dices className="w-3.5 h-3.5 animate-spin" />
            <span>ROLLING RANDOM BONUS...</span>
          </div>

          <motion.div
            animate={diceRolling ? { rotate: 360 } : { scale: [1, 1.15, 1] }}
            transition={diceRolling ? { repeat: Infinity, duration: 0.5, ease: 'linear' } : { duration: 0.3 }}
            className="w-12 h-12 md:w-14 md:h-14 bg-stone-950 border-2 border-amber-400 rounded-2xl shadow-lg flex items-center justify-center font-mono font-black text-xl md:text-2xl text-amber-400"
          >
            +{currentDiceVal}
          </motion.div>

          {!diceRolling && (
            <p className="text-[9px] md:text-[10px] text-amber-300 font-bold uppercase tracking-wider mt-1.5 font-mono">
              Select one stat to apply this +{bonusRoll} bonus!
            </p>
          )}
        </div>

        {/* Bonus Stat selection buttons */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 max-w-md mx-auto">
          {statDetails.map(({ key, name }) => {
            const val = currentStats ? (currentStats as any)[key] || 0 : 0;
            const isCapped = (key === 'speed' && val >= 20) || (key === 'jump' && val >= 14);
            const isDisabled = diceRolling || isCapped;

            return (
              <button
                key={key}
                disabled={isDisabled}
                onClick={() => handleSelectStat(key)}
                className={`py-2 px-3 md:py-3 md:px-4 rounded-xl border text-[11px] md:text-xs font-bold transition-all text-left flex justify-between items-center bg-stone-950 ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed border-stone-900 text-stone-500'
                    : 'border-stone-800 text-stone-200 hover:border-amber-400 hover:bg-amber-950/40 active:scale-95'
                }`}
              >
                <span>{name}</span>
                {isCapped ? (
                  <span className="font-mono text-stone-500 text-[8px] md:text-[9px] font-extrabold uppercase">CAPPED</span>
                ) : !diceRolling ? (
                  <span className="font-mono text-emerald-400">+{bonusRoll}</span>
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
