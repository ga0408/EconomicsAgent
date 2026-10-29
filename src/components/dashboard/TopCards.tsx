'use client';

import React from 'react';
import { TOP_GAINERS } from '@/data/mockData';
import { Sparkline } from '@/components/ui/Sparkline';
import { TrendingUp, TrendingDown, Sparkles, ChevronRight, Compass } from 'lucide-react';

interface TopCardsProps {
  onOpenReport?: () => void;
}

export function TopCards({ onOpenReport }: TopCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Top Gainers */}
      <div className="bg-[#121624] border border-[#1e253b] rounded-xl p-4 shadow-sm hover:border-[#2a3454] transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🚀</span>
            <span className="text-xs font-bold text-white tracking-wide">Top Gainers</span>
          </div>
          <button className="text-[11px] text-[#64748b] hover:text-blue-400 flex items-center transition-colors">
            See More <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
        <div className="space-y-2">
          {TOP_GAINERS.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#64748b] w-4">{item.rank}</span>
                <span className="text-sm">{item.icon}</span>
                <div>
                  <span className="font-semibold text-slate-200">{item.symbol}</span>
                  <span className="text-[11px] text-[#64748b] ml-1.5 hidden sm:inline">{item.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-200 font-mono text-[11px] font-medium">{item.price}</div>
                <div className="text-[#10b981] font-mono text-[11px] font-semibold flex items-center justify-end">
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                  +{item.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Macro Highlights (USD/KRW & US 10Y) */}
      <div className="bg-[#121624] border border-[#1e253b] rounded-xl p-4 shadow-sm hover:border-[#2a3454] transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-xs font-bold text-white tracking-wide">Macro Key Ratio</span>
          </div>
          <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
            Realtime
          </span>
        </div>

        <div className="space-y-3 mt-3">
          <div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-[#94a3b8]">USD/KRW 환율</span>
              <span className="text-xs font-semibold text-red-400 font-mono">+0.28%</span>
            </div>
            <div className="flex justify-between items-end mt-1">
              <div className="text-lg font-bold text-white font-mono">1,382.50 <span className="text-xs text-[#64748b] font-normal">KRW</span></div>
              <Sparkline data={[1365, 1370, 1374, 1378, 1380, 1381, 1382.5]} width={80} height={24} color="#ef4444" />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e253b]">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-[#94a3b8]">미국 10Y 국채금리</span>
              <span className="text-xs font-semibold text-red-400 font-mono">+0.95%</span>
            </div>
            <div className="flex justify-between items-end mt-1">
              <div className="text-lg font-bold text-white font-mono">4.24%</div>
              <Sparkline data={[4.05, 4.08, 4.12, 4.18, 4.21, 4.22, 4.24]} width={80} height={24} color="#ef4444" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Fear & Sentiment Gauge */}
      <div className="bg-[#121624] border border-[#1e253b] rounded-xl p-4 shadow-sm hover:border-[#2a3454] transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white tracking-wide">Market Sentiment</span>
          </div>
          <span className="text-[11px] text-[#64748b]">24h Trend</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="text-[11px] text-[#94a3b8]">Fear & Greed Index</div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              62 <span className="text-xs text-[#94a3b8] font-semibold">Greed</span>
            </div>
            <div className="text-[10px] text-[#64748b] mt-1">전일: 58 (Neutral)</div>
          </div>

          {/* Simple Radial Gauge / Circle */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#1e253b" strokeWidth="6" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#f59e0b"
                strokeWidth="6"
                strokeDasharray="163.3"
                strokeDashoffset={163.3 * (1 - 62 / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-bold text-amber-400">62%</span>
          </div>
        </div>

        <div className="mt-4 pt-2.5 border-t border-[#1e253b] flex items-center justify-between text-[11px]">
          <span className="text-[#94a3b8]">BTC Dominance</span>
          <span className="text-white font-mono font-semibold">58.4% (+0.2%)</span>
        </div>
      </div>

      {/* Card 4: AI Daily Brief Highlight (DropsTab New Activities Style) */}
      <div className="bg-[#121624] border border-blue-500/30 rounded-xl p-4 shadow-sm hover:border-blue-500/60 transition-all relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tracking-wide">오늘 밤 핵심 체크포인트</span>
            </div>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
              AI Summary
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed line-clamp-3 mt-1.5">
            미 국채금리 4.2% 상회에도 엔비디아 등 반도체 밸류체인 견조. 오늘 밤 PCE 물가지수 및 미 대선 여론조사 추이에 따른 변동성 대비 필요.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="mt-3 w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold rounded-lg border border-blue-500/30 transition-all flex items-center justify-center gap-1"
        >
          <span>AI 모닝 브리프 전체보기</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
