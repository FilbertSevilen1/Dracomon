import layout from './layout/index.js';

/**
 * Stage Metadata for World 10, Level 1 (High Clouds)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "High Clouds",
  description: "Floating white clouds above the world.",
  difficulty: "HARD",
  diffClass: "bg-blue-100 text-blue-800 border-blue-300 font-mono",
  icon: "☁️",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
