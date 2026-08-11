import level1 from './level/1/index.js';
import level2 from './level/2/index.js';
import level3 from './level/3/index.js';
import level4 from './level/4/index.js';
import level5 from './level/5/index.js';

/**
 * World 1 Metadata - Forest Realm
 */
const worldMetadata = {
  id: 1,
  name: "Forest Realm",
  themeName: "forest",
  icon: "🌲",
  color: "emerald",
  description: "Lush green woodlands, mossy platforms, and bouncy slime creatures.",
  rewardMultiplier: 1,
  bossName: "King Slime",
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
