import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SaveData, PlayerStats, InventoryItem } from '../types/game';
import {
  Sparkles,
  Coins,
  ShoppingBag,
  Heart,
  Shield,
  Sword,
  Zap,
  Footprints,
  Crosshair,
  Trash2,
  Plus,
  Check,
  Filter,
  X,
  Wrench,
  Layers,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { soundService } from '../services/sound';
import {
  ALL_EQUIPMENT,
  EQUIPMENT_REGISTRY,
  RARITY_CONFIG,
  SLOT_CONFIG,
  EquipmentItem,
  EquipmentSlot,
  EquipmentRarity,
  getEffectiveDracoStats,
  getDracoEquipmentBonus,
  EQUIPMENT_SLOTS_ORDER,
  getSlotIndexByType,
  getSlotTypeByIndex,
  normalizeDracoEquipped,
  getEquipmentSellPrice,
  getEquipmentDismantleYield
} from '../data/equipment';
import { calculateRecipeAutoBuy, getRecipeByResultId } from '../data/crafting';
import { DracoArtwork } from './DracoArtwork';

interface InventoryModalProps {
  saveData: SaveData;
  initialTab?: 'inventory' | 'equipment' | 'shop';
  initialDraco?: string;
  onUsePotion: (dracoName: string) => boolean;
  onUseUpgradeStone: (dracoName: string, stat: keyof PlayerStats) => boolean;
  onBuyItem: (itemId: string, cost: number) => boolean;
  onEquipItem?: (dracoName: string, itemId: string, slotIndex?: number) => boolean;
  onUnequipItem?: (dracoName: string, slotIndex: number) => boolean;
  onUnequipAll?: (dracoName: string) => boolean;
  onAutoEquip?: (dracoName: string) => boolean;
  onSellItem?: (itemId: string) => boolean;
  onDismantleItem?: (itemId: string) => boolean;
  onClose: () => void;
}

const CONSUMABLE_SHOP_ITEMS = [
  {
    id: 'potion',
    name: 'Healing Potion',
    description: 'Restores 15 Health immediately during stages or from bag.',
    cost: 15,
    icon: '❤️',
    rarity: 'common' as EquipmentRarity
  },
  {
    id: 'upgrade_stone',
    name: 'Upgrade Stone',
    description: 'Consume to permanently increase any chosen stat of your selected Draco by +0.1.',
    cost: 50,
    icon: '🔮',
    rarity: 'rare' as EquipmentRarity
  }
];

export const InventoryModal: React.FC<InventoryModalProps> = ({
  saveData,
  initialTab = 'inventory',
  initialDraco,
  onUsePotion,
  onUseUpgradeStone,
  onBuyItem,
  onEquipItem,
  onUnequipItem,
  onUnequipAll,
  onAutoEquip,
  onSellItem,
  onDismantleItem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'equipment' | 'shop'>(initialTab);
  const [selectedDracoForEquip, setSelectedDracoForEquip] = useState<string>(
    initialDraco || saveData.selectedDraco || 'Jumpmon'
  );
  const [stoneUpgrading, setStoneUpgrading] = useState(false);
  const [bagFilter, setBagFilter] = useState<'all' | 'equipment' | 'consumable'>('all');
  const [shopCategory, setShopCategory] = useState<'all' | 'consumables' | EquipmentSlot>('all');
  const [slotPickerIndex, setSlotPickerIndex] = useState<number | null>(null);

  const selectedDraco = selectedDracoForEquip;
  const dracoDetails = saveData.dracos[selectedDraco];
  const coins = saveData.player.coins;

  const potionItem = saveData.inventory.find(i => i.id === 'potion');
  const potionQty = potionItem ? potionItem.quantity : 0;

  const stoneItem = saveData.inventory.find(i => i.id === 'upgrade_stone');
  const stoneQty = stoneItem ? stoneItem.quantity : 0;

  // Track equipped counts across all dracos
  const equippedItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(saveData.dracos).forEach(dracoName => {
      const d = saveData.dracos[dracoName];
      if (d && Array.isArray(d.equipped)) {
        d.equipped.forEach(eqId => {
          counts[eqId] = (counts[eqId] || 0) + 1;
        });
      }
    });
    return counts;
  }, [saveData.dracos]);

  const currentDracoEquipped = useMemo(() => {
    return normalizeDracoEquipped(dracoDetails?.equipped);
  }, [dracoDetails]);

  const equippedCount = useMemo(() => {
    return currentDracoEquipped.filter(Boolean).length;
  }, [currentDracoEquipped]);

  const effectiveStats = useMemo(() => {
    return getEffectiveDracoStats(dracoDetails, currentDracoEquipped);
  }, [dracoDetails, currentDracoEquipped]);

  const equipmentBonus = useMemo(() => {
    return getDracoEquipmentBonus(currentDracoEquipped);
  }, [currentDracoEquipped]);

  const [modalToast, setModalToast] = useState<{ text: string; id: number } | null>(null);

  const handleUsePotion = () => {
    if (potionQty <= 0) return;
    onUsePotion(selectedDraco);
  };

  const handleUseUpgradeStone = (stat: keyof PlayerStats) => {
    if (stoneQty <= 0) return;
    const success = onUseUpgradeStone(selectedDraco, stat);
    if (success && stoneQty - 1 <= 0) {
      setStoneUpgrading(false);
    }
  };

  const handleBuy = (itemId: string, cost: number) => {
    const success = onBuyItem(itemId, cost);
    if (success) {
      const eq = EQUIPMENT_REGISTRY[itemId];
      const itemName = eq ? eq.name : itemId === 'potion' ? 'Healing Potion' : 'Upgrade Stone';
      setModalToast({ text: `✨ Purchased ${itemName} (-${cost}🪙)! Added to Bag.`, id: Date.now() });
      setTimeout(() => setModalToast(null), 3000);
    }
  };

  const handleEquip = (itemId: string, slotIdx?: number) => {
    if (onEquipItem) {
      onEquipItem(selectedDraco, itemId, slotIdx);
    }
    setSlotPickerIndex(null);
  };

  const handleUnequip = (slotIdx: number) => {
    if (onUnequipItem) {
      onUnequipItem(selectedDraco, slotIdx);
    }
  };

  const handleAutoEquip = () => {
    if (onAutoEquip) {
      onAutoEquip(selectedDraco);
    }
  };

  const handleUnequipAll = () => {
    if (onUnequipAll) {
      onUnequipAll(selectedDraco);
    }
  };

  const statLabels: { key: keyof PlayerStats; label: string; desc: string; icon: string }[] = [
    { key: 'hp', label: 'Hit Points (HP)', desc: 'Increases maximum life pool.', icon: '❤️' },
    { key: 'attack', label: 'Attack Power', desc: 'Increases raw damage output.', icon: '⚔️' },
    { key: 'defense', label: 'Defense Rating', desc: 'Reduces damage taken from hits.', icon: '🛡️' },
    { key: 'speed', label: 'Movement Speed', desc: 'Run faster across terrain.', icon: '👟' },
    { key: 'jump', label: 'Jump Height', desc: 'Leap higher to clear obstacles.', icon: '🥾' },
    { key: 'range', label: 'Ability Range', desc: 'Increases melee hitbox & projectile reach.', icon: '🎯' },
    { key: 'energyRegen', label: 'Energy Regen', desc: 'Accelerates ultimate spell recharge.', icon: '⚡' }
  ];

  // Unlocked Dracos for dropdown
  const unlockedDracos = useMemo(() => {
    const list = saveData.unlockedDraco || ['Jumpmon'];
    return list.filter(name => !!saveData.dracos[name]);
  }, [saveData.unlockedDraco, saveData.dracos]);

  // Inventory items filtered for bag
  const filteredBagItems = useMemo(() => {
    return saveData.inventory.filter(item => {
      if (item.quantity <= 0) return false;
      if (bagFilter === 'consumable') return item.id === 'potion' || item.id === 'upgrade_stone';
      if (bagFilter === 'equipment') return item.id !== 'potion' && item.id !== 'upgrade_stone';
      return true;
    });
  }, [saveData.inventory, bagFilter]);

  // Available unequipped items for slot picker drawer (Filtered strictly by required slot type)
  const availableEquipList = useMemo(() => {
    const items: { item: EquipmentItem; count: number; available: number }[] = [];
    if (slotPickerIndex === null) return items;
    const requiredSlotType = getSlotTypeByIndex(slotPickerIndex);

    saveData.inventory.forEach(invItem => {
      if (invItem.id === 'potion' || invItem.id === 'upgrade_stone') return;
      const eq = EQUIPMENT_REGISTRY[invItem.id];
      if (eq && eq.slot === requiredSlotType) {
        let usedOnOtherDracos = 0;
        Object.keys(saveData.dracos).forEach(dName => {
          if (dName !== selectedDraco) {
            const d = saveData.dracos[dName];
            if (d && Array.isArray(d.equipped)) {
              d.equipped.forEach(eqId => {
                if (eqId === invItem.id) usedOnOtherDracos++;
              });
            }
          }
        });

        const isEquippedHere = currentDracoEquipped[slotPickerIndex] === invItem.id;
        const available = invItem.quantity - usedOnOtherDracos;
        if (isEquippedHere || available > 0) {
          items.push({ item: eq, count: invItem.quantity, available: isEquippedHere ? available + 1 : available });
        }
      }
    });
    return items;
  }, [saveData.inventory, saveData.dracos, selectedDraco, currentDracoEquipped, slotPickerIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-950/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.96, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 15 }}
        className="w-full max-w-4xl max-h-[92vh] overflow-hidden border bg-stone-900/95 border-stone-800 rounded-3xl shadow-2xl backdrop-blur-xl text-stone-100 flex flex-col"
      >
        {/* MODAL NAVIGATION TAB HEADER */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-stone-800 bg-stone-950/80 flex-shrink-0">
          <div className="flex items-center gap-3 md:gap-8">
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('inventory');
                setStoneUpgrading(false);
                setSlotPickerIndex(null);
              }}
              className={`text-base md:text-lg font-black uppercase tracking-wider pb-1 border-b-2 font-display transition-all ${
                activeTab === 'inventory'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              🎒 Bag ({saveData.inventory.reduce((acc, i) => acc + (i.quantity || 0), 0)})
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('equipment');
                setStoneUpgrading(false);
                setSlotPickerIndex(null);
              }}
              className={`text-base md:text-lg font-black uppercase tracking-wider pb-1 border-b-2 font-display transition-all ${
                activeTab === 'equipment'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              ⚔️ Equipment
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('shop');
                setSlotPickerIndex(null);
              }}
              className={`text-base md:text-lg font-black uppercase tracking-wider pb-1 border-b-2 font-display transition-all ${
                activeTab === 'shop'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              ✨ Mystic Shop
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-950 rounded-full border border-stone-800 shadow-inner text-xs md:text-sm font-mono">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-amber-300">{coins} Coins</span>
            </div>
            <button
              onClick={() => {
                soundService.playClick();
                onClose();
              }}
              className="p-1.5 text-stone-400 hover:text-stone-100 bg-stone-950/60 hover:bg-stone-800 rounded-full transition-colors border border-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TOAST BANNER */}
        <AnimatePresence>
          {modalToast && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-stone-950 font-bold px-4 py-2.5 text-xs text-center font-mono flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{modalToast.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL MAIN CONTENT BODY */}
        <div className="p-4 md:p-6 flex-1 overflow-y-auto bg-stone-900/60">
          <AnimatePresence mode="wait">
            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB 1: BAG (INVENTORY)                                         */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'inventory' && (
              <motion.div
                key="inventory-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-5"
              >
                {/* Bag Filter Pills */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-800/80">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBagFilter('all')}
                      className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors ${
                        bagFilter === 'all'
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      All Items
                    </button>
                    <button
                      onClick={() => setBagFilter('equipment')}
                      className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors ${
                        bagFilter === 'equipment'
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      ⚔️ Equipment
                    </button>
                    <button
                      onClick={() => setBagFilter('consumable')}
                      className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors ${
                        bagFilter === 'consumable'
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      🧪 Consumables
                    </button>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">
                    Active Draco: <strong className="text-amber-400">{selectedDraco}</strong>
                  </span>
                </div>

                {stoneUpgrading ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-purple-950/40 border border-purple-800/80 p-4 rounded-2xl">
                      <div>
                        <h4 className="font-black text-purple-300 flex items-center gap-1.5 font-display uppercase">
                          <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                          Apply Upgrade Stone
                        </h4>
                        <p className="text-xs text-purple-200/80 font-mono mt-0.5">
                          Select which stat of your {selectedDraco} to permanently increase by +0.1.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          soundService.playClick();
                          setStoneUpgrading(false);
                        }}
                        className="text-xs font-black uppercase font-display px-3 py-1.5 rounded-xl border border-purple-700 text-purple-300 bg-purple-950 hover:bg-purple-900 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {statLabels.map(({ key, label, desc, icon }) => {
                        const rawVal = dracoDetails ? (dracoDetails as any)[key] || 0 : 0;
                        const currentVal = Math.round(rawVal * 10) / 10;
                        const isCapped =
                          (key === 'speed' && currentVal >= 20) || (key === 'jump' && currentVal >= 14);

                        return (
                          <button
                            key={key}
                            disabled={isCapped}
                            onClick={() => handleUseUpgradeStone(key)}
                            className={`flex flex-col justify-between p-4 border rounded-2xl text-left transition-all group ${
                              isCapped
                                ? 'opacity-50 cursor-not-allowed border-stone-900 bg-stone-950/60'
                                : 'border-stone-800 bg-stone-950/90 hover:border-purple-500 hover:bg-purple-950/40 cursor-pointer shadow-md'
                            }`}
                          >
                            <div>
                              <span
                                className={`text-xs font-bold block font-display uppercase ${
                                  isCapped ? 'text-stone-500' : 'text-stone-200 group-hover:text-purple-300'
                                }`}
                              >
                                {icon} {label}
                              </span>
                              <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">{desc}</span>
                            </div>
                            {isCapped ? (
                              <span className="text-xs font-mono font-bold mt-2 text-stone-500">
                                MAX CAPPED ({key === 'speed' ? '20' : '14'})
                              </span>
                            ) : (
                              <span className="text-xs font-mono font-bold mt-2 text-stone-400">
                                Current: <span className="text-white font-bold">{currentVal}</span> →{' '}
                                <span className="text-purple-400 font-bold">
                                  {Math.round((currentVal + 0.1) * 10) / 10}
                                </span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Consumables Cards */}
                    {(bagFilter === 'all' || bagFilter === 'consumable') && (
                      <>
                        {/* Healing Potion Card */}
                        <div className="p-4 md:p-5 border border-stone-800 rounded-2xl flex flex-col justify-between bg-stone-950/90 shadow-xl">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-3xl">❤️</span>
                              <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-stone-900 border border-stone-800 text-rose-400 rounded-lg">
                                Qty: {potionQty}
                              </span>
                            </div>
                            <h3 className="font-black text-white text-base md:text-lg mt-2 uppercase font-display">
                              Healing Potion
                            </h3>
                            <p className="text-xs text-stone-400 mt-1 leading-relaxed font-mono">
                              Restores 15 HP immediately during combat or from bag.
                            </p>
                          </div>
                          <button
                            onClick={handleUsePotion}
                            disabled={potionQty <= 0}
                            className={`w-full mt-4 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider font-display border transition-all ${
                              potionQty > 0
                                ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-950/50'
                                : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
                            }`}
                          >
                            Drink Potion
                          </button>
                        </div>

                        {/* Upgrade Stone Card */}
                        <div className="p-4 md:p-5 border border-stone-800 rounded-2xl flex flex-col justify-between bg-stone-950/90 shadow-xl">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-3xl">🔮</span>
                              <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-stone-900 border border-stone-800 text-purple-400 rounded-lg">
                                Qty: {stoneQty}
                              </span>
                            </div>
                            <h3 className="font-black text-white text-base md:text-lg mt-2 uppercase font-display">
                              Upgrade Stone
                            </h3>
                            <p className="text-xs text-stone-400 mt-1 leading-relaxed font-mono">
                              Permanently increase a chosen stat (+0.1) on your active Draco.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              soundService.playClick();
                              setStoneUpgrading(true);
                            }}
                            disabled={stoneQty <= 0}
                            className={`w-full mt-4 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider font-display border transition-all ${
                              stoneQty > 0
                                ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-950/50'
                                : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
                            }`}
                          >
                            Synthesize Stat
                          </button>
                        </div>
                      </>
                    )}

                    {/* Equipment Cards in Bag */}
                    {(bagFilter === 'all' || bagFilter === 'equipment') &&
                      saveData.inventory
                        .filter(i => i.id !== 'potion' && i.id !== 'upgrade_stone' && i.quantity > 0)
                        .map(invItem => {
                          const eqData = EQUIPMENT_REGISTRY[invItem.id];
                          const rarity = eqData?.rarity || (invItem.rarity as EquipmentRarity) || 'common';
                          const rarityCfg = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
                          const icon = eqData?.icon || invItem.icon || '⚔️';
                          const name = eqData?.name || invItem.name;
                          const desc = eqData?.description || invItem.description;
                          const stats = eqData?.stats || invItem.stats || {};
                          const totalEquipped = equippedItemCounts[invItem.id] || 0;
                          const availableToEquip = invItem.quantity - totalEquipped;
                          const isEquippedOnCurrent = currentDracoEquipped.includes(invItem.id);

                          return (
                            <div
                              key={invItem.id}
                              className={`p-4 md:p-5 border rounded-2xl flex flex-col justify-between bg-stone-950/90 shadow-xl transition-all ${rarityCfg.border}`}
                            >
                              <div>
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">{icon}</span>
                                    <span
                                      className={`px-2 py-0.5 text-[10px] font-black uppercase font-mono rounded-md ${rarityCfg.bg} ${rarityCfg.text} border ${rarityCfg.border}`}
                                    >
                                      {rarityCfg.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 font-mono text-xs">
                                    <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 text-amber-300 rounded-lg font-bold">
                                      Qty: {invItem.quantity}
                                    </span>
                                    {totalEquipped > 0 && (
                                      <span className="px-1.5 py-0.5 bg-blue-950/60 border border-blue-800 text-blue-300 rounded-md text-[10px]">
                                        {totalEquipped} Equipped
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <h3 className="font-black text-white text-base mt-2 font-display">{name}</h3>
                                <p className="text-xs text-stone-400 mt-0.5 leading-relaxed font-mono">{desc}</p>

                                {/* Stat pills */}
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {stats.attack ? (
                                    <span className="px-2 py-0.5 bg-red-950/60 border border-red-800 text-red-300 rounded text-[11px] font-mono font-bold">
                                      +{stats.attack} ATK
                                    </span>
                                  ) : null}
                                  {stats.defense ? (
                                    <span className="px-2 py-0.5 bg-blue-950/60 border border-blue-800 text-blue-300 rounded text-[11px] font-mono font-bold">
                                      +{stats.defense} DEF
                                    </span>
                                  ) : null}
                                  {stats.hp ? (
                                    <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded text-[11px] font-mono font-bold">
                                      +{stats.hp} HP
                                    </span>
                                  ) : null}
                                  {stats.speed ? (
                                    <span className="px-2 py-0.5 bg-yellow-950/60 border border-yellow-800 text-yellow-300 rounded text-[11px] font-mono font-bold">
                                      +{stats.speed} SPD
                                    </span>
                                  ) : null}
                                  {stats.jump ? (
                                    <span className="px-2 py-0.5 bg-cyan-950/60 border border-cyan-800 text-cyan-300 rounded text-[11px] font-mono font-bold">
                                      +{stats.jump} JUMP
                                    </span>
                                  ) : null}
                                  {stats.range ? (
                                    <span className="px-2 py-0.5 bg-amber-950/60 border border-amber-800 text-amber-300 rounded text-[11px] font-mono font-bold">
                                      +{stats.range} RNG
                                    </span>
                                  ) : null}
                                  {stats.energyRegen ? (
                                    <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-800 text-purple-300 rounded text-[11px] font-mono font-bold">
                                      +{stats.energyRegen} NRG Regen
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-stone-900 flex items-center gap-2">
                                {(() => {
                                  const eqSlot: EquipmentSlot = eqData?.slot || 'weapon';
                                  const sIdx = getSlotIndexByType(eqSlot);
                                  const sCfg = SLOT_CONFIG[eqSlot];
                                  const isSlotOccupied = !!currentDracoEquipped[sIdx];
                                  const sellPrice = getEquipmentSellPrice(invItem.id);
                                  const yieldInfo = getEquipmentDismantleYield(invItem.id);

                                  return (
                                    <>
                                      {availableToEquip > 0 && onSellItem && (
                                        <button
                                          onClick={() => {
                                            const ok = onSellItem(invItem.id);
                                            if (ok) {
                                              setModalToast({ text: `💰 Sold 1x ${name} (+${sellPrice}🪙)!`, id: Date.now() });
                                              setTimeout(() => setModalToast(null), 3000);
                                            }
                                          }}
                                          title={`Sell 1x for ${sellPrice}🪙`}
                                          className="py-2 px-2.5 rounded-xl text-xs font-mono font-bold border border-amber-800 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 transition-all flex items-center gap-1 shadow-sm shrink-0"
                                        >
                                          <span>💰</span>
                                          <span>+{sellPrice}</span>
                                        </button>
                                      )}

                                      {availableToEquip > 0 && onDismantleItem && (
                                        <button
                                          onClick={() => {
                                            const ok = onDismantleItem(invItem.id);
                                            if (ok) {
                                              setModalToast({ text: `🔨 Disassembled 1x ${name} (+${yieldInfo.scrapCoins}🪙 & materials)!`, id: Date.now() });
                                              setTimeout(() => setModalToast(null), 3000);
                                            }
                                          }}
                                          title={`Disassemble for ingredients & +${yieldInfo.scrapCoins}🪙`}
                                          className="py-2 px-2.5 rounded-xl text-xs font-mono font-bold border border-purple-800 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 transition-all flex items-center gap-1 shadow-sm shrink-0"
                                        >
                                          <span>🔨</span>
                                          <span className="hidden sm:inline">Scrap</span>
                                        </button>
                                      )}

                                      <button
                                        onClick={() => handleEquip(invItem.id, sIdx)}
                                        disabled={availableToEquip <= 0 && !isEquippedOnCurrent}
                                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider font-display border transition-all ${
                                          availableToEquip > 0 || isEquippedOnCurrent
                                            ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-400 shadow-md'
                                            : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
                                        }`}
                                      >
                                        {isEquippedOnCurrent
                                          ? 'Equipped'
                                          : availableToEquip <= 0
                                          ? 'All In Use'
                                          : isSlotOccupied
                                          ? `Swap ${sCfg.label}`
                                          : `Equip ${sCfg.label}`}
                                      </button>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          );
                        })}

                    {filteredBagItems.length === 0 && (
                      <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 text-center">
                        <ShoppingBag className="w-10 h-10 text-stone-600 mb-2" />
                        <h4 className="font-black text-stone-200 uppercase font-display">No Items Found in this Tab</h4>
                        <p className="text-xs text-stone-500 mt-1 font-mono">
                          Visit the Mystic Shop tab to trade coins for weapons, armor, and accessories!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB 2: EQUIPMENT (LOADOUT & ARMORY)                            */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'equipment' && (
              <motion.div
                key="equipment-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                {/* Draco Selector Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  <span className="text-xs font-bold text-stone-400 font-mono flex-shrink-0 mr-1">Select Hero:</span>
                  {unlockedDracos.map(name => {
                    const isSelected = name === selectedDraco;
                    const d = saveData.dracos[name];
                    const eqCount = Array.isArray(d?.equipped) ? d.equipped.length : 0;
                    return (
                      <button
                        key={name}
                        onClick={() => {
                          soundService.playClick();
                          setSelectedDracoForEquip(name);
                          setSlotPickerIndex(null);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold font-display uppercase whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-stone-950/80 text-stone-300 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                          <DracoArtwork name={name} size={20} />
                        </div>
                        <span>{name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                            isSelected ? 'bg-amber-600 text-stone-950' : 'bg-stone-900 text-stone-400'
                          }`}
                        >
                          {eqCount}/5
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Hero Combat Attributes & Loadout Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Left Column: Hero Attributes card */}
                  <div className="p-5 border border-stone-800 rounded-3xl bg-stone-950/90 flex flex-col justify-between shadow-xl space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center p-0.5 shadow-inner shrink-0">
                            <DracoArtwork name={selectedDraco} size={36} />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-amber-400 font-bold uppercase">Active Companion</span>
                            <h3 className="text-2xl font-black text-white font-display uppercase tracking-wide">
                              {selectedDraco}
                            </h3>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-950/60 border border-amber-800 text-amber-300 rounded-xl">
                          Lv. {dracoDetails?.level || 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="p-2.5 bg-stone-900/90 border border-stone-800/80 rounded-xl">
                          <span className="text-[10px] font-mono text-stone-400 block uppercase">❤️ Hit Points</span>
                          <span className="text-sm font-bold text-white font-mono">
                            {effectiveStats.hp}
                            {equipmentBonus.hp > 0 && (
                              <span className="text-emerald-400 text-xs ml-1 font-bold">
                                (+{equipmentBonus.hp})
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="p-2.5 bg-stone-900/90 border border-stone-800/80 rounded-xl">
                          <span className="text-[10px] font-mono text-stone-400 block uppercase">⚔️ Attack Power</span>
                          <span className="text-sm font-bold text-white font-mono">
                            {effectiveStats.attack}
                            {equipmentBonus.attack > 0 && (
                              <span className="text-emerald-400 text-xs ml-1 font-bold">
                                (+{equipmentBonus.attack})
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="p-2.5 bg-stone-900/90 border border-stone-800/80 rounded-xl">
                          <span className="text-[10px] font-mono text-stone-400 block uppercase">🛡️ Defense</span>
                          <span className="text-sm font-bold text-white font-mono">
                            {effectiveStats.defense}
                            {equipmentBonus.defense > 0 && (
                              <span className="text-emerald-400 text-xs ml-1 font-bold">
                                (+{equipmentBonus.defense})
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="p-2.5 bg-stone-900/90 border border-stone-800/80 rounded-xl">
                          <span className="text-[10px] font-mono text-stone-400 block uppercase">👟 Speed</span>
                          <span className="text-sm font-bold text-white font-mono">
                            {effectiveStats.speed}
                            {equipmentBonus.speed > 0 && (
                              <span className="text-emerald-400 text-xs ml-1 font-bold">
                                (+{equipmentBonus.speed})
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="p-2.5 bg-stone-900/90 border border-stone-800/80 rounded-xl">
                          <span className="text-[10px] font-mono text-stone-400 block uppercase">🥾 Jump</span>
                          <span className="text-sm font-bold text-white font-mono">
                            {effectiveStats.jump}
                            {equipmentBonus.jump > 0 && (
                              <span className="text-emerald-400 text-xs ml-1 font-bold">
                                (+{equipmentBonus.jump})
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="p-2.5 bg-stone-900/90 border border-stone-800/80 rounded-xl">
                          <span className="text-[10px] font-mono text-stone-400 block uppercase">⚡ Energy Regen</span>
                          <span className="text-sm font-bold text-white font-mono">
                            {effectiveStats.energyRegen}x
                            {equipmentBonus.energyRegen && equipmentBonus.energyRegen > 0 ? (
                              <span className="text-emerald-400 text-xs ml-1 font-bold">
                                (+{equipmentBonus.energyRegen})
                              </span>
                            ) : null}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-stone-800">
                      <button
                        onClick={handleAutoEquip}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black uppercase text-xs font-display rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        Auto-Equip Best Gear
                      </button>
                      <button
                        onClick={handleUnequipAll}
                        disabled={equippedCount === 0}
                        className={`w-full py-2 px-3 border rounded-xl text-xs font-black uppercase font-display transition-all flex items-center justify-center gap-1.5 ${
                          equippedCount > 0
                            ? 'border-stone-700 bg-stone-900 text-stone-300 hover:bg-stone-800'
                            : 'border-stone-800 bg-stone-950 text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Unequip All ({equippedCount})
                      </button>
                    </div>
                  </div>

                  {/* Right 2 Columns: 5 Typed Equipment Slots */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black uppercase tracking-wider text-stone-300 font-display flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400" />
                        Equipment Slots ({equippedCount}/5)
                      </h4>
                      <span className="text-[11px] text-stone-500 font-mono">1 per Type: Weapon, Armor, Boots, Accessory, Relic</span>
                    </div>

                    <div className="space-y-2.5">
                      {[0, 1, 2, 3, 4].map(slotIdx => {
                        const slotType = getSlotTypeByIndex(slotIdx);
                        const slotCfg = SLOT_CONFIG[slotType];
                        const equippedId = currentDracoEquipped[slotIdx];
                        const eqItem = equippedId ? EQUIPMENT_REGISTRY[equippedId] : undefined;

                        if (eqItem) {
                          const rarityCfg = RARITY_CONFIG[eqItem.rarity] || RARITY_CONFIG.common;
                          return (
                            <div
                              key={`slot-${slotIdx}`}
                              className={`p-3.5 border rounded-2xl bg-stone-950/95 flex items-center justify-between transition-all ${rarityCfg.border}`}
                            >
                              <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-stone-900 border border-stone-800 flex-shrink-0">
                                  {eqItem.icon || slotCfg.icon}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-amber-400 font-mono">
                                      {slotCfg.icon} {slotCfg.label} Slot
                                    </span>
                                    <span
                                      className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-mono font-bold ${rarityCfg.bg} ${rarityCfg.text}`}
                                    >
                                      {rarityCfg.label}
                                    </span>
                                  </div>
                                  <h5 className="font-bold text-white text-sm font-display">{eqItem.name}</h5>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {eqItem.stats.attack && (
                                      <span className="text-[10px] font-mono text-red-400 font-bold">
                                        +{eqItem.stats.attack} ATK
                                      </span>
                                    )}
                                    {eqItem.stats.defense && (
                                      <span className="text-[10px] font-mono text-blue-400 font-bold">
                                        +{eqItem.stats.defense} DEF
                                      </span>
                                    )}
                                    {eqItem.stats.hp && (
                                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                        +{eqItem.stats.hp} HP
                                      </span>
                                    )}
                                    {eqItem.stats.speed && (
                                      <span className="text-[10px] font-mono text-yellow-400 font-bold">
                                        +{eqItem.stats.speed} SPD
                                      </span>
                                    )}
                                    {eqItem.stats.jump && (
                                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                                        +{eqItem.stats.jump} JUMP
                                      </span>
                                    )}
                                    {eqItem.stats.range && (
                                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                                        +{eqItem.stats.range} RNG
                                      </span>
                                    )}
                                    {eqItem.stats.energyRegen && (
                                      <span className="text-[10px] font-mono text-purple-400 font-bold">
                                        +{eqItem.stats.energyRegen} NRG
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSlotPickerIndex(slotIdx)}
                                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 rounded-lg text-xs font-mono font-bold transition-colors"
                                >
                                  Swap
                                </button>
                                <button
                                  onClick={() => handleUnequip(slotIdx)}
                                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 rounded-lg transition-colors"
                                  title="Unequip"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <button
                            key={`slot-${slotIdx}`}
                            onClick={() => {
                              soundService.playClick();
                              setSlotPickerIndex(slotIdx);
                            }}
                            className="w-full p-3.5 border-2 border-dashed border-stone-800 hover:border-amber-400/60 rounded-2xl bg-stone-950/40 hover:bg-stone-950 flex items-center justify-between group transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono text-amber-400 bg-stone-900/60 border border-stone-800 group-hover:text-amber-300 group-hover:border-amber-400/40 transition-colors">
                                {slotCfg.icon}
                              </div>
                              <div className="text-left">
                                <span className="text-xs font-bold text-stone-300 group-hover:text-amber-300 font-display uppercase block">
                                  Empty {slotCfg.label} Slot
                                </span>
                                <span className="text-[10px] text-stone-500 group-hover:text-stone-400 font-mono">
                                  {slotCfg.desc}
                                </span>
                              </div>
                            </div>
                            <div className="px-3 py-1 bg-stone-900 group-hover:bg-amber-500 text-stone-400 group-hover:text-stone-950 rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1">
                              <Plus className="w-3.5 h-3.5" />
                              Equip {slotCfg.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Equipment Picker Drawer (Strictly Slot Type Filtered) */}
                <AnimatePresence>
                  {slotPickerIndex !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-amber-500/40 bg-stone-950 rounded-3xl p-5 shadow-2xl space-y-4"
                    >
                      {(() => {
                        const slotType = getSlotTypeByIndex(slotPickerIndex);
                        const slotCfg = SLOT_CONFIG[slotType];
                        return (
                          <>
                            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                              <div>
                                <h4 className="font-black text-amber-400 font-display uppercase text-sm flex items-center gap-2">
                                  <Plus className="w-4 h-4" />
                                  Select {slotCfg.label} ({slotCfg.icon}) for {selectedDraco}
                                </h4>
                                <p className="text-xs text-stone-400 font-mono mt-0.5">
                                  Showing unequipped {slotCfg.label} items in your Bag.
                                </p>
                              </div>
                              <button
                                onClick={() => setSlotPickerIndex(null)}
                                className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300"
                              >
                                Close
                              </button>
                            </div>

                            {availableEquipList.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                                {availableEquipList.map(({ item, count, available }) => {
                                  const rarityCfg = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common;
                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => handleEquip(item.id, slotPickerIndex)}
                                      className={`p-3 border rounded-xl bg-stone-900/90 hover:bg-stone-800 text-left flex items-center justify-between group transition-all ${rarityCfg.border}`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.icon || slotCfg.icon}</span>
                                        <div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-white font-display uppercase">
                                              {item.name}
                                            </span>
                                            <span
                                              className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold ${rarityCfg.bg} ${rarityCfg.text}`}
                                            >
                                              {rarityCfg.label}
                                            </span>
                                          </div>
                                          <div className="flex flex-wrap gap-1 mt-1 text-[10px] font-mono text-stone-300">
                                            {item.stats.attack ? <span className="text-red-400">+{item.stats.attack} ATK</span> : null}
                                            {item.stats.defense ? <span className="text-blue-400">+{item.stats.defense} DEF</span> : null}
                                            {item.stats.hp ? <span className="text-emerald-400">+{item.stats.hp} HP</span> : null}
                                            {item.stats.speed ? <span className="text-yellow-400">+{item.stats.speed} SPD</span> : null}
                                            {item.stats.jump ? <span className="text-cyan-400">+{item.stats.jump} JUMP</span> : null}
                                            {item.stats.range ? <span className="text-amber-400">+{item.stats.range} RNG</span> : null}
                                            {item.stats.energyRegen ? <span className="text-purple-400">+{item.stats.energyRegen} NRG</span> : null}
                                          </div>
                                        </div>
                                      </div>
                                      <span className="px-2 py-1 bg-amber-500 group-hover:bg-amber-400 text-stone-950 font-bold text-xs font-mono rounded-lg flex-shrink-0">
                                        Equip ({available})
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="p-6 text-center text-stone-500 font-mono text-xs">
                                No available {slotCfg.label} items in your bag. Craft or buy one in the Forge or Mystic Shop!
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB 3: MYSTIC SHOP                                             */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'shop' && (
              <motion.div
                key="shop-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-5"
              >
                {/* Shop Category Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  <button
                    onClick={() => setShopCategory('all')}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors whitespace-nowrap ${
                      shopCategory === 'all'
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    All Items
                  </button>
                  <button
                    onClick={() => setShopCategory('consumables')}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors whitespace-nowrap ${
                      shopCategory === 'consumables'
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    🧪 Consumables
                  </button>
                  <button
                    onClick={() => setShopCategory('weapon')}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors whitespace-nowrap ${
                      shopCategory === 'weapon'
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    ⚔️ Weapons
                  </button>
                  <button
                    onClick={() => setShopCategory('armor')}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors whitespace-nowrap ${
                      shopCategory === 'armor'
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    🛡️ Armor
                  </button>
                  <button
                    onClick={() => setShopCategory('boots')}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors whitespace-nowrap ${
                      shopCategory === 'boots'
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    👢 Boots
                  </button>
                  <button
                    onClick={() => setShopCategory('accessory')}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors whitespace-nowrap ${
                      shopCategory === 'accessory'
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    💍 Accessories
                  </button>
                  <button
                    onClick={() => setShopCategory('relic')}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-colors whitespace-nowrap ${
                      shopCategory === 'relic'
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    🔮 Relics
                  </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Consumables in Shop */}
                  {(shopCategory === 'all' || shopCategory === 'consumables') &&
                    CONSUMABLE_SHOP_ITEMS.map(item => {
                      const canAfford = coins >= item.cost;
                      return (
                        <div
                          key={item.id}
                          className="p-4 md:p-5 border border-stone-800 rounded-2xl flex flex-col justify-between bg-stone-950/90 shadow-xl"
                        >
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-3xl">{item.icon}</span>
                              <span className="font-mono font-bold text-amber-400 text-sm flex items-center gap-1 bg-stone-900 px-2.5 py-1 rounded-xl border border-stone-800">
                                <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                                {item.cost} Coins
                              </span>
                            </div>
                            <h3 className="font-black text-white text-base md:text-lg mt-3 uppercase font-display">
                              {item.name}
                            </h3>
                            <p className="text-xs text-stone-400 mt-1 leading-relaxed font-mono">
                              {item.description}
                            </p>
                          </div>
                          <button
                            onClick={() => handleBuy(item.id, item.cost)}
                            disabled={!canAfford}
                            className={`w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider font-display border transition-all ${
                              canAfford
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20'
                                : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? 'Purchase Item' : 'Insufficient Coins'}
                          </button>
                        </div>
                      );
                    })}

                  {/* Equipment Items in Shop */}
                  {ALL_EQUIPMENT.filter(item => {
                    if (shopCategory === 'all') return true;
                    if (shopCategory === 'consumables') return false;
                    return item.slot === shopCategory;
                  }).map(item => {
                    const recipe = getRecipeByResultId(item.id);
                    const autoBuyCalc = recipe
                      ? calculateRecipeAutoBuy(recipe, saveData.inventory, coins, equippedItemCounts)
                      : null;
                    const hasSmartCraft = autoBuyCalc && autoBuyCalc.ownedIngredientsCount > 0;
                    const finalPrice = hasSmartCraft ? autoBuyCalc.totalCost : item.cost;
                    const canAfford = coins >= finalPrice;
                    const rarityCfg = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 md:p-5 border rounded-2xl flex flex-col justify-between bg-stone-950/90 shadow-xl transition-all ${
                          hasSmartCraft ? 'border-amber-500/60 shadow-amber-950/30' : rarityCfg.border
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="text-3xl">{item.icon}</span>
                              <span
                                className={`px-2 py-0.5 text-[10px] font-black uppercase font-mono rounded-md ${rarityCfg.bg} ${rarityCfg.text} border ${rarityCfg.border}`}
                              >
                                {rarityCfg.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400 text-sm bg-stone-900 px-2.5 py-1 rounded-xl border border-stone-800">
                              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span>{finalPrice}</span>
                              {hasSmartCraft && item.cost !== finalPrice && (
                                <span className="text-[10px] text-stone-500 line-through ml-1">{item.cost}</span>
                              )}
                            </div>
                          </div>

                          {hasSmartCraft && (
                            <div className="mt-2 px-2 py-1 bg-amber-950/60 border border-amber-700/60 rounded-lg flex items-center justify-between text-[10px] font-mono text-amber-300">
                              <span>✨ Uses {autoBuyCalc.ownedIngredientsCount} owned mat(s)</span>
                              <span className="font-bold text-amber-400">
                                {item.cost > autoBuyCalc.totalCost ? `Save ${item.cost - autoBuyCalc.totalCost}🪙` : 'Smart Forge'}
                              </span>
                            </div>
                          )}

                          <h3 className="font-black text-white text-base mt-2 font-display uppercase">
                            {item.name}
                          </h3>
                          <p className="text-xs text-stone-400 mt-1 leading-relaxed font-mono">{item.description}</p>

                          {/* Stat Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {item.stats.attack ? (
                              <span className="px-2 py-0.5 bg-red-950/60 border border-red-800 text-red-300 rounded text-[10px] font-mono font-bold">
                                +{item.stats.attack} ATK
                              </span>
                            ) : null}
                            {item.stats.defense ? (
                              <span className="px-2 py-0.5 bg-blue-950/60 border border-blue-800 text-blue-300 rounded text-[10px] font-mono font-bold">
                                +{item.stats.defense} DEF
                              </span>
                            ) : null}
                            {item.stats.hp ? (
                              <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded text-[10px] font-mono font-bold">
                                +{item.stats.hp} HP
                              </span>
                            ) : null}
                            {item.stats.speed ? (
                              <span className="px-2 py-0.5 bg-yellow-950/60 border border-yellow-800 text-yellow-300 rounded text-[10px] font-mono font-bold">
                                +{item.stats.speed} SPD
                              </span>
                            ) : null}
                            {item.stats.jump ? (
                              <span className="px-2 py-0.5 bg-cyan-950/60 border border-cyan-800 text-cyan-300 rounded text-[10px] font-mono font-bold">
                                +{item.stats.jump} JUMP
                              </span>
                            ) : null}
                            {item.stats.range ? (
                              <span className="px-2 py-0.5 bg-amber-950/60 border border-amber-800 text-amber-300 rounded text-[10px] font-mono font-bold">
                                +{item.stats.range} RNG
                              </span>
                            ) : null}
                            {item.stats.energyRegen ? (
                              <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-800 text-purple-300 rounded text-[10px] font-mono font-bold">
                                +{item.stats.energyRegen} NRG
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <button
                          onClick={() => handleBuy(item.id, finalPrice)}
                          disabled={!canAfford}
                          className={`w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider font-display border transition-all ${
                            canAfford
                              ? hasSmartCraft
                                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20'
                              : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
                          }`}
                        >
                          {canAfford
                            ? hasSmartCraft
                              ? `Smart Craft (${finalPrice}🪙)`
                              : `Purchase Gear (${finalPrice}🪙)`
                            : 'Insufficient Coins'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex justify-between items-center px-6 md:px-8 py-3.5 bg-stone-950 border-t border-stone-800 flex-shrink-0">
          <span className="text-xs text-stone-500 font-mono hidden md:inline">
            Version 0.4.0 • 5 Equipment Slots per Draco
          </span>
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="px-6 py-2 text-xs font-black uppercase tracking-wider font-display bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-all border border-stone-700 ml-auto"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InventoryModal;
