import { SaveData, InventoryItem } from '../types/game';
import { normalizeDracoEquipped } from '../data/equipment';

export const STORAGE_KEY = 'Dracoman_save_v1';

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
    description: 'Permanently increases any single stat of your selected Draco by +0.1.',
    quantity: 1,
  },
  {
    id: 'iron_sword',
    name: 'Iron Longsword',
    type: 'equipment',
    slot: 'weapon',
    rarity: 'common',
    description: 'A reliable forged blade that increases direct physical damage (+2 ATK).',
    quantity: 1,
    icon: '🗡️',
    stats: { attack: 2 },
    cost: 35
  },
  {
    id: 'leather_tunic',
    name: 'Leather Tunic',
    type: 'equipment',
    slot: 'armor',
    rarity: 'common',
    description: 'Flexible leather armor cushioning light monster attacks (+1 DEF, +6 HP).',
    quantity: 1,
    icon: '🥋',
    stats: { defense: 1, hp: 6 },
    cost: 30
  }
];

export const DEFAULT_SAVE_DATA: SaveData = {
  player: {
    coins: 50,
    level: 1,
    totalExp: 0,
  },
  unlockedDraco: ['Jumpmon', 'Archermon', 'Shieldmon'],
  selectedDraco: 'Jumpmon',
  dracos: {
    Jumpmon: {
      level: 1,
      exp: 0,
      hp: 36,
      attack: 4,
      defense: 6,
      speed: 7,
      jump: 11,
      range: 1,
      unlocked: true,
      energyRegen: 1.0,
      equipped: ['iron_sword'],
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
      unlocked: true,
      energyRegen: 1.0,
    },
    Shieldmon: {
      level: 1,
      exp: 0,
      hp: 52,
      attack: 3,
      defense: 18,
      speed: 6,
      jump: 10,
      range: 1,
      unlocked: true,
      energyRegen: 1.0,
    },
    Assassinmon: {
      level: 1,
      exp: 0,
      hp: 30,
      attack: 8,
      defense: 4,
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
    Thundermon: {
      level: 1,
      exp: 0,
      hp: 22,
      attack: 9,
      defense: 3,
      speed: 7.5,
      jump: 11,
      range: 6,
      unlocked: false,
      energyRegen: 1.0,
    },
    Enigmon: {
      level: 1,
      exp: 0,
      hp: 20,
      attack: 8,
      defense: 3,
      speed: 7,
      jump: 11,
      range: 12,
      unlocked: false,
      energyRegen: 1.2,
    },
    Lunarmon: {
      level: 1,
      exp: 0,
      hp: 20,
      attack: 9,
      defense: 3,
      speed: 7.5,
      jump: 11,
      range: 10,
      unlocked: false,
      energyRegen: 1.0,
    },
    Azuremon: {
      level: 1,
      exp: 0,
      hp: 20,
      attack: 8,
      defense: 3,
      speed: 7.5,
      jump: 11,
      range: 10,
      unlocked: false,
      energyRegen: 1.0,
    },
    Pixelmon: {
      level: 1,
      exp: 0,
      hp: 20,
      attack: 8,
      defense: 3,
      speed: 7.0,
      jump: 11,
      range: 8,
      unlocked: false,
      energyRegen: 1.0,
    },
    Krakenmon: {
      level: 1,
      exp: 0,
      hp: 48,
      attack: 8,
      defense: 8,
      speed: 7.0,
      jump: 11,
      range: 6,
      unlocked: false,
      energyRegen: 1.0,
    },
    Butchermon: {
      level: 1,
      exp: 0,
      hp: 52,
      attack: 9,
      defense: 8,
      speed: 6.5,
      jump: 11,
      range: 5,
      unlocked: false,
      energyRegen: 1.0,
    },
    Reapermon: {
      level: 1,
      exp: 0,
      hp: 44,
      attack: 9.5,
      defense: 7,
      speed: 8.0,
      jump: 11,
      range: 7,
      unlocked: false,
      energyRegen: 1.0,
    },
    Mikomon: {
      level: 1,
      exp: 0,
      hp: 22,
      attack: 9.0,
      defense: 3.5,
      speed: 7.5,
      jump: 11,
      range: 8,
      unlocked: false,
      energyRegen: 1.0,
    },
  },
  tier: 'Free',
  difficulty: 'normal',
  inventory: DEFAULT_ITEMS,
  settings: {
    volume: 80,
    music: true,
    sfxVolume: 85,
    fullscreen: false,
  },
  lastWorldId: 1,
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

      if (parsed && parsed.player && parsed.dracos && parsed.settings) {
        if (!parsed.inventory) parsed.inventory = [];
        if (!parsed.settings.sfxVolume) parsed.settings.sfxVolume = 80;
        if (!parsed.tier) parsed.tier = 'Free';
        if (!parsed.difficulty) parsed.difficulty = 'normal';
        if (!parsed.lastWorldId) parsed.lastWorldId = 1;

        if (parsed.player.coins === undefined || isNaN(parsed.player.coins)) {
          parsed.player.coins = parsed.tier === 'Basic' ? 5000 : parsed.tier === 'Premium' ? 25000 : 50;
        }

        if (!parsed.unlockedDraco) parsed.unlockedDraco = ['Jumpmon', 'Archermon', 'Shieldmon'];
        if (!parsed.unlockedDraco.includes('Jumpmon')) parsed.unlockedDraco.push('Jumpmon');
        if (!parsed.unlockedDraco.includes('Archermon')) parsed.unlockedDraco.push('Archermon');
        if (!parsed.unlockedDraco.includes('Shieldmon')) parsed.unlockedDraco.push('Shieldmon');

        if (parsed.dracos.Jumpmon) parsed.dracos.Jumpmon.unlocked = true;
        if (parsed.dracos.Archermon) parsed.dracos.Archermon.unlocked = true;
        if (parsed.dracos.Shieldmon) parsed.dracos.Shieldmon.unlocked = true;

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

        if (!parsed.dracos.Assassinmon) {
          parsed.dracos.Assassinmon = {
            level: 1,
            exp: 0,
            hp: 30,
            attack: 8,
            defense: 4,
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
        if (!parsed.dracos.Thundermon) {
          parsed.dracos.Thundermon = {
            level: 1,
            exp: 0,
            hp: 22,
            attack: 9,
            defense: 3,
            speed: 7.5,
            jump: 11,
            range: 6,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Enigmon) {
          parsed.dracos.Enigmon = {
            level: 1,
            exp: 0,
            hp: 20,
            attack: 8,
            defense: 3,
            speed: 7,
            jump: 11,
            range: 12,
            unlocked: false,
            energyRegen: 1.2,
          };
        }
        if (!parsed.dracos.Lunarmon) {
          parsed.dracos.Lunarmon = {
            level: 1,
            exp: 0,
            hp: 20,
            attack: 9,
            defense: 3,
            speed: 7.5,
            jump: 11,
            range: 10,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Azuremon) {
          parsed.dracos.Azuremon = {
            level: 1,
            exp: 0,
            hp: 20,
            attack: 8,
            defense: 3,
            speed: 7.5,
            jump: 11,
            range: 10,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Pixelmon) {
          parsed.dracos.Pixelmon = {
            level: 1,
            exp: 0,
            hp: 20,
            attack: 8,
            defense: 3,
            speed: 7.0,
            jump: 11,
            range: 8,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Krakenmon) {
          parsed.dracos.Krakenmon = {
            level: 1,
            exp: 0,
            hp: 48,
            attack: 8,
            defense: 8,
            speed: 7.0,
            jump: 11,
            range: 6,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Butchermon) {
          parsed.dracos.Butchermon = {
            level: 1,
            exp: 0,
            hp: 52,
            attack: 9,
            defense: 8,
            speed: 6.5,
            jump: 11,
            range: 5,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Reapermon) {
          parsed.dracos.Reapermon = {
            level: 1,
            exp: 0,
            hp: 44,
            attack: 9.5,
            defense: 7,
            speed: 8.0,
            jump: 11,
            range: 7,
            unlocked: false,
            energyRegen: 1.0,
          };
        }
        if (!parsed.dracos.Mikomon) {
          parsed.dracos.Mikomon = {
            level: 1,
            exp: 0,
            hp: 22,
            attack: 9.0,
            defense: 3.5,
            speed: 7.5,
            jump: 11,
            range: 8,
            unlocked: false,
            energyRegen: 1.0,
          };
        }

        const MELEE_BASE_STATS: Record<string, { hp: number; defense: number }> = {
          Jumpmon: { hp: 36, defense: 6 },
          Shieldmon: { hp: 52, defense: 18 },
          Assassinmon: { hp: 30, defense: 4 },
          Krakenmon: { hp: 48, defense: 8 },
          Butchermon: { hp: 52, defense: 8 },
          Reapermon: { hp: 44, defense: 7 }
        };

        Object.keys(parsed.dracos).forEach(key => {
          const d = parsed.dracos[key] as any;
          if (d) {
            if (!Array.isArray(d.equipped)) {
              d.equipped = key === 'Jumpmon' ? normalizeDracoEquipped(['iron_sword']) : ['', '', '', '', ''];
            } else {
              d.equipped = normalizeDracoEquipped(d.equipped);
            }
            const meleeBase = MELEE_BASE_STATS[key];
            if (meleeBase) {
              const curLvl = d.level || 1;
              const minExpectedHp = meleeBase.hp + (curLvl - 1) * 8;
              const minExpectedDef = meleeBase.defense + (curLvl - 1) * 2;
              if (d.hp < minExpectedHp) d.hp = minExpectedHp;
              if (d.defense < minExpectedDef) d.defense = minExpectedDef;
            }
            if (d.energyRegen === undefined) d.energyRegen = 1.0;
            ['hp', 'attack', 'defense', 'speed', 'jump', 'range', 'energyRegen'].forEach(stat => {
              if (typeof d[stat] === 'number') {
                d[stat] = Math.round(d[stat] * 10) / 10;
              }
            });
          }
        });

        if (parsed.dracos.Archermon && (parsed.dracos.Archermon.jump < 9.5)) {
          parsed.dracos.Archermon.jump = 10.5;
        }
        if (parsed.dracos.Shieldmon) {
          if (parsed.dracos.Shieldmon.jump < 9.0) {
            parsed.dracos.Shieldmon.jump = 10.0;
          }
          if (parsed.dracos.Shieldmon.speed <= 3) {
            parsed.dracos.Shieldmon.speed = 6;
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
