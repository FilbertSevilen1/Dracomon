import layout from './layout/index.js';

/**
 * Stage Metadata for World 8, Level 2 (Magma Channel)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Magma Channel",
  description: "Intense radiation and magma blasts in narrow tunnels.",
  difficulty: "NIGHTMARE",
  diffClass: "bg-rose-900 text-rose-200 border-rose-600 font-mono",
  icon: "🔴",
  color: "rose",
  borderHover: "hover:border-amber-500 hover:bg-amber-500/10",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
