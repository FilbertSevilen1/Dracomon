import layout from './layout/index.js';

/**
 * Stage Metadata for World 4, Level 3 (Gloom Abyss)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Gloom Abyss",
  description: "Floating platforms above an infinite shadowy void.",
  difficulty: "HARD",
  diffClass: "bg-purple-950 text-purple-100 border-purple-700 font-mono",
  icon: "🕳️",
  color: "purple",
  borderHover: "hover:border-purple-500 hover:bg-purple-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
