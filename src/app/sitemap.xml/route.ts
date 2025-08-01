// app/sitemap.xml/route.ts
import { createClient } from '@/lib/supabaseServerClient'


export async function GET() {
  const supabase = await createClient()

  // Fetch category slugs for /collections/[slug]
  const { data: categories = [] } = await supabase.from('category').select('slug')

  // Fetch poster slugs for /poster/[slug]
  const { data: posters = [] } = await supabase.from('posters').select('slug')

  const baseUrl = 'https://posterboys.store' // replace with your domain if different

  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/collections`,
    ...(categories || []).map(c => `${baseUrl}/collections/${c.slug}`),
    ...(posters || []).map(p => `${baseUrl}/poster/${p.slug}`)
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `
  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
