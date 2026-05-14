"use client";

import { useState } from "react";
import { AlertTriangle, Send, X } from "lucide-react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marketStats } from "@/lib/mockData";
import { createLocalOrderIntent } from "@/lib/orders/createOrderIntent";
import { useTradingStore } from "@/lib/store/tradingStore";
import { cn, formatUsd } from "@/lib/utils";
import { estimateLiquidationBuffer, estimateNotional, validateOrderForSubmission } from "@/lib/validation/order";

export function OrderTicket() {
  const { address, isConnected } = useAccount();
  const store = useTradingStore();
  const market = marketStats.find((item) => item.symbol === store.selectedMarket) ?? marketStats[0];
  const [quantity, setQuantity] = useState("1");
  const [limitPrice, setLimitPrice] = useState(String(market.markPrice));
  const [mainnetConfirmed, setMainnetConfirmed] = useState(false);
  const env = (process.env.NEXT_PUBLIC_HYPERLIQUID_ENV ?? "testnet") as "testnet" | "mainnet";
  const notional = estimateNotional(Number(quantity || 0), Number(limitPrice || market.markPrice));

  function submit() {
    const order = {
      walletAddress: address ?? "",
      marketId: market.id,
      hyperliquidAssetId: market.hyperliquidAssetId,
      side: store.side,
      orderType: store.orderType,
      quantity: Number(quantity),
      limitPrice: store.orderType === "LIMIT" ? Number(limitPrice) : null,
      reduceOnly: store.reduceOnly,
      leverage: store.leverage,
      slippageBps: store.slippageBps,
      riskAcknowledged: store.riskAcknowledged,
      mainnetConfirmed
    };

    const result = validateOrderForSubmission({
      order,
      market,
      env,
      currentPositionSize: store.reduceOnly ? 0 : undefined
    });

    if (!isConnected || !address) {
      toast.error("Connect a wallet before submitting an order.");
      return;
    }

    if (!result.ok) {
      toast.error(result.reason);
      return;
    }

    const intent = createLocalOrderIntent(order);
    toast.success(`Order intent ${intent.clientOrderId} created. Sign via wallet or approved agent flow.`);
  }

  return (
    <div className="terminal-panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Order Ticket</h2>
        <span className="text-xs text-muted-foreground">{market.symbol}</span>
      </div>

      <Tabs value={store.side} onValueChange={(value) => store.setSide(value as "BUY" | "SELL")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="BUY" className="data-[state=active]:text-terminal-green">Buy</TabsTrigger>
          <TabsTrigger value="SELL" className="data-[state=active]:text-terminal-red">Sell</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs value={store.orderType} onValueChange={(value) => store.setOrderType(value as "MARKET" | "LIMIT")} className="mt-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="LIMIT">Limit</TabsTrigger>
          <TabsTrigger value="MARKET">Market</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 space-y-3">
        <label className="block text-xs text-muted-foreground">
          Quantity
          <Input className="mt-1" value={quantity} onChange={(e) => setQuantity(e.target.value)} inputMode="decimal" />
        </label>
        {store.orderType === "LIMIT" && (
          <label className="block text-xs text-muted-foreground">
            Limit Price
            <Input className="mt-1" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} inputMode="decimal" />
          </label>
        )}
        <label className="block text-xs text-muted-foreground">
          Leverage {store.leverage}x
          <input
            type="range"
            min={1}
            max={market.maxLeverage}
            value={store.leverage}
            onChange={(e) => store.setLeverage(Number(e.target.value))}
            className="mt-2 w-full accent-terminal-green"
          />
        </label>
        <label className="block text-xs text-muted-foreground">
          Slippage {store.slippageBps} bps
          <Input className="mt-1" value={store.slippageBps} onChange={(e) => store.setSlippageBps(Number(e.target.value))} inputMode="numeric" />
        </label>
        <div className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 p-3">
          <span className="text-sm">Reduce only</span>
          <Switch checked={store.reduceOnly} onCheckedChange={store.setReduceOnly} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Take profit" disabled />
          <Input placeholder="Stop loss" disabled />
        </div>
      </div>

      <div className="my-4 space-y-2 rounded-md border border-white/10 bg-black/20 p-3 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Est. notional</span><span>{formatUsd(notional)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Margin estimate</span><span>{formatUsd(estimateLiquidationBuffer(notional, store.leverage))}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Collateral</span><span>USDC</span></div>
      </div>

      {env === "mainnet" && (
        <label className="mb-3 flex items-center gap-2 rounded-md border border-terminal-red/20 bg-terminal-red/10 p-3 text-xs text-terminal-red">
          <input type="checkbox" checked={mainnetConfirmed} onChange={(e) => setMainnetConfirmed(e.target.checked)} />
          I confirm this is a real mainnet perpetual futures order.
        </label>
      )}

      <Button
        className={cn("w-full", store.side === "SELL" && "bg-terminal-red text-white hover:bg-terminal-red/90")}
        onClick={submit}
      >
        <Send className="h-4 w-4" />
        Submit {store.side === "BUY" ? "Buy" : "Sell"} Order
      </Button>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm"><X className="h-4 w-4" />Cancel</Button>
        <Button variant="secondary" size="sm"><AlertTriangle className="h-4 w-4" />Cancel All</Button>
      </div>
      <Button variant="outline" size="sm" className="mt-2 w-full">Close Position</Button>
    </div>
  );
}
