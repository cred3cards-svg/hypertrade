"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { chartData } from "@/lib/mockData";

export function SimplePriceChart({ positive = true }: { positive?: boolean }) {
  const color = positive ? "#00d54b" : "#ef4444";
  return (
    <div className="cash-card h-64 w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="simplePrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.22} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" hide />
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <Area type="monotone" dataKey="price" stroke={color} strokeWidth={3} fill="url(#simplePrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
