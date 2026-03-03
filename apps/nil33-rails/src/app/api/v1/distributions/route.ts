import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appendAuditEvent } from "@/lib/audit";
import { CreateDistributionRunSchema } from "@nil33/core";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));
  const instrumentId = searchParams.get("instrumentId");
  const where: Record<string, unknown> = {};
  if (instrumentId) where.instrumentId = instrumentId;

  const [items, total] = await Promise.all([
    prisma.distribution.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        instrument: { select: { id: true, name: true } },
        _count: { select: { lines: true } },
      },
    }),
    prisma.distribution.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateDistributionRunSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { instrumentId, periodStart, periodEnd, totalRevenueCents } = parsed.data;

  // Look up participation rate from the instrument
  const instrument = await prisma.instrument.findUnique({ where: { id: instrumentId } });
  if (!instrument) {
    return NextResponse.json({ error: "Instrument not found" }, { status: 404 });
  }

  const grossRevenueCents = totalRevenueCents;
  const participationCents = Math.floor((grossRevenueCents * instrument.participationRateBps) / 10_000);
  const mgmtFee = 0;
  const netDistributableCents = participationCents - mgmtFee;

  // Build waterfall lines from funded subscriptions
  const subs = await prisma.subscription.findMany({
    where: { instrumentId, status: "FUNDED" },
    include: { investor: { select: { legalName: true } } },
  });

  const totalFundedCents = subs.reduce((s, sub) => s + sub.amountCents, 0);

  const distribution = await prisma.distribution.create({
    data: {
      instrumentId,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      grossRevenueCents,
      participationCents,
      managementFeeCents: mgmtFee,
      netDistributableCents,
      status: "DRAFT",
      lines: {
        create: subs.map((sub) => {
          const ownershipBps =
            totalFundedCents > 0
              ? Math.round((sub.amountCents / totalFundedCents) * 10_000)
              : 0;
          const amountCents = Math.floor((netDistributableCents * ownershipBps) / 10_000);
          return {
            subscriptionId: sub.id,
            investorName: sub.investor.legalName, // denormalized snapshot
            amountCents,
            ownershipBps,
          };
        }),
      },
    },
    include: { lines: true },
  });

  await appendAuditEvent({
    action: "distribution.created",
    entityType: "distribution",
    entityId: distribution.id,
    actorId: session.user.id,
    snapshotAfter: { netDistributableCents, lineCount: distribution.lines.length },
  });

  return NextResponse.json(distribution, { status: 201 });
}
