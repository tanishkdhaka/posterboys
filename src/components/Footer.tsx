"use client"
import React from 'react'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: '400',
})
function Footer() {
    const [email,setEmail] = React.useState("");
    const submitEmail = async () => {
        if(!email){
            toast.error("Please enter a valid email")
            return;
        }
        const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  toast.error("Please enter a valid email address");
  return;
}
        const {error} = await supabase
        .from("subscription_mail")
        .insert({
            email:email
        })
        if(error ){
            toast.error("Something went wrong. Please try again later")
            return;
        }
      
            toast.success("Subscribed successfully")
        

        setEmail("");
        
    }
  return (

        <footer className={montserrat.className+'w-full pb-5 bg-[black] text-white flex flex-col gap-2'}>

           <div className='flex flex-col md:flex-row justify-between items-start px-4   gap-4 md:p-10 py-6'>
            <section  className='flex flex-col gap-2'>
                <h2 className=' font-semibold text-sm md:text-2xl pb-2'>Quick Links</h2>
               <div className='flex  md:gap-10 gap-4  text-[0.6rem]  md:text-sm font-semibold'>
               <div className='flex flex-col gap-1 '>
               <Link href={'/about-us'} className=' hover:underline'>About Us</Link>
                <Link href={'/contact'} className=' hover:underline'>Contact Us</Link>
                <Link href={'/terms-conditions'} className='hover:underline'>Terms and Conditions</Link>
               </div>
               <div className='flex flex-col gap-1'>
               <Link href={'/cancellation-policy'} className=' hover:underline'>Cancellation and shipping policy</Link>
                <Link href={'/faq'} className=' hover:underline'>FAQ&#39;s</Link>
                <Link href={'/privacy-policy'} className=' hover:underline'>Privacy Policy</Link>
               </div>
               </div>
           
            </section>

            <section className='flex flex-col gap-3 '>
                <h3 className='text-sm md:text-xl font-semibold text-[#d34a4a]'>SUBSCRIBE TO OUR EMAIL</h3>
             <div className='flex gap-3'>   <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email}  placeholder='posterboys@gmail.com' className='border-white border outline-none focus:outline-none rounded-xl px-4 py-2 text-xs md:text-lg w-full'/> <button onClick={()=>submitEmail()} className='cursor-pointer'><ArrowRight className='flex w-10 h-10 rounded-full bg-white' color='black'/></button></div>
            </section>
           </div>
        <div className='bg-[#df4242]  flex flex-col items-center justify-center gap-2 p-2 '>
            <p className='max-w-5xl text-center text-[0.5rem] md:text-sm text-white'>All artwork posted on this website is intended as fan art and is not purported to be official merchandise unless indicated otherwise. If you have any issues regarding the artwork, please write to us at support@posterboys.store</p>
           <p className='text-center text-[0.5rem] md:text-sm text-white'>© 2025 POSTER BOYS</p>
        </div>
        </footer>
  )
}

export default Footer