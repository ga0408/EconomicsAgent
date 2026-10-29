'use client';

import React, { useState } from 'react';
import { MOCK_REPORTS, ReportItem } from '@/data/mockData';
import { X, Sparkles, Calendar, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiReportModal({ isOpen, onClose }: AiReportModalProps) {
  const [selectedReport, setSelectedReport] = useState<ReportItem>(MOCK_REPORTS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101423] border border-[#232b45] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1c2339] flex items-center justify-between bg-[#0c0f1c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AI 거시경제 & 마켓 브리핑 리포트
                <span className="text-[10px] bg-blue-500/10 text-blue-400 font-semibold px-2 py-0.5 rounded border border-blue-500/20">
                  Daily Auto-Generated
                </span>
              </h2>
              <p className="text-xs text-[#64748b]">
                장마감 후 글로벌 뉴스 및 거시지표를 LLM 에이전트가 자동 분석하여 제공합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748b] hover:text-white hover:bg-[#1a2138] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left tabs + Right content */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Left: Report list */}
          <div className="border-r border-[#1c2339] bg-[#0c0f1c] p-3 overflow-y-auto space-y-2">
            <div className="text-[11px] font-bold text-[#475569] uppercase tracking-wider px-2 py-1">
              최근 발행 리포트
            </div>
            {MOCK_REPORTS.map((rep) => {
              const isSelected = selectedReport.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#181f34] border-blue-500/50 shadow-md'
                      : 'bg-[#121626] border-[#1e263d] hover:border-[#2d3a5e] text-[#94a3b8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-blue-400 font-semibold">{rep.category}</span>
                    <span className="text-[#64748b]">{rep.readTime}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {rep.title}
                  </h4>
                  <div className="text-[10px] text-[#64748b] mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{rep.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed report content */}
          <div className="col-span-2 p-6 overflow-y-auto bg-[#101423] space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded border border-blue-500/30">
                  {selectedReport.category}
                </span>
                <span className="text-xs text-[#64748b] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedReport.date}
                </span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-medium px-2 py-0.5 rounded ml-auto">
                  시장 영향: {selectedReport.impact}
                </span>
              </div>
              <h1 className="text-lg font-bold text-white leading-tight">
                {selectedReport.title}
              </h1>
            </div>

            {/* AI Summary Box */}
            <div className="p-4 rounded-xl bg-[#141a2e] border border-blue-500/30">
              <div className="text-xs font-bold text-blue-400 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Summary (요약)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedReport.summary}
              </p>
            </div>

            {/* Key Bullet Points */}
            <div>
              <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2.5">
                주요 핵심 포인트 (Takeaways)
              </h3>
              <div className="space-y-2">
                {selectedReport.highlights.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#14192b] border border-[#1e263d] text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Swing Trade Strategy Note */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/30 text-xs">
              <span className="font-bold text-blue-300 block mb-1">
                🎯 트레이더를 위한 스윙/매크로 코멘트
              </span>
              <p className="text-[#94a3b8] leading-relaxed">
                단기 금리 급등 구간에서는 무리한 레버리지 추격 매수보다는 20일 이동평균선 지지 여부를 확인하는 분할 매매가 유리합니다. 원/달러 환율 1,380원 상단 돌파 시 외국인 선물 매도 압력에 유의하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#1c2339] bg-[#0c0f1c] flex items-center justify-between text-xs text-[#64748b]">
          <span>Powered by Gemini 2.0 Flash + Yahoo Finance & FRED Data Pipeline</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1c233b] hover:bg-[#252f4c] text-white font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
