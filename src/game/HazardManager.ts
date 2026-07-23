import { soundService } from '../services/sound';

export interface HazardState {
  skeletonDeathTimer: number;      // Poison Swamp / Molten Lava Acid Meltdown
  frozenDeathTimer: number;        // Sub-Zero Flash Freeze
  electrocutionDeathTimer: number;  // Divine Thunderbolt Electrocution
  reaperDeathTimer: number;        // Grim Reaper Scythe Slash
}

export class HazardManager {
  /**
   * Evaluates hazard tile triggers ('X' for Poison Swamp, '*' for Hazard Pools)
   */
  public static checkHazardContact(
    pxMid: number,
    pyFeet: number,
    px: number,
    py: number,
    pWidth: number,
    pHP: number,
    themeType: string,
    getTileSymbol: (x: number, y: number) => string,
    onPlayerHpZero: () => void,
    addFloatingText: (x: number, y: number, text: string, color: string) => void,
    spawnParticles: (x: number, y: number, color: string, count: number) => void,
    isUnderwater?: boolean
  ): {
    triggered: boolean;
    type?: 'swamp' | 'reaper' | 'thunderbolt' | 'ice' | 'lava';
    skeletonDeathTimer?: number;
    frozenDeathTimer?: number;
    electrocutionDeathTimer?: number;
    reaperDeathTimer?: number;
  } {
    if (pHP <= 0) return { triggered: false };

    // 1. Poison Swamp ('X') Contact Check (Acid Skeleton Death Animation)
    const touchedSwamp =
      getTileSymbol(pxMid, pyFeet) === 'X' ||
      getTileSymbol(px + 4, pyFeet) === 'X' ||
      getTileSymbol(px + pWidth - 4, pyFeet) === 'X';

    if (touchedSwamp) {
      onPlayerHpZero();
      soundService.playLavaDeath(); // Sizzling acid meltdown SFX 🌋☠️
      addFloatingText(pxMid, py - 20, 'TOXIC ACID SWAMP MELTDOWN! ☠️🧪', '#22c55e');
      spawnParticles(pxMid, pyFeet, '#22c55e', 25);

      return {
        triggered: true,
        type: 'swamp',
        skeletonDeathTimer: 90
      };
    }

    // 2. Molten Lava / Freezing Point / Electric Field / Reaper Scythe ('*') Contact Check
    const touchedHazardPool =
      getTileSymbol(pxMid, pyFeet) === '*' ||
      getTileSymbol(px + 4, pyFeet) === '*' ||
      getTileSymbol(px + pWidth - 4, pyFeet) === '*';

    if (touchedHazardPool) {
      onPlayerHpZero();

      if (isUnderwater) {
        soundService.playLavaDeath(); // Sizzling / splash SFX
        addFloatingText(pxMid, py - 20, 'SUCKED INTO WHIRLPOOL! 🌀💀', '#06b6d4');
        spawnParticles(pxMid, pyFeet, '#06b6d4', 25);

        return {
          triggered: true,
          type: 'lava',
          skeletonDeathTimer: 90
        };
      } else if (themeType === 'shadow') {
        // REAPER SCYTHE DEATH ZONE 💀⚔️
        soundService.playScytheDeath(); // Grim Reaper Scythe SFX
        addFloatingText(pxMid, py - 20, 'REAPED BY DEATH! 💀⚔️', '#a855f7');
        spawnParticles(pxMid, pyFeet, '#a855f7', 30);

        return {
          triggered: true,
          type: 'reaper',
          reaperDeathTimer: 90
        };
      } else if (themeType === 'temple') {
        // INSTANT ELECTROCUTION DEATH (Divine Thunderbolt ⚡💥)
        soundService.playThunderboltDeath(); // Divine Thunderbolt SFX
        addFloatingText(pxMid, py - 20, 'DIVINE THUNDERBOLT ELECTROCUTION! ⚡💥', '#eab308');
        spawnParticles(pxMid, pyFeet, '#eab308', 30);

        return {
          triggered: true,
          type: 'thunderbolt',
          electrocutionDeathTimer: 90
        };
      } else if (themeType === 'ice') {
        // INSTANT SUB-ZERO FREEZE DEATH 🧊❄️
        soundService.playIceDeath(); // Sub-Zero Flash Freeze SFX
        addFloatingText(pxMid, py - 20, 'SUB-ZERO FLASH FREEZE! 🧊❄️', '#38bdf8');
        spawnParticles(pxMid, pyFeet, '#38bdf8', 25);

        return {
          triggered: true,
          type: 'ice',
          frozenDeathTimer: 999999
        };
      } else {
        // MOLTEN LAVA MELTDOWN DEATH 🌋🔥
        soundService.playLavaDeath(); // Molten Lava Sizzle SFX
        addFloatingText(pxMid, py - 20, 'MOLTEN LAVA MELTED! 🌋🔥', '#ef4444');
        spawnParticles(pxMid, pyFeet, '#ef4444', 25);

        return {
          triggered: true,
          type: 'lava',
          skeletonDeathTimer: 90
        };
      }
    }

    return { triggered: false };
  }
}
