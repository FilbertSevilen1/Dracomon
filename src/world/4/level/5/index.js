import layout from './layout/index.js';

/**
 * Stage Metadata for World 4, Level 5 (Shadow Abyss Throne)
 */
const stageMetadata = {
  stageInWorld: 5,
  title: "Shadow Abyss Throne",
  description: "Confront the Shadow Overlord in the heart of the void!",
  difficulty: "BOSS BATTLE",
  diffClass: "bg-purple-900 text-white font-black border-purple-500",
  icon: "😈",
  color: "purple",
  borderHover: "hover:border-purple-500 hover:bg-purple-50/20 ring-2 ring-purple-400/30",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
