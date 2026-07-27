import { soundService } from '../services/sound';
import {
  FT_TOXIC_SWAMP,
  FT_WHIRLPOOL,
  FT_SHADOW_CLOUD_POOL,
  FT_DIVINE_THUNDERBOLT,
  FT_FLASH_FREEZE,
  FT_MOLTEN_LAVA,
} from './FloatingTextMessages';

export interface HazardState {
  skeletonDeathTimer: number;
  frozenDeathTimer: number;
  electrocutionDeathTimer: number;
  reaperDeathTimer: number;
}

export class HazardManager {
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

    const touchedSwamp =
      getTileSymbol(pxMid, pyFeet) === 'X' ||
      getTileSymbol(px + 4, pyFeet) === 'X' ||
      getTileSymbol(px + pWidth - 4, pyFeet) === 'X';

    if (touchedSwamp) {
      onPlayerHpZero();
      soundService.playLavaDeath();
      addFloatingText(pxMid, py - 20, FT_TOXIC_SWAMP.text, FT_TOXIC_SWAMP.color);
      spawnParticles(pxMid, pyFeet, '#22c55e', 25);

      return {
        triggered: true,
        type: 'swamp',
        skeletonDeathTimer: 90
      };
    }

    const touchedHazardPool =
      getTileSymbol(pxMid, pyFeet) === '*' ||
      getTileSymbol(px + 4, pyFeet) === '*' ||
      getTileSymbol(px + pWidth - 4, pyFeet) === '*';

    if (touchedHazardPool) {
      if (themeType !== 'shadow') {
        onPlayerHpZero();
      }

      if (isUnderwater) {
        soundService.playLavaDeath();
        addFloatingText(pxMid, py - 20, FT_WHIRLPOOL.text, FT_WHIRLPOOL.color);
        spawnParticles(pxMid, pyFeet, '#06b6d4', 25);

        return {
          triggered: true,
          type: 'lava',
          skeletonDeathTimer: 90
        };
      } else if (themeType === 'shadow') {
        soundService.playHit();
        addFloatingText(pxMid, py - 20, FT_SHADOW_CLOUD_POOL.text, FT_SHADOW_CLOUD_POOL.color);
        spawnParticles(pxMid, pyFeet, '#a855f7', 15);

        return {
          triggered: true,
          type: 'reaper'
        };
      } else if (themeType === 'temple') {
        soundService.playThunderboltDeath();
        addFloatingText(pxMid, py - 20, FT_DIVINE_THUNDERBOLT.text, FT_DIVINE_THUNDERBOLT.color);
        spawnParticles(pxMid, pyFeet, '#eab308', 30);

        return {
          triggered: true,
          type: 'thunderbolt',
          electrocutionDeathTimer: 90
        };
      } else if (themeType === 'ice') {
        soundService.playIceDeath();
        addFloatingText(pxMid, py - 20, FT_FLASH_FREEZE.text, FT_FLASH_FREEZE.color);
        spawnParticles(pxMid, pyFeet, '#38bdf8', 25);

        return {
          triggered: true,
          type: 'ice',
          frozenDeathTimer: 999999
        };
      } else {
        soundService.playLavaDeath();
        addFloatingText(pxMid, py - 20, FT_MOLTEN_LAVA.text, FT_MOLTEN_LAVA.color);
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
