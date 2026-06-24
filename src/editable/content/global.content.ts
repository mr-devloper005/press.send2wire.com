import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Media distribution, coverage, and visibility',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Media distributions for modern outreach teams',
    primaryLinks: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse latest', href: '/mediaDistribution' },
      secondary: { label: 'Reach out', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Premium media distribution and newsroom visibility',
    description: 'A polished publishing surface for announcements, distribution updates, editorial content, and searchable media-ready archives.',
    columns: [
      {
        title: '',
        links: [
          { label: '', href: '/mediaDistribution' },
          { label: '', href: '/article' },
          { label: '', href: '/image' },
          { label: '', href: '/search' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for clear, credible, and discoverable public communications.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
