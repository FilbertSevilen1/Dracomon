'use client';

import React from 'react';
import Link from 'next/link';
import { ScrollText } from 'lucide-react';
import { soundService } from '../services/sound';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-stone-200 bg-white/80 backdrop-blur-md pt-12 pb-8 z-40 select-none font-sans">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-8 text-left text-xs">
        {/* Brand Column */}
        <div className="space-y-3">
          <Link
            href="/"
            onClick={() => soundService.playClick()}
            className="text-lg font-black text-stone-900 flex items-center gap-1 font-display hover:opacity-90 transition-opacity"
          >
            🐉 Dracoman
          </Link>
          <p className="text-stone-500 leading-relaxed text-[11px]">
            Offline platforming dragon action RPG built with HTML5 Canvas 2D engine &amp; Next.js / React.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-extrabold text-stone-900 uppercase tracking-wider mb-3 font-mono">Quick Navigation</h4>
          <ul className="space-y-2 text-stone-500 font-semibold">
            <li>
              <Link href="/" onClick={() => soundService.playClick()} className="hover:text-amber-600 transition-colors">
                Home / Overview
              </Link>
            </li>
            <li>
              <Link href="/heroes" onClick={() => soundService.playClick()} className="hover:text-amber-600 transition-colors">
                Hero Roster
              </Link>
            </li>
            <li>
              <Link href="/maps" onClick={() => soundService.playClick()} className="hover:text-amber-600 transition-colors">
                Campaign Maps
              </Link>
            </li>
            <li>
              <Link href="/membership" onClick={() => soundService.playClick()} className="hover:text-amber-600 transition-colors">
                Membership Perks
              </Link>
            </li>
          </ul>
        </div>

        {/* Info & Help */}
        <div>
          <h4 className="font-extrabold text-stone-900 uppercase tracking-wider mb-3 font-mono">Community &amp; Help</h4>
          <ul className="space-y-2 text-stone-500 font-semibold">
            <li>
              <Link href="/version" onClick={() => soundService.playClick()} className="hover:text-amber-600 transition-colors">
                Patch Notes &amp; Updates
              </Link>
            </li>
            <li>
              <Link href="/#faq" onClick={() => soundService.playClick()} className="hover:text-amber-600 transition-colors">
                FAQ &amp; Guide
              </Link>
            </li>
            <li>
              <Link href="/#contact" onClick={() => soundService.playClick()} className="hover:text-amber-600 transition-colors">
                Developer Guild
              </Link>
            </li>
          </ul>
        </div>

        {/* Release Info */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-stone-900 uppercase tracking-wider font-mono">Release Info</h4>
          <p className="text-stone-400 text-[11px] font-mono">
            Version: <strong className="text-stone-700">v0.2.4 Lunar Goddess</strong> <br />
            Stack: React 19, Next.js 15, Canvas 2D
          </p>
          <Link
            href="/version"
            onClick={() => soundService.playClick()}
            className="px-4 py-2 bg-rose-950 text-rose-300 border border-rose-700 hover:bg-rose-900 rounded-xl text-[11px] font-mono font-black transition-all inline-flex items-center gap-1.5 shadow-sm"
          >
            <ScrollText className="w-3.5 h-3.5 text-rose-400" />
            View Patch Notes
          </Link>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-stone-100 text-center text-[11px] text-stone-400 font-mono">
        © {new Date().getFullYear()} Dracoman RPG • FilbertSevilen1. All rights reserved.
      </div>
    </footer>
  );
};
