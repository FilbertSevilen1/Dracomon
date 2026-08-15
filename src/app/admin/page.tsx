'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Globe,
  Grid,
  Edit3,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Home,
  Check,
  Paintbrush,
  Search,
  AlertTriangle,
  Maximize2,
  Upload,
  Download
} from 'lucide-react';
import { levelStorageService } from '../../services/levelStorage';
import levelsData from '../../game/levels.json';
import { LevelEntity } from '../../game/LevelManager';

const THEMES_LIST = Object.keys(levelsData.themes);

export interface PaletteItem {
  id: string;
  label: string;
  category: 'Terrain' | 'Spawns' | 'Portals' | 'Hazards' | 'Items' | 'Minions' | 'Bosses';
  color: string;
  icon: string;
  isEntity?: boolean;
  symbol?: string;
  entityType?: string;
}

const TILE_PALETTE: PaletteItem[] = [
  // TERRAIN & GROUND
  { id: '.', symbol: '.', label: 'Sky / Air', category: 'Terrain', color: 'bg-slate-200 border-slate-300 text-slate-500 font-bold', icon: '☁️', isEntity: false },
  { id: '#', symbol: '#', label: 'Solid Ground', category: 'Terrain', color: 'bg-emerald-600 border-emerald-700 text-white font-black shadow-xs', icon: '🧱', isEntity: false },
  { id: '=', symbol: '=', label: 'Wooden Platform', category: 'Terrain', color: 'bg-amber-600 border-amber-700 text-white font-black shadow-xs', icon: '🪵', isEntity: false },
  { id: '^', symbol: '^', label: 'Spikes Hazard', category: 'Hazards', color: 'bg-rose-600 border-rose-700 text-white font-black shadow-xs', icon: '⚠️', isEntity: false },

  // SPAWNS & PORTALS
  { id: 'player_spawn', entityType: 'player_spawn', label: 'Player Spawn', category: 'Spawns', color: 'bg-transparent border-2 border-blue-500 text-blue-600 font-bold shadow-xs', icon: '👤', isEntity: true, symbol: '@' },
  { id: 'exit_portal', entityType: 'exit_portal', label: 'Exit Portal', category: 'Portals', color: 'bg-transparent border-2 border-blue-500 text-blue-600 font-bold shadow-xs', icon: '🌀', isEntity: true, symbol: 'E' },
  { id: 'sub_portal', entityType: 'sub_portal', label: 'Sub-Map Portal', category: 'Portals', color: 'bg-transparent border-2 border-blue-500 text-blue-600 font-bold shadow-xs', icon: '🚪', isEntity: true, symbol: 'X' },
  { id: 'antimatter_vortex', entityType: 'antimatter_vortex', label: 'Antimatter Vortex', category: 'Portals', color: 'bg-indigo-900 border-indigo-700 text-indigo-200 font-black shadow-xs', icon: '🌌', isEntity: true, symbol: 'm' },

  // HAZARDS & TRAPS
  { id: 'vine_trap', entityType: 'vine_trap', label: 'Vine Trap', category: 'Hazards', color: 'bg-green-800 border-green-900 text-green-200 font-black shadow-xs', icon: '🌿', isEntity: true, symbol: 'V' },
  { id: 'poison_spike', entityType: 'poison_spike', label: 'Poison Spike Trap', category: 'Hazards', color: 'bg-emerald-800 border-emerald-900 text-emerald-200 font-black shadow-xs', icon: '☠️', isEntity: true, symbol: 'R' },
  { id: 'laser_cannon', entityType: 'laser_cannon', label: 'Laser Cannon Trap', category: 'Hazards', color: 'bg-red-800 border-red-900 text-red-200 font-black shadow-xs', icon: '⚡', isEntity: true, symbol: 'M' },
  { id: 'anchor', entityType: 'anchor', label: 'Heavy Anchor Trap', category: 'Hazards', color: 'bg-cyan-900 border-cyan-700 text-cyan-200 font-black shadow-xs', icon: '⚓', isEntity: true, symbol: 'A' },
  { id: 'scallop', entityType: 'scallop', label: 'Scallop Trap', category: 'Hazards', color: 'bg-teal-900 border-teal-700 text-teal-200 font-black shadow-xs', icon: '🐚', isEntity: true, symbol: 'C' },

  // ITEMS & PICKUPS
  { id: 'coin', entityType: 'coin', label: 'Gold Coin', category: 'Items', color: 'bg-yellow-400 border-yellow-500 text-stone-950 font-black shadow-xs', icon: '🪙', isEntity: true, symbol: 'c' },
  { id: 'potion', entityType: 'potion', label: 'Healing Potion', category: 'Items', color: 'bg-rose-500 border-rose-600 text-white font-black shadow-xs', icon: '🧪', isEntity: true, symbol: 'p' },
  { id: 'upgrade_stone', entityType: 'upgrade_stone', label: 'Upgrade Stone', category: 'Items', color: 'bg-purple-600 border-purple-700 text-white font-black shadow-xs', icon: '💎', isEntity: true, symbol: 'u' },
  { id: 'heart', entityType: 'heart', label: 'Extra Heart', category: 'Items', color: 'bg-pink-500 border-pink-600 text-white font-black shadow-xs', icon: '❤️', isEntity: true, symbol: 'h' },
  { id: 'trampoline', entityType: 'trampoline', label: 'Bouncy Trampoline', category: 'Items', color: 'bg-blue-500 border-blue-600 text-white font-black shadow-xs', icon: '🌀', isEntity: true, symbol: 'T' },

  // MINIONS (ENEMIES)
  { id: 'slime', entityType: 'slime', label: 'Slime Minion', category: 'Minions', color: 'bg-lime-500 border-lime-600 text-stone-950 font-black shadow-xs', icon: '🟢', isEntity: true, symbol: '1' },
  { id: 'goblin_archer', entityType: 'goblin_archer', label: 'Goblin Archer', category: 'Minions', color: 'bg-green-700 border-green-800 text-white font-black shadow-xs', icon: '🏹', isEntity: true, symbol: '2' },
  { id: 'fire_golem', entityType: 'fire_golem', label: 'Fire Golem', category: 'Minions', color: 'bg-orange-600 border-orange-700 text-white font-black shadow-xs', icon: '🔥', isEntity: true, symbol: '3' },
  { id: 'bomb_thrower', entityType: 'bomb_thrower', label: 'Bomb Thrower', category: 'Minions', color: 'bg-red-600 border-red-700 text-white font-black shadow-xs', icon: '💣', isEntity: true, symbol: '4' },
  { id: 'skeleton_archer', entityType: 'skeleton_archer', label: 'Skeleton Archer', category: 'Minions', color: 'bg-stone-600 border-stone-700 text-white font-black shadow-xs', icon: '💀', isEntity: true, symbol: 's' },
  { id: 'alien', entityType: 'alien', label: 'Alien Laser Sniper', category: 'Minions', color: 'bg-indigo-600 border-indigo-700 text-white font-black shadow-xs', icon: '👽', isEntity: true, symbol: 'a' },
  { id: 'fish', entityType: 'fish', label: 'Aquatic Fish', category: 'Minions', color: 'bg-sky-500 border-sky-600 text-white font-black shadow-xs', icon: '🐟', isEntity: true, symbol: 'f' },
  { id: 'flying_wyvern', entityType: 'flying_wyvern', label: 'Flying Wyvern', category: 'Minions', color: 'bg-teal-600 border-teal-700 text-white font-black shadow-xs', icon: '🦅', isEntity: true, symbol: 'F' },
  { id: 'ghost', entityType: 'ghost', label: 'Shadow Ghost', category: 'Minions', color: 'bg-purple-900 border-purple-700 text-purple-200 font-black shadow-xs', icon: '👻', isEntity: true, symbol: 'g' },
  { id: 'reaper', entityType: 'reaper', label: 'Shadow Reaper', category: 'Minions', color: 'bg-slate-900 border-purple-800 text-red-400 font-black shadow-xs', icon: '💀', isEntity: true, symbol: 'r' },

  // BOSSES
  { id: 'king_slime', entityType: 'king_slime', label: 'King Slime Boss', category: 'Bosses', color: 'bg-lime-600 border-lime-700 text-white font-black shadow-xs', icon: '👑', isEntity: true, symbol: 'S' },
  { id: 'miniboss', entityType: 'miniboss', label: 'Miniboss Sentinel', category: 'Bosses', color: 'bg-purple-800 border-purple-900 text-white font-black shadow-xs', icon: '👾', isEntity: true, symbol: 'B' },
  { id: 'frost_wyvern', entityType: 'frost_wyvern', label: 'Frost Wyvern Boss', category: 'Bosses', color: 'bg-cyan-600 border-cyan-700 text-white font-black shadow-xs', icon: '🐉', isEntity: true, symbol: 'W' },
  { id: 'shadow_overlord', entityType: 'shadow_overlord', label: 'Shadow Overlord', category: 'Bosses', color: 'bg-indigo-950 border-purple-900 text-purple-200 font-black shadow-xs', icon: '👁️', isEntity: true, symbol: 'O' },
  { id: 'dragon_king', entityType: 'dragon_king', label: 'Dragon King Boss', category: 'Bosses', color: 'bg-red-900 border-red-950 text-red-100 font-black shadow-xs', icon: '🐲', isEntity: true, symbol: 'D' },
  { id: 'king_kong', entityType: 'king_kong', label: 'King Kong Boss', category: 'Bosses', color: 'bg-amber-900 border-amber-950 text-amber-200 font-black shadow-xs', icon: '🦍', isEntity: true, symbol: 'K' },
  { id: 'giant_wisp', entityType: 'giant_wisp', label: 'Giant Wisp Boss', category: 'Bosses', color: 'bg-fuchsia-600 border-fuchsia-700 text-white font-black shadow-xs', icon: '✨', isEntity: true, symbol: 'G' },
  { id: 'lunar_goddess', entityType: 'lunar_goddess', label: 'Lunar Goddess Boss', category: 'Bosses', color: 'bg-indigo-900 border-indigo-950 text-indigo-200 font-black shadow-xs', icon: '🌙', isEntity: true, symbol: 'L' },
];

