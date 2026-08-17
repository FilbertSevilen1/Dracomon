import layout from './layout/index.js';

/**
 * Stage Metadata for World 13, Level 1 (Dune Encampment)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Dune Encampment",
  description: "Outer dunes where scorching sandstorms begin. Watch out for quicksand pits and skeletal patrols.",
  difficulty: "HARD",
  diffClass: "bg-amber-100 text-amber-950 border-amber-400 font-mono",
  icon: "🏜️",
  color: "amber",
  borderHover: "hover:border-amber-500 hover:bg-amber-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
