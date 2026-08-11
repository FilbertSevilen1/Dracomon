import layout from './layout/index.js';

/**
 * Stage Metadata for World 5, Level 1 (Temple Entrance)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Temple Entrance",
  description: "Golden stairs leading to the celestial shrine.",
  difficulty: "MEDIUM",
  diffClass: "bg-amber-100 text-amber-900 border-amber-400 font-mono",
  icon: "🏛️",
  color: "amber",
  borderHover: "hover:border-amber-500 hover:bg-amber-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
