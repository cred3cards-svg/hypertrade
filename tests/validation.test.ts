import { describe, expect, it, vi } from "vitest";
import { assertMainnetGate } from "@/lib/hyperliquid/config";
import { createLocalOrderIntent } from "@/lib/orders/createOrderIntent";
import { validateMarketTradable } from "@/lib/validation/market";
import {
  orderTicketSchema,
  validateLeverage,
  validateOrderForSubmission,
  validateReduceOnly
} from "@/lib/validation/order";
import type { MarketConfig } from "@/lib/validation/market";

const market: MarketConfig = {
  id: "m1",
  symbol: "AAPL-PERP",
  displayName: "Apple Derived Perpetual",
  baseAsset: "AAPL",
  quoteAsset: "USDC",
  hyperliquidAssetId: 123,
  isHip3: true,
  oracleDescription: "Verified oracle",
  maxLeverage: 5,
  minOrderSize: 0.001,
  tickSize: 0.01,
  szDecimals: 3,
  enabled: true,
  testnetOnly: true
};

const order = {
  walletAddress: "0x0000000000000000000000000000000000000001",
  marketId: market.id,
  hyperliquidAssetId: market.hyperliquidAssetId,
  side: "BUY" as const,
  orderType: "LIMIT" as const,
  quantity: 1,
  limitPrice: 100,
  reduceOnly: false,
  leverage: 2,
  slippageBps: 50,
  riskAcknowledged: true,
  mainnetConfirmed: false
};

describe("validation", () => {
  it("validates order ticket shape", () => {
    expect(orderTicketSchema.safeParse(order).success).toBe(true);
  });

  it("rejects leverage above max", () => {
    expect(validateLeverage(6, market)).toBe(false);
  });

  it("validates reduce-only direction", () => {
    expect(validateReduceOnly(true, 2, "SELL")).toBe(true);
    expect(validateReduceOnly(true, 2, "BUY")).toBe(false);
    expect(validateReduceOnly(true, 0, "SELL")).toBe(false);
  });

  it("rejects disabled markets", () => {
    const result = validateMarketTradable({ ...market, enabled: false }, "testnet");
    expect(result.ok).toBe(false);
  });

  it("rejects missing asset IDs", () => {
    const result = validateMarketTradable({ ...market, hyperliquidAssetId: null }, "testnet");
    expect(result.ok).toBe(false);
  });

  it("requires mainnet confirmation", () => {
    const result = validateOrderForSubmission({
      order,
      market: { ...market, testnetOnly: false },
      env: "mainnet"
    });
    expect(result.ok).toBe(false);
  });

  it("passes a valid testnet order", () => {
    const result = validateOrderForSubmission({ order, market, env: "testnet" });
    expect(result.ok).toBe(true);
  });

  it("gates mainnet env without explicit flag", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_MAINNET_TRADING", "false");
    expect(() => assertMainnetGate("mainnet")).toThrow(/Mainnet trading is disabled/);
    vi.unstubAllEnvs();
  });

  it("creates local order intents", () => {
    const intent = createLocalOrderIntent(order);
    expect(intent.clientOrderId).toMatch(/^dp_/);
    expect(intent.status).toBe("DRAFT");
  });
});
