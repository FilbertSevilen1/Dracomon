import layout from './layout/index.js';

/**
 * Stage Metadata for World 5, Level 3 (Thunder Hall)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Thunder Hall",
  description: "Vast hall with thunderbolts raining from above.",
  difficulty: "HARD",
  diffClass: "bg-amber-200 text-amber-950 border-amber-500 font-mono",
  icon: "⚡",
  color: "amber",
  borderHover: "hover:border-amber-500 hover:bg-amber-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
