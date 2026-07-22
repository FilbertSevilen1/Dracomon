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
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  dracoName,
  oldLevel,
  newLevel,
  baseIncrease,
  bonusRoll,
  currentStats,
  onApplyBonus,
}) => {
  const [diceRolling, setDiceRolling] = useState(true);
  const [currentDiceVal, setCurrentDiceVal] = useState(1);

  // Animate the dice roll for a few frames before settling on the actual bonusRoll
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      setCurrentDiceVal(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setCurrentDiceVal(bonusRoll);
        setDiceRolling(false);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [bonusRoll]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, rotate: -1, y: 30 }}
        animate={{ scale: 1, rotate: 0, y: 0 }}
        className="w-full max-w-lg border border-yellow-200 bg-white/95 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center"
      >
        {/* Decorative corner glows */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />

        {/* Level Up Title Badge */}
        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 border border-amber-200 shadow-sm animate-bounce">
          <Award className="w-8 h-8 text-amber-600" />
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 font-display">LEVEL UP!</h2>
        <p className="text-sm font-semibold text-stone-400 mt-1 uppercase tracking-wider">
          {dracoName} reached Level {newLevel}!
        </p>

        {/* Level change */}
        <div className="mt-2 flex items-center justify-center gap-3 text-stone-400 font-bold text-sm">
          <span>Lv.{oldLevel}</span>
          <span>→</span>
          <span className="text-amber-500 font-extrabold text-lg">Lv.{newLevel}</span>
        </div>

        {/* Base Increases */}
        <div className="mt-6 p-4 rounded-2xl border border-stone-100 bg-stone-50/50 max-w-sm mx-auto text-left space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Base Stat Upgrades:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold text-stone-700">
            <div className="flex justify-between p-2 bg-white rounded-lg border border-stone-100">
              <span>HP</span>
              <span className="text-emerald-600">+{baseIncrease.hp}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded-lg border border-stone-100">
              <span>Attack</span>
              <span className="text-emerald-600">+{baseIncrease.attack}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded-lg border border-stone-100">
              <span>Defense</span>
              <span className="text-emerald-600">+{baseIncrease.defense}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded-lg border border-stone-100">
              <span>Speed</span>
              <span className="text-emerald-600">+{baseIncrease.speed}</span>
            </div>
          </div>
        </div>

        {/* Rolling Dice Bonus */}
        <div className="mt-8 mb-6 flex flex-col items-center justify-center p-4 border border-dashed border-amber-200 rounded-2xl bg-amber-50/30 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-2 text-amber-800 text-xs font-bold">
            <Dices className="w-4 h-4 animate-spin" />
            <span>ROLLING RANDOM BONUS...</span>
          </div>

          <motion.div
            animate={diceRolling ? { rotate: 360 } : { scale: [1, 1.15, 1] }}
            transition={diceRolling ? { repeat: Infinity, duration: 0.5, ease: 'linear' } : { duration: 0.3 }}
            className="w-14 h-14 bg-white border-2 border-amber-500 rounded-2xl shadow-md flex items-center justify-center font-mono font-black text-2xl text-amber-600"
          >
            +{currentDiceVal}
          </motion.div>
          
          {!diceRolling && (
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-2">
              Select one stat to apply this +{bonusRoll} bonus!
            </p>
          )}
        </div>

        {/* Choices Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {statDetails.map(({ key, name }) => {
            const val = currentStats ? (currentStats as any)[key] || 0 : 0;
            const isCapped = (key === 'speed' && val >= 20) || (key === 'jump' && val >= 14);
            const isDisabled = diceRolling || isCapped;

            return (
              <button
                key={key}
                disabled={isDisabled}
                onClick={() => handleSelectStat(key)}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-left flex justify-between items-center bg-white ${
                  isDisabled 
                    ? 'opacity-50 cursor-not-allowed border-stone-200 text-stone-400 bg-stone-100' 
                    : 'border-stone-200 text-stone-700 hover:border-amber-500 hover:bg-amber-50/20 active:scale-95'
                }`}
              >
                <span>{name}</span>
                {isCapped ? (
                  <span className="font-mono text-stone-400 text-[9px] font-extrabold uppercase">CAPPED</span>
                ) : !diceRolling ? (
                  <span className="font-mono text-emerald-600">+{bonusRoll}</span>
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
