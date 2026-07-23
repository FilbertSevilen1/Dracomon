export type ParticleEffectType = 'inferno' | 'ice' | 'poison' | 'general';
export type ParticleShape = 'circle' | 'spark' | 'snowflake' | 'bubble' | 'flame' | 'star';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type?: ParticleEffectType;
  shape?: ParticleShape;
  rotation?: number;
  rotSpeed?: number;
  scaleRate?: number;
  glowColor?: string;
  glowBlur?: number;
}

export class ParticleManager {
  public particles: Particle[] = [];

  public addParticle(p: Particle) {
    if (this.particles.length >= 100) {
      this.particles.shift(); // Hard cap at 100 particles max for silky-smooth performance!
    }
    this.particles.push(p);
  }

  public spawnDust(x: number, y: number, count: number = 6, color: string = '#d6d3d1') {
    const num = Math.min(count, 8);
    for (let i = 0; i < num; i++) {
      this.addParticle({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 1,
        size: Math.random() * 4 + 2,
        color,
        life: 18,
        maxLife: 18,
        type: 'general',
        shape: 'circle',
      });
    }
  }

  public spawnBurst(x: number, y: number, count: number = 12, colors: string[] = ['#f59e0b', '#ef4444', '#fef08a']) {
    const num = Math.min(count, 14);
    for (let i = 0; i < num; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.addParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        color: colors[i % colors.length],
        life: 20,
        maxLife: 20,
        type: 'general',
        shape: 'spark',
      });
    }
  }

  /**
   * Spawns an optimized Inferno Fire burst.
   */
  public spawnInfernoBurst(x: number, y: number, count: number = 14) {
    const fireColors = ['#ffffff', '#fef08a', '#f97316', '#ef4444'];
    const num = Math.min(count, 16);
    for (let i = 0; i < num; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.addParticle({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        size: Math.random() * 6 + 3,
        color: fireColors[i % fireColors.length],
        life: Math.floor(Math.random() * 15) + 15,
        maxLife: 30,
        type: 'inferno',
        shape: Math.random() > 0.5 ? 'flame' : 'spark',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        glowColor: '#f97316',
        scaleRate: 0.96,
      });
    }
  }

  public spawnFlameTrail(x: number, y: number, count: number = 1) {
    const colors = ['#fef08a', '#f97316', '#ef4444'];
    for (let i = 0; i < count; i++) {
      this.addParticle({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2 - 1,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 12,
        maxLife: 12,
        type: 'inferno',
        shape: 'flame',
        glowColor: '#ef4444',
      });
    }
  }

  public spawnIceBurst(x: number, y: number, count: number = 14) {
    const iceColors = ['#ffffff', '#bae6fd', '#7dd3fc', '#38bdf8'];
    const num = Math.min(count, 16);
    for (let i = 0; i < num; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      this.addParticle({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 3,
        color: iceColors[i % iceColors.length],
        life: Math.floor(Math.random() * 18) + 18,
        maxLife: 36,
        type: 'ice',
        shape: i % 2 === 0 ? 'snowflake' : 'star',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        glowColor: '#38bdf8',
        scaleRate: 0.97,
      });
    }
  }

  public spawnFrostTrail(x: number, y: number, count: number = 1) {
    const colors = ['#ffffff', '#7dd3fc', '#38bdf8'];
    for (let i = 0; i < count; i++) {
      this.addParticle({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 14,
        maxLife: 14,
        type: 'ice',
        shape: 'snowflake',
        rotation: Math.random() * Math.PI * 2,
        glowColor: '#7dd3fc',
      });
    }
  }

  public spawnPoisonBurst(x: number, y: number, count: number = 14) {
    const poisonColors = ['#86efac', '#22c55e', '#a855f7', '#c084fc'];
    const num = Math.min(count, 16);
    for (let i = 0; i < num; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.2;
      this.addParticle({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        size: Math.random() * 6 + 3,
        color: poisonColors[i % poisonColors.length],
        life: Math.floor(Math.random() * 18) + 18,
        maxLife: 36,
        type: 'poison',
        shape: 'bubble',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        glowColor: '#22c55e',
        scaleRate: 1.01,
      });
    }
  }

  public spawnPoisonCloud(x: number, y: number, count: number = 1) {
    const colors = ['#86efac', '#22c55e', '#a855f7'];
    for (let i = 0; i < count; i++) {
      this.addParticle({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.5 - 0.5,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 15,
        maxLife: 15,
        type: 'poison',
        shape: 'bubble',
        glowColor: '#a855f7',
      });
    }
  }

  public update() {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.type === 'inferno') {
        p.vy -= 0.06;
      }
      if (p.type === 'poison') {
        p.vx += Math.sin(p.life * 0.2) * 0.1;
      }

      if (p.rotSpeed) {
        p.rotation = (p.rotation || 0) + p.rotSpeed;
      }

      if (p.scaleRate) {
        p.size *= p.scaleRate;
      }

      p.life--;
      return p.life > 0 && p.size > 0.3;
    });
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(p => {
      ctx.save();

      const lifeRatio = Math.max(0, p.life / p.maxLife);
      let baseAlpha = lifeRatio;
      if (p.type === 'ice') {
        baseAlpha *= (0.75 + Math.sin(p.life * 0.4) * 0.25);
      }
      ctx.globalAlpha = baseAlpha;

      const r = Math.max(1, p.size);

      ctx.translate(p.x, p.y);
      if (p.rotation) {
        ctx.rotate(p.rotation);
      }

      // Fast soft glow halo (NO shadowBlur!)
      if (p.glowColor) {
        ctx.fillStyle = p.glowColor;
        ctx.globalAlpha = baseAlpha * 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = baseAlpha;
      }

      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      if (p.shape === 'snowflake') {
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          ctx.moveTo(0, 0);
          ctx.lineTo(cos * r, sin * r);
        }
        ctx.stroke();

      } else if (p.shape === 'star') {
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.closePath();
        ctx.fill();

      } else if (p.shape === 'flame') {
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.3);
        ctx.quadraticCurveTo(r * 0.8, -r * 0.2, r * 0.6, r * 0.6);
        ctx.quadraticCurveTo(0, r * 1.1, -r * 0.6, r * 0.6);
        ctx.quadraticCurveTo(-r * 0.8, -r * 0.2, 0, -r * 1.3);
        ctx.closePath();
        ctx.fill();

      } else if (p.shape === 'bubble') {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(-r * 0.3, -r * 0.3, Math.max(0.8, r * 0.25), 0, Math.PI * 2);
        ctx.fill();

      } else if (p.shape === 'spark') {
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.2);
        ctx.lineTo(r * 0.4, 0);
        ctx.lineTo(0, r * 1.2);
        ctx.lineTo(-r * 0.4, 0);
        ctx.closePath();
        ctx.fill();

      } else {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }
}
