'use client';

import React from 'react';
import { TOP_GAINERS as DEFAULT_GAINERS } from '@/data/mockData';
import { TopGainerItem } from '@/types';
import { Sparkline } from '@/components/ui/Sparkline';
import { TrendingUp, TrendingDown, Sparkles, ChevronRight, Compass } from 'lucide-react';

interface TopCardsProps {
  onOpenReport?: () => void;
  topGainers?: TopGainerItem[];
  macroKeyRatio?: {
    usdKrw: { price: number; change: number; sparkline: number[] };
    us10y: { price: number; change: number; sparkline: number[] };
  };
  fearAndGreed?: {
    value: number;
    classification: string;
  };
  btcDominance?: number;
}

export function TopCards({
  onOpenReport,
  topGainers = DEFAULT_GAINERS,
  macroKeyRatio,
  fearAndGreed = { value: 62, classification: 'Greed' },
  btcDominance = 58.4,
}: TopCardsProps) {
  const usdPrice = macroKeyRatio?.usdKrw?.price?.toFixed(2) || '1,337.50';
  const usdChange = macroKeyRatio?.usdKrw?.change || 0.15;
  const usdSparkline = macroKeyRatio?.usdKrw?.sparkline || [1330, 1332, 1335, 1334, 1336, 1337.5];

  const us10yPrice = macroKeyRatio?.us10y?.price?.toFixed(2) || '4.24';
  const us10yChange = macroKeyRatio?.us10y?.change || 0.85;
  const us10ySparkline = macroKeyRatio?.us10y?.sparkline || [4.15, 4.18, 4.2, 4.22, 4.24];

  const fgValue = fearAndGreed.value;
  const fgColor = fgValue >= 75 ? '#10b981' : fgValue >= 55 ? '#34d399' : fgValue >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Top Gainers */}
      <div className="bg-[#121624] border border-[#1e253b] rounded-xl p-4 shadow-sm hover:border-[#2a3454] transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🚀</span>
            <span className="text-xs font-bold text-white tracking-wide">Top Gainers</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold">
            Live
          </span>
        </div>
        <div className="space-y-2">
          {topGainers.slice(0, 4).map((item) => (
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
                <div
                  className={`font-mono text-[11px] font-semibold flex items-center justify-end ${
                    item.change >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                  }`}
                >
                  {item.change >= 0 ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                  )}
                  {item.change >= 0 ? '+' : ''}
                  {item.change}%
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
              <span
                className={`text-xs font-semibold font-mono ${
                  usdChange >= 0 ? 'text-red-400' : 'text-blue-400'
                }`}
              >
                {usdChange >= 0 ? '+' : ''}
                {usdChange}%
              </span>
            </div>
            <div className="flex justify-between items-end mt-1">
              <div className="text-lg font-bold text-white font-mono">
                {usdPrice} <span className="text-xs text-[#64748b] font-normal">KRW</span>
              </div>
              <Sparkline
                data={usdSparkline}
                width={80}
                height={24}
                color={usdChange >= 0 ? '#ef4444' : '#3b82f6'}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e253b]">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-[#94a3b8]">미국 10Y 국채금리</span>
              <span
                className={`text-xs font-semibold font-mono ${
                  us10yChange >= 0 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {us10yChange >= 0 ? '+' : ''}
                {us10yChange}%
              </span>
            </div>
            <div className="flex justify-between items-end mt-1">
              <div className="text-lg font-bold text-white font-mono">{us10yPrice}%</div>
              <Sparkline
                data={us10ySparkline}
                width={80}
                height={24}
                color={us10yChange >= 0 ? '#ef4444' : '#10b981'}
              />
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
          <span className="text-[11px] text-[#64748b]">Alternative.me</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="text-[11px] text-[#94a3b8]">Fear & Greed Index</div>
            <div className="text-2xl font-black mt-1" style={{ color: fgColor }}>
              {fgValue}{' '}
              <span className="text-xs text-[#94a3b8] font-semibold">
                {fearAndGreed.classification}
              </span>
            </div>
            <div className="text-[10px] text-[#64748b] mt-1">실시간 암호화폐 시장 심리</div>
          </div>

          {/* Radial Gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#1e253b" strokeWidth="6" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke={fgColor}
                strokeWidth="6"
                strokeDasharray="163.3"
                strokeDashoffset={163.3 * (1 - Math.min(100, Math.max(0, fgValue)) / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-bold" style={{ color: fgColor }}>
              {fgValue}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-2.5 border-t border-[#1e253b] flex items-center justify-between text-[11px]">
          <span className="text-[#94a3b8]">BTC Dominance</span>
          <span className="text-white font-mono font-semibold">{btcDominance}%</span>
        </div>
      </div>

      {/* Card 4: AI Daily Brief Highlight */}
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
            미 국채금리 변동 및 원/달러 환율 1,330원대 유지 속, 반도체 대형주 중심 외인 수급 탐색 구간. 금일 밤 주요 매크로 일정 대비 필요.
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
