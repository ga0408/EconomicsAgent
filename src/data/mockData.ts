export interface MarketItem {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  category: 'crypto' | 'us_stock' | 'kr_stock' | 'macro';
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

export interface ReportItem {
  id: string;
  title: string;
  category: 'Morning Brief' | 'Market Close' | 'Macro Event';
  date: string;
  summary: string;
  highlights: string[];
  impact: 'Bullish' | 'Bearish' | 'Neutral';
  readTime: string;
}

export const TICKER_DATA: TickerItem[] = [
  { name: 'S&P 500', value: '5,864.67', change: 0.42, isUp: true },
  { name: 'NASDAQ', value: '18,518.61', change: 0.78, isUp: true },
  { name: 'KOSPI', value: '2,612.43', change: -0.35, isUp: false },
  { name: 'USD/KRW', value: '1,382.50', change: 0.28, isUp: true },
  { name: 'US 10Y Yield', value: '4.24%', change: 0.95, isUp: true },
  { name: 'WTI Crude', value: '$71.45', change: -1.20, isUp: false },
  { name: 'BTC', value: '$68,450', change: 1.84, isUp: true },
  { name: 'ETH', value: '$2,540', change: -0.65, isUp: false },
  { name: 'Fear & Greed', value: '62 (Greed)', change: 3.10, isUp: true },
];

export const TOP_GAINERS = [
  { rank: 1, symbol: 'NVDA', name: 'NVIDIA', price: '$141.54', change: 4.82, icon: '🟢' },
  { rank: 2, symbol: 'SOL', name: 'Solana', price: '$178.20', change: 4.15, icon: '🟣' },
  { rank: 3, symbol: '005930', name: '삼성전자', price: '59,800원', change: 2.58, icon: '🔵' },
  { rank: 4, symbol: 'BTC', name: 'Bitcoin', price: '$68,450', change: 1.84, icon: '🟠' },
];

export const MARKET_DATA: MarketItem[] = [
  // Crypto
  {
    id: 'btc',
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    category: 'crypto',
    categoryLabel: 'Crypto',
    price: 68450.0,
    displayPrice: '$68,450.00',
    change1h: 0.12,
    change24h: 1.84,
    change7d: 3.42,
    marketCapOrVolume: '$1.35 T',
    high24h: '$68,900',
    low24h: '$66,800',
    sparkline: [66800, 67200, 66900, 67400, 67800, 68100, 68450],
  },
  {
    id: 'eth',
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    category: 'crypto',
    categoryLabel: 'Crypto',
    price: 2540.2,
    displayPrice: '$2,540.20',
    change1h: -0.15,
    change24h: -0.65,
    change7d: 1.15,
    marketCapOrVolume: '$305.8 B',
    high24h: '$2,590',
    low24h: '$2,510',
    sparkline: [2510, 2530, 2560, 2580, 2550, 2530, 2540],
  },
  {
    id: 'sol',
    rank: 3,
    name: 'Solana',
    symbol: 'SOL',
    category: 'crypto',
    categoryLabel: 'Crypto',
    price: 178.2,
    displayPrice: '$178.20',
    change1h: 0.85,
    change24h: 4.15,
    change7d: 12.3,
    marketCapOrVolume: '$83.6 B',
    high24h: '$180.5',
    low24h: '$170.1',
    sparkline: [160, 164, 168, 172, 175, 174, 178.2],
  },

  // US Stocks
  {
    id: 'nvda',
    rank: 4,
    name: 'NVIDIA Corporation',
    symbol: 'NVDA',
    category: 'us_stock',
    categoryLabel: 'US Stock',
    price: 141.54,
    displayPrice: '$141.54',
    change1h: 0.32,
    change24h: 4.82,
    change7d: 5.61,
    marketCapOrVolume: '$3.47 T',
    high24h: '$142.10',
    low24h: '$138.20',
    sparkline: [134, 136, 137, 138, 139, 140, 141.54],
  },
  {
    id: 'aapl',
    rank: 5,
    name: 'Apple Inc.',
    symbol: 'AAPL',
    category: 'us_stock',
    categoryLabel: 'US Stock',
    price: 231.4,
    displayPrice: '$231.40',
    change1h: -0.05,
    change24h: 0.38,
    change7d: -0.85,
    marketCapOrVolume: '$3.52 T',
    high24h: '$232.80',
    low24h: '$229.50',
    sparkline: [233, 232, 230, 231, 230, 232, 231.4],
  },
  {
    id: 'tsla',
    rank: 6,
    name: 'Tesla Inc.',
    symbol: 'TSLA',
    category: 'us_stock',
    categoryLabel: 'US Stock',
    price: 260.48,
    displayPrice: '$260.48',
    change1h: -0.42,
    change24h: -1.75,
    change7d: 18.4,
    marketCapOrVolume: '$831.2 B',
    high24h: '$268.00',
    low24h: '$258.10',
    sparkline: [220, 235, 250, 269, 265, 263, 260.48],
  },

  // KR Stocks
  {
    id: '005930',
    rank: 7,
    name: '삼성전자',
    symbol: '005930.KS',
    category: 'kr_stock',
    categoryLabel: 'KR Stock',
    price: 59800,
    displayPrice: '59,800 KRW',
    change1h: 0.0,
    change24h: 2.58,
    change7d: 1.35,
    marketCapOrVolume: '357조 원',
    high24h: '60,200',
    low24h: '58,500',
    sparkline: [59000, 58500, 58200, 58900, 59200, 58800, 59800],
  },
  {
    id: '000660',
    rank: 8,
    name: 'SK하이닉스',
    symbol: '000660.KS',
    category: 'kr_stock',
    categoryLabel: 'KR Stock',
    price: 198500,
    displayPrice: '198,500 KRW',
    change1h: 0.0,
    change24h: -1.45,
    change7d: 3.20,
    marketCapOrVolume: '144조 원',
    high24h: '203,000',
    low24h: '197,000',
    sparkline: [192000, 194000, 199000, 202000, 201000, 200000, 198500],
  },

  // Macro Indicators
  {
    id: 'usdkrw',
    rank: 9,
    name: '원/달러 환율 (USD/KRW)',
    symbol: 'USDKRW',
    category: 'macro',
    categoryLabel: 'Macro',
    price: 1382.5,
    displayPrice: '1,382.50 KRW',
    change1h: 0.05,
    change24h: 0.28,
    change7d: 1.45,
    marketCapOrVolume: '24h 거래량 보통',
    high24h: '1,386.20',
    low24h: '1,379.50',
    sparkline: [1365, 1370, 1374, 1378, 1380, 1381, 1382.5],
  },
  {
    id: 'us10y',
    rank: 10,
    name: '미국 10년물 국채금리',
    symbol: 'US10Y',
    category: 'macro',
    categoryLabel: 'Macro',
    price: 4.24,
    displayPrice: '4.24%',
    change1h: 0.12,
    change24h: 0.95,
    change7d: 4.80,
    marketCapOrVolume: '벤치마크 채권',
    high24h: '4.26%',
    low24h: '4.19%',
    sparkline: [4.05, 4.08, 4.12, 4.18, 4.21, 4.22, 4.24],
  },
  {
    id: 'wti',
    rank: 11,
    name: 'WTI 원유 선물',
    symbol: 'CL=F',
    category: 'macro',
    categoryLabel: 'Macro',
    price: 71.45,
    displayPrice: '$71.45',
    change1h: -0.25,
    change24h: -1.2,
    change7d: -3.85,
    marketCapOrVolume: '에너지 지표',
    high24h: '$72.80',
    low24h: '$70.90',
    sparkline: [75.2, 74.5, 73.8, 73.1, 72.4, 71.8, 71.45],
  },
  {
    id: 'dxy',
    rank: 12,
    name: '달러 인덱스 (DXY)',
    symbol: 'DXY',
    category: 'macro',
    categoryLabel: 'Macro',
    price: 104.28,
    displayPrice: '104.28',
    change1h: 0.02,
    change24h: 0.18,
    change7d: 0.65,
    marketCapOrVolume: '주요 6개국 통화 대비',
    high24h: '104.45',
    low24h: '103.95',
    sparkline: [103.5, 103.8, 104.0, 104.1, 104.2, 104.15, 104.28],
  },
];

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    title: '[모닝 브리프] 미 국채금리 4.2% 상회 속 빅테크 혼조, 반도체 강세 지속',
    category: 'Morning Brief',
    date: '2026. 10. 29 07:00',
    summary:
      '밤새 뉴욕증시는 10년물 국채금리가 4.24%까지 상승하는 압박 속에서도 엔비디아 등 반도체 주도의 매수세가 유입되며 나스닥이 상승 마감했습니다. 비트코인은 $68K 지지력을 확인 중입니다.',
    highlights: [
      '엔비디아(+4.8%) 신고가 랠리 재개, AI 칩 수요 낙관론 지속',
      '미 10년물 국채금리 4.24% 기록: 연준의 완만한 금리인하 속도 전망 반영',
      '환율 USD/KRW 1,382원대 진입: 외국인 수급 변동성 주의 필요',
      '비트코인 $68,000 지지선 방어 성공 및 코인 도미넌스 58.4% 유지',
    ],
    impact: 'Neutral',
    readTime: '3 min read',
  },
  {
    id: 'rep-2',
    title: '[장마감 요약] 코스피 외인 순매도 지속에도 삼성전자 6만전자 회복 시도',
    category: 'Market Close',
    date: '2026. 10. 28 16:30',
    summary:
      '국내 증시는 환율 상승 부담으로 외국인 매도세가 이어졌으나, 삼성전자가 저가 매수세에 힘입어 반등을 시도하며 하방을 지지했습니다.',
    highlights: [
      '코스피 2,612.43(-0.35%) 마감, 기관 순매수 vs 외국인 2,300억 순매도',
      '삼성전자(+2.58%) 반등 성공, 반면 SK하이닉스는 숨고르기 양상',
      '방산/조선 섹터 실적 호조 기대로 상대적 강세 유지',
    ],
    impact: 'Neutral',
    readTime: '2 min read',
  },
  {
    id: 'rep-3',
    title: '[Macro Special] 11월 FOMC 및 미국 대선 시나리오별 자산군 영향 분석',
    category: 'Macro Event',
    date: '2026. 10. 27',
    summary:
      '다가오는 11월 FOMC에서 25bp 인하 확률이 95%로 수렴한 가운데, 채권 금리 반등과 달러 강세(트럼프 트레이드)가 주식 및 크립토 시장에 미칠 파급력을 점검합니다.',
    highlights: [
      '기준금리 25bp 인하 기정사실화 vs 12월 동결 가능성에 시장 경계',
      '미국채 금리 상단 4.30% 테스트 가능성: 성장주 밸류에이션 부담 체크',
      '스윙 전략: 고환율 수혜 수출주 및 AI 하드웨어 밸류체인 분할 접근 유효',
    ],
    impact: 'Bullish',
    readTime: '5 min read',
  },
];
