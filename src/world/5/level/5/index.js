import layout from './layout/index.js';

/**
 * Stage Metadata for World 5, Level 5 (Celestial Dragon Shrine)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Celestial Dragon Shrine",
  description: "Slay the divine Primordial Dragon King at the altar!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-amber-600 text-white font-black border-amber-400",
  icon: "🐲",
  color: "amber",
  borderHover: "hover:border-amber-500 hover:bg-amber-50/20 ring-2 ring-amber-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
