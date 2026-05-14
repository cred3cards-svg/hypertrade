"use client";

import { create } from "zustand";

type TradingState = {
  selectedMarket: string;
  side: "BUY" | "SELL";
  orderType: "MARKET" | "LIMIT";
  leverage: number;
  reduceOnly: boolean;
  slippageBps: number;
  riskAcknowledged: boolean;
  setSelectedMarket: (symbol: string) => void;
  setSide: (side: "BUY" | "SELL") => void;
  setOrderType: (orderType: "MARKET" | "LIMIT") => void;
  setLeverage: (leverage: number) => void;
  setReduceOnly: (reduceOnly: boolean) => void;
  setSlippageBps: (slippageBps: number) => void;
  setRiskAcknowledged: (riskAcknowledged: boolean) => void;
};

export const useTradingStore = create<TradingState>((set) => ({
  selectedMarket: "AAPL-PERP",
  side: "BUY",
  orderType: "LIMIT",
  leverage: 2,
  reduceOnly: false,
  slippageBps: 50,
  riskAcknowledged: false,
  setSelectedMarket: (selectedMarket) => set({ selectedMarket }),
  setSide: (side) => set({ side }),
  setOrderType: (orderType) => set({ orderType }),
  setLeverage: (leverage) => set({ leverage }),
  setReduceOnly: (reduceOnly) => set({ reduceOnly }),
  setSlippageBps: (slippageBps) => set({ slippageBps }),
  setRiskAcknowledged: (riskAcknowledged) => set({ riskAcknowledged })
}));
