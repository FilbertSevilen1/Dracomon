import layout from './layout/index.js';

/**
 * Stage Metadata for World 7, Level 5 (Volcanic Peak Caldera)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Volcanic Peak Caldera",
  description: "Fight the fierce Magma Guard inside the volcano crater!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-orange-600 text-white font-black border-orange-400",
  icon: "👺",
  color: "orange",
  borderHover: "hover:border-orange-500 hover:bg-orange-50/20 ring-2 ring-orange-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
