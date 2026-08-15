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
    description: 'Consume to permanently increase any chosen stat of your active Draco by +0.1.',
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

  const potionItem = saveData.inventory.find(i => i.id === 'potion');
  const potionQty = potionItem ? potionItem.quantity : 0;

  const stoneItem = saveData.inventory.find(i => i.id === 'upgrade_stone');
  const stoneQty = stoneItem ? stoneItem.quantity : 0;

  const handleUsePotion = () => {
    if (potionQty <= 0) return;
    const success = onUsePotion(selectedDraco);
    if (success) {
    } else {
      soundService.playClick();
    }
  };

  const handleUseUpgradeStone = (stat: keyof PlayerStats) => {
    if (stoneQty <= 0) return;
    const success = onUseUpgradeStone(selectedDraco, stat);
    if (success && stoneQty - 1 <= 0) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="w-full max-w-2xl overflow-hidden border bg-stone-900/95 border-stone-800 rounded-3xl shadow-2xl backdrop-blur-xl text-stone-100"
      >
        {/* MODAL NAVIGATION TAB HEADER */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-stone-800 bg-stone-950/50">
          <div className="flex items-center gap-6">
            <button
              onClick={() => { soundService.playClick(); setActiveTab('inventory'); setStoneUpgrading(false); }}
              className={`text-xl font-black uppercase tracking-wider pb-1 border-b-2 font-display transition-all ${
                activeTab === 'inventory'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Bag
            </button>
            <button
              onClick={() => { soundService.playClick(); setActiveTab('shop'); }}
              className={`text-xl font-black uppercase tracking-wider pb-1 border-b-2 font-display transition-all ${
                activeTab === 'shop'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Mystic Shop
            </button>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-stone-950 rounded-full border border-stone-800 shadow-inner text-sm font-mono">
            <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-amber-300">{coins} Coins</span>
          </div>
        </div>

        {/* MODAL MAIN CONTENT BODY */}
        <div className="p-8 min-h-[320px] bg-stone-900/60">
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
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-purple-950/40 border border-purple-800/80 p-4 rounded-2xl">
                      <div>
                        <h4 className="font-black text-purple-300 flex items-center gap-1.5 font-display uppercase">
                          <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                          Apply Upgrade Stone
                        </h4>
                        <p className="text-xs text-purple-200/80 font-mono mt-0.5">Select which stat of your {selectedDraco} to upgrade permanently by +0.1.</p>
                      </div>
                      <button
                        onClick={() => { soundService.playClick(); setStoneUpgrading(false); }}
                        className="text-xs font-black uppercase font-display px-3 py-1.5 rounded-xl border border-purple-700 text-purple-300 bg-purple-950 hover:bg-purple-900 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {statLabels.map(({ key, label, desc }) => {
                        const rawVal = dracoDetails ? (dracoDetails as any)[key] || 0 : 0;
                        const currentVal = Math.round(rawVal * 10) / 10;
                        const isCapped = (key === 'speed' && currentVal >= 20) || (key === 'jump' && currentVal >= 14);

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
                              <span className={`text-xs font-bold block font-display uppercase ${isCapped ? 'text-stone-500' : 'text-stone-200 group-hover:text-purple-300'}`}>{label}</span>
                              <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">{desc}</span>
                            </div>
                            {isCapped ? (
                              <span className="text-xs font-mono font-bold mt-2 text-stone-500">
                                MAX CAPPED ({key === 'speed' ? '20' : '14'})
                              </span>
                            ) : (
                              <span className="text-xs font-mono font-bold mt-2 text-stone-400">
                                Current: <span className="text-white font-bold">{currentVal}</span> → <span className="text-purple-400 font-bold">{Math.round((currentVal + 0.1) * 10) / 10}</span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {/* HEALING POTION CARD */}
                    <div className="p-5 border border-stone-800 rounded-2xl flex flex-col justify-between bg-stone-950/90 shadow-xl">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-3xl">❤️</span>
                          <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-stone-900 border border-stone-800 text-rose-400 rounded-lg">
                            Qty: {potionQty}
                          </span>
                        </div>
                        <h3 className="font-black text-white text-lg mt-3 uppercase font-display">Healing Potion</h3>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed font-mono">
                          Restores 15 HP to your active Draco. Useful for quick recovery between stages or during levels.
                        </p>
                      </div>
                      <button
                        onClick={handleUsePotion}
                        disabled={potionQty <= 0}
                        className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider font-display border transition-all ${
                          potionQty > 0
                            ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-950/50'
                            : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
                        }`}
                      >
                        Drink Potion
                      </button>
                    </div>

                    {/* UPGRADE STONE CARD */}
                    <div className="p-5 border border-stone-800 rounded-2xl flex flex-col justify-between bg-stone-950/90 shadow-xl">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-3xl">🔮</span>
                          <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-stone-900 border border-stone-800 text-purple-400 rounded-lg">
                            Qty: {stoneQty}
                          </span>
                        </div>
                        <h3 className="font-black text-white text-lg mt-3 uppercase font-display">Upgrade Stone</h3>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed font-mono">
                          Permanently increases a chosen stat of your selected Draco (HP, Attack, Defense, Speed, Jump, Range) by +0.1.
                        </p>
                      </div>
                      <button
                        onClick={() => { soundService.playClick(); setStoneUpgrading(true); }}
                        disabled={stoneQty <= 0}
                        className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider font-display border transition-all ${
                          stoneQty > 0
                            ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-950/50'
                            : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
                        }`}
                      >
                        Synthesize Stat
                      </button>
                    </div>

                    {potionQty === 0 && stoneQty === 0 && (
                      <div className="col-span-2 flex flex-col items-center justify-center p-12 text-center">
                        <ShoppingBag className="w-10 h-10 text-stone-600 mb-2" />
                        <h4 className="font-black text-stone-200 uppercase font-display">Your Bag is Empty</h4>
                        <p className="text-xs text-stone-500 mt-1 font-mono">Visit the Mystic Shop tab to trade coins for equipment.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
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
                      className="p-5 border border-stone-800 rounded-2xl flex flex-col justify-between bg-stone-950/90 shadow-xl"
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-3xl">{item.icon}</span>
                          <span className="font-mono font-bold text-amber-400 text-sm flex items-center gap-1">
                            <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                            {item.cost}
                          </span>
                        </div>
                        <h3 className="font-black text-white text-lg mt-3 uppercase font-display">{item.name}</h3>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed font-mono">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBuy(item.id as any, item.cost)}
                        disabled={!canAfford}
                        className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider font-display border transition-all ${
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex justify-end px-8 py-4 bg-stone-950 border-t border-stone-800">
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-wider font-display bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-all border border-stone-700"
          >
            Close Bag
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default InventoryModal;
