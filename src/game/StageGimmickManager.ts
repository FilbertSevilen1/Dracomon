import { soundService } from '../services/sound';

const BOSS_TYPES = new Set([
  'miniboss',
  'king_slime',
  'frost_wyvern',
  'shadow_overlord',
  'dragon_king',
  'king_kong',
  'immortal_gladiator'
]);

export interface LavaFireball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface FallingSnowflake {
  id: number;
  x: number;
  y: number;
  vy: number;
  size: number;
  rotation: number;
}

export interface PoisonFogOrb {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface ThunderboltStrike {
  id: number;
  x: number;
  timer: number;
  striking: boolean;
}

export interface FallingPlatform {
  id: number;
  r: number;
  c: number;
  x: number;
  y: number;
  vy: number;
  wobblyTimer: number;
}

export interface MeteorEntity {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vy: number;
  landed: boolean;
  landedTimer: number;
  r: number;
  c: number;
}

export type SkyDragonType = 'fire' | 'poison' | 'ice';

export interface GiantSkyDragon {
  id: number;
  type: SkyDragonType;
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  facing: 1 | -1;
  breathed: boolean;
}

export interface DragonBreathProjectile {
  id: number;
  type: SkyDragonType;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetR: number;
  targetC: number;
  vx: number;
  vy: number;
}

export interface DragonBreathZone {
  id: number;
  type: SkyDragonType;
  x: number;
  y: number;
  radiusTiles: number;
  radiusPx: number;
  timer: number;
  impactR: number;
  impactC: number;
  destroyOnExpire: boolean;
}

export class StageGimmickManager {
  public lavaFireballs: LavaFireball[] = [];
  public fallingSnowflakes: FallingSnowflake[] = [];
  public poisonFogOrbs: PoisonFogOrb[] = [];
  public thunderboltStrikes: ThunderboltStrike[] = [];
  public fallingPlatforms: FallingPlatform[] = [];
  public meteors: MeteorEntity[] = [];
  public skyDragons: GiantSkyDragon[] = [];
  public dragonBreathProjectiles: DragonBreathProjectile[] = [];
  public dragonBreathZones: DragonBreathZone[] = [];

  public playerLavaBurnTimer: number = 0;
  public playerSlowTimer: number = 0;
  public playerPoisonBlindTimer: number = 0;

  private timerCount: number = 0;
  private nextEntityId: number = 1;

  public reset() {
    this.lavaFireballs = [];
    this.fallingSnowflakes = [];
    this.poisonFogOrbs = [];
    this.thunderboltStrikes = [];
    this.fallingPlatforms = [];
    this.meteors = [];
    this.skyDragons = [];
    this.dragonBreathProjectiles = [];
    this.dragonBreathZones = [];
    this.playerLavaBurnTimer = 0;
    this.playerSlowTimer = 0;
    this.playerPoisonBlindTimer = 0;
    this.timerCount = 0;
  }

  public update(
    themeType: string,
    px: number,
    py: number,
    pWidth: number,
    pHeight: number,
    pHP: number,
    pMaxHP: number,
    grid: string[],
    tileSize: number,
    enemies: Array<{ id?: number; x: number; y: number; width: number; height: number; hp: number; maxHp?: number; type?: string; stunTimer?: number }>,
    callbacks: {
      onDamagePlayer: (damage: number, reason: string) => void;
      onInstaKillPlayer: (reason: string) => void;
      addFloatingText: (x: number, y: number, text: string, color: string) => void;
      spawnParticles: (x: number, y: number, color: string, count: number) => void;
      setGridTile: (r: number, c: number, char: string) => void;
      onDestroyPickups?: (r: number, c: number) => void;
    }
  ) {
    this.timerCount++;
    const pxMid = px + pWidth / 2;
    const pyMid = py + pHeight / 2;

    if (this.playerLavaBurnTimer > 0) {
      this.playerLavaBurnTimer--;
      if (this.playerLavaBurnTimer % 60 === 0 && pHP > 0) {
        const burnDamage = Math.max(1, Math.floor(pMaxHP * 0.1));
        callbacks.onDamagePlayer(burnDamage, 'Lava Burn');
        callbacks.addFloatingText(pxMid, py - 20, `LAVA BURN -${burnDamage} HP! 🔥`, '#ef4444');
        callbacks.spawnParticles(pxMid, pyMid, '#f97316', 8);
      }
    }

    if (this.playerSlowTimer > 0) {
      this.playerSlowTimer--;
    }

    if (this.playerPoisonBlindTimer > 0) {
      this.playerPoisonBlindTimer--;
    }

    if (themeType === 'volcano') {
      if (this.timerCount % 160 === 0 && grid.length > 0) {
        const lavaColumns: { r: number; c: number }[] = [];
        for (let r = 0; r < grid.length; r++) {
          for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === '*') {
              lavaColumns.push({ r, c });
            }
          }
        }
        if (lavaColumns.length > 0) {
          const pick = lavaColumns[Math.floor(Math.random() * lavaColumns.length)];
          this.lavaFireballs.push({
            id: this.nextEntityId++,
            x: pick.c * tileSize + tileSize / 2,
            y: pick.r * tileSize,
            vx: (Math.random() - 0.5) * 5,
            vy: -11 - Math.random() * 4,
            radius: 12
          });
        }
      }

