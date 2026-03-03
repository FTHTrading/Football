/**
 * GET /api/v1/underwrite/[id] — Retrieve a single underwriting memo with full detail
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const memo = await prisma.underwritingMemo.findUnique({
    where: { id },
    include: {
      athlete: {
        select: {
          id: true,
          displayName: true,
          sport: true,
          school: true,
          position: true,
          classYear: true,
          imageUrl: true,
        },
      },
      spv: {
        select: { id: true, legalName: true, status: true },
      },
      createdBy: {
        select: { email: true, name: true },
      },
    },
  });

  if (!memo) {
    return NextResponse.json({ error: "Memo not found" }, { status: 404 });
  }

  return NextResponse.json(memo);
}
