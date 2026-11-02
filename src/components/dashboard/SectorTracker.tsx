'use client';

import React, { useState } from 'react';
import { SectorApiResponse, SectorItem } from '@/types';
import {
  TrendingUp,
  TrendingDown,
  Compass,
  Flame,
  Crown,
  Snowflake,
  Info,
} from 'lucide-react';

interface SectorTrackerProps {
  data: SectorApiResponse | null;
  onSelectSector?: (symbol: string) => void;
}

export function SectorTracker({ data, onSelectSector }: SectorTrackerProps) {
  const [timeframe, setTimeframe] = useState<'1w' | '1m' | '1d'>('1w');

  if (!data || !data.sectors || data.sectors.length === 0) {
    return (
      <div className="bg-[#101422] border border-[#1e253b] rounded-xl p-6 text-center text-xs text-[#64748b]">
        11대 GICS 섹터 자금 흐름 데이터를 수신 중입니다...
      </div>
    );
  }

  // 선택된 기간 기준으로 정렬
  const sortedSectors = [...data.sectors].sort((a, b) => {
    if (timeframe === '1w') return b.change1w - a.change1w;
    if (timeframe === '1m') return b.change1m - a.change1m;
    return b.change1d - a.change1d;
  });

  const topSector = sortedSectors[0];
  const bottomSector = sortedSectors[sortedSectors.length - 1];

  const getChangeValue = (item: SectorItem) => {
    if (timeframe === '1w') return item.change1w;
    if (timeframe === '1m') return item.change1m;
    return item.change1d;
  };

  const getStatusBadge = (item: SectorItem) => {
    if (item.status === 'LEADER') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Crown className="w-3 h-3 text-amber-400" />
          <span>주도 섹터</span>
        </span>
      );
    }
    if (item.status === 'ROTATION') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
          <Flame className="w-3 h-3 text-orange-400" />
          <span>순환매 유입</span>
        </span>
      );
    }
    if (item.status === 'LAGGING') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <Snowflake className="w-3 h-3 text-blue-400" />
          <span>자금 이탈</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
        중립
      </span>
    );
  };

  return (
    <div className="bg-[#101422] border border-[#1e253b] rounded-xl overflow-hidden shadow-lg mb-6">
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#1c2237] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0d101c]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                11대 GICS 섹터 자금 흐름 & 순환매 모니터 (Sector Rotation)
              </h2>
              <span className="text-[10px] bg-orange-500/10 text-orange-400 font-semibold px-2 py-0.5 rounded border border-orange-500/20">
                Selah Rule 02
              </span>
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">
              주가 동력의 80%는 시장과 섹터에 있습니다. 자금이 들어오는 주도 섹터(A-List)를 식별합니다.
            </p>
          </div>
        </div>

        {/* Timeframe Toggle Buttons */}
        <div className="flex items-center gap-1 self-start md:self-auto bg-[#161a29] p-1 rounded-lg border border-[#232a42]">
          <button
            onClick={() => setTimeframe('1w')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              timeframe === '1w'
                ? 'bg-blue-600 text-white shadow'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            주간 (1W 기준)
          </button>
          <button
            onClick={() => setTimeframe('1m')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              timeframe === '1m'
                ? 'bg-blue-600 text-white shadow'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            월간 (1M 기준)
          </button>
          <button
            onClick={() => setTimeframe('1d')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              timeframe === '1d'
                ? 'bg-blue-600 text-white shadow'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            당일 (1D 기준)
          </button>
        </div>
      </div>

      {/* 2. Top Summary Quick Callout Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-[#0a0d18] border-b border-[#1c2237] text-xs">
        <div className="p-3 rounded-lg bg-[#121626] border border-[#1f263d] flex items-center justify-between">
          <div>
            <span className="text-[#64748b] text-[11px] block">현재 시장 체제 (Breadth)</span>
            <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {data.marketBreadth.regimeLabel}
            </span>
          </div>
          <div className="text-right font-mono text-[11px]">
            <span className="text-emerald-400 font-bold">상승 {data.marketBreadth.advancingCount}</span>
            <span className="text-[#64748b] mx-1">/</span>
            <span className="text-red-400 font-bold">하락 {data.marketBreadth.decliningCount}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#121626] border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-[#64748b] text-[11px] block">자금 유입 1위 주도 섹터</span>
            <span className="text-sm font-bold text-amber-300 mt-0.5 block">
              👑 {topSector.nameKo} ({topSector.symbol})
            </span>
          </div>
          <div className="text-right font-mono">
            <span
              className={`text-sm font-bold ${
                getChangeValue(topSector) >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}
            >
              {getChangeValue(topSector) >= 0 ? '+' : ''}
              {getChangeValue(topSector)}%
            </span>
            <span className="text-[10px] text-[#64748b] block">{timeframe.toUpperCase()} 수익률</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#121626] border border-blue-500/20 flex items-center justify-between">
          <div>
            <span className="text-[#64748b] text-[11px] block">자금 이탈/소외 섹터</span>
            <span className="text-sm font-bold text-slate-300 mt-0.5 block">
              ❄️ {bottomSector.nameKo} ({bottomSector.symbol})
            </span>
          </div>
          <div className="text-right font-mono">
            <span
              className={`text-sm font-bold ${
                getChangeValue(bottomSector) >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}
            >
              {getChangeValue(bottomSector) >= 0 ? '+' : ''}
              {getChangeValue(bottomSector)}%
            </span>
            <span className="text-[10px] text-[#64748b] block">{timeframe.toUpperCase()} 수익률</span>
          </div>
        </div>
      </div>

      {/* 3. Visual Performance Bars & Table */}
      <div className="p-4 sm:p-5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748b] px-2 mb-1 uppercase tracking-wider">
          <span>섹터 및 대표 ETF</span>
          <div className="flex items-center gap-8">
            <span className="hidden md:inline">S&P500 비중</span>
            <span className="hidden sm:inline">대표 핵심 종목</span>
            <span className="w-24 text-right">{timeframe.toUpperCase()} 수익률</span>
          </div>
        </div>

        {sortedSectors.map((sec, index) => {
          const val = getChangeValue(sec);
          const isUp = val >= 0;
          const maxAbs = Math.max(...sortedSectors.map((s) => Math.abs(getChangeValue(s)))) || 1;
          const barWidthPercent = Math.min(100, Math.round((Math.abs(val) / maxAbs) * 100));

          return (
            <div
              key={sec.symbol}
              onClick={() => {
                if (onSelectSector) onSelectSector(sec.symbol);
              }}
              className="p-3 rounded-xl bg-[#13182a] border border-[#1e263f] hover:border-blue-500/50 hover:bg-[#161d33] transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {/* Left: Rank + Symbol + Korean Name + Badge */}
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-mono text-xs font-bold text-[#64748b] group-hover:text-white">
                    {index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#1c233a] border border-[#273252] flex items-center justify-center font-bold text-xs text-white group-hover:border-blue-500 transition-colors">
                    {sec.symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        {sec.nameKo}
                      </span>
                      <span className="text-[11px] text-[#64748b] font-mono hidden md:inline">
                        ({sec.name})
                      </span>
                      {getStatusBadge(sec)}
                    </div>
                    <div className="text-[11px] text-[#64748b] flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-slate-300 font-semibold">{sec.displayPrice}</span>
                      <span>·</span>
                      <span>1D: {sec.change1d >= 0 ? '+' : ''}{sec.change1d}%</span>
                      <span>·</span>
                      <span>1W: {sec.change1w >= 0 ? '+' : ''}{sec.change1w}%</span>
                      <span>·</span>
                      <span>1M: {sec.change1m >= 0 ? '+' : ''}{sec.change1m}%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Weight, Leading Stocks, Value & Relative Bar */}
                <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                  <div className="hidden md:block text-right">
                    <span className="text-xs font-mono font-medium text-slate-300">{sec.weight}</span>
                    <span className="text-[10px] text-[#64748b] block">시장 비중</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1">
                    {sec.leadingStocks.slice(0, 3).map((stock) => (
                      <span
                        key={stock}
                        className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#1e253c] text-slate-300 border border-[#2a3454]"
                      >
                        {stock}
                      </span>
                    ))}
                  </div>

                  <div className="text-right w-24">
                    <div
                      className={`text-sm font-bold font-mono flex items-center justify-end ${
                        isUp ? 'text-[#10b981]' : 'text-[#ef4444]'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                      {isUp ? '+' : ''}
                      {val.toFixed(2)}%
                    </div>
                    {/* Visual Progress Mini Bar */}
                    <div className="w-full bg-[#1e253c] h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUp ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${barWidthPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Educational Footer Note (Selah Rule 2 Guide) */}
      <div className="px-5 py-3.5 bg-[#0b0e1b] border-t border-[#1c2237] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#64748b]">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>스윙 실전 원칙:</strong> 상위 1~3위 주도 섹터(A-List)에 속한 대형주만 매수 타점을 잡아야 승률이 극대화됩니다.
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#64748b] self-end sm:self-auto">
          마지막 갱신: {data.lastUpdated}
        </span>
      </div>
    </div>
  );
}
