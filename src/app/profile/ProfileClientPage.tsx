"use client";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect } from "react";
import Order from "@/data/Order";


function ProfileClientPage({ user }: { user: User }) {
    const[order,setOrder] = React.useState<Order[]>([])
  
  const router = useRouter();
  useEffect(()=>{
    const fetchData = async()=>{
        const {data,error}= await supabase
        .from("orders")
        .select("*")
        .eq("user_id",user.id)
        if(!error && data){
            setOrder(data)
        }
        
        
    }
    fetchData();
  },[user.id])

  async function LogOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  
  const formattedDate =(timestamp:Date) =>{
    const date=new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
   
  }).format(new Date(timestamp));
  return date
}
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-col mx-auto max-w-3xl w-full mt-10 p-4">
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-3 md:gap-6">
            <Image
              src={user?.user_metadata?.avatar_url || ""}
              alt={user?.email || ""}
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col md:gap-1 text-xs md:text-sm">
              {user?.email}
              {user?.user_metadata?.full_name && (
                <p>{user.user_metadata.full_name}</p>
              )}
            </div>
          </div>
          <div>
            <button
              onClick={() => LogOut()}
              className="px-4 py-2 bg-black cursor-pointer text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
        <div>
         {/* Order history and other profile details can be added here */}
         {order.map((item,idx)=>(
          <div key={idx} className="flex text-xs flex-col justify-between gap-4 mt-4 p-4 bg-gray-100 rounded-lg">
            {/* upperlabel */}
            <div className="flex justify-between flex-wrap">
            <div >
              <p className="uppercase">Order Placed</p>
              <p>{formattedDate(item.created_at)}</p>
              </div>

              <div >
              <p className="uppercase">Total</p>
              <p>₹{item.total}</p>
              </div>
              <div >
              <p className="uppercase">
             Order ID  
              </p>
              <p>#{item.id.slice(0,18)}</p>
              </div>
            </div>
            

           <div className="flex justify-between flex-wrap">
           <div>
              <p>Payment method</p>
              <p className="font-semibold uppercase">{item.payment_method}</p>
            </div>
            <div>
              <p>Order status</p>
              <p className="font-semibold uppercase">{item.status}</p>
              </div>
           </div>
              
           <div>
                    <button onClick={()=>router.push(`/order-details/${item.id}`)} className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg">View Details</button>
                </div>
          </div>
          ))}
       
        </div>
      </div>
    </div>
  );
}

export default ProfileClientPage;
