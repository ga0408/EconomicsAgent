'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TickerBar } from '@/components/layout/TickerBar';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TopCards } from '@/components/dashboard/TopCards';
import { MarketTable } from '@/components/dashboard/MarketTable';
import { AiReportModal } from '@/components/dashboard/AiReportModal';
import { PaperTradingModal } from '@/components/trading/PaperTradingModal';
import { MARKET_DATA as FALLBACK_MARKET, TICKER_DATA as FALLBACK_TICKER, TOP_GAINERS as FALLBACK_GAINERS } from '@/data/mockData';
import { MarketApiResponse } from '@/types';
import { ArrowRight, RefreshCw } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isPaperTradeOpen, setIsPaperTradeOpen] = useState<boolean>(false);

  // 실시간 API 데이터 상태
  const [marketData, setMarketData] = useState<MarketApiResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // API 호출 함수
  const fetchMarketData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/market');
      if (!res.ok) throw new Error('API request failed');
      const data: MarketApiResponse = await res.json();
      setMarketData(data);
    } catch (err) {
      console.error('Failed to fetch real market data:', err);
    } finally {
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, []);

  // 마운트 시 1회 호출 + 60초 주기 자동 갱신
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(() => {
      fetchMarketData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // 바인딩할 데이터 (실시간 데이터 우선, 없으면 fallback)
  const currentTickerData = marketData?.tickerData || FALLBACK_TICKER;
  const currentMarketData = marketData?.marketData || FALLBACK_MARKET;
  const currentTopGainers = marketData?.topGainers || FALLBACK_GAINERS;

  return (
    <div className="min-h-screen bg-[#090c15] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Top Global Ticker Bar */}
      <TickerBar items={currentTickerData} />

      {/* 2. Main Navigation Header */}
      <Header
        onOpenReport={() => setIsReportOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 3. Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentCategory={selectedCategory}
          setCategory={setSelectedCategory}
          onOpenReport={() => setIsReportOpen(true)}
          onOpenPaperTrade={() => setIsPaperTradeOpen(true)}
        />

        {/* Right Main Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-20 lg:pb-6 min-h-[calc(100vh-80px)]">
          {/* Top Banner Alert */}
          <div className="mb-6 p-3 px-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/30 flex items-center justify-between text-xs shadow-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="font-semibold text-white">
                오늘의 모닝 브리프 발행 완료:
              </span>
              <span className="text-[#94a3b8] hidden sm:inline">
                국채금리 변동성 및 원/달러 환율 추이 속 외인/기관 수급 분석
              </span>
            </div>
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold transition-colors shrink-0"
            >
              <span>리포트 읽기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hero Header Section */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Global Macro & Market Terminal
              </h1>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                한국/미국 주식, 암호화폐, 거시경제 지표 실시간 추적 및 데일리 AI 리포트
              </p>
            </div>

            {/* Quick Status Pill & Manual Refresh */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => fetchMarketData(true)}
                disabled={isRefreshing}
                className="px-2.5 py-1.5 rounded-lg bg-[#14192b] border border-[#1e263d] hover:border-blue-500/50 text-xs text-[#94a3b8] hover:text-white flex items-center gap-1.5 transition-all"
                title="실시간 시세 새로고침"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`}
                />
                <span className="text-[11px]">
                  {marketData?.lastUpdated ? `${marketData.lastUpdated} 갱신` : '새로고침'}
                </span>
              </button>

              <div className="px-3 py-1.5 rounded-lg bg-[#14192b] border border-[#1e263d] text-xs text-[#94a3b8] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-medium text-emerald-400 text-[11px]">LIVE</span>
              </div>
            </div>
          </div>

          {/* 4. Top Summary Metric Cards */}
          <TopCards
            onOpenReport={() => setIsReportOpen(true)}
            topGainers={currentTopGainers}
            macroKeyRatio={marketData?.macroKeyRatio}
            fearAndGreed={marketData?.fearAndGreed}
            btcDominance={marketData?.btcDominance}
          />

          {/* 5. Main Market Data Table */}
          <MarketTable
            items={currentMarketData}
            selectedCategory={selectedCategory}
            setCategory={setSelectedCategory}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      {/* AI Daily Report Modal */}
      <AiReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* Selah Paper Trading Modal */}
      <PaperTradingModal
        isOpen={isPaperTradeOpen}
        onClose={() => setIsPaperTradeOpen(false)}
        marketItems={currentMarketData}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={selectedCategory}
        setTab={setSelectedCategory}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenPaperTrade={() => setIsPaperTradeOpen(true)}
      />
    </div>
  );
}
