import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ComplianceGate } from "@nil33/compliance-gate";
import { appendAuditEvent } from "@/lib/audit";
import type { ComplianceContext } from "@nil33/compliance-gate";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const investor = await prisma.investor.findUnique({ where: { id: params.id } });
  if (!investor) return NextResponse.json({ error: "Investor not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const instrument = body.instrumentId
    ? await prisma.instrument.findUnique({ where: { id: body.instrumentId } })
    : null;

  const subscriptions = await prisma.subscription.findMany({
    where: { investorId: investor.id, status: "FUNDED" },
    select: { amountCents: true },
  });
  const totalInvested = subscriptions.reduce((s, sub) => s + sub.amountCents, 0);

  const ctx: ComplianceContext = {
    investorId: investor.id,
    kycStatus: investor.kycStatus as "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED",
    accreditationStatus: investor.accreditationStatus as "PENDING" | "VERIFIED" | "EXPIRED" | "FAILED",
    accreditationExpiresAt: investor.accreditationExpiresAt ?? undefined,
    jurisdictionCountry: investor.jurisdictionCountry,
    jurisdictionState: investor.jurisdictionState ?? undefined,
    riskFlags: investor.riskFlags,
    instrumentStatus: instrument?.status as string | undefined,
    concentrationLimitBps: investor.concentrationLimitBps,
    currentPositionCents: totalInvested,
    proposedAmountCents: body.proposedAmountCents ?? 0,
    totalPortfolioCents: investor.totalInvestedCents,
  };

  const gate = new ComplianceGate(ctx);
  const result = gate.checkEligibility();

  // Persist check record
  await prisma.complianceCheck.create({
    data: {
      investorId: investor.id,
      subscriptionId: body.subscriptionId ?? null,
      checkedById: session.user.id,
      passed: result.allowed,
      reasonCode: result.reasonCode ?? null,
      detail: result.detail ?? null,
      snapshotJson: ctx as Record<string, unknown>,
    },
  });

  await appendAuditEvent({
    action: "compliance.checked",
    entityType: "investor",
    entityId: investor.id,
    actorId: session.user.id,
    snapshotAfter: result as unknown as Record<string, unknown>,
  });

  return NextResponse.json(result);
}
