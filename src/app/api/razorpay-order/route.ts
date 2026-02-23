import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";
import { CartItem } from "@/store/navbarStore";
import Products from "@/data/Products";

type AddressData = {
  full_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  landmark: string;
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Extract token from Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Parse body
    const { items, address }: { items: CartItem[]; address: AddressData } =
      await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // 3️⃣ Fetch products from DB
    const productIds = items.map((item) => item.id);

    const { data, error } = await supabase
      .from("posters")
      .select("*")
      .in("id", productIds);

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    const products = data as Products[];

    // 4️⃣ Map cart snapshot
    const newPords = items
      .map((cartItem) => {
        const product = products.find(
          (p: Products) => p.id === cartItem.id
        );
        if (!product) return null;

        const selectedVariant = product.variants.find(
          (v) => v.size === cartItem.size
        );
        if (!selectedVariant) return null;

        return {
          ...product,
          selectedVariant: {
            ...selectedVariant,
            quantity: cartItem.quantity,
          },
        };
      })
      .filter(
        (p): p is Products & {
          selectedVariant: {
            size: string;
            original_price: number;
            discounted_price: number;
            quantity: number;
          };
        } => p !== null
      );

    if (newPords.length !== items.length) {
      return NextResponse.json(
        { error: "Invalid cart items" },
        { status: 400 }
      );
    }

    // 5️Calculate totals (server truth)
    const subtotal = newPords.reduce<number>((acc, product) => {
      return (
        acc +
        product.selectedVariant.discounted_price *
          product.selectedVariant.quantity
      );
    }, 0);

    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 0 ? 100 : 0;
    const grandTotal = subtotal + tax + shipping - 100; // keep consistent with COD

    const amountInPaise = grandTotal * 100;

    // 6️⃣ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // 7️⃣ Insert pending order in DB
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        payment_method: "razorpay",
        payment_status: "pending",
        subtotal,
        tax,
        shipping_fee: shipping,
        discount: 0,
        total: grandTotal,
        razorpay_order_id: razorpayOrder.id,
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // 8️⃣ Insert order items
    await supabase.from("order_items").insert(
      newPords.map((product) => ({
        order_id: order.id,
        product_id: product.id,
        variant_size: product.selectedVariant.size,
        product_name: product.name,
        unit_price: product.selectedVariant.discounted_price,
        quantity: product.selectedVariant.quantity,
        line_total:
          product.selectedVariant.discounted_price *
          product.selectedVariant.quantity,
      }))
    );

    // 9️⃣ Insert address
    await supabase.from("order_addresses").insert({
      order_id: order.id,
      ...address,
    });

    // 🔟 Return Razorpay info to client
    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      internalOrderId: order.id,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}