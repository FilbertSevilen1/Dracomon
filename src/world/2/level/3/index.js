import layout from './layout/index.js';

/**
 * Stage Metadata for World 2, Level 3 (Ancient Courtyard)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Ancient Courtyard",
  description: "Open ruins courtyard with airborne platforms and snipers.",
  difficulty: "MEDIUM",
  diffClass: "bg-stone-200 text-stone-900 border-stone-400 font-mono",
  icon: "🛡️",
  color: "slate",
  borderHover: "hover:border-slate-500 hover:bg-slate-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
