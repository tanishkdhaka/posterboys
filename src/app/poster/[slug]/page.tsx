import { createClient } from '@/lib/supabaseServerClient'
import { Metadata } from 'next'
import React from 'react'
import PosterClientSide from '../PosterClientSide'



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()
  
    const { data: posters, error } = await supabase
      .from('posters')
      .select('*')
      .eq('slug', slug)
      .single()
  
    if (!posters || error) return {}
  
    return {
      title: `${posters.name} Poster | PosterBoys`,
      description: `Shop the best ${posters.name.toLowerCase()} posters at affordable prices.`,
      openGraph: {
        title: `${posters.name} Poster | PosterBoys`,
        description: `Shop the best ${posters.name.toLowerCase()} posters at affordable prices.`,
        images: [{ url: posters.image_url }],
        url: `https://posterboys.store/poster/${slug}`,
        siteName: 'PosterBoys',
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${posters.name} Poster | PosterBoys`,
        description: `Shop the best ${posters.name.toLowerCase()} posters at affordable prices.`,
        images: [posters.image_url],
      },
      alternates: {
        canonical: `https://posterboys.store/poster/${slug}`,
      },
    }
  }
  

  export default async function PosterServerSide({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
  return (
    <div className='p-4 bg-[#E7F0FE]'>
        <PosterClientSide slug={slug} />
    </div>
  )
}

