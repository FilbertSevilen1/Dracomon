import layout from './layout/index.js';

/**
 * Stage Metadata for World 3, Level 2 (Glacial Ridge)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Glacial Ridge",
  description: "High altitude frozen peaks with sharp icicles.",
  difficulty: "MEDIUM",
  diffClass: "bg-sky-200 text-sky-900 border-sky-400 font-mono",
  icon: "🏔️",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
