'use client';

import React from 'react';
import { Search, Star, Settings, Sparkles, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  onOpenReport?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Header({ onOpenReport, searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#0d111c]/95 backdrop-blur-md border-b border-[#1c2237] px-4 py-3 flex items-center justify-between gap-4">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-black text-lg tracking-tighter">M</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-white tracking-tight">MacroTab</span>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 font-semibold px-1.5 py-0.5 rounded border border-blue-500/20">
              PRO
            </span>
          </div>
        </div>
      </div>

      {/* Global Search Bar (DropsTab Style) */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Stock, Crypto, Macro Indicator or Event..."
            className="w-full bg-[#161a29] border border-[#232a42] text-sm text-[#e2e8f0] placeholder-[#64748b] rounded-lg pl-10 pr-12 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <div className="absolute right-3 px-1.5 py-0.5 rounded bg-[#232a42] text-[11px] text-[#94a3b8] font-mono border border-[#2e3756]">
            /
          </div>
        </div>
      </div>

      {/* Action Buttons & Navigation */}
      <div className="flex items-center gap-3">
        {/* AI Brief Button */}
        <button
          onClick={onOpenReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>오늘의 AI 브리프</span>
        </button>

        {/* Quick Icons */}
        <button className="p-2 text-[#94a3b8] hover:text-white hover:bg-[#161a29] rounded-lg transition-colors">
          <Star className="w-4 h-4" />
        </button>
        <button className="p-2 text-[#94a3b8] hover:text-white hover:bg-[#161a29] rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
        </button>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1c2237]">
          <button className="px-3 py-1.5 text-xs font-medium text-[#cbd5e1] hover:text-white rounded-lg transition-colors">
            Login
          </button>
          <button className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-sm">
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
