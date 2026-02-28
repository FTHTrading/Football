import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
// import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[STRIPE_WEBHOOK] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const athleteId = session.metadata?.athleteId;

      if (athleteId) {
        console.log(`[STRIPE_WEBHOOK] Payment complete for athlete ${athleteId}`);

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
      console.log(`[STRIPE_WEBHOOK] Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
