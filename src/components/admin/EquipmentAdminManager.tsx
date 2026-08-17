'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Zap,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Save,
  Download,
  Upload,
  RotateCcw,
  Search,
  Check,
  AlertTriangle,
  Hammer,
  Sparkles,
  Coins,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';
import {
  EquipmentItem,
  EquipmentSlot,
  EquipmentRarity,
  RARITY_CONFIG,
  SLOT_CONFIG
} from '../../data/equipment';
import { CraftingRecipe, CraftingIngredient } from '../../data/crafting';
import { equipmentAdminService } from '../../services/equipmentAdminService';
import { soundService } from '../../services/sound';

export const EquipmentAdminManager: React.FC = () => {
  // Data State
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [craftingList, setCraftingList] = useState<CraftingRecipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Filtering State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  // Modal / Editor State
  const [showEditorModal, setShowEditorModal] = useState<boolean>(false);
  const [isNewItem, setIsNewItem] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem>({
    id: '',
    name: '',
    slot: 'weapon',
    rarity: 'common',
    description: '',
    icon: '⚔️',
    cost: 50,
    minWorld: 1,
    dropWeight: 30,
    stats: {}
  });

  // Recipe toggle & form state
  const [hasRecipe, setHasRecipe] = useState<boolean>(false);
  const [recipeFee, setRecipeFee] = useState<number>(30);
  const [recipeIngredients, setRecipeIngredients] = useState<CraftingIngredient[]>([
    { itemId: 'iron_sword', quantity: 2 }
  ]);
  const [recipeDesc, setRecipeDesc] = useState<string>('');

  // Delete Confirmation State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<EquipmentItem | null>(null);

  // Load initial data
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await equipmentAdminService.loadData();
      setEquipmentList(data.equipment);
      setCraftingList(data.craftingRecipes);
      setIsLoading(false);
    };
    load();
  }, []);

  // Filtered Equipment List
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSlot = selectedSlot === 'all' || item.slot === selectedSlot;
      const matchRarity = selectedRarity === 'all' || item.rarity === selectedRarity;

      return matchSearch && matchSlot && matchRarity;
    });
  }, [equipmentList, searchQuery, selectedSlot, selectedRarity]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsNewItem(true);
    const newId = `gear_${Date.now().toString().slice(-4)}`;
    setEditingItem({
      id: newId,
      name: 'New Crafted Gear',
      slot: 'weapon',
      rarity: 'rare',
      description: 'A finely forged weapon that grants combat enhancements.',
      icon: '⚔️',
      cost: 75,
      minWorld: 1,
      dropWeight: 25,
      stats: { attack: 3, hp: 5 }
    });
    setHasRecipe(false);
    setRecipeFee(30);
    setRecipeIngredients([{ itemId: 'iron_sword', quantity: 2 }]);
    setRecipeDesc('');
    setShowEditorModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: EquipmentItem) => {
    setIsNewItem(false);
    setEditingItem({ ...item, stats: { ...item.stats } });

    // Check if recipe exists for this item
    const existingRecipe = craftingList.find(r => r.resultItemId === item.id);
    if (existingRecipe) {
      setHasRecipe(true);
      setRecipeFee(existingRecipe.requiredCoins || 30);
      setRecipeIngredients(
        existingRecipe.ingredients ? existingRecipe.ingredients.map(ing => ({ ...ing })) : []
      );
      setRecipeDesc(existingRecipe.description || '');
    } else {
      setHasRecipe(false);
      setRecipeFee(Math.floor(item.cost * 0.45));
      setRecipeIngredients([{ itemId: 'iron_sword', quantity: 2 }]);
      setRecipeDesc('');
    }

    setShowEditorModal(true);
  };

  // Duplicate Item
  const handleDuplicateItem = (item: EquipmentItem) => {
    const newId = `${item.id}_copy_${Date.now().toString().slice(-3)}`;
    const duplicated: EquipmentItem = {
      ...item,
      id: newId,
      name: `${item.name} (Copy)`,
      stats: { ...item.stats }
    };
    setEquipmentList(prev => [...prev, duplicated]);
    setSuccessMsg(`📋 Duplicated "${item.name}" as "${duplicated.name}"!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Save Modal Item
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.id.trim() || !editingItem.name.trim()) {
      alert('Please provide a valid ID and Name!');
      return;
    }

    // Clean stats (remove 0 values or empty)
    const cleanedStats: Record<string, number> = {};
    Object.entries(editingItem.stats || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && !isNaN(Number(v)) && Number(v) > 0) {
        cleanedStats[k] = Number(v);
      }
    });

    const finalItem: EquipmentItem = {
      ...editingItem,
      id: editingItem.id.trim().toLowerCase().replace(/\s+/g, '_'),
      stats: cleanedStats
    };

    // Update equipment list
    let updatedEquipment: EquipmentItem[];
    if (isNewItem) {
      if (equipmentList.some(i => i.id === finalItem.id)) {
        alert(`An item with ID "${finalItem.id}" already exists! Please use a unique ID.`);
        return;
      }
      updatedEquipment = [...equipmentList, finalItem];
    } else {
      updatedEquipment = equipmentList.map(i => (i.id === finalItem.id ? finalItem : i));
    }
    setEquipmentList(updatedEquipment);

    // Update Crafting Recipes
    let updatedCrafting = [...craftingList];
    if (hasRecipe) {
      const recipeId = `craft_${finalItem.id}`;
      const newRecipe: CraftingRecipe = {
        id: recipeId,
        name: `Forge ${finalItem.name}`,
        category: finalItem.slot,
        resultItemId: finalItem.id,
        resultQuantity: 1,
        requiredCoins: Number(recipeFee) || 30,
        rarity: finalItem.rarity,
        icon: finalItem.icon,
        description: recipeDesc || `Forge ${finalItem.name} using base materials.`,
        ingredients: recipeIngredients.filter(ing => ing.itemId && ing.quantity > 0)
      };

      const existingIdx = updatedCrafting.findIndex(r => r.resultItemId === finalItem.id);
      if (existingIdx !== -1) {
        updatedCrafting[existingIdx] = newRecipe;
      } else {
        updatedCrafting.push(newRecipe);
      }
    } else {
      // Remove any recipe if toggled off
      updatedCrafting = updatedCrafting.filter(r => r.resultItemId !== finalItem.id);
    }
    setCraftingList(updatedCrafting);

    setShowEditorModal(false);
    setSuccessMsg(`✓ Saved "${finalItem.name}" to staging.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Delete Item
  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    const targetId = deleteConfirmItem.id;
    setEquipmentList(prev => prev.filter(i => i.id !== targetId));
    setCraftingList(prev => prev.filter(r => r.resultItemId !== targetId));
    setDeleteConfirmItem(null);
    setSuccessMsg(`🗑️ Deleted equipment "${deleteConfirmItem.name}".`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Deploy to Server JSON files
  const handleDeployToRepo = async () => {
    setIsDeploying(true);
    const result = await equipmentAdminService.saveToRepo(equipmentList, craftingList);
    setIsDeploying(false);
    if (result.success) {
      setSuccessMsg('🚀 Successfully updated equipment.json and crafting.json on disk!');
    } else {
      setSuccessMsg(`⚠️ Deploy failed: ${result.error || 'Exporting JSON instead...'}`);
      equipmentAdminService.downloadJson(equipmentList, craftingList);
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Export JSON backup
  const handleExportJson = () => {
    equipmentAdminService.downloadJson(equipmentList, craftingList);
    setSuccessMsg('📥 Downloaded equipment.json payload file!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-100 overflow-hidden text-stone-900">
      {/* Top Action Header */}
      <div className="p-4 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 border border-amber-300 text-amber-800 rounded-xl">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-stone-900 uppercase font-display flex items-center gap-2">
              Equipment &amp; Forge Manager
              <span className="px-2 py-0.5 bg-stone-900 text-amber-400 font-mono text-[10px] rounded-full font-bold">
                {equipmentList.length} Items
              </span>
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              CRUD base stats, costs, rarities, drops &amp; crafting recipes in equipment.json
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black uppercase font-display flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
          </button>

          <button
            onClick={handleDeployToRepo}
            disabled={isDeploying}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase font-display flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            title="Save and deploy directly into src/data/equipment.json and src/data/crafting.json"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isDeploying ? 'Saving JSON...' : '🚀 Save to JSON'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-bold flex items-center gap-1 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" /> Export
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="px-6 py-2 bg-emerald-100 border-b border-emerald-300 text-emerald-900 text-xs font-mono font-bold flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search equipment by name, ID, or lore..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 font-mono focus:outline-none focus:border-amber-500 transition-all shadow-xs"
          />
        </div>

        {/* Slot Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Slots' },
            { id: 'weapon', label: '⚔️ Weapons' },
            { id: 'armor', label: '🛡️ Armor' },
            { id: 'boots', label: '👢 Boots' },
            { id: 'accessory', label: '💍 Ring/Accessory' },
            { id: 'relic', label: '🔮 Relics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedSlot(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
                selectedSlot === tab.id
                  ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rarity Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-stone-400 font-bold">Rarity:</span>
          <select
            value={selectedRarity}
            onChange={e => setSelectedRarity(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 font-mono font-bold focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Rarities</option>
            <option value="common">Common (Grey)</option>
            <option value="rare">Rare (Sky Blue)</option>
            <option value="epic">Epic (Purple)</option>
            <option value="legendary">Legendary (Amber)</option>
            <option value="mythic">Mythic (Rose)</option>
          </select>
        </div>
      </div>

      {/* Equipment Items Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
        {filteredEquipment.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-stone-400 font-mono">
            <span className="text-3xl">⚔️</span>
            <p className="text-sm font-bold">No equipment items found</p>
            <p className="text-xs text-stone-500">Try adjusting your search query or slot filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEquipment.map(item => {
              const rarityCfg = RARITY_CONFIG[item.rarity as EquipmentRarity] || RARITY_CONFIG.common;
              const recipe = craftingList.find(r => r.resultItemId === item.id);

              return (
                <motion.div
                  layout
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Header: Icon, Name, Slot & Rarity */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0"
                          style={{
                            backgroundColor: '#0f172a',
                            border: `2px solid ${rarityCfg.color}`
                          }}
                        >
                          <span>{item.icon || '⚔️'}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black text-stone-900 font-display leading-tight">{item.name}</h4>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px]">
                            <span
                              className="px-2 py-0.5 rounded font-black uppercase"
                              style={{
                                backgroundColor: rarityCfg.bg,
                                color: rarityCfg.color,
                                border: `1px solid ${rarityCfg.border}`
                              }}
                            >
                              {rarityCfg.label}
                            </span>
                            <span className="text-stone-500 uppercase font-bold">• {item.slot}</span>
                            <span className="text-amber-600 font-black">• {item.cost}🪙</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        ID: {item.id}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Stats Breakdown */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.stats && Object.entries(item.stats).map(([k, v]) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 bg-stone-900 border border-stone-800 text-emerald-400 text-[10px] font-mono font-bold rounded-lg"
                        >
                          +{v} {k.toUpperCase()}
                        </span>
                      ))}
                      {(!item.stats || Object.keys(item.stats).length === 0) && (
                        <span className="text-[10px] font-mono text-stone-400 italic">No base stats assigned</span>
                      )}
                    </div>

                    {/* Crafting Recipe Indicator */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] font-mono">
                      {recipe ? (
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1">
                              <Hammer className="w-3.5 h-3.5 text-amber-700" />
                              <span>Crafting Recipe</span>
                            </span>
                            <span className="text-amber-800">Fee: {recipe.requiredCoins}🪙</span>
                          </div>
                          <div className="text-[10px] text-stone-600 flex flex-wrap gap-1">
                            {recipe.ingredients.map(ing => (
                              <span key={ing.itemId} className="px-1.5 py-0.5 bg-white rounded border border-stone-200">
                                {ing.quantity}x {ing.itemId}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-stone-400 text-[10px] flex items-center gap-1">
                          <span>🛒 Direct Shop purchase only</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div className="text-[10px] font-mono text-stone-400">
                      <span>Drop: W{item.minWorld || 1}+ (Wt: {item.dropWeight || 10})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDuplicateItem(item)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs transition-colors"
                        title="Duplicate this item"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-900 border border-stone-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT EQUIPMENT MODAL */}
      <AnimatePresence>
        {showEditorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white border border-stone-300 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-5 text-stone-900"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                    <Hammer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-wider font-display">
                      {isNewItem ? 'Create New Equipment' : `Edit: ${editingItem.name}`}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      Configure base stats, attributes, and linked crafting recipe
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditorModal(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4">
                {/* ID & Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">
                      Item ID (Unique Key)
                    </label>
                    <input
                      type="text"
                      disabled={!isNewItem}
                      value={editingItem.id}
                      onChange={e => setEditingItem({ ...editingItem, id: e.target.value })}
                      placeholder="e.g. frost_scythe"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-amber-500 disabled:opacity-60"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">
                      Item Display Name
                    </label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                      placeholder="e.g. Frost Scythe"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Slot, Rarity, Icon, Cost */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">Slot</label>
                    <select
                      value={editingItem.slot}
                      onChange={e => setEditingItem({ ...editingItem, slot: e.target.value as EquipmentSlot })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="weapon">⚔️ Weapon</option>
                      <option value="armor">🛡️ Armor</option>
                      <option value="boots">👢 Boots</option>
                      <option value="accessory">💍 Accessory</option>
                      <option value="relic">🔮 Relic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">Rarity</label>
                    <select
                      value={editingItem.rarity}
                      onChange={e => setEditingItem({ ...editingItem, rarity: e.target.value as EquipmentRarity })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="common">Common</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Epic</option>
                      <option value="legendary">Legendary</option>
                      <option value="mythic">Mythic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">Icon (Emoji)</label>
                    <input
                      type="text"
                      value={editingItem.icon}
                      onChange={e => setEditingItem({ ...editingItem, icon: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-center text-base focus:outline-none focus:border-amber-500"
                      maxLength={4}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">Cost (🪙)</label>
                    <input
                      type="number"
                      value={editingItem.cost}
                      onChange={e => setEditingItem({ ...editingItem, cost: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                      min={1}
                    />
                  </div>
                </div>

                {/* Min World & Drop Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">
                      Min Drop World ID
                    </label>
                    <input
                      type="number"
                      value={editingItem.minWorld}
                      onChange={e => setEditingItem({ ...editingItem, minWorld: Number(e.target.value) || 1 })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                      min={1}
                      max={20}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">
                      Drop Pool Weight (1-50)
                    </label>
                    <input
                      type="number"
                      value={editingItem.dropWeight}
                      onChange={e => setEditingItem({ ...editingItem, dropWeight: Number(e.target.value) || 10 })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                      min={1}
                      max={100}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">
                    Description &amp; Lore
                  </label>
                  <textarea
                    value={editingItem.description}
                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-amber-500 font-mono"
                    placeholder="Lore description of this equipment item..."
                  />
                </div>

                {/* STATS BOOSTS BUILDER */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 font-display flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Stat Bonuses Provided by this Item</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">⚔️ Attack (+)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={editingItem.stats?.attack || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            stats: { ...editingItem.stats, attack: e.target.value ? Number(e.target.value) : undefined }
                          })
                        }
                        placeholder="0"
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">🛡️ Defense (+)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={editingItem.stats?.defense || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            stats: { ...editingItem.stats, defense: e.target.value ? Number(e.target.value) : undefined }
                          })
                        }
                        placeholder="0"
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">❤️ HP (+)</label>
                      <input
                        type="number"
                        value={editingItem.stats?.hp || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            stats: { ...editingItem.stats, hp: e.target.value ? Number(e.target.value) : undefined }
                          })
                        }
                        placeholder="0"
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">👟 Speed (+)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingItem.stats?.speed || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            stats: { ...editingItem.stats, speed: e.target.value ? Number(e.target.value) : undefined }
                          })
                        }
                        placeholder="0.0"
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">🥾 Jump (+)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingItem.stats?.jump || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            stats: { ...editingItem.stats, jump: e.target.value ? Number(e.target.value) : undefined }
                          })
                        }
                        placeholder="0.0"
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">🎯 Range (+)</label>
                      <input
                        type="number"
                        value={editingItem.stats?.range || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            stats: { ...editingItem.stats, range: e.target.value ? Number(e.target.value) : undefined }
                          })
                        }
                        placeholder="0"
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase">⚡ Energy Regen (+)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingItem.stats?.energyRegen || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            stats: {
                              ...editingItem.stats,
                              energyRegen: e.target.value ? Number(e.target.value) : undefined
                            }
                          })
                        }
                        placeholder="0.0"
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* CRAFTING RECIPE BUILDER */}
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasRecipe}
                        onChange={e => setHasRecipe(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded"
                      />
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900 font-display flex items-center gap-1.5">
                        <Hammer className="w-4 h-4 text-amber-700" />
                        <span>Enable Crafting / Forging Recipe</span>
                      </span>
                    </label>
                  </div>

                  {hasRecipe && (
                    <div className="space-y-3 pt-2 border-t border-amber-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-amber-900 uppercase mb-1">
                            Forging Fee (Coins 🪙)
                          </label>
                          <input
                            type="number"
                            value={recipeFee}
                            onChange={e => setRecipeFee(Number(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                            min={0}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold text-amber-900 uppercase mb-1">
                            Recipe Summary Lore
                          </label>
                          <input
                            type="text"
                            value={recipeDesc}
                            onChange={e => setRecipeDesc(e.target.value)}
                            placeholder="e.g. Smelt 2 Iron Longswords..."
                            className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      {/* Ingredients List */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-900">
                          <span>Required Ingredients:</span>
                          <button
                            type="button"
                            onClick={() =>
                              setRecipeIngredients(prev => [...prev, { itemId: 'upgrade_stone', quantity: 1 }])
                            }
                            className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded text-[10px] font-bold"
                          >
                            + Add Ingredient
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          {recipeIngredients.map((ing, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-amber-200">
                              <select
                                value={ing.itemId}
                                onChange={e => {
                                  const updated = [...recipeIngredients];
                                  updated[idx].itemId = e.target.value;
                                  setRecipeIngredients(updated);
                                }}
                                className="flex-1 px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono font-bold"
                              >
                                <optgroup label="Consumables & Materials">
                                  <option value="upgrade_stone">🔮 Upgrade Stone (80🪙)</option>
                                  <option value="potion">🧪 Healing Potion (15🪙)</option>
                                  <option value="mana_crystal">💎 Arcane Mana Crystal (90🪙)</option>
                                </optgroup>
                                <optgroup label="All Equipment Items">
                                  {equipmentList
                                    .filter(i => i.id !== editingItem.id)
                                    .map(eq => (
                                      <option key={eq.id} value={eq.id}>
                                        {eq.icon} {eq.name} ({eq.cost}🪙 - {eq.rarity})
                                      </option>
                                    ))}
                                </optgroup>
                              </select>

                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-mono font-bold text-stone-500">Qty:</span>
                                <input
                                  type="number"
                                  value={ing.quantity}
                                  onChange={e => {
                                    const updated = [...recipeIngredients];
                                    updated[idx].quantity = Math.max(1, Number(e.target.value) || 1);
                                    setRecipeIngredients(updated);
                                  }}
                                  className="w-14 px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono font-bold text-center"
                                  min={1}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (recipeIngredients.length > 1) {
                                    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== idx));
                                  } else {
                                    alert('A recipe must have at least 1 ingredient!');
                                  }
                                }}
                                className="p-1 text-stone-400 hover:text-rose-600 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditorModal(false)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-black uppercase tracking-wider font-display transition-all shadow-md active:scale-95"
                  >
                    {isNewItem ? 'Create Equipment' : 'Update Equipment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white border border-rose-200 rounded-3xl p-6 shadow-2xl text-center space-y-4 text-stone-900"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black font-display uppercase tracking-wider text-stone-900">
                  Delete {deleteConfirmItem.name}?
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-1">
                  This will remove the item and any attached crafting recipe from the staging catalog.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmItem(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase font-display"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