const getTileMeta = (key: string) => {
  const found = TILE_PALETTE.find(t => t.id === key || t.entityType === key || t.symbol === key);
  if (found) return found;

  // Case alias fallbacks
  if (key === 'm') return { id: 'm', symbol: 'm', entityType: 'antimatter_vortex', isEntity: true, label: 'Antimatter Vortex Field', category: 'Portals' as const, color: 'bg-indigo-900 border-indigo-700 text-indigo-200 font-black shadow-xs', icon: '🌌' };
  if (key === 'h' || key === 'H') return { id: 'h', symbol: 'h', entityType: 'heart', isEntity: true, label: 'Extra Heart', category: 'Items' as const, color: 'bg-pink-500 border-pink-600 text-white font-black shadow-xs', icon: '❤️' };
  if (key === 'c' || key === 'C') return { id: 'c', symbol: 'c', entityType: 'coin', isEntity: true, label: 'Gold Coin', category: 'Items' as const, color: 'bg-yellow-400 border-yellow-500 text-stone-950 font-black shadow-xs', icon: '🪙' };
  if (key === 'p') return { id: 'p', symbol: 'p', entityType: 'potion', isEntity: true, label: 'Healing Potion', category: 'Items' as const, color: 'bg-rose-500 border-rose-600 text-white font-black shadow-xs', icon: '🧪' };
  if (key === 'P' || key === 'E') return { id: 'E', symbol: 'E', entityType: 'exit_portal', isEntity: true, label: 'Exit Portal Marker', category: 'Portals' as const, color: 'bg-transparent border-2 border-blue-500 text-blue-600 font-bold shadow-xs', icon: '🌀' };
  if (key === '@') return { id: '@', symbol: '@', entityType: 'player_spawn', isEntity: true, label: 'Player Spawn', category: 'Spawns' as const, color: 'bg-transparent border-2 border-blue-500 text-blue-600 font-bold shadow-xs', icon: '👤' };
  if (key === 'X') return { id: 'X', symbol: 'X', entityType: 'sub_portal', isEntity: true, label: 'Sub-Map Portal', category: 'Portals' as const, color: 'bg-transparent border-2 border-blue-500 text-blue-600 font-bold shadow-xs', icon: '🚪' };
  if (key === 'u' || key === 'U') return { id: 'u', symbol: 'u', entityType: 'upgrade_stone', isEntity: true, label: 'Upgrade Stone', category: 'Items' as const, color: 'bg-purple-600 border-purple-700 text-white font-black shadow-xs', icon: '💎' };
  return { id: key, symbol: key, entityType: key, isEntity: true, label: `Entity ${key}`, category: 'Minions' as const, color: 'bg-indigo-600 border-indigo-700 text-white font-black shadow-xs', icon: '👾' };
};

