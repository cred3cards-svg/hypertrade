import type { HyperliquidMeta } from "@/lib/hyperliquid/types";
import type { MarketConfig } from "@/lib/validation/market";

/**
 * Perp asset IDs come from Hyperliquid meta universe.
 * HIP-3 markets use the unified HyperCore trading API.
 * Correct asset ID selection is critical for order routing.
 * Asset IDs must be verified from meta, not hardcoded blindly.
 */
export function mapMarketToHyperliquidAsset(
  market: MarketConfig,
  meta: HyperliquidMeta
) {
  if (market.hyperliquidAssetId === null) return null;
  const universeAsset = meta.universe[market.hyperliquidAssetId];
  if (!universeAsset) return null;
  return {
    assetId: market.hyperliquidAssetId,
    coin: universeAsset.name,
    szDecimals: universeAsset.szDecimals,
    maxLeverage: universeAsset.maxLeverage
  };
}

export function findAssetIdBySymbol(symbol: string, meta: HyperliquidMeta) {
  const normalized = symbol.replace(/-PERP$/, "");
  const index = meta.universe.findIndex((asset) => asset.name === normalized);
  return index >= 0 ? index : null;
}
