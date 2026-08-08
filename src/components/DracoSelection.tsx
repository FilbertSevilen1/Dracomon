import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SaveData, TierType } from '../types/game';
import { Shield, Zap, Lock, Sparkles, Coins, Award, X, Check, ArrowUpRight, Search } from 'lucide-react';
import { soundService } from '../services/sound';
import { HeroDemoCanvas } from './HeroDemoCanvas';
import { LevelUpModal } from './LevelUpModal';
import { PlayerStats } from '../types/game';

interface DracoSelectionProps {
  saveData: SaveData;
  onSelect: (name: string) => void;
  onUnlock: (name: string, cost: number) => void;
  onLevelUpWithCoins: (name: string) => void;
  onClose?: () => void;
  onSwitchTier?: (tier: TierType) => void;
  isFullPage?: boolean;
  showLevelUp?: boolean;
  levelUpInfo?: {
    dracoName: string;
    oldLevel: number;
    newLevel: number;
    baseIncrease: Partial<PlayerStats>;
    bonusRoll: number;
  } | null;
  onApplyBonus?: (stat: keyof PlayerStats) => void;
  pendingLevelUps?: any[];
}

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
    ultimateName: 'Tornado Tempest',
    ultimateDesc: 'Summons a giant tornado for 4s at the nearest enemy that sucks and lifts targets. Flymon gains homing basic attacks and double damage to lifted targets!',
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
  Bombamon: {
    role: 'Explosive / Carpet Bomber',
    abilityName: 'Homing Bomb Rock',
    abilityDesc: 'Throws a rock homing in on enemies (within 1000px). Explodes on hit or ignites 3-block ground burn for 2s.',
    ultimateName: 'Carpet Bombing',
    ultimateDesc: 'Flies across screen 8 blocks high, breathing fire to burn platforms for 5s. Lit foes move faster, linger burn 2s outside, & explode on death!',
    cost: 350,
    colorClass: 'text-orange-600 border-orange-300 bg-orange-50',
    bgGradient: 'from-orange-500 via-red-600 to-amber-500',
  },
  Thundermon: {
    role: 'Thunder / Electrotackle',
    abilityName: 'Electrotackle',
    abilityDesc: 'Dash forward to unblocked enemy. Explodes electricity on hit & leaves 4s electric charged platform path (300px) that deals damage & 0.2s ministuns.',
    ultimateName: 'Raigeki',
    ultimateDesc: 'Strikes lightning on all enemies within 800px radius, stunning for 1.0s. Defeated targets disintegrate into bone piles! (200 Energy)',
    cost: 400,
    colorClass: 'text-yellow-600 border-yellow-300 bg-yellow-50',
    bgGradient: 'from-yellow-400 via-amber-500 to-cyan-500',
  },
  Enigmon: {
    role: 'Cosmic / Dark Matter Singularity',
    abilityName: 'Schwarzschild Pulse',
    abilityDesc: 'Creates a 300px radius pulse dealing base damage + 3% enemy max HP damage each second for 3 seconds (cooldown 5s).',
    ultimateName: 'Black Hole',
    ultimateDesc: 'Channeling spell (300 Energy). Creates a 50px radius black hole 400px in front, pulling enemies & platforms in 400px radius at 80px/s (destroying sucked platforms except exit portal floor). Enemies within 150px are stunned. Lasts 3s.',
    cost: 500,
    colorClass: 'text-purple-400 border-purple-800 bg-purple-950',
    bgGradient: 'from-purple-900 via-indigo-950 to-black',
  },
  Lunarmon: {
    role: 'Lunar / Eclipse Guardian',
    abilityName: 'Moonbeam Strike',
    abilityDesc: 'Calls a vertical moonbeam from above onto the nearest enemy within 800px, dealing damage, mini-stunning, and restoring energy.',
    ultimateName: 'Lunar Eclipse',
    ultimateDesc: 'Triggers a lunar eclipse cinematic — bombards all enemies in 1200px with moonbeams, then launches above to fire a giant rotating beam for 3s (A/D to aim). Deals 0.25× attack damage per tick.',
    cost: 450,
    colorClass: 'text-indigo-300 border-indigo-700 bg-indigo-950',
    bgGradient: 'from-indigo-900 via-blue-950 to-slate-900',
  },
  Azuremon: {
    role: 'Celestial Dragon / Singularity',
    abilityName: 'Azure Singularity Vortex',
    abilityDesc: 'Fires a celestial black hole vortex ball that continuously pulls nearby enemies inward and implodes on hit, siphoning HP on damage.',
    ultimateName: 'Burst Stream of Singularity',
    ultimateDesc: 'Channels 2s to form a black hole singularity, then unleashes a gravitational cataclysm beam for 4s (W/S to aim) that pulls enemies, destroys terrain, and disintegrates all foes!',
    cost: 500,
    colorClass: 'text-sky-300 border-sky-400 bg-sky-950',
    bgGradient: 'from-sky-500 via-cyan-400 to-slate-900',
  },
  Pixelmon: {
    role: '8-Bit Retro / Tetris & Pacman',
    abilityName: 'Pacman Charge Strike',
    abilityDesc: 'Throws random Tetris blocks. Skill summons Pacman that charges 800px forward damaging foes until hitting terrain.',
    ultimateName: 'Mega Pixelmon (120 Energy)',
    ultimateDesc: 'Grows 300% larger for 8s. Spams multidirectional Tetris blocks, slashes a 800px giant Pixelated Sword, and detonates in a massive pixel blast when ending!',
    cost: 500,
    colorClass: 'text-fuchsia-400 border-fuchsia-500 bg-fuchsia-950',
    bgGradient: 'from-fuchsia-600 via-purple-700 to-indigo-900',
  },
  Krakenmon: {
    role: 'Ocean Abyssal / Leviathan',
    abilityName: 'Anchor Melee Smash & Tidal Wave',
    abilityDesc: 'Smashes a heavy anchor in a 140px melee arc for 1.25x damage. Special summons an 800px water wave that slows foes by 50% for 2s.',
    ultimateName: 'Collision Course (100 Energy)',
    ultimateDesc: 'Hurls a Ghost Pirate Boat projectile that explodes on impact into 30 random shrapnel pieces (400px radius, 50px AOE radius) & grants 50% Damage Reduction for 6s.',
    cost: 500,
    colorClass: 'text-teal-600 border-teal-300 bg-teal-50',
    bgGradient: 'from-teal-600 via-cyan-700 to-indigo-900',
  },
};

