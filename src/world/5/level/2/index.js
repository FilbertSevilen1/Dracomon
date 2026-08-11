import layout from './layout/index.js';

/**
 * Stage Metadata for World 5, Level 2 (Sacred Steps)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Sacred Steps",
  description: "Lightning strike zones along ancient stone steps.",
  difficulty: "HARD",
  diffClass: "bg-amber-200 text-amber-950 border-amber-500 font-mono",
  icon: "🌩️",
  color: "amber",
  borderHover: "hover:border-amber-500 hover:bg-amber-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
