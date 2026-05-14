"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useTradingStore } from "@/lib/store/tradingStore";
import { RISK_DISCLOSURE_VERSION } from "@/lib/constants";

export function RiskDisclosureModal() {
  const [open, setOpen] = useState(false);
  const setRiskAcknowledged = useTradingStore((s) => s.setRiskAcknowledged);
  const { address } = useAccount();

  useEffect(() => {
    const key = `risk-ack-${RISK_DISCLOSURE_VERSION}`;
    const acknowledged = window.localStorage.getItem(key) === "true";
    setRiskAcknowledged(acknowledged);
    setOpen(!acknowledged);
  }, [setRiskAcknowledged]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="terminal-panel max-w-xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-md bg-terminal-amber/10 p-2 text-terminal-amber">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Perpetual futures are high risk</h2>
            <p className="text-sm text-muted-foreground">Disclosure version {RISK_DISCLOSURE_VERSION}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>These markets are perpetuals. They are not shares of stock and do not give ownership in any company.</p>
          <p>You can lose money, and prices can move quickly. This app does not give investment advice.</p>
          <p>Trading may be unavailable in some places. You are responsible for following your local laws.</p>
        </div>
        <Button
          className="mt-6 w-full"
          onClick={async () => {
            window.localStorage.setItem(`risk-ack-${RISK_DISCLOSURE_VERSION}`, "true");
            setRiskAcknowledged(true);
            setOpen(false);
            await fetch("/api/risk-acknowledgements", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ walletAddress: address, version: RISK_DISCLOSURE_VERSION })
            }).catch(() => undefined);
          }}
        >
          I understand and accept the risks
        </Button>
      </div>
    </div>
  );
}
