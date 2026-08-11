import layout from './layout/index.js';

/**
 * Stage Metadata for World 3, Level 4 (Frozen Fortress)
 */
const stageMetadata = {
  stageInWorld: 4,
  title: "Frozen Fortress",
  description: "Outer courtyard of the Frost Wyvern's icy citadel.",
  difficulty: "HARD",
  diffClass: "bg-sky-300 text-sky-950 border-sky-500 font-mono",
  icon: "🏰",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
