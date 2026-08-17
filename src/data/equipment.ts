import { PlayerStats, DracoData } from '../types/game';

export type EquipmentRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type EquipmentSlot = 'weapon' | 'armor' | 'boots' | 'accessory' | 'relic';

export interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  description: string;
  icon: string;
  cost: number;
  minWorld: number; // For drops: minimum world ID it drops in
  dropWeight: number; // Relative weight in drop pool
  stats: Partial<PlayerStats>;
  passive?: string;
}

export const RARITY_CONFIG: Record<
  EquipmentRarity,
  { label: string; color: string; border: string; bg: string; text: string; glow: string; dropRateLabel: string }
> = {
  common: {
    label: 'Common',
    color: '#94a3b8',
    border: 'border-slate-700',
    bg: 'bg-slate-900/80',
    text: 'text-slate-300',
    glow: 'rgba(148, 163, 184, 0.25)',
    dropRateLabel: '60%'
  },
  rare: {
    label: 'Rare',
    color: '#38bdf8',
    border: 'border-sky-500/70',
    bg: 'bg-sky-950/80',
    text: 'text-sky-300',
    glow: 'rgba(56, 189, 248, 0.35)',
    dropRateLabel: '25%'
  },
  epic: {
    label: 'Epic',
    color: '#c084fc',
    border: 'border-purple-500/70',
    bg: 'bg-purple-950/80',
    text: 'text-purple-300',
    glow: 'rgba(192, 132, 252, 0.45)',
    dropRateLabel: '10%'
  },
  legendary: {
    label: 'Legendary',
    color: '#fbbf24',
    border: 'border-amber-500/80',
    bg: 'bg-amber-950/80',
    text: 'text-amber-300',
    glow: 'rgba(251, 191, 36, 0.55)',
    dropRateLabel: '4%'
  },
  mythic: {
    label: 'Mythic',
    color: '#f43f5e',
    border: 'border-rose-500/90',
    bg: 'bg-rose-950/80',
    text: 'text-rose-300',
    glow: 'rgba(244, 63, 94, 0.65)',
    dropRateLabel: '1%'
  }
};

export const SLOT_CONFIG: Record<EquipmentSlot, { label: string; icon: string; desc: string }> = {
  weapon: { label: 'Weapon', icon: '⚔️', desc: 'Increases attack power and range' },
  armor: { label: 'Armor', icon: '🛡️', desc: 'Increases defense and maximum health pool' },
  boots: { label: 'Boots', icon: '👢', desc: 'Increases movement speed and jump height' },
  accessory: { label: 'Accessory', icon: '💍', desc: 'Provides balanced hybrid offensive & defensive stats' },
  relic: { label: 'Relic', icon: '🔮', desc: 'Enhances energy regeneration, stats, and ability output' }
};

export const EQUIPMENT_SLOTS_ORDER: EquipmentSlot[] = ['weapon', 'armor', 'boots', 'accessory', 'relic'];

export function getSlotIndexByType(slot: EquipmentSlot): number {
  const idx = EQUIPMENT_SLOTS_ORDER.indexOf(slot);
  return idx !== -1 ? idx : 0;
}

export function getSlotTypeByIndex(index: number): EquipmentSlot {
  return EQUIPMENT_SLOTS_ORDER[index] || 'weapon';
}

import equipmentJson from './equipment.json';

export const ALL_EQUIPMENT: EquipmentItem[] = equipmentJson as EquipmentItem[];

export const EQUIPMENT_REGISTRY: Record<string, EquipmentItem> = ALL_EQUIPMENT.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, EquipmentItem>
);

/**
 * Normalizes an array of equipped item IDs so that each item sits in its correct typed slot.
 * Returns a 5-element array: [weaponId, armorId, bootsId, accessoryId, relicId]
 */
export function normalizeDracoEquipped(equipped: (string | null | undefined)[] = []): string[] {
  const result: string[] = ['', '', '', '', ''];
  if (!Array.isArray(equipped)) return result;

  equipped.forEach(id => {
    if (!id || typeof id !== 'string') return;
    const eq = EQUIPMENT_REGISTRY[id];
    if (eq && eq.slot) {
      const slotIdx = getSlotIndexByType(eq.slot);
      if (!result[slotIdx]) {
        result[slotIdx] = id;
      }
    }
  });

  return result;
}

export function getEquipmentById(id: string): EquipmentItem | undefined {
  return EQUIPMENT_REGISTRY[id];
}

/**
 * Calculates sum of bonus stats provided by an array of equipped item IDs.
 */
export function getDracoEquipmentBonus(equippedItemIds: string[] = []): PlayerStats {
  const bonus: PlayerStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    jump: 0,
    range: 0,
    energyRegen: 0
  };

  if (!equippedItemIds || !Array.isArray(equippedItemIds)) return bonus;

  equippedItemIds.forEach(id => {
    const item = EQUIPMENT_REGISTRY[id];
    if (item && item.stats) {
      if (item.stats.hp) bonus.hp += item.stats.hp;
      if (item.stats.attack) bonus.attack += item.stats.attack;
      if (item.stats.defense) bonus.defense += item.stats.defense;
      if (item.stats.speed) bonus.speed += item.stats.speed;
      if (item.stats.jump) bonus.jump += item.stats.jump;
      if (item.stats.range) bonus.range += item.stats.range;
      if (item.stats.energyRegen) bonus.energyRegen = (bonus.energyRegen || 0) + item.stats.energyRegen;
    }
  });

  // Round decimals to 1 decimal place
  bonus.speed = Math.round(bonus.speed * 10) / 10;
  bonus.jump = Math.round(bonus.jump * 10) / 10;
  bonus.energyRegen = Math.round((bonus.energyRegen || 0) * 10) / 10;

  return bonus;
}

