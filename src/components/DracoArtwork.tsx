import React from 'react';

export const DracoArtwork: React.FC<{ name: string; animated?: boolean; size?: number }> = ({ name, animated = false, size = 90 }) => {
  const animClass = animated ? 'animate-float-slow mx-auto' : 'mx-auto';

  if (name === 'Megumon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <defs>
          <linearGradient id="megumonHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b1111" />
            <stop offset="60%" stopColor="#1c0a0a" />
            <stop offset="100%" stopColor="#0a0505" />
          </linearGradient>
          <linearGradient id="megumonRobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="megumonCapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#572118" />
            <stop offset="70%" stopColor="#30130d" />
            <stop offset="100%" stopColor="#1a0a07" />
          </linearGradient>
          <linearGradient id="megumonStaffGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="50%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <radialGradient id="megumonOrbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#ef4444" />
            <stop offset="75%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="megumonEyeGlow" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
        </defs>

        {/* Floor Shadow */}
        <ellipse cx="50" cy="89" rx="26" ry="5.5" fill="rgba(0,0,0,0.42)" />

        {/* Ambient Mana Convergence Magic Runes */}
        <circle cx="50" cy="52" r="39" fill="rgba(239, 68, 68, 0.08)" stroke="#ef4444" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.8" />
        <circle cx="50" cy="52" r="44" fill="none" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.6" />

        {/* Flowing Archmage Cloak Behind */}
        <path d="M 33 46 Q 14 62 18 84 Q 30 79 38 68 Z" fill="url(#megumonCapeGrad)" stroke="#78350f" strokeWidth="1.2" />
        <path d="M 67 46 Q 86 62 82 84 Q 70 79 62 68 Z" fill="url(#megumonCapeGrad)" stroke="#78350f" strokeWidth="1.2" />

        {/* Wizard Staff (Held Diagonal) */}
        <g id="megumonStaff">
          {/* Wooden Shaft */}
          <line x1="72" y1="88" x2="84" y2="28" stroke="url(#megumonStaffGrad)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="72.5" y1="88" x2="84.5" y2="28" stroke="#b45309" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          {/* Gold Spiral Head */}
          <path d="M 83 31 C 88 23 93 19 88 13 C 81 7 74 15 77 24 C 79 28 85 29 88 26" fill="none" stroke="#fbbf24" strokeWidth="2.4" strokeLinecap="round" />
          {/* Floating Crimson Core Gem Orb */}
          <circle cx="83" cy="18" r="6.5" fill="url(#megumonOrbGlow)" />
          <circle cx="81.5" cy="16.5" r="2" fill="#ffffff" opacity="0.9" />
          {/* Mana Sparks from Staff */}
          <circle cx="89" cy="14" r="1.4" fill="#fbbf24" />
          <circle cx="76" cy="12" r="1.2" fill="#ef4444" />
          <circle cx="86" cy="24" r="1" fill="#fef08a" />
        </g>

        {/* Legs: Left Boot & Right Bandaged Leg */}
        {/* Left Leg: Brown Adventurer Boot */}
        <path d="M 54 68 L 53 85 L 61 85 L 59 68 Z" fill="#451a03" stroke="#290e02" strokeWidth="1.2" />
        <rect x="52" y="78" width="9" height="2" fill="#d97706" rx="0.8" />
        {/* Right Leg: Bandaged Leg with Black Ribbon */}
        <path d="M 40 68 L 39 85 L 47 85 L 46 68 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" />
        <line x1="39" y1="72" x2="47" y2="73" stroke="#cbd5e1" strokeWidth="1.2" />
        <line x1="39" y1="76" x2="47" y2="77" stroke="#cbd5e1" strokeWidth="1.2" />
        <line x1="39" y1="80" x2="47" y2="81" stroke="#cbd5e1" strokeWidth="1.2" />
        <rect x="40" y="70" width="7" height="2" fill="#18181b" rx="0.6" />

        {/* Red Archmage Tunic / Dress */}
        <path d="M 36 43 L 32 69 Q 50 74 68 69 L 64 43 Z" fill="url(#megumonRobeGrad)" stroke="#7f1d1d" strokeWidth="1.8" />
        {/* Gold Trim along Tunic Hem */}
        <path d="M 32 69 Q 50 74 68 69" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
        {/* Gold Waist Belt & Buckle */}
        <rect x="34" y="54" width="32" height="4.5" fill="#1c1917" rx="1" />
        <rect x="34" y="54.5" width="32" height="3" fill="#b45309" />
        <rect x="46.5" y="53" width="7" height="6.5" rx="1.2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <rect x="48.5" y="55" width="3" height="2.5" fill="#1c1917" />

        {/* Brown Capelet / Collar over Shoulders */}
        <path d="M 33 42 Q 50 48 67 42 Q 62 52 50 51 Q 38 52 33 42 Z" fill="url(#megumonCapeGrad)" stroke="#451a03" strokeWidth="1.5" />
        {/* Gold Brooch / Collar Clasp */}
        <circle cx="50" cy="45" r="2.8" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
        <circle cx="50" cy="45" r="1.2" fill="#ef4444" />

        {/* Head & Face */}
        <ellipse cx="50" cy="36" rx="14" ry="12.5" fill="#fed7aa" stroke="#fba76a" strokeWidth="1" />
        {/* Dark Chestnut Hair */}
        <path d="M 36 34 Q 38 46 36 49 Q 42 45 44 38 Z" fill="#2d1212" />
        <path d="M 64 34 Q 62 46 64 49 Q 58 45 56 38 Z" fill="#2d1212" />
        <path d="M 38 31 Q 44 36 49 33 Q 54 36 62 31 Q 50 24 38 31 Z" fill="#3b1111" />

        {/* Signature Eyepatch over Right Eye */}
        <rect x="41" y="32" width="7.5" height="7" rx="2" fill="#09090b" stroke="#27272a" strokeWidth="1" />
        {/* Eyepatch Red Cross Stitch */}
        <line x1="44.75" y1="33.5" x2="44.75" y2="37.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="42.75" y1="35.5" x2="46.75" y2="35.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="37" y1="33" x2="42" y2="34" stroke="#09090b" strokeWidth="1" />
        <line x1="48" y1="35" x2="52" y2="36" stroke="#09090b" strokeWidth="1" />

        {/* Radiant Crimson Demon Eye (Left) */}
        <ellipse cx="55.5" cy="35" rx="3.4" ry="4" fill="url(#megumonEyeGlow)" />
        <circle cx="55.5" cy="35" r="1.6" fill="#450a0a" />
        <circle cx="54.5" cy="33.8" r="1" fill="#ffffff" />
        <circle cx="56.5" cy="36.2" r="0.6" fill="#fef08a" />

        {/* Cute Confident Smile */}
        <path d="M 49 42 Q 52 44.5 54 42" fill="none" stroke="#9a3412" strokeWidth="1.2" strokeLinecap="round" />
        {/* Blush Marks */}
        <ellipse cx="40" cy="40" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.45" />
        <ellipse cx="60" cy="40" rx="2.5" ry="1.2" fill="#f43f5e" opacity="0.45" />

        {/* Oversized Archmage Witch Hat */}
        <g id="megumonHat">
          {/* Hat Brim */}
          <path d="M 18 31 C 28 22 72 22 82 31 C 72 36 28 36 18 31 Z" fill="url(#megumonHatGrad)" stroke="#7f1d1d" strokeWidth="1.8" />
          <path d="M 20 31 C 29 24 71 24 80 31" fill="none" stroke="#fbbf24" strokeWidth="1.4" />
          {/* Hat Cone with Crinkle at Top */}
          <path d="M 33 28 Q 42 12 56 6 Q 64 2 62 9 Q 58 17 67 28 Z" fill="url(#megumonHatGrad)" stroke="#7f1d1d" strokeWidth="1.8" />
          {/* Gold Hat Band */}
          <path d="M 33 27 Q 50 32 67 27 L 66 23 Q 50 28 34 23 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
          {/* Gold Face Emblem / Hat Buckle */}
          <circle cx="50" cy="26" r="4.2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          <circle cx="48.5" cy="25" r="1" fill="#1c1917" />
          <circle cx="51.5" cy="25" r="1" fill="#1c1917" />
          <path d="M 48.5 27.5 Q 50 29 51.5 27.5" fill="none" stroke="#1c1917" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* Crimson Explosion Embers Floating Overhead */}
        <path d="M 28 14 L 30 18 L 26 18 Z" fill="#ef4444" opacity="0.85" />
        <circle cx="23" cy="22" r="1.5" fill="#fbbf24" />
        <circle cx="70" cy="4" r="1.8" fill="#ef4444" />
        <circle cx="74" cy="7" r="1" fill="#fef08a" />
      </svg>
    );
  }

  if (name === 'Blastermon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <defs>
          <linearGradient id="blasterBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="40%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
          <linearGradient id="blasterCapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="60%" stopColor="#3b0764" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="blasterEyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="70%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="88" rx="24" ry="5" fill="rgba(0,0,0,0.45)" />

        {/* Shadow Paladin Ambient Lightning Aura */}
        <circle cx="50" cy="50" r="38" fill="rgba(124, 58, 237, 0.12)" stroke="#7c3aed" strokeWidth="1" strokeDasharray="5 4" />

        {/* Flowing Dark Cape with Purple Lining */}
        <path d="M 32 44 Q 10 60 14 84 Q 28 80 36 68 Z" fill="url(#blasterCapeGrad)" stroke="#581c87" strokeWidth="1.2" />
        <path d="M 68 44 Q 90 60 86 84 Q 72 80 64 68 Z" fill="url(#blasterCapeGrad)" stroke="#581c87" strokeWidth="1.2" />

        {/* Armored Legs & Sabatons */}
        <path d="M 38 68 L 34 84 L 44 84 L 42 68 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
        <path d="M 58 68 L 56 84 L 66 84 L 62 68 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
        <rect x="36" y="72" width="6" height="3" fill="#fbbf24" rx="1" />
        <rect x="58" y="72" width="6" height="3" fill="#fbbf24" rx="1" />

        {/* Obsidian Cuirass / Torso Armor */}
        <path d="M 34 40 L 32 68 L 68 68 L 66 40 Z" fill="#18181b" stroke="#27272a" strokeWidth="2" />
        <path d="M 38 42 L 36 66 L 64 66 L 62 42 Z" fill="#09090b" />

        {/* Paladin Gold Cross Insignia */}
        <rect x="48" y="44" width="4" height="18" fill="#fbbf24" />
        <rect x="42" y="49" width="16" height="4" fill="#fbbf24" />
        <circle cx="50" cy="51" r="2.5" fill="#fef08a" />

        {/* Spiked Pauldrons */}
        <path d="M 28 42 L 20 34 L 34 38 Z" fill="#27272a" stroke="#7c3aed" strokeWidth="1.5" />
        <path d="M 72 42 L 80 34 L 66 38 Z" fill="#27272a" stroke="#7c3aed" strokeWidth="1.5" />

        {/* Shadow Knight Helmet */}
        <path d="M 36 34 Q 50 18 64 34 L 64 42 Q 50 46 36 42 Z" fill="#09090b" stroke="#3b0764" strokeWidth="2" />

        {/* Sharp Twin Horned Crest */}
        <path d="M 38 28 Q 24 14 26 4 Q 34 16 42 22 Z" fill="#18181b" stroke="#7c3aed" strokeWidth="1.5" />
        <path d="M 62 28 Q 76 14 74 4 Q 66 16 58 22 Z" fill="#18181b" stroke="#7c3aed" strokeWidth="1.5" />

        {/* Glowing Crimson Visor Slit */}
        <rect x="40" y="32" width="20" height="3.5" rx="1.5" fill="#ef4444" />
        <circle cx="50" cy="33.5" r="2" fill="#ffffff" />

        {/* Blaster Dark Broadsword (Held Angled) */}
        <g transform="rotate(25 70 50)">
          {/* Pommel & Hilt */}
          <circle cx="70" cy="74" r="3" fill="#fbbf24" />
          <rect x="68.5" y="64" width="3" height="10" fill="#18181b" />
          {/* Crossguard */}
          <rect x="62" y="62" width="16" height="3.5" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
          {/* Blade */}
          <path d="M 66 62 L 67 22 L 70 14 L 73 22 L 74 62 Z" fill="url(#blasterBladeGrad)" stroke="#c084fc" strokeWidth="1.2" />
          {/* Runic Glow */}
          <line x1="70" y1="60" x2="70" y2="24" stroke="#fbbf24" strokeWidth="1" />
        </g>

        {/* Lightning Sparks */}
        <path d="M 74 24 L 78 28 L 75 32 L 80 36" stroke="#c084fc" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 22 40 L 26 44 L 23 48 L 27 52" stroke="#fbbf24" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === 'Phantomon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <defs>
          <linearGradient id="phantomonBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="85%" stopColor="#09090b" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <linearGradient id="phantomonWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <radialGradient id="phantomonCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="65%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="88" rx="26" ry="6" fill="rgba(0,0,0,0.5)" />

        {/* Ambient Dark Dragon Aura */}
        <circle cx="50" cy="48" r="42" fill="rgba(2, 132, 199, 0.08)" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="6 4" />

        {/* Phantom Blaster Dragon Spreading Wings with Cannon Barrels */}
        {/* Left Wing */}
        <path d="M 38 46 Q 12 24 6 12 Q 20 28 22 48 Q 28 58 36 54 Z" fill="url(#phantomonWingGrad)" stroke="#00f0ff" strokeWidth="1.2" />
        <rect x="8" y="14" width="4" height="22" rx="1.5" fill="#0f172a" stroke="#00f0ff" strokeWidth="1" transform="rotate(-25 10 25)" />
        {/* Right Wing */}
        <path d="M 62 46 Q 88 24 94 12 Q 80 28 78 48 Q 72 58 64 54 Z" fill="url(#phantomonWingGrad)" stroke="#00f0ff" strokeWidth="1.2" />
        <rect x="88" y="14" width="4" height="22" rx="1.5" fill="#0f172a" stroke="#00f0ff" strokeWidth="1" transform="rotate(25 90 25)" />

        {/* Shadow Dragon Tail */}
        <path d="M 46 76 Q 30 84 26 92 Q 36 94 48 80 Z" fill="#09090b" stroke="#00f0ff" strokeWidth="1" />

        {/* Armored Dragon Legs */}
        <path d="M 36 68 L 32 86 L 42 86 L 42 68 Z" fill="#09090b" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M 58 68 L 58 86 L 68 86 L 64 68 Z" fill="#09090b" stroke="#1e293b" strokeWidth="1.5" />
        {/* Claws */}
        <polygon points="31,86 34,89 37,86" fill="#00f0ff" />
        <polygon points="63,86 66,89 69,86" fill="#00f0ff" />

        {/* Obsidian Cuirass with Cyan Runic Core */}
        <path d="M 34 38 L 30 68 L 70 68 L 66 38 Z" fill="#09090b" stroke="#1e293b" strokeWidth="2" />
        <path d="M 38 40 L 34 66 L 66 66 L 62 40 Z" fill="#030712" />

        {/* Glowing Azure Dragon Core */}
        <circle cx="50" cy="52" r="5" fill="url(#phantomonCoreGlow)" />
        <polygon points="50,47 54,52 50,57 46,52" fill="#ffffff" />
        {/* Circuit lines */}
        <path d="M 46 52 L 38 56" stroke="#00f0ff" strokeWidth="1.2" fill="none" />
        <path d="M 54 52 L 62 56" stroke="#00f0ff" strokeWidth="1.2" fill="none" />

        {/* Dragon Spiked Pauldrons */}
        <path d="M 28 38 L 18 28 L 32 34 Z" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5" />
        <path d="M 72 38 L 82 28 L 68 34 Z" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5" />

        {/* Dragon Knight Helmet */}
        <path d="M 36 32 Q 50 14 64 32 L 64 40 Q 50 44 36 40 Z" fill="#09090b" stroke="#1e293b" strokeWidth="2" />

        {/* Phantom Blaster Horns (Sharp Sweeping Crest) */}
        <path d="M 38 26 Q 20 8 18 2 Q 28 14 40 20 Z" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5" />
        <path d="M 62 26 Q 80 8 82 2 Q 72 14 60 20 Z" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5" />
        {/* Center Spire */}
        <polygon points="50,6 47,22 53,22" fill="#00f0ff" />

        {/* Glowing Electric Cyan Visor */}
        <rect x="40" y="28" width="20" height="3" rx="1.5" fill="#00f0ff" />
        <circle cx="50" cy="29.5" r="1.5" fill="#ffffff" />

        {/* Colossal Void Scythe (Held Angled) */}
        <g transform="rotate(22 75 45)">
          {/* Haft */}
          <rect x="71" y="8" width="3" height="82" fill="#0f172a" stroke="#1e293b" strokeWidth="0.8" rx="1" />
          {/* Scythe Curved Crescent Blade */}
          <path d="M 72 14 Q 52 -6 28 2 Q 52 10 70 24 Z" fill="url(#phantomonBladeGrad)" stroke="#00f0ff" strokeWidth="1.4" />
          {/* Scythe Core Gem */}
          <circle cx="72" cy="18" r="3.5" fill="#00f0ff" />
          <circle cx="72" cy="18" r="1.8" fill="#ffffff" />
        </g>
      </svg>
    );
  }

  if (name === 'EndMon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <defs>
          <linearGradient id="endmonWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <radialGradient id="endmonCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="88" rx="26" ry="6" fill="rgba(0,0,0,0.4)" />

        {/* Dragonic Overlord Flame Aura */}
        <circle cx="50" cy="50" r="38" fill="rgba(220, 38, 38, 0.15)" stroke="#dc2626" strokeWidth="1" strokeDasharray="6 3" />

        {/* Spreading Blazing Wings (Dual-layered Overlord Wings) */}
        {/* Left Primary Wing */}
        <path d="M 32 46 Q 2 12 18 28 Q 6 40 22 52 Q 14 62 34 60 Z" fill="url(#endmonWingGrad)" stroke="#450a0a" strokeWidth="1.5" />
        <path d="M 30 44 Q 8 20 20 32 Q 12 42 24 50 Z" fill="#fbbf24" opacity="0.75" />
        {/* Right Primary Wing */}
        <path d="M 68 46 Q 98 12 82 28 Q 94 40 78 52 Q 86 62 66 60 Z" fill="url(#endmonWingGrad)" stroke="#450a0a" strokeWidth="1.5" />
        <path d="M 70 44 Q 92 20 80 32 Q 88 42 76 50 Z" fill="#fbbf24" opacity="0.75" />

        {/* Dragon Tail with Flame Tip */}
        <path d="M 36 72 Q 20 80 18 90 Q 24 88 32 78 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1.5" />
        <circle cx="18" cy="90" r="4" fill="#fbbf24" />
        <circle cx="18" cy="90" r="2.5" fill="#ef4444" />

        {/* Armored Dragon Legs */}
        <path d="M 38 72 L 34 84 L 44 84 L 42 72 Z" fill="#1c1917" stroke="#7f1d1d" strokeWidth="1.5" />
        <path d="M 58 72 L 56 84 L 66 84 L 62 72 Z" fill="#1c1917" stroke="#7f1d1d" strokeWidth="1.5" />

        {/* Armored Dragon Torso & Chestplate */}
        <path d="M 34 38 L 28 68 L 72 68 L 66 38 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
        <path d="M 38 42 L 50 64 L 62 42 Z" fill="#1c1917" stroke="#dc2626" strokeWidth="1.5" />

        {/* Dragon Flame Chest Core (Overlord Core) */}
        <circle cx="50" cy="52" r="7" fill="url(#endmonCoreGlow)" />
        <circle cx="50" cy="52" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />

        {/* Armored Shoulders / Pauldrons */}
        <path d="M 28 36 L 18 30 L 26 48 Z" fill="#dc2626" stroke="#fbbf24" strokeWidth="1.5" />
        <path d="M 72 36 L 82 30 L 74 48 Z" fill="#dc2626" stroke="#fbbf24" strokeWidth="1.5" />

        {/* Dragonic Overlord Helm & Horns */}
        <ellipse cx="50" cy="30" rx="14" ry="12" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
        {/* Golden Swept Crest Horns */}
        <path d="M 40 24 Q 28 4 34 2 Q 40 10 44 20 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
        <path d="M 60 24 Q 72 4 66 2 Q 60 10 56 20 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
        <path d="M 48 20 L 50 10 L 52 20 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

        {/* Visor & Glowing Eyes */}
        <polygon points="41,29 48,31 43,34" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
        <polygon points="59,29 52,31 57,34" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />

        {/* Arm-Mounted Dragon Cannon / Rifle in Right Arm */}
        <rect x="68" y="48" width="22" height="6" rx="2" fill="#1c1917" stroke="#fbbf24" strokeWidth="1.2" />
        <rect x="88" y="46.5" width="4" height="9" rx="1" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
        <circle cx="92" cy="51" r="2" fill="#ef4444" />

        {/* Floating Sparks */}
        <circle cx="22" cy="22" r="1.5" fill="#fbbf24" />
        <circle cx="80" cy="20" r="1.5" fill="#f97316" />
        <circle cx="50" cy="8" r="2" fill="#ef4444" />
      </svg>
    );
  }

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
        <defs>
          <linearGradient id="jumpmon-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#fbbf24" />
            <stop offset="85%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="jumpmon-ear-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Kinetic Rings */}
        <ellipse cx="50" cy="87" rx="30" ry="6" fill="rgba(0,0,0,0.25)" />
        <ellipse cx="50" cy="87" rx="22" ry="4" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />

        {/* Powerful Coiled Kangaroo Dragon Tail */}
        <path d="M 28 64 Q 10 74 12 56 Q 14 44 24 50" fill="none" stroke="#d97706" strokeWidth="7" strokeLinecap="round" />
        <path d="M 28 64 Q 10 74 12 56 Q 14 44 24 50" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
        <circle cx="12" cy="56" r="3.5" fill="#f59e0b" />
        <circle cx="12" cy="56" r="1.5" fill="#fef08a" />

        {/* Aerodynamic Dragon Bunny Ears */}
        {/* Left Ear */}
        <path d="M 37 32 C 24 16 16 0 32 3 C 38 6 42 18 43 25 Z" fill="url(#jumpmon-ear-grad)" stroke="#92400e" strokeWidth="1.8" />
        <path d="M 35 27 C 27 15 22 6 32 8 C 36 10 38 18 39 23 Z" fill="#fef08a" opacity="0.9" />
        {/* Right Ear */}
        <path d="M 63 32 C 76 16 84 0 68 3 C 62 6 58 18 57 25 Z" fill="url(#jumpmon-ear-grad)" stroke="#92400e" strokeWidth="1.8" />
        <path d="M 65 27 C 73 15 78 6 68 8 C 64 10 62 18 61 23 Z" fill="#fef08a" opacity="0.9" />

        {/* Dynamic Dragon Torso & Head */}
        <circle cx="50" cy="53" r="23" fill="url(#jumpmon-body-grad)" stroke="#b45309" strokeWidth="2.5" />

        {/* Luminous Golden Chest Plate */}
        <path d="M 40 48 Q 50 44 60 48 Q 63 65 50 72 Q 37 65 40 48 Z" fill="#fef08a" stroke="#d97706" strokeWidth="1.2" />

        {/* Celestial Star Crest */}
        <polygon points="50,50 52,55 57,55 53,58 55,63 50,60 45,63 47,58 43,55 48,55" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
        <circle cx="50" cy="57" r="1.5" fill="#ffffff" />

        {/* Forehead Dragon Jewel */}
        <polygon points="50,34 53,38 50,42 47,38" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
        <circle cx="50" cy="38" r="1" fill="#ffffff" />

        {/* Expressive Anime Eyes & Cheek Marks */}
        {/* Left Eye */}
        <ellipse cx="43" cy="45" rx="3.5" ry="4.5" fill="#1c1917" />
        <ellipse cx="43.5" cy="43.5" rx="1.5" ry="2" fill="#ffffff" />
        <circle cx="44.5" cy="47" r="0.8" fill="#fbbf24" />
        {/* Right Eye */}
        <ellipse cx="57" cy="45" rx="3.5" ry="4.5" fill="#1c1917" />
        <ellipse cx="56.5" cy="43.5" rx="1.5" ry="2" fill="#ffffff" />
        <circle cx="55.5" cy="47" r="0.8" fill="#fbbf24" />
        {/* Cheek Marks */}
        <path d="M 35 50 L 39 52 M 34 53 L 38 55" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 65 50 L 61 52 M 66 53 L 62 55" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />

        {/* High-Tech Kinetic Spring Boots */}
        {/* Left Spring Boot */}
        <rect x="27" y="70" width="16" height="9" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        <line x1="29" y1="79" x2="41" y2="79" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 31 79 Q 35 83 31 87 Q 39 87 39 83" fill="none" stroke="#fbbf24" strokeWidth="2" />
        <rect x="29" y="86" width="12" height="4" rx="1.5" fill="#f59e0b" />
        {/* Right Spring Boot */}
        <rect x="57" y="70" width="16" height="9" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        <line x1="59" y1="79" x2="71" y2="79" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 61 79 Q 65 83 61 87 Q 69 87 69 83" fill="none" stroke="#fbbf24" strokeWidth="2" />
        <rect x="59" y="86" width="12" height="4" rx="1.5" fill="#f59e0b" />

        {/* Spark Particles */}
        <circle cx="24" cy="42" r="1.5" fill="#fef08a" />
        <circle cx="76" cy="44" r="1.5" fill="#fef08a" />
        <circle cx="50" cy="22" r="1.2" fill="#fbbf24" />
      </svg>
    );
  }

  if (name === 'Shieldmon') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={animClass}>
        <defs>
          <linearGradient id="shieldmon-armor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="40%" stopColor="#3b82f6" />
            <stop offset="85%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="shield-face-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Shadow & Runic Ward Perimeter */}
        <ellipse cx="50" cy="87" rx="30" ry="6" fill="rgba(0,0,0,0.3)" />
        <ellipse cx="50" cy="87" rx="26" ry="5" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />

        {/* Layered Bastion Pauldrons */}
        <path d="M 24 40 Q 6 22 28 30 Z" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.8" />
        <path d="M 26 43 Q 12 30 30 36 Z" fill="#3b82f6" opacity="0.8" />
        <path d="M 76 40 Q 94 22 72 30 Z" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.8" />
        <path d="M 74 43 Q 88 30 70 36 Z" fill="#3b82f6" opacity="0.8" />

        {/* Titan Guardian Crest Horns */}
        <path d="M 35 30 L 22 10 L 39 20 Z" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="2" />
        <line x1="28" y1="16" x2="35" y2="24" stroke="#60a5fa" strokeWidth="1.5" />
        <path d="M 65 30 L 78 10 L 61 20 Z" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="2" />
        <line x1="72" y1="16" x2="65" y2="24" stroke="#60a5fa" strokeWidth="1.5" />

        {/* Fortress Main Body Plate */}
        <rect x="31" y="28" width="38" height="48" rx="14" fill="url(#shieldmon-armor-grad)" stroke="#1e3a8a" strokeWidth="2.8" />

        {/* Bastion Brow & Visor Slit */}
        <path d="M 34 38 L 66 38 L 63 46 L 37 46 Z" fill="#0f172a" stroke="#1e3a8a" strokeWidth="1.5" />
        {/* Glowing Cyan Visor Eyes */}
        <rect x="40" y="41" width="8" height="3" rx="1" fill="#38bdf8" />
        <rect x="52" y="41" width="8" height="3" rx="1" fill="#38bdf8" />
        <circle cx="44" cy="42.5" r="1" fill="#ffffff" />
        <circle cx="56" cy="42.5" r="1" fill="#ffffff" />

        {/* Chest Armor Plating & Core Gem */}
        <polygon points="50,52 57,57 54,66 46,66 43,57" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.2" />
        <polygon points="50,54 54,58 52,63 48,63 46,58" fill="#38bdf8" />
        <circle cx="50" cy="58.5" r="1.2" fill="#ffffff" />

        {/* Armored Boots */}
        <rect x="32" y="74" width="14" height="8" rx="2.5" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.2" />
        <rect x="54" y="74" width="14" height="8" rx="2.5" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.2" />

        {/* Titanic Aegis Fortress Tower Shield (Front Right) */}
        <g transform="translate(14, 2)">
          {/* Shield Outer Shadow / Edge */}
          <path d="M 52 30 L 78 30 L 83 72 L 65 84 L 47 72 Z" fill="#0f172a" stroke="#93c5fd" strokeWidth="2.5" />
          {/* Shield Inset Plate */}
          <path d="M 54 33 L 76 33 L 80 69 L 65 79 L 50 69 Z" fill="url(#shield-face-grad)" stroke="#3b82f6" strokeWidth="1.2" />
          {/* Central Heraldic Cross */}
          <line x1="65" y1="36" x2="65" y2="76" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
          <line x1="54" y1="52" x2="76" y2="52" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
          {/* Diamond Crystal Boss */}
          <polygon points="65,46 71,52 65,58 59,52" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
          <circle cx="65" cy="52" r="1.8" fill="#ffffff" />
          {/* Shield Rivets */}
          <circle cx="56" cy="35" r="1" fill="#cbd5e1" />
          <circle cx="74" cy="35" r="1" fill="#cbd5e1" />
          <circle cx="78" cy="67" r="1" fill="#cbd5e1" />
          <circle cx="52" cy="67" r="1" fill="#cbd5e1" />
        </g>
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
        <defs>
          <linearGradient id="archermon-cloak-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="40%" stopColor="#10b981" />
            <stop offset="85%" stopColor="#059669" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>
          <linearGradient id="archermon-bow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow & Leaves */}
        <ellipse cx="50" cy="87" rx="28" ry="6" fill="rgba(0,0,0,0.25)" />
        <ellipse cx="50" cy="87" rx="22" ry="4" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />

        {/* Ranger Quiver with Fletched Arrows on Back */}
        <g transform="translate(-10, -2)">
          <path d="M 28 32 L 36 30 L 32 62 L 24 64 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
          {/* Arrow 1 */}
          <line x1="28" y1="31" x2="22" y2="14" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="22,14 20,20 25,18" fill="#10b981" />
          {/* Arrow 2 */}
          <line x1="31" y1="30" x2="27" y2="12" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="27,12 25,18 30,16" fill="#fef08a" />
          {/* Arrow 3 */}
          <line x1="34" y1="31" x2="33" y2="14" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="33,14 30,20 35,18" fill="#10b981" />
        </g>

        {/* Ranger Cloak & Torso */}
        <rect x="33" y="30" width="34" height="46" rx="13" fill="url(#archermon-cloak-grad)" stroke="#065f46" strokeWidth="2.5" />

        {/* Leather Cross-Belt Harness */}
        <line x1="34" y1="36" x2="66" y2="66" stroke="#78350f" strokeWidth="3" />
        <line x1="34" y1="36" x2="66" y2="66" stroke="#d97706" strokeWidth="1.2" />
        {/* Belt Buckle */}
        <rect x="47" y="48" width="6" height="6" rx="1.5" fill="#facc15" stroke="#78350f" strokeWidth="1" />

        {/* Elven Ranger Cowl / Hood with Crest Peak */}
        <path d="M 28 32 C 30 14 44 4 50 2 C 56 4 70 14 72 32 C 62 27 38 27 28 32 Z" fill="#059669" stroke="#047857" strokeWidth="2" />
        <path d="M 47 4 Q 50 16 53 4" fill="none" stroke="#fef08a" strokeWidth="1.2" />
        {/* Emerald Crest Feather */}
        <path d="M 50 3 Q 40 -8 34 -4 Q 42 0 49 4" fill="#34d399" stroke="#065f46" strokeWidth="1" />

        {/* Keen Marksman Eyes & Eyebrow Mask */}
        <ellipse cx="43" cy="41" rx="4" ry="4.5" fill="#ffffff" />
        <ellipse cx="57" cy="41" rx="4" ry="4.5" fill="#ffffff" />
        <ellipse cx="44.5" cy="41" rx="2" ry="3" fill="#065f46" />
        <ellipse cx="58.5" cy="41" rx="2" ry="3" fill="#065f46" />
        <circle cx="45" cy="40" r="0.9" fill="#ffffff" />
        <circle cx="59" cy="40" r="0.9" fill="#ffffff" />
        {/* Eye markings / Warpaint */}
        <path d="M 37 44 L 41 45" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 63 44 L 59 45" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />

        {/* Ranger Leather Boots */}
        <rect x="33" y="72" width="13" height="8" rx="2.5" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
        <rect x="54" y="72" width="13" height="8" rx="2.5" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />

        {/* Masterwork Golden Recurve Longbow with Glowing String */}
        <g transform="translate(16, 2)">
          {/* Recurve Bow Limbs */}
          <path d="M 54 18 C 66 28 72 48 58 78" fill="none" stroke="url(#archermon-bow-grad)" strokeWidth="3.8" strokeLinecap="round" />
          <path d="M 54 18 C 66 28 72 48 58 78" fill="none" stroke="#78350f" strokeWidth="1" strokeDasharray="5 3" />
          {/* Bow Tips */}
          <circle cx="54" cy="18" r="2.2" fill="#ca8a04" />
          <circle cx="58" cy="78" r="2.2" fill="#ca8a04" />
          {/* Luminous Mana Bowstring */}
          <line x1="54" y1="18" x2="48" y2="48" stroke="#a7f3d0" strokeWidth="1.5" />
          <line x1="48" y1="48" x2="58" y2="78" stroke="#a7f3d0" strokeWidth="1.5" />
          {/* Notched Spectral Arrow */}
          <line x1="38" y1="48" x2="68" y2="48" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          <polygon points="68,48 64,45 64,51" fill="#34d399" />
          <polygon points="38,48 42,46 42,50" fill="#fef08a" />
          <circle cx="50" cy="48" r="3" fill="rgba(52, 211, 153, 0.4)" />
        </g>
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
