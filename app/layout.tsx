import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { BottomNav } from "@/components/bottom-nav";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Derived Perps",
  description: "Trade derived perpetual markets through Hyperliquid."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <AppProviders>
          <SiteHeader />
          {children}
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
