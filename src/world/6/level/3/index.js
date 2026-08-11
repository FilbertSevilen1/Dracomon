import layout from './layout/index.js';

/**
 * Stage Metadata for World 6, Level 3 (Anchor Ruins & Traps)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Anchor Ruins & Traps",
  description: "Sunken ship anchors and whirlpool trap hazards.",
  difficulty: "WATER PHYSICS",
  diffClass: "bg-cyan-200 text-cyan-950 border-cyan-400 font-mono",
  icon: "⚓",
  color: "cyan",
  borderHover: "hover:border-cyan-500 hover:bg-cyan-50/20",
  tileSize: 40,
  isUnderwater: true,
  layout
};

export { stageMetadata };
export default stageMetadata;
