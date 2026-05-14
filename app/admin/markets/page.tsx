"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { marketStats } from "@/lib/mockData";

export default function AdminMarketsPage() {
  const [selected, setSelected] = useState(marketStats[0]);

  return (
    <main className="mx-auto max-w-7xl p-4">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Markets</h1>
          <p className="text-sm text-muted-foreground">Configure metadata only. This page does not deploy or operate HIP-3 markets.</p>
        </div>
        <Badge variant="red">Admin Only</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="terminal-panel overflow-hidden">
          {marketStats.map((market) => (
            <button
              key={market.symbol}
              onClick={() => setSelected(market)}
              className="flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5"
            >
              <span><span className="block text-sm font-medium">{market.symbol}</span><span className="text-xs text-muted-foreground">{market.baseAsset}/USDC</span></span>
              <Badge variant={market.enabled ? "green" : "muted"}>{market.enabled ? "On" : "Off"}</Badge>
            </button>
          ))}
        </aside>
        <section className="terminal-panel p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Symbol" value={selected.symbol} />
            <Field label="Display Name" value={selected.displayName} />
            <Field label="Base Asset" value={selected.baseAsset} />
            <Field label="Quote Asset" value={selected.quoteAsset} />
            <Field label="Verified Asset ID" value={selected.hyperliquidAssetId ?? ""} placeholder="Verify from meta" />
            <Field label="Hyperliquid Coin" value={selected.hyperliquidCoin ?? selected.symbol} />
            <Field label="Hyperliquid DEX" value={selected.hyperliquidDex ?? "default"} />
            <Field label="Oracle Description" value={selected.oracleDescription} />
            <Field label="Max Leverage" value={selected.maxLeverage} />
            <Field label="Min Order Size" value={selected.minOrderSize} />
            <Field label="Tick Size" value={selected.tickSize} />
            <Field label="Size Decimals" value={selected.szDecimals} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="flex items-center justify-between rounded-md border border-white/10 p-3"><span>HIP-3</span><Switch checked={selected.isHip3} /></label>
            <label className="flex items-center justify-between rounded-md border border-white/10 p-3"><span>Enabled</span><Switch checked={selected.enabled} /></label>
            <label className="flex items-center justify-between rounded-md border border-white/10 p-3"><span>Testnet Only</span><Switch checked={selected.testnetOnly} /></label>
          </div>
          <div className="mt-5 rounded-md border border-terminal-amber/20 bg-terminal-amber/10 p-4 text-sm text-terminal-amber">
            HIP-3 deployment and operation require market definition, oracle setup, leverage configuration, liquidity operations, monitoring, and ongoing incident response. This admin surface only manages app metadata and routing configuration.
          </div>
          <Button className="mt-5"><Save className="h-4 w-4" />Save Market Metadata</Button>
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, placeholder }: { label: string; value: string | number; placeholder?: string }) {
  return (
    <label className="block text-xs text-muted-foreground">
      {label}
      <Input className="mt-1" defaultValue={value} placeholder={placeholder} />
    </label>
  );
}
