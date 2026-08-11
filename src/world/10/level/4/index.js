import layout from './layout/index.js';

/**
 * Stage Metadata for World 10, Level 4 (Wind Sanctuary)
 */
const stageMetadata = {
  stageInWorld: 4,
  title: "Wind Sanctuary",
  description: "High atmospheric winds and heavy artillery snipers.",
  difficulty: "INSANE",
  diffClass: "bg-blue-300 text-blue-950 border-blue-500 font-mono",
  icon: "🌪️",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
