import { type NextRequest, NextResponse } from "next/server";
import { createStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = createStripeClient();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    if (orderId) {
      const supabase = createAdminClient();

      const { data: order } = await supabase
        .from("orders")
        .update({ payment_status: "paid" })
        .eq("id", orderId)
        .select("patient_id")
        .single();

      if (order) {
        await supabase
          .from("patients")
          .update({ last_purchase_at: new Date().toISOString() })
          .eq("id", order.patient_id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
