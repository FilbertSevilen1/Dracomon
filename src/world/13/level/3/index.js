import layout from './layout/index.js';

/**
 * Stage Metadata for World 13, Level 3 (Valley of Needles)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Valley of Needles",
  description: "Deep desert canyon populated by dense cactus turrets and towering Pokeys.",
  difficulty: "VERY HARD",
  diffClass: "bg-amber-300 text-amber-950 border-amber-600 font-mono",
  icon: "🌵",
  color: "amber",
  borderHover: "hover:border-amber-500 hover:bg-amber-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
