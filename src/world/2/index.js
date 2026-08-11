import level1 from './level/1/index.js';
import level2 from './level/2/index.js';
import level3 from './level/3/index.js';
import level4 from './level/4/index.js';
import level5 from './level/5/index.js';

/**
 * World 2 Metadata - Mystic Ruins
 */
const worldMetadata = {
  id: 2,
  name: "Mystic Ruins",
  themeName: "ruins",
  icon: "🏛️",
  color: "slate",
  description: "Ancient stone colosseums, crumbling pillars, and goblin archer snipers.",
  rewardMultiplier: 1.2,
  bossName: "Fire Golem",
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
