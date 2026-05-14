import { z } from "zod";
import type { MarketConfig } from "@/lib/validation/market";
import { validateMarketTradable } from "@/lib/validation/market";

export const orderTicketSchema = z
  .object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Wallet must be connected."),
    marketId: z.string().min(1),
    hyperliquidAssetId: z.number().int().nonnegative().nullable(),
    side: z.enum(["BUY", "SELL"]),
    orderType: z.enum(["MARKET", "LIMIT"]),
    quantity: z.coerce.number().positive(),
    limitPrice: z.coerce.number().positive().optional().nullable(),
    reduceOnly: z.boolean().default(false),
    leverage: z.coerce.number().int().positive(),
    slippageBps: z.coerce.number().int().min(0).max(500),
    riskAcknowledged: z.boolean(),
    mainnetConfirmed: z.boolean().default(false)
  })
  .superRefine((value, ctx) => {
    if (value.orderType === "LIMIT" && !value.limitPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["limitPrice"],
        message: "Limit price is required for limit orders."
      });
    }
    if (!value.riskAcknowledged) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["riskAcknowledged"],
        message: "Risk disclosure must be acknowledged."
      });
    }
  });

export type OrderTicketInput = z.infer<typeof orderTicketSchema>;

export function validateLeverage(leverage: number, market: Pick<MarketConfig, "maxLeverage">) {
  return leverage > 0 && leverage <= market.maxLeverage;
}

export function validateReduceOnly(
  reduceOnly: boolean,
  currentPositionSize: number,
  side: "BUY" | "SELL"
) {
  if (!reduceOnly) return true;
  if (currentPositionSize === 0) return false;
  return side === "BUY" ? currentPositionSize < 0 : currentPositionSize > 0;
}

export function validateOrderForSubmission(params: {
  order: OrderTicketInput;
  market: MarketConfig;
  env: "testnet" | "mainnet";
  currentPositionSize?: number;
}) {
  const parsed = orderTicketSchema.safeParse(params.order);
  if (!parsed.success) {
    return { ok: false as const, reason: parsed.error.issues[0]?.message ?? "Invalid order." };
  }

  const tradable = validateMarketTradable(params.market, params.env);
  if (!tradable.ok) return tradable;

  if (!validateLeverage(params.order.leverage, params.market)) {
    return { ok: false as const, reason: "Leverage exceeds market maximum." };
  }

  if (
    !validateReduceOnly(
      params.order.reduceOnly,
      params.currentPositionSize ?? 0,
      params.order.side
    )
  ) {
    return {
      ok: false as const,
      reason: "Reduce-only order would not reduce the current position."
    };
  }

  if (params.env === "mainnet" && !params.order.mainnetConfirmed) {
    return {
      ok: false as const,
      reason: "Mainnet orders require final confirmation."
    };
  }

  return { ok: true as const };
}

export function estimateNotional(quantity: number, price: number) {
  return quantity * price;
}

export function estimateLiquidationBuffer(notional: number, leverage: number) {
  if (leverage <= 0) return 0;
  return Math.max(0, notional / leverage);
}
