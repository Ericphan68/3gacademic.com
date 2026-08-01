import type { Metadata } from 'next';

import { MEDIA } from '@/constants/media';
import { CONTACT, SITE } from '@/constants/site';

/** Tạo metadata cho một trang, kế thừa cấu hình chung của site. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE.url}${path === '/' ? '' : path}`;
  const ogImage = image ?? MEDIA.ogDefault;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Structured data cho trung tâm — dùng ở root layout. */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'SportsActivityLocation'],
    '@id': `${SITE.url}#organization`,
    name: SITE.name,
    alternateName: SITE.shortName,
    description: SITE.description,
    url: SITE.url,
    telephone: CONTACT.hotline,
    email: CONTACT.email,
    image: `${SITE.url}${MEDIA.ogDefault}`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.addressLine,
      addressLocality: CONTACT.district,
      postalCode: CONTACT.postalCode,
      addressCountry: CONTACT.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT.geo.lat,
      longitude: CONTACT.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: CONTACT.openTime,
        closes: CONTACT.closeTime,
      },
    ],
    sameAs: [CONTACT.zalo],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Driving Range', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Putting Green', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Short Game Area', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Golf Academy', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Lounge & F&B', value: true },
    ],
  };
}

/** Structured data cho một sự kiện. */
export function eventJsonLd(event: {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  fee: number;
  slug: string;
  banner: string;
  capacity: number;
  registered: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: `${SITE.url}${event.banner}`,
    url: `${SITE.url}/events/${event.slug}`,
    location: {
      '@type': 'Place',
      name: `${SITE.name} — ${event.location}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACT.addressLine,
        addressLocality: CONTACT.district,
        addressCountry: CONTACT.country,
      },
    },
    organizer: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    offers: {
      '@type': 'Offer',
      price: event.fee,
      priceCurrency: 'VND',
      availability:
        event.registered < event.capacity
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      url: `${SITE.url}/events/${event.slug}`,
    },
  };
}
