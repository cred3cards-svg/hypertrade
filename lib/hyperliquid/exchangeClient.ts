import { getHyperliquidApiUrl, type HyperliquidEnv } from "@/lib/hyperliquid/config";
import type {
  CancelRequest,
  ExchangeResponse,
  OrderRequest,
  SignedExchangePayload
} from "@/lib/hyperliquid/types";

async function exchangeRequest(
  payload: SignedExchangePayload,
  env?: HyperliquidEnv
): Promise<ExchangeResponse> {
  const response = await fetch(`${getHyperliquidApiUrl(env)}/exchange`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Hyperliquid exchange request failed: ${response.status}`);
  }

  return response.json() as Promise<ExchangeResponse>;
}

export function buildLimitOrderAction(params: OrderRequest) {
  return {
    type: "order",
    orders: [params],
    grouping: "na"
  };
}

export function buildMarketOrderAction(
  params: Omit<OrderRequest, "orderType"> & { slippageBps: number }
) {
  return {
    type: "order",
    orders: [
      {
        asset: params.asset,
        isBuy: params.isBuy,
        sz: params.sz,
        limitPx: params.limitPx,
        orderType: { limit: { tif: "Ioc" as const } },
        reduceOnly: params.reduceOnly,
        cloid: params.cloid
      }
    ],
    grouping: "na"
  };
}

export function buildCancelAction(cancels: CancelRequest[]) {
  return { type: "cancel", cancels };
}

export function buildUpdateLeverageAction(params: {
  asset: number;
  isCross: boolean;
  leverage: number;
}) {
  return {
    type: "updateLeverage",
    asset: params.asset,
    isCross: params.isCross,
    leverage: params.leverage
  };
}

export function buildApproveAgentWalletAction(params: {
  agentAddress: string;
  agentName?: string;
}) {
  return {
    type: "approveAgent",
    hyperliquidChain: "Testnet",
    signatureChainId: "0x66eee",
    agentAddress: params.agentAddress,
    agentName: params.agentName ?? "Derived Perps Agent",
    nonce: Date.now()
  };
}

export function placeLimitOrder(
  payload: SignedExchangePayload,
  env?: HyperliquidEnv
) {
  return exchangeRequest(payload, env);
}

export function placeMarketOrder(
  payload: SignedExchangePayload,
  env?: HyperliquidEnv
) {
  return exchangeRequest(payload, env);
}

export function cancelOrder(payload: SignedExchangePayload, env?: HyperliquidEnv) {
  return exchangeRequest(payload, env);
}

export function cancelAllOrders(payload: SignedExchangePayload, env?: HyperliquidEnv) {
  return exchangeRequest(payload, env);
}

export function updateLeverage(payload: SignedExchangePayload, env?: HyperliquidEnv) {
  return exchangeRequest(payload, env);
}

export function approveAgentWallet(payload: SignedExchangePayload, env?: HyperliquidEnv) {
  return exchangeRequest(payload, env);
}
