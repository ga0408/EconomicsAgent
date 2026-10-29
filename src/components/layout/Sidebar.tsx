'use client';

import React from 'react';
import {
  Layers,
  Globe2,
  TrendingUp,
  Coins,
  FileText,
  Calendar,
  Crosshair,
  Briefcase,
  Star,
  Newspaper,
  Flame,
  PieChart,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge: string | null;
  onClick?: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  currentCategory: string;
  setCategory: (cat: string) => void;
  onOpenReport?: () => void;
}

export function Sidebar({ currentCategory, setCategory, onOpenReport }: SidebarProps) {
  const navSections: NavSection[] = [
    {
      title: 'MARKETS',
      items: [
        { id: 'all', label: 'All Markets', icon: Layers, badge: null },
        { id: 'macro', label: '거시경제 지표', icon: Globe2, badge: null },
        { id: 'us_stock', label: '미국 주식', icon: TrendingUp, badge: null },
        { id: 'kr_stock', label: '한국 주식', icon: PieChart, badge: null },
        { id: 'crypto', label: '가상자산 (코인)', icon: Coins, badge: null },
      ],
    },
    {
      title: 'AI INTELLIGENCE',
      items: [
        { id: 'morning_brief', label: '모닝 브리프', icon: FileText, badge: 'Daily', onClick: onOpenReport },
        { id: 'market_close', label: '장마감 리포트', icon: Newspaper, badge: 'Daily', onClick: onOpenReport },
        { id: 'macro_events', label: '매크로 캘린더', icon: Calendar, badge: 'FOMC/CPI' },
      ],
    },
    {
      title: 'TRADING & TOOLS',
      items: [
        { id: 'paper_trade', label: '모의 트레이딩', icon: Crosshair, badge: 'Beta' },
        { id: 'swing_radar', label: '스윙 레이더', icon: Flame, badge: 'New' },
        { id: 'watchlist', label: '관심 종목', icon: Star, badge: null },
        { id: 'portfolio', label: '내 포트폴리오', icon: Briefcase, badge: null },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0d111c] border-r border-[#1c2237] flex flex-col justify-between p-3 select-none shrink-0 min-h-[calc(100vh-80px)]">
      <div className="space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="text-[11px] font-bold text-[#475569] tracking-wider px-3 mb-2 uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentCategory === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        setCategory(item.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1e2538] text-white font-semibold shadow-sm'
                        : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#141824]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-blue-400' : 'text-[#64748b]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          item.badge === 'Beta' || item.badge === 'New'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer info */}
      <div className="p-3 bg-[#131725] rounded-xl border border-[#1e253b] text-[11px] text-[#64748b] space-y-1">
        <div className="flex items-center justify-between text-slate-300 font-semibold">
          <span>AI Engine</span>
          <span className="text-emerald-400 text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
        <p className="text-[10px] text-[#64748b] leading-tight">
          Next update: 미국 장마감 (익일 06:00 KST)
        </p>
      </div>
    </aside>
  );
}
