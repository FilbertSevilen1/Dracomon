import React from 'react';
import { motion } from 'framer-motion';
import { X, History, CheckCircle2 } from 'lucide-react';
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
    version: '0.0.3',
    date: 'Current Release',
    tag: 'Multi-Map & Water World Update',
    badgeColor: 'bg-amber-500 text-stone-950 font-black',
    highlights: [
      'Multi-Map Level System: Levels can now have several maps connected by interactive Portals.',
      'New Character - Whitemon (Summoner): Throws spinning axes, summons an uncontrollable Bird Familiar, and roars (Primal Roar) to stun enemies for 3s while sending the familiar into rampage mode.',
      'Flying Enemies: Created aerial flying enemies (Bats / Wyverns) included across multiple stages.',
      'Tier Progression System: Free Tier, Basic Tier (every character unlocked @ Lv.5 with +1 to all attributes), and Premium Tier (all unlocked + boosted stats).',
      'Stage 9: Underwater Abyss: Features reduced gravity physics, pushing water currents, swimming fish enemies, moving anchors, instant-kill chomping scallops, and the Killer Whale boss encounter.',
      'Version History Modal & release log page added.',
    ],
  },
  {
    version: '0.0.2',
    date: 'July 2026',
    tag: 'Companions & Equipment Update',
    badgeColor: 'bg-purple-100 text-purple-900 border border-purple-300 font-bold',
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
    tag: 'Genesis Release',
    badgeColor: 'bg-stone-100 text-stone-700 border border-stone-300 font-bold',
    highlights: [
      'Initial release of Dracomon RPG platformer.',
      'Includes Jumpmon, Archermon, and Shieldmon companion classes.',
      'Real-time blade swinging arcs, drop-down wooden platforms, and coin shop system.',
      'Campaign stages 1 through 8.',
    ],
  },
];

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-2xl overflow-hidden bg-white/95 border border-stone-200 rounded-3xl shadow-2xl backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 border border-amber-300 text-amber-700 rounded-2xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-display flex items-center gap-2">
                Version History <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black">v0.0.3</span>
              </h2>
              <p className="text-xs text-stone-500">Track all updates, patch notes, and feature releases.</p>
            </div>
          </div>
          <button
            onClick={() => { soundService.playClick(); onClose(); }}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version Logs Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-stone-300">
          {VERSION_LOGS.map((log) => (
            <div
              key={log.version}
              className={`p-5 rounded-2xl border ${
                log.version === '0.0.3'
                  ? 'bg-amber-50/40 border-amber-200 ring-2 ring-amber-400/20'
                  : 'bg-stone-50/60 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-black text-stone-900 font-mono">v{log.version}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${log.badgeColor}`}>
                    {log.tag}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-stone-400">{log.date}</span>
              </div>

              <ul className="space-y-2">
                {log.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            onClick={() => { soundService.playClick(); onClose(); }}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95"
          >
            Close Version Log
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
