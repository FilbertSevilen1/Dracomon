import layout from './layout/index.js';

/**
 * Stage Metadata for World 1, Level 3 (Thicket Path)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Thicket Path",
  description: "Dense foliage requiring precise double jumps and coin collection.",
  difficulty: "EASY",
  diffClass: "bg-emerald-100 text-emerald-800 border-emerald-300 font-mono",
  icon: "🌿",
  color: "emerald",
  borderHover: "hover:border-emerald-500 hover:bg-emerald-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
