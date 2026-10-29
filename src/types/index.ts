// Common Types for Web & Mobile App (React Native / Expo Compatible)

export type MarketCategory = 'crypto' | 'us_stock' | 'kr_stock' | 'macro';

export interface MarketItem {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  category: MarketCategory;
  categoryLabel: string;
  icon?: string;
  price: number;
  displayPrice: string;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCapOrVolume: string;
  high24h: string;
  low24h: string;
  sparkline: number[];
}

export interface TickerItem {
  name: string;
  value: string;
  change: number;
  isUp: boolean;
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
    value: number;
    classification: string;
  };
  macroKeyRatio: {
    usdKrw: { price: number; change: number; sparkline: number[] };
    us10y: { price: number; change: number; sparkline: number[] };
  };
  btcDominance: number;
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
