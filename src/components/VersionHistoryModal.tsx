import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X, History, CheckCircle2, Sparkles, ScrollText, ExternalLink } from 'lucide-react';
import { soundService } from '../services/sound';

interface VersionHistoryModalProps {
  onClose: () => void;
}

interface VersionLog {
  version: string;
  date: string;
  tag: string;
  badgeColor: string;
  highlights: string[];
}

const VERSION_LOGS: VersionLog[] = [
  {
    version: '0.1.0',
    date: 'Latest Update (Current)',
    tag: 'Gladiators Arise!',
    badgeColor: 'bg-rose-500 text-white font-black shadow-sm',
    highlights: [
      'New Hero - Shadowmon: Ranged Dark dragon wielding Dark Shadowraze Ground Eruption & 120-Energy Soul Blast ultimate.',
      'New Stage - Gladiator Arena: 2-minute survival defense stage featuring wave spawns of Skeletons & Bombers.',
      'Immortal Gladiator Boss: Spawns in the last 30s of Gladiator Arena; deal damage to stun him for 1s.',
      'Interactive Stage End Portals: Cleared stages now spawn a portal to complete the level.',
      'Fullscreen Gameplay & Responsive Controls: Seamless fullscreen mode with touch and keyboard shortcuts.',
    ],
  },
  {
    version: '0.0.5',
    date: 'July 2026',
    tag: 'Jungle & Platforming Expansion',
    badgeColor: 'bg-emerald-500 text-white font-bold',
    highlights: [
      'Added Jungle Stage Mechanics: Climbable Vines ("V"), Root Traps ("T"), and Poison Swamp hazards ("X").',
      'Enhanced Hero Animations: Flapping dragon wings, tail physics, and elemental skill particle effects.',
      'Hotkeys for Stage Completion and Roster Selection.',
    ],
  },
  {
    version: '0.0.4',
    date: 'July 2026',
    tag: 'Boss Battles & Encounters',
    badgeColor: 'bg-purple-600 text-white font-bold',
    highlights: [
      'Epic Boss Fights: King Slime, Frost Wyvern, Shadow Overlord, Dragon King, and King Kong.',
      'Boss HP Bars & Stun Mechanics: Attack bosses to trigger stun windows and break dangerous attacks.',
    ],
  },
  {
    version: '0.0.3',
    date: 'July 2026',
    tag: 'Underwater Abyss & Magic Spells',
    badgeColor: 'bg-amber-500 text-stone-950 font-black',
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
    highlights: [
      'Added Jumpmon (Warrior), Archermon (Ranger), and Shieldmon (Defender).',
      'Stage 1: Green Hills, Stage 2: Volcanic Peak, Stage 3: Sky Ruins, Stage 4: Crystal Cave.',
      'Added Inventory System & Basic Attack & Skill Mechanics.',
      'Real-time blade swinging arcs, drop-down wooden platforms, and coin shop system.',
    ],
  },
];

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-3xl overflow-hidden bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl backdrop-blur-xl text-stone-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800 bg-stone-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-950/80 border border-rose-700 text-rose-400 rounded-2xl">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-mono flex items-center gap-2">
                Patch Notes & Release Log <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black">v0.1.0</span>
              </h2>
              <p className="text-xs text-stone-400">Complete update timeline from v0.0.1 Genesis to v0.1.0 Gladiators Arise.</p>
            </div>
          </div>
          <button
            onClick={() => { soundService.playClick(); onClose(); }}
            className="p-2 text-stone-400 hover:text-stone-100 rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version Logs Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700">
          {VERSION_LOGS.map((log) => (
            <div
              key={log.version}
              className={`p-5 rounded-2xl border ${
                log.version === '0.1.0'
                  ? 'bg-rose-950/40 border-rose-800/80 ring-2 ring-rose-500/20'
                  : 'bg-stone-800/50 border-stone-700/60'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-black text-white font-mono">v{log.version}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${log.badgeColor}`}>
                    {log.tag}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-stone-400">{log.date}</span>
              </div>

              <ul className="space-y-2">
                {log.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-900/80 flex items-center justify-between">
          <Link
            href="/version"
            onClick={() => { soundService.playClick(); onClose(); }}
            className="px-4 py-2 bg-rose-950 text-rose-300 border border-rose-700 hover:bg-rose-900 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5"
          >
            <span>Open Dedicated Page (/version)</span>
            <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
          </Link>
          <button
            onClick={() => { soundService.playClick(); onClose(); }}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95"
          >
            Close Patch Notes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

