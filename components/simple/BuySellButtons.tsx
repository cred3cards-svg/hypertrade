import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SimpleMarket } from "@/lib/mockData";
import { getMarketSlug } from "@/lib/mockData";

export function BuySellButtons({ market }: { market: SimpleMarket }) {
  const canTrade = market.enabled && market.hyperliquidAssetId !== null;
  const slug = getMarketSlug(market.symbol);

  if (!canTrade) {
    return (
      <div className="cash-card p-5 text-center">
        <p className="font-semibold">Coming soon</p>
        <p className="mt-1 text-sm text-neutral-500">This market needs a verified Hyperliquid asset ID before trading is enabled.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button asChild className="h-16 rounded-full bg-[#00d54b] text-base font-bold text-black shadow-[0_18px_40px_rgba(0,213,75,0.24)] hover:bg-[#00c044]">
        <Link href={`/market/${slug}/buy`}>Buy</Link>
      </Button>
      <Button asChild variant="secondary" className="h-16 rounded-full bg-white text-base font-bold text-black hover:bg-neutral-100">
        <Link href={`/market/${slug}/sell`}>Sell</Link>
      </Button>
    </div>
  );
}
