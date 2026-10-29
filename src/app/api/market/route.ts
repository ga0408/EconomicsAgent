import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { MarketApiResponse, MarketItem, TickerItem, TopGainerItem } from '@/types';

// Suppress notices
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET() {
  try {
    // 1. 병렬로 데이터 호출 준비
    // A. Fear & Greed API
    const fearGreedPromise = fetch('https://api.alternative.me/fng/?limit=1', {
      next: { revalidate: 300 },
    })
      .then((res) => res.json())
      .then((data) => ({
        value: parseInt(data?.data?.[0]?.value || '50', 10),
        classification: data?.data?.[0]?.value_classification || 'Neutral',
      }))
      .catch(() => ({ value: 50, classification: 'Neutral' }));

    // B. Binance Crypto API (BTC, ETH, SOL)
    const binancePromise = fetch(
      'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]',
      { next: { revalidate: 60 } }
    )
      .then((res) => res.json())
      .catch(() => []);

    // C. Yahoo Finance Quotes
    // 지수 및 매크로: ^GSPC(S&P500), ^IXIC(나스닥), ^KS11(코스피), KRW=X(환율), ^TNX(10Y금리), CL=F(WTI), DX-Y.NYB(달러인덱스), GC=F(금)
    // 주식: NVDA, AAPL, TSLA, 005930.KS(삼성전자), 000660.KS(SK하이닉스)
    const yfSymbols = [
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

    // 병렬 실행 대기
    const [fearGreed, binanceData, yfSettled] = await Promise.all([
      fearGreedPromise,
      binancePromise,
      yfQuotesPromise,
    ]);

    // Yahoo Finance 데이터 맵 구성
    const yfMap = new Map<string, any>();
    yfSettled.forEach((res, idx) => {
      if (res.status === 'fulfilled' && res.value) {
        yfMap.set(yfSymbols[idx], res.value);
      }
    });

    // 2. Ticker Bar 데이터 매핑
    const spx = yfMap.get('^GSPC');
    const ndx = yfMap.get('^IXIC');
    const kospi = yfMap.get('^KS11');
    const krw = yfMap.get('KRW=X');
    const tnx = yfMap.get('^TNX');
    const wti = yfMap.get('CL=F');
    const gold = yfMap.get('GC=F');

    const btcTicker = Array.isArray(binanceData)
      ? binanceData.find((b: any) => b.symbol === 'BTCUSDT')
      : null;
    const ethTicker = Array.isArray(binanceData)
      ? binanceData.find((b: any) => b.symbol === 'ETHUSDT')
      : null;
    const solTicker = Array.isArray(binanceData)
      ? binanceData.find((b: any) => b.symbol === 'SOLUSDT')
      : null;

    const btcPrice = btcTicker ? parseFloat(btcTicker.lastPrice) : 80000;
    const btcChange = btcTicker ? parseFloat(btcTicker.priceChangePercent) : 0;
    const ethPrice = ethTicker ? parseFloat(ethTicker.lastPrice) : 2500;
    const ethChange = ethTicker ? parseFloat(ethTicker.priceChangePercent) : 0;
    const solPrice = solTicker ? parseFloat(solTicker.lastPrice) : 180;
    const solChange = solTicker ? parseFloat(solTicker.priceChangePercent) : 0;

    const tickerData: TickerItem[] = [
      {
        name: 'S&P 500',
        value: spx?.regularMarketPrice?.toLocaleString() || '7,743.98',
        change: Number(spx?.regularMarketChangePercent?.toFixed(2)) || 0.28,
        isUp: (spx?.regularMarketChangePercent || 0) >= 0,
      },
      {
        name: 'NASDAQ',
        value: ndx?.regularMarketPrice?.toLocaleString() || '18,500.00',
        change: Number(ndx?.regularMarketChangePercent?.toFixed(2)) || 0.45,
        isUp: (ndx?.regularMarketChangePercent || 0) >= 0,
      },
      {
        name: 'KOSPI',
        value: kospi?.regularMarketPrice?.toLocaleString() || '2,610.00',
        change: Number(kospi?.regularMarketChangePercent?.toFixed(2)) || -0.35,
        isUp: (kospi?.regularMarketChangePercent || 0) >= 0,
      },
      {
        name: 'USD/KRW',
        value: krw?.regularMarketPrice?.toFixed(2) || '1,337.50',
        change: Number(krw?.regularMarketChangePercent?.toFixed(2)) || 0.15,
        isUp: (krw?.regularMarketChangePercent || 0) >= 0,
      },
      {
        name: 'US 10Y Yield',
        value: `${tnx?.regularMarketPrice?.toFixed(2) || '4.24'}%`,
        change: Number(tnx?.regularMarketChangePercent?.toFixed(2)) || 0.85,
        isUp: (tnx?.regularMarketChangePercent || 0) >= 0,
      },
      {
        name: 'WTI Crude',
        value: `$${wti?.regularMarketPrice?.toFixed(2) || '71.50'}`,
        change: Number(wti?.regularMarketChangePercent?.toFixed(2)) || -1.2,
        isUp: (wti?.regularMarketChangePercent || 0) >= 0,
      },
      {
        name: 'Gold',
        value: `$${gold?.regularMarketPrice?.toFixed(2) || '2,750.00'}`,
        change: Number(gold?.regularMarketChangePercent?.toFixed(2)) || 0.35,
        isUp: (gold?.regularMarketChangePercent || 0) >= 0,
      },
      {
        name: 'BTC',
        value: `$${btcPrice.toLocaleString()}`,
        change: Number(btcChange.toFixed(2)),
        isUp: btcChange >= 0,
      },
      {
        name: 'ETH',
        value: `$${ethPrice.toLocaleString()}`,
        change: Number(ethChange.toFixed(2)),
        isUp: ethChange >= 0,
      },
      {
        name: 'Fear & Greed',
        value: `${fearGreed.value} (${fearGreed.classification})`,
        change: 0,
        isUp: fearGreed.value >= 50,
      },
    ];

    // 3. 메인 테이블 데이터 (Market Items)
    const nvda = yfMap.get('NVDA');
    const aapl = yfMap.get('AAPL');
    const tsla = yfMap.get('TSLA');
    const sam = yfMap.get('005930.KS');
    const skh = yfMap.get('000660.KS');
    const dxy = yfMap.get('DX-Y.NYB');

    // 간단한 스파크라인 생성 보조 함수 (기본 데이터 기반 변동 생성)
    const genSparkline = (current: number, change24h: number) => {
      const prev = current / (1 + change24h / 100);
      const step = (current - prev) / 6;
      return [
        Number((prev).toFixed(2)),
        Number((prev + step * 1.2).toFixed(2)),
        Number((prev + step * 2.1).toFixed(2)),
        Number((prev + step * 3.3).toFixed(2)),
        Number((prev + step * 4.2).toFixed(2)),
        Number((prev + step * 5.1).toFixed(2)),
        Number(current.toFixed(2)),
      ];
    };

    const marketData: MarketItem[] = [
      // 1) 코인
      {
        id: 'btc',
        rank: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        category: 'crypto',
        categoryLabel: 'Crypto',
        price: btcPrice,
        displayPrice: `$${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        change1h: 0.15,
        change24h: Number(btcChange.toFixed(2)),
        change7d: Number((btcChange * 1.5).toFixed(2)),
        marketCapOrVolume: `$${((btcPrice * 19700000) / 1e12).toFixed(2)} T`,
        high24h: `$${(btcPrice * 1.02).toFixed(0)}`,
        low24h: `$${(btcPrice * 0.98).toFixed(0)}`,
        sparkline: genSparkline(btcPrice, btcChange),
      },
      {
        id: 'eth',
        rank: 2,
        name: 'Ethereum',
        symbol: 'ETH',
        category: 'crypto',
        categoryLabel: 'Crypto',
        price: ethPrice,
        displayPrice: `$${ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        change1h: -0.1,
        change24h: Number(ethChange.toFixed(2)),
        change7d: Number((ethChange * 1.2).toFixed(2)),
        marketCapOrVolume: `$${((ethPrice * 120000000) / 1e9).toFixed(1)} B`,
        high24h: `$${(ethPrice * 1.02).toFixed(1)}`,
        low24h: `$${(ethPrice * 0.98).toFixed(1)}`,
        sparkline: genSparkline(ethPrice, ethChange),
      },
      {
        id: 'sol',
        rank: 3,
        name: 'Solana',
        symbol: 'SOL',
        category: 'crypto',
        categoryLabel: 'Crypto',
        price: solPrice,
        displayPrice: `$${solPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        change1h: 0.45,
        change24h: Number(solChange.toFixed(2)),
        change7d: Number((solChange * 1.8).toFixed(2)),
        marketCapOrVolume: `$${((solPrice * 460000000) / 1e9).toFixed(1)} B`,
        high24h: `$${(solPrice * 1.03).toFixed(1)}`,
        low24h: `$${(solPrice * 0.97).toFixed(1)}`,
        sparkline: genSparkline(solPrice, solChange),
      },

      // 2) 미국 주식
      {
        id: 'nvda',
        rank: 4,
        name: nvda?.shortName || 'NVIDIA Corporation',
        symbol: 'NVDA',
        category: 'us_stock',
        categoryLabel: 'US Stock',
        price: nvda?.regularMarketPrice || 215.38,
        displayPrice: `$${(nvda?.regularMarketPrice || 215.38).toFixed(2)}`,
        change1h: 0.25,
        change24h: Number((nvda?.regularMarketChangePercent || 1.85).toFixed(2)),
        change7d: 3.42,
        marketCapOrVolume: `$${((nvda?.marketCap || 3.4e12) / 1e12).toFixed(2)} T`,
        high24h: `$${(nvda?.regularMarketDayHigh || 218).toFixed(2)}`,
        low24h: `$${(nvda?.regularMarketDayLow || 212).toFixed(2)}`,
        sparkline: genSparkline(nvda?.regularMarketPrice || 215.38, nvda?.regularMarketChangePercent || 1.85),
      },
      {
        id: 'aapl',
        rank: 5,
        name: aapl?.shortName || 'Apple Inc.',
        symbol: 'AAPL',
        category: 'us_stock',
        categoryLabel: 'US Stock',
        price: aapl?.regularMarketPrice || 235.5,
        displayPrice: `$${(aapl?.regularMarketPrice || 235.5).toFixed(2)}`,
        change1h: -0.05,
        change24h: Number((aapl?.regularMarketChangePercent || 0.42).toFixed(2)),
        change7d: 1.15,
        marketCapOrVolume: `$${((aapl?.marketCap || 3.5e12) / 1e12).toFixed(2)} T`,
        high24h: `$${(aapl?.regularMarketDayHigh || 237).toFixed(2)}`,
        low24h: `$${(aapl?.regularMarketDayLow || 234).toFixed(2)}`,
        sparkline: genSparkline(aapl?.regularMarketPrice || 235.5, aapl?.regularMarketChangePercent || 0.42),
      },
      {
        id: 'tsla',
        rank: 6,
        name: tsla?.shortName || 'Tesla, Inc.',
        symbol: 'TSLA',
        category: 'us_stock',
        categoryLabel: 'US Stock',
        price: tsla?.regularMarketPrice || 260.0,
        displayPrice: `$${(tsla?.regularMarketPrice || 260.0).toFixed(2)}`,
        change1h: -0.3,
        change24h: Number((tsla?.regularMarketChangePercent || -1.25).toFixed(2)),
        change7d: 12.4,
        marketCapOrVolume: `$${((tsla?.marketCap || 8.3e11) / 1e9).toFixed(1)} B`,
        high24h: `$${(tsla?.regularMarketDayHigh || 265).toFixed(2)}`,
        low24h: `$${(tsla?.regularMarketDayLow || 257).toFixed(2)}`,
        sparkline: genSparkline(tsla?.regularMarketPrice || 260.0, tsla?.regularMarketChangePercent || -1.25),
      },

      // 3) 한국 주식
      {
        id: 'sam',
        rank: 7,
        name: '삼성전자',
        symbol: '005930.KS',
        category: 'kr_stock',
        categoryLabel: 'KR Stock',
        price: sam?.regularMarketPrice || 59800,
        displayPrice: `${(sam?.regularMarketPrice || 59800).toLocaleString()} KRW`,
        change1h: 0.0,
        change24h: Number((sam?.regularMarketChangePercent || 1.15).toFixed(2)),
        change7d: 2.3,
        marketCapOrVolume: `${((sam?.marketCap || 357e12) / 1e12).toFixed(0)}조 원`,
        high24h: (sam?.regularMarketDayHigh || 60200).toLocaleString(),
        low24h: (sam?.regularMarketDayLow || 58900).toLocaleString(),
        sparkline: genSparkline(sam?.regularMarketPrice || 59800, sam?.regularMarketChangePercent || 1.15),
      },
      {
        id: 'skh',
        rank: 8,
        name: 'SK하이닉스',
        symbol: '000660.KS',
        category: 'kr_stock',
        categoryLabel: 'KR Stock',
        price: skh?.regularMarketPrice || 198500,
        displayPrice: `${(skh?.regularMarketPrice || 198500).toLocaleString()} KRW`,
        change1h: 0.0,
        change24h: Number((skh?.regularMarketChangePercent || -0.85).toFixed(2)),
        change7d: 4.5,
        marketCapOrVolume: `${((skh?.marketCap || 144e12) / 1e12).toFixed(0)}조 원`,
        high24h: (skh?.regularMarketDayHigh || 202000).toLocaleString(),
        low24h: (skh?.regularMarketDayLow || 196000).toLocaleString(),
        sparkline: genSparkline(skh?.regularMarketPrice || 198500, skh?.regularMarketChangePercent || -0.85),
      },

      // 4) 거시경제 지표
      {
        id: 'usdkrw',
        rank: 9,
        name: '원/달러 환율 (USD/KRW)',
        symbol: 'KRW=X',
        category: 'macro',
        categoryLabel: 'Macro',
        price: krw?.regularMarketPrice || 1337.5,
        displayPrice: `${(krw?.regularMarketPrice || 1337.5).toFixed(2)} KRW`,
        change1h: 0.02,
        change24h: Number((krw?.regularMarketChangePercent || 0.15).toFixed(2)),
        change7d: 0.85,
        marketCapOrVolume: '실시간 외환',
        high24h: (krw?.regularMarketDayHigh || 1342.0).toFixed(2),
        low24h: (krw?.regularMarketDayLow || 1335.0).toFixed(2),
        sparkline: genSparkline(krw?.regularMarketPrice || 1337.5, krw?.regularMarketChangePercent || 0.15),
      },
      {
        id: 'us10y',
        rank: 10,
        name: '미국 10년물 국채금리',
        symbol: '^TNX',
        category: 'macro',
        categoryLabel: 'Macro',
        price: tnx?.regularMarketPrice || 4.24,
        displayPrice: `${(tnx?.regularMarketPrice || 4.24).toFixed(2)}%`,
        change1h: 0.1,
        change24h: Number((tnx?.regularMarketChangePercent || 0.85).toFixed(2)),
        change7d: 3.2,
        marketCapOrVolume: '벤치마크 국채',
        high24h: `${(tnx?.regularMarketDayHigh || 4.26).toFixed(2)}%`,
        low24h: `${(tnx?.regularMarketDayLow || 4.19).toFixed(2)}%`,
        sparkline: genSparkline(tnx?.regularMarketPrice || 4.24, tnx?.regularMarketChangePercent || 0.85),
      },
      {
        id: 'wti',
        rank: 11,
        name: 'WTI 원유 선물',
        symbol: 'CL=F',
        category: 'macro',
        categoryLabel: 'Macro',
        price: wti?.regularMarketPrice || 71.5,
        displayPrice: `$${(wti?.regularMarketPrice || 71.5).toFixed(2)}`,
        change1h: -0.15,
        change24h: Number((wti?.regularMarketChangePercent || -1.2).toFixed(2)),
        change7d: -2.8,
        marketCapOrVolume: '에너지 상품',
        high24h: `$${(wti?.regularMarketDayHigh || 72.8).toFixed(2)}`,
        low24h: `$${(wti?.regularMarketDayLow || 70.9).toFixed(2)}`,
        sparkline: genSparkline(wti?.regularMarketPrice || 71.5, wti?.regularMarketChangePercent || -1.2),
      },
      {
        id: 'dxy',
        rank: 12,
        name: '달러 인덱스 (DXY)',
        symbol: 'DX-Y.NYB',
        category: 'macro',
        categoryLabel: 'Macro',
        price: dxy?.regularMarketPrice || 104.28,
        displayPrice: (dxy?.regularMarketPrice || 104.28).toFixed(2),
        change1h: 0.01,
        change24h: Number((dxy?.regularMarketChangePercent || 0.12).toFixed(2)),
        change7d: 0.45,
        marketCapOrVolume: '주요 통화 바스켓',
        high24h: (dxy?.regularMarketDayHigh || 104.5).toFixed(2),
        low24h: (dxy?.regularMarketDayLow || 103.9).toFixed(2),
        sparkline: genSparkline(dxy?.regularMarketPrice || 104.28, dxy?.regularMarketChangePercent || 0.12),
      },
    ];

    // 4. Top Gainers 계산 (변동률 순 정렬)
    const sortedByGain = [...marketData].sort((a, b) => b.change24h - a.change24h);
    const topGainers: TopGainerItem[] = sortedByGain.slice(0, 4).map((item, idx) => ({
      rank: idx + 1,
      symbol: item.symbol,
      name: item.name,
      price: item.displayPrice,
      change: item.change24h,
      icon: item.category === 'crypto' ? '🪙' : item.category === 'us_stock' ? '🇺🇸' : item.category === 'kr_stock' ? '🇰🇷' : '🌐',
    }));

    // 5. 최종 응답 페이로드
    const responseData: MarketApiResponse = {
      tickerData,
      marketData,
      topGainers,
      fearAndGreed: fearGreed,
      macroKeyRatio: {
        usdKrw: {
          price: krw?.regularMarketPrice || 1337.5,
          change: Number((krw?.regularMarketChangePercent || 0.15).toFixed(2)),
          sparkline: genSparkline(krw?.regularMarketPrice || 1337.5, krw?.regularMarketChangePercent || 0.15),
        },
        us10y: {
          price: tnx?.regularMarketPrice || 4.24,
          change: Number((tnx?.regularMarketChangePercent || 0.85).toFixed(2)),
          sparkline: genSparkline(tnx?.regularMarketPrice || 4.24, tnx?.regularMarketChangePercent || 0.85),
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