      for (let i = this.lavaFireballs.length - 1; i >= 0; i--) {
        const fb = this.lavaFireballs[i];
        fb.x += fb.vx;
        fb.y += fb.vy;
        fb.vy += 0.35;

        const dist = Math.hypot(fb.x - pxMid, fb.y - pyMid);
        if (dist < fb.radius + pWidth / 2 && pHP > 0) {
          callbacks.onDamagePlayer(12, 'Lava Fireball');
          this.playerLavaBurnTimer = 120;
          callbacks.addFloatingText(pxMid, py - 24, 'ERUPTING FIREBALL BURN! 🔥', '#ef4444');
          callbacks.spawnParticles(pxMid, pyMid, '#f97316', 20);
          soundService.playHit();
          this.lavaFireballs.splice(i, 1);
          continue;
        }

        if (fb.y > grid.length * tileSize + 100) {
          this.lavaFireballs.splice(i, 1);
        }
      }
    }

    if (themeType === 'ice') {
      if (this.timerCount % 110 === 0 && grid.length > 0) {
        const mapWidth = (grid[0]?.length || 50) * tileSize;
        this.fallingSnowflakes.push({
          id: this.nextEntityId++,
          x: Math.random() * mapWidth,
          y: py - 400,
          vy: 4 + Math.random() * 3,
          size: 14,
          rotation: Math.random() * Math.PI * 2
        });
      }

      for (let i = this.fallingSnowflakes.length - 1; i >= 0; i--) {
        const sf = this.fallingSnowflakes[i];
        sf.y += sf.vy;
        sf.rotation += 0.05;

        const dist = Math.hypot(sf.x - pxMid, sf.y - pyMid);
        if (dist < sf.size + pWidth / 2 && pHP > 0) {
          callbacks.onDamagePlayer(8, 'Falling Ice Spike');
          this.playerSlowTimer = 90;
          callbacks.addFloatingText(pxMid, py - 20, 'FROSTBITE SLOW! 🧊❄️', '#38bdf8');
          callbacks.spawnParticles(pxMid, pyMid, '#38bdf8', 15);
          soundService.playIceDeath();
          this.fallingSnowflakes.splice(i, 1);
          continue;
        }

        const r = Math.floor(sf.y / tileSize);
        const c = Math.floor(sf.x / tileSize);
        if (r >= 0 && r < grid.length && c >= 0 && c < (grid[0]?.length || 0)) {
          const char = grid[r][c];
          if (char === '#' || char === '=') {
            callbacks.spawnParticles(sf.x, sf.y, '#7dd3fc', 6);
            this.fallingSnowflakes.splice(i, 1);
            continue;
          }
        }

        if (sf.y > grid.length * tileSize + 50) {
          this.fallingSnowflakes.splice(i, 1);
        }
      }
    }

    if (themeType === 'shadow') {
      if (this.poisonFogOrbs.length < 5 && this.timerCount % 180 === 0 && grid.length > 0) {
        const mapWidth = (grid[0]?.length || 50) * tileSize;
        this.poisonFogOrbs.push({
          id: this.nextEntityId++,
          x: Math.random() * mapWidth,
          y: py - 100 + (Math.random() - 0.5) * 200,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.2,
          radius: 28
        });
      }

      for (let i = this.poisonFogOrbs.length - 1; i >= 0; i--) {
        const fog = this.poisonFogOrbs[i];
        fog.x += fog.vx;
        fog.y += fog.vy;

        const dist = Math.hypot(fog.x - pxMid, fog.y - pyMid);
        if (dist < fog.radius + pWidth / 2 && pHP > 0) {
          callbacks.onDamagePlayer(6, 'Poison Fog');
          this.playerPoisonBlindTimer = 60;
          callbacks.addFloatingText(pxMid, py - 20, 'POISON FOG BLINDNESS! ☠️👁️', '#a855f7');
          callbacks.spawnParticles(pxMid, pyMid, '#c084fc', 12);
        }
      }
    }

