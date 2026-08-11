import layout from './layout/index.js';

/**
 * Stage Metadata for World 10, Level 3 (Celestial Isle)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Celestial Isle",
  description: "Ancient sky sanctuary with floating islands.",
  difficulty: "INSANE",
  diffClass: "bg-blue-300 text-blue-950 border-blue-500 font-mono",
  icon: "🏝️",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
