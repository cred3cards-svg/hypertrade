import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const markets = [
  ["test:ABC", "Test ABC Derived Perpetual", "ABC"],
  ["AAPL-PERP", "Apple Derived Perpetual", "AAPL"],
  ["TSLA-PERP", "Tesla Derived Perpetual", "TSLA"],
  ["NVDA-PERP", "NVIDIA Derived Perpetual", "NVDA"],
  ["META-PERP", "Meta Derived Perpetual", "META"],
  ["AMZN-PERP", "Amazon Derived Perpetual", "AMZN"],
  ["MSFT-PERP", "Microsoft Derived Perpetual", "MSFT"],
  ["GOOGL-PERP", "Alphabet Derived Perpetual", "GOOGL"],
  ["SPY-PERP", "SPY Derived Perpetual", "SPY"]
] as const;

const verified: Record<
  string,
  { assetId: number; maxLeverage: number; oracleDescription: string; enabled: boolean }
> = {
  "test:ABC": {
    assetId: 110000,
    maxLeverage: 3,
    oracleDescription:
      "Hyperliquid docs example HIP-3 testnet market. Coin test:ABC, asset ID 110000.",
    enabled: true
  },
  "AAPL-PERP": {
    assetId: 750009,
    maxLeverage: 20,
    oracleDescription: "Verified on Hyperliquid testnet xyz dex. Coin xyz:AAPL, asset ID 750009.",
    enabled: true
  },
  "TSLA-PERP": {
    assetId: 750001,
    maxLeverage: 10,
    oracleDescription: "Verified on Hyperliquid testnet xyz dex. Coin xyz:TSLA, asset ID 750001.",
    enabled: true
  },
  "NVDA-PERP": {
    assetId: 750002,
    maxLeverage: 20,
    oracleDescription: "Verified on Hyperliquid testnet xyz dex. Coin xyz:NVDA, asset ID 750002.",
    enabled: true
  },
  "META-PERP": {
    assetId: 750008,
    maxLeverage: 10,
    oracleDescription: "Verified on Hyperliquid testnet xyz dex. Coin xyz:META, asset ID 750008.",
    enabled: true
  },
  "AMZN-PERP": {
    assetId: 750013,
    maxLeverage: 10,
    oracleDescription: "Verified on Hyperliquid testnet xyz dex. Coin xyz:AMZN, asset ID 750013.",
    enabled: true
  },
  "MSFT-PERP": {
    assetId: 750010,
    maxLeverage: 10,
    oracleDescription: "Verified on Hyperliquid testnet xyz dex. Coin xyz:MSFT, asset ID 750010.",
    enabled: true
  },
  "GOOGL-PERP": {
    assetId: 750012,
    maxLeverage: 10,
    oracleDescription: "Verified on Hyperliquid testnet xyz dex. Coin xyz:GOOGL, asset ID 750012.",
    enabled: true
  }
};

async function main() {
  for (const [symbol, displayName, baseAsset] of markets) {
    const config = verified[symbol];
    await prisma.market.upsert({
      where: { symbol },
      update: {
        displayName,
        baseAsset,
        quoteAsset: "USDC",
        isHip3: true,
        enabled: config?.enabled ?? false,
        testnetOnly: true,
        maxLeverage: config?.maxLeverage ?? 5,
        oracleDescription:
          config?.oracleDescription ??
          "Configure after verifying the HIP-3 oracle and asset ID from Hyperliquid meta.",
        minOrderSize: "0.001",
        tickSize: "0.01",
        szDecimals: 3,
        hyperliquidAssetId: config?.assetId ?? null
      },
      create: {
        symbol,
        displayName,
        baseAsset,
        quoteAsset: "USDC",
        hyperliquidAssetId: config?.assetId ?? null,
        isHip3: true,
        oracleDescription:
          config?.oracleDescription ??
          "Configure after verifying the HIP-3 oracle and asset ID from Hyperliquid meta.",
        maxLeverage: config?.maxLeverage ?? 5,
        minOrderSize: "0.001",
        tickSize: "0.01",
        szDecimals: 3,
        enabled: config?.enabled ?? false,
        testnetOnly: true
      }
    });
  }

  await prisma.appSetting.upsert({
    where: { key: "risk_disclosure_version" },
    update: { value: "2026-05-13" },
    create: { key: "risk_disclosure_version", value: "2026-05-13" }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