const DracoArtwork: React.FC<{ name: string; animated?: boolean; size?: number }> = ({ name, animated = false, size = 90 }) => {
  const animClass = animated ? 'animate-float-slow mx-auto' : 'mx-auto';

  if (name === 'Enigmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.3)" />
        {/* Cosmic Orbit Ring */}
        <ellipse cx="50" cy="52" rx="38" ry="14" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
        {/* Dark Wings */}
        <path d="M 28 44 Q 4 12 28 26 Z" fill="#3b0764" stroke="#c084fc" strokeWidth="1.5" />
        <path d="M 72 44 Q 96 12 72 26 Z" fill="#3b0764" stroke="#c084fc" strokeWidth="1.5" />
        {/* Body */}
        <rect x="34" y="34" width="32" height="42" rx="10" fill="#090514" stroke="#a855f7" strokeWidth="2.5" />
        <path d="M 34 34 L 24 16 L 38 24 Z" fill="#7e22ce" stroke="#c084fc" strokeWidth="1.2" />
        <path d="M 66 34 L 76 16 L 62 24 Z" fill="#7e22ce" stroke="#c084fc" strokeWidth="1.2" />
        {/* Eyes */}
        <circle cx="44" cy="46" r="3" fill="#c084fc" />
        <circle cx="56" cy="46" r="3" fill="#c084fc" />
        <circle cx="44" cy="46" r="1" fill="#ffffff" />
        <circle cx="56" cy="46" r="1" fill="#ffffff" />
        {/* Chest Singularity Core */}
        <circle cx="50" cy="62" r="8" fill="#000000" stroke="#c084fc" strokeWidth="2" />
        <circle cx="50" cy="62" r="3" fill="#e879f9" />
      </svg>
    );
  }

  if (name === 'Lunarmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.25)" />
        {/* Moon halo ring */}
        <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        {/* Wings */}
        <path d="M 28 44 Q 6 18 30 30 Z" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="1.5" />
        <path d="M 72 44 Q 94 18 70 30 Z" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="1.5" />
        {/* Body */}
        <rect x="34" y="34" width="32" height="42" rx="10" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
        {/* Crescent horn tips */}
        <path d="M 36 34 L 28 16 L 42 26 Z" fill="#4f46e5" stroke="#818cf8" strokeWidth="1.2" />
        <path d="M 64 34 L 72 16 L 58 26 Z" fill="#4f46e5" stroke="#818cf8" strokeWidth="1.2" />
        {/* Eyes */}
        <circle cx="44" cy="46" r="3" fill="#e0e7ff" />
        <circle cx="56" cy="46" r="3" fill="#e0e7ff" />
        <circle cx="44" cy="46" r="1.2" fill="#6366f1" />
        <circle cx="56" cy="46" r="1.2" fill="#6366f1" />
        {/* Crescent moon chest emblem */}
        <circle cx="50" cy="62" r="8" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" />
        <path d="M 50 55 A 7 7 0 1 1 50 69 A 4 4 0 1 0 50 55 Z" fill="#c7d2fe" />
      </svg>
    );
  }

  if (name === 'Azuremon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.25)" />
        {/* Dual Cosmic Orbital Rings */}
        <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.85" />
        <ellipse cx="50" cy="50" rx="36" ry="10" fill="none" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        {/* Orbiting Celestial Orbs */}
        <circle cx="10" cy="50" r="3.5" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
        <circle cx="90" cy="50" r="3.5" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
        <circle cx="50" cy="36" r="2.5" fill="#38bdf8" />
        {/* Dragon Wings */}
        <path d="M 28 42 Q 2 8 32 24 Z" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.8" />
        <path d="M 72 42 Q 98 8 68 24 Z" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.8" />
        <path d="M 30 40 Q 12 16 34 26 Z" fill="#0284c7" opacity="0.7" />
        <path d="M 70 40 Q 88 16 66 26 Z" fill="#0284c7" opacity="0.7" />
        {/* Crest Horns */}
        <path d="M 36 32 L 22 10 L 40 22 Z" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.2" />
        <path d="M 64 32 L 78 10 L 60 22 Z" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.2" />
        <path d="M 22 10 L 25 14" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 78 10 L 75 14" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
        {/* Main Body */}
        <rect x="34" y="32" width="32" height="44" rx="12" fill="#0284c7" stroke="#0c4a6e" strokeWidth="2.5" />
        {/* Chest Armor Plate */}
        <path d="M 38 48 Q 50 54 62 48 L 58 70 Q 50 74 42 70 Z" fill="#e0f2fe" opacity="0.5" />
        {/* Celestial Eyes */}
        <circle cx="44" cy="44" r="3.5" fill="#0284c7" />
        <circle cx="56" cy="44" r="3.5" fill="#0284c7" />
        <circle cx="44" cy="44" r="1.5" fill="#e0f2fe" />
        <circle cx="56" cy="44" r="1.5" fill="#e0f2fe" />
        <circle cx="45" cy="43" r="0.8" fill="#ffffff" />
        <circle cx="57" cy="43" r="0.8" fill="#ffffff" />
        {/* Chest Light Core & Starburst Halo */}
        <circle cx="50" cy="60" r="11" fill="rgba(56, 189, 248, 0.25)" />
        <circle cx="50" cy="60" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
        <circle cx="50" cy="60" r="3" fill="#ffffff" />
      </svg>
    );
  }

  if (name === 'Pixelmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.25)" />
        {/* Pixel Grid 8-Bit Body */}
        <rect x="30" y="30" width="40" height="44" fill="#a855f7" stroke="#3b0764" strokeWidth="3" />
        <rect x="34" y="34" width="32" height="36" fill="#c084fc" />
        {/* Pixel Eyes */}
        <rect x="38" y="42" width="6" height="6" fill="#000000" />
        <rect x="56" y="42" width="6" height="6" fill="#000000" />
        <rect x="40" y="44" width="2" height="2" fill="#ffffff" />
        <rect x="58" y="44" width="2" height="2" fill="#ffffff" />
        {/* Pixel Horns */}
        <rect x="30" y="22" width="6" height="8" fill="#f43f5e" />
        <rect x="64" y="22" width="6" height="8" fill="#f43f5e" />
        {/* Pixel Tetris Chest Core */}
        <rect x="44" y="54" width="12" height="4" fill="#eab308" />
        <rect x="48" y="58" width="4" height="8" fill="#eab308" />
      </svg>
    );
  }

  if (name === 'Krakenmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="28" ry="6" fill="rgba(0,0,0,0.35)" />
        {/* Ocean Halo Ring & Bio-Luminescent Water Droplets */}
        <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.85" />
        <ellipse cx="50" cy="50" rx="36" ry="10" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="12" cy="50" r="3" fill="#38bdf8" opacity="0.9" />
        <circle cx="88" cy="50" r="3" fill="#38bdf8" opacity="0.9" />
        <circle cx="50" cy="22" r="2.5" fill="#5eead4" opacity="0.9" />

        {/* Outer Writhing Tentacles */}
        <path d="M 26 62 Q 8 76 18 92 Q 28 86 32 70 Z" fill="#0f766e" stroke="#115e59" strokeWidth="1.5" />
        <path d="M 36 66 Q 24 88 38 96 Q 44 88 42 72 Z" fill="#0d9488" stroke="#115e59" strokeWidth="1.5" />
        <path d="M 64 66 Q 76 88 62 96 Q 56 88 58 72 Z" fill="#0d9488" stroke="#115e59" strokeWidth="1.5" />
        <path d="M 74 62 Q 92 76 82 92 Q 72 86 68 70 Z" fill="#0f766e" stroke="#115e59" strokeWidth="1.5" />

        {/* Tentacle Suction Cups */}
        <circle cx="18" cy="80" r="2" fill="#99f6e4" />
        <circle cx="22" cy="86" r="2" fill="#99f6e4" />
        <circle cx="82" cy="80" r="2" fill="#99f6e4" />
        <circle cx="78" cy="86" r="2" fill="#99f6e4" />

        {/* Dragon Horns & Leviathan Crest */}
        <path d="M 34 32 L 18 10 L 38 22 Z" fill="#0d9488" stroke="#5eead4" strokeWidth="1.5" />
        <path d="M 66 32 L 82 10 L 62 22 Z" fill="#0d9488" stroke="#5eead4" strokeWidth="1.5" />
        <path d="M 32 36 Q 50 14 68 36 Z" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1.8" />

        {/* Kraken Head Body */}
        <circle cx="50" cy="46" r="22" fill="#14b8a6" stroke="#0f766e" strokeWidth="2.5" />

        {/* Bio-Luminescent Glowing Eyes */}
        <rect x="39" y="42" width="7" height="8" rx="3" fill="#ffffff" />
        <rect x="54" y="42" width="7" height="8" rx="3" fill="#ffffff" />
        <circle cx="42.5" cy="46" r="2.5" fill="#0284c7" />
        <circle cx="57.5" cy="46" r="2.5" fill="#0284c7" />
        <circle cx="43.5" cy="45" r="1" fill="#ffffff" />
        <circle cx="58.5" cy="45" r="1" fill="#ffffff" />

        {/* Heavy Pirate Anchor Emblem */}
        <circle cx="50" cy="58" r="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        <path d="M 50 58 L 50 72 M 42 67 Q 50 76 58 67 M 40 67 L 44 67 M 56 67 L 60 67" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === 'Thundermon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.2)" />
        {}
        <path d="M 28 44 Q 6 16 30 28 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
        <path d="M 72 44 Q 94 16 70 28 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
        {}
        <rect x="34" y="34" width="32" height="42" rx="10" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
        <path d="M 34 34 L 26 14 L 38 24 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
        <path d="M 66 34 L 74 14 L 62 24 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
        {}
        <rect x="42" y="44" width="5" height="4" fill="#06b6d4" />
        <rect x="53" y="44" width="5" height="4" fill="#06b6d4" />
        {}
        <path d="M 52 52 L 44 64 L 50 64 L 47 74 L 56 60 L 50 60 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.2" />
      </svg>
    );
  }

  if (name === 'Bombamon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.2)" />
        {}
        <path d="M 28 44 Q 8 20 32 30 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
        <path d="M 72 44 Q 92 20 68 30 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
        {}
        <rect x="34" y="34" width="32" height="42" rx="10" fill="#f97316" stroke="#c2410c" strokeWidth="2.5" />
        <path d="M 36 34 L 28 20 L 42 28 Z" fill="#b91c1c" />
        <path d="M 64 34 L 72 20 L 58 28 Z" fill="#b91c1c" />
        {}
        <rect x="42" y="44" width="5" height="4" fill="#fef08a" />
        <rect x="53" y="44" width="5" height="4" fill="#fef08a" />
        {}
        <circle cx="50" cy="62" r="8" fill="#18181b" stroke="#f97316" strokeWidth="1.5" />
        <path d="M 50 54 L 52 50 L 55 52" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="56" cy="51" r="1.5" fill="#ef4444" />
      </svg>
    );
  }

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
  isFullPage = false,
  showLevelUp,
  levelUpInfo,
  onApplyBonus,
  pendingLevelUps,
}) => {
  const equippedDraco = saveData.selectedDraco;
  const [selectedName, setSelectedName] = useState<string>(equippedDraco);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectTab, setInspectTab] = useState<'details' | 'preview'>('details');
  const coins = saveData.player.coins;
  const currentTier = saveData.tier || 'Free';

  const dracoNames = Object.keys(saveData.dracos);
  const filteredDracos = dracoNames.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (DRACO_META[name]?.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  const hp = Math.round((inspectedData.hp || 10) * 10) / 10;
  const att = Math.round((inspectedData.attack || 1) * 10) / 10;
  const def = Math.round((inspectedData.defense || 1) * 10) / 10;
  const spd = Math.round((inspectedData.speed || 1) * 10) / 10;

  const levelUpCost = lvl * 100;
  const canLevelUp = isUnlocked && lvl < 15 && coins >= levelUpCost;

  const content = (
    <div className={`w-full flex flex-col ${isFullPage ? 'min-h-[500px]' : 'bg-white border border-stone-200/90 rounded-3xl shadow-xl overflow-hidden max-h-[92vh]'}`}>
      {!isFullPage && (
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
            {onClose && (
              <button
                onClick={() => {
                  soundService.playClick();
                  onClose();
                }}
                className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 items-start p-6 overflow-y-auto">
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter hero by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200/80 rounded-2xl text-xs font-mono text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
              />
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-stone-500 bg-stone-200/60 px-3 py-1.5 rounded-2xl shrink-0">
              Roster ({filteredDracos.length})
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-2">
            {filteredDracos.map((name) => {
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
                  className={`p-2 rounded-2xl border transition-all flex flex-col items-center justify-between relative group ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/80 shadow-md -translate-y-0.5'
                      : itemEquipped
                      ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300'
                      : itemUnlocked
                      ? 'bg-white hover:bg-stone-50 border-stone-200 hover:border-amber-300'
                      : 'bg-stone-100/60 border-stone-200/60 opacity-60 hover:opacity-90'
                  }`}
                >
                  {itemEquipped && (
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-sm" />
                  )}

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center p-1 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-amber-500/20 ring-2 ring-amber-400 shadow-sm'
                        : itemEquipped
                        ? 'bg-emerald-50 ring-1 ring-emerald-400 hover:scale-105'
                        : itemUnlocked
                        ? 'bg-stone-100 hover:bg-stone-200/70 hover:scale-105'
                        : 'bg-stone-100/50 opacity-45 hover:opacity-90 hover:scale-105'
                    }`}
                  >
                    <DracoArtwork name={name} animated={isSelected} size={44} />
                  </div>

                  <span className={`text-xs font-bold font-display mt-1.5 truncate max-w-full text-center ${isSelected ? 'text-amber-600 font-extrabold' : 'text-stone-800'}`}>
                    {name}
                  </span>
                  <span className="text-[10px] text-stone-400 font-semibold leading-tight">
                    {itemUnlocked ? `Lv.${dData.level || 1}` : 'Locked'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-md flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100/90 rounded-2xl border border-stone-200/80">
            <button
              onClick={() => {
                soundService.playClick();
                setInspectTab('details');
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 transition-all ${
                inspectTab === 'details'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>📋 Details & Stats</span>
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setInspectTab('preview');
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 transition-all ${
                inspectTab === 'preview'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>⚔️ Combat Preview</span>
            </button>
          </div>

          {inspectTab === 'preview' ? (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-2">
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900 font-display">
                    {selectedName} Combat Preview
                  </h4>
                </div>
              </div>
              <HeroDemoCanvas selectedDraco={selectedName} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 p-4 rounded-2xl transition-all ${
                isEquipped
                  ? 'bg-emerald-50/40 border-2 border-emerald-500 shadow-sm'
                  : 'bg-stone-50/80 border border-stone-100'
              }`}>
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${inspectedMeta.bgGradient} p-1 shadow-md flex items-center justify-center flex-shrink-0`}
                  >
                    <div className="w-full h-full bg-white/90 rounded-xl flex items-center justify-center">
                      <DracoArtwork name={selectedName} animated={isEquipped} size={52} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-stone-900 font-display truncate">{selectedName}</h3>
                    </div>
                    <p className="text-xs font-semibold text-stone-500 mt-0.5 truncate">{inspectedMeta.role}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                      {isUnlocked ? `Class Unlocked • Level ${lvl}` : `Unlock Cost: ${inspectedMeta.cost} Coins`}
                    </p>
                  </div>
                </div>

                <div className="w-full xl:w-auto shrink-0 mt-1 xl:mt-0">
                  {isUnlocked ? (
                    <button
                      disabled={isEquipped}
                      onClick={() => {
                        soundService.playLevelUp();
                        onSelect(selectedName);
                      }}
                      className={`w-full xl:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        isEquipped
                          ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-default'
                          : 'bg-stone-900 hover:bg-stone-800 text-white shadow-md active:scale-95'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          Active
                        </>
                      ) : (
                        <>
                          Equip
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
                      className={`w-full xl:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95'
                          : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-4 h-4 shrink-0" />
                      Unlock for {inspectedMeta.cost} Coins
                    </button>
                  )}
                </div>
              </div>

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

                <div className="grid grid-cols-2 gap-3 text-xs">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                    <span>Special Skill</span>
                  </div>
                  <p className="text-xs font-extrabold text-amber-700 mt-1 leading-tight">{inspectedMeta.abilityName}</p>
                  <p className="text-[11px] text-stone-600 mt-1 leading-normal">{inspectedMeta.abilityDesc}</p>
                </div>

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
          )}
        </div>
      </div>
    </div>
  );

  const modalElement = showLevelUp && levelUpInfo && onApplyBonus && (
    <LevelUpModal
      key={`${levelUpInfo.dracoName}-${levelUpInfo.oldLevel}-${levelUpInfo.newLevel}-${pendingLevelUps?.length || 0}`}
      dracoName={levelUpInfo.dracoName}
      oldLevel={levelUpInfo.oldLevel}
      newLevel={levelUpInfo.newLevel}
      baseIncrease={levelUpInfo.baseIncrease}
      bonusRoll={levelUpInfo.bonusRoll}
      currentStats={saveData.dracos[levelUpInfo.dracoName] as any}
      onApplyBonus={onApplyBonus}
      pendingCount={pendingLevelUps?.length || 0}
    />
  );

  if (isFullPage) {
    return (
      <>
        {content}
        {modalElement}
      </>
    );
  }

  return (
    <>
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
          className="w-full max-w-5xl"
        >
          {content}
        </motion.div>
      </motion.div>
      {modalElement}
    </>
  );
};

export default DracoSelection;
