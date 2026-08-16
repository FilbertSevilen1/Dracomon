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
  Butchermon: {
    role: 'Blood / Melee Butcher',
    abilityName: 'Butcher Cleaver & Rotten Flesh (Toggle)',
    abilityDesc: 'Basic melee butcher knife slash (130px arc). Skill toggles a Rotten Flesh cloud damaging self and enemies with ramping damage over time, healing Butchermon for 25% of damage dealt.',
    ultimateName: 'Butcher\'s Masterpiece (80 Energy)',
    ultimateDesc: 'Fires an 800px wall-piercing hook chain. Hooking normal enemies pulls them to Butchermon (+200% Lifesteal for 6s); hooking bosses pulls Butchermon to the boss (+100% Lifesteal for 6s). Passive: +1 Max HP per kill.',
    cost: 500,
    colorClass: 'text-red-700 border-red-500 bg-red-950',
    bgGradient: 'from-red-700 via-rose-800 to-slate-950',
  },
  Reapermon: {
    role: 'Shadow Reaper / Death Scythe',
    abilityName: 'Death Scythe Cleave & Ascent Dash',
    abilityDesc: 'Basic attack swings the Scythe of Death in alternating wide arcs. Skill dashes 450px forward slicing enemies caught in path while swinging scythe upwards.',
    ultimateName: 'Giant Scythe of Damnation (120 Energy)',
    ultimateDesc: 'Marks & locks the enemy with the lowest % HP in 500px radius for 2s, then summons a Giant Spectral Scythe that slashes for massive execute damage (higher when enemy HP is low).',
    cost: 500,
    colorClass: 'text-purple-400 border-purple-600 bg-purple-950',
    bgGradient: 'from-purple-900 via-stone-900 to-emerald-950',
  },
};

