import type { MetadataRoute } from 'next';

import { SITE } from '@/constants/site';
import { COACHES } from '@/data/coaches';
import { EVENTS } from '@/data/events';
import { EXPERIENCES } from '@/data/experiences';

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/experience', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/booking', priority: 0.9, changeFrequency: 'daily' },
  { path: '/academy', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/coaches', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/membership', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/vouchers', priority: 0.8, changeFrequency: 'daily' },
  { path: '/events', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/corporate', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/golf-tour', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/food-and-lounge', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.65, changeFrequency: 'monthly' },
  { path: '/partner', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/login', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/register', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE.url}${route.path === '/' ? '' : route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...EXPERIENCES.map((item) => ({
      url: `${SITE.url}/experience/${item.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...COACHES.map((coach) => ({
      url: `${SITE.url}/coaches/${coach.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...EVENTS.map((event) => ({
      url: `${SITE.url}/events/${event.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
