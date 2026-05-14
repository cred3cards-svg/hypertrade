import Link from "next/link";
import { LineChart } from "lucide-react";
import type { SimpleMarket } from "@/lib/mockData";
import { getMarketSlug } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";

export function MarketRow({ market, href }: { market: SimpleMarket; href?: string }) {
  const comingSoon = !market.enabled || market.hyperliquidAssetId === null;
  const row = (
    <div className="cash-pill flex items-center gap-3 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-lg font-semibold text-white shadow-inner">
        {market.logo}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold">{market.friendlyName}</p>
          {comingSoon && <Badge variant="muted" className="rounded-full bg-neutral-100 text-neutral-500">Soon</Badge>}
        </div>
        <p className="text-sm text-neutral-500">{market.baseAsset}</p>
      </div>
      <div className="hidden h-8 w-16 items-center justify-center rounded-full bg-[#00d54b]/10 text-[#00b947] sm:flex">
        <LineChart className="h-4 w-4" />
      </div>
      <div className="text-right">
        <p className="font-semibold">${formatNumber(market.markPrice, 2)}</p>
        <p className={cn("text-sm", market.change24h >= 0 ? "text-[#00b947]" : "text-red-500")}>
          {market.change24h >= 0 ? "+" : ""}
          {formatNumber(market.change24h, 2)}%
        </p>
      </div>
    </div>
  );

  return (
    <Link href={href ?? `/market/${getMarketSlug(market.symbol)}`} className="block">
      {row}
    </Link>
  );
}
