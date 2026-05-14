"use client";

import { cn } from "@/lib/utils";

export function AmountInput({
  amount,
  onAmountChange,
  quickAmounts,
  suffix = "USDC"
}: {
  amount: string;
  onAmountChange: (value: string) => void;
  quickAmounts: Array<{ label: string; value: string }>;
  suffix?: string;
}) {
  return (
    <div className="cash-card p-5">
      <div className="flex items-end justify-center gap-2 py-10">
        <span className="pb-2 text-4xl font-semibold">$</span>
        <input
          value={amount}
          onChange={(event) => onAmountChange(event.target.value.replace(/[^\d.]/g, ""))}
          inputMode="decimal"
          placeholder="0"
          className="w-48 bg-transparent text-center text-7xl font-semibold tracking-tight outline-none placeholder:text-neutral-300"
          aria-label="Amount"
        />
      </div>
      <p className="text-center text-sm text-neutral-500">{suffix}</p>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {quickAmounts.map((quick) => (
          <button
            key={quick.label}
            onClick={() => onAmountChange(quick.value)}
            className={cn(
              "rounded-full bg-neutral-100 px-3 py-3 text-sm font-bold transition hover:bg-neutral-200",
              amount === quick.value && "bg-[#00d54b] text-black"
            )}
          >
            {quick.label}
          </button>
        ))}
      </div>
    </div>
  );
}
