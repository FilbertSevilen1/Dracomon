import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SaveData, PlayerStats } from '../types/game';
import { Sparkles, Coins, ShoppingBag, Heart, ShieldAlert } from 'lucide-react';
import { soundService } from '../services/sound';

interface InventoryModalProps {
  saveData: SaveData;
  onUsePotion: (dracoName: string) => boolean;
  onUseUpgradeStone: (dracoName: string, stat: keyof PlayerStats) => boolean;
  onBuyItem: (itemId: 'potion' | 'upgrade_stone', cost: number) => boolean;
  onClose: () => void;
}

const SHOP_ITEMS = [
  {
    id: 'potion',
    name: 'Healing Potion',
    description: 'Restores 15 Health immediately to your active Draco.',
    cost: 15,
    icon: '❤️'
  },
  {
    id: 'upgrade_stone',
    name: 'Upgrade Stone',
    description: 'Consume to permanently increase any chosen stat of your active Draco by +1.',
    cost: 50,
    icon: '🔮'
  }
];

export const InventoryModal: React.FC<InventoryModalProps> = ({
  saveData,
  onUsePotion,
  onUseUpgradeStone,
  onBuyItem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'shop'>('inventory');
  const [stoneUpgrading, setStoneUpgrading] = useState(false);

  const selectedDraco = saveData.selectedDraco;
  const dracoDetails = saveData.dracos[selectedDraco];
  const coins = saveData.player.coins;

  // Inventory quantities
  const potionItem = saveData.inventory.find(i => i.id === 'potion');
  const potionQty = potionItem ? potionItem.quantity : 0;

  const stoneItem = saveData.inventory.find(i => i.id === 'upgrade_stone');
  const stoneQty = stoneItem ? stoneItem.quantity : 0;

  const handleUsePotion = () => {
    if (potionQty <= 0) return;
    const success = onUsePotion(selectedDraco);
    if (success) {
      // Confetti light spray
    } else {
      // HP is already maxed or failed
      soundService.playClick();
    }
  };

  const handleUseUpgradeStone = (stat: keyof PlayerStats) => {
    if (stoneQty <= 0) return;
    const success = onUseUpgradeStone(selectedDraco, stat);
    if (success) {
      setStoneUpgrading(false);
    }
  };

  const handleBuy = (itemId: 'potion' | 'upgrade_stone', cost: number) => {
    onBuyItem(itemId, cost);
  };

  const statLabels: { key: keyof PlayerStats; label: string; desc: string }[] = [
    { key: 'hp', label: 'Hit Points (HP)', desc: 'Increases max life pool.' },
    { key: 'attack', label: 'Attack Power', desc: 'Increases raw damage output.' },
    { key: 'defense', label: 'Defense Rating', desc: 'Reduces damage taken from impacts.' },
    { key: 'speed', label: 'Movement Speed', desc: 'Run faster across platforms.' },
    { key: 'jump', label: 'Jump Height', desc: 'Allows jumping higher to clear spikes.' },
    { key: 'range', label: 'Ability Range', desc: 'Increases melee hit box or arrows travel.' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="w-full max-w-2xl overflow-hidden border bg-white/95 border-stone-200 rounded-3xl shadow-2xl backdrop-blur-xl"
      >
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-stone-100">
          <div className="flex items-center gap-6">
            <button
              onClick={() => { soundService.playClick(); setActiveTab('inventory'); setStoneUpgrading(false); }}
              className={`text-xl font-bold tracking-tight pb-1 border-b-2 font-display transition-all ${
                activeTab === 'inventory'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              Bag
            </button>
            <button
              onClick={() => { soundService.playClick(); setActiveTab('shop'); }}
              className={`text-xl font-bold tracking-tight pb-1 border-b-2 font-display transition-all ${
                activeTab === 'shop'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              Mystic Shop
            </button>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-full border border-stone-100 shadow-sm text-sm">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-mono font-bold text-stone-700">{coins} Coins</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 min-h-[320px]">
          <AnimatePresence mode="wait">
            {activeTab === 'inventory' ? (
              <motion.div
                key="inventory-panel"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                {stoneUpgrading ? (
                  // UPGRADE PANEL
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-purple-50 border border-purple-100 p-4 rounded-2xl">
                      <div>
                        <h4 className="font-bold text-purple-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                          Apply Upgrade Stone
                        </h4>
                        <p className="text-xs text-purple-600">Select which stat of your {selectedDraco} to upgrade permanently by +1.</p>
                      </div>
                      <button
                        onClick={() => { soundService.playClick(); setStoneUpgrading(false); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 bg-white hover:bg-purple-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {statLabels.map(({ key, label, desc }) => {
                        const currentVal = dracoDetails ? (dracoDetails as any)[key] || 0 : 0;
                        const isCapped = (key === 'speed' && currentVal >= 20) || (key === 'jump' && currentVal >= 14);

                        return (
                          <button
                            key={key}
                            disabled={isCapped}
                            onClick={() => handleUseUpgradeStone(key)}
                            className={`flex flex-col justify-between p-4 border rounded-xl text-left transition-all group ${
                              isCapped
                                ? 'opacity-50 cursor-not-allowed border-stone-200 bg-stone-100'
                                : 'border-stone-200 bg-white hover:border-purple-500 hover:bg-purple-50/20 cursor-pointer'
                            }`}
                          >
                            <div>
                              <span className={`text-xs font-bold block ${isCapped ? 'text-stone-400' : 'text-stone-800 group-hover:text-purple-700'}`}>{label}</span>
                              <span className="text-[10px] text-stone-400 block mt-0.5">{desc}</span>
                            </div>
                            {isCapped ? (
                              <span className="text-xs font-mono font-bold mt-2 text-stone-400">
                                MAX CAPPED ({key === 'speed' ? '20' : '14'})
                              </span>
                            ) : (
                              <span className="text-xs font-mono font-bold mt-2 text-stone-500">
                                Current: <span className="text-stone-950 font-bold">{currentVal}</span> → <span className="text-purple-600 font-bold">{currentVal + 1}</span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // GENERAL BAG DISPLAY
                  <div className="grid grid-cols-2 gap-4">
                    {/* Healing Potion Card */}
                    <div className="p-5 border border-stone-200 rounded-2xl flex flex-col justify-between bg-white shadow-sm">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-3xl">❤️</span>
                          <span className="px-2 py-0.5 text-xs font-bold font-mono bg-stone-100 border text-stone-600 rounded">
                            Qty: {potionQty}
                          </span>
                        </div>
                        <h3 className="font-bold text-stone-800 text-lg mt-3">Healing Potion</h3>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          Restores 15 HP to your active Draco. Useful for quick recover between stages or during levels.
                        </p>
                      </div>
                      <button
                        onClick={handleUsePotion}
                        disabled={potionQty <= 0}
                        className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                          potionQty > 0
                            ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-sm'
                            : 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
                        }`}
                      >
                        Drink Potion
                      </button>
                    </div>

                    {/* Upgrade Stone Card */}
                    <div className="p-5 border border-stone-200 rounded-2xl flex flex-col justify-between bg-white shadow-sm">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-3xl">🔮</span>
                          <span className="px-2 py-0.5 text-xs font-bold font-mono bg-stone-100 border text-stone-600 rounded">
                            Qty: {stoneQty}
                          </span>
                        </div>
                        <h3 className="font-bold text-stone-800 text-lg mt-3">Upgrade Stone</h3>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          Permanently increases a chosen stat of your selected Draco (HP, Attack, Defense, Speed, Jump, Range) by +1.
                        </p>
                      </div>
                      <button
                        onClick={() => { soundService.playClick(); setStoneUpgrading(true); }}
                        disabled={stoneQty <= 0}
                        className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                          stoneQty > 0
                            ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-sm'
                            : 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
                        }`}
                      >
                        Synthesize Stat
                      </button>
                    </div>

                    {potionQty === 0 && stoneQty === 0 && (
                      <div className="col-span-2 flex flex-col items-center justify-center p-12 text-center">
                        <ShoppingBag className="w-10 h-10 text-stone-300 mb-2" />
                        <h4 className="font-bold text-stone-700">Your Bag is Empty</h4>
                        <p className="text-xs text-stone-400 mt-1">Visit the Mystic Shop tab to trade coins for equipment.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              // SHOP TAB
              <motion.div
                key="shop-panel"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="grid grid-cols-2 gap-4"
              >
                {SHOP_ITEMS.map((item) => {
                  const canAfford = coins >= item.cost;
                  return (
                    <div
                      key={item.id}
                      className="p-5 border border-stone-200 rounded-2xl flex flex-col justify-between bg-white shadow-sm"
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-3xl">{item.icon}</span>
                          <span className="font-mono font-bold text-stone-700 text-sm flex items-center gap-1">
                            <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
                            {item.cost}
                          </span>
                        </div>
                        <h3 className="font-bold text-stone-800 text-lg mt-3">{item.name}</h3>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBuy(item.id as any, item.cost)}
                        disabled={!canAfford}
                        className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-sm'
                            : 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Purchase Item' : 'Insufficient Coins'}
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-8 py-4 bg-stone-50 border-t border-stone-100">
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="px-6 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            Close Bag
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default InventoryModal;
