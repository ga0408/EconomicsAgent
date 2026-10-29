import { TradingStrategy, StrategySignal } from '../types';

export const selahTopdownStrategy: TradingStrategy = {
  id: 'selah_topdown',
  name: 'Selah Top-Down Support/Resistance',
  nameKo: 'Selah 탑다운 지지/저항 스윙',
  shortDesc: 'Market(50%) ➔ Sector(30%) ➔ Stock(20%) 탑다운 및 4대 수평선(S1 매수, R1 익절, S2 손절) 매매',
  authorOrOrigin: 'Selahspect (SNULife Edition)',
  timeframe: '5일 ~ 3주',
  targetWinRate: '60 ~ 68%',
  minRiskReward: '2.0 : 1 이상',
  philosophy:
    '주가 동력의 80%는 시장과 섹터에 있다. 매수하는 순간 이미 매도 목표가(R1)와 손절선(S2)이 확정되어 있어야 한다.',
  entryRules: [
    '소속 섹터 ETF가 주간 상위 Top 3 이내이거나 반등 추세일 것',
    '주가가 1차 지지선(S1) 부근(±2%)까지 눌림목을 형성할 것',
    '손익비(R1-현재가)/(현재가-S2)가 최소 2:1 이상일 것',
    '시가총액 $1B 이상 및 주가 $1 이상의 유동성 필터 통과 종목',
  ],
  exitRules: [
    '1차 저항선(R1) 도달 시 보유 물량의 50% 분할 익절하여 확정 수익 확보',
    '잔여 50%는 본전(Break-even)에 스탑을 두고 2차 저항선(R2)까지 트레일링 스탑 홀딩',
  ],
  stopLossRules: [
    '2차 지지선(S2)을 종가 기준으로 이탈 시 미련 없이 전량 손절',
  ],
  riskManagementRules: [
    '포트폴리오 단일 종목 비중 최대 20% 이내 제한',
    '일일 변동폭이 14일 ATR의 1.5배 초과 시(Flag) 신규 추격 매수 엄금',
  ],
  evaluate: (currentPrice: number): StrategySignal => {
    // 4대 기준선 간이 산출 (기본값: S1 -4%, S2 -8%, R1 +6%, R2 +12%)
    const s1 = currentPrice * 0.96;
    const s2 = currentPrice * 0.92;
    const r1 = currentPrice * 1.06;

    const reward = r1 - currentPrice;
    const risk = currentPrice - s2;
    const rr = Number((reward / risk).toFixed(2));

    return {
      type: 'BUY',
      title: 'S1 지지선 눌림목 매수 타점',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      targetPrice: Number(r1.toFixed(2)),
      stopLossPrice: Number(s2.toFixed(2)),
      riskRewardRatio: rr,
      description: `1차 지지선($${s1.toFixed(2)}) 부근에서 지지 시 1차 목표 $${r1.toFixed(2)}까지 손익비 ${rr}:1의 우수한 타점입니다.`,
      checkpoints: [
        `1차 목표가(R1): $${r1.toFixed(2)} (도달 시 50% 분할 익절)`,
        `손절 기준선(S2): $${s2.toFixed(2)} (이탈 시 전량 손절)`,
        `손익비(Reward/Risk): ${rr} : 1`,
      ],
    };
  },
};
