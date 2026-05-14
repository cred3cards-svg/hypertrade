"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, ShieldAlert } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/trade", label: "Markets" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/settings", label: "Settings" },
  { href: "/admin/markets", label: "Admin" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const env = process.env.NEXT_PUBLIC_HYPERLIQUID_ENV ?? "testnet";

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[430px] items-center gap-3 px-4 md:max-w-6xl">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00d54b] text-black shadow-[0_0_28px_rgba(0,213,75,0.35)]">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="tracking-tight">{process.env.NEXT_PUBLIC_APP_NAME ?? "Derived Perps"}</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-neutral-400 transition hover:bg-white/10 hover:text-white",
                pathname === item.href && "bg-white text-black"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-[#00d54b]/20 bg-[#00d54b]/10 px-3 py-1.5 text-xs font-semibold text-[#00d54b] sm:flex">
            <ShieldAlert className="h-3.5 w-3.5" />
            {env.toUpperCase()}
          </div>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
