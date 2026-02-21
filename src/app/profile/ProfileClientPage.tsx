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
            <div key={idx} className="flex justify-between mt-4 p-4 bg-gray-100 rounded-lg">
                <div>
                    <p className="font-semibold">Order ID: {item.id.slice(0,7)    }</p>
                    <p>Order Date: {item.created_at.slice(0,10)}</p>
                  
                    <p className="text-sm opacity-70">Total: Rs.{item.total}</p>
                </div>
                <div>
                    <button onClick={()=>router.push(`/order-detials${item.id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">View Details</button>
                </div>
                </div>
                ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileClientPage;
