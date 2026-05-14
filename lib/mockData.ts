import { DEFAULT_MARKETS } from "@/lib/constants";

export const marketStats = DEFAULT_MARKETS.map((market, index) => ({
  ...market,
  friendlyName:
    {
      "test:ABC": "Test ABC",
      "AAPL-PERP": "Apple",
      "TSLA-PERP": "Tesla",
      "NVDA-PERP": "Nvidia",
      "META-PERP": "Meta",
      "AMZN-PERP": "Amazon",
      "MSFT-PERP": "Microsoft",
      "GOOGL-PERP": "Google",
      "SPY-PERP": "S&P 500"
    }[market.symbol] ?? market.displayName,
  logo:
    {
      "test:ABC": "T",
      "AAPL-PERP": "A",
      "TSLA-PERP": "T",
      "NVDA-PERP": "N",
      "META-PERP": "M",
      "AMZN-PERP": "A",
      "MSFT-PERP": "M",
      "GOOGL-PERP": "G",
      "SPY-PERP": "S"
    }[market.symbol] ?? market.baseAsset.slice(0, 1),
  description:
    {
      "test:ABC":
        "Test ABC is Hyperliquid's documented HIP-3 testnet example market. It is useful for testing the unified perp API with asset ID 110000.",
      "AAPL-PERP":
        "Apple-derived perpetual market tracks price exposure to Apple without giving ownership of Apple stock.",
      "TSLA-PERP":
        "Tesla-derived perpetual market tracks price exposure to Tesla without giving ownership of Tesla stock.",
      "NVDA-PERP":
        "Nvidia-derived perpetual market tracks price exposure to Nvidia without giving ownership of Nvidia stock.",
      "META-PERP":
        "Meta-derived perpetual market tracks price exposure to Meta without giving ownership of Meta stock.",
      "AMZN-PERP":
        "Amazon-derived perpetual market tracks price exposure to Amazon without giving ownership of Amazon stock.",
      "MSFT-PERP":
        "Microsoft-derived perpetual market tracks price exposure to Microsoft without giving ownership of Microsoft stock.",
      "GOOGL-PERP":
        "Google-derived perpetual market tracks price exposure to Alphabet without giving ownership of Alphabet stock.",
      "SPY-PERP":
        "S&P 500-derived perpetual market tracks broad market price exposure without giving ownership of SPY shares."
    }[market.symbol] ?? market.oracleDescription,
  markPrice: [1.0, 278.0, 226.925, 174.0, 644.0, 233.75, 475.0, 306.0, 512.44][index],
  indexPrice: [1.0, 278.0, 226.925, 174.0, 644.0, 233.75, 475.0, 306.0, 512.4][index],
  funding: [0.001, 0.012, -0.004, 0.018, 0.003, -0.006, 0.007, 0.002, 0.001][index],
  volume24h:
    [0.4, 18.4, 26.2, 44.8, 12.9, 17.1, 22.8, 11.2, 58.6][index] * 1_000_000,
  openInterest:
    [0.1, 5.2, 7.8, 11.3, 3.4, 4.1, 6.3, 2.8, 20.4][index] * 1_000_000,
  change24h: [0.12, 1.24, -2.18, 4.61, 0.83, -0.42, 1.72, 0.29, 0.58][index]
}));

export type SimpleMarket = (typeof marketStats)[number];

export function getMarketBySymbol(symbol: string) {
  return marketStats.find((market) => market.symbol.toLowerCase() === symbol.toLowerCase());
}

export function getMarketSlug(symbol: string) {
  return symbol
    .toLowerCase()
    .replace("-perp", "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getMarketBySlug(slug: string) {
  const normalized = decodeURIComponent(slug).toLowerCase();
  return marketStats.find((market) => getMarketSlug(market.symbol) === normalized);
}

export const orderBookRows = Array.from({ length: 12 }, (_, i) => ({
  ask: 224.12 + (12 - i) * 0.05,
  askSize: 12.4 + i * 1.7,
  bid: 224.12 - (i + 1) * 0.05,
  bidSize: 15.6 + i * 1.2
}));

export const recentTrades = Array.from({ length: 15 }, (_, i) => ({
  price: 224.12 + (i % 3) * 0.03,
  size: 2.1 + i * 0.18,
  side: i % 2 === 0 ? "BUY" : "SELL",
  time: `${12 + Math.floor(i / 5)}:${String(48 + i).padStart(2, "0")}`
}));

export const chartData = Array.from({ length: 48 }, (_, i) => ({
  t: i,
  price: 220 + Math.sin(i / 4) * 2 + i * 0.08,
  volume: 3000 + Math.cos(i / 3) * 900
}));
