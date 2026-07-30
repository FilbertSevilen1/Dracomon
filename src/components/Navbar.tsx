'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coins,
  Briefcase,
  Sparkles,
  Settings,
  Home,
  Swords,
  Map,
  Crown,
  ScrollText,
  MoreHorizontal,
  ChevronRight,
  X,
} from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { storageService } from '../services/storage';
import { soundService } from '../services/sound';
import { SaveData } from '../types/game';
import { SettingsModal } from './SettingsModal';
import { InventoryModal } from './InventoryModal';
import { AnimatePresence, motion } from 'framer-motion';

interface NavbarProps {
  onOpenInventory?: () => void;
}

/** Primary nav links always visible (desktop full, mobile icon-only) */
const PRIMARY_NAV = [
  { label: 'Home',   href: '/',       Icon: Home   },
  { label: 'Heroes', href: '/heroes', Icon: Swords },
  { label: 'Maps',   href: '/maps',   Icon: Map    },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenInventory }) => {
  const pathname = usePathname();
  const { saveData, usePotion, useUpgradeStone, buyItem } = useGameState();
  const [liveSaveData, setLiveSaveData] = useState<SaveData>(saveData);
  const [showSettings, setShowSettings] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Settings helpers ───────────────────────────────────────────── */
  const updateSettings = (music: boolean, volume: number, sfxVolume: number) => {
    const updated = {
      ...liveSaveData,
      settings: { ...liveSaveData.settings, music, volume, sfxVolume },
    };
    storageService.saveGame(updated);
    soundService.updateVolumes(volume, sfxVolume, music);
    window.dispatchEvent(new CustomEvent('Dracoman_save_updated', { detail: updated }));
  };

  const resetGameSave = () => {
    const freshData = storageService.resetGame();
    soundService.updateVolumes(freshData.settings.volume, freshData.settings.sfxVolume ?? 80, freshData.settings.music);
    soundService.playClick();
    window.dispatchEvent(new CustomEvent('Dracoman_save_updated', { detail: freshData }));
  };

  const exportSave = () => storageService.exportSave(liveSaveData);

  const importSave = (dataStr: string) => {
    const imported = storageService.importSave(dataStr);
    if (imported) {
      soundService.updateVolumes(imported.settings.volume, imported.settings.sfxVolume ?? 80, imported.settings.music);
      window.dispatchEvent(new CustomEvent('Dracoman_save_updated', { detail: imported }));
      return true;
    }
    return false;
  };

  /* ── Stop BGM on non-game pages ────────────────────────────────── */
  useEffect(() => {
    if (pathname !== '/play') {
      soundService.stopBGM();
    }
  }, [pathname]);

  /* ── Live save sync ─────────────────────────────────────────────── */
  useEffect(() => { setLiveSaveData(saveData); }, [saveData]);

  useEffect(() => {
    const handleUpdate = () => setLiveSaveData(storageService.loadGame());
    window.addEventListener('Dracoman_save_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('Dracoman_save_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  /* ── Scroll detection ───────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Close dropdown on outside click ───────────────────────────── */
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showDropdown]);

  const activeDracoName = liveSaveData.selectedDraco || 'Jumpmon';
  const activeDraco = liveSaveData.dracos[activeDracoName];
  const activeLevel = activeDraco?.level || 1;
  const coins = liveSaveData.player.coins;
  const currentTier = liveSaveData.tier || 'Free';

  const isLandingPage = pathname === '/';
  const isTransparent = isLandingPage && !isScrolled;

  const tierColor =
    currentTier === 'Premium'
      ? 'bg-purple-600 text-white border-purple-400'
      : currentTier === 'Basic'
      ? 'bg-emerald-600 text-white border-emerald-400'
      : isTransparent
      ? 'bg-white/10 text-stone-200 border-white/20'
      : 'bg-stone-100 text-stone-700 border-stone-300';

  if (pathname === '/play') return null;

  return (
    <>
      <header className={`w-full z-50 px-3 md:px-8 py-3 flex items-center justify-between select-none transition-all duration-300 fixed top-0 left-0 ${
        isTransparent
          ? 'bg-transparent border-b border-transparent shadow-none'
          : 'border-b border-stone-200/80 bg-white/90 backdrop-blur-md shadow-sm'
      }`}>

        {/* ── Logo ── */}
        <Link
          href="/"
          onClick={() => soundService.playClick()}
          className={`flex items-center gap-1.5 font-mono font-black tracking-tight hover:opacity-90 transition-all shrink-0 ${
            isTransparent ? 'text-white' : 'text-stone-900'
          }`}
        >
          <span className="text-2xl leading-none">🐉</span>
          <span className="hidden sm:inline text-lg md:text-xl">Dracoman</span>
        </Link>

        {/* ── Desktop Full Nav ── */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold">
          {[
            ...PRIMARY_NAV,
            { label: 'Membership', href: '/membership', Icon: Crown      },
            { label: 'Patch Notes', href: '/version',   Icon: ScrollText },
          ].map(({ label, href, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => soundService.playClick()}
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? isTransparent
                      ? 'text-amber-400 font-black border-b-2 border-amber-400 pb-0.5'
                      : 'text-amber-600 font-black border-b-2 border-amber-500 pb-0.5'
                    : isTransparent
                    ? 'text-stone-300 hover:text-white'
                    : 'text-stone-600 hover:text-amber-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Mobile: Primary 3 icon links + More dropdown ── */}
        <nav className="flex md:hidden items-center gap-0.5">
          {PRIMARY_NAV.map(({ label, href, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => soundService.playClick()}
                title={label}
                className={`p-2 rounded-xl transition-all ${
                  isActive
                    ? isTransparent
                      ? 'text-amber-400 bg-white/10'
                      : 'text-amber-600 bg-amber-50'
                    : isTransparent
                    ? 'text-stone-300 hover:text-white hover:bg-white/10'
                    : 'text-stone-500 hover:text-amber-600 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </Link>
            );
          })}

          {/* More button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { soundService.playClick(); setShowDropdown(v => !v); }}
              title="More"
              className={`p-2 rounded-xl transition-all ${
                showDropdown
                  ? isTransparent
                    ? 'text-amber-400 bg-white/10'
                    : 'text-amber-600 bg-amber-50'
                  : isTransparent
                  ? 'text-stone-300 hover:text-white hover:bg-white/10'
                  : 'text-stone-500 hover:text-amber-600 hover:bg-stone-50'
              }`}
            >
              {showDropdown
                ? <X className="w-[18px] h-[18px]" />
                : <MoreHorizontal className="w-[18px] h-[18px]" />
              }
            </button>

            {/* ── Dropdown panel ── */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className={`absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl shadow-xl overflow-hidden z-50 border transition-all duration-300 ${
                    isTransparent
                      ? 'bg-stone-950/95 backdrop-blur-md border-stone-800 text-stone-200 shadow-2xl'
                      : 'bg-white border-stone-200 text-stone-850'
                  }`}
                >
                  {/* Character / Hero */}
                  <Link
                    href="/heroes"
                    onClick={() => { soundService.playClick(); setShowDropdown(false); }}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors border-b group ${
                      isTransparent
                        ? 'hover:bg-white/5 border-stone-900'
                        : 'hover:bg-amber-50 border-stone-100'
                    }`}
                  >
                    <div className="p-1.5 bg-stone-900 rounded-full shrink-0">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-mono font-black truncate ${isTransparent ? 'text-stone-200' : 'text-stone-800'}`}>{activeDracoName}</p>
                      <p className={`text-[9px] font-mono ${isTransparent ? 'text-stone-500' : 'text-stone-400'}`}>Lv.{activeLevel} · Active Hero</p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-colors shrink-0 ${isTransparent ? 'text-stone-600 group-hover:text-amber-400' : 'text-stone-400 group-hover:text-amber-500'}`} />
                  </Link>

                  {/* Coins row */}
                  <div className={`flex items-center gap-3 px-4 py-2.5 border-b ${
                    isTransparent
                      ? 'border-stone-900 bg-amber-500/10'
                      : 'border-stone-100 bg-amber-50/40'
                  }`}>
                    <Coins className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <span className={`text-xs font-mono font-bold ${isTransparent ? 'text-amber-400' : 'text-amber-700'}`}>{coins} Coins</span>
                  </div>

                  {/* Membership Tier */}
                  <Link
                    href="/membership"
                    onClick={() => { soundService.playClick(); setShowDropdown(false); }}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors border-b group ${
                      isTransparent
                        ? 'hover:bg-white/5 border-stone-900'
                        : 'hover:bg-stone-50 border-stone-100'
                    }`}
                  >
                    <div className={`p-1.5 rounded-full border shrink-0 ${tierColor}`}>
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-mono font-black ${isTransparent ? 'text-white' : 'text-stone-800'}`}>{currentTier.toUpperCase()} TIER</p>
                      <p className={`text-[9px] font-mono ${isTransparent ? 'text-stone-500' : 'text-stone-400'}`}>Membership</p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-colors shrink-0 ${isTransparent ? 'text-stone-600 group-hover:text-amber-400' : 'text-stone-400 group-hover:text-amber-500'}`} />
                  </Link>

                  {/* Patch Notes */}
                  <Link
                    href="/version"
                    onClick={() => { soundService.playClick(); setShowDropdown(false); }}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors border-b group ${
                      isTransparent
                        ? 'hover:bg-white/5 border-stone-900'
                        : 'hover:bg-stone-50 border-stone-100'
                    } ${
                      pathname === '/version' ? (isTransparent ? 'bg-white/5' : 'bg-amber-50') : ''
                    }`}
                  >
                    <div className={`p-1.5 rounded-full border shrink-0 ${
                      isTransparent
                        ? 'bg-stone-900 border-stone-800 text-stone-300'
                        : 'bg-stone-100 border-stone-200 text-stone-600'
                    }`}>
                      <ScrollText className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-mono font-black ${isTransparent ? 'text-stone-200' : 'text-stone-800'}`}>Patch Notes</p>
                      <p className={`text-[9px] font-mono ${isTransparent ? 'text-stone-500' : 'text-stone-400'}`}>v0.2.1 — Latest</p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-colors shrink-0 ${isTransparent ? 'text-stone-600 group-hover:text-amber-400' : 'text-stone-400 group-hover:text-amber-500'}`} />
                  </Link>

                  {/* Inventory (if available) */}
                  <button
                    onClick={() => { soundService.playClick(); setShowInventory(true); setShowDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-b group text-left ${
                      isTransparent
                        ? 'hover:bg-white/5 border-stone-900'
                        : 'hover:bg-stone-50 border-stone-100'
                    }`}
                  >
                    <div className={`p-1.5 rounded-full border shrink-0 ${
                      isTransparent
                        ? 'bg-stone-900 border-stone-800 text-amber-400'
                        : 'bg-amber-50 border-amber-200 text-amber-600'
                    }`}>
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-mono font-black ${isTransparent ? 'text-stone-200' : 'text-stone-800'}`}>Inventory</p>
                      <p className={`text-[9px] font-mono ${isTransparent ? 'text-stone-500' : 'text-stone-400'}`}>Bag &amp; Items</p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-colors shrink-0 ${isTransparent ? 'text-stone-600 group-hover:text-amber-400' : 'text-stone-400 group-hover:text-amber-500'}`} />
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => { soundService.playClick(); setShowSettings(true); setShowDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors group text-left ${
                      isTransparent ? 'hover:bg-white/5' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-full border shrink-0 ${
                      isTransparent
                        ? 'bg-stone-900 border-stone-800 text-stone-300'
                        : 'bg-stone-100 border-stone-200 text-stone-600'
                    }`}>
                      <Settings className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-mono font-black ${isTransparent ? 'text-stone-200' : 'text-stone-800'}`}>Settings</p>
                      <p className={`text-[9px] font-mono ${isTransparent ? 'text-stone-500' : 'text-stone-400'}`}>Audio &amp; Save</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ── Desktop Right Actions ── */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* Active Draco badge */}
          <Link
            href="/heroes"
            onClick={() => soundService.playClick()}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-sm transition-all active:scale-95 border ${
              isTransparent
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-800'
            }`}
            title="Equipped Dragon Guardian"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{activeDracoName}</span>
            <span className="text-[10px] text-amber-300 font-black">Lv.{activeLevel}</span>
          </Link>

          {/* Tier badge */}
          <Link
            href="/membership"
            onClick={() => soundService.playClick()}
            className={`px-3 py-1 rounded-full text-[11px] font-mono font-black border transition-all shadow-sm flex items-center gap-1 ${tierColor}`}
            title="Active Membership Tier"
          >
            <span>{currentTier.toUpperCase()} TIER</span>
          </Link>

          {/* Coins */}
          <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-mono font-bold shadow-sm ${
            isTransparent
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              : 'bg-amber-50/90 border-amber-200 text-amber-700'
          }`}>
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{coins}</span>
          </div>

          {/* Inventory */}
          <button
            onClick={() => { soundService.playClick(); setShowInventory(true); }}
            className={`p-1.5 border rounded-xl shadow-sm transition-all active:scale-95 ${
              isTransparent
                ? 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
            title="Open Inventory"
          >
            <Briefcase className={`w-4 h-4 ${isTransparent ? 'text-amber-400' : 'text-amber-600'}`} />
          </button>

          {/* Settings */}
          <button
            onClick={() => { soundService.playClick(); setShowSettings(true); }}
            className={`p-1.5 border rounded-xl shadow-sm transition-all active:scale-95 group ${
              isTransparent
                ? 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
            title="Game Settings"
          >
            <Settings className={`w-4 h-4 group-hover:rotate-45 transition-transform duration-300 ${isTransparent ? 'text-white' : 'text-stone-600'}`} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            saveData={liveSaveData}
            onUpdateSettings={updateSettings}
            onResetSave={resetGameSave}
            onExportSave={exportSave}
            onImportSave={importSave}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      {showInventory && (
        <InventoryModal
          saveData={liveSaveData}
          onUsePotion={usePotion}
          onUseUpgradeStone={useUpgradeStone}
          onBuyItem={buyItem}
          onClose={() => setShowInventory(false)}
        />
      )}
    </>
  );
};
