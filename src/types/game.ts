export interface PlayerStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  jump: number;
  range: number;
  energyRegen?: number;
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

export interface InventoryItem {
  id: string;
  name: string;
  type: 'potion' | 'upgrade_stone';
  description: string;
  quantity: number;
}

export type TierType = 'Free' | 'Basic' | 'Premium';

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
  completedStages?: number[];
}

export interface PlaySessionState {
  currentHP: number;
  maxHP: number;
  isDead: boolean;
  score: number;
  currentStage: number;
  levelCleared: boolean;
}
