import levelsData from './levels.json';
import { levelStorageService } from '../services/levelStorage';

export interface LevelEntity {
  id?: string;
  type: string;
  x: number; // grid cell column index
  y: number; // grid cell row index
  [key: string]: any;
}

export interface SubMapData {
  id: number;
  name?: string;
  grid: string[];
  entities?: LevelEntity[];
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
  entities?: LevelEntity[];
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

/**
 * Symbol to Entity Type mapping for legacy ASCII grid auto-migration.
 */
export const SYMBOL_TO_ENTITY_TYPE: Record<string, string> = {
  '@': 'player_spawn',
  'P': 'exit_portal',
  'E': 'exit_portal',
  'X': 'sub_portal',
  'm': 'antimatter_vortex',
  'c': 'coin',
  'p': 'potion',
  'h': 'heart',
  'H': 'heart',
  'u': 'upgrade_stone',
  'U': 'upgrade_stone',
  'T': 'trampoline',
  'V': 'vine_trap',
  'R': 'poison_spike',
  'M': 'laser_cannon',
  '1': 'slime',
  '2': 'goblin_archer',
  '3': 'fire_golem',
  '4': 'bomb_thrower',
  's': 'skeleton_archer',
  'a': 'alien',
  'f': 'fish',
  'F': 'flying_wyvern',
  'A': 'anchor',
  'S': 'king_slime',
  'B': 'miniboss',
  'W': 'frost_wyvern',
  'O': 'shadow_overlord',
  'D': 'dragon_king',
  'G': 'giant_wisp',
  'L': 'lunar_goddess',
};

export const getEntityTypeFromSymbol = (char: string, isUnderwater = false): string | null => {
  if (char === 'C') return isUnderwater ? 'scallop' : 'coin';
  if (char === 'K') return isUnderwater ? 'killer_whale' : 'king_kong';
  return SYMBOL_TO_ENTITY_TYPE[char] || null;
};

export const convertGridToEntities = (grid: string[], isUnderwater = false): { cleanedGrid: string[]; entities: LevelEntity[] } => {
  if (!grid || grid.length === 0) return { cleanedGrid: [], entities: [] };
  const cleanedGrid: string[] = [];
  const entities: LevelEntity[] = [];

  for (let r = 0; r < grid.length; r++) {
    let rowStr = '';
    for (let c = 0; c < grid[r].length; c++) {
      const char = grid[r][c];
      const entityType = getEntityTypeFromSymbol(char, isUnderwater);
      if (entityType) {
        entities.push({ type: entityType, x: c, y: r });
        rowStr += '.'; // replace entity in grid with sky
      } else {
        rowStr += char;
      }
    }
    cleanedGrid.push(rowStr);
  }

  return { cleanedGrid, entities };
};

const ensureMinHeadroomWithEntities = (
  grid?: string[],
  entities?: LevelEntity[]
): { grid?: string[]; entities?: LevelEntity[] } => {
  if (!grid || grid.length === 0) return { grid, entities };
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
    const newGrid = [...padding, ...grid];
    const newEntities = entities ? entities.map(e => ({ ...e, y: e.y + needed })) : undefined;
    return { grid: newGrid, entities: newEntities };
  }

  return { grid, entities };
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

      let stgGrid = stgRaw.grid;
      let stgEntities: LevelEntity[] | undefined = stgRaw.entities;

      // Extract ASCII symbols from grid and merge with stgEntities
      if (stgGrid) {
        const converted = convertGridToEntities(stgGrid, stgRaw.isUnderwater);
        if (converted.entities.length > 0) {
          stgGrid = converted.cleanedGrid;
          const existing = stgEntities || [];
          const existingSet = new Set(existing.map(e => `${e.x},${e.y}`));
          const newFromGrid = converted.entities.filter(e => !existingSet.has(`${e.x},${e.y}`));
          stgEntities = [...existing, ...newFromGrid];
        }
      }

      const { grid: processedGrid, entities: processedEntities } = ensureMinHeadroomWithEntities(stgGrid, stgEntities);

      const processedMaps = stgRaw.maps ? stgRaw.maps.map((m: SubMapData) => {
        let mGrid = m.grid;
        let mEntities = m.entities;
        if (mGrid) {
          const converted = convertGridToEntities(mGrid, stgRaw.isUnderwater);
          if (converted.entities.length > 0) {
            mGrid = converted.cleanedGrid;
            const existing = mEntities || [];
            const existingSet = new Set(existing.map(e => `${e.x},${e.y}`));
            const newFromGrid = converted.entities.filter(e => !existingSet.has(`${e.x},${e.y}`));
            mEntities = [...existing, ...newFromGrid];
          }
        }
        const { grid: pMGrid, entities: pMEntities } = ensureMinHeadroomWithEntities(mGrid, mEntities);
        return {
          ...m,
          grid: pMGrid || m.grid,
          entities: pMEntities || m.entities
        };
      }) : undefined;

      return {
        name: stgRaw.name || `World ${worldId}-${stageInWorld}: ${stgRaw.title || 'Stage'}`,
        tileSize: stgRaw.tileSize || 40,
        theme: worldTheme,
        grid: processedGrid,
        entities: processedEntities,
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
    entities: stage.entities ? [...stage.entities] : undefined,
    maps: stage.maps ? stage.maps.map(m => ({
      ...m,
      grid: [...m.grid],
      entities: m.entities ? [...m.entities] : undefined
    })) : undefined,
  };
};

export const getWorld = (worldId: number): WorldData => {
  refreshLevelManager();
  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];
  return world;
};

