import layout from './layout/index.js';

/**
 * Stage Metadata for World 6, Level 1 (Sunken Coral Reefs)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Sunken Coral Reefs",
  description: "Shallow ocean reefs with swimming currents and pearls.",
  difficulty: "WATER PHYSICS",
  diffClass: "bg-cyan-100 text-cyan-900 border-cyan-300 font-mono",
  icon: "🪸",
  color: "cyan",
  borderHover: "hover:border-cyan-500 hover:bg-cyan-50/20",
  tileSize: 40,
  isUnderwater: true,
  layout
};

export { stageMetadata };
export default stageMetadata;
