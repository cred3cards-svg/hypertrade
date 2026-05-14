import { beforeEach, describe, expect, it, vi } from "vitest";
import { cancelOrder, placeLimitOrder, placeMarketOrder } from "@/lib/hyperliquid/exchangeClient";
import { getAllMids, getMeta, getUserState } from "@/lib/hyperliquid/infoClient";

const signedPayload = {
  action: { type: "order", orders: [], grouping: "na" },
  nonce: 1,
  signature: { r: "0x1", s: "0x2", v: 27 }
};

describe("Hyperliquid clients", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_HYPERLIQUID_ENV", "testnet");
    global.fetch = vi.fn(async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      if (body.type === "meta") return Response.json({ universe: [{ name: "BTC", szDecimals: 5, maxLeverage: 50 }] });
      if (body.type === "allMids") return Response.json({ BTC: "65000" });
      if (body.type === "clearinghouseState") return Response.json({ assetPositions: [], crossMarginSummary: { accountValue: "0", totalMarginUsed: "0", totalNtlPos: "0", totalRawUsd: "0" }, withdrawable: "0" });
      return Response.json({ status: "ok", response: { type: "default" } });
    }) as typeof fetch;
  });

  it("gets meta", async () => {
    await expect(getMeta("testnet")).resolves.toMatchObject({ universe: [{ name: "BTC" }] });
  });

  it("gets all mids", async () => {
    await expect(getAllMids("testnet")).resolves.toEqual({ BTC: "65000" });
  });

  it("gets user state", async () => {
    await expect(getUserState("0x0000000000000000000000000000000000000001", "testnet")).resolves.toMatchObject({ assetPositions: [] });
  });

  it("places limit orders", async () => {
    await expect(placeLimitOrder(signedPayload, "testnet")).resolves.toMatchObject({ status: "ok" });
  });

  it("places market orders", async () => {
    await expect(placeMarketOrder(signedPayload, "testnet")).resolves.toMatchObject({ status: "ok" });
  });

  it("cancels orders", async () => {
    await expect(cancelOrder(signedPayload, "testnet")).resolves.toMatchObject({ status: "ok" });
  });
});
