"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { AmountInput } from "@/components/simple/AmountInput";
import { BuyingPowerCard } from "@/components/simple/BuyingPowerCard";
import { ConfirmOrderCard } from "@/components/simple/ConfirmOrderCard";
import { RiskNote } from "@/components/simple/RiskNote";
import { SuccessState } from "@/components/simple/SuccessState";
import { Button } from "@/components/ui/button";
import type { SimpleMarket } from "@/lib/mockData";
import { getMarketSlug } from "@/lib/mockData";
import { useTradingStore } from "@/lib/store/tradingStore";
import { formatNumber } from "@/lib/utils";

type Step = "amount" | "confirm" | "success";

export function MarketOrderFlow({
  market,
  action
}: {
  market: SimpleMarket;
  action: "buy" | "sell";
}) {
  const { address, isConnected } = useAccount();
  const riskAcknowledged = useTradingStore((state) => state.riskAcknowledged);
  const [amount, setAmount] = useState(action === "buy" ? "25" : "0");
  const [step, setStep] = useState<Step>("amount");
  const [isSubmitting, setSubmitting] = useState(false);
  const numericAmount = Number(amount || 0);
  const canTrade = market.enabled && market.hyperliquidAssetId !== null;
  const slug = getMarketSlug(market.symbol);
  const titleAction = action === "buy" ? "Buy" : "Sell";
  const quickAmounts = useMemo(
    () =>
      action === "buy"
        ? [
            { label: "$10", value: "10" },
            { label: "$25", value: "25" },
            { label: "$50", value: "50" },
            { label: "$100", value: "100" },
            { label: "Max", value: "0" }
          ]
        : [
            { label: "25%", value: "0" },
            { label: "50%", value: "0" },
            { label: "75%", value: "0" },
            { label: "100%", value: "0" }
          ],
    [action]
  );

  async function submitOrder() {
    if (!isConnected || !address) {
      toast.error("Connect your wallet first.");
      return;
    }
    if (!riskAcknowledged) {
      toast.error("Please accept the risk disclosure first.");
      return;
    }
    if (!canTrade) {
      toast.error("This market is coming soon.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/order-intents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          marketId: market.id,
          hyperliquidAssetId: market.hyperliquidAssetId,
          side: action === "buy" ? "BUY" : "SELL",
          orderType: "MARKET",
          quantity: Math.max(numericAmount / market.markPrice, market.minOrderSize),
          limitPrice: null,
          reduceOnly: action === "sell",
          leverage: 1,
          slippageBps: 50,
          riskAcknowledged,
          mainnetConfirmed: false
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Order could not be submitted.");
      }

      setStep("success");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Order could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "success") {
    return <SuccessState market={market} amount={numericAmount} action={action} />;
  }

  return (
    <main className="app-shell flex flex-col gap-5">
      <Link href={`/market/${slug}`} className="cash-pill flex h-11 w-11 items-center justify-center">
        <ArrowLeft className="h-5 w-5" />
      </Link>

      {step === "amount" ? (
        <>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {titleAction} {market.friendlyName}
            </h1>
            <p className="mt-1 text-sm text-neutral-400">{market.baseAsset} · Derived perpetual market</p>
          </div>

          {action === "buy" ? (
            <BuyingPowerCard />
          ) : (
            <section className="cash-card p-5">
              <p className="text-sm text-neutral-500">Your position</p>
              <p className="mt-1 text-3xl font-semibold">$0.00</p>
            </section>
          )}

          <AmountInput amount={amount} onAmountChange={setAmount} quickAmounts={quickAmounts} />

          <p className="cash-card-soft p-4 text-sm text-neutral-300">
            You&apos;re {action === "buy" ? "buying" : "selling"} approximately ${formatNumber(numericAmount, 2)} of {market.friendlyName}-derived perpetual exposure.
          </p>

          {!canTrade && (
            <RiskNote>This market is coming soon. Trading is disabled until its Hyperliquid asset ID is verified.</RiskNote>
          )}

          <Button
            className="h-16 rounded-full bg-[#00d54b] text-base font-bold text-black hover:bg-[#00c044]"
            disabled={!canTrade || numericAmount <= 0}
            onClick={() => setStep("confirm")}
          >
            Continue
          </Button>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Confirm {action}</h1>
            <p className="mt-1 text-sm text-neutral-400">{market.friendlyName} · Market order</p>
          </div>
          <ConfirmOrderCard market={market} amount={numericAmount} action={action} />
          <RiskNote>This is a perpetual market, not {market.friendlyName} stock. Price can move quickly.</RiskNote>
          <Button
            className="h-16 rounded-full bg-[#00d54b] text-base font-bold text-black hover:bg-[#00c044]"
            disabled={isSubmitting}
            onClick={submitOrder}
          >
            {isSubmitting ? "Submitting..." : `Confirm ${titleAction}`}
          </Button>
          <Button variant="ghost" className="h-12 rounded-full" onClick={() => setStep("amount")}>
            Edit amount
          </Button>
        </>
      )}
    </main>
  );
}
