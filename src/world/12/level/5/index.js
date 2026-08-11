import layout from './layout/index.js';

/**
 * Stage Metadata for World 12, Level 5 (Blockman Citadel)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Blockman Citadel",
  description: "Confront the form-shifting Blockman boss at the digital core!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-fuchsia-700 text-white font-black border-fuchsia-400",
  icon: "👑",
  color: "fuchsia",
  borderHover: "hover:border-fuchsia-500 hover:bg-fuchsia-50/20 ring-2 ring-fuchsia-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
