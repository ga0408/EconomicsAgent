// Common Types for Web & Mobile App

export type MarketCategory = 'crypto' | 'us_stock' | 'kr_stock' | 'macro';

export interface MarketItem {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  category: MarketCategory;
  categoryLabel: string;
  icon?: string;
  price: number | null;
  displayPrice: string;
  change1h: number | null;
  change24h: number | null;
  change7d: number | null;
  marketCapOrVolume: string;
  high24h: string;
  low24h: string;
  sparkline: number[];
  isConnected?: boolean;
}

export interface TickerItem {
  name: string;
  value: string;
  change: number | null;
  isUp: boolean;
  isConnected?: boolean;
}

export interface TopGainerItem {
  rank: number;
  symbol: string;
  name: string;
  price: string;
  change: number;
  icon: string;
}

export interface MarketApiResponse {
  tickerData: TickerItem[];
  marketData: MarketItem[];
  topGainers: TopGainerItem[];
  fearAndGreed: {
    value: number | null;
    classification: string;
    isConnected: boolean;
  };
  macroKeyRatio: {
    usdKrw: { price: number | null; change: number | null; sparkline: number[]; isConnected: boolean };
    us10y: { price: number | null; change: number | null; sparkline: number[]; isConnected: boolean };
  };
  btcDominance: number | null;
  lastUpdated: string;
}

export type ReportCategory = 'Morning Brief' | 'Market Close' | 'Macro Event';

export interface ReportItem {
  id: string;
  title: string;
  category: ReportCategory;
  date: string;
  summary: string;
  highlights: string[];
  impact: 'Bullish' | 'Bearish' | 'Neutral';
  readTime: string;
}

export interface PaperTradeOrder {
  id: string;
  userId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  totalAmount: number;
  createdAt: string;
  status: 'FILLED' | 'PENDING' | 'CANCELLED';
}

export interface UserPortfolio {
  userId: string;
  cashBalance: number;
  totalAssetValue: number;
  returnRate: number;
  holdings: {
    symbol: string;
    avgPrice: number;
    currentPrice: number;
    quantity: number;
    pnl: number;
    pnlPercentage: number;
  }[];
}
