/**
 * FloatingTextMessages.ts
 *
 * Single source of truth for every floating text string and its display color.
 * Each entry is a plain object `{ text, color }` so call sites simply do:
 *
 *   addFloatingText(x, y, FT.PORTAL_ENTERED.text, FT.PORTAL_ENTERED.color);
 *
 * Dynamic messages (those that embed runtime values) are exposed as functions
 * that return the same `{ text, color }` shape.
 */

export interface FloatingTextEntry {
  text: string;
  color: string;
}

// ---------------------------------------------------------------------------
// Movement / Jump
// ---------------------------------------------------------------------------
export const FT_DOUBLE_JUMP_FIRE: FloatingTextEntry   = { text: 'Double Jump!',   color: '#fbbf24' };
export const FT_DOUBLE_JUMP_NATURE: FloatingTextEntry = { text: 'Double Jump!',   color: '#34d399' };
export const FT_DOUBLE_JUMP_ICE: FloatingTextEntry    = { text: 'Double Jump!',   color: '#60a5fa' };
export const FT_FAST_PLUNGE: FloatingTextEntry        = { text: 'FAST PLUNGE!',   color: '#fbbf24' };
export const FT_BOING: FloatingTextEntry              = { text: 'BOING!',       color: '#38bdf8' };
export const FT_BOUNCE_STRIKE: FloatingTextEntry      = { text: 'BOUNCE STRIKE!', color: '#fbbf24' };
export const FT_FELL_VOID: FloatingTextEntry          = { text: 'FELL INTO THE VOID!', color: '#ef4444' };

// ---------------------------------------------------------------------------
// Portal
// ---------------------------------------------------------------------------
export const FT_PORTAL_ENTERED: FloatingTextEntry        = { text: 'PORTAL ENTERED!',                      color: '#a855f7' };
export const FT_EXIT_PORTAL_CLEARED: FloatingTextEntry   = { text: 'EXIT PORTAL ENTERED! STAGE CLEARED!', color: '#a855f7' };
export const FT_DEFEAT_BOSS_FIRST: FloatingTextEntry     = { text: 'DEFEAT THE BOSS FIRST TO UNLOCK PORTAL!', color: '#ef4444' };
export const FT_FINAL_BOSS_SLAIN: FloatingTextEntry      = { text: 'FINAL BOSS SLAIN! EXIT PORTAL SPAWNED!', color: '#f59e0b' };

// ---------------------------------------------------------------------------
// Player Status
// ---------------------------------------------------------------------------
export const FT_STUNNED: FloatingTextEntry          = { text: 'STUNNED!',            color: '#ef4444' };
export const FT_ROOTED: FloatingTextEntry           = { text: 'ROOTED!',          color: '#22c55e' };
export const FT_BLOCKED: FloatingTextEntry          = { text: 'BLOCKED!',                color: '#60a5fa' };
export const FT_AIR_DODGED_STUN: FloatingTextEntry  = { text: 'AIR DODGED STUN!',    color: '#38bdf8' };
export const FT_NEED_ENERGY: FloatingTextEntry      = { text: 'NEED MORE ENERGY!',    color: '#f59e0b' };
export const FT_NOT_ENOUGH_ENERGY_30: FloatingTextEntry = { text: 'NOT ENOUGH ENERGY! (30 Req.)', color: '#ef4444' };
export const FT_ULTIMATE_UNLOCK_LV5: FloatingTextEntry  = { text: 'ULTIMATE UNLOCKS AT LV.5!', color: '#a855f7' };
export const FT_NO_ENEMIES_IN_RANGE: FloatingTextEntry  = { text: 'NO ENEMIES IN RANGE!',         color: '#94a3b8' };

