import layout from './layout/index.js';

/**
 * Stage Metadata for World 4, Level 2 (Soul Road)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Soul Road",
  description: "Path illuminated by eerie purple soul flames.",
  difficulty: "MEDIUM",
  diffClass: "bg-purple-900 text-purple-200 border-purple-600 font-mono",
  icon: "🔮",
  color: "purple",
  borderHover: "hover:border-purple-500 hover:bg-purple-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
