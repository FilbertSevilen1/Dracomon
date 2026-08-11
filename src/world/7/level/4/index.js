import layout from './layout/index.js';

/**
 * Stage Metadata for World 7, Level 4 (Fiery Cavern)
 */
const stageMetadata = {
  stageInWorld: 4,
  title: "Fiery Cavern",
  description: "Large cavern surrounded by boiling magma pools.",
  difficulty: "INSANE",
  diffClass: "bg-amber-300 text-amber-950 border-amber-500 font-mono",
  icon: "💥",
  color: "orange",
  borderHover: "hover:border-orange-500 hover:bg-orange-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
