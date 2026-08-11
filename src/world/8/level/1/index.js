import layout from './layout/index.js';

/**
 * Stage Metadata for World 8, Level 1 (Subterranean Gate)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Subterranean Gate",
  description: "The deepest elevator shaft down to the core.",
  difficulty: "NIGHTMARE",
  diffClass: "bg-rose-900 text-rose-200 border-rose-600 font-mono",
  icon: "💣",
  color: "rose",
  borderHover: "hover:border-amber-500 hover:bg-amber-500/10",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
