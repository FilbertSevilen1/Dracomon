'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, Briefcase, Sparkles, Shield, Crown } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { storageService } from '../services/storage';
import { soundService } from '../services/sound';
import { SaveData } from '../types/game';

interface NavbarProps {
  onOpenInventory?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInventory }) => {
  const pathname = usePathname();
  const { saveData } = useGameState();
  const [liveSaveData, setLiveSaveData] = useState<SaveData>(saveData);

  useEffect(() => {
    setLiveSaveData(saveData);
  }, [saveData]);

  useEffect(() => {
    const handleUpdate = () => {
      const freshData = storageService.loadGame();
      setLiveSaveData(freshData);
    };

    window.addEventListener('dracomon_save_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('dracomon_save_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const activeDracoName = liveSaveData.selectedDraco || 'Jumpmon';
  const activeDraco = liveSaveData.dracos[activeDracoName];
  const activeLevel = activeDraco?.level || 1;
  const coins = liveSaveData.player.coins;
  const currentTier = liveSaveData.tier || 'Free';

  const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Heroes', href: '/heroes' },
    { label: 'Maps', href: '/maps' },
    { label: 'Membership', href: '/membership' },
    { label: 'Patch Notes', href: '/version' },
  ];

  return (
    <header className="sticky top-0 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md px-4 md:px-8 py-3 flex items-center justify-between z-50 shadow-sm select-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          onClick={() => soundService.playClick()}
          className="text-lg md:text-xl font-black tracking-tight text-stone-900 flex items-center gap-2 font-mono hover:opacity-90 transition-opacity"
        >
          <span>🐉 DRACOMON</span>
          <span className="text-amber-500 font-extrabold text-sm md:text-base">RPG</span>
        </Link>
      </div>

      {/* Center Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-stone-600">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => soundService.playClick()}
              className={`transition-colors ${
                isActive
                  ? 'text-amber-600 font-black border-b-2 border-amber-500 pb-0.5'
                  : 'hover:text-amber-600'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Utility Bar */}
      <div className="flex items-center gap-2.5">
        {/* Selected Hero Badge */}
        <Link
          href="/heroes"
          onClick={() => soundService.playClick()}
          className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-mono font-bold shadow-sm transition-all active:scale-95 border border-stone-800"
          title="Equipped Dragon Guardian (Click to swap)"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{activeDracoName}</span>
          <span className="text-[10px] text-amber-300 font-black">Lv.{activeLevel}</span>
        </Link>

        {/* Membership Tier Badge */}
        <Link
          href="/membership"
          onClick={() => soundService.playClick()}
          className={`px-3 py-1 rounded-full text-[11px] font-mono font-black border transition-all shadow-sm flex items-center gap-1 ${
            currentTier === 'Premium'
              ? 'bg-purple-600 text-white border-purple-400'
              : currentTier === 'Basic'
              ? 'bg-emerald-600 text-white border-emerald-400'
              : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
          }`}
          title="Active Membership Tier"
        >
          <span>{currentTier.toUpperCase()} TIER</span>
        </Link>

        {/* Coins Balance */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50/90 border border-amber-200 rounded-full text-xs font-mono font-bold text-amber-700 shadow-sm">
          <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{coins}</span>
        </div>

        {/* Inventory Bag Button */}
        {onOpenInventory && (
          <button
            onClick={() => {
              soundService.playClick();
              onOpenInventory();
            }}
            className="p-1.5 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-stone-700 shadow-sm transition-all active:scale-95 flex items-center gap-1 text-xs font-bold"
            title="Open Inventory"
          >
            <Briefcase className="w-4 h-4 text-amber-600" />
          </button>
        )}
      </div>
    </header>
  );
};