const DracoArtwork: React.FC<{ name: string; animated?: boolean; size?: number }> = ({ name, animated = false, size = 90 }) => {
  const animClass = animated ? 'animate-float-slow mx-auto' : 'mx-auto';

  if (name === 'Reapermon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.35)" />
        {/* Dark Soul Aura */}
        <circle cx="50" cy="50" r="38" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 2" />
        {/* Tattered Shadow Cape / Wings */}
        <path d="M 30 42 Q 6 12 26 28 Q 16 48 32 60 Z" fill="#18181b" stroke="#a855f7" strokeWidth="1.5" />
        <path d="M 70 42 Q 94 12 74 28 Q 84 48 68 60 Z" fill="#18181b" stroke="#a855f7" strokeWidth="1.5" />
        {/* Main Reaper Body / Cloak */}
        <rect x="34" y="32" width="32" height="44" rx="12" fill="#090514" stroke="#c084fc" strokeWidth="2.5" />
        {/* Hood Shadow & Skull Head */}
        <path d="M 32 30 Q 50 16 68 30 L 64 48 Q 50 52 36 48 Z" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.8" />
        {/* Glowing Emerald Skull Eyes */}
        <circle cx="44" cy="38" r="3" fill="#10b981" />
        <circle cx="56" cy="38" r="3" fill="#10b981" />
        <circle cx="44" cy="38" r="1.2" fill="#ffffff" />
        <circle cx="56" cy="38" r="1.2" fill="#ffffff" />
        {/* Spectral Scythe of Death */}
        <path d="M 68 70 L 78 20" stroke="#71717a" strokeWidth="3" strokeLinecap="round" />
        <path d="M 78 20 Q 94 16 86 38 Q 82 28 78 20 Z" fill="#a855f7" stroke="#10b981" strokeWidth="1.8" />
        {/* Floating Souls */}
        <circle cx="28" cy="36" r="2.5" fill="#10b981" opacity="0.8" />
        <circle cx="72" cy="62" r="2" fill="#c084fc" opacity="0.8" />
      </svg>
    );
  }

  if (name === 'Enigmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.4)" />
        {/* Gravitational Event Horizon Orbit Rings */}
        <ellipse cx="50" cy="52" rx="44" ry="16" fill="none" stroke="#e879f9" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.85" />
        <ellipse cx="50" cy="52" rx="36" ry="10" fill="none" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65" />
        {/* Orbiting Void Particles */}
        <circle cx="8" cy="52" r="3" fill="#e879f9" stroke="#ffffff" strokeWidth="1" />
        <circle cx="92" cy="52" r="3" fill="#e879f9" stroke="#ffffff" strokeWidth="1" />
        <circle cx="50" cy="34" r="2.5" fill="#c084fc" />

        {/* Ethereal Void Dragon Wings with Glowing Magenta Lining */}
        <path d="M 28 42 Q -6 6 24 24 Q 14 44 32 58 Z" fill="#3b0764" stroke="#e879f9" strokeWidth="2" />
        <path d="M 72 42 Q 106 6 76 24 Q 86 44 68 58 Z" fill="#3b0764" stroke="#e879f9" strokeWidth="2" />
        <path d="M 28 40 Q 4 14 28 26 Z" fill="#7e22ce" opacity="0.65" />
        <path d="M 72 40 Q 96 14 72 26 Z" fill="#7e22ce" opacity="0.65" />

        {/* Void Demon Crest Horns */}
        <path d="M 34 32 L 20 10 L 38 20 Z" fill="#581c87" stroke="#e879f9" strokeWidth="1.5" />
        <path d="M 66 32 L 80 10 L 62 20 Z" fill="#581c87" stroke="#e879f9" strokeWidth="1.5" />

        {/* Main Body */}
        <rect x="34" y="30" width="32" height="46" rx="12" fill="#090514" stroke="#a855f7" strokeWidth="2.5" />

        {/* Void Glowing Eyes */}
        <circle cx="44" cy="42" r="3.5" fill="#e879f9" />
        <circle cx="56" cy="42" r="3.5" fill="#e879f9" />
        <circle cx="44" cy="42" r="1.2" fill="#ffffff" />
        <circle cx="56" cy="42" r="1.2" fill="#ffffff" />

        {/* Event Horizon Singularity Core */}
        <circle cx="50" cy="58" r="11" fill="rgba(232, 121, 249, 0.2)" />
        <circle cx="50" cy="58" r="8" fill="#000000" stroke="#e879f9" strokeWidth="2" />
        <circle cx="50" cy="58" r="4" fill="#7e22ce" stroke="#ffffff" strokeWidth="1" />
        <circle cx="50" cy="58" r="1.8" fill="#ffffff" />
      </svg>
    );
  }

  if (name === 'Lunarmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.3)" />

        {/* Glowing Silver Crescent Moon Halo Behind Head */}
        <path d="M 50 12 A 22 22 0 1 1 50 56 A 15 15 0 1 0 50 12 Z" fill="#c7d2fe" stroke="#93c5fd" strokeWidth="1.5" opacity="0.9" />
        {/* Halo Starlight Sparkles */}
        <circle cx="28" cy="22" r="1.5" fill="#ffffff" />
        <circle cx="72" cy="22" r="1.5" fill="#ffffff" />
        <circle cx="50" cy="10" r="2" fill="#ffffff" />

        {/* Moonlight Feathered Wings */}
        <path d="M 28 42 Q -2 10 26 24 Q 14 44 32 58 Z" fill="#1e3a8a" stroke="#e0f2fe" strokeWidth="1.8" />
        <path d="M 72 42 Q 102 10 74 24 Q 86 44 68 58 Z" fill="#1e3a8a" stroke="#e0f2fe" strokeWidth="1.8" />
        <path d="M 28 40 Q 6 18 30 28 Z" fill="#3b82f6" opacity="0.6" />
        <path d="M 72 40 Q 94 18 70 28 Z" fill="#3b82f6" opacity="0.6" />

        {/* Moonlight Crown Tiara */}
        <path d="M 36 32 L 26 12 L 40 22 Z" fill="#4f46e5" stroke="#e0e7ff" strokeWidth="1.5" />
        <path d="M 64 32 L 74 12 L 60 22 Z" fill="#4f46e5" stroke="#e0e7ff" strokeWidth="1.5" />
        <circle cx="50" cy="22" r="2.5" fill="#e0f2fe" stroke="#818cf8" strokeWidth="1" />

        {/* Main Body */}
        <rect x="34" y="30" width="32" height="46" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />

        {/* Glowing Silver Eyes */}
        <circle cx="44" cy="42" r="3.5" fill="#e0e7ff" />
        <circle cx="56" cy="42" r="3.5" fill="#e0e7ff" />
        <circle cx="44" cy="42" r="1.5" fill="#6366f1" />
        <circle cx="56" cy="42" r="1.5" fill="#6366f1" />
        <circle cx="45" cy="41" r="0.8" fill="#ffffff" />
        <circle cx="57" cy="41" r="0.8" fill="#ffffff" />

        {/* Crescent Moon Chest Emblem */}
        <circle cx="50" cy="58" r="10" fill="#312e81" stroke="#818cf8" strokeWidth="1.8" />
        <path d="M 50 51 A 7 7 0 1 1 50 65 A 4.5 4.5 0 1 0 50 51 Z" fill="#c7d2fe" />
      </svg>
    );
  }

  if (name === 'Azuremon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.3)" />
        {/* Dual Cosmic Orbital Rings */}
        <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.85" />
        <ellipse cx="50" cy="50" rx="38" ry="10" fill="none" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        {/* Orbiting Celestial Orbs */}
        <circle cx="8" cy="50" r="3.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="92" cy="50" r="3.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="50" cy="34" r="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        <circle cx="50" cy="66" r="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />

        {/* Primordial Celestial Dragon Wings */}
        <path d="M 28 42 Q -4 2 28 20 Q 14 38 32 50 Z" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.8" />
        <path d="M 72 42 Q 104 2 72 20 Q 86 38 68 50 Z" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.8" />
        <path d="M 30 40 Q 6 12 30 24 Z" fill="#38bdf8" opacity="0.75" />
        <path d="M 70 40 Q 94 12 70 24 Z" fill="#38bdf8" opacity="0.75" />
        <circle cx="6" cy="10" r="2" fill="#ffffff" />
        <circle cx="94" cy="10" r="2" fill="#ffffff" />

        {/* Dragon Tail */}
        <path d="M 44 72 Q 30 92 18 84 Q 22 76 38 70 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.2" />

        {/* Triple Crown Dragon Horns */}
        <path d="M 36 32 L 20 8 L 40 20 Z" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.2" />
        <path d="M 64 32 L 80 8 L 60 20 Z" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.2" />
        <path d="M 50 32 L 50 4 L 54 22 Z" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        <circle cx="20" cy="8" r="1.5" fill="#ffffff" />
        <circle cx="80" cy="8" r="1.5" fill="#ffffff" />
        <circle cx="50" cy="4" r="2" fill="#ffffff" />

        {/* Main Body */}
        <rect x="34" y="30" width="32" height="46" rx="12" fill="#0284c7" stroke="#0c4a6e" strokeWidth="2.5" />
        {/* Chest Armor Plate */}
        <path d="M 38 46 Q 50 52 62 46 L 58 70 Q 50 74 42 70 Z" fill="#e0f2fe" opacity="0.5" />

        {/* Celestial Eyes */}
        <circle cx="44" cy="42" r="3.5" fill="#0284c7" />
        <circle cx="56" cy="42" r="3.5" fill="#0284c7" />
        <circle cx="44" cy="42" r="1.5" fill="#e0f2fe" />
        <circle cx="56" cy="42" r="1.5" fill="#e0f2fe" />
        <circle cx="45" cy="41" r="0.8" fill="#ffffff" />
        <circle cx="57" cy="41" r="0.8" fill="#ffffff" />

        {/* Starburst Light Core */}
        <circle cx="50" cy="58" r="12" fill="rgba(56, 189, 248, 0.25)" />
        <circle cx="50" cy="58" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
        <circle cx="50" cy="58" r="3" fill="#ffffff" />
      </svg>
    );
  }

  if (name === 'Pixelmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.3)" />

        {/* 8-Bit Pixelated Hero Body */}
        <rect x="30" y="28" width="40" height="46" fill="#a855f7" stroke="#3b0764" strokeWidth="3" />
        <rect x="34" y="32" width="32" height="38" fill="#c084fc" />

        {/* 8-Bit Tetris Crown Spikes */}
        <rect x="30" y="20" width="6" height="8" fill="#f43f5e" />
        <rect x="47" y="16" width="6" height="12" fill="#f43f5e" />
        <rect x="64" y="20" width="6" height="8" fill="#f43f5e" />

        {/* 8-Bit Pixel Eyes */}
        <rect x="38" y="40" width="6" height="6" fill="#000000" />
        <rect x="56" y="40" width="6" height="6" fill="#000000" />
        <rect x="40" y="42" width="2" height="2" fill="#ffffff" />
        <rect x="58" y="42" width="2" height="2" fill="#ffffff" />

        {/* 8-Bit Tetris Chest Core */}
        <rect x="44" y="52" width="12" height="4" fill="#10b981" />
        <rect x="48" y="56" width="4" height="8" fill="#10b981" />

        {/* 8-Bit Pixel Hero Sword */}
        <g transform="translate(68, 30)">
          <rect x="4" y="0" width="4" height="28" fill="#10b981" stroke="#047857" strokeWidth="1" />
          <rect x="0" y="24" width="12" height="4" fill="#71717a" />
          <rect x="4" y="28" width="4" height="8" fill="#3f3f46" />
        </g>
      </svg>
    );
  }

  if (name === 'Thundermon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
        {/* Thunder Dragon Wings */}
        <path d="M 28 42 Q -2 4 28 22 Q 14 42 32 54 Z" fill="#eab308" stroke="#06b6d4" strokeWidth="1.8" />
        <path d="M 72 42 Q 102 4 72 22 Q 86 42 68 54 Z" fill="#eab308" stroke="#06b6d4" strokeWidth="1.8" />
        <path d="M 28 40 Q 6 14 30 26 Z" fill="#06b6d4" opacity="0.7" />
        <path d="M 72 40 Q 94 14 70 26 Z" fill="#06b6d4" opacity="0.7" />

        {/* Double Lightning Horns */}
        <path d="M 34 32 L 22 10 L 32 20 L 26 6 L 40 22 Z" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M 66 32 L 78 10 L 68 20 L 74 6 L 60 22 Z" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.2" />

        {/* Main Body */}
        <rect x="34" y="30" width="32" height="46" rx="12" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />

        {/* Electric Cyan Eyes */}
        <circle cx="44" cy="42" r="3.5" fill="#06b6d4" />
        <circle cx="56" cy="42" r="3.5" fill="#06b6d4" />
        <circle cx="44" cy="42" r="1.5" fill="#ffffff" />
        <circle cx="56" cy="42" r="1.5" fill="#ffffff" />

        {/* Electric Thunderbolt Chest Emblem */}
        <circle cx="50" cy="58" r="9" fill="#0891b2" stroke="#06b6d4" strokeWidth="1.5" />
        <path d="M 52 50 L 45 59 L 50 59 L 47 67 L 55 57 L 50 57 Z" fill="#ffffff" />
      </svg>
    );
  }

  if (name === 'Flymon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
        {/* Dual Translucent Wind Buzz Wings */}
        <path d="M 32 44 Q -6 12 24 26 Q 12 46 32 58 Z" fill="rgba(56, 189, 248, 0.65)" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M 68 44 Q 106 12 76 26 Q 88 46 68 58 Z" fill="rgba(56, 189, 248, 0.65)" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M 32 42 Q 4 20 28 32 Z" fill="#fda4af" opacity="0.6" />
        <path d="M 68 42 Q 96 20 72 32 Z" fill="#fda4af" opacity="0.6" />

        {/* Insect Crest Antenna Horns */}
        <path d="M 36 32 Q 22 10 18 4 Q 30 14 40 22 Z" fill="#e11d48" stroke="#facc15" strokeWidth="1.2" />
        <path d="M 64 32 Q 78 10 82 4 Q 70 14 60 22 Z" fill="#e11d48" stroke="#facc15" strokeWidth="1.2" />

        {/* Main Body */}
        <rect x="34" y="30" width="32" height="46" rx="12" fill="#e11d48" stroke="#881337" strokeWidth="2.5" />
        <rect x="34" y="44" width="32" height="4" fill="#facc15" />
        <rect x="34" y="54" width="32" height="4" fill="#facc15" />

        {/* Glowing Eyes */}
        <circle cx="44" cy="40" r="3.5" fill="#facc15" />
        <circle cx="56" cy="40" r="3.5" fill="#facc15" />
        <circle cx="44" cy="40" r="1.2" fill="#ffffff" />
        <circle cx="56" cy="40" r="1.2" fill="#ffffff" />

        {/* Poison Needle Stinger Tail */}
        <polygon points="50,76 44,92 56,92" fill="#facc15" stroke="#881337" strokeWidth="1" />
      </svg>
    );
  }

  if (name === 'Jumpmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="28" ry="6" fill="rgba(0,0,0,0.2)" />

        {/* Kangaroo Bunny Ears */}
        <path d="M 36 32 Q 22 4 34 8 Q 40 18 42 24 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.8" />
        <path d="M 64 32 Q 78 4 66 8 Q 60 18 58 24 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.8" />
        <path d="M 34 26 Q 26 8 33 11 Z" fill="#fef08a" />
        <path d="M 66 26 Q 74 8 67 11 Z" fill="#fef08a" />

        {/* Main Body */}
        <circle cx="50" cy="52" r="24" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        <circle cx="50" cy="58" r="14" fill="#fef08a" />

        {/* Eyes & Cheek Blush */}
        <circle cx="43" cy="46" r="3" fill="#000000" />
        <circle cx="57" cy="46" r="3" fill="#000000" />
        <circle cx="44" cy="45" r="1" fill="#ffffff" />
        <circle cx="58" cy="45" r="1" fill="#ffffff" />
        <circle cx="38" cy="52" r="2.5" fill="#f87171" />
        <circle cx="62" cy="52" r="2.5" fill="#f87171" />

        {/* Golden Star Core */}
        <polygon points="50,53 52,58 57,58 53,61 55,66 50,63 45,66 47,61 43,58 48,58" fill="#f59e0b" />

        {/* Spring Jump Boots */}
        <rect x="30" y="72" width="14" height="8" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
        <rect x="56" y="72" width="14" height="8" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
      </svg>
    );
  }

  if (name === 'Shieldmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />

        {/* Armored Shoulder Pads */}
        <path d="M 28 42 Q 10 24 32 32 Z" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
        <path d="M 72 42 Q 90 24 68 32 Z" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />

        {/* Titan Guardian Horns */}
        <path d="M 36 32 L 28 14 L 40 24 Z" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />
        <path d="M 64 32 L 72 14 L 60 24 Z" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />

        {/* Main Body */}
        <rect x="32" y="30" width="36" height="46" rx="14" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2.8" />

        {/* Glowing Sapphire Visor Eyes */}
        <rect x="40" y="40" width="6" height="5" rx="1" fill="#60a5fa" />
        <rect x="54" y="40" width="6" height="5" rx="1" fill="#60a5fa" />
        <rect x="42" y="41" width="2" height="3" fill="#ffffff" />
        <rect x="56" y="41" width="2" height="3" fill="#ffffff" />

        {/* Aegis Fortress Tower Shield */}
        <path d="M 60 36 L 82 36 L 86 76 L 71 86 L 56 76 Z" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
        <line x1="71" y1="42" x2="71" y2="78" stroke="#60a5fa" strokeWidth="2.5" />
        <line x1="63" y1="56" x2="79" y2="56" stroke="#60a5fa" strokeWidth="2.5" />
        <circle cx="71" cy="56" r="3.5" fill="#ffffff" />
      </svg>
    );
  }

  if (name === 'Whitemon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
        {/* Feathered Falcon Wings */}
        <path d="M 32 44 Q -4 10 26 24 Q 14 44 32 58 Z" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.8" />
        <path d="M 68 44 Q 104 10 74 24 Q 86 44 68 58 Z" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.8" />
        <path d="M 32 42 Q 6 18 30 30 Z" fill="#e2e8f0" />
        <path d="M 68 42 Q 94 18 70 30 Z" fill="#e2e8f0" />

        {/* Bird/Beast Spirit Crown Crest */}
        <path d="M 34 32 Q 50 14 66 32 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <circle cx="50" cy="22" r="3" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.2" />

        {/* Main Body */}
        <rect x="36" y="32" width="28" height="44" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />

        {/* Sapphire Eyes */}
        <circle cx="44" cy="42" r="3.5" fill="#0284c7" />
        <circle cx="56" cy="42" r="3.5" fill="#0284c7" />
        <circle cx="44" cy="42" r="1.2" fill="#ffffff" />
        <circle cx="56" cy="42" r="1.2" fill="#ffffff" />

        {/* Sunken Reef Beast Amulet Core */}
        <circle cx="50" cy="58" r="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <circle cx="50" cy="58" r="3" fill="#ffffff" />

        {/* Floating Bird Familiar */}
        <g transform="translate(74, 22)">
          <ellipse cx="10" cy="10" rx="8" ry="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          <polygon points="18,10 24,8 19,13" fill="#fbbf24" />
          <circle cx="14" cy="8" r="1.2" fill="#ffffff" />
        </g>
      </svg>
    );
  }

  if (name === 'Magemon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        {/* Ground Shadow */}
        <ellipse cx="50" cy="86" rx="24" ry="5" fill="rgba(0,0,0,0.2)" />
        {/* Floating Quas, Wex, Exort Elemental Orbs */}
        <circle cx="28" cy="18" r="6" fill="#ef4444" stroke="#fef08a" strokeWidth="1.5" />
        <circle cx="50" cy="10" r="6" fill="#06b6d4" stroke="#e0f2fe" strokeWidth="1.5" />
        <circle cx="72" cy="18" r="6" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
        {/* Magus Cloak & Robe */}
        <path d="M 22 48 L 78 48 L 84 82 L 16 82 Z" fill="#312e81" stroke="#1e1b4b" strokeWidth="2" />
        <path d="M 30 46 L 70 46 L 76 80 L 24 80 Z" fill="#6d28d9" stroke="#4c1d95" strokeWidth="2.5" />
        <path d="M 50 46 L 50 80" stroke="#f59e0b" strokeWidth="2" />
        {/* Head */}
        <circle cx="50" cy="42" r="14" fill="#6d28d9" stroke="#4c1d95" strokeWidth="2" />
        {/* Arcane Wizard Hat */}
        <ellipse cx="50" cy="38" rx="19" ry="5" fill="#312e81" stroke="#f59e0b" strokeWidth="1.5" />
        <path d="M 36 37 Q 44 26 44 18 Q 56 26 64 37 Z" fill="#6d28d9" stroke="#4c1d95" strokeWidth="1.5" />
        <circle cx="44" cy="18" r="2.5" fill="#f59e0b" />
        {/* Glowing Eyes */}
        <rect x="42" y="40" width="5" height="4" rx="1" fill="#fef08a" />
        <rect x="53" y="40" width="5" height="4" rx="1" fill="#fef08a" />
        {/* Archon Staff */}
        <rect x="76" y="24" width="3.5" height="58" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        <path d="M 72 20 Q 77 26 83 20" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="77.7" cy="18" r="5" fill="#c084fc" stroke="#ffffff" strokeWidth="1.2" />
      </svg>
    );
  }

  if (name === 'Butchermon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="28" ry="6" fill="rgba(0,0,0,0.35)" />
        <circle cx="50" cy="50" r="42" fill="rgba(185, 28, 28, 0.15)" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
        <circle cx="50" cy="48" r="24" fill="#991b1b" stroke="#450a0a" strokeWidth="2.5" />
        <rect x="40" y="44" width="6" height="7" rx="2" fill="#fff" />
        <rect x="54" y="44" width="6" height="7" rx="2" fill="#fff" />
        <circle cx="43" cy="47" r="2" fill="#dc2626" />
        <circle cx="57" cy="47" r="2" fill="#dc2626" />
        <ellipse cx="50" cy="58" rx="8" ry="10" fill="#fca5a5" />
        <path d="M 68 32 L 88 18 L 96 32 L 76 46 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        <rect x="66" y="34" width="10" height="4" fill="#78350f" rx="1" />
        <path d="M 46 26 Q 30 10 24 6 Q 38 16 48 24 Z" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1.5" />
        <path d="M 54 26 Q 70 10 76 6 Q 62 16 52 24 Z" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1.5" />
      </svg>
    );
  }

  if (name === 'Krakenmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="28" ry="6" fill="rgba(0,0,0,0.35)" />
        <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.85" />
        <ellipse cx="50" cy="50" rx="36" ry="10" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="12" cy="50" r="3" fill="#38bdf8" opacity="0.9" />
        <circle cx="88" cy="50" r="3" fill="#38bdf8" opacity="0.9" />
        <circle cx="50" cy="22" r="2.5" fill="#5eead4" opacity="0.9" />
        <path d="M 26 62 Q 8 76 18 92 Q 28 86 32 70 Z" fill="#0f766e" stroke="#115e59" strokeWidth="1.5" />
        <path d="M 36 66 Q 24 88 38 96 Q 44 88 42 72 Z" fill="#0d9488" stroke="#115e59" strokeWidth="1.5" />
        <path d="M 64 66 Q 76 88 62 96 Q 56 88 58 72 Z" fill="#0d9488" stroke="#115e59" strokeWidth="1.5" />
        <path d="M 74 62 Q 92 76 82 92 Q 72 86 68 70 Z" fill="#0f766e" stroke="#115e59" strokeWidth="1.5" />
        <circle cx="18" cy="80" r="2" fill="#99f6e4" />
        <circle cx="22" cy="86" r="2" fill="#99f6e4" />
        <circle cx="82" cy="80" r="2" fill="#99f6e4" />
        <circle cx="78" cy="86" r="2" fill="#99f6e4" />
        <path d="M 34 32 L 18 10 L 38 22 Z" fill="#0d9488" stroke="#5eead4" strokeWidth="1.5" />
        <path d="M 66 32 L 82 10 L 62 22 Z" fill="#0d9488" stroke="#5eead4" strokeWidth="1.5" />
        <path d="M 32 36 Q 50 14 68 36 Z" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1.8" />
        <circle cx="50" cy="46" r="22" fill="#14b8a6" stroke="#0f766e" strokeWidth="2.5" />
        <rect x="39" y="42" width="7" height="8" rx="3" fill="#ffffff" />
        <rect x="54" y="42" width="7" height="8" rx="3" fill="#ffffff" />
        <circle cx="42.5" cy="46" r="2.5" fill="#0284c7" />
        <circle cx="57.5" cy="46" r="2.5" fill="#0284c7" />
        <circle cx="43.5" cy="45" r="1" fill="#ffffff" />
        <circle cx="58.5" cy="45" r="1" fill="#ffffff" />
        <circle cx="50" cy="58" r="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        <path d="M 50 58 L 50 72 M 42 67 Q 50 76 58 67 M 40 67 L 44 67 M 56 67 L 60 67" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === 'Bombamon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
        <path d="M 28 44 Q 8 20 32 30 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
        <path d="M 72 44 Q 92 20 68 30 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
        <rect x="34" y="30" width="32" height="46" rx="12" fill="#f97316" stroke="#c2410c" strokeWidth="2.5" />
        <path d="M 36 34 L 28 20 L 42 28 Z" fill="#b91c1c" />
        <path d="M 64 34 L 72 20 L 58 28 Z" fill="#b91c1c" />
        <circle cx="44" cy="42" r="3.5" fill="#fef08a" />
        <circle cx="56" cy="42" r="3.5" fill="#fef08a" />
        <circle cx="50" cy="58" r="9" fill="#18181b" stroke="#f97316" strokeWidth="1.5" />
        <path d="M 50 50 L 52 46 L 55 48" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="56" cy="47" r="1.5" fill="#ef4444" />
      </svg>
    );
  }

  if (name === 'Archermon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
        <rect x="34" y="30" width="32" height="46" rx="12" fill="#10b981" stroke="#047857" strokeWidth="2.5" />
        <path d="M 30 30 Q 50 12 70 30 Z" fill="#059669" stroke="#047857" strokeWidth="2" />
        <circle cx="44" cy="42" r="3.5" fill="#ffffff" />
        <circle cx="56" cy="42" r="3.5" fill="#ffffff" />
        <circle cx="44" cy="42" r="1.5" fill="#000000" />
        <circle cx="56" cy="42" r="1.5" fill="#000000" />
        <path d="M 68 28 Q 80 50 68 70" fill="none" stroke="#ca8a04" strokeWidth="3" />
        <line x1="68" y1="28" x2="68" y2="70" stroke="#e2e8f0" strokeWidth="1" />
      </svg>
    );
  }

  if (name === 'Assassinmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
        <rect x="34" y="30" width="32" height="46" rx="12" fill="#4c1d95" stroke="#1e1b4b" strokeWidth="2.5" />
        <path d="M 30 30 Q 50 12 70 30 Z" fill="#1e1b4b" stroke="#1e1b4b" strokeWidth="2" />
        <rect x="41" y="42" width="6" height="3" fill="#c084fc" />
        <rect x="53" y="42" width="6" height="3" fill="#c084fc" />
        <path d="M 28 48 L 18 36 L 24 52 Z" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
        <path d="M 72 48 L 82 36 L 76 52 Z" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
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

  const dracoNames = Object.keys(saveData.dracos).sort((a, b) => a.localeCompare(b));
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
    <div className={`w-full flex flex-col ${isFullPage ? 'min-h-[550px]' : 'bg-stone-950 border border-stone-800/90 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh]'}`}>
      {!isFullPage && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 rounded-2xl shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wider text-stone-100 uppercase font-display flex items-center gap-2">
                Hero Roster <span className="text-amber-400 text-xs font-mono lowercase tracking-normal">dota 2 edition</span>
              </h2>
              <p className="text-xs text-stone-400 font-mono">Select & equip your battle companion</p>
            </div>
          </div>

          {onSwitchTier && (
            <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-xl">
              {(() => {
                const TIER_RANKS: Record<TierType, number> = { Free: 0, Basic: 1, Premium: 2 };
                const curRank = TIER_RANKS[currentTier] ?? 0;

                return (['Free', 'Basic', 'Premium'] as TierType[]).map((t) => {
                  const tRank = TIER_RANKS[t] ?? 0;
                  const isCurrent = currentTier === t;
                  const isLower = tRank < curRank;

                  return (
                    <button
                      key={t}
                      disabled={isCurrent || isLower}
                      onClick={() => {
                        soundService.playClick();
                        onSwitchTier(t);
                      }}
                      title={isLower ? `Included in ${currentTier} Tier` : undefined}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-amber-500 text-stone-950 shadow-sm cursor-default'
                          : isLower
                          ? 'bg-stone-800/60 text-stone-500 cursor-not-allowed opacity-60'
                          : 'text-stone-300 hover:text-white hover:bg-stone-800'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>{t}</span>
                    </button>
                  );
                });
              })()}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-stone-900/90 rounded-full border border-stone-800 shadow-inner">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-mono font-bold text-xs text-amber-300">{coins} Coins</span>
            </div>
            {onClose && (
              <button
                onClick={() => {
                  soundService.playClick();
                  onClose();
                }}
                className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 items-start p-6 overflow-y-auto bg-stone-950 text-stone-100">
        {/* Left Column: Dota 2 Hero Roster Grid */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter hero by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-900/90 border border-stone-800 rounded-2xl text-xs font-mono text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
              />
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-400 bg-stone-900/90 border border-stone-800 px-3.5 py-2 rounded-2xl shrink-0 font-display">
              Roster ({filteredDracos.length})
            </div>
          </div>

          <div className="p-3 bg-stone-900/40 rounded-3xl border border-stone-800/80 max-h-[520px] overflow-y-auto">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 gap-3 p-1">
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
                    className={`h-36 sm:h-40 rounded-2xl border transition-all duration-300 relative group overflow-hidden flex flex-col justify-between p-2 shadow-lg ${
                      isSelected
                        ? 'border-2 border-amber-400 ring-4 ring-amber-500/30 scale-[1.03] z-20 shadow-[0_0_25px_rgba(251,191,36,0.6)] bg-amber-950/80'
                        : itemEquipped
                        ? 'border-emerald-500/80 ring-2 ring-emerald-500/30 hover:scale-[1.02] hover:z-10 hover:border-emerald-400 bg-emerald-950/40'
                        : itemUnlocked
                        ? 'border-stone-800 hover:border-amber-400/80 hover:scale-[1.02] hover:z-10 bg-stone-900/90'
                        : 'border-stone-900 opacity-40 hover:opacity-85 hover:scale-[1.02] bg-stone-950/80'
                    }`}
                  >
                    {/* Dota 2 Full Background Hero Elemental Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${meta.bgGradient} opacity-40 group-hover:opacity-75 transition-opacity`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

                    {/* Top Badges */}
                    <div className="relative z-10 w-full flex items-center justify-between px-0.5 pt-0.5">
                      {itemEquipped ? (
                        <span className="px-1.5 py-0.5 bg-emerald-500 text-stone-950 text-[9px] font-black uppercase rounded tracking-wider shadow-sm font-display">
                          ACTIVE
                        </span>
                      ) : (
                        <span />
                      )}
                      {!itemUnlocked && (
                        <Lock className="w-3.5 h-3.5 text-stone-400 ml-auto drop-shadow-md" />
                      )}
                    </div>

                    {/* Hero SVG Character Artwork Floating in Upper Center */}
                    <div className="relative z-10 my-auto p-1 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
                      <DracoArtwork name={name} animated={isSelected} size={44} />
                    </div>

                    {/* Bottom Hero Name & Level Badge */}
                    <div className="relative z-10 w-full flex flex-col items-center">
                      <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider truncate max-w-full text-center drop-shadow-md font-display ${isSelected ? 'text-amber-300' : 'text-stone-100'}`}>
                        {name}
                      </span>
                      <span className="text-[9px] font-mono text-stone-400 font-bold drop-shadow">
                        {itemUnlocked ? `Lv.${dData.level || 1}` : 'Locked'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dota 2 Dark Obsidian Inspect Panel */}
        <div className="order-1 lg:order-2 lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl flex flex-col justify-between space-y-4 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-950/90 rounded-2xl border border-stone-800">
            <button
              onClick={() => {
                soundService.playClick();
                setInspectTab('details');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 transition-all ${
                inspectTab === 'details'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <span>📋 Details & Stats</span>
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setInspectTab('preview');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 transition-all ${
                inspectTab === 'preview'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>⚔️ Combat Preview</span>
            </button>
          </div>

          {inspectTab === 'preview' ? (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div>
                  <h4 className="text-sm font-black text-stone-100 font-display uppercase tracking-wider">
                    {selectedName} Combat Preview
                  </h4>
                </div>
              </div>
              <HeroDemoCanvas selectedDraco={selectedName} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                isEquipped
                  ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/50'
                  : 'bg-stone-950/70 border-stone-800'
              }`}>
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${inspectedMeta.bgGradient} p-1 shadow-lg flex items-center justify-center flex-shrink-0`}>
                    <div className="w-full h-full bg-stone-950/90 rounded-xl flex items-center justify-center">
                      <DracoArtwork name={selectedName} animated={isEquipped} size={52} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-wider font-display truncate">{selectedName}</h3>
                    <p className="text-xs font-semibold text-amber-400 mt-0.5 truncate">{inspectedMeta.role}</p>
                    <p className="text-[11px] font-mono text-stone-400 mt-0.5 truncate">
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
                      className={`w-full xl:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-display transition-all shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        isEquipped
                          ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-default'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-amber-500/20 active:scale-95'
                      }`}
                    >
                      {isEquipped ? 'ACTIVE HERO' : 'EQUIP HERO'}
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        soundService.playLevelUp();
                        onUnlock(selectedName, inspectedMeta.cost);
                      }}
                      className={`w-full xl:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-display transition-all shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 active:scale-95'
                          : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-4 h-4 shrink-0 fill-current" />
                      Unlock ({inspectedMeta.cost}🪙)
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-black uppercase tracking-wider text-stone-200 flex items-center gap-1.5 font-display">
                    <span>Battle Attributes</span>
                    {isUnlocked && <span className="text-stone-400 font-mono text-[11px] font-normal">(Lv.{lvl}/15)</span>}
                  </div>

                  {isUnlocked && (
                    <div>
                      {lvl >= 15 ? (
                        <span className="px-2.5 py-1 text-[10px] font-black text-purple-300 bg-purple-950/80 border border-purple-800 rounded-lg">
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
                              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95'
                              : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-3.5 h-3.5 fill-current" />
                          Upgrade ({levelUpCost}🪙)
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span className="font-bold text-stone-300">HP</span>
                      <span className="font-bold text-rose-400">{hp}</span>
                    </div>
                    <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)] rounded-full"
                        style={{ width: `${Math.min(100, (hp / 35) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span className="font-bold text-stone-300">Attack</span>
                      <span className="font-bold text-amber-400">{att}</span>
                    </div>
                    <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)] rounded-full"
                        style={{ width: `${Math.min(100, (att / 20) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span className="font-bold text-stone-300">Defense</span>
                      <span className="font-bold text-blue-400">{def}</span>
                    </div>
                    <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] rounded-full"
                        style={{ width: `${Math.min(100, (def / 20) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span className="font-bold text-stone-300">Speed</span>
                      <span className="font-bold text-emerald-400">{spd}</span>
                    </div>
                    <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] rounded-full"
                        style={{ width: `${Math.min(100, (spd / 15) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 font-display">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Special Skill</span>
                  </div>
                  <p className="text-xs font-bold text-stone-100 mt-1 leading-tight">{inspectedMeta.abilityName}</p>
                  <p className="text-[11px] text-stone-400 mt-1 leading-normal">{inspectedMeta.abilityDesc}</p>
                </div>

                <div className="p-3.5 bg-purple-950/30 rounded-2xl border border-purple-800/60">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-purple-400 font-display">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Ultimate Skill</span>
                  </div>
                  <p className="text-xs font-bold text-purple-300 mt-1 leading-tight">
                    {inspectedMeta.ultimateName}
                  </p>
                  <p className="text-[11px] text-purple-200/80 mt-1 leading-normal">{inspectedMeta.ultimateDesc}</p>
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
