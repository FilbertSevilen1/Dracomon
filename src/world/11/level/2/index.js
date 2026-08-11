import layout from './layout/index.js';

/**
 * Stage Metadata for World 11, Level 2 (Asteroid Belt)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Asteroid Belt",
  description: "Dodging falling meteors and alien snipers.",
  difficulty: "COSMIC BULLET HELL",
  diffClass: "bg-purple-950 text-purple-200 border-purple-500 font-black",
  icon: "☄️",
  color: "purple",
  borderHover: "hover:border-purple-400 hover:bg-purple-500/10",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
