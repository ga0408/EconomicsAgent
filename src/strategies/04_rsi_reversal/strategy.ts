import { TradingStrategy, StrategySignal } from '../types';

export const rsiReversalStrategy: TradingStrategy = {
  id: 'rsi_reversal',
  name: 'RSI Oversold Mean Reversion',
  nameKo: 'RSI 과매도 기술적 반등 스윙',
  shortDesc: '단기 패닉 투매로 RSI가 30 이하로 과매도된 우량주가 30을 상향 돌파할 때 역발상 매수',
  authorOrOrigin: 'J. Welles Wilder & Mean Reversion',
  timeframe: '3일 ~ 10일',
  targetWinRate: '62 ~ 70%',
  minRiskReward: '2.0 : 1 이상',
  philosophy:
    '우량주의 단기 투매는 기회다. 단, 떨어지는 도중이 아닌 RSI 30 반등 확인 후 진입한다.',
  entryRules: [
    'S&P 500 또는 코스피 200에 속한 탄탄한 대형 우량주',
    'RSI(14)가 30 이하로 진입 후, 다시 30 위로 골든크로스(상향 돌파)하는 날 종가 매수',
    '주가와 RSI 지표 간 상승 다이버전스(Bullish Divergence) 발생 시 가산점',
  ],
  exitRules: [
    'RSI 55~60(평균 중간선) 도달 시 50% 분할 익절',
    'RSI 70 과매수권 도달 또는 20일선 저항 확인 시 전량 청산',
  ],
  stopLossRules: [
    '진입 직전 투매일의 최저점(스윙 로우)을 -3% 이상 이탈 시 즉시 손절',
  ],
  riskManagementRules: [
    '역발상 매매는 추세를 거스르므로 손절선을 절대 뒤로 미루지 말 것',
  ],
  evaluate: (currentPrice: number): StrategySignal => {
    const swingLow = currentPrice * 0.965; // 직전 저점 -3.5%
    const target = currentPrice * 1.075; // 평균회귀 +7.5%

    const reward = target - currentPrice;
    const risk = currentPrice - swingLow;
    const rr = Number((reward / risk).toFixed(2));

    return {
      type: 'BUY',
      title: 'RSI 30 탈출 과매도 반등 신호',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      targetPrice: Number(target.toFixed(2)),
      stopLossPrice: Number(swingLow.toFixed(2)),
      riskRewardRatio: rr,
      description: `단기 과매도 해소 국면으로, 평균 가치 회귀(+7.5%)를 목표로 하는 타점입니다.`,
      checkpoints: [
        `목표가 (RSI 60 도달): $${target.toFixed(2)} (+7.5%)`,
        `손절선 (투매 저점 이탈): $${swingLow.toFixed(2)} (-3.5%)`,
        `손익비: ${rr} : 1`,
      ],
    };
  },
};