/**
 * Combines base Draco stats with equipment bonuses.
 * Clamps speed and jump within gameplay balance limits.
 */
export function getEffectiveDracoStats(
  draco: Partial<DracoData> | undefined,
  equippedItemIds: string[] = []
): PlayerStats {
  const baseHp = draco?.hp || 18;
  const baseAtk = draco?.attack || 4;
  const baseDef = draco?.defense || 3;
  const baseSpd = draco?.speed || 7;
  const baseJmp = draco?.jump || 10;
  const baseRng = draco?.range || 1;
  const baseNrg = draco?.energyRegen || 1.0;
  const level = draco?.level || 1;

  const bonus = getDracoEquipmentBonus(equippedItemIds);

  const finalHp = Math.max(1, baseHp + bonus.hp);
  const finalAtk = Math.max(1, Math.round((baseAtk + bonus.attack) * 10) / 10);
  const finalDef = Math.max(0, Math.round((baseDef + bonus.defense) * 10) / 10);
  const finalSpd = Math.min(25, Math.round((baseSpd + bonus.speed) * 10) / 10);
  const finalJmp = Math.min(18, Math.round((baseJmp + bonus.jump) * 10) / 10);
  const finalRng = Math.max(1, baseRng + bonus.range);
  const finalNrg = Math.max(0.5, Math.round((baseNrg + (bonus.energyRegen || 0)) * 10) / 10);

  return {
    hp: finalHp,
    attack: finalAtk,
    defense: finalDef,
    speed: finalSpd,
    jump: finalJmp,
    range: finalRng,
    energyRegen: finalNrg,
    level
  };
}

/**
 * Rolls an equipment drop for a given world ID and enemy tier.
 */
export function rollEquipmentDrop(
  worldId: number = 1,
  enemyTier: 'normal' | 'elite' | 'miniboss' | 'boss' = 'normal'
): EquipmentItem | null {
  // Drop chance check: 10% from bosses, 5% from minibosses, 2% from elites, 1% from normal enemies
  const dropProb =
    enemyTier === 'boss'
      ? 0.10 // 10% from world boss
      : enemyTier === 'miniboss'
      ? 0.05 // 5% from miniboss
      : enemyTier === 'elite'
      ? 0.02 // 2% from elite
      : 0.01; // 1% from normal minion

  if (Math.random() > dropProb) {
    return null;
  }

  // Filter pool based on world requirement and tier
  const eligibleItems = ALL_EQUIPMENT.filter(item => {
    if (item.minWorld > Math.max(1, worldId)) return false;

    if (enemyTier === 'boss') {
      // Bosses prioritize epic, legendary, mythic
      return item.rarity === 'epic' || item.rarity === 'legendary' || item.rarity === 'mythic' || item.rarity === 'rare';
    }
    if (enemyTier === 'miniboss') {
      return item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary';
    }
    return true;
  });

  if (eligibleItems.length === 0) {
    return ALL_EQUIPMENT[0]; // fallback
  }

  // Weighted random pick
  const totalWeight = eligibleItems.reduce((sum, item) => sum + item.dropWeight, 0);
  let randomWeight = Math.random() * totalWeight;

  for (const item of eligibleItems) {
    if (randomWeight < item.dropWeight) {
      return item;
    }
    randomWeight -= item.dropWeight;
  }

  return eligibleItems[0];
}

/**
 * Calculates sell price in gold for an equipment item.
 */
export function getEquipmentSellPrice(itemOrId: string | EquipmentItem | any): number {
  let eq: EquipmentItem | undefined;
  if (typeof itemOrId === 'string') {
    eq = EQUIPMENT_REGISTRY[itemOrId];
  } else if (itemOrId && typeof itemOrId === 'object') {
    eq = EQUIPMENT_REGISTRY[itemOrId.id] || itemOrId;
  }

  if (!eq) return 15;
  const cost = eq.cost || 30;
  const multiplierByRarity: Record<EquipmentRarity, number> = {
    common: 0.5,
    rare: 0.55,
    epic: 0.6,
    legendary: 0.65,
    mythic: 0.7
  };
  return Math.max(10, Math.floor(cost * (multiplierByRarity[eq.rarity] || 0.5)));
}

/**
 * Calculates estimated dismantle/disassemble yield for an item.
 */
export function getEquipmentDismantleYield(itemId: string): {
  scrapCoins: number;
  stoneCount: number;
  stoneChance: number;
} {
  const eq = EQUIPMENT_REGISTRY[itemId];
  const cost = eq?.cost || 30;
  const scrapCoins = Math.max(5, Math.floor(cost * 0.25));
  const rarity = eq?.rarity || 'common';

  let stoneCount = 0;
  let stoneChance = 0.35;

  if (rarity === 'common') {
    stoneChance = 0.4;
    stoneCount = 1;
  } else if (rarity === 'rare') {
    stoneChance = 0.75;
    stoneCount = 1;
  } else if (rarity === 'epic') {
    stoneChance = 1.0;
    stoneCount = 1;
  } else if (rarity === 'legendary') {
    stoneChance = 1.0;
    stoneCount = 2;
  } else if (rarity === 'mythic') {
    stoneChance = 1.0;
    stoneCount = 3;
  }

  return { scrapCoins, stoneCount, stoneChance };
}

