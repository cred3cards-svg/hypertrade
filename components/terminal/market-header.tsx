"use client";

import { Badge } from "@/components/ui/badge";
import { marketStats } from "@/lib/mockData";
import { useTradingStore } from "@/lib/store/tradingStore";
import { cn, formatNumber, formatUsd } from "@/lib/utils";

export function MarketHeader() {
  const selected = useTradingStore((s) => s.selectedMarket);
  const market = marketStats.find((item) => item.symbol === selected) ?? marketStats[0];

  const stats = [
    ["Mark", formatUsd(market.markPrice)],
    ["Index", formatUsd(market.indexPrice)],
    ["Funding", `${market.funding >= 0 ? "+" : ""}${market.funding}%`],
    ["24h Vol", formatUsd(market.volume24h)],
    ["Open Interest", formatUsd(market.openInterest)]
  ];

  return (
    <div className="terminal-panel flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{market.symbol}</h1>
          <Badge variant={market.enabled ? "green" : "amber"}>
            {market.enabled ? "Active" : "Config Required"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{market.displayName} · USDC-margined derived perp</p>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label}>
            <div className="text-[11px] uppercase text-muted-foreground">{label}</div>
            <div className={cn("text-sm font-medium", label === "Funding" && market.funding < 0 && "text-terminal-red", label === "Funding" && market.funding >= 0 && "text-terminal-green")}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className={cn("text-sm font-semibold", market.change24h >= 0 ? "text-terminal-green" : "text-terminal-red")}>
        {market.change24h >= 0 ? "+" : ""}
        {formatNumber(market.change24h, 2)}%
      </div>
    </div>
  );
}
