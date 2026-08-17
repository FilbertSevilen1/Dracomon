import layout from './layout/index.js';

/**
 * Stage Metadata for World 13, Level 5 (Sanctum of the Living Pyramid)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Sanctum of the Living Pyramid",
  description: "Ancient sci-fi core where the Living Pyramid channels forgotten death lasers and sand vortexes!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-amber-700 text-white font-black border-amber-400",
  icon: "👑",
  color: "amber",
  borderHover: "hover:border-amber-500 hover:bg-amber-50/20 ring-2 ring-amber-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
