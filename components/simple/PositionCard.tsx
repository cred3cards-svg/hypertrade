import { Button } from "@/components/ui/button";

export function PositionCard() {
  return (
    <section className="cash-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">Your position</p>
          <p className="mt-1 text-2xl font-semibold">$0.00</p>
        </div>
        <Button variant="secondary" className="rounded-full bg-neutral-100 text-black hover:bg-neutral-200">Close</Button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-neutral-500">Entry amount</p><p className="font-medium">$0.00</p></div>
        <div><p className="text-neutral-500">Profit/loss</p><p className="font-medium text-[#00b947]">$0.00</p></div>
      </div>
    </section>
  );
}
