import layout from './layout/index.js';

/**
 * Stage Metadata for World 1, Level 5 (Whispering Woods Core)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Whispering Woods Core",
  description: "The heart of the forest where the giant King Slime reigns supreme!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-emerald-600 text-white font-black border-emerald-400",
  icon: "👑",
  color: "emerald",
  borderHover: "hover:border-emerald-500 hover:bg-emerald-50/20 ring-2 ring-emerald-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
