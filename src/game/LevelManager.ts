import levelsData from './levels.json';

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

const THEMES: Record<string, LevelTheme> = levelsData.themes as Record<string, LevelTheme>;

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

let globalCounter = 1;

export const WORLDS: WorldData[] = levelsData.worlds.map((worldRaw: any) => {
  const worldTheme = THEMES[worldRaw.themeName] || THEMES.forest;
  const totalStagesInWorld = worldRaw.stages.length;

  const stages: LevelData[] = worldRaw.stages.map((stgRaw: any) => {
    const globalStageNum = globalCounter++;
    const isFinalStage = stgRaw.stageInWorld === totalStagesInWorld;
    const stageBoss = isFinalStage ? worldRaw.bossName : "None (Miniboss / Portal)";

    const processedGrid = ensureMinHeadroom(stgRaw.grid);
    const processedMaps = stgRaw.maps ? stgRaw.maps.map((m: SubMapData) => ({
      ...m,
      grid: ensureMinHeadroom(m.grid) || m.grid
    })) : undefined;

    return {
      name: `World ${worldRaw.id}-${stgRaw.stageInWorld}: ${stgRaw.title}`,
      tileSize: 40,
      theme: worldTheme,
      grid: processedGrid,
      maps: processedMaps,
      isUnderwater: stgRaw.isUnderwater,
      isSurvivalMode: stgRaw.isSurvivalMode,
      survivalDuration: stgRaw.survivalDuration,
      description: stgRaw.description,
      difficulty: stgRaw.difficulty,
      diffClass: stgRaw.diffClass,
      boss: stageBoss,
      icon: stgRaw.icon,
      borderHover: stgRaw.borderHover,
      color: stgRaw.color,
      worldId: worldRaw.id,
      worldName: worldRaw.name,
      stageInWorld: stgRaw.stageInWorld,
      totalStagesInWorld,
      rewardMultiplier: worldRaw.rewardMultiplier,
      globalStageNum
    };
  });

  return {
    id: worldRaw.id,
    name: worldRaw.name,
    themeName: worldRaw.themeName,
    icon: worldRaw.icon,
    color: worldRaw.color,
    description: worldRaw.description,
    rewardMultiplier: worldRaw.rewardMultiplier,
    bossName: worldRaw.bossName,
    stages
  };
});

// Flat array of all stages across all 11 worlds for backwards compatibility
export const STAGES: LevelData[] = WORLDS.flatMap(world => world.stages);

export const getLevel = (stageNum: number): LevelData => {
  const index = Math.max(1, Math.min(STAGES.length, stageNum)) - 1;
  const stage = STAGES[index];
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
  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];
  return world;
};
