export type StrategyId =
  | 'selah_topdown'
  | 'moving_average_pullback'
  | 'breakout_momentum'
  | 'rsi_reversal';

export interface StrategySignal {
  type: 'BUY' | 'SELL' | 'HOLD' | 'STOP_LOSS';
  title: string;
  badgeColor: string;
  targetPrice: number;
  stopLossPrice: number;
  riskRewardRatio: number;
  description: string;
  checkpoints: string[];
}

export interface TradingStrategy {
  id: StrategyId;
  name: string;
  nameKo: string;
  shortDesc: string;
  authorOrOrigin: string;
  timeframe: string; // e.g., '1~3주 스윙'
  targetWinRate: string; // e.g., '55~65%'
  minRiskReward: string; // e.g., '2:1 이상'
  philosophy: string;
  entryRules: string[];
  exitRules: string[];
  stopLossRules: string[];
  riskManagementRules: string[];
  evaluate: (currentPrice: number, high24h?: number, low24h?: number, change24h?: number) => StrategySignal;
}
