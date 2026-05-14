"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartData, marketStats } from "@/lib/mockData";
import { useTradingStore } from "@/lib/store/tradingStore";
import { formatNumber } from "@/lib/utils";

export function PriceChart() {
  const selected = useTradingStore((s) => s.selectedMarket);
  const market = marketStats.find((item) => item.symbol === selected) ?? marketStats[0];

  return (
    <div className="terminal-panel h-[330px] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">{market.symbol} Price</h2>
          <p className="text-xs text-muted-foreground">Recharts adapter · replaceable with Lightweight Charts</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-terminal-green">${formatNumber(market.markPrice, 2)}</div>
          <div className="text-xs text-muted-foreground">Mid price</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="price" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1cff8a" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#1cff8a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" hide />
          <YAxis domain={["dataMin - 1", "dataMax + 1"]} orientation="right" tick={{ fill: "#8d96a7", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#0b0e13", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} />
          <Area type="monotone" dataKey="price" stroke="#1cff8a" strokeWidth={2} fill="url(#price)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
