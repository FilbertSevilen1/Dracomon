import layout from './layout/index.js';

/**
 * Stage Metadata for World 7, Level 1 (Lava Ridge)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Lava Ridge",
  description: "Outer mountain slopes with pools of liquid magma.",
  difficulty: "HARD",
  diffClass: "bg-amber-100 text-amber-800 border-amber-300 font-mono",
  icon: "🌋",
  color: "orange",
  borderHover: "hover:border-orange-500 hover:bg-orange-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
