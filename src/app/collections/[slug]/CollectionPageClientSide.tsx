"use client";
import SizeDropdown from "@/components/dropdown";
import Products from "@/data/Products";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

function CollectionPageClientSide({ slug }: { slug: string }) {
  // This component is meant to be used on the client side
  const [posters, setPosters] = React.useState<Products[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      //fetch category id
      const { data: category, error: categoryError } = await supabase
        .from("category")
        .select("id")
        .eq("slug", slug)
        .single();
      if (categoryError) {
        console.error("Error fetching category:", categoryError);
        return;
      }

      //fetch posters for the category

      const { data, error } = await supabase
        .from("posters")
        .select("*")
        .eq("category_id", category.id)
       
        .order("order_count", { ascending: false })
        
        if (error) {
        console.error("Error fetching posters:", error);
        return;
      }
      setPosters(data || []);
    };
    fetchData();
  }, [slug]);
  if(!posters.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
      
    )
  }
  return (
    <div className="flex flex-col gap-3 min-h-[80vh]">
      <div className="flex gap-2 items-center md:text-lg text-sm font-semibold text-gray-700">
        <Link href={`/`} className="">
          Home /
        </Link>
        <span className=" capitalize"> {slug}</span>
      </div>
      <div className="flex items-center justify-center">
        <Image
          src={"/Collection.png"}
          alt={""}
          height={1080}
          width={1024}
          className="md:h-[94px] md:w-[330px] h-[60px] w-[200px]"
        />
      </div>
      <div className="flex md:text-md text-sm  items-center justify-between">
        {/* filter */}

        <div>
            Filter : size

        </div>

        {/* sortby */}
        <div className="flex md:gap-3 gap-2">
            <span>
                SortBy : BestSelling
            </span>
            <span>({posters.length} products)</span>
        </div>


      </div>
      {/* products */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 max-w-screen-xl md:mx-auto md:gap-4 gap-2 md:p-4 p-2">
      {posters.map((item,id)=>(
       
       <div  key={id} className="flex flex-col items-center justify-between md:p-4 p-2 gap-2  mb-2">
           <Link href={`/poster/${item.slug}`} className="flex flex-col items-center justify-between md:p-4 p-2 gap-2  mb-2">
           <div className="relative w-[130px] h-[160px] md:w-[208px] md:h-[260px] rounded-3xl overflow-hidden">
             <Image
               src={item.image_url}
               alt={item.name}
               fill
               className="object-cover"
             />
           </div>
           <h2 className="md:text-sm text-[0.6rem] text-center pl-2 ">{item.name}</h2>
        
           
         </Link>
      <div className='flex flex-col gap-2 w-full'>
      <h3 className="font-semibold md:text-lg mx-auto text-xs px-3">From Rs.{item.variants[0].discounted_price}</h3>
      <SizeDropdown options={item.variants.map((v: { size: string; discounted_price: number; })=>({
         size: v.size,
         price: v.discounted_price
        }))} />
        <button className='w-full bg-black text-white px-4 py-1 md:py-2 md:text-md text-xs  rounded-lg cursor-pointer'>Add to cart</button>
      
      </div>
       </div>
     ))}
      </div>
    </div>
  );
}

export default CollectionPageClientSide;
