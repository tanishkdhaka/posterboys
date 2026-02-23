import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // 1️⃣ Get raw body
    const rawBody = await req.text();

    // 2️⃣ Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 3️⃣ Parse JSON safely after verification
    const event = JSON.parse(rawBody);

    const eventType = event.event;

    // 4️⃣ Handle payment captured
    if (eventType === "payment.captured") {
      const razorpayOrderId = event.payload.payment.entity.order_id;

      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
        })
        .eq("razorpay_order_id", razorpayOrderId);
    }

    // 5️⃣ Handle payment failed
    if (eventType === "payment.failed") {
      const razorpayOrderId = event.payload.payment.entity.order_id;

      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          status: "cancelled",
        })
        .eq("razorpay_order_id", razorpayOrderId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}