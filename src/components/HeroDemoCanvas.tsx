import React, { useEffect, useRef, useState } from 'react';
import { Sword, Sparkles, Zap, Wand2, CheckCircle2 } from 'lucide-react';
import { GameEngine } from '../game/GameEngine';
import { PlayerStats } from '../types/game';

export interface ScepterUpgradeInfo {
  title: string;
  badge: string;
  description: string;
  features: string[];
  themeColor: string;
  borderClass: string;
  bgGradient: string;
}

export const HEROES_WITH_SCEPTER: Record<string, ScepterUpgradeInfo> = {
  Jumpmon: {
    title: 'Planetfall & Echo Slam',
    badge: 'DEDICATED SCEPTER',
    description: 'When reaching the ground from ultimate, gains Planetfall buff for 8 seconds, turning his body sea-greenish.',
    features: [
      '8s Planetfall buff with radiant sea-greenish body & aura',
      'Landing on the ground stuns enemies for 1s and deals heavy damage',
      'Damaged foes emit Echo Waves targeting all other nearby enemies (Like Earthshaker Echo Slam)'
    ],
    themeColor: 'text-teal-300',
    borderClass: 'border-teal-500/60',
    bgGradient: 'from-teal-950/70 via-emerald-950/40 to-stone-950'
  },
  Archermon: {
    title: 'Explosive Arrow Shower',
    badge: 'DEDICATED SCEPTER',
    description: 'Falling arrows from the Arrow Shower explode upon impacting foes or terrain, dealing AoE burst damage.',
    features: [
      'Every falling arrow shower projectile explodes violently on impact',
      'Explosions trigger upon contacting enemies or solid ground',
      'Deals area burst damage with radiant emerald particle shockwaves'
    ],
    themeColor: 'text-emerald-300',
    borderClass: 'border-emerald-500/60',
    bgGradient: 'from-emerald-950/70 via-teal-950/40 to-stone-950'
  },
  Shieldmon: {
    title: 'Aegis Immunity & Dome Detonation',
    badge: 'DEDICATED SCEPTER',
    description: 'Shieldmon gains 4s of complete damage immunity with 3.0x damage. When the dome expires, it violently detonates.',
    features: [
      'Complete damage immunity (invulnerable) for 4 seconds',
      'Deals triple (3.0x) damage for the entire 4-second duration',
      'When dome expires, detonates in a 320px shockwave: heavy damage and 2s stun'
    ],
    themeColor: 'text-blue-300',
    borderClass: 'border-blue-500/60',
    bgGradient: 'from-blue-950/70 via-indigo-950/40 to-stone-950'
  },
  Flymon: {
    title: 'Gale Cataclysm & Fall Slam',
    badge: 'DEDICATED SCEPTER',
    description: 'Tornado sucks enemies 2x faster with violent gale DoT. When tornado ends, lifted foes crash down for heavy fall damage and a 2s stun.',
    features: [
      '2x faster vortex suction pulling enemies relentlessly into the epicenter',
      'Rapid gale DoT dealing continuous slicing damage inside the core every 8 frames',
      'Terminal ground crash: falling enemies suffer massive impact damage and are stunned for 2 seconds'
    ],
    themeColor: 'text-cyan-300',
    borderClass: 'border-cyan-500/60',
    bgGradient: 'from-cyan-950/70 via-sky-950/40 to-stone-950'
  },
  Assassinmon: {
    title: 'Shining Blade & Rupture Slashes',
    badge: 'DEDICATED SCEPTER',
    description: 'After the ultimate slash, blade shines for 8s. Attacks fire homing dark cleaves inflicting Rupture Bleed. Enemy movement deals extra damage, and kills trigger screen-wide lethal slashes that reset the buff.',
    features: [
      '8-second Shining Katana buff unlocked following Single Slash of Death',
      'Basic attacks launch homing Dark Cleaves inflicting 2s Rupture Bleed',
      'Bleeding enemies take additional rupture damage whenever they move',
      'Kills under Rupture trigger a screen-wide lethal slash and reset buff duration'
    ],
    themeColor: 'text-fuchsia-300',
    borderClass: 'border-fuchsia-500/60',
    bgGradient: 'from-fuchsia-950/70 via-purple-950/40 to-stone-950'
  },
  Whitemon: {
    title: 'Celestial Hawk & Gale Salvo',
    badge: 'DEDICATED SCEPTER',
    description: 'The companion bird transforms into a Celestial Hawk. Instead of melee pecking, it hovers and fires high-speed Wind Gusts with +50% fire rate and +60% damage.',
    features: [
      'Bird companion evolves into a majestic Celestial Hawk with radiant golden plumage',
      'Switches from melee swoop to ranged Wind Gust artillery',
      '+50% attack speed fire rate and +60% gust projectile damage'
    ],
    themeColor: 'text-amber-200',
    borderClass: 'border-amber-400/60',
    bgGradient: 'from-amber-950/70 via-stone-900/40 to-stone-950'
  },
  Bombamon: {
    title: 'Azure Hellfire & Flare Beam',
    badge: 'DEDICATED SCEPTER',
    description: 'Ground flames turn into bluish flame dealing massive damage and spreading up to 200px. Expiring flames explode into contagious back-and-forth burns. While any ground is burning, basic attack becomes explosive Flare Beam.',
    features: [
      'Ground flames transform into blazing bluish fire with +200% burn damage',
      'Homing Bomb flames spread across terrain up to 200px (ultimate flames remain focused and stationary)',
      'Expiring flames detonate in a heavy explosion applying contagious burns that spread between enemies back and forth',
      'While any ground is burning, basic attack transforms into explosive Flare Beam that detonates and burns on impact'
    ],
    themeColor: 'text-sky-300',
    borderClass: 'border-sky-500/60',
    bgGradient: 'from-sky-950/70 via-blue-950/40 to-stone-950'
  },
  Thundermon: {
    title: 'Thunder Relic & Thunderbolt Cascade',
    badge: 'DEDICATED SCEPTER',
    description: 'When ultimate hits enemies, summons an ancient Thunder Relic that strikes nearby enemies with thunderbolts every 2s for 8s. Kills replicate another relic for half duration.',
    features: [
      'Ultimate strikes summon hovering Thunder Relics lasting 8 seconds',
      'Relic zaps all nearby enemies every 2 seconds with Thundermon’s Raigeki thunderbolt',
      'When an enemy is killed, summons an additional Thunder Relic for half the duration of the relic that killed it'
    ],
    themeColor: 'text-amber-300',
    borderClass: 'border-amber-500/60',
    bgGradient: 'from-amber-950/70 via-yellow-950/40 to-stone-950'
  }
};

