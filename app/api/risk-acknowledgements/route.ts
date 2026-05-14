import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  version: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = parsed.data.walletAddress
    ? `${parsed.data.walletAddress.toLowerCase()}@wallet.local`
    : `anonymous-${crypto.randomUUID()}@wallet.local`;

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email }
  });

  const acknowledgement = await prisma.riskAcknowledgement.create({
    data: {
      userId: user.id,
      walletAddress: parsed.data.walletAddress,
      version: parsed.data.version,
      restrictedJurisdictionConfirmed: true
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      walletAddress: parsed.data.walletAddress,
      action: "RISK_ACKNOWLEDGED",
      metadata: { version: parsed.data.version }
    }
  });

  return NextResponse.json({ acknowledgement });
}
