import React, { useEffect, useRef } from 'react';

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Draco {
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: number;
  grounded: boolean;
  state: 'idle' | 'walking' | 'jumping' | 'falling';
  idleBob: number;
  legStride: number;
  mainColor: string;
  accentColor: string;
  bellyColor: string;
  detailColor: string;
  actionTimer: number;
  nextActionTimer: number;
  currentAction: 'none' | 'attack' | 'special' | 'ultimate';
  actionDuration: number;
  isPlunging?: boolean;
  spinActive?: boolean;
  spinAngle?: number;
  shieldActive?: boolean;
  dashActive?: boolean;
  pulseTimer?: number;
  pulseX?: number;
  pulseY?: number;
  blackHoleActive?: boolean;
  blackHoleX?: number;
  blackHoleY?: number;
  blackHoleTimer?: number;
  ultTimer?: number;
  ultPhase?: string;
  beamAngle?: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  type: string;
  life: number;
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

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  scale?: number;
}

export const FullScreenShowcaseCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    // Entities lists
    let dracos: Draco[] = [];
    let platforms: Platform[] = [];
    let projectiles: Projectile[] = [];
    let particles: Particle[] = [];
    let floatingTexts: FloatingText[] = [];

    // Screen-shake magnitude
    let screenShake = 0;

    // Dracos configurations
    const dracoConfigs = [
      { name: 'Jumpmon', main: '#f59e0b', accent: '#b45309', belly: '#fef08a', detail: '#ffffff' },
      { name: 'Archermon', main: '#10b981', accent: '#065f46', belly: '#a7f3d0', detail: '#fef08a' },
      { name: 'Shieldmon', main: '#3b82f6', accent: '#1e3a8a', belly: '#bfdbfe', detail: '#cbd5e1' },
      { name: 'Assassinmon', main: '#4c1d95', accent: '#1e1b4b', belly: '#c084fc', detail: '#c084fc' },
      { name: 'Flymon', main: '#e11d48', accent: '#881337', belly: '#fda4af', detail: '#facc15' },
      { name: 'Whitemon', main: '#f8fafc', accent: '#64748b', belly: '#e2e8f0', detail: '#38bdf8' },
      { name: 'Magemon', main: '#6d28d9', accent: '#312e81', belly: '#c084fc', detail: '#f59e0b' },
      { name: 'Shadowmon', main: '#18181b', accent: '#881337', belly: '#9f1239', detail: '#ef4444' },
      { name: 'Bombamon', main: '#ea580c', accent: '#c2410c', belly: '#fef08a', detail: '#ef4444' },
      { name: 'Thundermon', main: '#facc15', accent: '#ca8a04', belly: '#fef08a', detail: '#06b6d4' },
      { name: 'Enigmon', main: '#333388', accent: '#581c87', belly: '#c084fc', detail: '#e879f9' },
      { name: 'Lunarmon', main: '#1e1b4b', accent: '#312e81', belly: '#c7d2fe', detail: '#93c5fd' },
      { name: 'Azuremon', main: '#0284c7', accent: '#0369a1', belly: '#e0f2fe', detail: '#38bdf8' },
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setupPlatforms();
    };

    const setupPlatforms = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Define 6 floating platforms at various screen heights/widths (slightly shifted higher for fullscreen)
      platforms = [
        // Ground Floor
        { x: 0, y: h - 45, width: w, height: 45 },
        // Mid Left
        { x: w * 0.08, y: h * 0.66, width: w * 0.22, height: 18 },
        // Mid Right
        { x: w * 0.7, y: h * 0.68, width: w * 0.22, height: 18 },
        // Center
        { x: w * 0.35, y: h * 0.49, width: w * 0.3, height: 18 },
        // Upper Left
        { x: w * 0.15, y: h * 0.32, width: w * 0.2, height: 18 },
        // Upper Right
        { x: w * 0.65, y: h * 0.29, width: w * 0.2, height: 18 },
      ];
    };

    const spawnDracos = () => {
      dracos = dracoConfigs.map((cfg, idx) => {
        // Distribute them initially on random platforms
        const plat = platforms[idx % platforms.length];
        const rx = plat.x + Math.random() * (plat.width - 40) + 10;
        const ry = plat.y - 44;

        return {
          name: cfg.name,
          x: rx,
          y: ry,
          vx: (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.8),
          vy: 0,
          width: 32,
          height: 44,
          facing: Math.random() > 0.5 ? 1 : -1,
          grounded: true,
          state: 'walking',
          idleBob: 0,
          legStride: 0,
          mainColor: cfg.main,
          accentColor: cfg.accent,
          bellyColor: cfg.belly,
          detailColor: cfg.detail,
          actionTimer: 0,
          nextActionTimer: 60 + Math.random() * 180, // cooldown until first random skill casting
          currentAction: 'none',
          actionDuration: 0,
        };
      });
    };

    // Helper functions
    const addParticles = (x: number, y: number, count: number, color: string, speedMultiplier = 1) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = (0.5 + Math.random() * 3) * speedMultiplier;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - (Math.random() * 0.5),
          color,
          size: Math.random() * 4 + 2,
          life: 15 + Math.random() * 20,
          maxLife: 35,
        });
      }
    };

    const addFloatingText = (x: number, y: number, text: string, color: string, scale = 1) => {
      floatingTexts.push({
        x,
        y: y - 10,
        text,
        color,
        life: 60,
        maxLife: 60,
        scale,
      });
    };

    // Skills triggering logic
    const triggerDracoSkill = (draco: Draco) => {
      const skills: ('attack' | 'special' | 'ultimate')[] = ['attack', 'special', 'ultimate'];
      const action = skills[Math.floor(Math.random() * skills.length)];
      draco.currentAction = action;

      // Stop walking during skill casting
      draco.vx = 0;
      draco.state = 'idle';

      const dir = draco.facing;
      const frontX = draco.x + (dir === 1 ? draco.width + 12 : -12);
      const centerY = draco.y + draco.height / 2;

      if (action === 'attack') {
        draco.actionDuration = 30;
        addFloatingText(draco.x + draco.width / 2, draco.y - 12, 'Basic Attack', '#cbd5e1');
        
        // Spawn attack particles/projectiles
        if (draco.name === 'Archermon') {
          projectiles.push({
            x: frontX,
            y: centerY,
            vx: dir * 7,
            vy: 0,
            width: 14,
            height: 4,
            color: '#10b981',
            type: 'arrow',
            life: 120,
          });
        } else if (draco.name === 'Bombamon') {
          projectiles.push({
            x: frontX,
            y: centerY - 4,
            vx: dir * 5.5,
            vy: -2,
            width: 12,
            height: 12,
            color: '#ea580c',
            type: 'fireball',
            life: 100,
          });
        } else if (draco.name === 'Magemon') {
          projectiles.push({
            x: frontX,
            y: centerY,
            vx: dir * 5,
            vy: 0,
            width: 14,
            height: 14,
            color: '#a855f7',
            type: 'arcane_orb',
            life: 120,
          });
        } else if (draco.name === 'Shadowmon') {
          projectiles.push({
            x: frontX,
            y: centerY,
            vx: dir * 6,
            vy: 0,
            width: 16,
            height: 8,
            color: '#ef4444',
            type: 'dark_energy',
            life: 120,
          });
        } else if (draco.name === 'Flymon') {
          projectiles.push({
            x: frontX,
            y: centerY,
            vx: dir * 6.5,
            vy: 0,
            width: 10,
            height: 4,
            color: '#f43f5e',
            type: 'needle',
            life: 100,
          });
        } else if (draco.name === 'Whitemon') {
          projectiles.push({
            x: frontX,
            y: centerY,
            vx: dir * 4.5,
            vy: -1.5,
            width: 15,
            height: 15,
            color: '#e2e8f0',
            type: 'axe',
            life: 120,
          });
        } else if (draco.name === 'Enigmon') {
          projectiles.push({
            x: frontX,
            y: centerY,
            vx: dir * 6,
            vy: 0,
            width: 12,
            height: 12,
            color: '#c084fc',
            type: 'dark_matter',
            life: 120,
          });
        } else if (draco.name === 'Lunarmon') {
          projectiles.push({
            x: frontX,
            y: centerY,
            vx: dir * 6,
            vy: 0,
            width: 18,
            height: 10,
            color: '#93c5fd',
            type: 'crescent',
            life: 120,
          });
        } else if (draco.name === 'Azuremon') {
          projectiles.push({
            x: frontX,
            y: centerY,
            vx: dir * 7,
            vy: 0,
            width: 14,
            height: 8,
            color: '#38bdf8',
            type: 'azure_beam',
            life: 120,
          });
        } else {
          // Melee swing particle effect
          addParticles(frontX, centerY, 8, draco.mainColor, 1.5);
        }
      } else if (action === 'special') {
        draco.actionDuration = 50;
        addFloatingText(draco.x + draco.width / 2, draco.y - 15, `${draco.name} Skill!`, '#fbbf24', 1.15);

        if (draco.name === 'Jumpmon') {
          draco.spinActive = true;
          draco.spinAngle = 0;
          draco.vy = -7;
          draco.grounded = false;
        } else if (draco.name === 'Shieldmon') {
          draco.shieldActive = true;
          draco.vx = dir * 5.5; // Charge forward
        } else if (draco.name === 'Assassinmon') {
          draco.dashActive = true;
          draco.vx = dir * 8; // Instant speed dash
          addParticles(draco.x, centerY, 15, '#c084fc');
        } else if (draco.name === 'Flymon') {
          // Send 3 tornadoes
          [-0.2, 0, 0.2].forEach(angle => {
            projectiles.push({
              x: frontX,
              y: centerY,
              vx: dir * 4.5 * Math.cos(angle),
              vy: 4.5 * Math.sin(angle),
              width: 20,
              height: 20,
              color: '#fda4af',
              type: 'tornado',
              life: 90,
            });
          });
        } else if (draco.name === 'Thundermon') {
          // Dash with electric trail
          draco.dashActive = true;
          draco.vx = dir * 7.5;
        } else if (draco.name === 'Enigmon') {
          // Schwarzschild pulse on ground
          draco.pulseTimer = 100;
          draco.pulseX = draco.x + dir * 160;
          draco.pulseY = draco.y + draco.height;
        } else if (draco.name === 'Shadowmon') {
          // Shadowraze ground pillar
          draco.pulseTimer = 45; // custom duration
          draco.pulseX = draco.x + dir * 120;
          draco.pulseY = draco.y + draco.height;
        } else if (draco.name === 'Lunarmon') {
          // Moonbeam Strike
          draco.pulseTimer = 50;
          draco.pulseX = draco.x + dir * 140;
          draco.pulseY = draco.y + draco.height;
        } else if (draco.name === 'Azuremon') {
          // Light Energy Ball
          projectiles.push({
            x: frontX,
            y: centerY,
            vx: dir * 5,
            vy: 0,
            width: 22,
            height: 22,
            color: '#bae6fd',
            type: 'azure_light_ball',
            life: 120,
          });
          addParticles(frontX, centerY, 15, '#38bdf8', 2);
        } else {
          // Default particle blast
          addParticles(frontX, centerY, 15, draco.mainColor, 2);
        }
      } else if (action === 'ultimate') {
        draco.actionDuration = 90;
        addFloatingText(draco.x + draco.width / 2, draco.y - 20, `★ ULTIMATE: ${draco.name.toUpperCase()} ★`, '#f43f5e', 1.35);

        // Screen shake triggers on ultimate
        screenShake = 14;

        if (draco.name === 'Jumpmon') {
          draco.isPlunging = true;
          draco.vy = -11;
          draco.grounded = false;
        } else if (draco.name === 'Shieldmon') {
          draco.shieldActive = true;
          draco.actionDuration = 120;
        } else if (draco.name === 'Assassinmon') {
          // Flash-slashes across the screen
          draco.dashActive = true;
          draco.vx = dir * 12;
          addParticles(draco.x, centerY, 30, '#e879f9', 3);
        } else if (draco.name === 'Thundermon') {
          // Raigeki lightning strikes
          draco.ultTimer = 60;
        } else if (draco.name === 'Enigmon') {
          // Black Hole Singularity
          draco.blackHoleActive = true;
          draco.blackHoleTimer = 180;
          draco.blackHoleX = draco.x + dir * 250;
          draco.blackHoleY = draco.y - 20;
        } else if (draco.name === 'Lunarmon') {
          // Lunar Eclipse Laser
          draco.ultTimer = 90;
          draco.ultPhase = 'laser';
          draco.beamAngle = Math.PI / 2; // facing down-ish
        } else if (draco.name === 'Azuremon') {
          // Burst Stream of Catastrophe front beam
          draco.ultTimer = 120;
          draco.ultPhase = 'laser';
          draco.beamAngle = dir === 1 ? 0 : Math.PI;
          addParticles(draco.x + draco.width / 2, draco.y + draco.height / 2, 35, '#38bdf8', 3);
        } else if (draco.name === 'Bombamon') {
          // Carpet bombing fire streams
          draco.ultTimer = 120;
          draco.vy = -8; // fly up
          draco.grounded = false;
        } else if (draco.name === 'Shadowmon') {
          // Dark soul blast shockwaves
          draco.ultTimer = 90;
        } else {
          // Giant particles burst
          addParticles(draco.x + draco.width / 2, draco.y + draco.height / 2, 40, draco.mainColor, 3.5);
        }
      }
    };

    const updateSimulation = () => {
      frameCount++;

      if (screenShake > 0) {
        screenShake *= 0.9;
        if (screenShake < 0.2) screenShake = 0;
      }

      // 1. Update Projectiles
      projectiles = projectiles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Spawn trail particles
        if (frameCount % 4 === 0) {
          particles.push({
            x: p.x,
            y: p.y,
            vx: -p.vx * 0.1,
            vy: (Math.random() - 0.5) * 0.5,
            color: p.color,
            size: p.width * 0.3,
            life: 10,
            maxLife: 10,
          });
        }

        return p.life > 0 && p.x > 0 && p.x < canvas.width && p.y > 0 && p.y < canvas.height;
      });

      // 2. Update Particles
      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        return p.life > 0;
      });

      // 3. Update Floating Texts
      floatingTexts = floatingTexts.filter(t => {
        t.y -= 0.6; // rise slowly
        t.life--;
        return t.life > 0;
      });

      // 4. Update Dracos
      dracos.forEach(draco => {
        // Timers progress
        if (draco.actionTimer > 0) {
          draco.actionTimer--;
        }

        if (draco.nextActionTimer > 0) {
          draco.nextActionTimer--;
          if (draco.nextActionTimer <= 0) {
            triggerDracoSkill(draco);
          }
        }

        // Action duration check
        if (draco.currentAction !== 'none') {
          draco.actionDuration--;
          if (draco.actionDuration <= 0) {
            draco.currentAction = 'none';
            draco.spinActive = false;
            draco.shieldActive = false;
            draco.dashActive = false;
            draco.isPlunging = false;
            // set random next action cooldown
            draco.nextActionTimer = 180 + Math.random() * 240;
            // resume wandering
            draco.vx = (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.8);
            draco.state = 'walking';
          }
        }

        // Apply physics
        // Gravity
        if (!draco.grounded) {
          draco.vy += 0.35; // gravity constant
          if (draco.vy > 9) draco.vy = 9;
        }

        draco.x += draco.vx;
        draco.y += draco.vy;

        // Platform collisions
        let wasGrounded = draco.grounded;
        draco.grounded = false;

        // Check platform collision from top down
        for (const plat of platforms) {
          // If falling and feet are aligned with the platform top
          if (
            draco.vy >= 0 &&
            draco.x + draco.width * 0.2 < plat.x + plat.width &&
            draco.x + draco.width * 0.8 > plat.x &&
            draco.y + draco.height >= plat.y &&
            draco.y + draco.height - draco.vy <= plat.y + 8
          ) {
            draco.y = plat.y - draco.height;
            draco.vy = 0;
            draco.grounded = true;

            // Handle Jumpmon Ultimate meteor crash impact on landing
            if (draco.name === 'Jumpmon' && draco.isPlunging) {
              draco.isPlunging = false;
              draco.currentAction = 'none';
              draco.nextActionTimer = 180 + Math.random() * 200;
              draco.vx = (Math.random() > 0.5 ? 1 : -1) * 1.2;
              draco.state = 'walking';
              screenShake = 16;
              addParticles(draco.x + draco.width / 2, plat.y, 25, '#fbbf24', 2.5);
              addFloatingText(draco.x + draco.width / 2, plat.y - 12, 'METEOR CRASH!', '#f59e0b', 1.25);
            }
            break;
          }
        }

        if (draco.grounded && !wasGrounded) {
          draco.state = Math.abs(draco.vx) > 0.1 ? 'walking' : 'idle';
          // Spawn landing dust
          addParticles(draco.x + draco.width / 2, draco.y + draco.height, 6, '#d6d3d1', 0.8);
        }

        // Wandering logic inside boundaries of its current platform (or screen boundaries)
        if (draco.grounded && draco.currentAction === 'none') {
          // Find platform
          const plat = platforms.find(p => 
            draco.x + draco.width / 2 >= p.x && 
            draco.x + draco.width / 2 <= p.x + p.width &&
            Math.abs(draco.y + draco.height - p.y) < 2
          );

          if (plat) {
            // Turn back near platform edges
            if (draco.x < plat.x + 10 && draco.vx < 0) {
              draco.vx = -draco.vx;
              draco.facing = 1;
            } else if (draco.x + draco.width > plat.x + plat.width - 10 && draco.vx > 0) {
              draco.vx = -draco.vx;
              draco.facing = -1;
            }
          }

          // Random jump
          if (Math.random() < 0.005) {
            draco.vy = -6.5;
            draco.grounded = false;
            draco.state = 'jumping';
            // slight forward speed bump
            draco.vx = draco.facing * (1.2 + Math.random());
          }
        }

        // Screen boundary loops/teleports (in case they fall off screen)
        if (draco.y > canvas.height + 50) {
          const randPlat = platforms[Math.floor(Math.random() * platforms.length)];
          draco.x = randPlat.x + randPlat.width / 2;
          draco.y = randPlat.y - draco.height - 20;
          draco.vy = 0;
          draco.vx = (Math.random() > 0.5 ? 1 : -1) * 1.0;
          draco.grounded = false;
        }

        // Bobbing animations
        if (draco.state === 'walking') {
          draco.legStride = Math.sin(frameCount * 0.28) * 6;
          draco.idleBob = Math.sin(frameCount * 0.12) * 1;
        } else if (draco.state === 'idle') {
          draco.legStride = 0;
          draco.idleBob = Math.sin(frameCount * 0.09) * 1.5;
        } else {
          draco.legStride = 0;
          draco.idleBob = 0;
        }

        // Individual skills updating inside Draco ticks
        if (draco.spinActive) {
          draco.spinAngle = (draco.spinAngle || 0) + 0.35;
          if (frameCount % 2 === 0) {
            addParticles(draco.x + draco.width / 2, draco.y + draco.height / 2, 2, '#fbbf24', 0.5);
          }
        }

        if (draco.pulseTimer !== undefined && draco.pulseTimer > 0) {
          draco.pulseTimer--;
          if (draco.pulseTimer <= 0) {
            delete draco.pulseTimer;
            delete draco.pulseX;
            delete draco.pulseY;
          }
        }

        if (draco.blackHoleActive) {
          draco.blackHoleTimer = (draco.blackHoleTimer || 10) - 1;
          if (draco.blackHoleTimer <= 0) {
            draco.blackHoleActive = false;
          }
          // Pull particle effect into black hole center
          if (draco.blackHoleX !== undefined && draco.blackHoleY !== undefined && frameCount % 3 === 0) {
            const ang = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 80;
            particles.push({
              x: draco.blackHoleX + Math.cos(ang) * dist,
              y: draco.blackHoleY + Math.sin(ang) * dist,
              vx: -Math.cos(ang) * 3.5,
              vy: -Math.sin(ang) * 3.5,
              color: '#c084fc',
              size: Math.random() * 3 + 1.5,
              life: 25,
              maxLife: 25,
            });
          }
        }

        if (draco.ultTimer !== undefined && draco.ultTimer > 0) {
          draco.ultTimer--;
          if (draco.name === 'Bombamon' && frameCount % 6 === 0) {
            // Carpet Bombing fire drops
            projectiles.push({
              x: draco.x + draco.width / 2 + (Math.random() - 0.5) * 80,
              y: draco.y + draco.height,
              vx: (Math.random() - 0.5) * 1.5,
              vy: 6.5,
              width: 14,
              height: 14,
              color: '#f97316',
              type: 'fire_rain',
              life: 80,
            });
          }
          if (draco.ultTimer <= 0) {
            delete draco.ultTimer;
            delete draco.ultPhase;
            delete draco.beamAngle;
          }
        }
      });
    };

    // Draw functions
    const drawPlatforms = () => {
      if (!ctx) return;
      platforms.forEach(plat => {
        // Draw wood platform styling
        ctx.fillStyle = '#44403c'; // Dark stone-wood tone
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 4);
        ctx.fill();
        ctx.stroke();

        // Platform detailing top highlight line
        ctx.fillStyle = '#78716c';
        ctx.fillRect(plat.x + 2, plat.y + 1, plat.width - 4, 3);
      });
    };

    const drawDracoCharacter = (draco: Draco) => {
      if (!ctx) return;

      const px = draco.x;
      const py = draco.y;
      const pw = draco.width;
      const ph = draco.height;
      const bob = draco.idleBob;
      const stride = draco.legStride;
      const face = draco.facing;

      ctx.save();

      // Jumpmon spin rotate
      if (draco.name === 'Jumpmon' && draco.spinActive && draco.spinAngle !== undefined) {
        ctx.translate(px + pw / 2, py + ph / 2);
        ctx.rotate(draco.spinAngle);
        ctx.translate(-(px + pw / 2), -(py + ph / 2));

        // Spin aura ring
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + ph / 2, 32, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Shadowmon back wings
      if (draco.name === 'Shadowmon') {
        const wingFlap = Math.sin(frameCount * 0.2) * 5;
        ctx.fillStyle = '#9f1239';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(px + pw / 2 - 8, py + 16);
        ctx.quadraticCurveTo(px - 18, py - 6 + wingFlap, px - 28, py + 12 + wingFlap);
        ctx.quadraticCurveTo(px - 16, py + 22, px + pw / 2 - 8, py + 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px + pw / 2 + 8, py + 16);
        ctx.quadraticCurveTo(px + pw + 18, py - 6 + wingFlap, px + pw + 28, py + 12 + wingFlap);
        ctx.quadraticCurveTo(px + pw + 16, py + 22, px + pw / 2 + 8, py + 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Enigmon background cosmic aura
      if (draco.name === 'Enigmon') {
        const auraPulse = Math.sin(frameCount * 0.12) * 3;
        const grad = ctx.createRadialGradient(px + pw / 2, py + ph / 2, 4, px + pw / 2, py + ph / 2, pw / 2 + 12 + auraPulse);
        grad.addColorStop(0, 'rgba(192, 132, 252, 0.35)');
        grad.addColorStop(0.6, 'rgba(88, 28, 135, 0.15)');
        grad.addColorStop(1, 'rgba(59, 7, 100, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + ph / 2, pw / 2 + 12 + auraPulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Azuremon background celestial aura & orbiting spheres
      if (draco.name === 'Azuremon') {
        const auraPulse = Math.sin(frameCount * 0.12) * 3;
        const grad = ctx.createRadialGradient(px + pw / 2, py + ph / 2, 4, px + pw / 2, py + ph / 2, pw / 2 + 14 + auraPulse);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        grad.addColorStop(0.6, 'rgba(186, 230, 253, 0.18)');
        grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + ph / 2, pw / 2 + 14 + auraPulse, 0, Math.PI * 2);
        ctx.fill();

        for (let d = 0; d < 3; d++) {
          const dang = frameCount * 0.09 + d * ((Math.PI * 2) / 3);
          const dx = px + pw / 2 + Math.cos(dang) * (pw / 2 + 14);
          const dy = py + ph / 2 + Math.sin(dang) * 12;
          ctx.fillStyle = '#e0f2fe';
          ctx.beginPath();
          ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Legs/feet
      ctx.fillStyle = draco.accentColor;
      if (draco.grounded) {
        ctx.fillRect(px + 4 + stride, py + ph - 6 + bob, 8, 6);
        ctx.fillRect(px + pw - 12 - stride, py + ph - 6 + bob, 8, 6);
      } else {
        ctx.fillRect(px + 6, py + ph - 10, 6, 6);
        ctx.fillRect(px + pw - 12, py + ph - 10, 6, 6);
      }

      // Flymon insect wings
      if (draco.name === 'Flymon') {
        ctx.fillStyle = '#fda4af';
        ctx.globalAlpha = 0.7;
        const buzz = Math.sin(frameCount * 0.8) * 4;
        ctx.beginPath();
        const wingX = face === 1 ? px + 6 : px + pw - 6;
        ctx.ellipse(wingX - face * 12, py + 16 + buzz, 14, 6, -face * Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(wingX - face * 16, py + 22 - buzz, 10, 5, -face * Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draco main body blob
      const bodyY = py + bob;
      ctx.fillStyle = draco.mainColor;
      ctx.strokeStyle = draco.accentColor;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(px + pw / 2, bodyY + pw / 2, pw / 2, Math.PI, 0, false);
      ctx.lineTo(px + pw, bodyY + ph - 6);
      ctx.quadraticCurveTo(px + pw, bodyY + ph - 2, px + pw - 6, bodyY + ph - 2);
      ctx.lineTo(px + 6, bodyY + ph - 2);
      ctx.quadraticCurveTo(px, bodyY + ph - 2, px, bodyY + ph - 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Belly ellipse
      ctx.fillStyle = draco.bellyColor;
      const bellyX = face === 1 ? px + 8 : px + 6;
      ctx.beginPath();
      ctx.ellipse(bellyX + 8, bodyY + ph / 2 + 4, 7, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Horns
      ctx.fillStyle = draco.accentColor;
      ctx.beginPath();
      if (face === 1) {
        ctx.moveTo(px + 6, bodyY);
        ctx.lineTo(px + 2, bodyY - 10);
        ctx.lineTo(px + 14, bodyY + 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px + pw - 14, bodyY + 2);
        ctx.lineTo(px + pw - 2, bodyY - 14);
        ctx.lineTo(px + pw - 6, bodyY);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.moveTo(px + 14, bodyY + 2);
        ctx.lineTo(px + 2, bodyY - 14);
        ctx.lineTo(px + 6, bodyY);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px + pw - 6, bodyY);
        ctx.lineTo(px + pw - 2, bodyY - 10);
        ctx.lineTo(px + pw - 14, bodyY + 2);
        ctx.closePath();
        ctx.fill();
      }

      // Tail
      ctx.fillStyle = draco.accentColor;
      ctx.beginPath();
      const tailBaseX = face === 1 ? px + 2 : px + pw - 2;
      const tailBaseY = py + ph - 14 + bob;
      const tailTipX = face === 1 ? px - 12 + Math.cos(frameCount * 0.1) * 3 : px + pw + 12 - Math.cos(frameCount * 0.1) * 3;
      const tailTipY = py + ph - 20 + Math.sin(frameCount * 0.1) * 4;

      ctx.moveTo(tailBaseX, tailBaseY);
      ctx.quadraticCurveTo(tailBaseX - face * 8, tailBaseY - 10, tailTipX, tailTipY);
      ctx.quadraticCurveTo(tailBaseX - face * 4, tailBaseY + 6, tailBaseX, tailBaseY + 4);
      ctx.closePath();
      ctx.fill();

      // Eyes & Pupil
      ctx.fillStyle = '#ffffff';
      const eyeX = face === 1 ? px + pw - 14 : px + 6;
      ctx.fillRect(eyeX, bodyY + 8, 8, 9);
      ctx.fillStyle = '#000000';
      const pupilX = face === 1 ? eyeX + 4 : eyeX;
      ctx.fillRect(pupilX, bodyY + 10, 4, 5);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(pupilX + 1, bodyY + 10, 1.5, 1.5);

      // Cheek glow detail
      ctx.fillStyle = draco.detailColor;
      const cheekX = face === 1 ? px + pw - 8 : px + 2;
      ctx.fillRect(cheekX, bodyY + 20, 4, 4);

      // Shieldmon visual shields
      if (draco.name === 'Shieldmon' && draco.shieldActive) {
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.8)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(px + pw / 2, bodyY + ph / 2, pw + 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawSkillEffects = (draco: Draco) => {
      if (!ctx) return;

      const cx = draco.x + draco.width / 2;
      const cy = draco.y + draco.height / 2;
      const dir = draco.facing;

      // 1. Thundermon Raigeki strikes
      if (draco.name === 'Thundermon' && draco.ultTimer !== undefined && draco.ultTimer > 0) {
        if (draco.ultTimer % 8 === 0) {
          const strikeX = Math.random() * canvas.width;
          const strikeY = canvas.height - 45;
          const skyY = 0;

          // Lightning pillar path glow
          ctx.save();
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.lineWidth = 45;
          ctx.beginPath();
          ctx.moveTo(strikeX, skyY);
          ctx.lineTo(strikeX, strikeY);
          ctx.stroke();

          // Gold lightning bolt inner core
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(strikeX, skyY);
          const segments = 8;
          const totalY = strikeY - skyY;
          for (let s = 1; s <= segments; s++) {
            const jitter = (Math.random() - 0.5) * 35;
            ctx.lineTo(strikeX + jitter, skyY + s * (totalY / segments));
          }
          ctx.stroke();

          // Ground impact flash
          const craterGrad = ctx.createRadialGradient(strikeX, strikeY, 4, strikeX, strikeY, 50);
          craterGrad.addColorStop(0, '#ffffff');
          craterGrad.addColorStop(0.4, '#06b6d4');
          craterGrad.addColorStop(1, 'rgba(6,182,212,0)');
          ctx.fillStyle = craterGrad;
          ctx.beginPath();
          ctx.arc(strikeX, strikeY, 50, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. Enigmon Black Hole Singularity
      if (draco.name === 'Enigmon' && draco.blackHoleActive && draco.blackHoleX !== undefined && draco.blackHoleY !== undefined) {
        const bhX = draco.blackHoleX;
        const bhY = draco.blackHoleY;
        const radius = 32;
        const pulse = Math.sin(frameCount * 0.2) * 0.1 + 0.9;

        ctx.save();
        // outer gravity haze
        const hazeGrad = ctx.createRadialGradient(bhX, bhY, radius * 0.5, bhX, bhY, radius * 4);
        hazeGrad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
        hazeGrad.addColorStop(0.5, 'rgba(88, 28, 135, 0.15)');
        hazeGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
        ctx.fillStyle = hazeGrad;
        ctx.beginPath();
        ctx.arc(bhX, bhY, radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Accretion disk
        ctx.fillStyle = 'rgba(232, 121, 249, 0.65)';
        ctx.beginPath();
        ctx.ellipse(bhX, bhY, radius * 2.5 * pulse, radius * 0.4 * pulse, Math.PI / 10, 0, Math.PI * 2);
        ctx.fill();

        // Event horizon (Black void core)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(bhX, bhY, radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Glowing outer photon sphere
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bhX, bhY, radius * pulse + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Lunarmon Lunar Eclipse Radial Laser Beam
      if (draco.name === 'Lunarmon' && draco.ultTimer !== undefined && draco.ultTimer > 0) {
        const lx = cx;
        const ly = cy;
        const beamLen = canvas.width;
        // Sweep radial beam angle
        const angle = Math.PI / 6 + (Math.sin(frameCount * 0.05) * Math.PI / 3);
        const ex = lx + Math.cos(angle) * beamLen;
        const ey = ly + Math.sin(angle) * beamLen;

        ctx.save();
        // outer nebula glow
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.22)';
        ctx.lineWidth = 45;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // blue halo aura
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
        ctx.lineWidth = 26;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // white core beam
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Core bloom flare
        const bloom = ctx.createRadialGradient(lx, ly, 2, lx, ly, 30);
        bloom.addColorStop(0, '#ffffff');
        bloom.addColorStop(0.5, '#93c5fd');
        bloom.addColorStop(1, 'rgba(79,70,229,0)');
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(lx, ly, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Ground pulses (Schwarzschild, Moonbeam, Shadowraze)
      if (draco.pulseTimer !== undefined && draco.pulseX !== undefined && draco.pulseY !== undefined) {
        const sx = draco.pulseX;
        const sy = draco.pulseY;
        const alpha = Math.min(1.0, draco.pulseTimer / 8);

        ctx.save();
        ctx.globalAlpha = alpha;

        if (draco.name === 'Enigmon') {
          // Schwarzschild pulse oval zone
          const rx = 100;
          const ry = 18;
          const pPulse = Math.sin(frameCount * 0.2) * 0.1 + 0.9;

          const grad = ctx.createRadialGradient(sx, sy, ry * 0.2, sx, sy, rx);
          grad.addColorStop(0, 'rgba(232, 121, 249, 0.7)');
          grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.45)');
          grad.addColorStop(1, 'rgba(59, 7, 100, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(sx, sy, rx * pPulse, ry * pPulse, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (draco.name === 'Lunarmon') {
          // Vertical Moonbeam pillar from sky
          const skyY = 0;
          
          ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
          ctx.lineWidth = 45;
          ctx.beginPath();
          ctx.moveTo(sx, skyY);
          ctx.lineTo(sx, sy);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(sx, skyY);
          ctx.lineTo(sx, sy);
          ctx.stroke();

          // Ground impact flash
          const impact = ctx.createRadialGradient(sx, sy, 4, sx, sy, 35);
          impact.addColorStop(0, '#ffffff');
          impact.addColorStop(0.5, '#93c5fd');
          impact.addColorStop(1, 'rgba(147,197,253,0)');
          ctx.fillStyle = impact;
          ctx.beginPath();
          ctx.arc(sx, sy, 35, 0, Math.PI * 2);
          ctx.fill();
        } else if (draco.name === 'Shadowmon') {
          // Vertical dark void eruption pillar
          const beamH = 140;
          const beamTop = sy - beamH;

          const voidGrad = ctx.createLinearGradient(sx, beamTop, sx, sy);
          voidGrad.addColorStop(0, 'rgba(80, 0, 30, 0)');
          voidGrad.addColorStop(0.3, 'rgba(120, 10, 40, 0.7)');
          voidGrad.addColorStop(0.7, 'rgba(24, 24, 27, 0.9)');
          voidGrad.addColorStop(1, '#000000');
          ctx.fillStyle = voidGrad;

          ctx.beginPath();
          ctx.moveTo(sx - 20, sy);
          ctx.bezierCurveTo(sx - 26, sy - beamH * 0.4, sx - 16, sy - beamH * 0.75, sx, beamTop);
          ctx.bezierCurveTo(sx + 16, sy - beamH * 0.75, sx + 26, sy - beamH * 0.4, sx + 20, sy);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
    };

    const drawProjectiles = () => {
      if (!ctx) return;
      projectiles.forEach(p => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (p.type === 'arrow' || p.type === 'needle') {
          ctx.fillRect(p.x - p.width / 2, p.y - p.height / 2, p.width, p.height);
        } else if (p.type === 'fireball' || p.type === 'fire_rain' || p.type === 'arcane_orb' || p.type === 'dark_energy' || p.type === 'dark_matter') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'axe') {
          // Draw rotating axe
          ctx.translate(p.x, p.y);
          ctx.rotate(frameCount * 0.25);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, p.width / 2, 0, Math.PI * 1.5);
          ctx.stroke();
        } else if (p.type === 'crescent') {
          // Crescent moon wave
          ctx.translate(p.x, p.y);
          ctx.scale(p.vx > 0 ? 1 : -1, 1);
          ctx.beginPath();
          ctx.arc(0, 0, p.width / 2, -Math.PI / 2, Math.PI / 2, false);
          ctx.quadraticCurveTo(p.width * 0.25, 0, 0, -p.width / 2);
          ctx.fill();
        } else if (p.type === 'tornado') {
          // Swirling tornado lines
          const r = p.width / 2;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const h = (p.height / 4) * i;
            const size = (r / 4) * (i + 1);
            ctx.arc(p.x + Math.sin(frameCount * 0.4 + i) * 3, p.y - h, size, 0, Math.PI * 2);
          }
          ctx.stroke();
        }
        ctx.restore();
      });
    };

    const drawParticles = () => {
      if (!ctx) return;
      particles.forEach(p => {
        ctx.save();
        const pAlpha = p.life / p.maxLife;
        ctx.globalAlpha = pAlpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const drawFloatingTexts = () => {
      if (!ctx) return;
      floatingTexts.forEach(t => {
        ctx.save();
        const alpha = t.life / t.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = t.color;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        
        const size = Math.floor(10 * (t.scale || 1));
        ctx.font = `black ${size}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      });
    };

    // The Main Loop
    const tick = () => {
      if (!ctx) return;

      // Update simulation
      updateSimulation();

      // Screen shake transform
      ctx.save();
      if (screenShake > 0) {
        const dx = (Math.random() - 0.5) * screenShake;
        const dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
      }

      // Draw Parallax Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#090514'); // deep dark celestial sky
      skyGrad.addColorStop(0.5, '#130c24');
      skyGrad.addColorStop(1, '#1b1231');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Celestial stars drift in sky
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 35; i++) {
        const starX = (Math.sin(i * 45) * 0.5 + 0.5) * canvas.width;
        const starY = (Math.cos(i * 120) * 0.5 + 0.5) * canvas.height;
        const pulse = Math.sin(frameCount * 0.05 + i) * 0.25 + 0.75;
        ctx.beginPath();
        ctx.arc(starX, starY, (i % 3 === 0 ? 2 : 1) * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw floating island platforms
      drawPlatforms();

      // Draw all skills/ultimate overlays behind/around Dracos
      dracos.forEach(drawSkillEffects);

      // Draw Dracos
      dracos.forEach(drawDracoCharacter);

      // Draw projectiles
      drawProjectiles();

      // Draw particles
      drawParticles();

      // Draw labels/floating texts
      drawFloatingTexts();

      // Restore screen shake
      ctx.restore();

      // Draw a sleek semi-transparent dark overlay to keep foreground text highly readable
      ctx.fillStyle = 'rgba(12, 10, 16, 0.55)'; // Elegant deep violet-stone overlay
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(tick);
    };

    // Initialize
    resizeCanvas();
    spawnDracos();
    tick();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block bg-stone-950 pointer-events-none"
      style={{ display: 'block' }}
    />
  );
};

export default FullScreenShowcaseCanvas;
