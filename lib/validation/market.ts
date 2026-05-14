import { z } from "zod";

export const marketSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(3).max(32),
  displayName: z.string().min(3),
  baseAsset: z.string().min(1),
  quoteAsset: z.string().default("USDC"),
  hyperliquidAssetId: z.number().int().nonnegative().nullable(),
  hyperliquidCoin: z.string().min(1).optional(),
  hyperliquidDex: z.string().min(1).optional(),
  isHip3: z.boolean(),
  oracleDescription: z.string().min(3),
  maxLeverage: z.number().int().positive().max(50),
  minOrderSize: z.number().positive(),
  tickSize: z.number().positive(),
  szDecimals: z.number().int().min(0).max(12),
  enabled: z.boolean(),
  testnetOnly: z.boolean()
});

export type MarketConfig = z.infer<typeof marketSchema>;

export function validateMarketTradable(
  market: MarketConfig,
  env: "testnet" | "mainnet"
) {
  if (!market.enabled) return { ok: false as const, reason: "Market is disabled." };
  if (market.testnetOnly && env === "mainnet") {
    return { ok: false as const, reason: "Market is testnet only." };
  }
  if (market.hyperliquidAssetId === null) {
    return {
      ok: false as const,
      reason: "Hyperliquid asset ID is not configured. Verify from meta first."
    };
  }
  return { ok: true as const };
}
