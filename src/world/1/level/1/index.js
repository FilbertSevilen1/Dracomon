import layout from './layout/index.js';

/**
 * Stage Metadata for World 1, Level 1 (Forest Fringe)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Forest Fringe",
  description: "Edge of the Whispering Woods with simple jumps and coin rewards.",
  difficulty: "EASY",
  diffClass: "bg-emerald-100 text-emerald-800 border-emerald-300 font-mono",
  icon: "🌱",
  color: "emerald",
  borderHover: "hover:border-emerald-500 hover:bg-emerald-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
