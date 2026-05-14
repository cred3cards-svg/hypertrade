"use client";

import { useMemo, useState } from "react";
import { LogOut, QrCode, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { shortAddress } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect({
    mutation: {
      onError(error) {
        toast.error(error.message || "Wallet connection failed.");
      },
      onSuccess() {
        setOpen(false);
      }
    }
  });
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);

  const walletConnectConnector = useMemo(
    () => connectors.find((connector) => connector.id === "walletConnect"),
    [connectors]
  );
  const injectedConnector = useMemo(
    () => connectors.find((connector) => connector.id === "injected") ?? connectors[0],
    [connectors]
  );

  if (isConnected) {
    return (
      <Button variant="secondary" size="sm" onClick={() => disconnect()}>
        <LogOut className="h-4 w-4" />
        {shortAddress(address)}
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button size="sm" className="rounded-full bg-white px-4 text-black hover:bg-neutral-100" onClick={() => setOpen((value) => !value)}>
        <Wallet className="h-4 w-4" />
        Connect
      </Button>

      {open && (
        <>
          <button
            aria-label="Close wallet menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2rem))] rounded-[2rem] border border-white/10 bg-white p-4 text-black shadow-2xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Connect wallet</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Connect only. Trading still happens inside this app.
              </p>
            </div>

            <div className="space-y-2">
              <button
                className="flex w-full items-center gap-3 rounded-[1.25rem] bg-neutral-100 p-4 text-left transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!walletConnectConnector || isPending}
                onClick={() => {
                  if (!walletConnectConnector) {
                    toast.error("Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable WalletConnect.");
                    return;
                  }
                  connect({ connector: walletConnectConnector });
                }}
              >
                <span className="rounded-full bg-[#00d54b]/15 p-3 text-[#00a83b]">
                  <QrCode className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">WalletConnect</span>
                  <span className="block text-sm text-neutral-500">
                    Scan QR or open a mobile wallet.
                  </span>
                </span>
              </button>

              <button
                className="flex w-full items-center gap-3 rounded-[1.25rem] bg-neutral-100 p-4 text-left transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!injectedConnector || isPending}
                onClick={() => {
                  if (!injectedConnector) {
                    toast.error("No browser wallet found.");
                    return;
                  }
                  connect({ connector: injectedConnector });
                }}
              >
                <span className="rounded-full bg-black p-3 text-white">
                  <Wallet className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">Browser wallet</span>
                  <span className="block text-sm text-neutral-500">
                    MetaMask, Rabby, Coinbase Wallet, and similar wallets.
                  </span>
                </span>
              </button>
            </div>

            {!walletConnectConnector && (
              <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs text-amber-700">
                WalletConnect needs a project ID. Add it to
                NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
