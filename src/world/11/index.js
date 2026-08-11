import level1 from './level/1/index.js';
import level2 from './level/2/index.js';
import level3 from './level/3/index.js';
import level4 from './level/4/index.js';
import level5 from './level/5/index.js';

/**
 * World 11 Metadata - Cosmic Space & Moon
 */
const worldMetadata = {
  id: 11,
  name: "Cosmic Space & Moon",
  themeName: "space",
  icon: "🌌",
  color: "purple",
  description: "Deep outer space and the Lunar Palace. Massive drops, alien snipers, and cosmic wisps!",
  rewardMultiplier: 5,
  bossName: "Giant Wisp & Lunar Goddess",
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
