import { prisma } from "@/lib/prisma";
import NewUnderwritingForm from "./NewUnderwritingForm";

export default async function NewUnderwritingPage() {
  const [athletes, spvs] = await Promise.all([
    prisma.athlete.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, displayName: true, sport: true, school: true },
      orderBy: { displayName: "asc" },
    }),
    prisma.spv.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, legalName: true },
      orderBy: { legalName: "asc" },
    }),
  ]);

  return <NewUnderwritingForm athletes={athletes} spvs={spvs} />;
}
