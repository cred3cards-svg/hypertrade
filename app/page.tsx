import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/wallet-button";
import { MarketRow } from "@/components/simple/MarketRow";
import { RiskNote } from "@/components/simple/RiskNote";
import { marketStats } from "@/lib/mockData";

const popular = ["AAPL-PERP", "TSLA-PERP", "NVDA-PERP", "MSFT-PERP", "AMZN-PERP", "SPY-PERP"];

export default function HomePage() {
  const markets = marketStats.filter((market) => popular.includes(market.symbol));

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <section className="app-shell flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400">Derived Perps</p>
            <h1 className="text-xl font-semibold">Investing-style perps</h1>
          </div>
          <WalletButton />
        </div>

        <section className="cash-card p-6">
          <p className="text-sm font-medium text-[#00b947]">Powered by Hyperliquid</p>
          <h2 className="mt-3 text-5xl font-semibold leading-[0.95] tracking-tight">
            Trade stock-style perpetual markets with USDC
          </h2>
          <p className="mt-4 text-base text-neutral-600">
            Simple access to derived markets powered by Hyperliquid.
          </p>
          <Button asChild className="mt-6 h-16 w-full rounded-full bg-[#00d54b] text-base font-bold text-black hover:bg-[#00c044]">
            <Link href="/trade">
              Start trading
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Popular markets</h2>
            <Link href="/trade" className="text-sm font-medium text-[#00d54b]">See all</Link>
          </div>
          <div className="space-y-3">
            {markets.map((market) => (
              <MarketRow key={market.symbol} market={market} />
            ))}
          </div>
        </section>

        <RiskNote />
      </section>
    </main>
  );
}
