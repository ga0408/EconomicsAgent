'use client';

import React, { useState, useEffect } from 'react';
import { SWING_PRESETS, evaluateSwingPosition } from '@/data/swingTradeRules';
import { MarketItem } from '@/types';
import {
  X,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface Position {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  entryDate: string;
}

interface TradeLog {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  total: number;
  pnl?: number;
  date: string;
}

interface PaperTradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketItems: MarketItem[];
}

const INITIAL_CASH = 100000; // $100,000

export function PaperTradingModal({ isOpen, onClose, marketItems }: PaperTradingModalProps) {
  const [cash, setCash] = useState<number>(INITIAL_CASH);
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradeLogs, setTradeLogs] = useState<TradeLog[]>([]);

  // 주문 폼 상태
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [orderQuantity, setOrderQuantity] = useState<number>(10);
  const [orderTab, setOrderTab] = useState<'BUY' | 'SELL'>('BUY');
  const [activeTab, setActiveTab] = useState<'TRADE' | 'POSITIONS' | 'HISTORY'>('TRADE');

  // 로컬 스토리지에서 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCash = localStorage.getItem('paper_trade_cash');
      const savedPositions = localStorage.getItem('paper_trade_positions');
      const savedLogs = localStorage.getItem('paper_trade_logs');

      if (savedCash) setCash(parseFloat(savedCash));
      if (savedPositions) {
        try {
          setPositions(JSON.parse(savedPositions));
        } catch {
          // ignore
        }
      }
      if (savedLogs) {
        try {
          setTradeLogs(JSON.parse(savedLogs));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // 로컬 스토리지에 저장
  const saveState = (newCash: number, newPositions: Position[], newLogs: TradeLog[]) => {
    setCash(newCash);
    setPositions(newPositions);
    setTradeLogs(newLogs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('paper_trade_cash', newCash.toString());
      localStorage.setItem('paper_trade_positions', JSON.stringify(newPositions));
      localStorage.setItem('paper_trade_logs', JSON.stringify(newLogs));
    }
  };

  // 계좌 초기화
  const handleReset = () => {
    if (confirm('모의투자 계좌를 초기 상태($100,000)로 리셋하시겠습니까?')) {
      saveState(INITIAL_CASH, [], []);
    }
  };

  // 현재 선택된 종목의 실시간 시세
  const currentAsset = marketItems.find((m) => m.symbol === selectedSymbol || m.id === selectedSymbol.toLowerCase());
  const currentPrice = currentAsset?.price || 140.0;
  const swingPreset = SWING_PRESETS[selectedSymbol] || {
    symbol: selectedSymbol,
    name: currentAsset?.name || selectedSymbol,
    sector: currentAsset?.categoryLabel || 'General',
    sectorEtf: 'SPY',
    atr14Percent: 3.0,
    s2: Number((currentPrice * 0.92).toFixed(2)),
    s1: Number((currentPrice * 0.96).toFixed(2)),
    r1: Number((currentPrice * 1.05).toFixed(2)),
    r2: Number((currentPrice * 1.1).toFixed(2)),
    notes: '기본 산출 박스권 레벨입니다.',
  };

  const evaluation = evaluateSwingPosition(currentPrice, swingPreset);

  // 총 자산 및 평가 손익 계산
  const totalStockValue = positions.reduce((acc, pos) => {
    const item = marketItems.find((m) => m.symbol === pos.symbol || m.id === pos.symbol.toLowerCase());
    const livePrice = item?.price || pos.avgPrice;
    return acc + livePrice * pos.quantity;
  }, 0);

  const totalAssets = cash + totalStockValue;
  const totalReturn = Number((((totalAssets - INITIAL_CASH) / INITIAL_CASH) * 100).toFixed(2));

  // 보유 수량 확인
  const currentPosition = positions.find((p) => p.symbol === selectedSymbol);
  const holdingQty = currentPosition?.quantity || 0;

  // 매수 실행
  const executeBuy = () => {
    const cost = currentPrice * orderQuantity;
    if (cost > cash) {
      alert('현금 잔고가 부족합니다!');
      return;
    }

    const newCash = cash - cost;
    const existingIndex = positions.findIndex((p) => p.symbol === selectedSymbol);
    let newPositions: Position[] = [];

    if (existingIndex >= 0) {
      newPositions = [...positions];
      const existing = newPositions[existingIndex];
      const totalQty = existing.quantity + orderQuantity;
      const totalCost = existing.avgPrice * existing.quantity + cost;
      newPositions[existingIndex] = {
        ...existing,
        quantity: totalQty,
        avgPrice: Number((totalCost / totalQty).toFixed(2)),
      };
    } else {
      newPositions = [
        ...positions,
        {
          symbol: selectedSymbol,
          name: swingPreset.name,
          quantity: orderQuantity,
          avgPrice: currentPrice,
          entryDate: new Date().toLocaleDateString('ko-KR'),
        },
      ];
    }

    const newLog: TradeLog = {
      id: Date.now().toString(),
      symbol: selectedSymbol,
      type: 'BUY',
      price: currentPrice,
      quantity: orderQuantity,
      total: cost,
      date: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    saveState(newCash, newPositions, [newLog, ...tradeLogs]);
    alert(`${swingPreset.name} ${orderQuantity}주 매수가 체결되었습니다!`);
  };

  // 매도 실행
  const executeSell = (qty = orderQuantity) => {
    if (qty > holdingQty || holdingQty <= 0) {
      alert('보유 수량보다 많은 수량을 매도할 수 없습니다!');
      return;
    }

    const revenue = currentPrice * qty;
    const newCash = cash + revenue;
    const existing = currentPosition!;
    const pnl = Number(((currentPrice - existing.avgPrice) * qty).toFixed(2));

    let newPositions: Position[] = [];
    if (existing.quantity === qty) {
      newPositions = positions.filter((p) => p.symbol !== selectedSymbol);
    } else {
      newPositions = positions.map((p) =>
        p.symbol === selectedSymbol ? { ...p, quantity: p.quantity - qty } : p
      );
    }

    const newLog: TradeLog = {
      id: Date.now().toString(),
      symbol: selectedSymbol,
      type: 'SELL',
      price: currentPrice,
      quantity: qty,
      total: revenue,
      pnl,
      date: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    saveState(newCash, newPositions, [newLog, ...tradeLogs]);
    alert(`${swingPreset.name} ${qty}주 매도가 완료되었습니다! (손익: $${pnl})`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f1322] border border-[#242c48] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#1d253f] flex items-center justify-between bg-[#0b0e1a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Selah 스윙 모의 트레이딩 (Paper Trading)
                </h2>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 font-semibold px-2 py-0.5 rounded border border-blue-500/20">
                  SNULife Edition Rules
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                지지선(S1) 진입 · 저항선(R1) 익절 · 손익비 2:1 이상 원칙을 실전 가상 매매로 훈련합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 text-[#64748b] hover:text-white hover:bg-[#1a2138] rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="계좌 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">리셋</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#64748b] hover:text-white hover:bg-[#1a2138] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Account Summary Banner */}
        <div className="px-5 py-3 bg-[#13182b] border-b border-[#1d253f] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#64748b] text-[11px] block">총 평가 자산</span>
            <span className="text-sm font-bold text-white font-mono">
              ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-[#64748b] text-[11px] block">보유 현금</span>
            <span className="text-sm font-bold text-slate-200 font-mono">
              ${cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-[#64748b] text-[11px] block">주식 평가액</span>
            <span className="text-sm font-bold text-slate-200 font-mono">
              ${totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-[#64748b] text-[11px] block">누적 수익률</span>
            <span
              className={`text-sm font-bold font-mono flex items-center ${
                totalReturn >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}
            >
              {totalReturn >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
              {totalReturn >= 0 ? '+' : ''}
              {totalReturn}%
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1d253f] bg-[#0c101d] px-5 text-xs">
          <button
            onClick={() => setActiveTab('TRADE')}
            className={`py-2.5 px-4 font-semibold border-b-2 transition-all ${
              activeTab === 'TRADE'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-[#64748b] hover:text-slate-300'
            }`}
          >
            스윙 주문 & 전략 분석
          </button>
          <button
            onClick={() => setActiveTab('POSITIONS')}
            className={`py-2.5 px-4 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'POSITIONS'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-[#64748b] hover:text-slate-300'
            }`}
          >
            <span>보유 포지션</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 text-[10px]">
              {positions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`py-2.5 px-4 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'HISTORY'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-[#64748b] hover:text-slate-300'
            }`}
          >
            <span>체결 내역</span>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400 text-[10px]">
              {tradeLogs.length}
            </span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'TRADE' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Selah Swing Analysis & Levels (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Stock Selector Pill */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {Object.keys(SWING_PRESETS).map((sym) => (
                    <button
                      key={sym}
                      onClick={() => setSelectedSymbol(sym)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedSymbol === sym
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-[#151a2d] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>

                {/* Main Stock Card */}
                <div className="p-4 rounded-xl bg-[#13182b] border border-[#212944]">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{swingPreset.name}</h3>
                        <span className="text-xs text-[#64748b] font-mono">({swingPreset.symbol})</span>
                      </div>
                      <span className="text-[11px] text-[#64748b]">
                        섹터: {swingPreset.sector} ({swingPreset.sectorEtf}) · 일일 정상변동폭(ATR): {swingPreset.atr14Percent}%
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-white font-mono">
                        ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono">실시간 시세 연동 중</div>
                    </div>
                  </div>

                  {/* Selah Signal Alert Box */}
                  <div className={`p-3.5 rounded-xl border mt-3 ${evaluation.color}`}>
                    <div className="flex items-center justify-between font-semibold text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Selah 전략 신호: {evaluation.label}</span>
                      </div>
                      {evaluation.riskRewardRatio > 0 && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/20">
                          손익비: {evaluation.riskRewardRatio} : 1
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">{evaluation.advice}</p>
                  </div>

                  {/* 4 Key Levels Visualizer (R2, R1, S1, S2) */}
                  <div className="mt-4 pt-3 border-t border-[#1d253f]">
                    <div className="text-xs font-bold text-[#94a3b8] mb-2.5 flex items-center justify-between">
                      <span>Selah Day 0 기준 가격선 (Support & Resistance)</span>
                      <span className="text-[10px] text-[#64748b]">최근 6개월 매물대 분석 기준</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-800/40">
                        <span className="text-[10px] text-red-400 font-bold block">R2 (최종목표)</span>
                        <span className="font-mono font-bold text-slate-200">${swingPreset.r2}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
                        <span className="text-[10px] text-amber-400 font-bold block">R1 (1차 익절)</span>
                        <span className="font-mono font-bold text-slate-200">${swingPreset.r1}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 ring-1 ring-emerald-500/30">
                        <span className="text-[10px] text-emerald-400 font-bold block">S1 (매수 타점)</span>
                        <span className="font-mono font-bold text-slate-200">${swingPreset.s1}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700/50">
                        <span className="text-[10px] text-zinc-400 font-bold block">S2 (손절선)</span>
                        <span className="font-mono font-bold text-slate-200">${swingPreset.s2}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rule Checklist Note */}
                <div className="p-3.5 rounded-xl bg-[#111627] border border-[#1d253f] text-xs text-[#94a3b8] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                    <Info className="w-3.5 h-3.5" />
                    <span>Selah 3대 매매 원칙 복기</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                    <li>
                      <strong>출구 전략 우선</strong>: 진입 시점에 이미 목표가(R1)와 손절가(S2)가 확정되어 있어야 함.
                    </li>
                    <li>
                      <strong>최소 손익비 2:1</strong>: 기대 수익폭(R1-현재가)이 예상 손실폭(현재가-S2)의 2배 이상일 때만 진입.
                    </li>
                    <li>
                      <strong>R1 저항 분할 청산</strong>: R1 도달 시 미련 없이 50% 분할 익절하여 수익을 보존.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Order Form (5 cols) */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-[#13182b] border border-[#212944] flex flex-col justify-between">
                <div>
                  <div className="flex rounded-lg bg-[#0c101d] p-1 mb-4">
                    <button
                      onClick={() => setOrderTab('BUY')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                        orderTab === 'BUY'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-[#64748b] hover:text-white'
                      }`}
                    >
                      매수 (BUY)
                    </button>
                    <button
                      onClick={() => setOrderTab('SELL')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                        orderTab === 'SELL'
                          ? 'bg-red-600 text-white shadow'
                          : 'text-[#64748b] hover:text-white'
                      }`}
                    >
                      매도 (SELL)
                    </button>
                  </div>

                  {/* Price info */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center text-[#94a3b8]">
                      <span>주문 단가</span>
                      <span className="font-mono text-white font-bold text-sm">
                        ${currentPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[#94a3b8]">
                      <span>보유 수량</span>
                      <span className="font-mono text-white font-semibold">
                        {holdingQty} 주
                      </span>
                    </div>

                    {/* Quantity Input */}
                    <div>
                      <label className="text-[11px] text-[#64748b] block mb-1.5">주문 수량 (주)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="flex-1 bg-[#0c101d] border border-[#242c48] text-white font-mono text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => setOrderQuantity(10)}
                          className="px-2.5 py-2 bg-[#1b2238] hover:bg-[#232c4a] text-slate-300 rounded-lg text-xs"
                        >
                          10주
                        </button>
                        <button
                          onClick={() => setOrderQuantity(50)}
                          className="px-2.5 py-2 bg-[#1b2238] hover:bg-[#232c4a] text-slate-300 rounded-lg text-xs"
                        >
                          50주
                        </button>
                        {orderTab === 'SELL' && holdingQty > 0 && (
                          <button
                            onClick={() => setOrderQuantity(holdingQty)}
                            className="px-2.5 py-2 bg-red-950/60 text-red-400 border border-red-800/40 rounded-lg text-xs font-bold"
                          >
                            전량
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Total Estimated Cost */}
                    <div className="p-3 rounded-lg bg-[#0c101d] border border-[#1f263d] space-y-1 mt-4">
                      <div className="flex justify-between text-[#94a3b8] text-[11px]">
                        <span>총 결제 예상 금액</span>
                        <span className="font-mono text-white font-bold text-sm">
                          ${(currentPrice * orderQuantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#64748b] text-[10px]">
                        <span>주문 후 잔여 현금</span>
                        <span className="font-mono">
                          $
                          {(orderTab === 'BUY'
                            ? Math.max(0, cash - currentPrice * orderQuantity)
                            : cash + currentPrice * orderQuantity
                          ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-5">
                  {orderTab === 'BUY' ? (
                    <button
                      onClick={executeBuy}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      <span>{swingPreset.symbol} 가상 매수 주문</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => executeSell()}
                      disabled={holdingQty <= 0}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      <span>{holdingQty > 0 ? `${swingPreset.symbol} 가상 매도 주문` : '보유 수량 없음'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'POSITIONS' && (
            <div className="space-y-3">
              {positions.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 text-xs">
                  현재 보유 중인 포지션이 없습니다. [스윙 주문 & 전략 분석] 탭에서 가상 매수를 진행해 보세요!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#cbd5e1]">
                    <thead className="bg-[#0b0e1a] text-[#64748b] uppercase text-[11px] font-semibold border-b border-[#1d253f]">
                      <tr>
                        <th className="py-3 px-4">종목</th>
                        <th className="py-3 px-3 text-right">보유수량</th>
                        <th className="py-3 px-3 text-right">매수단가</th>
                        <th className="py-3 px-3 text-right">현재가</th>
                        <th className="py-3 px-3 text-right">평가손익 (PnL)</th>
                        <th className="py-3 px-3 text-right">수익률</th>
                        <th className="py-3 px-4 text-center">원클릭 청산</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#182035]">
                      {positions.map((pos) => {
                        const item = marketItems.find((m) => m.symbol === pos.symbol || m.id === pos.symbol.toLowerCase());
                        const livePrice = item?.price || pos.avgPrice;
                        const pnl = (livePrice - pos.avgPrice) * pos.quantity;
                        const pnlPercent = Number((((livePrice - pos.avgPrice) / pos.avgPrice) * 100).toFixed(2));
                        const isUp = pnl >= 0;

                        return (
                          <tr key={pos.symbol} className="hover:bg-[#141a2e] transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-bold text-white block">{pos.symbol}</span>
                              <span className="text-[11px] text-[#64748b]">{pos.name}</span>
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-semibold">{pos.quantity}주</td>
                            <td className="py-3 px-3 text-right font-mono">${pos.avgPrice.toFixed(2)}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-white">
                              ${livePrice.toFixed(2)}
                            </td>
                            <td
                              className={`py-3 px-3 text-right font-mono font-bold ${
                                isUp ? 'text-[#10b981]' : 'text-[#ef4444]'
                              }`}
                            >
                              {isUp ? '+' : ''}${pnl.toFixed(2)}
                            </td>
                            <td
                              className={`py-3 px-3 text-right font-mono font-semibold ${
                                isUp ? 'text-[#10b981]' : 'text-[#ef4444]'
                              }`}
                            >
                              {isUp ? '+' : ''}{pnlPercent}%
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedSymbol(pos.symbol);
                                    executeSell(Math.max(1, Math.floor(pos.quantity / 2)));
                                  }}
                                  className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-[10px] font-bold"
                                  title="R1 도달 시 50% 분할 익절 규칙"
                                >
                                  50% 분할익절
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedSymbol(pos.symbol);
                                    executeSell(pos.quantity);
                                  }}
                                  className="px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[10px] font-bold"
                                >
                                  전량 청산
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-2">
              {tradeLogs.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 text-xs">
                  체결된 매매 기록이 아직 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#cbd5e1]">
                    <thead className="bg-[#0b0e1a] text-[#64748b] uppercase text-[11px] font-semibold border-b border-[#1d253f]">
                      <tr>
                        <th className="py-3 px-4">시간</th>
                        <th className="py-3 px-3">구분</th>
                        <th className="py-3 px-3">종목</th>
                        <th className="py-3 px-3 text-right">체결단가</th>
                        <th className="py-3 px-3 text-right">수량</th>
                        <th className="py-3 px-3 text-right">총 금액</th>
                        <th className="py-3 px-4 text-right">실현손익</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#182035]">
                      {tradeLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#141a2e] transition-colors">
                          <td className="py-2.5 px-4 font-mono text-[#64748b]">{log.date}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                log.type === 'BUY'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {log.type === 'BUY' ? '매수' : '매도'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-white">{log.symbol}</td>
                          <td className="py-2.5 px-3 text-right font-mono">${log.price.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{log.quantity}주</td>
                          <td className="py-2.5 px-3 text-right font-mono">${log.total.toFixed(2)}</td>
                          <td
                            className={`py-2.5 px-4 text-right font-mono font-bold ${
                              log.pnl ? (log.pnl >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]') : 'text-zinc-500'
                            }`}
                          >
                            {log.pnl !== undefined ? `${log.pnl >= 0 ? '+' : ''}$${log.pnl.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