    if (themeType === 'temple') {
      if (this.timerCount % 240 === 0) {
        this.thunderboltStrikes.push({
          id: this.nextEntityId++,
          x: pxMid + (Math.random() - 0.5) * 450,
          timer: 240,
          striking: false
        });
      }

      for (let i = this.thunderboltStrikes.length - 1; i >= 0; i--) {
        const tb = this.thunderboltStrikes[i];
        tb.timer--;

        if (tb.timer <= 60) {
          let targetRow = grid.length;
          let solidCount = 0;
          const centerCol = Math.floor(tb.x / tileSize);
          for (let r = 0; r < grid.length; r++) {
            let rowHasSolid = false;
            for (let c = centerCol - 1; c <= centerCol + 1; c++) {
              if (c >= 0 && c < (grid[r]?.length || 0)) {
                if (grid[r][c] === '#') {
                  rowHasSolid = true;
                }
              }
            }
            if (rowHasSolid) {
              solidCount++;
              if (solidCount === 3) {
                targetRow = r;
                break;
              }
            }
          }
          const groundY = targetRow * tileSize;

          if (!tb.striking) {
            tb.striking = true;
            soundService.playThunderboltDeath();
            callbacks.spawnParticles(tb.x, groundY, '#fef08a', 25);
          }

          const playerFeet = py + pHeight;
          if (Math.abs(pxMid - tb.x) < 48 && playerFeet <= groundY + 15 && pHP > 0) {
            callbacks.onInstaKillPlayer('Divine Thunderbolt Strike');
            callbacks.addFloatingText(pxMid, py - 20, 'DIVINE THUNDERBOLT STRIKE! ⚡💥', '#eab308');
            soundService.playThunderboltDeath();
          }

          enemies.forEach((enemy) => {
            const enemyFeet = enemy.y + enemy.height;
            if (enemy.hp > 0 && Math.abs((enemy.x + enemy.width / 2) - tb.x) < 56 && enemyFeet <= groundY + 15) {
              if (enemy.type !== 'immortal_gladiator') {
                enemy.stunTimer = 60;
              }
            }
          });
        }

        if (tb.timer <= 0) {
          this.thunderboltStrikes.splice(i, 1);
        }
      }
    }

    if (themeType === 'heavens') {
      if (this.timerCount % 120 === 0 && grid.length > 0) {
        let portalCol = -1;
        let bossCol = -1;
        for (let r = 0; r < grid.length; r++) {
          for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === 'P') portalCol = c;
            if (grid[r][c] === 'B') bossCol = c;
          }
        }

