"use client";

import { ChevronDown } from "lucide-react";
import { OrderBook } from "@/components/terminal/order-book";
import { RecentTrades } from "@/components/terminal/recent-trades";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function AdvancedAccordion() {
  return (
    <details className="group cash-card p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
        Advanced
        <ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
      </summary>
      <div className="mt-5 space-y-4">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-2xl bg-neutral-100 p-4">
            Limit order
            <Switch />
          </label>
          <label className="flex items-center justify-between rounded-2xl bg-neutral-100 p-4">
            Reduce-only
            <Switch />
          </label>
          <label className="block rounded-2xl bg-neutral-100 p-4">
            Slippage setting
            <Input className="mt-2 border-neutral-200 bg-white text-black" defaultValue="50 bps" />
          </label>
          <label className="block rounded-2xl bg-neutral-100 p-4">
            Leverage
            <Input className="mt-2 border-neutral-200 bg-white text-black" defaultValue="1x" />
          </label>
        </div>
        <div className="rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-600">
          Margin/risk information, liquidation price, and advanced order controls are hidden here by default.
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="[&_.terminal-panel]:border-neutral-200 [&_.terminal-panel]:bg-neutral-950 [&_.terminal-panel]:text-white">
            <OrderBook />
          </div>
          <div className="[&_.terminal-panel]:border-neutral-200 [&_.terminal-panel]:bg-neutral-950 [&_.terminal-panel]:text-white">
            <RecentTrades />
          </div>
        </div>
      </div>
    </details>
  );
}
