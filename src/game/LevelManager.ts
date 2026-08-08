import levelsData from './levels.json';
import { levelStorageService } from '../services/levelStorage';

export interface SubMapData {
  id: number;
  name?: string;
  grid: string[];
}

export type ThemeType = 'forest' | 'ruins' | 'volcano' | 'ice' | 'shadow' | 'temple' | 'heavens' | 'core' | 'space' | 'pixel';

export interface LevelTheme {
  type: ThemeType;
  skyColor: string;
  solidColor: string;
  platformColor: string;
  borderColor: string;
  bgGradient: string;
  particleColor: string;
}

export interface LevelData {
  name: string;
  tileSize: number;
  theme: LevelTheme;
  grid?: string[];
  maps?: SubMapData[];
  isUnderwater?: boolean;
  isSurvivalMode?: boolean;
  survivalDuration?: number;
  description: string;
  difficulty: string;
  diffClass: string;
  boss: string;
  icon: string;
  borderHover: string;
  color: string;
  worldId: number;
  worldName: string;
  stageInWorld: number;
  totalStagesInWorld: number;
  rewardMultiplier: number;
  globalStageNum: number;
}

export interface WorldData {
  id: number;
  name: string;
  themeName: string;
  icon: string;
  color: string;
  description: string;
  rewardMultiplier: number;
  bossName: string;
  stages: LevelData[];
}

const DEFAULT_THEMES: Record<string, LevelTheme> = levelsData.themes as Record<string, LevelTheme>;

const ensureMinHeadroom = (grid?: string[]): string[] | undefined => {
  if (!grid || grid.length === 0) return grid;
  const width = grid[0].length;
  const emptyRow = '.'.repeat(width);

  let emptyCount = 0;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === emptyRow) {
      emptyCount++;
    } else {
      break;
    }
  }

  if (emptyCount < 8) {
    const needed = 8 - emptyCount;
    const padding = Array(needed).fill(emptyRow);
    return [...padding, ...grid];
  }

  return grid;
};

export const parseWorlds = (): WorldData[] => {
  const custom = levelStorageService.getCustomData();
  const themes = custom.themes || DEFAULT_THEMES;
  const rawWorlds = custom.worlds || levelsData.worlds;

  let globalCounter = 1;

  return rawWorlds.map((worldRaw: any, wIndex: number) => {
    const worldId = worldRaw.id || (wIndex + 1);
    const worldTheme = themes[worldRaw.themeName] || themes.forest || DEFAULT_THEMES.forest;
    const totalStagesInWorld = worldRaw.stages ? worldRaw.stages.length : 0;

    const stages: LevelData[] = (worldRaw.stages || []).map((stgRaw: any, sIndex: number) => {
      const globalStageNum = globalCounter++;
      const stageInWorld = stgRaw.stageInWorld || (sIndex + 1);
      const isFinalStage = stageInWorld === totalStagesInWorld;
      const stageBoss = stgRaw.boss || (isFinalStage ? worldRaw.bossName : "None (Miniboss / Portal)");

      const processedGrid = ensureMinHeadroom(stgRaw.grid);
      const processedMaps = stgRaw.maps ? stgRaw.maps.map((m: SubMapData) => ({
        ...m,
        grid: ensureMinHeadroom(m.grid) || m.grid
      })) : undefined;

      return {
        name: stgRaw.name || `World ${worldId}-${stageInWorld}: ${stgRaw.title || 'Stage'}`,
        tileSize: stgRaw.tileSize || 40,
        theme: worldTheme,
        grid: processedGrid,
        maps: processedMaps,
        isUnderwater: stgRaw.isUnderwater,
        isSurvivalMode: stgRaw.isSurvivalMode,
        survivalDuration: stgRaw.survivalDuration,
        description: stgRaw.description || '',
        difficulty: stgRaw.difficulty || 'NORMAL',
        diffClass: stgRaw.diffClass || 'bg-blue-100 text-blue-800 border-blue-300 font-mono',
        boss: stageBoss,
        icon: stgRaw.icon || '⚔️',
        borderHover: stgRaw.borderHover || 'hover:border-blue-500',
        color: stgRaw.color || 'blue',
        worldId: worldId,
        worldName: worldRaw.name || `World ${worldId}`,
        stageInWorld: stageInWorld,
        totalStagesInWorld,
        rewardMultiplier: worldRaw.rewardMultiplier || 1,
        globalStageNum
      };
    });

    return {
      id: worldId,
      name: worldRaw.name || `World ${worldId}`,
      themeName: worldRaw.themeName || 'forest',
      icon: worldRaw.icon || '🌍',
      color: worldRaw.color || 'emerald',
      description: worldRaw.description || '',
      rewardMultiplier: worldRaw.rewardMultiplier || 1,
      bossName: worldRaw.bossName || 'Boss',
      stages
    };
  });
};

export let WORLDS: WorldData[] = parseWorlds();
export let STAGES: LevelData[] = WORLDS.flatMap(w => w.stages);

export const refreshLevelManager = () => {
  WORLDS = parseWorlds();
  STAGES = WORLDS.flatMap(w => w.stages);
};

if (typeof window !== 'undefined') {
  window.addEventListener('dracoman_levels_updated', () => {
    refreshLevelManager();
  });
}

export const getLevel = (stageNum: number): LevelData => {
  refreshLevelManager();
  const index = Math.max(1, Math.min(STAGES.length, stageNum)) - 1;
  const stage = STAGES[index] || STAGES[0];
  return {
    ...stage,
    grid: stage.grid ? [...stage.grid] : undefined,
    maps: stage.maps ? stage.maps.map(m => ({
      ...m,
      grid: [...m.grid]
    })) : undefined,
  };
};

export const getWorld = (worldId: number): WorldData => {
  refreshLevelManager();
  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];
  return world;
};
