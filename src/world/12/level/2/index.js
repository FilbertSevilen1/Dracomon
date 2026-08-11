import layout from './layout/index.js';

/**
 * Stage Metadata for World 12, Level 2 (Tetris Corridor)
 */
const stageMetadata = {
  stageInWorld: 2,
  title: "Tetris Corridor",
  description: "Dense 8-bit block tunnels guarded by pixel ghosts.",
  difficulty: "RETRO HARD",
  diffClass: "bg-fuchsia-200 text-fuchsia-950 border-fuchsia-500 font-mono",
  icon: "🧱",
  color: "fuchsia",
  borderHover: "hover:border-fuchsia-500 hover:bg-fuchsia-50/20",
  tileSize: 40,
  layout
};

export { stageMetadata };
export default stageMetadata;
