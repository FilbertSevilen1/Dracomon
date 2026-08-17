export interface PlayerStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  jump: number;
  range: number;
  energyRegen?: number;
  level?: number;
}

export interface DracoData {
  level: number;
  exp: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  jump: number;
  range: number;
  unlocked?: boolean;
  energyRegen?: number;
  equipped?: string[];
}

export interface PlayerState {
  coins: number;
  level: number;
  totalExp: number;
}

export interface GameSettings {
  volume: number;
  music: boolean;
  sfxVolume: number;
  fullscreen: boolean;
}

export type InventoryItemType = 'potion' | 'upgrade_stone' | 'equipment';

export interface InventoryItem {
  id: string;
  name: string;
  type: InventoryItemType;
  description: string;
  quantity: number;
  slot?: 'weapon' | 'armor' | 'boots' | 'accessory' | 'relic';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon?: string;
  stats?: Partial<PlayerStats>;
  cost?: number;
}

export type TierType = 'Free' | 'Basic' | 'Premium';
export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'expert' | 'master' | 'asian';

export interface SaveData {
  player: PlayerState;
  unlockedDraco: string[];
  selectedDraco: string;
  dracos: {
    [key: string]: Partial<DracoData> & { unlocked?: boolean };
  };
  inventory: InventoryItem[];
  settings: GameSettings;
  tier?: TierType;
  difficulty?: GameDifficulty;
  completedStages?: number[];
  lastWorldId?: number;
}

export interface PlaySessionState {
  currentHP: number;
  maxHP: number;
  isDead: boolean;
  score: number;
  currentStage: number;
  levelCleared: boolean;
}
