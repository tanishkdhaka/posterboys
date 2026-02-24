"use client"
import Address from '@/data/Address';
import Order from '@/data/Order';
import Order_items from '@/data/Order_items';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

 
function Page() {
     const params = useParams();
     const id = params.id as string;
     const [orderItems, setOrderItems] = useState<Order_items[]>([])
     const [orderAddress,setOrderAddress] = useState<Address>({} as Address)
     const [order,setOrder] = useState<Order>({} as Order)
     
    useEffect(()=>{
        const fetchData = async()=>{
            const {data:order , error:orderError} = await supabase
            .from("orders")
            .select("*")
            .eq("id",id)
            if(!orderError && order){
                setOrder(order[0])
            }

            const {data,error} = await supabase 
            .from("order_items")
            .select("*")
            .eq("order_id",id)
            if(!error && data ){
                setOrderItems(data)
            }
            const {data:orderAddress,error:orderAddressError} = await supabase
            .from("order_addresses")
            .select("*")
            .eq("order_id",id)
             if(orderAddress && !orderAddressError){
               
                setOrderAddress(orderAddress[0])
             }

        }
        fetchData();
    },[id])
    if(!orderAddress || orderItems.length === 0){
        return (
            <div className='flex min-h-screen justify-center items-center'>
               <div className='loader'></div>
            </div>
        )
    }
 console.log(orderItems)
 const total = orderItems.reduce((acc,item)=>{
    return acc + (item.unit_price * item.quantity)
},0)
const formattedDate =
  orderAddress?.created_at
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(orderAddress.created_at))
    : "";
  

  
  return (
    <div className='flex flex-col min-h-screen bg-white  '>

        
        <div className='flex flex-col text-xs max-w-3xl bg-gray-100 min-h-screen mx-auto mt-10 mb-10 p-4 md:p-10 rounded-2xl gap-6 w-full'> 
                <div className='grid grid-cols-2 gap-4   p-4 rounded-lg bg-white w-full'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-lg uppercase font-thin'>Ship To</h1>
                    <p className='font-semibold'>{orderAddress.full_name}</p>
                    <p>{orderAddress.street}</p>
                    <p>{orderAddress.city}, {orderAddress.state}</p>
                    {orderAddress.landmark && <p>{orderAddress.landmark}</p>}
                    <p> {orderAddress.zip_code}</p>
                    <p>India</p>
                  
                </div>
                <div className="flex  flex-col items-end gap-2">
           <div className='flex items-end flex-col '>
              <p>Payment method</p>
              <p className="font-semibold uppercase">{order.payment_method}</p>
            </div>
            <div>
              <p>Order status</p>
              <p className="font-semibold uppercase">{order.status}</p>
              </div>
           </div>
                </div>
                <div className="flex justify-between flex-wrap p-4">
            <div >
              <p className="uppercase">Order Placed</p>
              <p>{formattedDate}</p>
              </div>

              <div >
              <p className="uppercase">Total</p>
              <p>₹{total}</p>
              </div>
              <div >
              <p className="uppercase">
             Order ID  
              </p>
              <p>#{id.slice(0,18)}</p>
              </div>
                </div>
                
              
            
        </div>
        {/* order items */}
        
    </div>
  )
}

export default Page