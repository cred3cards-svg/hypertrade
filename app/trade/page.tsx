"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BuyingPowerCard } from "@/components/simple/BuyingPowerCard";
import { MarketRow } from "@/components/simple/MarketRow";
import { RiskDisclosureModal } from "@/components/risk-disclosure";
import { marketStats } from "@/lib/mockData";

export default function TradePage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      marketStats.filter((market) =>
        `${market.friendlyName} ${market.baseAsset} ${market.symbol}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <main className="app-shell flex flex-col gap-5">
      <RiskDisclosureModal />
      <div>
        <p className="text-sm font-semibold text-[#00d54b]">Markets</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">What do you want to trade?</h1>
        <p className="mt-2 text-sm text-neutral-400">Search simple stock-style perpetual markets.</p>
      </div>
      <label className="cash-pill flex h-16 items-center gap-3 px-5">
        <Search className="h-5 w-5 text-neutral-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search stocks"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
        />
      </label>
      <BuyingPowerCard />
      <section className="space-y-3">
        {filtered.map((market) => (
          <MarketRow key={market.symbol} market={market} />
        ))}
      </section>
    </main>
  );
}
