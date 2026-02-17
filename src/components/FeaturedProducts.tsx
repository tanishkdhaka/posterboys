import Image from 'next/image'
import React, { useState } from 'react'
import SizeDropdown from './dropdown'
import Link from 'next/link'
import Products from '@/data/Products'
import { useCartStore } from '@/store/navbarStore'

export default function FeaturedProducts(
  {product,section_image}:{product: Products[]; section_image: string}
) {
  const handleAddToBag = useCartStore((state)=>state.addItem)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({})

  return (
    <section className="pt-5 flex flex-col">
        <div className="flex items-center justify-center">
          <Image
            src={section_image}
            alt={""}
            height={1080}
            width={1024}
            className="md:h-21.25 md:w-87.5 h-13.75 w-60"
          />
        </div>
        <div className="flex overflow-x-scroll scrollbar-none ">
          {product.map((item,id)=>{
            const selectedIndex = selectedVariants[item.id]??0
            return(
       
            <div  key={id} className="flex flex-col items-center justify-between md:p-4 p-2 gap-2  mb-2">
                <Link href={`/poster/${item.slug}`} className="flex flex-col items-center justify-between md:p-4 p-2 gap-2  mb-2">
                <div className="relative w-25 h-30 md:w-52 md:h-65 rounded-3xl overflow-hidden">
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
           <SizeDropdown options={item.variants.map((v)=>({
              size: v.size,
              price: v.discounted_price
             }))} 
             selectedIndex={selectedIndex}
        onChange={(index) =>
          setSelectedVariants((prev) => ({
            ...prev,
            [item.id]: index,
          }))
        }
             
             />
             <button onClick={()=>handleAddToBag(item.id,item.variants[selectedIndex].size,1)} className='w-full bg-black text-white px-4 py-1 md:py-2 md:text-md text-xs  rounded-lg cursor-pointer'>Add to cart</button>
           
           </div>
            </div>
          )})}
        </div>
        <Link className=" bg-black mx-auto flex items-center mt-2.5 justify-center text-white py-2 md:text-2xl rounded-2xl px-4" href={""}>View All</Link> 

      </section>
  )
}

