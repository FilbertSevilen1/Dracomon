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
  volume: number;      // General master or music volume (0-100)
  music: boolean;      // Music toggle
  sfxVolume: number;   // SFX volume (0-100)
  fullscreen: boolean; // Fullscreen toggle
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'potion' | 'upgrade_stone';
  description: string;
  quantity: number;
}

export interface SaveData {
  player: PlayerState;
  unlockedDraco: string[];
  selectedDraco: string;
  dracos: {
    [key: string]: Partial<DracoData> & { unlocked?: boolean };
  };
  inventory: InventoryItem[];
  settings: GameSettings;
}

// Game active state mapping during play
export interface PlaySessionState {
  currentHP: number;
  maxHP: number;
  isDead: boolean;
  score: number;
  currentStage: number;
  levelCleared: boolean;
}
