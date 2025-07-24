import Image from 'next/image'
import React from 'react'
import SizeDropdown from './dropdown'
import Link from 'next/link'
import Products from '@/data/Products'

export default function FeaturedProducts(
  {product,section_image}:{product: Products[]; section_image: string}
) {
  return (
    <section className="pt-5 flex flex-col">
        <div className="flex items-center justify-center">
          <Image
            src={section_image}
            alt={""}
            height={1080}
            width={1024}
            className="md:h-[85px] md:w-[350px] h-[55px] w-[240px]"
          />
        </div>
        <div className="flex overflow-x-scroll scrollbar-none ">
          {product.map((item,id)=>(
       
            <div  key={id} className="flex flex-col items-center justify-between md:p-4 p-2 gap-2  mb-2">
                <Link href={`/poster/${item.slug}`} className="flex flex-col items-center justify-between md:p-4 p-2 gap-2  mb-2">
                <div className="relative w-[100px] h-[120px] md:w-[208px] md:h-[260px] rounded-3xl overflow-hidden">
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
             }))} />
             <button className='w-full bg-black text-white px-4 py-1 md:py-2 md:text-md text-xs  rounded-lg cursor-pointer'>Add to cart</button>
           
           </div>
            </div>
          ))}
        </div>
        <Link className=" bg-black mx-auto flex items-center mt-[10px] justify-center text-white py-2 md:text-2xl rounded-2xl px-4" href={""}>View All</Link> 

      </section>
  )
}

