"use client"
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import React from 'react'

function ProfileClientPage(
    {user}:{user:User}
) {
   const router = useRouter();

   async function LogOut(){
    await supabase.auth.signOut();
    router.push("/");
   }    
  return (
    <div className='flex flex-col min-h-screen bg-white'>
        <div className='flex mx-auto max-w-3xl w-full mt-10'>
<div className='flex justify-between w-full items-center'>
<div className='flex gap-6'>
            <Image src={user?.user_metadata?.avatar_url||""} alt={user?.email||""} width={50} height={50} className='rounded-full object-cover'/>
            <div className='flex flex-col gap-1 text-sm'> 
                {user?.email}
                {user?.user_metadata?.full_name && <p>{user.user_metadata.full_name}</p>}
            </div>
        </div>
        <div>
            <button onClick={()=>LogOut()} className='px-4 py-2 bg-black cursor-pointer text-white rounded-lg'>Logout</button>
        </div>
</div>
        </div>
       </div>
  )
}

export default ProfileClientPage