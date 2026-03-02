import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { log } from "@/lib/logger";
// import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !WEBHOOK_SECRET) {
    log.error("Stripe webhook missing required env vars");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    log.error("Stripe webhook called without signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    log.error("Stripe webhook signature verification failed", { error: err.message });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  log.stripe("Webhook event received", { type: event.type, id: event.id });

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const athleteId = session.metadata?.athleteId;

      if (athleteId) {
        log.stripe("Payment complete", {
          athleteId,
          paymentIntent: session.payment_intent as string,
          email: session.customer_email,
        });

        // ────────────────────────────────────────────
        //  TODO: Uncomment when Prisma is connected
        // ────────────────────────────────────────────
        // await prisma.athlete.update({
        //   where: { id: athleteId },
        //   data: {
        //     verificationStatus: "PENDING",
        //     stripePaymentId: session.payment_intent as string,
        //   },
        // });
      }
      break;
    }

    default:
      log.info("Unhandled Stripe webhook event", { type: event.type });
  }

  return NextResponse.json({ received: true });
}
