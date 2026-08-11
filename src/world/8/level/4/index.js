import layout from './layout/index.js';

/**
 * Stage Metadata for World 8, Level 4 (Explosion Vault)
 */
const stageMetadata = {
  stageInWorld: 4,
  title: "Explosion Vault",
  description: "Deep vault where heat waves explode continuously.",
  difficulty: "NIGHTMARE",
  diffClass: "bg-rose-950 text-rose-100 border-rose-700 font-mono",
  icon: "☢️",
  color: "rose",
  borderHover: "hover:border-amber-500 hover:bg-amber-500/10",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
