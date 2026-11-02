import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { SectorApiResponse, SectorItem, SectorStatus } from '@/types';

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

interface SectorMeta {
  symbol: string;
  name: string;
  nameKo: string;
  weight: string;
  leadingStocks: string[];
}

const SECTOR_METAS: SectorMeta[] = [
  { symbol: 'XLK', name: 'Technology', nameKo: '기술 · 반도체', weight: '31.2%', leadingStocks: ['NVDA', 'AAPL', 'MSFT', 'AVGO'] },
  { symbol: 'XLF', name: 'Financials', nameKo: '금융 · 은행', weight: '13.4%', leadingStocks: ['JPM', 'BRK.B', 'V', 'MA'] },
  { symbol: 'XLV', name: 'Health Care', nameKo: '헬스케어 · 제약', weight: '11.8%', leadingStocks: ['LLY', 'UNH', 'JNJ', 'ABBV'] },
  { symbol: 'XLY', name: 'Consumer Discretionary', nameKo: '임의소비재 · 전기차', weight: '10.3%', leadingStocks: ['AMZN', 'TSLA', 'HD', 'MCD'] },
  { symbol: 'XLC', name: 'Communication Services', nameKo: '통신 · 빅테크 미디어', weight: '9.1%', leadingStocks: ['GOOGL', 'META', 'NFLX', 'DIS'] },
  { symbol: 'XLI', name: 'Industrials', nameKo: '산업재 · 방산 · 항공', weight: '8.4%', leadingStocks: ['GE', 'CAT', 'RTX', 'UNP'] },
  { symbol: 'XLP', name: 'Consumer Staples', nameKo: '필수소비재 · 방어주', weight: '5.8%', leadingStocks: ['PG', 'COST', 'KO', 'PEP'] },
  { symbol: 'XLE', name: 'Energy', nameKo: '에너지 · 원유', weight: '3.6%', leadingStocks: ['XOM', 'CVX', 'COP', 'SLB'] },
  { symbol: 'XLU', name: 'Utilities', nameKo: '유틸리티 · AI 전력인프라', weight: '2.5%', leadingStocks: ['NEE', 'SO', 'CEG', 'DUK'] },
  { symbol: 'XLB', name: 'Materials', nameKo: '소재 · 원자재', weight: '2.2%', leadingStocks: ['LIN', 'SHW', 'FCX', 'NEM'] },
  { symbol: 'XLRE', name: 'Real Estate', nameKo: '부동산 · 데이터센터 리츠', weight: '1.7%', leadingStocks: ['PLD', 'AMT', 'EQIX', 'SPG'] },
];

export async function GET() {
  try {
    const oneMonthAgo = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000);

    const chartPromises = SECTOR_METAS.map((meta) =>
      yf
        .chart(meta.symbol, { period1: oneMonthAgo, interval: '1d' })
        .then((res) => ({ meta, chart: res }))
        .catch(() => ({ meta, chart: null }))
    );

    const results = await Promise.all(chartPromises);

    const parsedSectors: Omit<SectorItem, 'rank' | 'status' | 'statusLabel'>[] = results.map(({ meta, chart }) => {
      const quotes = chart?.quotes || [];
      const closes = quotes.map((q: any) => q.close).filter((c: any) => typeof c === 'number') as number[];

      if (closes.length === 0) {
        return {
          symbol: meta.symbol,
          name: meta.name,
          nameKo: meta.nameKo,
          price: 0,
          displayPrice: '--',
          change1d: 0,
          change1w: 0,
          change1m: 0,
          weight: meta.weight,
          leadingStocks: meta.leadingStocks,
          sparkline: [],
        };
      }

      const current = closes[closes.length - 1];
      const prev1d = closes.length >= 2 ? closes[closes.length - 2] : current;
      const prev1w = closes.length >= 6 ? closes[closes.length - 6] : closes[0];
      const prev1m = closes[0];

      const change1d = Number((((current - prev1d) / prev1d) * 100).toFixed(2));
      const change1w = Number((((current - prev1w) / prev1w) * 100).toFixed(2));
      const change1m = Number((((current - prev1m) / prev1m) * 100).toFixed(2));

      // 최근 7개 종가 스파크라인
      const sparkline = closes.slice(-7).map((v) => Number(v.toFixed(2)));

      return {
        symbol: meta.symbol,
        name: meta.name,
        nameKo: meta.nameKo,
        price: Number(current.toFixed(2)),
        displayPrice: `$${current.toFixed(2)}`,
        change1d,
        change1w,
        change1m,
        weight: meta.weight,
        leadingStocks: meta.leadingStocks,
        sparkline,
      };
    });

    // 1주(1W) 등락률 기준으로 내림차순 정렬 (Selah Rule 2 주간 랭킹 기준)
    parsedSectors.sort((a, b) => b.change1w - a.change1w);

    // 랭킹 및 상태 판정 부여
    const sectors: SectorItem[] = parsedSectors.map((sec, idx) => {
      const rank = idx + 1;
      let status: SectorStatus = 'NEUTRAL';
      let statusLabel = '중립/보합';

      if (rank <= 3) {
        if (sec.change1m > 0 && sec.change1w > 0) {
          status = 'LEADER';
          statusLabel = '👑 주도 섹터';
        } else {
          status = 'ROTATION';
          statusLabel = '🔥 순환매 유입';
        }
      } else if (rank >= 9) {
        status = 'LAGGING';
        statusLabel = '❄️ 자금 이탈 (비추천)';
      }

      return {
        ...sec,
        rank,
        status,
        statusLabel,
      };
    });

    const advancingCount = sectors.filter((s) => s.change1d > 0).length;
    const decliningCount = sectors.filter((s) => s.change1d < 0).length;

    let regime: 'RISK_ON' | 'RISK_OFF' | 'ROTATION' = 'ROTATION';
    let regimeLabel = '자금 순환매 지속 (차별화 장세)';

    if (advancingCount >= 8) {
      regime = 'RISK_ON';
      regimeLabel = '전방위 리스크-온 (대다수 섹터 상승)';
    } else if (decliningCount >= 8) {
      regime = 'RISK_OFF';
      regimeLabel = '시장 전반 리스크-오프 (방어주 선호)';
    }

    const responseData: SectorApiResponse = {
      sectors,
      leadingSector: sectors[0]?.nameKo || '기술 · 반도체',
      laggingSector: sectors[sectors.length - 1]?.nameKo || '에너지',
      marketBreadth: {
        advancingCount,
        decliningCount,
        regime,
        regimeLabel,
      },
      lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('API Sectors Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sector data', message: error.message },
      { status: 500 }
    );
  }
}
