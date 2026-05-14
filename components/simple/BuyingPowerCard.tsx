import { WalletCards } from "lucide-react";

export function BuyingPowerCard({ amount = "$0.00" }: { amount?: string }) {
  return (
    <section className="cash-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">Buying power</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{amount}</p>
        </div>
        <div className="rounded-full bg-[#00d54b]/10 p-3 text-[#00b947]">
          <WalletCards className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-4 text-sm text-neutral-500">Add USDC through Hyperliquid to start trading.</p>
    </section>
  );
}
