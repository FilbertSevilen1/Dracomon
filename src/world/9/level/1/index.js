import layout from './layout/index.js';

/**
 * Stage Metadata for World 9, Level 1 (Roman Colosseum Defense)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Roman Colosseum Defense",
  description: "Survive the 180s wave defense timer to spawn the Exit Portal!",
  difficulty: "SURVIVAL DEFENSE (3 MIN)",
  diffClass: "bg-rose-600 text-white font-black border-rose-400",
  icon: "🛡️",
  color: "rose",
  borderHover: "hover:border-rose-500 hover:bg-rose-500/10 ring-2 ring-rose-400/30",
  tileSize: 40,
  isSurvivalMode: true,
  survivalDuration: 180,
  layout
};

export { stageMetadata };
export default stageMetadata;
