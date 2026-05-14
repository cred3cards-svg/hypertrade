import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_MARKETS } from "@/lib/constants";
import { orderTicketSchema, validateOrderForSubmission } from "@/lib/validation/order";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = orderTicketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const market = DEFAULT_MARKETS.find((item) => item.id === parsed.data.marketId);
  if (!market) {
    return NextResponse.json({ error: "Unknown market." }, { status: 404 });
  }

  const env = (process.env.NEXT_PUBLIC_HYPERLIQUID_ENV ?? "testnet") as "testnet" | "mainnet";
  const validation = validateOrderForSubmission({ order: parsed.data, market, env });
  if (!validation.ok) {
    await prisma.auditLog.create({
      data: {
        walletAddress: parsed.data.walletAddress,
        action: "ORDER_INTENT_REJECTED",
        severity: "WARNING",
        metadata: { reason: validation.reason, order: parsed.data }
      }
    });
    return NextResponse.json({ error: validation.reason }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { email: `${parsed.data.walletAddress.toLowerCase()}@wallet.local` },
    update: {},
    create: { email: `${parsed.data.walletAddress.toLowerCase()}@wallet.local` }
  });

  const dbMarket = await prisma.market.upsert({
    where: { symbol: market.symbol },
    update: {},
    create: {
      symbol: market.symbol,
      displayName: market.displayName,
      baseAsset: market.baseAsset,
      quoteAsset: market.quoteAsset,
      hyperliquidAssetId: market.hyperliquidAssetId,
      isHip3: market.isHip3,
      oracleDescription: market.oracleDescription,
      maxLeverage: market.maxLeverage,
      minOrderSize: market.minOrderSize,
      tickSize: market.tickSize,
      szDecimals: market.szDecimals,
      enabled: market.enabled,
      testnetOnly: market.testnetOnly
    }
  });

  const intent = await prisma.orderIntent.create({
    data: {
      userId: user.id,
      walletAddress: parsed.data.walletAddress,
      marketId: dbMarket.id,
      hyperliquidAssetId: parsed.data.hyperliquidAssetId,
      side: parsed.data.side,
      orderType: parsed.data.orderType,
      quantity: parsed.data.quantity,
      limitPrice: parsed.data.limitPrice ?? null,
      reduceOnly: parsed.data.reduceOnly,
      leverage: parsed.data.leverage,
      slippageBps: parsed.data.slippageBps,
      status: "DRAFT",
      clientOrderId: `dp_${Date.now()}`,
      rawRequestJson: parsed.data
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      walletAddress: parsed.data.walletAddress,
      action: "ORDER_INTENT_CREATED",
      metadata: { intentId: intent.id, market: market.symbol }
    }
  });

  return NextResponse.json({ intent });
}
