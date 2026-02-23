"use server";

import { createClient } from "@/lib/supabaseServerClient";
import { CartItem } from "@/store/navbarStore";

type addressData = {
    full_name: string,
    email:string,
    phone:string,
    street:string,
    city:string,
    state:string,
    zip_code: string,
    landmark : string,
    };



export async function createCodOrder(
  cartItems: CartItem[],
  addressData: addressData
) {
  const supabase = await createClient();

  // 1️⃣ Verify user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // 2️⃣ Fetch products
  const productIds = cartItems.map((item) => item.id);

  const { data, error } = await supabase
    .from("posters")
    .select("*")
    .in("id", productIds);

  if (error || !data) {
    throw new Error("Failed to fetch products");
  }

  // 3️⃣ Map cart to DB snapshot
  const newPords = cartItems
    .map((cartItem) => {
      const product = data.find((p) => p.id === cartItem.id);
      if (!product) return null;

      const selectedVariant = product.variants?.find(
        (v: { size: string; }) => v.size === cartItem.size
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
    .filter((p): p is NonNullable<typeof p> => p !== null);
    if (newPords.length !== cartItems.length) {
        throw new Error("Invalid cart items");
      }

  const subtotal = newPords.reduce((acc, product) => {
    return (
      acc +
      product.selectedVariant.discounted_price *
      product.selectedVariant.quantity
    );
  }, 0);

  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 0 ? 100 : 0;
  const grandTotal = subtotal + tax + shipping-100;

  // 4️⃣ Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "confirmed",
      payment_method: "cod",
      payment_status: "pending",
      subtotal,
      tax,
      shipping_fee: shipping,
      discount: 0,
      total: grandTotal,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error("Failed to create order");
  }
  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // 5️⃣ Insert order items
  const orderItems = newPords.map((product) => ({
    order_id: order.id,
    product_id: product.id,
    variant_size: product.selectedVariant.size,
    product_name: product.name,
    unit_price: product.selectedVariant.discounted_price,
    quantity: product.selectedVariant.quantity,
    line_total:
      product.selectedVariant.discounted_price *
      product.selectedVariant.quantity,
  }));

  await supabase.from("order_items").insert(orderItems);

  // 6️⃣ Insert address
  await supabase.from("order_addresses").insert({
    order_id: order.id,
    ...addressData,
  });
  return order.id;
  
  
}