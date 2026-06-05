import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://regula.app'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/dashboard', '/api/', '/onboarding', '/admin'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
