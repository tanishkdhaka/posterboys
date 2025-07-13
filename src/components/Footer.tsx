import React from 'react'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: '400',
})
function Footer() {
  return (
        <footer className={montserrat.className+'w-full bg-[black] text-white flex flex-col gap-2'}>

           <div className='flex flex-col md:flex-row justify-between items-start px-4   gap-4 md:p-10 py-6'>
            <section  className='flex flex-col gap-2'>
                <h2 className=' font-semibold text-sm md:text-2xl pb-2'>Quick Links</h2>
               <div className='flex  md:gap-10 gap-4  text-[0.6rem]  md:text-sm font-semibold'>
               <div className='flex flex-col gap-1 '>
               <Link href={'/about'} className=' hover:underline'>About Us</Link>
                <Link href={'/contact'} className=' hover:underline'>Contact Us</Link>
                <Link href={'/privacy'} className='hover:underline'>Terms and Conditions</Link>
               </div>
               <div className='flex flex-col gap-1'>
               <Link href={'/about'} className=' hover:underline'>Cancellation and shipping policy</Link>
                <Link href={'/contact'} className=' hover:underline'>FAQ&#39;s</Link>
                <Link href={'/privacy'} className=' hover:underline'>Privacy Policy</Link>
               </div>
               </div>
           
            </section>

            <section className='flex flex-col gap-3 '>
                <h3 className='text-sm md:text-xl font-semibold text-[#d34a4a]'>SUBSCRIBE TO OUR EMAIL</h3>
                <input type="text"  placeholder='abc@example.com' className='border-white border-1 outline-none focus:outline-none rounded-xl px-4 py-2 text-xs md:text-lg w-full'/>
            </section>
           </div>
        <div className='bg-[#E14E4F]  flex flex-col items-center justify-center gap-2 p-2'>
            <p className='max-w-screen-lg text-center text-[0.5rem] md:text-sm text-white'>All artwork posted on this website is intended as fan art and is not purported to be official merchandise unless indicated otherwise. If you have any issues regarding the artwork, please write to us at support@posterboys.store</p>
           <p className='text-center text-[0.5rem] md:text-sm text-white'>© 2025 POSTER BOYS</p>
        </div>
        </footer>
  )
}

export default Footer