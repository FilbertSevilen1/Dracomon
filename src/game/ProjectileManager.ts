export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  isEnemy: boolean;
  damage: number;
  type?: 'fireball' | 'axe' | 'sonar' | 'bomb' | 'homing_bomb' | 'sun_strike' | 'meteor' | 'tornado' | 'dark_energy' | 'giant_cleave';
  targetX?: number;
  targetY?: number;
  hitEnemyIds?: number[];
  channelTimer?: number;
  isExploding?: boolean;
  explosionTimer?: number;
  life?: number;
  timer?: number;
  isBasic?: boolean;
  traveledDist?: number;
}

export class ProjectileManager {
  public projectiles: Projectile[] = [];

  public addProjectile(proj: Projectile) {
    this.projectiles.push(proj);
  }

  public updateProjectiles(
    levelWidth: number,
    levelHeight: number,
    isSolid: (x: number, y: number) => boolean,
    onHitSolid?: (proj: Projectile, index: number) => void
  ) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];

      if (proj.life !== undefined) {
        proj.life--;
        if (proj.life <= 0) {
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      if (proj.type === 'giant_cleave' || proj.type === 'dark_energy') {
        proj.x += proj.vx;
        proj.traveledDist = (proj.traveledDist || 0) + Math.abs(proj.vx);
        if (proj.x < -100 || proj.x > levelWidth + 100 || proj.traveledDist >= 1000) {
          this.projectiles.splice(i, 1);
          continue;
        }
      } else if (proj.type === 'tornado') {
        proj.x += proj.vx;
        if (proj.x < 0 || proj.x > levelWidth) {
          this.projectiles.splice(i, 1);
          continue;
        }
      } else if (proj.type === 'sun_strike') {
      } else {
        proj.x += proj.vx;
        proj.y += proj.vy;
        if (isSolid(proj.x, proj.y) || proj.x < 0 || proj.x > levelWidth || proj.y > levelHeight + 100) {
          if (onHitSolid) onHitSolid(proj, i);
          this.projectiles.splice(i, 1);
          continue;
        }
      }
    }
  }

  public drawProjectiles(ctx: CanvasRenderingContext2D, frameCount: number, playerY: number, playerHeight: number) {
    this.projectiles.forEach(proj => {
      ctx.save();
      ctx.fillStyle = proj.color;

      if (proj.type === 'fireball') {
        const bounce = Math.sin(frameCount * 0.2 + proj.x) * 2;
        ctx.beginPath();
        ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2 + bounce, proj.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (proj.type === 'axe') {
        ctx.translate(proj.x + proj.width / 2, proj.y + proj.height / 2);
        ctx.rotate(frameCount * 0.3);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-2, -10, 4, 20);
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(-4, -4, 8, Math.PI / 2, -Math.PI / 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(4, -4, 8, -Math.PI / 2, Math.PI / 2);
        ctx.fill();
        ctx.stroke();
      } else if (proj.type === 'sonar') {
        ctx.strokeStyle = proj.color || '#38bdf8';
        ctx.lineWidth = 3.5;
        const waveRadius = proj.width / 2 + (frameCount % 6);
        const isFacingRight = proj.vx >= 0;
        const startAngle = isFacingRight ? -Math.PI / 2.5 : Math.PI / 2.5;
        const endAngle = isFacingRight ? Math.PI / 2.5 : (Math.PI * 3) / 2.5;

        ctx.beginPath();
        ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, waveRadius, startAngle, endAngle);
        ctx.stroke();
      } else if (proj.type === 'bomb') {
        const cx = proj.x + proj.width / 2;
        const cy = proj.y + proj.height / 2;
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, proj.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
      }

      ctx.restore();
    });
  }
}
