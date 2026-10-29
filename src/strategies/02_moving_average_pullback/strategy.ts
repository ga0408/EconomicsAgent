import { TradingStrategy, StrategySignal } from '../types';

export const movingAveragePullbackStrategy: TradingStrategy = {
  id: 'moving_average_pullback',
  name: 'Moving Average 20 EMA Pullback',
  nameKo: '20일선 정배열 눌림목 스윙',
  shortDesc: '20일/50일/200일 이평선 정배열 종목이 20 EMA로 건강한 조정을 받을 때 분할 매수',
  authorOrOrigin: 'Classic Trend Following',
  timeframe: '1주 ~ 4주',
  targetWinRate: '58 ~ 64%',
  minRiskReward: '2.2 : 1 이상',
  philosophy:
    '추세는 당신의 친구다. 급등 추격 매수를 버리고 기관들의 방어선인 20일 이동평균선 눌림목에서 대기한다.',
  entryRules: [
    '주가가 200일선 및 50일선 위에 위치하는 명확한 상승 추세일 것',
    '주가가 20일 지수이동평균(EMA) 부근으로 조정받을 때 거래량이 감소할 것',
    '20일선 지지 캔들(아래꼬리 양봉 또는 도지 후 양봉) 확인 시 매수',
  ],
  exitRules: [
    '직전 스윙 고점 도달 시 50% 분할 익절',
    '20일선 대비 주가 이격도가 10% 이상 벌어지며 단기 과열 시 잔여분 청산',
  ],
  stopLossRules: [
    '20일 이동평균선을 종가 기준으로 명확히 이탈(-2.5% 이상) 시 손절',
  ],
  riskManagementRules: [
    '1회 매매당 총 계좌 대비 최대 리스크 1.5% 이내로 포지션 사이즈 조절',
  ],
  evaluate: (currentPrice: number): StrategySignal => {
    const ma20 = currentPrice * 0.98; // 20일선 부근 가정
    const stopLoss = ma20 * 0.97; // 20일선 -3%
    const target = currentPrice * 1.08; // 전고점 +8%

    const reward = target - currentPrice;
    const risk = currentPrice - stopLoss;
    const rr = Number((reward / risk).toFixed(2));

    return {
      type: 'BUY',
      title: '20일선 눌림목 반등 타점',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      targetPrice: Number(target.toFixed(2)),
      stopLossPrice: Number(stopLoss.toFixed(2)),
      riskRewardRatio: rr,
      description: `20일 이동평균선($${ma20.toFixed(2)}) 지지 반등을 노리는 전형적인 추세추종 스윙 타점입니다.`,
      checkpoints: [
        `목표가 (직전 고점): $${target.toFixed(2)} (+8.0%)`,
        `손절선 (20일선 이탈): $${stopLoss.toFixed(2)} (-5.0%)`,
        `손익비: ${rr} : 1`,
      ],
    };
  },
};
