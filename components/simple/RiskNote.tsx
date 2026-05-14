import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function RiskNote({
  className,
  children = "These are perpetual markets, not shares of stock. Trading involves risk."
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4 text-sm text-neutral-300 backdrop-blur-xl",
        className
      )}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
