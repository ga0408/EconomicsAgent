import { TradingStrategy, StrategyId } from './types';
import { selahTopdownStrategy } from './01_selah_topdown/strategy';
import { movingAveragePullbackStrategy } from './02_moving_average_pullback/strategy';
import { breakoutMomentumStrategy } from './03_breakout_momentum/strategy';
import { rsiReversalStrategy } from './04_rsi_reversal/strategy';

export * from './types';

export const ALL_STRATEGIES: TradingStrategy[] = [
  selahTopdownStrategy,
  movingAveragePullbackStrategy,
  breakoutMomentumStrategy,
  rsiReversalStrategy,
];

export const STRATEGY_MAP: Record<StrategyId, TradingStrategy> = {
  selah_topdown: selahTopdownStrategy,
  moving_average_pullback: movingAveragePullbackStrategy,
  breakout_momentum: breakoutMomentumStrategy,
  rsi_reversal: rsiReversalStrategy,
};

export function getStrategyById(id: StrategyId): TradingStrategy {
  return STRATEGY_MAP[id] || selahTopdownStrategy;
}
