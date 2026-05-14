"use client";

import { ChevronDown } from "lucide-react";
import type { SimpleMarket } from "@/lib/mockData";
import { formatNumber, formatUsd } from "@/lib/utils";

export function DetailsAccordion({ market }: { market: SimpleMarket }) {
  const rows = [
    ["Market type", "Perpetual"],
    ["Buying power asset", "USDC"],
    ["Powered by", "Hyperliquid"],
    ["Hyperliquid coin", market.hyperliquidCoin ?? market.symbol],
    ["Hyperliquid dex", market.hyperliquidDex ?? "default"],
    ["Mark price", formatUsd(market.markPrice)],
    ["Index/oracle price", formatUsd(market.indexPrice)],
    ["Funding rate", `${market.funding >= 0 ? "+" : ""}${market.funding}%`],
    ["Max leverage", `${market.maxLeverage}x`],
    ["Asset ID", market.hyperliquidAssetId?.toString() ?? "Not configured"],
    ["24h volume", formatUsd(market.volume24h)],
    ["Open interest", formatUsd(market.openInterest)],
    ["Oracle", market.oracleDescription]
  ];

  return (
    <details className="group cash-card p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
        Details
        <ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
      </summary>
      <div className="mt-4 space-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-5 border-t border-neutral-100 pt-3">
            <span className="text-neutral-500">{label}</span>
            <span className="max-w-[55%] text-right font-medium">{value}</span>
          </div>
        ))}
      </div>
    </details>
  );
}
