import { getHyperliquidApiUrl, type HyperliquidEnv } from "@/lib/hyperliquid/config";
import type {
  AllMids,
  Candle,
  ClearinghouseState,
  Fill,
  FundingHistoryItem,
  HyperliquidMeta,
  L2Book,
  OpenOrder,
  UserState
} from "@/lib/hyperliquid/types";

async function infoRequest<T>(body: Record<string, unknown>, env?: HyperliquidEnv): Promise<T> {
  const response = await fetch(`${getHyperliquidApiUrl(env)}/info`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Hyperliquid info request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function withDex(body: Record<string, unknown>, dex?: string) {
  return dex ? { ...body, dex } : body;
}

export function getMeta(env?: HyperliquidEnv, dex?: string) {
  return infoRequest<HyperliquidMeta>(withDex({ type: "meta" }, dex), env);
}

export function getAllMids(env?: HyperliquidEnv, dex?: string) {
  return infoRequest<AllMids>(withDex({ type: "allMids" }, dex), env);
}

export function getUserState(address: string, env?: HyperliquidEnv) {
  return infoRequest<UserState>({ type: "clearinghouseState", user: address }, env);
}

export function getClearinghouseState(address: string, env?: HyperliquidEnv) {
  return infoRequest<ClearinghouseState>(
    { type: "clearinghouseState", user: address },
    env
  );
}

export function getOpenOrders(address: string, env?: HyperliquidEnv, dex?: string) {
  return infoRequest<OpenOrder[]>(withDex({ type: "openOrders", user: address }, dex), env);
}

export function getUserFills(address: string, env?: HyperliquidEnv) {
  return infoRequest<Fill[]>({ type: "userFills", user: address }, env);
}

export function getOrderBook(asset: string, env?: HyperliquidEnv, dex?: string) {
  return infoRequest<L2Book>(withDex({ type: "l2Book", coin: asset }, dex), env);
}

export function getFundingHistory(asset: string, env?: HyperliquidEnv, dex?: string) {
  return infoRequest<FundingHistoryItem[]>(
    withDex({ type: "fundingHistory", coin: asset, startTime: Date.now() - 86_400_000 }, dex),
    env
  );
}

export function getCandles(
  symbol: string,
  interval: "1m" | "5m" | "15m" | "1h" | "4h" | "1d",
  env?: HyperliquidEnv
) {
  const now = Date.now();
  return infoRequest<Candle[]>(
    {
      type: "candleSnapshot",
      req: {
        coin: symbol,
        interval,
        startTime: now - 86_400_000,
        endTime: now
      }
    },
    env
  );
}
