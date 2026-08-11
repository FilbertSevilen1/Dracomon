import layout from './layout/index.js';

/**
 * Stage Metadata for World 3, Level 1 (Frost Pass)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Frost Pass",
  description: "Slippery mountain pass with ice hazards.",
  difficulty: "EASY",
  diffClass: "bg-sky-100 text-sky-800 border-sky-300 font-mono",
  icon: "🧊",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
