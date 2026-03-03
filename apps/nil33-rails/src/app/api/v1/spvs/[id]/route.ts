import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appendAuditEvent } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const spv = await prisma.spv.findUnique({
    where: { id },
    include: {
      athletes: { include: { nilContracts: true } },
      instruments: { include: { _count: { select: { subscriptions: true } } } },
    },
  });

  if (!spv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(spv);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const before = await prisma.spv.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.spv.update({ where: { id }, data: body });

  await appendAuditEvent({
    action: "spv.updated",
    entityType: "spv",
    entityId: id,
    actorId: session.user.id,
    snapshotBefore: JSON.parse(JSON.stringify(before)),
    snapshotAfter: JSON.parse(JSON.stringify(updated)),
  });

  return NextResponse.json(updated);
}
