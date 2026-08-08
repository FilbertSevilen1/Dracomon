import levelsData from '../game/levels.json';
import { WorldData, LevelData } from '../game/LevelManager';

const CUSTOM_LEVELS_KEY = 'dracoman_custom_levels_v1';

export interface LevelStorageData {
  themes: Record<string, any>;
  worlds: any[];
}

export const levelStorageService = {
  getCustomData(): LevelStorageData {
    if (typeof window === 'undefined') {
      return {
        themes: levelsData.themes,
        worlds: levelsData.worlds,
      };
    }
    try {
      const dataStr = localStorage.getItem(CUSTOM_LEVELS_KEY);
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        if (parsed && parsed.worlds && Array.isArray(parsed.worlds)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse custom levels from localStorage:', e);
    }
    return {
      themes: levelsData.themes,
      worlds: levelsData.worlds,
    };
  },

  saveCustomData(data: LevelStorageData) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CUSTOM_LEVELS_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('dracoman_levels_updated'));
    } catch (e) {
      console.error('Failed to save custom levels to localStorage:', e);
    }
  },

  getWorldsRaw(): any[] {
    return this.getCustomData().worlds;
  },

  saveWorldsRaw(worlds: any[]) {
    const custom = this.getCustomData();
    custom.worlds = worlds;
    this.saveCustomData(custom);
  },

  resetToDefault() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(CUSTOM_LEVELS_KEY);
      window.dispatchEvent(new CustomEvent('dracoman_levels_updated'));
    } catch (e) {
      console.error('Failed to reset custom levels:', e);
    }
  }
};
