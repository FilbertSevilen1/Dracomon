import layout from './layout/index.js';

/**
 * Stage Metadata for World 11, Level 3 (Lunar Approach)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Lunar Approach",
  description: "Approaching the glowing surface of the silver Moon.",
  difficulty: "LUNAR MAJESTY",
  diffClass: "bg-indigo-950 text-indigo-200 border-indigo-500 font-black",
  icon: "🌕",
  color: "indigo",
  borderHover: "hover:border-indigo-400 hover:bg-indigo-500/10",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