interface HeroDemoCanvasProps {
  selectedDraco: string;
}

export const HeroDemoCanvas: React.FC<HeroDemoCanvasProps> = ({ selectedDraco }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [actionType, setActionType] = useState<'attack' | 'special' | 'ultimate' | 'scepter'>('ultimate');
  const [loopProgress, setLoopProgress] = useState(0);

  const scepterInfo = HEROES_WITH_SCEPTER[selectedDraco];
  const hasScepter = Boolean(scepterInfo);

  useEffect(() => {
    if (actionType === 'scepter' && !hasScepter) {
      setActionType('ultimate');
    }
  }, [selectedDraco, hasScepter, actionType]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = 480;
    canvas.height = 240;

    const isScepterAction = actionType === 'scepter';

    const stats: PlayerStats = {
      hp: 9999,
      attack: 14,
      defense: 10,
      speed: 8,
      jump: 11,
      range: 8,
      energyRegen: 100,
      level: 15,
      hasScepter: isScepterAction,
    } as any;

    const dummyCallbacks = {
      onCoinCollect: () => {},
      onItemCollect: () => {},
      onEnemyDefeat: () => {},
      onHpChange: () => {},
      onEnergyChange: () => {},
      onStageClear: () => {},
      onPlayerDeath: () => {},
    };

    // Initialize Game Engine in demo mode
    const engine = new GameEngine(
      canvas,
      1,
      selectedDraco,
      stats,
      dummyCallbacks,
      true
    );

    if (isScepterAction) {
      engine.setHasScepter(true);
    }

    engineRef.current = engine;

    // Trigger action immediately
    const firstTimer = setTimeout(() => {
      engine.triggerAction(actionType);
    }, 300);

    // Follow-up actions for scepter demos
    const followupTimers: NodeJS.Timeout[] = [];
    const triggerFollowups = () => {
      if (!isScepterAction) return;
      if (selectedDraco === 'Jumpmon') {
        const t = setTimeout(() => {
          if (engineRef.current) engineRef.current.triggerAction('jump');
        }, 3400);
        followupTimers.push(t);
      } else if (selectedDraco === 'Assassinmon') {
        // Follow up with attacks using the shining blade to unleash dark cleaves
        const t1 = setTimeout(() => {
          if (engineRef.current) engineRef.current.triggerAction('attack');
        }, 1600);
        const t2 = setTimeout(() => {
          if (engineRef.current) engineRef.current.triggerAction('attack');
        }, 2200);
        const t3 = setTimeout(() => {
          if (engineRef.current) engineRef.current.triggerAction('attack');
        }, 2900);
        followupTimers.push(t1, t2, t3);
      } else if (selectedDraco === 'Whitemon') {
        const t1 = setTimeout(() => {
          if (engineRef.current) engineRef.current.triggerAction('attack');
        }, 1200);
        followupTimers.push(t1);
      } else if (selectedDraco === 'Bombamon') {
        // Follow up with basic attack while ground is burning to demonstrate Flare Beam
        const t1 = setTimeout(() => {
          if (engineRef.current) engineRef.current.triggerAction('attack');
        }, 1800);
        const t2 = setTimeout(() => {
          if (engineRef.current) engineRef.current.triggerAction('attack');
        }, 2600);
        const t3 = setTimeout(() => {
          if (engineRef.current) engineRef.current.triggerAction('attack');
        }, 3400);
        followupTimers.push(t1, t2, t3);
      }
    };

    triggerFollowups();

    // Loop duration per action type
    let LOOP_DURATION = 5000;
    switch (actionType) {
      case 'attack':
        LOOP_DURATION = 2000;
        break;
      case 'special':
        LOOP_DURATION = 4000;
        break;
      case 'ultimate':
        LOOP_DURATION = 7000;
        break;
      case 'scepter':
        LOOP_DURATION = selectedDraco === 'Shieldmon' ? 7500 : (selectedDraco === 'Bombamon' || selectedDraco === 'Thundermon') ? 8500 : selectedDraco === 'Flymon' ? 6500 : selectedDraco === 'Whitemon' ? 6000 : 7000;
        break;
      default:
        break;
    }

    let startTime = performance.now();
    let loopAnimId: number;

    const updateLoopBar = (now: number) => {
      const elapsed = (now - startTime) % LOOP_DURATION;
      setLoopProgress(elapsed / LOOP_DURATION);
      loopAnimId = requestAnimationFrame(updateLoopBar);
    };

    loopAnimId = requestAnimationFrame(updateLoopBar);

    const loopInterval = setInterval(() => {
      if (engineRef.current) {
        if (isScepterAction) {
          engineRef.current.setHasScepter(true);
        }
        engineRef.current.triggerAction(actionType);
        triggerFollowups();
      }
    }, LOOP_DURATION);

    return () => {
      clearTimeout(firstTimer);
      followupTimers.forEach(t => clearTimeout(t));
      clearInterval(loopInterval);
      cancelAnimationFrame(loopAnimId);
      engine.destroy();
      engineRef.current = null;
    };
  }, [selectedDraco, actionType, hasScepter]);

  return (
    <div className="w-full space-y-3 select-none">
      {/* PREVIEW TABS: ATTACK / SPECIAL / ULTIMATE / SCEPTER (IF AVAILABLE) */}
      <div className={`grid gap-1.5 p-1 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 ${
        hasScepter ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
      }`}>
        <button
          onClick={() => setActionType('attack')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
            actionType === 'attack'
              ? 'bg-amber-500 text-stone-950 shadow-md ring-1 ring-amber-300'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <Sword className="w-3 h-3" />
          <span>Basic Attack</span>
        </button>

        <button
          onClick={() => setActionType('special')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
            actionType === 'special'
              ? 'bg-sky-500 text-stone-950 shadow-md ring-1 ring-sky-300'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Skill Preview</span>
        </button>

        <button
          onClick={() => setActionType('ultimate')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
            actionType === 'ultimate'
              ? 'bg-rose-500 text-white shadow-md ring-1 ring-rose-300 animate-pulse'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>Ultimate</span>
        </button>

        {hasScepter && (
          <button
            onClick={() => setActionType('scepter')}
            className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-extrabold flex items-center justify-center gap-1 transition-all ${
              actionType === 'scepter'
                ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 text-white shadow-lg ring-1 ring-rose-300 shadow-purple-950/60'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/50 border border-purple-800/50'
            }`}
          >
            <Wand2 className="w-3 h-3 text-amber-300 animate-bounce" />
            <span>🪄 Scepter</span>
          </button>
        )}
      </div>

      {/* CLEAN CANVAS CONTAINER */}
      <div className="w-full relative rounded-2xl overflow-hidden border border-stone-800 shadow-xl bg-stone-950" style={{ aspectRatio: '2 / 1' }}>
        <canvas
          ref={canvasRef}
          width={480}
          height={240}
          className="absolute inset-0 w-full h-full block bg-stone-950 cursor-pointer"
          onClick={() => {
            if (actionType === 'scepter') {
              engineRef.current?.setHasScepter(true);
            }
            engineRef.current?.triggerAction(actionType);
          }}
          title="Click canvas to trigger action!"
        />

        {/* SCEPTER ACTIVE BADGE OVERLAY */}
        {actionType === 'scepter' && scepterInfo && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-stone-950/80 backdrop-blur-md rounded-lg border border-purple-500/50 text-[10px] font-mono font-black text-amber-300 shadow-lg pointer-events-none">
            <Wand2 className="w-3 h-3 text-amber-400" />
            <span>SCEPTER UPGRADE ACTIVE</span>
          </div>
        )}

        {/* BOTTOM LOOP PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-900 overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ${
              actionType === 'attack'
                ? 'bg-amber-400'
                : actionType === 'special'
                ? 'bg-sky-400'
                : actionType === 'scepter'
                ? 'bg-gradient-to-r from-rose-500 via-purple-400 to-amber-400'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400'
            }`}
            style={{ width: `${loopProgress * 100}%` }}
          />
        </div>
      </div>

      {/* SCEPTER PREVIEW SHOWCASE PANEL */}
      {actionType === 'scepter' && scepterInfo && (
        <div className={`p-3.5 rounded-2xl border ${scepterInfo.borderClass} bg-gradient-to-br ${scepterInfo.bgGradient} shadow-xl space-y-2 text-left`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🪄</span>
              <h5 className="text-xs font-black uppercase tracking-wider text-white font-display">
                {scepterInfo.title}
              </h5>
            </div>
            <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/50 uppercase tracking-wider">
              {scepterInfo.badge}
            </span>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed font-mono">
            {scepterInfo.description}
          </p>

          <div className="grid grid-cols-1 gap-1 pt-1 border-t border-white/10">
            {scepterInfo.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px] text-stone-200 font-mono">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroDemoCanvas;
