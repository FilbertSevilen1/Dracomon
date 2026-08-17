import layout from './layout/index.js';

/**
 * Stage Metadata for World 13, Level 4 (Tomb of the Pharaohs)
 */
const stageMetadata = {
  stageInWorld: 4,
  title: "Tomb of the Pharaohs",
  description: "Ancient sandstone catacombs surrounded by vast quicksand pits and skeletal legions.",
  difficulty: "INSANE",
  diffClass: "bg-amber-400 text-amber-950 border-amber-700 font-mono",
  icon: "🏺",
  color: "amber",
  borderHover: "hover:border-amber-500 hover:bg-amber-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