// ---------------------------------------------------------------------------
// Player Abilities — Skills
// ---------------------------------------------------------------------------
export const FT_SHIELD_CHARGE: FloatingTextEntry        = { text: 'SHIELD CHARGE!',           color: '#60a5fa' };
export const FT_SHADOW_DASH: FloatingTextEntry          = { text: 'SHADOW DASH!',            color: '#a855f7' };
export const FT_MEGA_SPIN: FloatingTextEntry            = { text: 'MEGA SPIN!',              color: '#fbbf24' };
export const FT_SHIELD_TRAMPLE_DASH: FloatingTextEntry  = { text: 'SHIELD TRAMPLE DASH!',   color: '#3b82f6' };
export const FT_BIRD_SUMMONED: FloatingTextEntry        = { text: 'BIRD FAMILIAR SUMMONED!',    color: '#38bdf8' };
export const FT_HOMING_BOMB_ROCK: FloatingTextEntry     = { text: 'HOMING BOMB ROCK!',     color: '#ea580c' };
export const FT_ELECTROTACKLE: FloatingTextEntry        = { text: 'ELECTROTACKLE!',           color: '#06b6d4' };
export const FT_SCHWARZSCHILD_PULSE: FloatingTextEntry  = { text: 'SCHWARZSCHILD PULSE!',    color: '#c084fc' };
export const FT_MOONBEAM: FloatingTextEntry             = { text: 'MOONBEAM! (+25 Energy)',    color: '#93c5fd' };
export const FT_CHAOS_METEOR: FloatingTextEntry         = { text: 'CHAOS METEOR!',              color: '#f97316' };
export const FT_TORNADO: FloatingTextEntry              = { text: 'TORNADO!',                   color: '#06b6d4' };
export const FT_SUN_STRIKE: FloatingTextEntry           = { text: 'SUN STRIKE!',              color: '#f59e0b' };
export const FT_GUST_PUSH_BACK: FloatingTextEntry       = { text: 'GUST PUSH BACK!',         color: '#f43f5e' };
export const FT_GROUND_SHOCKWAVE: FloatingTextEntry     = { text: 'GROUND SHOCKWAVE!',          color: '#ef4444' };
export const FT_LANDMINE_DETONATED: FloatingTextEntry   = { text: 'LANDMINE DETONATED!',        color: '#ef4444' };
export const FT_SHIELD_CHARGE_AURA: FloatingTextEntry   = { text: 'SHIELD CHARGE!',            color: '#60a5fa' };

// ---------------------------------------------------------------------------
// Player Abilities — Ultimates
// ---------------------------------------------------------------------------
export const FT_SHADOWRAZE: FloatingTextEntry            = { text: 'SHADOWRAZE!',                   color: '#ef4444' };
export const FT_DOUBLE_ARROW_RAIN: FloatingTextEntry     = { text: 'DOUBLE ARROW RAIN!',    color: '#10b981' };
export const FT_SKYWARD_ARROW_SHOT: FloatingTextEntry    = { text: 'SKYWARD ARROW SHOT!',          color: '#10b981' };
export const FT_HYPER_CHARGED_LASER: FloatingTextEntry   = { text: 'HYPER BEAM!',         color: '#f43f5e' };
export const FT_BLACK_HOLE_SINGULARITY: FloatingTextEntry = { text: 'BLACK HOLE (MOVE TO CANCEL)', color: '#e879f9' };
export const FT_AVATAR_STATE: FloatingTextEntry          = { text: 'AVATAR STATE!',               color: '#60a5fa' };
export const FT_METEOR_SMACKDOWN: FloatingTextEntry      = { text: 'METEOR SMACKDOWN!',             color: '#ef4444' };
export const FT_SINGLE_SLASH_OF_DEATH: FloatingTextEntry = { text: 'SINGLE SLASH OF DEATH!',      color: '#c084fc' };
export const FT_AEGIS_SHIELD_DOME: FloatingTextEntry     = { text: 'AEGIS SHIELD DOME!',      color: '#3b82f6' };
export const FT_RAIGEKI_THUNDERBOLTS: FloatingTextEntry  = { text: 'RAIGEKI THUNDERBOLTS!',       color: '#06b6d4' };
export const FT_TRIO_ORB_BLAST: FloatingTextEntry        = { text: 'TRIO ORB BLAST!',           color: '#a855f7' };
export const FT_PRIMAL_ROAR: FloatingTextEntry           = { text: 'PRIMAL ROAR',                color: '#f97316' };
export const FT_LUNAR_ECLIPSE: FloatingTextEntry         = { text: 'LUNAR ECLIPSE!',              color: '#c7d2fe' };
export const FT_CHARGING_CARPET_BOMBING: FloatingTextEntry = { text: 'CARPET BOMBING!', color: '#f97316' };
export const FT_CARPET_BOMBING_FLAME: FloatingTextEntry  = { text: 'ETERNAL FLAME!', color: '#ef4444' };

// ---------------------------------------------------------------------------
// Player Abilities — Channeling
// ---------------------------------------------------------------------------
export function FT_CHANNEL_INTERRUPTED(reason: string): FloatingTextEntry {
  return { text: `CHANNEL INTERRUPTED (${reason.toUpperCase()})!`, color: '#f87171' };
}

