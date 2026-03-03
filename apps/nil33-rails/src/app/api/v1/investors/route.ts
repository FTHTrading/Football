import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appendAuditEvent } from "@/lib/audit";
import { CreateInvestorSchema } from "@nil33/core";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));
  const kycStatus = searchParams.get("kycStatus");
  const accreditation = searchParams.get("accreditationStatus");

  const where: Record<string, unknown> = {};
  if (kycStatus) where.kycStatus = kycStatus;
  if (accreditation) where.accreditationStatus = accreditation;

  const [items, total] = await Promise.all([
    prisma.investor.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { subscriptions: true, complianceChecks: true } } },
    }),
    prisma.investor.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateInvestorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const d = parsed.data;
  const investor = await prisma.investor.create({
    data: {
      legalName: d.legalName,
      email: d.contactEmail,
      entityType: d.entityType.toUpperCase(),
      jurisdictionCountry: d.jurisdiction,
    },
  });

  await appendAuditEvent({
    action: "investor.created",
    entityType: "investor",
    entityId: investor.id,
    actorId: session.user.id,
    snapshotAfter: JSON.parse(JSON.stringify(investor)),
  });

  return NextResponse.json(investor, { status: 201 });
}
