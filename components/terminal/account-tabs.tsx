"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const positions = [
  { market: "AAPL-PERP", size: "0.00", entry: "-", pnl: "$0.00", liq: "-" },
  { market: "NVDA-PERP", size: "0.00", entry: "-", pnl: "$0.00", liq: "-" }
];

export function AccountTabs() {
  return (
    <div className="terminal-panel overflow-hidden">
      <Tabs defaultValue="positions">
        <div className="border-b border-white/10 p-3">
          <TabsList>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="orders">Open Orders</TabsTrigger>
            <TabsTrigger value="orderHistory">Order History</TabsTrigger>
            <TabsTrigger value="tradeHistory">Trade History</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="positions" className="m-0">
          <table className="terminal-table w-full">
            <thead><tr><th>Market</th><th>Size</th><th>Entry</th><th>Unrealized PnL</th><th>Liq.</th><th>Status</th></tr></thead>
            <tbody>
              {positions.map((row) => (
                <tr key={row.market} className="border-t border-white/5">
                  <td>{row.market}</td><td>{row.size}</td><td>{row.entry}</td><td className="text-terminal-green">{row.pnl}</td><td>{row.liq}</td><td><Badge variant="muted">Flat</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
        {["orders", "orderHistory", "tradeHistory"].map((tab) => (
          <TabsContent key={tab} value={tab} className="m-0 p-6 text-sm text-muted-foreground">
            Connect a wallet and configure verified asset IDs to load live Hyperliquid account data.
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
