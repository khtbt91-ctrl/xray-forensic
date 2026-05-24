import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const PRICES: Record<string, number> = {
  basic: 4900, // $49.00 in cents
  pro: 9900,   // $99.00 in cents
};

export async function POST(req: NextRequest) {
  try {
    const { tier, client_name } = await req.json();
    const price = PRICES[tier];
    if (!price) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: `Institutional X-Ray — ${tier === "pro" ? "Pro" : "Basic"} Report`,
              description:
                tier === "pro"
                  ? "Full Claude AI forensic diagnosis + 7 dimension scores"
                  : "Rule-based forensic analysis + 7 dimension scores",
            },
          },
          quantity: 1,
        },
      ],
      customer_email: undefined, // collected by Stripe
      metadata: { tier, client_name },
      success_url: `${origin}/new?step=2&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/new?step=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
