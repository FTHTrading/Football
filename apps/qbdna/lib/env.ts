import { z } from "zod";

// ─── Environment Variable Validation ───────────────────
// Validates all required env vars at startup.
// Import this in layout.tsx or middleware to fail fast.

const envSchema = z.object({
  // Required for auth
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url().optional(),

  // Database (required for Prisma, optional during pure frontend dev)
  DATABASE_URL: z.string().optional(),

  // Stripe (optional — only needed when payment flow is active)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // App
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),

  // Analytics (optional)
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),

  // Rate limiting (optional — Upstash)
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables. Call at app startup.
 * Returns validated env or throws with clear error messages.
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");

    console.error(
      `\n❌ Environment validation failed:\n${missing}\n\nSee .env.example for required variables.\n`
    );

    // In development, warn but don't crash
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️  Continuing in development mode with missing env vars.\n");
      return process.env as unknown as Env;
    }

    throw new Error("Missing required environment variables");
  }

  return result.data;
}
