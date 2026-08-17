'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Shield,
  Zap,
  Hammer,
  Sparkles,
  ShoppingBag,
  Coins,
  ChevronRight,
  RefreshCw,
  Trash2,
  Check,
  Plus,
  ArrowUpRight,
  Info,
  Wrench,
  Search,
  Filter
} from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { soundService } from '../../services/sound';
import {
  ALL_EQUIPMENT,
  EQUIPMENT_REGISTRY,
  RARITY_CONFIG,
  SLOT_CONFIG,
  EquipmentSlot,
  EquipmentRarity,
  EquipmentItem,
  getEffectiveDracoStats,
  getDracoEquipmentBonus,
  EQUIPMENT_SLOTS_ORDER,
  getSlotIndexByType,
  getSlotTypeByIndex,
  normalizeDracoEquipped,
  getEquipmentSellPrice,
  getEquipmentDismantleYield
} from '../../data/equipment';
import {
  CRAFTING_RECIPES,
  canCraftRecipe,
  calculateRecipeAutoBuy,
  getRecipeByResultId,
  CraftingRecipe
} from '../../data/crafting';
import { Footer } from '../../components/Footer';
import { DracoArtwork } from '../../components/DracoArtwork';

function InventoryContent() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get('tab') as 'bag' | 'equipment' | 'craft' | 'shop' | null;
  const initialDracoParam = searchParams.get('draco');

  const {
    saveData,
    usePotion,
    useUpgradeStone,
    buyItem,
    equipItem,
    unequipItem,
    unequipAllItems,
    autoEquipOptimal,
    craftItem,
    sellEquipment,
    dismantleEquipment
  } = useGameState();

  const [activeTab, setActiveTab] = useState<'bag' | 'equipment' | 'craft' | 'shop'>(
    initialTabParam || 'bag'
  );

  const [selectedDraco, setSelectedDraco] = useState<string>(
    initialDracoParam && saveData.dracos[initialDracoParam]
      ? initialDracoParam
      : saveData.selectedDraco || Object.keys(saveData.dracos)[0] || 'Jumpmon'
  );

  useEffect(() => {
    if (initialTabParam) {
      setActiveTab(initialTabParam);
    }
    if (initialDracoParam && saveData.dracos[initialDracoParam]) {
      setSelectedDraco(initialDracoParam);
    }
  }, [initialTabParam, initialDracoParam, saveData.dracos]);

  // Sub-filters
  const [bagCategory, setBagCategory] = useState<string>('all');
  const [bagRarity, setBagRarity] = useState<string>('all');
  const [craftCategory, setCraftCategory] = useState<string>('all');
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [activeSlotPicker, setActiveSlotPicker] = useState<number | null>(null);

  // Selected item to inspect
  const [inspectingItem, setInspectingItem] = useState<any | null>(null);

  // Stat stone selection for synthesizing
  const [selectedSynthesizeStat, setSelectedSynthesizeStat] = useState<
    'hp' | 'attack' | 'defense' | 'speed' | 'jump' | 'range'
  >('attack');

  const coins = saveData.player.coins;
  const unlockedDracos = Object.keys(saveData.dracos).filter(k => saveData.dracos[k]?.unlocked);
  const currentDracoData = saveData.dracos[selectedDraco] || {
    level: 1,
    hp: 10,
    attack: 1,
    defense: 1,
    speed: 1,
    jump: 1,
    range: 1,
    unlocked: true,
    equipped: []
  };

  const equippedList = normalizeDracoEquipped(currentDracoData.equipped);
  const equippedCount = equippedList.filter(Boolean).length;

  // Track how many copies of each item are equipped across ALL Dracos
  const equippedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(saveData.dracos).forEach(dName => {
      const d = saveData.dracos[dName];
      if (d && Array.isArray(d.equipped)) {
        d.equipped.forEach(eqId => {
          if (eqId) {
            counts[eqId] = (counts[eqId] || 0) + 1;
          }
        });
      }
    });
    return counts;
  }, [saveData.dracos]);

  // Track how many copies of each item are equipped on OTHER Dracos (excluding selected hero)
  const equippedCountsByOtherDracos = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(saveData.dracos).forEach(dName => {
      if (dName === selectedDraco) return;
      const d = saveData.dracos[dName];
      if (d && Array.isArray(d.equipped)) {
        d.equipped.forEach(eqId => {
          if (eqId) {
            counts[eqId] = (counts[eqId] || 0) + 1;
          }
        });
      }
    });
    return counts;
  }, [saveData.dracos, selectedDraco]);

  // Toast & Purchase Feedback Indicator
  const [purchaseToast, setPurchaseToast] = useState<{
    id: number;
    title: string;
    description: string;
    icon: string;
    coinsDiff?: number;
    type: 'purchase' | 'craft' | 'equip';
  } | null>(null);

  const [recentlyBoughtId, setRecentlyBoughtId] = useState<string | null>(null);

  const triggerToast = (
    title: string,
    description: string,
    icon: string,
    coinsDiff?: number,
    type: 'purchase' | 'craft' | 'equip' = 'purchase'
  ) => {
    setPurchaseToast({
      id: Date.now(),
      title,
      description,
      icon,
      coinsDiff,
      type
    });
    setTimeout(() => {
      setPurchaseToast(prev => (prev?.title === title ? null : prev));
    }, 3500);
  };

  // Compute stat breakdown for selected hero
  const effectiveStats = useMemo(
    () => getEffectiveDracoStats(currentDracoData, equippedList),
    [currentDracoData, equippedList]
  );
  const eqBonus = useMemo(() => getDracoEquipmentBonus(equippedList), [equippedList]);

  // Filtered bag items
  const filteredBagItems = useMemo(() => {
    return saveData.inventory.filter(item => {
      if (bagCategory !== 'all') {
        if (bagCategory === 'consumables') {
          if (item.type === 'equipment') return false;
        } else if (bagCategory === 'equipment') {
          if (item.type !== 'equipment') return false;
        } else {
          // Specific slot
          if (item.slot !== bagCategory) return false;
        }
      }
      if (bagRarity !== 'all' && item.rarity !== bagRarity) {
        return false;
      }
      return true;
    });
  }, [saveData.inventory, bagCategory, bagRarity]);

  // Filtered crafting recipes
  const filteredRecipes = useMemo(() => {
    return CRAFTING_RECIPES.filter(r => {
      if (craftCategory === 'all') return true;
      return r.category === craftCategory;
    });
  }, [craftCategory]);

  // Filtered shop items
  const filteredShopEquipment = useMemo(() => {
    return ALL_EQUIPMENT.filter(eq => {
      if (shopCategory === 'all') return true;
      return eq.slot === shopCategory;
    });
  }, [shopCategory]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-display flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-amber-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-24 pb-16 space-y-8 z-10">
        {/* Header Title & Currencies */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800/80">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 rounded-2xl shadow-lg shadow-amber-500/20">
                <Briefcase className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display flex items-center gap-2.5">
                  Inventory <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">&amp; Workshop</span>
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 font-mono mt-0.5">
                  Armory loadouts, equipment forging, inventory bag &amp; the mystic merchant
                </p>
              </div>
            </div>
          </div>

          {/* Currencies & Resource Counter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-stone-900/90 rounded-2xl border border-stone-800 shadow-inner">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-mono font-bold text-sm text-amber-300">{coins.toLocaleString()} Coins</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-stone-900/90 rounded-2xl border border-stone-800 shadow-inner">
              <span className="text-sm">🔮</span>
              <span className="font-mono font-bold text-xs text-purple-300">
                {saveData.inventory.find(i => i.id === 'upgrade_stone')?.quantity || 0} Stones
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-stone-900/90 rounded-2xl border border-stone-800 shadow-inner">
              <span className="text-sm">🧪</span>
              <span className="font-mono font-bold text-xs text-rose-300">
                {saveData.inventory.find(i => i.id === 'potion')?.quantity || 0} Potions
              </span>
            </div>
          </div>
        </div>

        {/* Primary Tabs: Bag / Equipment / Forge & Craft / Mystic Shop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-1.5 bg-stone-900/80 rounded-2xl border border-stone-800/80 backdrop-blur-md">
          <button
            onClick={() => {
              soundService.playClick();
              setActiveTab('bag');
              setActiveSlotPicker(null);
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'bag'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-lg shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>🎒 Bag ({saveData.inventory.length})</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              setActiveTab('equipment');
              setActiveSlotPicker(null);
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'equipment'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-lg shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>⚔️ Equipment ({equippedCount}/5)</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              setActiveTab('craft');
              setActiveSlotPicker(null);
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'craft'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-lg shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            }`}
          >
            <Hammer className="w-4 h-4" />
            <span>🔨 Forge &amp; Craft ({CRAFTING_RECIPES.length})</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              setActiveTab('shop');
              setActiveSlotPicker(null);
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'shop'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-lg shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>✨ Mystic Shop</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: BAG (INVENTORY)                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'bag' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-900/60 rounded-2xl border border-stone-800/80 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'equipment', label: '⚔️ Equipment' },
                  { id: 'weapon', label: 'Weapons' },
                  { id: 'armor', label: 'Armor' },
                  { id: 'boots', label: 'Boots' },
                  { id: 'accessory', label: 'Accessories' },
                  { id: 'relic', label: 'Relics' },
                  { id: 'consumables', label: '🧪 Consumables' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundService.playClick();
                      setBagCategory(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                      bagCategory === tab.id
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'text-stone-400 hover:text-stone-200 bg-stone-950/60 hover:bg-stone-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Rarity Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-500 font-mono">Rarity:</span>
                {['all', 'common', 'rare', 'epic', 'legendary', 'mythic'].map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      soundService.playClick();
                      setBagRarity(r);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                      bagRarity === r
                        ? 'bg-stone-100 text-stone-950'
                        : 'text-stone-400 bg-stone-950/60 hover:bg-stone-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Items Grid */}
            {filteredBagItems.length === 0 ? (
              <div className="p-16 text-center bg-stone-900/40 rounded-3xl border border-stone-800/80 space-y-4">
                <div className="w-16 h-16 mx-auto bg-stone-800/80 rounded-2xl flex items-center justify-center text-3xl text-stone-500">
                  🎒
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-300">No items found</h3>
                  <p className="text-xs text-stone-500 font-mono mt-1">
                    Defeat dungeon enemies or visit the Mystic Shop to expand your collection!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBagItems.map(item => {
                  const isEquipment = item.type === 'equipment';
                  const eqData = isEquipment ? EQUIPMENT_REGISTRY[item.id] || item : null;
                  const rarity = item.rarity || 'common';
                  const rarityCfg = RARITY_CONFIG[rarity as EquipmentRarity] || RARITY_CONFIG.common;
                  const totalEquippedAcrossAll = isEquipment ? equippedCounts[item.id] || 0 : 0;
                  const equippedOnOtherDracos = isEquipment ? equippedCountsByOtherDracos[item.id] || 0 : 0;
                  const availableForCurrent = item.quantity - equippedOnOtherDracos;
                  const isEquippedByCurrent = isEquipment && equippedList.includes(item.id);
                  const isRecentlyBought = recentlyBoughtId === item.id;

                  return (
                    <motion.div
                      layout
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative group ${
                        isEquippedByCurrent
                          ? 'bg-emerald-950/30 border-emerald-500/80 shadow-lg shadow-emerald-950/30'
                          : isRecentlyBought
                          ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-500/30 shadow-xl'
                          : 'bg-stone-900/90 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        {/* Header: Icon, Name & Quantity */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl relative shadow-md"
                              style={{
                                backgroundColor: '#0f172a',
                                border: `2px solid ${rarityCfg.color}`
                              }}
                            >
                              <span>{item.icon || (isEquipment ? '⚔️' : item.id === 'potion' ? '🧪' : '🔮')}</span>
                              {item.quantity > 1 && (
                                <span className="absolute -bottom-1 -right-1 bg-stone-900 text-amber-300 border border-stone-700 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full">
                                  x{item.quantity}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-stone-100 font-display leading-tight">{item.name}</h4>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span
                                  className="text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono"
                                  style={{
                                    backgroundColor: rarityCfg.bg,
                                    color: rarityCfg.color,
                                    border: `1px solid ${rarityCfg.border}`
                                  }}
                                >
                                  {rarityCfg.label}
                                </span>
                                {item.slot && (
                                  <span className="text-[9px] text-stone-400 font-mono uppercase">
                                    • {item.slot}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-stone-400 mt-3 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Stat Pills */}
                        {isEquipment && item.stats && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {item.stats.attack && (
                              <span className="px-2 py-0.5 bg-amber-950/70 border border-amber-800/80 text-amber-300 text-[10px] font-mono font-bold rounded-lg">
                                +{item.stats.attack} ATK
                              </span>
                            )}
                            {item.stats.defense && (
                              <span className="px-2 py-0.5 bg-blue-950/70 border border-blue-800/80 text-blue-300 text-[10px] font-mono font-bold rounded-lg">
                                +{item.stats.defense} DEF
                              </span>
                            )}
                            {item.stats.hp && (
                              <span className="px-2 py-0.5 bg-rose-950/70 border border-rose-800/80 text-rose-300 text-[10px] font-mono font-bold rounded-lg">
                                +{item.stats.hp} HP
                              </span>
                            )}
                            {item.stats.speed && (
                              <span className="px-2 py-0.5 bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-[10px] font-mono font-bold rounded-lg">
                                +{item.stats.speed} SPD
                              </span>
                            )}
                            {item.stats.jump && (
                              <span className="px-2 py-0.5 bg-purple-950/70 border border-purple-800/80 text-purple-300 text-[10px] font-mono font-bold rounded-lg">
                                +{item.stats.jump} JUMP
                              </span>
                            )}
                            {item.stats.range && (
                              <span className="px-2 py-0.5 bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-[10px] font-mono font-bold rounded-lg">
                                +{item.stats.range} RNG
                              </span>
                            )}
                            {item.stats.energyRegen && (
                              <span className="px-2 py-0.5 bg-yellow-950/70 border border-yellow-800/80 text-yellow-300 text-[10px] font-mono font-bold rounded-lg">
                                +{item.stats.energyRegen} NRG
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Item Bottom Actions */}
                      <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                        {isEquipment ? (
                          <>
                            <div className="text-[11px] font-mono text-stone-500">
                              {totalEquippedAcrossAll > 0 ? (
                                <span className="text-amber-400/90 font-bold">{totalEquippedAcrossAll} Equipped</span>
                              ) : (
                                <span>Unassigned</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              {/* Sell & Disassemble buttons for unequipped copies */}
                              {item.quantity - totalEquippedAcrossAll > 0 && (
                                <>
                                  <button
                                    onClick={() => {
                                      const sellPrice = getEquipmentSellPrice(item.id);
                                      const success = sellEquipment(item.id, 1);
                                      if (success) {
                                        triggerToast(`Sold ${item.name}!`, `+${sellPrice} Gold Coins earned`, '💰', undefined, 'purchase');
                                      }
                                    }}
                                    title={`Sell 1x for ${getEquipmentSellPrice(item.id)}🪙`}
                                    className="px-2 py-1.5 bg-stone-800 hover:bg-amber-950 text-amber-300 border border-stone-700 hover:border-amber-700 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 active:scale-95"
                                  >
                                    <span>💰</span>
                                    <span>+{getEquipmentSellPrice(item.id)}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      const yieldInfo = getEquipmentDismantleYield(item.id);
                                      const success = dismantleEquipment(item.id, 1);
                                      if (success) {
                                        triggerToast(`Disassembled ${item.name}!`, `Gained materials & +${yieldInfo.scrapCoins}🪙`, '🔨', undefined, 'craft');
                                      }
                                    }}
                                    title="Disassemble for ingredients & Upgrade Stones"
                                    className="px-2 py-1.5 bg-stone-800 hover:bg-purple-950 text-purple-300 border border-stone-700 hover:border-purple-700 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 active:scale-95"
                                  >
                                    <span>🔨</span>
                                    <span className="hidden sm:inline">Scrap</span>
                                  </button>
                                </>
                              )}

                              {isEquippedByCurrent ? (
                                <button
                                  onClick={() => {
                                    const slotIdx = equippedList.indexOf(item.id);
                                    if (slotIdx !== -1) {
                                      unequipItem(selectedDraco, slotIdx);
                                      triggerToast(`Unequipped ${item.name}`, `Removed from ${selectedDraco} loadout`, item.icon || '⚔️', undefined, 'equip');
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold font-display transition-all"
                                >
                                  Unequip
                                </button>
                              ) : (
                                <button
                                  disabled={availableForCurrent <= 0}
                                  onClick={() => {
                                    const success = equipItem(selectedDraco, item.id);
                                    if (success) {
                                      triggerToast(`Equipped ${item.name}!`, `Assigned to ${selectedDraco} loadout`, item.icon || '⚔️', undefined, 'equip');
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                                    availableForCurrent > 0
                                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95'
                                      : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                                  }`}
                                >
                                  {availableForCurrent <= 0
                                    ? 'All Equipped'
                                    : (() => {
                                        const eqSlot = eqData?.slot || 'weapon';
                                        const sIdx = getSlotIndexByType(eqSlot);
                                        const sCfg = SLOT_CONFIG[eqSlot];
                                        return equippedList[sIdx] ? `Swap ${sCfg.label}` : `Equip ${sCfg.label}`;
                                      })()}
                                </button>
                              )}
                            </div>
                          </>
                        ) : item.id === 'potion' ? (
                          <button
                            onClick={() => {
                              const success = usePotion(selectedDraco);
                              if (success) {
                                triggerToast(`Drank Healing Potion!`, `+15 HP restored to ${selectedDraco}`, '🧪', undefined, 'purchase');
                              }
                            }}
                            className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold font-display transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <span>Drink Potion (+15 HP)</span>
                          </button>
                        ) : (
                          <div className="w-full space-y-2">
                            <div className="flex items-center gap-1">
                              {(['hp', 'attack', 'defense', 'speed'] as const).map(stat => (
                                <button
                                  key={stat}
                                  onClick={() => setSelectedSynthesizeStat(stat)}
                                  className={`px-2 py-1 rounded text-[10px] font-mono uppercase font-bold flex-1 transition-all ${
                                    selectedSynthesizeStat === stat
                                      ? 'bg-purple-600 text-white shadow-sm'
                                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                                  }`}
                                >
                                  {stat}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => {
                                const success = useUpgradeStone(selectedDraco, selectedSynthesizeStat);
                                if (success) {
                                  triggerToast(`Stat Synthesized!`, `+0.1 ${selectedSynthesizeStat.toUpperCase()} added to ${selectedDraco}`, '🔮', undefined, 'craft');
                                }
                              }}
                              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-display transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                            >
                              <span>Synthesize +0.1 {selectedSynthesizeStat.toUpperCase()}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: EQUIPMENT & ARMORY LOADOUT                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            {/* Hero Selector Tabs */}
            <div className="p-4 bg-stone-900/60 rounded-2xl border border-stone-800/80 backdrop-blur-md">
              <div className="text-xs font-black uppercase tracking-wider text-stone-400 font-display mb-3">
                Select Companion Hero Loadout
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {unlockedDracos.map(dName => {
                  const isSelected = selectedDraco === dName;
                  const dData = saveData.dracos[dName];
                  const dEqCount = Array.isArray(dData?.equipped) ? dData.equipped.length : 0;
                  const isActiveEquipped = saveData.selectedDraco === dName;

                  return (
                    <button
                      key={dName}
                      onClick={() => {
                        soundService.playClick();
                        setSelectedDraco(dName);
                        setActiveSlotPicker(null);
                      }}
                      className={`px-4 py-3 rounded-2xl border transition-all flex items-center gap-3 shrink-0 ${
                        isSelected
                          ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-500/30 text-amber-300 shadow-lg'
                          : 'bg-stone-950/80 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-inner">
                        <DracoArtwork name={dName} size={36} />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black uppercase font-display">{dName}</span>
                          {isActiveEquipped && (
                            <span className="text-[8px] px-1 bg-emerald-500 text-stone-950 font-black rounded font-mono">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 font-bold block mt-0.5">
                          Lv.{dData?.level || 1} • {dEqCount}/5 Gear
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Armory Loadout & Stat Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 5 Interactive Equipment Slots */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-6 bg-stone-900/90 rounded-3xl border border-stone-800 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center p-1 shadow-md shrink-0">
                        <DracoArtwork name={selectedDraco} size={48} animated />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase text-stone-100 font-display flex items-center gap-2">
                          <span>{selectedDraco} Loadout</span>
                          <span className="text-xs font-mono text-amber-400">({equippedCount}/5 Slots)</span>
                        </h3>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">
                          Equip typed weapon, armor, boots, accessory, and relic pieces
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const success = autoEquipOptimal(selectedDraco);
                          if (success) {
                            triggerToast('Auto-Equipped Loadout!', `Equipped optimal typed gear to ${selectedDraco}`, '⚡', undefined, 'equip');
                          } else {
                            triggerToast('No Gear Available', 'No unequipped typed gear in bag', '🛡️', undefined, 'equip');
                          }
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 rounded-xl text-xs font-black uppercase font-display transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Auto-Equip Best</span>
                      </button>
                      {equippedCount > 0 && (
                        <button
                          onClick={() => {
                            unequipAllItems(selectedDraco);
                            triggerToast('Unequipped All Gear', `Removed all gear from ${selectedDraco}`, '🗑️', undefined, 'equip');
                          }}
                          className="p-2 bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 border border-stone-700 hover:border-rose-700 rounded-xl text-xs transition-colors"
                          title="Unequip all gear from this hero"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 5 Typed Equipment Slots Rows */}
                  <div className="space-y-2.5">
                    {[0, 1, 2, 3, 4].map(slotIdx => {
                      const slotType = getSlotTypeByIndex(slotIdx);
                      const slotCfg = SLOT_CONFIG[slotType];
                      const eqId = equippedList[slotIdx];
                      const eq = eqId ? EQUIPMENT_REGISTRY[eqId] : null;
                      const rarity = eq?.rarity || 'common';
                      const rarityCfg = RARITY_CONFIG[rarity as EquipmentRarity] || RARITY_CONFIG.common;
                      const isPickerOpen = activeSlotPicker === slotIdx;

                      return (
                        <div key={slotIdx} className="space-y-2">
                          <div
                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              eq
                                ? 'bg-stone-950/90 border-stone-800 hover:border-stone-700'
                                : 'bg-stone-950/40 border-dashed border-stone-800/80'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0"
                                style={{
                                  backgroundColor: '#0f172a',
                                  border: eq ? `2px solid ${rarityCfg.color}` : '1px dashed #334155'
                                }}
                              >
                                <span>{eq ? eq.icon : slotCfg.icon}</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                {eq ? (
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-amber-400 font-mono">
                                        {slotCfg.icon} {slotCfg.label} Slot
                                      </span>
                                      <span
                                        className="text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono"
                                        style={{
                                          backgroundColor: rarityCfg.bg,
                                          color: rarityCfg.color,
                                          border: `1px solid ${rarityCfg.border}`
                                        }}
                                      >
                                        {rarityCfg.label}
                                      </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-stone-100 font-display truncate mt-0.5">
                                      {eq.name}
                                    </h4>
                                    <p className="text-xs text-stone-400 font-mono mt-0.5 truncate">
                                      {Object.entries(eq.stats || {})
                                        .map(([k, v]) => `+${v} ${k.toUpperCase()}`)
                                        .join('  •  ')}
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-xs font-bold text-amber-400 font-display uppercase flex items-center gap-1.5">
                                      <span>{slotCfg.icon}</span>
                                      <span>Empty {slotCfg.label} Slot</span>
                                    </span>
                                    <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                                      {slotCfg.desc}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  soundService.playClick();
                                  setActiveSlotPicker(isPickerOpen ? null : slotIdx);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                                  isPickerOpen
                                    ? 'bg-amber-500 text-stone-950'
                                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                                }`}
                              >
                                {eq ? 'Swap Gear' : `+ Equip ${slotCfg.label}`}
                              </button>

                              {eq && (
                                <button
                                  onClick={() => {
                                    soundService.playClick();
                                    unequipItem(selectedDraco, slotIdx);
                                    triggerToast(`Unequipped ${eq.name}`, `Removed from ${selectedDraco} ${slotCfg.label} slot`, eq.icon, undefined, 'equip');
                                  }}
                                  className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-stone-800 transition-colors"
                                  title="Unequip this item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Equipment Picker Drawer (Strictly Slot Type Filtered) */}
                          <AnimatePresence>
                            {isPickerOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-stone-950/95 border border-amber-500/40 rounded-2xl space-y-3 overflow-hidden shadow-2xl"
                              >
                                <div className="flex items-center justify-between text-xs font-black uppercase text-amber-400 font-display">
                                  <span>Choose {slotCfg.label} ({slotCfg.icon}) for Slot #{slotIdx + 1}:</span>
                                  <button
                                    onClick={() => setActiveSlotPicker(null)}
                                    className="text-stone-400 hover:text-white"
                                  >
                                    ✕ Close
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                                  {saveData.inventory
                                    .filter(i => {
                                      if (i.type !== 'equipment') return false;
                                      const eqData = EQUIPMENT_REGISTRY[i.id];
                                      if (!eqData || eqData.slot !== slotType) return false;
                                      const usedByOtherDracos = equippedCountsByOtherDracos[i.id] || 0;
                                      const isEquippedInThisSlot = equippedList[slotIdx] === i.id;
                                      const availableForSlot = i.quantity - usedByOtherDracos;
                                      return isEquippedInThisSlot || availableForSlot > 0;
                                    })
                                    .map(item => {
                                      const eqData = EQUIPMENT_REGISTRY[item.id] || item;
                                      const rCfg =
                                        RARITY_CONFIG[(eqData.rarity as EquipmentRarity) || 'common'] ||
                                        RARITY_CONFIG.common;
                                      const isEquippedInThisSlot = equippedList[slotIdx] === item.id;

                                      return (
                                        <button
                                          key={item.id}
                                          onClick={() => {
                                            const success = equipItem(selectedDraco, item.id, slotIdx);
                                            if (success) {
                                              triggerToast(`Equipped ${eqData.name}!`, `Assigned to ${slotCfg.label} Slot (${selectedDraco})`, eqData.icon || '⚔️', undefined, 'equip');
                                            }
                                            setActiveSlotPicker(null);
                                          }}
                                          className={`p-2.5 rounded-xl bg-stone-900 border text-left flex items-center gap-2.5 transition-all group ${
                                            isEquippedInThisSlot
                                              ? 'border-amber-400 bg-amber-950/20'
                                              : 'border-stone-800 hover:border-amber-400'
                                          }`}
                                        >
                                          <span className="text-xl">{eqData.icon || slotCfg.icon}</span>
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-xs font-bold text-stone-200 group-hover:text-amber-300 block truncate">
                                                {eqData.name}
                                              </span>
                                              {isEquippedInThisSlot && (
                                                <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 rounded">
                                                  Equipped
                                                </span>
                                              )}
                                            </div>
                                            <span className="text-[10px] text-stone-500 font-mono block truncate">
                                              {Object.entries(eqData.stats || {})
                                                .map(([k, v]) => `+${v} ${k.toUpperCase()}`)
                                                .join(' ')}
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}

                                  {saveData.inventory.filter(i => {
                                    if (i.type !== 'equipment') return false;
                                    const eqData = EQUIPMENT_REGISTRY[i.id];
                                    if (!eqData || eqData.slot !== slotType) return false;
                                    const usedByOther = equippedCountsByOtherDracos[i.id] || 0;
                                    const isEquippedInThisSlot = equippedList[slotIdx] === i.id;
                                    return isEquippedInThisSlot || i.quantity - usedByOther > 0;
                                  }).length === 0 && (
                                    <div className="col-span-full p-4 text-center text-xs text-stone-500 font-mono">
                                      No available {slotCfg.label} items in your bag. Craft or buy one in the Armory!
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Battle Attributes & Bonus Preview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 bg-stone-900/90 rounded-3xl border border-stone-800 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                        <Zap className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase text-stone-100 font-display">
                          {selectedDraco} Battle Attributes
                        </h4>
                        <p className="text-[11px] text-stone-400 font-mono">
                          Base + Upgrade Stones + Equipped Gear Bonus
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Attributes Stats List */}
                  <div className="space-y-3">
                    {[
                      {
                        label: 'HP (Health)',
                        base: currentDracoData.hp || 10,
                        bonus: eqBonus.hp,
                        color: 'text-rose-400',
                        bg: 'bg-rose-500',
                        max: 240
                      },
                      {
                        label: 'Attack Power',
                        base: currentDracoData.attack || 1,
                        bonus: eqBonus.attack,
                        color: 'text-amber-400',
                        bg: 'bg-amber-500',
                        max: 35
                      },
                      {
                        label: 'Defense Armor',
                        base: currentDracoData.defense || 1,
                        bonus: eqBonus.defense,
                        color: 'text-blue-400',
                        bg: 'bg-blue-500',
                        max: 70
                      },
                      {
                        label: 'Movement Speed',
                        base: currentDracoData.speed || 1,
                        bonus: eqBonus.speed,
                        color: 'text-emerald-400',
                        bg: 'bg-emerald-500',
                        max: 15
                      },
                      {
                        label: 'Jump Force',
                        base: currentDracoData.jump || 1,
                        bonus: eqBonus.jump,
                        color: 'text-purple-400',
                        bg: 'bg-purple-500',
                        max: 15
                      },
                      {
                        label: 'Attack Range',
                        base: currentDracoData.range || 1,
                        bonus: eqBonus.range,
                        color: 'text-cyan-400',
                        bg: 'bg-cyan-500',
                        max: 10
                      },
                      {
                        label: 'Energy Regeneration',
                        base: 1.0,
                        bonus: eqBonus.energyRegen,
                        color: 'text-yellow-400',
                        bg: 'bg-yellow-500',
                        max: 5
                      }
                    ].map(stat => {
                      const bonusVal = stat.bonus || 0;
                      const total = Math.round((stat.base + bonusVal) * 10) / 10;
                      return (
                        <div key={stat.label} className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800/80">
                          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                            <span className="font-bold text-stone-300">{stat.label}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold ${stat.color}`}>{total}</span>
                              {bonusVal > 0 && (
                                <span className="text-[10px] text-emerald-400 font-bold">
                                  (+{Math.round(bonusVal * 10) / 10})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                            <div
                              className={`h-full ${stat.bg} rounded-full transition-all duration-300`}
                              style={{ width: `${Math.min(100, (total / stat.max) * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: FORGE & CRAFTING WORKSHOP                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'craft' && (
          <div className="space-y-6">
            {/* Crafting Categories Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-900/60 rounded-2xl border border-stone-800/80 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Recipes' },
                  { id: 'weapon', label: '⚔️ Weapons' },
                  { id: 'armor', label: '🛡️ Armor' },
                  { id: 'boots', label: '👢 Boots' },
                  { id: 'accessory', label: '💍 Accessories' },
                  { id: 'relic', label: '🔮 Relics' },
                  { id: 'consumable', label: '🧪 Alchemy' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundService.playClick();
                      setCraftCategory(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                      craftCategory === tab.id
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'text-stone-400 hover:text-stone-200 bg-stone-950/60 hover:bg-stone-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-stone-400">
                <span>{filteredRecipes.length} Blueprint(s) Available</span>
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRecipes.map(recipe => {
                const calc = calculateRecipeAutoBuy(
                  recipe,
                  saveData.inventory,
                  coins,
                  equippedCounts
                );

                const rarityCfg =
                  RARITY_CONFIG[recipe.rarity as EquipmentRarity] || RARITY_CONFIG.common;
                const resultEq = EQUIPMENT_REGISTRY[recipe.resultItemId];

                return (
                  <motion.div
                    layout
                    key={recipe.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative group ${
                      calc.allIngredientsOwned
                        ? 'bg-stone-900/90 border-amber-500/60 shadow-xl shadow-amber-950/30'
                        : calc.canAfford
                        ? 'bg-stone-900/80 border-orange-500/40 shadow-lg shadow-orange-950/20'
                        : 'bg-stone-900/60 border-stone-800 opacity-90'
                    }`}
                  >
                    <div>
                      {/* Header: Result Item Icon, Name & Rarity */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0"
                            style={{
                              backgroundColor: '#0f172a',
                              border: `2px solid ${rarityCfg.color}`
                            }}
                          >
                            <span>{recipe.icon}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-black uppercase text-stone-100 font-display leading-tight">
                              {recipe.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono"
                                style={{
                                  backgroundColor: rarityCfg.bg,
                                  color: rarityCfg.color,
                                  border: `1px solid ${rarityCfg.border}`
                                }}
                              >
                                {rarityCfg.label}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono uppercase">
                                • {recipe.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description / Lore */}
                      <p className="text-xs text-stone-400 mt-3 leading-relaxed">
                        {recipe.description}
                      </p>

                      {/* Result Stats Breakdown */}
                      {resultEq && resultEq.stats && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {Object.entries(resultEq.stats).map(([k, v]) => (
                            <span
                              key={k}
                              className="px-2 py-0.5 bg-stone-950/80 border border-stone-800 text-stone-300 text-[10px] font-mono font-bold rounded-lg"
                            >
                              +{v} {k.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Required Ingredients Section */}
                      <div className="mt-4 pt-3 border-t border-stone-800/80 space-y-2">
                        <div className="text-[11px] font-black uppercase tracking-wider text-stone-400 font-display flex items-center justify-between">
                          <span>Ingredients Breakdown:</span>
                          <span className="text-amber-400 font-mono font-bold">
                            Fee: {recipe.requiredCoins}🪙
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {calc.ingredientsDetails.map(ing => {
                            return (
                              <div
                                key={ing.itemId}
                                className={`px-3 py-2 rounded-xl border flex items-center justify-between text-xs font-mono ${
                                  ing.isFullyOwned
                                    ? 'bg-stone-950/80 border-emerald-800/60 text-emerald-300'
                                    : 'bg-stone-950/80 border-stone-800 text-stone-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{ing.icon}</span>
                                  <span className="font-bold truncate max-w-[130px]">{ing.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[11px] font-bold">
                                    {ing.availableOwned}/{ing.needed}
                                  </span>
                                  {ing.isFullyOwned ? (
                                    <span className="text-emerald-400 text-[10px] font-bold">✅ Owned</span>
                                  ) : (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-bold">
                                      +{(ing.missingToBuy * ing.unitPrice)}🪙 buy
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions Section */}
                    <div className="mt-5 pt-3 border-t border-stone-800 space-y-2">
                      {calc.allIngredientsOwned ? (
                        <button
                          disabled={coins < recipe.requiredCoins}
                          onClick={() => {
                            const success = craftItem(recipe.id, true);
                            if (success) {
                              triggerToast(`Forged ${resultEq?.name || recipe.name}!`, `-${recipe.requiredCoins} Gold Coins fee • Synthesized!`, resultEq?.icon || '⚔️', recipe.requiredCoins, 'craft');
                              setRecentlyBoughtId(recipe.resultItemId);
                              setTimeout(() => setRecentlyBoughtId(null), 2000);
                            }
                          }}
                          className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider font-display transition-all shadow-lg flex items-center justify-center gap-2 ${
                            coins >= recipe.requiredCoins
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 shadow-emerald-500/20 active:scale-95'
                              : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                          }`}
                        >
                          <Hammer className="w-4 h-4" />
                          <span>
                            {coins >= recipe.requiredCoins
                              ? `Forge ${recipe.name.replace('Forge ', '')} (${recipe.requiredCoins}🪙)`
                              : `Need ${recipe.requiredCoins - coins} More Coins`}
                          </span>
                        </button>
                      ) : (
                        <div className="space-y-1.5">
                          <button
                            disabled={!calc.canAfford}
                            onClick={() => {
                              const success = craftItem(recipe.id, true);
                              if (success) {
                                triggerToast(`Auto-Forged ${resultEq?.name || recipe.name}!`, `-${calc.totalCost} Gold Coins • Added to Bag`, resultEq?.icon || '⚔️', calc.totalCost, 'craft');
                                setRecentlyBoughtId(recipe.resultItemId);
                                setTimeout(() => setRecentlyBoughtId(null), 2000);
                              }
                            }}
                            className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider font-display transition-all shadow-lg flex items-center justify-center gap-2 ${
                              calc.canAfford
                                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-amber-500/20 active:scale-95 ring-1 ring-amber-400/50'
                                : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                            }`}
                          >
                            <Sparkles className="w-4 h-4 text-stone-950" />
                            <span>
                              {calc.canAfford
                                ? `Buy & Auto-Forge (${calc.totalCost}🪙)`
                                : `Need ${calc.missingCoins} More Coins (${calc.totalCost}🪙)`}
                            </span>
                          </button>
                          <div className="text-[10px] font-mono text-center text-stone-400 flex items-center justify-center gap-1.5">
                            <span>Fee: {recipe.requiredCoins}🪙</span>
                            <span>•</span>
                            <span>
                              {calc.ownedIngredientsCount > 0
                                ? `Uses ${calc.ownedIngredientsCount} owned item(s) + buys ${calc.missingIngredientsCount} missing`
                                : 'Buys all base materials'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: MYSTIC SHOP                                                 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            {/* Consumables Section */}
            <div className="p-6 bg-stone-900/90 rounded-3xl border border-stone-800 shadow-2xl space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Consumables &amp; Enhancements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* Healing Potion */}
                <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800 flex items-center justify-center text-2xl">
                      🧪
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">Healing Potion</h4>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">Restores 15 HP immediately</p>
                      <span className="text-[11px] font-mono text-amber-400 font-bold mt-1 block">15 Coins</span>
                    </div>
                  </div>
                  <button
                    disabled={coins < 15}
                    onClick={() => {
                      const success = buyItem('potion', 15);
                      if (success) {
                        triggerToast('Healing Potion Purchased!', '-15 Gold Coins • Added to Bag', '🧪', 15, 'purchase');
                        setRecentlyBoughtId('potion');
                        setTimeout(() => setRecentlyBoughtId(null), 1500);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
                      coins >= 15
                        ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {recentlyBoughtId === 'potion' ? '✓ Bought!' : 'Buy (15🪙)'}
                  </button>
                </div>

                {/* Upgrade Stone */}
                <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-800 flex items-center justify-center text-2xl">
                      🔮
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">Upgrade Stone</h4>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">Permanently synthesizes +0.1 to any stat</p>
                      <span className="text-[11px] font-mono text-amber-400 font-bold mt-1 block">80 Coins</span>
                    </div>
                  </div>
                  <button
                    disabled={coins < 80}
                    onClick={() => {
                      const success = buyItem('upgrade_stone', 80);
                      if (success) {
                        triggerToast('Upgrade Stone Purchased!', '-80 Gold Coins • Added to Bag', '🔮', 80, 'purchase');
                        setRecentlyBoughtId('upgrade_stone');
                        setTimeout(() => setRecentlyBoughtId(null), 1500);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
                      coins >= 80
                        ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {recentlyBoughtId === 'upgrade_stone' ? '✓ Bought!' : 'Buy (80🪙)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Equipment Armory Shop */}
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-900/60 rounded-2xl border border-stone-800/80 backdrop-blur-md">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Equipment' },
                    { id: 'weapon', label: '⚔️ Weapons' },
                    { id: 'armor', label: '🛡️ Armor' },
                    { id: 'boots', label: '👢 Boots' },
                    { id: 'accessory', label: '💍 Accessories' },
                    { id: 'relic', label: '🔮 Relics' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        soundService.playClick();
                        setShopCategory(tab.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                        shopCategory === tab.id
                          ? 'bg-amber-500 text-stone-950 shadow-sm'
                          : 'text-stone-400 hover:text-stone-200 bg-stone-950/60 hover:bg-stone-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredShopEquipment.map(eq => {
                  const rarityCfg = RARITY_CONFIG[eq.rarity] || RARITY_CONFIG.common;
                  const recipe = getRecipeByResultId(eq.id);
                  const autoBuyCalc = recipe
                    ? calculateRecipeAutoBuy(recipe, saveData.inventory, coins, equippedCounts)
                    : null;
                  const hasSmartCraft = autoBuyCalc && autoBuyCalc.ownedIngredientsCount > 0;
                  const finalPrice = hasSmartCraft ? autoBuyCalc.totalCost : eq.cost;
                  const canAfford = coins >= finalPrice;
                  const owned = saveData.inventory.find(i => i.id === eq.id)?.quantity || 0;
                  const isRecentlyBought = recentlyBoughtId === eq.id;

                  return (
                    <div
                      key={eq.id}
                      className={`p-4 rounded-2xl bg-stone-900/90 border flex flex-col justify-between space-y-3 transition-all ${
                        isRecentlyBought
                          ? 'border-emerald-400 ring-2 ring-emerald-500/30 shadow-xl'
                          : hasSmartCraft
                          ? 'border-amber-500/60 shadow-lg shadow-amber-950/20'
                          : 'border-stone-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md shrink-0"
                              style={{
                                backgroundColor: '#0f172a',
                                border: `2px solid ${rarityCfg.color}`
                              }}
                            >
                              <span>{eq.icon}</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white font-display leading-tight">{eq.name}</h4>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span
                                  className="text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono"
                                  style={{
                                    backgroundColor: rarityCfg.bg,
                                    color: rarityCfg.color,
                                    border: `1px solid ${rarityCfg.border}`
                                  }}
                                >
                                  {rarityCfg.label}
                                </span>
                                <span className="text-[9px] text-stone-400 font-mono uppercase">• {eq.slot}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {hasSmartCraft && (
                          <div className="mt-2 px-2.5 py-1 bg-amber-950/60 border border-amber-700/60 rounded-xl flex items-center justify-between text-[10px] font-mono text-amber-300">
                            <span>✨ Uses {autoBuyCalc.ownedIngredientsCount} owned mat(s)</span>
                            <span className="font-bold text-amber-400">
                              {eq.cost > autoBuyCalc.totalCost
                                ? `Save ${eq.cost - autoBuyCalc.totalCost}🪙`
                                : 'Smart Forge'}
                            </span>
                          </div>
                        )}

                        <p className="text-xs text-stone-400 mt-2.5 line-clamp-2 leading-relaxed">{eq.description}</p>

                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {Object.entries(eq.stats).map(([k, v]) => (
                            <span
                              key={k}
                              className="px-1.5 py-0.5 bg-stone-950 border border-stone-800 text-stone-300 text-[10px] font-mono rounded"
                            >
                              +{v} {k.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                        <div className="text-[11px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-400 font-bold">{finalPrice} Coins</span>
                            {hasSmartCraft && eq.cost !== finalPrice && (
                              <span className="text-stone-500 line-through text-[10px]">{eq.cost}🪙</span>
                            )}
                          </div>
                          {owned > 0 && <span className="text-stone-500 text-[10px]">({owned} in bag)</span>}
                        </div>
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            if (hasSmartCraft && recipe) {
                              const success = craftItem(recipe.id, true);
                              if (success) {
                                triggerToast(`Smart Forged ${eq.name}!`, `-${finalPrice} Gold Coins • Added to Bag`, eq.icon, finalPrice, 'craft');
                                setRecentlyBoughtId(eq.id);
                                setTimeout(() => setRecentlyBoughtId(null), 1500);
                              }
                            } else {
                              const success = buyItem(eq.id, eq.cost);
                              if (success) {
                                triggerToast(`Purchased ${eq.name}!`, `-${eq.cost} Gold Coins • Added to Bag`, eq.icon, eq.cost, 'purchase');
                                setRecentlyBoughtId(eq.id);
                                setTimeout(() => setRecentlyBoughtId(null), 1500);
                              }
                            }
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                            canAfford
                              ? isRecentlyBought
                                ? 'bg-emerald-500 text-stone-950 shadow-md font-black'
                                : hasSmartCraft
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-md active:scale-95'
                                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95'
                              : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                          }`}
                        >
                          {isRecentlyBought
                            ? '✓ Bought!'
                            : hasSmartCraft
                            ? `Smart Craft (${finalPrice}🪙)`
                            : `Buy (${finalPrice}🪙)`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING PURCHASE & ACTION TOAST NOTIFICATION */}
      <AnimatePresence>
        {purchaseToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-stone-900/95 border border-amber-500/70 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 text-stone-100 max-w-sm ring-1 ring-amber-500/30"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
              {purchaseToast.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-black uppercase text-amber-400 font-display truncate">
                {purchaseToast.title}
              </h5>
              <p className="text-[11px] text-stone-300 font-mono mt-0.5 truncate">
                {purchaseToast.description}
              </p>
            </div>
            {purchaseToast.coinsDiff && (
              <div className="px-2 py-1 bg-amber-950/80 border border-amber-600/60 rounded-lg text-[10px] font-mono font-bold text-amber-300 shrink-0">
                -{purchaseToast.coinsDiff}🪙
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-stone-400">Loading Armory &amp; Workshop...</p>
          </div>
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
