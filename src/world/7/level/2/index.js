import layout from './layout/index.js';

/**
 * Stage Metadata for World 7, Level 2 (Basalt Path)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Basalt Path",
  description: "Jagged dark volcanic stone path above lava.",
  difficulty: "HARD",
  diffClass: "bg-amber-200 text-amber-900 border-amber-400 font-mono",
  icon: "🪨",
  color: "orange",
  borderHover: "hover:border-orange-500 hover:bg-orange-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
