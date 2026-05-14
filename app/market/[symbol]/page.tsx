import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdvancedAccordion } from "@/components/simple/AdvancedAccordion";
import { BuySellButtons } from "@/components/simple/BuySellButtons";
import { DetailsAccordion } from "@/components/simple/DetailsAccordion";
import { PositionCard } from "@/components/simple/PositionCard";
import { RiskNote } from "@/components/simple/RiskNote";
import { SimplePriceChart } from "@/components/simple/SimplePriceChart";
import { getMarketBySlug, getMarketSlug, marketStats } from "@/lib/mockData";
import { cn, formatNumber } from "@/lib/utils";

export function generateStaticParams() {
  return marketStats.map((market) => ({ symbol: getMarketSlug(market.symbol) }));
}

export default function MarketPage({ params }: { params: { symbol: string } }) {
  const market = getMarketBySlug(params.symbol);
  if (!market) notFound();

  return (
    <main className="app-shell flex flex-col gap-5">
      <Link href="/trade" className="cash-pill flex h-11 w-11 items-center justify-center">
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-semibold text-black shadow-[0_16px_40px_rgba(255,255,255,0.14)]">
            {market.logo}
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">{market.friendlyName}</h1>
            <p className="text-sm text-neutral-400">{market.baseAsset}</p>
          </div>
        </div>
        <p className="mt-7 text-6xl font-semibold tracking-tight">${formatNumber(market.markPrice, 2)}</p>
        <p className={cn("mt-2 text-base font-medium", market.change24h >= 0 ? "text-[#00d54b]" : "text-red-400")}>
          {market.change24h >= 0 ? "+" : ""}
          {formatNumber(market.change24h, 2)}% today
        </p>
      </section>

      <SimplePriceChart positive={market.change24h >= 0} />

      <div className="grid grid-cols-4 rounded-full bg-white p-1 text-black shadow-[0_18px_42px_rgba(0,0,0,0.22)]">
        {["1D", "1W", "1M", "1Y"].map((range) => (
          <button key={range} className="rounded-full py-2 text-sm font-semibold first:bg-black first:text-white">
            {range}
          </button>
        ))}
      </div>

      <BuySellButtons market={market} />
      <PositionCard />

      <section className="cash-card p-5">
        <h2 className="text-lg font-semibold">About</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{market.description}</p>
      </section>

      <DetailsAccordion market={market} />
      <AdvancedAccordion />
      <RiskNote />
    </main>
  );
}
