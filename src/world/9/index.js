import level1 from './level/1/index.js';

/**
 * World 9 Metadata - Gladiator's Arena
 */
const worldMetadata = {
  id: 9,
  name: "Gladiator's Arena",
  themeName: "volcano",
  icon: "🛡️",
  color: "rose",
  description: "Roman Colosseum survival arena! Endless waves spawn for 3 full minutes.",
  rewardMultiplier: 3,
  bossName: "Immortal Gladiator Champion",
  totalStages: 1,
  levels: {
    1: level1
  }
};

export { worldMetadata };
export default worldMetadata;
