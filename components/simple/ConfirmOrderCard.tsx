import type { SimpleMarket } from "@/lib/mockData";
import { formatNumber } from "@/lib/utils";

export function ConfirmOrderCard({
  market,
  amount,
  action
}: {
  market: SimpleMarket;
  amount: number;
  action: "buy" | "sell";
}) {
  return (
    <section className="cash-card p-5">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <div className="mt-4 space-y-3 text-sm">
        <Row label="Market" value={market.friendlyName} />
        <Row label="Amount" value={`$${formatNumber(amount, 2)}`} />
        <Row label="Estimated price" value={`$${formatNumber(market.markPrice, 2)}`} />
        <Row label="Estimated fees" value="$0.00" />
        <Row label="Slippage estimate" value="0.50%" />
        <Row label="Order type" value={action === "buy" ? "Market buy" : "Market sell"} />
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
