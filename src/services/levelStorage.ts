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
          const existingWorldIds = new Set(parsed.worlds.map((w: any) => w.id));
          const missingWorlds = levelsData.worlds.filter((w: any) => !existingWorldIds.has(w.id));
          let changed = false;
          if (missingWorlds.length > 0) {
            parsed.worlds = [...parsed.worlds, ...missingWorlds];
            parsed.themes = { ...levelsData.themes, ...parsed.themes };
            changed = true;
          }
          const world13InCustom = parsed.worlds.find((w: any) => w.id === 13);
          const world13InDefault = levelsData.worlds.find((w: any) => w.id === 13);
          const stg5 = world13InCustom?.stages?.[4];
          const hasPyramid = stg5?.entities?.some((e: any) => e.type === 'living_pyramid') || stg5?.grid?.some((r: string) => r.includes('Y'));
          if (world13InDefault && (!world13InCustom || !world13InCustom.stages || world13InCustom.stages.length < 5 || !hasPyramid)) {
            parsed.worlds = parsed.worlds.map((w: any) => w.id === 13 ? world13InDefault : w);
            if (!parsed.worlds.some((w: any) => w.id === 13)) {
              parsed.worlds.push(world13InDefault);
            }
            parsed.themes = { ...levelsData.themes, ...parsed.themes };
            changed = true;
          }
          if (changed) {
            try {
              localStorage.setItem(CUSTOM_LEVELS_KEY, JSON.stringify(parsed));
            } catch (err) {
              console.error('Failed to sync worlds into localStorage:', err);
            }
          }
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
  },

  async deployLevelsToRepo(worlds?: any[]): Promise<{ success: boolean; message?: string; error?: string }> {
    const worldsToSave = worlds || this.getWorldsRaw();
    try {
      const res = await fetch('/api/admin/deploy-levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worlds: worldsToSave })
      });
      const data = await res.json();
      if (data.success) {
        this.saveWorldsRaw(worldsToSave);
      }
      return data;
    } catch (e: any) {
      console.error('API call failed to deploy levels:', e);
      return { success: false, error: e.message || 'Network error while calling deploy API.' };
    }
  },

  downloadLevelsJson(worlds?: any[]) {
    if (typeof window === 'undefined') return;
    const worldsToSave = worlds || this.getWorldsRaw();
    const fullData = {
      themes: levelsData.themes,
      worlds: worldsToSave
    };
    const jsonStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'levels.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
