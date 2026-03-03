import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appendAuditEvent } from "@/lib/audit";
import { CreateInstrumentSchema } from "@nil33/core";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const spvId = searchParams.get("spvId");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));

  const where = spvId ? { spvId } : {};
  const [items, total] = await Promise.all([
    prisma.instrument.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        spv: { select: { id: true, legalName: true } },
        _count: { select: { subscriptions: true } },
      },
    }),
    prisma.instrument.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateInstrumentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const d = parsed.data;
  const instrument = await prisma.instrument.create({
    data: {
      spvId: d.spvId,
      name: d.name,
      instrumentType: d.type.toUpperCase().replace(/ /g, "_"),
      totalIssuanceAmtCents: d.offeringSizeCents,
      minSubscriptionCents: d.minTicketCents,
      participationRateBps: d.concentrationLimitPct, // bps field
      holdingPeriodDays: d.holdingPeriodDays,
      ...(body.genomeId && { genomeId: String(body.genomeId) }),
      ...(body.genomeVersion && { genomeVersion: String(body.genomeVersion) }),
      ...(body.underwritingRunId && { underwritingRunId: String(body.underwritingRunId) }),
    },
  });

  await appendAuditEvent({
    action: "instrument.created",
    entityType: "instrument",
    entityId: instrument.id,
    actorId: session.user.id,
    snapshotAfter: JSON.parse(JSON.stringify(instrument)),
  });

  return NextResponse.json(instrument, { status: 201 });
}
