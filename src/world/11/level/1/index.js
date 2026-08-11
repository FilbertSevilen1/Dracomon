import layout from './layout/index.js';

/**
 * Stage Metadata for World 11, Level 1 (Cosmic Boundary)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Cosmic Boundary",
  description: "Low gravity void with drifting antimatter fields.",
  difficulty: "COSMIC BULLET HELL",
  diffClass: "bg-purple-950 text-purple-200 border-purple-500 font-black",
  icon: "🪐",
  color: "purple",
  borderHover: "hover:border-purple-400 hover:bg-purple-500/10",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
