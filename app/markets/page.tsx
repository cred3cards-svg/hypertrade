"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { marketStats } from "@/lib/mockData";

export default function MarketsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      marketStats.filter((market) =>
        `${market.symbol} ${market.displayName} ${market.baseAsset}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <main className="mx-auto max-w-7xl p-4">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Configured Markets</h1>
          <p className="text-sm text-muted-foreground">Derived perp metadata. Asset IDs must be verified from Hyperliquid meta before enabling.</p>
        </div>
        <label className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search markets" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      <div className="terminal-panel overflow-auto">
        <table className="terminal-table w-full">
          <thead><tr><th>Symbol</th><th>Display Name</th><th>Asset ID</th><th>Max Lev.</th><th>Oracle</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map((market) => (
              <tr key={market.symbol} className="border-t border-white/5 hover:bg-white/5">
                <td className="font-medium">{market.symbol}</td>
                <td>{market.displayName}</td>
                <td>{market.hyperliquidAssetId ?? "Not configured"}</td>
                <td>{market.maxLeverage}x</td>
                <td className="max-w-md text-muted-foreground">{market.oracleDescription}</td>
                <td className="flex gap-2">
                  <Badge variant={market.enabled ? "green" : "muted"}>{market.enabled ? "Active" : "Disabled"}</Badge>
                  {market.testnetOnly && <Badge variant="amber">Testnet Only</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
