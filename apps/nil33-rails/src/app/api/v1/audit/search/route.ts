import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuditSearchSchema } from "@nil33/core";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const raw = Object.fromEntries(searchParams.entries());
  const parsed = AuditSearchSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search params", issues: parsed.error.issues }, { status: 422 });
  }

  const { entityType, entityId, action, actorId, from, to, page, pageSize } = parsed.data;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;
  if (action) where.action = { contains: action };
  if (actorId) where.actorId = actorId;
  if (from || to) {
    where.occurredAt = {
      ...(from && { gte: new Date(from) }),
      ...(to && { lte: new Date(to) }),
    };
  }

  const [items, total] = await Promise.all([
    prisma.ledgerEvent.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { occurredAt: "desc" },
      include: { actor: { select: { id: true, email: true, name: true } } },
    }),
    prisma.ledgerEvent.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}
