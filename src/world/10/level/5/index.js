import layout from './layout/index.js';

/**
 * Stage Metadata for World 10, Level 5 (Heavens Apex Lair)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Heavens Apex Lair",
  description: "Banish the Demonic Grenadier from the top of the sky!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-sky-600 text-white font-black border-sky-400",
  icon: "💣",
  color: "sky",
  borderHover: "hover:border-sky-500 hover:bg-sky-50/20 ring-2 ring-sky-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
