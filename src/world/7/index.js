import level1 from './level/1/index.js';
import level2 from './level/2/index.js';
import level3 from './level/3/index.js';
import level4 from './level/4/index.js';
import level5 from './level/5/index.js';

/**
 * World 7 Metadata - Volcanic Mountain
 */
const worldMetadata = {
  id: 7,
  name: "Volcanic Mountain",
  themeName: "volcano",
  icon: "🌋",
  color: "orange",
  description: "Raging lava rivers, fiery geysers, and molten rock elementals.",
  rewardMultiplier: 2.3,
  bossName: "Magma Guard",
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
