import { TradingStrategy, StrategySignal } from '../types';

export const breakoutMomentumStrategy: TradingStrategy = {
  id: 'breakout_momentum',
  name: 'Darvas / O\'Neil Breakout Momentum',
  nameKo: '전고점 & 박스권 돌파 모멘텀',
  shortDesc: '박스권 상단이나 52주 신고가를 대량 거래량으로 돌파할 때 진입하여 급등 파동을 추종',
  authorOrOrigin: 'William O\'Neil & Nicolas Darvas',
  timeframe: '3일 ~ 2주',
  targetWinRate: '50 ~ 55% (손익비로 극복)',
  minRiskReward: '2.5 : 1 이상',
  philosophy:
    '신고가에 도달한 주식은 상단에 물린 매도자가 없다. 가장 강한 주식이 가장 멀리 간다.',
  entryRules: [
    '최소 3~6주간의 박스권 횡보 및 변동성 축소(VCP) 완료 종목',
    '박스권 상단 저항선을 강하게 뚫어낼 때 시장가/돌파 매수',
    '돌파 당일 거래량이 50일 평균 거래량의 150% 이상 터질 것',
  ],
  exitRules: [
    '돌파 기준선 대비 +12% ~ +15% 도달 시 50% 분할 익절',
    '이후 10일 이동평균선을 종가 이탈할 때까지 트레일링 스탑 홀딩',
  ],
  stopLossRules: [
    '돌파 기준선 아래로 주가가 되밀리거나 -5% 도달 시 즉시 무조건 손절(가짜 돌파 방어)',
  ],
  riskManagementRules: [
    '가짜 돌파(Fakeout) 발생 확률이 40% 이상이므로 -5% 손절 원칙을 100% 기계적으로 준수',
  ],
  evaluate: (currentPrice: number): StrategySignal => {
    const breakoutLine = currentPrice * 0.99; // 돌파선 부근
    const stopLoss = breakoutLine * 0.95; // 돌파선 -5%
    const target = currentPrice * 1.14; // +14% 랠리

    const reward = target - currentPrice;
    const risk = currentPrice - stopLoss;
    const rr = Number((reward / risk).toFixed(2));

    return {
      type: 'BUY',
      title: '박스권 상단 돌파 모멘텀 신호',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      targetPrice: Number(target.toFixed(2)),
      stopLossPrice: Number(stopLoss.toFixed(2)),
      riskRewardRatio: rr,
      description: `저항선 돌파 성공 시 상단 매물 공백으로 빠른 슈팅(+14%)이 기대되는 모멘텀 타점입니다.`,
      checkpoints: [
        `돌파 기준선: $${breakoutLine.toFixed(2)}`,
        `목표가 (+14%): $${target.toFixed(2)}`,
        `칼손절선 (-5%): $${stopLoss.toFixed(2)} (가짜 돌파 대비)`,
        `손익비: ${rr} : 1`,
      ],
    };
  },
};
