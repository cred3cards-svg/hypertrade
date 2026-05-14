import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "green" | "red" | "amber" | "muted";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variant === "default" && "border-white/10 bg-white/5 text-foreground",
        variant === "green" && "border-terminal-green/20 bg-terminal-green/10 text-terminal-green",
        variant === "red" && "border-terminal-red/20 bg-terminal-red/10 text-terminal-red",
        variant === "amber" && "border-terminal-amber/20 bg-terminal-amber/10 text-terminal-amber",
        variant === "muted" && "border-white/10 bg-white/5 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
