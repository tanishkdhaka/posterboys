"use client";

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  created_at: string;
}

export default function CollectionClient() {
  const [category, setCategory] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("category").select("*");
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategory(data);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Poster Categories",
    "description": "Explore unique poster categories from PosterBoys",
    "url": "https://posterboys.store/collection",
    "hasPart": category.map((cat) => ({
      "@type": "Collection",
      "name": cat.name,
      "url": `https://posterboys.store/${cat.slug}`,
      "image": `https://posterboys.store${cat.image_url.startsWith('/') ? cat.image_url : '/' + cat.image_url}`,
    })),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className='bg-[#F5F0FF]'>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className='flex md:ml-10 pt-4 items-center gap-2 font-sans text-xs ml-3 md:text-lg opacity-80'>
        <Link href={"/"}>Home</Link> / <span>Collection</span>
      </div>

      <div className="flex items-center justify-center">
        <Image
          src={"/Collection.png"}
          alt="Collection"
          height={1080}
          width={1024}
          className="md:h-[94px] md:w-[330px] h-[75px] w-[251px]"
          priority
        />
      </div>

      <section className='grid grid-cols-2 md:grid-cols-4 md:gap-4 md:p-4 max-w-screen-xl mx-auto'>
        {category.map((cat, id) => (
          <Link
            href={`/collections/${cat.slug}`}
            key={id}
            className="flex flex-col items-center justify-center md:gap-2 gap-1 md:p-4 p-2 rounded-3xl"
          >
            <div className="relative w-[120px] h-[140px] md:w-[228px] md:h-[280px] rounded-3xl overflow-hidden">
              <Image
                src={cat.image_url}
                alt={cat.name}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className="object-cover"
              />
            </div>
            <h2 className="text-sm md:text-lg pl-2 font-semibold">
              {cat.name}
            </h2>
          </Link>
        ))}
      </section>
    </div>
  );
}
