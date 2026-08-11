import layout from './layout/index.js';

/**
 * Stage Metadata for World 4, Level 4 (Dark Corridor)
 */
const stageMetadata = {
  stageInWorld: 4,
  title: "Dark Corridor",
  description: "Labyrinthine passage with teleporting shadow monsters.",
  difficulty: "HARD",
  diffClass: "bg-purple-950 text-purple-100 border-purple-700 font-mono",
  icon: "👁️",
  color: "purple",
  borderHover: "hover:border-purple-500 hover:bg-purple-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
