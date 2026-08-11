import layout from './layout/index.js';

/**
 * Stage Metadata for World 2, Level 4 (Collapse Chamber)
 */
const stageMetadata = {
  stageInWorld: 4,
  title: "Collapse Chamber",
  description: "Chamber with unstable floors and goblin ambushes.",
  difficulty: "MEDIUM",
  diffClass: "bg-stone-200 text-stone-900 border-stone-400 font-mono",
  icon: "⚔️",
  color: "slate",
  borderHover: "hover:border-slate-500 hover:bg-slate-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
