"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, createConfig, WagmiProvider } from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { Toaster } from "sonner";
import { useState } from "react";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const wagmiConfig = createConfig({
  chains: [arbitrum, arbitrumSepolia, mainnet, sepolia],
  connectors: [
    injected(),
    ...(projectId
      ? [
          walletConnect({
            projectId,
            showQrModal: true,
            metadata: {
              name: process.env.NEXT_PUBLIC_APP_NAME ?? "Derived Perps",
              description:
                "Wallet connection for non-custodial Hyperliquid derived perpetual markets.",
              url:
                typeof window !== "undefined"
                  ? window.location.origin
                  : "https://localhost",
              icons: []
            }
          })
        ]
      : [])
  ],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http()
  },
  ssr: true
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1
          }
        }
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster theme="dark" richColors position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
