import layout from './layout/index.js';

/**
 * Stage Metadata for World 6, Level 2 (Coral Passage)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Coral Passage",
  description: "Narrow aquatic tunnels guarded by razor shellfish.",
  difficulty: "WATER PHYSICS",
  diffClass: "bg-cyan-100 text-cyan-900 border-cyan-300 font-mono",
  icon: "🐠",
  color: "cyan",
  borderHover: "hover:border-cyan-500 hover:bg-cyan-50/20",
  tileSize: 40,
  isUnderwater: true,
  layout
};

export { stageMetadata };
export default stageMetadata;
