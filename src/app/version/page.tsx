'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  ScrollText,
  ArrowLeft,
  Calendar,
  Layers,
  Gamepad2,
  Shield,
  Zap,
} from 'lucide-react';
import { soundService } from '../../services/sound';
import { Navbar } from '../../components/Navbar';

interface VersionLog {
  version: string;
  date: string;
  tag: string;
  badgeColor: string;
  summary: string;
  highlights: string[];
}

const VERSION_LOGS: VersionLog[] = [
  {
    version: '0.1.8',
    date: 'July 23, 2026',
    tag: 'Thunder Tempest & Gladiator Overhaul!',
    badgeColor: 'bg-emerald-500 text-stone-950 font-black shadow-sm',
    summary: 'Polishes Thundermon moveset with non-blocked 800px raycast dashes and 0.1s staggered Raigeki thunderbolts, overhauls Immortal Gladiator with 3s interval charges and stun immunity, and updates targeted Skeleton Archer aiming.',
    highlights: [
      'Thundermon Electrotackle Polish: High-speed dash now targets nearest enemy within 800px not blocked by ground/platforms, with a smaller 110px electric ground zone and enemy contact explosion.',
      'Raigeki Staggered Thunderbolt Tempest: Raigeki strikes enemies one by one with a 0.1s staggered delay, featuring Divine Electrocution death lightning, bone pile disintegrations, and normal camera tracking.',
      'Thundermon Basic Attack Balance: Removed mini-stun from basic attack while keeping rapid animation cancellation.',
      'Immortal Gladiator Overhaul: Immortal Gladiator is now immune to stuns, charging every 3 seconds for 1 second with a glowing crimson rush aura and 1.0s player stun on impact.',
      'Skeleton Archer Targeted Aim: Skeleton Archer arrows now calculate directional velocity vector aiming directly at player current location.',
      'Heroes UI Polish: Equipped hero showcase card now features a green border container instead of an inline text badge.',
    ],
  },
  {
    version: '0.1.7',
    date: 'July 23, 2026',
    tag: 'Thundermon Unleashed!',
    badgeColor: 'bg-yellow-500 text-stone-950 font-black shadow-sm',
    summary: 'Introduces Thundermon, the storm dragon hero featuring Electric Ball basic attack with animation cancellation, Electrotackle dash skill with 4s 300px electric charged platform paths, and 200-Energy Raigeki ultimate.',
    highlights: [
      'New Hero - Thundermon: Electric dragon hero featuring Electric Ball basic attack, Electrotackle dash skill, and 200-Energy Raigeki ultimate.',
      'Basic Attack - Electric Ball Charge: Charges an electric ball in front dealing area damage. After 2s, applies 0.5s mini-stuns and can be used to cancel attack animations.',
      'Special Skill - Electrotackle: High-speed dash into front or nearest unblocked enemy, exploding electricity on impact. The platform passed becomes electric-charged for 4s (300px span) dealing damage & 0.2s ministuns every 1s.',
      'Ultimate Skill - Raigeki (200 Energy): Strikes celestial thunderbolts on all enemies within 800px radius, stunning for 1.0s. Defeated targets disintegrate into bone piles!',
    ],
  },
  {
    version: '0.1.6',
    date: 'July 23, 2026',
    tag: 'Economy Rebalance & Bug Fixes',
    badgeColor: 'bg-amber-600 text-white font-black shadow-sm',
    summary: 'Major economy rebalance reducing EXP and Gold gain by 80%, updated maps, and critical Bombamon bug fixes.',
    highlights: [
      'Economy Nerf: EXP and Gold gain from all enemies reduced by 80% for longer and more rewarding progression.',
      'Bombamon Ultimate Bug Fix: Carpet Bombing fire now correctly burns below Bombamon\'s flight path instead of from the top of the map.',
      'Bombamon Ultimate Ceiling Awareness: Fire damage now jumps downward from Bombamon\'s height until hitting the ceiling, ensuring correct placement in indoor maps like Temple.',
      'Bombamon Fire Tick Rate: Fire damage now ticks once every 0.5 seconds instead of every frame for balanced burn damage.',
      'Ranged Base Attack Cap: All ranged basic attacks (Flymon, Whitemon, Magemon, Shadowmon, Bombamon) now have a maximum range of 800px.',
      'Shieldmon Ultimate Rework: Creates a 10-radius wall barrier, then drops a giant shield from the sky to damage enemies trapped inside.',
      'Flymon Tornado Skill: Range capped to 1000px maximum.',
      'Assassinmon Ultimate: Improved visual animation effects.',
    ],
  },
  {
    version: '0.1.5',
    date: 'July 23, 2026',
    tag: 'Underwater Abyss Revamp',
    badgeColor: 'bg-cyan-600 text-white font-black shadow-sm',
    summary: 'Complete overhaul of Stage 9 Underwater Abyss: replaced lava pools with swirling whirlpool gravity traps, made anchors larger with ropes reaching to the ceiling, and added a vortex moveset to the Leviathan Orca.',
    highlights: [
      'Underwater Whirlpools: Replaced stage 9 lava pools with functional whirlpools that pull players within a 5-tile radius (stronger pull closer to the center) and instantly kill on contact.',
      'Massive Anchors: Redesigned anchors to be 1.8x larger with a premium metallic look and detailed ropes stretching all the way to the stage ceiling.',
      'Leviathan Orca Vortex Moveset: The Killer Whale boss now regularly casts a water vortex, drawing players in a 3-tile radius towards it and dealing damage on contact.',
      'Gladiators Arena: Increased difficulty, increased survival duration, added new enemy types, and added a new boss. Increase timer to 3 minutes'
    ],
  },
  {
    version: '0.1.4',
    date: 'July 23, 2026',
    tag: 'Stage Gimmicks & Performance Overhaul (Current)',
    badgeColor: 'bg-rose-500 text-white font-black shadow-sm',
    summary: 'Overhauled Sky Heavens & Primordial Core Stage Gimmicks, optimized Canvas particle rendering for smooth 60 FPS, and made falling into the void an instant death.',
    highlights: [
      'Volcanic Peak  will Summons fireball from lava',
      'Frozen Citadel will Summons random ice from the sky, slowing the player',
      'Shadow Abyss has now reduced player visibility',
      'Celestial will Summons random thunderbolt',
      'Sky Heavens Dragon Breath: Sky dragons fly higher in the clouds and target random elevated platforms across the upper sky.',
      'Primordial Core Destructive Meteors: Meteors are 2x larger (36px) with warning target reticles, destroying 3-tile platform sections on impact and crushing non-boss enemies (bosses take partial damage & stun).',
      'Bottomless Void Death: Falling off platforms out of bounds into the void now instantly counts as player death (0 HP) and opens the level retry screen.',
      'Pristine Level Restarts: Restarting or retrying any level restores 100% of destroyed platform tiles back to original map layouts.',
      'Canvas Performance Optimization: Eliminated hardware-taxing shadowBlur passes and capped active particles at 100 max, delivering silky-smooth 60 FPS performance.',
      'Bug Fix - Stage Gimmick DOT Death: Damage over time from dragon breath zones (fire, poison, ice), lava burn, and other stage hazards now properly kills the player when HP reaches 0.',
    ],
  },
  {
    version: '0.1.3',
    date: 'July 23, 2026',
    tag: 'Bombamon Unleashed!',
    badgeColor: 'bg-orange-500 text-white font-black shadow-sm',
    summary: 'Introduces Bombamon, the explosive dragon hero featuring Homing Bomb Rock skill and Carpet Bombing ultimate.',
    highlights: [
      'New Hero - Bombamon: Explosive dragon hero featuring Fire Breath basic attack, Homing Bomb Rock skill, and Carpet Bombing ultimate.',
      'Homing Bomb Rock & Ground Igniter: Throws a rock homing in on enemies within 1000px range. Ignites 3-block ground burn for 2s on impact.',
      'Carpet Bombing Ultimate: Dragon flies 8 blocks high across screen left-to-right, breathing fire that ignites platforms for 5s.',
      'Enemy Burn Status & Death Explosions: Lit enemies run faster while burning and linger burning 2s outside fire. Defeated burning units explode dealing 120 area damage!',
    ],
  },
  {
    version: '0.1.2',
    date: 'July 23, 2026',
    tag: 'Mobile & Gameplay Polish',
    badgeColor: 'bg-cyan-500 text-white font-black shadow-sm',
    summary: 'Enhanced the overall game screen with Death Zone animations, premium feedback, and optimized controls support for mobile players.',
    highlights: [
      'Enhanced Game Screen UI: Implemented cleaner HUD overlay layouts, persistent settings access, and optimized canvas framing.',
      'Death Zone Visual Animations: Added animated warning indicators, red hazard pulses, and custom particle cues when entering lethal zones.',
      'Mobile Input & Responsive Controls: Introduced full touchscreen virtual joysticks, active jump/attack buttons, and improved layout scaling for mobile devices.',
      'Global Options Navigation: Integrated a persistent Settings Modal directly in the main navigation header for seamless audio and save file management.',
    ],
  },
  {
    version: '0.1.1',
    date: 'July 22, 2026',
    tag: 'Refined Realms',
    badgeColor: 'bg-amber-500 text-stone-950 font-black shadow-sm',
    summary: 'Expanded the Dracomon web portal with dedicated pages for Heroes, Maps, Membership, and Patch Notes — all with a unified premium UI.',
    highlights: [
      'New Page - /heroes: Full-page Draco Sanctuary roster manager with 2-panel inspect layout and real-time hero name filter.',
      'New Page - /maps: Dedicated campaign stage showcase for all 11 stages. Clicking Play now launches the level directly without redirecting.',
      'New Page - /membership: Interactive tier selection (Free / Basic / Premium) with live membership badge in the Navbar.',
      'New Page - /version: Dedicated white-background patch notes page with expandable accordion panels.',
      'Enhanced Navbar: Persistent top bar across all pages showing active hero badge (name + level), active membership tier, and live coin balance.',
      'Live Navbar Sync: Equipping or levelling a hero now instantly updates the active hero badge in the Navbar.',
      'Hero Filter: Heroes on /heroes can be filtered in real time by name or role.',
      'Tier Switcher removed from /heroes (use /membership page instead).',
      'Home Page: "Meet The Dragon Guardians" section now shows only 3 featured heroes; Manage Roster button redirects to /heroes.',
    ],
  },
  {
    version: '0.1.0',
    date: 'July 22, 2026',
    tag: 'Gladiators Arise!',
    badgeColor: 'bg-rose-600 text-white font-black shadow-sm',
    summary: 'Introduces Shadowmon, the Roman Gladiator Arena survival defense stage, and interactive Exit Portals.',
    highlights: [
      'New Hero - Shadowmon: Ranged Dark dragon wielding Dark Shadowraze Ground Eruption (600px range) & 120-Energy Soul Blast ultimate.',
      'Soul Blast Multiplier: Fires 1 to 6 dual dark energy wave lines (1 base + 1 per Dark Soul Stack up to 5 stacks).',
      'New Stage - Gladiator Arena: 2-minute survival defense stage featuring wave spawns of Skeletons & Bombers.',
      'Immortal Gladiator Boss: Spawns in the last 30s of Gladiator Arena; deal damage to stun him for 1s.',
      'Interactive Stage End Portals: Cleared stages now spawn a portal to complete the level.',
      'Reworked Shieldmon: Special is 600px Shield Trample Dash; Ultimate is 3-second Portal Rampage Charge that launches enemies skyward.',
      'Fullscreen Gameplay & Responsive Controls: Seamless framed viewport mode with touch and keyboard shortcuts.',
    ],
  },
  {
    version: '0.0.5',
    date: 'July 22, 2026',
    tag: 'Jungle & Platforming Expansion',
    badgeColor: 'bg-emerald-600 text-white font-bold',
    summary: 'Adds Jungle stage mechanics, climbable vines, root traps, and poison swamps.',
    highlights: [
      'Added Jungle Stage Mechanics: Climbable Vines ("V"), Root Traps ("T"), and Poison Swamp hazards ("X").',
      'Enhanced Hero Animations: Flapping dragon wings, tail physics, and elemental skill particle effects.',
      'Hotkeys for Stage Completion and Roster Selection.',
    ],
  },
  {
    version: '0.0.4',
    date: 'July 22, 2026',
    tag: 'Boss Battles & Encounters',
    badgeColor: 'bg-purple-600 text-white font-bold',
    summary: 'Introduces multi-phase Boss Encounters across all campaign realms.',
    highlights: [
      'Epic Boss Fights: King Slime, Frost Wyvern, Shadow Overlord, Dragon King, and King Kong.',
      'Boss HP Bars & Stun Mechanics: Attack bosses to trigger stun windows and break dangerous attacks.',
    ],
  },
  {
    version: '0.0.3',
    date: 'July 22, 2026',
    tag: 'Underwater Abyss & Magic Spells',
    badgeColor: 'bg-amber-500 text-stone-950 font-black',
    summary: 'Adds Whitemon and Magemon along with Stage 9 Underwater Abyss.',
    highlights: [
      'Added Whitemon (Summoner with Bird Familiar) & Magemon (Wizard with Tornado, Sun Strike & Meteor).',
      'Underwater Abyss Stage: Reduced gravity, water currents, swimming fish, and Killer Whale boss.',
      'Tier Progression System: Free Tier, Basic Tier, and Premium Tier full roster unlock.',
    ],
  },
  {
    version: '0.0.2',
    date: 'July 2026',
    tag: 'Companions & Equipment Update',
    badgeColor: 'bg-indigo-600 text-white font-bold',
    summary: 'Adds Assassinmon and Flymon companion classes along with the Inventory system.',
    highlights: [
      'Added Assassinmon (Stealth / Burst) and Flymon (Aerial / Float) companion classes.',
      'Inventory System: Collect Healing Potions and Upgrade Stones.',
      'Stat Allocation: Spend upgrade stones to permanently boost HP, Attack, Defense, or Speed stats.',
      'Level Up bonus dice allocation system.',
    ],
  },
  {
    version: '0.0.1',
    date: 'June 2026',
    tag: 'Welcome to Dracomon (Genesis Release)',
    badgeColor: 'bg-stone-200 text-stone-800 border border-stone-300 font-bold',
    summary: 'The initial genesis launch of Dracomon RPG platformer.',
    highlights: [
      'Added Jumpmon (Warrior), Archermon (Ranger), and Shieldmon (Defender).',
      'Stage 1: Green Hills, Stage 2: Volcanic Peak, Stage 3: Sky Ruins, Stage 4: Crystal Cave.',
      'Added Inventory System & Basic Attack & Skill Mechanics.',
      'Real-time blade swinging arcs, drop-down wooden platforms, and coin shop system.',
    ],
  },
];

