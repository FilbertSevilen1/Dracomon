import layout from './layout/index.js';

/**
 * Stage Metadata for World 4, Level 1 (Nether Gate)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Nether Gate",
  description: "Entrance to the shadowy nether dimension.",
  difficulty: "MEDIUM",
  diffClass: "bg-purple-900 text-purple-200 border-purple-600 font-mono",
  icon: "🚪",
  color: "purple",
  borderHover: "hover:border-purple-500 hover:bg-purple-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
