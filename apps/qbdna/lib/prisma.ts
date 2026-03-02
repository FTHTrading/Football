// Prisma client singleton
// Prisma 7 requires prisma.config.ts for connection URLs.
// Run `npx prisma generate` after creating prisma.config.ts with your DATABASE_URL.
//
// Once generated, uncomment the import and singleton below:
//
// import { PrismaClient } from "@prisma/client";
//
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };
//
// export const prisma = globalForPrisma.prisma ?? new PrismaClient();
//
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Placeholder export — safe for build, activates after Prisma generation
export const prisma = null as any;
