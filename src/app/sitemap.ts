import { MetadataRoute } from 'next'

const services = [
  'ac-services',
  'electrical',
  'plumbing',
  'home-renovation',
  'handyman',
  'painting',
  'fit-out',
  'pool-maintenance'
];

const locations = [
  'dubai',
  'abu-dhabi',
  'sharjah',
  'ajman',
  'fujairah',
  'ras-al-khaimah',
  'umm-al-quwain'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quickhireprime.ae';

  const staticPages = [
    '',
    '/about',
    '/services',
    '/contact',
    '/locations',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const servicePages = services.map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const locationPages = locations.map((location) => ({
    url: `${baseUrl}/locations/${location}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...locationPages];
}
