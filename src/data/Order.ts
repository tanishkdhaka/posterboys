export default interface Order {
    id:string,
    user_id:string,
    status: "confirmed" | "shipped" | "delivered" | "cancelled",
    payment_method:"cod"| "razorpay,"
    payment_status: "pending" | "paid" | "failed",
    subtotal:number,
    tax:number,
    shipping_fee:number,
    discount:number,
    total:number,
    razorpay_payment_id:string | null,
   created_at:string,

    updated_at:string,
}