import level1 from './level/1/index.js';
import level2 from './level/2/index.js';
import level3 from './level/3/index.js';
import level4 from './level/4/index.js';
import level5 from './level/5/index.js';

/**
 * World 6 Metadata - Ocean Abyss
 */
const worldMetadata = {
  id: 6,
  name: "Ocean Abyss",
  themeName: "ruins",
  icon: "🌊",
  color: "cyan",
  description: "Submerged oceanic trench featuring water currents, anchors, and giant marine bosses.",
  rewardMultiplier: 2,
  bossName: "Killer Whale",
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
