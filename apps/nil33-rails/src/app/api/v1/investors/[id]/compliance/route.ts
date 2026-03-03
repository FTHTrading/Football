import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ComplianceGate } from "@nil33/compliance-gate";
import { appendAuditEvent } from "@/lib/audit";
import type { ComplianceContext } from "@nil33/compliance-gate";
import type { Investor, Instrument } from "@nil33/core";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const investor = await prisma.investor.findUnique({ where: { id } });
  if (!investor) return NextResponse.json({ error: "Investor not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  if (!body.instrumentId) {
    return NextResponse.json({ error: "instrumentId is required" }, { status: 422 });
  }

  const dbInstrument = await prisma.instrument.findUnique({ where: { id: body.instrumentId } });
  if (!dbInstrument) {
    return NextResponse.json({ error: "Instrument not found" }, { status: 404 });
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { investorId: investor.id, status: "FUNDED" },
    select: { amountCents: true },
  });
  const totalInvested = subscriptions.reduce((s, sub) => s + sub.amountCents, 0);

  // Map DB rows → domain types expected by ComplianceGate
  const investorDomain: Investor = {
    id: investor.id,
    entityType: investor.entityType.toLowerCase() as Investor["entityType"],
    legalName: investor.legalName,
    ein: null,
    jurisdiction: investor.jurisdictionCountry,
    kycStatus: investor.kycStatus.toLowerCase() as Investor["kycStatus"],
    kycCompletedAt: investor.kycCompletedAt,
    accreditationStatus: investor.accreditationStatus.toLowerCase() as Investor["accreditationStatus"],
    accreditationExpiry: investor.accreditationExpiresAt ?? null,
    riskFlags: investor.riskFlags,
    contactEmail: investor.email,
    contactName: investor.legalName,
    createdAt: investor.createdAt,
    updatedAt: investor.updatedAt,
  };

  const instrumentDomain: Instrument = {
    id: dbInstrument.id,
    spvId: dbInstrument.spvId,
    name: dbInstrument.name,
    type: dbInstrument.instrumentType.toLowerCase() as Instrument["type"],
    status: dbInstrument.status.toLowerCase() as Instrument["status"],
    offeringSizeCents: dbInstrument.totalIssuanceAmtCents,
    minTicketCents: dbInstrument.minSubscriptionCents,
    maxTicketCents: null,
    targetYield: null,
    maturityMonths: null,
    eligibilityRules: [],
    holdingPeriodDays: dbInstrument.holdingPeriodDays,
    concentrationLimitPct: dbInstrument.participationRateBps,
    offeringDocId: null,
    createdAt: dbInstrument.createdAt,
    updatedAt: dbInstrument.updatedAt,
    closedAt: null,
  };

  const ctx: ComplianceContext = {
    investor: investorDomain,
    instrument: instrumentDomain,
    currentInvestorTotalCents: totalInvested + (body.proposedAmountCents ?? 0),
    currentRaisedCents: totalInvested,
  };

  const gate = new ComplianceGate();
  const result = gate.checkEligibility(ctx);

  // Persist check record
  await prisma.complianceCheck.create({
    data: {
      investorId: investor.id,
      subscriptionId: body.subscriptionId ?? null,
      checkedById: session.user.id,
      passed: result.allowed,
      reasonCode: result.reasonCode ?? null,
      detail: result.detail ?? null,
      snapshotJson: JSON.parse(JSON.stringify(ctx)),
    },
  });

  await appendAuditEvent({
    action: "compliance.checked",
    entityType: "investor",
    entityId: investor.id,
    actorId: session.user.id,
    snapshotAfter: JSON.parse(JSON.stringify(result)),
  });

  return NextResponse.json(result);
}
