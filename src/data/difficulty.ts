export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'expert' | 'master' | 'asian';

export interface DifficultyConfig {
  id: GameDifficulty;
  name: string;
  multiplier: number;
  label: string;
  shortLabel: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  glow: string;
  icon: string;
  desc: string;
  statColor: string;
}

export const DIFFICULTY_CONFIG: Record<GameDifficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: 'Easy',
    multiplier: 0.5,
    label: '0.5x Stats & Rewards',
    shortLabel: '0.5x',
    badgeBg: 'bg-emerald-950/80',
    badgeText: 'text-emerald-400',
    border: 'border-emerald-500/40 hover:border-emerald-400',
    glow: 'shadow-emerald-500/20',
    icon: '🌱',
    desc: 'Relaxed mode with halved enemy HP/ATK and halved gold/EXP.',
    statColor: 'text-emerald-400'
  },
  normal: {
    id: 'normal',
    name: 'Normal',
    multiplier: 1.0,
    label: '1.0x Stats & Rewards',
    shortLabel: '1.0x',
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-400',
    border: 'border-blue-500/40 hover:border-blue-400',
    glow: 'shadow-blue-500/20',
    icon: '⚔️',
    desc: 'Standard balanced challenge and baseline rewards.',
    statColor: 'text-blue-400'
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    multiplier: 2.5,
    label: '2.5x Stats & Rewards',
    shortLabel: '2.5x',
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-400',
    border: 'border-amber-500/40 hover:border-amber-400',
    glow: 'shadow-amber-500/20',
    icon: '🔥',
    desc: '2.5x tougher enemies yielding 2.5x gold and EXP bounties.',
    statColor: 'text-amber-400'
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    multiplier: 5.0,
    label: '5.0x Stats & Rewards',
    shortLabel: '5.0x',
    badgeBg: 'bg-orange-950/80',
    badgeText: 'text-orange-400',
    border: 'border-orange-500/40 hover:border-orange-400',
    glow: 'shadow-orange-500/20',
    icon: '⚡',
    desc: '5x lethal enemy health & damage for seasoned adventurers.',
    statColor: 'text-orange-400'
  },
  master: {
    id: 'master',
    name: 'Master',
    multiplier: 10.0,
    label: '10.0x Stats & Rewards',
    shortLabel: '10.0x',
    badgeBg: 'bg-purple-950/80',
    badgeText: 'text-purple-400',
    border: 'border-purple-500/40 hover:border-purple-400',
    glow: 'shadow-purple-500/20',
    icon: '👑',
    desc: '10x punishing monster strength with huge gold & EXP payouts.',
    statColor: 'text-purple-400'
  },
  asian: {
    id: 'asian',
    name: 'Asian',
    multiplier: 100.0,
    label: '100.0x Stats & Rewards',
    shortLabel: '100x',
    badgeBg: 'bg-rose-950/90',
    badgeText: 'text-rose-400',
    border: 'border-rose-500/60 hover:border-rose-400',
    glow: 'shadow-rose-500/30',
    icon: '💀',
    desc: 'Extreme 100x god-tier difficulty! One hit is fatal, rewards are astronomical.',
    statColor: 'text-rose-400'
  }
};

export const DIFFICULTY_ORDER: GameDifficulty[] = ['easy', 'normal', 'hard', 'expert', 'master', 'asian'];

export function getDifficultyConfig(diff?: GameDifficulty): DifficultyConfig {
  if (!diff || !DIFFICULTY_CONFIG[diff]) {
    return DIFFICULTY_CONFIG.normal;
  }
  return DIFFICULTY_CONFIG[diff];
}

export function getDifficultyMultiplier(diff?: GameDifficulty): number {
  return getDifficultyConfig(diff).multiplier;
}
