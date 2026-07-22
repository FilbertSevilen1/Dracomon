import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SaveData, TierType } from '../types/game';
import { Shield, Zap, Lock, Sparkles, Coins, Award, X, Check, ArrowUpRight } from 'lucide-react';
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
    role: 'Agile / Double Jump',
    abilityName: 'Double Leap & Spin Slash',
    abilityDesc: 'Executes double jump mid-air. Spin melee covers 360° area.',
    ultimateName: 'Earthshaker Slam',
    ultimateDesc: 'Slams down creating dual shockwaves dealing 30 damage.',
    cost: 0,
    colorClass: 'text-amber-600 border-amber-200 bg-amber-50',
    bgGradient: 'from-amber-400 to-orange-500',
  },
  Archermon: {
    role: 'Ranged / Arrow DPS',
    abilityName: 'Triple Arrow Volley',
    abilityDesc: 'Shoots rapid arrows. Special fires a 3-arrow spread volley.',
    ultimateName: 'Arrow Rain Barrage',
    ultimateDesc: 'Fires 12 piercing arrows that rain down across all screen foes.',
    cost: 100,
    colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    bgGradient: 'from-emerald-400 to-teal-600',
  },
  Shieldmon: {
    role: 'Tank / Bulwark Trample',
    abilityName: 'Shield Trample Dash',
    abilityDesc: 'High-speed 600px dash that trample and knocks back all enemies caught in path.',
    ultimateName: 'Portal Rampage Charge',
    ultimateDesc: 'Raises shield forward and charges continuously to the nearest portal, launching all hit enemies skyward!',
    cost: 200,
    colorClass: 'text-blue-500 border-blue-500 bg-blue-950',
    bgGradient: 'from-blue-900 via-indigo-950 to-slate-900',
  },
  Assassinmon: {
    role: 'Stealth / Burst',
    abilityName: 'Shadow Katana Slash',
    abilityDesc: 'Slash using Katana. Special dashes invulnerably through foes with shadow trail.',
    ultimateName: 'Single Slash of Death',
    ultimateDesc: 'Teleports behind target with 10.0x attack explosion burst.',
    cost: 300,
    colorClass: 'text-purple-600 border-purple-200 bg-purple-50',
    bgGradient: 'from-purple-500 to-indigo-800',
  },
  Flymon: {
    role: 'Aerial / Flight',
    abilityName: 'Sonic Wind Slice',
    abilityDesc: 'Poison needles. Special launches sonic blades & extreme hover.',
    ultimateName: 'Sonic Typhoon',
    ultimateDesc: 'Giant wind hurricane projectile + 4s infinite flight hover.',
    cost: 400,
    colorClass: 'text-rose-600 border-rose-200 bg-rose-50',
    bgGradient: 'from-rose-400 to-pink-600',
  },
  Whitemon: {
    role: 'Summoner / Beastmaster',
    abilityName: 'Bird Familiar Summon',
    abilityDesc: 'Spinning axes. Special summons uncontrollable seeking Bird Familiar.',
    ultimateName: 'Familiar Rampage',
    ultimateDesc: 'Stuns visible enemies for 3s & drives Bird Familiar to 3x speed.',
    cost: 500,
    colorClass: 'text-sky-600 border-sky-200 bg-sky-50',
    bgGradient: 'from-sky-400 to-indigo-600',
  },
  Magemon: {
    role: 'Mage / Spellcaster',
    abilityName: 'Invoked Spell Trio',
    abilityDesc: 'Casts Chaos Meteor, homing Sun Strike, or enemy-lifting Tornado.',
    ultimateName: 'Trio Orb Blast',
    ultimateDesc: 'Giant Cleave arc followed by Chaos Meteor, Sun Strike & Tornado!',
    cost: 250,
    colorClass: 'text-purple-600 border-purple-200 bg-purple-50',
    bgGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
  },
  Shadowmon: {
    role: 'Ranged Dark / Soul Burst',
    abilityName: 'Dark Shadowraze Eruption',
    abilityDesc: 'Fires dark crimson energy bolts. Special erupts a vertical nether shadowraze pillar from the ground.',
    ultimateName: 'Soul Blast',
    ultimateDesc: '1.5s channel, 120 energy, dual screen-sweeping dark waves empowered up to 5x by Dark Soul Stacks.',
    cost: 450,
    colorClass: 'text-rose-600 border-rose-900 bg-rose-950',
    bgGradient: 'from-rose-900 via-stone-900 to-red-950',
  },
};

