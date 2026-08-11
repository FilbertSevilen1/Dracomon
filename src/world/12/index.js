import level1 from './level/1/index.js';
import level2 from './level/2/index.js';
import level3 from './level/3/index.js';
import level4 from './level/4/index.js';
import level5 from './level/5/index.js';

/**
 * World 12 Metadata - Pixel Kingdom
 */
const worldMetadata = {
  id: 12,
  name: "Pixel Kingdom",
  themeName: "pixel",
  icon: "🕹️",
  color: "fuchsia",
  description: "Retro 8-bit digital realm featuring falling block rain layers and form-shifting Blockman.",
  rewardMultiplier: 5.5,
  bossName: "Blockman",
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
