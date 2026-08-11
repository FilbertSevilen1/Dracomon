import layout from './layout/index.js';

/**
 * Stage Metadata for World 7, Level 3 (Magma Tunnel)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Magma Tunnel",
  description: "Underground lava tubes with erupting fire columns.",
  difficulty: "INSANE",
  diffClass: "bg-amber-300 text-amber-950 border-amber-500 font-mono",
  icon: "🔥",
  color: "orange",
  borderHover: "hover:border-orange-500 hover:bg-orange-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
