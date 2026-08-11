import layout from './layout/index.js';

/**
 * Stage Metadata for World 8, Level 3 (Flame Core)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Flame Core",
  description: "Central energy grid with landmines and explosive traps.",
  difficulty: "NIGHTMARE",
  diffClass: "bg-rose-950 text-rose-100 border-rose-700 font-mono",
  icon: "⚡",
  color: "rose",
  borderHover: "hover:border-amber-500 hover:bg-amber-500/10",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
