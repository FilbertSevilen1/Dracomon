import layout from './layout/index.js';

/**
 * Stage Metadata for World 1, Level 2 (Whispering Canopy)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Whispering Canopy",
  description: "Climb high tree branches and dodge wild slimes.",
  difficulty: "EASY",
  diffClass: "bg-emerald-100 text-emerald-800 border-emerald-300 font-mono",
  icon: "🍃",
  color: "emerald",
  borderHover: "hover:border-emerald-500 hover:bg-emerald-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
