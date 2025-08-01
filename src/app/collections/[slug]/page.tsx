
import { createClient } from '@/lib/supabaseServerClient'
// src/app/collections/[slug]/page.tsx
import type { Metadata } from 'next'
import CollectionPageClientSide from './CollectionPageClientSide'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category, error } = await supabase
    .from('category')
    .select('name, image_url')
    .eq('slug', slug)
    .single()

  if (!category || error) return {}

  return {
    title: `${category.name} Posters | PosterBoys`,
    description: `Shop the best ${category.name.toLowerCase()} posters at affordable prices.`,
    openGraph: {
      title: `${category.name} Posters | PosterBoys`,
      description: `Shop the best ${category.name.toLowerCase()} posters at affordable prices.`,
      images: [{ url: category.image_url }],
      url: `https://posterboys.store/collections/${slug}`,
      siteName: 'PosterBoys',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Posters | PosterBoys`,
      description: `Shop the best ${category.name.toLowerCase()} posters at affordable prices.`,
      images: [category.image_url],
    },
    alternates: {
      canonical: `https://posterboys.store/collections/${slug}`,
    },
  }
}


export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params



  return (
    <section className="p-4 bg-[#F5F0FF]">
     <CollectionPageClientSide slug={slug} />
    </section>
  )
}
