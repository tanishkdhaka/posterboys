import React from 'react'
import { Monoton} from "next/font/google";
import Link from 'next/link';
import { Menu, Search, ShoppingCart, UserRoundPen } from 'lucide-react';

const monoton = Monoton({
    subsets: ["latin"],
    weight: "400",
  });
  


function Navbar() {
  return (
    <nav className=' w-full bg-white sticky text-black top-0 z-[99999]'>
       
        <div className=' flex items-center justify-between md:p-3 md:px-8 p-2 bg-white shadow-md'>
            <div className={`${monoton.className} text-[#338ED1] md:text-2xl  `}>POSTERBOYS</div>

            <div className='gap-12 md:flex hidden items-center justify-center '>
                <Link href="/" className='text-sm  font-semibold '>Home</Link>
                <Link href="/about" className=' text-sm font-semibold'>Collection</Link>
                <Link href="/about" className=' text-sm font-semibold'>Custom Poster</Link>
                <Link href="/about" className=' text-sm font-semibold'>More</Link>
                <Link href="/about" className=' text-sm font-semibold'>Review</Link>
            </div>

            <div className='flex items-center text-black  gap-3 md:gap-6'>
                <button className=' cursor-pointer'><Search className='h-5 md:h-6' /></button>
                <Link href="/" className=' cursor-pointer hidden md:flex'><UserRoundPen className='h-5 md:h-6' /></Link>
                <Link href="/" className=' cursor-pointer  '><ShoppingCart className='h-5 md:h-6' /></Link>
                <button className='cursor-pointer md:hidden '><Menu className='h-5 md:h-6' /></button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar