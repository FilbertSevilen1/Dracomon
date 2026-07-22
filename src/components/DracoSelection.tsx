import React from 'react';
import { motion } from 'framer-motion';
import { SaveData, DracoData, TierType } from '../types/game';
import { Shield, Target, Zap, Lock, Sparkles, Coins, Layers, Award } from 'lucide-react';
import { soundService } from '../services/sound';

interface DracoSelectionProps {
  saveData: SaveData;
  onSelect: (name: string) => void;
  onUnlock: (name: string, cost: number) => void;
  onLevelUpWithCoins: (name: string) => void;
  onClose: () => void;
  onSwitchTier?: (tier: TierType) => void;
}

// Draco detailed descriptions and pricing
const DRACO_META: {
  [key: string]: {
    role: string;
    abilityName: string;
    abilityDesc: string;
    ultimateName: string;
    ultimateDesc: string;
    cost: number;
    colorClass: string;
    bgGradient: string;
  };
} = {
  Jumpmon: {
    role: 'Mobility / Agile',
    abilityName: 'Double Leap & Spin Slash',
    abilityDesc: 'Can execute a second jump mid-air. Spin melee attack covers a wide circular area around itself.',
    ultimateName: 'Earthshaker Ground Slam (Ultimate)',
    ultimateDesc: 'Jumps high into the sky and slams down, spawning dual shockwaves that deal 30 damage to all grounded foes.',
    cost: 0,
    colorClass: 'text-amber-600 border-amber-200 bg-amber-50',
    bgGradient: 'from-amber-400 to-orange-500',
  },
  Archermon: {
    role: 'Ranged / DPS',
    abilityName: 'Triple Arrow Volley',
    abilityDesc: 'Shoots rapid arrows horizontally. Special ability shoots three arrows in a spread volley.',
    ultimateName: 'Arrow Rain Barrage (Ultimate)',
    ultimateDesc: 'Fires a volley of 12 rapid piercing arrows into the sky that rain down across all enemies on screen.',
    cost: 100,
    colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    bgGradient: 'from-emerald-400 to-teal-600',
  },
  Shieldmon: {
    role: 'Tank / Defender',
    abilityName: 'Aegis Shield Charge',
    abilityDesc: 'Bashes enemies in melee. Special creates an indestructible shield bubble that negates all damage for 2 seconds.',
    ultimateName: 'Aegis Fortress Shockwave (Ultimate)',
    ultimateDesc: 'Grants 5s of total invulnerability, unleashes a radial knockback blast, and charges forward breaking hazards.',
    cost: 200,
    colorClass: 'text-blue-600 border-blue-200 bg-blue-50',
    bgGradient: 'from-blue-400 to-indigo-600',
  },
  Assassinmon: {
    role: 'Stealth / Burst',
    abilityName: 'Shadow Dash Slash',
    abilityDesc: 'Strikes fast with dual daggers. Special dashes forward invulnerably, slashing all enemies in the shadow path.',
    ultimateName: 'Single Slash of Death (Ultimate)',
    ultimateDesc: 'Teleports behind single target with Raiden Shogun Musou Slash, dealing massive 10.0x attack explosion burst!',
    cost: 300,
    colorClass: 'text-purple-600 border-purple-200 bg-purple-50',
    bgGradient: 'from-purple-500 to-indigo-800',
  },
  Flymon: {
    role: 'Aerial / Float',
    abilityName: 'Sonic Wind Slice',
    abilityDesc: 'Spits poison needles. Special launches dual sonic blades and allows hovering mid-air (extreme jump height).',
    ultimateName: 'Sonic Typhoon Whirlwind (Ultimate)',
    ultimateDesc: 'Launches a giant rotating wind hurricane projectile forward while granting 4s of infinite mid-air floating flight.',
    cost: 400,
    colorClass: 'text-rose-600 border-rose-200 bg-rose-50',
    bgGradient: 'from-rose-400 to-pink-600',
  },
  Whitemon: {
    role: 'Summoner / Beastmaster',
    abilityName: 'Bird Familiar Summon',
    abilityDesc: 'Throws spinning axes. Special summons an uncontrollable Bird Familiar that seeks nearby enemies.',
    ultimateName: 'Primal Roar & Familiar Rampage (Ultimate)',
    ultimateDesc: 'Roars to stun all visible enemies for 3 seconds while driving the Bird Familiar into Rampage mode (3x attack speed).',
    cost: 500,
    colorClass: 'text-sky-600 border-sky-200 bg-sky-50',
    bgGradient: 'from-sky-400 to-indigo-600',
  },
  Magemon: {
    role: 'Mage / Elemental Spells',
    abilityName: 'Invoked Spell (Meteor / Sun Strike / Tornado)',
    abilityDesc: 'Casts 3 random legendary spells: 45° rolling Chaos Meteor, 1.7s homing Sun Strike laser, or enemy-lifting Tornado.',
    ultimateName: 'Trio Orb Blast (Ultimate)',
    ultimateDesc: 'Summons a Giant Cleave arc in front (1.5x size) followed immediately by Chaos Meteor, Sun Strike, and Tornado!',
    cost: 250,
    colorClass: 'text-purple-600 border-purple-200 bg-purple-50',
    bgGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
  },
};

// Render Draco SVGs inline so no assets are missing
const DracoArtwork: React.FC<{ name: string; animated?: boolean }> = ({ name, animated = true }) => {
  const motionProps = animated
    ? {
        animate: { y: [0, -6, 0] },
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as any },
      }
    : {};

  if (name === 'Jumpmon') {
    return (
      <motion.svg width="120" height="120" viewBox="0 0 100 100" {...motionProps} className="mx-auto">
        {/* Shadow */}
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
        {/* Tail */}
        <path d="M 30 75 Q 15 70 20 50 Q 25 45 32 60 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        {/* Wings */}
        <path d="M 38 45 Q 22 25 35 25 Q 40 32 42 42 Z" fill="#d97706" />
        {/* Body */}
        <circle cx="50" cy="55" r="25" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        {/* Belly */}
        <circle cx="50" cy="62" r="15" fill="#fef08a" />
        {/* Horns */}
        <path d="M 38 32 Q 32 18 42 24 Z" fill="#b45309" />
        <path d="M 62 32 Q 68 18 58 24 Z" fill="#b45309" />
        {/* Eyes */}
        <circle cx="45" cy="48" r="3" fill="#000" />
        <circle cx="55" cy="48" r="3" fill="#000" />
        {/* Cheeks */}
        <circle cx="40" cy="53" r="2" fill="#f87171" />
        <circle cx="60" cy="53" r="2" fill="#f87171" />
      </motion.svg>
    );
  }

  if (name === 'Archermon') {
    return (
      <motion.svg width="120" height="120" viewBox="0 0 100 100" {...motionProps} className="mx-auto">
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
        {/* Leaf Tail */}
        <path d="M 32 75 Q 10 80 18 60 Z" fill="#047857" />
        {/* Body */}
        <rect x="35" y="38" width="30" height="38" rx="8" fill="#10b981" stroke="#047857" strokeWidth="3" />
        {/* Hat/Leaf crown */}
        <path d="M 32 38 Q 50 18 68 38 Z" fill="#059669" stroke="#047857" strokeWidth="2" />
        <circle cx="50" cy="22" r="3" fill="#facc15" />
        {/* Eyes */}
        <rect x="42" y="44" width="4" height="6" fill="#fff" />
        <rect x="54" y="44" width="4" height="6" fill="#fff" />
        <rect x="44" y="46" width="2" height="4" fill="#000" />
        <rect x="54" y="46" width="2" height="4" fill="#000" />
        {/* Bow */}
        <path d="M 66 40 A 15 15 0 0 1 66 70" fill="none" stroke="#b45309" strokeWidth="2.5" />
        <line x1="66" y1="40" x2="66" y2="70" stroke="#e2e8f0" strokeWidth="1" />
      </motion.svg>
    );
  }

  if (name === 'Shieldmon') {
    return (
      <motion.svg width="120" height="120" viewBox="0 0 100 100" {...motionProps} className="mx-auto">
        <ellipse cx="50" cy="85" rx="26" ry="5" fill="rgba(0,0,0,0.1)" />
        {/* Wing tips */}
        <path d="M 30 50 Q 15 35 25 60 Z" fill="#1d4ed8" />
        {/* Heavy Body */}
        <rect x="32" y="35" width="36" height="44" rx="12" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3.5" />
        {/* Horn Crown */}
        <path d="M 36 35 L 30 22 L 42 30 L 50 18 L 58 30 L 70 22 L 64 35 Z" fill="#1e3a8a" />
        {/* Eyes */}
        <rect x="40" y="46" width="6" height="4" fill="#facc15" />
        <rect x="54" y="46" width="6" height="4" fill="#facc15" />
        {/* Massive Shield */}
        <rect x="62" y="44" width="12" height="34" rx="3" fill="#475569" stroke="#1e293b" strokeWidth="2" />
        <line x1="68" y1="44" x2="68" y2="78" stroke="#3b82f6" strokeWidth="1.5" />
      </motion.svg>
    );
  }

  if (name === 'Assassinmon') {
    return (
      <motion.svg width="120" height="120" viewBox="0 0 100 100" {...motionProps} className="mx-auto">
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
        {/* Shadow cloak */}
        <rect x="34" y="38" width="32" height="38" rx="8" fill="#4c1d95" stroke="#1e1b4b" strokeWidth="3" />
        {/* Hood */}
        <path d="M 30 38 Q 50 16 70 38 Z" fill="#1e1b4b" stroke="#1e1b4b" strokeWidth="2" />
        {/* Mask */}
        <path d="M 34 52 L 66 52 L 50 68 Z" fill="#1e1b4b" stroke="#4c1d95" strokeWidth="1.5" />
        {/* Eyes */}
        <rect x="41" y="44" width="6" height="3" fill="#c084fc" />
        <rect x="53" y="44" width="6" height="3" fill="#c084fc" />
        {/* Dual Obsidian Daggers */}
        <path d="M 28 48 L 18 36 L 24 52 Z" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
        <path d="M 72 48 L 82 36 L 76 52 Z" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
      </motion.svg>
    );
  }

  if (name === 'Whitemon') {
    return (
      <motion.svg width="120" height="120" viewBox="0 0 100 100" {...motionProps} className="mx-auto">
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
        {/* Feather Wings */}
        <path d="M 32 48 Q 10 24 34 36 Z" fill="#e2e8f0" opacity="0.9" />
        <path d="M 68 48 Q 90 24 66 36 Z" fill="#e2e8f0" opacity="0.9" />
        {/* White Body */}
        <rect x="36" y="36" width="28" height="40" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
        <rect x="42" y="44" width="5" height="7" fill="#000" />
        <rect x="53" y="44" width="5" height="7" fill="#000" />
        {/* Feathers crown */}
        <path d="M 34 36 Q 50 18 66 36 Z" fill="#38bdf8" />
        {/* Bird Familiar hovering near shoulder */}
        <circle cx="24" cy="30" r="5" fill="#38bdf8" />
        <path d="M 18 30 L 22 26 L 24 32 Z" fill="#7dd3fc" />
        {/* Throwing Axe */}
        <path d="M 68 44 L 80 32 L 76 52 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
      </motion.svg>
    );
  }

  if (name === 'Magemon') {
    return (
      <motion.svg width="120" height="120" viewBox="0 0 100 100" {...motionProps} className="mx-auto">
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.15)" />
        {/* Floating Quas / Wex / Exort Magical Orbs */}
        <circle cx="30" cy="22" r="6" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
        <circle cx="50" cy="14" r="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <circle cx="70" cy="22" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        {/* Wizard Robe & Body */}
        <path d="M 32 45 L 68 45 L 76 80 L 24 80 Z" fill="#4c1d95" stroke="#312e81" strokeWidth="2.5" />
        {/* Golden Sash Trim */}
        <path d="M 50 45 L 42 80 M 50 45 L 58 80" stroke="#f59e0b" strokeWidth="2" />
        {/* Wizard Hood / Head */}
        <circle cx="50" cy="40" r="14" fill="#6d28d9" stroke="#4c1d95" strokeWidth="2" />
        {/* Glowing Eyes */}
        <circle cx="45" cy="38" r="2.5" fill="#f59e0b" />
        <circle cx="55" cy="38" r="2.5" fill="#f59e0b" />
        {/* Magic Staff */}
        <rect x="74" y="25" width="4" height="55" rx="2" fill="#78350f" />
        <circle cx="76" cy="23" r="6" fill="#a855f7" stroke="#6b21a8" strokeWidth="1.5" />
      </motion.svg>
    );
  }

  // Flymon
  return (
    <motion.svg width="120" height="120" viewBox="0 0 100 100" {...motionProps} className="mx-auto">
      <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
      {/* Insect Wings */}
      <path d="M 34 50 Q 14 26 36 38 Z" fill="#fda4af" opacity="0.85" />
      <path d="M 66 50 Q 86 26 64 38 Z" fill="#fda4af" opacity="0.85" />
      {/* Wasp body */}
      <rect x="36" y="36" width="28" height="40" rx="8" fill="#e11d48" stroke="#881337" strokeWidth="3" />
      {/* Yellow/Orange stripes */}
      <rect x="36" y="46" width="28" height="4" fill="#fb7185" />
      <rect x="36" y="56" width="28" height="4" fill="#fb7185" />
      {/* Wasp Eyes */}
      <circle cx="44" cy="44" r="3.5" fill="#facc15" />
      <circle cx="56" cy="44" r="3.5" fill="#facc15" />
      <circle cx="44" cy="44" r="1.5" fill="#000" />
      <circle cx="56" cy="44" r="1.5" fill="#000" />
    </motion.svg>
  );
};