export default function AdminPage() {
  const router = useRouter();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active View Tab: 'worlds' | 'editor'
  const [activeTab, setActiveTab] = useState<'worlds' | 'editor'>('worlds');

  // Worlds & Stages State
  const [worldsRaw, setWorldsRaw] = useState<any[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<number>(1);
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);

  // Modals state
  const [showAddWorldModal, setShowAddWorldModal] = useState(false);
  const [showEditWorldModal, setShowEditWorldModal] = useState(false);
  const [editingWorldData, setEditingWorldData] = useState<any>(null);

  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [showEditStageModal, setShowEditStageModal] = useState(false);
  const [editingStageData, setEditingStageData] = useState<any>(null);

  // Editor State
  const [activeBrush, setActiveBrush] = useState<string>('#');
  const [paletteSearch, setPaletteSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'icons' | 'ascii'>('icons');
  const [editorGrid, setEditorGrid] = useState<string[]>([]);
  const [editorEntities, setEditorEntities] = useState<LevelEntity[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseButton, setMouseButton] = useState<number>(0); // 0 = Left, 2 = Right
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Confirmation Modals State
  const [showRevertConfirmModal, setShowRevertConfirmModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [deleteStageConfirmData, setDeleteStageConfirmData] = useState<{ worldId: number; stageIdx: number; title: string } | null>(null);
  const [deleteWorldConfirmData, setDeleteWorldConfirmData] = useState<{ worldId: number; name: string } | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  // Deploy levels to repository file (src/game/levels.json)
  const handleDeployToRepository = async () => {
    setIsDeploying(true);
    const result = await levelStorageService.deployLevelsToRepo(worldsRaw);
    setIsDeploying(false);
    if (result.success) {
      setSavedSuccessMsg('🚀 Successfully deployed levels directly to src/game/levels.json!');
    } else {
      setSavedSuccessMsg(`⚠️ Deploy failed: ${result.error || 'Exporting file instead...'}`);
      levelStorageService.downloadLevelsJson(worldsRaw);
    }
    setTimeout(() => setSavedSuccessMsg(''), 4000);
  };

  // Download levels.json manually
  const handleDownloadLevels = () => {
    levelStorageService.downloadLevelsJson(worldsRaw);
    setSavedSuccessMsg('📥 Downloaded levels.json payload file!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  // Check auth session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('dracoman_admin_logged_in') === 'true';
      if (loggedIn) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Load Worlds
  const reloadWorlds = () => {
    const raw = levelStorageService.getWorldsRaw();
    setWorldsRaw(raw);
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadWorlds();
    }
  }, [isAuthenticated]);

  // Revert active grid to saved state
  const handleRevertToSaved = () => {
    const raw = levelStorageService.getWorldsRaw();
    const selectedWorld = raw.find((w: any) => w.id === selectedWorldId);
    if (selectedWorld && selectedWorld.stages && selectedWorld.stages[selectedStageIdx]) {
      const stg = selectedWorld.stages[selectedStageIdx];
      if (stg.grid) {
        setEditorGrid([...stg.grid]);
      }
      if (stg.entities) {
        setEditorEntities([...stg.entities]);
      } else {
        setEditorEntities([]);
      }
      setSavedSuccessMsg('Reverted layout to saved state.');
      setTimeout(() => setSavedSuccessMsg(''), 3000);
    }
    setShowRevertConfirmModal(false);
  };

  // Reset active grid to empty sky
  const handleResetGrid = () => {
    const currentCols = editorGrid[0]?.length || 120;
    const currentRows = editorGrid.length || 23;
    const emptyGrid = Array(currentRows).fill('.'.repeat(currentCols));
    setEditorGrid(emptyGrid);
    setEditorEntities([]);
    setSavedSuccessMsg('Grid reset to empty sky.');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
    setShowResetConfirmModal(false);
  };

  // Confirmed Delete Stage
  const handleConfirmDeleteStage = () => {
    if (!deleteStageConfirmData) return;
    const { worldId, stageIdx } = deleteStageConfirmData;
    const updated = worldsRaw.map(w => {
      if (w.id === worldId) {
        const stages = [...w.stages];
        stages.splice(stageIdx, 1);
        return { ...w, stages };
      }
      return w;
    });
    handleSaveWorlds(updated);
    setDeleteStageConfirmData(null);
  };

  // Confirmed Delete World
  const handleConfirmDeleteWorld = () => {
    if (!deleteWorldConfirmData) return;
    const updated = worldsRaw.filter(w => w.id !== deleteWorldConfirmData.worldId);
    handleSaveWorlds(updated);
    setDeleteWorldConfirmData(null);
  };

  // Resize active editor grid (rows x columns)
  const handleResizeGrid = (targetRows: number, targetCols: number) => {
    const newRows = Math.max(5, Math.min(40, targetRows));
    const newCols = Math.max(10, Math.min(300, targetCols));

    const newGrid: string[] = [];
    for (let r = 0; r < newRows; r++) {
      if (r < editorGrid.length) {
        let rowStr = editorGrid[r];
        if (rowStr.length < newCols) {
          rowStr = rowStr.padEnd(newCols, '.');
        } else {
          rowStr = rowStr.substring(0, newCols);
        }
        newGrid.push(rowStr);
      } else {
        newGrid.push('.'.repeat(newCols));
      }
    }
    setEditorGrid(newGrid);
    // Remove entities outside new dimensions
    setEditorEntities(prev => prev.filter(e => e.x < newCols && e.y < newRows));
  };

  // Load grid into editor when selected stage changes
  useEffect(() => {
    if (worldsRaw.length > 0) {
      const world = worldsRaw.find(w => w.id === selectedWorldId) || worldsRaw[0];
      if (world && world.stages && world.stages[selectedStageIdx]) {
        const stg = world.stages[selectedStageIdx];
        if (stg.grid) {
          setEditorGrid([...stg.grid]);
        } else {
          const defaultGrid = Array(16).fill('.'.repeat(120));
          setEditorGrid(defaultGrid);
        }
        if (stg.entities) {
          setEditorEntities([...stg.entities]);
        } else {
          setEditorEntities([]);
        }
      }
    }
  }, [selectedWorldId, selectedStageIdx, worldsRaw]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('dracoman_admin_logged_in', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid admin username or password! (Default: admin / admin123)');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dracoman_admin_logged_in');
  };

  // World Operations
  const handleSaveWorlds = (updatedWorlds: any[]) => {
    setWorldsRaw(updatedWorlds);
    levelStorageService.saveWorldsRaw(updatedWorlds);
    levelStorageService.deployLevelsToRepo(updatedWorlds);
  };

  const handleAddWorld = (newWorld: any) => {
    const newId = worldsRaw.length > 0 ? Math.max(...worldsRaw.map(w => w.id)) + 1 : 1;
    const worldObj = {
      id: newId,
      name: newWorld.name || `World ${newId}`,
      themeName: newWorld.themeName || 'forest',
      icon: newWorld.icon || '🌍',
      color: newWorld.color || 'emerald',
      description: newWorld.description || '',
      rewardMultiplier: Number(newWorld.rewardMultiplier) || 1,
      bossName: newWorld.bossName || 'King Slime',
      stages: [
        {
          stageInWorld: 1,
          title: 'Stage 1',
          description: 'Initial stage',
          difficulty: 'EASY',
          diffClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-mono',
          icon: '🌱',
          color: 'emerald',
          borderHover: 'hover:border-emerald-500',
          grid: Array(16).fill('.'.repeat(120))
        }
      ]
    };
    const updated = [...worldsRaw, worldObj];
    handleSaveWorlds(updated);
    setSelectedWorldId(newId);
    setShowAddWorldModal(false);
  };

  const handleUpdateWorld = (updatedWorld: any) => {
    const updated = worldsRaw.map(w => w.id === updatedWorld.id ? { ...w, ...updatedWorld } : w);
    handleSaveWorlds(updated);
    setShowEditWorldModal(false);
  };

  const handleMoveWorld = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= worldsRaw.length) return;
    const updated = [...worldsRaw];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    handleSaveWorlds(updated);
  };

  const handleDeleteWorld = (worldId: number) => {
    if (worldsRaw.length <= 1) {
      alert('Cannot delete the last remaining world!');
      return;
    }
    if (confirm('Are you sure you want to delete this world?')) {
      const updated = worldsRaw.filter(w => w.id !== worldId);
      handleSaveWorlds(updated);
      if (selectedWorldId === worldId) {
        setSelectedWorldId(updated[0].id);
      }
    }
  };

  // Stage Operations
  const handleAddStage = (worldId: number, stageMeta: any) => {
    const updated = worldsRaw.map(w => {
      if (w.id === worldId) {
        const nextStageNum = (w.stages ? w.stages.length : 0) + 1;
        const newStage = {
          stageInWorld: nextStageNum,
          title: stageMeta.title || `Stage ${nextStageNum}`,
          description: stageMeta.description || '',
          difficulty: stageMeta.difficulty || 'NORMAL',
          diffClass: stageMeta.diffClass || 'bg-blue-100 text-blue-800 border-blue-300 font-mono',
          icon: stageMeta.icon || '⚔️',
          color: stageMeta.color || 'blue',
          borderHover: 'hover:border-blue-500',
          grid: Array(16).fill('.'.repeat(120))
        };
        return {
          ...w,
          stages: [...(w.stages || []), newStage]
        };
      }
      return w;
    });
    handleSaveWorlds(updated);
    setShowAddStageModal(false);
  };

  const handleUpdateStageMeta = (worldId: number, stageIndex: number, stageMeta: any) => {
    const updated = worldsRaw.map(w => {
      if (w.id === worldId) {
        const stages = [...w.stages];
        stages[stageIndex] = {
          ...stages[stageIndex],
          ...stageMeta
        };
        return { ...w, stages };
      }
      return w;
    });
    handleSaveWorlds(updated);
    setShowEditStageModal(false);
  };

  const handleMoveStage = (worldId: number, index: number, direction: 'up' | 'down') => {
    const updated = worldsRaw.map(w => {
      if (w.id === worldId) {
        const targetIdx = direction === 'up' ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= w.stages.length) return w;
        const stages = [...w.stages];
        const temp = stages[index];
        stages[index] = stages[targetIdx];
        stages[targetIdx] = temp;

        stages.forEach((stg, i) => {
          stg.stageInWorld = i + 1;
        });

        return { ...w, stages };
      }
      return w;
    });
    handleSaveWorlds(updated);
  };

  const handleDeleteStage = (worldId: number, index: number) => {
    const world = worldsRaw.find(w => w.id === worldId);
    if (world && world.stages.length <= 1) {
      alert('Cannot delete the last remaining stage in a world!');
      return;
    }
    if (confirm('Are you sure you want to delete this stage?')) {
      const updated = worldsRaw.map(w => {
        if (w.id === worldId) {
          const stages = w.stages.filter((_: any, i: number) => i !== index);
          stages.forEach((stg: any, i: number) => {
            stg.stageInWorld = i + 1;
          });
          return { ...w, stages };
        }
        return w;
      });
      handleSaveWorlds(updated);
      if (selectedStageIdx >= index) {
        setSelectedStageIdx(Math.max(0, selectedStageIdx - 1));
      }
    }
  };

  // Stage Grid & Entity Painting Logic
  const handleCellPaint = (rowIndex: number, colIndex: number, isRightClick = false) => {
    if (!editorGrid || editorGrid.length === 0) return;

    if (isRightClick) {
      // Eraser: remove any entity at (colIndex, rowIndex) and reset terrain to '.'
      setEditorEntities(prev => prev.filter(e => !(e.x === colIndex && e.y === rowIndex)));
      const updatedGrid = [...editorGrid];
      const row = updatedGrid[rowIndex];
      if (row && colIndex < row.length) {
        updatedGrid[rowIndex] = row.substring(0, colIndex) + '.' + row.substring(colIndex + 1);
        setEditorGrid(updatedGrid);
      }
      return;
    }

    const brushMeta = getTileMeta(activeBrush);
    if (brushMeta.isEntity) {
      const entityType = brushMeta.entityType || activeBrush;

      // Single-instance entity check: exit_portal, player_spawn, and boss entities
      const isSingleInstance = entityType === 'exit_portal' || entityType === 'player_spawn' || brushMeta.category === 'Bosses';

      setEditorEntities(prev => {
        let filtered = prev;
        if (isSingleInstance) {
          // Remove any existing instance of this single-instance entity across the whole map
          filtered = filtered.filter(e => e.type !== entityType);
        }
        // Remove any entity currently sitting at this cell
        filtered = filtered.filter(e => !(e.x === colIndex && e.y === rowIndex));

        return [...filtered, { type: entityType, x: colIndex, y: rowIndex }];
      });

      // Clear terrain grid cell to '.' (open air) so entity isn't embedded in solid wall or old ASCII symbol
      const updatedGrid = [...editorGrid];
      const row = updatedGrid[rowIndex];
      if (row && colIndex < row.length) {
        updatedGrid[rowIndex] = row.substring(0, colIndex) + '.' + row.substring(colIndex + 1);
        setEditorGrid(updatedGrid);
      }
    } else {
      // Placing terrain block (e.g. '#', '=', '*', '.')
      const symbol = brushMeta.symbol || activeBrush;

      // Remove any entity at this cell when painting terrain over it
      setEditorEntities(prev => prev.filter(e => !(e.x === colIndex && e.y === rowIndex)));

      const updatedGrid = [...editorGrid];
      const row = updatedGrid[rowIndex];
      if (row && colIndex < row.length) {
        updatedGrid[rowIndex] = row.substring(0, colIndex) + symbol + row.substring(colIndex + 1);
        setEditorGrid(updatedGrid);
      }
    }
  };

  const handleSaveGridToStorage = () => {
    const updated = worldsRaw.map(w => {
      if (w.id === selectedWorldId) {
        const stages = [...w.stages];
        if (stages[selectedStageIdx]) {
          stages[selectedStageIdx] = {
            ...stages[selectedStageIdx],
            grid: editorGrid,
            entities: editorEntities
          };
        }
        return { ...w, stages };
      }
      return w;
    });
    handleSaveWorlds(updated);
    levelStorageService.deployLevelsToRepo(updated);
    setSavedSuccessMsg('🚀 Stage map & entities saved & deployed directly to src/game/levels.json!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };


  // DARK OBSIDIAN GLASS LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-display select-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[35rem] h-[35rem] bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-amber-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative text-stone-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wider uppercase font-display">Admin Portal</h1>
              <p className="text-xs text-stone-400 font-mono">Level &amp; World Management Suite</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-400 font-mono transition-all shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-400 font-mono transition-all pr-12 shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs rounded-xl flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs uppercase tracking-wider font-display rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Lock className="w-4 h-4 fill-current" /> Login to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-800 flex justify-between items-center text-xs text-stone-400">
            <button
              onClick={() => router.push('/')}
              className="hover:text-amber-400 flex items-center gap-1 transition-all font-mono"
            >
              <Home className="w-3.5 h-3.5" /> Back to Game
            </button>
            <span className="font-mono text-[10px] text-amber-400 font-bold">v0.3.2 Dark Admin Suite</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedWorld = worldsRaw.find(w => w.id === selectedWorldId) || worldsRaw[0];

  return (
    <div className="h-screen w-screen bg-stone-50 text-stone-900 font-display flex flex-col select-none overflow-hidden">
      {/* LIGHT MODE TOP BAR */}
      <header className="h-14 bg-white border-b border-stone-200 px-6 flex items-center justify-between z-30 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-black">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2">
              Dracoman <span className="px-2 py-0.5 bg-amber-400 text-stone-950 text-[10px] font-black rounded-full font-mono">ADMIN (LIGHT)</span>
            </h1>
            <p className="text-[10px] text-stone-500">World &amp; Stage Level JSON Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDeployToRepository}
            disabled={isDeploying}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            title="Save and deploy current levels directly into src/game/levels.json"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isDeploying ? 'Deploying...' : '🚀 Deploy to Repo'}</span>
          </button>

          <button
            onClick={handleDownloadLevels}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold flex items-center gap-1 transition-all"
            title="Download levels.json file payload"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" /> Export JSON
          </button>

          <button
            onClick={() => router.push('/')}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Home className="w-3.5 h-3.5" /> Exit to Game
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* BODY WITH SIDEBAR */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* LIGHT MODE SIDEBAR */}
        <aside className="w-56 bg-white border-r border-stone-200 p-3 flex flex-col justify-between shrink-0 shadow-sm h-full overflow-y-auto">
          <div className="space-y-1.5">
            <div className="px-2 py-1 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
              Navigation
            </div>

            <button
              onClick={() => setActiveTab('worlds')}
              className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'worlds'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm font-black'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Globe className="w-4 h-4" /> World &amp; Stages List
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'editor'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm font-black'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Grid className="w-4 h-4" /> Stage Grid Editor
            </button>
          </div>

          <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-[10px] text-stone-500 font-mono space-y-0.5">
            <div className="text-amber-800 font-bold">Total Worlds: {worldsRaw.length}</div>
            <div>Theme: {selectedWorld?.themeName || 'forest'}</div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 bg-stone-50 h-full min-h-0">
          {activeTab === 'worlds' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* WORLDS SECTION */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-amber-600" /> Campaign Worlds
                    </h2>
                    <p className="text-xs text-stone-500">Manage campaign worlds metadata and stage order.</p>
                  </div>
                  <button
                    onClick={() => setShowAddWorldModal(true)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add World
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {worldsRaw.map((world, idx) => {
                    const isSelected = world.id === selectedWorldId;
                    return (
                      <div
                        key={world.id}
                        onClick={() => setSelectedWorldId(world.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-400/30'
                            : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{world.icon}</span>
                              <span className="font-extrabold text-xs text-stone-900">W{world.id}: {world.name}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[9px] font-bold">
                              {world.rewardMultiplier}x Drops
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-500 line-clamp-2 mb-2 leading-tight">
                            {world.description || 'No description.'}
                          </p>

                          <div className="text-[10px] text-stone-500 font-mono flex items-center gap-2">
                            <span>Theme: <strong className="text-stone-800">{world.themeName}</strong></span>
                            <span>Stages: <strong className="text-amber-700">{world.stages ? world.stages.length : 0}</strong></span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between shrink-0" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveWorld(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-700 border border-stone-200"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveWorld(idx, 'down')}
                              disabled={idx === worldsRaw.length - 1}
                              className="p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-700 border border-stone-200"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingWorldData(world);
                                setShowEditWorldModal(true);
                              }}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 text-[11px] font-semibold rounded flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => setDeleteWorldConfirmData({ worldId: world.id, name: world.name })}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold rounded flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STAGES IN SELECTED WORLD */}
              {selectedWorld && (
                <div className="pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                        <span>{selectedWorld.icon}</span> Stages in {selectedWorld.name}
                      </h3>
                      <p className="text-xs text-stone-500">Configure stages inside World {selectedWorld.id}.</p>
                    </div>

                    <button
                      onClick={() => setShowAddStageModal(true)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Stage
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedWorld.stages && selectedWorld.stages.map((stage: any, sIdx: number) => {
                      const isSelected = selectedStageIdx === sIdx;
                      return (
                        <div
                          key={sIdx}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                              : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">{stage.icon || '⚔️'}</span>
                                <h4 className="text-xs font-bold text-stone-900">
                                  Stage {sIdx + 1}: {stage.title}
                                </h4>
                              </div>
                              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{stage.description}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${stage.diffClass || 'bg-stone-200 text-stone-700'}`}>
                              {stage.difficulty}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveStage(selectedWorld.id, sIdx, 'up')}
                                disabled={sIdx === 0}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 disabled:opacity-30 text-stone-700"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveStage(selectedWorld.id, sIdx, 'down')}
                                disabled={sIdx === selectedWorld.stages.length - 1}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 disabled:opacity-30 text-stone-700"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedStageIdx(sIdx);
                                  setActiveTab('editor');
                                }}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-sm"
                              >
                                <Grid className="w-3 h-3" /> Edit Map
                              </button>

                              <button
                                onClick={() => {
                                  setEditingStageData({ ...stage, index: sIdx });
                                  setShowEditStageModal(true);
                                }}
                                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-[11px] font-semibold rounded-lg flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>

                              <button
                                onClick={() => setDeleteStageConfirmData({ worldId: selectedWorld.id, stageIdx: sIdx, title: stage.title })}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold rounded-lg flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE GRID MAP EDITOR TAB (FULL HEIGHT) */}
          {activeTab === 'editor' && (
            <div className="flex flex-col h-[calc(100vh-5rem)] space-y-3 max-w-full">
              {/* COMPACT TOOLBAR HEADER */}
              <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Grid className="w-4 h-4 text-amber-600" />
                    <span>Map Editor:</span>
                  </div>

                  <select
                    value={selectedWorldId}
                    onChange={(e) => {
                      setSelectedWorldId(Number(e.target.value));
                      setSelectedStageIdx(0);
                    }}
                    className="px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg font-bold text-xs text-stone-900"
                  >
                    {worldsRaw.map(w => (
                      <option key={w.id} value={w.id}>W{w.id}: {w.name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedStageIdx}
                    onChange={(e) => setSelectedStageIdx(Number(e.target.value))}
                    className="px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg font-bold text-xs text-stone-900"
                  >
                    {selectedWorld && selectedWorld.stages && selectedWorld.stages.map((stg: any, idx: number) => (
                      <option key={idx} value={idx}>Stage {idx + 1}: {stg.title}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-300 font-mono text-xs font-bold text-stone-800">
                    <Maximize2 className="w-3.5 h-3.5 text-stone-500" />
                    <span>Grid Size:</span>
                    <input
                      type="number"
                      min="5"
                      max="40"
                      value={editorGrid.length}
                      onChange={(e) => handleResizeGrid(Number(e.target.value) || 10, editorGrid[0]?.length || 100)}
                      className="w-10 px-1 py-0.5 bg-white border border-stone-300 rounded text-center font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                      title="Rows (Height)"
                    />
                    <span className="text-stone-400 font-normal">R ×</span>
                    <input
                      type="number"
                      min="10"
                      max="300"
                      value={editorGrid[0]?.length || 0}
                      onChange={(e) => handleResizeGrid(editorGrid.length || 23, Number(e.target.value) || 10)}
                      className="w-14 px-1 py-0.5 bg-white border border-stone-300 rounded text-center font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                      title="Columns (Width)"
                    />
                    <span className="text-stone-400 font-normal">C</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'icons' ? 'ascii' : 'icons')}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                    title="Toggle between Emoji Icons and ASCII Character symbols"
                  >
                    <span>{viewMode === 'icons' ? '🎭 Mode: Icons' : '🔤 Mode: ASCII'}</span>
                  </button>

                  <button
                    onClick={() => setShowRevertConfirmModal(true)}
                    className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                    title="Revert layout to last saved version"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-700" /> Revert
                  </button>

                  <button
                    onClick={handleSaveGridToStorage}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-lg flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Grid
                  </button>

                  <button
                    onClick={() => setShowResetConfirmModal(true)}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                    title="Reset grid to empty sky"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>
              </div>

              {savedSuccessMsg && (
                <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2 shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" /> {savedSuccessMsg}
                </div>
              )}

              {/* WORKSPACE: LEFT BRUSH PALETTE SIDEBAR + RIGHT GRID BOARD */}
              <div className="flex-1 flex flex-col lg:flex-row gap-3 items-stretch min-h-0">
                {/* LEFT SIDEBAR: FULL HEIGHT 2-COLUMN BRUSH PALETTE GRID WITH SCROLLBAR */}
                {(() => {
                  const filteredPalette = TILE_PALETTE.filter(t =>
                    t.label.toLowerCase().includes(paletteSearch.toLowerCase()) ||
                    t.id.toLowerCase().includes(paletteSearch.toLowerCase()) ||
                    (t.entityType && t.entityType.toLowerCase().includes(paletteSearch.toLowerCase())) ||
                    (t.symbol && t.symbol.toLowerCase().includes(paletteSearch.toLowerCase())) ||
                    t.icon.includes(paletteSearch)
                  );
                  return (
                    <div className="w-full lg:w-72 bg-white border border-stone-200 rounded-xl p-3 shadow-sm flex flex-col shrink-0 h-full min-h-0 overflow-hidden">
                      <div className="text-[11px] font-bold text-stone-700 flex items-center justify-between gap-1.5 shrink-0 mb-2">
                        <span className="flex items-center gap-1">
                          <Paintbrush className="w-3.5 h-3.5 text-amber-600" /> Brush Palette
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">({filteredPalette.length}/{TILE_PALETTE.length})</span>
                      </div>

                      <div className="relative w-full shrink-0 mb-2">
                        <input
                          type="text"
                          value={paletteSearch}
                          onChange={(e) => setPaletteSearch(e.target.value)}
                          placeholder="Search brushes..."
                          className="w-full pl-7 pr-2 py-1 bg-stone-50 border border-stone-300 rounded-lg text-[11px] font-mono text-stone-900 focus:outline-none focus:border-amber-500"
                        />
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 content-start auto-rows-max flex-1 overflow-y-auto pr-1 min-h-0">
                        {filteredPalette.map((tile) => {
                          const isSelected = activeBrush === tile.id || activeBrush === tile.entityType || activeBrush === tile.symbol;
                          return (
                            <button
                              key={tile.id}
                              onClick={() => setActiveBrush(tile.id)}
                              className={`p-2 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all text-left truncate h-fit ${
                                isSelected
                                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-black shadow-sm ring-2 ring-amber-400/40'
                                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                              }`}
                              title={`${tile.label} (${tile.entityType || tile.symbol})`}
                            >
                              <span className="text-base shrink-0">{tile.icon}</span>
                              <span className="truncate leading-tight text-[10px]">
                                {tile.label} <strong className="font-mono text-[9px] opacity-75">({tile.entityType || tile.symbol})</strong>
                              </span>
                            </button>
                          );
                        })}
                        {filteredPalette.length === 0 && (
                          <div className="col-span-2 text-[11px] text-stone-400 italic py-2 text-center">No matching brushes.</div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* RIGHT MAIN AREA: FULL HEIGHT STAGE GRID MAP BOARD */}
                <div
                  className="flex-1 w-full bg-white border border-stone-200 rounded-xl p-3 shadow-sm overflow-x-auto overflow-y-auto h-full min-h-0 select-none font-mono text-xs"
                  onMouseDown={() => setIsMouseDown(true)}
                  onMouseUp={() => setIsMouseDown(false)}
                  onMouseLeave={() => setIsMouseDown(false)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="inline-block space-y-0.5 font-mono text-xs">
                    {editorGrid.map((rowStr, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-0.5">
                        <span className="w-5 text-[9px] text-stone-400 font-bold shrink-0">{rIdx}</span>
                        {rowStr.split('').map((char, cIdx) => {
                          const entityAtCell = editorEntities.find(e => e.x === cIdx && e.y === rIdx);
                          const terrainMeta = getTileMeta(char);
                          const displayMeta = entityAtCell ? getTileMeta(entityAtCell.type) : terrainMeta;
                          return (
                            <div
                              key={cIdx}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                const isRight = e.button === 2;
                                setMouseButton(e.button);
                                handleCellPaint(rIdx, cIdx, isRight);
                              }}
                              onMouseEnter={() => {
                                if (isMouseDown) {
                                  handleCellPaint(rIdx, cIdx, mouseButton === 2);
                                }
                              }}
                              className={`w-6 h-6 rounded-[4px] flex items-center justify-center text-[12px] font-black border transition-all cursor-pointer ${displayMeta.color}`}
                              title={`Row ${rIdx}, Col ${cIdx}: ${displayMeta.label}${entityAtCell ? ` [Entity: ${entityAtCell.type}]` : ''}`}
                            >
                              {viewMode === 'icons'
                                ? (entityAtCell ? displayMeta.icon : (char === '.' ? '.' : displayMeta.icon))
                                : (entityAtCell ? (displayMeta.symbol || 'E') : char)}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* LIGHT MODE ADD WORLD MODAL */}
      <AnimatePresence>
        {showAddWorldModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-stone-900">Add New World</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                handleAddWorld({
                  name: form.name.value,
                  themeName: form.themeName.value,
                  icon: form.icon.value,
                  description: form.description.value,
                  rewardMultiplier: form.rewardMultiplier.value,
                  bossName: form.bossName.value,
                });
              }} className="space-y-3">
                <input name="name" placeholder="World Name" required className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <select name="themeName" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900">
                  {THEMES_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input name="icon" placeholder="World Icon Emoji (e.g. 🌋)" defaultValue="🌍" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <input name="description" placeholder="World Description" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <input name="rewardMultiplier" type="number" step="0.1" placeholder="Reward Multiplier (e.g. 1.5)" defaultValue="1.5" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <input name="bossName" placeholder="World Final Boss Name" defaultValue="Dragon Boss" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-sm">Save World</button>
                  <button type="button" onClick={() => setShowAddWorldModal(false)} className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHT MODE EDIT WORLD MODAL */}
      <AnimatePresence>
        {showEditWorldModal && editingWorldData && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-stone-900">Edit World {editingWorldData.id}</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                handleUpdateWorld({
                  id: editingWorldData.id,
                  name: form.name.value,
                  themeName: form.themeName.value,
                  icon: form.icon.value,
                  description: form.description.value,
                  rewardMultiplier: Number(form.rewardMultiplier.value),
                  bossName: form.bossName.value,
                });
              }} className="space-y-3">
                <input name="name" defaultValue={editingWorldData.name} required className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <select name="themeName" defaultValue={editingWorldData.themeName} className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900">
                  {THEMES_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input name="icon" defaultValue={editingWorldData.icon} className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <input name="description" defaultValue={editingWorldData.description} className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <input name="rewardMultiplier" type="number" step="0.1" defaultValue={editingWorldData.rewardMultiplier} className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <input name="bossName" defaultValue={editingWorldData.bossName} className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-sm">Save Changes</button>
                  <button type="button" onClick={() => setShowEditWorldModal(false)} className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHT MODE ADD STAGE MODAL */}
      <AnimatePresence>
        {showAddStageModal && selectedWorld && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-stone-900">Add Stage to {selectedWorld.name}</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                handleAddStage(selectedWorld.id, {
                  title: form.title.value,
                  description: form.description.value,
                  difficulty: form.difficulty.value,
                  icon: form.icon.value,
                });
              }} className="space-y-3">
                <input name="title" placeholder="Stage Title" required className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <input name="description" placeholder="Stage Description" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <select name="difficulty" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900">
                  <option value="EASY">EASY</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HARD">HARD</option>
                  <option value="INSANE">INSANE</option>
                </select>
                <input name="icon" placeholder="Icon Emoji (e.g. ⚔️)" defaultValue="⚔️" className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-sm">Save Stage</button>
                  <button type="button" onClick={() => setShowAddStageModal(false)} className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHT MODE EDIT STAGE MODAL */}
      <AnimatePresence>
        {showEditStageModal && editingStageData && selectedWorld && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-stone-900">Edit Stage Details</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                handleUpdateStageMeta(selectedWorld.id, editingStageData.index, {
                  title: form.title.value,
                  description: form.description.value,
                  difficulty: form.difficulty.value,
                  icon: form.icon.value,
                });
              }} className="space-y-3">
                <input name="title" defaultValue={editingStageData.title} required className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <input name="description" defaultValue={editingStageData.description} className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />
                <select name="difficulty" defaultValue={editingStageData.difficulty} className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900">
                  <option value="EASY">EASY</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HARD">HARD</option>
                  <option value="INSANE">INSANE</option>
                </select>
                <input name="icon" defaultValue={editingStageData.icon} className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900" />

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-sm">Save Changes</button>
                  <button type="button" onClick={() => setShowEditStageModal(false)} className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REVERT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showRevertConfirmModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Revert Layout to Saved?</h3>
              <p className="text-xs text-stone-500">All unsaved grid changes for this stage will be discarded and reloaded from the last saved state.</p>
              <div className="flex gap-2 pt-2">
                <button onClick={handleRevertToSaved} className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-sm">Revert Now</button>
                <button onClick={() => setShowRevertConfirmModal(false)} className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESET GRID CONFIRMATION MODAL */}
      <AnimatePresence>
        {showResetConfirmModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Reset Stage Grid?</h3>
              <p className="text-xs text-stone-500">This action will clear all ground, platforms, entities, and enemies, resetting the map grid to empty sky.</p>
              <div className="flex gap-2 pt-2">
                <button onClick={handleResetGrid} className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-sm">Reset to Sky</button>
                <button onClick={() => setShowResetConfirmModal(false)} className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE STAGE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteStageConfirmData && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Delete Stage?</h3>
              <p className="text-xs text-stone-500">Are you sure you want to delete stage <strong className="text-stone-800">"{deleteStageConfirmData.title}"</strong>?</p>
              <div className="flex gap-2 pt-2">
                <button onClick={handleConfirmDeleteStage} className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-sm">Delete Stage</button>
                <button onClick={() => setDeleteStageConfirmData(null)} className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE WORLD CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteWorldConfirmData && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Delete World {deleteWorldConfirmData.worldId}?</h3>
              <p className="text-xs text-stone-500">Are you sure you want to delete <strong className="text-stone-800">"{deleteWorldConfirmData.name}"</strong> and all of its stages?</p>
              <div className="flex gap-2 pt-2">
                <button onClick={handleConfirmDeleteWorld} className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-sm">Delete World</button>
                <button onClick={() => setDeleteWorldConfirmData(null)} className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
