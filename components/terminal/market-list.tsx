"use client";

import { marketStats } from "@/lib/mockData";
import { useTradingStore } from "@/lib/store/tradingStore";
import { cn, formatNumber } from "@/lib/utils";

export function MarketList() {
  const selected = useTradingStore((s) => s.selectedMarket);
  const setSelectedMarket = useTradingStore((s) => s.setSelectedMarket);

  return (
    <div className="terminal-panel h-full overflow-hidden">
      <div className="border-b border-white/10 p-3">
        <input
          placeholder="Search markets"
          className="h-9 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm outline-none transition focus:border-terminal-green/60"
        />
      </div>
      <div className="max-h-[640px] overflow-auto">
        {marketStats.map((market) => (
          <button
            key={market.symbol}
            onClick={() => setSelectedMarket(market.symbol)}
            className={cn(
              "grid w-full grid-cols-[1fr_auto] gap-2 border-b border-white/5 px-3 py-3 text-left transition hover:bg-white/5",
              selected === market.symbol && "bg-terminal-green/5"
            )}
          >
            <span>
              <span className="block text-sm font-medium">{market.symbol}</span>
              <span className="text-xs text-muted-foreground">{market.displayName}</span>
            </span>
            <span className="text-right">
              <span className="block text-sm">${formatNumber(market.markPrice, 2)}</span>
              <span className={cn("text-xs", market.change24h >= 0 ? "text-terminal-green" : "text-terminal-red")}>
                {market.change24h >= 0 ? "+" : ""}
                {market.change24h}%
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
