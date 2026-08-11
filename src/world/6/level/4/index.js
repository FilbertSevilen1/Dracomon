import layout from './layout/index.js';

/**
 * Stage Metadata for World 6, Level 4 (Trench Channel)
 */
const stageMetadata = {
  stageInWorld: 4,
  title: "Trench Channel",
  description: "Dark ocean trench with pressurized currents.",
  difficulty: "WATER PHYSICS",
  diffClass: "bg-cyan-300 text-cyan-950 border-cyan-500 font-mono",
  icon: "🌊",
  color: "cyan",
  borderHover: "hover:border-cyan-500 hover:bg-cyan-50/20",
  tileSize: 40,
  isUnderwater: true,
  layout
};

export { stageMetadata };
export default stageMetadata;
