import layout from './layout/index.js';

/**
 * Stage Metadata for World 13, Level 2 (Sunken Oasis)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Sunken Oasis",
  description: "Lush desert springs surrounded by treacherous sinking sands and boomerang skeletons.",
  difficulty: "HARD",
  diffClass: "bg-amber-200 text-amber-950 border-amber-500 font-mono",
  icon: "🌴",
  color: "amber",
  borderHover: "hover:border-amber-500 hover:bg-amber-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
