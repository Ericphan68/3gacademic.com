import type { MetadataRoute } from 'next';

import { SITE } from '@/constants/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Khu vực cá nhân không cần được index.
        disallow: ['/dashboard', '/coach-portal', '/login', '/register', '/forgot-password'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