// Render Draco SVGs efficiently without Framer Motion ticker overhead
const DracoArtwork: React.FC<{ name: string; animated?: boolean; size?: number }> = ({ name, animated = false, size = 90 }) => {
  const animClass = animated ? 'animate-float-slow mx-auto' : 'mx-auto';

  if (name === 'Jumpmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
        <path d="M 30 75 Q 15 70 20 50 Q 25 45 32 60 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        <path d="M 38 45 Q 22 25 35 25 Q 40 32 42 42 Z" fill="#d97706" />
        <circle cx="50" cy="55" r="25" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        <circle cx="50" cy="62" r="15" fill="#fef08a" />
        <path d="M 38 32 Q 32 18 42 24 Z" fill="#b45309" />
        <path d="M 62 32 Q 68 18 58 24 Z" fill="#b45309" />
        <circle cx="45" cy="48" r="3" fill="#000" />
        <circle cx="55" cy="48" r="3" fill="#000" />
        <circle cx="40" cy="53" r="2" fill="#f87171" />
        <circle cx="60" cy="53" r="2" fill="#f87171" />
      </svg>
    );
  }

  if (name === 'Archermon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
        <path d="M 32 75 Q 10 80 18 60 Z" fill="#047857" />
        <rect x="35" y="38" width="30" height="38" rx="8" fill="#10b981" stroke="#047857" strokeWidth="3" />
        <path d="M 32 38 Q 50 18 68 38 Z" fill="#059669" stroke="#047857" strokeWidth="2" />
        <circle cx="50" cy="22" r="3" fill="#facc15" />
        <rect x="42" y="44" width="4" height="6" fill="#fff" />
        <rect x="54" y="44" width="4" height="6" fill="#fff" />
        <rect x="44" y="46" width="2" height="4" fill="#000" />
        <rect x="54" y="46" width="2" height="4" fill="#000" />
        <path d="M 66 40 A 15 15 0 0 1 66 70" fill="none" stroke="#b45309" strokeWidth="2.5" />
        <line x1="66" y1="40" x2="66" y2="70" stroke="#e2e8f0" strokeWidth="1" />
      </svg>
    );
  }

  if (name === 'Shieldmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="5" fill="rgba(0,0,0,0.1)" />
        <path d="M 30 50 Q 15 35 25 60 Z" fill="#1d4ed8" />
        <rect x="32" y="35" width="36" height="44" rx="12" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3.5" />
        <path d="M 36 35 L 30 22 L 42 30 L 50 18 L 58 30 L 70 22 L 64 35 Z" fill="#1e3a8a" />
        <rect x="40" y="46" width="6" height="4" fill="#facc15" />
        <rect x="54" y="46" width="6" height="4" fill="#facc15" />
        <rect x="62" y="44" width="12" height="34" rx="3" fill="#475569" stroke="#1e293b" strokeWidth="2" />
        <line x1="68" y1="44" x2="68" y2="78" stroke="#3b82f6" strokeWidth="1.5" />
      </svg>
    );
  }

  if (name === 'Assassinmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
        <rect x="34" y="38" width="32" height="38" rx="8" fill="#4c1d95" stroke="#1e1b4b" strokeWidth="3" />
        <path d="M 30 38 Q 50 16 70 38 Z" fill="#1e1b4b" stroke="#1e1b4b" strokeWidth="2" />
        <path d="M 34 52 L 66 52 L 50 68 Z" fill="#1e1b4b" stroke="#4c1d95" strokeWidth="1.5" />
        <rect x="41" y="44" width="6" height="3" fill="#c084fc" />
        <rect x="53" y="44" width="6" height="3" fill="#c084fc" />
        <path d="M 28 48 L 18 36 L 24 52 Z" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
        <path d="M 72 48 L 82 36 L 76 52 Z" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
      </svg>
    );
  }

  if (name === 'Whitemon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
        <path d="M 32 48 Q 10 24 34 36 Z" fill="#e2e8f0" opacity="0.9" />
        <path d="M 68 48 Q 90 24 66 36 Z" fill="#e2e8f0" opacity="0.9" />
        <rect x="36" y="36" width="28" height="40" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
        <rect x="42" y="44" width="5" height="7" fill="#000" />
        <rect x="53" y="44" width="5" height="7" fill="#000" />
        <path d="M 34 36 Q 50 18 66 36 Z" fill="#38bdf8" />
        <circle cx="24" cy="30" r="5" fill="#38bdf8" />
        <path d="M 18 30 L 22 26 L 24 32 Z" fill="#7dd3fc" />
        <path d="M 68 44 L 80 32 L 76 52 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
      </svg>
    );
  }

  if (name === 'Magemon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.15)" />
        <circle cx="30" cy="22" r="6" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
        <circle cx="50" cy="14" r="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <circle cx="70" cy="22" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <path d="M 32 45 L 68 45 L 76 80 L 24 80 Z" fill="#4c1d95" stroke="#312e81" strokeWidth="2.5" />
        <path d="M 50 45 L 42 80 M 50 45 L 58 80" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="50" cy="40" r="14" fill="#6d28d9" stroke="#4c1d95" strokeWidth="2" />
        <circle cx="45" cy="38" r="2.5" fill="#f59e0b" />
        <circle cx="55" cy="38" r="2.5" fill="#f59e0b" />
        <rect x="74" y="25" width="4" height="55" rx="2" fill="#78350f" />
        <circle cx="76" cy="23" r="6" fill="#a855f7" stroke="#6b21a8" strokeWidth="1.5" />
      </svg>
    );
  }

  if (name === 'Shadowmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.2)" />
        <path d="M 28 45 Q 6 20 32 32 Z" fill="#9f1239" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M 72 45 Q 94 20 68 32 Z" fill="#9f1239" stroke="#ef4444" strokeWidth="1.5" />
        <rect x="34" y="34" width="32" height="42" rx="10" fill="#18181b" stroke="#ef4444" strokeWidth="2.5" />
        <path d="M 32 30 L 26 14 L 40 24 Z" fill="#ef4444" />
        <path d="M 68 30 L 74 14 L 60 24 Z" fill="#ef4444" />
        <rect x="42" y="44" width="5" height="4" fill="#ef4444" />
        <rect x="53" y="44" width="5" height="4" fill="#ef4444" />
        <circle cx="50" cy="62" r="7" fill="#881337" stroke="#ef4444" strokeWidth="1.5" />
        <text x="50" y="65" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="monospace">5</text>
      </svg>
    );
  }

  // Flymon
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
      <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
      <path d="M 34 50 Q 14 26 36 38 Z" fill="#fda4af" opacity="0.85" />
      <path d="M 66 50 Q 86 26 64 38 Z" fill="#fda4af" opacity="0.85" />
      <rect x="36" y="36" width="28" height="40" rx="8" fill="#e11d48" stroke="#881337" strokeWidth="3" />
      <rect x="36" y="46" width="28" height="4" fill="#fb7185" />
      <rect x="36" y="56" width="28" height="4" fill="#fb7185" />
      <circle cx="44" cy="44" r="3.5" fill="#facc15" />
      <circle cx="56" cy="44" r="3.5" fill="#facc15" />
      <circle cx="44" cy="44" r="1.5" fill="#000" />
      <circle cx="56" cy="44" r="1.5" fill="#000" />
    </svg>
  );
};