// ---------------------------------------------------------------------------
// Player Abilities — Shadowmon-specific
// ---------------------------------------------------------------------------
export function FT_DARK_SOUL_STACK(stacks: number): FloatingTextEntry {
  return { text: `+1 DARK SOUL STACK (${stacks}/5)`, color: '#ef4444' };
}
export function FT_CHARGING_SOUL_BLAST(stacks: number): FloatingTextEntry {
  return { text: `CHARGING SOUL BLAST (${stacks}/5 STACKS)`, color: '#ef4444' };
}

// ---------------------------------------------------------------------------
// Projectile Impacts (player projectiles hitting things)
// ---------------------------------------------------------------------------
export const FT_METEOR_IMPACT_ORANGE: FloatingTextEntry = { text: 'METEOR IMPACT!', color: '#f97316' };
export const FT_METEOR_IMPACT_RED: FloatingTextEntry    = { text: 'METEOR IMPACT!', color: '#ef4444' };
export const FT_SOLAR_EXPLOSION: FloatingTextEntry      = { text: 'SOLAR EXPLOSION!', color: '#f59e0b' };
export const FT_STUNNED_TORNADO: FloatingTextEntry      = { text: 'STUNNED!',           color: '#fbbf24' };
export const FT_LIFTED_TORNADO: FloatingTextEntry       = { text: 'LIFTED INTO TORNADO!', color: '#06b6d4' };
export const FT_SOUL_WAVE_HIT: FloatingTextEntry        = { text: 'SOUL WAVE HIT!',   color: '#ef4444' };
export const FT_ELECTRIC_EXPLOSION: FloatingTextEntry   = { text: 'ELECTRIC EXPLOSION!', color: '#06b6d4' };
export const FT_SHIELD_BURST: FloatingTextEntry         = { text: 'SHIELD BURST!',  color: '#fbbf24' };
export const FT_TRAMPLED: FloatingTextEntry             = { text: 'TRAMPLED!',      color: '#3b82f6' };

// ---------------------------------------------------------------------------
// Ultimate Cinematic (generic name injected at runtime)
// ---------------------------------------------------------------------------
export function FT_ULTIMATE_CINEMATIC(name: string): FloatingTextEntry {
  return { text: `${name.toUpperCase()}!!! 💀`, color: '#ef4444' };
}

// ---------------------------------------------------------------------------
// Area / Musou Slash (hit-count injected at runtime)
// ---------------------------------------------------------------------------
export function FT_AREA_KATANA_SLASH(hitCount: number): FloatingTextEntry {
  return { text: `AREA KATANA SLASH (${hitCount} ENEMIES)!`, color: '#c084fc' };
}
export function FT_DIMENSIONAL_SHATTER(hitCount: number): FloatingTextEntry {
  return { text: `DIMENSIONAL SHATTER (${hitCount} ENEMIES)!`, color: '#ef4444' };
}

// ---------------------------------------------------------------------------
// Black-hole / Singularity (damage injected at runtime)
// ---------------------------------------------------------------------------
export function FT_SINGULARITY_DAMAGE(bhDmg: number): FloatingTextEntry {
  return { text: `SINGULARITY -${bhDmg} HP! 🌌`, color: '#e879f9' };
}
export function FT_PULSE_DAMAGE(pulseDmg: number): FloatingTextEntry {
  return { text: `PULSE -${pulseDmg} HP! ⚡`, color: '#c084fc' };
}
export const FT_SUPERNOVA_DETONATION: FloatingTextEntry    = { text: 'SUPERNOVA DETONATION!', color: '#ef4444' };
export const FT_SUPERNOVA_EXPLOSION: FloatingTextEntry     = { text: 'SUPERNOVA EXPLOSION!', color: '#ef4444' };

