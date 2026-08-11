import layout from './layout/index.js';

/**
 * Stage Metadata for World 3, Level 5 (Frozen Citadel Summit)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Frozen Citadel Summit",
  description: "Challenge the terrifying Frost Wyvern atop the glacial citadel!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-sky-600 text-white font-black border-sky-400",
  icon: "🐉",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20 ring-2 ring-sky-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
