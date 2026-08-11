import layout from './layout/index.js';

/**
 * Stage Metadata for World 12, Level 3 (Ghostly Grid)
 */
const stageMetadata = {
  stageInWorld: 3,
  title: "Ghostly Grid",
  description: "Phasing digital ghosts and aerial pixel dragons.",
  difficulty: "INSANE",
  diffClass: "bg-fuchsia-300 text-fuchsia-950 border-fuchsia-600 font-mono",
  icon: "👻",
  color: "fuchsia",
  borderHover: "hover:border-fuchsia-500 hover:bg-fuchsia-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
