'use client';

import React from 'react';
import { Layers, FileText, Briefcase, Sparkles } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onOpenReport: () => void;
}

export function MobileNav({ currentTab, setTab, onOpenReport }: MobileNavProps) {
  const tabs = [
    { id: 'all', label: 'Markets', icon: Layers },
    { id: 'macro', label: 'Macro', icon: FileText },
    { id: 'report', label: 'AI Brief', icon: Sparkles, action: onOpenReport },
    { id: 'paper_trade', label: 'Trade', icon: Briefcase },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d111c]/95 backdrop-blur-lg border-t border-[#1c2237] px-2 py-2 flex items-center justify-around safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.action) {
                tab.action();
              } else {
                setTab(tab.id);
              }
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-blue-400 font-semibold'
                : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-400' : 'text-[#64748b]'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
