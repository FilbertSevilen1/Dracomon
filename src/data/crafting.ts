import { EquipmentSlot, EquipmentRarity, EQUIPMENT_REGISTRY, EquipmentItem } from './equipment';
import { InventoryItem } from '../types/game';

export interface CraftingIngredient {
  itemId: string;
  quantity: number;
  name?: string;
  icon?: string;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  category: 'weapon' | 'armor' | 'boots' | 'accessory' | 'relic' | 'consumable';
  resultItemId: string;
  resultQuantity: number;
  requiredCoins: number;
  ingredients: CraftingIngredient[];
  description: string;
  rarity: EquipmentRarity;
  icon: string;
}

import craftingJson from './crafting.json';

export const CRAFTING_RECIPES: CraftingRecipe[] = craftingJson as CraftingRecipe[];

export const RECIPE_REGISTRY: Record<string, CraftingRecipe> = CRAFTING_RECIPES.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<string, CraftingRecipe>
);

export const RESULT_ITEM_TO_RECIPE: Record<string, CraftingRecipe> = CRAFTING_RECIPES.reduce(
  (acc, r) => {
    acc[r.resultItemId] = r;
    return acc;
  },
  {} as Record<string, CraftingRecipe>
);

export function getRecipeById(id: string): CraftingRecipe | undefined {
  return RECIPE_REGISTRY[id];
}

export function getRecipeByResultId(resultItemId: string): CraftingRecipe | undefined {
  return RESULT_ITEM_TO_RECIPE[resultItemId];
}

/**
 * Resolves the unit purchase cost of an item (equipment or consumable).
 */
export function getItemBasePrice(itemId: string): number {
  if (itemId === 'potion') return 15;
  if (itemId === 'upgrade_stone') return 80;
  const eq = EQUIPMENT_REGISTRY[itemId];
  return eq?.cost ?? 0;
}

export interface RecipeAutoBuyCalculation {
  recipe: CraftingRecipe;
  recipeFee: number;
  missingItemsCost: number;
  totalCost: number;
  canAfford: boolean;
  missingCoins: number;
  allIngredientsOwned: boolean;
  missingIngredientsCount: number;
  ownedIngredientsCount: number;
  ingredientsDetails: {
    itemId: string;
    name: string;
    icon: string;
    needed: number;
    owned: number;
    equipped: number;
    availableOwned: number;
    missingToBuy: number;
    unitPrice: number;
    subtotalPrice: number;
    isFullyOwned: boolean;
  }[];
}

/**
 * Calculates auto-buying of any missing ingredients + recipe fee.
 * If player owns some base ingredients, only the missing ingredients are purchased.
 */
export function calculateRecipeAutoBuy(
  recipe: CraftingRecipe,
  inventory: InventoryItem[],
  playerCoins: number,
  equippedCounts: Record<string, number> = {}
): RecipeAutoBuyCalculation {
  let missingItemsCost = 0;
  let allIngredientsOwned = true;
  let missingIngredientsCount = 0;
  let ownedIngredientsCount = 0;

  const ingredientsDetails = recipe.ingredients.map(ing => {
    const invItem = inventory.find(i => i.id === ing.itemId);
    const totalOwned = invItem?.quantity || 0;
    const equipped = equippedCounts[ing.itemId] || 0;
    const availableOwned = Math.max(0, totalOwned - equipped);
    const missingToBuy = Math.max(0, ing.quantity - availableOwned);
    const usedOwned = Math.min(ing.quantity, availableOwned);

    if (usedOwned > 0) {
      ownedIngredientsCount += usedOwned;
    }

    if (missingToBuy > 0) {
      allIngredientsOwned = false;
      missingIngredientsCount += missingToBuy;
    }

    const unitPrice = getItemBasePrice(ing.itemId);
    const subtotalPrice = missingToBuy * unitPrice;
    missingItemsCost += subtotalPrice;

    const eqData = EQUIPMENT_REGISTRY[ing.itemId];
    const name =
      eqData?.name ||
      (ing.itemId === 'potion' ? 'Healing Potion' : ing.itemId === 'upgrade_stone' ? 'Upgrade Stone' : ing.itemId);
    const icon = eqData?.icon || (ing.itemId === 'potion' ? '🧪' : '🔮');

    return {
      itemId: ing.itemId,
      name,
      icon,
      needed: ing.quantity,
      owned: totalOwned,
      equipped,
      availableOwned,
      missingToBuy,
      unitPrice,
      subtotalPrice,
      isFullyOwned: missingToBuy === 0
    };
  });

  const recipeFee = recipe.requiredCoins;
  const totalCost = recipeFee + missingItemsCost;
  const canAfford = playerCoins >= totalCost;
  const missingCoins = Math.max(0, totalCost - playerCoins);

  return {
    recipe,
    recipeFee,
    missingItemsCost,
    totalCost,
    canAfford,
    missingCoins,
    allIngredientsOwned,
    missingIngredientsCount,
    ownedIngredientsCount,
    ingredientsDetails
  };
}

/**
 * Checks if the player has the required coins and unequipped item quantities to craft a recipe.
 */
export function canCraftRecipe(
  recipe: CraftingRecipe,
  inventory: InventoryItem[],
  playerCoins: number,
  equippedCounts: Record<string, number> = {}
): { canCraft: boolean; missingItems: { itemId: string; name: string; needed: number; available: number }[]; missingCoins: number } {
  const missingCoins = Math.max(0, recipe.requiredCoins - playerCoins);
  const missingItems: { itemId: string; name: string; needed: number; available: number }[] = [];

  recipe.ingredients.forEach(ing => {
    const invItem = inventory.find(i => i.id === ing.itemId);
    const totalOwned = invItem?.quantity || 0;
    const equipped = equippedCounts[ing.itemId] || 0;
    const available = Math.max(0, totalOwned - equipped);

    if (available < ing.quantity) {
      const eqData = EQUIPMENT_REGISTRY[ing.itemId];
      const itemName =
        eqData?.name ||
        (ing.itemId === 'potion' ? 'Healing Potion' : ing.itemId === 'upgrade_stone' ? 'Upgrade Stone' : ing.itemId);

      missingItems.push({
        itemId: ing.itemId,
        name: itemName,
        needed: ing.quantity,
        available
      });
    }
  });

  const canCraft = missingCoins === 0 && missingItems.length === 0;

  return {
    canCraft,
    missingItems,
    missingCoins
  };
}
