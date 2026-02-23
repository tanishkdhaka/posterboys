"use client"
import Order_items from "@/data/Order_items";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import Link from "next/link";
import React, { useEffect } from "react";

function Page() {
 
    const [orderItems,setOrderItems] = React.useState<Order_items[]>([]);
    const params = useParams();
    const id = params.id as string;
   
    useEffect(()=>{
        const fetchData = async()=>{
            
               
                const {data:orderItems,error:orderItemsError} = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id",id)
                if(!orderItemsError && orderItems){
                  setOrderItems(orderItems)
                }
               

        }
        fetchData();
    },[id])
    const total = orderItems.reduce((acc,item)=>{
        return acc + (item.unit_price * item.quantity)
    
    },0)
    const tax = total * 0.18;
  return (
    <div className="flex min-h-screen bg-white  ">
      <div className="flex flex-col bg-gray-100 w-full md:m-8 m-4 rounded-2xl p-4 md:p-10">
        <div className="flex mx-auto flex-col ">
          <div className="success-animation">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
           <div className="md:text-2xl font-semibold mt-6 tracking-wide"> Thank You For Your Purchase</div>
          </div>
          <div>
        <div className="bg-white p-4 md:p-10 rounded-2xl">
            <h1 className="md:text-2xl font-semibold">Order Summary</h1>
            {orderItems.map((item)=>(
                <div key={item.id} className="flex justify-between gap-4 mt-6">
                   
                    <div>
                        <h2 className="font-semibold">{item.product_name||"N?A"}</h2>
                        <p className="text-sm opacity-70">Size: {item.variant_size||"N?A"}</p>
                        <p className="text-sm opacity-70">Quantity: {item.quantity||"N?A"}</p>
                    </div>
                    <p className=" font-semibold">Price: {item.unit_price*item.quantity||"N?A"}</p>
                </div>
                ))}
                <div className="flex justify-between mt-6 border-t pt-4">
                   <div className="flex flex-col">
                   <p>Total</p>
                   <p className="text-xs text-gray-400">total+tax+shipping</p>
                   </div>
                    <p className=" font-semibold">Rs. {total+tax||"N?A"}</p>
                 </div>
        </div>
        <div className="flex justify-center">
            <Link href="/collections" className="inline-block  mt-6 px-6 py-3 bg-black text-white rounded-lg">Continue Shopping</Link>
        </div>
          </div>
        </div>
        <div>
           
        </div>
      </div>
    </div>
  );
}

export default Page;
