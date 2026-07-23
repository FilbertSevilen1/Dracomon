import { SaveData, InventoryItem } from '../types/game';

export const STORAGE_KEY = 'dracomon_save_v1';

export const DEFAULT_ITEMS: InventoryItem[] = [
  {
    id: 'potion',
    name: 'Healing Potion',
    type: 'potion',
    description: 'Restores 15 HP immediately during combat or from inventory.',
    quantity: 2,
  },
  {
    id: 'upgrade_stone',
    name: 'Upgrade Stone',
    type: 'upgrade_stone',
    description: 'Permanently increases any single stat of your selected Draco by +1.',
    quantity: 1,
  },
];

export const DEFAULT_SAVE_DATA: SaveData = {
  player: {
    coins: 50, // Give them 50 coins to start so they can experience the shop early
    level: 1,
    totalExp: 0,
  },
  unlockedDraco: ['Jumpmon'],
  selectedDraco: 'Jumpmon',
  dracos: {
    Jumpmon: {
      level: 1,
      exp: 0,
      hp: 18,
      attack: 4,
      defense: 3,
      speed: 7,
      jump: 11,
      range: 1,
      unlocked: true,
      energyRegen: 1.0,
    },
    Archermon: {
      level: 1,
      exp: 0,
      hp: 16,
      attack: 7,
      defense: 2,
      speed: 5,
      jump: 10.5,
      range: 10,
      unlocked: false,
      energyRegen: 1.0,
    },
    Shieldmon: {
      level: 1,
      exp: 0,
      hp: 26,
      attack: 3,
      defense: 9,
      speed: 6, // Boosted speed from 3 to 6
      jump: 10,
      range: 1,
      unlocked: false,
      energyRegen: 1.0,
    },
    Assassinmon: {
      level: 1,
      exp: 0,
      hp: 15,
      attack: 8,
      defense: 2,
      speed: 9,
      jump: 11.5,
      range: 2,
      unlocked: false,
      energyRegen: 1.0,
    },
    Flymon: {
      level: 1,
      exp: 0,
      hp: 17,
      attack: 5,
      defense: 3,
      speed: 6,
      jump: 14,
      range: 5,
      unlocked: false,
      energyRegen: 1.0,
    },
    Whitemon: {
      level: 1,
      exp: 0,
      hp: 20,
      attack: 6,
      defense: 3,
      speed: 6,
      jump: 11,
      range: 8,
      unlocked: false,
      energyRegen: 1.0,
    },
    Magemon: {
      level: 1,
      exp: 0,
      hp: 19,
      attack: 7,
      defense: 3,
      speed: 6.5,
      jump: 11,
      range: 12,
      unlocked: false,
      energyRegen: 1.2,
    },
    Shadowmon: {
      level: 1,
      exp: 0,
      hp: 20,
      attack: 9,
      defense: 3,
      speed: 8,
      jump: 10.5,
      range: 8,
      unlocked: false,
      energyRegen: 1.0,
    },
    Bombamon: {
      level: 1,
      exp: 0,
      hp: 21,
      attack: 8,
      defense: 3,
      speed: 7,
      jump: 11,
      range: 8,
      unlocked: false,
      energyRegen: 1.0,
    },
  },
  tier: 'Free',
  inventory: DEFAULT_ITEMS,
  settings: {
    volume: 80,
    music: true,
    sfxVolume: 85,
    fullscreen: false,
  },
};

