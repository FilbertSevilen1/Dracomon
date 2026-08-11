import layout from './layout/index.js';

/**
 * Stage Metadata for World 1, Level 4 (Swamp Edge)
 */
const stageMetadata = {
  stageInWorld: 4,
  title: "Swamp Edge",
  description: "Moist ground near swamp waters with aggressive slime elite guards.",
  difficulty: "MEDIUM",
  diffClass: "bg-emerald-200 text-emerald-900 border-emerald-400 font-mono",
  icon: "🐸",
  color: "emerald",
  borderHover: "hover:border-emerald-500 hover:bg-emerald-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
