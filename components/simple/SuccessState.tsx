import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SimpleMarket } from "@/lib/mockData";
import { getMarketSlug } from "@/lib/mockData";
import { formatNumber } from "@/lib/utils";

export function SuccessState({
  market,
  amount,
  action
}: {
  market: SimpleMarket;
  amount: number;
  action: "buy" | "sell";
}) {
  const slug = getMarketSlug(market.symbol);
  return (
    <div className="app-shell flex flex-col items-center justify-center text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#00d54b] text-black shadow-[0_0_70px_rgba(0,213,75,0.42)]">
        <Check className="h-12 w-12" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-white">
        You {action === "buy" ? "bought" : "sold"} {market.friendlyName}
      </h1>
      <p className="mt-2 text-lg text-neutral-300">${formatNumber(amount, 2)}</p>
      <div className="mt-8 grid w-full gap-3">
        <Button asChild className="h-16 rounded-full bg-[#00d54b] text-base font-bold text-black hover:bg-[#00c044]">
          <Link href={`/market/${slug}`}>Done</Link>
        </Button>
        <Button asChild variant="secondary" className="h-16 rounded-full bg-white text-base font-bold text-black hover:bg-neutral-100">
          <Link href="/portfolio">View position</Link>
        </Button>
      </div>
    </div>
  );
}
