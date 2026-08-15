'use client';

import React from 'react';
import Link from 'next/link';
import { ScrollText } from 'lucide-react';
import { soundService } from '../services/sound';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-stone-800/80 bg-stone-950/90 backdrop-blur-xl pt-12 pb-8 z-40 select-none font-sans text-stone-100">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-8 text-left text-xs">
        {/* Brand Column */}
        <div className="space-y-3">
          <Link
            href="/"
            onClick={() => soundService.playClick()}
            className="text-lg font-black text-white flex items-center gap-1.5 font-display uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            🐉 Dracoman
          </Link>
          <p className="text-stone-400 leading-relaxed text-[11px] font-mono">
            Offline platforming dragon action RPG built with HTML5 Canvas 2D engine &amp; Next.js / React.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-black text-amber-400 uppercase tracking-wider mb-3 font-display">Quick Navigation</h4>
          <ul className="space-y-2 text-stone-400 font-mono">
            <li>
              <Link href="/" onClick={() => soundService.playClick()} className="hover:text-amber-300 transition-colors">
                Home / Overview
              </Link>
            </li>
            <li>
              <Link href="/heroes" onClick={() => soundService.playClick()} className="hover:text-amber-300 transition-colors">
                Hero Roster
              </Link>
            </li>
            <li>
              <Link href="/maps" onClick={() => soundService.playClick()} className="hover:text-amber-300 transition-colors">
                Campaign Maps
              </Link>
            </li>
            <li>
              <Link href="/membership" onClick={() => soundService.playClick()} className="hover:text-amber-300 transition-colors">
                Membership Perks
              </Link>
            </li>
          </ul>
        </div>

        {/* Info & Help */}
        <div>
          <h4 className="font-black text-amber-400 uppercase tracking-wider mb-3 font-display">Community &amp; Help</h4>
          <ul className="space-y-2 text-stone-400 font-mono">
            <li>
              <Link href="/version" onClick={() => soundService.playClick()} className="hover:text-amber-300 transition-colors">
                Patch Notes &amp; Updates
              </Link>
            </li>
            <li>
              <Link href="/admin" onClick={() => soundService.playClick()} className="hover:text-amber-300 transition-colors">
                Admin Panel &amp; Stage Editor
              </Link>
            </li>
          </ul>
        </div>

        {/* Dynamic Latest Version Tag */}
        <div>
          <h4 className="font-black text-amber-400 uppercase tracking-wider mb-3 font-display">System Version</h4>
          <Link
            href="/version"
            onClick={() => soundService.playClick()}
            className="inline-flex items-center gap-2 p-3 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-850 transition-all group"
          >
            <ScrollText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase block leading-none">Current Build</span>
              <span className="text-xs font-mono font-bold text-amber-300">v0.3.2</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-10 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-3">
        <p>© 2026 Dracoman RPG. All rights reserved.</p>
        <p>Built with Next.js 15, Tailwind CSS, &amp; HTML5 Canvas Engine</p>
      </div>
    </footer>
  );
};
