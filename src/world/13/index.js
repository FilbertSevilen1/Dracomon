import level1 from './level/1/index.js';
import level2 from './level/2/index.js';
import level3 from './level/3/index.js';
import level4 from './level/4/index.js';
import level5 from './level/5/index.js';

/**
 * World 13 Metadata - Desert Oasis
 */
const worldMetadata = {
  id: 13,
  name: "Desert Oasis",
  themeName: "desert",
  icon: "🏜️",
  color: "amber",
  description: "Scorching dunes, hazardous quicksand pits, blinding sandstorms, and ancient robotic pyramid guardians.",
  rewardMultiplier: 6,
  bossName: "Living Pyramid",
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
