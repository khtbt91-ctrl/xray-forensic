import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ paid: false, error: "Missing session_id" }, { status: 400 });
  }

  // Dev/test bypass: any session_id starting with "dev_" skips Stripe
  if (sessionId.startsWith("dev_")) {
    return NextResponse.json({ paid: true, dev: true });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ paid: session.payment_status === "paid" });
  } catch (err: any) {
    return NextResponse.json({ paid: false, error: err.message }, { status: 400 });
  }
}
