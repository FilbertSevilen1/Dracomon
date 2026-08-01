import { PlayerStats, InventoryItem } from '../types/game';
import { LevelData, getLevel } from './LevelManager';
import { soundService } from '../services/sound';
import { stageGimmickManager } from './StageGimmickManager';

const HERO_PREVIEW_LEVEL: LevelData = {
  name: "Hero Preview Arena",
  tileSize: 40,
  theme: {
    type: "forest",
    skyColor: "#030712",
    solidColor: "#3b0764",
    platformColor: "#7e22ce",
    borderColor: "#581c87",
    bgGradient: "linear-gradient(to bottom, #02040a, #090514, #1e1b4b)",
    particleColor: "#c084fc"
  },
  grid: [
    "........................................",
    "........................................",
    "........................................",
    "........................................",
    "........................................",
    "........................................",
    "........................................",
    "........................................",
    "....@.......1.....1.....1...............",
    "########################################",
    "########################################"
  ],
  description: "Dedicated Hero Preview Map",
  difficulty: "PREVIEW",
  diffClass: "",
  boss: "None",
  icon: "✨",
  borderHover: "",
  color: "purple",
  worldId: 0,
  worldName: "Preview",
  stageInWorld: 1,
  totalStagesInWorld: 1,
  rewardMultiplier: 1.0,
  globalStageNum: 0
};
import {
  FT_CHANNEL_INTERRUPTED,
  FT_PORTAL_ENTERED,
  FT_EXIT_PORTAL_CLEARED,
  FT_DEFEAT_BOSS_FIRST,
  FT_FINAL_BOSS_SLAIN,
  FT_DOUBLE_JUMP_FIRE,
  FT_DOUBLE_JUMP_NATURE,
  FT_DOUBLE_JUMP_ICE,
  FT_FAST_PLUNGE,
  FT_SHIELD_CHARGE,
  FT_SHADOW_DASH,
  FT_GUST_PUSH_BACK,
  FT_MEGA_SPIN,
  FT_SHIELD_TRAMPLE_DASH,
  FT_BIRD_SUMMONED,
  FT_NOT_ENOUGH_ENERGY_30,
  FT_SHADOWRAZE,
  FT_HOMING_BOMB_ROCK,
  FT_ELECTROTACKLE,
  FT_SCHWARZSCHILD_PULSE,
  FT_MOONBEAM,
  FT_CHAOS_METEOR,
  FT_SUN_STRIKE,
  FT_TORNADO,
  FT_HEAL,
  FT_DAMAGE,
  FT_BLOCKED,
  FT_STUNNED,
  FT_ROOTED,
  FT_BOING,
  FT_BOUNCE_STRIKE,
  FT_FELL_VOID,
  FT_GROUND_SHOCKWAVE,
  FT_LANDMINE_DETONATED,
  FT_COIN_PICKUP,
  FT_POTION_PICKUP,
  FT_UPGRADE_STONE_PICKUP,
  FT_EXP_REWARD,
  FT_COIN_REWARD,
  FT_SKELETON_DESTROYED,
  FT_KING_KONG_SLAIN,
  FT_GIANT_WISP_SLAIN,
  FT_ULTIMATE_CINEMATIC,
  FT_AREA_KATANA_SLASH,
  FT_DIMENSIONAL_SHATTER,
  FT_SINGULARITY_DAMAGE,
  FT_PULSE_DAMAGE,
  FT_SUPERNOVA_DETONATION,
  FT_SUPERNOVA_EXPLOSION,
  FT_METEOR_IMPACT_ORANGE,
  FT_METEOR_IMPACT_RED,
  FT_SOLAR_EXPLOSION,
  FT_STUNNED_TORNADO,
  FT_LIFTED_TORNADO,
  FT_SOUL_WAVE_HIT,
  FT_ELECTRIC_EXPLOSION,
  FT_SHIELD_BURST,
  FT_TRAMPLED,
  FT_DARK_SOUL_STACK,
  FT_CHARGING_SOUL_BLAST,
  FT_DOUBLE_ARROW_RAIN,
  FT_SKYWARD_ARROW_SHOT,
  FT_HYPER_CHARGED_LASER,
  FT_BLACK_HOLE_SINGULARITY,
  FT_AVATAR_STATE,
  FT_METEOR_SMACKDOWN,
  FT_SINGLE_SLASH_OF_DEATH,
  FT_AEGIS_SHIELD_DOME,
  FT_RAIGEKI_THUNDERBOLTS,
  FT_TRIO_ORB_BLAST,
  FT_PRIMAL_ROAR,
  FT_LUNAR_ECLIPSE,
  FT_CHARGING_CARPET_BOMBING,
  FT_CARPET_BOMBING_FLAME,
  FT_ARENA_ERUPTED,
  FT_ARENA_SURVIVED,
  FT_REAPED_BY_DEATH,
  FT_THUNDERSTRUCK,
  FT_ABSOLUTE_FROZEN,
  FT_DISSOLVED_ANTIMATTER,
  FT_MOLTEN_LAVA_MELTED,
  FT_TOXIC_SWAMP,
  FT_WHIRLPOOL,
  FT_SHADOW_CLOUD_DAMAGE,
  FT_DISINTEGRATED_BONES,
  FT_ECLIPSE_MOONBEAM,
  FT_CELESTIAL_TICK,
  FT_ELECTROCUTED,
  FT_BURN,
  FT_LEVIATHAN_VORTEX,
  FT_HOMING_LASER,
  FT_STUNNED_2S,
  FT_GORILLA_LEAP,
  FT_SEISMIC_GROUND_SLAM,
  FT_GLADIATOR_RUSH_STUN,
  FT_SKELETON_REVIVED,
  FT_BIRD_DAMAGE,
  FT_NEED_ENERGY,
  FT_ULTIMATE_UNLOCK_LV5,
  FT_NO_ENEMIES_IN_RANGE,
  FT_GLADIATOR_RUSH,
  FT_IMMUNE_OUT_OF_RANGE,
  FT_AIR_DODGED_STUN,
  FT_BURN_EXPLOSION,
  FT_PRIMORDIAL_GOD_CONQUERED,
  FT_SOUL_BLAST_WAVES,
} from './FloatingTextMessages';

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  isUltimate?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isEnemy: boolean;
  damage: number;
  color: string;
  type: 'arrow' | 'fireball' | 'shield_wave' | 'bomb' | 'axe' | 'sonar' | 'meteor' | 'sun_strike' | 'tornado' | 'giant_cleave' | 'arcane_orb' | 'dark_energy' | 'homing_bomb' | 'wisp_orb';
  channelTimer?: number;
  targetX?: number;
  targetY?: number;
  hitEnemyIds?: number[];
  isHoming?: boolean;
  groundBurnOnImpact?: boolean;
}

interface Pickup {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'coin' | 'potion' | 'upgrade_stone';
  amount: number;
  collected: boolean;
}

interface GroundBurnZone {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  timer: number;
  duration: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  type: 'slime' | 'goblin_archer' | 'fire_golem' | 'miniboss' | 'king_slime' | 'frost_wyvern' | 'pixel_piranha' | 'pixel_ghost' | 'pixel_dragon' | 'blockman' | 'shadow_overlord' | 'dragon_king' | 'bomb_thrower' | 'flying_wyvern' | 'fish' | 'anchor' | 'scallop' | 'killer_whale' | 'skeleton_archer' | 'king_kong' | 'immortal_gladiator' | 'alien' | 'giant_wisp' | 'lunar_goddess';
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  facing: number;
  shootCooldown: number;
  state: 'patrol' | 'alert' | 'charge' | 'idle';
  animFrame: number;
  name?: string;
  stunnedTimer?: number;
  isSuspended?: boolean;
  suspendedTimer?: number;
  isBonePile?: boolean;
  respawnTimer?: number;
  hasRevived?: boolean;
  reviveCount?: number;
  jumpCooldown?: number;
  jumpCount?: number;
  isLeaping?: boolean;
  isImmortal?: boolean;
  stunTimer?: number;
  chargeCooldownTimer?: number;
  chargeTimer?: number;
  isCharging?: boolean;
  beamTimer?: number;
  beamTargetX?: number;
  beamTargetY?: number;
  beamEndX?: number;
  beamEndY?: number;
  beamBarrageActive?: boolean;
  damageAcc?: number;
  burnTimer?: number;
  burnLingerTimer?: number;
  burnTickTimer?: number;
  suckTimer?: number;
  suckCooldown?: number;
  wispOrbitAngle?: number;
  wispDetonating?: boolean;
  wispDetonationTimer?: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private level: LevelData;
  private selectedDraco: string;
  private stats: PlayerStats;
  private callbacks: {
    onCoinCollect: (amount: number) => void;
    onItemCollect: (itemId: string) => void;
    onEnemyDefeat: (exp: number, coins: number) => void;
    onHpChange: (hp: number, maxHp: number) => void;
    onEnergyChange?: (energy: number, maxEnergy: number) => void;
    onPauseToggle?: () => void;
    onStageClear: () => void;
    onPlayerDeath: () => void;
  };

  private animationFrameId: number | null = null;
  private lastTime = 0;
  private accumulator = 0;
  private isPaused = false;
  private targetFps = 60;
  private frameInterval = 1000 / 60;

  private px = 100;
  private py = 100;
  private pvx = 0;
  private pvy = 0;
  private pWidth = 32;
  private pHeight = 44;
  private pFacing = 1;
  private pGrounded = false;
  private pHP = 10;
  private pMaxHP = 10;
  private pInvulnerableFrames = 0;

  private jumpCount = 0;
  private maxJumps = 2;
  private isPlunging = false;
  public isMegaPixelmon: boolean = false;
  public megaPixelmonTimer: number = 0;
  public megaPixelmonScale: number = 1.0;
  private attackCooldown = 0;
  private specialCooldown = 0;
  private trampolineCooldown = 0;
  private shieldActive = false;
  private shieldDuration = 0;
  private isAttacking = false;
  private attackDuration = 0;

  private cameraX = 0;
  private cameraY = 0;

  private keys: { [key: string]: boolean } = {};

  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private pickups: Pickup[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];

  private pEnergy = 0;
  private energyRegenRate = 1.0;
  private ultimateCinematicActive = false;
  private ultimateCinematicDuration = 0;

  private arrowShowerActive = false;
  private arrowShowerDuration = 0;
  private avatarActive = false;
  private avatarDuration = 0;
  private laserBeamActive = false;
  private laserBeamDuration = 0;
  private flymonTornadoActive = false;
  private flymonTornadoX = 0;
  private flymonTornadoY = 0;
  private flymonTornadoTimer = 0;

  private cameraZoom = 1.0;
  private cameraZoomTargetX = 0;
  private cameraZoomTargetY = 0;

  private flymonLaserTargetEnemy: Enemy | null = null;
  private flymonLaserEndPos: { x: number; y: number } | null = null;

  private assassinmonUltimateActive = false;
  private assassinmonUltimateTimer = 0;
  private assassinmonTargetIndex = 0;
  private assassinmonTargets: Enemy[] = [];

  private assassinmonDashActive = false;
  private assassinmonDashTimer = 0;
  private shadowAfterimages: { x: number; y: number; facing: number; alpha: number }[] = [];

  private musouSlashActive = false;
  private musouSlashTimer = 0;
  private musouSlashX = 0;
  private musouSlashY = 0;
  private musouTargetId = 0;
  private musouOriginalPx = 0;
  private musouOriginalPy = 0;

  public isChanneling = false;
  public channelingSpell: string | null = null;
  public channelingTimer = 0;
  public channelingMaxDuration = 180;

  private jumpmonSpinActive = false;
  private jumpmonSpinTimer = 0;
  private jumpmonSpinAngle = 0;
  private jumpmonMeteorActive = false;
  private jumpmonMeteorState: 'idle' | 'charging' | 'plunging' | 'impact' = 'idle';
  private jumpmonMeteorTimer = 0;
  private jumpmonImpactTimer = 0;
  private jumpmonImpactX = 0;
  private jumpmonImpactY = 0;
  private screenShake = 0;

  private archermonUltActive = false;
  private archermonUltTimer = 0;

  private shieldmonDashActive = false;
  private shieldmonDashTimer = 0;
  private shieldmonChargeActive = false;
  private shieldmonChargeTimer = 0;
  private shieldmonUltCastX = 0;
  private shieldmonUltCastY = 0;
  private shieldmonUltRadius = 400;
  private shieldmonShieldY = 0;
  private shieldmonShieldTargetY = 0;
  private shieldmonUltDamageDealt = false;

  private magemonSpellIndex = 0;
  private magemonUltActive = false;
  private magemonUltTimer = 0;

  private thundermonDashActive = false;
  private thundermonDashTimer = 0;
  private thundermonChargeActive = false;
  private thundermonChargeTimer = 0;
  private thundermonUltActive = false;
  private thundermonUltTimer = 0;
  private raigekiTargets: { enemy: Enemy; strikeTimer: number; struck: boolean }[] = [];

  private isClimbing = false;
  private playerRootedTimer = 0;
  private skeletonDeathTimer = 0;
  private frozenDeathTimer = 0;
  private electrocutionDeathTimer = 0;
  private reaperDeathTimer = 0;
  private antimatterDeathTimer = 0;
  private shadowHazardCooldown = 0;
  private playerStunnedTimer = 0;
  private playerStunCooldown = 0;

  // Lunar beam gimmick state
  private lunarBeamTimer = 0;
  private lunarBeamStartX = 0;
  private lunarBeamStartY = 0;
  private lunarBeamEndX = 0;
  private lunarBeamEndY = 0;
  private lunarBeamAngle = 0;

  private gravity = 0.5;
  private friction = 0.82;
  private levelWidth = 800;
  private levelHeight = 600;
  private enemyIdCounter = 0;
  private gradientCache = new Map<string, CanvasGradient>();

  private currentSubMapIndex = 0;

  private birdActive = false;
  private birdX = 0;
  private birdY = 0;
  private birdVx = 0;
  private birdVy = 0;
  private birdState: 'idle' | 'swooping' | 'returning' = 'idle';
  private birdTargetEnemy: Enemy | null = null;
  private birdAttackCooldown = 0;
  private birdRampageTimer = 0;

  private frameCount = 0;
  private exitPortalActive = false;
  private exitPortalPos: { x: number; y: number } | null = null;

  private isSurvivalMode: boolean = false;
  private survivalTimer: number = 0;
  private survivalWaveTimer: number = 0;
  private arenaExploded: boolean = false;

  private shadowmonStacks: number = 0;
  private shadowmonUltActive: boolean = false;
  private shadowmonUltTimer: number = 0;
  private shadowmonUltStacksUsed: number = 0;
  private shadowmonSkillActive: boolean = false;
  private shadowmonSkillTimer: number = 0;
  private shadowmonSkillX: number = 0;
  private shadowmonSkillY: number = 0;
  private thundermonDashTrail: { x: number; y: number; facing: number; alpha: number }[] = [];

  private groundBurnZones: GroundBurnZone[] = [];
  private groundBurnIdCounter: number = 0;
  private carpetBombingActive: boolean = false;
  private carpetBombingTimer: number = 0;
  private carpetBombingChannelTimer: number = 0;
  private carpetBombingSpreadRadius: number = 0;
  private carpetBombingX: number = 0;
  private carpetBombingY: number = 0;
  private carpetBombingStartX: number = 0;
  private carpetBombingStartY: number = 0;
  private carpetBombingFireStreamTimer: number = 0;

  private lunarmonUltActive: boolean = false;
  private lunarmonUltPhase: 'cinematic' | 'bombarding' | 'jumping' | 'laser' = 'cinematic';
  private lunarmonUltTimer: number = 0;
  private lunarmonUltChannelTimer: number = 0;
  private lunarmonUltStartX: number = 0;
  private lunarmonUltStartY: number = 0;
  private lunarmonUltJumpY: number = 0;
  private lunarmonUltJumpProgress: number = 0;
  private lunarmonUltBeamAngle: number = Math.PI / 2; // Pointing downward
  private lunarmonTargets: { enemy: Enemy; strikeTimer: number; struck: boolean; beamTimer?: number; beamX?: number; beamY?: number }[] = [];
  private lunarmonSkillActive: boolean = false;
  private lunarmonSkillTimer: number = 0;
  private lunarmonSkillX: number = 0;
  private lunarmonSkillY: number = 0;

  private azuremonUltActive: boolean = false;
  private azuremonUltPhase: 'channeling' | 'beam' = 'channeling';
  private azuremonUltTimer: number = 0;
  private azuremonUltChannelTimer: number = 0;
  private azuremonUltStartX: number = 0;
  private azuremonUltStartY: number = 0;
  private azuremonUltBeamAngle: number = 0;
  private azuremonBlastCounters: Map<string, number> = new Map();
  private azuremonSkillActive: boolean = false;
  private azuremonSkillTimer: number = 0;

  private stageNum: number;
  private isDemoMode: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    stageNum: number,
    selectedDraco: string,
    stats: PlayerStats,
    callbacks: {
      onCoinCollect: (amount: number) => void;
      onItemCollect: (itemId: string) => void;
      onEnemyDefeat: (exp: number, coins: number) => void;
      onHpChange: (hp: number, maxHp: number) => void;
      onEnergyChange?: (energy: number, maxEnergy: number) => void;
      onPauseToggle?: () => void;
      onStageClear: () => void;
      onPlayerDeath: () => void;
    },
    isDemoMode = false
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;

    this.isDemoMode = isDemoMode;
    this.stageNum = stageNum;
    this.level = getLevel(stageNum);
    if (this.stageNum === 13) {
      this.gravity = 0.22;
    }
    this.selectedDraco = selectedDraco;
    this.stats = stats;
    this.callbacks = callbacks;

    this.pHP = isDemoMode ? 9999 : stats.hp;
    this.pMaxHP = isDemoMode ? 9999 : stats.hp;
    this.energyRegenRate = (stats as any).energyRegen || 1.0;
    this.pEnergy = this.getMaxEnergy();
    this.maxJumps = 2;

    this.initLevelEntities();
    this.setupInputListeners();

    this.lastTime = performance.now();
    this.run();

    this.callbacks.onHpChange(this.pHP, this.pMaxHP);
    this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());
  }

  public cancelChanneling(reason: string = 'Movement') {
    if (!this.isChanneling) return;
    this.isChanneling = false;

    if (this.channelingSpell === 'black_hole') {
      (this as any).enigmonBlackHoleActive = false;
      (this as any).enigmonBlackHoleTimer = 0;
      const _ftCI = FT_CHANNEL_INTERRUPTED(reason); this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, _ftCI.text, _ftCI.color);
      soundService.playHit();
    }

    this.channelingSpell = null;
    this.channelingTimer = 0;
  }

  private getActiveGrid(): string[] {
    if (this.level.maps && this.level.maps.length > 0) {
      const idx = Math.max(0, Math.min(this.level.maps.length - 1, this.currentSubMapIndex));
      return this.level.maps[idx].grid;
    }
    return this.level.grid || [];
  }

  private setGridTile(r: number, c: number, char: string) {
    const grid = this.getActiveGrid();
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[r].length) {
      grid[r] = grid[r].substring(0, c) + char + grid[r].substring(c + 1);
    }
  }

  private destroyPlatformsAbovePixelmon() {
    const grid = this.getActiveGrid();
    if (!grid || grid.length === 0) return;

    const ts = this.level.tileSize || 40;
    const scale = this.megaPixelmonScale || 3.0;

    // Horizontal span of giant Pixelmon feet/body
    const giantWidth = this.pWidth * scale;
    const centerX = this.px + this.pWidth / 2;
    const minX = centerX - giantWidth / 2 - 10;
    const maxX = centerX + giantWidth / 2 + 10;

    const startCol = Math.max(0, Math.floor(minX / ts));
    const endCol = Math.min((grid[0]?.length || 0) - 1, Math.floor(maxX / ts));

    // Vertical span from player head up to top of giant height
    const feetY = this.py + this.pHeight;
    const topY = feetY - (this.pHeight * scale) - 30; // 30px extra clearance above giant head

    const startRow = Math.max(0, Math.floor(topY / ts));
    const endRow = Math.min(grid.length - 1, Math.floor((this.py - 5) / ts));

    let destroyedCount = 0;

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        if (r >= 0 && r < grid.length && c >= 0 && c < grid[r].length) {
          const tile = grid[r][c];
          if (tile !== '.' && tile !== ' ') {
            this.setGridTile(r, c, '.');
            destroyedCount++;

            const tileCenterX = c * ts + ts / 2;
            const tileCenterY = r * ts + ts / 2;

            for (let p = 0; p < 5; p++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = Math.random() * 7 + 2;
              this.particles.push({
                x: tileCenterX,
                y: tileCenterY,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - 2,
                size: Math.random() * 7 + 3,
                color: p % 3 === 0 ? '#ec4899' : p % 3 === 1 ? '#a855f7' : '#e2e8f0',
                life: 25,
                maxLife: 25
              });
            }
          }
        }
      }
    }

    if (destroyedCount > 0) {
      soundService.playHit();
      this.screenShake = Math.max(this.screenShake, 25);
      this.addFloatingText(this.px + this.pWidth / 2, Math.max(20, topY + 10), '💥 PLATFORM CRUSHED!', '#f43f5e');
    }
  }

  private isEnemyInsideFrame(enemy: Enemy): boolean {
    if (!enemy || enemy.hp <= 0) return false;
    const cw = this.canvas ? this.canvas.width : 800;
    const ch = this.canvas ? this.canvas.height : 600;
    const sLeft = this.cameraX;
    const sRight = this.cameraX + cw;
    const sTop = this.cameraY;
    const sBottom = this.cameraY + ch;

    return (
      enemy.x + enemy.width > sLeft &&
      enemy.x < sRight &&
      enemy.y + enemy.height > sTop &&
      enemy.y < sBottom
    );
  }

  private initLevelEntities(preservePlayerPos = false) {
    this.level = getLevel(this.stageNum);
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.particles = [];
    this.floatingTexts = [];
    this.groundBurnZones = [];
    this.carpetBombingActive = false;
    stageGimmickManager.reset();
    this.gradientCache.clear();
    this.shadowHazardCooldown = 0;
    this.playerStunnedTimer = 0;
    this.playerStunCooldown = 0;

    const grid = this.getActiveGrid();
    let maxCols = 0;
    for (let r = 0; r < grid.length; r++) {
      maxCols = Math.max(maxCols, grid[r].length);
    }
    this.levelWidth = maxCols * this.level.tileSize;
    this.levelHeight = grid.length * this.level.tileSize;

    if (this.isDemoMode) {
      this.level = HERO_PREVIEW_LEVEL;
      const grid = HERO_PREVIEW_LEVEL.grid!;
      this.levelWidth = grid[0].length * this.level.tileSize;
      this.levelHeight = grid.length * this.level.tileSize;

      this.px = 80;
      this.py = 320; // Standing perfectly on solid ground row (y = 360)
      this.pHP = 9999;
      this.pMaxHP = 9999;
      this.pEnergy = this.getMaxEnergy();

      // Give Shadowmon 5 stacks in demo preview
      if (this.selectedDraco === 'Shadowmon') {
        this.shadowmonStacks = 5;
      }

      const positions = [220, 290, 360];
      this.enemies = positions.map((posX, idx) => ({
        id: 99991 + idx,
        x: posX,
        y: 328, // Standing perfectly on solid ground
        vx: 0,
        vy: 0,
        width: 38,
        height: 32,
        type: 'slime',
        hp: 999999999,
        maxHp: 999999999,
        attack: 0,
        defense: 5,
        facing: -1,
        shootCooldown: 0,
        state: 'idle',
        animFrame: 0,
        name: `IMMORTAL SLIME ${idx + 1} 👑`,
        isImmortal: true,
      }));
      return;
    }

    this.shadowmonStacks = 0;
    this.shadowmonUltActive = false;
    this.exitPortalActive = false;
    this.exitPortalPos = null;

    this.isSurvivalMode = !!this.level.isSurvivalMode;
    this.arenaExploded = false;
    if (this.isSurvivalMode) {
      const duration = this.level.survivalDuration || 180;
      this.survivalTimer = duration * 60;
      this.survivalWaveTimer = 60;
    } else {
      this.survivalTimer = 0;
      this.survivalWaveTimer = 0;
    }

    const ts = this.level.tileSize;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 'P') {
          this.exitPortalPos = { x: c * ts + ts / 2, y: r * ts + ts / 2 };
          break;
        }
      }
    }
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        const ex = c * ts;
        const ey = r * ts;

        if (char === '@' && !preservePlayerPos) {
          this.px = ex;
          this.py = ey + ts - this.pHeight;
        } else if (char === 'c') {
          this.pickups.push({ x: ex + 12, y: ey + 12, width: 16, height: 16, type: 'coin', amount: 5, collected: false });
        } else if (char === 'p') {
          this.pickups.push({ x: ex + 10, y: ey + 10, width: 20, height: 20, type: 'potion', amount: 1, collected: false });
        } else if (char === 'u') {
          this.pickups.push({ x: ex + 10, y: ey + 10, width: 20, height: 20, type: 'upgrade_stone', amount: 1, collected: false });
        } else if (char === 'F') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex,
            y: ey,
            vx: -2.0,
            vy: 0,
            width: 34,
            height: 28,
            type: 'flying_wyvern',
            hp: 15,
            maxHp: 15,
            attack: 4,
            defense: 1,
            facing: -1,
            shootCooldown: 0,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === 'f') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex,
            y: ey,
            vx: -2.2,
            vy: 0,
            width: 32,
            height: 22,
            type: 'fish',
            hp: 12,
            maxHp: 12,
            attack: 3,
            defense: 1,
            facing: -1,
            shootCooldown: 0,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === 'A') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex,
            y: ey,
            vx: 0,
            vy: 2.0,
            width: 64,
            height: 80,
            type: 'anchor',
            hp: 999,
            maxHp: 999,
            attack: 10,
            defense: 99,
            facing: 1,
            shootCooldown: 0,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === 'C') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 32,
            vx: 0,
            vy: 0,
            width: 36,
            height: 32,
            type: 'scallop',
            hp: 40,
            maxHp: 40,
            attack: 9999,
            defense: 10,
            facing: 1,
            shootCooldown: 0,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === 'K') {
          if (this.level.isUnderwater) {
            this.enemies.push({
              id: this.enemyIdCounter++,
              x: ex,
              y: ey,
              vx: -3.0,
              vy: 0,
              width: 80,
              height: 50,
              type: 'killer_whale',
              hp: 950,
              maxHp: 950,
              attack: 22,
              defense: 12,
              facing: -1,
              shootCooldown: 60,
              state: 'patrol',
              animFrame: 0,
              name: 'Leviathan Orca',
              suckCooldown: 240,
              suckTimer: 0,
            });
          } else {
            this.enemies.push({
              id: this.enemyIdCounter++,
              x: ex,
              y: ey - 24,
              vx: -2.5,
              vy: 0,
              width: 76,
              height: 64,
              type: 'king_kong',
              hp: 160,
              maxHp: 160,
              attack: 10,
              defense: 5,
              facing: -1,
              shootCooldown: 90,
              state: 'patrol',
              animFrame: 0,
              name: 'Primordial King Kong',
            });
          }
        } else if (char === '1') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 4,
            y: ey + ts - 24,
            vx: -1.2,
            vy: 0,
            width: 32,
            height: 24,
            type: 'slime',
            hp: 8 + (grid.length * 2),
            maxHp: 8 + (grid.length * 2),
            attack: 2,
            defense: 1,
            facing: -1,
            shootCooldown: 0,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === '2') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 6,
            y: ey + ts - 36,
            vx: 0,
            vy: 0,
            width: 28,
            height: 36,
            type: 'goblin_archer',
            hp: 12 + (grid.length * 3),
            maxHp: 12 + (grid.length * 3),
            attack: 3,
            defense: 1,
            facing: -1,
            shootCooldown: 80,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === '3') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 44,
            vx: -0.8,
            vy: 0,
            width: 36,
            height: 44,
            type: 'fire_golem',
            hp: 30,
            maxHp: 30,
            attack: 5,
            defense: 4,
            facing: -1,
            shootCooldown: 0,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === '4') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 4,
            y: ey + ts - 36,
            vx: -0.5,
            vy: 0,
            width: 32,
            height: 36,
            type: 'bomb_thrower' as any,
            hp: 40 + (grid.length * 4),
            maxHp: 40 + (grid.length * 4),
            attack: 12,
            defense: 6,
            facing: -1,
            shootCooldown: 120,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === 'S') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 48,
            vx: -0.6,
            vy: 0,
            width: 60,
            height: 48,
            type: 'king_slime',
            hp: 250,
            maxHp: 250,
            attack: 10,
            defense: 5,
            facing: -1,
            shootCooldown: 90,
            state: 'patrol',
            animFrame: 0,
            name: 'King Slime Lord'
          });
        } else if (char === 'B') {
          const isStage2 = this.level.name.includes('Stage 2');
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 64,
            vx: -0.5,
            vy: 0,
            width: 56,
            height: 64,
            type: 'miniboss',
            hp: isStage2 ? 350 : 500,
            maxHp: isStage2 ? 350 : 500,
            attack: isStage2 ? 8 : 17,
            defense: isStage2 ? 6 : 9,
            facing: -1,
            shootCooldown: 100,
            state: 'patrol',
            animFrame: 0,
            name: isStage2 ? 'Sentinel Archdemon' : 'Dracoguard Fire Lord'
          });
        } else if (char === 'W') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 60,
            vx: -0.6,
            vy: 0,
            width: 68,
            height: 60,
            type: 'frost_wyvern',
            hp: 800,
            maxHp: 800,
            attack: 16,
            defense: 6,
            facing: -1,
            shootCooldown: 80,
            state: 'patrol',
            animFrame: 0,
            name: 'Frostbite Wyvern'
          });
        } else if (char === 'O') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 68,
            vx: -0.7,
            vy: 0,
            width: 72,
            height: 68,
            type: 'shadow_overlord',
            hp: 1200,
            maxHp: 1200,
            attack: 28,
            defense: 16,
            facing: -1,
            shootCooldown: 70,
            state: 'patrol',
            animFrame: 0,
            name: 'Shadow Overlord'
          });
        } else if (char === 'D') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 80,
            vx: -0.8,
            vy: 0,
            width: 88,
            height: 80,
            type: 'dragon_king',
            hp: 1400,
            maxHp: 1400,
            attack: 30,
            defense: 22,
            facing: -1,
            shootCooldown: 90,
            state: 'patrol',
            animFrame: 0,
            name: 'PRIMORDIAL DRAGON KING'
          });
        } else if (char === 's') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 4,
            y: ey + ts - 38,
            vx: 0,
            vy: 0,
            width: 32,
            height: 38,
            type: 'skeleton_archer',
            hp: 50,
            maxHp: 50,
            attack: 12,
            defense: 6,
            facing: -1,
            shootCooldown: 60,
            state: 'patrol',
            animFrame: 0,
            name: 'Skeleton Archer',
            isBonePile: false,
            respawnTimer: 0,
            hasRevived: false
          });
        } else if (char === 'K') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 86,
            vx: -0.9,
            vy: 0,
            width: 86,
            height: 86,
            type: 'king_kong',
            hp: 2000,
            maxHp: 2000,
            attack: 42,
            defense: 30,
            facing: -1,
            shootCooldown: 120,
            state: 'patrol',
            animFrame: 0,
            name: 'PRIMORDIAL KING KONG',
            jumpCooldown: 120,
            jumpCount: 0,
            isLeaping: false
          });
        } else if (char === 'a') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 4,
            y: ey + ts - 40,
            vx: -0.6,
            vy: 0,
            width: 36,
            height: 40,
            type: 'alien' as any,
            hp: 80,
            maxHp: 80,
            attack: 14,
            defense: 5,
            facing: -1,
            shootCooldown: 180,
            state: 'patrol',
            animFrame: 0,
            name: 'Alien Laser Sniper',
          });
        } else if (char === 'G') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 0,
            y: ey - 50,
            vx: -0.7,
            vy: 0,
            width: 90,
            height: 90,
            type: 'giant_wisp' as any,
            hp: 2200,
            maxHp: 2200,
            attack: 38,
            defense: 22,
            facing: -1,
            shootCooldown: 90,
            state: 'patrol',
            animFrame: 0,
            name: 'GIANT WISP OVERLORD',
            wispOrbitAngle: 0,
            wispDetonating: false,
            wispDetonationTimer: 0,
          });
        } else if (char === 'L') {
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 80,
            vx: -0.5,
            vy: 0,
            width: 72,
            height: 80,
            type: 'lunar_goddess',
            hp: 2600,
            maxHp: 2600,
            attack: 50,
            defense: 25,
            facing: -1,
            shootCooldown: 80,
            state: 'patrol',
            animFrame: 0,
            name: 'LUNAR GODDESS',
            beamTimer: 0,
            beamTargetX: 0,
            beamTargetY: 0,
            beamEndX: 0,
            beamEndY: 0,
            beamBarrageActive: false
          });
        }
      }
    }

    const isFinalStage = this.level.stageInWorld === this.level.totalStagesInWorld;
    if (!isFinalStage) {
      this.enemies = this.enemies.filter(e => !this.isBossType(e.type));
    }

    // Enable exit portal immediately if there is no boss or miniboss on the map
    const hasBossOrMiniboss = this.enemies.some(e => this.isBossType(e.type));
    if (!hasBossOrMiniboss && !this.isSurvivalMode) {
      this.exitPortalActive = true;
    }
  }

  private setupInputListeners() {
    if (this.isDemoMode) return;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleBlur = () => {
    this.keys = {};
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.keys = {};
    } else {
      this.lastTime = performance.now();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    this.keys[key] = true;

    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      const isDead = this.pHP <= 0;
      if (!isDead) {
        this.callbacks.onPauseToggle?.();
      }
    } else if (e.key === ' ') {
      this.triggerUltimate();
    } else if (key === 'w' || e.key === 'ArrowUp') {
      this.jump();
    }
    if (key === 'j' || key === 'z') {
      this.performAttack();
    }
    if (key === 'k' || key === 'x' || key === 'shift') {
      this.performSpecial();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    this.keys[key] = false;
  };

  public triggerAction(action: 'left' | 'right' | 'jump' | 'attack' | 'special' | 'ultimate' | 'down') {
    if (action === 'left') {
      this.keys['a'] = true;
      this.keys['d'] = false;
    } else if (action === 'right') {
      this.keys['d'] = true;
      this.keys['a'] = false;
    } else if (action === 'jump') {
      this.jump();
    } else if (action === 'attack') {
      this.performAttack();
    } else if (action === 'special') {
      this.performSpecial();
    } else if (action === 'ultimate') {
      this.triggerUltimate();
    } else if (action === 'down') {
      this.keys['s'] = true;
    }
  }

  public stopAction(action: 'left' | 'right' | 'down') {
    if (action === 'left') this.keys['a'] = false;
    if (action === 'right') this.keys['d'] = false;
    if (action === 'down') this.keys['s'] = false;
  }

  private jump() {
    if (this.isPaused || this.pHP <= 0) return;

    if (this.isChanneling) {
      this.cancelChanneling('Jump');
    }

    const pxMid = this.px + this.pWidth / 2;
    const pyMid = this.py + this.pHeight / 2;

    if (this.isMapPortal(pxMid, pyMid)) {
      soundService.playLevelUp();
      if (this.level.maps && this.level.maps.length > 0) {
        this.currentSubMapIndex = (this.currentSubMapIndex + 1) % this.level.maps.length;
        this.initLevelEntities();
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_PORTAL_ENTERED.text, FT_PORTAL_ENTERED.color);
      }
      return;
    }

    if (this.exitPortalPos) {
      const dx = pxMid - this.exitPortalPos.x;
      const dy = pyMid - this.exitPortalPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 40) {
        if (this.exitPortalActive) {
          soundService.playLevelUp();
          this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_EXIT_PORTAL_CLEARED.text, FT_EXIT_PORTAL_CLEARED.color);
          this.callbacks.onStageClear();
          this.isPaused = true;
          return;
        } else {
          if (this.frameCount % 45 === 0) {
            this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_DEFEAT_BOSS_FIRST.text, FT_DEFEAT_BOSS_FIRST.color);
          }
        }
      }
    }

    if (this.level.isUnderwater) {
      const effectiveJump = Math.min(14, Math.max(10, this.stats.jump));
      this.pvy = -Math.min(7, effectiveJump * 0.48);
      this.pGrounded = false;
      this.isPlunging = false;
      soundService.playJump();
      this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight, 6, '#38bdf8');
      return;
    }

    const effectiveJump = Math.min(14, Math.max(10, this.stats.jump));

    if (this.pGrounded) {
      this.pvy = -Math.min(14, effectiveJump * 0.95);
      this.pGrounded = false;
      this.jumpCount = 1;
      this.isPlunging = false;
      soundService.playJump();
      this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight, 8);
    } else if (this.jumpCount < this.maxJumps) {
      this.pvy = -Math.min(14, effectiveJump * 0.98);
      this.jumpCount = 2;
      this.isPlunging = false;
      soundService.playJump();

      if (this.selectedDraco === 'Jumpmon') {
        this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight / 2, 12, '#f59e0b');
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_DOUBLE_JUMP_FIRE.text, FT_DOUBLE_JUMP_FIRE.color);
      } else if (this.selectedDraco === 'Archermon') {
        this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight / 2, 10, '#34d399');
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_DOUBLE_JUMP_NATURE.text, FT_DOUBLE_JUMP_NATURE.color);
      } else {
        this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight / 2, 10, '#60a5fa');
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_DOUBLE_JUMP_ICE.text, FT_DOUBLE_JUMP_ICE.color);
      }
    } else if (this.selectedDraco === 'Jumpmon' && !this.pGrounded && !this.isPlunging) {
      this.isPlunging = true;
      this.pvy = 16;
      soundService.playHit();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_FAST_PLUNGE.text, FT_FAST_PLUNGE.color);
    }
  }

  private performAttack() {
    if (this.isPaused || this.pHP <= 0 || this.attackCooldown > 0) return;

    this.isAttacking = true;
    this.attackDuration = 10;
    this.attackCooldown = 22;

    const slashX = this.px + (this.pFacing === 1 ? this.pWidth + 10 : -10);
    const slashY = this.py + this.pHeight / 2;

    if (this.selectedDraco === 'Archermon') {
      soundService.playShoot();
      const arrowVx = this.pFacing * (this.stats.speed + 6);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 16,
        y: this.py + this.pHeight / 2 - 3,
        vx: arrowVx,
        vy: 0,
        width: 16,
        height: 6,
        isEnemy: false,
        damage: this.stats.attack,
        color: '#10b981',
        type: 'arrow',
        rangeCap: 600,
        startX: this.px
      } as any);
      this.spawnDustParticles(slashX, slashY, 5, '#34d399');
    } else if (this.selectedDraco === 'Pixelmon') {
      soundService.playShoot();
      const shapes = ['I', 'L', 'T', 'O', 'Z'];
      const colors = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#06b6d4'];

      if (this.isMegaPixelmon) {
        // Mega Basic Attack: throw MANY tetris blocks in random directions including front!
        this.attackCooldown = 12;
        const numBlocks = 9;
        for (let b = 0; b < numBlocks; b++) {
          const spread = (Math.random() - 0.5) * 1.6;
          const baseAngle = this.pFacing === 1 ? 0 : Math.PI;
          const angle = baseAngle + spread;
          const spd = this.stats.speed + 8 + Math.random() * 6;
          const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
          const chosenColor = colors[Math.floor(Math.random() * colors.length)];
          this.projectiles.push({
            x: this.px + this.pWidth / 2,
            y: this.py + this.pHeight / 2,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            width: 26,
            height: 26,
            isEnemy: false,
            damage: Math.floor(this.stats.attack * 1.8),
            color: chosenColor,
            type: 'tetris_block' as any,
            rangeCap: 800,
            startX: this.px,
            shape: chosenShape
          } as any);
        }
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, 'TETRIS BARRAGE!', '#ec4899');
      } else {
        // Normal Basic Attack: throw a random Tetris block forward!
        this.attackCooldown = 18;
        const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];
        const tetrisVx = this.pFacing * (this.stats.speed + 8);
        this.projectiles.push({
          x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 20,
          y: this.py + this.pHeight / 2 - 8,
          vx: tetrisVx,
          vy: 0,
          width: 20,
          height: 20,
          isEnemy: false,
          damage: Math.floor(this.stats.attack * 1.25),
          color: chosenColor,
          type: 'tetris_block' as any,
          rangeCap: 600,
          startX: this.px,
          shape: chosenShape
        } as any);
      }
    } else if (this.selectedDraco === 'Shieldmon') {
      soundService.playHit();

      this.pvx += this.pFacing * 4;
      // Melee reach doubled: width 72 (from 36)
      this.checkMeleeHit(this.px + (this.pFacing === 1 ? this.pWidth : -48), this.py - 4, 72, this.pHeight + 8, this.stats.attack, true);
      this.spawnDustParticles(slashX, slashY, 8, '#60a5fa');
    } else if (this.selectedDraco === 'Assassinmon') {
      soundService.playHit();

      this.pvx += this.pFacing * 2.5;
      // Melee reach doubled: extra width +80 (from +40)
      this.checkMeleeHit(this.px - 32, this.py - 12, this.pWidth + 80, this.pHeight + 24, this.stats.attack, true);
      this.spawnDustParticles(slashX, slashY, 8, '#c084fc');

      for (let k = 0; k < 5; k++) {
        this.particles.push({
          x: slashX,
          y: slashY + (Math.random() - 0.5) * 20,
          vx: this.pFacing * (Math.random() * 4 + 2),
          vy: (Math.random() - 0.5) * 3,
          size: Math.random() * 3 + 2,
          color: '#ffffff',
          life: 12,
          maxLife: 12
        });
      }
      this.attackCooldown = 14;
    } else if (this.selectedDraco === 'Flymon') {
      soundService.playShoot();

      const arrowVx = this.pFacing * (this.stats.speed + 7);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 16,
        y: this.py + this.pHeight / 2 - 2,
        vx: arrowVx,
        vy: 0,
        width: 14,
        height: 4,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 0.95),
        color: '#f43f5e',
        type: 'arrow',
        rangeCap: 600,
        startX: this.px
      } as any);
      this.spawnDustParticles(slashX, slashY, 4, '#fda4af');
    } else if (this.selectedDraco === 'Whitemon') {
      soundService.playShoot();

      const axeVx = this.pFacing * 6.5;
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 16,
        y: this.py + this.pHeight / 2 - 6,
        vx: axeVx,
        vy: 0.35,
        width: 20,
        height: 20,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 1.15),
        color: '#e2e8f0',
        type: 'axe',
        rangeCap: 600,
        startX: this.px
      } as any);
      this.attackCooldown = 22;
      this.spawnDustParticles(slashX, slashY, 6, '#e2e8f0');
    } else if (this.selectedDraco === 'Magemon') {
      soundService.playShoot();

      const orbVx = this.pFacing * (this.stats.speed + 6);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 16,
        y: this.py + this.pHeight / 2 - 4,
        vx: orbVx,
        vy: 0,
        width: 16,
        height: 16,
        isEnemy: false,
        damage: this.stats.attack,
        color: '#a855f7',
        type: 'arcane_orb',
        rangeCap: 600,
        startX: this.px
      } as any);
      this.spawnDustParticles(slashX, slashY, 6, '#c084fc');
      // Arcane burst ring on orb spawn
      for (let p = 0; p < 10; p++) {
        const ang = (p / 10) * Math.PI * 2;
        this.particles.push({
          x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 16,
          y: this.py + this.pHeight / 2 - 4,
          vx: Math.cos(ang) * (Math.random() * 4 + 2),
          vy: Math.sin(ang) * (Math.random() * 4 + 2),
          size: Math.random() * 4 + 2,
          color: p % 2 === 0 ? '#a855f7' : '#e879f9',
          life: 12,
          maxLife: 12
        });
      }
    } else if (this.selectedDraco === 'Shadowmon') {
      soundService.playShoot();

      const darkVx = this.pFacing * (this.stats.speed + 7);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 20,
        y: this.py + this.pHeight / 2 - 5,
        vx: darkVx,
        vy: 0,
        width: 20,
        height: 14,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 1.1),
        color: '#ef4444',
        type: 'dark_energy' as any,
        isBasic: true,
        rangeCap: 600,
        startX: this.px
      } as any);
      this.spawnDustParticles(slashX, slashY, 8, '#ef4444');
    } else if (this.selectedDraco === 'Bombamon') {
      soundService.playShoot();

      const fireVx = this.pFacing * (this.stats.speed + 7);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 22,
        y: this.py + this.pHeight / 2 - 8,
        vx: fireVx,
        vy: 0,
        width: 22,
        height: 16,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 1.15),
        color: '#f97316',
        type: 'fireball',
        rangeCap: 600,
        startX: this.px
      } as any);

      for (let p = 0; p < 8; p++) {
        this.particles.push({
          x: slashX,
          y: slashY + (Math.random() - 0.5) * 12,
          vx: this.pFacing * (Math.random() * 5 + 3),
          vy: (Math.random() - 0.5) * 3,
          size: Math.random() * 5 + 3,
          color: p % 2 === 0 ? '#f97316' : '#fef08a',
          life: 14,
          maxLife: 14
        });
      }
    } else if (this.selectedDraco === 'Thundermon') {
      soundService.playShoot();

      this.attackDuration = 10;
      this.attackCooldown = 18;
      const ballX = this.px + (this.pFacing === 1 ? this.pWidth + 32 : -48);
      const ballY = this.py + this.pHeight / 2;

      // Melee reach doubled: radius 130 (from 65)
      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        const dist = Math.hypot((enemy.x + enemy.width / 2) - ballX, (enemy.y + enemy.height / 2) - ballY);
        if (dist < 130) {
          this.damageEnemy(enemy, Math.floor(this.stats.attack * 1.25));
          this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12, '#06b6d4');
        }
      });

      for (let p = 0; p < 12; p++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 5 + 2;
        this.particles.push({
          x: ballX,
          y: ballY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 5 + 2,
          color: p % 2 === 0 ? '#06b6d4' : '#facc15',
          life: 16,
          maxLife: 16
        });
      }
    } else if (this.selectedDraco === 'Enigmon') {
      soundService.playShoot();
      const darkVx = this.pFacing * (this.stats.speed + 8);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 18,
        y: this.py + this.pHeight / 2 - 6,
        vx: darkVx,
        vy: 0,
        width: 18,
        height: 18,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 1.15),
        color: '#c084fc',
        type: 'dark_matter' as any,
        rangeCap: 600,
        startX: this.px
      } as any);

      for (let p = 0; p < 8; p++) {
        this.particles.push({
          x: slashX,
          y: slashY + (Math.random() - 0.5) * 12,
          vx: this.pFacing * (Math.random() * 4 + 2),
          vy: (Math.random() - 0.5) * 3,
          size: Math.random() * 4 + 2,
          color: p % 2 === 0 ? '#c084fc' : '#e879f9',
          life: 14,
          maxLife: 14
        });
      }
    } else if (this.selectedDraco === 'Lunarmon') {
      soundService.playShoot();
      const beamVx = this.pFacing * (this.stats.speed + 8);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 22,
        y: this.py + this.pHeight / 2 - 6,
        vx: beamVx,
        vy: 0,
        width: 22,
        height: 12,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 1.15),
        color: '#93c5fd',
        type: 'crescent_beam' as any,
        rangeCap: 600,
        startX: this.px
      } as any);

      for (let p = 0; p < 8; p++) {
        this.particles.push({
          x: slashX,
          y: slashY + (Math.random() - 0.5) * 10,
          vx: this.pFacing * (Math.random() * 4 + 2),
          vy: (Math.random() - 0.5) * 3,
          size: Math.random() * 4 + 2,
          color: p % 2 === 0 ? '#93c5fd' : '#c7d2fe',
          life: 14,
          maxLife: 14
        });
      }
    } else if (this.selectedDraco === 'Pixelmon') {
      soundService.playShoot();
      const shapes = ['I', 'L', 'T', 'O', 'Z'];
      const colors = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#06b6d4'];
      const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];

      if (this.isMegaPixelmon) {
        for (let s = 0; s < 3; s++) {
          const angle = (this.pFacing === 1 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.2;
          const pVx = Math.cos(angle) * (this.stats.speed + 10);
          const pVy = Math.sin(angle) * (this.stats.speed + 10);
          this.projectiles.push({
            x: this.px + this.pWidth / 2,
            y: this.py + this.pHeight / 2,
            vx: pVx,
            vy: pVy,
            width: 24,
            height: 24,
            isEnemy: false,
            damage: Math.floor(this.stats.attack * 1.6),
            color: chosenColor,
            type: 'tetris_block' as any,
            rangeCap: 800,
            startX: this.px,
            shape: chosenShape
          } as any);
        }
      } else {
        const tetrisVx = this.pFacing * (this.stats.speed + 8);
        this.projectiles.push({
          x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 20,
          y: this.py + this.pHeight / 2 - 8,
          vx: tetrisVx,
          vy: 0,
          width: 20,
          height: 20,
          isEnemy: false,
          damage: Math.floor(this.stats.attack * 1.25),
          color: chosenColor,
          type: 'tetris_block' as any,
          rangeCap: 600,
          startX: this.px,
          shape: chosenShape
        } as any);
      }
    } else if (this.selectedDraco === 'Azuremon') {
      soundService.playShoot();
      const beamVx = this.pFacing * (this.stats.speed + 9);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 26,
        y: this.py + this.pHeight / 2 - 5,
        vx: beamVx,
        vy: 0,
        width: 26,
        height: 10,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 1.1),
        color: '#38bdf8',
        type: 'azure_mini_beam' as any,
        rangeCap: 800,
        startX: this.px
      } as any);

      for (let p = 0; p < 8; p++) {
        this.particles.push({
          x: slashX,
          y: slashY + (Math.random() - 0.5) * 10,
          vx: this.pFacing * (Math.random() * 4 + 2),
          vy: (Math.random() - 0.5) * 3,
          size: Math.random() * 4 + 2,
          color: p % 2 === 0 ? '#38bdf8' : '#e0f2fe',
          life: 14,
          maxLife: 14
        });
      }
    } else {
      soundService.playHit();
      // Default / Jumpmon melee reach doubled: extra width +48 (from +24)
      this.checkMeleeHit(this.px - 24, this.py - 16, this.pWidth + 48, this.pHeight + 32, this.stats.attack, true);
      this.spawnDustParticles(slashX, slashY, 10, '#fbbf24');
    }
  }

  private performSpecial() {
    if (this.isPaused || this.pHP <= 0 || this.specialCooldown > 0) return;

    if (this.selectedDraco === 'Shieldmon') {
      soundService.playBlock();
      this.shieldActive = true;
      this.shieldDuration = 120;
      this.specialCooldown = 300;

      this.pvx = this.pFacing * 14;
      this.checkMeleeHit(this.px - 20, this.py, this.pWidth + 60, this.pHeight, this.stats.attack * 2.0);
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_SHIELD_CHARGE.text, FT_SHIELD_CHARGE.color);

      for (let i = 0; i < 15; i++) {
        this.particles.push({
          x: this.px + this.pWidth / 2,
          y: this.py + this.pHeight / 2,
          vx: -this.pFacing * (Math.random() * 4 + 2),
          vy: Math.random() * 4 - 2,
          size: Math.random() * 5 + 3,
          color: '#60a5fa',
          life: 20,
          maxLife: 20
        });
      }
    } else if (this.selectedDraco === 'Assassinmon') {
      soundService.playJump();
      this.specialCooldown = 180;
      this.pInvulnerableFrames = 35;
      this.assassinmonDashActive = true;
      this.assassinmonDashTimer = 16;
      this.pvx = this.pFacing * 20;
      this.pvy = 0;

      this.checkMeleeHit(this.px - 30, this.py - 10, this.pWidth + 140, this.pHeight + 20, Math.floor(this.stats.attack * 2.4));
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_SHADOW_DASH.text, FT_SHADOW_DASH.color);

      for (let i = 0; i < 18; i++) {
        this.particles.push({
          x: this.px + Math.random() * this.pWidth,
          y: this.py + Math.random() * this.pHeight,
          vx: -this.pFacing * (Math.random() * 6 + 2),
          vy: (Math.random() - 0.5) * 4,
          size: Math.random() * 6 + 2,
          color: i % 2 === 0 ? '#a855f7' : '#c084fc',
          life: 22,
          maxLife: 22
        });
      }
    } else if (this.selectedDraco === 'Flymon') {
      soundService.playJump();
      this.pvy = -10;
      this.pGrounded = false;
      this.specialCooldown = 150;

      const gustDamage = Math.floor(this.stats.attack * 1.8);
      const waveSpeed = this.stats.speed + 7;

      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        const dx = enemy.x - this.px;
        if ((this.pFacing === 1 && dx > -20 && dx < 320) || (this.pFacing === -1 && dx < 20 && dx > -320)) {
          if (Math.abs(this.py - enemy.y) < 120) {
            this.damageEnemy(enemy, gustDamage);
            enemy.vx = this.pFacing * 4.5;
            enemy.vy = -2.5;
            this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 14, '#fda4af');
            this.addFloatingText(enemy.x, enemy.y - 15, FT_GUST_PUSH_BACK.text, FT_GUST_PUSH_BACK.color);
          }
        }
      });

      [-0.12, 0, 0.12].forEach(angle => {
        this.projectiles.push({
          x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 24,
          y: this.py + this.pHeight / 2 - 12,
          vx: this.pFacing * waveSpeed * Math.cos(angle),
          vy: waveSpeed * Math.sin(angle),
          width: 24,
          height: 24,
          isEnemy: false,
          damage: gustDamage,
          color: '#fda4af',
          type: 'tornado'
        });
      });

      for (let p = 0; p < 18; p++) {
        this.particles.push({
          x: this.px + (this.pFacing === 1 ? this.pWidth : 0),
          y: this.py + Math.random() * this.pHeight,
          vx: this.pFacing * (Math.random() * 8 + 4),
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 6 + 3,
          color: p % 2 === 0 ? '#fda4af' : '#ffffff',
          life: 20,
          maxLife: 20
        });
      }
    } else if (this.selectedDraco === 'Jumpmon') {
      soundService.playJump();
      this.jumpmonSpinActive = true;
      this.jumpmonSpinTimer = 25;
      this.jumpmonSpinAngle = 0;
      this.pvy = -this.stats.jump * 1.4;
      this.pGrounded = false;
      this.specialCooldown = 180;
      this.isAttacking = true;
      this.attackDuration = 25;
      this.checkMeleeHit(this.px - 30, this.py - 30, this.pWidth + 60, this.pHeight + 60, Math.floor(this.stats.attack * 1.6));
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_MEGA_SPIN.text, FT_MEGA_SPIN.color);

      for (let p = 0; p < 16; p++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 6 + 2;
        this.particles.push({
          x: this.px + this.pWidth / 2,
          y: this.py + this.pHeight / 2,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 6 + 3,
          color: p % 2 === 0 ? '#fbbf24' : '#f97316',
          life: 20,
          maxLife: 20
        });
      }
    } else if (this.selectedDraco === 'Shieldmon') {
      soundService.playHit();
      this.specialCooldown = 180;
      this.shieldmonDashActive = true;
      this.shieldmonDashTimer = 22;
      this.pvx = this.pFacing * 24.0;
      this.pInvulnerableFrames = 24;

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, FT_SHIELD_TRAMPLE_DASH.text, FT_SHIELD_TRAMPLE_DASH.color);
      this.screenShake = 18;
      (this as any).shieldmonDashHitIds = new Set();
    } else if (this.selectedDraco === 'Archermon') {
      soundService.playShoot();
      this.specialCooldown = 240;
      const angles = [-0.15, 0, 0.15];
      const arrowSpeed = this.stats.speed + 5;
      angles.forEach(angle => {
        this.projectiles.push({
          x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 16,
          y: this.py + this.pHeight / 2 - 3,
          vx: this.pFacing * arrowSpeed * Math.cos(angle),
          vy: arrowSpeed * Math.sin(angle),
          width: 16,
          height: 6,
          isEnemy: false,
          damage: Math.floor(this.stats.attack * 0.8),
          color: '#fb7185',
          type: 'arrow'
        });
      });
    } else if (this.selectedDraco === 'Whitemon') {
      soundService.playJump();
      this.specialCooldown = 120;
      this.birdActive = true;
      this.birdX = this.px;
      this.birdY = this.py - 40;
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_BIRD_SUMMONED.text, FT_BIRD_SUMMONED.color);
      for (let i = 0; i < 10; i++) {
        this.particles.push({
          x: this.px + Math.random() * 20 - 10,
          y: this.py - 30,
          vx: Math.random() * 4 - 2,
          vy: Math.random() * 4 - 2,
          size: Math.random() * 4 + 2,
          color: '#38bdf8',
          life: 20,
          maxLife: 20
        });
      }
    } else if (this.selectedDraco === 'Magemon') {
      if (this.pEnergy < 30) {
        soundService.playHit();
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_NOT_ENOUGH_ENERGY_30.text, FT_NOT_ENOUGH_ENERGY_30.color);
        return;
      }

      this.pEnergy = Math.max(0, this.pEnergy - 30);
      this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());

      soundService.playShoot();
      this.specialCooldown = 60;

      const spellTypeMap = [2, 1, 0];
      const targetSpellType = spellTypeMap[this.magemonSpellIndex];
      this.castMagemonSpell(targetSpellType);

      this.magemonSpellIndex = (this.magemonSpellIndex + 1) % 3;
    } else if (this.selectedDraco === 'Shadowmon') {
      this.specialCooldown = 150;
      const maxRange = 600;
      let nearestEnemy: Enemy | null = null;
      let minDistance = 9999;
      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        const dist = Math.abs(enemy.x - this.px);
        if (dist < minDistance && dist <= maxRange) {
          minDistance = dist;
          nearestEnemy = enemy;
        }
      });

      const rawTargetX = nearestEnemy ? (nearestEnemy as Enemy).x + (nearestEnemy as Enemy).width / 2 : this.px + (this.pFacing * 250);

      const targetX = Math.max(this.px - maxRange, Math.min(this.px + maxRange, rawTargetX));
      const targetY = nearestEnemy ? (nearestEnemy as Enemy).y + (nearestEnemy as Enemy).height / 2 : this.py + this.pHeight / 2;

      soundService.playHit();
      this.screenShake = 42;
      this.addFloatingText(targetX, targetY - 44, FT_SHADOWRAZE.text, FT_SHADOWRAZE.color);

      this.shadowmonSkillActive = true;
      this.shadowmonSkillTimer = 35;
      this.shadowmonSkillX = targetX;
      this.shadowmonSkillY = targetY;

      this.enemies.forEach(enemy => {
        if (enemy.hp > 0) {
          const dist = Math.hypot(enemy.x + enemy.width / 2 - targetX, enemy.y + enemy.height / 2 - targetY);
          if (dist < 100) {
            this.damageEnemy(enemy, Math.floor(this.stats.attack * 2.8));
            enemy.vx = (enemy.x > targetX ? 1 : -1) * 6.5;
            enemy.vy = -7.0;
          }
        }
      });

      // Void shard burst — upward-biased shards
      for (let i = 0; i < 52; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 14 + 3;
        const isShard = i < 18;
        this.particles.push({
          x: targetX + (Math.random() - 0.5) * 30,
          y: targetY + (Math.random() - 0.5) * 20,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - (isShard ? 6 : 2),
          size: isShard ? Math.random() * 5 + 3 : Math.random() * 11 + 4,
          color: i % 4 === 0 ? '#ef4444' : i % 4 === 1 ? '#9f1239' : i % 4 === 2 ? '#18181b' : '#7f1d1d',
          life: isShard ? 28 + Math.floor(Math.random() * 14) : 22,
          maxLife: isShard ? 42 : 22
        });
      }
      // Dark tendril pillars shooting upward from centre
      for (let t = 0; t < 7; t++) {
        const offset = (t - 3) * 14;
        this.particles.push({
          x: targetX + offset,
          y: targetY,
          vx: (Math.random() - 0.5) * 2,
          vy: -(8 + Math.random() * 10),
          size: Math.random() * 9 + 5,
          color: t % 2 === 0 ? '#6b21a8' : '#18181b',
          life: 30,
          maxLife: 30
        });
      }

      // Lingering scorch zone (dark_energy projectile)
      const razeProj = {
        x: targetX - 55,
        y: targetY - 55,
        vx: 0,
        vy: 0,
        width: 110,
        height: 110,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 1.5),
        color: '#ef4444',
        type: 'dark_energy' as any,
        life: 14,
        isShadowraze: true,
        birthFrame: this.frameCount
      };
      this.projectiles.push(razeProj as any);
    } else if (this.selectedDraco === 'Bombamon') {
      soundService.playShoot();
      this.specialCooldown = 180;
      const rockVx = this.pFacing * 8.5;
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 24,
        y: this.py + this.pHeight / 2 - 12,
        vx: rockVx,
        vy: -3.5,
        width: 24,
        height: 24,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 2.4),
        color: '#78350f',
        type: 'homing_bomb' as any,
        isHoming: true,
        groundBurnOnImpact: true
      } as any);
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_HOMING_BOMB_ROCK.text, FT_HOMING_BOMB_ROCK.color);

      for (let p = 0; p < 12; p++) {
        this.particles.push({
          x: this.px + this.pWidth / 2,
          y: this.py + this.pHeight / 2,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 5 + 3,
          color: p % 2 === 0 ? '#ea580c' : '#f59e0b',
          life: 16,
          maxLife: 16
        });
      }
    } else if (this.selectedDraco === 'Thundermon') {
      soundService.playJump();
      this.specialCooldown = 180;
      this.pInvulnerableFrames = 25;
      this.thundermonDashActive = true;
      this.thundermonDashTimer = 18;

      const playerCenterX = this.px + this.pWidth / 2;
      const playerCenterY = this.py + this.pHeight / 2;
      const ts = this.level.tileSize;

      const isPathBlocked = (x1: number, y1: number, x2: number, y2: number): boolean => {
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.max(3, Math.floor(dist / 16));
        const grid = this.getActiveGrid();
        if (!grid || grid.length === 0) return false;

        const enemyRow = Math.floor(y2 / ts);
        const enemyCol = Math.floor(x2 / ts);

        for (let i = 1; i < steps; i++) {
          const t = i / steps;
          const cx = x1 + (x2 - x1) * t;
          const cy = y1 + (y2 - y1) * t;
          const r = Math.floor(cy / ts);
          const c = Math.floor(cx / ts);

          if (r >= 0 && r < grid.length && c >= 0 && c < (grid[0]?.length || 0)) {
            if (r === enemyRow && c === enemyCol) continue;
            const tile = grid[r][c];
            if (tile === '#' || tile === '=') {
              return true;
            }
          }
        }
        return false;
      };

      let targetEnemy: Enemy | null = null;
      let minDistance = 9999;

      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;
        const dist = Math.hypot(enemyCenterX - playerCenterX, enemyCenterY - playerCenterY);

        if (dist <= 800 && dist < minDistance) {
          if (!isPathBlocked(playerCenterX, playerCenterY, enemyCenterX, enemyCenterY)) {
            minDistance = dist;
            targetEnemy = enemy;
          }
        }
      });

      const dashDir = targetEnemy ? (((targetEnemy as Enemy).x + (targetEnemy as Enemy).width / 2) > playerCenterX ? 1 : -1) : this.pFacing;
      this.pFacing = dashDir;

      if (targetEnemy) {
        const dx = ((targetEnemy as Enemy).x + (targetEnemy as Enemy).width / 2) - playerCenterX;
        const dy = ((targetEnemy as Enemy).y + (targetEnemy as Enemy).height / 2) - playerCenterY;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          this.pvx = (dx / dist) * 22.0;
          this.pvy = (dy / dist) * 12.0;
        }
      } else {
        this.pvx = dashDir * 22.0;
      }

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_ELECTROTACKLE.text, FT_ELECTROTACKLE.color);

      this.groundBurnZones.push({
        id: this.groundBurnIdCounter++,
        x: this.px + (dashDir === 1 ? -30 : -80),
        y: this.py + this.pHeight - 6,
        width: 110,
        height: 16,
        timer: 240,
        duration: 240,
        isElectric: true
      } as any);

      this.checkMeleeHit(this.px - 20, this.py - 10, this.pWidth + 100, this.pHeight + 20, Math.floor(this.stats.attack * 2.6));

      for (let p = 0; p < 22; p++) {
        this.particles.push({
          x: this.px + Math.random() * this.pWidth,
          y: this.py + Math.random() * this.pHeight,
          vx: -dashDir * (Math.random() * 8 + 3),
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 6 + 3,
          color: p % 2 === 0 ? '#06b6d4' : '#facc15',
          life: 20,
          maxLife: 20
        });
      }
    } else if (this.selectedDraco === 'Enigmon') {
      soundService.playJump();
      this.specialCooldown = 300;

      let targetX = this.px + this.pFacing * 600;
      let targetY = this.py + this.pHeight - 10;

      let nearestEnemy: Enemy | null = null;
      let minDistance = 600;
      const pxMid = this.px + this.pWidth / 2;
      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        const dist = Math.abs((enemy.x + enemy.width / 2) - pxMid);
        if (dist <= minDistance) {
          minDistance = dist;
          nearestEnemy = enemy;
        }
      });

      if (nearestEnemy) {
        targetX = (nearestEnemy as Enemy).x + (nearestEnemy as Enemy).width / 2;
        targetY = (nearestEnemy as Enemy).y + (nearestEnemy as Enemy).height - 10;
      }

      (this as any).enigmonPulseActive = true;
      (this as any).enigmonPulseTimer = 180;
      (this as any).enigmonPulseX = targetX;
      (this as any).enigmonPulseY = targetY;

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_SCHWARZSCHILD_PULSE.text, FT_SCHWARZSCHILD_PULSE.color);

      // Schwarzschild activation — ring implosion burst
      for (let p = 0; p < 40; p++) {
        const ang = (p / 40) * Math.PI * 2 + Math.random() * 0.18;
        const startR = 160 + Math.random() * 40;
        const spd = 5 + Math.random() * 6;
        this.particles.push({
          x: targetX + Math.cos(ang) * startR,
          y: targetY + Math.sin(ang) * startR * 0.2,
          vx: -Math.cos(ang) * spd,
          vy: -Math.sin(ang) * spd * 0.2,
          size: Math.random() * 6 + 2,
          color: p % 3 === 0 ? '#e879f9' : p % 3 === 1 ? '#c084fc' : '#7c3aed',
          life: 20 + Math.floor(Math.random() * 10),
          maxLife: 30
        });
      }
    } else if (this.selectedDraco === 'Lunarmon') {
      soundService.playShoot();
      this.specialCooldown = 240;

      const pxMid = this.px + this.pWidth / 2;
      let targetEnemy: Enemy | null = null;
      let minDistance = 800;

      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        const dist = Math.hypot((enemy.x + enemy.width / 2) - pxMid, (enemy.y + enemy.height / 2) - (this.py + this.pHeight / 2));
        if (dist <= minDistance) {
          minDistance = dist;
          targetEnemy = enemy;
        }
      });

      const strikeX = targetEnemy ? (targetEnemy as Enemy).x + (targetEnemy as Enemy).width / 2 : this.px + this.pFacing * 250;
      const strikeY = targetEnemy ? (targetEnemy as Enemy).y + (targetEnemy as Enemy).height : this.py + this.pHeight;

      if (targetEnemy) {
        this.damageEnemy(targetEnemy, Math.floor(this.stats.attack * 2.2));
        (targetEnemy as Enemy).stunnedTimer = 30; // mini stun 0.5s
      }

      // Activate 24-frame (0.4s) high-quality animated vertical Moonbeam pillar
      this.lunarmonSkillActive = true;
      this.lunarmonSkillTimer = 24;
      this.lunarmonSkillX = strikeX;
      this.lunarmonSkillY = strikeY;

      // Gain 25 energy
      this.pEnergy = Math.min(this.getMaxEnergy(), this.pEnergy + 25);
      if (this.callbacks.onEnergyChange) {
        this.callbacks.onEnergyChange(this.pEnergy, this.getMaxEnergy());
      }

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_MOONBEAM.text, FT_MOONBEAM.color);

      // Burst particle explosion at Moonbeam impact ground
      for (let p = 0; p < 45; p++) {
        const pAng = Math.random() * Math.PI * 2;
        const pSpd = Math.random() * 7 + 2;
        this.particles.push({
          x: strikeX + (Math.random() - 0.5) * 30,
          y: strikeY - Math.random() * 40,
          vx: Math.cos(pAng) * pSpd,
          vy: Math.sin(pAng) * pSpd - 2,
          size: Math.random() * 6 + 2,
          color: p % 3 === 0 ? '#ffffff' : p % 3 === 1 ? '#93c5fd' : '#e0e7ff',
          life: 22,
          maxLife: 22
        });
      }
    } else if (this.selectedDraco === 'Azuremon') {
      soundService.playShoot();
      this.specialCooldown = 240;

      const ballVx = this.pFacing * (this.stats.speed + 5);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 32,
        y: this.py + this.pHeight / 2 - 16,
        vx: ballVx,
        vy: 0,
        width: 32,
        height: 32,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 2.2),
        color: '#38bdf8',
        type: 'azure_vortex_ball' as any,
        rangeCap: 1000,
        startX: this.px
      } as any);

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, '🌀 AZURE SINGULARITY VORTEX!', '#38bdf8');
    } else if (this.selectedDraco === 'Pixelmon') {
      soundService.playShoot();
      if (this.isMegaPixelmon) {
        // Mega Special Skill: summon 8-bit giant sword to slash enemy 200px left to right!
        this.specialCooldown = 35;
        const swordVx = this.pFacing * 12;
        const swordX = this.pFacing === 1 ? this.px + this.pWidth : this.px - 200;
        this.projectiles.push({
          x: swordX,
          y: this.py + this.pHeight / 2 - 25,
          vx: swordVx,
          vy: 0,
          width: 200,
          height: 50,
          isEnemy: false,
          damage: Math.floor(this.stats.attack * 4.2),
          color: '#f43f5e',
          type: 'pixel_sword' as any,
          rangeCap: 400,
          startX: this.px
        } as any);

        const hitX = this.pFacing === 1 ? this.px : this.px - 200;
        this.checkMeleeHit(hitX, this.py - 40, 200, 140, Math.floor(this.stats.attack * 4.2));
        this.screenShake = 30;
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, '⚔️ 200PX PIXEL SWORD SLASH!', '#f43f5e');
      } else {
        // Normal Special Skill: summon big pacman that strikes enemies in the front!
        this.specialCooldown = 90;
        const pacmanVx = this.pFacing * (this.stats.speed + 9);
        const pacmanW = 54;
        const pacmanH = 54;
        this.projectiles.push({
          x: this.pFacing === 1 ? this.px + this.pWidth : this.px - pacmanW,
          y: this.py + this.pHeight / 2 - pacmanH / 2,
          vx: pacmanVx,
          vy: 0,
          width: pacmanW,
          height: pacmanH,
          isEnemy: false,
          damage: Math.floor(this.stats.attack * 2.8),
          color: '#eab308',
          type: 'pacman' as any,
          rangeCap: 800,
          startX: this.px
        } as any);
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, '🟡 BIG PACMAN CHARGE!', '#eab308');
      }
    }
  }

  private castMagemonSpell(spellType: number) {
    let nearestEnemy: Enemy | null = null;
    let minDistance = 9999;
    this.enemies.forEach(enemy => {
      if (enemy.hp <= 0) return;
      const dist = Math.abs(enemy.x - this.px);
      if (dist < minDistance && dist < 750) {
        minDistance = dist;
        nearestEnemy = enemy;
      }
    });

    const fallbackTargetX = this.px + (this.pFacing === 1 ? this.pWidth + 200 : -200);

    if (spellType === 0) {
      const targetX = nearestEnemy ? (nearestEnemy as Enemy).x + (nearestEnemy as Enemy).width / 2 : fallbackTargetX;
      const targetY = nearestEnemy ? (nearestEnemy as Enemy).y : this.py;
      const startX = targetX - (this.pFacing * 100);
      const startY = Math.max(20, targetY - 160);

      this.projectiles.push({
        x: startX,
        y: startY,
        vx: this.pFacing * 5.0,
        vy: 6.0,
        width: 40,
        height: 40,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 2.6),
        color: '#f97316',
        type: 'meteor'
      });
      // Meteor summoning sparks
      for (let mp = 0; mp < 18; mp++) {
        const mang = Math.random() * Math.PI * 2;
        const mspd = Math.random() * 6 + 2;
        this.particles.push({
          x: startX + (Math.random() - 0.5) * 24,
          y: startY + (Math.random() - 0.5) * 24,
          vx: Math.cos(mang) * mspd,
          vy: Math.sin(mang) * mspd,
          size: Math.random() * 6 + 3,
          color: mp % 3 === 0 ? '#f97316' : mp % 3 === 1 ? '#fef08a' : '#ef4444',
          life: 18,
          maxLife: 18
        });
      }
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_CHAOS_METEOR.text, FT_CHAOS_METEOR.color);
    } else if (spellType === 1) {
      const targetX = nearestEnemy ? (nearestEnemy as Enemy).x + (nearestEnemy as Enemy).width / 2 : fallbackTargetX;
      const targetY = nearestEnemy ? (nearestEnemy as Enemy).y : this.py;
      this.castSunStrikeAt(targetX, targetY);
      // Sun strike golden halo
      for (let hp = 0; hp < 20; hp++) {
        const hang = (hp / 20) * Math.PI * 2;
        this.particles.push({
          x: targetX + Math.cos(hang) * 30,
          y: (targetY || this.py) + Math.sin(hang) * 30,
          vx: Math.cos(hang) * (3 + Math.random() * 3),
          vy: Math.sin(hang) * (3 + Math.random() * 3) - 2,
          size: Math.random() * 5 + 2,
          color: hp % 2 === 0 ? '#f59e0b' : '#fef08a',
          life: 20,
          maxLife: 20
        });
      }
    } else {
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 40,
        y: this.py - 10,
        vx: this.pFacing * 6.5,
        vy: 0,
        width: 40,
        height: 64,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 2.2),
        color: '#06b6d4',
        type: 'tornado',
        hitEnemyIds: []
      });
      // Tornado spawn swirl
      for (let tp = 0; tp < 16; tp++) {
        const tang = (tp / 16) * Math.PI * 2;
        this.particles.push({
          x: (this.pFacing === 1 ? this.px + this.pWidth : this.px - 40) + Math.cos(tang) * 20,
          y: this.py + Math.sin(tang) * 20,
          vx: Math.cos(tang) * (3 + Math.random() * 2),
          vy: Math.sin(tang) * (3 + Math.random() * 2) - 1,
          size: Math.random() * 5 + 2,
          color: tp % 2 === 0 ? '#06b6d4' : '#38bdf8',
          life: 16,
          maxLife: 16
        });
      }
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_TORNADO.text, FT_TORNADO.color);
    }
  }

  private castSunStrikeAt(targetX: number, targetY?: number) {
    soundService.playShoot();
    this.projectiles.push({
      x: targetX - 26,
      y: 0,
      vx: 0,
      vy: 0,
      width: 52,
      height: this.canvas.height,
      isEnemy: false,
      damage: Math.floor(this.stats.attack * 3.5),
      color: '#f59e0b',
      type: 'sun_strike',
      channelTimer: 45,
      targetX: targetX
    });
    this.addFloatingText(targetX - 20, (targetY || this.py) - 15, FT_SUN_STRIKE.text, FT_SUN_STRIKE.color);
  }

  private checkMeleeHit(x: number, y: number, w: number, h: number, damage: number, stopOnFirstHit = false) {
    if (stopOnFirstHit) {
      for (const enemy of this.enemies) {
        if (
          x < enemy.x + enemy.width &&
          x + w > enemy.x &&
          y < enemy.y + enemy.height &&
          y + h > enemy.y
        ) {
          this.damageEnemy(enemy, damage);
          break;
        }
      }
    } else {
      this.enemies.forEach(enemy => {
        if (
          x < enemy.x + enemy.width &&
          x + w > enemy.x &&
          y < enemy.y + enemy.height &&
          y + h > enemy.y
        ) {
          this.damageEnemy(enemy, damage);
        }
      });
    }
  }

  public static getMaxEnergyForDraco(selectedDraco: string): number {
    switch (selectedDraco) {
      case 'Jumpmon': return 100;
      case 'Archermon': return 80;
      case 'Shieldmon': return 80;
      case 'Assassinmon': return 120;
      case 'Flymon': return 140;
      case 'Whitemon': return 140;
      case 'Magemon': return 200;
      case 'Shadowmon': return 160;
      case 'Bombamon': return 180;
      case 'Thundermon': return 160;
      case 'Enigmon': return 160;
      case 'Lunarmon': return 200;
      case 'Azuremon': return 160;
      case 'Pixelmon': return 120;
      default: return 100;
    }
  }

  private getMaxEnergy(): number {
    return GameEngine.getMaxEnergyForDraco(this.selectedDraco);
  }

  private getUltimateName(): string {
    switch (this.selectedDraco) {
      case 'Jumpmon': return 'Meteor Smackdown';
      case 'Archermon': return 'Arrow Shower';
      case 'Shieldmon': return 'Aegis Shield Dome';
      case 'Assassinmon': return 'Single Slash of Death';
      case 'Flymon': return 'Tornado Tempest';
      case 'Whitemon': return 'Primal Roar';
      case 'Magemon': return 'Trio Orb Blast';
      case 'Shadowmon': return 'Soul Blast';
      case 'Bombamon': return 'Eternal Flare!';
      case 'Thundermon': return 'Raigeki';
      case 'Enigmon': return 'Black Hole';
      case 'Lunarmon': return 'Lunar Eclipse';
      case 'Azuremon': return 'Burst Stream of Catastrophe';
      case 'Pixelmon': return 'Mega Pixelmon';
      default: return 'Ultimate';
    }
  }

  private getUltimateVoiceLine(): string {
    switch (this.selectedDraco) {
      case 'Jumpmon': return 'Fulfill the prophecy of the sun!';
      case 'Archermon': return 'Nature will purge your corruption!';
      case 'Shieldmon': return 'Aegis Dome! Shatter the earth!';
      case 'Assassinmon': return 'Fall before the shadow Katana!';
      case 'Flymon': return 'Unleash the storm... TORNADO TEMPEST!';
      case 'Whitemon': return 'Hear the primal roar of the wild!';
      case 'Magemon': return 'Behold the elemental devastation of the stars!';
      case 'Shadowmon': return 'Gather, dark souls... SOUL BLAST!';
      case 'Bombamon': return 'Burn everything into ashes, ETERNAL FLARE!';
      case 'Thundermon': return 'Feel the wrath of the heavens... RAIGEKI!';
      case 'Enigmon': return 'Singularity unleash... BLACK HOLE!';
      case 'Lunarmon': return 'Shine bright in darkness... LUNAR ECLIPSE!';
      case 'Azuremon': return 'Celestial Cataclysm... BURST STREAM OF CATASTROPHE!';
      case 'Pixelmon': return '8-Bit Power... MEGA PIXELMON!';
      default: return 'Unleash full power!';
    }
  }

  private getUltimateCost(): number {
    if (this.selectedDraco === 'Magemon') return 100;
    return this.getMaxEnergy();
  }

  private triggerUltimate() {
    if (this.isPaused || this.pHP <= 0 || this.ultimateCinematicActive) return;

    const dracoLevel = (this.stats as any).level || 1;
    if (dracoLevel < 5) {
      soundService.playHit();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_ULTIMATE_UNLOCK_LV5.text, FT_ULTIMATE_UNLOCK_LV5.color);
      return;
    }

    const cost = this.getUltimateCost();
    if (this.pEnergy >= cost) {
      this.pEnergy -= cost;
      this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());

      this.ultimateCinematicActive = true;
      this.ultimateCinematicDuration = 75;
      soundService.playLevelUp();
    } else {
      soundService.playHit();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_NEED_ENERGY.text, FT_NEED_ENERGY.color);
    }
  }

  private unleashUltimate() {
    soundService.playLevelUp();
    const _ftUlt = FT_ULTIMATE_CINEMATIC(this.getUltimateName()); this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, _ftUlt.text, _ftUlt.color);

    if (this.selectedDraco === 'Jumpmon') {
      soundService.playLevelUp();
      this.jumpmonMeteorActive = true;
      this.jumpmonMeteorState = 'charging';
      this.jumpmonMeteorTimer = 30;
      this.pvy = -22;
      this.pGrounded = false;

      this.cameraZoom = 1.85;
      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, FT_METEOR_SMACKDOWN.text, FT_METEOR_SMACKDOWN.color);

      for (let p = 0; p < 24; p++) {
        this.particles.push({
          x: this.px + this.pWidth / 2 + (Math.random() - 0.5) * 40,
          y: this.py + this.pHeight / 2 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 6,
          vy: -Math.random() * 8 - 2,
          size: Math.random() * 8 + 4,
          color: p % 2 === 0 ? '#f97316' : '#fef08a',
          life: 25,
          maxLife: 25
        });
      }
    }
    else if (this.selectedDraco === 'Archermon') {
      soundService.playLevelUp();
      this.archermonUltActive = true;
      this.archermonUltTimer = 35;

      this.cameraZoom = 1.85;
      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, FT_SKYWARD_ARROW_SHOT.text, FT_SKYWARD_ARROW_SHOT.color);
      this.screenShake = 20;

      // Wind charge burst — spiral outward rings
      for (let p = 0; p < 36; p++) {
        const ang = (p / 36) * Math.PI * 2;
        const spd = 4 + Math.random() * 6;
        this.particles.push({
          x: this.px + this.pWidth / 2,
          y: this.py + this.pHeight / 2,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 2,
          size: Math.random() * 7 + 3,
          color: p % 3 === 0 ? '#10b981' : p % 3 === 1 ? '#34d399' : '#a7f3d0',
          life: 24,
          maxLife: 24
        });
      }
    }
    else if (this.selectedDraco === 'Shieldmon') {
      this.avatarActive = true;
      this.avatarDuration = 240;
      this.pInvulnerableFrames = 240;
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, FT_AVATAR_STATE.text, FT_AVATAR_STATE.color);

      this.enemies.forEach(enemy => {
        if (Math.abs(this.px - enemy.x) < 350) {
          enemy.stunnedTimer = 120;
          this.damageEnemy(enemy, Math.floor(this.stats.attack * 2.5));
          this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 14, '#3b82f6');
          this.addFloatingText(enemy.x, enemy.y - 15, FT_STUNNED_2S.text, FT_STUNNED_2S.color);
        }
      });
    }
    else if (this.selectedDraco === 'Assassinmon') {
      soundService.playLevelUp();
      let bestTarget: Enemy | null = null;
      let minDistance = 9999;

      this.enemies.forEach(e => {
        const dist = Math.abs(this.px - e.x);
        if (dist < 750 && dist < minDistance && e.hp > 0) {
          minDistance = dist;
          bestTarget = e;
        }
      });

      if (!bestTarget) {
        this.addFloatingText(this.px, this.py - 10, FT_NO_ENEMIES_IN_RANGE.text, FT_NO_ENEMIES_IN_RANGE.color);
        return;
      }

      this.musouOriginalPx = this.px;
      this.musouOriginalPy = this.py;
      this.musouTargetId = (bestTarget as Enemy).id;
      this.musouSlashX = (bestTarget as Enemy).x + (bestTarget as Enemy).width / 2;
      this.musouSlashY = (bestTarget as Enemy).y + (bestTarget as Enemy).height / 2;

      this.assassinmonTargets = [bestTarget];
      this.assassinmonUltimateActive = true;
      this.assassinmonUltimateTimer = 0;
      this.musouSlashActive = true;
      this.pInvulnerableFrames = 100;
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, FT_SINGLE_SLASH_OF_DEATH.text, FT_SINGLE_SLASH_OF_DEATH.color);
    }
    else if (this.selectedDraco === 'Flymon') {
      soundService.playLevelUp();
      this.pvy = 0;

      // Find nearest active enemy
      let nearestEnemy: Enemy | null = null;
      let minDist = Infinity;
      const playerCenterX = this.px + this.pWidth / 2;
      const playerCenterY = this.py + this.pHeight / 2;

      this.enemies.forEach(enemy => {
        if (enemy.hp > 0) {
          const dist = Math.hypot(enemy.x + enemy.width / 2 - playerCenterX, enemy.y + enemy.height / 2 - playerCenterY);
          if (dist < minDist) {
            minDist = dist;
            nearestEnemy = enemy;
          }
        }
      });

      let targetX = this.px + this.pFacing * 200;
      let targetY = this.py;
      if (nearestEnemy) {
        targetX = (nearestEnemy as Enemy).x + (nearestEnemy as Enemy).width / 2;
        targetY = (nearestEnemy as Enemy).y + (nearestEnemy as Enemy).height / 2;
      }

      this.flymonTornadoActive = true;
      this.flymonTornadoX = targetX;
      this.flymonTornadoY = targetY;
      this.flymonTornadoTimer = 240; // 4 seconds
      this.screenShake = 22;
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, FT_HYPER_CHARGED_LASER.text, FT_HYPER_CHARGED_LASER.color);

      // Particle ring burst
      for (let p = 0; p < 35; p++) {
        const ang = (p / 35) * Math.PI * 2;
        const spd = 6 + Math.random() * 8;
        this.particles.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 8 + 3,
          color: p % 2 === 0 ? '#06b6d4' : '#e0f2fe',
          life: 25,
          maxLife: 25
        });
      }
    }
    else if (this.selectedDraco === 'Whitemon') {
      soundService.playLevelUp();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, FT_PRIMAL_ROAR.text, FT_PRIMAL_ROAR.color);
      this.screenShake = 35;

      // Fire ring shockwave
      for (let p = 0; p < 48; p++) {
        const ang = (p / 48) * Math.PI * 2;
        const spd = 7 + Math.random() * 8;
        this.particles.push({
          x: this.pFacing === 1 ? this.px + this.pWidth : this.px,
          y: this.py + this.pHeight / 2 + (Math.random() * 24 - 12),
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 10 + 4,
          color: p % 4 === 0 ? '#f97316' : p % 4 === 1 ? '#fef08a' : p % 4 === 2 ? '#38bdf8' : '#ffffff',
          life: 28 + Math.floor(Math.random() * 10),
          maxLife: 38
        });
      }

      for (let w = 0; w < 4; w++) {
        setTimeout(() => {
          this.projectiles.push({
            x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 40,
            y: this.py + this.pHeight / 2 - 25,
            vx: this.pFacing * (6.5 + w * 2),
            vy: 0,
            width: 40 + w * 10,
            height: 40 + w * 10,
            isEnemy: false,
            damage: Math.floor(this.stats.attack * 3.2),
            color: '#38bdf8',
            type: 'sonar',
            hitEnemyIds: []
          } as any);
        }, w * 80);
      }

      this.birdActive = true;
      this.birdRampageTimer = 180;
    }
    else if (this.selectedDraco === 'Shieldmon') {
      soundService.playLevelUp();
      this.shieldmonChargeActive = true;
      this.shieldmonChargeTimer = 90;
      this.pInvulnerableFrames = 120;

      this.shieldmonUltCastX = this.px + this.pWidth / 2;
      this.shieldmonUltCastY = this.py + this.pHeight / 2;
      this.shieldmonUltRadius = 10 * 30;
      this.shieldmonShieldY = this.shieldmonUltCastY - 500;
      this.shieldmonShieldTargetY = this.shieldmonUltCastY;
      this.shieldmonUltDamageDealt = false;

      this.addFloatingText(this.shieldmonUltCastX, this.py - 35, FT_AEGIS_SHIELD_DOME.text, FT_AEGIS_SHIELD_DOME.color);
      this.screenShake = 20;
    }
    else if (this.selectedDraco === 'Magemon') {
      soundService.playLevelUp();
      this.magemonUltActive = true;
      this.magemonUltTimer = 55;

      this.cameraZoom = 1.85;
      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;
      this.pvy = -6;
      this.pGrounded = false;

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, FT_TRIO_ORB_BLAST.text, FT_TRIO_ORB_BLAST.color);

      for (let p = 0; p < 24; p++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 5 + 2;
        this.particles.push({
          x: this.px + this.pWidth / 2,
          y: this.py + this.pHeight / 2,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 7 + 3,
          color: p % 3 === 0 ? '#06b6d4' : p % 3 === 1 ? '#fbbf24' : '#ef4444',
          life: 25,
          maxLife: 25
        });
      }
    }
    else if (this.selectedDraco === 'Shadowmon') {
      soundService.playLevelUp();
      this.shadowmonUltActive = true;
      this.shadowmonUltTimer = 90;
      this.shadowmonUltStacksUsed = this.shadowmonStacks;

      this.cameraZoom = 1.85;
      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;
      this.pvy = -6;
      this.pGrounded = false;

      const _ftSoul = FT_CHARGING_SOUL_BLAST(this.shadowmonStacks); this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, _ftSoul.text, _ftSoul.color);

      for (let p = 0; p < 30; p++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 6 + 2;
        this.particles.push({
          x: this.px + this.pWidth / 2,
          y: this.py + this.pHeight / 2,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 7 + 3,
          color: p % 2 === 0 ? '#ef4444' : '#7f1d1d',
          life: 25,
          maxLife: 25
        });
      }
    }
    else if (this.selectedDraco === 'Bombamon') {
      soundService.playLevelUp();
      this.carpetBombingActive = true;
      this.carpetBombingChannelTimer = 35;
      this.carpetBombingTimer = 120;
      this.carpetBombingSpreadRadius = 0;
      this.carpetBombingStartX = this.px;
      this.carpetBombingStartY = this.py;
      this.carpetBombingX = this.px;

      let targetY = this.py;
      const maxRise = 320;
      for (let offset = 0; offset <= maxRise; offset += 10) {
        const checkY = this.py - offset;
        if (this.isSolid(this.px, checkY) || this.isSolid(this.px + this.pWidth, checkY) || checkY < 30) {
          targetY = Math.max(30, checkY + 45);
          break;
        }
        targetY = checkY;
      }
      this.carpetBombingY = targetY;
      this.carpetBombingFireStreamTimer = 0;

      this.cameraZoom = 1.5;
      this.cameraZoomTargetX = this.carpetBombingX + this.pWidth / 2;
      this.cameraZoomTargetY = this.carpetBombingY + this.pHeight / 2;

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, FT_CHARGING_CARPET_BOMBING.text, FT_CHARGING_CARPET_BOMBING.color);
      this.screenShake = 35;

      for (let p = 0; p < 30; p++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 6 + 2;
        this.particles.push({
          x: this.px + this.pWidth / 2,
          y: this.py + this.pHeight / 2,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 2,
          size: Math.random() * 8 + 4,
          color: p % 3 === 0 ? '#f97316' : p % 3 === 1 ? '#ea580c' : '#fef08a',
          life: 25,
          maxLife: 25
        });
      }
    }
    else if (this.selectedDraco === 'Thundermon') {
      soundService.playLevelUp();
      this.thundermonUltActive = true;

      this.cameraZoom = 1.0;
      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;
      this.screenShake = 35;

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, FT_RAIGEKI_THUNDERBOLTS.text, FT_RAIGEKI_THUNDERBOLTS.color);

      const playerCenterX = this.px + this.pWidth / 2;
      const playerCenterY = this.py + this.pHeight / 2;
      const maxRadius = 800;

      const validEnemies = this.enemies
        .filter(enemy => enemy.hp > 0 && Math.hypot((enemy.x + enemy.width / 2) - playerCenterX, (enemy.y + enemy.height / 2) - playerCenterY) <= maxRadius)
        .sort((a, b) => {
          const distA = Math.hypot((a.x + a.width / 2) - playerCenterX, (a.y + a.height / 2) - playerCenterY);
          const distB = Math.hypot((b.x + b.width / 2) - playerCenterX, (b.y + b.height / 2) - playerCenterY);
          return distA - distB;
        });

      const delayPerHit = 6;
      this.raigekiTargets = validEnemies.map((enemy, idx) => ({
        enemy,
        strikeTimer: idx * delayPerHit,
        struck: false
      }));

      this.thundermonUltTimer = Math.max(65, validEnemies.length * delayPerHit + 45);
    }
    else if (this.selectedDraco === 'Enigmon') {
      soundService.playBlackHoleActivation();
      const targetBlackHoleX = Math.max(100, this.px + this.pFacing * 300);
      const targetBlackHoleY = this.py + this.pHeight / 2;

      this.isChanneling = true;
      this.channelingSpell = 'black_hole';
      this.channelingTimer = 240;
      this.channelingMaxDuration = 240;

      (this as any).enigmonBlackHoleActive = true;
      (this as any).enigmonBlackHoleTimer = 240;
      (this as any).enigmonBlackHoleX = targetBlackHoleX;
      (this as any).enigmonBlackHoleY = targetBlackHoleY;

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, FT_BLACK_HOLE_SINGULARITY.text, FT_BLACK_HOLE_SINGULARITY.color);
      this.screenShake = 45;

      // Implosion burst — particles fly inward from a ring
      for (let p = 0; p < 56; p++) {
        const ang = (p / 56) * Math.PI * 2 + Math.random() * 0.2;
        const startR = 180 + Math.random() * 60;
        const spd = 5 + Math.random() * 7;
        this.particles.push({
          x: targetBlackHoleX + Math.cos(ang) * startR,
          y: targetBlackHoleY + Math.sin(ang) * startR * 0.55,
          vx: -Math.cos(ang) * spd,
          vy: -Math.sin(ang) * spd * 0.55,
          size: Math.random() * 7 + 2,
          color: p % 3 === 0 ? '#e879f9' : p % 3 === 1 ? '#c084fc' : '#a5f3fc',
          life: 22 + Math.floor(Math.random() * 12),
          maxLife: 34
        });
      }
    }
    else if (this.selectedDraco === 'Lunarmon') {
      soundService.playLevelUp(this.isDemoMode);
      this.lunarmonUltActive = true;
      this.lunarmonUltPhase = 'cinematic';
      this.lunarmonUltChannelTimer = 45; // 45 frames cinematic eclipse animation
      this.lunarmonUltTimer = 180; // 3 seconds laser duration after jump
      this.lunarmonUltStartX = this.px;
      this.lunarmonUltStartY = this.py;
      this.lunarmonUltBeamAngle = Math.PI / 2; // Default facing down

      const playerCenterX = this.px + this.pWidth / 2;
      const playerCenterY = this.py + this.pHeight / 2;
      const validEnemies = this.enemies
        .filter(enemy => enemy.hp > 0 && Math.hypot((enemy.x + enemy.width / 2) - playerCenterX, (enemy.y + enemy.height / 2) - playerCenterY) <= 1200)
        .sort((a, b) => {
          const distA = Math.hypot((a.x + a.width / 2) - playerCenterX, (a.y + a.height / 2) - playerCenterY);
          const distB = Math.hypot((b.x + b.width / 2) - playerCenterX, (b.y + b.height / 2) - playerCenterY);
          return distA - distB;
        });

      // 0.5s interval = 30 frames between each target strike
      const delayPerHit = 30;
      this.lunarmonTargets = validEnemies.map((enemy, idx) => ({
        enemy,
        strikeTimer: idx * delayPerHit,
        struck: false
      }));

      let targetY = this.py;
      const maxRise = 320;
      for (let offset = 0; offset <= maxRise; offset += 10) {
        const checkY = this.py - offset;
        const colLeft = Math.floor(this.px / this.level.tileSize);
        const colRight = Math.floor((this.px + this.pWidth) / this.level.tileSize);
        const row = Math.floor(checkY / this.level.tileSize);
        const grid = this.getActiveGrid();
        let hit = false;
        if (row >= 0 && row < grid.length) {
          if (colLeft >= 0 && colLeft < grid[row].length && (grid[row][colLeft] === '#' || grid[row][colLeft] === '=')) hit = true;
          if (colRight >= 0 && colRight < grid[row].length && (grid[row][colRight] === '#' || grid[row][colRight] === '=')) hit = true;
        }
        if (hit || checkY < 30) {
          targetY = Math.max(30, checkY + 45);
          break;
        }
        targetY = checkY;
      }
      this.lunarmonUltJumpY = targetY;

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, FT_LUNAR_ECLIPSE.text, FT_LUNAR_ECLIPSE.color);
      this.screenShake = 40;
    }
    else if (this.selectedDraco === 'Azuremon') {
      soundService.playAzuremonCharge(false);
      this.azuremonUltActive = true;
      this.azuremonUltPhase = 'channeling';
      this.azuremonUltChannelTimer = 30; // 0.5 seconds channel (30 frames)
      this.azuremonUltTimer = 240; // 4 seconds beam duration (240 frames)
      this.azuremonUltStartX = this.px;
      this.azuremonUltStartY = this.py;
      this.azuremonUltBeamAngle = this.pFacing === 1 ? 0 : Math.PI; // Shoots horizontally to the front!
      this.azuremonBlastCounters.clear();

      this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, '🌌 BURST STREAM OF CATASTROPHE!', '#38bdf8');
      this.screenShake = 35;
    }
    else if (this.selectedDraco === 'Pixelmon') {
      soundService.playLevelUp();
      this.isMegaPixelmon = true;
      this.megaPixelmonTimer = 300; // 5 seconds giant form
      this.megaPixelmonScale = 3.0; // 300% giant size
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, '👾 MEGA PIXELMON (5S GIANT FORM)!', '#f43f5e');
      this.screenShake = 35;
      for (let p = 0; p < 45; p++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 10 + 3;
        this.particles.push({
          x: this.px + this.pWidth / 2,
          y: this.py + this.pHeight / 2,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 8 + 4,
          color: p % 3 === 0 ? '#ec4899' : p % 3 === 1 ? '#a855f7' : '#3b82f6',
          life: 35,
          maxLife: 35
        });
      }
      this.destroyPlatformsAbovePixelmon();
    }

    this.birdX = this.px;
    this.birdY = this.py - 50;
  }

  private damageEnemy(enemy: Enemy, damage: number) {
    if (this.isBossType(enemy.type)) {
      const pxMid = this.px + this.pWidth / 2;
      const pyMid = this.py + this.pHeight / 2;
      const exMid = enemy.x + enemy.width / 2;
      const eyMid = enemy.y + enemy.height / 2;
      const distToPlayer = Math.hypot(pxMid - exMid, pyMid - eyMid);
      if (distToPlayer > 800) {
        soundService.playBlock();
        this.addFloatingText(exMid, enemy.y - 15, FT_IMMUNE_OUT_OF_RANGE.text, FT_IMMUNE_OUT_OF_RANGE.color);
        return;
      }
    }

    let finalDamage = this.selectedDraco === 'Shieldmon' && this.avatarActive ? damage * 1 : damage;
    if (this.selectedDraco === 'Flymon' && (enemy as any).isGrounded === false) {
      finalDamage *= 2.0;
    }
    const damageDealt = Math.max(1, Math.floor(finalDamage) - Math.floor(enemy.defense / 2));

    if (enemy.isImmortal) {
      enemy.hp = Math.max(1, enemy.hp - damageDealt);
      this.addFloatingText(enemy.x + enemy.width / 2, enemy.y, `-${damageDealt} [IMMORTAL 🛡️]`, '#fbbf24');
    } else {
      enemy.hp -= damageDealt;
      this.addFloatingText(enemy.x + enemy.width / 2, enemy.y, `-${damageDealt}`, '#ef4444');
    }

    soundService.playHit();
    this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, '#ef4444');

    if (!enemy.isImmortal || (enemy.stunTimer || 0) <= 0) {
      enemy.vx = this.pFacing * 1.5;
      enemy.vy = -2.5;
    }

    if (enemy.type !== 'skeleton_archer' && !this.ultimateCinematicActive && this.pEnergy < this.getMaxEnergy()) {
      this.pEnergy = Math.min(this.getMaxEnergy(), this.pEnergy + 2.5);
      this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());
    }

    if (!enemy.isImmortal && enemy.hp <= 0) {
      this.defeatEnemy(enemy);
    }
  }

  private defeatEnemy(enemy: Enemy) {
    if (enemy.type === 'giant_wisp' && !(enemy as any).wispDetonatingFinished) {
      if (!enemy.wispDetonating) {
        enemy.wispDetonating = true;
        enemy.wispDetonationTimer = 120;
        enemy.hp = 1;
        soundService.playShoot(this.isDemoMode);
        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;
        this.addFloatingText(cx, cy - 20, FT_SUPERNOVA_DETONATION.text, FT_SUPERNOVA_DETONATION.color);
      }
      return;
    }

    if ((enemy.burnTimer && enemy.burnTimer > 0) || (enemy.burnLingerTimer && enemy.burnLingerTimer > 0)) {
      soundService.playHit();
      this.screenShake = 22;
      this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 15, FT_BURN_EXPLOSION.text, FT_BURN_EXPLOSION.color);

      const expX = enemy.x + enemy.width / 2;
      const expY = enemy.y + enemy.height / 2;
      this.enemies.forEach(other => {
        if (other.id !== enemy.id && other.hp > 0) {
          const dist = Math.hypot(other.x + other.width / 2 - expX, other.y + other.height / 2 - expY);
          if (dist <= 120) {
            this.damageEnemy(other, 120);
            other.vx = (other.x > expX ? 1 : -1) * 5.0;
            other.vy = -4.0;
          }
        }
      });

      for (let p = 0; p < 25; p++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 8 + 3;
        this.particles.push({
          x: expX,
          y: expY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 2,
          size: Math.random() * 7 + 3,
          color: p % 3 === 0 ? '#f97316' : p % 3 === 1 ? '#ea580c' : '#fef08a',
          life: 22,
          maxLife: 22
        });
      }
    }

    if (this.selectedDraco === 'Shadowmon') {
      const oldStacks = this.shadowmonStacks;
      this.shadowmonStacks = Math.min(5, this.shadowmonStacks + 1);
      if (this.shadowmonStacks > oldStacks) {
        soundService.playCoin();
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, `+1 DARK SOUL STACK (${this.shadowmonStacks}/5) 🔴`, '#ef4444');
      }
    }

    if ((enemy as any).slowedByAzuremon || (enemy as any).azuremonSkillHit) {
      this.healPlayer(5);
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, '+5 HP (Light Siphon ✨)', '#38bdf8');
    }

    let expReward = 6;
    let coinReward = 12;

    if (enemy.type === 'goblin_archer') {
      expReward = 10;
      coinReward = 18;
    } else if (enemy.type === 'fire_golem') {
      expReward = 20;
      coinReward = 30;
    } else if (enemy.type === 'king_slime') {
      expReward = 45;
      coinReward = 70;
      this.pickups.push({
        x: enemy.x + enemy.width / 2 - 10,
        y: enemy.y + enemy.height / 2 - 10,
        width: 20,
        height: 20,
        type: 'upgrade_stone',
        amount: 1,
        collected: false
      });
    } else if ((enemy.type as string) === 'blockman') {
      (enemy as any).formTimer = ((enemy as any).formTimer || 0) + 1;
      if ((enemy as any).formTimer >= 300) {
        (enemy as any).formTimer = 0;
        (enemy as any).form = (((enemy as any).form || 0) + 1) % 3;
        const formNames = ['BRAWLER FORM ⚔️', 'SHOOTER FORM 💣', 'CRUSHER SHIELD FORM 🛡️'];
        this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 30, formNames[(enemy as any).form], '#ec4899');
        soundService.playLevelUp();
      }

      const currentForm = (enemy as any).form || 0;
      if (currentForm === 0) { // Brawler
        enemy.shootCooldown = 90;
        if (Math.random() < 0.05 && (enemy as any).grounded) {
          enemy.vy = -7;
          enemy.vx = enemy.facing * 5;
        }
      } else if (currentForm === 1) { // Shooter
        enemy.shootCooldown = 60;
        const angles = [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4];
        angles.forEach(ang => {
          this.projectiles.push({
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            vx: Math.cos(ang) * 4.5,
            vy: Math.sin(ang) * 4.5,
            width: 14,
            height: 14,
            isEnemy: true,
            damage: enemy.attack,
            color: '#ec4899',
            type: 'fireball'
          });
        });
      } else if (currentForm === 2) { // Crusher
        enemy.shootCooldown = 120;
        if ((enemy as any).grounded) {
          this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 15, 'GROUND SHOCKWAVE!', '#3b82f6');
          [-1, 1].forEach(dir => {
            this.projectiles.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height - 10,
              vx: dir * 6,
              vy: 0,
              width: 24,
              height: 12,
              isEnemy: true,
              damage: Math.floor(enemy.attack * 1.4),
              color: '#3b82f6',
              type: 'fireball'
            });
          });
        }
      }
    } else if ((enemy.type as string) === 'pixel_piranha') {
      enemy.shootCooldown = 90;
      this.projectiles.push({
        x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 12,
        y: enemy.y + enemy.height / 2,
        vx: enemy.facing * 5,
        vy: 0,
        width: 14,
        height: 14,
        isEnemy: true,
        damage: enemy.attack,
        color: '#ef4444',
        type: 'fireball'
      });
    } else if ((enemy.type as string) === 'pixel_dragon') {
      enemy.shootCooldown = 110;
      [-0.2, 0, 0.2].forEach(ang => {
        this.projectiles.push({
          x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 14,
          y: enemy.y + enemy.height / 2,
          vx: enemy.facing * 5 * Math.cos(ang),
          vy: 5 * Math.sin(ang),
          width: 14,
          height: 14,
          isEnemy: true,
          damage: enemy.attack,
          color: '#a855f7',
          type: 'fireball'
        });
      });
    } else if ((enemy.type as string) === 'pixel_ghost') {
      // Floating ghost logic
      const isPlayerFacingGhost = (this.pFacing === 1 && this.px < enemy.x) || (this.pFacing === -1 && this.px > enemy.x);
      if (isPlayerFacingGhost) {
        (enemy as any).isFrozen = true;
        enemy.vx = 0;
        enemy.vy = 0;
      } else {
        (enemy as any).isFrozen = false;
        const dx = (this.px + this.pWidth / 2) - (enemy.x + enemy.width / 2);
        const dy = (this.py + this.pHeight / 2) - (enemy.y + enemy.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          enemy.vx = (dx / dist) * 2.5;
          enemy.vy = (dy / dist) * 2.5;
        }
      }
    } else if (enemy.type === 'blockman') {
      this.ctx.save();
      const currentForm = (enemy as any).form || 0;
      const formColors = ['#ef4444', '#a855f7', '#3b82f6'];
      const bodyColor = formColors[currentForm];

      // 8-Bit Blockman Body
      this.ctx.fillStyle = bodyColor;
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      this.ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // Pixel Eyes
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(enemy.x + 12, enemy.y + 16, 12, 12);
      this.ctx.fillRect(enemy.x + 36, enemy.y + 16, 12, 12);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(enemy.x + 14, enemy.y + 18, 4, 4);
      this.ctx.fillRect(enemy.x + 38, enemy.y + 18, 4, 4);

      // Form Emblem on chest
      this.ctx.fillStyle = '#fef08a';
      if (currentForm === 0) { // Brawler Sword Emblem
        this.ctx.fillRect(enemy.x + 26, enemy.y + 36, 12, 18);
      } else if (currentForm === 1) { // Shooter Cannon Emblem
        this.ctx.fillRect(enemy.x + 20, enemy.y + 38, 24, 12);
      } else { // Crusher Shield Emblem
        this.ctx.fillRect(enemy.x + 22, enemy.y + 34, 20, 20);
      }
      this.ctx.restore();

      const hbW = enemy.width + 16;
      const hbX = enemy.x - 8;
      const hbY = enemy.y - 20;
      this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
      this.ctx.fillRect(hbX, hbY, hbW, 6);
      this.ctx.fillStyle = bodyColor;
      this.ctx.fillRect(hbX, hbY, hbW * (enemy.hp / enemy.maxHp), 6);
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(hbX, hbY, hbW, 6);
    } else if (enemy.type === 'pixel_piranha') {
      this.ctx.save();
      // Green Pipe
      this.ctx.fillStyle = '#16a34a';
      this.ctx.strokeStyle = '#14532d';
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(enemy.x + 4, enemy.y + 20, enemy.width - 8, enemy.height - 20);
      this.ctx.strokeRect(enemy.x + 4, enemy.y + 20, enemy.width - 8, enemy.height - 20);

      // Red Piranha Head
      this.ctx.fillStyle = '#dc2626';
      this.ctx.fillRect(enemy.x + 2, enemy.y, enemy.width - 4, 22);
      this.ctx.strokeRect(enemy.x + 2, enemy.y, enemy.width - 4, 22);

      // Sharp Teeth
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(enemy.x + 6, enemy.y + 16, 6, 6);
      this.ctx.fillRect(enemy.x + 18, enemy.y + 16, 6, 6);
      this.ctx.fillRect(enemy.x + 28, enemy.y + 16, 6, 6);
      this.ctx.restore();
    } else if (enemy.type === 'pixel_ghost') {
      this.ctx.save();
      const isFrozen = (enemy as any).isFrozen;
      this.ctx.globalAlpha = isFrozen ? 0.45 : 0.95;
      this.ctx.fillStyle = isFrozen ? '#94a3b8' : '#e0e7ff';
      this.ctx.strokeStyle = '#6366f1';
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      this.ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // Ghost Eyes
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(enemy.x + 8, enemy.y + 10, 6, 8);
      this.ctx.fillRect(enemy.x + 22, enemy.y + 10, 6, 8);
      this.ctx.restore();
    } else if (enemy.type === 'pixel_dragon') {
      this.ctx.save();
      this.ctx.fillStyle = '#a855f7';
      this.ctx.strokeStyle = '#581c87';
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(enemy.x, enemy.y + 8, enemy.width, enemy.height - 16);

      // Wings
      const wingY = Math.sin(this.frameCount * 0.2) * 6;
      this.ctx.fillStyle = '#ec4899';
      this.ctx.fillRect(enemy.x + 10, enemy.y - 8 + wingY, 16, 12);
      this.ctx.fillRect(enemy.x + 26, enemy.y - 8 + wingY, 16, 12);

      // Eyes
      this.ctx.fillStyle = '#fef08a';
      this.ctx.fillRect(enemy.facing === 1 ? enemy.x + 36 : enemy.x + 8, enemy.y + 12, 8, 8);
      this.ctx.restore();
    } else if (enemy.type === 'miniboss') {
      expReward = 80;
      coinReward = 120;
      this.pickups.push({
        x: enemy.x + enemy.width / 2 - 10,
        y: enemy.y + enemy.height / 2 - 10,
        width: 20,
        height: 20,
        type: 'upgrade_stone',
        amount: 1,
        collected: false
      });
    } else if (enemy.type === 'frost_wyvern') {
      expReward = 150;
      coinReward = 200;
      this.pickups.push({
        x: enemy.x + enemy.width / 2 - 10,
        y: enemy.y + enemy.height / 2 - 10,
        width: 20,
        height: 20,
        type: 'upgrade_stone',
        amount: 2,
        collected: false
      });
    } else if (enemy.type === 'shadow_overlord') {
      expReward = 250;
      coinReward = 350;
      this.pickups.push({
        x: enemy.x + enemy.width / 2 - 10,
        y: enemy.y + enemy.height / 2 - 10,
        width: 20,
        height: 20,
        type: 'upgrade_stone',
        amount: 2,
        collected: false
      });
    } else if (enemy.type === 'dragon_king') {
      expReward = 600;
      coinReward = 1000;
      this.pickups.push({
        x: enemy.x + enemy.width / 2 - 10,
        y: enemy.y + enemy.height / 2 - 10,
        width: 20,
        height: 20,
        type: 'upgrade_stone',
        amount: 3,
        collected: false
      });
      this.pickups.push({
        x: enemy.x + enemy.width / 2 + 15,
        y: enemy.y + enemy.height / 2 - 10,
        width: 20,
        height: 20,
        type: 'potion',
        amount: 2,
        collected: false
      });
      this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 45, FT_PRIMORDIAL_GOD_CONQUERED.text, FT_PRIMORDIAL_GOD_CONQUERED.color);
    } else if (enemy.type === 'skeleton_archer') {
      const currentRevives = enemy.reviveCount || 0;
      if (currentRevives < 2) {
        enemy.isBonePile = true;
        enemy.respawnTimer = 300;
        enemy.hp = 0;
        soundService.playHit();
        this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height, 14, '#e2e8f0');
        return;
      } else {
        expReward = 0;
        coinReward = 0;
        this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 15, FT_SKELETON_DESTROYED.text, FT_SKELETON_DESTROYED.color);
      }
    } else if (enemy.type === 'king_kong') {
      expReward = 550;
      coinReward = 850;
      this.pickups.push({
        x: enemy.x + enemy.width / 2 - 10,
        y: enemy.y + enemy.height / 2 - 10,
        width: 20,
        height: 20,
        type: 'upgrade_stone',
        amount: 3,
        collected: false
      });
      this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 45, FT_KING_KONG_SLAIN.text, FT_KING_KONG_SLAIN.color);
    } else if (enemy.type === 'giant_wisp') {
      expReward = 500;
      coinReward = 800;
      this.pickups.push({
        x: enemy.x + enemy.width / 2 - 10,
        y: enemy.y + enemy.height / 2 - 10,
        width: 20,
        height: 20,
        type: 'upgrade_stone',
        amount: 3,
        collected: false
      });
      this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 45, FT_GIANT_WISP_SLAIN.text, FT_GIANT_WISP_SLAIN.color);
    }

    const rewardMult = (this.level as any)?.rewardMultiplier || 1.0;
    expReward = Math.floor(expReward * 0.2 * rewardMult);
    coinReward = Math.floor(coinReward * 0.2 * rewardMult);

    this.callbacks.onEnemyDefeat(expReward, coinReward);
    const _ftExp = FT_EXP_REWARD(expReward); this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 15, _ftExp.text, _ftExp.color);
    const _ftCoinR = FT_COIN_REWARD(coinReward); this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 30, _ftCoinR.text, _ftCoinR.color);

    if (!this.ultimateCinematicActive && this.pEnergy < this.getMaxEnergy()) {
      this.pEnergy = Math.min(this.getMaxEnergy(), this.pEnergy + 15);
      this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());
    }

    this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15, '#fbbf24');

    if (this.isBossType(enemy.type) && !this.isSurvivalMode) {
      const otherBosses = this.enemies.filter(e => e.id !== enemy.id && this.isBossType(e.type) && e.hp > 0);
      if (otherBosses.length === 0) {
        this.exitPortalActive = true;
        if (!this.exitPortalPos) {
          this.exitPortalPos = { x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2 };
        }

        soundService.playLevelUp(this.isDemoMode);
        this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 60, FT_FINAL_BOSS_SLAIN.text, FT_FINAL_BOSS_SLAIN.color);

        for (let i = 0; i < 45; i++) {
          this.particles.push({
            x: this.exitPortalPos.x,
            y: this.exitPortalPos.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 6 + 3,
            color: i % 2 === 0 ? '#a855f7' : '#38bdf8',
            life: 60,
            maxLife: 60
          });
        }
      }
    }

    this.enemies = this.enemies.filter(e => e.id !== enemy.id);
  }

  public healPlayer(amount: number) {
    this.pHP = Math.min(this.pMaxHP, this.pHP + amount);
    this.callbacks.onHpChange(this.pHP, this.pMaxHP);
    const _ftHeal = FT_HEAL(amount); this.addFloatingText(this.px + this.pWidth / 2, this.py, _ftHeal.text, _ftHeal.color);
    this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight / 2, 12, '#34d399');
  }

  public triggerStatUpdate(newStats: PlayerStats) {
    this.stats = newStats;
    const diffHp = newStats.hp - this.pMaxHP;
    this.pMaxHP = newStats.hp;
    if (diffHp > 0) {
      this.pHP += diffHp;
    }
    this.callbacks.onHpChange(this.pHP, this.pMaxHP);
  }

  private handlePlayerHit(damage: number, sourceX: number) {
    if (this.pInvulnerableFrames > 0 || this.pHP <= 0) return;

    if (this.isChanneling) {
      this.cancelChanneling('Damage');
    }

    if (this.shieldActive) {
      soundService.playBlock();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_BLOCKED.text, FT_BLOCKED.color);
      this.pInvulnerableFrames = 30;

      const dir = this.px > sourceX ? 1 : -1;
      this.pvx = dir * 1.5;
      return;
    }

    const netDamage = Math.max(1, damage - Math.floor(this.stats.defense / 2));
    this.pHP = Math.max(0, this.pHP - netDamage);
    this.callbacks.onHpChange(this.pHP, this.pMaxHP);
    this.pInvulnerableFrames = 60;

    soundService.playHit();
    const _ftDmg = FT_DAMAGE(netDamage); this.addFloatingText(this.px + this.pWidth / 2, this.py, _ftDmg.text, _ftDmg.color);
    this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight / 2, 10, '#ef4444');

    const dir = this.px > sourceX ? 1 : -1;
    this.pvx = dir * 3.5;
    this.pvy = -3;

    if (this.pHP <= 0) {
      this.callbacks.onPlayerDeath();
    }
  }

  private isSolid(x: number, y: number): boolean {
    const grid = this.getActiveGrid();
    if (grid.length === 0) return false;
    const ts = this.level.tileSize;
    const col = Math.floor(x / ts);
    const row = Math.floor(y / ts);

    if (col < 0 || col >= grid[0].length || row < 0 || row >= grid.length) {
      return false;
    }

    const char = grid[row][col];
    return char === '#';
  }

  private checkPlatformOneWay(x: number, y: number): boolean {
    const grid = this.getActiveGrid();
    if (grid.length === 0) return false;
    const ts = this.level.tileSize;
    const col = Math.floor(x / ts);
    const row = Math.floor(y / ts);

    if (col < 0 || col >= grid[0].length || row < 0 || row >= grid.length) {
      return false;
    }

    return grid[row][col] === '=';
  }

  private getHazard(x: number, y: number): 'spike' | null {
    const grid = this.getActiveGrid();
    if (grid.length === 0) return null;
    const ts = this.level.tileSize;
    const col = Math.floor(x / ts);
    const row = Math.floor(y / ts);

    if (col < 0 || col >= grid[0].length || row < 0 || row >= grid.length) {
      return null;
    }

    const char = grid[row][col];
    if (char === '*') return 'spike';
    return null;
  }

  private isPortal(x: number, y: number): boolean {
    const grid = this.getActiveGrid();
    if (grid.length === 0) return false;
    const ts = this.level.tileSize;
    const col = Math.floor(x / ts);
    const row = Math.floor(y / ts);

    if (col < 0 || col >= grid[0].length || row < 0 || row >= grid.length) {
      return false;
    }

    return grid[row][col] === 'P';
  }

  private isMapPortal(x: number, y: number): boolean {
    const grid = this.getActiveGrid();
    if (grid.length === 0) return false;
    const ts = this.level.tileSize;
    const col = Math.floor(x / ts);
    const row = Math.floor(y / ts);

    if (col < 0 || col >= grid[0].length || row < 0 || row >= grid.length) {
      return false;
    }

    return grid[row][col] === 'm';
  }

  private getTileSymbol(x: number, y: number): string {
    const grid = this.getActiveGrid();
    if (grid.length === 0) return '.';
    const ts = this.level.tileSize;
    const col = Math.floor(x / ts);
    const row = Math.floor(y / ts);

    if (col < 0 || col >= grid[0].length || row < 0 || row >= grid.length) {
      return '.';
    }

    return grid[row][col];
  }

  private isBossType(type: string): boolean {
    return ['king_slime', 'miniboss', 'frost_wyvern', 'shadow_overlord', 'dragon_king', 'killer_whale', 'king_kong', 'immortal_gladiator', 'giant_wisp', 'lunar_goddess'].includes(type);
  }

  private distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const l2 = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  private updatePhysics() {
    if (this.isSurvivalMode && !this.isPaused && this.pHP > 0) {
      if (this.survivalTimer > 0) {
        this.survivalTimer--;
        const secondsLeft = Math.ceil(this.survivalTimer / 60);

        if (secondsLeft <= 90 && !this.arenaExploded) {
          this.arenaExploded = true;
          this.screenShake = 40;
          soundService.playHit();
          this.addFloatingText(this.px + this.pWidth / 2, this.py - 60, FT_ARENA_ERUPTED.text, FT_ARENA_ERUPTED.color);

          for (let p = 0; p < 80; p++) {
            this.particles.push({
              x: Math.random() * this.levelWidth,
              y: Math.random() * this.levelHeight,
              vx: (Math.random() - 0.5) * 12,
              vy: -Math.random() * 10 - 2,
              size: Math.random() * 10 + 4,
              color: p % 3 === 0 ? '#ef4444' : p % 3 === 1 ? '#f97316' : '#fef08a',
              life: 50,
              maxLife: 50
            });
          }

          const gladX = Math.min(this.levelWidth - 400, Math.max(400, Math.random() * (this.levelWidth - 800) + 400));
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: gladX,
            y: 200,
            vx: 2.2,
            vy: 0,
            width: 72,
            height: 72,
            type: 'immortal_gladiator',
            hp: 1600,
            maxHp: 1600,
            attack: 32,
            defense: 18,
            facing: 1,
            shootCooldown: 50,
            state: 'patrol',
            animFrame: 0,
            name: 'Immortal Gladiator',
            isImmortal: true,
            stunTimer: 0,
            damageAcc: 0
          });
        }

        this.survivalWaveTimer--;
        if (this.survivalWaveTimer <= 0) {
          this.survivalWaveTimer = Math.floor(Math.random() * 80) + 140;

          if (this.enemies.length < 15) {
            const minX = 300;
            const maxX = Math.max(minX + 400, this.levelWidth - 300);
            const spawnX = minX + Math.random() * (maxX - minX);
            const spawnY = Math.random() > 0.4 ? 320 : 180;
            const facingDir = Math.random() > 0.5 ? 1 : -1;

            const elapsedRatio = (120 - secondsLeft) / 120;
            const hpMultiplier = 1 + elapsedRatio * 1.5;

            let mobType = 'slime';
            let baseHp = 16;
            let mobAtk = 4;
            let mobSpeed = 1.8;
            let mobWidth = 32;
            let mobHeight = 32;

            const rand = Math.random();
            if (secondsLeft > 80) {
              if (rand < 0.25) mobType = 'skeleton_archer';
              else if (rand < 0.5) mobType = 'bomb_thrower';
              else if (rand < 0.75) mobType = 'slime';
              else mobType = 'goblin_archer';
              baseHp = mobType === 'skeleton_archer' ? 26 : mobType === 'bomb_thrower' ? 28 : 18;
              mobAtk = 4;
              if (mobType === 'skeleton_archer') { mobWidth = 32; mobHeight = 38; }
              else if (mobType === 'bomb_thrower') { mobWidth = 32; mobHeight = 32; }
            } else if (secondsLeft > 50) {
              if (rand < 0.25) mobType = 'skeleton_archer';
              else if (rand < 0.5) mobType = 'bomb_thrower';
              else if (rand < 0.7) mobType = 'fire_golem';
              else if (rand < 0.88) mobType = 'flying_wyvern';
              else mobType = 'miniboss';
              baseHp = mobType === 'miniboss' ? 120 : 35;
              mobAtk = mobType === 'miniboss' ? 8 : 6;
              if (mobType === 'miniboss') { mobWidth = 56; mobHeight = 56; }
              else if (mobType === 'skeleton_archer') { mobWidth = 32; mobHeight = 38; }
            } else if (secondsLeft > 30) {
              if (rand < 0.25) mobType = 'bomb_thrower';
              else if (rand < 0.5) mobType = 'skeleton_archer';
              else if (rand < 0.7) mobType = 'frost_wyvern';
              else mobType = 'shadow_overlord';
              baseHp = mobType === 'shadow_overlord' ? 220 : mobType === 'frost_wyvern' ? 180 : 55;
              mobAtk = 8;
              if (mobType === 'shadow_overlord' || mobType === 'frost_wyvern') { mobWidth = 72; mobHeight = 68; }
              else if (mobType === 'skeleton_archer') { mobWidth = 32; mobHeight = 38; }
            } else {
              if (rand < 0.25) mobType = 'king_kong';
              else if (rand < 0.5) mobType = 'dragon_king';
              else if (rand < 0.75) mobType = 'bomb_thrower';
              else mobType = 'skeleton_archer';
              baseHp = mobType === 'king_kong' ? 600 : mobType === 'dragon_king' ? 350 : 70;
              mobAtk = 12;
              if (mobType === 'king_kong') { mobWidth = 86; mobHeight = 86; }
              else if (mobType === 'dragon_king') { mobWidth = 88; mobHeight = 80; }
              else if (mobType === 'skeleton_archer') { mobWidth = 32; mobHeight = 38; }
            }

            const scaledHp = Math.floor(baseHp * hpMultiplier);

            this.enemies.push({
              id: this.enemyIdCounter++,
              x: spawnX,
              y: spawnY,
              vx: facingDir * mobSpeed,
              vy: 0,
              width: mobWidth,
              height: mobHeight,
              type: mobType as any,
              hp: scaledHp,
              maxHp: scaledHp,
              attack: mobAtk,
              defense: 2,
              facing: facingDir,
              shootCooldown: 60,
              state: 'patrol',
              animFrame: 0,
              name: 'Gladiator Beast'
            });

            soundService.playShoot();

            for (let p = 0; p < 16; p++) {
              this.particles.push({
                x: spawnX + Math.random() * mobWidth,
                y: spawnY + Math.random() * mobHeight,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 5 - 2,
                size: Math.random() * 6 + 3,
                color: p % 2 === 0 ? '#f59e0b' : '#ef4444',
                life: 20,
                maxLife: 20
              });
            }
          }
        }

        if (this.survivalTimer === 0) {
          this.exitPortalActive = true;
          soundService.playLevelUp();
          this.addFloatingText(this.px + this.pWidth / 2, this.py - 60, FT_ARENA_SURVIVED.text, FT_ARENA_SURVIVED.color);

          if (this.exitPortalPos) {
            for (let i = 0; i < 50; i++) {
              this.particles.push({
                x: this.exitPortalPos.x,
                y: this.exitPortalPos.y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: Math.random() * 7 + 3,
                color: i % 2 === 0 ? '#f59e0b' : '#38bdf8',
                life: 70,
                maxLife: 70
              });
            }
          }
        }
      }
    }

    if (this.skeletonDeathTimer > 0) {
      this.pvx = 0;
      this.pvy = 0;
      return;
    }

    if (this.assassinmonUltimateActive) {
      this.pvx = 0;
      this.pvy = 0;
      this.assassinmonUltimateTimer++;

      const target = this.enemies.find(e => e.id === this.musouTargetId);
      if (target && target.hp > 0) {
        this.musouSlashX = target.x + target.width / 2;
        this.musouSlashY = target.y + target.height / 2;
      }

      const areaRadius = 240;

      if (this.assassinmonUltimateTimer === 1) {
        let safePx = this.musouSlashX - 35;
        if (this.isSolid(safePx, this.py)) {
          safePx = this.musouSlashX + 15;
        }
        this.px = safePx;
        if (target) {
          this.py = target.y;
          this.pFacing = this.px < target.x ? 1 : -1;
        }

        this.cameraZoom = 1.85;
        this.cameraZoomTargetX = this.musouSlashX;
        this.cameraZoomTargetY = this.musouSlashY;

        let hitCount = 0;
        this.enemies.forEach(enemy => {
          if (enemy.hp > 0) {
            const dist = Math.hypot(enemy.x + enemy.width / 2 - this.musouSlashX, enemy.y + enemy.height / 2 - this.musouSlashY);
            if (dist <= areaRadius) {
              hitCount++;
              this.damageEnemy(enemy, Math.floor(this.stats.attack * 3.5));
              this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 16, '#c084fc');
            }
          }
        });

        soundService.playHit();
        const _ftKatana = FT_AREA_KATANA_SLASH(hitCount); this.addFloatingText(this.musouSlashX, this.musouSlashY - 15, _ftKatana.text, _ftKatana.color);
      }
      else if (this.assassinmonUltimateTimer === 12) {
        let hitCount = 0;
        this.enemies.forEach(enemy => {
          if (enemy.hp > 0) {
            const dist = Math.hypot(enemy.x + enemy.width / 2 - this.musouSlashX, enemy.y + enemy.height / 2 - this.musouSlashY);
            if (dist <= areaRadius) {
              hitCount++;
              this.damageEnemy(enemy, Math.floor(this.stats.attack * 2.0));
              this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12, '#ffffff');
            }
          }
        });
        soundService.playHit();
        this.screenShake = 24;
      }
      else if (this.assassinmonUltimateTimer >= 1 && this.assassinmonUltimateTimer <= 23) {
        if (this.assassinmonUltimateTimer % 3 === 0) {
          soundService.playHit();
          this.screenShake = 16;

          for (let p = 0; p < 8; p++) {
            this.particles.push({
              x: this.musouSlashX + (Math.random() - 0.5) * areaRadius * 1.5,
              y: this.musouSlashY + (Math.random() - 0.5) * areaRadius * 1.5,
              vx: (Math.random() - 0.5) * 14,
              vy: (Math.random() - 0.5) * 14,
              size: Math.random() * 8 + 3,
              color: p % 2 === 0 ? '#ffffff' : '#c084fc',
              life: 14,
              maxLife: 14
            });
          }
        }
      }
      else if (this.assassinmonUltimateTimer === 24) {
        soundService.playHit();
        this.screenShake = 45;

        let hitCount = 0;
        this.enemies.forEach(enemy => {
          if (enemy.hp > 0) {
            const dist = Math.hypot(enemy.x + enemy.width / 2 - this.musouSlashX, enemy.y + enemy.height / 2 - this.musouSlashY);
            if (dist <= areaRadius + 30) {
              hitCount++;
              this.damageEnemy(enemy, Math.floor(this.stats.attack * 6.5));
              enemy.stunnedTimer = 120;
              this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 22, '#e879f9');
            }
          }
        });

        for (let p = 0; p < 45; p++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 12 + 4;
          this.particles.push({
            x: this.musouSlashX,
            y: this.musouSlashY,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: Math.random() * 10 + 4,
            color: p % 3 === 0 ? '#ffffff' : p % 3 === 1 ? '#e879f9' : '#a855f7',
            life: 32,
            maxLife: 32
          });
        }

        const _ftShatter = FT_DIMENSIONAL_SHATTER(hitCount); this.addFloatingText(this.musouSlashX, this.musouSlashY - 75, _ftShatter.text, _ftShatter.color, true);
      }
      else if (this.assassinmonUltimateTimer >= 50) {
        this.px = this.musouOriginalPx;
        this.py = this.musouOriginalPy;
        this.pvx = 0;
        this.pvy = 0;
        this.musouSlashActive = false;
        this.cameraZoom = 1.0;
        this.assassinmonUltimateActive = false;
      }

      return;
    }

    for (let i = this.shadowAfterimages.length - 1; i >= 0; i--) {
      this.shadowAfterimages[i].alpha -= 0.08;
      if (this.shadowAfterimages[i].alpha <= 0) {
        this.shadowAfterimages.splice(i, 1);
      }
    }

    if (this.assassinmonDashActive) {
      this.assassinmonDashTimer--;
      this.pvx = this.pFacing * 18;
      this.pvy = 0;

      this.shadowAfterimages.push({
        x: this.px,
        y: this.py,
        facing: this.pFacing,
        alpha: 0.75
      });

      this.checkMeleeHit(this.px - 10, this.py - 5, this.pWidth + 40, this.pHeight + 10, Math.floor(this.stats.attack * 0.4));

      if (this.frameCount % 2 === 0) {
        this.particles.push({
          x: this.px + (this.pFacing === 1 ? 0 : this.pWidth),
          y: this.py + Math.random() * this.pHeight,
          vx: -this.pFacing * (Math.random() * 4 + 3),
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 5 + 2,
          color: Math.random() > 0.5 ? '#c084fc' : '#e879f9',
          life: 16,
          maxLife: 16
        });
      }

      if (this.assassinmonDashTimer <= 0) {
        this.assassinmonDashActive = false;
      }
    }

    if (this.jumpmonSpinActive) {
      this.jumpmonSpinTimer--;
      this.jumpmonSpinAngle += 0.55;

      this.particles.push({
        x: this.px + this.pWidth / 2 + (Math.random() - 0.5) * 30,
        y: this.py + this.pHeight / 2 + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 5 + 2,
        color: Math.random() > 0.5 ? '#fbbf24' : '#f97316',
        life: 14,
        maxLife: 14
      });
      if (this.jumpmonSpinTimer <= 0) {
        this.jumpmonSpinActive = false;
      }
    }

    if (this.jumpmonMeteorActive) {
      if (this.jumpmonMeteorState === 'charging') {
        this.jumpmonMeteorTimer--;

        this.cameraZoomTargetX = this.px + this.pWidth / 2;
        this.cameraZoomTargetY = this.py + this.pHeight / 2;

        this.particles.push({
          x: this.px + this.pWidth / 2 + (Math.random() - 0.5) * 20,
          y: this.py + this.pHeight / 2 + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 5 + 2,
          size: Math.random() * 7 + 3,
          color: '#f97316',
          life: 18,
          maxLife: 18
        });

        if (this.jumpmonMeteorTimer <= 0) {
          this.jumpmonMeteorState = 'plunging';
          this.pvy = 30;
          this.isPlunging = true;
        }
      } else if (this.jumpmonMeteorState === 'plunging') {
        this.pvy = 30;
        this.cameraZoomTargetX = this.px + this.pWidth / 2;
        this.cameraZoomTargetY = this.py + this.pHeight / 2;

        for (let p = 0; p < 3; p++) {
          this.particles.push({
            x: this.px + this.pWidth / 2 + (Math.random() - 0.5) * 16,
            y: this.py - 10,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 6 - 2,
            size: Math.random() * 8 + 4,
            color: p % 2 === 0 ? '#ef4444' : '#f97316',
            life: 20,
            maxLife: 20
          });
        }

        if (this.pGrounded || this.py + this.pHeight >= this.levelHeight - 32) {
          this.jumpmonMeteorState = 'impact';
          this.jumpmonImpactTimer = 30;
          this.jumpmonImpactX = this.px + this.pWidth / 2;
          this.jumpmonImpactY = this.py + this.pHeight;
          this.isPlunging = false;

          this.cameraZoom = 1.0;
          this.screenShake = 32;
          soundService.playHit();

          const groundY = this.py + this.pHeight;

          [-1, 1].forEach(dir => {
            for (let s = 1; s <= 2; s++) {
              this.projectiles.push({
                x: this.px + this.pWidth / 2,
                y: groundY - 20,
                vx: dir * (s * 5 + 3),
                vy: 0,
                width: 32,
                height: 32,
                isEnemy: false,
                damage: Math.floor(this.stats.attack * 2.2),
                color: '#f97316',
                type: 'fireball'
              });
            }
          });

          this.enemies.forEach(enemy => {
            const dx = Math.abs(this.px - enemy.x);
            if (dx < 700) {
              this.damageEnemy(enemy, Math.floor(this.stats.attack * 4.2));
              enemy.stunnedTimer = 90;
              this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20, '#f97316');
              this.addFloatingText(enemy.x, enemy.y - 75, FT_METEOR_IMPACT_RED.text, FT_METEOR_IMPACT_RED.color, true);

              for (let p = 0; p < 14; p++) {
                this.particles.push({
                  x: enemy.x + enemy.width / 2 + (Math.random() - 0.5) * 30,
                  y: enemy.y + enemy.height,
                  vx: (Math.random() - 0.5) * 5,
                  vy: -Math.random() * 10 - 4,
                  size: Math.random() * 9 + 4,
                  color: p % 2 === 0 ? '#f97316' : '#fef08a',
                  life: 30,
                  maxLife: 30
                });
              }
            }
          });

          for (let p = 0; p < 35; p++) {
            const ang = Math.random() * Math.PI - Math.PI;
            const spd = Math.random() * 12 + 4;
            this.particles.push({
              x: this.jumpmonImpactX,
              y: this.jumpmonImpactY,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd - 3,
              size: Math.random() * 10 + 4,
              color: p % 3 === 0 ? '#ef4444' : p % 3 === 1 ? '#f97316' : '#fef08a',
              life: 35,
              maxLife: 35
            });
          }
        }
      } else if (this.jumpmonMeteorState === 'impact') {
        this.jumpmonImpactTimer--;
        if (this.jumpmonImpactTimer <= 0) {
          this.jumpmonMeteorActive = false;
          this.jumpmonMeteorState = 'idle';
        }
      }
    }

    if (this.archermonUltActive) {
      this.archermonUltTimer--;
      this.pvx = 0;
      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;

      if (this.frameCount % 2 === 0) {
        this.particles.push({
          x: this.px + this.pWidth / 2 + (Math.random() - 0.5) * 30,
          y: this.py + Math.random() * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 6 - 4,
          size: Math.random() * 5 + 3,
          color: '#34d399',
          life: 18,
          maxLife: 18
        });
      }

      if (this.archermonUltTimer === 18) {
        soundService.playShoot();

        this.projectiles.push({
          x: this.px + this.pWidth / 2 - 6,
          y: this.py - 10,
          vx: 0,
          vy: -28,
          width: 12,
          height: 32,
          isEnemy: false,
          damage: Math.floor(this.stats.attack * 2.5),
          color: '#10b981',
          type: 'arrow'
        });

        this.spawnDustParticles(this.px + this.pWidth / 2, this.py, 16, '#34d399');
      }

      if (this.archermonUltTimer <= 0) {
        this.archermonUltActive = false;
        this.cameraZoom = 1.0;
        this.screenShake = 22;
        this.arrowShowerActive = true;
        this.arrowShowerDuration = 360;
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 75, FT_DOUBLE_ARROW_RAIN.text, FT_DOUBLE_ARROW_RAIN.color, true);
      }
    }

    if (this.arrowShowerActive) {
      this.arrowShowerDuration--;

      // Ambient sky-green shimmer every frame
      if (this.frameCount % 4 === 0) {
        const shimX = this.cameraX + Math.random() * this.canvas.width;
        const shimY = this.cameraY + Math.random() * 60;
        this.particles.push({
          x: shimX,
          y: shimY,
          vx: (Math.random() - 0.5) * 1.0,
          vy: Math.random() * 1.5 + 0.5,
          size: Math.random() * 5 + 2,
          color: Math.random() > 0.5 ? '#34d399' : '#6ee7b7',
          life: 18,
          maxLife: 18
        });
      }

      if (this.frameCount % 4 === 0) {
        soundService.playShoot();
        const viewLeft = this.cameraX - 50;
        const viewRight = this.cameraX + this.canvas.width + 50;

        // Fire 3 arrows per burst (up from 2)
        for (let a = 0; a < 3; a++) {
          const spawnX = viewLeft + Math.random() * (viewRight - viewLeft);
          const spawnY = this.cameraY - 40;
          const vy = Math.random() * 5 + 13;
          const arrowColor = a % 3 === 0 ? '#10b981' : a % 3 === 1 ? '#34d399' : '#6ee7b7';
          this.projectiles.push({
            x: spawnX,
            y: spawnY,
            vx: (Math.random() - 0.5) * 3.0,
            vy,
            width: 10,
            height: 26,
            isEnemy: false,
            damage: Math.floor(this.stats.attack * 1.2),
            color: arrowColor,
            type: 'arrow'
          });
          // Rich comet trail behind each arrow
          for (let t = 0; t < 5; t++) {
            this.particles.push({
              x: spawnX + (Math.random() - 0.5) * 6,
              y: spawnY + t * 8,
              vx: (Math.random() - 0.5) * 2.0,
              vy: -vy * 0.30,
              size: Math.random() * 5 + 2,
              color: t % 2 === 0 ? '#34d399' : '#a7f3d0',
              life: 16,
              maxLife: 16
            });
          }
          // Bright spark at spawn point
          this.particles.push({
            x: spawnX,
            y: spawnY,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 2 + 1,
            size: Math.random() * 6 + 3,
            color: '#ffffff',
            life: 8,
            maxLife: 8
          });
        }
      }

      if (this.arrowShowerDuration <= 0) {
        this.arrowShowerActive = false;
        // Closing burst
        for (let p = 0; p < 24; p++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 8 + 3;
          this.particles.push({
            x: this.px + this.pWidth / 2 + (Math.random() - 0.5) * 80,
            y: this.py + this.pHeight / 2,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: Math.random() * 7 + 3,
            color: p % 3 === 0 ? '#10b981' : p % 3 === 1 ? '#34d399' : '#a7f3d0',
            life: 22,
            maxLife: 22
          });
        }
      }
    }

    if (this.magemonUltActive) {
      this.magemonUltTimer--;
      this.pvx = 0;
      this.pvy = 0;
      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;

      // Orbiting elemental orbs — richer trails + inner ring
      for (let orb = 0; orb < 3; orb++) {
        const angle = this.frameCount * 0.18 + (orb * Math.PI * 2) / 3;
        const orbX = this.px + this.pWidth / 2 + Math.cos(angle) * 42;
        const orbY = this.py + this.pHeight / 2 + Math.sin(angle) * 42;
        const orbColor = orb === 0 ? '#06b6d4' : orb === 1 ? '#fbbf24' : '#ef4444';

        // Main orb dot
        this.particles.push({
          x: orbX,
          y: orbY,
          vx: 0,
          vy: 0,
          size: 8,
          color: orbColor,
          life: 3,
          maxLife: 3
        });

        // Comet tail behind each orb
        for (let t = 1; t <= 4; t++) {
          const trailAngle = angle - t * 0.12;
          const trailX = this.px + this.pWidth / 2 + Math.cos(trailAngle) * 42;
          const trailY = this.py + this.pHeight / 2 + Math.sin(trailAngle) * 42;
          this.particles.push({
            x: trailX,
            y: trailY,
            vx: 0,
            vy: 0,
            size: 8 - t * 1.6,
            color: orbColor,
            life: 3,
            maxLife: 3
          });
        }

        // Sparkle scatter from each orb
        if (this.frameCount % 4 === orb) {
          this.particles.push({
            x: orbX,
            y: orbY,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            size: Math.random() * 4 + 2,
            color: orbColor,
            life: 14,
            maxLife: 14
          });
        }
      }

      // Inner orbit ring (faster, smaller) — arcane
      for (let orb = 0; orb < 6; orb++) {
        const angle = -this.frameCount * 0.12 + (orb * Math.PI * 2) / 6;
        const orbX = this.px + this.pWidth / 2 + Math.cos(angle) * 22;
        const orbY = this.py + this.pHeight / 2 + Math.sin(angle) * 22;
        this.particles.push({
          x: orbX,
          y: orbY,
          vx: 0,
          vy: 0,
          size: 3,
          color: orb % 2 === 0 ? '#a855f7' : '#e879f9',
          life: 3,
          maxLife: 3
        });
      }

      // Mana eruption pulsing upward
      if (this.frameCount % 3 === 0) {
        this.particles.push({
          x: this.px + this.pWidth / 2 + (Math.random() - 0.5) * 20,
          y: this.py + this.pHeight / 2,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 5 + 3),
          size: Math.random() * 5 + 2,
          color: this.frameCount % 9 < 3 ? '#06b6d4' : this.frameCount % 9 < 6 ? '#fbbf24' : '#ef4444',
          life: 18,
          maxLife: 18
        });
      }

      if (this.magemonUltTimer === 45) {
        // Tornado burst — add spiral spin particles
        for (let sp = 0; sp < 20; sp++) {
          const sang = (sp / 20) * Math.PI * 2;
          this.particles.push({
            x: this.px + this.pWidth / 2 + Math.cos(sang) * 24,
            y: this.py + this.pHeight / 2 + Math.sin(sang) * 24,
            vx: Math.cos(sang) * (4 + Math.random() * 4),
            vy: Math.sin(sang) * (4 + Math.random() * 4),
            size: Math.random() * 6 + 3,
            color: sp % 2 === 0 ? '#06b6d4' : '#38bdf8',
            life: 20,
            maxLife: 20
          });
        }
        [-1, 1].forEach(dir => {
          this.projectiles.push({
            x: this.px + (dir === 1 ? this.pWidth : -24),
            y: this.py - 10,
            vx: dir * (this.stats.speed + 8),
            vy: 0,
            width: 40,
            height: 40,
            isEnemy: false,
            damage: Math.floor(this.stats.attack * 2.0),
            color: '#06b6d4',
            type: 'tornado'
          });
        });
      }

      if (this.magemonUltTimer === 30) {
        // Sun strike — bright golden flash ring
        for (let sp = 0; sp < 28; sp++) {
          const sang = (sp / 28) * Math.PI * 2;
          this.particles.push({
            x: this.px + this.pWidth / 2 + Math.cos(sang) * 30,
            y: this.py + this.pHeight / 2 + Math.sin(sang) * 30,
            vx: Math.cos(sang) * (5 + Math.random() * 3),
            vy: Math.sin(sang) * (5 + Math.random() * 3) - 2,
            size: Math.random() * 7 + 3,
            color: sp % 2 === 0 ? '#f59e0b' : '#fef08a',
            life: 22,
            maxLife: 22
          });
        }
        this.screenShake = 18;
        let targetsFound = 0;
        this.enemies.forEach(enemy => {
          if (enemy.hp > 0 && Math.abs(enemy.x - this.px) < 800) {
            targetsFound++;
            this.castSunStrikeAt(enemy.x + enemy.width / 2, enemy.y);
          }
        });

        if (targetsFound === 0) {
          const fallbackX = this.px + (this.pFacing === 1 ? this.pWidth + 200 : -200);
          this.castSunStrikeAt(fallbackX, this.py);
        }
      }

      if (this.magemonUltTimer === 15) {
        soundService.playHit();
        // Triple meteor — add pre-launch fire streaks
        [-150, 0, 150].forEach((offset, mi) => {
          const mx = this.px + this.pFacing * 100 + offset - (this.pFacing * 80);
          const my = Math.max(20, this.py - 220);
          // Meteor launch streaks
          for (let ms = 0; ms < 8; ms++) {
            this.particles.push({
              x: mx + (Math.random() - 0.5) * 30,
              y: my + (Math.random() - 0.5) * 30,
              vx: (Math.random() - 0.5) * 5,
              vy: -(Math.random() * 4 + 2),
              size: Math.random() * 6 + 3,
              color: ms % 2 === 0 ? '#f97316' : '#fef08a',
              life: 18,
              maxLife: 18
            });
          }
          this.projectiles.push({
            x: mx,
            y: my,
            vx: this.pFacing * 5.0,
            vy: 7.5,
            width: 44,
            height: 44,
            isEnemy: false,
            damage: Math.floor(this.stats.attack * 3.2),
            color: '#f97316',
            type: 'meteor'
          });
        });
      }

      if (this.magemonUltTimer <= 0) {
        this.magemonUltActive = false;
        this.cameraZoom = 1.0;
        this.screenShake = 36;
        // Grand finale burst
        for (let fp = 0; fp < 48; fp++) {
          const fang = Math.random() * Math.PI * 2;
          const fspd = Math.random() * 12 + 4;
          this.particles.push({
            x: this.px + this.pWidth / 2,
            y: this.py + this.pHeight / 2,
            vx: Math.cos(fang) * fspd,
            vy: Math.sin(fang) * fspd,
            size: Math.random() * 9 + 4,
            color: fp % 3 === 0 ? '#06b6d4' : fp % 3 === 1 ? '#fbbf24' : '#ef4444',
            life: 30,
            maxLife: 30
          });
        }
      }
    }

    if (this.shadowmonUltActive) {
      this.shadowmonUltTimer--;
      this.pvx = 0;
      this.pvy = 0;
      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;

      // Dark soul vortex charge — spiral inward rings + crimson columns
      if (this.frameCount % 2 === 0) {
        const vortexAng = this.frameCount * 0.28;
        for (let arm = 0; arm < 3; arm++) {
          const armAng = vortexAng + arm * (Math.PI * 2 / 3);
          const vortexR = 55 + Math.sin(this.frameCount * 0.1 + arm) * 10;
          this.particles.push({
            x: this.px + this.pWidth / 2 + Math.cos(armAng) * vortexR,
            y: this.py + this.pHeight / 2 + Math.sin(armAng) * vortexR * 0.5,
            vx: -Math.cos(armAng) * 3.5 - Math.sin(armAng) * 1.5,
            vy: -Math.sin(armAng) * 3.5 * 0.5 + Math.cos(armAng) * 0.8,
            size: Math.random() * 7 + 3,
            color: arm === 0 ? '#ef4444' : arm === 1 ? '#9f1239' : '#18181b',
            life: 18,
            maxLife: 18
          });
        }
        // Crimson rising pillars from beneath
        if (this.frameCount % 6 === 0) {
          const offset = (Math.random() - 0.5) * 50;
          this.particles.push({
            x: this.px + this.pWidth / 2 + offset,
            y: this.py + this.pHeight,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(5 + Math.random() * 6),
            size: Math.random() * 8 + 4,
            color: Math.random() > 0.5 ? '#ef4444' : '#7f1d1d',
            life: 22,
            maxLife: 22
          });
        }
      }

      if (this.shadowmonUltTimer <= 0) {
        this.shadowmonUltActive = false;
        this.cameraZoom = 1.0;
        this.screenShake = 48;
        soundService.playHit();

        const totalWaves = 1 + this.shadowmonUltStacksUsed;
        const waveDamage = Math.floor(this.stats.attack * 3.5);

        [-1, 1].forEach(dir => {
          for (let w = 0; w < totalWaves; w++) {
            const delay = w * 70;
            const yOffset = (w - (totalWaves - 1) / 2) * 16;
            setTimeout(() => {
              this.particles.push(...Array.from({ length: 12 }, () => ({
                x: this.px + this.pWidth / 2,
                y: this.py + this.pHeight / 2 + yOffset,
                vx: dir * (6 + Math.random() * 8),
                vy: (Math.random() - 0.5) * 5,
                size: Math.random() * 8 + 4,
                color: w % 2 === 0 ? '#ef4444' : '#9f1239',
                life: 22,
                maxLife: 22
              })));
              this.projectiles.push({
                x: this.px + (dir === 1 ? this.pWidth : -50),
                y: this.py - 30 + yOffset,
                vx: dir * (this.stats.speed + 9 + w * 1.5),
                vy: 0,
                width: 50 + w * 6,
                height: 110 + w * 8,
                isEnemy: false,
                damage: waveDamage,
                color: w % 2 === 0 ? '#ef4444' : '#9f1239',
                type: 'dark_energy' as any
              });
            }, delay);
          }
        });

        const _ftSoulB = FT_SOUL_BLAST_WAVES(totalWaves); this.addFloatingText(this.px + this.pWidth / 2, this.py - 75, _ftSoulB.text, _ftSoulB.color, true);

        this.shadowmonStacks = 0;
      }
    }

    if (this.shieldmonDashActive) {
      this.shieldmonDashTimer--;
      this.pvx = this.pFacing * 24.0;

      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        const dx = Math.abs(enemy.x + enemy.width / 2 - (this.px + this.pWidth / 2));
        const dy = Math.abs(enemy.y + enemy.height / 2 - (this.py + this.pHeight / 2));
        if (dx < 50 && dy < 50) {
          const hitSet = (this as any).shieldmonDashHitIds || ((this as any).shieldmonDashHitIds = new Set());
          if (!hitSet.has(enemy.id)) {
            hitSet.add(enemy.id);
            this.damageEnemy(enemy, Math.floor(this.stats.attack * 2.8));
            enemy.vx = this.pFacing * 12.0;
            enemy.vy = -5.0;
            this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 16, '#3b82f6');
            this.addFloatingText(enemy.x, enemy.y - 20, FT_TRAMPLED.text, FT_TRAMPLED.color);
          }
        }
      });

      if (this.frameCount % 2 === 0) {
        this.particles.push({
          x: this.px + (this.pFacing === 1 ? 0 : this.pWidth),
          y: this.py + this.pHeight - 4,
          vx: -this.pFacing * (Math.random() * 4 + 2),
          vy: -Math.random() * 4,
          size: Math.random() * 6 + 3,
          color: '#60a5fa',
          life: 16,
          maxLife: 16
        });
      }

      if (this.shieldmonDashTimer <= 0) {
        this.shieldmonDashActive = false;
        (this as any).shieldmonDashHitIds = null;
      }
    }

    if (this.thundermonDashActive) {
      this.thundermonDashTimer--;

      this.thundermonDashTrail.push({
        x: this.px,
        y: this.py,
        facing: this.pFacing,
        alpha: 1.0
      });
      if (this.thundermonDashTrail.length > 8) {
        this.thundermonDashTrail.shift();
      }

      if (this.frameCount % 2 === 0) {
        this.particles.push({
          x: this.px + Math.random() * this.pWidth,
          y: this.py + Math.random() * this.pHeight,
          vx: -this.pFacing * (Math.random() * 6 + 2),
          vy: (Math.random() - 0.5) * 4,
          size: Math.random() * 6 + 3,
          color: Math.random() > 0.5 ? '#06b6d4' : '#facc15',
          life: 14,
          maxLife: 14
        });
      }

      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        const dx = Math.abs((enemy.x + enemy.width / 2) - (this.px + this.pWidth / 2));
        const dy = Math.abs((enemy.y + enemy.height / 2) - (this.py + this.pHeight / 2));
        if (dx < 50 && dy < 50) {
          const hitSet = (this as any).thundermonDashHitIds || ((this as any).thundermonDashHitIds = new Set());
          if (!hitSet.has(enemy.id)) {
            hitSet.add(enemy.id);
            this.damageEnemy(enemy, Math.floor(this.stats.attack * 2.8));
            if (!enemy.isImmortal && enemy.type !== 'immortal_gladiator') {
              enemy.stunnedTimer = 30;
            }

            soundService.playHit();
            this.screenShake = 20;
            this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 20, FT_ELECTRIC_EXPLOSION.text, FT_ELECTRIC_EXPLOSION.color);

            for (let p = 0; p < 18; p++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = Math.random() * 8 + 3;
              this.particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                size: Math.random() * 6 + 3,
                color: p % 2 === 0 ? '#06b6d4' : '#facc15',
                life: 20,
                maxLife: 20
              });
            }
          }
        }
      });

      if (this.thundermonDashTimer <= 0) {
        this.thundermonDashActive = false;
        (this as any).thundermonDashHitIds = null;
        this.thundermonDashTrail = [];
      }
    }

    if (this.shieldmonChargeActive) {
      this.shieldmonChargeTimer--;
      this.pvx = 0;
      this.pvy = 0;
      this.pInvulnerableFrames = Math.max(this.pInvulnerableFrames, 5);

      if (this.shieldmonChargeTimer > 30) {
        const progress = (90 - this.shieldmonChargeTimer) / 60;
        this.shieldmonShieldY = this.shieldmonUltCastY - 500 + progress * 500;
      } else {
        this.shieldmonShieldY = this.shieldmonUltCastY;
      }

      if (this.shieldmonChargeTimer === 30) {
        this.screenShake = 50;
        soundService.playHit();

        for (let i = 0; i < 60; i++) {
          const ang = Math.random() * Math.PI * 2;

          const dist = Math.random() * this.shieldmonUltRadius;
          const px = this.shieldmonUltCastX + Math.cos(ang) * dist;
          const py = this.shieldmonUltCastY;
          this.particles.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 8 - 2,
            size: Math.random() * 8 + 3,
            color: i % 2 === 0 ? '#fbbf24' : '#60a5fa',
            life: 40,
            maxLife: 40
          });
        }

        if (!this.shieldmonUltDamageDealt) {
          this.shieldmonUltDamageDealt = true;
          this.enemies.forEach(enemy => {
            if (enemy.hp <= 0) return;
            const dist = Math.hypot(
              enemy.x + enemy.width / 2 - this.shieldmonUltCastX,
              enemy.y + enemy.height / 2 - this.shieldmonUltCastY
            );
            if (dist <= this.shieldmonUltRadius) {
              this.damageEnemy(enemy, Math.floor(this.stats.attack * 9.5));
              enemy.vx = (enemy.x + enemy.width / 2 > this.shieldmonUltCastX ? 1 : -1) * 8.0;
              enemy.vy = -12.0;
              this.addFloatingText(enemy.x, enemy.y - 30, FT_SHIELD_BURST.text, FT_SHIELD_BURST.color);
            }
          });
        }
      }

      if (this.shieldmonChargeTimer <= 0) {
        this.shieldmonChargeActive = false;
      }
    }

    if (this.selectedDraco === 'Shieldmon' && this.avatarActive && this.frameCount % 10 === 0) {
      const centerX = this.px + this.pWidth / 2;
      const centerY = this.py + this.pHeight / 2;
      const auraRadius = 160;

      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        const dist = Math.hypot(enemy.x + enemy.width / 2 - centerX, enemy.y + enemy.height / 2 - centerY);
        if (dist < auraRadius) {
          const pushAngle = Math.atan2(enemy.y + enemy.height / 2 - centerY, enemy.x + enemy.width / 2 - centerX);
          enemy.vx = Math.cos(pushAngle) * 8;
          enemy.vy = -3;
          this.damageEnemy(enemy, Math.floor(this.stats.attack * 0.6));
          this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 6, '#60a5fa');
        }
      });
    }

    if (this.isMegaPixelmon) {
      this.pEnergy = 0;
      this.megaPixelmonTimer--;
      if (this.megaPixelmonTimer > 240) {
        this.megaPixelmonScale = 1.0 + ((300 - this.megaPixelmonTimer) / 60) * 2.0;
      } else {
        this.megaPixelmonScale = 3.0;
      }

      this.destroyPlatformsAbovePixelmon();

      // Spams rapid multidirectional Tetris barrages while Mega Pixelmon is active!
      if (this.megaPixelmonTimer % 15 === 0 && this.megaPixelmonTimer > 20) {
        soundService.playShoot();
        const shapes = ['I', 'L', 'T', 'O', 'Z'];
        const colors = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#06b6d4'];
        const burstCount = 6;
        for (let b = 0; b < burstCount; b++) {
          const ang = (b / burstCount) * Math.PI * 2 + (this.megaPixelmonTimer * 0.1);
          const spd = this.stats.speed + 8;
          const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
          const chosenColor = colors[Math.floor(Math.random() * colors.length)];
          this.projectiles.push({
            x: this.px + this.pWidth / 2,
            y: this.py + this.pHeight / 2,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            width: 24,
            height: 24,
            isEnemy: false,
            damage: Math.floor(this.stats.attack * 1.8),
            color: chosenColor,
            type: 'tetris_block' as any,
            rangeCap: 800,
            startX: this.px,
            shape: chosenShape
          } as any);
        }
      }

      if (this.megaPixelmonTimer <= 0) {
        this.isMegaPixelmon = false;
        this.megaPixelmonScale = 1.0;
        soundService.playLevelUp();
        this.screenShake = 35;
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 40, '360° MEGA PIXEL EXPLOSION!', '#f43f5e');
        this.checkMeleeHit(this.px - 300, this.py - 300, 600, 600, Math.floor(this.stats.attack * 5.0));
        for (let p = 0; p < 50; p++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 14 + 4;
          this.particles.push({
            x: this.px + this.pWidth / 2,
            y: this.py + this.pHeight / 2,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: Math.random() * 10 + 4,
            color: p % 3 === 0 ? '#ec4899' : p % 3 === 1 ? '#eab308' : '#3b82f6',
            life: 30,
            maxLife: 30
          });
        }
      }
    }

    if (this.frozenDeathTimer > 0) {
      this.pvx = 0;
      this.pvy = 0;
      return;
    }

    if (this.electrocutionDeathTimer > 0) {
      this.pvx = 0;
      this.pvy = 0;
      return;
    }

    if (this.reaperDeathTimer > 0) {
      this.pvx = 0;
      this.pvy = 0;
      return;
    }

    if (this.shadowHazardCooldown > 0) {
      this.shadowHazardCooldown--;
    }

    if (this.playerStunnedTimer > 0) {
      this.playerStunnedTimer--;
      this.pvx = 0;
      if (this.frameCount % 12 === 0) {
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, FT_STUNNED.text, FT_STUNNED.color);
      }
      if (this.isChanneling) this.cancelChanneling('Stun');
      return;
    }

    if (this.isChanneling) {
      const isMovingInput =
        this.keys['a'] ||
        this.keys['d'] ||
        this.keys['w'] ||
        this.keys['s'] ||
        this.keys['arrowleft'] ||
        this.keys['arrowright'] ||
        this.keys['arrowup'] ||
        this.keys['arrowdown'] ||
        this.keys[' '];

      if (isMovingInput) {
        this.cancelChanneling('Movement');
      } else {
        this.channelingTimer--;
        (this as any).enigmonBlackHoleTimer = this.channelingTimer;
        if (this.channelingTimer <= 0) {
          this.isChanneling = false;
          this.channelingSpell = null;
          (this as any).enigmonBlackHoleActive = false;
        }
      }
    }

    if (this.playerRootedTimer > 0) {
      this.playerRootedTimer--;
      this.pvx = 0;
      if (this.pvy < 0) this.pvy = 0;
    }

    const pxMid = this.px + this.pWidth / 2;
    const pyMid = this.py + this.pHeight / 2;
    const pyFeet = this.py + this.pHeight - 2;
    const isOnVine = this.getTileSymbol(pxMid, pyMid) === 'V' || this.getTileSymbol(pxMid, pyFeet) === 'V';

    if (isOnVine) {
      const upPressed = this.keys['w'] || this.keys['arrowup'];
      const downPressed = this.keys['s'] || this.keys['arrowdown'];

      if (upPressed || downPressed) {
        this.isClimbing = true;
      }

      if (this.isClimbing) {
        this.pvy = 0;
        if (upPressed) this.pvy = -4.5;
        if (downPressed) this.pvy = 4.5;

        if (this.keys[' ']) {
          this.pvy = -this.stats.jump;
          this.isClimbing = false;
          soundService.playJump();
        }
      }
    } else {
      this.isClimbing = false;
    }

    const touchedVineTrap = this.getTileSymbol(pxMid, pyFeet) === 'R';
    if (touchedVineTrap && this.playerRootedTimer <= 0) {
      this.playerRootedTimer = 120;
      soundService.playHit();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_ROOTED.text, FT_ROOTED.color);
      this.spawnDustParticles(pxMid, pyFeet, 14, '#15803d');
    }

    const touchedSwamp = this.getTileSymbol(pxMid, pyFeet) === 'X' || this.getTileSymbol(this.px + 4, pyFeet) === 'X' || this.getTileSymbol(this.px + this.pWidth - 4, pyFeet) === 'X';
    if (touchedSwamp && this.pHP > 0) {
      this.pHP = 0;
      this.skeletonDeathTimer = 90;
      soundService.playLavaDeath();
      this.callbacks.onHpChange?.(0, this.pMaxHP);
      this.addFloatingText(pxMid, this.py - 20, FT_TOXIC_SWAMP.text, FT_TOXIC_SWAMP.color);

      for (let i = 0; i < 25; i++) {
        this.particles.push({
          x: pxMid + (Math.random() - 0.5) * 30,
          y: pyFeet,
          vx: (Math.random() - 0.5) * 5,
          vy: -Math.random() * 6 - 2,
          size: Math.random() * 8 + 4,
          color: i % 2 === 0 ? '#22c55e' : '#86efac',
          life: 30,
          maxLife: 30
        });
      }
    }

    const touchedHazardPool = this.getTileSymbol(pxMid, pyFeet) === '*' || this.getTileSymbol(this.px + 4, pyFeet) === '*' || this.getTileSymbol(this.px + this.pWidth - 4, pyFeet) === '*';
    if (touchedHazardPool && this.pHP > 0 && (this.skeletonDeathTimer || 0) <= 0 && (this.frozenDeathTimer || 0) <= 0 && (this.electrocutionDeathTimer || 0) <= 0 && (this.reaperDeathTimer || 0) <= 0 && (this.antimatterDeathTimer || 0) <= 0) {
      const themeType = this.level.theme.type;

      if (themeType === 'shadow') {
        if (this.shadowHazardCooldown <= 0) {
          this.shadowHazardCooldown = 30;
          const shadowDmg = 20;
          if (this.pHP <= shadowDmg) {
            this.pHP = 0;
            this.callbacks.onHpChange?.(0, this.pMaxHP);
            soundService.playScytheDeath();
            this.reaperDeathTimer = 90;
            this.pvx = 0;
            this.pvy = 0;
            this.screenShake = 25;
            this.addFloatingText(pxMid, this.py - 20, FT_REAPED_BY_DEATH.text, FT_REAPED_BY_DEATH.color);

            for (let i = 0; i < 30; i++) {
              this.particles.push({
                x: pxMid + (Math.random() - 0.5) * 40,
                y: pyFeet,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 7 - 2,
                size: Math.random() * 8 + 4,
                color: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#6b21a8' : '#ef4444',
                life: 35,
                maxLife: 35
              });
            }
          } else {
            this.pHP = Math.max(1, this.pHP - shadowDmg);
            this.callbacks.onHpChange?.(this.pHP, this.pMaxHP);
            soundService.playHit();
            const _ftShadowDmg = FT_SHADOW_CLOUD_DAMAGE(shadowDmg); this.addFloatingText(pxMid, this.py - 20, _ftShadowDmg.text, _ftShadowDmg.color);
            this.pvy = -8.5;
            this.pvx = -this.pFacing * 3.5;
            this.screenShake = 15;

            for (let i = 0; i < 15; i++) {
              this.particles.push({
                x: pxMid + (Math.random() - 0.5) * 30,
                y: pyFeet,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 6 - 2,
                size: Math.random() * 7 + 3,
                color: i % 2 === 0 ? '#a855f7' : '#c084fc',
                life: 25,
                maxLife: 25
              });
            }
          }
        }
      } else {
        this.pHP = 0;
        this.callbacks.onHpChange?.(0, this.pMaxHP);

        if (this.level.isUnderwater) {
          soundService.playLavaDeath();
          this.skeletonDeathTimer = 90;
          this.pvx = 0;
          this.pvy = 0;
          this.addFloatingText(pxMid, this.py - 20, FT_WHIRLPOOL.text, FT_WHIRLPOOL.color);

          for (let i = 0; i < 30; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = Math.random() * 5 + 2;
            this.particles.push({
              x: pxMid,
              y: pyFeet,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              size: Math.random() * 6 + 3,
              color: i % 2 === 0 ? '#06b6d4' : '#0891b2',
              life: 30,
              maxLife: 30
            });
          }
        } else if (themeType === 'temple') {
          soundService.playThunderboltDeath();
          this.electrocutionDeathTimer = 90;
          this.pvx = 0;
          this.pvy = 0;
          this.screenShake = 35;
          this.addFloatingText(pxMid, this.py - 20, FT_THUNDERSTRUCK.text, FT_THUNDERSTRUCK.color);

          for (let i = 0; i < 30; i++) {
            this.particles.push({
              x: pxMid + (Math.random() - 0.5) * 40,
              y: pyFeet,
              vx: (Math.random() - 0.5) * 6,
              vy: -Math.random() * 8 - 2,
              size: Math.random() * 8 + 4,
              color: i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#eab308' : '#38bdf8',
              life: 35,
              maxLife: 35
            });
          }
        } else if (themeType === 'ice') {
          soundService.playIceDeath();
          this.frozenDeathTimer = 999999;
          this.pvx = 0;
          this.pvy = 0;
          this.addFloatingText(pxMid, this.py - 20, FT_ABSOLUTE_FROZEN.text, FT_ABSOLUTE_FROZEN.color);

          for (let i = 0; i < 25; i++) {
            this.particles.push({
              x: pxMid + (Math.random() - 0.5) * 30,
              y: pyFeet,
              vx: (Math.random() - 0.5) * 5,
              vy: -Math.random() * 6 - 2,
              size: Math.random() * 8 + 4,
              color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#7dd3fc' : '#38bdf8',
              life: 30,
              maxLife: 30
            });
          }

          setTimeout(() => {
            this.callbacks.onPlayerDeath();
          }, 1000);
        } else if (themeType === 'space') {
          soundService.playHit();
          this.antimatterDeathTimer = 90;
          this.pvx = 0;
          this.pvy = 0;
          this.screenShake = 30;
          this.addFloatingText(pxMid, this.py - 20, FT_DISSOLVED_ANTIMATTER.text, FT_DISSOLVED_ANTIMATTER.color);

          for (let i = 0; i < 30; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = Math.random() * 6 + 2;
            this.particles.push({
              x: pxMid + (Math.random() - 0.5) * 20,
              y: pyFeet - Math.random() * this.pHeight,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd - 2,
              size: Math.random() * 7 + 3,
              color: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#e879f9' : '#a5f3fc',
              life: 35,
              maxLife: 35
            });
          }
        } else {
          soundService.playLavaDeath();
          this.skeletonDeathTimer = 90;
          this.addFloatingText(pxMid, this.py - 20, FT_MOLTEN_LAVA_MELTED.text, FT_MOLTEN_LAVA_MELTED.color);

          for (let i = 0; i < 25; i++) {
            this.particles.push({
              x: pxMid + (Math.random() - 0.5) * 30,
              y: pyFeet,
              vx: (Math.random() - 0.5) * 5,
              vy: -Math.random() * 6 - 2,
              size: Math.random() * 8 + 4,
              color: i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#f97316' : '#ef4444',
              life: 30,
              maxLife: 30
            });
          }
        }
      }
    }

    // Stage 13 Lunar Palace - Lunar Beam Gimmick
    if (this.stageNum === 13 && !this.isPaused && this.pHP > 0) {
      this.lunarBeamTimer--;
      if (this.lunarBeamTimer <= 0) {
        this.lunarBeamTimer = 90; // 1.5 second total cycle (more beams!)

        // Pick random start X near player and downward angle
        this.lunarBeamStartX = this.px + (Math.random() - 0.5) * 800;
        this.lunarBeamStartY = 0;
        this.lunarBeamAngle = Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 3);

        // Raycast down to find end point (blocked by platforms/ground)
        let curX = this.lunarBeamStartX;
        let curY = this.lunarBeamStartY;
        const step = 8;
        const maxSteps = 200;
        for (let s = 0; s < maxSteps; s++) {
          curX += Math.cos(this.lunarBeamAngle) * step;
          curY += Math.sin(this.lunarBeamAngle) * step;
          if (curY >= this.levelHeight || this.isSolid(curX, curY) || this.checkPlatformOneWay(curX, curY)) {
            break;
          }
        }
        this.lunarBeamEndX = curX;
        this.lunarBeamEndY = curY;
      }

      // Impact phase: last 30 frames (0.5s) of the 150-frame cycle
      if (this.lunarBeamTimer > 0 && this.lunarBeamTimer <= 30) {
        const pCenterX = this.px + this.pWidth / 2;
        const pCenterY = this.py + this.pHeight / 2;
        const dist = this.distToSegment(
          pCenterX, pCenterY,
          this.lunarBeamStartX, this.lunarBeamStartY,
          this.lunarBeamEndX, this.lunarBeamEndY
        );

        if (dist < 22 && this.pInvulnerableFrames <= 0) {
          this.handlePlayerHit(18, this.lunarBeamStartX); // Deal 18 damage
        }
      }
    }

    stageGimmickManager.update(
      this.level.theme.type,
      this.px,
      this.py,
      this.pWidth,
      this.pHeight,
      this.pHP,
      this.pMaxHP,
      this.getActiveGrid(),
      this.level.tileSize,
      this.enemies,
      {
        onDamagePlayer: (dmg, reason) => {
          this.pHP = Math.max(0, this.pHP - dmg);
          this.callbacks.onHpChange?.(this.pHP, this.pMaxHP);
          if (this.pHP <= 0) {
            this.callbacks.onPlayerDeath();
          }
        },
        onInstaKillPlayer: (reason) => {
          if (this.pHP <= 0 && (this.electrocutionDeathTimer > 0 || this.skeletonDeathTimer > 0 || this.reaperDeathTimer > 0 || this.antimatterDeathTimer > 0)) return;
          this.pHP = 0;
          this.callbacks.onHpChange?.(0, this.pMaxHP);

          if (reason.includes('Thunderbolt')) {
            soundService.playThunderboltDeath();
            this.electrocutionDeathTimer = 90;
            this.screenShake = 35;
            this.pvx = 0;
            this.pvy = 0;
          } else if (reason.includes('Meteor')) {
            soundService.playLavaDeath();
            this.skeletonDeathTimer = 90;
            this.screenShake = 40;
            this.pvx = 0;
            this.pvy = 0;
          } else if (reason.includes('Antimatter') || reason.includes('Disintegrated')) {
            soundService.playHit();
            this.antimatterDeathTimer = 90;
            this.screenShake = 30;
            this.pvx = 0;
            this.pvy = 0;
            const pxMid = this.px + this.pWidth / 2;
            for (let i = 0; i < 30; i++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = Math.random() * 7 + 2;
              this.particles.push({
                x: pxMid + (Math.random() - 0.5) * 20,
                y: this.py + Math.random() * this.pHeight,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - 2,
                size: Math.random() * 7 + 3,
                color: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#e879f9' : '#a5f3fc',
                life: 35,
                maxLife: 35
              });
            }
          } else {
            this.callbacks.onPlayerDeath();
          }
        },
        addFloatingText: (x, y, text, color) => this.addFloatingText(x, y, text, color),
        spawnParticles: (x, y, color, count) => this.spawnDustParticles(x, y, count, color),
        setGridTile: (r, c, char) => {
          const grid = this.getActiveGrid();
          if (grid[r] && c >= 0 && c < grid[r].length) {
            grid[r] = grid[r].substring(0, c) + char + grid[r].substring(c + 1);
          }
        },
        onDestroyPickups: (r, c) => {
          const ts = this.level.tileSize;
          const px = c * ts + ts / 2;
          const py = r * ts + ts / 2;
          this.pickups.forEach(p => {
            if (!p.collected && Math.hypot(p.x + p.width / 2 - px, p.y + p.height / 2 - py) < ts) {
              p.collected = true;
              this.spawnDustParticles(p.x + p.width / 2, p.y + p.height / 2, 8, '#ef4444');
            }
          });
        },
        onPullPlayer: (fx, fy) => {
          this.pvx += fx;
          this.pvy += fy;
        }
      },
      this.stageNum
    );

    let speedMultiplier = 1.0;
    if (stageGimmickManager.playerSlowTimer > 0) {
      speedMultiplier *= 0.5;
    }

    if (this.shieldmonChargeActive) {
      this.pvx = 0;
      this.pvy = 0;
    } else if (this.shieldmonDashActive) {
      this.pvx = this.pFacing * 22.0;
    } else if (this.selectedDraco === 'Shieldmon' && this.shieldActive && this.shieldDuration > 90) {
      this.pvx = this.pFacing * 9.5;

      this.checkMeleeHit(this.px - 10, this.py, this.pWidth + 20, this.pHeight, Math.floor(this.stats.attack * 0.45));

      if (this.frameCount % 2 === 0) {
        this.particles.push({
          x: this.px + (this.pFacing === 1 ? 0 : this.pWidth),
          y: this.py + Math.random() * this.pHeight,
          vx: -this.pFacing * 1.5,
          vy: Math.random() * 2 - 1,
          size: Math.random() * 4 + 2,
          color: '#3b82f6',
          life: 15,
          maxLife: 15
        });
      }
    } else {
      const effectiveSpeed = Math.min(20, this.stats.speed);
      if (this.keys['a'] || this.keys['arrowleft']) {
        this.pvx -= (effectiveSpeed * 0.08) * speedMultiplier;
        this.pFacing = -1;
      } else if (this.keys['d'] || this.keys['arrowright']) {
        this.pvx += (effectiveSpeed * 0.08) * speedMultiplier;
        this.pFacing = 1;
      }
    }

    if (this.level.isUnderwater) {
      const grid = this.getActiveGrid();
      const ts = this.level.tileSize;
      const pxMid = this.px + this.pWidth / 2;
      const pyMid = this.py + this.pHeight / 2;

      let pullVx = 0;
      let pullVy = 0;
      const maxPullRadius = 5 * ts;
      const maxPullForce = 0.7; // Reduced by 80% (originally 3.5)

      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (grid[r][c] === '*') {
            const wx = c * ts + ts / 2;
            const wy = r * ts + ts / 2;
            const dx = wx - pxMid;
            const dy = wy - pyMid;
            const dist = Math.hypot(dx, dy);

            if (dist < maxPullRadius) {
              const intensity = 1 - dist / maxPullRadius;
              const force = intensity * maxPullForce;
              pullVx += (dx / dist) * force;
              pullVy += (dy / dist) * force;
            }
          }
        }
      }

      if (pullVx !== 0 || pullVy !== 0) {
        const totalPull = Math.hypot(pullVx, pullVy);
        if (totalPull > maxPullForce) {
          pullVx = (pullVx / totalPull) * maxPullForce;
          pullVy = (pullVy / totalPull) * maxPullForce;
        }
        this.pvx += pullVx;
        this.pvy += pullVy;

        if (this.frameCount % 5 === 0) {
          this.particles.push({
            x: pxMid + (Math.random() - 0.5) * 20,
            y: pyMid + (Math.random() - 0.5) * 20,
            vx: pullVx * 0.8,
            vy: pullVy * 0.8,
            size: Math.random() * 3 + 1,
            color: '#a5f3fc',
            life: 15,
            maxLife: 15
          });
        }
      }
    }

    if (!this.shieldmonChargeActive && !this.shieldmonDashActive) {
      this.pvx *= this.friction;
      if (Math.abs(this.pvx) < 0.1) this.pvx = 0;
    }

    if (this.shieldmonChargeActive) {
      this.pvy = 0;
    } else {
      this.pvy += this.gravity;
    }
    if (this.pvy > 10) this.pvy = 10;
    if (this.pvy < -14) this.pvy = -14;

    const newPx = Math.max(0, Math.min(this.levelWidth - this.pWidth, this.px + this.pvx));
    if (this.pvx !== 0) {
      const leftEdge = newPx;
      const rightEdge = newPx + this.pWidth;
      const topEdge = this.py + 4;
      const bottomEdge = this.py + this.pHeight - 4;

      const collidesLeft = this.isSolid(leftEdge, topEdge) || this.isSolid(leftEdge, bottomEdge);
      const collidesRight = this.isSolid(rightEdge, topEdge) || this.isSolid(rightEdge, bottomEdge);

      if (!collidesLeft && !collidesRight) {
        this.px = newPx;
      } else {
        this.pvx = 0;
      }
    } else {
      // Keep clamped even if not moving (e.g. from knockback/teleports)
      this.px = Math.max(0, Math.min(this.levelWidth - this.pWidth, this.px));
    }

    let newPy = this.py + this.pvy;
    if (newPy < 0) {
      newPy = 0;
      this.pvy = 0;
    }
    const leftEdge = this.px + 4;
    const rightEdge = this.px + this.pWidth - 4;
    const ts = this.level.tileSize;
    const isDropKey = this.keys['s'] || this.keys['arrowdown'];

    if (this.pvy < 0) {
      const topEdge = newPy;
      const collidesTop = this.isSolid(leftEdge, topEdge) || this.isSolid(rightEdge, topEdge);
      if (collidesTop) {
        this.py = Math.floor(topEdge / ts + 1) * ts;
        this.pvy = 0;
      } else {
        this.py = newPy;
      }
      this.pGrounded = false;
    } else {
      const newBottom = newPy + this.pHeight;
      const oldBottom = this.py + this.pHeight;

      const collidesSolidBottom = this.isSolid(leftEdge, newBottom) || this.isSolid(rightEdge, newBottom);

      let onPlatform = false;
      let platformTopY = 0;

      if (!collidesSolidBottom && !isDropKey) {
        const platformLeft = this.checkPlatformOneWay(leftEdge, newBottom);
        const platformRight = this.checkPlatformOneWay(rightEdge, newBottom);

        if (platformLeft || platformRight) {
          const tileRow = Math.floor(newBottom / ts);
          platformTopY = tileRow * ts;

          if (oldBottom <= platformTopY + 12) {
            onPlatform = true;
          }
        }
      }

      const wasPlunging = this.isPlunging;

      if (this.selectedDraco === 'Jumpmon' && !this.pGrounded && this.pvy > 1.5) {
        this.isPlunging = true;
      }

      if (collidesSolidBottom) {
        this.py = Math.floor(newBottom / ts) * ts - this.pHeight;
        this.pvy = 0;
        this.pGrounded = true;
        this.jumpCount = 0;
      } else if (onPlatform) {
        this.py = platformTopY - this.pHeight;
        this.pvy = 0;
        this.pGrounded = true;
        this.jumpCount = 0;
      } else {
        this.py = newPy;
        this.pGrounded = false;
      }

      if (wasPlunging && this.pGrounded && this.selectedDraco === 'Jumpmon') {
        this.isPlunging = false;
        soundService.playHit();
        const shockwaveDamage = Math.floor(this.stats.attack * 2.2);
        this.checkMeleeHit(this.px - 40, this.py - 10, this.pWidth + 80, this.pHeight + 20, shockwaveDamage);

        for (let i = -8; i <= 8; i++) {
          this.particles.push({
            x: this.px + this.pWidth / 2 + i * 5,
            y: this.py + this.pHeight - 4,
            vx: i * 1.2,
            vy: -Math.random() * 3 - 1,
            size: Math.random() * 6 + 4,
            color: i % 2 === 0 ? '#f59e0b' : '#ef4444',
            life: 20,
            maxLife: 20
          });
        }
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_GROUND_SHOCKWAVE.text, FT_GROUND_SHOCKWAVE.color);
      }
    }

    if (this.selectedDraco === 'Jumpmon' && this.isPlunging && !this.pGrounded && this.pvy > 0) {
      if (Math.random() < 0.7) {
        this.spawnDustParticles(
          this.px + Math.random() * this.pWidth,
          this.py + this.pHeight,
          2,
          '#f59e0b'
        );
      }

      const effectiveJump = Math.max(10, this.stats.jump);
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0) continue;

        if (
          this.px < enemy.x + enemy.width &&
          this.px + this.pWidth > enemy.x &&
          this.py + this.pHeight >= enemy.y &&
          this.py <= enemy.y + enemy.height
        ) {
          const plungeDamage = Math.floor(this.stats.attack * 2.8);
          this.damageEnemy(enemy, plungeDamage);

          this.pvy = -effectiveJump * 1.25;
          this.jumpCount = 1;
          this.isPlunging = false;
          soundService.playJump();

          this.spawnDustParticles(this.px + this.pWidth / 2, enemy.y, 18, '#ef4444');
          this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, FT_BOUNCE_STRIKE.text, FT_BOUNCE_STRIKE.color);
          break;
        }
      }
    }

    if (this.py > this.levelHeight + 50 && this.pHP > 0) {
      this.pHP = 0;
      this.callbacks.onHpChange?.(0, this.pMaxHP);
      soundService.playHit();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, FT_FELL_VOID.text, FT_FELL_VOID.color);
      this.callbacks.onPlayerDeath();
    }

    const tLeft = this.px + 4;
    const tRight = this.px + this.pWidth - 4;
    const tBottom = this.py + this.pHeight;
    if (this.pvy >= -2 && this.trampolineCooldown <= 0 && (this.checkTrampoline(tLeft, tBottom) || this.checkTrampoline(tRight, tBottom))) {
      soundService.playJump();
      this.pvy = -16;
      this.pGrounded = false;
      this.jumpCount = 1;
      this.trampolineCooldown = 15;
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, FT_BOING.text, FT_BOING.color);

      for (let i = 0; i < 8; i++) {
        this.particles.push({
          x: this.px + this.pWidth / 2,
          y: this.py + this.pHeight,
          vx: Math.random() * 4 - 2,
          vy: -Math.random() * 3 - 1,
          size: Math.random() * 4 + 2,
          color: '#38bdf8',
          life: 15,
          maxLife: 15
        });
      }
    }

    this.checkLandmineDetonation(this.px + this.pWidth / 2, this.py + this.pHeight - 4);

    const pxMidHazard = this.px + this.pWidth / 2;
    const pyBottom = this.py + this.pHeight - 2;
    const hazard = this.getHazard(pxMidHazard, pyBottom) || this.getHazard(this.px + 4, pyBottom) || this.getHazard(this.px + this.pWidth - 4, pyBottom);
    if (hazard === 'spike') {
      this.handlePlayerHit(5, pxMidHazard);
    }
  }

  private updateEntities() {
    const ts = this.level.tileSize;

    this.pickups.forEach(pickup => {
      if (pickup.collected) return;
      if (
        this.px < pickup.x + pickup.width &&
        this.px + this.pWidth > pickup.x &&
        this.py < pickup.y + pickup.height &&
        this.py + this.pHeight > pickup.y
      ) {
        pickup.collected = true;
        soundService.playCoin();
        this.spawnDustParticles(pickup.x + pickup.width / 2, pickup.y + pickup.height / 2, 8, '#fbbf24');

        if (pickup.type === 'coin') {
          this.callbacks.onCoinCollect(pickup.amount);
          const _ftCoin = FT_COIN_PICKUP(pickup.amount); this.addFloatingText(pickup.x, pickup.y, _ftCoin.text, _ftCoin.color);
        } else if (pickup.type === 'potion') {
          this.callbacks.onItemCollect('potion');
          this.addFloatingText(pickup.x, pickup.y, FT_POTION_PICKUP.text, FT_POTION_PICKUP.color);
        } else if (pickup.type === 'upgrade_stone') {
          this.callbacks.onItemCollect('upgrade_stone');
          this.addFloatingText(pickup.x, pickup.y, FT_UPGRADE_STONE_PICKUP.text, FT_UPGRADE_STONE_PICKUP.color);
        }
      }
    });

    this.projectiles.forEach((proj, index) => {
      if ((proj as any).life !== undefined) {
        (proj as any).life--;
        if ((proj as any).life <= 0) {
          this.projectiles.splice(index, 1);
          return;
        }
      }

      if ((proj as any).type === 'dark_matter') {
        proj.x += proj.vx;
        proj.y += proj.vy;
        if (this.frameCount % 2 === 0) {
          this.particles.push({
            x: proj.x + proj.width / 2,
            y: proj.y + proj.height / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 4 + 2,
            color: '#c084fc',
            life: 10,
            maxLife: 10
          });
        }
        const distTraveled = Math.abs(proj.x - ((proj as any).startX || proj.x));
        if (distTraveled >= ((proj as any).rangeCap || 500)) {
          this.spawnDustParticles(proj.x + proj.width / 2, proj.y + proj.height / 2, 6, '#c084fc');
          this.projectiles.splice(index, 1);
          return;
        }
      }

      if ((proj as any).type === 'crescent_beam') {
        proj.x += proj.vx;
        proj.y += proj.vy;
        if (this.frameCount % 2 === 0) {
          this.particles.push({
            x: proj.x + proj.width / 2,
            y: proj.y + proj.height / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 4 + 2,
            color: '#93c5fd',
            life: 10,
            maxLife: 10
          });
        }
        const distTraveled = Math.abs(proj.x - ((proj as any).startX || proj.x));
        if (distTraveled >= ((proj as any).rangeCap || 800)) {
          this.spawnDustParticles(proj.x + proj.width / 2, proj.y + proj.height / 2, 6, '#93c5fd');
          this.projectiles.splice(index, 1);
          return;
        }
      }

      if ((proj as any).type === 'wisp_orb') {
        if ((proj as any).homingTimer > 0) {
          (proj as any).homingTimer--;
          const targetX = this.px + this.pWidth / 2;
          const targetY = this.py + this.pHeight / 2;
          const dx = targetX - (proj.x + proj.width / 2);
          const dy = targetY - (proj.y + proj.height / 2);
          const dist = Math.hypot(dx, dy) || 1;
          const spd = (proj as any).speed || 6.0;
          proj.vx = (dx / dist) * spd;
          proj.vy = (dy / dist) * spd;
        }

        proj.x += proj.vx;
        proj.y += proj.vy;

        if (this.frameCount % 2 === 0) {
          this.particles.push({
            x: proj.x + proj.width / 2,
            y: proj.y + proj.height / 2,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 4 + 2,
            color: (proj as any).homingTimer > 0 ? '#38bdf8' : '#fef08a',
            life: 10,
            maxLife: 10
          });
        }

        if (this.isSolid(proj.x, proj.y) || proj.x < 0 || proj.x > this.levelWidth || proj.y < 0 || proj.y > this.levelHeight) {
          this.spawnDustParticles(proj.x + proj.width / 2, proj.y + proj.height / 2, 6, '#38bdf8');
          this.projectiles.splice(index, 1);
          return;
        }

        if (proj.isEnemy) {
          if (
            proj.x < this.px + this.pWidth &&
            proj.x + proj.width > this.px &&
            proj.y < this.py + this.pHeight &&
            proj.y + proj.height > this.py
          ) {
            this.handlePlayerHit(proj.damage, proj.x);
            this.spawnDustParticles(proj.x + proj.width / 2, proj.y + proj.height / 2, 8, '#38bdf8');
            this.projectiles.splice(index, 1);
            return;
          }
        }
        return;
      }

      if ((proj as any).type === 'alien_laser') {
        const pxMid = this.px + this.pWidth / 2;
        const pyMid = this.py + this.pHeight / 2;
        const angle = Math.atan2(pyMid - proj.y, pxMid - proj.x);
        proj.vx = Math.cos(angle) * 7.5;
        proj.vy = Math.sin(angle) * 7.5;
        proj.x += proj.vx;
        proj.y += proj.vy;

        if (this.frameCount % 2 === 0) {
          this.particles.push({
            x: proj.x,
            y: proj.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 2,
            color: '#a855f7',
            life: 8,
            maxLife: 8
          });
        }
      }

      if ((proj as any).type === 'homing_bomb') {
        let nearestEnemy: Enemy | null = null;
        let minDistance = 1000;
        this.enemies.forEach(enemy => {
          if (enemy.hp <= 0) return;
          const dist = Math.hypot(enemy.x + enemy.width / 2 - (proj.x + proj.width / 2), enemy.y + enemy.height / 2 - (proj.y + proj.height / 2));
          if (dist < minDistance) {
            minDistance = dist;
            nearestEnemy = enemy;
          }
        });

        if (nearestEnemy) {
          const angle = Math.atan2((nearestEnemy as Enemy).y + (nearestEnemy as Enemy).height / 2 - proj.y, (nearestEnemy as Enemy).x + (nearestEnemy as Enemy).width / 2 - proj.x);
          proj.vx = Math.cos(angle) * 9.0;
          proj.vy = Math.sin(angle) * 9.0;
        } else {
          proj.vy = (proj.vy || -3.5) + 0.25;
        }

        proj.x += proj.vx;
        proj.y += proj.vy;

        if (this.frameCount % 2 === 0) {
          this.particles.push({
            x: proj.x + proj.width / 2,
            y: proj.y + proj.height / 2,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: Math.random() * 5 + 2,
            color: '#ea580c',
            life: 12,
            maxLife: 12
          });
        }

        const hitSolid = this.isSolid(proj.x + proj.width / 2, proj.y + proj.height) || this.checkPlatformOneWay(proj.x + proj.width / 2, proj.y + proj.height) || proj.x < 0 || proj.x > this.levelWidth || proj.y > this.levelHeight;
        if (hitSolid) {
          soundService.playHit();
          this.screenShake = 18;

          const dropX = proj.x + proj.width / 2;
          let groundY = this.levelHeight - 40;
          const ts = this.level.tileSize;
          const col = Math.floor(dropX / ts);

          const grid = this.getActiveGrid();
          if (grid.length > 0 && col >= 0 && col < (grid[0]?.length || 0)) {
            const startRow = Math.max(0, Math.floor(proj.y / ts));
            for (let r = startRow; r < grid.length; r++) {
              const char = grid[r][col];
              if (char === '#' || char === '=') {
                groundY = r * ts;
                break;
              }
            }
          }

          this.groundBurnZones.push({
            id: this.groundBurnIdCounter++,
            x: dropX - 60,
            y: groundY,
            width: 120,
            height: 20,
            timer: 120,
            duration: 120
          });

          this.enemies.forEach(enemy => {
            if (enemy.hp <= 0) return;
            const dist = Math.hypot(enemy.x + enemy.width / 2 - proj.x, enemy.y + enemy.height / 2 - proj.y);
            if (dist <= 100) {
              this.damageEnemy(enemy, proj.damage);
              enemy.burnTimer = 30;
              enemy.burnLingerTimer = 120;
            }
          });

          for (let p = 0; p < 24; p++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = Math.random() * 8 + 2;
            this.particles.push({
              x: proj.x + proj.width / 2,
              y: proj.y + proj.height / 2,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd - 2,
              size: Math.random() * 7 + 3,
              color: p % 2 === 0 ? '#ea580c' : '#f59e0b',
              life: 20,
              maxLife: 20
            });
          }

          this.projectiles.splice(index, 1);
          return;
        }
      } else if ((proj as any).type === 'bomb') {
        proj.vy = (proj.vy || 0) + 0.24;

        const nextX = proj.x + proj.vx;
        if (this.isSolid(nextX, proj.y) || nextX < 0 || nextX > this.levelWidth) {
          proj.vx = -proj.vx * 0.65;
        } else {
          proj.x = nextX;
        }

        const nextY = proj.y + proj.vy;
        if (this.isSolid(proj.x, nextY + proj.height)) {
          proj.vy = -Math.abs(proj.vy) * 0.55;
          proj.vx *= 0.8;
          if (Math.abs(proj.vy) < 0.8) proj.vy = 0;
        } else {
          proj.y = nextY;
        }

        if ((proj as any).timer !== undefined) {
          (proj as any).timer--;
          if ((proj as any).timer <= 0) {
            soundService.playHit();
            for (let i = 0; i < 15; i++) {
              this.particles.push({
                x: proj.x + proj.width / 2,
                y: proj.y + proj.height / 2,
                vx: Math.random() * 5 - 2.5,
                vy: Math.random() * -4 - 1,
                size: Math.random() * 6 + 4,
                color: i % 2 === 0 ? '#f97316' : '#ef4444',
                life: 25,
                maxLife: 25
              });
            }

            const dx = Math.abs(this.px + this.pWidth / 2 - (proj.x + proj.width / 2));
            const dy = Math.abs(this.py + this.pHeight / 2 - (proj.y + proj.height / 2));
            if (dx < 70 && dy < 70) {
              this.handlePlayerHit(proj.damage, proj.x);
            }

            this.projectiles.splice(index, 1);
            return;
          }
        }
      } else if (!proj.isEnemy) {
        if (proj.type === 'meteor') {
          proj.x += proj.vx;
          proj.y += proj.vy;

          if (this.frameCount % 2 === 0) {
            this.particles.push({
              x: proj.x + proj.width / 2,
              y: proj.y + proj.height / 2,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              size: Math.random() * 6 + 3,
              color: '#f97316',
              life: 15,
              maxLife: 15
            });
          }

          if (this.isSolid(proj.x + proj.width / 2, proj.y + proj.height) || proj.y > this.levelHeight - 40) {
            soundService.playHit();

            this.checkMeleeHit(proj.x - 40, proj.y - 20, 120, 60, proj.damage);
            this.spawnDustParticles(proj.x + proj.width / 2, proj.y + proj.height, 20, '#f97316');
            this.addFloatingText(proj.x, proj.y - 10, FT_METEOR_IMPACT_ORANGE.text, FT_METEOR_IMPACT_ORANGE.color);

            this.projectiles.push({
              x: proj.x,
              y: proj.y - 10,
              vx: (proj.vx > 0 ? 1 : -1) * 4.5,
              vy: 0,
              width: 48,
              height: 24,
              isEnemy: false,
              damage: Math.floor(proj.damage * 0.6),
              color: '#ef4444',
              type: 'fireball'
            });

            this.projectiles.splice(index, 1);
            return;
          }
        }
        else if (proj.type === 'sun_strike') {
          if (proj.channelTimer && proj.channelTimer > 0) {
            proj.channelTimer--;

            if (this.frameCount % 2 === 0) {
              this.particles.push({
                x: proj.targetX! + (Math.random() - 0.5) * 44,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 5 - 3,
                size: Math.random() * 5 + 2,
                color: '#fef08a',
                life: 15,
                maxLife: 15
              });
            }

            if (proj.channelTimer === 0) {
              soundService.playShoot();
              (proj as any).isExploding = true;
              (proj as any).explosionTimer = 20;
              this.addFloatingText(proj.targetX! - 20, this.py - 20, FT_SOLAR_EXPLOSION.text, FT_SOLAR_EXPLOSION.color);
            }
            return;
          }

          if ((proj as any).isExploding) {
            (proj as any).explosionTimer--;

            this.checkMeleeHit(proj.targetX! - 26, 0, 52, this.canvas.height, Math.ceil(proj.damage / 4));

            for (let i = 0; i < 3; i++) {
              this.particles.push({
                x: proj.targetX! + (Math.random() - 0.5) * 50,
                y: this.py + (Math.random() - 0.5) * 80,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 8 - 4,
                size: Math.random() * 8 + 4,
                color: i % 2 === 0 ? '#f59e0b' : '#ef4444',
                life: 20,
                maxLife: 20
              });
            }

            if ((proj as any).explosionTimer <= 0) {
              this.projectiles.splice(index, 1);
              return;
            }
          }
        }
        else if (proj.type === 'tornado') {
          proj.x += proj.vx;
          (proj as any).traveledDist = ((proj as any).traveledDist || 0) + Math.abs(proj.vx);

          if (this.frameCount % 2 === 0) {
            this.particles.push({
              x: proj.x + (Math.random() - 0.5) * 30,
              y: proj.y + Math.random() * proj.height,
              vx: (Math.random() - 0.5) * 3,
              vy: -Math.random() * 4 - 2,
              size: Math.random() * 5 + 2,
              color: '#06b6d4',
              life: 15,
              maxLife: 15
            });
          }

          if (proj.x < 0 || proj.x > this.levelWidth || (proj as any).traveledDist >= 1000) {
            this.projectiles.splice(index, 1);
            return;
          }
        }
        else if (proj.type === 'giant_cleave') {
          proj.x += proj.vx;
          (proj as any).traveledDist = ((proj as any).traveledDist || 0) + Math.abs(proj.vx);
          if (proj.x < -100 || proj.x > this.levelWidth + 100 || (proj as any).traveledDist >= 1000) {
            this.projectiles.splice(index, 1);
            return;
          }
        }
        else if (proj.type === 'dark_energy') {
          proj.x += proj.vx;
          (proj as any).traveledDist = ((proj as any).traveledDist || 0) + Math.abs(proj.vx);
          const hitSolid = this.isSolid(proj.x, proj.y) || this.checkPlatformOneWay(proj.x, proj.y);
          if (hitSolid || proj.x < -100 || proj.x > this.levelWidth + 100 || (proj as any).traveledDist >= ((proj as any).rangeCap || 800)) {
            this.projectiles.splice(index, 1);
            return;
          }
        }
        else {
          if ((proj as any).type === 'arrow' && !proj.isEnemy && this.selectedDraco === 'Flymon' && this.flymonTornadoActive) {
            let nearestEnemy: Enemy | null = null;
            let minDistance = 1000;
            this.enemies.forEach(enemy => {
              if (enemy.hp <= 0) return;
              const dist = Math.hypot(enemy.x + enemy.width / 2 - (proj.x + proj.width / 2), enemy.y + enemy.height / 2 - (proj.y + proj.height / 2));
              if (dist < minDistance) {
                minDistance = dist;
                nearestEnemy = enemy;
              }
            });

            if (nearestEnemy) {
              const angle = Math.atan2((nearestEnemy as Enemy).y + (nearestEnemy as Enemy).height / 2 - proj.y, (nearestEnemy as Enemy).x + (nearestEnemy as Enemy).width / 2 - proj.x);
              const spd = Math.hypot(proj.vx, proj.vy) || 13.0;
              proj.vx = Math.cos(angle) * spd;
              proj.vy = Math.sin(angle) * spd;
            }
          }

          proj.x += proj.vx;
          proj.y += proj.vy;
          (proj as any).traveledDist = ((proj as any).traveledDist || 0) + Math.hypot(proj.vx, proj.vy);

          if ((proj as any).type === 'azure_vortex_ball' || (proj as any).type === 'azure_light_ball') {
            const vxX = proj.x + proj.width / 2;
            const vxY = proj.y + proj.height / 2;

            // Continuous gravitational suction on nearby enemies
            this.enemies.forEach(enemy => {
              if (enemy.hp <= 0) return;
              const ex = enemy.x + enemy.width / 2;
              const ey = enemy.y + enemy.height / 2;
              const dist = Math.hypot(ex - vxX, ey - vxY);
              if (dist < 240 && dist > 1) {
                const pullForce = (1 - dist / 240) * 3.5;
                enemy.x += ((vxX - ex) / dist) * pullForce;
                enemy.y += ((vxY - ey) / dist) * pullForce;
                enemy.stunnedTimer = Math.max(enemy.stunnedTimer || 0, 4);
              }
            });

            // Inward swirling spatial particles
            if (this.frameCount % 2 === 0) {
              const pAng = Math.random() * Math.PI * 2;
              const pRad = Math.random() * 45 + 15;
              this.particles.push({
                x: vxX + Math.cos(pAng) * pRad,
                y: vxY + Math.sin(pAng) * pRad,
                vx: -Math.cos(pAng) * 3.5,
                vy: -Math.sin(pAng) * 3.5,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.5 ? '#38bdf8' : '#c084fc',
                life: 12,
                maxLife: 12
              });
            }
          }

          const isSolidHit = this.isSolid(proj.x, proj.y);
          if (isSolidHit || proj.x < 0 || proj.x > this.levelWidth || (proj as any).traveledDist >= ((proj as any).rangeCap || 800)) {
            if ((proj as any).type === 'azure_vortex_ball' || (proj as any).type === 'azure_light_ball') {
              const cx = proj.x + proj.width / 2;
              const cy = proj.y + proj.height / 2;
              soundService.playHit();
              this.addFloatingText(cx, cy - 20, '🌀 AZURE SINGULARITY IMPLOSION!', '#38bdf8');
              this.spawnDustParticles(cx, cy, 30, '#38bdf8');
              this.screenShake = 24;

              // Singularity Explosion Burst Animation
              for (let p = 0; p < 30; p++) {
                const ang = (p / 30) * Math.PI * 2;
                const spd = Math.random() * 8 + 3;
                this.particles.push({
                  x: cx,
                  y: cy,
                  vx: Math.cos(ang) * spd,
                  vy: Math.sin(ang) * spd,
                  size: Math.random() * 7 + 3,
                  color: p % 3 === 0 ? '#38bdf8' : p % 3 === 1 ? '#c084fc' : '#ffffff',
                  life: 20,
                  maxLife: 20
                });
              }

              this.enemies.forEach(e => {
                if (e.hp <= 0) return;
                const dist = Math.hypot(e.x + e.width / 2 - cx, e.y + e.height / 2 - cy);
                if (dist <= 180) {
                  this.damageEnemy(e, Math.floor(proj.damage * 0.6));
                  e.stunnedTimer = 30;
                }
              });
            }
            this.projectiles.splice(index, 1);
            return;
          }
        }
      } else {
        proj.x += proj.vx;
        proj.y += proj.vy;

        if (this.isSolid(proj.x, proj.y) || proj.x < 0 || proj.x > this.levelWidth) {
          this.projectiles.splice(index, 1);
          return;
        }
      }

      if (proj.isEnemy) {
        if (
          proj.x < this.px + this.pWidth &&
          proj.x + proj.width > this.px &&
          proj.y < this.py + this.pHeight &&
          proj.y + proj.height > this.py
        ) {
          this.handlePlayerHit(proj.damage, proj.x);
          this.projectiles.splice(index, 1);
        }
      } else {
        let projSpliced = false;
        this.enemies.forEach(enemy => {
          if (projSpliced) return;
          if (
            proj.x < enemy.x + enemy.width &&
            proj.x + proj.width > enemy.x &&
            proj.y < enemy.y + enemy.height &&
            proj.y + proj.height > enemy.y
          ) {
            if (proj.type === 'sonar') {
              const hitSet: number[] = (proj as any).hitEnemyIds || ((proj as any).hitEnemyIds = []);
              if (!hitSet.includes(enemy.id)) {
                hitSet.push(enemy.id);
                enemy.stunnedTimer = 180;
                this.damageEnemy(enemy, proj.damage);
                soundService.playHit();
                this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12, '#f59e0b');
                this.addFloatingText(enemy.x, enemy.y - 10, FT_STUNNED_TORNADO.text, FT_STUNNED_TORNADO.color);
              }
            } else if (proj.type === 'tornado') {
              const hitSet: number[] = (proj as any).hitEnemyIds || ((proj as any).hitEnemyIds = []);
              if (!hitSet.includes(enemy.id)) {
                hitSet.push(enemy.id);
                enemy.isSuspended = true;
                enemy.suspendedTimer = 90;
                this.damageEnemy(enemy, proj.damage);
                soundService.playHit();
                this.addFloatingText(enemy.x, enemy.y - 15, FT_LIFTED_TORNADO.text, FT_LIFTED_TORNADO.color);
              }
            } else if ((proj as any).type === 'pacman' || (proj as any).type === 'pixel_sword') {
              const hitSet: number[] = (proj as any).hitEnemyIds || ((proj as any).hitEnemyIds = []);
              if (!hitSet.includes(enemy.id)) {
                hitSet.push(enemy.id);
                this.damageEnemy(enemy, proj.damage);
                soundService.playHit();
                this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 14, '#eab308');
              }
            } else if ((proj as any).type === 'azure_vortex_ball' || (proj as any).type === 'azure_light_ball') {
              const cx = proj.x + proj.width / 2;
              const cy = proj.y + proj.height / 2;
              this.damageEnemy(enemy, proj.damage);
              soundService.playHit();
              this.healPlayer(Math.max(2, Math.floor(this.pMaxHP * 0.05)));
              this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, '+HP Singularity Siphon', '#38bdf8');
              this.addFloatingText(cx, cy - 20, '🌀 AZURE SINGULARITY IMPLOSION!', '#38bdf8');
              this.spawnDustParticles(cx, cy, 30, '#38bdf8');
              this.screenShake = 24;

              // Singularity Explosion Burst Animation
              for (let p = 0; p < 30; p++) {
                const ang = (p / 30) * Math.PI * 2;
                const spd = Math.random() * 8 + 3;
                this.particles.push({
                  x: cx,
                  y: cy,
                  vx: Math.cos(ang) * spd,
                  vy: Math.sin(ang) * spd,
                  size: Math.random() * 7 + 3,
                  color: p % 3 === 0 ? '#38bdf8' : p % 3 === 1 ? '#c084fc' : '#ffffff',
                  life: 20,
                  maxLife: 20
                });
              }

              this.enemies.forEach(e => {
                if (e.hp <= 0) return;
                const dist = Math.hypot(e.x + e.width / 2 - cx, e.y + e.height / 2 - cy);
                if (dist <= 180) {
                  this.damageEnemy(e, Math.floor(proj.damage * 0.5));
                  e.stunnedTimer = 30;
                }
              });

              this.projectiles.splice(index, 1);
              projSpliced = true;
            } else if ((proj as any).type === 'azure_mini_beam') {
              this.damageEnemy(enemy, proj.damage);
              soundService.playHit();
              this.healPlayer(1);
              this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, '+1 HP Siphon', '#38bdf8');
              this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, '#38bdf8');
              this.projectiles.splice(index, 1);
              projSpliced = true;
            } else if (proj.type === 'dark_energy') {
              if ((proj as any).isBasic) {
                this.damageEnemy(enemy, proj.damage);
                soundService.playHit();
                this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 14, '#ef4444');
                this.projectiles.splice(index, 1);
                projSpliced = true;
              } else {
                const hitSet: number[] = (proj as any).hitEnemyIds || ((proj as any).hitEnemyIds = []);
                if (!hitSet.includes(enemy.id)) {
                  hitSet.push(enemy.id);
                  this.damageEnemy(enemy, proj.damage);
                  soundService.playHit();
                  this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 14, '#ef4444');
                  this.addFloatingText(enemy.x, enemy.y - 15, FT_SOUL_WAVE_HIT.text, FT_SOUL_WAVE_HIT.color);
                }
              }
            } else if (proj.type === 'giant_cleave') {
              const hitSet: number[] = (proj as any).hitEnemyIds || ((proj as any).hitEnemyIds = []);
              if (!hitSet.includes(enemy.id)) {
                hitSet.push(enemy.id);
                this.damageEnemy(enemy, proj.damage);
                soundService.playHit();
                this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 10, '#a855f7');
              }
            } else if (proj.type === 'sun_strike') {
            } else if ((proj as any).type === 'homing_bomb') {
              soundService.playHit();
              this.screenShake = 18;

              const dropX = enemy.x + enemy.width / 2;
              let groundY = this.levelHeight - 40;
              const ts = this.level.tileSize;
              const col = Math.floor(dropX / ts);

              const grid = this.getActiveGrid();
              if (grid.length > 0 && col >= 0 && col < (grid[0]?.length || 0)) {
                for (let r = 0; r < grid.length; r++) {
                  const char = grid[r][col];
                  if (char === '#' || char === '=') {
                    groundY = r * ts;
                    break;
                  }
                }
              }

              this.groundBurnZones.push({
                id: this.groundBurnIdCounter++,
                x: dropX - 60,
                y: groundY,
                width: 120,
                height: 20,
                timer: 120,
                duration: 120
              });

              this.enemies.forEach(e => {
                if (e.hp <= 0) return;
                const dist = Math.hypot(e.x + e.width / 2 - dropX, e.y + e.height / 2 - enemy.y);
                if (dist <= 100) {
                  this.damageEnemy(e, proj.damage);
                  e.burnTimer = 30;
                  e.burnLingerTimer = 120;
                }
              });

              for (let p = 0; p < 24; p++) {
                const ang = Math.random() * Math.PI * 2;
                const spd = Math.random() * 8 + 2;
                this.particles.push({
                  x: dropX,
                  y: enemy.y + enemy.height / 2,
                  vx: Math.cos(ang) * spd,
                  vy: Math.sin(ang) * spd - 2,
                  size: Math.random() * 7 + 3,
                  color: p % 2 === 0 ? '#ea580c' : '#f59e0b',
                  life: 20,
                  maxLife: 20
                });
              }

              this.projectiles.splice(index, 1);
              projSpliced = true;
            } else {
              this.damageEnemy(enemy, proj.damage);
              this.projectiles.splice(index, 1);
              projSpliced = true;
            }
          }
        });
      }
    });

    this.enemies.forEach(enemy => {
      if (enemy.type === 'skeleton_archer' && enemy.isBonePile) {
        enemy.respawnTimer = (enemy.respawnTimer || 0) - 1;
        enemy.hp = 0;
        if (enemy.respawnTimer <= 0) {
          enemy.isBonePile = false;
          enemy.hp = enemy.maxHp;
          enemy.hasRevived = true;
          enemy.reviveCount = (enemy.reviveCount || 0) + 1;
          soundService.playLevelUp();
          const _ftRevive = FT_SKELETON_REVIVED(enemy.reviveCount!); this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 15, _ftRevive.text, _ftRevive.color);
          this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height, 16, '#e2e8f0');
        }
        return;
      }

      if (enemy.stunnedTimer && enemy.stunnedTimer > 0) {
        enemy.stunnedTimer--;
        return;
      }

      let grounded = false;

      if (enemy.type === 'flying_wyvern' || enemy.type === 'fish' || enemy.type === 'giant_wisp') {
        enemy.vx = enemy.vx || -1.2;
        enemy.x += enemy.vx;
        enemy.y += Math.sin(this.frameCount * 0.05 + enemy.id) * 1.5;
        if (this.isSolid(enemy.x, enemy.y) || enemy.x < 10 || enemy.x > this.levelWidth - 100) {
          enemy.vx = -enemy.vx;
          enemy.facing = enemy.vx > 0 ? 1 : -1;
        }
      } else if (enemy.type === 'anchor') {
        enemy.y += enemy.vy;
        const maxAnchorY = 360 - enemy.height;
        const minAnchorY = 40;
        if (enemy.y > maxAnchorY || enemy.y < minAnchorY) {
          enemy.vy = -enemy.vy;
          enemy.y = enemy.y < minAnchorY ? minAnchorY : maxAnchorY;
        }
      } else if (enemy.type === 'scallop') {
      } else if (enemy.type === 'killer_whale') {
        if (enemy.suckTimer === undefined) enemy.suckTimer = 0;
        if (enemy.suckCooldown === undefined) enemy.suckCooldown = 240;

        if (enemy.suckTimer > 0) {
          enemy.suckTimer--;
          enemy.vx = 0;

          const cx = enemy.x + enemy.width / 2;
          const cy = enemy.y + enemy.height / 2;
          const pxMid = this.px + this.pWidth / 2;
          const pyMid = this.py + this.pHeight / 2;
          const dist = Math.hypot(pxMid - cx, pyMid - cy);
          const maxSuckRadius = 120;

          if (dist < maxSuckRadius && this.pHP > 0) {
            const intensity = 1 - dist / maxSuckRadius;
            const pullForce = intensity * 4.5;
            const dx = cx - pxMid;
            const dy = cy - pyMid;

            this.pvx += (dx / dist) * pullForce;
            this.pvy += (dy / dist) * pullForce;

            if (this.frameCount % 4 === 0) {
              this.particles.push({
                x: pxMid,
                y: pyMid,
                vx: (dx / dist) * 4,
                vy: (dy / dist) * 4,
                size: Math.random() * 3 + 1,
                color: '#38bdf8',
                life: 12,
                maxLife: 12
              });
            }

            if (
              this.px < enemy.x + enemy.width &&
              this.px + this.pWidth > enemy.x &&
              this.py < enemy.y + enemy.height &&
              this.py + this.pHeight > enemy.y
            ) {
              this.handlePlayerHit(enemy.attack, cx);
            }
          }

          if (enemy.suckTimer <= 0) {
            enemy.vx = enemy.facing * 3.0;
            enemy.suckCooldown = 300;
          }
        } else {
          enemy.x += enemy.vx;
          if (this.isSolid(enemy.x, enemy.y) || enemy.x < 10 || enemy.x > this.levelWidth - 80) {
            enemy.vx = -enemy.vx;
            enemy.facing = enemy.vx > 0 ? 1 : -1;
          }

          enemy.suckCooldown--;
          if (enemy.suckCooldown <= 0) {
            enemy.suckTimer = 150;
            this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 15, FT_LEVIATHAN_VORTEX.text, FT_LEVIATHAN_VORTEX.color);
            soundService.playShoot();
          }

          enemy.shootCooldown--;
          if (enemy.shootCooldown <= 0 && enemy.suckTimer <= 0) {
            enemy.shootCooldown = 75;
            soundService.playShoot();
            this.projectiles.push({
              x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 16,
              y: enemy.y + enemy.height / 2,
              vx: enemy.facing * 4.5,
              vy: 0,
              width: 16,
              height: 16,
              isEnemy: true,
              damage: enemy.attack,
              color: '#38bdf8',
              type: 'sonar'
            });
          }
        }
      } else {
        enemy.vy += this.gravity;
        enemy.y += enemy.vy;

        const left = enemy.x;
        const right = enemy.x + enemy.width;
        const bottom = enemy.y + enemy.height;
        const oldBottom = bottom - enemy.vy;

        const collidesSolidBottom = this.isSolid(left + 2, bottom) || this.isSolid(right - 2, bottom);

        let onOneWayPlatform = false;
        let platformTopY = 0;

        if (!collidesSolidBottom && enemy.vy >= 0) {
          const platformLeft = this.checkPlatformOneWay(left + 2, bottom);
          const platformRight = this.checkPlatformOneWay(right - 2, bottom);
          if (platformLeft || platformRight) {
            const tileRow = Math.floor(bottom / ts);
            platformTopY = tileRow * ts;
            if (oldBottom <= platformTopY + 12) {
              onOneWayPlatform = true;
            }
          }
        }

        if (collidesSolidBottom) {
          enemy.y = Math.floor(bottom / ts) * ts - enemy.height;
          enemy.vy = 0;
          grounded = true;
        } else if (onOneWayPlatform) {
          enemy.y = platformTopY - enemy.height;
          enemy.vy = 0;
          grounded = true;
        }
        (enemy as any).isGrounded = grounded;
      }

      if (
        enemy.type === 'slime' ||
        enemy.type === 'fire_golem' ||
        enemy.type === 'miniboss' ||
        enemy.type === 'king_slime' ||
        enemy.type === 'frost_wyvern' ||
        enemy.type === 'shadow_overlord' ||
        enemy.type === 'dragon_king' ||
        enemy.type === 'bomb_thrower' ||
        enemy.type === 'lunar_goddess'
      ) {
        enemy.x += enemy.vx;

        const nextX = enemy.vx > 0 ? enemy.x + enemy.width + 4 : enemy.x - 4;
        const groundAhead = this.isSolid(nextX, enemy.y + enemy.height + 4) || this.checkPlatformOneWay(nextX, enemy.y + enemy.height + 4);
        const wallAhead = this.isSolid(nextX, enemy.y + 4) || this.isSolid(nextX, enemy.y + enemy.height - 4);

        if (wallAhead || (grounded && !groundAhead)) {
          enemy.vx = -enemy.vx;
          enemy.facing = enemy.vx > 0 ? 1 : -1;
        }
      } else if (enemy.type === 'alien') {
        const dx = this.px - enemy.x;
        enemy.facing = dx > 0 ? 1 : -1;
        enemy.vx = enemy.facing * 1.2;
        enemy.x += enemy.vx;

        const dist = Math.hypot(this.px - enemy.x, this.py - enemy.y);
        if (dist <= 500) {
          enemy.shootCooldown--;
          if (enemy.shootCooldown <= 0) {
            enemy.shootCooldown = 180;
            soundService.playShoot();
            this.projectiles.push({
              x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 16,
              y: enemy.y + enemy.height / 2 - 4,
              vx: enemy.facing * 7,
              vy: 0,
              width: 16,
              height: 8,
              isEnemy: true,
              damage: enemy.attack,
              color: '#a855f7',
              type: 'alien_laser' as any,
              life: 60
            } as any);
            this.addFloatingText(enemy.x, enemy.y - 15, FT_HOMING_LASER.text, FT_HOMING_LASER.color);
          }
        }
      } else if (enemy.type === 'giant_wisp') {
        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;

        enemy.wispOrbitAngle = (enemy.wispOrbitAngle || 0) + 0.06;

        // Shoot small wisp projectile homing for 0.5s (30 frames) then continuing direction
        enemy.shootCooldown = (enemy.shootCooldown || 90) - 1;
        if (enemy.shootCooldown <= 0 && !enemy.wispDetonating) {
          enemy.shootCooldown = 110;
          soundService.playShoot();

          const targetX = this.px + this.pWidth / 2;
          const targetY = this.py + this.pHeight / 2;
          const dx = targetX - cx;
          const dy = targetY - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const speed = 6.0;

          this.projectiles.push({
            x: cx - 6,
            y: cy - 6,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            width: 12,
            height: 12,
            isEnemy: true,
            damage: Math.floor(enemy.attack * 0.9),
            color: '#38bdf8',
            type: 'wisp_orb' as any,
            homingTimer: 30, // 30 frames = 0.5 seconds at 60 FPS
            speed: 6.0
          } as any);

          this.spawnDustParticles(cx, cy, 8, '#38bdf8');
        }

        const pxMid = this.px + this.pWidth / 2;
        const pyMid = this.py + this.pHeight / 2;
        const orbitRadius = 90 + Math.sin(this.frameCount * 0.05) * 25;
        for (let i = 0; i < 4; i++) {
          const ang = enemy.wispOrbitAngle + (i * Math.PI) / 2;
          const sx = cx + Math.cos(ang) * orbitRadius;
          const sy = cy + Math.sin(ang) * orbitRadius;
          const sdist = Math.hypot(pxMid - sx, pyMid - sy);
          if (sdist < 20 + this.pWidth / 2 && this.pHP > 0) {
            this.handlePlayerHit(14, sx);
            this.spawnDustParticles(pxMid, pyMid, 10, '#fef08a');
          }
        }

        if (enemy.hp <= 0 && !enemy.wispDetonating && !(enemy as any).wispDetonatingFinished) {
          enemy.wispDetonating = true;
          enemy.wispDetonationTimer = 120;
          enemy.hp = 1;
          soundService.playShoot();
          this.addFloatingText(cx, cy - 20, FT_SUPERNOVA_DETONATION.text, FT_SUPERNOVA_DETONATION.color);
        }

        if (enemy.wispDetonating) {
          enemy.hp = 1;
          enemy.wispDetonationTimer = (enemy.wispDetonationTimer || 120) - 1;

          if (this.frameCount % 4 === 0) {
            this.spawnDustParticles(cx, cy, 8, '#ef4444');
          }

          if (enemy.wispDetonationTimer <= 0) {
            const distToPlayer = Math.hypot(pxMid - cx, pyMid - cy);
            if (distToPlayer <= 400 && this.pHP > 0) {
              this.handlePlayerHit(50, cx);
              this.addFloatingText(pxMid, this.py - 20, FT_SUPERNOVA_EXPLOSION.text, FT_SUPERNOVA_EXPLOSION.color);
            }

            this.screenShake = 35;
            soundService.playHit();
            for (let p = 0; p < 45; p++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = Math.random() * 12 + 3;
              this.particles.push({
                x: cx,
                y: cy,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                size: Math.random() * 10 + 4,
                color: p % 3 === 0 ? '#ef4444' : p % 3 === 1 ? '#f97316' : '#fef08a',
                life: 30,
                maxLife: 30
              });
            }

            (enemy as any).wispDetonatingFinished = true;
            enemy.hp = 0;
            this.defeatEnemy(enemy);
          }
        }
      }

      if ((this as any).enigmonPulseActive && (this as any).enigmonPulseTimer > 0) {
        (this as any).enigmonPulseTimer--;
        const pulseX = (this as any).enigmonPulseX || (this.px + this.pWidth / 2);
        const pulseY = (this as any).enigmonPulseY || (this.py + this.pHeight);

        if ((this as any).enigmonPulseTimer % 60 === 0) {
          this.enemies.forEach(e => {
            if (e.hp <= 0) return;
            const ex = e.x + e.width / 2;
            const ey = e.y + e.height / 2;
            const inOval = Math.pow((ex - pulseX) / 200, 2) + Math.pow((ey - pulseY) / 40, 2) <= 1.0;
            if (inOval) {
              const pulseDmg = Math.floor(this.stats.attack * 1.2) + Math.floor((e.maxHp || 100) * 0.03);
              this.damageEnemy(e, pulseDmg);
              const _ftPulse = FT_PULSE_DAMAGE(pulseDmg); this.addFloatingText(ex, e.y - 15, _ftPulse.text, _ftPulse.color);
              this.spawnDustParticles(ex, ey, 10, '#c084fc');
            }
          });
        }
      }



      if (
        enemy.type === 'goblin_archer' ||
        enemy.type === 'miniboss' ||
        enemy.type === 'king_slime' ||
        enemy.type === 'frost_wyvern' ||
        enemy.type === 'shadow_overlord' ||
        enemy.type === 'dragon_king'
      ) {
        const dx = this.px - enemy.x;
        const dy = this.py - enemy.y;

        enemy.facing = dx > 0 ? 1 : -1;

        if (Math.abs(dx) < 450 && Math.abs(dy) < 200) {
          enemy.shootCooldown--;
          if (enemy.shootCooldown <= 0) {
            soundService.playShoot();

            if (enemy.type === 'dragon_king') {
              enemy.shootCooldown = 65;
              const angles = [-0.3, -0.15, 0, 0.15, 0.3];
              angles.forEach(angle => {
                this.projectiles.push({
                  x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 16,
                  y: enemy.y + enemy.height / 2,
                  vx: enemy.facing * 5 * Math.cos(angle),
                  vy: 5 * Math.sin(angle),
                  width: 14,
                  height: 14,
                  isEnemy: true,
                  damage: enemy.attack,
                  color: '#f59e0b',
                  type: 'fireball'
                });
              });
            } else if (enemy.type === 'shadow_overlord') {
              enemy.shootCooldown = 75;
              [-0.2, 0, 0.2].forEach(angle => {
                this.projectiles.push({
                  x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 14,
                  y: enemy.y + enemy.height / 2,
                  vx: enemy.facing * 4.5 * Math.cos(angle),
                  vy: 4.5 * Math.sin(angle),
                  width: 14,
                  height: 14,
                  isEnemy: true,
                  damage: enemy.attack,
                  color: '#a855f7',
                  type: 'fireball'
                });
              });
            } else if (enemy.type === 'frost_wyvern') {
              enemy.shootCooldown = 85;
              [-0.15, 0, 0.15].forEach(angle => {
                this.projectiles.push({
                  x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 14,
                  y: enemy.y + enemy.height / 2,
                  vx: enemy.facing * 5 * Math.cos(angle),
                  vy: 5 * Math.sin(angle),
                  width: 14,
                  height: 6,
                  isEnemy: true,
                  damage: enemy.attack,
                  color: '#38bdf8',
                  type: 'arrow'
                });
              });
            } else if (enemy.type === 'king_slime') {
              enemy.shootCooldown = 90;
              enemy.vy = -4;
              this.projectiles.push({
                x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 12,
                y: enemy.y + enemy.height / 2,
                vx: enemy.facing * 3.5,
                vy: -2,
                width: 14,
                height: 14,
                isEnemy: true,
                damage: enemy.attack,
                color: '#10b981',
                type: 'fireball'
              });
            } else if (enemy.type === 'miniboss') {
              enemy.shootCooldown = 60;
              this.projectiles.push({
                x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 12,
                y: enemy.y + enemy.height / 2,
                vx: enemy.facing * 4,
                vy: -1,
                width: 14,
                height: 14,
                isEnemy: true,
                damage: enemy.attack,
                color: '#f97316',
                type: 'fireball'
              });
            } else {
              enemy.shootCooldown = 120;
              this.projectiles.push({
                x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 12,
                y: enemy.y + enemy.height / 2 - 2,
                vx: enemy.facing * 4.5,
                vy: 0,
                width: 12,
                height: 4,
                isEnemy: true,
                damage: enemy.attack,
                color: '#a855f7',
                type: 'arrow'
              });
            }
          }
        }
      }

      if (enemy.type === 'skeleton_archer') {
        const dx = this.px - enemy.x;
        const dy = this.py - enemy.y;
        enemy.facing = dx > 0 ? 1 : -1;

        if (Math.abs(dx) < 550 && Math.abs(dy) < 300) {
          enemy.shootCooldown--;
          if (enemy.shootCooldown <= 0) {
            enemy.shootCooldown = 70;
            soundService.playShoot();

            const startX = enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 14;
            const startY = enemy.y + enemy.height / 2 - 2;
            const targetX = this.px + this.pWidth / 2;
            const targetY = this.py + this.pHeight / 2;

            const dirX = targetX - startX;
            const dirY = targetY - startY;
            const dist = Math.hypot(dirX, dirY) || 1;
            const arrowSpeed = 5.5;

            this.projectiles.push({
              x: startX,
              y: startY,
              vx: (dirX / dist) * arrowSpeed,
              vy: (dirY / dist) * arrowSpeed,
              width: 14,
              height: 4,
              isEnemy: true,
              damage: enemy.attack,
              color: '#e2e8f0',
              type: 'arrow'
            });
          }
        }
      } else if (enemy.type === 'lunar_goddess') {
        const dx = this.px - enemy.x;
        const dy = this.py - enemy.y;
        enemy.facing = dx > 0 ? 1 : -1;

        if (Math.abs(dx) < 650 && Math.abs(dy) < 350) {
          if (!enemy.beamBarrageActive) {
            enemy.shootCooldown--;
            if (enemy.shootCooldown <= 0) {
              if (Math.random() < 0.6) {
                soundService.playShoot();
                const baseAngle = Math.atan2(dy, dx);
                const angles = [baseAngle - 0.2, baseAngle, baseAngle + 0.2];
                angles.forEach(ang => {
                  this.projectiles.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    vx: Math.cos(ang) * 5.0,
                    vy: Math.sin(ang) * 5.0,
                    width: 12,
                    height: 12,
                    isEnemy: true,
                    damage: Math.floor(enemy.attack * 0.4),
                    color: '#c7d2fe',
                    type: 'sonar'
                  });
                });
                enemy.shootCooldown = 80;
              } else {
                enemy.beamBarrageActive = true;
                enemy.beamTimer = 180;
                enemy.beamTargetX = this.px + this.pWidth / 2;
                enemy.beamTargetY = this.py + this.pHeight / 2;
                enemy.vx = 0;
              }
            }
          } else {
            enemy.beamTimer!--;
            if (enemy.beamTimer! <= 0) {
              enemy.beamBarrageActive = false;
              enemy.shootCooldown = 120;
            } else if (enemy.beamTimer! < 120) {
              const startX = enemy.x + enemy.width / 2;
              const startY = enemy.y + enemy.height / 2;
              const angle = Math.atan2(enemy.beamTargetY! - startY, enemy.beamTargetX! - startX);

              let curX = startX;
              let curY = startY;
              const step = 8;
              for (let s = 0; s < 180; s++) {
                curX += Math.cos(angle) * step;
                curY += Math.sin(angle) * step;
                if (curY >= this.levelHeight || this.isSolid(curX, curY) || this.checkPlatformOneWay(curX, curY)) {
                  break;
                }
              }

              enemy.beamEndX = curX;
              enemy.beamEndY = curY;

              const pCenterX = this.px + this.pWidth / 2;
              const pCenterY = this.py + this.pHeight / 2;
              const dist = this.distToSegment(pCenterX, pCenterY, startX, startY, curX, curY);
              if (dist < 22 && this.pInvulnerableFrames <= 0) {
                this.handlePlayerHit(22, startX);
              }
            } else {
              enemy.beamTargetX = this.px + this.pWidth / 2;
              enemy.beamTargetY = this.py + this.pHeight / 2;
            }
          }
        }
      } else if (enemy.type === 'immortal_gladiator') {
        enemy.chargeCooldownTimer = (enemy.chargeCooldownTimer ?? 180) - 1;

        if (enemy.chargeCooldownTimer <= 0) {
          enemy.chargeCooldownTimer = 180;
          enemy.chargeTimer = 60;
          soundService.playJump();
          this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 25, FT_GLADIATOR_RUSH.text, FT_GLADIATOR_RUSH.color);
        }

        if ((enemy.chargeTimer || 0) > 0) {
          enemy.chargeTimer!--;
          enemy.isCharging = true;

          const dx = this.px - enemy.x;
          enemy.facing = dx > 0 ? 1 : -1;
          enemy.vx = enemy.facing * 7.5;

          if (this.frameCount % 2 === 0) {
            this.particles.push({
              x: enemy.x + (enemy.facing === 1 ? 0 : enemy.width),
              y: enemy.y + Math.random() * enemy.height,
              vx: -enemy.facing * (Math.random() * 4 + 2),
              vy: (Math.random() - 0.5) * 3,
              size: Math.random() * 5 + 2,
              color: '#ef4444',
              life: 14,
              maxLife: 14
            });
          }
        } else {
          enemy.isCharging = false;
          const dx = this.px - enemy.x;
          enemy.facing = dx > 0 ? 1 : -1;
          enemy.vx = enemy.facing * 2.5;
        }

        enemy.x += enemy.vx;
        const nextX = enemy.vx > 0 ? enemy.x + enemy.width + 6 : enemy.x - 6;
        const wallAhead = this.isSolid(nextX, enemy.y + 4) || this.isSolid(nextX, enemy.y + enemy.height - 4);
        if (wallAhead) {
          if (grounded) {
            enemy.vy = -11;
          } else {
            enemy.x -= enemy.vx;
          }
        }
      } else if (enemy.type === 'king_kong') {
        const dx = this.px - enemy.x;
        enemy.facing = dx > 0 ? 1 : -1;

        enemy.jumpCooldown = (enemy.jumpCooldown || 120) - 1;
        if (enemy.jumpCooldown <= 0) {
          enemy.jumpCooldown = 120;
          enemy.vy = -14;
          enemy.vx = enemy.facing * 5.5;
          enemy.isLeaping = true;
          enemy.jumpCount = (enemy.jumpCount || 0) + 1;
          soundService.playJump();
          const _ftGorilla = FT_GORILLA_LEAP(enemy.jumpCount!); this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 20, _ftGorilla.text, _ftGorilla.color);
        }

        if (enemy.isLeaping && grounded) {
          enemy.isLeaping = false;
          soundService.playHit();

          if ((enemy.jumpCount || 0) >= 3) {
            enemy.jumpCount = 0;

            const onScreen = this.isEnemyInsideFrame(enemy);
            if (onScreen) {
              this.screenShake = 35;
              this.checkMeleeHit(enemy.x - 120, enemy.y - 20, enemy.width + 240, enemy.height + 40, Math.floor(enemy.attack * 1.5));

              for (let p = 0; p < 24; p++) {
                this.particles.push({
                  x: enemy.x + enemy.width / 2 + (Math.random() - 0.5) * 160,
                  y: enemy.y + enemy.height,
                  vx: (Math.random() - 0.5) * 6,
                  vy: -Math.random() * 8 - 3,
                  size: Math.random() * 8 + 3,
                  color: p % 2 === 0 ? '#ef4444' : '#f97316',
                  life: 25,
                  maxLife: 25
                });
              }

              if (this.pGrounded) {
                if (this.playerStunCooldown <= 0) {
                  this.playerStunnedTimer = 120;
                  this.playerStunCooldown = 150;
                  this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, FT_SEISMIC_GROUND_SLAM.text, FT_SEISMIC_GROUND_SLAM.color);
                }
              } else {
                this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, FT_AIR_DODGED_STUN.text, FT_AIR_DODGED_STUN.color);
              }
            }
          } else {
            this.checkMeleeHit(enemy.x - 40, enemy.y - 10, enemy.width + 80, enemy.height + 20, enemy.attack);
            this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height, 12, '#854d0e');
          }
        }
      }

      if (enemy.type === 'bomb_thrower') {
        const dx = this.px - enemy.x;
        const dy = this.py - enemy.y;

        enemy.facing = dx > 0 ? 1 : -1;

        if (Math.abs(dx) < 360 && Math.abs(dy) < 180) {
          enemy.shootCooldown--;
          if (enemy.shootCooldown <= 0) {
            enemy.shootCooldown = 120;
            soundService.playShoot();

            this.projectiles.push({
              x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 12,
              y: enemy.y - 4,
              vx: enemy.facing * 3.5,
              vy: -6,
              width: 12,
              height: 12,
              isEnemy: true,
              damage: enemy.attack * 1.5,
              color: '#475569',
              type: 'bomb' as any,
              timer: 90
            } as any);
          }
        }
      }

      if (
        this.px < enemy.x + enemy.width &&
        this.px + this.pWidth > enemy.x &&
        this.py < enemy.y + enemy.height &&
        this.py + this.pHeight > enemy.y
      ) {
        this.handlePlayerHit(enemy.attack, enemy.x + enemy.width / 2);

        if ((enemy.isImmortal || enemy.type === 'immortal_gladiator') && enemy.isCharging) {
          if (this.playerStunCooldown <= 0) {
            this.playerStunnedTimer = 60;
            this.playerStunCooldown = 90;
            this.addFloatingText(this.px + this.pWidth / 2, this.py - 25, FT_GLADIATOR_RUSH_STUN.text, FT_GLADIATOR_RUSH_STUN.color);
            soundService.playHit();
          }
        }
      }
    });

    if ((this as any).enigmonBlackHoleActive && (this as any).enigmonBlackHoleTimer > 0) {
      (this as any).enigmonBlackHoleTimer--;
      const bhX = (this as any).enigmonBlackHoleX;
      const bhY = (this as any).enigmonBlackHoleY;
      const bhTimer = (this as any).enigmonBlackHoleTimer as number;
      const totalDuration = 240;
      const ts = this.level.tileSize;

      const outerSuckRadius = 450; // 300px more outer suck zone (150 + 300 = 450)
      const innerRadius = 150;

      this.enemies.forEach(e => {
        if (e.hp <= 0) return;
        const ex = e.x + e.width / 2;
        const ey = e.y + e.height / 2;
        const dx = bhX - ex;
        const dy = bhY - ey;
        const dist = Math.hypot(dx, dy);

        if (dist <= outerSuckRadius && dist > 0) {
          const isBoss = this.isBossType(e.type);
          let pullSpeed = 0;
          if (dist <= innerRadius) {
            pullSpeed = isBoss ? 3.0 : 7.5; // Strong inner singularity pull
          } else {
            const pullFactor = 1 - (dist - innerRadius) / (outerSuckRadius - innerRadius);
            pullSpeed = (isBoss ? 1.5 : 3.0) + pullFactor * (isBoss ? 2.5 : 4.5); // Smoothly pulls distant enemies in
          }

          // Directly move enemy towards Black Hole center
          e.x += (dx / dist) * pullSpeed;
          e.y += (dy / dist) * pullSpeed;

          // Override enemy velocity so gravitational pull overpowers regular AI movement
          e.vx = (dx / dist) * pullSpeed * 0.6;
          e.vy = (dy / dist) * pullSpeed * 0.6;
        }
      });

      if (bhTimer % 30 === 0) {
        soundService.playBlackHolePulse(this.isDemoMode);

        // Ramped damage scaling over duration (0s to 4s)
        const channelProgress = Math.min(1.0, Math.max(0, (totalDuration - bhTimer) / totalDuration));
        const rampMultiplier = 0.35 + 1.15 * channelProgress; // 0.35x -> 1.50x over 4 seconds

        this.enemies.forEach(e => {
          if (e.hp <= 0) return;
          const ex = e.x + e.width / 2;
          const ey = e.y + e.height / 2;
          const dist = Math.hypot(ex - bhX, ey - bhY);

          if (dist <= innerRadius + 40) {
            const isBoss = this.isBossType(e.type);
            const maxHpRatio = isBoss ? 0.016 : 0.02;
            const baseDmg = Math.floor(this.stats.attack * (isBoss ? 4 : 5) * rampMultiplier);
            const maxHpDmg = Math.floor((e.maxHp || 100) * maxHpRatio * rampMultiplier);
            const bhDmg = Math.max(1, baseDmg + maxHpDmg);

            this.damageEnemy(e, bhDmg);
            const _ftSing = FT_SINGULARITY_DAMAGE(bhDmg); this.addFloatingText(ex, e.y - 15, _ftSing.text, _ftSing.color);
            // Spiral-inward death particles for each enemy hit
            for (let p = 0; p < 10; p++) {
              const ang = Math.random() * Math.PI * 2;
              const dist2 = Math.hypot(ex - bhX, ey - bhY) || 1;
              this.particles.push({
                x: ex + Math.cos(ang) * 12,
                y: ey + Math.sin(ang) * 12,
                vx: ((bhX - ex) / dist2) * (4 + Math.random() * 4),
                vy: ((bhY - ey) / dist2) * (4 + Math.random() * 4),
                size: Math.random() * 6 + 2,
                color: p % 2 === 0 ? '#e879f9' : '#c084fc',
                life: 18,
                maxLife: 18
              });
            }
          }
        });
        // Gravitational wave ring pulse
        this.screenShake = Math.max(this.screenShake, 8);
      }

      // Continuous spiral matter-stream particles
      if (this.frameCount % 4 === 0) {
        const streamAng = this.frameCount * 0.22;
        for (let arm = 0; arm < 2; arm++) {
          const armAng = streamAng + arm * Math.PI;
          const startR = 130 + Math.sin(this.frameCount * 0.08 + arm) * 20;
          const sx = bhX + Math.cos(armAng) * startR;
          const sy = bhY + Math.sin(armAng) * startR * 0.6;
          const dist3 = Math.hypot(sx - bhX, sy - bhY);
          if (dist3 > 1) {
            this.particles.push({
              x: sx,
              y: sy,
              vx: ((bhX - sx) / dist3) * 5.5 - Math.sin(armAng) * 2.2,
              vy: ((bhY - sy) / dist3) * 5.5 + Math.cos(armAng) * 2.2,
              size: Math.random() * 5 + 2,
              color: arm === 0 ? '#e879f9' : '#c084fc',
              life: 12,
              maxLife: 12
            });
          }
        }
      }

      stageGimmickManager.clearHazardsNear(bhX, bhY, 150);

      if (this.frameCount % 5 === 0) {
        const grid = this.getActiveGrid();
        if (grid.length > 0) {
          const centerR = Math.floor(bhY / ts);
          const centerC = Math.floor(bhX / ts);
          const radiusTiles = Math.floor(150 / ts);

          for (let r = Math.max(0, centerR - radiusTiles); r <= Math.min(grid.length - 1, centerR + radiusTiles); r++) {
            for (let c = Math.max(0, centerC - radiusTiles); c <= Math.min((grid[r]?.length || 0) - 1, centerC + radiusTiles); c++) {
              const tileX = c * ts + ts / 2;
              const tileY = r * ts + ts / 2;
              if (Math.hypot(tileX - bhX, tileY - bhY) <= 150) {
                const char = grid[r][c];
                if (char === '#' || char === '=' || char === 'H' || char === '*') {
                  let isPortalFloor = false;
                  if (r > 0 && grid[r - 1] && grid[r - 1][c] === 'P') isPortalFloor = true;
                  if (!isPortalFloor) {
                    this.setGridTile(r, c, '.');
                    this.spawnDustParticles(tileX, tileY, 6, '#c084fc');
                  }
                }
              }
            }
          }
        }
      }
    }

    if (this.carpetBombingActive) {
      this.pInvulnerableFrames = 180;

      this.px = this.carpetBombingStartX;
      this.py = this.carpetBombingY;
      this.pvx = 0;
      this.pvy = 0;

      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;

      if (this.carpetBombingChannelTimer > 0) {
        this.carpetBombingChannelTimer--;

        if (this.frameCount % 2 === 0) {
          const ang = Math.random() * Math.PI * 2;
          const dist = Math.random() * 40 + 20;
          this.particles.push({
            x: this.px + this.pWidth / 2 + Math.cos(ang) * dist,
            y: this.py + this.pHeight / 2 + Math.sin(ang) * dist,
            vx: -Math.cos(ang) * 3,
            vy: -Math.sin(ang) * 3,
            size: Math.random() * 6 + 3,
            color: '#f97316',
            life: 15,
            maxLife: 15
          });
        }

        if (this.carpetBombingChannelTimer === 0) {
          soundService.playShoot();
          this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, FT_CARPET_BOMBING_FLAME.text, FT_CARPET_BOMBING_FLAME.color);
          this.screenShake = 40;
        }
      } else {
        this.carpetBombingTimer--;
        this.carpetBombingFireStreamTimer++;

        const maxRadius = Math.min(260, (this.canvas.width || 800) * 0.35);
        if (this.carpetBombingSpreadRadius < maxRadius) {
          this.carpetBombingSpreadRadius += 10.0;
        }

        const centerPointX = this.carpetBombingStartX + this.pWidth / 2;

        // Decrement per-enemy carpet bomb cooldowns every fire-stream tick (every 6 frames)
        if (this.carpetBombingFireStreamTimer % 6 === 0) {
          this.enemies.forEach(enemy => {
            if ((enemy as any).carpetBombDamageCooldown > 0) {
              (enemy as any).carpetBombDamageCooldown--;
            }
          });
        }

        if (this.carpetBombingFireStreamTimer % 6 === 0) {
          soundService.playShoot();

          const currentRad = this.carpetBombingSpreadRadius;
          const targets = [centerPointX - currentRad, centerPointX + currentRad, centerPointX];

          targets.forEach(dropX => {
            let groundY = this.levelHeight - 40;
            const ts = this.level.tileSize;
            const col = Math.floor(dropX / ts);

            const grid = this.getActiveGrid();
            if (grid.length > 0 && col >= 0 && col < (grid[0]?.length || 0)) {
              const startRow = Math.max(0, Math.floor(this.carpetBombingY / ts));
              for (let r = startRow; r < grid.length; r++) {
                const char = grid[r][col];
                if (char === '#' || char === '=') {
                  groundY = r * ts;
                  break;
                }
              }
            }

            this.groundBurnZones.push({
              id: this.groundBurnIdCounter++,
              x: dropX - 45,
              y: groundY,
              width: 90,
              height: 20,
              timer: 300,
              duration: 300
            });

            this.enemies.forEach(enemy => {
              if (enemy.hp <= 0) return;
              if (Math.abs(enemy.x + enemy.width / 2 - dropX) < 65) {
                // Cap impact damage to once every fire-stream tick = 0.1s at 60fps
                if (((enemy as any).carpetBombDamageCooldown || 0) <= 0) {
                  this.damageEnemy(enemy, Math.floor(this.stats.attack * 1.8));
                  enemy.burnTimer = 30;
                  enemy.burnLingerTimer = 120;
                  (enemy as any).carpetBombDamageCooldown = 1; // 1 tick × 6 frames = 6 frames = 0.1s
                }
              }
            });

            for (let f = 0; f < 3; f++) {
              this.particles.push({
                x: dropX + (Math.random() - 0.5) * 24,
                y: this.py + Math.random() * Math.max(20, groundY - this.py),
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 8 + 4,
                size: Math.random() * 7 + 3,
                color: f % 2 === 0 ? '#ea580c' : '#fef08a',
                life: 18,
                maxLife: 18
              });
            }
          });
        }

        if (this.carpetBombingTimer <= 0) {
          this.carpetBombingActive = false;

          this.px = this.carpetBombingStartX;
          this.py = this.carpetBombingStartY;
          this.pvx = 0;
          this.pvy = 0;
          this.cameraZoom = 1.0;
        }
      }
    }

    if (this.thundermonUltActive) {
      this.pInvulnerableFrames = 65;
      this.thundermonUltTimer--;

      this.cameraZoomTargetX = this.px + this.pWidth / 2;
      this.cameraZoomTargetY = this.py + this.pHeight / 2;

      this.raigekiTargets.forEach(target => {
        if (!target.struck) {
          if (target.strikeTimer <= 0) {
            target.struck = true;
            const enemy = target.enemy;
            if (enemy.hp <= 0 && !enemy.isBonePile) return;

            soundService.playHit();
            this.screenShake = 25;

            const ultDmg = Math.floor(this.stats.attack * 3.8);
            this.damageEnemy(enemy, ultDmg);
            enemy.stunnedTimer = 60;

            if (enemy.hp <= 0) {
              enemy.isBonePile = true;
              this.addFloatingText(enemy.x, enemy.y - 15, FT_DISINTEGRATED_BONES.text, FT_DISINTEGRATED_BONES.color);

              for (let b = 0; b < 16; b++) {
                this.particles.push({
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y + enemy.height / 2,
                  vx: (Math.random() - 0.5) * 6,
                  vy: -Math.random() * 6 - 2,
                  size: Math.random() * 5 + 3,
                  color: b % 2 === 0 ? '#e2e8f0' : '#facc15',
                  life: 30,
                  maxLife: 30
                });
              }
            }

            for (let l = 0; l < 25; l++) {
              this.particles.push({
                x: enemy.x + enemy.width / 2 + (Math.random() - 0.5) * 20,
                y: Math.random() * (enemy.y + enemy.height),
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 12 + 6,
                size: Math.random() * 6 + 3,
                color: l % 2 === 0 ? '#06b6d4' : '#ffffff',
                life: 18,
                maxLife: 18
              });
            }
          } else {
            target.strikeTimer--;
          }
        }
      });

      if (this.thundermonUltTimer <= 0) {
        this.thundermonUltActive = false;
        this.cameraZoom = 1.0;
        this.screenShake = 20;
        this.raigekiTargets = [];
      }
    }

    if (this.lunarmonUltActive) {
      this.pInvulnerableFrames = 180;
      this.pvx = 0;
      this.pvy = 0;

      if (this.lunarmonUltPhase === 'cinematic') {
        this.px = this.lunarmonUltStartX;
        this.py = this.lunarmonUltStartY;
        this.cameraZoomTargetX = this.px + this.pWidth / 2;
        this.cameraZoomTargetY = this.py + this.pHeight / 2;
        this.lunarmonUltChannelTimer--;

        if (this.lunarmonUltChannelTimer === 0) {
          if (this.lunarmonTargets.length > 0) {
            this.lunarmonUltPhase = 'bombarding';
          } else {
            this.lunarmonUltPhase = 'jumping';
            this.lunarmonUltJumpProgress = 0;
          }
        }
      } else if (this.lunarmonUltPhase === 'bombarding') {
        this.px = this.lunarmonUltStartX;
        this.py = this.lunarmonUltStartY;

        let allStruck = true;
        this.lunarmonTargets.forEach(target => {
          if (!target.struck) {
            allStruck = false;
            if (target.strikeTimer <= 0) {
              target.struck = true;
              target.beamTimer = 24; // 24 frames active beam rendering
              target.beamX = target.enemy.x + target.enemy.width / 2;
              target.beamY = target.enemy.y + target.enemy.height;
              const enemy = target.enemy;
              if (enemy.hp <= 0) return;

              soundService.playShoot();
              this.screenShake = 25;

              this.damageEnemy(enemy, Math.floor(this.stats.attack * 2.5));
              enemy.stunnedTimer = 45;

              this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 15, FT_ECLIPSE_MOONBEAM.text, FT_ECLIPSE_MOONBEAM.color);

              for (let p = 0; p < 35; p++) {
                const pAng = Math.random() * Math.PI * 2;
                const pSpd = Math.random() * 7 + 2;
                this.particles.push({
                  x: enemy.x + enemy.width / 2 + (Math.random() - 0.5) * 20,
                  y: enemy.y + enemy.height - Math.random() * 30,
                  vx: Math.cos(pAng) * pSpd,
                  vy: Math.sin(pAng) * pSpd - 2,
                  size: Math.random() * 6 + 2,
                  color: p % 3 === 0 ? '#ffffff' : p % 3 === 1 ? '#93c5fd' : '#e0e7ff',
                  life: 20,
                  maxLife: 20
                });
              }
            } else {
              target.strikeTimer--;
            }
          }
        });

        if (allStruck) {
          this.lunarmonUltPhase = 'jumping';
          this.lunarmonUltJumpProgress = 0;
        }
      } else if (this.lunarmonUltPhase === 'jumping') {
        this.lunarmonUltJumpProgress += 0.04; // 25 frames jump animation (~0.4s)
        const t = Math.min(1.0, this.lunarmonUltJumpProgress);
        // Smooth ease-out quad interpolation upward
        const easeOut = 1 - (1 - t) * (1 - t);
        this.px = this.lunarmonUltStartX;
        this.py = this.lunarmonUltStartY + (this.lunarmonUltJumpY - this.lunarmonUltStartY) * easeOut;

        // Upward trail aura particles during jump
        for (let p = 0; p < 4; p++) {
          this.particles.push({
            x: this.px + this.pWidth / 2 + (Math.random() - 0.5) * 20,
            y: this.py + this.pHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 4 + 2,
            size: Math.random() * 5 + 2,
            color: p % 2 === 0 ? '#93c5fd' : '#c7d2fe',
            life: 15,
            maxLife: 15
          });
        }

        if (t >= 1.0) {
          this.lunarmonUltPhase = 'laser';
          this.screenShake = 30;
          soundService.playJump();
        }
      } else if (this.lunarmonUltPhase === 'laser') {
        this.px = this.lunarmonUltStartX;
        this.py = this.lunarmonUltJumpY;
        this.lunarmonUltTimer--;

        // Radial beam control: A (left) rotates clockwise (+angle), D (right) rotates counter-clockwise (-angle)
        if (this.keys['a'] || this.keys['A'] || this.keys['ArrowLeft']) {
          this.lunarmonUltBeamAngle += 0.04;
        }
        if (this.keys['d'] || this.keys['D'] || this.keys['ArrowRight']) {
          this.lunarmonUltBeamAngle -= 0.04;
        }

        // Clamp beam angle so it aims downward/sideways (between 0.2 rad and Math.PI - 0.2 rad)
        this.lunarmonUltBeamAngle = Math.max(0.2, Math.min(Math.PI - 0.2, this.lunarmonUltBeamAngle));

        // Damage tick every 15 frames = 0.25s at 60fps (0.25 tick damage requested)
        const isDamageTick = this.lunarmonUltTimer % 15 === 0;

        const bx = this.px + this.pWidth / 2;
        const by = this.py + this.pHeight / 2;
        const beamLength = 850;
        const endX = bx + Math.cos(this.lunarmonUltBeamAngle) * beamLength;
        const endY = by + Math.sin(this.lunarmonUltBeamAngle) * beamLength;

        if (isDamageTick) {
          soundService.playShoot();
          // Check collision along beam line vs enemies
          this.enemies.forEach(enemy => {
            if (enemy.hp <= 0) return;
            const ex = enemy.x + enemy.width / 2;
            const ey = enemy.y + enemy.height / 2;

            // Distance from point (ex, ey) to line segment (bx, by) -> (endX, endY)
            const dx = endX - bx;
            const dy = endY - by;
            const lenSq = dx * dx + dy * dy;
            let t = ((ex - bx) * dx + (ey - by) * dy) / lenSq;
            t = Math.max(0, Math.min(1, t));
            const projX = bx + t * dx;
            const projY = by + t * dy;
            const distToBeam = Math.hypot(ex - projX, ey - projY);

            if (distToBeam < 50) {
              this.damageEnemy(enemy, Math.max(1, Math.floor(this.stats.attack * 0.8)));
              this.addFloatingText(ex, ey - 10, FT_CELESTIAL_TICK.text, FT_CELESTIAL_TICK.color);

              // Impact explosion particles on enemy hit
              for (let hitP = 0; hitP < 8; hitP++) {
                const hitAng = Math.random() * Math.PI * 2;
                const hitSpd = Math.random() * 6 + 2;
                this.particles.push({
                  x: ex,
                  y: ey,
                  vx: Math.cos(hitAng) * hitSpd,
                  vy: Math.sin(hitAng) * hitSpd,
                  size: Math.random() * 6 + 3,
                  color: hitP % 2 === 0 ? '#93c5fd' : '#e0e7ff',
                  life: 16,
                  maxLife: 16
                });
              }
            }
          });
        }

        // AAA Beam Particle FX: Orbiting spiral particles along beam axis + ground impact flare
        for (let p = 0; p < 8; p++) {
          const distProgress = Math.random();
          const pDist = beamLength * distProgress;
          const axisX = bx + Math.cos(this.lunarmonUltBeamAngle) * pDist;
          const axisY = by + Math.sin(this.lunarmonUltBeamAngle) * pDist;

          const spiralPerpAngle = this.lunarmonUltBeamAngle + Math.PI / 2;
          const spiralOffset = Math.sin(this.frameCount * 0.3 + distProgress * 12 + p) * (18 + Math.random() * 12);
          const pX = axisX + Math.cos(spiralPerpAngle) * spiralOffset;
          const pY = axisY + Math.sin(spiralPerpAngle) * spiralOffset;

          this.particles.push({
            x: pX,
            y: pY,
            vx: Math.cos(this.lunarmonUltBeamAngle) * (Math.random() * 4 + 2),
            vy: Math.sin(this.lunarmonUltBeamAngle) * (Math.random() * 4 + 2),
            size: Math.random() * 5 + 2,
            color: p % 3 === 0 ? '#ffffff' : p % 3 === 1 ? '#93c5fd' : '#c7d2fe',
            life: 14,
            maxLife: 14
          });
        }

        if (this.lunarmonUltTimer <= 0) {
          this.lunarmonUltActive = false;
          this.px = this.lunarmonUltStartX;
          this.py = this.lunarmonUltStartY;
          this.pvx = 0;
          this.pvy = 0;
          this.cameraZoom = 1.0;
        }
      }
    }

    if (this.azuremonUltActive) {
      this.pInvulnerableFrames = 180;
      this.pvx = 0;
      this.pvy = 0;

      if (this.azuremonUltPhase === 'channeling') {
        this.px = this.azuremonUltStartX;
        this.py = this.azuremonUltStartY;
        this.azuremonUltChannelTimer--;

        if (this.azuremonUltChannelTimer % 12 === 0) {
          const drainAmount = Math.max(1, Math.floor(this.pMaxHP * 0.01));
          if (this.pHP > 1) {
            this.pHP = Math.max(1, this.pHP - drainAmount);
            this.callbacks.onHpChange?.(this.pHP, this.pMaxHP);
            this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, `-${drainAmount} HP`, '#ef4444');
          }
        }

        for (let p = 0; p < 4; p++) {
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.random() * 35 + 10;
          this.particles.push({
            x: this.px + this.pWidth / 2 + Math.cos(ang) * rad,
            y: this.py + this.pHeight / 2 + Math.sin(ang) * rad,
            vx: -Math.cos(ang) * 3,
            vy: -Math.sin(ang) * 3,
            size: Math.random() * 4 + 2,
            color: p % 2 === 0 ? '#38bdf8' : '#e0f2fe',
            life: 15,
            maxLife: 15
          });
        }

        if (this.azuremonUltChannelTimer <= 0) {
          this.azuremonUltPhase = 'beam';
          this.screenShake = 30;
          soundService.playAzuremonBeam(false);
        }
      } else if (this.azuremonUltPhase === 'beam') {
        this.px = this.azuremonUltStartX;
        this.py = this.azuremonUltStartY;
        this.azuremonUltTimer--;

        if (this.keys['w'] || this.keys['W'] || this.keys['ArrowUp']) {
          this.azuremonUltBeamAngle -= 0.02;
        }
        if (this.keys['s'] || this.keys['S'] || this.keys['ArrowDown']) {
          this.azuremonUltBeamAngle += 0.02;
        }

        const baseAngle = this.pFacing === 1 ? 0 : Math.PI;
        const minAngle = baseAngle - Math.PI * 0.35;
        const maxAngle = baseAngle + Math.PI * 0.35;
        this.azuremonUltBeamAngle = Math.max(minAngle, Math.min(maxAngle, this.azuremonUltBeamAngle));

        const startX = this.px + this.pWidth / 2;
        const startY = this.py + this.pHeight / 2;
        const maxDist = 1200;
        const beamRadius = 50;

        let endX = startX + Math.cos(this.azuremonUltBeamAngle) * maxDist;
        let endY = startY + Math.sin(this.azuremonUltBeamAngle) * maxDist;
        let hitGridR = -1;
        let hitGridC = -1;

        const stepSize = 10;
        for (let dist = 30; dist <= maxDist; dist += stepSize) {
          const cx = startX + Math.cos(this.azuremonUltBeamAngle) * dist;
          const cy = startY + Math.sin(this.azuremonUltBeamAngle) * dist;
          const c = Math.floor(cx / this.level.tileSize);
          const r = Math.floor(cy / this.level.tileSize);

          if (this.isSolid(cx, cy)) {
            endX = cx;
            endY = cy;
            hitGridR = r;
            hitGridC = c;
            break;
          }
        }

        if (hitGridR >= 0 && hitGridC >= 0) {
          if (this.azuremonUltTimer % 12 === 0) {
            soundService.playAzuremonImpact(false);
          }
          const key = `${hitGridR}_${hitGridC}`;
          const currentCount = (this.azuremonBlastCounters.get(key) || 0) + 1;
          this.azuremonBlastCounters.set(key, currentCount);

          if (currentCount >= 30) {
            const grid = this.getActiveGrid();
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const tr = hitGridR + dr;
                const tc = hitGridC + dc;

                const tilePx = tc * this.level.tileSize + this.level.tileSize / 2;
                const tilePy = tr * this.level.tileSize + this.level.tileSize / 2;
                const nearBoss = this.enemies.some(e => this.isBossType(e.type) && Math.hypot(e.x + e.width / 2 - tilePx, e.y + e.height / 2 - tilePy) < 300);

                if (!nearBoss && grid[tr] && tc >= 0 && tc < grid[tr].length) {
                  const ch = grid[tr][tc];
                  if (ch === '#' || ch === '=') {
                    grid[tr] = grid[tr].substring(0, tc) + '.' + grid[tr].substring(tc + 1);
                    this.spawnDustParticles(tilePx, tilePy, 8, '#38bdf8');
                  }
                }
              }
            }
            this.azuremonBlastCounters.delete(key);
            this.addFloatingText(endX, endY, '💥 TERRAIN BLASTED!', '#38bdf8');
          }
        }

        const actualDist = Math.hypot(endX - startX, endY - startY);
        const beamVx = Math.cos(this.azuremonUltBeamAngle);
        const beamVy = Math.sin(this.azuremonUltBeamAngle);

        this.enemies.forEach(enemy => {
          if (enemy.hp <= 0) return;
          const ex = enemy.x + enemy.width / 2;
          const ey = enemy.y + enemy.height / 2;
          const dx = ex - startX;
          const dy = ey - startY;
          const proj = dx * beamVx + dy * beamVy;

          if (proj >= 0 && proj <= actualDist) {
            const perpDist = Math.abs(dx * (-beamVy) + dy * beamVx);
            const pullRadius = beamRadius + 140;
            if (perpDist <= pullRadius) {
              // Gravitational suction toward center line of beam
              const centerLineX = startX + beamVx * proj;
              const centerLineY = startY + beamVy * proj;
              const pullX = centerLineX - ex;
              const pullY = centerLineY - ey;
              const pullLen = Math.hypot(pullX, pullY) || 1;
              const pullForce = (1 - perpDist / pullRadius) * 4.5;

              enemy.x += (pullX / pullLen) * pullForce;
              enemy.y += (pullY / pullLen) * pullForce;

              if (perpDist <= beamRadius + Math.max(enemy.width, enemy.height) / 2) {
                if (this.azuremonUltTimer % 15 === 0) {
                  this.damageEnemy(enemy, Math.floor(this.stats.attack * 2.5));
                  enemy.stunnedTimer = 15;
                  this.spawnDustParticles(ex, ey, 8, '#38bdf8');
                  this.addFloatingText(ex, ey - 15, '💥 2.5X SINGULARITY BLAST', '#38bdf8');
                }
              }
            }
          }
        });

        for (let p = 0; p < 6; p++) {
          const t = Math.random();
          const px = startX + (endX - startX) * t + (Math.random() - 0.5) * beamRadius;
          const py = startY + (endY - startY) * t + (Math.random() - 0.5) * beamRadius;
          this.particles.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 6 + 2,
            color: p % 2 === 0 ? '#38bdf8' : '#ffffff',
            life: 10,
            maxLife: 10
          });
        }

        if (this.azuremonUltTimer <= 0) {
          this.azuremonUltActive = false;
        }
      }
    }

    this.enemies.forEach(enemy => {
      if (enemy.hp > 0) {
        (enemy as any).touchingElectricZone = false;
        (enemy as any).touchingFireZone = false;
      }
    });

    this.groundBurnZones.forEach(zone => {
      zone.timer--;

      const isElectric = (zone as any).isElectric;

      if (this.frameCount % 4 === 0) {
        this.particles.push({
          x: zone.x + Math.random() * zone.width,
          y: zone.y + zone.height - Math.random() * 8,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 4 - 1,
          size: Math.random() * 6 + 3,
          color: isElectric ? (Math.random() > 0.5 ? '#06b6d4' : '#facc15') : (Math.random() > 0.5 ? '#f97316' : '#fef08a'),
          life: 18,
          maxLife: 18
        });
      }

      this.enemies.forEach(enemy => {
        if (enemy.hp <= 0) return;
        if (
          enemy.x < zone.x + zone.width &&
          enemy.x + enemy.width > zone.x &&
          enemy.y + enemy.height >= zone.y - 12 &&
          enemy.y <= zone.y + zone.height + 24
        ) {
          if (isElectric) {
            (enemy as any).touchingElectricZone = true;
          } else {
            (enemy as any).touchingFireZone = true;
          }
        }
      });
    });

    // Process burn/electrocution tick exactly once per frame per enemy to prevent overlapping acceleration
    this.enemies.forEach(enemy => {
      if (enemy.hp <= 0) return;

      if ((enemy as any).touchingElectricZone) {
        enemy.burnTickTimer = (enemy.burnTickTimer || 0) + 1;
        // Electrocuted tick (0.25s / 15 frames)
        if (enemy.burnTickTimer % 15 === 0) {
          this.damageEnemy(enemy, Math.max(1, Math.floor(this.stats.attack * 0.6)));
          enemy.stunnedTimer = 12;
          this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 10, FT_ELECTROCUTED.text, FT_ELECTROCUTED.color);
        }
      } else if ((enemy as any).touchingFireZone) {
        enemy.burnTimer = 30;
        enemy.burnLingerTimer = 120;

        enemy.burnTickTimer = (enemy.burnTickTimer || 0) + 1;
        // Fire burn tick: 0.1s (6 frames)
        if (enemy.burnTickTimer % 6 === 0) {
          this.damageEnemy(enemy, Math.max(1, Math.floor(this.stats.attack * 0.25)));
          this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 10, FT_BURN.text, FT_BURN.color);
        }
      }
    });

    this.groundBurnZones = this.groundBurnZones.filter(z => z.timer > 0);

    this.enemies.forEach(enemy => {
      if (enemy.hp <= 0) return;
      if ((enemy.burnTimer || 0) > 0) enemy.burnTimer!--;
      if ((enemy.burnLingerTimer || 0) > 0) enemy.burnLingerTimer!--;

      const isBurning = (enemy.burnTimer || 0) > 0 || (enemy.burnLingerTimer || 0) > 0;
      if (isBurning) {
        enemy.x += enemy.vx * 0.8;
        if (this.frameCount % 5 === 0) {
          this.particles.push({
            x: enemy.x + Math.random() * enemy.width,
            y: enemy.y + Math.random() * enemy.height,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 3 - 1,
            size: Math.random() * 5 + 2,
            color: Math.random() > 0.5 ? '#ef4444' : '#f97316',
            life: 14,
            maxLife: 14
          });
        }
      }
    });

    this.updateBirdFamiliar();
  }

  private updateBirdFamiliar() {
    if (!this.birdActive) return;

    if (this.birdRampageTimer > 0) {
      this.birdRampageTimer--;
    }

    const isRampage = this.birdRampageTimer > 0;
    const speed = isRampage ? 11 : 6.5;

    if (this.birdAttackCooldown > 0) {
      this.birdAttackCooldown--;
    }

    const homeX = this.px + (this.pFacing === 1 ? -15 : this.pWidth + 15);
    const homeY = this.py - 30 + Math.sin(this.frameCount * 0.15) * 6;

    if (this.birdState === 'idle') {
      const dx = homeX - this.birdX;
      const dy = homeY - this.birdY;
      this.birdX += dx * 0.15;
      this.birdY += dy * 0.15;

      if (this.birdAttackCooldown <= 0) {
        let nearestEnemy: Enemy | null = null;
        let minDist = 250;

        for (const enemy of this.enemies) {
          if (enemy.hp <= 0) continue;
          const dist = Math.hypot(this.px - enemy.x, this.py - enemy.y);
          if (dist < minDist) {
            minDist = dist;
            nearestEnemy = enemy;
          }
        }

        if (nearestEnemy) {
          this.birdTargetEnemy = nearestEnemy;
          this.birdState = 'swooping';
        }
      }
    } else if (this.birdState === 'swooping') {
      if (!this.birdTargetEnemy || this.birdTargetEnemy.hp <= 0) {
        this.birdState = 'returning';
        this.birdTargetEnemy = null;
      } else {
        const tx = this.birdTargetEnemy.x + this.birdTargetEnemy.width / 2;
        const ty = this.birdTargetEnemy.y + this.birdTargetEnemy.height / 2;

        const dx = tx - this.birdX;
        const dy = ty - this.birdY;
        const dist = Math.hypot(dx, dy);

        if (dist < 20) {
          const damage = Math.floor(this.stats.attack * (isRampage ? 1.4 : 0.85));
          this.damageEnemy(this.birdTargetEnemy, damage);
          soundService.playHit();

          this.spawnDustParticles(tx, ty, 8, isRampage ? '#f97316' : '#38bdf8');
          const _ftBirdDmg = FT_BIRD_DAMAGE(damage, isRampage); this.addFloatingText(tx, ty - 10, _ftBirdDmg.text, _ftBirdDmg.color);

          this.birdState = 'returning';
          this.birdAttackCooldown = isRampage ? 10 : 40;
          this.birdTargetEnemy = null;
        } else {
          this.birdX += (dx / dist) * speed;
          this.birdY += (dy / dist) * speed;
        }
      }
    } else if (this.birdState === 'returning') {
      const dx = homeX - this.birdX;
      const dy = homeY - this.birdY;
      const dist = Math.hypot(dx, dy);

      if (dist < 25) {
        this.birdState = 'idle';
      } else {
        this.birdX += (dx / dist) * (speed * 1.1);
        this.birdY += (dy / dist) * (speed * 1.1);
      }
    }

    // Fire trail particles behind the bird during rampage
    if (isRampage && this.frameCount % 3 === 0) {
      for (let t = 0; t < 2; t++) {
        this.particles.push({
          x: this.birdX + (Math.random() - 0.5) * 10,
          y: this.birdY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2,
          size: Math.random() * 5 + 2,
          color: t % 2 === 0 ? '#f97316' : '#fef08a',
          life: 10,
          maxLife: 10
        });
      }
    }
  }

  private updateParticles() {
    this.particles.forEach((part, index) => {
      part.x += part.vx;
      part.y += part.vy;
      part.vy += 0.08;
      part.life--;

      if (part.life <= 0) {
        this.particles.splice(index, 1);
      }
    });

    this.floatingTexts.forEach((ft, index) => {
      ft.y -= 0.6;
      ft.life -= 1.8;
      if (ft.life <= 0) {
        this.floatingTexts.splice(index, 1);
      }
    });
  }

  private spawnDustParticles(x: number, y: number, count: number, color = '#ffffff') {
    if (this.particles.length > 100) {
      this.particles.splice(0, this.particles.length - 100);
    }

    const isInferno = color === '#ef4444' || color === '#f97316' || color === '#ea580c' || color === '#f59e0b';
    const isIce = color === '#38bdf8' || color === '#7dd3fc' || color === '#0284c7' || color === '#737373';
    const isPoison = color === '#22c55e' || color === '#86efac' || color === '#a855f7' || color === '#15803d';

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isInferno || isIce || isPoison ? 4.5 : 2.5) + 0.5;
      const maxLife = Math.random() * (isInferno || isIce || isPoison ? 25 : 20) + 12;
      this.particles.push({
        x: x + (Math.random() - 0.5) * (isInferno || isIce || isPoison ? 8 : 2),
        y: y + (Math.random() - 0.5) * (isInferno || isIce || isPoison ? 8 : 2),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isInferno ? 1.8 : isPoison ? 1.2 : 0.8),
        color,
        size: Math.random() * (isInferno || isIce || isPoison ? 5 : 3) + 2,
        life: maxLife,
        maxLife,
        type: isInferno ? 'inferno' : isIce ? 'ice' : isPoison ? 'poison' : 'general',
      } as any);
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string, isUltimate = false) {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 100,
      isUltimate
    });
  }

  private draw() {
    const ts = this.level.tileSize;

    const viewW = this.canvas.width;
    const viewH = this.canvas.height;

    let targetCamX = this.px + this.pWidth / 2 - viewW / 2;
    if (this.levelWidth > viewW) {
      targetCamX = Math.max(0, Math.min(this.levelWidth - viewW, targetCamX));
    } else {
      targetCamX = (this.levelWidth - viewW) / 2;
    }

    let targetCamY = this.py + this.pHeight / 2 - viewH / 2;
    if (this.levelHeight > viewH) {
      targetCamY = Math.max(0, Math.min(this.levelHeight - viewH, targetCamY));
    } else {
      targetCamY = this.levelHeight - viewH;
    }

    this.cameraX = targetCamX;
    this.cameraY = targetCamY;

    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    const themeType = this.level.theme.type;

    if (themeType === 'forest') {
      bgGrad.addColorStop(0, '#021a18');
      bgGrad.addColorStop(0.5, '#042f2e');
      bgGrad.addColorStop(1, '#065f46');
    } else if (themeType === 'ruins') {
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#1e293b');
    } else if (themeType === 'volcano') {
      bgGrad.addColorStop(0, '#180202');
      bgGrad.addColorStop(0.5, '#450a0a');
      bgGrad.addColorStop(1, '#7f1d1d');
    } else if (themeType === 'ice') {
      bgGrad.addColorStop(0, '#031828');
      bgGrad.addColorStop(0.5, '#082f49');
      bgGrad.addColorStop(1, '#0369a1');
    } else if (themeType === 'shadow') {
      bgGrad.addColorStop(0, '#090518');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#4c1d95');
    } else if (themeType === 'temple') {
      bgGrad.addColorStop(0, '#1a0800');
      bgGrad.addColorStop(0.5, '#451a03');
      bgGrad.addColorStop(1, '#78350f');
    } else if (themeType === 'heavens') {
      bgGrad.addColorStop(0, '#032b45');
      bgGrad.addColorStop(0.5, '#075985');
      bgGrad.addColorStop(1, '#0284c7');
    } else if (themeType === 'space') {
      bgGrad.addColorStop(0, '#02040a');
      bgGrad.addColorStop(0.5, '#090514');
      bgGrad.addColorStop(1, '#1e1b4b');
    } else {
      bgGrad.addColorStop(0, '#180202');
      bgGrad.addColorStop(0.5, '#450a0a');
      bgGrad.addColorStop(1, '#991b1b');
    }

    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // DRAW THEMED PARALLAX BACKGROUNDS
    this.ctx.save();
    const scrollX = this.cameraX;
    const scrollY = this.cameraY;

    // Positive-safe modulo: always returns [0, m)
    const pmod = (n: number, m: number) => ((n % m) + m) % m;

    if (themeType === 'forest') {
      // Far layer — distant silhouette hills
      this.ctx.fillStyle = 'rgba(2, 26, 24, 0.55)';
      const pX1 = pmod(-(scrollX * 0.1), 350);
      for (let x = pX1 - 350; x < viewW + 350; x += 350) {
        this.ctx.beginPath();
        this.ctx.ellipse(x + 175, viewH + 60, 210, 340, 0, Math.PI, 0);
        this.ctx.fill();
      }
      // Mid layer — pine tree silhouettes
      this.ctx.fillStyle = 'rgba(3, 40, 36, 0.65)';
      const pX2 = pmod(-(scrollX * 0.22), 170);
      for (let x = pX2 - 170; x < viewW + 170; x += 170) {
        // Tall pine triangle
        this.ctx.beginPath();
        this.ctx.moveTo(x + 85, viewH - viewH * 0.9);
        this.ctx.lineTo(x + 170, viewH + 10);
        this.ctx.lineTo(x, viewH + 10);
        this.ctx.fill();
        // Overlap second tier
        this.ctx.beginPath();
        this.ctx.moveTo(x + 85, viewH - viewH * 0.65);
        this.ctx.lineTo(x + 155, viewH + 10);
        this.ctx.lineTo(x + 15, viewH + 10);
        this.ctx.fill();
      }
      // Near layer — darker foreground
      this.ctx.fillStyle = 'rgba(1, 15, 13, 0.5)';
      const pX3 = pmod(-(scrollX * 0.4), 130);
      for (let x = pX3 - 130; x < viewW + 130; x += 130) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + 65, viewH - viewH * 0.55);
        this.ctx.lineTo(x + 130, viewH + 10);
        this.ctx.lineTo(x, viewH + 10);
        this.ctx.fill();
      }
    } else if (themeType === 'ruins') {
      // Distant arched skyline
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      const pX = pmod(-(scrollX * 0.15), 320);
      for (let x = pX - 320; x < viewW + 320; x += 320) {
        // Tall pillar left
        this.ctx.fillRect(x + 30, viewH - viewH * 0.85, 36, viewH * 0.85 + 10);
        this.ctx.fillRect(x + 16, viewH - viewH * 0.9, 68, 18);
        // Arch in center
        this.ctx.beginPath();
        this.ctx.arc(x + 180, viewH - viewH * 0.5, 80, Math.PI, 0);
        this.ctx.lineWidth = 18;
        this.ctx.strokeStyle = 'rgba(15, 23, 42, 0.5)';
        this.ctx.stroke();
        // Tall pillar right
        this.ctx.fillRect(x + 260, viewH - viewH * 0.7, 36, viewH * 0.7 + 10);
        this.ctx.fillRect(x + 248, viewH - viewH * 0.75, 58, 16);
      }
      // Ground line rubble
      this.ctx.fillStyle = 'rgba(30, 41, 59, 0.3)';
      const pX2 = pmod(-(scrollX * 0.3), 120);
      for (let x = pX2 - 120; x < viewW + 120; x += 120) {
        this.ctx.fillRect(x, viewH - 14, 80, 14);
        this.ctx.fillRect(x + 25, viewH - 28, 40, 14);
      }
    } else if (themeType === 'volcano' || themeType === 'core') {
      // Distant volcano peaks
      this.ctx.fillStyle = 'rgba(60, 8, 8, 0.55)';
      const pX = pmod(-(scrollX * 0.12), 400);
      for (let x = pX - 400; x < viewW + 400; x += 400) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, viewH + 10);
        this.ctx.lineTo(x + 200, viewH - viewH * 0.85);
        this.ctx.lineTo(x + 400, viewH + 10);
        this.ctx.fill();
      }
      // Mid lava glow ridges
      this.ctx.fillStyle = 'rgba(127, 29, 29, 0.45)';
      const pX2 = pmod(-(scrollX * 0.25), 240);
      for (let x = pX2 - 240; x < viewW + 240; x += 240) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, viewH + 10);
        this.ctx.lineTo(x + 120, viewH - viewH * 0.55);
        this.ctx.lineTo(x + 240, viewH + 10);
        this.ctx.fill();
      }
      // Animated ember sparks
      this.ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
      for (let i = 0; i < 20; i++) {
        const ex2 = (i * 113 + this.frameCount * 0.5) % (viewW + 100);
        const ey2 = viewH - ((i * 67 + this.frameCount * 1.1) % viewH);
        this.ctx.beginPath();
        this.ctx.arc(ex2, ey2, 2.5 + (i % 3), 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else if (themeType === 'ice') {
      // Distant ice spire mountains
      this.ctx.fillStyle = 'rgba(3, 69, 110, 0.55)';
      const pX = pmod(-(scrollX * 0.12), 380);
      for (let x = pX - 380; x < viewW + 380; x += 380) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, viewH + 10);
        this.ctx.lineTo(x + 190, viewH - viewH * 0.9);
        this.ctx.lineTo(x + 380, viewH + 10);
        this.ctx.fill();
      }
      // Mid jagged ice spires
      this.ctx.fillStyle = 'rgba(7, 89, 133, 0.45)';
      const pX2 = pmod(-(scrollX * 0.25), 180);
      for (let x = pX2 - 180; x < viewW + 180; x += 180) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, viewH + 10);
        this.ctx.lineTo(x + 30, viewH - viewH * 0.45);
        this.ctx.lineTo(x + 60, viewH - viewH * 0.25);
        this.ctx.lineTo(x + 90, viewH - viewH * 0.6);
        this.ctx.lineTo(x + 120, viewH - viewH * 0.35);
        this.ctx.lineTo(x + 150, viewH - viewH * 0.5);
        this.ctx.lineTo(x + 180, viewH + 10);
        this.ctx.fill();
      }
    } else if (themeType === 'shadow') {
      // Dark tendrils and spirals
      this.ctx.strokeStyle = 'rgba(88, 28, 135, 0.22)';
      this.ctx.lineWidth = 5;
      const pX = pmod(-(scrollX * 0.15), 280);
      for (let x = pX - 280; x < viewW + 280; x += 280) {
        // Tall vertical void column
        this.ctx.beginPath();
        this.ctx.moveTo(x + 140, viewH + 10);
        this.ctx.bezierCurveTo(x + 180, viewH * 0.6, x + 80, viewH * 0.3, x + 140, 0);
        this.ctx.stroke();
        // Orbit rings
        this.ctx.beginPath();
        this.ctx.ellipse(x + 140, viewH * 0.45, 90, 200, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.stroke();
      }
      // Faint spirit silhouettes
      this.ctx.fillStyle = 'rgba(76, 29, 149, 0.12)';
      for (let i = 0; i < 6; i++) {
        const sx = pmod(i * 180 - scrollX * 0.08, viewW + 200);
        const sy = (i * 110) % viewH;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 28, 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else if (themeType === 'temple') {
      // Temple columns background
      this.ctx.fillStyle = 'rgba(80, 30, 5, 0.35)';
      const pX = pmod(-(scrollX * 0.13), 280);
      for (let x = pX - 280; x < viewW + 280; x += 280) {
        // Column
        this.ctx.fillRect(x + 60, 0, 38, viewH + 10);
        this.ctx.fillRect(x + 50, 0, 56, 24);
        this.ctx.fillRect(x + 50, viewH - 24, 56, 24);
        // Far column
        this.ctx.fillRect(x + 200, 0, 30, viewH + 10);
        this.ctx.fillRect(x + 192, 0, 44, 18);
      }
      // Drifting sacred flame particles
      this.ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
      for (let i = 0; i < 12; i++) {
        const fx = (i * 140 + this.frameCount * 0.3) % (viewW + 80);
        const fy = viewH - ((i * 77 + this.frameCount * 0.7) % viewH);
        this.ctx.beginPath();
        this.ctx.arc(fx, fy, 4 + (i % 3), 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else if (themeType === 'heavens') {
      // Towering cloud pillars
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      const pX = pmod(-(scrollX * 0.18) - this.frameCount * 0.08, 320);
      for (let x = pX - 320; x < viewW + 320; x += 320) {
        // Large cloud mass
        this.ctx.beginPath();
        this.ctx.arc(x + 60, viewH * 0.25, 55, 0, Math.PI * 2);
        this.ctx.arc(x + 110, viewH * 0.2, 75, 0, Math.PI * 2);
        this.ctx.arc(x + 160, viewH * 0.25, 55, 0, Math.PI * 2);
        this.ctx.fill();
        // Lower cloud
        this.ctx.beginPath();
        this.ctx.arc(x + 200, viewH * 0.6, 45, 0, Math.PI * 2);
        this.ctx.arc(x + 240, viewH * 0.56, 60, 0, Math.PI * 2);
        this.ctx.arc(x + 280, viewH * 0.6, 45, 0, Math.PI * 2);
        this.ctx.fill();
      }
      // Ray of light shafts
      this.ctx.fillStyle = 'rgba(186, 230, 253, 0.05)';
      for (let i = 0; i < 5; i++) {
        const rx = pmod(i * 220 - scrollX * 0.06, viewW + 300);
        this.ctx.beginPath();
        this.ctx.moveTo(rx, 0);
        this.ctx.lineTo(rx + 60, 0);
        this.ctx.lineTo(rx + 110, viewH);
        this.ctx.lineTo(rx - 50, viewH);
        this.ctx.fill();
      }
    } else if (themeType === 'space') {
      // Static pinpoint starfield
      this.ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 60; i++) {
        const starX = (i * 77 + 23) % viewW;
        const starY = (i * 37 + 11) % viewH;
        this.ctx.globalAlpha = 0.08 + (i % 5) * 0.1;
        this.ctx.fillRect(starX, starY, 1.5, 1.5);
      }
      this.ctx.globalAlpha = 1.0;
      // Parallax moving stars
      this.ctx.fillStyle = '#e0f2fe';
      for (let i = 0; i < 40; i++) {
        const baseSX = (i * 113 + 47) % (viewW + 200) - 100;
        const baseSY = (i * 61 + 31) % (viewH + 100) - 50;
        const sx = pmod(baseSX - scrollX * 0.1, viewW + 200) - 100;
        const sy = pmod(baseSY - scrollY * 0.1, viewH + 100) - 50;
        this.ctx.globalAlpha = 0.3 + (i % 4) * 0.15;
        this.ctx.fillRect(sx, sy, 2.5, 2.5);
      }
      this.ctx.globalAlpha = 1.0;
      // Nebula cloud wisps
      this.ctx.fillStyle = 'rgba(79, 70, 229, 0.08)';
      for (let i = 0; i < 4; i++) {
        const nx = pmod(i * 280 - scrollX * 0.05, viewW + 400);
        const ny = (i * 150) % viewH;
        this.ctx.beginPath();
        this.ctx.ellipse(nx, ny, 180, 90, i * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
      // Gas planet / moon
      const moonX = viewW * 0.78 - (scrollX * 0.06);
      const moonY = viewH * 0.18 - (scrollY * 0.06);
      const moonRad = 55;
      const moonGrad = this.ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, moonRad);
      moonGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
      moonGrad.addColorStop(0.3, 'rgba(199, 210, 254, 0.7)');
      moonGrad.addColorStop(0.6, 'rgba(79, 70, 229, 0.5)');
      moonGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      this.ctx.fillStyle = moonGrad;
      this.ctx.beginPath();
      this.ctx.arc(moonX, moonY, moonRad, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();

    this.ctx.save();
    this.ctx.globalAlpha = 0.04;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
    this.ctx.restore();

    this.ctx.save();

    if (this.ultimateCinematicActive) {
      const centerX = this.px + this.pWidth / 2;
      const centerY = this.py + this.pHeight / 2;
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(2.2, 2.2);
      this.ctx.translate(-centerX, -centerY);
    } else if (this.cameraZoom !== 1.0) {
      const focusX = this.cameraZoomTargetX || (this.px + this.pWidth / 2);
      const focusY = this.cameraZoomTargetY || (this.py + this.pHeight / 2);
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(this.cameraZoom, this.cameraZoom);
      this.ctx.translate(-focusX, -focusY);
    } else {
      this.ctx.translate(-this.cameraX, -this.cameraY);
    }

    const activeGrid = this.getActiveGrid();
    const originalRows = activeGrid.length;
    // Render extra rows below the level to fill the screen when zooming/casting ultimate
    const renderRows = originalRows > 0 ? originalRows + 15 : 0;

    for (let r = 0; r < renderRows; r++) {
      const row = r < originalRows ? activeGrid[r] : null;
      const numCols = row ? row.length : (activeGrid[0]?.length || 0);

      for (let c = 0; c < numCols; c++) {
        let char = '.';
        if (r < originalRows) {
          char = row ? row[c] : '.';
        } else {
          // Virtual row below the level: extend the bottom-most solid ground block '#' downwards
          const bottomChar = activeGrid[originalRows - 1]?.[c];
          if (bottomChar === '#') {
            char = '#';
          }
        }

        const ex = c * ts;
        const ey = r * ts;

        const zoomPadding = this.cameraZoom < 1.0 ? 500 : 60;
        if (ex + ts < this.cameraX - zoomPadding || ex > this.cameraX + this.canvas.width + zoomPadding) continue;
        if (ey + ts < this.cameraY - zoomPadding || ey > this.cameraY + this.canvas.height + zoomPadding) continue;

        if (char === '#') {
          this.ctx.fillStyle = this.level.theme.solidColor;
          this.ctx.fillRect(ex, ey, ts, ts);
          this.ctx.strokeStyle = this.level.theme.borderColor;
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(ex, ey, ts, ts);

          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          this.ctx.fillRect(ex + 1, ey + 1, ts - 2, 5);
        } else if (char === '=') {
          this.ctx.fillStyle = this.level.theme.platformColor;
          this.ctx.fillRect(ex, ey, ts, 12);
          this.ctx.strokeStyle = this.level.theme.borderColor;
          this.ctx.lineWidth = 1.5;
          this.ctx.strokeRect(ex, ey, ts, 12);
        } else if (char === '*') {
          const themeType = this.level.theme.type;

          if (this.level.isUnderwater) {
            this.ctx.fillStyle = '#0f172a';
            this.ctx.fillRect(ex, ey, ts, ts);

            this.ctx.save();
            this.ctx.translate(ex + ts / 2, ey + ts / 2);

            let radialGrad = this.gradientCache.get('whirlpool');
            if (!radialGrad) {
              radialGrad = this.ctx.createRadialGradient(0, 0, 2, 0, 0, ts * 1.5);
              radialGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
              radialGrad.addColorStop(0.5, 'rgba(8, 145, 178, 0.25)');
              radialGrad.addColorStop(1, 'rgba(8, 145, 178, 0.0)');
              this.gradientCache.set('whirlpool', radialGrad);
            }
            this.ctx.fillStyle = radialGrad;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, ts * 1.5, 0, Math.PI * 2);
            this.ctx.fill();

            const rotationAngle = (this.frameCount * 0.08) % (Math.PI * 2);
            this.ctx.rotate(rotationAngle);

            this.ctx.strokeStyle = '#06b6d4';
            this.ctx.lineWidth = 2.5;
            for (let i = 0; i < 3; i++) {
              this.ctx.beginPath();
              this.ctx.arc(0, 0, (ts / 2) * (1 - i * 0.25), 0, Math.PI, false);
              this.ctx.stroke();
            }
            this.ctx.restore();

            if ((this.frameCount + c * 7) % 20 < 10) {
              this.ctx.fillStyle = 'rgba(165, 243, 252, 0.7)';
              this.ctx.beginPath();
              this.ctx.arc(ex + 12 + Math.sin(this.frameCount * 0.05 + c) * 6, ey + 10, 2.5, 0, Math.PI * 2);
              this.ctx.arc(ex + 28 + Math.cos(this.frameCount * 0.05 + c) * 6, ey + 22, 2, 0, Math.PI * 2);
              this.ctx.fill();
            }
          } else if (themeType === 'shadow') {
            this.ctx.fillStyle = '#0f0a1a';
            this.ctx.fillRect(ex, ey, ts, ts);

            const pulseAlpha = 0.65 + Math.sin(this.frameCount * 0.14 + c * 1.7) * 0.2;
            this.ctx.fillStyle = `rgba(127, 29, 29, ${pulseAlpha})`;
            this.ctx.fillRect(ex, ey + 4, ts, ts - 4);

            let auraGrad = this.gradientCache.get(`shadow_${r}`);
            if (!auraGrad) {
              auraGrad = this.ctx.createLinearGradient(0, ey - 44, 0, ey + ts);
              auraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.0)');
              auraGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
              auraGrad.addColorStop(1, 'rgba(127, 29, 29, 0.6)');
              this.gradientCache.set(`shadow_${r}`, auraGrad);
            }
            this.ctx.fillStyle = auraGrad;
            this.ctx.fillRect(ex, ey - 44, ts, ts + 44);

            this.ctx.strokeStyle = '#a855f7';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            const slashPhase = Math.sin(this.frameCount * 0.1 + c * 2) * 4;
            this.ctx.moveTo(ex + 4, ey + 6 + slashPhase);
            this.ctx.lineTo(ex + ts - 4, ey + ts - 6 + slashPhase);
            this.ctx.stroke();

            if ((this.frameCount + c * 9) % 30 < 15) {
              this.ctx.fillStyle = '#c084fc';
              this.ctx.beginPath();
              this.ctx.arc(ex + 12, ey + 10, 3, 0, Math.PI * 2);
              this.ctx.arc(ex + 28, ey + 22, 2.5, 0, Math.PI * 2);
              this.ctx.fill();
            }
          } else if (themeType === 'temple') {
            this.ctx.fillStyle = '#1e1b4b';
            this.ctx.fillRect(ex, ey, ts, ts);

            const pulseAlpha = 0.7 + Math.sin(this.frameCount * 0.18 + c * 1.3) * 0.25;
            this.ctx.fillStyle = `rgba(234, 179, 8, ${pulseAlpha})`;
            this.ctx.fillRect(ex, ey + 4, ts, ts - 4);

            let auraGrad = this.gradientCache.get(`temple_${r}`);
            if (!auraGrad) {
              auraGrad = this.ctx.createLinearGradient(0, ey - 44, 0, ey + ts);
              auraGrad.addColorStop(0, 'rgba(234, 179, 8, 0.0)');
              auraGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.35)');
              auraGrad.addColorStop(1, 'rgba(56, 189, 248, 0.6)');
              this.gradientCache.set(`temple_${r}`, auraGrad);
            }
            this.ctx.fillStyle = auraGrad;
            this.ctx.fillRect(ex, ey - 44, ts, ts + 44);

            this.ctx.strokeStyle = '#fef08a';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            const zigzagY1 = ey + 10 + Math.sin(this.frameCount * 0.3 + c) * 6;
            const zigzagY2 = ey + 20 + Math.cos(this.frameCount * 0.25 + c) * 5;
            this.ctx.moveTo(ex, zigzagY1);
            this.ctx.lineTo(ex + ts * 0.3, zigzagY2);
            this.ctx.lineTo(ex + ts * 0.6, zigzagY1);
            this.ctx.lineTo(ex + ts, zigzagY2);
            this.ctx.stroke();

            if ((this.frameCount + c * 7) % 18 < 9) {
              this.ctx.fillStyle = '#ffffff';
              this.ctx.beginPath();
              this.ctx.arc(ex + 10, ey + 10, 3, 0, Math.PI * 2);
              this.ctx.arc(ex + 28, ey + 20, 2.5, 0, Math.PI * 2);
              this.ctx.fill();
            }
          } else if (themeType === 'ice') {
            this.ctx.fillStyle = '#0369a1';
            this.ctx.fillRect(ex, ey, ts, ts);

            const pulseAlpha = 0.85 + Math.sin(this.frameCount * 0.12 + c) * 0.15;
            this.ctx.fillStyle = `rgba(56, 189, 248, ${pulseAlpha})`;
            this.ctx.fillRect(ex, ey + 4, ts, ts - 4);

            let auraGrad = this.gradientCache.get(`ice_${r}`);
            if (!auraGrad) {
              auraGrad = this.ctx.createLinearGradient(0, ey - 44, 0, ey + ts);
              auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.0)');
              auraGrad.addColorStop(0.5, 'rgba(125, 211, 252, 0.3)');
              auraGrad.addColorStop(1, 'rgba(3, 105, 161, 0.55)');
              this.gradientCache.set(`ice_${r}`, auraGrad);
            }
            this.ctx.fillStyle = auraGrad;
            this.ctx.fillRect(ex, ey - 44, ts, ts + 44);

            this.ctx.fillStyle = '#7dd3fc';
            this.ctx.fillRect(ex, ey + 8, ts, ts - 8);

            if ((this.frameCount + c * 5) % 24 < 12) {
              this.ctx.fillStyle = '#ffffff';
              this.ctx.beginPath();
              this.ctx.arc(ex + 8, ey + 8, 3.5, 0, Math.PI * 2);
              this.ctx.arc(ex + 26, ey + 14, 2.5, 0, Math.PI * 2);
              this.ctx.fill();
            }
          } else if (themeType === 'space') {
            this.ctx.fillStyle = '#020617';
            this.ctx.fillRect(ex, ey, ts, ts);

            const pulseAlpha = 0.75 + Math.sin(this.frameCount * 0.15 + c * 1.5) * 0.2;
            this.ctx.fillStyle = `rgba(6, 182, 212, ${pulseAlpha})`;
            this.ctx.fillRect(ex, ey + 4, ts, ts - 4);

            let auraGrad = this.gradientCache.get(`antimatter_${r}`);
            if (!auraGrad) {
              auraGrad = this.ctx.createLinearGradient(0, ey - 44, 0, ey + ts);
              auraGrad.addColorStop(0, 'rgba(6, 182, 212, 0.0)');
              auraGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.35)');
              auraGrad.addColorStop(1, 'rgba(6, 182, 212, 0.6)');
              this.gradientCache.set(`antimatter_${r}`, auraGrad);
            }
            this.ctx.fillStyle = auraGrad;
            this.ctx.fillRect(ex, ey - 44, ts, ts + 44);

            this.ctx.strokeStyle = '#e879f9';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            const waveY = ey + 6 + Math.sin(this.frameCount * 0.2 + c * 0.8) * 3;
            this.ctx.moveTo(ex, waveY);
            this.ctx.lineTo(ex + ts, waveY);
            this.ctx.stroke();

            if ((this.frameCount + c * 5) % 20 < 10) {
              this.ctx.fillStyle = (this.frameCount + c) % 2 === 0 ? '#38bdf8' : '#e879f9';
              this.ctx.beginPath();
              this.ctx.arc(ex + 8, ey + 8 + Math.sin(this.frameCount * 0.1) * 3, 3, 0, Math.PI * 2);
              this.ctx.arc(ex + 26, ey + 14 + Math.cos(this.frameCount * 0.1) * 3, 2.5, 0, Math.PI * 2);
              this.ctx.fill();
            }
          } else {
            this.ctx.fillStyle = '#450a0a';
            this.ctx.fillRect(ex, ey, ts, ts);

            const pulseAlpha = 0.8 + Math.sin(this.frameCount * 0.12 + c) * 0.15;
            this.ctx.fillStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
            this.ctx.fillRect(ex, ey + 4, ts, ts - 4);

            let auraGrad = this.gradientCache.get(`lava_${r}`);
            if (!auraGrad) {
              auraGrad = this.ctx.createLinearGradient(0, ey - 44, 0, ey + ts);
              auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.0)');
              auraGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.35)');
              auraGrad.addColorStop(1, 'rgba(254, 240, 138, 0.6)');
              this.gradientCache.set(`lava_${r}`, auraGrad);
            }
            this.ctx.fillStyle = auraGrad;
            this.ctx.fillRect(ex, ey - 44, ts, ts + 44);

            this.ctx.fillStyle = '#f97316';
            this.ctx.fillRect(ex, ey + 8, ts, ts - 8);

            if ((this.frameCount + c * 5) % 24 < 12) {
              this.ctx.fillStyle = '#fef08a';
              this.ctx.beginPath();
              this.ctx.arc(ex + 8, ey + 8, 3.5, 0, Math.PI * 2);
              this.ctx.arc(ex + 26, ey + 14, 2.5, 0, Math.PI * 2);
              this.ctx.fill();
            }
          }
        } else if (char === 'V') {
          this.ctx.fillStyle = '#166534';
          this.ctx.fillRect(ex + ts / 2 - 4, ey, 8, ts);
          this.ctx.fillStyle = '#22c55e';
          this.ctx.fillRect(ex + ts / 2 - 1, ey, 3, ts);

          const wave = Math.sin(this.frameCount * 0.08 + r) * 3;
          this.ctx.fillStyle = '#15803d';
          this.ctx.beginPath();
          this.ctx.arc(ex + ts / 2 - 8 + wave, ey + 10, 5, 0, Math.PI * 2);
          this.ctx.arc(ex + ts / 2 + 8 + wave, ey + 26, 5, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (char === 'X') {
          this.ctx.fillStyle = '#052e16';
          this.ctx.fillRect(ex, ey, ts, ts);

          const pulseAlpha = 0.65 + Math.sin(this.frameCount * 0.1 + c) * 0.2;
          this.ctx.fillStyle = `rgba(34, 197, 94, ${pulseAlpha})`;
          this.ctx.fillRect(ex, ey + 6, ts, ts - 6);

          let auraGrad = this.gradientCache.get(`swamp_${r}`);
          if (!auraGrad) {
            auraGrad = this.ctx.createLinearGradient(0, ey - 44, 0, ey + ts);
            auraGrad.addColorStop(0, 'rgba(34, 197, 94, 0.0)');
            auraGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.35)');
            auraGrad.addColorStop(1, 'rgba(134, 239, 172, 0.6)');
            this.gradientCache.set(`swamp_${r}`, auraGrad);
          }
          this.ctx.fillStyle = auraGrad;
          this.ctx.fillRect(ex, ey - 44, ts, ts + 44);

          if ((this.frameCount + c * 7) % 30 < 15) {
            this.ctx.fillStyle = '#86efac';
            this.ctx.beginPath();
            this.ctx.arc(ex + 10, ey + 10, 4, 0, Math.PI * 2);
            this.ctx.arc(ex + 28, ey + 16, 3, 0, Math.PI * 2);
            this.ctx.fill();
          }
        } else if (char === 'R') {
          this.ctx.fillStyle = '#14532d';
          this.ctx.fillRect(ex + 2, ey + ts - 10, ts - 4, 10);
          this.ctx.fillStyle = '#22c55e';
          this.ctx.beginPath();
          this.ctx.arc(ex + ts / 2, ey + ts - 6, 8, Math.PI, 0);
          this.ctx.fill();

          this.ctx.fillStyle = '#86efac';
          this.ctx.beginPath();
          this.ctx.moveTo(ex + 8, ey + ts - 10);
          this.ctx.lineTo(ex + 12, ey + ts - 18);
          this.ctx.lineTo(ex + 16, ey + ts - 10);
          this.ctx.moveTo(ex + 24, ey + ts - 10);
          this.ctx.lineTo(ex + 28, ey + ts - 18);
          this.ctx.lineTo(ex + 32, ey + ts - 10);
          this.ctx.fill();
        } else if (char === 'T') {
          this.ctx.fillStyle = '#0284c7';
          this.ctx.fillRect(ex + 4, ey + ts - 8, ts - 8, 8);

          this.ctx.strokeStyle = '#94a3b8';
          this.ctx.lineWidth = 2.5;
          this.ctx.beginPath();
          this.ctx.moveTo(ex + 8, ey + ts - 4);
          this.ctx.lineTo(ex + ts - 8, ey + ts - 4);
          this.ctx.stroke();

          this.ctx.fillStyle = '#38bdf8';
          this.ctx.fillRect(ex + 2, ey + ts - 14, ts - 4, 6);
        } else if (char === 'M') {
          this.ctx.fillStyle = '#1e293b';
          this.ctx.fillRect(ex + 10, ey + ts - 6, ts - 20, 6);

          const blink = Math.floor(this.frameCount / 12) % 2 === 0;
          this.ctx.fillStyle = blink ? '#ef4444' : '#7f1d1d';
          this.ctx.fillRect(ex + ts / 2 - 2, ey + ts - 10, 4, 4);
        } else if (char === 'K') {
          const skewerOffset = Math.sin((this.frameCount + c * 3) * 0.05) * (ts * 0.65);
          this.ctx.fillStyle = '#64748b';
          this.ctx.fillRect(ex + 14, ey + ts - 4 - skewerOffset, 12, ts + skewerOffset);

          this.ctx.fillStyle = '#94a3b8';
          this.ctx.beginPath();
          this.ctx.moveTo(ex + 14, ey + ts - 4 - skewerOffset);
          this.ctx.lineTo(ex + 20, ey + ts - 12 - skewerOffset);
          this.ctx.lineTo(ex + 26, ey + ts - 4 - skewerOffset);
          this.ctx.closePath();
          this.ctx.fill();

          const skewerTop = ey + ts - 12 - skewerOffset;
          if (
            this.px < ex + 26 &&
            this.px + this.pWidth > ex + 14 &&
            this.py + this.pHeight > skewerTop &&
            this.py < ey + ts
          ) {
            this.handlePlayerHit(3, ex + 20);
          }
        } else if (char === 'E') {
          const cycle = (this.frameCount + c * 5) % 180;
          this.ctx.fillStyle = '#374151';
          this.ctx.fillRect(ex + 4, ey + ts - 8, ts - 8, 8);

          if (cycle > 110 && cycle <= 130) {
            if (this.frameCount % 4 === 0) {
              this.particles.push({
                x: ex + ts / 2,
                y: ey + ts - 12,
                vx: Math.random() * 2 - 1,
                vy: -Math.random() * 2 - 1,
                size: Math.random() * 4 + 2,
                color: '#fbbf24',
                life: 15,
                maxLife: 15
              });
            }
          } else if (cycle > 130 && cycle <= 170) {
            const colHeight = 160;
            const fireGrad = this.ctx.createLinearGradient(0, ey + ts - 8, 0, ey + ts - colHeight);
            fireGrad.addColorStop(0, '#ef4444');
            fireGrad.addColorStop(0.5, '#f97316');
            fireGrad.addColorStop(1, 'rgba(251, 191, 36, 0.1)');

            this.ctx.fillStyle = fireGrad;
            this.ctx.fillRect(ex + 8, ey + ts - colHeight, ts - 16, colHeight);

            if (
              this.px < ex + ts - 8 &&
              this.px + this.pWidth > ex + 8 &&
              this.py + this.pHeight > ey + ts - colHeight &&
              this.py < ey + ts
            ) {
              this.handlePlayerHit(2, ex + ts / 2);
            }

            if (this.frameCount % 2 === 0) {
              this.particles.push({
                x: ex + 8 + Math.random() * (ts - 16),
                y: ey + ts - colHeight + Math.random() * colHeight,
                vx: Math.random() * 1 - 0.5,
                vy: -Math.random() * 3 - 2,
                size: Math.random() * 5 + 3,
                color: '#f59e0b',
                life: 20,
                maxLife: 20
              });
            }
          }
        } else if (char === 'm') {
          const angle = (this.frameCount * 0.05) % (Math.PI * 2);
          this.ctx.save();
          this.ctx.translate(ex + ts / 2, ey + ts / 2);
          this.ctx.rotate(angle);

          const grad = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
          grad.addColorStop(0, '#38bdf8');
          grad.addColorStop(0.5, '#0284c7');
          grad.addColorStop(1, 'rgba(2, 132, 199, 0)');

          this.ctx.fillStyle = grad;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 24, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.strokeStyle = '#ffffff';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 16, 0, Math.PI, false);
          this.ctx.stroke();

          this.ctx.restore();

          this.ctx.save();
          this.ctx.font = 'bold 11px monospace';
          this.ctx.textAlign = 'center';
          this.ctx.fillStyle = '#38bdf8';
          this.ctx.shadowColor = '#0284c7';
          this.ctx.shadowBlur = 8;
          this.ctx.fillText('NEXT AREA 🌀', ex + ts / 2, ey - 14);
          this.ctx.restore();
        } else if (char === 'P') {
          const angle = (this.frameCount * 0.04) % (Math.PI * 2);
          this.ctx.save();
          this.ctx.translate(ex + ts / 2, ey + ts / 2);

          if (this.exitPortalActive) {
            this.ctx.rotate(angle);

            const grad = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#a855f7');
            grad.addColorStop(0.7, '#6366f1');
            grad.addColorStop(1, 'rgba(99, 102, 241, 0)');

            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 26, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = '#c084fc';
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 18 + Math.sin(this.frameCount * 0.1) * 3, 0, Math.PI * 2);
            this.ctx.stroke();
          } else {
            this.ctx.rotate(-angle * 0.5);

            const grad = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
            grad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
            grad.addColorStop(0.6, 'rgba(153, 27, 27, 0.4)');
            grad.addColorStop(1, 'rgba(153, 27, 27, 0)');

            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 22, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = '#ef4444';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 16, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.fillStyle = '#fef08a';
            this.ctx.fillRect(-4, -2, 8, 7);
            this.ctx.strokeStyle = '#fef08a';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(0, -3, 3, Math.PI, 0);
            this.ctx.stroke();
          }

          this.ctx.restore();

          this.ctx.save();
          this.ctx.font = 'bold 11px monospace';
          this.ctx.textAlign = 'center';

          if (this.exitPortalActive) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowColor = '#a855f7';
            this.ctx.shadowBlur = 10;
            this.ctx.fillText('EXIT PORTAL 🌀', ex + ts / 2, ey - 14);
          } else {
            this.ctx.fillStyle = '#fca5a5';
            this.ctx.shadowColor = '#ef4444';
            this.ctx.shadowBlur = 6;
            this.ctx.fillText('EXIT PORTAL (LOCKED 🔒)', ex + ts / 2, ey - 14);
          }
          this.ctx.restore();
        }
      }
    }

    this.pickups.forEach(pickup => {
      if (pickup.collected) return;

      const bounce = Math.sin(this.frameCount * 0.08 + pickup.x) * 4;

      if (pickup.type === 'coin') {
        this.ctx.fillStyle = '#eab308';
        this.ctx.strokeStyle = '#ca8a04';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(pickup.x + pickup.width / 2, pickup.y + pickup.height / 2 + bounce, 7, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#fef08a';
        this.ctx.beginPath();
        this.ctx.arc(pickup.x + pickup.width / 2 - 2, pickup.y + pickup.height / 2 + bounce - 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (pickup.type === 'potion') {
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(pickup.x + 3, pickup.y + 6 + bounce, 14, 12);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(pickup.x + 6, pickup.y + 2 + bounce, 8, 4);

        this.ctx.strokeStyle = '#7f1d1d';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(pickup.x + 3, pickup.y + 6 + bounce, 14, 12);
      } else if (pickup.type === 'upgrade_stone') {
        this.ctx.fillStyle = '#a855f7';
        this.ctx.strokeStyle = '#6b21a8';
        this.ctx.lineWidth = 1.5;

        const cx = pickup.x + pickup.width / 2;
        const cy = pickup.y + pickup.height / 2 + bounce;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - 8);
        this.ctx.lineTo(cx + 7, cy);
        this.ctx.lineTo(cx, cy + 8);
        this.ctx.lineTo(cx - 7, cy);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }
    });

    this.projectiles.forEach(proj => {
      this.ctx.fillStyle = proj.color;

      if (proj.type === 'fireball') {
        const bounce = Math.sin(this.frameCount * 0.2 + proj.x) * 2;
        this.ctx.beginPath();
        this.ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2 + bounce, proj.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (proj.type === 'axe') {
        this.ctx.save();
        this.ctx.translate(proj.x + proj.width / 2, proj.y + proj.height / 2);
        this.ctx.rotate(this.frameCount * 0.3);
        this.ctx.fillStyle = '#b45309';
        this.ctx.fillRect(-2, -10, 4, 20);
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.strokeStyle = '#64748b';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(-4, -4, 8, Math.PI / 2, -Math.PI / 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(4, -4, 8, -Math.PI / 2, Math.PI / 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
      } else if (proj.type === 'sonar') {
        this.ctx.save();
        this.ctx.strokeStyle = proj.color || '#38bdf8';
        this.ctx.lineWidth = 3.5;
        const waveRadius = proj.width / 2 + (this.frameCount % 6);
        const isFacingRight = proj.vx >= 0;
        const startAngle = isFacingRight ? -Math.PI / 2.5 : Math.PI / 2.5;
        const endAngle = isFacingRight ? Math.PI / 2.5 : (Math.PI * 3) / 2.5;

        this.ctx.beginPath();
        this.ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, waveRadius, startAngle, endAngle);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, Math.max(4, waveRadius - 8), startAngle, endAngle);
        this.ctx.stroke();

        this.ctx.restore();
      } else if ((proj as any).type === 'bomb') {
        this.ctx.save();
        const cx = proj.x + proj.width / 2;
        const cy = proj.y + proj.height / 2;

        this.ctx.fillStyle = '#0f172a';
        this.ctx.strokeStyle = '#475569';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, proj.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillRect(cx - 2, cy - proj.width / 2 - 3, 4, 3);

        const sparkColor = this.frameCount % 4 < 2 ? '#ef4444' : '#fbbf24';
        this.ctx.fillStyle = sparkColor;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy - proj.width / 2 - 5, 3.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      } else if (proj.type === 'sun_strike') {
        this.ctx.save();
        const tx = proj.targetX!;
        const channelTimer = proj.channelTimer || 0;
        const isExploding = (proj as any).isExploding;

        const topY = -1000;
        const beamHeight = this.levelHeight + 2000;

        if (channelTimer > 0) {
          const chargeProgress = 1 - (channelTimer / 102);

          this.ctx.fillStyle = `rgba(253, 224, 71, ${0.2 + chargeProgress * 0.35})`;
          this.ctx.fillRect(tx - 24, topY, 48, beamHeight);

          this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + chargeProgress * 0.5})`;
          this.ctx.lineWidth = 4 + chargeProgress * 6;
          this.ctx.beginPath();
          this.ctx.moveTo(tx, topY);
          this.ctx.lineTo(tx, topY + beamHeight);
          this.ctx.stroke();

          const ringRadius = 28 * chargeProgress + 8;
          this.ctx.strokeStyle = '#f59e0b';
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.arc(tx, this.py + this.pHeight - 5, ringRadius, 0, Math.PI * 2);
          this.ctx.stroke();

          this.ctx.fillStyle = '#fef08a';
          this.ctx.beginPath();
          this.ctx.arc(tx, this.py + this.pHeight - 5, 6, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (isExploding) {
          const expTimer = (proj as any).explosionTimer || 20;
          const alpha = expTimer / 20;

          this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          this.ctx.fillRect(tx - 22, topY, 44, beamHeight);

          this.ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
          this.ctx.fillRect(tx - 38, topY, 76, beamHeight);

          this.ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.7})`;
          this.ctx.fillRect(tx - 56, topY, 18, beamHeight);
          this.ctx.fillRect(tx + 38, topY, 18, beamHeight);

          const shockRadius = (20 - expTimer) * 5 + 12;
          this.ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
          this.ctx.lineWidth = 5;
          this.ctx.beginPath();
          this.ctx.arc(tx, this.py + this.pHeight - 5, shockRadius, 0, Math.PI * 2);
          this.ctx.stroke();
        }
        this.ctx.restore();
      } else if (proj.type === 'meteor') {
        this.ctx.save();
        const cx = proj.x + proj.width / 2;
        const cy = proj.y + proj.height / 2;

        this.ctx.translate(cx, cy);
        this.ctx.rotate(this.frameCount * 0.15);

        const grad = this.ctx.createRadialGradient(0, 0, 3, 0, 0, proj.width / 2 + 4);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.35, '#f97316');
        grad.addColorStop(0.75, '#dc2626');
        grad.addColorStop(1, '#451a03');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, proj.width / 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#78350f';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-10, -6);
        this.ctx.lineTo(4, -10);
        this.ctx.lineTo(8, 6);
        this.ctx.stroke();

        this.ctx.restore();
      } else if (proj.type === 'tornado') {
        this.ctx.save();
        const cx = proj.x + proj.width / 2;

        for (let i = 0; i < 6; i++) {
          const yOff = (i * 10 + (this.frameCount * 3)) % proj.height;

          const progress = yOff / proj.height;

          const w = 12 + (1 - progress) * 34;
          const rotAngle = Math.sin(this.frameCount * 0.25 + i * 0.5) * 0.35;

          this.ctx.strokeStyle = i % 2 === 0 ? '#06b6d4' : '#38bdf8';
          this.ctx.lineWidth = 1.5 + (1 - progress) * 2.2;
          this.ctx.beginPath();
          this.ctx.ellipse(cx, proj.y + yOff, w / 2, 5, rotAngle, 0, Math.PI * 2);
          this.ctx.stroke();

          this.ctx.strokeStyle = '#e0f2fe';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.ellipse(cx + Math.cos(this.frameCount * 0.3 + i) * 3, proj.y + yOff, (w / 2) * 0.7, 3, -rotAngle, 0, Math.PI * 2);
          this.ctx.stroke();
        }
        this.ctx.restore();
      } else if (proj.type === 'giant_cleave') {
        this.ctx.save();
        this.ctx.fillStyle = '#a855f7';
        this.ctx.strokeStyle = '#c084fc';
        this.ctx.lineWidth = 4;

        this.ctx.beginPath();
        this.ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, proj.width / 2, -Math.PI / 3, Math.PI / 3);
        this.ctx.lineTo(proj.x + proj.width / 4, proj.y + proj.height / 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
      } else if (proj.type === 'dark_energy') {
        this.ctx.save();
        const cx = proj.x + proj.width / 2;
        const cy = proj.y + proj.height / 2;

        if ((proj as any).isShadowraze) {
          // ── Shadowraze scorch zone ──────────────────────────────────────
          const radius = proj.width / 2;
          const age = this.frameCount - ((proj as any).birthFrame || this.frameCount);
          const lifeRatio = Math.max(0, (proj as any).life / 14);
          const pulse = Math.sin(this.frameCount * 0.35) * 0.08 + 0.92;

          // Shockwave expansion ring
          if (age < 10) {
            const swR = radius + age * 18;
            const swAlpha = 0.85 * (1 - age / 10);
            this.ctx.strokeStyle = `rgba(239, 68, 68, ${swAlpha})`;
            this.ctx.lineWidth = 4 - age * 0.35;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, swR, 0, Math.PI * 2);
            this.ctx.stroke();
          }

          // Outer crimson corona haze
          const coronaGrad = this.ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 1.35);
          coronaGrad.addColorStop(0, `rgba(127, 29, 29, ${lifeRatio * 0.55})`);
          coronaGrad.addColorStop(0.55, `rgba(159, 18, 57, ${lifeRatio * 0.30})`);
          coronaGrad.addColorStop(1, 'rgba(24,24,27,0)');
          this.ctx.fillStyle = coronaGrad;
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
          this.ctx.fill();

          // Void core — deep dark gradient
          const coreGrad = this.ctx.createRadialGradient(cx, cy, 2, cx, cy, radius * pulse);
          coreGrad.addColorStop(0, `rgba(24, 24, 27, ${lifeRatio * 0.98})`);
          coreGrad.addColorStop(0.45, `rgba(127, 29, 29, ${lifeRatio * 0.80})`);
          coreGrad.addColorStop(0.75, `rgba(239, 68, 68, ${lifeRatio * 0.50})`);
          coreGrad.addColorStop(1, `rgba(239, 68, 68, 0)`);
          this.ctx.fillStyle = coreGrad;
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, radius * pulse, 0, Math.PI * 2);
          this.ctx.fill();

          // Rotating crimson tendril arcs
          const arcDefs = [
            { speed: 0.14, gap: 1.45, r: radius * 0.62, w: 3.5, color: '#ef4444' },
            { speed: -0.10, gap: 1.25, r: radius * 0.78, w: 2.5, color: '#9f1239' },
            { speed: 0.08, gap: 1.65, r: radius * 0.91, w: 2.0, color: 'rgba(239,68,68,0.55)' },
          ];
          this.ctx.globalAlpha = lifeRatio;
          for (const a of arcDefs) {
            const a0 = this.frameCount * a.speed;
            this.ctx.strokeStyle = a.color;
            this.ctx.lineWidth = a.w;
            this.ctx.shadowColor = '#ef4444';
            this.ctx.shadowBlur = 7;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, a.r, a0, a0 + Math.PI * a.gap);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, a.r, a0 + Math.PI, a0 + Math.PI * (2 - a.gap * 0.7));
            this.ctx.stroke();
          }
          this.ctx.shadowBlur = 0;
          this.ctx.globalAlpha = 1;

          // Void eye at centre
          this.ctx.fillStyle = `rgba(10, 10, 10, ${lifeRatio})`;
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, 8 * pulse, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (proj.width > 50) {
          const radius = proj.width / 2;
          const grad = this.ctx.createRadialGradient(cx, cy, 4, cx, cy, radius);
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
          grad.addColorStop(0.6, 'rgba(159, 18, 57, 0.4)');
          grad.addColorStop(1, 'rgba(24, 24, 27, 0)');

          this.ctx.fillStyle = grad;
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.strokeStyle = '#ef4444';
          this.ctx.lineWidth = 3;
          this.ctx.stroke();
        } else {
          const grad = this.ctx.createRadialGradient(cx, cy, 2, cx, cy, proj.width / 2);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.4, '#ef4444');
          grad.addColorStop(1, '#9f1239');
          this.ctx.fillStyle = grad;
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, proj.width / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      } else if (proj.type === 'wisp_orb') {
        this.ctx.save();
        const cx = proj.x + proj.width / 2;
        const cy = proj.y + proj.height / 2;
        const isHoming = ((proj as any).homingTimer || 0) > 0;

        const grad = this.ctx.createRadialGradient(cx, cy, 2, cx, cy, proj.width * 1.3);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, isHoming ? '#38bdf8' : '#fef08a');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, proj.width * 1.3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = isHoming ? '#38bdf8' : '#fef08a';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, proj.width / 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, proj.width / 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      } else if ((proj as any).type === 'azure_vortex_ball' || (proj as any).type === 'azure_light_ball') {
        this.ctx.save();
        const cx = proj.x + proj.width / 2;
        const cy = proj.y + proj.height / 2;
        const radius = proj.width / 2;
        const pulse = Math.sin(this.frameCount * 0.3) * 2;

        // Layer 1: Gravitational Distortion Outer Haze
        const hazeGrad = this.ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 2.2 + pulse);
        hazeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
        hazeGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.3)');
        hazeGrad.addColorStop(0.85, 'rgba(12, 74, 110, 0.15)');
        hazeGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
        this.ctx.fillStyle = hazeGrad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius * 2.2 + pulse, 0, Math.PI * 2);
        this.ctx.fill();

        // Layer 2: Rotating Accretion Rings (Elliptical perspective)
        const rot0 = this.frameCount * 0.12;
        const rings = [
          { r: radius * 1.5, rot: rot0, color: '#38bdf8', w: 2.5, scaleY: 0.4 },
          { r: radius * 1.2, rot: -rot0 * 1.3, color: '#c084fc', w: 2.0, scaleY: 0.5 },
          { r: radius * 0.9, rot: rot0 * 1.8, color: '#ffffff', w: 1.5, scaleY: 0.3 }
        ];

        rings.forEach(ring => {
          this.ctx.save();
          this.ctx.translate(cx, cy);
          this.ctx.rotate(ring.rot);
          this.ctx.scale(1.0, ring.scaleY);
          this.ctx.strokeStyle = ring.color;
          this.ctx.lineWidth = ring.w;
          this.ctx.shadowColor = ring.color;
          this.ctx.shadowBlur = 6;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.restore();
        });
        this.ctx.shadowBlur = 0;

        // Layer 3: Event Horizon Rim Glow
        const rimGrad = this.ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.05);
        rimGrad.addColorStop(0, 'rgba(2, 6, 23, 0.95)');
        rimGrad.addColorStop(0.7, '#0284c7');
        rimGrad.addColorStop(1, '#ffffff');
        this.ctx.fillStyle = rimGrad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
        this.ctx.fill();

        // Layer 4: Deep Black Void Singularity Core
        const voidGrad = this.ctx.createRadialGradient(cx, cy, 1, cx, cy, radius * 0.65);
        voidGrad.addColorStop(0, '#020617');
        voidGrad.addColorStop(0.7, '#090d16');
        voidGrad.addColorStop(1, '#0c4a6e');
        this.ctx.fillStyle = voidGrad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
        this.ctx.fill();

        // Inner glowing singularity point
        this.ctx.fillStyle = '#e0f2fe';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      } else if ((proj as any).type === 'pacman') {
        this.ctx.save();
        const cx = proj.x + proj.width / 2;
        const cy = proj.y + proj.height / 2;
        const radius = proj.width / 2;
        const mouthAngle = (Math.sin(this.frameCount * 0.3) * 0.2 + 0.25) * Math.PI;
        const isRight = proj.vx >= 0;
        const baseAngle = isRight ? 0 : Math.PI;

        // Pacman Body
        this.ctx.fillStyle = '#eab308';
        this.ctx.strokeStyle = '#ca8a04';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, baseAngle + mouthAngle, baseAngle + Math.PI * 2 - mouthAngle);
        this.ctx.lineTo(cx, cy);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Pacman Pixel Eye
        this.ctx.fillStyle = '#000000';
        const eyeX = isRight ? cx + 4 : cx - 12;
        this.ctx.fillRect(eyeX, cy - radius * 0.5, 6, 6);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(eyeX + 2, cy - radius * 0.5 + 1, 2, 2);

        this.ctx.restore();
      } else if ((proj as any).type === 'tetris_block') {
        this.ctx.save();
        const shape = (proj as any).shape || 'O';
        const ts = proj.width / 2;
        const x = proj.x;
        const y = proj.y;

        this.ctx.fillStyle = proj.color || '#ec4899';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;

        const drawSquare = (sx: number, sy: number) => {
          this.ctx.fillRect(sx, sy, ts, ts);
          this.ctx.strokeRect(sx, sy, ts, ts);
          this.ctx.fillStyle = '#ffffff';
          this.ctx.fillRect(sx + 2, sy + 2, ts * 0.3, ts * 0.3);
          this.ctx.fillStyle = proj.color || '#ec4899';
        };

        if (shape === 'I') {
          drawSquare(x, y); drawSquare(x + ts, y);
        } else if (shape === 'L') {
          drawSquare(x, y); drawSquare(x, y + ts); drawSquare(x + ts, y + ts);
        } else if (shape === 'T') {
          drawSquare(x + ts / 2, y); drawSquare(x, y + ts); drawSquare(x + ts, y + ts);
        } else if (shape === 'Z') {
          drawSquare(x, y); drawSquare(x + ts, y); drawSquare(x + ts, y + ts);
        } else {
          drawSquare(x, y); drawSquare(x + ts, y); drawSquare(x, y + ts); drawSquare(x + ts, y + ts);
        }

        this.ctx.restore();
      } else if ((proj as any).type === 'pixel_sword') {
        this.ctx.save();
        const birthFrame = (proj as any).birthFrame || ((proj as any).birthFrame = this.frameCount);
        const lifeSpan = (proj as any).lifeSpan || 22;
        const age = Math.min(lifeSpan, this.frameCount - birthFrame);
        const progress = age / lifeSpan; // 0.0 to 1.0

        const isRight = proj.vx >= 0;
        const swordLength = proj.width; // 400px wide giant sword!
        const pivotX = isRight ? proj.x : proj.x + proj.width;
        const pivotY = proj.y + proj.height / 2;

        // Dynamic 180° swing rotation arc!
        const startAngle = isRight ? -Math.PI * 0.55 : Math.PI * 0.55;
        const endAngle = isRight ? Math.PI * 0.55 : -Math.PI * 0.55;
        const currentAngle = startAngle + (endAngle - startAngle) * progress;

        // 1. Draw 8-Bit Pixel Slash Arc Trail
        const arcRadius = swordLength * 0.85;
        const trailStart = startAngle;
        const trailEnd = currentAngle;

        // Outer Neon Crimson Slash Glow
        this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
        this.ctx.lineWidth = 42;
        this.ctx.beginPath();
        this.ctx.arc(pivotX, pivotY, arcRadius, trailStart, trailEnd, !isRight);
        this.ctx.stroke();

        // Middle Rose Energy Arc
        this.ctx.strokeStyle = '#fb7185';
        this.ctx.lineWidth = 18;
        this.ctx.beginPath();
        this.ctx.arc(pivotX, pivotY, arcRadius, trailStart, trailEnd, !isRight);
        this.ctx.stroke();

        // Inner Diamond White Razor Edge Arc
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.arc(pivotX, pivotY, arcRadius, trailStart, trailEnd, !isRight);
        this.ctx.stroke();

        // Stepped 8-Bit Pixel Grid Overlay on Arc Trail
        this.ctx.fillStyle = '#f43f5e';
        const numPixelSteps = 8;
        for (let p = 0; p < numPixelSteps; p++) {
          const stepAng = trailStart + (trailEnd - trailStart) * (p / numPixelSteps);
          const pxX = pivotX + Math.cos(stepAng) * arcRadius;
          const pxY = pivotY + Math.sin(stepAng) * arcRadius;
          this.ctx.fillRect(pxX - 6, pxY - 6, 12, 12);
        }

        // 2. Draw Detailed 8-Bit Pixelated Master Sword
        this.ctx.translate(pivotX, pivotY);
        this.ctx.rotate(currentAngle);

        const bl = swordLength; // Blade length (400px)
        const bw = 24;          // Blade width

        // --- 8-Bit Crossguard ---
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.strokeStyle = '#78350f';
        this.ctx.lineWidth = 2.5;
        // Stepped pixel crossguard wings
        this.ctx.fillRect(-8, -35, 24, 70);
        this.ctx.strokeRect(-8, -35, 24, 70);
        this.ctx.fillRect(-12, -45, 12, 90);
        this.ctx.strokeRect(-12, -45, 12, 90);

        // Gem Core in Hilt
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillRect(-2, -8, 12, 16);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, -4, 4, 4);

        // --- 8-Bit Handle & Pommel ---
        this.ctx.fillStyle = '#581c87';
        this.ctx.fillRect(-32, -6, 24, 12);
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.fillRect(-42, -10, 10, 20);

        // --- 8-Bit Pixel Blade Body ---
        this.ctx.fillStyle = '#f43f5e';
        this.ctx.strokeStyle = '#9f1239';
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(16, -bw / 2, bl - 40, bw);
        this.ctx.strokeRect(16, -bw / 2, bl - 40, bw);

        // Fuller Groove (Darker Center Line)
        this.ctx.fillStyle = '#be123c';
        this.ctx.fillRect(24, -3, bl - 70, 6);

        // Razor-Sharp Pixel Edge (Top White Highlight)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(16, -bw / 2 - 2, bl - 25, 4);

        // 8-Bit Stepped Diamond Blade Tip
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(bl - 24, -bw / 2);
        this.ctx.lineTo(bl, 0);
        this.ctx.lineTo(bl - 24, bw / 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();

        // 3. Spawn 8-Bit Energy Debris Particles every frame
        if (this.frameCount % 2 === 0) {
          const sparkAng = currentAngle + (Math.random() - 0.5) * 0.4;
          const sparkDist = Math.random() * arcRadius;
          this.particles.push({
            x: pivotX + Math.cos(sparkAng) * sparkDist,
            y: pivotY + Math.sin(sparkAng) * sparkDist,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            size: Math.random() * 8 + 3,
            color: Math.random() > 0.5 ? '#f43f5e' : Math.random() > 0.5 ? '#f59e0b' : '#ffffff',
            life: 14,
            maxLife: 14
          });
        }
      } else {
        this.ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
      }
    });

    // RENDER LUNAR BEAM HAZARD GIMMICK
    if (this.stageNum === 13 && this.lunarBeamTimer > 0) {
      if (this.lunarBeamTimer > 30) {
        this.ctx.save();
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.lunarBeamStartX, this.lunarBeamStartY);
        this.ctx.lineTo(this.lunarBeamEndX, this.lunarBeamEndY);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.arc(this.lunarBeamEndX, this.lunarBeamEndY, 25, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      } else {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
        this.ctx.lineWidth = 28;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lunarBeamStartX, this.lunarBeamStartY);
        this.ctx.lineTo(this.lunarBeamEndX, this.lunarBeamEndY);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lunarBeamStartX, this.lunarBeamStartY);
        this.ctx.lineTo(this.lunarBeamEndX, this.lunarBeamEndY);
        this.ctx.stroke();

        for (let p = 0; p < 2; p++) {
          this.particles.push({
            x: this.lunarBeamEndX + (Math.random() - 0.5) * 15,
            y: this.lunarBeamEndY - 2,
            vx: (Math.random() - 0.5) * 6,
            vy: -Math.random() * 4 - 1,
            size: Math.random() * 5 + 2,
            color: p % 2 === 0 ? '#c7d2fe' : '#ffffff',
            life: 12,
            maxLife: 12
          });
        }
        this.ctx.restore();
      }
    }

    this.enemies.forEach(enemy => {
      this.ctx.save();

      // Tornado Lifted Spin Animation
      if (this.selectedDraco === 'Flymon' && this.flymonTornadoActive && (enemy as any).isLiftedByTornado) {
        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;
        this.ctx.translate(cx, cy);
        this.ctx.rotate(this.frameCount * 0.15 + enemy.id);
        this.ctx.translate(-cx, -cy);
      }

      if (enemy.type === 'slime') {
        const squish = Math.sin(this.frameCount * 0.12 + enemy.id) * 3;
        this.ctx.fillStyle = '#10b981';
        this.ctx.strokeStyle = '#047857';
        this.ctx.lineWidth = 1.5;

        this.ctx.beginPath();
        this.ctx.ellipse(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2 + squish / 2,
          enemy.width / 2,
          enemy.height / 2 - squish / 2,
          0, 0, Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2 + (enemy.facing * 4) - 2, enemy.y + enemy.height / 2 - 2, 3, 0, Math.PI * 2);
        this.ctx.arc(enemy.x + enemy.width / 2 + (enemy.facing * 4) + 4, enemy.y + enemy.height / 2 - 2, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2 + (enemy.facing * 4) - 1, enemy.y + enemy.height / 2 - 2, 1.5, 0, Math.PI * 2);
        this.ctx.arc(enemy.x + enemy.width / 2 + (enemy.facing * 4) + 5, enemy.y + enemy.height / 2 - 2, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (enemy.type === 'goblin_archer') {
        this.ctx.fillStyle = '#8b5cf6';
        this.ctx.strokeStyle = '#4c1d95';
        this.ctx.lineWidth = 1.5;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x, enemy.y);
        this.ctx.lineTo(enemy.x + enemy.width / 2, enemy.y - 8);
        this.ctx.lineTo(enemy.x + enemy.width, enemy.y);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = '#ca8a04';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        const bowX = enemy.facing === 1 ? enemy.x + enemy.width - 4 : enemy.x + 4;
        this.ctx.arc(bowX, enemy.y + enemy.height / 2, 8, -Math.PI / 2, Math.PI / 2, enemy.facing === -1);
        this.ctx.stroke();
      } else if (enemy.type === 'fire_golem') {
        this.ctx.fillStyle = '#ea580c';
        this.ctx.strokeStyle = '#7c2d12';
        this.ctx.lineWidth = 2;

        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        this.ctx.fillStyle = '#facc15';
        this.ctx.fillRect(enemy.x + 8, enemy.y + 12, 4, 18);
        this.ctx.fillRect(enemy.x + 22, enemy.y + 15, 6, 4);

      } else if (enemy.type === 'miniboss') {
        this.ctx.save();
        this.ctx.fillStyle = '#1e1b4b';
        this.ctx.strokeStyle = '#e11d48';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = '#e11d48';

        // Body (Circle)
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        // original wings and horn points
        this.ctx.fillStyle = '#f43f5e';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x, enemy.y + 10);
        this.ctx.lineTo(enemy.x - 16, enemy.y - 12);
        this.ctx.lineTo(enemy.x + 12, enemy.y + 20);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width, enemy.y + 10);
        this.ctx.lineTo(enemy.x + enemy.width + 16, enemy.y - 12);
        this.ctx.lineTo(enemy.x + enemy.width - 12, enemy.y + 20);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#eab308';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + 12, enemy.y);
        this.ctx.lineTo(enemy.x + 20, enemy.y - 12);
        this.ctx.lineTo(enemy.x + 28, enemy.y - 4);
        this.ctx.lineTo(enemy.x + 36, enemy.y - 12);
        this.ctx.lineTo(enemy.x + 44, enemy.y);
        this.ctx.closePath();
        this.ctx.fill();

        // visor eye
        this.ctx.fillStyle = '#ef4444';
        const eyeX = enemy.facing === 1 ? enemy.x + enemy.width * 0.55 : enemy.x + enemy.width * 0.25;
        this.ctx.fillRect(eyeX, enemy.y + enemy.height * 0.35, enemy.width * 0.2, enemy.height * 0.15);
        this.ctx.restore();

        const hbW = enemy.width + 16;
        const hbX = enemy.x - 8;
        const hbY = enemy.y - 20;
        this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
        this.ctx.fillRect(hbX, hbY, hbW, 6);
        this.ctx.fillStyle = '#f43f5e';
        this.ctx.fillRect(hbX, hbY, hbW * (enemy.hp / enemy.maxHp), 6);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(hbX, hbY, hbW, 6);
      } else if (enemy.type === 'king_slime') {
        this.ctx.save();
        const squish = Math.sin(this.frameCount * 0.12 + enemy.id) * 4;

        // Translucent gradient jelly body
        const slimeGrad = this.ctx.createRadialGradient(
          enemy.x + enemy.width / 2 - 8,
          enemy.y + enemy.height / 2 - 8,
          5,
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          enemy.width / 2
        );
        slimeGrad.addColorStop(0, '#34d399');
        slimeGrad.addColorStop(0.7, '#059669');
        slimeGrad.addColorStop(1, '#064e3b');

        this.ctx.fillStyle = slimeGrad;
        this.ctx.strokeStyle = '#34d399';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#10b981';

        this.ctx.beginPath();
        this.ctx.ellipse(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2 + squish / 2,
          enemy.width / 2,
          enemy.height / 2 - squish / 2,
          0, 0, Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.stroke();

        // Glowing yellow core
        this.ctx.fillStyle = '#fef08a';
        this.ctx.beginPath();
        this.ctx.arc(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2 + squish / 2,
          10, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Crown
        this.ctx.fillStyle = '#eab308';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#eab308';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + 16, enemy.y - 4);
        this.ctx.lineTo(enemy.x + 22, enemy.y - 18);
        this.ctx.lineTo(enemy.x + 30, enemy.y - 8);
        this.ctx.lineTo(enemy.x + 38, enemy.y - 18);
        this.ctx.lineTo(enemy.x + 44, enemy.y - 4);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

        const hbW = enemy.width + 24;
        const hbX = enemy.x - 12;
        const hbY = enemy.y - 28;
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(hbX, hbY, hbW, 7);
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillRect(hbX, hbY, hbW * (enemy.hp / enemy.maxHp), 7);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(hbX, hbY, hbW, 7);
      } else if (enemy.type === 'frost_wyvern') {
        this.ctx.save();
        this.ctx.fillStyle = '#0284c7';
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = '#0ea5e9';

        // Ice crystal diamond shape
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width / 2, enemy.y);
        this.ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height / 2);
        this.ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
        this.ctx.lineTo(enemy.x, enemy.y + enemy.height / 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Veins
        this.ctx.strokeStyle = '#7dd3fc';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width / 2, enemy.y);
        this.ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
        this.ctx.moveTo(enemy.x, enemy.y + enemy.height / 2);
        this.ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height / 2);
        this.ctx.stroke();

        // Core
        const coreGrad = this.ctx.createRadialGradient(
          enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 2,
          enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12
        );
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        this.ctx.fillStyle = coreGrad;
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12, 0, Math.PI * 2);
        this.ctx.fill();

        // Wings
        this.ctx.fillStyle = '#7dd3fc';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x, enemy.y + 10);
        this.ctx.lineTo(enemy.x - 20, enemy.y - 16);
        this.ctx.lineTo(enemy.x + 14, enemy.y + 24);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width, enemy.y + 10);
        this.ctx.lineTo(enemy.x + enemy.width + 20, enemy.y - 16);
        this.ctx.lineTo(enemy.x + enemy.width - 14, enemy.y + 24);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

        const hbW = enemy.width + 24;
        const hbX = enemy.x - 12;
        const hbY = enemy.y - 28;
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(hbX, hbY, hbW, 7);
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillRect(hbX, hbY, hbW * (enemy.hp / enemy.maxHp), 7);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(hbX, hbY, hbW, 7);
      } else if (enemy.type === 'shadow_overlord') {
        this.ctx.save();
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#c084fc';

        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;
        const rot = (this.frameCount * 0.05) % (Math.PI * 2);

        // Outer body
        this.ctx.fillStyle = '#1e1b4b';
        this.ctx.strokeStyle = '#a855f7';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, enemy.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Vortex core
        this.ctx.translate(cx, cy);
        this.ctx.rotate(rot);

        const coreGrad = this.ctx.createRadialGradient(0, 0, 2, 0, 0, enemy.width * 0.4);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.4, '#a855f7');
        coreGrad.addColorStop(1, '#3b0764');
        this.ctx.fillStyle = coreGrad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, enemy.width * 0.4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#c084fc';
        this.ctx.lineWidth = 2.5;
        for (let i = 0; i < 4; i++) {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, enemy.width * 0.35, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 3);
          this.ctx.stroke();
        }
        this.ctx.restore();

        this.ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 1.5, 0, Math.PI * 2);
        this.ctx.fill();

        const hbW = enemy.width + 24;
        const hbX = enemy.x - 12;
        const hbY = enemy.y - 28;
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(hbX, hbY, hbW, 7);
        this.ctx.fillStyle = '#a855f7';
        this.ctx.fillRect(hbX, hbY, hbW * (enemy.hp / enemy.maxHp), 7);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(hbX, hbY, hbW, 7);
      } else if (enemy.type === 'dragon_king') {
        this.ctx.save();
        this.ctx.fillStyle = '#9a3412';
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 3.5;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ea580c';

        // Curved armor torso
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width / 2, enemy.y);
        this.ctx.bezierCurveTo(enemy.x + enemy.width, enemy.y + 10, enemy.x + enemy.width - 5, enemy.y + enemy.height - 15, enemy.x + enemy.width / 2, enemy.y + enemy.height);
        this.ctx.bezierCurveTo(enemy.x + 5, enemy.y + enemy.height - 15, enemy.x, enemy.y + 10, enemy.x + enemy.width / 2, enemy.y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Gold plate
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 14, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#fbbf24';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x, enemy.y + 12);
        this.ctx.lineTo(enemy.x - 28, enemy.y - 24);
        this.ctx.lineTo(enemy.x + 16, enemy.y + 32);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width, enemy.y + 12);
        this.ctx.lineTo(enemy.x + enemy.width + 28, enemy.y - 24);
        this.ctx.lineTo(enemy.x + enemy.width - 16, enemy.y + 32);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(enemy.x + 18, enemy.y - 16, 12, 16);
        this.ctx.fillRect(enemy.x + 38, enemy.y - 22, 12, 22);
        this.ctx.fillRect(enemy.x + 58, enemy.y - 16, 12, 16);
        this.ctx.restore();

        const hbW = enemy.width + 30;
        const hbX = enemy.x - 15;
        const hbY = enemy.y - 32;
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(hbX, hbY, hbW, 9);
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(hbX, hbY, hbW * (enemy.hp / enemy.maxHp), 9);
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(hbX, hbY, hbW, 9);
      } else if (enemy.type === 'bomb_thrower') {
        const isFacingRight = enemy.facing === 1;

        this.ctx.fillStyle = '#334155';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        this.ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);

        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(
          isFacingRight ? enemy.x + enemy.width - 14 : enemy.x,
          enemy.y + 4,
          14,
          10
        );

        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillRect(
          isFacingRight ? enemy.x + enemy.width - 8 : enemy.x + 3,
          enemy.y + 7,
          4,
          4
        );

        const bombX = isFacingRight ? enemy.x + enemy.width + 2 : enemy.x - 12;
        const bombY = enemy.y + 12;
        this.ctx.fillStyle = '#0f172a';
        this.ctx.beginPath();
        this.ctx.arc(bombX + 6, bombY + 6, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = this.frameCount % 4 < 2 ? '#ef4444' : '#fbbf24';
        this.ctx.beginPath();
        this.ctx.arc(bombX + 6, bombY, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (enemy.type === 'flying_wyvern') {
        this.ctx.fillStyle = '#c084fc';
        this.ctx.strokeStyle = '#6b21a8';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, enemy.height / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        const flap = Math.sin(this.frameCount * 0.25) * 8;
        this.ctx.fillStyle = '#a855f7';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x, enemy.y + 10);
        this.ctx.lineTo(enemy.x - 14, enemy.y - 6 + flap);
        this.ctx.lineTo(enemy.x + 8, enemy.y + 14);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width, enemy.y + 10);
        this.ctx.lineTo(enemy.x + enemy.width + 14, enemy.y - 6 + flap);
        this.ctx.lineTo(enemy.x + enemy.width - 8, enemy.y + 14);
        this.ctx.closePath();
        this.ctx.fill();
      } else if (enemy.type === 'fish') {
        this.ctx.fillStyle = '#06b6d4';
        this.ctx.strokeStyle = '#0891b2';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.ellipse(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, enemy.height / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        const tailSwing = Math.sin(this.frameCount * 0.3) * 4;
        const tailX = enemy.facing === 1 ? enemy.x : enemy.x + enemy.width;
        this.ctx.beginPath();
        this.ctx.moveTo(tailX, enemy.y + enemy.height / 2);
        this.ctx.lineTo(tailX - enemy.facing * 10, enemy.y + enemy.height / 2 - 8 + tailSwing);
        this.ctx.lineTo(tailX - enemy.facing * 10, enemy.y + enemy.height / 2 + 8 + tailSwing);
        this.ctx.closePath();
        this.ctx.fill();
      } else if (enemy.type === 'anchor') {
        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;
        const w = enemy.width;
        const h = enemy.height;

        this.ctx.save();
        this.ctx.strokeStyle = '#854d0e';
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(cx, 0);
        this.ctx.lineTo(cx, enemy.y + 10);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#a16207';
        this.ctx.lineWidth = 1.5;
        const step = 8;
        for (let ry = 0; ry < enemy.y + 10; ry += step) {
          this.ctx.beginPath();
          this.ctx.moveTo(cx - 2, ry);
          this.ctx.lineTo(cx + 2, ry + 4);
          this.ctx.stroke();
        }
        this.ctx.restore();

        this.ctx.save();
        const metallicGrad = this.ctx.createLinearGradient(enemy.x, enemy.y, enemy.x + w, enemy.y + h);
        metallicGrad.addColorStop(0, '#94a3b8');
        metallicGrad.addColorStop(0.5, '#475569');
        metallicGrad.addColorStop(1, '#1e293b');

        this.ctx.fillStyle = metallicGrad;
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3;
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();
        this.ctx.arc(cx, enemy.y + 12, 10, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.fillStyle = '#64748b';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(cx, enemy.y + 12, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0284c7';
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = metallicGrad;

        this.ctx.fillRect(cx - w * 0.35, enemy.y + 20, w * 0.7, 8);
        this.ctx.strokeRect(cx - w * 0.35, enemy.y + 20, w * 0.7, 8);

        this.ctx.fillRect(cx - 5, enemy.y + 20, 10, h - 35);
        this.ctx.strokeRect(cx - 5, enemy.y + 20, 10, h - 35);

        this.ctx.beginPath();
        const flukeLeftX = enemy.x + 2;
        const flukeLeftY = enemy.y + h - 25;
        const flukeRightX = enemy.x + w - 2;
        const flukeRightY = enemy.y + h - 25;
        const bottomY = enemy.y + h - 2;

        this.ctx.moveTo(flukeLeftX, flukeLeftY);
        this.ctx.quadraticCurveTo(cx, bottomY + 5, flukeRightX, flukeRightY);
        this.ctx.quadraticCurveTo(cx, bottomY - 12, flukeLeftX, flukeLeftY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(flukeLeftX, flukeLeftY);
        this.ctx.lineTo(flukeLeftX - 6, flukeLeftY - 8);
        this.ctx.lineTo(flukeLeftX + 8, flukeLeftY - 4);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(flukeRightX, flukeRightY);
        this.ctx.lineTo(flukeRightX + 6, flukeRightY - 8);
        this.ctx.lineTo(flukeRightX - 8, flukeRightY - 4);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
      } else if (enemy.type === 'scallop') {
        const isClosed = Math.abs(this.px + this.pWidth / 2 - (enemy.x + enemy.width / 2)) < 24;
        this.ctx.fillStyle = isClosed ? '#ef4444' : '#fb7185';
        this.ctx.strokeStyle = '#881337';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + 8, 16, Math.PI, 0);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + 24, 16, 0, Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        if (!isClosed) {
          this.ctx.fillStyle = '#ffffff';
          this.ctx.beginPath();
          this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + 16, 5, 0, Math.PI * 2);
          this.ctx.fill();
        }
      } else if (enemy.type === 'killer_whale') {
        this.ctx.save();
        this.ctx.fillStyle = '#0f172a';
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#0ea5e9';

        // Draw a rounded dolphin/orca shape body!
        this.ctx.beginPath();
        this.ctx.ellipse(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          enemy.width / 2,
          enemy.height / 2.2,
          0, 0, Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.stroke();

        // White belly patch
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.beginPath();
        this.ctx.ellipse(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height * 0.7,
          enemy.width * 0.35,
          enemy.height * 0.15,
          0, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Eye (red glowing)
        this.ctx.fillStyle = '#ef4444';
        const eyeX = enemy.facing === 1 ? enemy.x + enemy.width * 0.75 : enemy.x + enemy.width * 0.25;
        this.ctx.beginPath();
        this.ctx.arc(eyeX, enemy.y + enemy.height * 0.35, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Fin
        this.ctx.fillStyle = '#0f172a';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width / 2 - 8, enemy.y);
        this.ctx.lineTo(enemy.x + enemy.width / 2, enemy.y - 18);
        this.ctx.lineTo(enemy.x + enemy.width / 2 + 12, enemy.y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

        if (enemy.suckTimer && enemy.suckTimer > 0) {
          const cx = enemy.x + enemy.width / 2;
          const cy = enemy.y + enemy.height / 2;
          const auraRadius = 120;

          this.ctx.save();

          const grad = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, auraRadius);
          grad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
          grad.addColorStop(0.6, 'rgba(8, 145, 178, 0.2)');
          grad.addColorStop(1, 'rgba(8, 145, 178, 0.0)');
          this.ctx.fillStyle = grad;
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, auraRadius, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.strokeStyle = 'rgba(125, 211, 252, 0.6)';
          this.ctx.lineWidth = 2;
          this.ctx.translate(cx, cy);
          this.ctx.rotate(this.frameCount * 0.12);
          for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, auraRadius * (0.3 + i * 0.25), 0, Math.PI * 0.7);
            this.ctx.stroke();
          }
          this.ctx.restore();

          this.ctx.fillStyle = '#ef4444';
          this.ctx.font = 'bold 10px sans-serif';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('⚠️ LEVIATHAN VORTEX!', cx, enemy.y - 32);
        }

        const hbW = enemy.width + 20;
        const hbX = enemy.x - 10;
        const hbY = enemy.y - 25;
        this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
        this.ctx.fillRect(hbX, hbY, hbW, 8);
        const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillRect(hbX, hbY, hbW * hpPct, 8);
      } else if (enemy.type === 'alien') {
        const bx = enemy.x;
        const by = enemy.y;
        const bw = enemy.width;
        const bh = enemy.height;

        this.ctx.fillStyle = '#0f172a';
        this.ctx.strokeStyle = '#a855f7';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.ellipse(bx + bw / 2, by + bh / 2, bw / 2, bh / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#c084fc';
        this.ctx.beginPath();
        this.ctx.arc(bx + bw / 2 + (enemy.facing * 4), by + bh / 2 - 4, 7, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(bx + bw / 2 + (enemy.facing * 4), by + bh / 2 - 4, 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillRect(enemy.facing === 1 ? bx + bw : bx - 14, by + bh / 2 - 2, 14, 4);

        const hbW = bw;
        const hbX = bx;
        const hbY = by - 14;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(hbX, hbY, hbW, 6);
        const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
        this.ctx.fillStyle = '#a855f7';
        this.ctx.fillRect(hbX, hbY, hbW * hpPct, 6);
      } else if (enemy.type === 'giant_wisp') {
        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;
        const r = enemy.width / 2;

        // Dynamic growing & shrinking pulse effect
        const growShrink = Math.sin(this.frameCount * 0.05) * 16;
        const currentR = r + growShrink;

        const grad = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, currentR);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#38bdf8');
        grad.addColorStop(0.7, '#818cf8');
        grad.addColorStop(1, 'rgba(79, 70, 229, 0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, currentR, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#c084fc';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, (currentR * 0.55) + Math.cos(this.frameCount * 0.15) * 4, 0, Math.PI * 2);
        this.ctx.stroke();

        const orbitAngle = enemy.wispOrbitAngle || 0;
        const orbitRadius = 90 + Math.sin(this.frameCount * 0.05) * 25;
        for (let i = 0; i < 4; i++) {
          const ang = orbitAngle + (i * Math.PI) / 2;
          const sx = cx + Math.cos(ang) * orbitRadius;
          const sy = cy + Math.sin(ang) * orbitRadius;

          const orbPulse = 14 + Math.sin(this.frameCount * 0.1 + i) * 3;
          this.ctx.fillStyle = '#fef08a';
          this.ctx.beginPath();
          this.ctx.arc(sx, sy, orbPulse, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.fillStyle = '#ffffff';
          this.ctx.beginPath();
          this.ctx.arc(sx, sy, orbPulse * 0.45, 0, Math.PI * 2);
          this.ctx.fill();
        }

        if (enemy.wispDetonating) {
          this.ctx.save();
          this.ctx.strokeStyle = '#ef4444';
          this.ctx.lineWidth = 4;
          this.ctx.setLineDash([8, 6]);
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, 400, 0, Math.PI * 2);
          this.ctx.stroke();

          this.ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          this.ctx.beginPath();
          const timerVal = enemy.wispDetonationTimer !== undefined ? enemy.wispDetonationTimer : 120;
          this.ctx.arc(cx, cy, (1 - timerVal / 120) * 400, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        }

        const hbW = enemy.width + 60;
        const hbX = cx - hbW / 2;
        const hbY = enemy.y - 36;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(hbX, hbY, hbW, 12);
        const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
        this.ctx.fillStyle = enemy.wispDetonating ? '#ef4444' : '#38bdf8';
        this.ctx.fillRect(hbX, hbY, hbW * hpPct, 12);
        this.ctx.strokeStyle = '#eab308';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(hbX, hbY, hbW, 12);
      } else if (enemy.type === 'skeleton_archer') {
        if (enemy.isBonePile) {
          this.ctx.fillStyle = '#e2e8f0';
          this.ctx.fillRect(enemy.x, enemy.y + enemy.height - 6, enemy.width, 6);
          this.ctx.fillRect(enemy.x + 6, enemy.y + enemy.height - 10, enemy.width - 12, 4);

          this.ctx.beginPath();
          this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height - 12, 5, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.ctx.fillStyle = '#e2e8f0';
          this.ctx.strokeStyle = '#94a3b8';
          this.ctx.lineWidth = 1.5;

          this.ctx.beginPath();
          this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + 10, 8, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.stroke();

          this.ctx.fillStyle = '#0f172a';
          this.ctx.beginPath();
          this.ctx.arc(enemy.x + enemy.width / 2 + (enemy.facing * 3) - 2, enemy.y + 9, 2, 0, Math.PI * 2);
          this.ctx.arc(enemy.x + enemy.width / 2 + (enemy.facing * 3) + 3, enemy.y + 9, 2, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.fillStyle = '#e2e8f0';
          this.ctx.fillRect(enemy.x + enemy.width / 2 - 3, enemy.y + 18, 6, 14);
          this.ctx.fillRect(enemy.x + 4, enemy.y + 22, enemy.width - 8, 3);
          this.ctx.fillRect(enemy.x + 6, enemy.y + 27, enemy.width - 12, 3);

          this.ctx.strokeStyle = '#cbd5e1';
          this.ctx.lineWidth = 2.5;
          const bowX = enemy.facing === 1 ? enemy.x + enemy.width - 2 : enemy.x + 2;
          this.ctx.beginPath();
          this.ctx.arc(bowX, enemy.y + 20, 10, -Math.PI / 2, Math.PI / 2, enemy.facing === -1);
          this.ctx.stroke();
        }
      } else if (enemy.type === 'king_kong') {
        const bx = enemy.x;
        const by = enemy.y;
        const bw = enemy.width;
        const bh = enemy.height;

        this.ctx.save();
        this.ctx.fillStyle = '#1e293b';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 3.5;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = '#0f172a';

        // Large rounded chest/shoulders shape!
        this.ctx.beginPath();
        this.ctx.roundRect(bx, by, bw, bh, [30, 30, 15, 15]);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillRect(bx + 12, by + 10, bw - 24, bh - 30);

        this.ctx.fillStyle = '#475569';
        this.ctx.fillRect(bx + 18, by + 28, bw - 36, bh - 40);

        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(bx + bw / 2 - 18, by + 6, 36, 24);

        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(bx + bw / 2 + (enemy.facing * 8) - 4, by + 12, 4, 4);
        this.ctx.fillRect(bx + bw / 2 + (enemy.facing * 8) + 4, by + 12, 4, 4);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(bx + bw / 2 - 6, by + 24);
        this.ctx.lineTo(bx + bw / 2 - 3, by + 29);
        this.ctx.lineTo(bx + bw / 2, by + 24);
        this.ctx.moveTo(bx + bw / 2 + 2, by + 24);
        this.ctx.lineTo(bx + bw / 2 + 5, by + 29);
        this.ctx.lineTo(bx + bw / 2 + 8, by + 24);
        this.ctx.fill();

        const fistX = enemy.facing === 1 ? bx + bw - 12 : bx - 6;
        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(fistX, by + bh - 28, 18, 24);

        const hbW = bw + 40;
        const hbX = bx - 20;
        const hbY = by - 32;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(hbX, hbY, hbW, 10);
        const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(hbX, hbY, hbW * hpPct, 10);
        this.ctx.strokeStyle = '#eab308';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(hbX, hbY, hbW, 10);
      } else if (enemy.type === 'immortal_gladiator') {
        const bx = enemy.x;
        const by = enemy.y;
        const bw = enemy.width;
        const bh = enemy.height;

        this.ctx.save();
        this.ctx.fillStyle = '#881337';
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 3.5;
        this.ctx.shadowBlur = 14;
        this.ctx.shadowColor = '#e11d48';

        // Curved armor torso
        this.ctx.beginPath();
        this.ctx.moveTo(bx + bw / 2, by);
        this.ctx.lineTo(bx + bw, by + 12);
        this.ctx.lineTo(bx + bw - 6, by + bh);
        this.ctx.lineTo(bx + 6, by + bh);
        this.ctx.lineTo(bx, by + 12);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Steel plating lines
        this.ctx.strokeStyle = '#fda4af';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(bx + bw / 2, by);
        this.ctx.lineTo(bx + bw / 2, by + bh);
        this.ctx.stroke();

        this.ctx.restore();

        if (enemy.isCharging) {
          this.ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          this.ctx.fillRect(bx - 8, by - 8, bw + 16, bh + 16);
          this.ctx.strokeStyle = '#ef4444';
          this.ctx.lineWidth = 3.5;
          this.ctx.strokeRect(bx - 8, by - 8, bw + 16, bh + 16);
        }

        this.ctx.fillStyle = '#fef08a';
        this.ctx.beginPath();
        this.ctx.moveTo(bx + 12, by);
        this.ctx.lineTo(bx + 4, by - 16);
        this.ctx.lineTo(bx + 24, by + 12);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(bx + bw - 12, by);
        this.ctx.lineTo(bx + bw - 4, by - 16);
        this.ctx.lineTo(bx + bw - 24, by + 12);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(bx + 16, by + 14, bw - 32, 6);

        this.ctx.fillStyle = '#f97316';
        this.ctx.fillRect(enemy.facing === 1 ? bx + bw + 2 : bx - 14, by + 8, 12, 40);

        if (enemy.stunTimer && enemy.stunTimer > 0) {
          const starAngle = (this.frameCount * 0.2) % (Math.PI * 2);
          for (let s = 0; s < 3; s++) {
            const sang = starAngle + (s * Math.PI * 2) / 3;
            const sx = bx + bw / 2 + Math.cos(sang) * 24;
            const sy = by - 18 + Math.sin(sang) * 8;
            this.ctx.fillStyle = '#fef08a';
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, 4, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }

        const hbW = bw + 40;
        const hbX = bx - 20;
        const hbY = by - 36;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(hbX, hbY, hbW, 10);
        this.ctx.fillStyle = enemy.stunTimer && enemy.stunTimer > 0 ? '#fef08a' : '#f43f5e';
        this.ctx.fillRect(hbX, hbY, hbW * Math.max(0, enemy.hp / enemy.maxHp), 10);
        this.ctx.strokeStyle = '#fef08a';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(hbX, hbY, hbW, 10);

        this.ctx.font = 'bold 11px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = enemy.stunTimer && enemy.stunTimer > 0 ? '#fef08a' : '#fca5a5';
        this.ctx.shadowColor = '#ef4444';
        this.ctx.shadowBlur = 8;
        this.ctx.fillText(
          enemy.stunTimer && enemy.stunTimer > 0 ? '💫 STUNNED! (1s)' : 'IMMORTAL GLADIATOR 🛡️💀',
          bx + bw / 2,
          hbY - 6
        );
      } else if (enemy.type === 'lunar_goddess') {
        const bx = enemy.x;
        const by = enemy.y;
        const bw = enemy.width;
        const bh = enemy.height;
        const cx = bx + bw / 2;
        const cy = by + bh / 2;

        this.ctx.save();

        // Halo effect: glowing silver crescent moon behind her head
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.strokeStyle = '#c7d2fe';
        this.ctx.lineWidth = 2.5;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#e0f2fe';

        this.ctx.beginPath();
        this.ctx.arc(cx, by + 16, 24, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Goddess robe / gown silhouette
        const robeGrad = this.ctx.createLinearGradient(cx, by, cx, by + bh);
        robeGrad.addColorStop(0, '#e0f2fe');
        robeGrad.addColorStop(0.5, '#818cf8');
        robeGrad.addColorStop(1, '#312e81');

        this.ctx.fillStyle = robeGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, by + 12); // head base
        this.ctx.bezierCurveTo(bx + bw, by + 25, bx + bw, by + bh - 10, bx + bw - 6, by + bh);
        this.ctx.lineTo(bx + 6, by + bh);
        this.ctx.bezierCurveTo(bx, by + bh - 10, bx, by + 25, cx, by + 12);
        this.ctx.closePath();
        this.ctx.fill();

        // Head / Face
        this.ctx.fillStyle = '#fef08a';
        this.ctx.beginPath();
        this.ctx.arc(cx, by + 10, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // Glowing moon crown
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(cx, by - 2, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Glowing staff/weapon in hand
        const handX = enemy.facing === 1 ? bx + bw + 6 : bx - 6;
        this.ctx.strokeStyle = '#c7d2fe';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(handX, by + 10);
        this.ctx.lineTo(handX, by + bh - 10);
        this.ctx.stroke();

        // Staff glowing top
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(handX, by + 10, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // Staff glow shadow
        this.ctx.fillStyle = 'rgba(199, 210, 254, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(handX, by + 10, 16, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();

        // Render Lunar Goddess Beam Barrage
        if (enemy.beamBarrageActive && enemy.beamTimer) {
          if (enemy.beamTimer >= 120) {
            // Warning phase: red line pointing to target
            this.ctx.save();
            this.ctx.strokeStyle = '#f43f5e';
            this.ctx.lineWidth = 1.5;
            this.ctx.setLineDash([6, 3]);
            this.ctx.beginPath();
            this.ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            this.ctx.lineTo(enemy.beamTargetX!, enemy.beamTargetY!);
            this.ctx.stroke();
            this.ctx.restore();
          } else {
            // Firing phase: thick purple/cyan beam!
            this.ctx.save();
            const startX = enemy.x + enemy.width / 2;
            const startY = enemy.y + enemy.height / 2;
            const endX = enemy.beamEndX || startX;
            const endY = enemy.beamEndY || startY;

            // Outer glow
            this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
            this.ctx.lineWidth = 36;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();

            // Core
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 10;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();

            // Star sparks at end point
            for (let p = 0; p < 2; p++) {
              this.particles.push({
                x: endX + (Math.random() - 0.5) * 20,
                y: endY + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 6 + 2,
                color: '#e0f2fe',
                life: 14,
                maxLife: 14
              });
            }
            this.ctx.restore();
          }
        }

        // Health Bar UI
        const hbW = bw + 32;
        const hbX = bx - 16;
        const hbY = by - 28;
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(hbX, hbY, hbW, 9);
        this.ctx.fillStyle = '#818cf8';
        this.ctx.fillRect(hbX, hbY, hbW * (enemy.hp / enemy.maxHp), 9);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(hbX, hbY, hbW, 9);
      }

      if (
        enemy.hp < enemy.maxHp &&
        enemy.type !== 'miniboss' &&
        enemy.type !== 'king_slime' &&
        enemy.type !== 'frost_wyvern' &&
        enemy.type !== 'shadow_overlord' &&
        enemy.type !== 'dragon_king' &&
        enemy.type !== 'king_kong' &&
        enemy.type !== 'giant_wisp' &&
        enemy.type !== 'immortal_gladiator' &&
        enemy.type !== 'killer_whale' &&
        enemy.type !== 'lunar_goddess'
      ) {
        const hpPercent = enemy.hp / enemy.maxHp;
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 4);
        this.ctx.fillStyle = '#22c55e';
        this.ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * hpPercent, 4);
      }

      this.ctx.restore();
    });

    this.particles.forEach(part => {
      this.ctx.save();
      const alpha = Math.max(0, part.life / part.maxLife);
      this.ctx.globalAlpha = alpha;

      const pType = (part as any).type || (part.color === '#ef4444' || part.color === '#f97316' || part.color === '#ea580c' ? 'inferno' : part.color === '#22c55e' || part.color === '#86efac' || part.color === '#a855f7' ? 'poison' : part.color === '#38bdf8' || part.color === '#7dd3fc' ? 'ice' : 'general');

      if (pType === 'inferno') {
        this.ctx.fillStyle = part.color;
        this.ctx.globalAlpha = alpha * 0.35;
        this.ctx.beginPath();
        this.ctx.arc(part.x, part.y, part.size * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = alpha;

        this.ctx.fillStyle = part.color;
        this.ctx.beginPath();
        this.ctx.arc(part.x, part.y, Math.max(1, part.size / 2), 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = alpha > 0.4 ? '#ffffff' : '#fef08a';
        this.ctx.beginPath();
        this.ctx.arc(part.x, part.y, Math.max(0.8, part.size * 0.25), 0, Math.PI * 2);
        this.ctx.fill();
      } else if (pType === 'ice') {
        this.ctx.fillStyle = part.color;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;

        const r = Math.max(1, part.size / 2);
        this.ctx.beginPath();
        this.ctx.arc(part.x, part.y, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
      } else if (pType === 'poison') {
        this.ctx.fillStyle = part.color;
        this.ctx.beginPath();
        this.ctx.arc(part.x, part.y, Math.max(1, part.size / 2), 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        this.ctx.beginPath();
        this.ctx.arc(part.x - part.size * 0.15, part.y - part.size * 0.15, Math.max(0.5, part.size * 0.15), 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = part.color;
        this.ctx.fillRect(part.x, part.y, part.size, part.size);
      }

      this.ctx.restore();
    });

    if (this.birdActive) {
      this.ctx.save();
      const isRampage = this.birdRampageTimer > 0;

      if (isRampage) {
        // Rampage aura — pulsing fire ring
        const auraPulse = Math.sin(this.frameCount * 0.22) * 4;
        const auraGrad = this.ctx.createRadialGradient(this.birdX, this.birdY, 4, this.birdX, this.birdY, 24 + auraPulse);
        auraGrad.addColorStop(0, 'rgba(249, 115, 22, 0.8)');
        auraGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
        auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        this.ctx.fillStyle = auraGrad;
        this.ctx.beginPath();
        this.ctx.arc(this.birdX, this.birdY, 24 + auraPulse, 0, Math.PI * 2);
        this.ctx.fill();

        // Rotating fire ring arcs
        const ra0 = this.frameCount * 0.18;
        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(this.birdX, this.birdY, 18 + auraPulse * 0.5, ra0, ra0 + Math.PI * 1.4);
        this.ctx.stroke();
        this.ctx.strokeStyle = 'rgba(253, 186, 116, 0.7)';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(this.birdX, this.birdY, 22 + auraPulse * 0.5, -ra0, -ra0 + Math.PI * 1.1);
        this.ctx.stroke();
      }

      // Bird body
      this.ctx.fillStyle = isRampage ? '#f97316' : '#38bdf8';
      this.ctx.strokeStyle = isRampage ? '#7c2d12' : '#0369a1';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(this.birdX, this.birdY, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Wings
      const wingFlap = Math.sin(this.frameCount * 0.4) * 6;
      this.ctx.fillStyle = isRampage ? '#fef08a' : '#7dd3fc';
      this.ctx.beginPath();
      this.ctx.moveTo(this.birdX - 4, this.birdY);
      this.ctx.lineTo(this.birdX - 14, this.birdY - 6 + wingFlap);
      this.ctx.lineTo(this.birdX, this.birdY + 4);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.moveTo(this.birdX + 4, this.birdY);
      this.ctx.lineTo(this.birdX + 14, this.birdY - 6 + wingFlap);
      this.ctx.lineTo(this.birdX, this.birdY + 4);
      this.ctx.closePath();
      this.ctx.fill();

      // Beak
      const birdFacing = this.birdState === 'swooping' && this.birdTargetEnemy
        ? (this.birdTargetEnemy.x > this.birdX ? 1 : -1) : 1;
      this.ctx.fillStyle = isRampage ? '#fbbf24' : '#facc15';
      this.ctx.beginPath();
      this.ctx.moveTo(this.birdX + birdFacing * 7, this.birdY);
      this.ctx.lineTo(this.birdX + birdFacing * 13, this.birdY - 1.5);
      this.ctx.lineTo(this.birdX + birdFacing * 13, this.birdY + 1.5);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();
    }

    if (this.skeletonDeathTimer <= 0 && this.frozenDeathTimer <= 0 && this.electrocutionDeathTimer <= 0 && this.reaperDeathTimer <= 0 && this.antimatterDeathTimer <= 0) {
      this.ctx.save();

      const isSpinning = this.selectedDraco === 'Jumpmon' && this.jumpmonSpinActive;
      if (isSpinning) {
        const px = this.px;
        const py = this.py;
        const pw = this.pWidth;
        const ph = this.pHeight;
        this.ctx.translate(px + pw / 2, py + ph / 2);
        this.ctx.rotate(this.jumpmonSpinAngle);
        this.ctx.translate(-(px + pw / 2), -(py + ph / 2));

        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.arc(px + pw / 2, py + ph / 2, 34, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
        this.ctx.lineWidth = 14;
        this.ctx.beginPath();
        this.ctx.arc(px + pw / 2, py + ph / 2, 38, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      if (this.pInvulnerableFrames > 0 && Math.floor(this.pInvulnerableFrames / 4) % 2 === 0) {
        this.ctx.globalAlpha = 0.3;
      }

      let mainColor = '#f59e0b';
      let accentColor = '#b45309';
      let bellyColor = '#fef08a';
      let detailColor = '#ffffff';

      if (this.selectedDraco === 'Archermon') {
        mainColor = '#10b981';
        accentColor = '#065f46';
        bellyColor = '#a7f3d0';
        detailColor = '#fef08a';
      } else if (this.selectedDraco === 'Shieldmon') {
        mainColor = '#3b82f6';
        accentColor = '#1e3a8a';
        bellyColor = '#bfdbfe';
        detailColor = '#cbd5e1';
      } else if (this.selectedDraco === 'Assassinmon') {
        mainColor = '#4c1d95';
        accentColor = '#1e1b4b';
        bellyColor = '#c084fc';
        detailColor = '#c084fc';
      } else if (this.selectedDraco === 'Flymon') {
        mainColor = '#e11d48';
        accentColor = '#881337';
        bellyColor = '#fda4af';
        detailColor = '#facc15';
      } else if (this.selectedDraco === 'Whitemon') {
        mainColor = '#f8fafc';
        accentColor = '#64748b';
        bellyColor = '#e2e8f0';
        detailColor = '#38bdf8';
      } else if (this.selectedDraco === 'Magemon') {
        mainColor = '#6d28d9';
        accentColor = '#312e81';
        bellyColor = '#c084fc';
        detailColor = '#f59e0b';
      } else if (this.selectedDraco === 'Shadowmon') {
        mainColor = '#18181b';
        accentColor = '#881337';
        bellyColor = '#9f1239';
        detailColor = '#ef4444';
      } else if (this.selectedDraco === 'Bombamon') {
        mainColor = '#ea580c';
        accentColor = '#c2410c';
        bellyColor = '#fef08a';
        detailColor = '#ef4444';
      } else if (this.selectedDraco === 'Thundermon') {
        mainColor = '#facc15';
        accentColor = '#ca8a04';
        bellyColor = '#fef08a';
        detailColor = '#06b6d4';
      } else if (this.selectedDraco === 'Enigmon') {
        mainColor = '#333388';
        accentColor = '#581c87';
        bellyColor = '#c084fc';
        detailColor = '#e879f9';
      } else if (this.selectedDraco === 'Lunarmon') {
        mainColor = '#1e1b4b';
        accentColor = '#312e81';
        bellyColor = '#c7d2fe';
        detailColor = '#93c5fd';
      } else if (this.selectedDraco === 'Azuremon') {
        mainColor = '#0284c7';
        accentColor = '#0c4a6e';
        bellyColor = '#bae6fd';
        detailColor = '#38bdf8';
      }

      const px = this.px;
      const py = this.py;
      const pw = this.pWidth;
      const ph = this.pHeight;

      if (this.selectedDraco === 'Enigmon') {
        this.ctx.save();
        const auraPulse = Math.sin(this.frameCount * 0.12) * 3;
        const grad = this.ctx.createRadialGradient(px + pw / 2, py + ph / 2, 4, px + pw / 2, py + ph / 2, pw / 2 + 12 + auraPulse);
        grad.addColorStop(0, 'rgba(192, 132, 252, 0.4)');
        grad.addColorStop(0.6, 'rgba(88, 28, 135, 0.2)');
        grad.addColorStop(1, 'rgba(59, 7, 100, 0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px + pw / 2, py + ph / 2, pw / 2 + 12 + auraPulse, 0, Math.PI * 2);
        this.ctx.fill();

        for (let d = 0; d < 2; d++) {
          const dang = this.frameCount * 0.08 + d * Math.PI;
          const dx = px + pw / 2 + Math.cos(dang) * (pw / 2 + 10);
          const dy = py + ph / 2 + Math.sin(dang) * 10;
          this.ctx.fillStyle = '#c084fc';
          this.ctx.beginPath();
          this.ctx.arc(dx, dy, 3, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }

      if (this.selectedDraco === 'Azuremon') {
        this.ctx.save();
        const auraPulse = Math.sin(this.frameCount * 0.12) * 3;
        const grad = this.ctx.createRadialGradient(px + pw / 2, py + ph / 2, 4, px + pw / 2, py + ph / 2, pw / 2 + 14 + auraPulse);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        grad.addColorStop(0.6, 'rgba(186, 230, 253, 0.2)');
        grad.addColorStop(1, 'rgba(2, 132, 199, 0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px + pw / 2, py + ph / 2, pw / 2 + 14 + auraPulse, 0, Math.PI * 2);
        this.ctx.fill();

        for (let d = 0; d < 3; d++) {
          const dang = this.frameCount * 0.09 + d * ((Math.PI * 2) / 3);
          const dx = px + pw / 2 + Math.cos(dang) * (pw / 2 + 14);
          const dy = py + ph / 2 + Math.sin(dang) * 12;
          this.ctx.fillStyle = '#e0f2fe';
          this.ctx.beginPath();
          this.ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.strokeStyle = '#38bdf8';
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      if (this.shadowAfterimages.length > 0) {
        this.shadowAfterimages.forEach(img => {
          this.ctx.save();
          this.ctx.globalAlpha = img.alpha * 0.55;
          this.ctx.fillStyle = '#4c1d95';
          this.ctx.strokeStyle = '#c084fc';
          this.ctx.lineWidth = 2;

          const bodyY = img.y;
          this.ctx.beginPath();
          this.ctx.arc(img.x + pw / 2, bodyY + pw / 2, pw / 2, Math.PI, 0, false);
          this.ctx.lineTo(img.x + pw, bodyY + ph - 6);
          this.ctx.quadraticCurveTo(img.x + pw, bodyY + ph - 2, img.x + pw - 6, bodyY + ph - 2);
          this.ctx.lineTo(img.x + 6, bodyY + ph - 2);
          this.ctx.quadraticCurveTo(img.x, bodyY + ph - 2, img.x, bodyY + ph - 6);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();

          this.ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.moveTo(img.x - img.facing * 10, bodyY + 12);
          this.ctx.lineTo(img.x - img.facing * 35, bodyY + 12);
          this.ctx.moveTo(img.x - img.facing * 5, bodyY + 24);
          this.ctx.lineTo(img.x - img.facing * 30, bodyY + 24);
          this.ctx.stroke();

          this.ctx.restore();
        });
      }

      if (this.selectedDraco === 'Assassinmon' && this.assassinmonDashActive) {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + pw / 2, py + ph / 2, pw + 18, ph / 2 + 6, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(232, 121, 249, 0.85)';
        this.ctx.lineWidth = 3;
        for (let s = 0; s < 4; s++) {
          const sy = py + 6 + s * 9;
          this.ctx.beginPath();
          this.ctx.moveTo(px + (this.pFacing === 1 ? -15 : pw + 15), sy);
          this.ctx.lineTo(px + (this.pFacing === 1 ? -50 : pw + 50), sy);
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      if (this.selectedDraco === 'Shadowmon') {
        this.ctx.save();
        const auraPulse = Math.sin(this.frameCount * 0.1) * 4;
        this.ctx.fillStyle = 'rgba(159, 18, 57, 0.25)';
        this.ctx.beginPath();
        this.ctx.arc(px + pw / 2, py + ph / 2, pw / 2 + 10 + auraPulse, 0, Math.PI * 2);
        this.ctx.fill();

        const wingFlap = Math.sin(this.frameCount * 0.2) * 5;
        this.ctx.fillStyle = '#9f1239';
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 1.5;

        this.ctx.beginPath();
        this.ctx.moveTo(px + pw / 2 - 8, py + 16);
        this.ctx.quadraticCurveTo(px - 18, py - 6 + wingFlap, px - 28, py + 12 + wingFlap);
        this.ctx.quadraticCurveTo(px - 16, py + 22, px + pw / 2 - 8, py + 28);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(px + pw / 2 + 8, py + 16);
        this.ctx.quadraticCurveTo(px + pw + 18, py - 6 + wingFlap, px + pw + 28, py + 12 + wingFlap);
        this.ctx.quadraticCurveTo(px + pw + 16, py + 22, px + pw / 2 + 8, py + 28);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
      }

      if (this.pGrounded) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + pw / 2, py + ph, 14, 4, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }

      if (this.selectedDraco === 'Jumpmon' && this.isPlunging) {
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
        this.ctx.beginPath();
        this.ctx.arc(px + pw / 2, py + ph / 2, 28, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.moveTo(px + 2, py + ph - 6);
        this.ctx.lineTo(px + pw / 2, py + ph + 22);
        this.ctx.lineTo(px + pw - 2, py + ph - 6);
        this.ctx.closePath();
        this.ctx.fill();
      }

      const isMoving = Math.abs(this.pvx) > 0.2;
      const idleBob = (this.pGrounded && !isMoving) ? Math.sin(this.frameCount * 0.09) * 1.5 : 0;
      const legStride = (this.pGrounded && isMoving) ? Math.sin(this.frameCount * 0.35) * 6 : 0;

      this.ctx.fillStyle = accentColor;
      this.ctx.beginPath();
      const tailBaseX = this.pFacing === 1 ? px + 2 : px + pw - 2;
      const tailBaseY = py + ph - 14 + idleBob;
      const tailTipX = this.pFacing === 1 ? px - 12 + Math.cos(this.frameCount * 0.1) * 3 : px + pw + 12 - Math.cos(this.frameCount * 0.1) * 3;
      const tailTipY = py + ph - 20 + Math.sin(this.frameCount * 0.1) * 4;

      this.ctx.moveTo(tailBaseX, tailBaseY);
      this.ctx.quadraticCurveTo(tailBaseX - this.pFacing * 8, tailBaseY - 10, tailTipX, tailTipY);
      this.ctx.quadraticCurveTo(tailBaseX - this.pFacing * 4, tailBaseY + 6, tailBaseX, tailBaseY + 4);
      this.ctx.closePath();
      this.ctx.fill();

      if (this.selectedDraco === 'Flymon') {
        this.ctx.save();
        this.ctx.fillStyle = '#fda4af';
        this.ctx.globalAlpha = 0.75;
        const buzz = Math.sin(this.frameCount * 0.8) * 4;
        this.ctx.beginPath();
        const wingX = this.pFacing === 1 ? px + 6 : px + pw - 6;
        this.ctx.ellipse(wingX - this.pFacing * 12, py + 16 + buzz, 14, 6, -this.pFacing * Math.PI / 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(wingX - this.pFacing * 16, py + 22 - buzz, 10, 5, -this.pFacing * Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      this.ctx.fillStyle = accentColor;
      if (this.pGrounded) {
        this.ctx.fillRect(px + 4 + legStride, py + ph - 6 + idleBob, 8, 6);

        this.ctx.fillRect(px + pw - 12 - legStride, py + ph - 6 + idleBob, 8, 6);
      } else {
        this.ctx.fillRect(px + 6, py + ph - 10, 6, 6);
        this.ctx.fillRect(px + pw - 12, py + ph - 10, 6, 6);
      }

      const bodyY = py + idleBob;
      if (this.selectedDraco === 'Pixelmon') {
        this.ctx.save();
        if (this.isMegaPixelmon && this.megaPixelmonScale > 1.0) {
          this.ctx.translate(px + pw / 2, py + ph);
          this.ctx.scale(this.megaPixelmonScale, this.megaPixelmonScale);
          this.ctx.translate(-(px + pw / 2), -(py + ph));
        }

        // 8-bit Pixel Legs
        this.ctx.fillStyle = accentColor;
        if (this.pGrounded) {
          this.ctx.fillRect(px + 4 + legStride, py + ph - 8 + idleBob, 8, 8);
          this.ctx.fillRect(px + pw - 12 - legStride, py + ph - 8 + idleBob, 8, 8);
        } else {
          this.ctx.fillRect(px + 6, py + ph - 10, 6, 8);
          this.ctx.fillRect(px + pw - 12, py + ph - 10, 6, 8);
        }

        // 8-bit Pixel Body
        this.ctx.fillStyle = mainColor;
        this.ctx.strokeStyle = accentColor;
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(px, bodyY + 4, pw, ph - 10);
        this.ctx.strokeRect(px, bodyY + 4, pw, ph - 10);

        // Inner Pixel Highlight Block
        this.ctx.fillStyle = bellyColor;
        this.ctx.fillRect(px + 4, bodyY + 8, pw - 8, ph - 18);

        // 8-bit Pixel Horns
        this.ctx.fillStyle = detailColor;
        if (this.pFacing === 1) {
          this.ctx.fillRect(px + 4, bodyY - 6, 6, 10);
          this.ctx.fillRect(px + pw - 12, bodyY - 8, 6, 12);
        } else {
          this.ctx.fillRect(px + 6, bodyY - 8, 6, 12);
          this.ctx.fillRect(px + pw - 10, bodyY - 6, 6, 10);
        }

        // Square 8-Bit Pixel Eyes
        const eyeX1 = this.pFacing === 1 ? px + pw - 14 : px + 6;
        const eyeX2 = this.pFacing === 1 ? px + 8 : px + pw - 12;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(eyeX1, bodyY + 10, 6, 6);
        this.ctx.fillRect(eyeX2, bodyY + 10, 6, 6);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.pFacing === 1 ? eyeX1 + 3 : eyeX1 + 1, bodyY + 11, 2, 2);
        this.ctx.fillRect(this.pFacing === 1 ? eyeX2 + 3 : eyeX2 + 1, bodyY + 11, 2, 2);

        // 8-bit Tetris Chest Core
        this.ctx.fillStyle = '#eab308';
        const coreX = px + pw / 2 - 4;
        this.ctx.fillRect(coreX - 2, bodyY + 20, 12, 4);
        this.ctx.fillRect(coreX + 2, bodyY + 24, 4, 6);

        this.ctx.restore();
      } else {
        this.ctx.fillStyle = mainColor;
        this.ctx.strokeStyle = accentColor;
        this.ctx.lineWidth = 2.5;

        this.ctx.beginPath();
        this.ctx.arc(px + pw / 2, bodyY + pw / 2, pw / 2, Math.PI, 0, false);
        this.ctx.lineTo(px + pw, bodyY + ph - 6);
        this.ctx.quadraticCurveTo(px + pw, bodyY + ph - 2, px + pw - 6, bodyY + ph - 2);
        this.ctx.lineTo(px + 6, bodyY + ph - 2);
        this.ctx.quadraticCurveTo(px, bodyY + ph - 2, px, bodyY + ph - 6);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = bellyColor;
        const bellyX = this.pFacing === 1 ? px + 8 : px + 6;
        this.ctx.beginPath();
        this.ctx.ellipse(bellyX + 8, bodyY + ph / 2 + 4, 7, 10, 0, 0, Math.PI * 2);
        this.ctx.fill();

        if (this.selectedDraco === 'Shadowmon') {
          this.ctx.save();
          const stackX = px + pw / 2;
          const stackY = bodyY + 22;

          this.ctx.fillStyle = 'rgba(24, 24, 27, 0.95)';
          this.ctx.strokeStyle = '#ef4444';
          this.ctx.lineWidth = 1.8;
          this.ctx.beginPath();
          this.ctx.arc(stackX, stackY, 11, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.stroke();

          this.ctx.font = '900 12px monospace';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillStyle = this.shadowmonStacks >= 5 ? '#fef08a' : '#ffffff';
          this.ctx.fillText(`${this.shadowmonStacks}`, stackX, stackY + 1);

          for (let s = 0; s < this.shadowmonStacks; s++) {
            const sang = (this.frameCount * 0.12) + (s * Math.PI * 2) / 5;
            const sx = stackX + Math.cos(sang) * 16;
            const sy = stackY + Math.sin(sang) * 16;
            this.ctx.fillStyle = '#ef4444';
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, 3, 0, Math.PI * 2);
            this.ctx.fill();
          }

          this.ctx.restore();
        }

        this.ctx.fillStyle = accentColor;
        this.ctx.beginPath();
        if (this.pFacing === 1) {
          this.ctx.moveTo(px + 6, bodyY);
          this.ctx.lineTo(px + 2, bodyY - 10);
          this.ctx.lineTo(px + 14, bodyY + 2);
          this.ctx.closePath();
          this.ctx.fill();

          this.ctx.beginPath();
          this.ctx.moveTo(px + pw - 14, bodyY + 2);
          this.ctx.lineTo(px + pw - 2, bodyY - 14);
          this.ctx.lineTo(px + pw - 6, bodyY);
          this.ctx.closePath();
          this.ctx.fill();
        } else {
          this.ctx.beginPath();
          this.ctx.moveTo(px + 14, bodyY + 2);
          this.ctx.lineTo(px + 2, bodyY - 14);
          this.ctx.lineTo(px + 6, bodyY);
          this.ctx.closePath();
          this.ctx.fill();

          this.ctx.beginPath();
          this.ctx.moveTo(px + pw - 6, bodyY);
          this.ctx.lineTo(px + pw - 2, bodyY - 10);
          this.ctx.lineTo(px + pw - 14, bodyY + 2);
          this.ctx.closePath();
          this.ctx.fill();
        }

        this.ctx.fillStyle = '#ffffff';
        const eyeX = this.pFacing === 1 ? px + pw - 14 : px + 6;
        this.ctx.fillRect(eyeX, bodyY + 8, 8, 9);
        this.ctx.fillStyle = '#000000';
        const pupilX = this.pFacing === 1 ? eyeX + 4 : eyeX;
        this.ctx.fillRect(pupilX, bodyY + 10, 4, 5);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(pupilX + 1, bodyY + 10, 1.5, 1.5);

        this.ctx.fillStyle = detailColor;
        const cheekX = this.pFacing === 1 ? px + pw - 8 : px + 2;
        this.ctx.fillRect(cheekX, bodyY + 20, 4, 4);
      }

      if (this.selectedDraco === 'Shieldmon' && this.shieldActive) {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(px + pw / 2, bodyY + ph / 2, pw + 8, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }

      if ((this as any).enigmonPulseActive && (this as any).enigmonPulseTimer > 0) {
        this.ctx.save();
        const pulseX = (this as any).enigmonPulseX || (this.px + this.pWidth / 2);
        const pulseY = (this as any).enigmonPulseY || (this.py + this.pHeight);
        const pTimer = (this as any).enigmonPulseTimer as number;
        const pLife = 180;
        // Fade in first 15 frames, fade out last 20
        const pAlpha = Math.min(1, Math.min(pTimer / 20, (pLife - pTimer + 1) / 15));
        const pPulse = Math.sin(this.frameCount * 0.22) * 0.10 + 0.90;
        const zoneRx = 200;
        const zoneRy = 40;

        this.ctx.setLineDash([]);

        // ── Outer gravitational haze ──────────────────────────────────────
        const hazeGrad = this.ctx.createRadialGradient(pulseX, pulseY, zoneRy * 0.3, pulseX, pulseY, zoneRx * 1.15);
        hazeGrad.addColorStop(0, `rgba(168, 85, 247, ${pAlpha * 0.22 * pPulse})`);
        hazeGrad.addColorStop(0.5, `rgba(88, 28, 135, ${pAlpha * 0.12})`);
        hazeGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
        this.ctx.fillStyle = hazeGrad;
        this.ctx.beginPath();
        this.ctx.ellipse(pulseX, pulseY, zoneRx * 1.18, zoneRy * 1.5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // ── Tidal distortion lines radiating outward ─────────────────────
        const tidalCount = 12;
        for (let t = 0; t < tidalCount; t++) {
          const baseAng = (t / tidalCount) * Math.PI * 2 + this.frameCount * 0.016;
          const innerRx = zoneRx * 0.45;
          const innerRy = zoneRy * 0.45;
          const outerRx = zoneRx * (0.90 + Math.sin(this.frameCount * 0.08 + t) * 0.08);
          const outerRy = zoneRy * (0.90 + Math.sin(this.frameCount * 0.08 + t) * 0.08);
          const lineAlpha = pAlpha * (0.08 + 0.05 * Math.sin(this.frameCount * 0.12 + t));
          this.ctx.strokeStyle = `rgba(192, 132, 252, ${lineAlpha})`;
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(pulseX + Math.cos(baseAng) * innerRx, pulseY + Math.sin(baseAng) * innerRy);
          this.ctx.lineTo(pulseX + Math.cos(baseAng) * outerRx, pulseY + Math.sin(baseAng) * outerRy);
          this.ctx.stroke();
        }

        // ── Fill — layered elliptic rings ────────────────────────────────
        const fillGrad = this.ctx.createRadialGradient(pulseX, pulseY, zoneRy * 0.1, pulseX, pulseY, zoneRx);
        fillGrad.addColorStop(0, `rgba(232, 121, 249, ${pAlpha * 0.70})`);
        fillGrad.addColorStop(0.35, `rgba(168, 85, 247, ${pAlpha * 0.45 * pPulse})`);
        fillGrad.addColorStop(0.7, `rgba(88, 28, 135, ${pAlpha * 0.25})`);
        fillGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
        this.ctx.fillStyle = fillGrad;
        this.ctx.beginPath();
        this.ctx.ellipse(pulseX, pulseY, zoneRx * pPulse, zoneRy * pPulse, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // ── Rotating elliptic arc rings ───────────────────────────────────
        const ellipseArcs = [
          { rx: zoneRx * 0.92, ry: zoneRy * 0.92, speed: 0.012, gap: 1.55, color: '#e879f9', w: 2.5 },
          { rx: zoneRx * 0.74, ry: zoneRy * 0.74, speed: -0.009, gap: 1.35, color: '#c084fc', w: 2.0 },
          { rx: zoneRx * 0.55, ry: zoneRy * 0.55, speed: 0.018, gap: 1.70, color: '#a855f7', w: 1.5 },
          { rx: zoneRx * 1.02, ry: zoneRy * 1.02, speed: -0.007, gap: 1.20, color: 'rgba(232,121,249,0.35)', w: 1.0 },
        ];
        this.ctx.globalAlpha = pAlpha;
        for (const ea of ellipseArcs) {
          const rot = this.frameCount * ea.speed;
          this.ctx.save();
          this.ctx.translate(pulseX, pulseY);
          this.ctx.rotate(rot);
          this.ctx.strokeStyle = ea.color;
          this.ctx.lineWidth = ea.w;
          this.ctx.shadowColor = ea.color;
          this.ctx.shadowBlur = 6;
          this.ctx.beginPath();
          this.ctx.ellipse(0, 0, ea.rx * pPulse, ea.ry * pPulse, 0, 0, Math.PI * ea.gap);
          this.ctx.stroke();
          this.ctx.beginPath();
          this.ctx.ellipse(0, 0, ea.rx * pPulse, ea.ry * pPulse, 0, Math.PI, Math.PI + Math.PI * (2 - ea.gap) * 0.75);
          this.ctx.stroke();
          this.ctx.restore();
        }
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;

        // ── Inner singularity orb ─────────────────────────────────────────
        const orbGrad = this.ctx.createRadialGradient(pulseX, pulseY, 1, pulseX, pulseY, zoneRy * 0.75 * pPulse);
        orbGrad.addColorStop(0, `rgba(255, 255, 255, ${pAlpha * 0.90})`);
        orbGrad.addColorStop(0.3, `rgba(232, 121, 249, ${pAlpha * 0.75})`);
        orbGrad.addColorStop(0.7, `rgba(88, 28, 135, ${pAlpha * 0.40})`);
        orbGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
        this.ctx.fillStyle = orbGrad;
        this.ctx.beginPath();
        this.ctx.arc(pulseX, pulseY, zoneRy * 0.75 * pPulse, 0, Math.PI * 2);
        this.ctx.fill();

        // ── Pulse ripple ring on damage tick (every 60 frames) ────────────
        const tickMod = pTimer % 60;
        if (tickMod > 53) {
          const rProg = (tickMod - 53) / 7;
          const rippleRx = zoneRx * rProg;
          const rippleRy = zoneRy * rProg;
          const rippleAlpha = pAlpha * (1 - rProg) * 0.9;
          this.ctx.strokeStyle = `rgba(232, 121, 249, ${rippleAlpha})`;
          this.ctx.lineWidth = 3.5 - rProg * 2.5;
          this.ctx.beginPath();
          this.ctx.ellipse(pulseX, pulseY, Math.max(1, rippleRx), Math.max(1, rippleRy), 0, 0, Math.PI * 2);
          this.ctx.stroke();
        }

        // ── Continuous spiral particles (spawned here for visual only) ────
        if (this.frameCount % 5 === 0) {
          const sAng = this.frameCount * 0.25;
          for (let arm = 0; arm < 2; arm++) {
            const armAng = sAng + arm * Math.PI;
            const sRx = zoneRx * 0.85;
            const sRy = zoneRy * 0.85;
            this.particles.push({
              x: pulseX + Math.cos(armAng) * sRx,
              y: pulseY + Math.sin(armAng) * sRy,
              vx: -Math.cos(armAng) * 3.5 - Math.sin(armAng) * 1.5,
              vy: -Math.sin(armAng) * 3.5 * 0.2 + Math.cos(armAng) * 0.8,
              size: Math.random() * 4 + 2,
              color: arm === 0 ? '#e879f9' : '#c084fc',
              life: 14,
              maxLife: 14
            });
          }
        }

        this.ctx.restore();
      }

      if ((this as any).enigmonBlackHoleActive && (this as any).enigmonBlackHoleTimer > 0) {
        this.ctx.save();
        const bhX = (this as any).enigmonBlackHoleX || (this.px + this.pFacing * 400);
        const bhY = (this as any).enigmonBlackHoleY || (this.py + this.pHeight / 2);
        const coreRadius = 38;
        const pullRadius = 450;
        const bhTimer = (this as any).enigmonBlackHoleTimer as number;
        const bhLife = 240;
        // Fade-in on first 18 frames, fade-out on last 24
        const lifeAlpha = Math.min(1, Math.min(bhTimer / 24, (bhLife - bhTimer + 1) / 18));
        const pulse = Math.sin(this.frameCount * 0.18) * 0.12 + 0.88;

        this.ctx.setLineDash([]);

        // ── Hawking radiation outer glow haze ──────────────────────────────
        const hazeGrad = this.ctx.createRadialGradient(bhX, bhY, coreRadius * 1.2, bhX, bhY, pullRadius * 1.15);
        hazeGrad.addColorStop(0, `rgba(232, 121, 249, ${lifeAlpha * 0.18 * pulse})`);
        hazeGrad.addColorStop(0.5, `rgba(88, 28, 135, ${lifeAlpha * 0.10})`);
        hazeGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
        this.ctx.fillStyle = hazeGrad;
        this.ctx.beginPath();
        this.ctx.arc(bhX, bhY, pullRadius * 1.15, 0, Math.PI * 2);
        this.ctx.fill();

        // ── Gravitational lensing distortion rays ─────────────────────────
        const rayCount = 14;
        for (let r = 0; r < rayCount; r++) {
          const rayAng = (r / rayCount) * Math.PI * 2 + this.frameCount * 0.012;
          const rayLen = pullRadius * (0.55 + Math.sin(this.frameCount * 0.07 + r * 0.9) * 0.18);
          const innerR = coreRadius * 1.55;
          this.ctx.strokeStyle = `rgba(192, 132, 252, ${lifeAlpha * (0.06 + 0.04 * Math.sin(this.frameCount * 0.1 + r))})`;
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(bhX + Math.cos(rayAng) * innerR, bhY + Math.sin(rayAng) * innerR * 0.7);
          this.ctx.lineTo(bhX + Math.cos(rayAng) * (innerR + rayLen), bhY + Math.sin(rayAng) * (innerR + rayLen) * 0.7);
          this.ctx.stroke();
        }

        // ── Gravity well dark gradient ─────────────────────────────────────
        const wellGrad = this.ctx.createRadialGradient(bhX, bhY, coreRadius, bhX, bhY, pullRadius);
        wellGrad.addColorStop(0, `rgba(0, 0, 0, ${lifeAlpha * 0.92})`);
        wellGrad.addColorStop(0.35, `rgba(20, 4, 44, ${lifeAlpha * 0.70})`);
        wellGrad.addColorStop(0.65, `rgba(59, 7, 100, ${lifeAlpha * 0.38})`);
        wellGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
        this.ctx.fillStyle = wellGrad;
        this.ctx.beginPath();
        this.ctx.arc(bhX, bhY, pullRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // ── Accretion disk (tilted ellipse with hot gradient) ──────────────
        this.ctx.save();
        const diskR = coreRadius * 2.4 * pulse;
        const diskGrad = this.ctx.createLinearGradient(bhX - diskR, bhY, bhX + diskR, bhY);
        diskGrad.addColorStop(0, `rgba(232, 121, 249, ${lifeAlpha * 0.0})`);
        diskGrad.addColorStop(0.2, `rgba(232, 121, 249, ${lifeAlpha * 0.75})`);
        diskGrad.addColorStop(0.38, `rgba(255, 220, 255, ${lifeAlpha * 0.95})`);
        diskGrad.addColorStop(0.5, `rgba(192, 132, 252, ${lifeAlpha * 0.70})`);
        diskGrad.addColorStop(0.62, `rgba(255, 220, 255, ${lifeAlpha * 0.95})`);
        diskGrad.addColorStop(0.8, `rgba(232, 121, 249, ${lifeAlpha * 0.75})`);
        diskGrad.addColorStop(1, `rgba(232, 121, 249, ${lifeAlpha * 0.0})`);
        this.ctx.fillStyle = diskGrad;
        this.ctx.beginPath();
        this.ctx.ellipse(bhX, bhY, diskR, diskR * 0.18, this.frameCount * 0.005, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // ── Event horizon — pure black void ──────────────────────────────
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(bhX, bhY, coreRadius * pulse, 0, Math.PI * 2);
        this.ctx.fill();

        // ── Photon sphere — layered arcs ──────────────────────────────────
        const arcConfigs = [
          { r: coreRadius + 4, speed: 0.13, gap: 1.55, color: '#e879f9', width: 3.5 },
          { r: coreRadius + 11, speed: -0.09, gap: 1.35, color: '#c084fc', width: 2.5 },
          { r: coreRadius + 19, speed: 0.07, gap: 1.6, color: '#a855f7', width: 2.0 },
          { r: coreRadius + 27, speed: -0.05, gap: 1.8, color: 'rgba(232,121,249,0.5)', width: 1.5 },
        ];
        this.ctx.globalAlpha = lifeAlpha;
        for (const arc of arcConfigs) {
          const a0 = this.frameCount * arc.speed;
          this.ctx.strokeStyle = arc.color;
          this.ctx.lineWidth = arc.width;
          this.ctx.shadowColor = arc.color;
          this.ctx.shadowBlur = 8;
          this.ctx.beginPath();
          this.ctx.arc(bhX, bhY, arc.r * pulse, a0, a0 + Math.PI * arc.gap);
          this.ctx.stroke();
          this.ctx.beginPath();
          this.ctx.arc(bhX, bhY, arc.r * pulse, a0 + Math.PI, a0 + Math.PI + Math.PI * (2 - arc.gap) * 0.8);
          this.ctx.stroke();
        }
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;

        // ── Gravitational wave pulse ring every 30 frames ─────────────────
        const bhTimerMod = bhTimer % 30;
        if (bhTimerMod > 24) {
          const rippleProg = (bhTimerMod - 24) / 6;
          const rippleR = coreRadius + rippleProg * pullRadius;
          const rippleAlpha = lifeAlpha * (1 - rippleProg) * 0.7;
          this.ctx.strokeStyle = `rgba(232, 121, 249, ${rippleAlpha})`;
          this.ctx.lineWidth = 3 - rippleProg * 2;
          this.ctx.beginPath();
          this.ctx.arc(bhX, bhY, rippleR, 0, Math.PI * 2);
          this.ctx.stroke();
        }



        this.ctx.restore();
      }

      if (this.isChanneling && this.channelingTimer > 0) {
        this.ctx.save();
        const cx = this.px + this.pWidth / 2;
        const cy = this.py - 38;
        const barW = 80;
        const barH = 8;
        const barX = cx - barW / 2;
        const pct = Math.max(0, this.channelingTimer / this.channelingMaxDuration);

        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        this.ctx.fillRect(barX, cy, barW, barH);

        const barGrad = this.ctx.createLinearGradient(barX, cy, barX + barW, cy);
        barGrad.addColorStop(0, '#c084fc');
        barGrad.addColorStop(1, '#e879f9');
        this.ctx.fillStyle = barGrad;
        this.ctx.fillRect(barX, cy, barW * pct, barH);

        this.ctx.strokeStyle = '#e879f9';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(barX, cy, barW, barH);

        this.ctx.font = 'bold 9px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#fef08a';
        this.ctx.shadowColor = '#c084fc';
        this.ctx.shadowBlur = 6;
        this.ctx.fillText('CHANNELING (MOVE TO CANCEL) 🕳️', cx, cy - 6);

        if (this.channelingSpell === 'black_hole') {
          const bhX = (this as any).enigmonBlackHoleX;
          const bhY = (this as any).enigmonBlackHoleY;
          if (bhX !== undefined && bhY !== undefined) {
            if (this.frameCount % 3 === 0) {
              const t = (this.frameCount % 30) / 30;
              const px = (1 - t) * cx + t * bhX;
              const py = (1 - t) * (this.py + this.pHeight / 2) + t * bhY + Math.sin(t * Math.PI) * -15;
              this.particles.push({
                x: px,
                y: py,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: Math.random() * 5 + 2,
                color: '#e879f9',
                life: 15,
                maxLife: 15
              });
            }
          }
        }
        this.ctx.restore();
      }

      if (this.isAttacking && this.attackDuration > 0) {
        const maxDuration = 10;
        const progress = Math.max(0, Math.min(1, 1 - (this.attackDuration / maxDuration)));

        const swingAngleDeg = -75 + (progress * 160);
        const swingRad = (swingAngleDeg * Math.PI) / 180;

        const shoulderX = px + (this.pFacing === 1 ? pw - 4 : 4);
        const shoulderY = bodyY + 18;

        this.ctx.save();
        this.ctx.translate(shoulderX, shoulderY);
        this.ctx.scale(this.pFacing, 1);
        this.ctx.rotate(swingRad);

        if (this.selectedDraco === 'Archermon') {
          this.ctx.strokeStyle = '#34d399';
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 24, -0.6, 0.6);
          this.ctx.stroke();

          this.ctx.fillStyle = 'rgba(52, 211, 153, 0.35)';
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 32, -0.8, 0.2);
          this.ctx.lineTo(0, 0);
          this.ctx.closePath();
          this.ctx.fill();
        } else if (this.selectedDraco === 'Shieldmon') {
          this.ctx.fillStyle = '#60a5fa';
          this.ctx.strokeStyle = '#1d4ed8';
          this.ctx.lineWidth = 2.5;
          this.ctx.fillRect(4, -14, 12, 28);
          this.ctx.strokeRect(4, -14, 12, 28);

          this.ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
          this.ctx.lineWidth = 4;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 28, -0.5, 0.5);
          this.ctx.stroke();
        } else if (this.selectedDraco === 'Assassinmon') {
          this.ctx.fillStyle = '#1e1b4b';
          this.ctx.fillRect(0, -3, 10, 6);
          this.ctx.fillStyle = '#c084fc';
          this.ctx.fillRect(2, -3, 2, 6);
          this.ctx.fillRect(6, -3, 2, 6);

          this.ctx.fillStyle = '#f59e0b';
          this.ctx.fillRect(10, -7, 3, 14);

          this.ctx.fillStyle = '#e2e8f0';
          this.ctx.strokeStyle = '#c084fc';
          this.ctx.lineWidth = 1.5;

          this.ctx.beginPath();
          this.ctx.moveTo(13, -3);
          this.ctx.lineTo(40, -4);
          this.ctx.lineTo(46, 0);
          this.ctx.lineTo(38, 3);
          this.ctx.lineTo(13, 3);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();

          this.ctx.fillStyle = '#ffffff';
          this.ctx.beginPath();
          this.ctx.moveTo(14, -1);
          this.ctx.lineTo(42, -2);
          this.ctx.lineTo(44, 0);
          this.ctx.lineTo(14, 1);
          this.ctx.closePath();
          this.ctx.fill();

          this.ctx.save();
          this.ctx.rotate(-swingRad * 0.4);

          const grad = this.ctx.createRadialGradient(0, 0, 12, 0, 0, 50);
          grad.addColorStop(0, 'rgba(192, 132, 252, 0.9)');
          grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.5)');
          grad.addColorStop(1, 'rgba(168, 85, 247, 0)');

          this.ctx.fillStyle = grad;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 52, -1.1, 0.5);
          this.ctx.lineTo(12, 0);
          this.ctx.closePath();
          this.ctx.fill();

          this.ctx.strokeStyle = '#ffffff';
          this.ctx.lineWidth = 2.5;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 50, -1.0, 0.4);
          this.ctx.stroke();

          this.ctx.restore();
        } else if (this.selectedDraco === 'Flymon') {
          this.ctx.strokeStyle = '#fda4af';
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 26, -0.5, 0.5);
          this.ctx.stroke();

          this.ctx.fillStyle = 'rgba(251, 113, 133, 0.25)';
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 30, -0.7, 0.3);
          this.ctx.lineTo(0, 0);
          this.ctx.closePath();
          this.ctx.fill();
        } else {
          this.ctx.fillStyle = '#78350f';
          this.ctx.fillRect(0, -3, 8, 6);
          this.ctx.fillStyle = '#fbbf24';
          this.ctx.fillRect(8, -8, 4, 16);
          this.ctx.fillStyle = '#f59e0b';
          this.ctx.strokeStyle = '#d97706';
          this.ctx.lineWidth = 1.5;

          this.ctx.beginPath();
          this.ctx.moveTo(12, -4);
          this.ctx.lineTo(32, -2);
          this.ctx.lineTo(38, 0);
          this.ctx.lineTo(32, 2);
          this.ctx.lineTo(12, 4);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();

          this.ctx.fillStyle = '#fef08a';
          this.ctx.fillRect(14, -1, 18, 2);

          this.ctx.save();
          this.ctx.rotate(-swingRad * 0.4);
          const grad = this.ctx.createRadialGradient(0, 0, 10, 0, 0, 42);
          grad.addColorStop(0, 'rgba(251, 191, 36, 0.85)');
          grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.45)');
          grad.addColorStop(1, 'rgba(251, 191, 36, 0)');

          this.ctx.fillStyle = grad;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 42, -1.0, 0.4);
          this.ctx.lineTo(10, 0);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.restore();
        }

        this.ctx.restore();
      } else {
        const handX = px + (this.pFacing === 1 ? pw - 4 : 4);
        const handY = bodyY + 20;

        this.ctx.save();
        this.ctx.translate(handX, handY);
        this.ctx.scale(this.pFacing, 1);

        if (this.selectedDraco === 'Archermon') {
          this.ctx.strokeStyle = '#ca8a04';
          this.ctx.lineWidth = 2.5;
          this.ctx.beginPath();
          this.ctx.arc(6, 0, 10, -Math.PI / 2, Math.PI / 2);
          this.ctx.stroke();
        } else if (this.selectedDraco === 'Shieldmon') {
          this.ctx.fillStyle = '#475569';
          this.ctx.strokeStyle = '#1e293b';
          this.ctx.lineWidth = 2;
          this.ctx.fillRect(2, -12, 10, 24);
          this.ctx.strokeRect(2, -12, 10, 24);
        } else if (this.selectedDraco === 'Assassinmon') {
          if (this.assassinmonDashActive) {
            this.ctx.fillStyle = '#1e1b4b';
            this.ctx.fillRect(0, -3, 8, 6);
            this.ctx.fillStyle = '#f59e0b';
            this.ctx.fillRect(8, -6, 2, 12);

            this.ctx.fillStyle = '#e2e8f0';
            this.ctx.strokeStyle = '#c084fc';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(10, -2);
            this.ctx.lineTo(38, -3);
            this.ctx.lineTo(44, 0);
            this.ctx.lineTo(38, 3);
            this.ctx.lineTo(10, 2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(12, -1, 28, 2);

            this.ctx.fillStyle = 'rgba(232, 121, 249, 0.45)';
            this.ctx.beginPath();
            this.ctx.moveTo(44, 0);
            this.ctx.lineTo(58, -12);
            this.ctx.lineTo(58, 12);
            this.ctx.closePath();
            this.ctx.fill();
          } else {
            this.ctx.fillStyle = '#1e1b4b';
            this.ctx.fillRect(0, -3, 8, 6);
            this.ctx.fillStyle = '#c084fc';
            this.ctx.fillRect(2, -3, 2, 6);
            this.ctx.fillRect(5, -3, 2, 6);

            this.ctx.fillStyle = '#f59e0b';
            this.ctx.fillRect(8, -6, 2, 12);

            this.ctx.fillStyle = '#4c1d95';
            this.ctx.strokeStyle = '#312e81';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(10, -2);
            this.ctx.lineTo(24, 6);
            this.ctx.lineTo(22, 9);
            this.ctx.lineTo(10, 2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
          }
        } else if (this.selectedDraco === 'Flymon') {
          this.ctx.fillStyle = '#f43f5e';
          this.ctx.strokeStyle = '#881337';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(1, -3);
          this.ctx.lineTo(9, 0);
          this.ctx.lineTo(1, 3);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();
        } else {
          this.ctx.fillStyle = '#f59e0b';
          this.ctx.strokeStyle = '#b45309';
          this.ctx.lineWidth = 1.5;
          this.ctx.fillRect(2, -2, 14, 4);
        }

        this.ctx.restore();
      }

      this.ctx.restore();
    }

    if (this.jumpmonMeteorState === 'impact' && this.jumpmonImpactTimer > 0) {
      const radius = (30 - this.jumpmonImpactTimer) * 15;
      const alpha = this.jumpmonImpactTimer / 30;

      this.ctx.save();

      this.ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
      this.ctx.lineWidth = 18;
      this.ctx.beginPath();
      this.ctx.arc(this.jumpmonImpactX, this.jumpmonImpactY, radius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      this.ctx.lineWidth = 6;
      this.ctx.beginPath();
      this.ctx.arc(this.jumpmonImpactX, this.jumpmonImpactY, radius * 0.85, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    if (this.selectedDraco === 'Shieldmon' && this.avatarActive) {
      const centerX = this.px + this.pWidth / 2;
      const centerY = this.py + this.pHeight / 2;
      const radius = 160 + Math.sin(this.frameCount * 0.1) * 8;

      this.ctx.save();

      const domeGrad = this.ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
      domeGrad.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
      domeGrad.addColorStop(0.7, 'rgba(96, 165, 250, 0.2)');
      domeGrad.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

      this.ctx.fillStyle = domeGrad;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#60a5fa';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([12, 8]);
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius - 8, this.frameCount * 0.05, Math.PI * 2 + this.frameCount * 0.05);
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.groundBurnZones.forEach(zone => {
      this.ctx.save();
      const alpha = Math.min(1.0, zone.timer / 20);
      this.ctx.globalAlpha = alpha;

      const isElectric = (zone as any).isElectric;

      if (isElectric) {
        const elecGrad = this.ctx.createLinearGradient(zone.x, zone.y - 8, zone.x, zone.y + 6);
        elecGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        elecGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.85)');
        elecGrad.addColorStop(1, 'rgba(250, 204, 21, 0.0)');

        this.ctx.fillStyle = elecGrad;
        this.ctx.fillRect(zone.x, zone.y - 4, zone.width, 8);

        const numArcs = Math.floor(zone.width / 12);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        for (let a = 0; a < numArcs; a++) {
          const ax = zone.x + a * 12 + 6;
          const ah = 8 + Math.sin(this.frameCount * 0.6 + a * 2) * 5;

          this.ctx.beginPath();
          this.ctx.moveTo(ax - 6, zone.y + 2);
          this.ctx.lineTo(ax, zone.y - ah);
          this.ctx.lineTo(ax + 6, zone.y + 2);
          this.ctx.stroke();
        }
      } else {
        const burnGrad = this.ctx.createLinearGradient(zone.x, zone.y - 8, zone.x, zone.y + 6);
        burnGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        burnGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.75)');
        burnGrad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

        this.ctx.fillStyle = burnGrad;
        this.ctx.fillRect(zone.x, zone.y - 4, zone.width, 8);

        const numFlames = Math.floor(zone.width / 10);
        for (let f = 0; f < numFlames; f++) {
          const fx = zone.x + f * 10 + 5;
          const fh = 10 + Math.sin(this.frameCount * 0.4 + f * 1.5) * 6;

          this.ctx.fillStyle = f % 2 === 0 ? '#f97316' : '#fef08a';
          this.ctx.beginPath();
          this.ctx.moveTo(fx - 5, zone.y + 2);
          this.ctx.lineTo(fx, zone.y - fh);
          this.ctx.lineTo(fx + 5, zone.y + 2);
          this.ctx.closePath();
          this.ctx.fill();
        }
      }

      this.ctx.restore();
    });

    if (this.thundermonDashActive) {
      this.ctx.save();
      this.thundermonDashTrail.forEach((trail, idx) => {
        const trailAlpha = ((idx + 1) / Math.max(1, this.thundermonDashTrail.length)) * 0.65;
        this.ctx.save();
        this.ctx.globalAlpha = trailAlpha;

        this.ctx.fillStyle = '#06b6d4';
        this.ctx.fillRect(trail.x, trail.y, this.pWidth, this.pHeight);

        this.ctx.strokeStyle = '#facc15';
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeRect(trail.x - 2, trail.y - 2, this.pWidth + 4, this.pHeight + 4);

        const ang = this.frameCount * 0.4 + idx * 0.8;
        const lx = trail.x + this.pWidth / 2 + Math.cos(ang) * 24;
        const ly = trail.y + this.pHeight / 2 + Math.sin(ang) * 24;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(trail.x + this.pWidth / 2, trail.y + this.pHeight / 2);
        this.ctx.lineTo((trail.x + lx) / 2 + (Math.random() - 0.5) * 12, (trail.y + ly) / 2 + (Math.random() - 0.5) * 12);
        this.ctx.lineTo(lx, ly);
        this.ctx.stroke();

        this.ctx.restore();
      });
      this.ctx.restore();
    }

    if (this.thundermonUltActive) {
      this.ctx.save();

      // Celestial Storm Vortex Background Flash
      if (this.thundermonUltTimer > 45) {
        const flashAlpha = (this.thundermonUltTimer - 45) / 15;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.7})`;
        this.ctx.fillRect(this.cameraX - 100, this.cameraY - 100, (this.canvas.width || 800) + 200, (this.canvas.height || 600) + 200);
      } else if (this.frameCount % 4 === 0 || this.frameCount % 4 === 1) {
        this.ctx.fillStyle = 'rgba(6, 182, 212, 0.22)';
        this.ctx.fillRect(this.cameraX - 100, this.cameraY - 100, (this.canvas.width || 800) + 200, (this.canvas.height || 600) + 200);
      }

      // Sky Storm Vortex Cloud Ring
      const skyVortexX = this.px + this.pWidth / 2;
      const skyVortexY = Math.max(0, this.cameraY - 120);
      const vortexGrad = this.ctx.createRadialGradient(skyVortexX, skyVortexY, 20, skyVortexX, skyVortexY, 400);
      vortexGrad.addColorStop(0, 'rgba(250, 204, 21, 0.45)');
      vortexGrad.addColorStop(0.3, 'rgba(6, 182, 212, 0.35)');
      vortexGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.6)');
      vortexGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      this.ctx.fillStyle = vortexGrad;
      this.ctx.beginPath();
      this.ctx.arc(skyVortexX, skyVortexY, 400, 0, Math.PI * 2);
      this.ctx.fill();

      const playerCenterX = this.px + this.pWidth / 2;
      const playerCenterY = this.py + this.pHeight / 2;

      this.enemies.forEach((enemy, idx) => {
        if (enemy.hp <= 0 && !enemy.isBonePile) return;
        const enemyX = enemy.x + enemy.width / 2;
        const enemyY = enemy.y + enemy.height / 2;
        const dist = Math.hypot(enemyX - playerCenterX, enemyY - playerCenterY);

        if (dist <= 800) {
          const skyY = Math.max(0, this.cameraY - 300);
          this.ctx.save();

          // ── Layer 1: Celestial Outer Plasma Aura (60px wide) ─────────────
          this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.32)';
          this.ctx.lineWidth = 60;
          this.ctx.lineCap = 'round';
          this.ctx.beginPath();
          this.ctx.moveTo(enemyX, skyY);
          this.ctx.lineTo(enemyX, enemyY);
          this.ctx.stroke();

          // ── Layer 2: Mid Electric Gold Lightning Pillar (28px wide) ──────
          this.ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
          this.ctx.lineWidth = 28;
          this.ctx.beginPath();
          this.ctx.moveTo(enemyX, skyY);

          const segments = 8;
          const totalY = enemyY - skyY;
          const segH = totalY / segments;

          for (let s = 1; s <= segments; s++) {
            const segY = skyY + s * segH;
            const jitter = (Math.sin(this.frameCount * 0.5 + s * 2.3 + idx) * 22) * (1 - (s / segments) * 0.3);
            this.ctx.lineTo(enemyX + jitter, segY);
          }
          this.ctx.stroke();

          // ── Layer 3: Blinding White Core Lightning Bolt (8px wide) ────────
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 1.0)';
          this.ctx.lineWidth = 8;
          this.ctx.beginPath();
          this.ctx.moveTo(enemyX, skyY);
          for (let s = 1; s <= segments; s++) {
            const segY = skyY + s * segH;
            const jitter = (Math.sin(this.frameCount * 0.5 + s * 2.3 + idx) * 14) * (1 - (s / segments) * 0.3);
            this.ctx.lineTo(enemyX + jitter, segY);
          }
          this.ctx.stroke();

          // ── Layer 4: Electric Tesla Orbit Arcs ─────────────────────────────
          for (let a = 0; a < 6; a++) {
            const arcAngle = (this.frameCount * 0.4 + a * Math.PI / 3);
            const arcR = 24 + Math.sin(this.frameCount * 0.6 + a) * 10;
            const ax = enemyX + Math.cos(arcAngle) * arcR;
            const ay = enemyY + Math.sin(arcAngle) * arcR;

            this.ctx.strokeStyle = a % 2 === 0 ? '#fef08a' : '#38bdf8';
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.moveTo(enemyX, enemyY);
            const midX = (enemyX + ax) / 2 + (Math.random() - 0.5) * 16;
            const midY = (enemyY + ay) / 2 + (Math.random() - 0.5) * 16;
            this.ctx.lineTo(midX, midY);
            this.ctx.lineTo(ax, ay);
            this.ctx.stroke();
          }

          // ── Layer 5: Target Disintegration Flash ──────────────────────────
          if (this.frameCount % 4 < 2) {
            this.ctx.fillStyle = 'rgba(234, 179, 8, 0.7)';
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            this.ctx.fillRect(enemyX - 1, enemy.y + 4, 2, enemy.height - 8);
            this.ctx.fillRect(enemy.x + 4, enemyY - 2, enemy.width - 8, 3);
          }

          // ── Layer 6: Ground Terminal Crater & Expanding Shockwaves ───────
          const craterGrad = this.ctx.createRadialGradient(enemyX, enemyY, 6, enemyX, enemyY, 65);
          craterGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          craterGrad.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)');
          craterGrad.addColorStop(0.65, 'rgba(250, 204, 21, 0.4)');
          craterGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          this.ctx.fillStyle = craterGrad;
          this.ctx.beginPath();
          this.ctx.arc(enemyX, enemyY, 65, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.restore();
        }
      });

      this.ctx.restore();
    }

    if (this.carpetBombingActive) {
      this.ctx.save();
      const bx = this.px + this.pWidth / 2;
      const by = this.py + this.pHeight / 2;
      const churn = this.frameCount * 0.16;

      if (this.carpetBombingChannelTimer > 0) {
        // ── CHARGE PHASE: Inferno Vortex Charging ─────────────────────────
        const chargeProgress = 1 - (this.carpetBombingChannelTimer / 35);
        const pulse = Math.sin(this.frameCount * 0.4) * 0.12 + 0.88;

        // Wide heat shimmer outer glow
        const heatGrad = this.ctx.createRadialGradient(bx, by, 10, bx, by, 75 * pulse);
        heatGrad.addColorStop(0, `rgba(255, 200, 50, ${0.55 * chargeProgress})`);
        heatGrad.addColorStop(0.4, `rgba(249, 115, 22, ${0.45 * chargeProgress})`);
        heatGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        this.ctx.fillStyle = heatGrad;
        this.ctx.beginPath();
        this.ctx.arc(bx, by, 75 * pulse, 0, Math.PI * 2);
        this.ctx.fill();

        // Rotating fire vortex arms
        const armCount = 6;
        for (let arm = 0; arm < armCount; arm++) {
          const ang = churn * 0.5 + arm * (Math.PI * 2 / armCount);
          const r1 = (20 + chargeProgress * 18) * pulse;
          const r2 = (40 + chargeProgress * 30) * pulse;
          const x1 = bx + Math.cos(ang) * r1;
          const y1 = by + Math.sin(ang) * r1 * 0.7;
          const x2 = bx + Math.cos(ang + 0.5) * r2;
          const y2 = by + Math.sin(ang + 0.5) * r2 * 0.7;
          this.ctx.strokeStyle = arm % 2 === 0
            ? `rgba(249, 115, 22, ${0.85 * chargeProgress * pulse})`
            : `rgba(254, 240, 138, ${0.7 * chargeProgress * pulse})`;
          this.ctx.lineWidth = 3 + chargeProgress * 3;
          this.ctx.lineCap = 'round';
          this.ctx.beginPath();
          this.ctx.moveTo(bx, by);
          this.ctx.quadraticCurveTo(x1, y1, x2, y2);
          this.ctx.stroke();
        }

        // Hot inner white core
        const coreGrad = this.ctx.createRadialGradient(bx, by, 2, bx, by, 18 * pulse);
        coreGrad.addColorStop(0, `rgba(255, 255, 255, ${chargeProgress})`);
        coreGrad.addColorStop(0.4, `rgba(254, 215, 0, ${0.8 * chargeProgress})`);
        coreGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
        this.ctx.fillStyle = coreGrad;
        this.ctx.beginPath();
        this.ctx.arc(bx, by, 18 * pulse, 0, Math.PI * 2);
        this.ctx.fill();

      } else {
        // ── ACTIVE PHASE: Carpet Bombing Inferno ───────────────────────────
        const rad = Math.max(40, this.carpetBombingSpreadRadius);
        const timeLeft = this.carpetBombingTimer / 120;
        const pulse = Math.sin(this.frameCount * 0.28) * 0.1 + 0.9;

        // 1. Hellfire sky aura above Bombamon
        const skyAuraGrad = this.ctx.createRadialGradient(bx, by - 20, 10, bx, by - 20, 120);
        skyAuraGrad.addColorStop(0, `rgba(255, 180, 20, ${0.55 * pulse})`);
        skyAuraGrad.addColorStop(0.4, `rgba(239, 68, 68, ${0.35 * pulse})`);
        skyAuraGrad.addColorStop(1, 'rgba(120, 20, 0, 0)');
        this.ctx.fillStyle = skyAuraGrad;
        this.ctx.beginPath();
        this.ctx.arc(bx, by - 20, 120, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Left fire stream cone
        const leftStreamGrad = this.ctx.createLinearGradient(bx, by, bx - rad * 1.1, by + 380);
        leftStreamGrad.addColorStop(0, `rgba(255, 240, 100, ${0.92 * pulse})`);
        leftStreamGrad.addColorStop(0.2, `rgba(249, 115, 22, ${0.85})`);
        leftStreamGrad.addColorStop(0.6, `rgba(220, 38, 38, ${0.7})`);
        leftStreamGrad.addColorStop(1, 'rgba(120, 10, 0, 0)');
        this.ctx.fillStyle = leftStreamGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(bx - 10, by + 10);
        this.ctx.bezierCurveTo(
          bx - rad * 0.3 + Math.sin(churn) * 12, by + 120,
          bx - rad * 0.7 + Math.sin(churn + 1) * 14, by + 240,
          bx - rad * 1.1 + Math.sin(churn * 0.7) * 18, by + 380
        );
        this.ctx.lineTo(bx - rad * 0.9 + Math.sin(churn * 0.7) * 14, by + 380);
        this.ctx.bezierCurveTo(
          bx - rad * 0.5 + Math.sin(churn + 1.5) * 10, by + 240,
          bx - rad * 0.2 + Math.sin(churn + 0.5) * 8, by + 120,
          bx + 10, by + 10
        );
        this.ctx.closePath();
        this.ctx.fill();

        // 3. Right fire stream cone
        const rightStreamGrad = this.ctx.createLinearGradient(bx, by, bx + rad * 1.1, by + 380);
        rightStreamGrad.addColorStop(0, `rgba(255, 240, 100, ${0.92 * pulse})`);
        rightStreamGrad.addColorStop(0.2, `rgba(249, 115, 22, ${0.85})`);
        rightStreamGrad.addColorStop(0.6, `rgba(220, 38, 38, ${0.7})`);
        rightStreamGrad.addColorStop(1, 'rgba(120, 10, 0, 0)');
        this.ctx.fillStyle = rightStreamGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(bx + 10, by + 10);
        this.ctx.bezierCurveTo(
          bx + rad * 0.3 + Math.sin(churn + 2) * 12, by + 120,
          bx + rad * 0.7 + Math.sin(churn + 3) * 14, by + 240,
          bx + rad * 1.1 + Math.sin(churn * 0.8) * 18, by + 380
        );
        this.ctx.lineTo(bx + rad * 0.9 + Math.sin(churn * 0.8) * 14, by + 380);
        this.ctx.bezierCurveTo(
          bx + rad * 0.5 + Math.sin(churn + 2.5) * 10, by + 240,
          bx + rad * 0.2 + Math.sin(churn + 2) * 8, by + 120,
          bx - 10, by + 10
        );
        this.ctx.closePath();
        this.ctx.fill();

        // 4. Center downpour streak
        const centerGrad = this.ctx.createLinearGradient(bx, by, bx, by + 340);
        centerGrad.addColorStop(0, `rgba(255, 255, 200, ${0.95 * pulse})`);
        centerGrad.addColorStop(0.25, `rgba(249, 115, 22, 0.9)`);
        centerGrad.addColorStop(0.7, `rgba(239, 68, 68, 0.7)`);
        centerGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        this.ctx.fillStyle = centerGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(bx - 12, by + 10);
        this.ctx.lineTo(bx + 12, by + 10);
        this.ctx.lineTo(bx + 8 + Math.sin(churn * 1.2) * 10, by + 340);
        this.ctx.lineTo(bx - 8 + Math.sin(churn * 1.2) * 10, by + 340);
        this.ctx.closePath();
        this.ctx.fill();

        // 5. Cascading ember sparks along the stream edges
        for (let e = 0; e < 6; e++) {
          const emberT = ((churn * 1.8 + e * 1.1) % 1.0);
          const side = e % 2 === 0 ? -1 : 1;
          const ex2 = bx + side * (rad * 0.8 * emberT + Math.sin(churn + e) * 15);
          const ey2 = by + 20 + emberT * 320;
          const emberR = 3 + Math.sin(churn * 2 + e) * 2;
          this.ctx.fillStyle = e % 3 === 0 ? '#fef08a' : e % 3 === 1 ? '#f97316' : '#ef4444';
          this.ctx.beginPath();
          this.ctx.arc(ex2, ey2, emberR, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // 6. Impact explosion craters at ground drop points
        const centerPointX = this.carpetBombingStartX + this.pWidth / 2;
        const dropPoints = [centerPointX - rad, centerPointX, centerPointX + rad];
        dropPoints.forEach((dropX, di) => {
          const impactY = by + 370;
          const impactPulse = Math.sin(this.frameCount * 0.35 + di * 1.5) * 0.15 + 0.85;
          const impactR = (28 + di * 8) * impactPulse;

          const impactGrad = this.ctx.createRadialGradient(dropX, impactY, 4, dropX, impactY, impactR);
          impactGrad.addColorStop(0, `rgba(255, 255, 200, 0.95)`);
          impactGrad.addColorStop(0.3, `rgba(249, 115, 22, 0.8)`);
          impactGrad.addColorStop(0.7, `rgba(239, 68, 68, 0.4)`);
          impactGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          this.ctx.fillStyle = impactGrad;
          this.ctx.beginPath();
          this.ctx.arc(dropX, impactY, impactR, 0, Math.PI * 2);
          this.ctx.fill();

          // Expanding flame ring
          const ringR = ((this.frameCount * 5 + di * 30) % 55) + 8;
          const ringAlpha = 1 - ringR / 63;
          this.ctx.strokeStyle = `rgba(249, 115, 22, ${ringAlpha * 0.8})`;
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.arc(dropX, impactY, ringR, 0, Math.PI * 2);
          this.ctx.stroke();
        });
      }

      this.ctx.restore();
    }

    if (this.lunarmonUltActive) {
      this.ctx.save();

      // Draw Eclipse Sky backdrop animation
      if (this.lunarmonUltPhase === 'cinematic' || this.lunarmonUltPhase === 'bombarding') {
        const camX = this.cameraX;
        const camY = this.cameraY;
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        // Dark sky overlay
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        this.ctx.fillRect(camX, camY, cw, ch);

        // Sun / Moon in the sky
        const moonX = camX + cw / 2;
        const moonY = camY + 80;

        // Glowing Moon Base
        this.ctx.fillStyle = '#e0e7ff';
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, 40, 0, Math.PI * 2);
        this.ctx.fill();

        // Eclipse Shadow overlay progressing
        const progress = 1 - (this.lunarmonUltChannelTimer / 45);
        const shadowOffsetX = (1 - progress) * 70 - 15;
        this.ctx.fillStyle = '#090d16';
        this.ctx.beginPath();
        this.ctx.arc(moonX + shadowOffsetX, moonY, 39, 0, Math.PI * 2);
        this.ctx.fill();

        // Corona Aura Ring
        this.ctx.strokeStyle = '#818cf8';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, 44, 0, Math.PI * 2);
        this.ctx.stroke();

        // Render AAA Vertical Moonbeams for active pre-jump bombardment targets
        this.lunarmonTargets.forEach(target => {
          if (target.struck && target.beamTimer && target.beamTimer > 0) {
            target.beamTimer--;
            const bx = target.beamX || (target.enemy.x + target.enemy.width / 2);
            const by = target.beamY || (target.enemy.y + target.enemy.height);
            const skyY = Math.max(0, this.cameraY - 250);
            const alpha = Math.min(1.0, target.beamTimer / 8);

            // Layer 1: Outer Atmosphere Glow (75px)
            this.ctx.strokeStyle = `rgba(79, 70, 229, ${0.35 * alpha})`;
            this.ctx.lineWidth = 75;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(bx, skyY);
            this.ctx.lineTo(bx, by);
            this.ctx.stroke();

            // Layer 2: Pulsing Blue Plasma Halo (48px)
            const pulse = 48 + Math.sin(this.frameCount * 0.35 + bx) * 6;
            this.ctx.strokeStyle = `rgba(147, 197, 253, ${0.55 * alpha})`;
            this.ctx.lineWidth = pulse;
            this.ctx.beginPath();
            this.ctx.moveTo(bx, skyY);
            this.ctx.lineTo(bx, by);
            this.ctx.stroke();

            // Layer 3: Cyan Core Plasma (24px)
            this.ctx.strokeStyle = `rgba(199, 210, 254, ${0.9 * alpha})`;
            this.ctx.lineWidth = 24;
            this.ctx.beginPath();
            this.ctx.moveTo(bx, skyY);
            this.ctx.lineTo(bx, by);
            this.ctx.stroke();

            // Layer 4: Pure White Core Line (10px)
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.lineWidth = 10;
            this.ctx.beginPath();
            this.ctx.moveTo(bx, skyY);
            this.ctx.lineTo(bx, by);
            this.ctx.stroke();

            // Layer 5: Rotating Horizontal Orbital Rings
            for (let r = 0; r < 4; r++) {
              const ringY = skyY + ((this.frameCount * 15 + r * 80) % Math.max(50, by - skyY));
              const ringR = 28 + Math.sin(this.frameCount * 0.3 + r) * 5;

              this.ctx.save();
              this.ctx.translate(bx, ringY);
              this.ctx.scale(1.0, 0.3);
              this.ctx.strokeStyle = r % 2 === 0 ? `rgba(147, 197, 253, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
              this.ctx.lineWidth = 3;
              this.ctx.beginPath();
              this.ctx.arc(0, 0, ringR, 0, Math.PI * 2);
              this.ctx.stroke();
              this.ctx.restore();
            }

            // Layer 6: Ground Terminal Impact Explosion Ring
            const impactGrad = this.ctx.createRadialGradient(bx, by, 8, bx, by, 60);
            impactGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            impactGrad.addColorStop(0.35, `rgba(147, 197, 253, ${0.85 * alpha})`);
            impactGrad.addColorStop(0.75, `rgba(79, 70, 229, ${0.4 * alpha})`);
            impactGrad.addColorStop(1, 'rgba(79, 70, 229, 0)');

            this.ctx.fillStyle = impactGrad;
            this.ctx.beginPath();
            this.ctx.arc(bx, by, 60, 0, Math.PI * 2);
            this.ctx.fill();
          }
        });
      } else if (this.lunarmonUltPhase === 'laser') {
        const bx = this.px + this.pWidth / 2;
        const by = this.py + this.pHeight / 2;
        const beamLength = 850;
        const endX = bx + Math.cos(this.lunarmonUltBeamAngle) * beamLength;
        const endY = by + Math.sin(this.lunarmonUltBeamAngle) * beamLength;

        // LAYER 1: Ambient Outer Cosmic Nebula Atmosphere (width 80px)
        this.ctx.strokeStyle = 'rgba(79, 70, 229, 0.25)';
        this.ctx.lineWidth = 80;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(bx, by);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // LAYER 2: Pulsing Blue Halo Aura (width 52px + pulse)
        const pulseWidth = 52 + Math.sin(this.frameCount * 0.25) * 8;
        this.ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
        this.ctx.lineWidth = pulseWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(bx, by);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // LAYER 3: Radiant Cyan Plasma Body (width 26px)
        this.ctx.strokeStyle = 'rgba(199, 210, 254, 0.85)';
        this.ctx.lineWidth = 26;
        this.ctx.beginPath();
        this.ctx.moveTo(bx, by);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // LAYER 4: Pure White Core Singularity Line (width 10px)
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(bx, by);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // LAYER 5: Rotating Energy Rings wrapping along the beam shaft (Black hole aesthetic)
        const perpAngle = this.lunarmonUltBeamAngle + Math.PI / 2;
        for (let r = 0; r < 7; r++) {
          const ringDist = ((this.frameCount * 12 + r * 120) % beamLength);
          const rx = bx + Math.cos(this.lunarmonUltBeamAngle) * ringDist;
          const ry = by + Math.sin(this.lunarmonUltBeamAngle) * ringDist;
          const ringRadius = 24 + Math.sin(this.frameCount * 0.2 + r) * 6;

          this.ctx.save();
          this.ctx.translate(rx, ry);
          this.ctx.rotate(this.lunarmonUltBeamAngle);
          this.ctx.scale(0.35, 1.0); // Elliptical ring perspective

          this.ctx.strokeStyle = r % 2 === 0 ? '#93c5fd' : '#ffffff';
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
          this.ctx.stroke();

          this.ctx.restore();
        }

        // LAYER 6: Caster Core Corona Bloom Ring at Lunarmon's chest
        const coreBloomGrad = this.ctx.createRadialGradient(bx, by, 6, bx, by, 50);
        coreBloomGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreBloomGrad.addColorStop(0.4, 'rgba(147, 197, 253, 0.8)');
        coreBloomGrad.addColorStop(0.8, 'rgba(79, 70, 229, 0.4)');
        coreBloomGrad.addColorStop(1, 'rgba(79, 70, 229, 0)');

        this.ctx.fillStyle = coreBloomGrad;
        this.ctx.beginPath();
        this.ctx.arc(bx, by, 50, 0, Math.PI * 2);
        this.ctx.fill();

        // LAYER 7: Ground / Terminal Impact Flare Ring at beam tip
        const tipFlareGrad = this.ctx.createRadialGradient(endX, endY, 8, endX, endY, 65);
        tipFlareGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        tipFlareGrad.addColorStop(0.35, 'rgba(147, 197, 253, 0.85)');
        tipFlareGrad.addColorStop(0.75, 'rgba(99, 102, 241, 0.5)');
        tipFlareGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');

        this.ctx.fillStyle = tipFlareGrad;
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, 65, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.azuremonUltActive) {
      this.ctx.save();
      const startX = this.px + (this.pFacing === 1 ? this.pWidth - 4 : 4);
      const startY = this.py + 14;

      if (this.azuremonUltPhase === 'channeling') {
        // CHARGING PHASE: Celestial Black Hole Singularity Charging at Azuremon Maw
        const progress = Math.max(0, Math.min(1, 1 - (this.azuremonUltChannelTimer / 30)));
        const orbRadius = 20 + progress * 35 + Math.sin(this.frameCount * 0.4) * 4;

        // 1. Gravitational Outer Distortion Field
        const hazeGrad = this.ctx.createRadialGradient(startX, startY, 4, startX, startY, orbRadius * 2.2);
        hazeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
        hazeGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.35)');
        hazeGrad.addColorStop(0.85, 'rgba(12, 74, 110, 0.15)');
        hazeGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
        this.ctx.fillStyle = hazeGrad;
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, orbRadius * 2.2, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Swirling Accretion Orbit Rings
        const rot0 = this.frameCount * 0.15;
        const rings = [
          { r: orbRadius * 1.6, rot: rot0, color: '#38bdf8', w: 3.5, scaleY: 0.35 },
          { r: orbRadius * 1.3, rot: -rot0 * 1.4, color: '#c084fc', w: 3.0, scaleY: 0.45 },
          { r: orbRadius * 1.0, rot: rot0 * 1.9, color: '#ffffff', w: 2.5, scaleY: 0.3 }
        ];
        rings.forEach(ring => {
          this.ctx.save();
          this.ctx.translate(startX, startY);
          this.ctx.rotate(ring.rot);
          this.ctx.scale(1.0, ring.scaleY);
          this.ctx.strokeStyle = ring.color;
          this.ctx.lineWidth = ring.w;
          this.ctx.shadowColor = ring.color;
          this.ctx.shadowBlur = 10;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.restore();
        });
        this.ctx.shadowBlur = 0;

        // 3. Glowing Event Horizon Rim
        const rimGrad = this.ctx.createRadialGradient(startX, startY, orbRadius * 0.6, startX, startY, orbRadius * 1.05);
        rimGrad.addColorStop(0, 'rgba(2, 6, 23, 0.95)');
        rimGrad.addColorStop(0.7, '#0284c7');
        rimGrad.addColorStop(1, '#ffffff');
        this.ctx.fillStyle = rimGrad;
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, orbRadius * 1.05, 0, Math.PI * 2);
        this.ctx.fill();

        // 4. Dark Singularity Void Core
        const voidGrad = this.ctx.createRadialGradient(startX, startY, 1, startX, startY, orbRadius * 0.65);
        voidGrad.addColorStop(0, '#020617');
        voidGrad.addColorStop(0.7, '#090d16');
        voidGrad.addColorStop(1, '#0c4a6e');
        this.ctx.fillStyle = voidGrad;
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, orbRadius * 0.65, 0, Math.PI * 2);
        this.ctx.fill();

        // 5. Expanding energy shockwave rings
        for (let r = 0; r < 3; r++) {
          const ringR = ((this.frameCount * 5 + r * 25) % 75);
          const ringAlpha = Math.max(0, 1 - ringR / 75);
          this.ctx.strokeStyle = `rgba(186, 230, 253, ${ringAlpha})`;
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.arc(startX, startY, ringR, 0, Math.PI * 2);
          this.ctx.stroke();
        }

        // 6. Swirling Inflow Energy Particles
        for (let p = 0; p < 10; p++) {
          const inAng = this.frameCount * 0.15 + p * (Math.PI / 5);
          const inRad = 75 * (1 - ((this.frameCount * 2.5 + p * 8) % 35) / 35);
          const inX = startX + Math.cos(inAng) * inRad;
          const inY = startY + Math.sin(inAng) * inRad;
          this.ctx.fillStyle = p % 2 === 0 ? '#ffffff' : '#38bdf8';
          this.ctx.beginPath();
          this.ctx.arc(inX, inY, 3.5, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // 7. Core Maw Bloom Flare (Mouth grows brighter and brighter)
        const bloomRadius = 10 + progress * 60;
        const bloomGrad = this.ctx.createRadialGradient(startX, startY, 2, startX, startY, bloomRadius);
        bloomGrad.addColorStop(0, `rgba(255, 255, 255, ${progress})`);
        bloomGrad.addColorStop(0.2, `rgba(186, 230, 253, ${progress * 0.95})`);
        bloomGrad.addColorStop(0.5, `rgba(56, 189, 248, ${progress * 0.7})`);
        bloomGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        this.ctx.fillStyle = bloomGrad;
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, bloomRadius, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (this.azuremonUltPhase === 'beam') {
        // SLEEK LUNARMON-STYLE AZURE SINGULARITY BEAM (BALANCED VISIBILITY & CRISP EFFECTS)
        const beamLength = 1200;
        const endX = startX + Math.cos(this.azuremonUltBeamAngle) * beamLength;
        const endY = startY + Math.sin(this.azuremonUltBeamAngle) * beamLength;

        // Calculate fade and narrow effect for when the ultimate is ending
        let fadeAlpha = 1.0;
        if (this.azuremonUltTimer < 60) {
          fadeAlpha = this.azuremonUltTimer / 60;
        }
        this.ctx.globalAlpha = fadeAlpha;

        // LAYER 1: Soft Ambient Void Sheath (70px width, low opacity)
        this.ctx.strokeStyle = 'rgba(2, 6, 23, 0.25)';
        this.ctx.lineWidth = (70 + Math.sin(this.frameCount * 0.3) * 6) * fadeAlpha;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // LAYER 2: Celestial Azure Outer Aura (44px width, translucent cyan)
        this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        this.ctx.lineWidth = (44 + Math.cos(this.frameCount * 0.25) * 4) * fadeAlpha;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // LAYER 3: Sky-Blue Plasma Body (22px width)
        this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
        this.ctx.lineWidth = 22 * fadeAlpha;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // LAYER 4: Pure White Crisp Laser Core (10px width with subtle cyan glow)
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 10 * fadeAlpha;
        this.ctx.shadowColor = '#38bdf8';
        this.ctx.shadowBlur = 8 * fadeAlpha;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        // LAYER 5: Dark Singularity Center Accent (4px width)
        this.ctx.strokeStyle = 'rgba(2, 6, 23, 0.7)';
        this.ctx.lineWidth = 4 * fadeAlpha;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // LAYER 6: Precision White Center Line (2px width)
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2 * fadeAlpha;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // LAYER 7: LUNARMON-STYLE SLIDING 3D ENERGY RINGS (6 sleek 24px perspective rings)
        for (let r = 0; r < 6; r++) {
          const ringDist = ((this.frameCount * 14 + r * 160) % beamLength);
          const rx = startX + Math.cos(this.azuremonUltBeamAngle) * ringDist;
          const ry = startY + Math.sin(this.azuremonUltBeamAngle) * ringDist;
          const ringRadius = (24 + Math.sin(this.frameCount * 0.25 + r) * 4) * fadeAlpha;

          this.ctx.save();
          this.ctx.translate(rx, ry);
          this.ctx.rotate(this.azuremonUltBeamAngle);
          this.ctx.scale(0.35, 1.0); // Elliptical 3D perspective

          this.ctx.strokeStyle = r % 2 === 0 ? '#38bdf8' : '#ffffff';
          this.ctx.lineWidth = 2.5 * fadeAlpha;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.restore();
        }

        // LAYER 8: Double Helix Accretion Lightning Arcs (Sleek 18px wave)
        const perpAng = this.azuremonUltBeamAngle + Math.PI / 2;
        const helixSteps = Math.floor(beamLength / 20);
        for (let h = 0; h < 2; h++) {
          const phaseShift = h * Math.PI;
          this.ctx.strokeStyle = h === 0 ? '#38bdf8' : '#e0f2fe';
          this.ctx.lineWidth = 2 * fadeAlpha;
          this.ctx.beginPath();
          for (let i = 0; i <= helixSteps; i++) {
            const d = (i / helixSteps) * beamLength;
            const hWave = Math.sin(this.frameCount * 0.35 + i * 0.4 + phaseShift) * 18 * fadeAlpha;
            const hx = startX + Math.cos(this.azuremonUltBeamAngle) * d + Math.cos(perpAng) * hWave;
            const hy = startY + Math.sin(this.azuremonUltBeamAngle) * d + Math.sin(perpAng) * hWave;
            if (i === 0) this.ctx.moveTo(hx, hy);
            else this.ctx.lineTo(hx, hy);
          }
          this.ctx.stroke();
        }

        // LAYER 9: Caster Mouth Bloom Flare (45px radius)
        const mouthGrad = this.ctx.createRadialGradient(startX, startY, 4 * fadeAlpha, startX, startY, 45 * fadeAlpha);
        mouthGrad.addColorStop(0, '#ffffff');
        mouthGrad.addColorStop(0.4, 'rgba(186, 230, 253, 0.7)');
        mouthGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        this.ctx.fillStyle = mouthGrad;
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, 45 * fadeAlpha, 0, Math.PI * 2);
        this.ctx.fill();

        // LAYER 10: Singularity Impact Explosion Flare (55px radius)
        const impactGrad = this.ctx.createRadialGradient(endX, endY, 6 * fadeAlpha, endX, endY, 55 * fadeAlpha);
        impactGrad.addColorStop(0, '#ffffff');
        impactGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.7)');
        impactGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        this.ctx.fillStyle = impactGrad;
        this.ctx.beginPath();
        this.ctx.arc(endX, endY, (55 + Math.sin(this.frameCount * 0.4) * 8) * fadeAlpha, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.lunarmonSkillActive && this.lunarmonSkillTimer > 0) {
      this.lunarmonSkillTimer--;
      if (this.lunarmonSkillTimer <= 0) {
        this.lunarmonSkillActive = false;
      }

      this.ctx.save();
      const sx = this.lunarmonSkillX;
      const sy = this.lunarmonSkillY;
      const skyY = Math.max(0, this.cameraY - 200);

      const alpha = Math.min(1.0, this.lunarmonSkillTimer / 8);

      // LAYER 1: Outer Celestial Nebula Atmosphere (width 70px)
      this.ctx.strokeStyle = `rgba(79, 70, 229, ${0.3 * alpha})`;
      this.ctx.lineWidth = 70;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(sx, skyY);
      this.ctx.lineTo(sx, sy);
      this.ctx.stroke();

      // LAYER 2: Pulsing Blue Halo Aura (width 44px + pulse)
      const pulseWidth = 44 + Math.sin(this.frameCount * 0.3) * 6;
      this.ctx.strokeStyle = `rgba(147, 197, 253, ${0.5 * alpha})`;
      this.ctx.lineWidth = pulseWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(sx, skyY);
      this.ctx.lineTo(sx, sy);
      this.ctx.stroke();

      // LAYER 3: Radiant Cyan Plasma Body (width 22px)
      this.ctx.strokeStyle = `rgba(199, 210, 254, ${0.9 * alpha})`;
      this.ctx.lineWidth = 22;
      this.ctx.beginPath();
      this.ctx.moveTo(sx, skyY);
      this.ctx.lineTo(sx, sy);
      this.ctx.stroke();

      // LAYER 4: Pure White Core Beam Line (width 8px)
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.lineWidth = 8;
      this.ctx.beginPath();
      this.ctx.moveTo(sx, skyY);
      this.ctx.lineTo(sx, sy);
      this.ctx.stroke();

      // LAYER 5: Rotating Horizontal Orbital Energy Rings along vertical pillar
      for (let r = 0; r < 4; r++) {
        const ringY = skyY + ((this.frameCount * 14 + r * 90) % Math.max(50, sy - skyY));
        const ringRadius = 26 + Math.sin(this.frameCount * 0.25 + r) * 5;

        this.ctx.save();
        this.ctx.translate(sx, ringY);
        this.ctx.scale(1.0, 0.3); // Elliptical perspective for horizontal ring

        this.ctx.strokeStyle = r % 2 === 0 ? `rgba(147, 197, 253, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();
      }

      // LAYER 6: Ground Terminal Impact Explosion Ring
      const impactGrad = this.ctx.createRadialGradient(sx, sy, 6, sx, sy, 55);
      impactGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      impactGrad.addColorStop(0.4, `rgba(147, 197, 253, ${0.8 * alpha})`);
      impactGrad.addColorStop(0.8, `rgba(79, 70, 229, ${0.3 * alpha})`);
      impactGrad.addColorStop(1, 'rgba(79, 70, 229, 0)');

      this.ctx.fillStyle = impactGrad;
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, 55, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }

    if (this.shadowmonSkillActive && this.shadowmonSkillTimer > 0) {
      this.shadowmonSkillTimer--;
      if (this.shadowmonSkillTimer <= 0) {
        this.shadowmonSkillActive = false;
      }

      this.ctx.save();
      const sx = this.shadowmonSkillX;
      const sy = this.shadowmonSkillY;
      const beamH = 125;                            // pillar height in px
      const beamTop = sy - beamH;
      const alpha = Math.min(1.0, this.shadowmonSkillTimer / 6);
      const churn = this.frameCount * 0.18;

      // ── 1. Wide inky smoke shroud (outermost) ──────────────────────────────
      const smokeGrad = this.ctx.createLinearGradient(sx, beamTop, sx, sy);
      smokeGrad.addColorStop(0, `rgba(5, 0, 10, 0)`);
      smokeGrad.addColorStop(0.3, `rgba(30, 0, 15, ${0.55 * alpha})`);
      smokeGrad.addColorStop(0.8, `rgba(10, 0, 5, ${0.8 * alpha})`);
      smokeGrad.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
      this.ctx.fillStyle = smokeGrad;
      // Irregular smoke blob shape using bezier curves
      this.ctx.beginPath();
      this.ctx.moveTo(sx - 45, sy);
      this.ctx.bezierCurveTo(
        sx - 55 + Math.sin(churn) * 12, sy - beamH * 0.35,
        sx - 40 + Math.sin(churn + 1) * 15, sy - beamH * 0.7,
        sx + Math.sin(churn * 0.7) * 18, beamTop
      );
      this.ctx.bezierCurveTo(
        sx + 40 + Math.sin(churn + 2) * 14, sy - beamH * 0.7,
        sx + 50 + Math.sin(churn + 0.5) * 12, sy - beamH * 0.35,
        sx + 45, sy
      );
      this.ctx.closePath();
      this.ctx.fill();

      // ── 2. Dark void eruption pillar (mid layer) ───────────────────────────
      const voidGrad = this.ctx.createLinearGradient(sx, beamTop, sx, sy);
      voidGrad.addColorStop(0, `rgba(80, 0, 30, 0)`);
      voidGrad.addColorStop(0.2, `rgba(120, 10, 40, ${0.7 * alpha})`);
      voidGrad.addColorStop(0.65, `rgba(60, 0, 20, ${0.9 * alpha})`);
      voidGrad.addColorStop(1, `rgba(5, 0, 0, ${alpha})`);
      this.ctx.fillStyle = voidGrad;
      this.ctx.beginPath();
      this.ctx.moveTo(sx - 22, sy);
      this.ctx.bezierCurveTo(
        sx - 28 + Math.sin(churn + 0.8) * 8, sy - beamH * 0.4,
        sx - 20 + Math.sin(churn + 1.6) * 10, sy - beamH * 0.75,
        sx + Math.sin(churn * 0.6 + 0.5) * 10, beamTop
      );
      this.ctx.bezierCurveTo(
        sx + 20 + Math.sin(churn + 2.4) * 9, sy - beamH * 0.75,
        sx + 24 + Math.sin(churn + 1.2) * 8, sy - beamH * 0.4,
        sx + 22, sy
      );
      this.ctx.closePath();
      this.ctx.fill();

      // ── 3. Jagged dark-energy tendrils erupting outward ────────────────────
      const tendrilCount = 8;
      for (let t = 0; t < tendrilCount; t++) {
        const baseAng = (t / tendrilCount) * Math.PI * 2 + churn * 0.15;
        const len = 25 + Math.sin(churn + t * 1.3) * 15;
        const midY = sy - beamH * (0.2 + (t % 3) * 0.25);
        const tx1 = sx + Math.cos(baseAng) * len;
        const ty1 = midY + Math.sin(baseAng) * len * 0.5;
        const tx2 = sx + Math.cos(baseAng + 0.4) * (len * 0.55);
        const ty2 = midY + Math.sin(baseAng + 0.4) * (len * 0.4);

        this.ctx.strokeStyle = t % 2 === 0
          ? `rgba(120, 0, 30, ${0.7 * alpha})`
          : `rgba(40, 0, 15, ${0.85 * alpha})`;
        this.ctx.lineWidth = 2 + Math.sin(churn + t) * 1;
        this.ctx.beginPath();
        this.ctx.moveTo(sx, midY);
        this.ctx.lineTo(tx2, ty2);
        this.ctx.lineTo(tx1, ty1);
        this.ctx.stroke();
      }

      // ── 4. Ground rupture cracks radiating outward ─────────────────────────
      const crackCount = 6;
      for (let c = 0; c < crackCount; c++) {
        const crackAng = (c / crackCount) * Math.PI * 2 + Math.sin(this.frameCount * 0.05 + c) * 0.3;
        const crackLen = 30 + Math.sin(churn * 0.4 + c * 1.7) * 14;
        const cx2 = sx + Math.cos(crackAng) * crackLen;
        const cy2 = sy + Math.sin(crackAng) * crackLen * 0.35;
        const midX2 = (sx + cx2) / 2 + Math.sin(churn + c * 2.1) * 8;
        const midY2 = (sy + cy2) / 2 + Math.cos(churn + c * 1.4) * 4;

        this.ctx.strokeStyle = `rgba(60, 0, 10, ${0.9 * alpha})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(midX2, midY2);
        this.ctx.lineTo(cx2, cy2);
        this.ctx.stroke();
      }

      // ── 5. Hot inner core — deep blood-red glow ────────────────────────────
      const coreGrad = this.ctx.createRadialGradient(sx, sy - beamH * 0.15, 4, sx, sy, 42);
      coreGrad.addColorStop(0, `rgba(200, 30, 30, ${0.9 * alpha})`);
      coreGrad.addColorStop(0.4, `rgba(100, 5, 10, ${0.65 * alpha})`);
      coreGrad.addColorStop(1, 'rgba(10, 0, 0, 0)');
      this.ctx.fillStyle = coreGrad;
      this.ctx.beginPath();
      this.ctx.arc(sx, sy - beamH * 0.15, 42, 0, Math.PI * 2);
      this.ctx.fill();

      // ── 6. Rising ash motes ─────────────────────────────────────────────────
      for (let a = 0; a < 5; a++) {
        const ashX = sx + Math.sin(churn * 0.9 + a * 2.2) * 18;
        const ashY = sy - beamH * 0.35 - ((churn * 28 + a * 22) % beamH);
        const ashR = 2 + Math.sin(churn + a) * 1.5;
        this.ctx.fillStyle = a % 2 === 0
          ? `rgba(60, 0, 15, ${0.75 * alpha})`
          : `rgba(20, 0, 5, ${0.55 * alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(ashX, ashY, ashR, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    // ── SHADOWMON ULTIMATE: Dark Soul Implosion ───────────────────────────────
    if (this.shadowmonUltActive) {
      const cx = this.px + this.pWidth / 2;
      const cy = this.py + this.pHeight / 2;
      const progress = (90 - this.shadowmonUltTimer) / 90;   // 0→1 as charge builds
      const stacks = this.shadowmonUltStacksUsed;
      const churn = this.frameCount * 0.14;

      this.ctx.save();

      // ── 1. Spreading dark void ground stain ──────────────────────────────
      const stainR = 50 + progress * (120 + stacks * 20);
      const stainGrad = this.ctx.createRadialGradient(cx, cy + this.pHeight * 0.4, 8, cx, cy + this.pHeight * 0.4, stainR);
      stainGrad.addColorStop(0, `rgba(0, 0, 0, ${0.85})`);
      stainGrad.addColorStop(0.45, `rgba(30, 0, 10, ${0.65})`);
      stainGrad.addColorStop(1, 'rgba(10, 0, 5, 0)');
      this.ctx.fillStyle = stainGrad;
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy + this.pHeight * 0.4, stainR, stainR * 0.38, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // ── 2. Radiating void fracture cracks from player feet ───────────────
      const crackCount = 4 + stacks;
      for (let c = 0; c < crackCount; c++) {
        const baseAng = (c / crackCount) * Math.PI + Math.sin(churn * 0.3 + c) * 0.2;
        const crackLen = (35 + stacks * 12 + progress * 50) * (0.85 + Math.sin(churn + c * 1.9) * 0.15);
        const footY = cy + this.pHeight * 0.5;

        // Main crack
        const ex = cx + Math.cos(baseAng) * crackLen;
        const ey = footY + Math.sin(baseAng) * crackLen * 0.3;
        const m1x = cx + Math.cos(baseAng + 0.2) * crackLen * 0.45 + Math.sin(churn + c) * 6;
        const m1y = footY + Math.sin(baseAng + 0.2) * crackLen * 0.3 * 0.45 + Math.cos(churn + c) * 3;
        this.ctx.strokeStyle = `rgba(15, 0, 5, ${0.95})`;
        this.ctx.lineWidth = 2.5 - c * 0.1;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, footY);
        this.ctx.lineTo(m1x, m1y);
        this.ctx.lineTo(ex, ey);
        this.ctx.stroke();

        // Branch crack
        const branchAng = baseAng - 0.35 + Math.sin(c * 2.3) * 0.2;
        const bx = cx + Math.cos(branchAng) * crackLen * 0.6;
        const by = footY + Math.sin(branchAng) * crackLen * 0.3 * 0.6;
        this.ctx.strokeStyle = `rgba(50, 0, 10, ${0.7})`;
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(m1x, m1y);
        this.ctx.lineTo(bx, by);
        this.ctx.stroke();
      }

      // ── 3. Churning dark smoke implosion blobs ───────────────────────────
      const blobCount = 3 + stacks;
      for (let b = 0; b < blobCount; b++) {
        const bAng = (b / blobCount) * Math.PI * 2 + churn * 0.22;
        const bR = (55 + b * 18 + progress * 40) * (0.9 + Math.sin(churn + b) * 0.1);
        const bx = cx + Math.cos(bAng) * bR * 0.9;
        const by = cy + Math.sin(bAng) * bR * 0.55;
        const blobSize = (18 + stacks * 4 + progress * 22) * (0.85 + Math.sin(churn * 1.3 + b * 2.1) * 0.15);
        const blobGrad = this.ctx.createRadialGradient(bx, by, 2, bx, by, blobSize);
        blobGrad.addColorStop(0, `rgba(5, 0, 0, ${0.9})`);
        blobGrad.addColorStop(0.5, `rgba(40, 0, 12, ${0.6})`);
        blobGrad.addColorStop(1, 'rgba(10, 0, 5, 0)');
        this.ctx.fillStyle = blobGrad;
        this.ctx.beginPath();
        this.ctx.arc(bx, by, blobSize, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // ── 4. Inward-rushing dark corruption streaks ─────────────────────────
      if (progress > 0.2) {
        const streakCount = 6 + stacks * 2;
        for (let sk = 0; sk < streakCount; sk++) {
          const skAng = (sk / streakCount) * Math.PI * 2 + churn * 0.08 + sk * 0.4;
          const outerR = 80 + stacks * 15 + progress * 60;
          const innerR = 10;
          const alpha2 = (progress - 0.2) / 0.8;
          const ox = cx + Math.cos(skAng) * outerR;
          const oy = cy + Math.sin(skAng) * outerR * 0.6;
          const ix = cx + Math.cos(skAng) * innerR;
          const iy = cy + Math.sin(skAng) * innerR * 0.6;
          // Jagged midpoint
          const mx = (ox + ix) / 2 + Math.sin(churn * 1.5 + sk * 2.7) * 14;
          const my = (oy + iy) / 2 + Math.cos(churn * 1.2 + sk * 1.9) * 8;
          this.ctx.strokeStyle = sk % 3 === 0
            ? `rgba(100, 0, 20, ${0.75 * alpha2})`
            : sk % 3 === 1
              ? `rgba(30, 0, 8, ${0.9 * alpha2})`
              : `rgba(5, 0, 2, ${0.95 * alpha2})`;
          this.ctx.lineWidth = 1.5 + Math.sin(churn + sk) * 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(ox, oy);
          this.ctx.lineTo(mx, my);
          this.ctx.lineTo(ix, iy);
          this.ctx.stroke();
        }
      }

      // ── 5. Void corruption shadow engulfing the player ────────────────────
      const engulfR = 20 + progress * (30 + stacks * 6);
      const engulfGrad = this.ctx.createRadialGradient(cx, cy, 4, cx, cy, engulfR);
      engulfGrad.addColorStop(0, `rgba(0, 0, 0, ${0.95})`);
      engulfGrad.addColorStop(0.4, `rgba(60, 0, 15, ${0.75})`);
      engulfGrad.addColorStop(0.8, `rgba(20, 0, 5, ${0.4})`);
      engulfGrad.addColorStop(1, 'rgba(5, 0, 0, 0)');
      this.ctx.fillStyle = engulfGrad;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, engulfR, 0, Math.PI * 2);
      this.ctx.fill();

      // ── 6. Rising dark embers / ash motes ─────────────────────────────────
      for (let a = 0; a < 4 + stacks; a++) {
        const ashX = cx + Math.sin(churn * 0.7 + a * 1.8) * (25 + stacks * 6);
        const ashY = cy + this.pHeight * 0.3 - ((churn * 22 + a * 18) % (60 + stacks * 10));
        const ashR = 1.5 + Math.sin(churn + a * 2) * 1;
        this.ctx.fillStyle = a % 2 === 0
          ? `rgba(80, 0, 15, 0.8)`
          : `rgba(20, 0, 5, 0.6)`;
        this.ctx.beginPath();
        this.ctx.arc(ashX, ashY, ashR, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // ── 7. Blood-red corrupted core glow ──────────────────────────────────
      const coreR = 10 + progress * (16 + stacks * 3);
      const coreGrad2 = this.ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR);
      coreGrad2.addColorStop(0, `rgba(180, 10, 10, ${0.95})`);
      coreGrad2.addColorStop(0.5, `rgba(80, 0, 5, ${0.7})`);
      coreGrad2.addColorStop(1, 'rgba(10, 0, 0, 0)');
      this.ctx.fillStyle = coreGrad2;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      this.ctx.fill();

      // ── 8. Final void explosion burst (last 10 frames) ────────────────────
      if (this.shadowmonUltTimer <= 10) {
        const burstProg = (10 - this.shadowmonUltTimer) / 10;
        // Dark shockwave (not circle — polygon-ish via canvas transform)
        for (let sh = 0; sh < 3; sh++) {
          const shDelay = sh * 0.25;
          const shProg = Math.max(0, burstProg - shDelay);
          const shR = shProg * (160 + sh * 45);
          const shAlpha = Math.max(0, 0.9 - shProg * 1.5);
          this.ctx.strokeStyle = sh === 0
            ? `rgba(120, 0, 20, ${shAlpha})`
            : sh === 1
              ? `rgba(40, 0, 8, ${shAlpha})`
              : `rgba(5, 0, 2, ${shAlpha})`;
          this.ctx.lineWidth = 5 - sh;
          this.ctx.beginPath();
          // Jagged polygon burst instead of clean circle
          const sides = 10 + sh * 4;
          for (let v = 0; v <= sides; v++) {
            const vAng = (v / sides) * Math.PI * 2;
            const vR = shR * (0.85 + Math.sin(v * 3.7 + sh * 1.2) * 0.15);
            const vx = cx + Math.cos(vAng) * vR;
            const vy = cy + Math.sin(vAng) * vR * 0.7;
            if (v === 0) this.ctx.moveTo(vx, vy);
            else this.ctx.lineTo(vx, vy);
          }
          this.ctx.closePath();
          this.ctx.stroke();
        }
      }

      this.ctx.restore();
    }

    if (this.skeletonDeathTimer > 0) {
      this.skeletonDeathTimer--;
      if (this.skeletonDeathTimer === 0) {
        this.callbacks.onPlayerDeath();
      }
      const alpha = Math.min(1.0, this.skeletonDeathTimer / 25);
      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      const sx = this.px + this.pWidth / 2;
      const sy = this.py + this.pHeight;

      const sink = (90 - this.skeletonDeathTimer) * 0.25;

      this.ctx.fillStyle = '#e2e8f0';
      this.ctx.strokeStyle = '#94a3b8';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(sx, sy - 18 + sink, 10, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#22c55e';
      this.ctx.fillRect(sx - 5, sy - 21 + sink, 4, 4);
      this.ctx.fillRect(sx + 1, sy - 21 + sink, 4, 4);

      this.ctx.fillStyle = '#e2e8f0';
      this.ctx.fillRect(sx - 14, sy - 8 + sink, 28, 4);
      this.ctx.fillRect(sx - 10, sy - 2 + sink, 20, 4);

      for (let b = 0; b < 6; b++) {
        this.ctx.fillStyle = b % 2 === 0 ? '#86efac' : '#22c55e';
        this.ctx.beginPath();
        this.ctx.arc(
          sx + Math.sin(this.frameCount * 0.2 + b) * 18,
          sy - (b * 5) - (this.frameCount % 15),
          Math.random() * 4 + 2,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.frozenDeathTimer > 0) {
      this.ctx.save();

      const px = this.px;
      const py = this.py;
      const pw = this.pWidth;
      const ph = this.pHeight;

      this.ctx.fillStyle = 'rgba(125, 211, 252, 0.75)';
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 3;

      this.ctx.beginPath();
      this.ctx.roundRect(px - 6, py - 6, pw + 12, ph + 12, 10);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.moveTo(px - 2, py);
      this.ctx.lineTo(px + pw / 2, py - 4);
      this.ctx.lineTo(px + 4, py + ph / 2);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.fillStyle = 'rgba(2, 132, 199, 0.6)';
      this.ctx.fillRect(px + 4, py + 4, pw - 8, ph - 8);

      for (let f = 0; f < 5; f++) {
        this.ctx.fillStyle = f % 2 === 0 ? '#ffffff' : '#7dd3fc';
        this.ctx.beginPath();
        this.ctx.arc(
          px + pw / 2 + Math.sin(this.frameCount * 0.2 + f) * 16,
          py + ph - (f * 8) - (this.frameCount % 20),
          Math.random() * 3 + 2,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.electrocutionDeathTimer > 0) {
      this.electrocutionDeathTimer--;
      if (this.electrocutionDeathTimer === 0) {
        this.callbacks.onPlayerDeath();
      }

      const progress = (90 - this.electrocutionDeathTimer) / 90;
      const alpha = Math.min(1.0, this.electrocutionDeathTimer / 20);
      this.ctx.save();

      const px = this.px;
      const py = this.py;
      const pw = this.pWidth;
      const ph = this.pHeight;
      const cx = px + pw / 2;
      const cy = py + ph / 2;

      if (this.electrocutionDeathTimer > 30) {
        const boltAlpha = Math.min(1.0, (this.electrocutionDeathTimer - 30) / 30);

        this.ctx.fillStyle = `rgba(234, 179, 8, ${boltAlpha * 0.4})`;
        this.ctx.fillRect(cx - 30, -1000, 60, cy + 1000);

        this.ctx.strokeStyle = `rgba(254, 240, 138, ${boltAlpha})`;
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, -500);
        const segments = 8;
        for (let s = 1; s <= segments; s++) {
          const segY = -500 + (cy + 500) * (s / segments);
          const jitter = (Math.sin(this.frameCount * 0.5 + s * 2.3) * 20) * (1 - s / segments);
          this.ctx.lineTo(cx + jitter, segY);
        }
        this.ctx.stroke();

        this.ctx.strokeStyle = `rgba(255, 255, 255, ${boltAlpha * 0.9})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, -500);
        for (let s = 1; s <= segments; s++) {
          const segY = -500 + (cy + 500) * (s / segments);
          const jitter = (Math.sin(this.frameCount * 0.5 + s * 2.3) * 12) * (1 - s / segments);
          this.ctx.lineTo(cx + jitter, segY);
        }
        this.ctx.stroke();
      }

      this.ctx.globalAlpha = alpha;
      for (let a = 0; a < 6; a++) {
        const arcAngle = (this.frameCount * 0.4 + a * Math.PI / 3);
        const arcR = 18 + Math.sin(this.frameCount * 0.6 + a) * 8;
        const ax = cx + Math.cos(arcAngle) * arcR;
        const ay = cy + Math.sin(arcAngle) * arcR;

        this.ctx.strokeStyle = a % 2 === 0 ? '#fef08a' : '#38bdf8';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);

        const midX = (cx + ax) / 2 + (Math.random() - 0.5) * 12;
        const midY = (cy + ay) / 2 + (Math.random() - 0.5) * 12;
        this.ctx.lineTo(midX, midY);
        this.ctx.lineTo(ax, ay);
        this.ctx.stroke();
      }

      if (this.frameCount % 4 < 2) {
        this.ctx.fillStyle = `rgba(234, 179, 8, ${alpha * 0.7})`;
        this.ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);

        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        this.ctx.fillRect(cx - 1, py + 6, 2, ph - 12);
        this.ctx.fillRect(px + 6, cy - 2, pw - 12, 3);
      }

      if (this.electrocutionDeathTimer > 75) {
        const flashAlpha = (this.electrocutionDeathTimer - 75) / 15;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.6})`;
        this.ctx.fillRect(0, 0, this.canvas.width + 2000, this.canvas.height + 2000);
      }

      this.ctx.restore();
    }

    if (this.reaperDeathTimer > 0) {
      this.reaperDeathTimer--;
      if (this.reaperDeathTimer === 0) {
        this.callbacks.onPlayerDeath();
      }

      const alpha = Math.min(1.0, this.reaperDeathTimer / 20);
      this.ctx.save();

      const px = this.px;
      const py = this.py;
      const pw = this.pWidth;
      const ph = this.pHeight;
      const cx = px + pw / 2;
      const cy = py + ph / 2;
      const slashProgress = Math.min(1.0, (90 - this.reaperDeathTimer) / 25);

      if (this.reaperDeathTimer > 40) {
        const auraAlpha = 0.5 * alpha;
        const grad = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, 80);
        grad.addColorStop(0, `rgba(88, 28, 135, ${auraAlpha})`);
        grad.addColorStop(1, 'rgba(15, 10, 26, 0)');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        this.ctx.fill();
      }

      if (this.reaperDeathTimer > 30) {
        const scytheAngle = slashProgress * Math.PI * 1.2 - Math.PI * 0.6;
        const scytheR = 50;
        const scytheX = cx + Math.cos(scytheAngle) * scytheR;
        const scytheY = cy + Math.sin(scytheAngle) * scytheR;

        this.ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, scytheR, scytheAngle - 0.8, scytheAngle);
        this.ctx.stroke();

        this.ctx.fillStyle = `rgba(192, 132, 252, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(scytheX, scytheY, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(px - 10, cy - 10 + slashProgress * 20);
        this.ctx.lineTo(px + pw + 10, cy + 10 - slashProgress * 20);
        this.ctx.stroke();
      }

      this.ctx.globalAlpha = alpha;
      if (this.reaperDeathTimer < 60) {
        const splitOffset = (60 - this.reaperDeathTimer) * 0.8;

        this.ctx.fillStyle = `rgba(107, 33, 168, ${alpha * 0.6})`;
        this.ctx.fillRect(px - splitOffset, py - splitOffset * 0.5, pw, ph / 2);

        this.ctx.fillStyle = `rgba(88, 28, 135, ${alpha * 0.5})`;
        this.ctx.fillRect(px + splitOffset, cy + splitOffset * 0.3, pw, ph / 2);
      }

      for (let w = 0; w < 5; w++) {
        this.ctx.fillStyle = w % 2 === 0 ? `rgba(168, 85, 247, ${alpha * 0.7})` : `rgba(192, 132, 252, ${alpha * 0.5})`;
        this.ctx.beginPath();
        this.ctx.arc(
          cx + Math.sin(this.frameCount * 0.25 + w * 1.5) * 20,
          cy - (w * 10) - (this.frameCount % 25),
          Math.random() * 4 + 2,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }

      if (this.reaperDeathTimer > 80) {
        const flashAlpha = (this.reaperDeathTimer - 80) / 10;
        this.ctx.fillStyle = `rgba(15, 10, 26, ${flashAlpha * 0.5})`;
        this.ctx.fillRect(-1000, -1000, this.canvas.width + 3000, this.canvas.height + 3000);
      }

      this.ctx.restore();
    }

    if (this.antimatterDeathTimer > 0) {
      this.antimatterDeathTimer--;
      if (this.antimatterDeathTimer === 0) {
        this.callbacks.onPlayerDeath();
      }

      const progress = (90 - this.antimatterDeathTimer) / 90;
      const alpha = Math.min(1.0, this.antimatterDeathTimer / 20);
      const shrink = 1.0 - progress * 0.85;
      this.ctx.save();

      const px = this.px;
      const py = this.py;
      const pw = this.pWidth;
      const ph = this.pHeight;
      const cx = px + pw / 2;
      const cy = py + ph / 2;

      // Cyan/magenta outer shockwave ring on start
      if (this.antimatterDeathTimer > 60) {
        const ringAlpha = (this.antimatterDeathTimer - 60) / 30;
        const ringR = (1 - ringAlpha) * 110 + 10;
        const ringGrad = this.ctx.createRadialGradient(cx, cy, ringR * 0.4, cx, cy, ringR);
        ringGrad.addColorStop(0, `rgba(6, 182, 212, ${ringAlpha * 0.6})`);
        ringGrad.addColorStop(0.5, `rgba(232, 121, 249, ${ringAlpha * 0.4})`);
        ringGrad.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = ringGrad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Spiraling antimatter orbital particles
      this.ctx.globalAlpha = alpha;
      for (let o = 0; o < 8; o++) {
        const orbitAngle = this.frameCount * 0.18 + (o * Math.PI * 2) / 8;
        const orbitR = (22 + o * 5) * shrink;
        const ox = cx + Math.cos(orbitAngle) * orbitR;
        const oy = cy + Math.sin(orbitAngle) * orbitR;
        this.ctx.fillStyle = o % 2 === 0 ? '#06b6d4' : '#e879f9';
        this.ctx.beginPath();
        this.ctx.arc(ox, oy, (3 * shrink + 1), 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Fragmented body disintegrating
      if (this.antimatterDeathTimer > 15) {
        const silAlpha = alpha * shrink;
        const fragCount = 8;
        for (let f = 0; f < fragCount; f++) {
          const col = f % 2;
          const row = Math.floor(f / 2);
          const fragX = cx - pw * shrink * 0.5 + col * pw * shrink * 0.5 + Math.sin(this.frameCount * 0.3 + f) * progress * 12;
          const fragY = py + row * (ph * shrink / 4) + Math.cos(this.frameCount * 0.25 + f) * progress * 10;
          const fragW = pw * shrink * 0.45;
          const fragH = ph * shrink * 0.23;
          this.ctx.fillStyle = f % 3 === 0 ? '#06b6d4' : f % 3 === 1 ? '#e879f9' : '#a5f3fc';
          this.ctx.globalAlpha = silAlpha * (1 - progress * 0.6);
          this.ctx.fillRect(fragX, fragY, fragW, fragH);
        }

        // Atom symbol overlay
        this.ctx.globalAlpha = alpha * shrink * 0.85;
        this.ctx.strokeStyle = '#06b6d4';
        this.ctx.lineWidth = 2 * shrink;
        for (let a = 0; a < 3; a++) {
          this.ctx.save();
          this.ctx.translate(cx, cy);
          this.ctx.rotate(a * Math.PI / 3 + this.frameCount * 0.05);
          this.ctx.beginPath();
          this.ctx.ellipse(0, 0, 14 * shrink, 5 * shrink, 0, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.restore();
        }
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = '#e879f9';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 4 * shrink, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Screen flash at start
      if (this.antimatterDeathTimer > 78) {
        const flashAlpha = (this.antimatterDeathTimer - 78) / 12;
        this.ctx.globalAlpha = flashAlpha * 0.5;
        this.ctx.fillStyle = '#06b6d4';
        this.ctx.fillRect(0, 0, this.canvas.width + 2000, this.canvas.height + 2000);
      }

      this.ctx.restore();
    }

    if (this.playerRootedTimer > 0) {
      this.ctx.save();
      this.ctx.strokeStyle = '#22c55e';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(this.px + this.pWidth / 2, this.py + this.pHeight - 4, 16, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = '#86efac';
      this.ctx.fillRect(this.px + this.pWidth / 2 - 12, this.py + this.pHeight - 8, 4, 8);
      this.ctx.fillRect(this.px + this.pWidth / 2 + 8, this.py + this.pHeight - 8, 4, 8);
      this.ctx.restore();
    }

    if (this.skeletonDeathTimer <= 0 && this.antimatterDeathTimer <= 0) {
      const px = this.px;
      const py = this.py;
      const pw = this.pWidth;

      const hpPct = Math.max(0, Math.min(1, this.pHP / this.pMaxHP));
      const energyPct = Math.max(0, Math.min(1, this.pEnergy / this.getMaxEnergy()));

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.fillRect(px, py - 14, pw, 4);

      this.ctx.fillStyle = hpPct < 0.25 ? '#ef4444' : hpPct < 0.5 ? '#f59e0b' : '#10b981';
      this.ctx.fillRect(px, py - 14, pw * hpPct, 4);

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.fillRect(px, py - 8, pw, 3);

      this.ctx.fillStyle = energyPct >= 1.0 ? '#fbbf24' : '#eab308';
      this.ctx.fillRect(px, py - 8, pw * energyPct, 3);
    }

    if (this.flymonTornadoActive) {
      this.ctx.save();
      const tx = this.flymonTornadoX;
      const ty = this.flymonTornadoY;

      // Draw suction radius indicator on the ground (soft glowing cyan circle)
      const groundGrad = this.ctx.createRadialGradient(tx, ty, 10, tx, ty, 300);
      groundGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
      groundGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
      groundGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = groundGrad;
      this.ctx.beginPath();
      this.ctx.arc(tx, ty, 300, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw active core indicator
      const coreGrad = this.ctx.createRadialGradient(tx, ty, 5, tx, ty, 150);
      coreGrad.addColorStop(0, 'rgba(165, 243, 252, 0.25)');
      coreGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.1)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = coreGrad;
      this.ctx.beginPath();
      this.ctx.arc(tx, ty, 150, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw 6 inward flowing suction wind lines
      for (let s = 0; s < 6; s++) {
        const angle = (s / 6) * Math.PI * 2 + this.frameCount * 0.03;
        const startDist = 300 - ((this.frameCount * 4 + s * 50) % 250);
        const nextDist = Math.max(10, startDist - 30);
        const wX1 = tx + Math.cos(angle) * startDist;
        const wY1 = ty + Math.sin(angle) * startDist * 0.25;
        const wX2 = tx + Math.cos(angle) * nextDist;
        const wY2 = ty + Math.sin(angle) * nextDist * 0.25;

        this.ctx.strokeStyle = `rgba(165, 243, 252, ${0.45 * (startDist / 300)})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(wX1, wY1);
        this.ctx.lineTo(wX2, wY2);
        this.ctx.stroke();
      }

      // Draw the vertical funnel loops (3D cylindrical lines stacking up)
      const tornadoHeight = 250;
      const bottomY = ty + 30;

      // Draw 18 swirling layers to form the funnel
      const layers = 18;
      for (let i = 0; i < layers; i++) {
        const t = i / layers; // 0 at bottom, 1 at top
        const currY = bottomY - t * tornadoHeight;

        // Funnel shape: narrower at bottom, wider at top
        const baseRadius = 25 + t * 95;

        // Add swaying motion using sine wave
        const swayX = Math.sin(this.frameCount * 0.1 + t * Math.PI) * 12;

        // Ring translation and scale for 3D perspective
        this.ctx.save();
        this.ctx.translate(tx + swayX, currY);

        // Spin the rings
        const ringRotation = this.frameCount * 0.12 + t * Math.PI;
        this.ctx.rotate(ringRotation);
        this.ctx.scale(1.0, 0.25); // flat ellipse

        // Ring color and glow
        this.ctx.strokeStyle = i % 2 === 0 ? 'rgba(34, 211, 238, 0.45)' : 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 2.0 + t * 4.0;

        this.ctx.beginPath();
        this.ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }

      // Draw core lightning/wind arcs
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const currY = bottomY - t * tornadoHeight;
        const radius = 25 + t * 95;
        const angle = this.frameCount * 0.22 + t * Math.PI * 4;
        const px = tx + Math.cos(angle) * radius + Math.sin(this.frameCount * 0.1 + t * Math.PI) * 12;
        if (i === 0) this.ctx.moveTo(px, currY);
        else this.ctx.lineTo(px, currY);
      }
      this.ctx.stroke();

      this.ctx.restore();
    }

    this.floatingTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.globalAlpha = Math.min(1.0, ft.life / 70);

      if (ft.isUltimate) {
        this.ctx.font = 'bold 13px "Press Start 2P", Courier, monospace';

        const minX = this.cameraX + 70;
        const maxX = this.cameraX + this.canvas.width - 70;
        const minY = this.cameraY + 45;
        const maxY = this.cameraY + this.canvas.height - 30;

        const clampedX = Math.max(minX, Math.min(maxX, ft.x));
        const clampedY = Math.max(minY, Math.min(maxY, ft.y));

        const textWidth = this.ctx.measureText(ft.text).width;
        this.ctx.fillStyle = 'rgba(15, 12, 24, 0.92)';
        this.ctx.fillRect(clampedX - textWidth / 2 - 8, clampedY - 14, textWidth + 16, 18);
        this.ctx.strokeStyle = ft.color;
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(clampedX - textWidth / 2 - 8, clampedY - 14, textWidth + 16, 18);

        this.ctx.fillStyle = ft.color;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(ft.text, clampedX, clampedY);
      } else {
        this.ctx.font = 'bold 12px "Press Start 2P", Courier, monospace';
        this.ctx.fillStyle = ft.color;
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 4;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(ft.text, ft.x, ft.y);
      }

      this.ctx.restore();
    });

    if (this.musouSlashActive) {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const tx = this.musouSlashX || this.px;
      const ty = this.musouSlashY || this.py;

      this.ctx.save();

      const vignette = this.ctx.createRadialGradient(w / 2, h / 2, h / 3, w / 2, h / 2, w / 2);
      vignette.addColorStop(0, 'rgba(12, 5, 26, 0.45)');
      vignette.addColorStop(1, 'rgba(4, 1, 10, 0.95)');
      this.ctx.fillStyle = vignette;
      this.ctx.fillRect(0, 0, w, h);

      const p1x = tx - 320;
      const p1y = ty + 220;
      const p2x = tx + 320;
      const p2y = ty - 220;

      const p3x = tx + 320;
      const p3y = ty + 220;
      const p4x = tx - 320;
      const p4y = ty - 220;

      const prog1 = Math.max(0.05, Math.min(1.0, this.assassinmonUltimateTimer / 12));
      const cur1x = p1x + (p2x - p1x) * prog1;
      const cur1y = p1y + (p2y - p1y) * prog1;

      const prog2 = Math.max(0.0, Math.min(1.0, (this.assassinmonUltimateTimer - 12) / 12));
      const cur2x = p3x + (p4x - p3x) * prog2;
      const cur2y = p3y + (p4y - p3y) * prog2;

      const pw = this.pWidth;
      const ph = this.pHeight;

      if (this.assassinmonUltimateTimer < 12) {
        this.ctx.save();
        this.ctx.translate(p1x, p1y - ph / 2);
        this.ctx.scale(1.5, 1.5);
        this.ctx.globalAlpha = 0.35;
        this.ctx.fillStyle = '#a855f7';
        this.ctx.fillRect(-15, -15, 30, 30);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(25, -20);
        this.ctx.stroke();
        this.ctx.restore();
      }

      if (this.assassinmonUltimateTimer >= 12 && this.assassinmonUltimateTimer < 24) {
        this.ctx.save();
        this.ctx.translate(p3x, p3y - ph / 2);
        this.ctx.scale(1.5, 1.5);
        this.ctx.globalAlpha = 0.35;
        this.ctx.fillStyle = '#a855f7';
        this.ctx.fillRect(-15, -15, 30, 30);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-25, -20);
        this.ctx.stroke();
        this.ctx.restore();
      }

      if (prog1 > 0) {
        this.ctx.strokeStyle = 'rgba(192, 132, 252, 0.65)';
        this.ctx.lineWidth = 32;
        this.ctx.beginPath();
        this.ctx.moveTo(p1x, p1y);
        this.ctx.lineTo(cur1x, cur1y);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#a855f7';
        this.ctx.lineWidth = 14;
        this.ctx.beginPath();
        this.ctx.moveTo(p1x, p1y);
        this.ctx.lineTo(cur1x, cur1y);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(p1x, p1y);
        this.ctx.lineTo(cur1x, cur1y);
        this.ctx.stroke();

        if (prog1 < 1.0) {
          this.ctx.fillStyle = '#ffffff';
          this.ctx.beginPath();
          this.ctx.arc(cur1x, cur1y, 12, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      if (prog2 > 0) {
        this.ctx.strokeStyle = 'rgba(192, 132, 252, 0.65)';
        this.ctx.lineWidth = 32;
        this.ctx.beginPath();
        this.ctx.moveTo(p3x, p3y);
        this.ctx.lineTo(cur2x, cur2y);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#a855f7';
        this.ctx.lineWidth = 14;
        this.ctx.beginPath();
        this.ctx.moveTo(p3x, p3y);
        this.ctx.lineTo(cur2x, cur2y);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(p3x, p3y);
        this.ctx.lineTo(cur2x, cur2y);
        this.ctx.stroke();

        if (prog2 < 1.0) {
          this.ctx.fillStyle = '#ffffff';
          this.ctx.beginPath();
          this.ctx.arc(cur2x, cur2y, 12, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      this.ctx.strokeStyle = '#e879f9';
      this.ctx.lineWidth = 2.0;
      const activeBranches = Math.floor((prog1 + prog2) * 5);
      for (let b = 0; b < activeBranches; b++) {
        const tVal = (b + 1) / 6;
        const bx = p1x + (p2x - p1x) * tVal;
        const by = p1y + (p2y - p1y) * tVal;
        const offset = Math.sin(this.frameCount * 0.8 + b) * 20;

        this.ctx.beginPath();
        this.ctx.moveTo(bx, by);
        this.ctx.lineTo(bx + (b % 2 === 0 ? 25 : -25), by + offset);
        this.ctx.stroke();
      }

      const ringR = 34 + Math.sin(this.frameCount * 0.4) * 5;
      this.ctx.strokeStyle = '#c084fc';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.arc(tx, ty, ringR, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(tx - 15, ty - 15);
      this.ctx.lineTo(tx + 15, ty + 15);
      this.ctx.moveTo(tx + 15, ty - 15);
      this.ctx.lineTo(tx - 15, ty + 15);
      this.ctx.stroke();

      this.ctx.fillStyle = '#c084fc';
      this.ctx.font = 'bold 24px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🗡️', tx, ty + 8);

      if (this.assassinmonUltimateTimer >= 10 && this.assassinmonUltimateTimer <= 25) {
        const isWhiteFlash = this.frameCount % 2 === 0;
        this.ctx.fillStyle = isWhiteFlash ? 'rgba(255, 255, 255, 0.45)' : 'rgba(232, 121, 249, 0.3)';
        this.ctx.fillRect(0, 0, w, h);

        this.ctx.strokeStyle = isWhiteFlash ? '#ffffff' : '#e879f9';
        this.ctx.lineWidth = 5;
        for (let ray = -3; ray <= 3; ray++) {
          const rayOffset = ray * 60;
          this.ctx.beginPath();
          this.ctx.moveTo(tx - 320 + rayOffset, ty - 220 - rayOffset);
          this.ctx.lineTo(tx + 320 + rayOffset, ty + 220 - rayOffset);
          this.ctx.stroke();

          this.ctx.beginPath();
          this.ctx.moveTo(tx - 320 - rayOffset, ty + 220 + rayOffset);
          this.ctx.lineTo(tx + 320 - rayOffset, ty - 220 + rayOffset);
          this.ctx.stroke();
        }
      }

      if (this.assassinmonUltimateTimer >= 24) {
        const shardAge = this.assassinmonUltimateTimer - 24;
        this.ctx.save();
        for (let i = 0; i < 20; i++) {
          const angle = (i * Math.PI * 2) / 20 + Math.sin(i * 3.4) * 0.4;
          const speed = 4 + Math.abs(Math.sin(i * 9.8)) * 12;
          const dist = shardAge * speed;

          const sx = tx + Math.cos(angle) * dist;
          const sy = ty + Math.sin(angle) * dist;

          const size = 6 + Math.abs(Math.cos(i * 5.2)) * 14 * Math.max(0, 1 - shardAge / 26);
          const rotation = shardAge * 0.08 + i * 0.5;

          this.ctx.beginPath();
          this.ctx.moveTo(sx + Math.cos(rotation) * size, sy + Math.sin(rotation) * size);
          this.ctx.lineTo(sx + Math.cos(rotation + 2.1) * size, sy + Math.sin(rotation + 2.1) * size);
          this.ctx.lineTo(sx + Math.cos(rotation + 4.2) * size, sy + Math.sin(rotation + 4.2) * size);
          this.ctx.closePath();

          const shardGrad = this.ctx.createLinearGradient(sx - size, sy - size, sx + size, sy + size);
          shardGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          shardGrad.addColorStop(0.3, 'rgba(232, 121, 249, 0.6)');
          shardGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.45)');
          shardGrad.addColorStop(1, 'rgba(124, 58, 237, 0.1)');

          this.ctx.fillStyle = shardGrad;
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - shardAge / 26)})`;
          this.ctx.lineWidth = 1.5;
          this.ctx.fill();
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      this.ctx.restore();
    }

    if (this.selectedDraco === 'Shieldmon' && this.shieldmonChargeActive) {
      this.ctx.save();

      const cx = this.shieldmonUltCastX;
      const cy = this.shieldmonUltCastY;
      const radius = this.shieldmonUltRadius;

      const domeAlpha = 0.18 + Math.sin(this.frameCount * 0.15) * 0.05;

      const domeGrad = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
      domeGrad.addColorStop(0, 'rgba(59, 130, 246, 0.0)');
      domeGrad.addColorStop(0.85, 'rgba(59, 130, 246, 0.2)');
      domeGrad.addColorStop(1, 'rgba(30, 64, 175, 0.5)');
      this.ctx.fillStyle = domeGrad;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = 'rgba(96, 165, 250, 0.85)';
      this.ctx.lineWidth = 6;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([15, 10]);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius - 8, -this.frameCount * 0.02, Math.PI * 2 - this.frameCount * 0.02);
      this.ctx.stroke();

      this.ctx.setLineDash([]);
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = 'rgba(96, 165, 250, 0.7)';

      this.ctx.beginPath();
      this.ctx.moveTo(cx - radius, cy - 250);
      this.ctx.lineTo(cx - radius, cy + 250);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(cx + radius, cy - 250);
      this.ctx.lineTo(cx + radius, cy + 250);
      this.ctx.stroke();

      this.ctx.fillStyle = '#1e3a8a';
      this.ctx.fillRect(cx - radius - 6, cy - 40, 12, 80);
      this.ctx.fillRect(cx + radius - 6, cy - 40, 12, 80);
      this.ctx.fillStyle = '#60a5fa';
      this.ctx.fillRect(cx - radius - 3, cy - 30, 6, 60);
      this.ctx.fillRect(cx + radius - 3, cy - 30, 6, 60);

      const shieldY = this.shieldmonShieldY;
      this.ctx.save();
      this.ctx.translate(cx, shieldY);

      let scale = 1.0;
      if (this.shieldmonChargeTimer <= 30) {
        const t = (30 - this.shieldmonChargeTimer);
        scale = 1.0 + Math.sin(t * 0.3) * 0.2 * Math.max(0, 1 - t / 15);
      }
      this.ctx.scale(scale, scale);

      const w = 110;
      const h = 130;

      const shieldPath = new Path2D();
      shieldPath.moveTo(0, -h / 2);
      shieldPath.lineTo(w / 2, -h / 2 + 25);
      shieldPath.lineTo(w / 2, h / 6);
      shieldPath.quadraticCurveTo(w / 2, h / 2, 0, h / 2 + 15);
      shieldPath.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 6);
      shieldPath.lineTo(-w / 2, -h / 2 + 25);
      shieldPath.closePath();

      const metalGrad = this.ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      metalGrad.addColorStop(0, '#fef08a');
      metalGrad.addColorStop(0.3, '#fbbf24');
      metalGrad.addColorStop(0.7, '#d97706');
      metalGrad.addColorStop(1, '#92400e');
      this.ctx.fillStyle = metalGrad;
      this.ctx.fill(shieldPath);

      this.ctx.strokeStyle = '#78350f';
      this.ctx.lineWidth = 6;
      this.ctx.stroke(shieldPath);

      this.ctx.strokeStyle = '#bfdbfe';
      this.ctx.lineWidth = 4;
      this.ctx.fillStyle = '#1e40af';
      const innerPath = new Path2D();
      innerPath.moveTo(0, -h / 2 + 15);
      innerPath.lineTo(w / 3, -h / 2 + 33);
      innerPath.lineTo(w / 3, h / 8);
      innerPath.quadraticCurveTo(w / 3, h / 2 - 10, 0, h / 2 - 2);
      innerPath.quadraticCurveTo(-w / 3, h / 2 - 10, -w / 3, h / 8);
      innerPath.lineTo(-w / 3, -h / 2 + 33);
      innerPath.closePath();
      this.ctx.fill(innerPath);
      this.ctx.stroke(innerPath);

      this.ctx.fillStyle = '#60a5fa';
      this.ctx.beginPath();
      this.ctx.fillRect(-8, -45, 16, 90);
      this.ctx.fillRect(-35, -8, 70, 16);

      const gemGrad = this.ctx.createRadialGradient(0, 0, 1, 0, 0, 12);
      gemGrad.addColorStop(0, '#ffffff');
      gemGrad.addColorStop(0.5, '#60a5fa');
      gemGrad.addColorStop(1, 'rgba(30, 58, 138, 0)');
      this.ctx.fillStyle = gemGrad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 16, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();

      if (this.shieldmonChargeTimer < 30) {
        const age = 30 - this.shieldmonChargeTimer;
        const ringRad = age * (this.shieldmonUltRadius / 30);
        const ringAlpha = Math.max(0, 1 - age / 30);

        this.ctx.strokeStyle = `rgba(96, 165, 250, ${ringAlpha})`;
        this.ctx.lineWidth = 14;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, ringRad, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha * 0.8})`;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, ringRad * 0.9, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      this.ctx.restore();
    }

    stageGimmickManager.draw(
      this.ctx,
      this.level.theme.type,
      this.px,
      this.py,
      this.pWidth,
      this.pHeight,
      this.canvas.width,
      this.canvas.height,
      this.cameraX,
      this.cameraY,
      this.getActiveGrid(),
      this.level.tileSize,
      this.stageNum
    );

    this.ctx.restore();

    if (this.ultimateCinematicActive) {
      const w = this.canvas.width;
      const h = this.canvas.height;

      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, w, 55);
      this.ctx.fillRect(0, h - 55, w, 55);

      this.ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
      this.ctx.strokeStyle = '#eab308';
      this.ctx.lineWidth = 3;
      this.ctx.fillRect(30, h - 125, w - 60, 55);
      this.ctx.strokeRect(30, h - 125, w - 60, 55);

      this.ctx.fillStyle = '#eab308';
      this.ctx.font = '900 13px "Courier New", monospace';
      this.ctx.fillText(`${this.selectedDraco.toUpperCase()} SHOUTS:`, 45, h - 105);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold italic 15px "Courier New", monospace';
      this.ctx.fillText(`"${this.getUltimateVoiceLine()}"`, 45, h - 85);
    }

    if (this.isSurvivalMode) {
      const secondsTotal = Math.max(0, Math.ceil(this.survivalTimer / 60));
      const mins = Math.floor(secondsTotal / 60);
      const secs = secondsTotal % 60;
      const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      this.ctx.save();
      const tw = 240;
      const th = 36;
      const tx = (this.canvas.width - tw) / 2;
      const ty = 12;

      this.ctx.fillStyle = 'rgba(28, 25, 23, 0.88)';
      this.ctx.strokeStyle = secondsTotal <= 15 ? '#ef4444' : '#f59e0b';
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(tx, ty, tw, th);
      this.ctx.strokeRect(tx, ty, tw, th);

      this.ctx.font = 'bold 13px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = secondsTotal <= 15 ? '#fca5a5' : '#fef08a';
      this.ctx.shadowColor = secondsTotal <= 15 ? '#ef4444' : '#f59e0b';
      this.ctx.shadowBlur = 8;
      this.ctx.fillText(
        this.survivalTimer === 0 ? '🛡️ SURVIVED! REACH PORTAL 🌀' : `🛡️ ARENA DEFENSE: ${timeStr}`,
        tx + tw / 2,
        ty + 22
      );
      this.ctx.restore();
    }
  }

  private run = () => {
    if (this.isPaused) return;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.animationFrameId = requestAnimationFrame(this.run);

    const now = performance.now();

    if (!this.lastTime) {
      this.lastTime = now;
      return;
    }

    let elapsed = now - this.lastTime;
    this.lastTime = now;

    // Reset accumulator & cap elapsed if lag spike/tab switch/large delay > 100ms
    if (elapsed > 100 || elapsed < 0) {
      elapsed = this.frameInterval;
      this.accumulator = 0;
    }

    this.accumulator += elapsed;

    // Execute at most 2 physics updates per RAF frame to strictly prevent hyper-speed catchup acceleration
    let updates = 0;
    while (this.accumulator >= this.frameInterval && updates < 2) {
      this.updateGameLogic();
      this.accumulator -= this.frameInterval;
      updates++;
    }

    // Clear excess accumulator remainder if lagging to keep game speed locked strictly at 60 FPS
    if (this.accumulator > this.frameInterval * 2) {
      this.accumulator = 0;
    }

    this.draw();
  };

  private updateGameLogic() {
    this.frameCount++;

    if (this.ultimateCinematicActive) {
      this.ultimateCinematicDuration--;

      if (this.frameCount % 3 === 0) {
        this.particles.push({
          x: this.px + Math.random() * this.pWidth,
          y: this.py + Math.random() * this.pHeight,
          vx: Math.random() * 2 - 1,
          vy: -Math.random() * 3 - 1,
          size: Math.random() * 5 + 3,
          color: '#fbbf24',
          life: 25,
          maxLife: 25
        });
      }

      this.updateParticles();

      if (this.ultimateCinematicDuration <= 0) {
        this.ultimateCinematicActive = false;
        this.unleashUltimate();
      }
      return;
    }

    if (this.pEnergy < this.getMaxEnergy()) {
      const frameRegen = (1.0 / 60) * this.energyRegenRate;
      this.pEnergy = Math.min(this.getMaxEnergy(), this.pEnergy + frameRegen);
      this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());
    }

    if (this.arrowShowerActive) {
      this.arrowShowerDuration--;
      if (this.arrowShowerDuration <= 0) {
        this.arrowShowerActive = false;
        // Closing burst
        for (let p = 0; p < 24; p++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 8 + 3;
          this.particles.push({
            x: this.px + this.pWidth / 2 + (Math.random() - 0.5) * 80,
            y: this.py + this.pHeight / 2,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: Math.random() * 7 + 3,
            color: p % 3 === 0 ? '#10b981' : p % 3 === 1 ? '#34d399' : '#a7f3d0',
            life: 22,
            maxLife: 22
          });
        }
      } else if (this.frameCount % 3 === 0) {
        const rx = this.px - 380 + Math.random() * 760;
        const arrowColor = Math.random() > 0.5 ? '#10b981' : '#34d399';
        this.projectiles.push({
          x: rx,
          y: Math.max(0, this.py - 320),
          vx: (Math.random() - 0.5) * 1.5,
          vy: 14.0,
          width: 10,
          height: 26,
          isEnemy: false,
          damage: Math.floor(this.stats.attack * 1.6),
          color: arrowColor,
          type: 'arrow'
        });
        // Comet trail for this arrow
        for (let t = 0; t < 4; t++) {
          this.particles.push({
            x: rx + (Math.random() - 0.5) * 6,
            y: Math.max(0, this.py - 320) + t * 7,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -3.5,
            size: Math.random() * 4 + 2,
            color: t % 2 === 0 ? '#34d399' : '#a7f3d0',
            life: 14,
            maxLife: 14
          });
        }
        // Sky shimmer ambient
        if (this.frameCount % 6 === 0) {
          this.particles.push({
            x: rx + (Math.random() - 0.5) * 30,
            y: Math.max(0, this.py - 320 + Math.random() * 60),
            vx: (Math.random() - 0.5) * 1.0,
            vy: Math.random() * 1.5,
            size: Math.random() * 5 + 2,
            color: '#6ee7b7',
            life: 18,
            maxLife: 18
          });
        }
      }
    }

    if (this.flymonTornadoActive) {
      this.flymonTornadoTimer--;
      if (this.flymonTornadoTimer <= 0) {
        this.flymonTornadoActive = false;
      } else {
        this.pvy = 0; // Hover player
        const tx = this.flymonTornadoX;
        const ty = this.flymonTornadoY;
        const suckRadius = 300;
        const coreRadius = 150;

        // Visual tornado swirling particles
        if (this.frameCount % 2 === 0) {
          for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * coreRadius;
            const px = tx + Math.cos(angle) * dist;
            const py = ty + (Math.random() - 0.5) * 80;
            this.particles.push({
              x: px,
              y: py,
              vx: -Math.sin(angle) * (3.0 + Math.random() * 2),
              vy: -Math.random() * 4.0 - 1.5,
              size: Math.random() * 5 + 2,
              color: i % 2 === 0 ? '#06b6d4' : '#a5f3fc',
              life: 20,
              maxLife: 20
            });
          }
        }

        // Pull and lift enemies
        this.enemies.forEach(enemy => {
          if (enemy.hp <= 0) return;
          const ex = enemy.x + enemy.width / 2;
          const ey = enemy.y + enemy.height / 2;
          const dist = Math.hypot(ex - tx, ey - ty);

          if (dist <= suckRadius) {
            const dx = tx - ex;
            const dy = ty - ey;
            const len = Math.hypot(dx, dy) || 1;
            const pullForce = (1 - dist / suckRadius) * 6.5;

            // Horizontal pull to center
            enemy.x += (dx / len) * pullForce;

            // Lift them up vertically when they get close to the core (dist <= 100)
            if (dist <= 100) {
              enemy.y -= 4.5;
              enemy.vy = -2.0;
              (enemy as any).isGrounded = false;
              (enemy as any).isLiftedByTornado = true;
              // Swirl effect
              enemy.x += Math.sin(this.frameCount * 0.2 + enemy.id) * 3.5;
            } else {
              (enemy as any).isLiftedByTornado = false;
            }

            // Periodic damage inside the tornado core (dist <= coreRadius)
            if (dist <= coreRadius) {
              if (this.frameCount % 15 === 0) {
                this.damageEnemy(enemy, Math.floor(this.stats.attack * 0.8));
                this.screenShake = 6;
              }
            }
          } else {
            (enemy as any).isLiftedByTornado = false;
          }
        });
      }
    }

    if (this.avatarActive) {
      this.avatarDuration--;
      if (this.avatarDuration <= 0) {
        this.avatarActive = false;
      }
    }

    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.specialCooldown > 0) this.specialCooldown--;
    if (this.pInvulnerableFrames > 0) this.pInvulnerableFrames--;
    if (this.trampolineCooldown > 0) this.trampolineCooldown--;
    if (this.playerStunCooldown > 0) this.playerStunCooldown--;

    if (this.isAttacking) {
      this.attackDuration--;
      if (this.attackDuration <= 0) this.isAttacking = false;
    }

    if (this.shieldActive) {
      this.shieldDuration--;
      if (this.shieldDuration <= 0) this.shieldActive = false;
    }

    if (this.isDemoMode) {
      this.pHP = 9999;
      this.pEnergy = this.getMaxEnergy();

      const positions = [260, 320, 380];

      if (this.enemies.length < 3) {
        this.enemies = positions.map((posX, idx) => ({
          id: 99991 + idx,
          x: posX,
          y: 688,
          vx: 0,
          vy: 0,
          width: 38,
          height: 32,
          type: 'slime',
          hp: 999999999,
          maxHp: 999999999,
          attack: 0,
          defense: 5,
          facing: -1,
          shootCooldown: 0,
          state: 'idle',
          animFrame: 0,
          name: `IMMORTAL SLIME ${idx + 1} 👑`,
          isImmortal: true,
        }));
      } else {
        // Lock all 3 slimes firmly on ground level so knockback explosions never make them fly
        this.enemies.forEach((slime, idx) => {
          slime.x = positions[idx] || (260 + idx * 60);
          slime.y = 328;
          slime.vx = 0;
          slime.vy = 0;
          slime.facing = -1;
          slime.state = 'idle';
          if (slime.hp <= 0) slime.hp = 999999999;
        });
      }
    }

    this.updatePhysics();
    this.updateEntities();
    this.updateParticles();

    if (this.isDemoMode) {
      this.cameraX = 0;
      this.cameraY = Math.max(0, this.levelHeight - (this.canvas.height || 240));
    } else {
      const targetCamX = this.px - this.canvas.width / 2 + this.pWidth / 2;
      this.cameraX += (targetCamX - this.cameraX) * 0.1;
      this.cameraX = Math.max(0, Math.min(this.levelWidth - this.canvas.width, this.cameraX));
      this.cameraY = 0;
    }
  }

  public pause() {
    this.isPaused = true;
    this.accumulator = 0;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.isMegaPixelmon = false;
    this.megaPixelmonTimer = 0;
    this.megaPixelmonScale = 1.0;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.accumulator = 0;
    this.lastTime = performance.now();
    this.run();
  }

  public destroy() {
    this.pause();
    if (!this.isDemoMode) {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      window.removeEventListener('blur', this.handleBlur);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  private checkTrampoline(x: number, y: number): boolean {
    const grid = this.getActiveGrid();
    if (grid.length === 0) return false;
    const ts = this.level.tileSize;
    const col = Math.floor(x / ts);
    const row = Math.floor(y / ts);
    if (col < 0 || col >= grid[0].length || row < 0 || row >= grid.length) {
      return false;
    }
    return grid[row][col] === 'T';
  }

  private checkLandmineDetonation(x: number, y: number) {
    const grid = this.getActiveGrid();
    if (grid.length === 0) return;
    const ts = this.level.tileSize;
    const col = Math.floor(x / ts);
    const row = Math.floor(y / ts);
    if (col < 0 || col >= grid[0].length || row < 0 || row >= grid.length) {
      return;
    }
    if (grid[row][col] === 'M') {
      const rowStr = grid[row];
      grid[row] = rowStr.substring(0, col) + '.' + rowStr.substring(col + 1);

      soundService.playHit();
      this.handlePlayerHit(4, x);
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, FT_LANDMINE_DETONATED.text, FT_LANDMINE_DETONATED.color);

      for (let i = 0; i < 20; i++) {
        this.particles.push({
          x: col * ts + ts / 2,
          y: row * ts + ts / 2,
          vx: Math.random() * 5 - 2.5,
          vy: Math.random() * -5 - 1,
          size: Math.random() * 6 + 3,
          color: '#f97316',
          life: 25,
          maxLife: 25
        });
      }
    }
  }
}
