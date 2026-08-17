import React from 'react';

export const DracoArtwork: React.FC<{ name: string; animated?: boolean; size?: number }> = ({ name, animated = false, size = 90 }) => {
  const animClass = animated ? 'animate-float-slow mx-auto' : 'mx-auto';

  if (name === 'Mikomon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <ellipse cx="50" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.35)" />
        {/* Sacred Shrine Torii Halo */}
        <path d="M 28 20 L 72 20 M 34 20 L 34 38 M 66 20 L 66 38 M 24 25 L 76 25" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
        {/* Floating Omikuji Cards & Sakura Petals */}
        <rect x="20" y="40" width="8" height="13" rx="1" fill="#f8fafc" stroke="#fbbf24" strokeWidth="1" transform="rotate(-15 24 46)" />
        <rect x="72" y="38" width="8" height="13" rx="1" fill="#f8fafc" stroke="#fbbf24" strokeWidth="1" transform="rotate(20 76 44)" />
        <circle cx="22" cy="30" r="2.5" fill="#f472b6" />
        <circle cx="78" cy="28" r="2" fill="#f472b6" />
        {/* Miko Robe Body */}
        <path d="M 32 46 L 22 76 L 40 76 L 50 56 L 60 76 L 78 76 L 68 46 Z" fill="#e11d48" stroke="#9f1239" strokeWidth="2" />
        <path d="M 40 44 L 50 60 L 60 44 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        {/* Golden Obi Sash */}
        <rect x="36" y="52" width="28" height="6" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        {/* Head / Miko Hood & Horns */}
        <circle cx="50" cy="36" r="14" fill="#e11d48" stroke="#9f1239" strokeWidth="2" />
        {/* Dragon Horns */}
        <path d="M 40 26 Q 34 16 38 12 Q 42 16 44 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <path d="M 60 26 Q 66 16 62 12 Q 58 16 56 24 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        {/* Face & Miko Mark */}
        <circle cx="45" cy="36" r="2" fill="#000000" />
        <circle cx="55" cy="36" r="2" fill="#000000" />
        <circle cx="50" cy="30" r="1.5" fill="#fbbf24" />
        {/* Kagura Bell in Hand */}
        <circle cx="72" cy="56" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <path d="M 72 60 L 72 68" stroke="#e11d48" strokeWidth="2" />
      </svg>
    );
  }

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

export default DracoArtwork;