        const validPlatforms: { r: number; c: number }[] = [];
        for (let r = grid.length - 1; r >= 0; r--) {
          for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === '=') {
              if (portalCol !== -1 && Math.abs(c - portalCol) <= 5) continue;
              if (bossCol !== -1 && Math.abs(c - bossCol) <= 5) continue;
              validPlatforms.push({ r, c });
            }
          }
        }

        const countToFall = Math.min(4, validPlatforms.length);
        for (let k = 0; k < countToFall; k++) {
          const pickIndex = Math.floor(Math.random() * validPlatforms.length);
          const p = validPlatforms.splice(pickIndex, 1)[0];

          callbacks.setGridTile(p.r, p.c, '.');
          this.fallingPlatforms.push({
            id: this.nextEntityId++,
            r: p.r,
            c: p.c,
            x: p.c * tileSize,
            y: p.r * tileSize,
            vy: 0,
            wobblyTimer: 30
          });
        }
      }

      for (let i = this.fallingPlatforms.length - 1; i >= 0; i--) {
        const fp = this.fallingPlatforms[i];
        if (fp.wobblyTimer > 0) {
          fp.wobblyTimer--;
        } else {
          fp.vy += 0.5;
          fp.y += fp.vy;
        }

        if (fp.y > grid.length * tileSize + 100) {
          this.fallingPlatforms.splice(i, 1);
        }
      }

      if (this.timerCount % 300 === 0 && grid.length > 0) {
        const dragonTypes: SkyDragonType[] = ['fire', 'poison', 'ice'];
        const chosenType = dragonTypes[Math.floor(Math.random() * dragonTypes.length)];
        const facing: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
        const mapWidth = (grid[0]?.length || 60) * tileSize;
        const startX = facing === 1 ? -300 : mapWidth + 300;

        this.skyDragons.push({
          id: this.nextEntityId++,
          type: chosenType,
          x: startX,
          y: Math.min(10, Math.max(-300, py - 900 + (Math.random() - 0.5) * 20)),
          vx: facing * 7.0,
          width: 220,
          height: 100,
          facing,
          breathed: false
        });

        const dragonTitle = chosenType === 'fire' ? 'INFERNO FIRE DRAGON' : chosenType === 'poison' ? 'TOXIC POISON DRAGON' : 'GLACIAL ICE DRAGON';
      }

      for (let d = this.skyDragons.length - 1; d >= 0; d--) {
        const dragon = this.skyDragons[d];
        dragon.x += dragon.vx;

        const dragonBox = { x: dragon.x, y: dragon.y, w: dragon.width, h: dragon.height };
        if (
          px + pWidth > dragonBox.x &&
          px < dragonBox.x + dragonBox.w &&
          py + pHeight > dragonBox.y &&
          py < dragonBox.y + dragonBox.h &&
          pHP > 0
        ) {
          callbacks.onInstaKillPlayer('Devoured by Giant Sky Dragon');
          callbacks.addFloatingText(pxMid, py - 20, 'DEVOURED BY GIANT SKY DRAGON! 🐉💀', '#ef4444');
          soundService.playHit();
        }

        const mapWidth = (grid[0]?.length || 60) * tileSize;
        if (!dragon.breathed && Math.abs(dragon.x - mapWidth / 2) < 450) {
          dragon.breathed = true;

          const platformTiles: { r: number; c: number; x: number; y: number }[] = [];
          for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
              if (grid[r][c] === '=' || grid[r][c] === '#') {
                platformTiles.push({ r, c, x: c * tileSize + tileSize / 2, y: r * tileSize });
              }
            }
          }

          if (platformTiles.length > 0) {
            let minR = Infinity;
            for (const pt of platformTiles) {
              if (pt.r < minR) minR = pt.r;
            }

            const highPlatformTiles = platformTiles.filter(pt => pt.r <= minR + 3);
            const targetPool = highPlatformTiles.length > 0 ? highPlatformTiles : platformTiles;

            const numProjectiles = dragon.type === 'poison' ? 4 : 5;
            for (let p = 0; p < numProjectiles; p++) {
              const target = targetPool[Math.floor(Math.random() * targetPool.length)];
              const originX = dragon.x + dragon.width / 2;
              const originY = dragon.y + dragon.height / 2;

              const dx = target.x - originX;
              const dy = target.y - originY;
              const dist = Math.hypot(dx, dy) || 1;
              const speed = 8.5;

              this.dragonBreathProjectiles.push({
                id: this.nextEntityId++,
                type: dragon.type,
                x: originX,
                y: originY,
                targetX: target.x,
                targetY: target.y,
                targetR: target.r,
                targetC: target.c,
                vx: (dx / dist) * speed,
                vy: (dy / dist) * speed
              });
            }
          }
        }

        if ((dragon.facing === 1 && dragon.x > mapWidth + 400) || (dragon.facing === -1 && dragon.x < -400)) {
          this.skyDragons.splice(d, 1);
        }
      }

      for (let p = this.dragonBreathProjectiles.length - 1; p >= 0; p--) {
        const bp = this.dragonBreathProjectiles[p];
        bp.x += bp.vx;
        bp.y += bp.vy;

        if (this.timerCount % 3 === 0) {
          const trailColor = bp.type === 'fire' ? '#ef4444' : bp.type === 'poison' ? '#22c55e' : '#38bdf8';
          callbacks.spawnParticles(bp.x, bp.y, trailColor, 1);
        }

        const dist = Math.hypot(bp.x - bp.targetX, bp.y - bp.targetY);
        if (dist < 20 || bp.y >= bp.targetY) {
          const radiusTiles = bp.type === 'poison' ? 4 : 3;
          this.dragonBreathZones.push({
            id: this.nextEntityId++,
            type: bp.type,
            x: bp.targetX,
            y: bp.targetY,
            radiusTiles,
            radiusPx: radiusTiles * tileSize,
            timer: 300,
            impactR: bp.targetR,
            impactC: bp.targetC,
            destroyOnExpire: bp.type === 'fire'
          });

          const pColor = bp.type === 'fire' ? '#ef4444' : bp.type === 'poison' ? '#22c55e' : '#38bdf8';
          callbacks.spawnParticles(bp.targetX, bp.targetY, pColor, 14);
          soundService.playHit();
          this.dragonBreathProjectiles.splice(p, 1);
        }
      }

      for (let z = this.dragonBreathZones.length - 1; z >= 0; z--) {
        const zone = this.dragonBreathZones[z];
        zone.timer--;

        const distToPlayer = Math.hypot(pxMid - zone.x, pyMid - zone.y);
        if (distToPlayer <= zone.radiusPx && pHP > 0) {
          if (zone.type === 'fire') {
            this.playerLavaBurnTimer = 60;
            if (this.timerCount % 60 === 0) {
              const burnDamage = Math.max(1, Math.floor(pMaxHP * 0.1));
              callbacks.onDamagePlayer(burnDamage, 'Sky Fire Dragon Inferno');
              callbacks.addFloatingText(pxMid, py - 20, `INFERNO FIRE -${burnDamage} HP! 🔥`, '#ef4444');
            }
          } else if (zone.type === 'poison') {
            if (this.timerCount % 60 === 0) {
              callbacks.onDamagePlayer(6, 'Sky Poison Dragon Acid');
              callbacks.addFloatingText(pxMid, py - 20, 'TOXIC DRAGON POISON -6 HP! ☠️🧪', '#22c55e');
            }
          } else if (zone.type === 'ice') {
            this.playerSlowTimer = 180;
            if (this.timerCount % 60 === 0) {
              callbacks.onDamagePlayer(5, 'Sky Ice Dragon Frost');
              callbacks.addFloatingText(pxMid, py - 20, 'GLACIAL ICE SLOW! 🧊❄️', '#38bdf8');
            }
          }
        }

        if (zone.timer <= 0) {
          if (zone.destroyOnExpire) {
            for (let c = zone.impactC - 1; c <= zone.impactC + 1; c++) {
              if (zone.impactR >= 0 && zone.impactR < grid.length && c >= 0 && c < (grid[zone.impactR]?.length || 0)) {
                callbacks.setGridTile(zone.impactR, c, '.');
                callbacks.spawnParticles(c * tileSize + tileSize / 2, zone.impactR * tileSize, '#ef4444', 15);
              }
            }
          }
          this.dragonBreathZones.splice(z, 1);
        }
      }
    }

    if (themeType === 'core') {
      if (this.timerCount % 180 === 0 && grid.length > 0) {
        const mapWidth = (grid[0]?.length || 50) * tileSize;
        const targetX = Math.min(mapWidth - 80, Math.max(80, pxMid + (Math.random() - 0.5) * 300));
        const targetC = Math.floor(targetX / tileSize);

        let targetR = grid.length - 3;
        for (let r = 0; r < grid.length; r++) {
          if (grid[r][targetC] === '#' || grid[r][targetC] === '=') {
            targetR = r;
            break;
          }
        }

        this.meteors.push({
          id: this.nextEntityId++,
          x: targetX,
          y: py - 450,
          targetX,
          targetY: targetR * tileSize,
          vy: 10,
          landed: false,
          landedTimer: 0,
          r: targetR,
          c: targetC
        });
      }

      for (let i = this.meteors.length - 1; i >= 0; i--) {
        const m = this.meteors[i];

        if (!m.landed) {
          m.y += m.vy;

          if (this.timerCount % 3 === 0) {
            callbacks.spawnParticles(m.x, m.y - 20, '#f97316', 1);
          }

          if (m.y >= m.targetY) {
            if (Math.abs(pxMid - m.targetX) < 48 && Math.abs(pyMid - m.targetY) < 48 && pHP > 0) {
              callbacks.onInstaKillPlayer('Crushed by Giant Falling Meteor');
              callbacks.addFloatingText(pxMid, py - 20, 'CRUSHED BY GIANT METEOR! ☄️💥', '#ef4444');
            }

            for (let c = m.c - 1; c <= m.c + 1; c++) {
              if (m.r >= 0 && m.r < grid.length && c >= 0 && c < (grid[m.r]?.length || 0)) {
                callbacks.setGridTile(m.r, c, '.');
                callbacks.onDestroyPickups?.(m.r, c);
              }
            }

            enemies.forEach((enemy) => {
              if (enemy.hp <= 0) return;
              const ex = enemy.x + enemy.width / 2;
              const ey = enemy.y + enemy.height / 2;
              const dist = Math.hypot(ex - m.targetX, ey - m.targetY);

              if (dist < 64) {
                const isBoss = enemy.type && BOSS_TYPES.has(enemy.type);
                if (isBoss) {
                  enemy.hp = Math.max(1, enemy.hp - 60);
                  if (enemy.type !== 'immortal_gladiator') {
                    enemy.stunTimer = 60;
                  }
                  callbacks.addFloatingText(ex, enemy.y - 15, 'BOSS METEOR IMPACT -60 HP! ☄️💥', '#ef4444');
                  callbacks.spawnParticles(ex, ey, '#f97316', 10);
                } else {
                  enemy.hp = 0;
                  callbacks.addFloatingText(ex, enemy.y - 15, 'CRUSHED BY METEOR! ☄️💥', '#ef4444');
                  callbacks.spawnParticles(ex, ey, '#ef4444', 12);
                }
              }
            });

            callbacks.spawnParticles(m.targetX, m.targetY, '#ef4444', 16);
            callbacks.spawnParticles(m.targetX, m.targetY, '#f97316', 10);

            soundService.playHit();

            this.meteors.splice(i, 1);
          }
        }
      }
    }
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    themeType: string,
    px: number,
    py: number,
    pWidth: number,
    pHeight: number,
    canvasWidth: number,
    canvasHeight: number,
    cameraX: number,
    cameraY: number,
    grid?: string[],
    tileSize?: number
  ) {
    const pxMid = px + pWidth / 2;
    const pyMid = py + pHeight / 2;

    if (themeType === 'volcano') {
      this.lavaFireballs.forEach((fb) => {
        ctx.save();
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(fb.x, fb.y, fb.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(fb.x, fb.y, fb.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    if (themeType === 'ice') {
      this.fallingSnowflakes.forEach((sf) => {
        ctx.save();
        ctx.translate(sf.x, sf.y);
        ctx.rotate(sf.rotation);
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-sf.size, 0);
        ctx.lineTo(sf.size, 0);
        ctx.moveTo(0, -sf.size);
        ctx.lineTo(0, sf.size);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    if (themeType === 'shadow') {
      this.poisonFogOrbs.forEach((fog) => {
        ctx.save();
        const grad = ctx.createRadialGradient(fog.x, fog.y, 4, fog.x, fog.y, fog.radius);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.7)');
        grad.addColorStop(0.6, 'rgba(126, 34, 206, 0.4)');
        grad.addColorStop(1, 'rgba(88, 28, 135, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.save();
      const visionRadius = this.playerPoisonBlindTimer > 0 ? 40 : 220;
      const darkGrad = ctx.createRadialGradient(
        pxMid,
        pyMid,
        visionRadius * 0.4,
        pxMid,
        pyMid,
        visionRadius
      );
      darkGrad.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
      darkGrad.addColorStop(0.75, 'rgba(15, 10, 26, 0.75)');
      darkGrad.addColorStop(1, 'rgba(15, 10, 26, 0.96)');

      ctx.fillStyle = darkGrad;
      ctx.fillRect(cameraX - 100, cameraY - 100, canvasWidth + 200, canvasHeight + 200);
      ctx.restore();
    }

    if (themeType === 'temple') {
      const ts = tileSize || 40;
      const activeGrid = grid || [];

      this.thunderboltStrikes.forEach((tb) => {
        ctx.save();

        let targetRow = activeGrid.length;
        let solidCount = 0;
        const centerCol = Math.floor(tb.x / ts);
        for (let r = 0; r < activeGrid.length; r++) {
          let rowHasSolid = false;
          for (let c = centerCol - 1; c <= centerCol + 1; c++) {
            if (c >= 0 && c < (activeGrid[r]?.length || 0)) {
              if (activeGrid[r][c] === '#') {
                rowHasSolid = true;
              }
            }
          }
          if (rowHasSolid) {
            solidCount++;
            if (solidCount === 3) {
              targetRow = r;
              break;
            }
          }
        }

        const groundY = targetRow * ts;
        const beamTop = cameraY - 100;
        const beamHeight = Math.max(20, groundY - beamTop);

        if (!tb.striking) {
          const warningAlpha = 0.12 + Math.sin(tb.timer * 0.2) * 0.08;
          ctx.fillStyle = `rgba(234, 179, 8, ${warningAlpha})`;
          ctx.fillRect(tb.x - 48, beamTop, 96, beamHeight);

          const flash = Math.sin(tb.timer * 0.25) > 0;
          ctx.strokeStyle = flash ? '#fef08a' : '#eab308';
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 8]);
          ctx.beginPath();
          ctx.moveTo(tb.x - 48, beamTop);
          ctx.lineTo(tb.x - 48, groundY);
          ctx.moveTo(tb.x + 48, beamTop);
          ctx.lineTo(tb.x + 48, groundY);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tb.x, beamTop);
          ctx.lineTo(tb.x, groundY);
          ctx.stroke();

          const remainingSec = Math.max(0, (tb.timer - 60) / 60).toFixed(1);
          const badgeY = Math.max(cameraY + 50, groundY - 110);
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 8;
        } else {
          const strikeGrad = ctx.createLinearGradient(tb.x - 48, 0, tb.x + 48, 0);
          strikeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.0)');
          strikeGrad.addColorStop(0.25, 'rgba(234, 179, 8, 0.85)');
          strikeGrad.addColorStop(0.45, 'rgba(254, 240, 138, 0.95)');
          strikeGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
          strikeGrad.addColorStop(0.55, 'rgba(254, 240, 138, 0.95)');
          strikeGrad.addColorStop(0.75, 'rgba(234, 179, 8, 0.85)');
          strikeGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

          ctx.fillStyle = strikeGrad;
          ctx.fillRect(tb.x - 48, beamTop, 96, beamHeight);

          for (let arc = 0; arc < 4; arc++) {
            ctx.strokeStyle = arc % 2 === 0 ? '#ffffff' : '#fef08a';
            ctx.lineWidth = 2.5 + Math.random() * 2;
            ctx.beginPath();
            let startY = beamTop;
            let currentX = tb.x + (Math.random() - 0.5) * 60;
            ctx.moveTo(currentX, startY);

            while (startY < groundY) {
              startY += 25 + Math.random() * 30;
              if (startY > groundY) startY = groundY;
              currentX = tb.x + (Math.random() - 0.5) * 70;
              ctx.lineTo(currentX, startY);
            }
            ctx.stroke();
          }

          for (let node = 0; node < 6; node++) {
            ctx.fillStyle = node % 2 === 0 ? '#ffffff' : '#fef08a';
            ctx.beginPath();
            ctx.arc(
              tb.x + (Math.random() - 0.5) * 70,
              beamTop + Math.random() * beamHeight,
              Math.random() * 5 + 3,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }

          const ringGrad = ctx.createRadialGradient(tb.x, groundY, 4, tb.x, groundY, 65);
          ringGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
          ringGrad.addColorStop(0.4, 'rgba(234, 179, 8, 0.8)');
          ringGrad.addColorStop(1, 'rgba(234, 179, 8, 0.0)');
          ctx.fillStyle = ringGrad;
          ctx.beginPath();
          ctx.arc(tb.x, groundY, 65, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    if (themeType === 'heavens') {
      this.fallingPlatforms.forEach((fp) => {
        ctx.save();
        const wobbleX = fp.wobblyTimer > 0 ? (Math.random() - 0.5) * 4 : 0;
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(fp.x + wobbleX, fp.y, 40, 12);
        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(fp.x + wobbleX, fp.y, 40, 12);
        ctx.restore();
      });

      this.dragonBreathZones.forEach((zone) => {
        ctx.save();
        const mainColor = zone.type === 'fire' ? '#ef4444' : zone.type === 'poison' ? '#22c55e' : '#38bdf8';
        const glowColor = zone.type === 'fire' ? '#f97316' : zone.type === 'poison' ? '#a855f7' : '#7dd3fc';

        const grad = ctx.createRadialGradient(zone.x, zone.y, 10, zone.x, zone.y, zone.radiusPx);
        grad.addColorStop(0, mainColor);
        grad.addColorStop(0.7, glowColor);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.55 + Math.sin(this.timerCount * 0.1) * 0.15;
        ctx.beginPath();
        ctx.ellipse(zone.x, zone.y, zone.radiusPx, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        if (zone.type === 'fire') {
          for (let f = -3; f <= 3; f++) {
            const fx = zone.x + f * (zone.radiusPx / 4);
            const flameH = 14 + Math.sin(this.timerCount * 0.25 + f) * 8;
            ctx.fillStyle = f % 2 === 0 ? '#fef08a' : '#f97316';
            ctx.beginPath();
            ctx.moveTo(fx - 5, zone.y);
            ctx.quadraticCurveTo(fx, zone.y - flameH - 6, fx + 5, zone.y);
            ctx.fill();
          }
        } else if (zone.type === 'poison') {
          for (let b = 0; b < 5; b++) {
            const bx = zone.x + Math.sin(this.timerCount * 0.1 + b * 1.5) * (zone.radiusPx * 0.7);
            const by = zone.y - 4 - ((this.timerCount * 1.2 + b * 12) % 22);
            const bSize = 3 + (b % 3) * 2;
            ctx.fillStyle = b % 2 === 0 ? 'rgba(134, 239, 172, 0.85)' : 'rgba(168, 85, 247, 0.75)';
            ctx.beginPath();
            ctx.arc(bx, by, bSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(bx - bSize * 0.3, by - bSize * 0.3, bSize * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (zone.type === 'ice') {
          for (let c = -3; c <= 3; c++) {
            const cx = zone.x + c * (zone.radiusPx / 4);
            const spikeH = 12 + Math.abs(c === 0 ? 8 : 4);
            ctx.fillStyle = c % 2 === 0 ? '#ffffff' : '#7dd3fc';
            ctx.beginPath();
            ctx.moveTo(cx - 4, zone.y);
            ctx.lineTo(cx, zone.y - spikeH);
            ctx.lineTo(cx + 4, zone.y);
            ctx.closePath();
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = mainColor;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        const icon = zone.type === 'fire' ? '🔥 INFERNO FIRE' : zone.type === 'poison' ? '☠️ TOXIC POISON' : '🧊 GLACIAL ICE';

        ctx.restore();
      });

      this.dragonBreathProjectiles.forEach((bp) => {
        ctx.save();
        const pColor = bp.type === 'fire' ? '#ef4444' : bp.type === 'poison' ? '#22c55e' : '#38bdf8';
        const innerColor = bp.type === 'fire' ? '#fef08a' : bp.type === 'poison' ? '#86efac' : '#ffffff';

        ctx.fillStyle = pColor;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = innerColor;
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      this.skyDragons.forEach((dragon) => {
        ctx.save();
        ctx.translate(dragon.x + dragon.width / 2, dragon.y + dragon.height / 2);
        if (dragon.facing === -1) ctx.scale(-1, 1);

        const isFire = dragon.type === 'fire';
        const isPoison = dragon.type === 'poison';
        const bodyColor = isFire ? '#b91c1c' : isPoison ? '#15803d' : '#0369a1';
        const wingColor = isFire ? '#ea580c' : isPoison ? '#a855f7' : '#38bdf8';
        const eyeColor = isFire ? '#fef08a' : isPoison ? '#86efac' : '#ffffff';

        const wingAngle = Math.sin(this.timerCount * 0.2) * 0.4;

        ctx.save();
        ctx.rotate(-0.3 + wingAngle);
        ctx.fillStyle = wingColor;
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(-70, -70);
        ctx.lineTo(20, -40);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, 75, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(65, -15, 25, 18, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(60, -28);
        ctx.lineTo(85, -48);
        ctx.lineTo(72, -26);
        ctx.fill();

        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(75, -18, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.quadraticCurveTo(-90, 20, -120, -10);
        ctx.stroke();

        ctx.save();
        ctx.rotate(0.2 - wingAngle);
        ctx.fillStyle = wingColor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-60, -80);
        ctx.lineTo(35, -45);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.restore();
      });
    }

    if (themeType === 'core') {
      this.meteors.forEach((m) => {
        ctx.save();
        if (!m.landed) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(m.targetX, m.targetY + 20, 40, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(m.targetX - 45, m.targetY + 20);
          ctx.lineTo(m.targetX + 45, m.targetY + 20);
          ctx.moveTo(m.targetX, m.targetY - 25);
          ctx.lineTo(m.targetX, m.targetY + 65);
          ctx.stroke();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';

          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.beginPath();
          ctx.arc(m.x, m.y, 48, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(m.x, m.y, 36, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(m.x, m.y, 24, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(m.x, m.y, 12, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }
  }
}

export const stageGimmickManager = new StageGimmickManager();