// ---------------------------------------------------------------------------
// Enemy Actions / Events
// ---------------------------------------------------------------------------
export const FT_SKELETON_DESTROYED: FloatingTextEntry   = { text: 'SKELETON DESTROYED!',          color: '#94a3b8' };
export const FT_KING_KONG_SLAIN: FloatingTextEntry      = { text: 'KING KONG SLAIN!',           color: '#f59e0b' };
export const FT_GIANT_WISP_SLAIN: FloatingTextEntry     = { text: 'GIANT WISP OVERLORD SLAIN!', color: '#c084fc' };
export const FT_IMMUNE_OUT_OF_RANGE: FloatingTextEntry  = { text: 'IMMUNE!',            color: '#38bdf8' };
export const FT_GLADIATOR_RUSH: FloatingTextEntry       = { text: 'GLADIATOR RUSH CHARGE!',  color: '#ef4444' };
export const FT_DISINTEGRATED_BONES: FloatingTextEntry  = { text: 'DISINTEGRATED TO BONES!',      color: '#facc15' };
export const FT_ECLIPSE_MOONBEAM: FloatingTextEntry     = { text: 'ECLIPSE MOONBEAM!',             color: '#93c5fd' };
export const FT_CELESTIAL_TICK: FloatingTextEntry       = { text: 'CELESTIAL TICK!',               color: '#93c5fd' };
export const FT_ELECTROCUTED: FloatingTextEntry         = { text: 'ELECTROCUTED!',                 color: '#06b6d4' };
export const FT_BURN: FloatingTextEntry                 = { text: 'BURNED!',                         color: '#ea580c' };
export const FT_LEVIATHAN_VORTEX: FloatingTextEntry     = { text: 'LEVIATHAN VORTEX CAST!',      color: '#06b6d4' };
export const FT_HOMING_LASER: FloatingTextEntry         = { text: 'HOMING LASER FIRED!',           color: '#a855f7' };
export const FT_STUNNED_2S: FloatingTextEntry           = { text: 'STUNNED 2s!',                  color: '#60a5fa' };

export function FT_GORILLA_LEAP(jumpCount: number): FloatingTextEntry {
  return { text: `GORILLA LEAP! (${jumpCount} LEAPS)`, color: '#f59e0b' };
}
export const FT_SEISMIC_GROUND_SLAM: FloatingTextEntry  = { text: 'SEISMIC GROUND SLAM! STUNNED 2s! 💥🌍', color: '#ef4444' };
export const FT_GLADIATOR_RUSH_STUN: FloatingTextEntry  = { text: 'GLADIATOR RUSH STUN! STUNNED 1.0s! 🛡️💥', color: '#ef4444' };

export function FT_SKELETON_REVIVED(reviveCount: number): FloatingTextEntry {
  return { text: `SKELETON REVIVED! (${reviveCount} Lives Left)`, color: '#94a3b8' };
}

// ---------------------------------------------------------------------------
// Bird Familiar (damage injected at runtime)
// ---------------------------------------------------------------------------
export function FT_BIRD_DAMAGE(damage: number, isRampage: boolean): FloatingTextEntry {
  return { text: `${damage} 🦅`, color: isRampage ? '#f97316' : '#38bdf8' };
}

// ---------------------------------------------------------------------------
// Enemy Defeat Rewards (coin/exp injected at runtime)
// ---------------------------------------------------------------------------
export function FT_EXP_REWARD(exp: number): FloatingTextEntry {
  return { text: `+${exp} EXP`, color: '#3b82f6' };
}
export function FT_COIN_REWARD(coins: number): FloatingTextEntry {
  return { text: `+${coins} Coins`, color: '#eab308' };
}

// ---------------------------------------------------------------------------
// Pickups
// ---------------------------------------------------------------------------
export function FT_COIN_PICKUP(amount: number): FloatingTextEntry {
  return { text: `+${amount} Coins`, color: '#fbbf24' };
}
export const FT_POTION_PICKUP: FloatingTextEntry       = { text: '+1 Potion',        color: '#10b981' };
export const FT_UPGRADE_STONE_PICKUP: FloatingTextEntry = { text: '+1 Upgrade Stone', color: '#a855f7' };

// ---------------------------------------------------------------------------
// Player HP changes (damage/heal injected at runtime)
// ---------------------------------------------------------------------------
export function FT_HEAL(amount: number): FloatingTextEntry {
  return { text: `+${amount} HP`, color: '#10b981' };
}
export function FT_DAMAGE(netDamage: number): FloatingTextEntry {
  return { text: `-${netDamage} HP`, color: '#ef4444' };
}
export function FT_SHADOW_CLOUD_DAMAGE(dmg: number): FloatingTextEntry {
  return { text: `SHADOW CLOUD -${dmg} HP! 💀☁️`, color: '#a855f7' };
}

// ---------------------------------------------------------------------------
// Survival Arena
// ---------------------------------------------------------------------------
export const FT_ARENA_ERUPTED: FloatingTextEntry  = { text: 'ARENA ERUPTED! IMMORTAL GLADIATOR AWAKENED!', color: '#ef4444' };
export const FT_ARENA_SURVIVED: FloatingTextEntry = { text: 'ARENA SURVIVED! EXIT PORTAL UNLOCKED!',         color: '#f59e0b' };

