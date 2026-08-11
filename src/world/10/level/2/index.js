import layout from './layout/index.js';

/**
 * Stage Metadata for World 10, Level 2 (Sky Passage)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Sky Passage",
  description: "High altitude wind currents and cloud trampolines.",
  difficulty: "HARD",
  diffClass: "bg-blue-200 text-blue-900 border-blue-400 font-mono",
  icon: "🌬️",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
