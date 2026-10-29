'use client';

import React from 'react';
import { TICKER_DATA } from '@/data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function TickerBar() {
  return (
    <div className="w-full bg-[#0b0e17] border-b border-[#1c2237] text-xs text-[#94a3b8] py-1.5 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-6 whitespace-nowrap min-w-max">
        {TICKER_DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <span className="font-medium text-[#64748b]">{item.name}:</span>
            <span className="text-[#f1f5f9] font-semibold">{item.value}</span>
            <span
              className={`flex items-center text-[11px] font-medium ${
                item.isUp ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}
            >
              {item.isUp ? (
                <TrendingUp className="w-3 h-3 mr-0.5 inline" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5 inline" />
              )}
              {item.isUp ? '+' : ''}
              {item.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
