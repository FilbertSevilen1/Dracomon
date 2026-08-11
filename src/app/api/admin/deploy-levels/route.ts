import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import levelsData from '@/game/levels.json';

function syncWorldFolder(worlds: any[]) {
  const srcWorldDir = path.join(process.cwd(), 'src', 'world');
  const validWorldIds = new Set(worlds.map((w: any, idx: number) => String(w.id || idx + 1)));

  if (fs.existsSync(srcWorldDir)) {
    const existingWorldDirs = fs.readdirSync(srcWorldDir);
    for (const dirName of existingWorldDirs) {
      if (!validWorldIds.has(dirName)) {
        const delPath = path.join(srcWorldDir, dirName);
        fs.rmSync(delPath, { recursive: true, force: true });
      }
    }
  } else {
    fs.mkdirSync(srcWorldDir, { recursive: true });
  }

  worlds.forEach((world: any, wIdx: number) => {
    const worldId = world.id || (wIdx + 1);
    const wDir = path.join(srcWorldDir, String(worldId));
    if (!fs.existsSync(wDir)) {
      fs.mkdirSync(wDir, { recursive: true });
    }

    const stages = world.stages || [];
    const validStageNums = new Set(stages.map((stg: any, sIdx: number) => String(stg.stageInWorld || sIdx + 1)));

    const levelBaseDir = path.join(wDir, 'level');
    if (fs.existsSync(levelBaseDir)) {
      const existingStageDirs = fs.readdirSync(levelBaseDir);
      for (const sDirName of existingStageDirs) {
        if (!validStageNums.has(sDirName)) {
          fs.rmSync(path.join(levelBaseDir, sDirName), { recursive: true, force: true });
        }
      }
    } else {
      fs.mkdirSync(levelBaseDir, { recursive: true });
    }

    const importsList: string[] = [];
    const levelsMapEntries: string[] = [];
    stages.forEach((stg: any, sIdx: number) => {
      const sNum = stg.stageInWorld || (sIdx + 1);
      importsList.push(`import level${sNum} from './level/${sNum}/index.js';`);
      levelsMapEntries.push(`    ${sNum}: level${sNum}`);
    });

    const worldIndexContent = `${importsList.join('\n')}

/**
 * World ${worldId} Metadata - ${world.name || 'World ' + worldId}
 */
const worldMetadata = {
  id: ${worldId},
  name: ${JSON.stringify(world.name || 'World ' + worldId)},
  themeName: ${JSON.stringify(world.themeName || 'forest')},
  icon: ${JSON.stringify(world.icon || '🌍')},
  color: ${JSON.stringify(world.color || 'emerald')},
  description: ${JSON.stringify(world.description || '')},
  rewardMultiplier: ${world.rewardMultiplier || 1},
  bossName: ${JSON.stringify(world.bossName || 'Boss')},
  totalStages: ${stages.length},
  levels: {
${levelsMapEntries.join(',\n')}
  }
};

export { worldMetadata };
export default worldMetadata;
`;
    fs.writeFileSync(path.join(wDir, 'index.js'), worldIndexContent, 'utf-8');

    stages.forEach((stage: any, sIdx: number) => {
      const stageNum = stage.stageInWorld || (sIdx + 1);
      const stageDir = path.join(levelBaseDir, String(stageNum));
      const layoutDir = path.join(stageDir, 'layout');
      if (!fs.existsSync(layoutDir)) {
        fs.mkdirSync(layoutDir, { recursive: true });
      }

      const grid = stage.grid || [];
      const entities = stage.entities || [];
      const maps = stage.maps || undefined;

      fs.writeFileSync(path.join(layoutDir, 'grid.json'), JSON.stringify(grid, null, 2), 'utf-8');
      fs.writeFileSync(path.join(layoutDir, 'entities.json'), JSON.stringify(entities, null, 2), 'utf-8');

      const layoutObj: any = { grid, entities };
      if (maps) layoutObj.maps = maps;
      fs.writeFileSync(path.join(layoutDir, 'layout.json'), JSON.stringify(layoutObj, null, 2), 'utf-8');

      const layoutIndexContent = `import grid from './grid.json';
import entities from './entities.json';
${maps ? "import layoutData from './layout.json';\n" : ''}
const layout = {
  grid,
  entities${maps ? ',\n  maps: layoutData.maps' : ''}
};

export { grid, entities };
export default layout;
`;
      fs.writeFileSync(path.join(layoutDir, 'index.js'), layoutIndexContent, 'utf-8');

      const stageMeta: any = {
        stageInWorld: stageNum,
        title: stage.title || stage.name || `Stage ${stageNum}`,
        description: stage.description || '',
        difficulty: stage.difficulty || 'NORMAL',
        diffClass: stage.diffClass || '',
        icon: stage.icon || '⚔️',
        color: stage.color || 'blue',
        borderHover: stage.borderHover || '',
        tileSize: stage.tileSize || 40
      };
      if (stage.isUnderwater !== undefined) stageMeta.isUnderwater = stage.isUnderwater;
      if (stage.isSurvivalMode !== undefined) stageMeta.isSurvivalMode = stage.isSurvivalMode;
      if (stage.survivalDuration !== undefined) stageMeta.survivalDuration = stage.survivalDuration;

      const stageIndexContent = `import layout from './layout/index.js';

/**
 * Stage Metadata for World ${worldId}, Level ${stageNum} (${stageMeta.title})
 */
const stageMetadata = {
  stageInWorld: ${stageMeta.stageInWorld},
  title: ${JSON.stringify(stageMeta.title)},
  description: ${JSON.stringify(stageMeta.description)},
  difficulty: ${JSON.stringify(stageMeta.difficulty)},
  diffClass: ${JSON.stringify(stageMeta.diffClass)},
  icon: ${JSON.stringify(stageMeta.icon)},
  color: ${JSON.stringify(stageMeta.color)},
  borderHover: ${JSON.stringify(stageMeta.borderHover)},
  tileSize: ${stageMeta.tileSize}${stageMeta.isUnderwater !== undefined ? `,\n  isUnderwater: ${stageMeta.isUnderwater}` : ''}${stageMeta.isSurvivalMode !== undefined ? `,\n  isSurvivalMode: ${stageMeta.isSurvivalMode}` : ''}${stageMeta.survivalDuration !== undefined ? `,\n  survivalDuration: ${stageMeta.survivalDuration}` : ''},
  layout
};

export { stageMetadata };
export default stageMetadata;
`;
      fs.writeFileSync(path.join(stageDir, 'index.js'), stageIndexContent, 'utf-8');
    });
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { worlds } = body;

    if (!worlds || !Array.isArray(worlds)) {
      return NextResponse.json({ success: false, error: 'Invalid worlds array provided.' }, { status: 400 });
    }

    const updatedData = {
      themes: levelsData.themes,
      worlds: worlds
    };

    const filePath = path.join(process.cwd(), 'src', 'game', 'levels.json');
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');

    syncWorldFolder(worlds);

    return NextResponse.json({
      success: true,
      message: 'Successfully deployed custom levels to src/game/levels.json and synchronized src/world structure!'
    });
  } catch (error: any) {
    console.error('Failed to deploy levels to repository:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to write levels to server disk.'
    }, { status: 500 });
  }
}
