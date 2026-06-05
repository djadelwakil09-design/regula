import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://regula.app'

  const regulations = await db.regulation.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  }).catch(() => [])

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/sign-in`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/sign-up`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  const regulationPages = regulations.map(reg => ({
    url: `${baseUrl}/regulations/${reg.slug}`,
    lastModified: reg.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...regulationPages]
}
