// Selah Top-Down Swing Trading Rules & Level Data

export interface SwingLevels {
  symbol: string;
  name: string;
  sector: string;
  sectorEtf: string;
  atr14Percent: number; // 14일 일일 정상 변동폭 (%)
  s2: number; // 2차 지지선 (손절 기준)
  s1: number; // 1차 지지선 (스윙 매수 타점)
  r1: number; // 1차 저항선 (1차 익절 목표)
  r2: number; // 2차 저항선 (최종 목표)
  notes: string;
}

export const SWING_PRESETS: Record<string, SwingLevels> = {
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Information Technology',
    sectorEtf: 'XLK',
    atr14Percent: 3.4,
    s2: 130.0,
    s1: 138.5,
    r1: 145.0,
    r2: 152.0,
    notes: 'R1 $145 돌파 테스트 중. S1 $138.50 지지 시 손익비 2.5:1 우수.',
  },
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Information Technology',
    sectorEtf: 'XLK',
    atr14Percent: 1.8,
    s2: 225.0,
    s1: 230.0,
    r1: 238.0,
    r2: 245.0,
    notes: '$230~$238 박스권 횡보. S1 지지 시 진입 유효.',
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Consumer Discretionary',
    sectorEtf: 'XLY',
    atr14Percent: 4.8,
    s2: 240.0,
    s1: 255.0,
    r1: 275.0,
    r2: 290.0,
    notes: '실적 발표 후 변동성 확대. S1 $255 지지 확인 필수.',
  },
  '005930.KS': {
    symbol: '005930.KS',
    name: '삼성전자',
    sector: 'Information Technology (KR)',
    sectorEtf: 'KODEX 반도체',
    atr14Percent: 2.1,
    s2: 56000,
    s1: 58500,
    r1: 61500,
    r2: 64000,
    notes: '5만 전자 하단 S1 지지 반등 시도. 손익비 2.2:1.',
  },
  '000660.KS': {
    symbol: '000660.KS',
    name: 'SK하이닉스',
    sector: 'Information Technology (KR)',
    sectorEtf: 'KODEX 반도체',
    atr14Percent: 3.2,
    s2: 185000,
    s1: 195000,
    r1: 208000,
    r2: 220000,
    notes: 'HBM 주도력 유지. S1 $195,000 지지 테스트 중.',
  },
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    sector: 'Digital Assets',
    sectorEtf: 'IBIT',
    atr14Percent: 3.8,
    s2: 74000,
    s1: 78000,
    r1: 83000,
    r2: 88000,
    notes: 'S1 $78,000 지지 시 사상 최고가 재도전 파동 가능.',
  },
};

export type SwingZoneStatus = 'BUY_ZONE' | 'TAKE_PROFIT' | 'NEUTRAL_WAIT' | 'STOP_LOSS_WARNING' | 'BREAKOUT';

export interface SwingEvaluation {
  zone: SwingZoneStatus;
  label: string;
  color: string;
  riskRewardRatio: number; // 손익비 (Reward / Risk)
  potentialGainPercent: number;
  potentialLossPercent: number;
  advice: string;
}

export function evaluateSwingPosition(currentPrice: number, levels: SwingLevels): SwingEvaluation {
  const { s1, s2, r1, r2 } = levels;
  const reward = Math.max(0, r1 - currentPrice);
  const risk = Math.max(0.1, currentPrice - s2);
  const rrRatio = Number((reward / risk).toFixed(2));

  const potentialGain = Number((((r1 - currentPrice) / currentPrice) * 100).toFixed(2));
  const potentialLoss = Number((((currentPrice - s2) / currentPrice) * 100).toFixed(2));

  // 가격이 S1 주변 (+/- 2% 범위)
  const s1Upper = s1 * 1.02;
  const s1Lower = s1 * 0.98;

  // 가격이 R1 주변 (+/- 2% 범위)
  const r1Lower = r1 * 0.98;

  if (currentPrice < s2) {
    return {
      zone: 'STOP_LOSS_WARNING',
      label: '손절 경고 구간 (S2 이탈)',
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      riskRewardRatio: 0,
      potentialGainPercent: potentialGain,
      potentialLossPercent: potentialLoss,
      advice: '2차 지지선(S2)을 이탈했습니다. 원칙상 비중 축소 또는 손절 대응이 필요한 위험 구간입니다.',
    };
  }

  if (currentPrice >= s1Lower && currentPrice <= s1Upper) {
    return {
      zone: 'BUY_ZONE',
      label: '스윙 매수 적기 (S1 지지 타점)',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      riskRewardRatio: rrRatio,
      potentialGainPercent: potentialGain,
      potentialLossPercent: potentialLoss,
      advice: `1차 지지선($${s1}) 부근입니다. 손절선 S2($${s2})를 잡고 1차 목표 R1($${r1})을 노리는 손익비(${rrRatio}:1) 최적 타점입니다.`,
    };
  }

  if (currentPrice >= r1Lower && currentPrice <= r1) {
    return {
      zone: 'TAKE_PROFIT',
      label: '익절 검토 구간 (R1 저항 도달)',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      riskRewardRatio: rrRatio,
      potentialGainPercent: potentialGain,
      potentialLossPercent: potentialLoss,
      advice: `1차 저항선($${r1})에 도달했습니다. 미련 없이 50% 분할 익절하여 수익을 확정 짓는 구간입니다.`,
    };
  }

  if (currentPrice > r1) {
    return {
      zone: 'BREAKOUT',
      label: '상단 돌파 구간 (추격 금지)',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      riskRewardRatio: rrRatio,
      potentialGainPercent: potentialGain,
      potentialLossPercent: potentialLoss,
      advice: `R1 저항을 돌파했습니다. 신규 진입은 추격 매수가 되므로, 기존 보유자만 R2($${r2})까지 트레일링 스탑으로 홀딩하세요.`,
    };
  }

  // S1과 R1 사이의 중간 지대 (No Man's Land)
  return {
    zone: 'NEUTRAL_WAIT',
    label: '관망 구간 (박스권 중간)',
    color: 'text-zinc-400 bg-zinc-800/40 border-zinc-700/40',
    riskRewardRatio: rrRatio,
    potentialGainPercent: potentialGain,
    potentialLossPercent: potentialLoss,
    advice: `지지선(S1)과 저항선(R1)의 중간 애매한 위치입니다. 손익비가 불리하므로 S1까지 눌림목 조정을 기다리는 것이 유리합니다.`,
  };
}