export default function VersionPage() {
  // Only the latest version ('0.1.8') is opened by default!
  const [openVersion, setOpenVersion] = useState<string | null>('0.1.8');

  const toggleVersion = (version: string) => {
    soundService.playClick();
    setOpenVersion(prev => (prev === version ? null : version));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-display flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background Ambient Accents */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-rose-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-indigo-100/50 rounded-full blur-3xl -z-10" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-10 space-y-8 z-10">
        
        {/* Page Hero Header */}
        <div className="space-y-3 text-center md:text-left border-b border-stone-200 pb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-stone-900 font-display">
            Patch Notes <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">& Updates</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-2xl leading-relaxed">
            Detailed logs for every major expansion, hero release, and system update in Dracomon RPG.
            Click any version panel below to expand its full changelog.
          </p>
        </div>

        {/* Expansion Panels List */}
        <div className="space-y-4">
          {VERSION_LOGS.map((log) => {
            const isOpen = openVersion === log.version;

            return (
              <div
                key={log.version}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-white border-amber-300 ring-2 ring-amber-400/20 shadow-xl'
                    : 'bg-white/90 border-stone-200/90 hover:border-stone-300 hover:shadow-md'
                }`}
              >
                {/* Accordion Header Bar */}
                <button
                  onClick={() => toggleVersion(log.version)}
                  className={`w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors ${
                    isOpen ? 'bg-amber-500/5' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl font-black text-stone-900 font-mono">v{log.version}</span>
                    <span className={`text-xs px-3 py-1 rounded-full ${log.badgeColor}`}>
                      {log.tag}
                    </span>
                    <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {log.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOpen ? (
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
                        <ChevronUp className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-stone-100 text-stone-500 border border-stone-200">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Expanded Accordion Body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="border-t border-stone-100 bg-stone-50/70 px-6 py-6"
                    >
                      {/* Summary Quote */}
                      <div className="mb-5 p-3.5 rounded-2xl bg-white border border-stone-200/80 text-xs text-stone-600 italic font-mono shadow-sm">
                        "{log.summary}"
                      </div>

                      {/* Highlights List */}
                      <ul className="space-y-3">
                        {log.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs text-stone-700 leading-relaxed font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full border-t border-stone-200 bg-white py-6 px-6 md:px-12 text-center text-xs font-mono text-stone-500 z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Dracomon RPG • FilbertSevilen1</span>
          <Link
            href="/"
            onClick={() => soundService.playClick()}
            className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Launch Game</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
