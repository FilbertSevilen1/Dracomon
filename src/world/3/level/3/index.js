import layout from './layout/index.js';

/**
 * Stage Metadata for World 3, Level 3 (Snow Cavern)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Snow Cavern",
  description: "Subterranean ice caves with crystal formations.",
  difficulty: "MEDIUM",
  diffClass: "bg-sky-200 text-sky-900 border-sky-400 font-mono",
  icon: "❄️",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
