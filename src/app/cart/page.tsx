"use client";
import Products from "@/data/Products";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore } from "@/store/navbarStore";
import { User } from "@supabase/supabase-js";

import {  Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Page() {


  const [cartProducts, setCartProducts] = useState<Products[]>([]);
  const items = useCartStore((state) => state.items);
  const [user,setUser] = useState<User| null>(null)
  useEffect(()=>{
const getUser =async()=>{
  const {data:{user}} = await supabase.auth.getUser();
  setUser(user)
}
getUser();
 const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  },[])
  useEffect(() => {
    const productIds = items.map((item) => item.id);
  
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("posters")
        .select("*")
        .in("id", productIds);
  
      if (!error && data) {
        setCartProducts(data);
      }
    };
  
    if (productIds.length > 0) {
      fetchData();
    } else {
      setCartProducts([]);
    }
  }, [items]);
  

  const newPords = items
  .map((cartItem) => {
    const product = cartProducts.find((p) => p.id === cartItem.id);
    if (!product) return null;

    const selectedVariant = product.variants?.find(
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
  .filter((p): p is NonNullable<typeof p> => p !== null);


  const handleReduce = useCartStore((state)=> state.reduceQuantity)
  const handleRemove = useCartStore((state)=>state.removeItem)
  const handleIncrease= useCartStore((state)=>state.addItem)

  const total = newPords.reduce((acc, product) => {
    return (
      acc +
      product.selectedVariant.discounted_price *
      product.selectedVariant.quantity
    );
  }, 0);
  
  const tax = Math.round((total*18)/100)
  const singIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error signing in:", error.message);
    }
  };

 if(items.length===0){
    return(
        <div className="min-h-[70vh] bg-white">
              <div className=" flex bg-gray-100 w-full ">
        <h1 className="flex m-2 mx-auto text-fuchsia-600 text-sm font-semibold tracking-widegi">Holi Speacial BUY 3 GET 3 FREE!!!</h1>
      </div>
         <div className="bg-white gap-2 flex items-center justify-center flex-col min-h-[50vh]">
         <h1 className="text-2xl tracking-wide">Your Bag is Empty</h1>
         <p className="text-md">When you add products, they&apos;ll appear here.</p>
         <Link href={"/"} className="mt-6 bg-black text-white text-2xl px-14 py-3 rounded-3xl min-w-[30vh] flex items-center justify-center">Shop Now</Link>
         </div>
        </div>
    )
 }
  return (
    <div className="min-h-screen w-screen  bg-white flex flex-col ">
      <div className=" flex bg-gray-100 w-full ">
        <h1 className="flex m-2 mx-auto text-fuchsia-600 text-sm font-semibold tracking-widegi">Holi Speacial BUY 3 GET 3 FREE!!!</h1>
      </div>
      {/* flashcards to be added later */}

      <div className="flex mt-20 gap-20 px-4 md:flex-row max-w-5xl w-full mx-auto flex-col">
        <div className=" md:min-w-[60%]">
          <h1 className="md:text-2xl font-semibold tracking-wider leading-3.5">
            Bag
          </h1>

          {/* cartlist */}

          <div className="flex flex-col">
            {newPords.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:justify-between gap-4 py-4">
                <div className="flex relative gap-4 ">
                   <div className="flex">
                    <Image src={item?.image_url||""} alt={item?.name||""} width={90} height={80} className="object-cover rounded-lg" />
                   </div>
                   <div>
                    <h2 className="font-semibold md:text-lg text-sm">{item?.name||"N?A"}</h2>
                    <p className="text-sm opacity-70"> size: {item?.selectedVariant?.size||"N?A"}</p>
                        <p className="text-sm  flex md:hidden font-semibold">Price: {item?.selectedVariant?.discounted_price||"N?A"}</p>
                    <div className="absolute gap-4 flex   bottom-4">
                        <button onClick={()=>{
                            if (item.selectedVariant.quantity > 1) {
                                handleReduce(item.id, item.selectedVariant.size);
                            }
                            if(item.selectedVariant.quantity===1){
                                handleRemove(item.id,item.selectedVariant.size)
                            }
                           
                        }}>
                            {item.selectedVariant.quantity===1 && (<div>
                                <Trash className="h-4 w-4"/>
                            </div>) || <div className="h-4 w-4 items-center justify-center flex">
                                <Minus className="h-4 w-4"/>
                                    </div>}
                            
                            </button>
                             <span>{item.selectedVariant.quantity}</span>
                            <button className=" items-center justify-center flex" onClick={()=>handleIncrease(item.id,item.selectedVariant.size,1)}>
                                <Plus className="h-4 w-4"/>
                            </button>
                    </div>
                   </div>

                </div>
                <div className="hidden md:flex gap-4 p-4 font-bold">
                    Rs.{item?.selectedVariant?.discounted_price}
                </div>
            
                
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mb-10">
          <h1 className="md:text-2xl font-semibold tracking-wider leading-3.5">
            Summary
          </h1>
          <section className="flex flex-col gap-3 w-full mt-6">
            <div className="flex justify-between w-full">
              <div className="font-semibold">Bag Total</div>
              <div>Rs.{total}</div>
            </div>
            <div className="flex justify-between w-full">
              <div className="">Estimated Tax</div>
              <div>Rs.{tax}</div>
            </div>
            <div className="flex justify-between w-full">
              <div className="">Shipping</div>
              <div>Rs.{items.length===0? 0:100}</div>
            </div>
            <div className="flex justify-between w-full">
              <div className="">Dicount</div>
              <div className="text-green-600">Rs.{items.length===0? 0:100}</div>
            </div>
          </section>
          <div className="h-0.5 bg-gray-300 my-6 " />
          <div className="flex justify-between w-full">
            <div className="font-semibold tracking-wider">Total</div>
            <div className="font-semibold">Rs.{total+tax}</div>
          </div>

        {user ? 
          <Link href="checkout" className="flex items-center mt-10 justify-center mx-auto bg-black text-white cursor-pointer hover:opacity-85 rounded-3xl py-3 w-full">Proceed to Buy</Link>
          : 
           <button onClick={singIn} className="flex items-center mt-10 justify-center mx-auto bg-black text-white cursor-pointer hover:opacity-85 rounded-3xl py-3 w-full">Login to Proceed</button>}
        </div>
      </div>
    </div>
  );
}

export default Page;
