'use client';

import React, { useState, useMemo } from 'react';
import { MarketItem } from '@/data/mockData';
import { Sparkline } from '@/components/ui/Sparkline';
import {
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface MarketTableProps {
  items: MarketItem[];
  selectedCategory: string;
  setCategory: (cat: string) => void;
  searchQuery: string;
}

export function MarketTable({
  items,
  selectedCategory,
  setCategory,
  searchQuery,
}: MarketTableProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<string>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // 보통 기본 내림차순
    }
  };

  // 필터링 및 검색
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          return (
            item.name.toLowerCase().includes(q) ||
            item.symbol.toLowerCase().includes(q) ||
            item.categoryLabel.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const valA: number = (a as unknown as Record<string, number>)[sortField] ?? 0;
        const valB: number = (b as unknown as Record<string, number>)[sortField] ?? 0;

        if (sortAsc) {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [items, selectedCategory, searchQuery, sortField, sortAsc]);

  const categories = [
    { id: 'all', label: 'All Markets' },
    { id: 'macro', label: '🌐 거시경제 지표' },
    { id: 'us_stock', label: '🇺🇸 미국 주식' },
    { id: 'kr_stock', label: '🇰🇷 한국 주식' },
    { id: 'crypto', label: '🪙 크립토' },
  ];

  return (
    <div className="bg-[#101422] border border-[#1e253b] rounded-xl overflow-hidden shadow-lg">
      {/* Category Pills & Controls Header */}
      <div className="p-4 border-b border-[#1c2237] flex flex-wrap items-center justify-between gap-3">
        {/* Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#161a29] text-[#94a3b8] hover:text-white hover:bg-[#1e2538]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right side helpers */}
        <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
          <span className="text-[#64748b]">
            Showing <strong className="text-white">{filteredItems.length}</strong> assets
          </span>
          <div className="h-4 w-px bg-[#1c2237]"></div>
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161a29] border border-[#232a42] hover:text-white text-xs">
            <Filter className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#cbd5e1]">
          <thead className="bg-[#0c0f1a] text-[#64748b] border-b border-[#1c2237] uppercase text-[11px] font-semibold tracking-wider select-none">
            <tr>
              <th className="py-3 px-3 w-10 text-center"></th>
              <th
                onClick={() => handleSort('rank')}
                className="py-3 px-2 w-12 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  # <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 min-w-[200px]">Asset / Indicator</th>
              <th
                onClick={() => handleSort('price')}
                className="py-3 px-4 text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  Price / Value <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('change1h')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white hidden sm:table-cell"
              >
                1h %
              </th>
              <th
                onClick={() => handleSort('change24h')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  24h % <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('change7d')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white hidden md:table-cell"
              >
                7d %
              </th>
              <th className="py-3 px-4 text-right hidden lg:table-cell">
                Market Cap / Note
              </th>
              <th className="py-3 px-4 text-center w-[140px]">7d Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#181f33]">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#64748b]">
                  조건에 맞는 자산이나 지표가 없습니다.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isFav = !!favorites[item.id];
                const is24hUp = item.change24h >= 0;
                const is7dUp = item.change7d >= 0;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#161c2d] transition-colors group cursor-pointer"
                  >
                    {/* Star Favorite */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`transition-colors ${
                          isFav
                            ? 'text-amber-400'
                            : 'text-[#475569] hover:text-slate-200'
                        }`}
                      >
                        <Star
                          className="w-3.5 h-3.5"
                          fill={isFav ? 'currentColor' : 'none'}
                        />
                      </button>
                    </td>

                    {/* Rank */}
                    <td className="py-3 px-2 text-[#64748b] font-mono text-[11px]">
                      {item.rank}
                    </td>

                    {/* Asset Name & Symbol */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#1b2236] border border-[#26314f] flex items-center justify-center font-bold text-xs text-white">
                          {item.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            {item.symbol}
                            <span className="text-[10px] text-[#64748b] bg-[#1a2136] px-1.5 py-0.2 rounded font-normal">
                              {item.categoryLabel}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#64748b] font-medium">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                      {item.displayPrice}
                    </td>

                    {/* 1h % */}
                    <td
                      className={`py-3 px-3 text-right font-mono font-medium hidden sm:table-cell ${
                        item.change1h >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                      }`}
                    >
                      {item.change1h >= 0 ? '+' : ''}
                      {item.change1h.toFixed(2)}%
                    </td>

                    {/* 24h % */}
                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold ${
                        is24hUp ? 'text-[#10b981]' : 'text-[#ef4444]'
                      }`}
                    >
                      <span className="inline-flex items-center">
                        {is24hUp ? (
                          <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                        )}
                        {is24hUp ? '+' : ''}
                        {item.change24h.toFixed(2)}%
                      </span>
                    </td>

                    {/* 7d % */}
                    <td
                      className={`py-3 px-3 text-right font-mono font-medium hidden md:table-cell ${
                        is7dUp ? 'text-[#10b981]' : 'text-[#ef4444]'
                      }`}
                    >
                      {is7dUp ? '+' : ''}
                      {item.change7d.toFixed(2)}%
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-4 text-right font-mono text-[#94a3b8] hidden lg:table-cell">
                      {item.marketCapOrVolume}
                    </td>

                    {/* 7d Sparkline Chart */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        <Sparkline
                          data={item.sparkline}
                          width={110}
                          height={30}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
