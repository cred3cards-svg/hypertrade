import { ChevronDown } from "lucide-react";
import { BuyingPowerCard } from "@/components/simple/BuyingPowerCard";
import { marketStats } from "@/lib/mockData";
import { cn, formatNumber } from "@/lib/utils";

export default function PortfolioPage() {
  return (
    <main className="app-shell flex flex-col gap-5">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">Portfolio</h1>
        <p className="mt-1 text-sm text-neutral-400">Your stock-style perpetual market exposure.</p>
      </div>

      <section className="cash-card p-6">
        <p className="text-sm text-neutral-500">Total account value</p>
        <p className="mt-1 text-5xl font-semibold tracking-tight">$0.00</p>
        <p className="mt-2 text-sm font-medium text-[#00b947]">$0.00 today</p>
      </section>

      <BuyingPowerCard />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Holdings</h2>
        <div className="space-y-3">
          {marketStats.slice(0, 6).map((market) => (
            <div key={market.symbol} className="cash-pill flex items-center gap-3 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black font-semibold text-white">
                {market.logo}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{market.friendlyName}</p>
                <p className="text-sm text-neutral-500">$0.00 current value</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-[#00b947]">$0.00</p>
                <p className={cn("text-sm", market.change24h >= 0 ? "text-[#00b947]" : "text-red-500")}>
                  {market.change24h >= 0 ? "+" : ""}
                  {formatNumber(market.change24h, 2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <details className="group cash-card p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
          Account details
          <ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-3 text-sm">
          <Row label="USDC balance" value="$0.00" />
          <Row label="Margin used" value="$0.00" />
          <Row label="Available to trade" value="$0.00" />
          <Row label="Current gain/loss" value="$0.00" />
          <Row label="Closed trade gain/loss" value="$0.00" />
          <Row label="Hyperliquid account state" value="Not connected" />
        </div>
      </details>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-t border-neutral-100 pt-3">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