export const DracoSelection: React.FC<DracoSelectionProps> = ({
  saveData,
  onSelect,
  onUnlock,
  onLevelUpWithCoins,
  onClose,
  onSwitchTier,
}) => {
  const equippedDraco = saveData.selectedDraco;
  const [selectedName, setSelectedName] = useState<string>(equippedDraco);
  const coins = saveData.player.coins;
  const currentTier = saveData.tier || 'Free';

  const inspectedData = saveData.dracos[selectedName] || {
    level: 1,
    hp: 10,
    attack: 1,
    defense: 1,
    speed: 1,
    jump: 1,
    range: 1,
    unlocked: false,
  };
  const inspectedMeta = DRACO_META[selectedName] || DRACO_META['Jumpmon'];
  const isUnlocked = !!inspectedData.unlocked;
  const isEquipped = equippedDraco === selectedName;
  const canAfford = coins >= inspectedMeta.cost;
  const lvl = inspectedData.level || 1;
  const hp = inspectedData.hp || 10;
  const att = inspectedData.attack || 1;
  const def = inspectedData.defense || 1;
  const spd = inspectedData.speed || 1;

  const levelUpCost = lvl * 100;
  const canLevelUp = isUnlocked && lvl < 15 && coins >= levelUpCost;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-900/50 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.96, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 10 }}
        className="w-full max-w-5xl max-h-[92vh] flex flex-col border bg-white/95 border-stone-200 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-stone-100 bg-stone-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-900 text-white rounded-2xl shadow-sm">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-900 font-display">Draco Sanctuary</h2>
              <p className="text-xs text-stone-500">Select & upgrade your battle companion</p>
            </div>
          </div>

          {/* Account Tier Switcher */}
          {onSwitchTier && (
            <div className="flex items-center gap-1 p-1 bg-stone-100 border border-stone-200 rounded-xl">
              {(['Free', 'Basic', 'Premium'] as TierType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    soundService.playClick();
                    onSwitchTier(t);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    currentTier === t
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <Award className="w-3 h-3" />
                  <span>{t}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-stone-200 shadow-sm">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-mono font-bold text-xs text-stone-800">{coins} Coins</span>
            </div>
            <button
              onClick={() => {
                soundService.playClick();
                onClose();
              }}
              className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout - Split 2 Panel (No Scroll Needed!) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Left Panel: Roster List (All 7 Dracos visible at a glance) */}
          <div className="md:col-span-4 border-r border-stone-100 bg-stone-50/40 p-4 flex flex-col justify-between space-y-1.5 overflow-hidden">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 px-2 mb-1">
              Roster (7)
            </div>
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
              {Object.keys(saveData.dracos).map((name) => {
                const dData = saveData.dracos[name];
                const meta = DRACO_META[name];
                const itemUnlocked = !!dData.unlocked;
                const itemEquipped = equippedDraco === name;
                const isSelected = selectedName === name;

                return (
                  <button
                    key={name}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedName(name);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'border-stone-900 bg-white shadow-md ring-2 ring-stone-900/10'
                        : itemEquipped
                        ? 'border-emerald-300 bg-emerald-50/40 hover:bg-white'
                        : itemUnlocked
                        ? 'border-stone-200 bg-white/70 hover:bg-white hover:border-stone-300'
                        : 'border-stone-200/60 bg-stone-100/50 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-stone-200/50">
                        <DracoArtwork name={name} animated={false} size={32} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-800 flex items-center gap-1 font-display">
                          {name}
                          {itemUnlocked && (
                            <span className="text-[10px] text-stone-400 font-normal">Lv.{dData.level || 1}</span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate max-w-[110px]">{meta.role}</div>
                      </div>
                    </div>

                    <div>
                      {itemEquipped ? (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">
                          ACTIVE
                        </span>
                      ) : itemUnlocked ? (
                        <span className="px-2 py-0.5 text-[9px] font-semibold text-stone-600 bg-stone-100 rounded-full border border-stone-200">
                          OWNED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 rounded-full border border-amber-200 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          {meta.cost}🪙
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Detailed Inspect Showcase */}
          <div className="md:col-span-8 p-5 flex flex-col justify-between bg-white overflow-hidden space-y-3">
            {/* Top Showcase Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 rounded-2xl bg-stone-50/80 border border-stone-100">
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${inspectedMeta.bgGradient} p-1 shadow-md flex items-center justify-center flex-shrink-0`}
                >
                  <div className="w-full h-full bg-white/90 rounded-xl flex items-center justify-center">
                    <DracoArtwork name={selectedName} animated={isEquipped} size={68} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-stone-900 font-display">{selectedName}</h3>
                    {isEquipped && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 rounded-full">
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-stone-500 mt-0.5">{inspectedMeta.role}</p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {isUnlocked ? `Class Unlocked • Level ${lvl}` : `Unlock Cost: ${inspectedMeta.cost} Coins`}
                  </p>
                </div>
              </div>

              {/* Main Action Button (Equip / Unlock) */}
              <div className="w-full sm:w-auto">
                {isUnlocked ? (
                  <button
                    disabled={isEquipped}
                    onClick={() => {
                      soundService.playLevelUp();
                      onSelect(selectedName);
                    }}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                      isEquipped
                        ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-default'
                        : 'bg-stone-900 hover:bg-stone-800 text-white shadow-md active:scale-95'
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        Active Companion
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-4 h-4" />
                        Equip {selectedName}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      soundService.playLevelUp();
                      onUnlock(selectedName, inspectedMeta.cost);
                    }}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95'
                        : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    Unlock for {inspectedMeta.cost} Coins
                  </button>
                )}
              </div>
            </div>

            {/* Stats & Upgrade Bar */}
            <div className="p-4 rounded-2xl bg-stone-50/50 border border-stone-100">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <span>Battle Attributes</span>
                  {isUnlocked && <span className="text-stone-400 font-normal text-[11px]">(Level {lvl}/15)</span>}
                </div>

                {isUnlocked && (
                  <div>
                    {lvl >= 15 ? (
                      <span className="px-2.5 py-1 text-[10px] font-bold text-purple-700 bg-purple-100 rounded-lg">
                        MAX LEVEL
                      </span>
                    ) : (
                      <button
                        disabled={!canLevelUp}
                        onClick={() => {
                          if (canLevelUp) {
                            soundService.playLevelUp();
                            onLevelUpWithCoins(selectedName);
                          } else {
                            soundService.playHit();
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                          canLevelUp
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-95'
                            : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        Upgrade ({levelUpCost}🪙)
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 2x2 Compact Stat Bars */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* HP */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-500 mb-0.5">
                    <span>HP</span>
                    <span className="font-mono font-bold text-stone-700">{hp}</span>
                  </div>
                  <div className="h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${Math.min(100, (hp / 35) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Attack */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-500 mb-0.5">
                    <span>Attack</span>
                    <span className="font-mono font-bold text-stone-700">{att}</span>
                  </div>
                  <div className="h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (att / 20) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Defense */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-500 mb-0.5">
                    <span>Defense</span>
                    <span className="font-mono font-bold text-stone-700">{def}</span>
                  </div>
                  <div className="h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, (def / 20) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Speed */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-500 mb-0.5">
                    <span>Speed</span>
                    <span className="font-mono font-bold text-stone-700">{spd}</span>
                  </div>
                  <div className="h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, (spd / 15) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Abilities Section (2-Column) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Special Skill Box */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                  <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                  <span>Special Skill</span>
                </div>
                <p className="text-xs font-extrabold text-amber-700 mt-1 leading-tight">{inspectedMeta.abilityName}</p>
                <p className="text-[11px] text-stone-600 mt-1 leading-normal">{inspectedMeta.abilityDesc}</p>
              </div>

              {/* Ultimate Skill Box */}
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/70">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Ultimate Skill</span>
                </div>
                <p className="text-xs font-extrabold text-purple-700 mt-1 leading-tight">
                  {inspectedMeta.ultimateName}
                </p>
                <p className="text-[11px] text-amber-950/80 mt-1 leading-normal">{inspectedMeta.ultimateDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DracoSelection;
