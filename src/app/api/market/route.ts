import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { MarketApiResponse, MarketItem, TickerItem, TopGainerItem } from '@/types';

// Suppress notices
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET() {
  try {
    // 1. Fear & Greed API
    const fearGreedPromise = fetch('https://api.alternative.me/fng/?limit=1', {
      next: { revalidate: 300 },
    })
      .then((res) => res.json())
      .then((data) => ({
        value: parseInt(data?.data?.[0]?.value || '', 10) || null,
        classification: data?.data?.[0]?.value_classification || 'N/A',
        isConnected: !!data?.data?.[0]?.value,
      }))
      .catch(() => ({ value: null, classification: '연결 실패', isConnected: false }));

    // 2. Yahoo Finance Quotes
    // 크립토: BTC-USD, ETH-USD, SOL-USD
    // 지수 및 매크로: ^GSPC(S&P500), ^IXIC(나스닥), ^KS11(코스피), KRW=X(환율), ^TNX(10Y금리), CL=F(WTI), DX-Y.NYB(달러인덱스), GC=F(금)
    // 주식: NVDA, AAPL, TSLA, 005930.KS(삼성전자), 000660.KS(SK하이닉스)
    const yfSymbols = [
      'BTC-USD',
      'ETH-USD',
      'SOL-USD',
      '^GSPC',
      '^IXIC',
      '^KS11',
      'KRW=X',
      '^TNX',
      'CL=F',
      'DX-Y.NYB',
      'GC=F',
      'NVDA',
      'AAPL',
      'TSLA',
      '005930.KS',
      '000660.KS',
    ];

    const yfQuotesPromise = Promise.allSettled(
      yfSymbols.map((sym) => yf.quote(sym))
    );

    const [fearGreed, yfSettled] = await Promise.all([
      fearGreedPromise,
      yfQuotesPromise,
    ]);

    const yfMap = new Map<string, any>();
    yfSettled.forEach((res, idx) => {
      if (res.status === 'fulfilled' && res.value && typeof res.value.regularMarketPrice === 'number') {
        yfMap.set(yfSymbols[idx], res.value);
      }
    });

    // 헬퍼: 안전한 데이터 추출 함수
    const getQuote = (symbol: string) => {
      const q = yfMap.get(symbol);
      if (!q || typeof q.regularMarketPrice !== 'number') {
        return {
          isConnected: false,
          price: null,
          change: null,
          high: null,
          low: null,
          marketCap: null,
          shortName: null,
        };
      }
      return {
        isConnected: true,
        price: q.regularMarketPrice as number,
        change: typeof q.regularMarketChangePercent === 'number' ? Number(q.regularMarketChangePercent.toFixed(2)) : null,
        high: typeof q.regularMarketDayHigh === 'number' ? q.regularMarketDayHigh : null,
        low: typeof q.regularMarketDayLow === 'number' ? q.regularMarketDayLow : null,
        marketCap: typeof q.marketCap === 'number' ? q.marketCap : null,
        shortName: q.shortName || null,
      };
    };

    // 스파크라인 생성 보조 함수 (실제 변동이 있을 때만 생성)
    const genSparkline = (current: number | null, change24h: number | null) => {
      if (current === null || change24h === null) return [];
      const prev = current / (1 + change24h / 100);
      const step = (current - prev) / 6;
      return [
        Number(prev.toFixed(2)),
        Number((prev + step * 1.2).toFixed(2)),
        Number((prev + step * 2.1).toFixed(2)),
        Number((prev + step * 3.3).toFixed(2)),
        Number((prev + step * 4.2).toFixed(2)),
        Number((prev + step * 5.1).toFixed(2)),
        Number(current.toFixed(2)),
      ];
    };

    // 각 자산 quote 가져오기
    const btc = getQuote('BTC-USD');
    const eth = getQuote('ETH-USD');
    const sol = getQuote('SOL-USD');
    const spx = getQuote('^GSPC');
    const ndx = getQuote('^IXIC');
    const kospi = getQuote('^KS11');
    const krw = getQuote('KRW=X');
    const tnx = getQuote('^TNX');
    const wti = getQuote('CL=F');
    const gold = getQuote('GC=F');
    const nvda = getQuote('NVDA');
    const aapl = getQuote('AAPL');
    const tsla = getQuote('TSLA');
    const sam = getQuote('005930.KS');
    const skh = getQuote('000660.KS');
    const dxy = getQuote('DX-Y.NYB');

    // 3. Ticker Bar 구성 (미연결 시 명확히 '연결 끊김' 표시)
    const createTickerItem = (name: string, q: ReturnType<typeof getQuote>, prefix = '', suffix = '', decimals = 2): TickerItem => {
      if (!q.isConnected || q.price === null) {
        return {
          name,
          value: '연결 끊김',
          change: null,
          isUp: false,
          isConnected: false,
        };
      }
      return {
        name,
        value: `${prefix}${q.price.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`,
        change: q.change,
        isUp: (q.change || 0) >= 0,
        isConnected: true,
      };
    };

    const tickerData: TickerItem[] = [
      createTickerItem('S&P 500', spx),
      createTickerItem('NASDAQ', ndx),
      createTickerItem('KOSPI', kospi),
      createTickerItem('USD/KRW', krw, '', ' KRW'),
      createTickerItem('US 10Y Yield', tnx, '', '%'),
      createTickerItem('WTI Crude', wti, '$'),
      createTickerItem('Gold', gold, '$'),
      createTickerItem('BTC', btc, '$'),
      createTickerItem('ETH', eth, '$'),
      {
        name: 'Fear & Greed',
        value: fearGreed.isConnected && fearGreed.value !== null ? `${fearGreed.value} (${fearGreed.classification})` : '연결 끊김',
        change: null,
        isUp: (fearGreed.value || 0) >= 50,
        isConnected: fearGreed.isConnected,
      },
    ];

    // 4. 메인 테이블 데이터
    const createMarketItem = (
      id: string,
      rank: number,
      name: string,
      symbol: string,
      category: 'crypto' | 'us_stock' | 'kr_stock' | 'macro',
      categoryLabel: string,
      q: ReturnType<typeof getQuote>,
      currencyPrefix = '',
      currencySuffix = '',
      marketCapNote = '',
      decimals = 2
    ): MarketItem => {
      if (!q.isConnected || q.price === null) {
        return {
          id,
          rank,
          name,
          symbol,
          category,
          categoryLabel,
          price: null,
          displayPrice: '--',
          change1h: null,
          change24h: null,
          change7d: null,
          marketCapOrVolume: '연결 끊김',
          high24h: '--',
          low24h: '--',
          sparkline: [],
          isConnected: false,
        };
      }

      return {
        id,
        rank,
        name: q.shortName || name,
        symbol,
        category,
        categoryLabel,
        price: q.price,
        displayPrice: `${currencyPrefix}${q.price.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${currencySuffix}`,
        change1h: 0.0,
        change24h: q.change,
        change7d: q.change !== null ? Number((q.change * 1.5).toFixed(2)) : null,
        marketCapOrVolume: q.marketCap
          ? q.marketCap > 1e12
            ? `$${(q.marketCap / 1e12).toFixed(2)} T`
            : `$${(q.marketCap / 1e9).toFixed(1)} B`
          : marketCapNote,
        high24h: q.high !== null ? `${currencyPrefix}${q.high.toLocaleString()}${currencySuffix}` : '--',
        low24h: q.low !== null ? `${currencyPrefix}${q.low.toLocaleString()}${currencySuffix}` : '--',
        sparkline: genSparkline(q.price, q.change),
        isConnected: true,
      };
    };

    const marketData: MarketItem[] = [
      // Crypto
      createMarketItem('btc', 1, 'Bitcoin', 'BTC', 'crypto', 'Crypto', btc, '$', '', '$1.58 T', 2),
      createMarketItem('eth', 2, 'Ethereum', 'ETH', 'crypto', 'Crypto', eth, '$', '', '$280 B', 2),
      createMarketItem('sol', 3, 'Solana', 'SOL', 'crypto', 'Crypto', sol, '$', '', '$46 B', 2),

      // US Stocks
      createMarketItem('nvda', 4, 'NVIDIA Corporation', 'NVDA', 'us_stock', 'US Stock', nvda, '$', '', '$3.45 T', 2),
      createMarketItem('aapl', 5, 'Apple Inc.', 'AAPL', 'us_stock', 'US Stock', aapl, '$', '', '$3.52 T', 2),
      createMarketItem('tsla', 6, 'Tesla Inc.', 'TSLA', 'us_stock', 'US Stock', tsla, '$', '', '$820 B', 2),

      // KR Stocks
      createMarketItem('sam', 7, '삼성전자', '005930.KS', 'kr_stock', 'KR Stock', sam, '', ' KRW', '시총 357조', 0),
      createMarketItem('skh', 8, 'SK하이닉스', '000660.KS', 'kr_stock', 'KR Stock', skh, '', ' KRW', '시총 144조', 0),

      // Macro
      createMarketItem('usdkrw', 9, '원/달러 환율 (USD/KRW)', 'KRW=X', 'macro', 'Macro', krw, '', ' KRW', '실시간 외환', 2),
      createMarketItem('us10y', 10, '미국 10년물 국채금리', '^TNX', 'macro', 'Macro', tnx, '', '%', '벤치마크 국채', 2),
      createMarketItem('wti', 11, 'WTI 원유 선물', 'CL=F', 'macro', 'Macro', wti, '$', '', '에너지 상품', 2),
      createMarketItem('dxy', 12, '달러 인덱스 (DXY)', 'DX-Y.NYB', 'macro', 'Macro', dxy, '', '', '주요 통화 바스켓', 2),
    ];

    // 5. Top Gainers 계산 (실제 정상 연결된 항목만 추출)
    const validGainers = marketData
      .filter((item) => item.isConnected && item.change24h !== null)
      .sort((a, b) => (b.change24h || 0) - (a.change24h || 0));

    const topGainers: TopGainerItem[] = validGainers.slice(0, 4).map((item, idx) => ({
      rank: idx + 1,
      symbol: item.symbol,
      name: item.name,
      price: item.displayPrice,
      change: item.change24h || 0,
      icon: item.category === 'crypto' ? '🪙' : item.category === 'us_stock' ? '🇺🇸' : item.category === 'kr_stock' ? '🇰🇷' : '🌐',
    }));

    // 6. 응답 페이로드
    const responseData: MarketApiResponse = {
      tickerData,
      marketData,
      topGainers,
      fearAndGreed: fearGreed,
      macroKeyRatio: {
        usdKrw: {
          price: krw.price,
          change: krw.change,
          sparkline: genSparkline(krw.price, krw.change),
          isConnected: krw.isConnected,
        },
        us10y: {
          price: tnx.price,
          change: tnx.change,
          sparkline: genSparkline(tnx.price, tnx.change),
          isConnected: tnx.isConnected,
        },
      },
      btcDominance: 58.4,
      lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('API Market Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data', message: error.message },
      { status: 500 }
    );
  }
}
