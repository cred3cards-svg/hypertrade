"use client";

import { useState } from "react";
import { ChevronDown, CircleCheck, ShieldAlert, Wallet } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [risk, setRisk] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const env = process.env.NEXT_PUBLIC_HYPERLIQUID_ENV ?? "testnet";

  return (
    <main className="app-shell flex flex-col gap-5">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400">Wallet, risk, and advanced options.</p>
      </div>

      <section className="cash-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-[#00d54b]/10 p-3 text-[#00b947]"><Wallet className="h-5 w-5" /></div>
          <div>
            <h2 className="font-semibold">Wallet</h2>
            <p className="text-sm text-neutral-500">Connect to sign your own trades.</p>
          </div>
        </div>
        <WalletButton />
      </section>

      <section className="cash-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Network</h2>
            <p className="mt-1 text-sm text-neutral-500">Testnet is safest for development.</p>
          </div>
          <Badge variant={env === "mainnet" ? "red" : "green"}>{env.toUpperCase()}</Badge>
        </div>
      </section>

      <section className="cash-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-3 text-amber-600"><ShieldAlert className="h-5 w-5" /></div>
          <div>
            <h2 className="font-semibold">Risk disclosures</h2>
            <p className="text-sm text-neutral-500">Plain-English reminders before trading.</p>
          </div>
        </div>
        <label className="flex items-center justify-between rounded-2xl bg-neutral-100 p-4">
          I understand these are perpetual markets, not shares.
          <Switch checked={risk} onCheckedChange={setRisk} />
        </label>
      </section>

      <section className="cash-card p-5">
        <label className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Advanced trading settings</h2>
            <p className="mt-1 text-sm text-neutral-500">Show leverage, slippage, and reduce-only controls.</p>
          </div>
          <Switch checked={advanced} onCheckedChange={setAdvanced} />
        </label>
      </section>

      <details className="group cash-card p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
          Developer / Hyperliquid status
          <ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-[#00b947]"><CircleCheck className="h-4 w-4" />Info API client configured</div>
          <div className="flex items-center gap-2 text-[#00b947]"><CircleCheck className="h-4 w-4" />Exchange action builders available</div>
          <div className="flex items-center gap-2 text-amber-600"><ShieldAlert className="h-4 w-4" />Mainnet requires explicit environment gate</div>
        </div>
      </details>
    </main>
  );
}
