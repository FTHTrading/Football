import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { checkoutSchema } from "@/lib/validations";
import { rateLimitStrict } from "@/lib/rate-limit";
import { log } from "@/lib/logger";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip");
    const limited = await rateLimitStrict(ip);
    if (limited) return limited;

    // Validate input
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { athleteId, athleteName, email } = parsed.data;

    log.stripe("Checkout session started", { athleteId, email });

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      metadata: {
        athleteId,
        athleteName: athleteName || "Unknown",
        product: "verification",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Under Center — Verified QB Status",
              description:
                "Official verification session: pro-grade metric capture, verified badge, shareable card access, and coach visibility.",
              images: [],
            },
            unit_amount: 14900, // $149.00
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?verified=pending`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?verified=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[STRIPE_CHECKOUT]", err.message);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
