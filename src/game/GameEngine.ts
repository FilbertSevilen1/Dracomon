import { PlayerStats, InventoryItem } from '../types/game';
import { LevelData, getLevel } from './LevelManager';
import { soundService } from '../services/sound';

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number; // 0 to 100
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
  type: 'arrow' | 'fireball' | 'shield_wave' | 'bomb' | 'axe' | 'sonar' | 'meteor' | 'sun_strike' | 'tornado' | 'giant_cleave' | 'arcane_orb';
  channelTimer?: number;
  targetX?: number;
  targetY?: number;
  hitEnemyIds?: number[];
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

interface Enemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  type: 'slime' | 'goblin_archer' | 'fire_golem' | 'miniboss' | 'king_slime' | 'frost_wyvern' | 'shadow_overlord' | 'dragon_king' | 'bomb_thrower' | 'flying_wyvern' | 'fish' | 'anchor' | 'scallop' | 'killer_whale';
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  facing: number; // -1 or 1
  shootCooldown: number;
  state: 'patrol' | 'alert' | 'charge';
  animFrame: number;
  name?: string;
  stunnedTimer?: number;
  isSuspended?: boolean;
  suspendedTimer?: number;
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
    onStageClear: () => void;
    onPlayerDeath: () => void;
  };

  // Game Loop
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private isPaused = false;

  // Player Physics
  private px = 100;
  private py = 100;
  private pvx = 0;
  private pvy = 0;
  private pWidth = 32;
  private pHeight = 44;
  private pFacing = 1; // 1 = right, -1 = left
  private pGrounded = false;
  private pHP = 10;
  private pMaxHP = 10;
  private pInvulnerableFrames = 0;

  // Draco Specifics
  private jumpCount = 0;
  private maxJumps = 2; // All companions (Jumpmon, Archermon, Shieldmon) have Double Jump!
  private isPlunging = false;
  private attackCooldown = 0;
  private specialCooldown = 0;
  private shieldActive = false;
  private shieldDuration = 0;
  private isAttacking = false;
  private attackDuration = 0;

  // Camera
  private cameraX = 0;
  private cameraY = 0;

  // Inputs
  private keys: { [key: string]: boolean } = {};

  // Entities lists
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private pickups: Pickup[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];

  // Energy & Ultimates
  private pEnergy = 0;
  private energyRegenRate = 1.0;
  private ultimateCinematicActive = false;
  private ultimateCinematicDuration = 0;

  // Ultimate Skills Toggles
  private arrowShowerActive = false;
  private arrowShowerDuration = 0;
  private avatarActive = false;
  private avatarDuration = 0;
  private laserBeamActive = false;
  private laserBeamDuration = 0;

  // World parameters
  private gravity = 0.5;
  private friction = 0.82;
  private levelWidth = 800;
  private levelHeight = 600;
  private enemyIdCounter = 0;

  // Multi-map state
  private currentSubMapIndex = 0;

  // Whitemon & Bird Familiar State
  private birdActive = false;
  private birdX = 0;
  private birdY = 0;
  private birdVx = 0;
  private birdVy = 0;
  private birdState: 'idle' | 'swooping' | 'returning' = 'idle';
  private birdTargetEnemy: Enemy | null = null;
  private birdAttackCooldown = 0;
  private birdRampageTimer = 0;

  // Animations
  private frameCount = 0;

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
      onStageClear: () => void;
      onPlayerDeath: () => void;
    }
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
    
    this.level = getLevel(stageNum);
    this.selectedDraco = selectedDraco;
    this.stats = stats;
    this.callbacks = callbacks;

    this.pHP = stats.hp;
    this.pMaxHP = stats.hp;
    this.energyRegenRate = (stats as any).energyRegen || 1.0;
    this.pEnergy = this.getMaxEnergy();
    this.maxJumps = 2; // All companions (Jumpmon, Archermon, Shieldmon) have Double Jump!

    this.initLevelEntities();
    this.setupInputListeners();
    
    this.lastTime = performance.now();
    this.run();

    // Trigger initial HP & Energy state to HUD
    this.callbacks.onHpChange(this.pHP, this.pMaxHP);
    this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());
  }

  private getActiveGrid(): string[] {
    if (this.level.maps && this.level.maps.length > 0) {
      const idx = Math.max(0, Math.min(this.level.maps.length - 1, this.currentSubMapIndex));
      return this.level.maps[idx].grid;
    }
    return this.level.grid || [];
  }

  private initLevelEntities(preservePlayerPos = false) {
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.particles = [];
    this.floatingTexts = [];

    const grid = this.getActiveGrid();
    this.levelWidth = grid[0].length * this.level.tileSize;
    this.levelHeight = grid.length * this.level.tileSize;

    const ts = this.level.tileSize;
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        const ex = c * ts;
        const ey = r * ts;

        if (char === '@' && !preservePlayerPos) {
          // Player spawn
          this.px = ex;
          this.py = ey + ts - this.pHeight;
        } else if (char === 'c') {
          // Coin
          this.pickups.push({ x: ex + 12, y: ey + 12, width: 16, height: 16, type: 'coin', amount: 5, collected: false });
        } else if (char === 'p') {
          // Potion
          this.pickups.push({ x: ex + 10, y: ey + 10, width: 20, height: 20, type: 'potion', amount: 1, collected: false });
        } else if (char === 's') {
          // Upgrade Stone
          this.pickups.push({ x: ex + 10, y: ey + 10, width: 20, height: 20, type: 'upgrade_stone', amount: 1, collected: false });
        } else if (char === 'F') {
          // Flying Enemy
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
          // Fish enemy
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
          // Moving Anchor
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex,
            y: ey,
            vx: 0,
            vy: 2.0,
            width: 36,
            height: 48,
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
          // Instant-Kill Scallop
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
        } else if (char === 'K' && this.level.isUnderwater) {
          // Killer Whale Boss
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex,
            y: ey,
            vx: -3.0,
            vy: 0,
            width: 80,
            height: 50,
            type: 'killer_whale',
            hp: 120,
            maxHp: 120,
            attack: 8,
            defense: 4,
            facing: -1,
            shootCooldown: 60,
            state: 'patrol',
            animFrame: 0,
            name: 'Leviathan Orca',
          });
        } else if (char === '1') {
          // Slime
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 4,
            y: ey + ts - 24,
            vx: -1.2,
            vy: 0,
            width: 32,
            height: 24,
            type: 'slime',
            hp: 8 + (grid.length * 2), // scales with stage
            maxHp: 8 + (grid.length * 2),
            attack: 2,
            defense: 1,
            facing: -1,
            shootCooldown: 0,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === '2') {
          // Goblin Archer
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
          // Fire Golem
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
          // Bomb Thrower Enemy
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 4,
            y: ey + ts - 36,
            vx: -0.5,
            vy: 0,
            width: 32,
            height: 36,
            type: 'bomb_thrower' as any,
            hp: 20 + (grid.length * 4),
            maxHp: 20 + (grid.length * 4),
            attack: 4,
            defense: 2,
            facing: -1,
            shootCooldown: 120,
            state: 'patrol',
            animFrame: 0,
          });
        } else if (char === 'S') {
          // King Slime Boss
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 48,
            vx: -0.6,
            vy: 0,
            width: 60,
            height: 48,
            type: 'king_slime',
            hp: 80,
            maxHp: 80,
            attack: 5,
            defense: 2,
            facing: -1,
            shootCooldown: 90,
            state: 'patrol',
            animFrame: 0,
            name: 'King Slime Lord'
          });
        } else if (char === 'B') {
          // Boss: Sentinel Archdemon in Stage 2, Fire Lord in Stage 3
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
            hp: isStage2 ? 100 : 140,
            maxHp: isStage2 ? 100 : 140,
            attack: isStage2 ? 6 : 8,
            defense: isStage2 ? 3 : 5,
            facing: -1,
            shootCooldown: 100,
            state: 'patrol',
            animFrame: 0,
            name: isStage2 ? 'Sentinel Archdemon' : 'Dracoguard Fire Lord'
          });
        } else if (char === 'W') {
          // Frostbite Wyvern Boss
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 60,
            vx: -0.6,
            vy: 0,
            width: 68,
            height: 60,
            type: 'frost_wyvern',
            hp: 190,
            maxHp: 190,
            attack: 10,
            defense: 6,
            facing: -1,
            shootCooldown: 80,
            state: 'patrol',
            animFrame: 0,
            name: 'Frostbite Wyvern'
          });
        } else if (char === 'O') {
          // Shadow Overlord Boss
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 68,
            vx: -0.7,
            vy: 0,
            width: 72,
            height: 68,
            type: 'shadow_overlord',
            hp: 250,
            maxHp: 250,
            attack: 12,
            defense: 7,
            facing: -1,
            shootCooldown: 70,
            state: 'patrol',
            animFrame: 0,
            name: 'Shadow Overlord'
          });
        } else if (char === 'X') {
          // Primordial Dragon King Final Boss
          this.enemies.push({
            id: this.enemyIdCounter++,
            x: ex + 2,
            y: ey + ts - 80,
            vx: -0.8,
            vy: 0,
            width: 88,
            height: 80,
            type: 'dragon_king',
            hp: 380,
            maxHp: 380,
            attack: 16,
            defense: 9,
            facing: -1,
            shootCooldown: 60,
            state: 'patrol',
            animFrame: 0,
            name: 'PRIMORDIAL DRAGON KING'
          });
        }
      }
    }
  }

  private setupInputListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    this.keys[key] = true;

    // Prevent spacebar and arrows from scrolling the webpage
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }

    if (e.key === ' ') {
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

  public triggerAction(action: 'left' | 'right' | 'jump' | 'attack' | 'special' | 'down') {
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

    const pxMid = this.px + this.pWidth / 2;
    const pyMid = this.py + this.pHeight / 2;

    // Enter Portals using Jump button!
    if (this.isMapPortal(pxMid, pyMid)) {
      soundService.playLevelUp();
      if (this.level.maps && this.level.maps.length > 0) {
        this.currentSubMapIndex = (this.currentSubMapIndex + 1) % this.level.maps.length;
        this.initLevelEntities();
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'PORTAL ENTERED! 🌀', '#a855f7');
      }
      return;
    }

    const activeBossExists = this.enemies.some(e => this.isBossType(e.type));
    if (!activeBossExists && this.isPortal(pxMid, pyMid)) {
      soundService.playLevelUp();
      this.callbacks.onStageClear();
      this.isPaused = true;
      return;
    }

    // Underwater Jump: Half height (-7 max), but INFINITE swimming jumps!
    if (this.level.isUnderwater) {
      const effectiveJump = Math.min(14, Math.max(10, this.stats.jump));
      this.pvy = -Math.min(7, effectiveJump * 0.48); // Half height jump in water
      this.pGrounded = false;
      this.isPlunging = false;
      soundService.playJump();
      this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight, 6, '#38bdf8');
      return;
    }

    const effectiveJump = Math.min(14, Math.max(10, this.stats.jump));

    if (this.pGrounded) {
      this.pvy = -Math.min(14, effectiveJump * 0.95); // Ground Jump UP (capped at -14)
      this.pGrounded = false;
      this.jumpCount = 1;
      this.isPlunging = false;
      soundService.playJump();
      this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight, 8);
    } else if (this.jumpCount < this.maxJumps) {
      // Double Jump UP for ALL companions!
      this.pvy = -Math.min(14, effectiveJump * 0.98); // Upward double jump velocity (capped at -14)
      this.jumpCount = 2;
      this.isPlunging = false;
      soundService.playJump();

      if (this.selectedDraco === 'Jumpmon') {
        this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight / 2, 12, '#f59e0b');
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'Double Jump!', '#fbbf24');
      } else if (this.selectedDraco === 'Archermon') {
        this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight / 2, 10, '#34d399');
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'Double Jump!', '#34d399');
      } else {
        this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight / 2, 10, '#60a5fa');
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'Double Jump!', '#60a5fa');
      }
    } else if (this.selectedDraco === 'Jumpmon' && !this.pGrounded && !this.isPlunging) {
      // Extra air press triggers rapid Downward Fast Plunge!
      this.isPlunging = true;
      this.pvy = 16;
      soundService.playHit();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'FAST PLUNGE!', '#fbbf24');
    }
  }

  private performAttack() {
    if (this.isPaused || this.pHP <= 0 || this.attackCooldown > 0) return;

    this.isAttacking = true;
    this.attackDuration = 10; // attack animation frames
    this.attackCooldown = 22; // 22 frames cooldown

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
        type: 'arrow'
      });
      this.spawnDustParticles(slashX, slashY, 5, '#34d399');
    } else if (this.selectedDraco === 'Shieldmon') {
      soundService.playHit();
      // Shield Bash - short range melee burst forward
      this.pvx += this.pFacing * 4;
      this.checkMeleeHit(this.px + (this.pFacing === 1 ? this.pWidth : -24), this.py, 36, this.pHeight, this.stats.attack);
      this.spawnDustParticles(slashX, slashY, 8, '#60a5fa');
    } else if (this.selectedDraco === 'Assassinmon') {
      soundService.playHit();
      // Fast Shadow Slash
      this.pvx += this.pFacing * 2.0;
      this.checkMeleeHit(this.px - 16, this.py - 8, this.pWidth + 32, this.pHeight + 16, this.stats.attack);
      this.spawnDustParticles(slashX, slashY, 7, '#c084fc');
      this.attackCooldown = 15; // Faster attack speed!
    } else if (this.selectedDraco === 'Flymon') {
      soundService.playShoot();
      // Poison Needle Projectile
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
        type: 'arrow'
      });
      this.spawnDustParticles(slashX, slashY, 4, '#fda4af');
    } else if (this.selectedDraco === 'Whitemon') {
      soundService.playShoot();
      // Throwing Axe Projectile
      const axeVx = this.pFacing * (this.stats.speed + 5);
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 16,
        y: this.py + this.pHeight / 2 - 6,
        vx: axeVx,
        vy: -1.5,
        width: 20,
        height: 20,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 1.1),
        color: '#e2e8f0',
        type: 'axe'
      });
      this.spawnDustParticles(slashX, slashY, 6, '#e2e8f0');
    } else if (this.selectedDraco === 'Magemon') {
      soundService.playShoot();
      // Arcane Orb Projectile
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
        type: 'arcane_orb'
      });
      this.spawnDustParticles(slashX, slashY, 6, '#c084fc');
    } else {
      // Jumpmon Melee Sword Swing
      soundService.playHit();
      this.checkMeleeHit(this.px - 12, this.py - 12, this.pWidth + 24, this.pHeight + 24, this.stats.attack);
      this.spawnDustParticles(slashX, slashY, 10, '#fbbf24');
    }
  }

  private performSpecial() {
    if (this.isPaused || this.pHP <= 0 || this.specialCooldown > 0) return;

    if (this.selectedDraco === 'Shieldmon') {
      soundService.playBlock();
      this.shieldActive = true;
      this.shieldDuration = 120; // 2 seconds at 60fps
      this.specialCooldown = 300; // 5s cooldown
      
      // CHARGE ULTIMATE DASH INITIATION!
      this.pvx = this.pFacing * 14; // heavy horizontal ram launch
      this.checkMeleeHit(this.px - 20, this.py, this.pWidth + 60, this.pHeight, this.stats.attack * 2.0); // high contact damage
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'SHIELD CHARGE! 🛡️', '#60a5fa');
      
      // Spawn charging shield particles
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
      // Shadow Dash Strike
      soundService.playJump();
      this.specialCooldown = 180; // 3s cooldown
      this.pInvulnerableFrames = 30; // 0.5s invulnerability
      this.pvx = this.pFacing * 16; // high speed dash
      this.checkMeleeHit(this.px - 30, this.py - 10, this.pWidth + 120, this.pHeight + 20, Math.floor(this.stats.attack * 2.2));
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'SHADOW STRIKE! 🥷', '#a855f7');
      
      // Shadow particle trail
      for (let i = 0; i < 12; i++) {
        this.particles.push({
          x: this.px + Math.random() * this.pWidth,
          y: this.py + Math.random() * this.pHeight,
          vx: -this.pFacing * (Math.random() * 3 + 1),
          vy: Math.random() * 3 - 1.5,
          size: Math.random() * 4 + 2,
          color: '#a855f7',
          life: 18,
          maxLife: 18
        });
      }
    } else if (this.selectedDraco === 'Flymon') {
      // Sonic Wind Slice & Hover Lift
      soundService.playJump();
      this.pvy = -12.5; // upward float launch
      this.pGrounded = false;
      this.specialCooldown = 150; // 2.5s cooldown
      
      // Shoot 2 wide wind blade waves
      const waveSpeed = this.stats.speed + 6;
      [-0.1, 0.1].forEach(angle => {
        this.projectiles.push({
          x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 16,
          y: this.py + this.pHeight / 2 - 3,
          vx: this.pFacing * waveSpeed * Math.cos(angle),
          vy: waveSpeed * Math.sin(angle),
          width: 18,
          height: 6,
          isEnemy: false,
          damage: Math.floor(this.stats.attack * 1.3),
          color: '#fda4af',
          type: 'arrow' // Reuse arrow drawing type
        });
      });
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'SONIC TEMPEST! 🌪️', '#f43f5e');
    } else if (this.selectedDraco === 'Jumpmon') {
      // Super Spin Jump - launches player high up and damages surrounding enemies
      soundService.playJump();
      this.pvy = -this.stats.jump * 1.35;
      this.pGrounded = false;
      this.specialCooldown = 180; // 3s cooldown
      this.isAttacking = true;
      this.attackDuration = 25;
      this.checkMeleeHit(this.px - 20, this.py - 20, this.pWidth + 40, this.pHeight + 40, this.stats.attack * 1.5);
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'MEGA SPIN!', '#fbbf24');
    } else if (this.selectedDraco === 'Archermon') {
      // Piercing Volley - fires 3 arrows in a spread
      soundService.playShoot();
      this.specialCooldown = 240; // 4s cooldown
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
      this.specialCooldown = 120; // 2s cooldown
      this.birdActive = true;
      this.birdX = this.px;
      this.birdY = this.py - 40;
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'BIRD FAMILIAR SUMMONED! 🦅', '#38bdf8');
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
      soundService.playShoot();
      this.specialCooldown = 180; // 3.0s cooldown
      
      const spellChoice = Math.floor(Math.random() * 3);
      this.castMagemonSpell(spellChoice);
    }
  }

  private castMagemonSpell(spellType: number) {
    // Find nearest opponent to target meteor and sun strike near enemy
    let nearestEnemy: Enemy | null = null;
    let minDistance = 9999;
    this.enemies.forEach(enemy => {
      const dist = Math.abs(enemy.x - this.px);
      if (dist < minDistance) {
        minDistance = dist;
        nearestEnemy = enemy;
      }
    });

    if (spellType === 0) {
      // ☄️ Chaos Meteor: Spawns near opponent rather than fixed range!
      const targetX = nearestEnemy ? (nearestEnemy as Enemy).x + (nearestEnemy as Enemy).width / 2 : this.px + this.pFacing * 120;
      const targetY = nearestEnemy ? (nearestEnemy as Enemy).y : this.py;
      const startX = targetX - (this.pFacing * 100);
      const startY = Math.max(20, targetY - 160);

      this.projectiles.push({
        x: startX,
        y: startY,
        vx: this.pFacing * 5.0,
        vy: 6.0,
        width: 36,
        height: 36,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 2.6),
        color: '#f97316',
        type: 'meteor'
      });
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, 'CHAOS METEOR! ☄️', '#f97316');
      
    } else if (spellType === 1) {
      // ☀️ Sun Strike: Channels laser for 1.7s (102 frames) then explodes & deals damage during explosion phase!
      const targetX = nearestEnemy ? (nearestEnemy as Enemy).x + (nearestEnemy as Enemy).width / 2 : this.px + this.pFacing * 140;

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
        channelTimer: 102,
        targetX: targetX
      });
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, 'SUN STRIKE! ☀️', '#f59e0b');

    } else {
      // 🌪️ Tornado: Swirling wind lifts enemies into air untargetable/suspended then drops down
      this.projectiles.push({
        x: this.pFacing === 1 ? this.px + this.pWidth : this.px - 36,
        y: this.py - 10,
        vx: this.pFacing * 6.5,
        vy: 0,
        width: 36,
        height: 60,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 2.2),
        color: '#06b6d4',
        type: 'tornado',
        hitEnemyIds: []
      });
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, 'TORNADO! 🌪️', '#06b6d4');
    }
  }

  private checkMeleeHit(x: number, y: number, w: number, h: number, damage: number) {
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

  private getMaxEnergy(): number {
    switch (this.selectedDraco) {
      case 'Jumpmon': return 100;
      case 'Archermon': return 60;
      case 'Shieldmon': return 80;
      case 'Assassinmon': return 150;
      case 'Flymon': return 200;
      case 'Whitemon': return 120;
      case 'Magemon': return 300;
      default: return 100;
    }
  }

  private getUltimateName(): string {
    switch (this.selectedDraco) {
      case 'Jumpmon': return 'Meteor Smackdown';
      case 'Archermon': return 'Arrow Shower';
      case 'Shieldmon': return 'Avatar';
      case 'Assassinmon': return 'Death of Thousand Knives';
      case 'Flymon': return 'Laser Beam';
      case 'Whitemon': return 'Primal Roar';
      case 'Magemon': return 'Trio Orb Blast';
      default: return 'Ultimate';
    }
  }

  private getUltimateVoiceLine(): string {
    switch (this.selectedDraco) {
      case 'Jumpmon': return 'FEEL THE SUN\'S POWER! METEOR SMACKDOWN!!!';
      case 'Archermon': return 'BLIND THE HEAVENS! ARROW SHOWER!!!';
      case 'Shieldmon': return 'UNBREAKABLE WILL! AVATAR STATE!!!';
      case 'Assassinmon': return 'DIE BY A THOUSAND CUTS! DEATH OF THOUSAND KNIVES!!!';
      case 'Flymon': return 'HYPER CHARGED LASER! LAZER BEAM!!!';
      case 'Whitemon': return 'BEHOLD THE PRIMAL ROAR! FAMILIAR RAMPAGE!!!';
      case 'Magemon': return 'BEHOLD THE ANCIENT SPELLS! TRIO ORB BLAST!!!';
      default: return 'UNLEASH THE BEAST!';
    }
  }

  private triggerUltimate() {
    if (this.isPaused || this.pHP <= 0 || this.ultimateCinematicActive) return;

    const dracoLevel = (this.stats as any).level || 1;
    if (dracoLevel < 5) {
      soundService.playHit();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'ULTIMATE UNLOCKS AT LV.5! 🔒', '#a855f7');
      return;
    }

    const cost = this.getMaxEnergy();
    if (this.pEnergy >= cost) {
      this.pEnergy -= cost;
      this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());

      // Start Zoom Cinematic
      this.ultimateCinematicActive = true;
      this.ultimateCinematicDuration = 75; // ~1.25 seconds zoom freeze
      soundService.playLevelUp();
    } else {
      soundService.playHit();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'NEED MORE ENERGY! ⚡', '#f59e0b');
    }
  }

  private unleashUltimate() {
    soundService.playLevelUp();
    this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, `${this.getUltimateName().toUpperCase()}!!! 💥`, '#ef4444');

    if (this.selectedDraco === 'Jumpmon') {
      this.pvy = -16;
      this.pGrounded = false;
      this.isPlunging = true;
      
      this.enemies.forEach(enemy => {
        const dx = Math.abs(this.px - enemy.x);
        if (dx < 600) {
          this.damageEnemy(enemy, Math.floor(this.stats.attack * 3.5));
          this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12, '#f97316');
        }
      });
      // Spawn rain of meteor sparks
      for (let i = 0; i < 20; i++) {
        this.particles.push({
          x: this.px + Math.random() * 400 - 200,
          y: this.py - 100 - Math.random() * 200,
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 8 + 4,
          size: Math.random() * 10 + 5,
          color: '#f97316',
          life: 30,
          maxLife: 30
        });
      }
    } 
    else if (this.selectedDraco === 'Archermon') {
      this.arrowShowerActive = true;
      this.arrowShowerDuration = 180; // 3 seconds
    } 
    else if (this.selectedDraco === 'Shieldmon') {
      this.avatarActive = true;
      this.avatarDuration = 180; // 3 seconds
      this.pInvulnerableFrames = 180;
    } 
    else if (this.selectedDraco === 'Assassinmon') {
      const visibleEnemies = this.enemies.filter(e => Math.abs(this.px - e.x) < 500);
      if (visibleEnemies.length === 0) {
        this.addFloatingText(this.px, this.py - 10, 'NO ENEMIES IN RANGE!', '#94a3b8');
        return;
      }
      this.pInvulnerableFrames = 90;
      visibleEnemies.forEach((enemy, idx) => {
        setTimeout(() => {
          if (enemy.hp > 0) {
            this.px = enemy.x + (Math.random() < 0.5 ? -35 : enemy.width + 15);
            this.py = enemy.y;
            this.pFacing = this.px < enemy.x ? 1 : -1;
            this.damageEnemy(enemy, Math.floor(this.stats.attack * 2.8));
            soundService.playHit();
            this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 10, '#a855f7');
          }
        }, idx * 100);
      });
    } 
    else if (this.selectedDraco === 'Flymon') {
      this.laserBeamActive = true;
      this.laserBeamDuration = 45; // 0.75 seconds
    }
    else if (this.selectedDraco === 'Whitemon') {
      soundService.playLevelUp();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, 'PRIMAL ROAR! 🦁🔊', '#ef4444');
      
      // Launch travelling sound wave projectiles forward in front
      // Damage & Stun happen ON HIT as the sound wave hits each enemy!
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

      // Spawn travelling sound wave particles forward in a cone
      for (let i = 0; i < 30; i++) {
        const angle = (this.pFacing === 1 ? 0 : Math.PI) + (Math.random() * 0.7 - 0.35);
        const speed = Math.random() * 9 + 5;
        this.particles.push({
          x: this.pFacing === 1 ? this.px + this.pWidth : this.px,
          y: this.py + this.pHeight / 2 + (Math.random() * 24 - 12),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 6 + 3,
          color: i % 2 === 0 ? '#38bdf8' : '#fbbf24',
          life: 25,
          maxLife: 25
        });
      }

      // Bird Familiar Rampage
      this.birdActive = true;
      this.birdRampageTimer = 180;
    }
    else if (this.selectedDraco === 'Magemon') {
      soundService.playLevelUp();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 30, 'TRIO ORB BLAST! 🔮✨', '#a855f7');

      // Step A: Giant Cleave (1.5x size arc blade in facing direction)
      const cleaveW = this.pWidth * 2.2;
      const cleaveH = this.pHeight * 2.2;
      const cleaveX = this.pFacing === 1 ? this.px + this.pWidth : this.px - cleaveW;

      this.projectiles.push({
        x: cleaveX,
        y: this.py - 15,
        vx: this.pFacing * 8.5,
        vy: 0,
        width: cleaveW,
        height: cleaveH,
        isEnemy: false,
        damage: Math.floor(this.stats.attack * 3.0),
        color: '#a855f7',
        type: 'giant_cleave',
        hitEnemyIds: []
      } as any);

      // Step B: Followed immediately by ALL 3 Special Skills in succession!
      setTimeout(() => { this.castMagemonSpell(0); }, 100); // ☄️ Chaos Meteor
      setTimeout(() => { this.castMagemonSpell(1); }, 300); // ☀️ Homing Sun Strike
      setTimeout(() => { this.castMagemonSpell(2); }, 500); // 🌪️ Tornado
    }
    
    this.birdX = this.px;
    this.birdY = this.py - 50;
  }

  private damageEnemy(enemy: Enemy, damage: number) {
    // Calculate defense reduction with Avatar double damage multiplier check
    const finalDamage = this.selectedDraco === 'Shieldmon' && this.avatarActive ? damage * 2.0 : damage;
    const damageDealt = Math.max(1, finalDamage - Math.floor(enemy.defense / 2));
    enemy.hp -= damageDealt;
    soundService.playHit();
    this.addFloatingText(enemy.x + enemy.width / 2, enemy.y, `-${damageDealt}`, '#ef4444');
    this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, '#ef4444');

    // Knockback
    enemy.vx = this.pFacing * 1.5;
    enemy.vy = -2.5;

    // Gain energy per hit
    if (!this.ultimateCinematicActive && this.pEnergy < this.getMaxEnergy()) {
      this.pEnergy = Math.min(this.getMaxEnergy(), this.pEnergy + 2.5);
      this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());
    }

    if (enemy.hp <= 0) {
      this.defeatEnemy(enemy);
    }
  }

  private defeatEnemy(enemy: Enemy) {
    // Drop rates
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
      this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 45, 'PRIMORDIAL GOD CONQUERED! 👑', '#f59e0b');
    }

    this.callbacks.onEnemyDefeat(expReward, coinReward);
    this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 15, `+${expReward} EXP`, '#3b82f6');
    this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 30, `+${coinReward} Coins`, '#eab308');
    
    // Gain energy per kill
    if (!this.ultimateCinematicActive && this.pEnergy < this.getMaxEnergy()) {
      this.pEnergy = Math.min(this.getMaxEnergy(), this.pEnergy + 15);
      this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());
    }

    // Spawn drop coin visual particles
    this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15, '#fbbf24');

    // Trigger clear victory immediately if boss is slain
    if (this.isBossType(enemy.type)) {
      const otherBosses = this.enemies.filter(e => e.id !== enemy.id && this.isBossType(e.type));
      if (otherBosses.length === 0) {
        soundService.playLevelUp();
        this.addFloatingText(enemy.x + enemy.width / 2, enemy.y - 60, 'VICTORY! STAGE CLEARED! 🌌', '#a855f7');
        
        // Spawn huge fireworks particles at player!
        for (let i = 0; i < 40; i++) {
          this.particles.push({
            x: this.px + this.pWidth / 2,
            y: this.py + this.pHeight / 2,
            vx: Math.random() * 8 - 4,
            vy: Math.random() * -6 - 2,
            size: Math.random() * 6 + 3,
            color: `hsl(${Math.random() * 360}, 100%, 70%)`,
            life: 60,
            maxLife: 60
          });
        }

        setTimeout(() => {
          this.callbacks.onStageClear();
          this.isPaused = true;
        }, 1500);
      }
    }

    // Remove enemy
    this.enemies = this.enemies.filter(e => e.id !== enemy.id);
  }

  public healPlayer(amount: number) {
    this.pHP = Math.min(this.pMaxHP, this.pHP + amount);
    this.callbacks.onHpChange(this.pHP, this.pMaxHP);
    this.addFloatingText(this.px + this.pWidth / 2, this.py, `+${amount} HP`, '#10b981');
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

    if (this.shieldActive) {
      soundService.playBlock();
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, 'BLOCKED!', '#60a5fa');
      this.pInvulnerableFrames = 30; // Shorter grace period
      // Short knockback
      const dir = this.px > sourceX ? 1 : -1;
      this.pvx = dir * 1.5;
      return;
    }

    const netDamage = Math.max(1, damage - Math.floor(this.stats.defense / 2));
    this.pHP = Math.max(0, this.pHP - netDamage);
    this.callbacks.onHpChange(this.pHP, this.pMaxHP);
    this.pInvulnerableFrames = 60; // 1s at 60fps

    soundService.playHit();
    this.addFloatingText(this.px + this.pWidth / 2, this.py, `-${netDamage} HP`, '#ef4444');
    this.spawnDustParticles(this.px + this.pWidth / 2, this.py + this.pHeight / 2, 10, '#ef4444');

    // Knockback
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

  private isBossType(type: string): boolean {
    return ['king_slime', 'miniboss', 'frost_wyvern', 'shadow_overlord', 'dragon_king', 'killer_whale'].includes(type);
  }

  private updatePhysics() {
    // Horizontal Movement
    let speedMultiplier = 1.0;

    // Shieldmon Special Charge Phase (First 30 frames / 0.5s of block)
    if (this.selectedDraco === 'Shieldmon' && this.shieldActive && this.shieldDuration > 90) {
      this.pvx = this.pFacing * 9.5;
      
      // Damage enemies along the dash path
      this.checkMeleeHit(this.px - 10, this.py, this.pWidth + 20, this.pHeight, Math.floor(this.stats.attack * 0.45));
      
      // Spawn trail particles
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

    // Apply friction
    this.pvx *= this.friction;
    if (Math.abs(this.pvx) < 0.1) this.pvx = 0;

    // Apply gravity & velocity caps
    this.pvy += this.gravity;
    if (this.pvy > 10) this.pvy = 10; // terminal falling velocity
    if (this.pvy < -14) this.pvy = -14; // capped jump upward velocity (-14 max)

    // Move player X
    const newPx = this.px + this.pvx;
    if (this.pvx !== 0) {
      // Bounding box horizontal check
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
    }

    // Move player Y
    const newPy = this.py + this.pvy;
    const leftEdge = this.px + 4;
    const rightEdge = this.px + this.pWidth - 4;
    const ts = this.level.tileSize;
    const isDropKey = this.keys['s'] || this.keys['arrowdown'];

    if (this.pvy < 0) {
      // Jumping upwards
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
      // Moving down or standing still (pvy >= 0)
      const newBottom = newPy + this.pHeight;
      const oldBottom = this.py + this.pHeight;

      // Solid block check (#)
      const collidesSolidBottom = this.isSolid(leftEdge, newBottom) || this.isSolid(rightEdge, newBottom);

      // Wooden one-way platform check (=)
      let onPlatform = false;
      let platformTopY = 0;

      if (!collidesSolidBottom && !isDropKey) {
        // Test if feet line touches or passes platform tile
        const platformLeft = this.checkPlatformOneWay(leftEdge, newBottom);
        const platformRight = this.checkPlatformOneWay(rightEdge, newBottom);

        if (platformLeft || platformRight) {
          const tileRow = Math.floor(newBottom / ts);
          platformTopY = tileRow * ts;

          // Check if previous bottom position was at or above platform top (+12px grace zone for gravity step)
          if (oldBottom <= platformTopY + 12) {
            onPlatform = true;
          }
        }
      }

      const wasPlunging = this.isPlunging;

      // Jumpmon enters plunge state whenever falling downwards
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

      // Trigger Ground Shockwave when Jumpmon reaches ground while plunging!
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
        this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, 'GROUND SHOCKWAVE! 🔥', '#ef4444');
      }
    }

    // Jumpmon Plunge Attack Mid-Air Physics & Enemy Hit Bounce Back
    if (this.selectedDraco === 'Jumpmon' && this.isPlunging && !this.pGrounded && this.pvy > 0) {
      // Flame trail particles during plunge descent
      if (Math.random() < 0.7) {
        this.spawnDustParticles(
          this.px + Math.random() * this.pWidth,
          this.py + this.pHeight,
          2,
          '#f59e0b'
        );
      }

      // Check collision against enemies during descent!
      const effectiveJump = Math.max(10, this.stats.jump);
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0) continue;

        if (
          this.px < enemy.x + enemy.width &&
          this.px + this.pWidth > enemy.x &&
          this.py + this.pHeight >= enemy.y &&
          this.py <= enemy.y + enemy.height
        ) {
          // Plunge hit enemy! Deal heavy damage
          const plungeDamage = Math.floor(this.stats.attack * 2.8);
          this.damageEnemy(enemy, plungeDamage);

          // BOUNCE BACK HIGH UP INTO THE AIR!
          this.pvy = -effectiveJump * 1.25;
          this.jumpCount = 1; // Resets jump count so Jumpmon can double jump again!
          this.isPlunging = false;
          soundService.playJump();

          // Spawn explosion particles & floating text
          this.spawnDustParticles(this.px + this.pWidth / 2, enemy.y, 18, '#ef4444');
          this.addFloatingText(this.px + this.pWidth / 2, this.py - 20, 'BOUNCE STRIKE! 💥', '#fbbf24');
          break;
        }
      }
    }

    // Out of bounds (falling into sky/chasm)
    if (this.py > this.levelHeight + 100) {
      this.handlePlayerHit(6, this.px);
      // Respawn near the top
      this.px = Math.max(100, this.px - 200);
      this.py = 50;
      this.pvx = 0;
      this.pvy = 0;
    }

    // Trampoline Bouncing check
    const tLeft = this.px + 4;
    const tRight = this.px + this.pWidth - 4;
    const tBottom = this.py + this.pHeight;
    if (this.checkTrampoline(tLeft, tBottom) || this.checkTrampoline(tRight, tBottom)) {
      soundService.playJump();
      this.pvy = -16; // High bounce capped at 16
      this.pGrounded = false;
      this.jumpCount = 1;
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 15, 'BOING! 🌀', '#38bdf8');
      
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

    // Landmine checking
    this.checkLandmineDetonation(this.px + this.pWidth / 2, this.py + this.pHeight - 4);

    // Hazard spikes/lava contact
    const pxMid = this.px + this.pWidth / 2;
    const pyBottom = this.py + this.pHeight - 2;
    const hazard = this.getHazard(pxMid, pyBottom) || this.getHazard(this.px + 4, pyBottom) || this.getHazard(this.px + this.pWidth - 4, pyBottom);
    if (hazard === 'spike') {
      this.handlePlayerHit(5, pxMid);
    }
  }

  private updateEntities() {
    const ts = this.level.tileSize;

    // Pickups
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
          this.addFloatingText(pickup.x, pickup.y, `+${pickup.amount} Coins`, '#fbbf24');
        } else if (pickup.type === 'potion') {
          this.callbacks.onItemCollect('potion');
          this.addFloatingText(pickup.x, pickup.y, '+1 Potion', '#10b981');
        } else if (pickup.type === 'upgrade_stone') {
          this.callbacks.onItemCollect('upgrade_stone');
          this.addFloatingText(pickup.x, pickup.y, '+1 Upgrade Stone', '#a855f7');
        }
      }
    });

    // Projectiles
    this.projectiles.forEach((proj, index) => {
      if ((proj as any).type === 'bomb') {
        // Bomb Physics (Gravity and bouncing)
        proj.vy = (proj.vy || 0) + 0.24;
        
        // Move X
        const nextX = proj.x + proj.vx;
        if (this.isSolid(nextX, proj.y) || nextX < 0 || nextX > this.levelWidth) {
          proj.vx = -proj.vx * 0.65; // bounce horizontally
        } else {
          proj.x = nextX;
        }

        // Move Y
        const nextY = proj.y + proj.vy;
        if (this.isSolid(proj.x, nextY + proj.height)) {
          proj.vy = -Math.abs(proj.vy) * 0.55; // bounce vertically
          proj.vx *= 0.8; // friction
          if (Math.abs(proj.vy) < 0.8) proj.vy = 0;
        } else {
          proj.y = nextY;
        }

        // Timer countdown
        if ((proj as any).timer !== undefined) {
          (proj as any).timer--;
          if ((proj as any).timer <= 0) {
            // EXPLODE!
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
            
            // Check player overlap for splash damage
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
          // Spawn fiery ember trail
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

          // Check ground / solid block collision
          if (this.isSolid(proj.x + proj.width / 2, proj.y + proj.height) || proj.y > this.levelHeight - 40) {
            soundService.playHit();
            // Meteor Detonation! Spawns rolling fire explosion
            this.checkMeleeHit(proj.x - 40, proj.y - 20, 120, 60, proj.damage);
            this.spawnDustParticles(proj.x + proj.width / 2, proj.y + proj.height, 20, '#f97316');
            this.addFloatingText(proj.x, proj.y - 10, 'METEOR IMPACT! ☄️💥', '#f97316');

            // Spawn rolling ground fire projectile
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

            // Channeling Laser Animation Particles
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
              // DETONATION BEGINS! (Channels 1.7s then explodes & deals damage during explosion phase)
              soundService.playShoot();
              (proj as any).isExploding = true;
              (proj as any).explosionTimer = 20; // 20 frames explosion phase
              this.addFloatingText(proj.targetX! - 20, this.py - 20, 'SOLAR EXPLOSION! ☀️💥', '#f59e0b');
            }
            return;
          }

          // EXPLOSION PHASE: Deals damage continuously during explosion frames!
          if ((proj as any).isExploding) {
            (proj as any).explosionTimer--;
            
            // Deal damage during explosion phase
            this.checkMeleeHit(proj.targetX! - 26, 0, 52, this.canvas.height, Math.ceil(proj.damage / 4));
            
            // Explosion flare particles
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

          if (proj.x < 0 || proj.x > this.levelWidth) {
            this.projectiles.splice(index, 1);
            return;
          }
        }
        else if (proj.type === 'giant_cleave') {
          proj.x += proj.vx;
          if (proj.x < 0 || proj.x > this.levelWidth) {
            this.projectiles.splice(index, 1);
            return;
          }
        }
        else {
          proj.x += proj.vx;
          proj.y += proj.vy;
          if (this.isSolid(proj.x, proj.y) || proj.x < 0 || proj.x > this.levelWidth) {
            this.projectiles.splice(index, 1);
            return;
          }
        }
      } else {
        proj.x += proj.vx;
        proj.y += proj.vy;

        // Wall collision
        if (this.isSolid(proj.x, proj.y) || proj.x < 0 || proj.x > this.levelWidth) {
          this.projectiles.splice(index, 1);
          return;
        }
      }

      // Hits
      if (proj.isEnemy) {
        // Hits player
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
        // Hits enemy
        this.enemies.forEach(enemy => {
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
                enemy.stunnedTimer = 180; // 3s Stun on hit!
                this.damageEnemy(enemy, proj.damage);
                soundService.playHit();
                this.spawnDustParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 12, '#f59e0b');
                this.addFloatingText(enemy.x, enemy.y - 10, 'STUNNED! 💫', '#fbbf24');
              }
            } else if (proj.type === 'tornado') {
              const hitSet: number[] = (proj as any).hitEnemyIds || ((proj as any).hitEnemyIds = []);
              if (!hitSet.includes(enemy.id)) {
                hitSet.push(enemy.id);
                enemy.isSuspended = true;
                enemy.suspendedTimer = 90; // Lift for 1.5 seconds!
                this.damageEnemy(enemy, proj.damage);
                soundService.playHit();
                this.addFloatingText(enemy.x, enemy.y - 15, 'LIFTED INTO TORNADO! 🌪️', '#06b6d4');
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
              // Damage handled continuously in explosion phase!
            } else {
              this.damageEnemy(enemy, proj.damage);
              this.projectiles.splice(index, 1);
            }
          }
        });
      }
    });

    // Enemies update
    this.enemies.forEach(enemy => {
      if (enemy.stunnedTimer && enemy.stunnedTimer > 0) {
        enemy.stunnedTimer--;
        return; // Stunned enemies skip movement & attacks!
      }

      let grounded = false;

      if (enemy.type === 'flying_wyvern' || enemy.type === 'fish') {
        enemy.x += enemy.vx;
        enemy.y += Math.sin(this.frameCount * 0.1 + enemy.id) * 1.2;
        if (this.isSolid(enemy.x, enemy.y) || enemy.x < 10 || enemy.x > this.levelWidth - 40) {
          enemy.vx = -enemy.vx;
          enemy.facing = enemy.vx > 0 ? 1 : -1;
        }
      } else if (enemy.type === 'anchor') {
        enemy.y += enemy.vy;
        if (enemy.y > 380 || enemy.y < 40) {
          enemy.vy = -enemy.vy;
        }
      } else if (enemy.type === 'scallop') {
        // Stationary clam trap
      } else if (enemy.type === 'killer_whale') {
        enemy.x += enemy.vx;
        if (this.isSolid(enemy.x, enemy.y) || enemy.x < 10 || enemy.x > this.levelWidth - 80) {
          enemy.vx = -enemy.vx;
          enemy.facing = enemy.vx > 0 ? 1 : -1;
        }
        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0) {
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
      } else {
        enemy.vy += this.gravity;
        enemy.y += enemy.vy;

        // Platform check
        const left = enemy.x;
        const right = enemy.x + enemy.width;
        const bottom = enemy.y + enemy.height;

        const collidesBottom = this.isSolid(left + 2, bottom) || this.isSolid(right - 2, bottom);
        if (collidesBottom) {
          enemy.y = Math.floor(bottom / ts) * ts - enemy.height;
          enemy.vy = 0;
          grounded = true;
        }
      }

      // Patrol movement
      if (
        enemy.type === 'slime' ||
        enemy.type === 'fire_golem' ||
        enemy.type === 'miniboss' ||
        enemy.type === 'king_slime' ||
        enemy.type === 'frost_wyvern' ||
        enemy.type === 'shadow_overlord' ||
        enemy.type === 'dragon_king' ||
        enemy.type === 'bomb_thrower'
      ) {
        enemy.x += enemy.vx;

        // Turn around at walls or edges
        const nextX = enemy.vx > 0 ? enemy.x + enemy.width + 4 : enemy.x - 4;
        const groundAhead = this.isSolid(nextX, enemy.y + enemy.height + 4) || this.checkPlatformOneWay(nextX, enemy.y + enemy.height + 4);
        const wallAhead = this.isSolid(nextX, enemy.y + 4) || this.isSolid(nextX, enemy.y + enemy.height - 4);

        if (wallAhead || (grounded && !groundAhead)) {
          enemy.vx = -enemy.vx;
          enemy.facing = enemy.vx > 0 ? 1 : -1;
        }
      }

      // Boss & Archer Shooting AI
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

        // Facing direction towards player
        enemy.facing = dx > 0 ? 1 : -1;

        if (Math.abs(dx) < 450 && Math.abs(dy) < 200) {
          enemy.shootCooldown--;
          if (enemy.shootCooldown <= 0) {
            soundService.playShoot();

            if (enemy.type === 'dragon_king') {
              // 5-arrow Bullet-Hell Spread
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
              // 3-way Shadow Void Energy Spread
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
              // 3-way Ice Arrow Spread
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
              // Slime Lord Stomp & Slime Shoot
              enemy.shootCooldown = 90;
              enemy.vy = -4; // Slime Hop
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
              // Fire Lord Fireball
              enemy.shootCooldown = 80;
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
              // Goblin Archer
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

      // Bomb Thrower AI
      if (enemy.type === 'bomb_thrower') {
        const dx = this.px - enemy.x;
        const dy = this.py - enemy.y;
        
        enemy.facing = dx > 0 ? 1 : -1;
        
        if (Math.abs(dx) < 360 && Math.abs(dy) < 180) {
          enemy.shootCooldown--;
          if (enemy.shootCooldown <= 0) {
            enemy.shootCooldown = 120; // 2 seconds
            soundService.playShoot();
            
            // Spawn bomb projectile with upward arc!
            this.projectiles.push({
              x: enemy.facing === 1 ? enemy.x + enemy.width : enemy.x - 12,
              y: enemy.y - 4,
              vx: enemy.facing * 3.5,
              vy: -6, // throw upwards!
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

      // Contact damage with player
      if (
        this.px < enemy.x + enemy.width &&
        this.px + this.pWidth > enemy.x &&
        this.py < enemy.y + enemy.height &&
        this.py + this.pHeight > enemy.y
      ) {
        this.handlePlayerHit(enemy.attack, enemy.x + enemy.width / 2);
      }
    });

    // Update Whitemon's Bird Familiar AI
    this.updateBirdFamiliar();
  }

  private updateBirdFamiliar() {
    if (!this.birdActive) return;

    if (this.birdRampageTimer > 0) {
      this.birdRampageTimer--;
    }

    const isRampage = this.birdRampageTimer > 0;
    const speed = isRampage ? 11 : 6.5;

    // Decrement attack cooldown
    if (this.birdAttackCooldown > 0) {
      this.birdAttackCooldown--;
    }

    const homeX = this.px + (this.pFacing === 1 ? -15 : this.pWidth + 15);
    const homeY = this.py - 30 + Math.sin(this.frameCount * 0.15) * 6;

    if (this.birdState === 'idle') {
      // Smoothly hover near Whitemon
      const dx = homeX - this.birdX;
      const dy = homeY - this.birdY;
      this.birdX += dx * 0.15;
      this.birdY += dy * 0.15;

      // Look for target if cooldown ready
      if (this.birdAttackCooldown <= 0) {
        // Find nearest alive enemy within 250px (half range)
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
      // Move towards target enemy
      if (!this.birdTargetEnemy || this.birdTargetEnemy.hp <= 0) {
        // Target defeated or lost, return home
        this.birdState = 'returning';
        this.birdTargetEnemy = null;
      } else {
        const tx = this.birdTargetEnemy.x + this.birdTargetEnemy.width / 2;
        const ty = this.birdTargetEnemy.y + this.birdTargetEnemy.height / 2;

        const dx = tx - this.birdX;
        const dy = ty - this.birdY;
        const dist = Math.hypot(dx, dy);

        if (dist < 20) {
          // HIT TARGET! Deal damage
          const damage = Math.floor(this.stats.attack * (isRampage ? 1.4 : 0.85));
          this.damageEnemy(this.birdTargetEnemy, damage);
          soundService.playHit();

          // Spawn feather & slash particles
          this.spawnDustParticles(tx, ty, 8, isRampage ? '#f97316' : '#38bdf8');
          this.addFloatingText(tx, ty - 10, `${damage} 🦅`, isRampage ? '#f97316' : '#38bdf8');

          // Return to Whitemon
          this.birdState = 'returning';
          this.birdAttackCooldown = isRampage ? 10 : 40; // Faster attacks during rampage!
          this.birdTargetEnemy = null;
        } else {
          // Move towards target
          this.birdX += (dx / dist) * speed;
          this.birdY += (dy / dist) * speed;
        }
      }
    } else if (this.birdState === 'returning') {
      // Fly back to Whitemon
      const dx = homeX - this.birdX;
      const dy = homeY - this.birdY;
      const dist = Math.hypot(dx, dy);

      if (dist < 25) {
        // Returned home!
        this.birdState = 'idle';
      } else {
        this.birdX += (dx / dist) * (speed * 1.1);
        this.birdY += (dy / dist) * (speed * 1.1);
      }
    }
  }

  private updateParticles() {
    this.particles.forEach((part, index) => {
      part.x += part.vx;
      part.y += part.vy;
      part.vy += 0.08; // soft gravity
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
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.5;
      const maxLife = Math.random() * 20 + 10;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1, // bias upwards
        color,
        size: Math.random() * 3 + 2,
        life: maxLife,
        maxLife,
      });
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string) {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 100,
    });
  }

  // DRAW GAME
  private draw() {
    const ts = this.level.tileSize;
    
    // Clear canvas
    this.ctx.fillStyle = this.level.theme.skyColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grid sky background gradient details
    this.ctx.save();
    this.ctx.globalAlpha = 0.06;
    this.ctx.strokeStyle = '#000000';
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
    // Translate context based on camera
    if (this.ultimateCinematicActive) {
      const centerX = this.px + this.pWidth / 2;
      const centerY = this.py + this.pHeight / 2;
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(2.2, 2.2); // 2.2x zoom-in focus
      this.ctx.translate(-centerX, -centerY);
    } else {
      this.ctx.translate(-this.cameraX, -this.cameraY);
    }

    // Draw Map Layout
    const activeGrid = this.getActiveGrid();
    for (let r = 0; r < activeGrid.length; r++) {
      const row = activeGrid[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        const ex = c * ts;
        const ey = r * ts;

        // Skip drawn tiles outside camera viewport view to optimize
        if (ex + ts < this.cameraX || ex > this.cameraX + this.canvas.width) continue;

        if (char === '#') {
          // Solid Block
          this.ctx.fillStyle = this.level.theme.solidColor;
          this.ctx.fillRect(ex, ey, ts, ts);
          this.ctx.strokeStyle = this.level.theme.borderColor;
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(ex, ey, ts, ts);

          // Draw grassy top
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          this.ctx.fillRect(ex + 1, ey + 1, ts - 2, 5);
        } else if (char === '=') {
          // Platform
          this.ctx.fillStyle = this.level.theme.platformColor;
          this.ctx.fillRect(ex, ey, ts, 12);
          this.ctx.strokeStyle = this.level.theme.borderColor;
          this.ctx.lineWidth = 1.5;
          this.ctx.strokeRect(ex, ey, ts, 12);
        } else if (char === '*') {
          // Spikes/Lava
          this.ctx.fillStyle = '#ef4444';
          this.ctx.beginPath();
          this.ctx.moveTo(ex, ey + ts);
          this.ctx.lineTo(ex + ts / 2, ey);
          this.ctx.lineTo(ex + ts, ey + ts);
          this.ctx.closePath();
          this.ctx.fill();

          this.ctx.fillStyle = '#f97316';
          this.ctx.beginPath();
          this.ctx.moveTo(ex + 6, ey + ts);
          this.ctx.lineTo(ex + ts / 2, ey + 10);
          this.ctx.lineTo(ex + ts - 6, ey + ts);
          this.ctx.closePath();
          this.ctx.fill();
        } else if (char === 'T') {
          // Draw spring board trampoline
          this.ctx.fillStyle = '#0284c7'; // blue base
          this.ctx.fillRect(ex + 4, ey + ts - 8, ts - 8, 8);
          // spring coil
          this.ctx.strokeStyle = '#94a3b8';
          this.ctx.lineWidth = 2.5;
          this.ctx.beginPath();
          this.ctx.moveTo(ex + 8, ey + ts - 4);
          this.ctx.lineTo(ex + ts - 8, ey + ts - 4);
          this.ctx.stroke();
          // bouncy pad
          this.ctx.fillStyle = '#38bdf8'; // light blue pad
          this.ctx.fillRect(ex + 2, ey + ts - 14, ts - 4, 6);
        } else if (char === 'M') {
          // Draw mini landmine indicator
          this.ctx.fillStyle = '#1e293b'; // slate dark base
          this.ctx.fillRect(ex + 10, ey + ts - 6, ts - 20, 6);
          
          // Blinking light
          const blink = Math.floor(this.frameCount / 12) % 2 === 0;
          this.ctx.fillStyle = blink ? '#ef4444' : '#7f1d1d';
          this.ctx.fillRect(ex + ts / 2 - 2, ey + ts - 10, 4, 4);
        } else if (char === 'K') {
          // Draw sliding steel skewer
          const skewerOffset = Math.sin((this.frameCount + c * 3) * 0.05) * (ts * 0.65);
          this.ctx.fillStyle = '#64748b'; // slate metal
          this.ctx.fillRect(ex + 14, ey + ts - 4 - skewerOffset, 12, ts + skewerOffset);
          
          // Draw sharp skewer tip
          this.ctx.fillStyle = '#94a3b8';
          this.ctx.beginPath();
          this.ctx.moveTo(ex + 14, ey + ts - 4 - skewerOffset);
          this.ctx.lineTo(ex + 20, ey + ts - 12 - skewerOffset);
          this.ctx.lineTo(ex + 26, ey + ts - 4 - skewerOffset);
          this.ctx.closePath();
          this.ctx.fill();

          // Skewer damage overlap collision check
          const skewerTop = ey + ts - 12 - skewerOffset;
          if (
            this.px < ex + 26 &&
            this.px + this.pWidth > ex + 14 &&
            this.py + this.pHeight > skewerTop &&
            this.py < ey + ts
          ) {
            this.handlePlayerHit(3, ex + 20); // 3 damage
          }
        } else if (char === 'E') {
          // Exploding fire torrent
          const cycle = (this.frameCount + c * 5) % 180;
          this.ctx.fillStyle = '#374151'; // dark volcanic stone base
          this.ctx.fillRect(ex + 4, ey + ts - 8, ts - 8, 8);
          
          if (cycle > 110 && cycle <= 130) {
            // warning sparkles
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
            // Eruption!
            const colHeight = 160; // 4 tiles
            const fireGrad = this.ctx.createLinearGradient(0, ey + ts - 8, 0, ey + ts - colHeight);
            fireGrad.addColorStop(0, '#ef4444');
            fireGrad.addColorStop(0.5, '#f97316');
            fireGrad.addColorStop(1, 'rgba(251, 191, 36, 0.1)');
            
            this.ctx.fillStyle = fireGrad;
            this.ctx.fillRect(ex + 8, ey + ts - colHeight, ts - 16, colHeight);
            
            // Continuous player check
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
          // Sub-map Portal ('m')
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
        } else if (char === 'P') {
          // Swirling Portal - only show if boss is defeated!
          const activeBossExists = this.enemies.some(e => this.isBossType(e.type));
          if (!activeBossExists) {
            const angle = (this.frameCount * 0.05) % (Math.PI * 2);
            this.ctx.save();
            this.ctx.translate(ex + ts / 2, ey + ts / 2);
            this.ctx.rotate(angle);
            
            const grad = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
            grad.addColorStop(0, '#a855f7');
            grad.addColorStop(0.5, '#6366f1');
            grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
            
            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 24, 0, Math.PI * 2);
            this.ctx.fill();

            // Portal swirls
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 16, 0, Math.PI, false);
            this.ctx.stroke();

            this.ctx.restore();
          }
        }
      }
    }

    // Draw Pickups
    this.pickups.forEach(pickup => {
      if (pickup.collected) return;

      const bounce = Math.sin(this.frameCount * 0.08 + pickup.x) * 4;

      if (pickup.type === 'coin') {
        // Gold Coin
        this.ctx.fillStyle = '#eab308';
        this.ctx.strokeStyle = '#ca8a04';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(pickup.x + pickup.width / 2, pickup.y + pickup.height / 2 + bounce, 7, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Inner shines
        this.ctx.fillStyle = '#fef08a';
        this.ctx.beginPath();
        this.ctx.arc(pickup.x + pickup.width / 2 - 2, pickup.y + pickup.height / 2 + bounce - 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (pickup.type === 'potion') {
        // Red HP Potion
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(pickup.x + 3, pickup.y + 6 + bounce, 14, 12);
        this.ctx.fillStyle = '#ffffff'; // lid
        this.ctx.fillRect(pickup.x + 6, pickup.y + 2 + bounce, 8, 4);

        // outline
        this.ctx.strokeStyle = '#7f1d1d';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(pickup.x + 3, pickup.y + 6 + bounce, 14, 12);
      } else if (pickup.type === 'upgrade_stone') {
        // Purple Diamond Crystal
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

    // Draw Projectiles
    this.projectiles.forEach(proj => {
      this.ctx.fillStyle = proj.color;
      
      if (proj.type === 'fireball') {
        // Glowing orange fireball circles
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
        
        // Outer directional travelling sound wave arc
        this.ctx.beginPath();
        this.ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, waveRadius, startAngle, endAngle);
        this.ctx.stroke();

        // Inner golden sound wave echo arc
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

        // Black Bomb Sphere
        this.ctx.fillStyle = '#0f172a';
        this.ctx.strokeStyle = '#475569';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, proj.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Metallic Fuse Cap
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillRect(cx - 2, cy - proj.width / 2 - 3, 4, 3);

        // Glowing Sparkling Fuse Flame
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

        if (channelTimer > 0) {
          // Channeling Laser Beam (0s to 1.7s)
          const chargeProgress = 1 - (channelTimer / 102);

          // Beaming Light Column
          this.ctx.fillStyle = `rgba(253, 224, 71, ${0.15 + chargeProgress * 0.2})`;
          this.ctx.fillRect(tx - 16, 0, 32, this.canvas.height);

          // Center Laser Filament Line
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + chargeProgress * 0.5})`;
          this.ctx.lineWidth = 3 + chargeProgress * 4;
          this.ctx.beginPath();
          this.ctx.moveTo(tx, 0);
          this.ctx.lineTo(tx, this.canvas.height);
          this.ctx.stroke();

          // Expanding Solar Target Sigil on Ground
          const ringRadius = 24 * chargeProgress + 6;
          this.ctx.strokeStyle = '#f59e0b';
          this.ctx.lineWidth = 2.5;
          this.ctx.beginPath();
          this.ctx.arc(tx, this.py + this.pHeight - 5, ringRadius, 0, Math.PI * 2);
          this.ctx.stroke();

          // Pulsing Core
          this.ctx.fillStyle = '#fef08a';
          this.ctx.beginPath();
          this.ctx.arc(tx, this.py + this.pHeight - 5, 5, 0, Math.PI * 2);
          this.ctx.fill();

        } else if (isExploding) {
          // DETONATION EXPLOSION PHASE (1.7s complete -> erupting solar laser pillar!)
          const expTimer = (proj as any).explosionTimer || 20;
          const alpha = expTimer / 20;

          // Blinding Solar Pillar Core
          this.ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
          this.ctx.fillRect(tx - 20, 0, 40, this.canvas.height);

          // Outer Solar Flame Walls
          this.ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.8})`;
          this.ctx.fillRect(tx - 32, 0, 12, this.canvas.height);
          this.ctx.fillRect(tx + 20, 0, 12, this.canvas.height);

          // Erupting Radial Shockwave Ring at ground
          const shockRadius = (20 - expTimer) * 4 + 10;
          this.ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
          this.ctx.lineWidth = 4;
          this.ctx.beginPath();
          this.ctx.arc(tx, this.py + this.pHeight - 5, shockRadius, 0, Math.PI * 2);
          this.ctx.stroke();
        }
        this.ctx.restore();

      } else if (proj.type === 'meteor') {
        this.ctx.save();
        const cx = proj.x + proj.width / 2;
        const cy = proj.y + proj.height / 2;

        // Rotating Magma Texture Angle
        this.ctx.translate(cx, cy);
        this.ctx.rotate(this.frameCount * 0.15);

        // Fiery Glowing Meteor Core
        const grad = this.ctx.createRadialGradient(0, 0, 3, 0, 0, proj.width / 2 + 4);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.35, '#f97316');
        grad.addColorStop(0.75, '#dc2626');
        grad.addColorStop(1, '#451a03');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, proj.width / 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Magma Rock Surface Fractures
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

        // Dynamic 3D Swirling Wind Vortex Funnel (Wider on TOP, Narrow tip at BOTTOM)
        for (let i = 0; i < 6; i++) {
          const yOff = (i * 10 + (this.frameCount * 3)) % proj.height;
          // progress goes 0 at top to 1 at bottom
          const progress = yOff / proj.height;
          // w is widest at top (46px) and narrowest at bottom tip (12px)
          const w = 12 + (1 - progress) * 34;
          const rotAngle = Math.sin(this.frameCount * 0.25 + i * 0.5) * 0.35;

          this.ctx.strokeStyle = i % 2 === 0 ? '#06b6d4' : '#38bdf8';
          this.ctx.lineWidth = 1.5 + (1 - progress) * 2.2;
          this.ctx.beginPath();
          this.ctx.ellipse(cx, proj.y + yOff, w / 2, 5, rotAngle, 0, Math.PI * 2);
          this.ctx.stroke();

          // Outer wind swirl accent arc
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
        
        // Arc blade crescent shape
        this.ctx.beginPath();
        this.ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, proj.width / 2, -Math.PI / 3, Math.PI / 3);
        this.ctx.lineTo(proj.x + proj.width / 4, proj.y + proj.height / 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
      } else if (proj.type === 'arcane_orb') {
        this.ctx.save();
        const cx = proj.x + proj.width / 2;
        const cy = proj.y + proj.height / 2;
        const grad = this.ctx.createRadialGradient(cx, cy, 2, cx, cy, proj.width / 2);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#c084fc');
        grad.addColorStop(1, '#6d28d9');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, proj.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      } else {
        // Arrow lines
        this.ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
      }
    });

    // Draw Enemies
    this.enemies.forEach(enemy => {
      this.ctx.save();

      if (enemy.type === 'slime') {
        // Green Bouncing Slime
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

        // Eyes
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
        // Purple Archer Goblin
        this.ctx.fillStyle = '#8b5cf6';
        this.ctx.strokeStyle = '#4c1d95';
        this.ctx.lineWidth = 1.5;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Green Cap
        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x, enemy.y);
        this.ctx.lineTo(enemy.x + enemy.width / 2, enemy.y - 8);
        this.ctx.lineTo(enemy.x + enemy.width, enemy.y);
        this.ctx.closePath();
        this.ctx.fill();

        // Small Bow
        this.ctx.strokeStyle = '#ca8a04';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        const bowX = enemy.facing === 1 ? enemy.x + enemy.width - 4 : enemy.x + 4;
        this.ctx.arc(bowX, enemy.y + enemy.height / 2, 8, -Math.PI / 2, Math.PI / 2, enemy.facing === -1);
        this.ctx.stroke();

      } else if (enemy.type === 'fire_golem') {
        // Red Lava Stone Giant
        this.ctx.fillStyle = '#ea580c';
        this.ctx.strokeStyle = '#7c2d12';
        this.ctx.lineWidth = 2;
        
        // Body block
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Cracks of lava
        this.ctx.fillStyle = '#facc15';
        this.ctx.fillRect(enemy.x + 8, enemy.y + 12, 4, 18);
        this.ctx.fillRect(enemy.x + 22, enemy.y + 15, 6, 4);

        // Burning eyes
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(enemy.x + (enemy.facing === 1 ? 24 : 4), enemy.y + 8, 8, 4);

      } else if (enemy.type === 'miniboss') {
        // Huge Dark Magma Guard
        this.ctx.fillStyle = '#1e1b4b';
        this.ctx.strokeStyle = '#e11d48'; // red outline
        this.ctx.lineWidth = 3;
        
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Glowing red horns/wings
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

        // Glowing crown
        this.ctx.fillStyle = '#eab308';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + 12, enemy.y);
        this.ctx.lineTo(enemy.x + 20, enemy.y - 12);
        this.ctx.lineTo(enemy.x + 28, enemy.y - 4);
        this.ctx.lineTo(enemy.x + 36, enemy.y - 12);
        this.ctx.lineTo(enemy.x + 44, enemy.y);
        this.ctx.closePath();
        this.ctx.fill();

        // Healthbar
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
        // Giant Emerald Slime Lord
        const squish = Math.sin(this.frameCount * 0.12 + enemy.id) * 4;
        this.ctx.fillStyle = '#059669';
        this.ctx.strokeStyle = '#047857';
        this.ctx.lineWidth = 2.5;

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

        // Giant Golden Crown
        this.ctx.fillStyle = '#eab308';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + 16, enemy.y - 4);
        this.ctx.lineTo(enemy.x + 22, enemy.y - 18);
        this.ctx.lineTo(enemy.x + 30, enemy.y - 8);
        this.ctx.lineTo(enemy.x + 38, enemy.y - 18);
        this.ctx.lineTo(enemy.x + 44, enemy.y - 4);
        this.ctx.closePath();
        this.ctx.fill();

        // Boss Healthbar
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
        // Ice Dragon Wyvern
        this.ctx.fillStyle = '#0284c7';
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 2.5;

        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Ice Wings
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

        // Boss Healthbar
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
        // Deep Void Shadow Dragon
        this.ctx.fillStyle = '#3b0764';
        this.ctx.strokeStyle = '#c084fc';
        this.ctx.lineWidth = 3;

        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Void aura glow
        this.ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 1.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Boss Healthbar
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
        // PRIMORDIAL DRAGON KING FINAL BOSS
        this.ctx.fillStyle = '#b45309';
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 3.5;

        // Main God Dragon Body
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Grand Golden Wings
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

        // Triple Horn Crown
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(enemy.x + 18, enemy.y - 16, 12, 16);
        this.ctx.fillRect(enemy.x + 38, enemy.y - 22, 12, 22);
        this.ctx.fillRect(enemy.x + 58, enemy.y - 16, 12, 16);

        // GRAND BOSS HEALTHBAR
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
        // Demonic Grenadier Bomb Thrower Enemy
        const isFacingRight = enemy.facing === 1;

        // Dark Slate Body
        this.ctx.fillStyle = '#334155';
        this.ctx.strokeStyle = '#0f172a';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        this.ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Crimson Helmet & Visor
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(
          isFacingRight ? enemy.x + enemy.width - 14 : enemy.x,
          enemy.y + 4,
          14,
          10
        );

        // Glowing Yellow Eyes
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillRect(
          isFacingRight ? enemy.x + enemy.width - 8 : enemy.x + 3,
          enemy.y + 7,
          4,
          4
        );

        // Bomb in Hand ready to throw
        const bombX = isFacingRight ? enemy.x + enemy.width + 2 : enemy.x - 12;
        const bombY = enemy.y + 12;
        this.ctx.fillStyle = '#0f172a';
        this.ctx.beginPath();
        this.ctx.arc(bombX + 6, bombY + 6, 6, 0, Math.PI * 2);
        this.ctx.fill();
        // Bomb Fuse Spark
        this.ctx.fillStyle = this.frameCount % 4 < 2 ? '#ef4444' : '#fbbf24';
        this.ctx.beginPath();
        this.ctx.arc(bombX + 6, bombY, 2.5, 0, Math.PI * 2);
        this.ctx.fill();

      } else if (enemy.type === 'flying_wyvern') {
        // Flying Wyvern
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
        // Swimming Fish
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
        // Moving Anchor
        this.ctx.fillStyle = '#475569';
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width / 2, 0);
        this.ctx.lineTo(enemy.x + enemy.width / 2, enemy.y);
        this.ctx.stroke();
        this.ctx.fillRect(enemy.x + 4, enemy.y + 8, enemy.width - 8, 36);
        this.ctx.strokeRect(enemy.x + 4, enemy.y + 8, enemy.width - 8, 36);
      } else if (enemy.type === 'scallop') {
        // Scallop Clam Trap
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
        // Killer Whale Boss
        this.ctx.fillStyle = '#0f172a';
        this.ctx.strokeStyle = '#0284c7';
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.fillRect(enemy.x + 8, enemy.y + enemy.height - 14, enemy.width - 16, 12);
        this.ctx.fillStyle = '#0f172a';
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x + enemy.width / 2 - 8, enemy.y);
        this.ctx.lineTo(enemy.x + enemy.width / 2, enemy.y - 18);
        this.ctx.lineTo(enemy.x + enemy.width / 2 + 12, enemy.y);
        this.ctx.closePath();
        this.ctx.fill();
        const hbW = enemy.width + 20;
        const hbX = enemy.x - 10;
        const hbY = enemy.y - 25;
        this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
        this.ctx.fillRect(hbX, hbY, hbW, 8);
        const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillRect(hbX, hbY, hbW * hpPct, 8);
      }

      // Draw standard HP bar overlay for regular enemies (excluding bosses)
      if (
        enemy.hp < enemy.maxHp &&
        enemy.type !== 'miniboss' &&
        enemy.type !== 'king_slime' &&
        enemy.type !== 'frost_wyvern' &&
        enemy.type !== 'shadow_overlord' &&
        enemy.type !== 'dragon_king'
      ) {
        const hpPercent = enemy.hp / enemy.maxHp;
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 4);
        this.ctx.fillStyle = '#22c55e';
        this.ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * hpPercent, 4);
      }

      this.ctx.restore();
    });

    // Draw Particles
    this.particles.forEach(part => {
      this.ctx.fillStyle = part.color;
      this.ctx.globalAlpha = part.life / part.maxLife;
      this.ctx.fillRect(part.x, part.y, part.size, part.size);
      this.ctx.globalAlpha = 1.0;
    });

    // Draw Bird Familiar (Whitemon)
    if (this.birdActive) {
      this.ctx.save();
      const isRampage = this.birdRampageTimer > 0;
      if (isRampage) {
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(this.birdX, this.birdY, 18, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.fillStyle = isRampage ? '#f97316' : '#38bdf8';
      this.ctx.strokeStyle = isRampage ? '#7c2d12' : '#0369a1';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(this.birdX, this.birdY, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

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
      this.ctx.restore();
    }

    // Draw Player
    this.ctx.save();
    
    // Invulnerable blinking effect
    if (this.pInvulnerableFrames > 0 && Math.floor(this.pInvulnerableFrames / 4) % 2 === 0) {
      this.ctx.globalAlpha = 0.3;
    }

    // Color definitions based on chosen Draco
    let mainColor = '#f59e0b'; // Jumpmon yellow/orange
    let accentColor = '#b45309';
    let bellyColor = '#fef08a';
    let detailColor = '#ffffff';

    if (this.selectedDraco === 'Archermon') {
      mainColor = '#10b981'; // Green
      accentColor = '#065f46';
      bellyColor = '#a7f3d0';
      detailColor = '#fef08a';
    } else if (this.selectedDraco === 'Shieldmon') {
      mainColor = '#3b82f6'; // Blue
      accentColor = '#1e3a8a';
      bellyColor = '#bfdbfe';
      detailColor = '#cbd5e1';
    } else if (this.selectedDraco === 'Assassinmon') {
      mainColor = '#4c1d95'; // Deep Purple
      accentColor = '#1e1b4b'; // Midnight dark
      bellyColor = '#c084fc'; // Light purple
      detailColor = '#c084fc'; // Purple highlight
    } else if (this.selectedDraco === 'Flymon') {
      mainColor = '#e11d48'; // Rose red
      accentColor = '#881337'; // Deep red/burgundy
      bellyColor = '#fda4af'; // Pink belly
      detailColor = '#facc15'; // Yellow highlights
    } else if (this.selectedDraco === 'Whitemon') {
      mainColor = '#f8fafc'; // White
      accentColor = '#64748b'; // Slate
      bellyColor = '#e2e8f0'; // Light slate
      detailColor = '#38bdf8'; // Cyan
    } else if (this.selectedDraco === 'Magemon') {
      mainColor = '#6d28d9'; // Deep Purple Wizard Robes
      accentColor = '#312e81'; // Dark Indigo
      bellyColor = '#c084fc'; // Light Purple
      detailColor = '#f59e0b'; // Gold Sash Trim
    }

    const px = this.px;
    const py = this.py;
    const pw = this.pWidth;
    const ph = this.pHeight;

    // 1. Ground Drop Shadow & Plunge Aura
    if (this.pGrounded) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.beginPath();
      this.ctx.ellipse(px + pw / 2, py + ph, 14, 4, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Jumpmon Plunge Fire Aura Effect
    if (this.selectedDraco === 'Jumpmon' && this.isPlunging) {
      this.ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
      this.ctx.beginPath();
      this.ctx.arc(px + pw / 2, py + ph / 2, 28, 0, Math.PI * 2);
      this.ctx.fill();

      // Flame spikes pointing downwards
      this.ctx.fillStyle = '#ef4444';
      this.ctx.beginPath();
      this.ctx.moveTo(px + 2, py + ph - 6);
      this.ctx.lineTo(px + pw / 2, py + ph + 22);
      this.ctx.lineTo(px + pw - 2, py + ph - 6);
      this.ctx.closePath();
      this.ctx.fill();
    }

    // Idle breathing & run stride calculations
    const isMoving = Math.abs(this.pvx) > 0.2;
    const idleBob = (this.pGrounded && !isMoving) ? Math.sin(this.frameCount * 0.09) * 1.5 : 0;
    const legStride = (this.pGrounded && isMoving) ? Math.sin(this.frameCount * 0.35) * 6 : 0;

    // 2. Animated Dragon Tail
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

    // 2.5 Flymon Wings
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

    // 3. Leg Strides
    this.ctx.fillStyle = accentColor;
    if (this.pGrounded) {
      // Left foot
      this.ctx.fillRect(px + 4 + legStride, py + ph - 6 + idleBob, 8, 6);
      // Right foot
      this.ctx.fillRect(px + pw - 12 - legStride, py + ph - 6 + idleBob, 8, 6);
    } else {
      // Jump pose tucked feet
      this.ctx.fillRect(px + 6, py + ph - 10, 6, 6);
      this.ctx.fillRect(px + pw - 12, py + ph - 10, 6, 6);
    }

    // 4. Main Body & Torso
    const bodyY = py + idleBob;
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

    // 5. Belly Scales Plate
    this.ctx.fillStyle = bellyColor;
    const bellyX = this.pFacing === 1 ? px + 8 : px + 6;
    this.ctx.beginPath();
    this.ctx.ellipse(bellyX + 8, bodyY + ph / 2 + 4, 7, 10, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 6. Draco Horns / Ears
    this.ctx.fillStyle = accentColor;
    this.ctx.beginPath();
    if (this.pFacing === 1) {
      // facing right
      this.ctx.moveTo(px + 6, bodyY);
      this.ctx.lineTo(px + 2, bodyY - 10);
      this.ctx.lineTo(px + 14, bodyY + 2);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(px + pw - 14, bodyY + 2);
      this.ctx.lineTo(px + pw - 2, bodyY - 14); // main horn
      this.ctx.lineTo(px + pw - 6, bodyY);
      this.ctx.closePath();
      this.ctx.fill();
    } else {
      // facing left
      this.ctx.beginPath();
      this.ctx.moveTo(px + 14, bodyY + 2);
      this.ctx.lineTo(px + 2, bodyY - 14); // main horn
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

    // 7. Expressive Dragon Eyes
    this.ctx.fillStyle = '#ffffff';
    const eyeX = this.pFacing === 1 ? px + pw - 14 : px + 6;
    this.ctx.fillRect(eyeX, bodyY + 8, 8, 9);
    this.ctx.fillStyle = '#000000';
    const pupilX = this.pFacing === 1 ? eyeX + 4 : eyeX;
    this.ctx.fillRect(pupilX, bodyY + 10, 4, 5);
    // Specular shine
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(pupilX + 1, bodyY + 10, 1.5, 1.5);

    // Cute Cheeks
    this.ctx.fillStyle = detailColor;
    const cheekX = this.pFacing === 1 ? px + pw - 8 : px + 2;
    this.ctx.fillRect(cheekX, bodyY + 20, 4, 4);

    // 8. Shieldmon Defensive Barrier
    if (this.selectedDraco === 'Shieldmon' && this.shieldActive) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(px + pw / 2, bodyY + ph / 2, pw + 8, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 9. DYNAMIC WEAPON SWINGING ATTACK ANIMATION
    if (this.isAttacking && this.attackDuration > 0) {
      const maxDuration = 10;
      const progress = Math.max(0, Math.min(1, 1 - (this.attackDuration / maxDuration)));
      // Swing arc from -75 deg to +85 deg
      const swingAngleDeg = -75 + (progress * 160);
      const swingRad = (swingAngleDeg * Math.PI) / 180;

      const shoulderX = px + (this.pFacing === 1 ? pw - 4 : 4);
      const shoulderY = bodyY + 18;

      this.ctx.save();
      this.ctx.translate(shoulderX, shoulderY);
      this.ctx.scale(this.pFacing, 1);
      this.ctx.rotate(swingRad);

      if (this.selectedDraco === 'Archermon') {
        // Archermon bow wind slash arc
        this.ctx.strokeStyle = '#34d399';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 24, -0.6, 0.6);
        this.ctx.stroke();

        // Trail blade arc
        this.ctx.fillStyle = 'rgba(52, 211, 153, 0.35)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 32, -0.8, 0.2);
        this.ctx.lineTo(0, 0);
        this.ctx.closePath();
        this.ctx.fill();
      } else if (this.selectedDraco === 'Shieldmon') {
        // Shieldmon Heavy Aegis Shield Bash
        this.ctx.fillStyle = '#60a5fa';
        this.ctx.strokeStyle = '#1d4ed8';
        this.ctx.lineWidth = 2.5;
        this.ctx.fillRect(4, -14, 12, 28);
        this.ctx.strokeRect(4, -14, 12, 28);

        // Shockwave arc
        this.ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 28, -0.5, 0.5);
        this.ctx.stroke();
      } else if (this.selectedDraco === 'Assassinmon') {
        // Assassinmon Purple Shadow Slash
        this.ctx.fillStyle = '#1e1b4b';
        this.ctx.fillRect(0, -5, 6, 10);
        this.ctx.fillStyle = '#a855f7';
        this.ctx.strokeStyle = '#c084fc';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(6, -4);
        this.ctx.lineTo(24, -2);
        this.ctx.lineTo(28, 0);
        this.ctx.lineTo(24, 2);
        this.ctx.lineTo(6, 4);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Trail blade arc
        this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 30, -0.6, 0.6);
        this.ctx.stroke();
      } else if (this.selectedDraco === 'Flymon') {
        // Flymon Poison Wasp Slash
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
        // Jumpmon / Default Melee Golden Flame Sword Swing!
        this.ctx.fillStyle = '#78350f';
        this.ctx.fillRect(0, -3, 8, 6);
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillRect(8, -8, 4, 16);
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.strokeStyle = '#d97706';
        this.ctx.lineWidth = 1.5;

        // Sword Blade
        this.ctx.beginPath();
        this.ctx.moveTo(12, -4);
        this.ctx.lineTo(32, -2);
        this.ctx.lineTo(38, 0);
        this.ctx.lineTo(32, 2);
        this.ctx.lineTo(12, 4);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Sword blade center shine
        this.ctx.fillStyle = '#fef08a';
        this.ctx.fillRect(14, -1, 18, 2);

        // Dynamic SLASH TRAIL ARC
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
      // Idle / Resting Weapon Hold
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
        // Dual resting purple daggers
        this.ctx.fillStyle = '#a855f7';
        this.ctx.strokeStyle = '#1e1b4b';
        this.ctx.lineWidth = 1;
        this.ctx.fillRect(1, -6, 6, 2);
        this.ctx.fillRect(1, 4, 6, 2);
      } else if (this.selectedDraco === 'Flymon') {
        // Small rose stinger
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
        // Jumpmon resting sword
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.strokeStyle = '#b45309';
        this.ctx.lineWidth = 1.5;
        this.ctx.fillRect(2, -2, 14, 4);
      }

      this.ctx.restore();
    }

    this.ctx.restore(); // Restore player transform

    // Render Health & Ultimate Energy bars floating above the player's head!
    const hpPct = Math.max(0, Math.min(1, this.pHP / this.pMaxHP));
    const energyPct = Math.max(0, Math.min(1, this.pEnergy / this.getMaxEnergy()));
    
    // Draw mini HP bar container
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(px, py - 14, pw, 4);
    // Draw mini HP bar fill (Color shifts red -> orange -> green)
    this.ctx.fillStyle = hpPct < 0.25 ? '#ef4444' : hpPct < 0.5 ? '#f59e0b' : '#10b981';
    this.ctx.fillRect(px, py - 14, pw * hpPct, 4);

    // Draw mini Energy bar container
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(px, py - 8, pw, 3);
    // Draw mini Energy bar fill (Glows amber when fully charged)
    this.ctx.fillStyle = energyPct >= 1.0 ? '#fbbf24' : '#eab308';
    this.ctx.fillRect(px, py - 8, pw * energyPct, 3);

    // Draw Laser Beam inside camera translate
    if (this.laserBeamActive) {
      this.ctx.save();
      const beamX = this.pFacing === 1 ? this.px + this.pWidth : 0;
      const beamW = this.pFacing === 1 ? this.levelWidth - beamX : this.px;
      
      // Glowing pink outer energy
      this.ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
      this.ctx.fillRect(beamX, this.py + 10, beamW, 24);
      
      // Inner white hot core laser
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(beamX, this.py + 16, beamW, 12);
      this.ctx.restore();
    }

    // Draw Floating Text
    this.floatingTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.font = 'bold 12px "Press Start 2P", Courier, monospace';
      this.ctx.fillStyle = ft.color;
      this.ctx.globalAlpha = ft.life / 100;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });

    this.ctx.restore(); // Restore Camera transform

    // Cinematic Letterbox & Speech Shout Bubble
    if (this.ultimateCinematicActive) {
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Black Cinematic Bands
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, w, 55);
      this.ctx.fillRect(0, h - 55, w, 55);

      // Subtitle Overlay Banner Box
      this.ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
      this.ctx.strokeStyle = '#eab308';
      this.ctx.lineWidth = 3;
      this.ctx.fillRect(30, h - 125, w - 60, 55);
      this.ctx.strokeRect(30, h - 125, w - 60, 55);

      // Speaker Name
      this.ctx.fillStyle = '#eab308';
      this.ctx.font = '900 13px "Courier New", monospace';
      this.ctx.fillText(`${this.selectedDraco.toUpperCase()} SHOUTS:`, 45, h - 105);

      // Dialogue Subtitle
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold italic 15px "Courier New", monospace';
      this.ctx.fillText(`"${this.getUltimateVoiceLine()}"`, 45, h - 85);
    }
  }

  // CORE ENGINE RUNNER
  private run = () => {
    if (this.isPaused) return;

    this.frameCount++;

    // Cinematic Freeze Sequence
    if (this.ultimateCinematicActive) {
      this.ultimateCinematicDuration--;
      
      // Spawn magic charging aura particles around player
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
      
      this.draw();
      this.animationFrameId = requestAnimationFrame(this.run);
      return;
    }

    // Energy passive regeneration per second (base rate is 1, so 1/60 per frame)
    if (this.pEnergy < this.getMaxEnergy()) {
      const frameRegen = (1.0 / 60) * this.energyRegenRate;
      this.pEnergy = Math.min(this.getMaxEnergy(), this.pEnergy + frameRegen);
      this.callbacks.onEnergyChange?.(this.pEnergy, this.getMaxEnergy());
    }

    // Arrow Shower skill ticking (rain down arrows)
    if (this.arrowShowerActive) {
      this.arrowShowerDuration--;
      if (this.arrowShowerDuration <= 0) {
        this.arrowShowerActive = false;
      } else if (this.frameCount % 6 === 0) {
        const rx = this.px - 320 + Math.random() * 640;
        this.projectiles.push({
          x: rx,
          y: this.py - 240,
          vx: Math.random() * 1 - 0.5,
          vy: 8.5,
          width: 8,
          height: 18,
          isEnemy: false,
          damage: Math.floor(this.stats.attack * 0.75),
          color: '#10b981',
          type: 'arrow'
        });
      }
    }

    // Avatar status ticking
    if (this.avatarActive) {
      this.avatarDuration--;
      if (this.avatarDuration <= 0) {
        this.avatarActive = false;
      }
    }

    // Hyper Laser beam damage ticking
    if (this.laserBeamActive) {
      this.laserBeamDuration--;
      if (this.laserBeamDuration <= 0) {
        this.laserBeamActive = false;
      } else if (this.frameCount % 5 === 0) {
        const bx = this.pFacing === 1 ? this.px + this.pWidth : 0;
        const bw = this.pFacing === 1 ? this.levelWidth - bx : this.px;
        const by = this.py + 10;
        const bh = 24;
        
        this.enemies.forEach(enemy => {
          if (
            enemy.x < bx + bw &&
            enemy.x + enemy.width > bx &&
            enemy.y < by + bh &&
            enemy.y + enemy.height > by
          ) {
            this.damageEnemy(enemy, Math.floor(this.stats.attack * 0.8));
            enemy.vx = this.pFacing * 3.5; // Laser knockback push
          }
        });
      }
    }
    
    // Update active timers
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.specialCooldown > 0) this.specialCooldown--;
    if (this.pInvulnerableFrames > 0) this.pInvulnerableFrames--;
    
    if (this.isAttacking) {
      this.attackDuration--;
      if (this.attackDuration <= 0) this.isAttacking = false;
    }

    if (this.shieldActive) {
      this.shieldDuration--;
      if (this.shieldDuration <= 0) this.shieldActive = false;
    }

    // Engine Step Runs
    this.updatePhysics();
    this.updateEntities();
    this.updateParticles();

    // Camera Center on Player
    const targetCamX = this.px - this.canvas.width / 2 + this.pWidth / 2;
    this.cameraX += (targetCamX - this.cameraX) * 0.1;
    // Clamp camera within map bounds
    this.cameraX = Math.max(0, Math.min(this.levelWidth - this.canvas.width, this.cameraX));

    // Camera Y stays mostly stable unless vertical jumps push limits
    this.cameraY = 0; // standard 2D side scroller fixed height camera

    this.draw();

    this.animationFrameId = requestAnimationFrame(this.run);
  };

  public pause() {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.run();
  }

  public destroy() {
    this.pause();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
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
      this.addFloatingText(this.px + this.pWidth / 2, this.py - 10, 'LANDMINE DETONATED! 💥', '#ef4444');

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
