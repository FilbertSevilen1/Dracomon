import level1 from './level/1/index.js';
import level2 from './level/2/index.js';
import level3 from './level/3/index.js';
import level4 from './level/4/index.js';
import level5 from './level/5/index.js';

/**
 * World 8 Metadata - Primordial Core
 */
const worldMetadata = {
  id: 8,
  name: "Primordial Core",
  themeName: "core",
  icon: "💥",
  color: "rose",
  description: "Deep planetary core with landmines, exploding fire torrents, and heavy artillery.",
  rewardMultiplier: 2.6,
  bossName: "Core Guardian",
  totalStages: 5,
  levels: {
    1: level1,
    2: level2,
    3: level3,
    4: level4,
    5: level5
  }
};

export { worldMetadata };
export default worldMetadata;
