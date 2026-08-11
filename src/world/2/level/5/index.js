import layout from './layout/index.js';

/**
 * Stage Metadata for World 2, Level 5 (Sanctum of the Fire Golem)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Sanctum of the Fire Golem",
  description: "Face the mighty Fire Golem in the central inner sanctum!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-slate-700 text-white font-black border-slate-500",
  icon: "🔥",
  color: "slate",
  borderHover: "hover:border-slate-500 hover:bg-slate-50/20 ring-2 ring-slate-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
