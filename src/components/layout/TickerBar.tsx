'use client';

import React from 'react';
import { TickerItem } from '@/types';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface TickerBarProps {
  items?: TickerItem[];
}

export function TickerBar({ items = [] }: TickerBarProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-[#0b0e17] border-b border-[#1c2237] text-xs text-[#94a3b8] py-1.5 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-6 whitespace-nowrap min-w-max">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <span className="font-medium text-[#64748b]">{item.name}:</span>
            <span className={`font-semibold ${item.isConnected ? 'text-[#f1f5f9]' : 'text-zinc-500'}`}>
              {item.value}
            </span>
            {item.isConnected && item.change !== null ? (
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
            ) : !item.isConnected ? (
              <span className="flex items-center text-[10px] text-zinc-500 bg-zinc-800/60 px-1 py-0.2 rounded border border-zinc-700/50">
                <AlertCircle className="w-2.5 h-2.5 mr-0.5 inline text-zinc-400" />
                연결 안 됨
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
