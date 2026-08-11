import layout from './layout/index.js';

/**
 * Stage Metadata for World 12, Level 1 (Pixel Outpost)
 */
const stageMetadata = {
  stageInWorld: 1,
  title: "Pixel Outpost",
  description: "Outer boundary of the 8-bit digital world with raining Tetris blocks.",
  difficulty: "RETRO HARD",
  diffClass: "bg-fuchsia-100 text-fuchsia-950 border-fuchsia-400 font-mono",
  icon: "👾",
  color: "fuchsia",
  borderHover: "hover:border-fuchsia-500 hover:bg-fuchsia-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
