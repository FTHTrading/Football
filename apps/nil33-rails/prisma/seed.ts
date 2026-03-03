/**
 * NIL33 Rails — Database Seed
 *
 * ⚠️  ALL DATA IN THIS FILE IS [SAMPLE] / [DEMO] DATA.
 *     It is clearly labeled and must never be treated as real.
 *
 * Run: npm run db:seed
 */

import { PrismaClient, UserRole, SpvStatus, InstrumentStatus, KycStatus, AccreditationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding NIL33 Rails [SAMPLE DATA]...");

  // ─── Admin user ─────────────────────────────────────────────────────────────
  const adminEmail = "admin@nil33.dev";
  const adminHash = await bcrypt.hash("nil33dev2025!", 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "[SAMPLE] Admin User",
      passwordHash: adminHash,
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log(`  ✓ Admin user: ${admin.email}`);

  // ─── Compliance Officer ──────────────────────────────────────────────────────
  const coHash = await bcrypt.hash("nil33dev2025!", 12);
  const co = await prisma.user.upsert({
    where: { email: "compliance@nil33.dev" },
    update: {},
    create: {
      email: "compliance@nil33.dev",
      name: "[SAMPLE] Compliance Officer",
      passwordHash: coHash,
      role: UserRole.COMPLIANCE_OFFICER,
    },
  });
  console.log(`  ✓ Compliance officer: ${co.email}`);

  // ─── SPV ─────────────────────────────────────────────────────────────────────
  const spv = await prisma.spv.upsert({
    where: { ein: "99-1234567" },
    update: {},
    create: {
      legalName: "[SAMPLE] NIL33 Sports SPV I, LLC",
      ein: "99-1234567",
      jurisdiction: "Delaware",
      formationType: "LLC",
      status: SpvStatus.ACTIVE,
      custodianName: "[SAMPLE] Apex Clearing Corp",
    },
  });
  console.log(`  ✓ SPV: ${spv.legalName}`);

  // ─── Athlete ─────────────────────────────────────────────────────────────────
  const athlete = await prisma.athlete.create({
    data: {
      spvId: spv.id,
      displayName: "[SAMPLE] Demo Athlete",
      sport: "Basketball",
      school: "State University",
      position: "Guard",
      classYear: "2026",
      bio: "This is a [SAMPLE] athlete record used for demonstration purposes.",
      status: "ACTIVE",
    },
  });
  console.log(`  ✓ Athlete: ${athlete.displayName}`);

  // ─── NIL Contract ────────────────────────────────────────────────────────────
  await prisma.nilContract.create({
    data: {
      athleteId: athlete.id,
      brandName: "[SAMPLE] Demo Brand Co.",
      dealType: "Endorsement",
      annualValueCents: 500_000_00, // $500,000
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      status: "ACTIVE",
    },
  });
  console.log("  ✓ NIL contract created");

  // ─── Instrument ──────────────────────────────────────────────────────────────
  const instrument = await prisma.instrument.create({
    data: {
      spvId: spv.id,
      name: "[SAMPLE] NIL Revenue Participation Note — Series 1",
      description: "Sample revenue participation note for demonstration only.",
      instrumentType: "REVENUE_PARTICIPATION_NOTE",
      totalIssuanceAmtCents: 2_000_000_00, // $2M
      minSubscriptionCents: 10_000_00,      // $10,000
      participationRateBps: 5000,            // 50%
      holdingPeriodDays: 365,
      status: InstrumentStatus.OPEN,
      offeringOpenAt: new Date("2025-01-01"),
      offeringCloseAt: new Date("2025-12-31"),
    },
  });
  console.log(`  ✓ Instrument: ${instrument.name}`);

  // ─── Investors ───────────────────────────────────────────────────────────────
  const investors = await Promise.all([
    prisma.investor.upsert({
      where: { email: "investor.a@nil33.dev" },
      update: {},
      create: {
        legalName: "[SAMPLE] Alpha Capital LLC",
        email: "investor.a@nil33.dev",
        entityType: "ENTITY",
        kycStatus: KycStatus.APPROVED,
        kycCompletedAt: new Date("2025-01-05"),
        accreditationStatus: AccreditationStatus.VERIFIED,
        accreditationExpiresAt: new Date("2026-01-05"),
        jurisdictionCountry: "US",
        jurisdictionState: "NY",
        totalInvestedCents: 250_000_00,
      },
    }),
    prisma.investor.upsert({
      where: { email: "investor.b@nil33.dev" },
      update: {},
      create: {
        legalName: "[SAMPLE] Beta Family Office",
        email: "investor.b@nil33.dev",
        entityType: "ENTITY",
        kycStatus: KycStatus.APPROVED,
        kycCompletedAt: new Date("2025-01-08"),
        accreditationStatus: AccreditationStatus.VERIFIED,
        accreditationExpiresAt: new Date("2026-01-08"),
        jurisdictionCountry: "US",
        jurisdictionState: "CA",
        totalInvestedCents: 500_000_00,
      },
    }),
  ]);
  console.log(`  ✓ ${investors.length} investors created`);

  // ─── Subscriptions ───────────────────────────────────────────────────────────
  await Promise.all(
    investors.map((inv, idx) =>
      prisma.subscription.create({
        data: {
          instrumentId: instrument.id,
          investorId: inv.id,
          amountCents: (idx + 1) * 100_000_00, // $100k, $200k
          status: "FUNDED",
          fundedAt: new Date("2025-02-01"),
        },
      })
    )
  );
  console.log("  ✓ Subscriptions created");

  // ─── Seed audit event ────────────────────────────────────────────────────────
  await prisma.ledgerEvent.create({
    data: {
      action: "seed.completed",
      entityType: "system",
      entityId: "seed",
      actorId: admin.id,
      metadata: { note: "[SAMPLE] seed run at " + new Date().toISOString() },
    },
  });

  console.log("\n✅  Seed complete — all data is [SAMPLE] / [DEMO] only.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
