import layout from './layout/index.js';

/**
 * Stage Metadata for World 6, Level 5 (Abyss Sanctuary Lair)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Abyss Sanctuary Lair",
  description: "Face the mighty Killer Whale in the depths of the ocean!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-cyan-600 text-white font-black border-cyan-400",
  icon: "🐋",
  color: "cyan",
  borderHover: "hover:border-cyan-500 hover:bg-cyan-50/20 ring-2 ring-cyan-400/30",
  tileSize: 40,
  isUnderwater: true,
  layout
};

export { stageMetadata };
export default stageMetadata;