// ---------------------------------------------------------------------------
// Hazard: HazardManager (tile-based instant-kill / damage traps)
// ---------------------------------------------------------------------------
export const FT_TOXIC_SWAMP: FloatingTextEntry           = { text: 'TOXIC ACID MELTDOWN!', color: '#22c55e' };
export const FT_WHIRLPOOL: FloatingTextEntry             = { text: 'SUCKED INTO WHIRLPOOL!',      color: '#06b6d4' };
export const FT_SHADOW_CLOUD_POOL: FloatingTextEntry     = { text: 'SHADOW CLOUD -20 HP!',        color: '#a855f7' };
export const FT_DIVINE_THUNDERBOLT: FloatingTextEntry    = { text: 'THUNDERSTRUCK!', color: '#eab308' };
export const FT_FLASH_FREEZE: FloatingTextEntry          = { text: 'FROZEN TO DEATH!',      color: '#38bdf8' };
export const FT_MOLTEN_LAVA: FloatingTextEntry           = { text: 'MELTED BY MOLTEN LAVA!',         color: '#ef4444' };

// ---------------------------------------------------------------------------
// Hazard: Player death animations
// ---------------------------------------------------------------------------
export const FT_REAPED_BY_DEATH: FloatingTextEntry        = { text: 'REAPED BY DEATH!',           color: '#a855f7' };
export const FT_THUNDERSTRUCK: FloatingTextEntry          = { text: 'THUNDERSTRUCK!',              color: '#eab308' };
export const FT_ABSOLUTE_FROZEN: FloatingTextEntry        = { text: 'ABSOLUTE FROZEN!',           color: '#38bdf8' };
export const FT_DISSOLVED_ANTIMATTER: FloatingTextEntry   = { text: 'DISSOLVED IN ANTIMATTER FIELD!', color: '#06b6d4' };
export const FT_MOLTEN_LAVA_MELTED: FloatingTextEntry     = { text: 'MELTED INTO MOLTEN LAVA!',        color: '#ef4444' };

// ---------------------------------------------------------------------------
// Stage Gimmick: Volcano / Fire
// ---------------------------------------------------------------------------
export const FT_ERUPTING_FIREBALL: FloatingTextEntry  = { text: 'BURNED!',     color: '#ef4444' };
export const FT_FROSTBITE_SLOW: FloatingTextEntry     = { text: 'FROSTBITED!',           color: '#38bdf8' };
export const FT_POISON_FOG: FloatingTextEntry         = { text: 'BLINDED!',    color: '#a855f7' };
export const FT_DIVINE_TB_STRIKE: FloatingTextEntry   = { text: 'THUNDERSTRUCK!', color: '#eab308' };
export const FT_DEVOURED_SKY_DRAGON: FloatingTextEntry = { text: 'DEVOURED!', color: '#ef4444' };
export const FT_GLACIAL_ICE_SLOW: FloatingTextEntry   = { text: 'SLOWED!',         color: '#38bdf8' };
export const FT_CRUSHED_GIANT_METEOR: FloatingTextEntry = { text: 'CRUSHED!', color: '#ef4444' };
export const FT_BOSS_METEOR_IMPACT: FloatingTextEntry  = { text: 'METEOR IMPACT', color: '#ef4444' };
export const FT_CRUSHED_BY_METEOR: FloatingTextEntry   = { text: 'CRUSHED!',        color: '#ef4444' };
export const FT_ANTIMATTER_DISINTEGRATED: FloatingTextEntry = { text: 'DISINTEGRATED!', color: '#06b6d4' };
export const FT_COMET_BULLET_IMPACT: FloatingTextEntry  = { text: 'COMET IMPACT!', color: '#ef4444' };

export function FT_LAVA_BURN(burnDamage: number): FloatingTextEntry {
  return { text: `LAVA BURN -${burnDamage} HP!`, color: '#ef4444' };
}
export function FT_INFERNO_FIRE(burnDamage: number): FloatingTextEntry {
  return { text: `INFERNO FIRE -${burnDamage} HP!`, color: '#ef4444' };
}
export const FT_TOXIC_DRAGON_POISON: FloatingTextEntry = { text: 'TOXIC DRAGON POISON!', color: '#22c55e' };

export const FT_BURN_EXPLOSION: FloatingTextEntry = { text: 'EXPLOSION!', color: '#f97316' };
export const FT_PRIMORDIAL_GOD_CONQUERED: FloatingTextEntry = { text: 'PRIMORDIAL GOD CONQUERED!', color: '#f59e0b' };

export function FT_SOUL_BLAST_WAVES(totalWaves: number): FloatingTextEntry {
  return { text: `SOUL BLAST`, color: '#ef4444' };
}