export const DracoSelection: React.FC<DracoSelectionProps> = ({ saveData, onSelect, onUnlock, onLevelUpWithCoins, onClose, onSwitchTier }) => {
  const currentDraco = saveData.selectedDraco;
  const coins = saveData.player.coins;
  const currentTier = saveData.tier || 'Free';

  const handleCardClick = (name: string, unlocked: boolean) => {
    if (unlocked) {
      onSelect(name);
    } else {
      const meta = DRACO_META[name];
      if (coins >= meta.cost) {
        onUnlock(name, meta.cost);
      } else {
        soundService.playClick();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="w-full max-w-6xl max-h-[88vh] flex flex-col overflow-hidden border bg-white/95 border-stone-200 rounded-3xl shadow-2xl backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-5 border-b border-stone-100 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-display">Draco Sanctuary</h2>
            <p className="text-sm text-stone-500">Equip your companion or unlock legendary Draco classes.</p>
          </div>

          {/* Account Tier Selector Badges */}
          {onSwitchTier && (
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 border border-stone-200 rounded-2xl">
              {(['Free', 'Basic', 'Premium'] as TierType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => onSwitchTier(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                    currentTier === t
                      ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{t} Tier</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 px-4 py-2 bg-stone-50 rounded-full border border-stone-100 shadow-sm">
            <Coins className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="font-mono font-bold text-stone-800">{coins} Coins</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
            {Object.keys(saveData.dracos).map(name => {
              const dData = saveData.dracos[name];
              const meta = DRACO_META[name];
              const isUnlocked = !!dData.unlocked;
              const isEquipped = currentDraco === name;
              const canAfford = coins >= meta.cost;

              // Safe level and stat resolutions
              const lvl = dData.level || 1;
              const hp = dData.hp || 10;
              const att = dData.attack || 1;
              const def = dData.defense || 1;
              const spd = dData.speed || 1;
              const jmp = dData.jump || 1;
              const rng = dData.range || 1;

              // Average bar percentages relative to a reasonable cap (e.g. 30)
              const getPercent = (val: number, max = 25) => Math.min(100, Math.max(10, (val / max) * 100));

              return (
                <motion.div
                  key={name}
                  whileHover={{ y: isUnlocked ? -4 : 0 }}
                  className={`w-[330px] md:w-[360px] flex-shrink-0 relative flex flex-col justify-between p-6 border rounded-3xl transition-all duration-300 ${
                    isEquipped
                      ? 'border-stone-900 bg-stone-50/50 shadow-md ring-1 ring-stone-900'
                      : isUnlocked
                      ? 'border-stone-200 bg-white hover:shadow-lg cursor-pointer'
                      : 'border-stone-200 bg-stone-50/40 opacity-90'
                  }`}
                  onClick={() => handleCardClick(name, isUnlocked)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {isEquipped ? (
                      <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white bg-stone-900 rounded-full">
                        Equipped
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2.5 py-1 text-xs font-semibold text-stone-500 bg-stone-100 rounded-full border border-stone-200/50">
                        Unlocked
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-stone-500 bg-stone-100 rounded-full border border-stone-200/50">
                        <Lock className="w-3 h-3" />
                        Locked
                      </div>
                    )}
                  </div>

                  {/* Visual Portrait */}
                  <div className="mb-4 text-center">
                    <DracoArtwork name={name} animated={isEquipped} />
                    <h3 className="mt-2 text-xl font-bold text-stone-800 font-display">{name}</h3>
                    <p className="text-xs font-semibold tracking-wide uppercase text-stone-400 mt-0.5">
                      {meta.role}
                    </p>
                  </div>

                  {/* Abilities & Levels */}
                  <div className="mb-4 space-y-2.5">
                    {/* Special & Ultimate Skill 2-Column Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Special Skill */}
                      <div className="p-3 bg-stone-50/90 rounded-xl border border-stone-100 text-xs">
                        <p className="font-bold text-stone-800 flex items-center gap-1 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-stone-900 flex-shrink-0" />
                          Special Skill
                        </p>
                        <p className="font-extrabold text-amber-700 mt-1 text-[11px] leading-tight">
                          {meta.abilityName}
                        </p>
                        <p className="text-stone-600 mt-1.5 text-[10px] leading-relaxed">{meta.abilityDesc}</p>
                      </div>

                      {/* Ultimate Skill */}
                      <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200/80 text-xs">
                        <p className="font-bold text-amber-950 flex items-center gap-1 text-[11px]">
                          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                          Ultimate Skill
                        </p>
                        <p className="font-extrabold text-purple-700 mt-1 text-[11px] leading-tight">
                          {meta.ultimateName}
                        </p>
                        <p className="text-amber-950/80 mt-1.5 text-[10px] leading-relaxed font-medium">{meta.ultimateDesc}</p>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <div className="space-y-2">
                        {/* Stats Bars */}
                        <div className="space-y-1.5 text-xs text-stone-600">
                          <div className="flex items-center justify-between">
                            <span>Level {lvl}</span>
                          </div>

                          {/* HP Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] text-stone-400">
                              <span>HP ({hp})</span>
                            </div>
                            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-rose-500 rounded-full"
                                style={{ width: `${getPercent(hp, 35)}%` }}
                              />
                            </div>
                          </div>

                          {/* Attack Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] text-stone-400">
                              <span>Attack ({att})</span>
                            </div>
                            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${getPercent(att, 20)}%` }}
                              />
                            </div>
                          </div>

                          {/* Defense Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] text-stone-400">
                              <span>Defense ({def})</span>
                            </div>
                            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${getPercent(def, 20)}%` }}
                              />
                            </div>
                          </div>

                          {/* Speed Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] text-stone-400">
                              <span>Speed ({spd})</span>
                            </div>
                            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${getPercent(spd, 15)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Coin Level Up Action */}
                        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-1.5 mt-2">
                          <span className="text-[10px] font-semibold text-stone-400">
                            {lvl >= 25 ? 'Maximum Level Reached' : `Upgrade to Lv.${lvl + 1}`}
                          </span>
                          {lvl >= 25 ? (
                            <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                              MAX LEVEL
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (coins >= lvl * 100) {
                                  onLevelUpWithCoins(name);
                                } else {
                                  soundService.playHit();
                                }
                              }}
                              disabled={coins < lvl * 100}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                                coins >= lvl * 100
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-95'
                                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                              }`}
                            >
                              <Coins className="w-3 h-3 text-current" />
                              <span>Level Up ({lvl * 100}🪙)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                        <Lock className="w-6 h-6 text-stone-300 mb-2" />
                        <span className="text-xs text-stone-400">Unlock this class to reveal and upgrade stats.</span>
                      </div>
                    )}
                  </div>

                  {/* Actions / Cost */}
                  <div>
                    {isUnlocked ? (
                      <button
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                          isEquipped
                            ? 'bg-stone-100 text-stone-400 cursor-default border border-stone-200'
                            : 'bg-stone-900 text-white hover:bg-stone-800'
                        }`}
                        disabled={isEquipped}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isEquipped) onSelect(name);
                        }}
                      >
                        {isEquipped ? 'Currently Active' : 'Equip Draco'}
                      </button>
                    ) : (
                      <button
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border shadow-sm transition-all ${
                          canAfford
                            ? 'bg-amber-500 text-white hover:bg-amber-600 border-amber-500'
                            : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                        }`}
                        disabled={!canAfford}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUnlock(name, meta.cost);
                        }}
                      >
                        <Coins className="w-4 h-4" />
                        Unlock for {meta.cost} Coins
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-8 py-4 bg-stone-50 border-t border-stone-100">
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="px-6 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            Close Portal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default DracoSelection;
