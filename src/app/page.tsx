'use client';

import React, { useState } from 'react';
import { TickerBar } from '@/components/layout/TickerBar';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TopCards } from '@/components/dashboard/TopCards';
import { MarketTable } from '@/components/dashboard/MarketTable';
import { AiReportModal } from '@/components/dashboard/AiReportModal';
import { MARKET_DATA } from '@/data/mockData';
import { Sparkles, Bell, ArrowRight } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#090c15] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Top Global Ticker Bar */}
      <TickerBar />

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
        />

        {/* Right Main Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-20 lg:pb-6 min-h-[calc(100vh-80px)]">
          {/* Top Banner Alert (DropsTab Track peace deals / FOMC style) */}
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
                미 국채금리 4.2% 상회 속 빅테크 혼조 및 장마감 핵심 외신 4건 요약
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

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="px-3 py-1.5 rounded-lg bg-[#14192b] border border-[#1e263d] text-xs text-[#94a3b8] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>실시간 시장 감시 중</span>
              </div>
            </div>
          </div>

          {/* 4. Top Summary Metric Cards (DropsTab Style 4 Cards) */}
          <TopCards onOpenReport={() => setIsReportOpen(true)} />

          {/* 5. Main Market Data Table */}
          <MarketTable
            items={MARKET_DATA}
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

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={selectedCategory}
        setTab={setSelectedCategory}
        onOpenReport={() => setIsReportOpen(true)}
      />
    </div>
  );
}
