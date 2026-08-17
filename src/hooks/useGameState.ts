import { useState, useEffect, useCallback, useRef } from 'react';
import { SaveData, DracoData, PlayerStats, InventoryItem, TierType, GameDifficulty } from '../types/game';
import { storageService, DEFAULT_SAVE_DATA } from '../services/storage';
import { soundService } from '../services/sound';
import {
  EQUIPMENT_REGISTRY,
  getEquipmentById,
  ALL_EQUIPMENT,
  EQUIPMENT_SLOTS_ORDER,
  getSlotIndexByType,
  normalizeDracoEquipped,
  getEquipmentSellPrice,
  getEquipmentDismantleYield
} from '../data/equipment';
import {
  CRAFTING_RECIPES,
  RECIPE_REGISTRY,
  canCraftRecipe,
  calculateRecipeAutoBuy,
  getRecipeByResultId
} from '../data/crafting';
import confetti from 'canvas-confetti';

export function useGameState() {
  const [saveData, setSaveData] = useState<SaveData>(DEFAULT_SAVE_DATA);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [playerHP, setPlayerHP] = useState(18);
  const [playerMaxHP, setPlayerMaxHP] = useState(18);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{
    dracoName: string;
    oldLevel: number;
    newLevel: number;
    baseIncrease: Partial<PlayerStats>;
    bonusRoll: number;
  } | null>(null);

  const settingsRef = useRef(saveData.settings);
  settingsRef.current = saveData.settings;

  useEffect(() => {
    const handleUpdate = () => {
      const freshData = storageService.loadGame();
      setSaveData(freshData);

      const selected = freshData.selectedDraco;
      const activeDraco = freshData.dracos[selected];
      if (activeDraco && activeDraco.hp) {
        setPlayerHP(activeDraco.hp);
        setPlayerMaxHP(activeDraco.hp);
      }
    };

    handleUpdate();

    window.addEventListener('Dracoman_save_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('Dracoman_save_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const settings = saveData.settings;
    soundService.updateVolumes(settings.volume, settings.sfxVolume ?? 80, settings.music);
  }, [saveData.settings]);

  const updateSaveState = useCallback((updater: (prev: SaveData) => SaveData) => {
    setSaveData(prev => {
      const next = updater(prev);
      storageService.saveGame(next);
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('Dracoman_save_updated', { detail: next }));
        }, 0);
      }
      return next;
    });
  }, []);

  const updateSettings = useCallback((music: boolean, volume: number, sfxVolume: number) => {
    updateSaveState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        music,
        volume,
        sfxVolume,
      }
    }));
  }, [updateSaveState]);

  const selectDraco = useCallback((name: string) => {
    updateSaveState(prev => {
      const draco = prev.dracos[name];
      if (draco && draco.unlocked) {
        soundService.playClick();
        return {
          ...prev,
          selectedDraco: name
        };
      }
      return prev;
    });
  }, [updateSaveState]);

  const unlockDraco = useCallback((name: string, cost: number) => {
    updateSaveState(prev => {
      const draco = prev.dracos[name] || DEFAULT_SAVE_DATA.dracos[name];
      if (draco && !draco.unlocked && prev.player.coins >= cost) {
        soundService.playCoin();
        const updatedDracos = { ...prev.dracos };
        updatedDracos[name] = {
          ...draco,
          unlocked: true
        };
        const unlockedList = Array.from(new Set([...(prev.unlockedDraco || []), name]));
        return {
          ...prev,
          player: {
            ...prev.player,
            coins: prev.player.coins - cost
          },
          unlockedDraco: unlockedList,
          dracos: updatedDracos
        };
      }
      return prev;
    });
  }, [updateSaveState]);

  const collectCoins = useCallback((amount: number) => {
    updateSaveState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        coins: prev.player.coins + amount
      }
    }));
  }, [updateSaveState]);

  const collectItem = useCallback((itemId: string) => {
    updateSaveState(prev => {
      const existingItem = prev.inventory.find(i => i.id === itemId);
      let newInventory = [...prev.inventory];

      if (existingItem) {
        newInventory = newInventory.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        const eqData = EQUIPMENT_REGISTRY[itemId];
        if (eqData) {
          newInventory.push({
            id: eqData.id,
            name: eqData.name,
            type: 'equipment',
            slot: eqData.slot,
            rarity: eqData.rarity,
            description: eqData.description,
            icon: eqData.icon,
            stats: eqData.stats,
            cost: eqData.cost,
            quantity: 1
          });
        } else {
          const itemDetails: InventoryItem =
            itemId === 'potion'
              ? { id: 'potion', name: 'Healing Potion', type: 'potion', description: 'Restores 15 HP immediately.', quantity: 1 }
              : { id: 'upgrade_stone', name: 'Upgrade Stone', type: 'upgrade_stone', description: 'Permanently increases any stat by +0.1.', quantity: 1 };
          newInventory.push(itemDetails);
        }
      }

      return {
        ...prev,
        inventory: newInventory
      };
    });
  }, [updateSaveState]);

  const usePotion = useCallback((dracoName?: string, activeEngineRef?: any) => {
    let used = false;
    const potion = saveData.inventory.find(i => i.id === 'potion');
    if (potion && potion.quantity > 0) {
      if (activeEngineRef && activeEngineRef.current) {
        activeEngineRef.current.healPlayer(15);
        used = true;
      } else {
        used = true;
      }

      if (used) {
        soundService.playLevelUp();
        updateSaveState(prev => ({
          ...prev,
          inventory: prev.inventory.map(i =>
            i.id === 'potion' ? { ...i, quantity: i.quantity - 1 } : i
          ).filter(i => i.quantity > 0)
        }));
      }
    }
    return used;
  }, [saveData.inventory, updateSaveState]);

  const useUpgradeStone = useCallback((dracoName: string, stat: keyof PlayerStats) => {
    let success = false;
    updateSaveState(prev => {
      const stone = prev.inventory.find(i => i.id === 'upgrade_stone');
      if (stone && stone.quantity > 0) {
        const draco = prev.dracos[dracoName];
        if (draco && draco.unlocked) {
          const updatedDracos = JSON.parse(JSON.stringify(prev.dracos));
          const oldVal = (updatedDracos[dracoName] as any)[stat] || 0;
          if (stat === 'speed' && oldVal >= 20) return prev;
          if (stat === 'jump' && oldVal >= 14) return prev;

          let newVal = Math.round((oldVal + 0.1) * 10) / 10;
          if (stat === 'speed') newVal = Math.min(20, newVal);
          if (stat === 'jump') newVal = Math.min(14, newVal);

          soundService.playLevelUp();
          (updatedDracos[dracoName] as any)[stat] = newVal;

          success = true;
          return {
            ...prev,
            inventory: prev.inventory.map(i =>
              i.id === 'upgrade_stone' ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0),
            dracos: updatedDracos
          };
        }
      }
      return prev;
    });
    return success;
  }, [updateSaveState]);

  const buyItem = useCallback((itemId: string, cost?: number) => {
    let success = false;
    updateSaveState(prev => {
      const eqData = EQUIPMENT_REGISTRY[itemId];
      const actualCost =
        cost !== undefined
          ? cost
          : eqData
          ? eqData.cost
          : itemId === 'potion'
          ? 15
          : itemId === 'upgrade_stone'
          ? 80
          : 0;

      if (prev.player.coins >= actualCost) {
        try {
          soundService.playCoin();
        } catch {}
        success = true;

        const existingItem = prev.inventory.find(i => i.id === itemId);
        let newInventory = [...prev.inventory];

        if (existingItem) {
          newInventory = newInventory.map(i =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else if (eqData) {
          newInventory.push({
            id: eqData.id,
            name: eqData.name,
            type: 'equipment',
            slot: eqData.slot,
            rarity: eqData.rarity,
            description: eqData.description,
            icon: eqData.icon,
            stats: eqData.stats,
            cost: eqData.cost,
            quantity: 1
          });
        } else {
          const itemDetails: InventoryItem =
            itemId === 'potion'
              ? { id: 'potion', name: 'Healing Potion', type: 'potion', description: 'Restores 15 HP immediately.', quantity: 1 }
              : { id: 'upgrade_stone', name: 'Upgrade Stone', type: 'upgrade_stone', description: 'Permanently increases any stat by +0.1.', quantity: 1 };
          newInventory.push(itemDetails);
        }

        return {
          ...prev,
          player: {
            ...prev.player,
            coins: prev.player.coins - actualCost
          },
          inventory: newInventory
        };
      }
      return prev;
    });
    return success;
  }, [updateSaveState]);

  const equipItem = useCallback((dracoName: string, itemId: string, targetSlotIndex?: number) => {
    let success = false;
    updateSaveState(prev => {
      const draco = prev.dracos[dracoName];
      if (!draco || !draco.unlocked) return prev;

      const itemInBag = prev.inventory.find(i => i.id === itemId);
      if (!itemInBag || itemInBag.quantity <= 0) return prev;

      const eqData = EQUIPMENT_REGISTRY[itemId];
      if (!eqData) return prev;

      // Each slot must be equipped strictly by an item of that type:
      // slot 0 = weapon, slot 1 = armor, slot 2 = boots, slot 3 = accessory, slot 4 = relic
      const correctSlotIndex = getSlotIndexByType(eqData.slot);

      // If a targetSlotIndex was passed and does not match the item's slot type, reject
      if (targetSlotIndex !== undefined && targetSlotIndex !== correctSlotIndex) {
        return prev;
      }

      const resolvedSlotIndex = correctSlotIndex;
      const currentDracoEquipped = normalizeDracoEquipped(draco.equipped || []);

      // If this Draco already has this exact item in the slot, no-op
      if (currentDracoEquipped[resolvedSlotIndex] === itemId) {
        return prev;
      }

      // Count copies of itemId equipped on OTHER dracos
      let usedByOtherDracos = 0;
      Object.keys(prev.dracos).forEach(k => {
        if (k !== dracoName) {
          const d = prev.dracos[k];
          if (d && Array.isArray(d.equipped)) {
            d.equipped.forEach(eqId => {
              if (eqId === itemId) usedByOtherDracos++;
            });
          }
        }
      });

      const totalUsedElsewhere = usedByOtherDracos;
      const availableToEquip = itemInBag.quantity - totalUsedElsewhere;

      if (availableToEquip <= 0) {
        return prev;
      }

      const newEquipped = [...currentDracoEquipped];
      newEquipped[resolvedSlotIndex] = itemId;

      const updatedDracos = { ...prev.dracos };
      updatedDracos[dracoName] = {
        ...draco,
        equipped: newEquipped
      };

      try {
        soundService.playClick();
      } catch {}
      success = true;

      return {
        ...prev,
        dracos: updatedDracos
      };
    });
    return success;
  }, [updateSaveState]);

  const unequipItem = useCallback((dracoName: string, slotIndex: number) => {
    let success = false;
    updateSaveState(prev => {
      const draco = prev.dracos[dracoName];
      if (!draco || !Array.isArray(draco.equipped)) return prev;

      const currentEquipped = normalizeDracoEquipped(draco.equipped);
      if (slotIndex < 0 || slotIndex >= 5) return prev;
      if (!currentEquipped[slotIndex]) return prev;

      const newEquipped = [...currentEquipped];
      newEquipped[slotIndex] = '';

      const updatedDracos = { ...prev.dracos };
      updatedDracos[dracoName] = {
        ...draco,
        equipped: newEquipped
      };

      soundService.playClick();
      success = true;

      return {
        ...prev,
        dracos: updatedDracos
      };
    });
    return success;
  }, [updateSaveState]);

  const unequipAllItems = useCallback((dracoName: string) => {
    let success = false;
    updateSaveState(prev => {
      const draco = prev.dracos[dracoName];
      if (!draco || !Array.isArray(draco.equipped)) return prev;

      const updatedDracos = { ...prev.dracos };
      updatedDracos[dracoName] = {
        ...draco,
        equipped: ['', '', '', '', '']
      };

      soundService.playClick();
      success = true;

      return {
        ...prev,
        dracos: updatedDracos
      };
    });
    return success;
  }, [updateSaveState]);

  const autoEquipOptimal = useCallback((dracoName: string) => {
    let success = false;
    updateSaveState(prev => {
      const draco = prev.dracos[dracoName];
      if (!draco || !draco.unlocked) return prev;

      // Count equipped items across other dracos
      const equippedCounts: Record<string, number> = {};
      Object.keys(prev.dracos).forEach(k => {
        if (k === dracoName) return; // ignore current draco
        const d = prev.dracos[k];
        if (d && Array.isArray(d.equipped)) {
          d.equipped.forEach(eqId => {
            if (eqId) {
              equippedCounts[eqId] = (equippedCounts[eqId] || 0) + 1;
            }
          });
        }
      });

      const newEquipped: string[] = ['', '', '', '', ''];
      let anyEquipped = false;

      // For each slot type in order [weapon, armor, boots, accessory, relic]
      EQUIPMENT_SLOTS_ORDER.forEach((slotType, slotIdx) => {
        const candidates: { id: string; power: number }[] = [];

        prev.inventory.forEach(invItem => {
          if (invItem.type === 'equipment' || EQUIPMENT_REGISTRY[invItem.id]) {
            const eq = EQUIPMENT_REGISTRY[invItem.id] || invItem;
            if (eq.slot === slotType) {
              const usedElsewhere = equippedCounts[invItem.id] || 0;
              const remaining = invItem.quantity - usedElsewhere;
              if (remaining > 0) {
                const stats = eq.stats || {};
                const power =
                  (stats.attack || 0) * 3 +
                  (stats.defense || 0) * 3 +
                  (stats.hp || 0) * 0.5 +
                  (stats.speed || 0) * 4 +
                  (stats.jump || 0) * 4 +
                  (stats.range || 0) * 3 +
                  (stats.energyRegen || 0) * 15;

                candidates.push({ id: invItem.id, power });
              }
            }
          }
        });

        if (candidates.length > 0) {
          candidates.sort((a, b) => b.power - a.power);
          const best = candidates[0];
          newEquipped[slotIdx] = best.id;
          equippedCounts[best.id] = (equippedCounts[best.id] || 0) + 1;
          anyEquipped = true;
        }
      });

      if (!anyEquipped) return prev;

      const updatedDracos = { ...prev.dracos };
      updatedDracos[dracoName] = {
        ...draco,
        equipped: newEquipped
      };

      soundService.playLevelUp();
      success = true;

      return {
        ...prev,
        dracos: updatedDracos
      };
    });
    return success;
  }, [updateSaveState]);

  const craftItem = useCallback((recipeId: string, autoBuyMissing: boolean = true) => {
    let success = false;
    updateSaveState(prev => {
      const recipe = RECIPE_REGISTRY[recipeId];
      if (!recipe) return prev;

      // Count equipped items across all dracos
      const equippedCounts: Record<string, number> = {};
      Object.keys(prev.dracos).forEach(k => {
        const d = prev.dracos[k];
        if (d && Array.isArray(d.equipped)) {
          d.equipped.forEach(eqId => {
            equippedCounts[eqId] = (equippedCounts[eqId] || 0) + 1;
          });
        }
      });

      const calc = calculateRecipeAutoBuy(recipe, prev.inventory, prev.player.coins, equippedCounts);

      // If autoBuyMissing is false, require owning all ingredients
      if (!autoBuyMissing && !calc.allIngredientsOwned) {
        return prev;
      }

      if (!calc.canAfford) {
        return prev;
      }

      // Deduct only owned available ingredients from inventory
      let newInventory = [...prev.inventory];
      recipe.ingredients.forEach(ing => {
        const invItem = newInventory.find(i => i.id === ing.itemId);
        if (invItem) {
          const equipped = equippedCounts[ing.itemId] || 0;
          const available = Math.max(0, invItem.quantity - equipped);
          const toDeduct = Math.min(ing.quantity, available);
          if (toDeduct > 0) {
            const newQty = invItem.quantity - toDeduct;
            const idx = newInventory.findIndex(i => i.id === ing.itemId);
            if (newQty <= 0) {
              newInventory.splice(idx, 1);
            } else {
              newInventory[idx] = { ...invItem, quantity: newQty };
            }
          }
        }
      });

      // Add crafted item
      const resultId = recipe.resultItemId;
      const resultQty = recipe.resultQuantity || 1;
      const existingResult = newInventory.find(i => i.id === resultId);

      if (existingResult) {
        newInventory = newInventory.map(i =>
          i.id === resultId ? { ...i, quantity: i.quantity + resultQty } : i
        );
      } else {
        const eqData = EQUIPMENT_REGISTRY[resultId];
        if (eqData) {
          newInventory.push({
            id: eqData.id,
            name: eqData.name,
            type: 'equipment',
            slot: eqData.slot,
            rarity: eqData.rarity,
            description: eqData.description,
            icon: eqData.icon,
            stats: eqData.stats,
            cost: eqData.cost,
            quantity: resultQty
          });
        } else {
          const itemDetails: InventoryItem =
            resultId === 'potion'
              ? { id: 'potion', name: 'Healing Potion', type: 'potion', description: 'Restores 15 HP immediately.', quantity: resultQty }
              : { id: 'upgrade_stone', name: 'Upgrade Stone', type: 'upgrade_stone', description: 'Permanently increases any stat by +0.1.', quantity: resultQty };
          newInventory.push(itemDetails);
        }
      }

      try {
        soundService.playLevelUp();
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch {}
      success = true;

      return {
        ...prev,
        player: {
          ...prev.player,
          coins: prev.player.coins - calc.totalCost
        },
        inventory: newInventory
      };
    });
    return success;
  }, [updateSaveState]);

  const sellEquipment = useCallback((itemId: string, quantity = 1) => {
    let success = false;
    updateSaveState(prev => {
      const invItem = prev.inventory.find(i => i.id === itemId);
      if (!invItem || invItem.quantity <= 0) return prev;

      // Count equipped copies across all heroes
      let equippedCount = 0;
      Object.keys(prev.dracos).forEach(k => {
        const d = prev.dracos[k];
        if (d && Array.isArray(d.equipped)) {
          d.equipped.forEach(eqId => {
            if (eqId === itemId) equippedCount++;
          });
        }
      });

      const availableToSell = invItem.quantity - equippedCount;
      const countToSell = Math.min(availableToSell, Math.max(1, quantity));
      if (countToSell <= 0) return prev;

      const unitPrice = getEquipmentSellPrice(itemId);
      const totalEarned = unitPrice * countToSell;

      let newInventory = [...prev.inventory];
      const newQty = invItem.quantity - countToSell;
      if (newQty <= 0) {
        newInventory = newInventory.filter(i => i.id !== itemId);
      } else {
        newInventory = newInventory.map(i => (i.id === itemId ? { ...i, quantity: newQty } : i));
      }

      soundService.playCoin();
      success = true;

      return {
        ...prev,
        player: {
          ...prev.player,
          coins: prev.player.coins + totalEarned
        },
        inventory: newInventory
      };
    });
    return success;
  }, [updateSaveState]);

  const dismantleEquipment = useCallback((itemId: string, quantity = 1) => {
    let success = false;
    updateSaveState(prev => {
      const invItem = prev.inventory.find(i => i.id === itemId);
      if (!invItem || invItem.quantity <= 0) return prev;

      let equippedCount = 0;
      Object.keys(prev.dracos).forEach(k => {
        const d = prev.dracos[k];
        if (d && Array.isArray(d.equipped)) {
          d.equipped.forEach(eqId => {
            if (eqId === itemId) equippedCount++;
          });
        }
      });

      const availableToDismantle = invItem.quantity - equippedCount;
      const countToDismantle = Math.min(availableToDismantle, Math.max(1, quantity));
      if (countToDismantle <= 0) return prev;

      const recipe = getRecipeByResultId(itemId);
      const yieldInfo = getEquipmentDismantleYield(itemId);
      const totalScrapCoins = yieldInfo.scrapCoins * countToDismantle;
      let totalStonesGained = 0;

      for (let i = 0; i < countToDismantle; i++) {
        if (Math.random() < yieldInfo.stoneChance) {
          totalStonesGained += yieldInfo.stoneCount;
        }
      }

      let newInventory = [...prev.inventory];
      const newQty = invItem.quantity - countToDismantle;
      if (newQty <= 0) {
        newInventory = newInventory.filter(i => i.id !== itemId);
      } else {
        newInventory = newInventory.map(i => (i.id === itemId ? { ...i, quantity: newQty } : i));
      }

      // Refund ingredients if recipe exists
      if (recipe && recipe.ingredients && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach(ing => {
          const refundQty = Math.max(1, Math.floor(ing.quantity * 0.6)) * countToDismantle;
          const existing = newInventory.find(i => i.id === ing.itemId);
          if (existing) {
            newInventory = newInventory.map(i => i.id === ing.itemId ? { ...i, quantity: i.quantity + refundQty } : i);
          } else {
            const ingEq = EQUIPMENT_REGISTRY[ing.itemId];
            if (ingEq) {
              newInventory.push({
                id: ingEq.id,
                name: ingEq.name,
                type: 'equipment',
                slot: ingEq.slot,
                rarity: ingEq.rarity,
                description: ingEq.description,
                icon: ingEq.icon,
                stats: ingEq.stats,
                cost: ingEq.cost,
                quantity: refundQty
              });
            }
          }
        });
      }

      if (totalStonesGained > 0) {
        const stoneItem = newInventory.find(i => i.id === 'upgrade_stone');
        if (stoneItem) {
          newInventory = newInventory.map(i => (i.id === 'upgrade_stone' ? { ...i, quantity: i.quantity + totalStonesGained } : i));
        } else {
          newInventory.push({
            id: 'upgrade_stone',
            name: 'Upgrade Stone',
            type: 'upgrade_stone',
            description: 'Permanently increases any stat by +0.1.',
            quantity: totalStonesGained
          });
        }
      }

      try {
        soundService.playLevelUp();
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch {}

      success = true;
      return {
        ...prev,
        player: {
          ...prev.player,
          coins: prev.player.coins + totalScrapCoins
        },
        inventory: newInventory
      };
    });
    return success;
  }, [updateSaveState]);

  const setDifficulty = useCallback((difficulty: GameDifficulty) => {
    soundService.playClick();
    updateSaveState(prev => ({
      ...prev,
      difficulty
    }));
  }, [updateSaveState]);

  const [pendingLevelUps, setPendingLevelUps] = useState<{
    dracoName: string;
    oldLevel: number;
    newLevel: number;
    baseIncrease: Partial<PlayerStats>;
    bonusRoll: number;
  }[]>([]);

  const pendingLevelUpRef = useRef<{
    dracoName: string;
    oldLevel: number;
    newLevel: number;
    baseIncrease: Partial<PlayerStats>;
    bonusRoll: number;
  }[]>([]);

  const handleEnemyDefeated = useCallback((expGain: number, coinsGain: number) => {
    let levelUpItemsToTrigger: any[] = [];

    updateSaveState(prev => {
      const activeName = prev.selectedDraco;
      const draco = prev.dracos[activeName];
      if (!draco) return prev;

      const newCoins = prev.player.coins + coinsGain;
      const totalPlayerExp = prev.player.totalExp + expGain;

      let currentExp = (draco.exp || 0) + expGain;
      let currentLevel = draco.level || 1;
      let requiredExp = currentLevel * 30;

      const isMelee = ['Jumpmon', 'Shieldmon', 'Assassinmon', 'Krakenmon', 'Butchermon', 'Reapermon'].includes(activeName);

      const baseIncrease: Partial<PlayerStats> = {
        hp: isMelee ? 8 : 4,
        attack: 1,
        defense: isMelee ? 2 : 1,
        speed: 1,
      };

      const newPendingItems: {
        dracoName: string;
        oldLevel: number;
        newLevel: number;
        baseIncrease: Partial<PlayerStats>;
        bonusRoll: number;
      }[] = [];

      const updatedDracos = { ...prev.dracos };

      while (currentLevel < 25 && currentExp >= requiredExp) {
        currentExp -= requiredExp;
        const oldLvl = currentLevel;
        currentLevel = Math.min(25, currentLevel + 1);
        requiredExp = currentLevel * 30;

        const roll = Math.round(((Math.floor(Math.random() * 10) + 1) * 0.1) * 10) / 10;
        newPendingItems.push({
          dracoName: activeName,
          oldLevel: oldLvl,
          newLevel: currentLevel,
          baseIncrease,
          bonusRoll: roll
        });

        const dStats = updatedDracos[activeName];
        if (dStats) {
          dStats.hp = (dStats.hp || 10) + (baseIncrease.hp || 0);
          dStats.attack = (dStats.attack || 1) + (baseIncrease.attack || 0);
          dStats.defense = (dStats.defense || 1) + (baseIncrease.defense || 0);
          dStats.speed = Math.min(20, (dStats.speed || 1) + (baseIncrease.speed || 0));
          dStats.jump = Math.min(14, (dStats.jump || 10) + (baseIncrease.jump || 0));
        }
      }

      if (newPendingItems.length > 0) {
        soundService.playLevelUp();
        levelUpItemsToTrigger = newPendingItems;
      }

      updatedDracos[activeName] = {
        ...updatedDracos[activeName],
        level: currentLevel,
        exp: currentLevel >= 25 ? 0 : currentExp,
      };

      return {
        ...prev,
        player: {
          ...prev.player,
          coins: newCoins,
          totalExp: totalPlayerExp,
          level: Math.max(prev.player.level, currentLevel)
        },
        dracos: updatedDracos
      };
    });

    if (levelUpItemsToTrigger.length > 0) {
      setPendingLevelUps(prevList => [...prevList, ...levelUpItemsToTrigger]);
      setLevelUpInfo(levelUpItemsToTrigger[0]);
      setShowLevelUp(true);
    }
  }, [updateSaveState]);

  const applyLevelUpBonus = useCallback((stat: keyof PlayerStats) => {
    if (!levelUpInfo) return;

    updateSaveState(prev => {
      const activeName = levelUpInfo.dracoName;
      const updatedDracos = { ...prev.dracos };
      const draco = updatedDracos[activeName];

      if (draco) {
        if (stat === 'energyRegen') {
          const currentRegen = draco.energyRegen || 1.0;
          draco.energyRegen = Math.round(Math.min(10.0, currentRegen + 0.1 * levelUpInfo.bonusRoll) * 10) / 10;
        } else {
          const oldStatVal = (draco as any)[stat] || 0;
          if (stat === 'speed' && oldStatVal >= 20) return prev;
          if (stat === 'jump' && oldStatVal >= 14) return prev;
          let newVal = Math.round((oldStatVal + levelUpInfo.bonusRoll) * 10) / 10;
          if (stat === 'speed') newVal = Math.min(20, newVal);
          if (stat === 'jump') newVal = Math.min(14, newVal);
          (draco as any)[stat] = newVal;
        }
      }

      return {
        ...prev,
        dracos: updatedDracos
      };
    });

    setPendingLevelUps(prevList => {
      const remaining = prevList.slice(1);
      if (remaining.length > 0) {
        setLevelUpInfo(remaining[0]);
        setShowLevelUp(true);
      } else {
        setLevelUpInfo(null);
        setShowLevelUp(false);
      }
      return remaining;
    });
  }, [levelUpInfo, updateSaveState]);

  const levelUpDracoWithCoins = useCallback((name: string) => {
    let success = false;
    updateSaveState(prev => {
      const draco = prev.dracos[name];
      if (!draco) return prev;
      const currentLvl = draco.level || 1;
      if (currentLvl >= 25) return prev;
      const cost = currentLvl * 100;
      if (prev.player.coins >= cost) {
        soundService.playLevelUp();
        const updatedDracos = { ...prev.dracos };
        const d = updatedDracos[name];
        if (d) {
          const isMelee = ['Jumpmon', 'Shieldmon', 'Assassinmon', 'Krakenmon', 'Butchermon', 'Reapermon'].includes(name);
          const hpGain = isMelee ? 8 : 4;
          const defGain = isMelee ? 2 : 1;

          d.level = currentLvl + 1;
          d.hp = (d.hp || 10) + hpGain;
          d.attack = (d.attack || 1) + 1;
          d.defense = (d.defense || 1) + defGain;
          d.speed = Math.min(20, (d.speed || 1) + 1);
          d.jump = Math.min(14, (d.jump || 10) + 1);

          if (name === prev.selectedDraco) {
            setPlayerHP(d.hp);
            setPlayerMaxHP(d.hp);
          }

          const bonusRoll = Math.round(((Math.floor(Math.random() * 10) + 1) * 0.1) * 10) / 10;
          const item = {
            dracoName: name,
            oldLevel: currentLvl,
            newLevel: currentLvl + 1,
            baseIncrease: { hp: hpGain, attack: 1, defense: defGain, speed: 1 },
            bonusRoll
          };
          setPendingLevelUps(prevList => {
            const list = [...prevList, item];
            setLevelUpInfo(list[0]);
            setShowLevelUp(true);
            return list;
          });
        }
        success = true;
        return {
          ...prev,
          player: {
            ...prev.player,
            coins: prev.player.coins - cost
          },
          dracos: updatedDracos
        };
      }
      return prev;
    });
    return success;
  }, [updateSaveState]);

  const resetGameSave = useCallback(() => {
    const freshData = storageService.resetGame();
    setSaveData(freshData);
    setPlayerHP(freshData.dracos[freshData.selectedDraco].hp ?? 18);
    setPlayerMaxHP(freshData.dracos[freshData.selectedDraco].hp ?? 18);
    soundService.playClick();
  }, []);

  const exportSave = useCallback(() => {
    return storageService.exportSave(saveData);
  }, [saveData]);

  const importSave = useCallback((encodedData: string) => {
    const imported = storageService.importSave(encodedData);
    if (imported) {
      setSaveData(imported);
      const activeDraco = imported.dracos[imported.selectedDraco];
      if (activeDraco && activeDraco.hp) {
        setPlayerHP(activeDraco.hp);
        setPlayerMaxHP(activeDraco.hp);
      }
      return true;
    }
    return false;
  }, []);

  const [activationTier, setActivationTier] = useState<TierType | null>(null);
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [activationError, setActivationError] = useState(false);

  const handleVerifyCode = useCallback(() => {
    if (!activationTier) return;

    const expectedCode = activationTier === 'Basic' ? 'dracoman_basic_tier' : 'dracoman_pro_max_tier';
    if (activationCodeInput !== expectedCode) {
      soundService.playHit();
      setActivationError(true);
      return;
    }

    soundService.playLevelUp();
    try {
      confetti({ particleCount: activationTier === 'Premium' ? 120 : 80, spread: activationTier === 'Premium' ? 80 : 60, origin: { y: 0.7 } });
    } catch (e) {}

    const newTier = activationTier;
    updateSaveState(prev => {
      const updatedDracos = { ...prev.dracos };
      const allNames = Object.keys(updatedDracos);

      allNames.forEach(name => {
        const d = updatedDracos[name];
        if (!d) return;

        if (newTier === 'Basic') {
          d.unlocked = true;
          const targetLevel = Math.max(5, d.level || 1);
          const levelDiff = targetLevel - (d.level || 1);
          d.level = targetLevel;

          const boost = Math.max(4, levelDiff * 1);
          d.hp = (d.hp || 18) + boost;
          d.attack = (d.attack || 4) + boost;
          d.defense = (d.defense || 2) + boost;
          d.speed = Math.min(20, (d.speed || 5) + boost);
          d.jump = Math.min(14, (d.jump || 10) + boost);
          d.range = (d.range || 1) + boost;
        } else if (newTier === 'Premium') {
          d.unlocked = true;
          const targetLevel = Math.max(10, d.level || 1);
          const levelDiff = targetLevel - (d.level || 1);
          d.level = targetLevel;

          const boost = Math.max(9, levelDiff * 1);
          d.hp = (d.hp || 18) + boost;
          d.attack = (d.attack || 4) + boost;
          d.defense = (d.defense || 2) + boost;
          d.speed = Math.min(20, (d.speed || 5) + boost);
          d.jump = Math.min(14, (d.jump || 10) + boost);
          d.range = (d.range || 1) + boost;
        }
      });

      const unlockedList = newTier !== 'Free' ? allNames : prev.unlockedDraco;

      const startingCoins =
        newTier === 'Basic'
          ? Math.max(prev.player.coins || 0, 5000)
          : newTier === 'Premium'
          ? Math.max(prev.player.coins || 0, 25000)
          : prev.player.coins;

      return {
        ...prev,
        tier: newTier,
        player: {
          ...prev.player,
          coins: startingCoins,
        },
        unlockedDraco: unlockedList,
        dracos: updatedDracos,
      };
    });

    setActivationTier(null);
    setActivationCodeInput('');
    setActivationError(false);
  }, [activationTier, activationCodeInput, updateSaveState]);

  const switchTier = useCallback((newTier: TierType) => {
    const TIER_RANKS: Record<TierType, number> = { Free: 0, Basic: 1, Premium: 2 };
    const currentRank = TIER_RANKS[saveData.tier || 'Free'] ?? 0;
    const newRank = TIER_RANKS[newTier] ?? 0;

    if (newRank < currentRank) {
      return;
    }

    soundService.playClick();

    if (newTier === 'Free') {
      updateSaveState(prev => ({
        ...prev,
        tier: 'Free'
      }));
      return;
    }

    setActivationTier(newTier);
    setActivationCodeInput('');
    setActivationError(false);
  }, [saveData.tier, updateSaveState]);

  const markStageCleared = useCallback((stageNum: number) => {
    updateSaveState(prev => {
      const currentCompleted = prev.completedStages || [];
      const nextStages = new Set([...currentCompleted, stageNum]);
      return {
        ...prev,
        completedStages: Array.from(nextStages)
      };
    });
  }, [updateSaveState]);

  const setLastWorldId = useCallback((worldId: number) => {
    updateSaveState(prev => ({
      ...prev,
      lastWorldId: worldId
    }));
  }, [updateSaveState]);

  return {
    saveData,
    isPlaying,
    setIsPlaying,
    currentStage,
    setCurrentStage,
    playerHP,
    setPlayerHP,
    playerMaxHP,
    setPlayerMaxHP,
    showLevelUp,
    levelUpInfo,
    pendingLevelUps,
    updateSettings,
    selectDraco,
    unlockDraco,
    collectCoins,
    collectItem,
    usePotion,
    useUpgradeStone,
    buyItem,
    equipItem,
    unequipItem,
    unequipAllItems,
    autoEquipOptimal,
    craftItem,
    sellEquipment,
    dismantleEquipment,
    setDifficulty,
    handleEnemyDefeated,
    applyLevelUpBonus,
    levelUpDracoWithCoins,
    resetGameSave,
    exportSave,
    importSave,
    switchTier,
    markStageCleared,
    setLastWorldId,
    activationTier,
    setActivationTier,
    activationCodeInput,
    setActivationCodeInput,
    activationError,
    setActivationError,
    handleVerifyCode,
  };
}
