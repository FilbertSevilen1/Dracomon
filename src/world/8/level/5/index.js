import layout from './layout/index.js';

/**
 * Stage Metadata for World 8, Level 5 (Core Reactor Chamber)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Core Reactor Chamber",
  description: "Defeat the ancient Core Guardian before the core melts down!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-rose-600 text-white font-black border-rose-400",
  icon: "🤖",
  color: "rose",
  borderHover: "hover:border-amber-500 hover:bg-amber-500/10 ring-2 ring-amber-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
