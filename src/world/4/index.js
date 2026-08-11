import level1 from './level/1/index.js';
import level2 from './level/2/index.js';
import level3 from './level/3/index.js';
import level4 from './level/4/index.js';
import level5 from './level/5/index.js';

/**
 * World 4 Metadata - Shadow Realm
 */
const worldMetadata = {
  id: 4,
  name: "Shadow Realm",
  themeName: "shadow",
  icon: "🌑",
  color: "purple",
  description: "Dark nether domain populated by soul flames, shadow demons, and dark energy.",
  rewardMultiplier: 1.6,
  bossName: "Shadow Overlord",
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
