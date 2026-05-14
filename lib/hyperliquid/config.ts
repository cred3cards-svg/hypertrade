export type HyperliquidEnv = "testnet" | "mainnet";

const DEFAULT_MAINNET_API_URL = "https://api.hyperliquid.xyz";
const DEFAULT_TESTNET_API_URL = "https://api.hyperliquid-testnet.xyz";

export function getHyperliquidEnv(): HyperliquidEnv {
  const env = process.env.NEXT_PUBLIC_HYPERLIQUID_ENV ?? "testnet";
  if (env !== "testnet" && env !== "mainnet") return "testnet";
  return env;
}

export function assertMainnetGate(env = getHyperliquidEnv()) {
  if (
    env === "mainnet" &&
    process.env.NEXT_PUBLIC_ENABLE_MAINNET_TRADING !== "true"
  ) {
    throw new Error(
      "Mainnet trading is disabled. Set NEXT_PUBLIC_ENABLE_MAINNET_TRADING=true only after production launch controls are complete."
    );
  }
}

export function getHyperliquidApiUrl(env = getHyperliquidEnv()) {
  assertMainnetGate(env);
  if (process.env.HYPERLIQUID_API_URL) {
    return process.env.HYPERLIQUID_API_URL;
  }
  return env === "mainnet"
    ? process.env.HYPERLIQUID_MAINNET_API_URL ?? DEFAULT_MAINNET_API_URL
    : process.env.HYPERLIQUID_TESTNET_API_URL ?? DEFAULT_TESTNET_API_URL;
}

export const HYPERLIQUID_ENV = getHyperliquidEnv();
export const HYPERLIQUID_API_URL = getHyperliquidApiUrl(HYPERLIQUID_ENV);