export const storageService = {
  loadGame(): SaveData {
    if (typeof window === 'undefined') return DEFAULT_SAVE_DATA;
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (!dataStr) {
        this.saveGame(DEFAULT_SAVE_DATA);
        return DEFAULT_SAVE_DATA;
      }
      
      const parsed = JSON.parse(dataStr);
      // Run quick validation to ensure schema matches
      if (parsed && parsed.player && parsed.dracos && parsed.settings) {
        // Fallback for missing fields (backward compatibility)
        if (!parsed.inventory) parsed.inventory = [];
        if (!parsed.settings.sfxVolume) parsed.settings.sfxVolume = 80;
        if (!parsed.tier) parsed.tier = 'Free';

        // Auto-migrate spelling from Assasinmon to Assassinmon
        if (parsed.dracos.Assasinmon) {
          parsed.dracos.Assassinmon = {
            ...parsed.dracos.Assasinmon,
          };
          delete parsed.dracos.Assasinmon;
        }
        if (parsed.selectedDraco === 'Assasinmon') {
          parsed.selectedDraco = 'Assassinmon';
        }
        if (parsed.unlockedDraco && parsed.unlockedDraco.includes('Assasinmon')) {
          parsed.unlockedDraco = parsed.unlockedDraco.map((name: string) => name === 'Assasinmon' ? 'Assassinmon' : name);
        }

        // Auto-migrate new characters if they don't exist in saved dracos
        if (!parsed.dracos.Assassinmon) {
          parsed.dracos.Assassinmon = {
            level: 1,
            exp: 0,
            hp: 15,
            attack: 8,
            defense: 2,
            speed: 9,
            jump: 11.5,
            range: 2,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Flymon) {
          parsed.dracos.Flymon = {
            level: 1,
            exp: 0,
            hp: 17,
            attack: 5,
            defense: 3,
            speed: 6,
            jump: 14,
            range: 5,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Whitemon) {
          parsed.dracos.Whitemon = {
            level: 1,
            exp: 0,
            hp: 20,
            attack: 6,
            defense: 3,
            speed: 6,
            jump: 11,
            range: 8,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Magemon) {
          parsed.dracos.Magemon = {
            level: 1,
            exp: 0,
            hp: 19,
            attack: 7,
            defense: 3,
            speed: 6.5,
            jump: 11,
            range: 12,
            unlocked: false,
            energyRegen: 1.2,
          };
        }
        if (!parsed.dracos.Shadowmon) {
          parsed.dracos.Shadowmon = {
            level: 1,
            exp: 0,
            hp: 20,
            attack: 9,
            defense: 3,
            speed: 8,
            jump: 10.5,
            range: 8,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Bombamon) {
          parsed.dracos.Bombamon = {
            level: 1,
            exp: 0,
            hp: 21,
            attack: 8,
            defense: 3,
            speed: 7,
            jump: 11,
            range: 8,
            unlocked: false,
            energyRegen: 1.0,
          };
        }

        // Auto-initialize energyRegen on all characters
        Object.keys(parsed.dracos).forEach(key => {
          if (parsed.dracos[key] && (parsed.dracos[key] as any).energyRegen === undefined) {
            (parsed.dracos[key] as any).energyRegen = 1.0;
          }
        });

        // Auto-migrate jump stats if old save data had low jump power
        if (parsed.dracos.Archermon && (parsed.dracos.Archermon.jump < 9.5)) {
          parsed.dracos.Archermon.jump = 10.5;
        }
        if (parsed.dracos.Shieldmon) {
          if (parsed.dracos.Shieldmon.jump < 9.0) {
            parsed.dracos.Shieldmon.jump = 10.0;
          }
          if (parsed.dracos.Shieldmon.speed <= 3) {
            parsed.dracos.Shieldmon.speed = 6; // Boost old Shieldmon speed saves
          }
        }
        if (parsed.dracos.Jumpmon && (parsed.dracos.Jumpmon.jump < 10.0)) {
          parsed.dracos.Jumpmon.jump = 11.0;
        }

        return parsed as SaveData;
      }
      return DEFAULT_SAVE_DATA;
    } catch (e) {
      console.error('Error loading game save:', e);
      return DEFAULT_SAVE_DATA;
    }
  },

  saveGame(data: SaveData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving game state:', e);
    }
  },

  resetGame(): SaveData {
    this.saveGame(DEFAULT_SAVE_DATA);
    return DEFAULT_SAVE_DATA;
  },

  exportSave(data: SaveData): string {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    } catch (e) {
      console.error('Failed to export save data:', e);
      return '';
    }
  },

  importSave(encodedData: string): SaveData | null {
    try {
      const decoded = decodeURIComponent(escape(atob(encodedData)));
      const parsed = JSON.parse(decoded);
      if (parsed && parsed.player && parsed.dracos && parsed.settings) {
        this.saveGame(parsed);
        return parsed as SaveData;
      }
      return null;
    } catch (e) {
      console.error('Failed to import save data:', e);
      return null;
    }
  }
};
