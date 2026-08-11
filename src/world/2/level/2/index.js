import layout from './layout/index.js';

/**
 * Stage Metadata for World 2, Level 2 (Stone Corridor)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Stone Corridor",
  description: "Tight corridors filled with stone archers and spikes.",
  difficulty: "EASY",
  diffClass: "bg-stone-100 text-stone-800 border-stone-300 font-mono",
  icon: "🧱",
  color: "slate",
  borderHover: "hover:border-slate-500 hover:bg-slate-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
