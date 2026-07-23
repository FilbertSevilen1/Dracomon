import { useState, useEffect, useCallback, useRef } from 'react';
import { SaveData, DracoData, PlayerStats, InventoryItem, TierType } from '../types/game';
import { storageService, DEFAULT_SAVE_DATA } from '../services/storage';
import { soundService } from '../services/sound';
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

  // Store ref of sound options to avoid circular updates
  const settingsRef = useRef(saveData.settings);
  settingsRef.current = saveData.settings;

  // Initialize and load save data
  useEffect(() => {
    const handleUpdate = () => {
      const freshData = storageService.loadGame();
      setSaveData(freshData);
      
      // Sync current character's max HP
      const selected = freshData.selectedDraco;
      const activeDraco = freshData.dracos[selected];
      if (activeDraco && activeDraco.hp) {
        setPlayerHP(activeDraco.hp);
        setPlayerMaxHP(activeDraco.hp);
      }
    };

    handleUpdate();

    window.addEventListener('dracomon_save_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('dracomon_save_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Sync volumes when settings change
  useEffect(() => {
    const settings = saveData.settings;
    soundService.updateVolumes(settings.volume, settings.sfxVolume ?? 80, settings.music);
  }, [saveData.settings]);

  // Helper to save state updates and trigger Local Storage persistence
  const updateSaveState = useCallback((updater: (prev: SaveData) => SaveData) => {
    setSaveData(prev => {
      const next = updater(prev);
      storageService.saveGame(next);
      if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('dracomon_save_updated', { detail: next }));
          }, 0);
        }
      return next;
    });
  }, []);

  // Update game settings
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

  // Select Draco
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

  // Unlock Draco
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

  // Collect coins in level
  const collectCoins = useCallback((amount: number) => {
    updateSaveState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        coins: prev.player.coins + amount
      }
    }));
  }, [updateSaveState]);

  // Add Item to Inventory
  const collectItem = useCallback((itemId: string) => {
    updateSaveState(prev => {
      const existingItem = prev.inventory.find(i => i.id === itemId);
      let newInventory = [...prev.inventory];
      
      if (existingItem) {
        newInventory = newInventory.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        const itemDetails = 
          itemId === 'potion' 
            ? { id: 'potion', name: 'Healing Potion', type: 'potion' as const, description: 'Restores 15 HP immediately.', quantity: 1 }
            : { id: 'upgrade_stone', name: 'Upgrade Stone', type: 'upgrade_stone' as const, description: 'Permanently increases any stat by +1.', quantity: 1 };
        newInventory.push(itemDetails);
      }

      return {
        ...prev,
        inventory: newInventory
      };
    });
  }, [updateSaveState]);

  // Use Healing Potion
  const usePotion = useCallback((dracoName: string, activeEngineRef?: any) => {
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

  // Use Upgrade Stone to increase a stat permanently
  const useUpgradeStone = useCallback((dracoName: string, stat: keyof PlayerStats) => {
    let success = false;
    updateSaveState(prev => {
      const stone = prev.inventory.find(i => i.id === 'upgrade_stone');
      if (stone && stone.quantity > 0) {
        const draco = prev.dracos[dracoName];
        if (draco && draco.unlocked) {
          const updatedDracos = JSON.parse(JSON.stringify(prev.dracos));
          const oldVal = (updatedDracos[dracoName] as any)[stat] || 0;
          if (stat === 'speed' && oldVal >= 20) return prev; // Speed capped at 20
          if (stat === 'jump' && oldVal >= 14) return prev; // Jump capped at 14

          let newVal = oldVal + 1;
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

  // Buy Item from shop
  const buyItem = useCallback((itemId: 'potion' | 'upgrade_stone', cost: number) => {
    let success = false;
    updateSaveState(prev => {
      if (prev.player.coins >= cost) {
        soundService.playCoin();
        success = true;
        
        const existingItem = prev.inventory.find(i => i.id === itemId);
        let newInventory = [...prev.inventory];
        
        if (existingItem) {
          newInventory = newInventory.map(i => 
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          const itemDetails = 
            itemId === 'potion' 
              ? { id: 'potion', name: 'Healing Potion', type: 'potion' as const, description: 'Restores 15 HP immediately.', quantity: 1 }
              : { id: 'upgrade_stone', name: 'Upgrade Stone', type: 'upgrade_stone' as const, description: 'Permanently increases any stat by +1.', quantity: 1 };
          newInventory.push(itemDetails);
        }

        return {
          ...prev,
          player: {
            ...prev.player,
            coins: prev.player.coins - cost
          },
          inventory: newInventory
        };
      }
      return prev;
    });
    return success;
  }, [updateSaveState]);

  const [pendingLevelUps, setPendingLevelUps] = useState<{
    dracoName: string;
    oldLevel: number;
    newLevel: number;
    baseIncrease: Partial<PlayerStats>;
    bonusRoll: number;
  }[]>([]);

  // Complete level / Gain EXP and handle levels up
  const handleEnemyDefeated = useCallback((expGain: number, coinsGain: number) => {
    updateSaveState(prev => {
      const activeName = prev.selectedDraco;
      const draco = prev.dracos[activeName];
      if (!draco) return prev;

      const newCoins = prev.player.coins + coinsGain;
      const totalPlayerExp = prev.player.totalExp + expGain;
      
      let currentExp = (draco.exp || 0) + expGain;
      let currentLevel = draco.level || 1;
      let requiredExp = currentLevel * 30;

      const baseIncrease: Partial<PlayerStats> = {
        hp: 2,
        attack: 1,
        defense: 1,
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

      while (currentLevel < 15 && currentExp >= requiredExp) {
        currentExp -= requiredExp;
        const oldLvl = currentLevel;
        currentLevel = Math.min(15, currentLevel + 1);
        requiredExp = currentLevel * 30;

        const roll = Math.floor(Math.random() * 2) + 1; // 1-2 random dice bonus (max +2)
        newPendingItems.push({
          dracoName: activeName,
          oldLevel: oldLvl,
          newLevel: currentLevel,
          baseIncrease,
          bonusRoll: roll
        });

        // Apply base stats for this level up immediately during combat
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
        setPendingLevelUps(prevList => [...prevList, ...newPendingItems]);
      }

      updatedDracos[activeName] = {
        ...updatedDracos[activeName],
        level: currentLevel,
        exp: currentLevel >= 15 ? 0 : currentExp,
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
  }, [updateSaveState]);

  // Apply chosen Level Up Bonus to stats
  const applyLevelUpBonus = useCallback((stat: keyof PlayerStats) => {
    if (!levelUpInfo) return;
    
    updateSaveState(prev => {
      const activeName = levelUpInfo.dracoName;
      const updatedDracos = { ...prev.dracos };
      const draco = updatedDracos[activeName];

      if (draco) {
        if (stat === 'energyRegen') {
          // Add 10% of bonusRoll to energyRegen, capped at 10.0 (1000% rate limit)
          const currentRegen = draco.energyRegen || 1.0;
          draco.energyRegen = Math.min(10.0, currentRegen + 0.1 * levelUpInfo.bonusRoll);
        } else {
          const oldStatVal = (draco as any)[stat] || 0;
          if (stat === 'speed' && oldStatVal >= 20) return prev;
          if (stat === 'jump' && oldStatVal >= 14) return prev;
          let newVal = oldStatVal + levelUpInfo.bonusRoll;
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

  // Level Up Draco With Coins
  const levelUpDracoWithCoins = useCallback((name: string) => {
    let success = false;
    updateSaveState(prev => {
      const draco = prev.dracos[name];
      if (!draco) return prev;
      const currentLvl = draco.level || 1;
      if (currentLvl >= 15) return prev; // Capped at Level 15
      const cost = currentLvl * 100;
      if (prev.player.coins >= cost) {
        soundService.playLevelUp();
        const updatedDracos = { ...prev.dracos };
        const d = updatedDracos[name];
        if (d) {
          d.level = currentLvl + 1;
          d.hp = (d.hp || 10) + 2;
          d.attack = (d.attack || 1) + 1;
          d.defense = (d.defense || 1) + 1;
          d.speed = Math.min(20, (d.speed || 1) + 1);
          d.jump = Math.min(14, (d.jump || 10) + 1);
          
          if (name === prev.selectedDraco) {
            setPlayerHP(d.hp);
            setPlayerMaxHP(d.hp);
          }

          const bonusRoll = Math.floor(Math.random() * 2) + 1; // 1-2 (max +2)
          const item = {
            dracoName: name,
            oldLevel: currentLvl,
            newLevel: currentLvl + 1,
            baseIncrease: { hp: 2, attack: 1, defense: 1, speed: 1 },
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

  // Reset Save Data
  const resetGameSave = useCallback(() => {
    const freshData = storageService.resetGame();
    setSaveData(freshData);
    setPlayerHP(freshData.dracos[freshData.selectedDraco].hp ?? 18);
    setPlayerMaxHP(freshData.dracos[freshData.selectedDraco].hp ?? 18);
    soundService.playClick();
  }, []);

  // Export Save String
  const exportSave = useCallback(() => {
    return storageService.exportSave(saveData);
  }, [saveData]);

  // Import Save Data
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

  // Switch Account Tier (Free, Basic, Premium)
  const switchTier = useCallback((newTier: TierType) => {
    soundService.playClick();
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
            // Splitted 1 to all attributes per level up (+4 bonus to all attributes for Lv.5)
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
            // Splitted 1 to all attributes per level up (+9 bonus to all attributes for Lv.10)
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

      return {
        ...prev,
        tier: newTier,
        unlockedDraco: unlockedList,
        dracos: updatedDracos,
      };
    });
  }, [updateSaveState]);

  const markStageCleared = useCallback((stageNum: number) => {
    updateSaveState(prev => {
      const currentCompleted = prev.completedStages || [1];
      const nextStages = new Set([...currentCompleted, stageNum, stageNum + 1]);
      return {
        ...prev,
        completedStages: Array.from(nextStages)
      };
    });

    setPendingLevelUps(prevList => {
      if (prevList.length > 0 && !showLevelUp) {
        setLevelUpInfo(prevList[0]);
        setShowLevelUp(true);
      }
      return prevList;
    });
  }, [showLevelUp, updateSaveState]);

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
    handleEnemyDefeated,
    applyLevelUpBonus,
    levelUpDracoWithCoins,
    resetGameSave,
    exportSave,
    importSave,
    switchTier,
    markStageCleared,
  };
}
