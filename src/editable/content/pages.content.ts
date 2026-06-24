import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Media distributions, newsroom updates, and public visibility',
      description: 'Explore media distributions, press-ready stories, newsroom updates, and public-facing coverage through a premium editorial experience.',
      openGraphTitle: 'Media distributions, newsroom updates, and public visibility',
      openGraphDescription: 'Discover polished media stories, archive content, and distribution-ready updates in one refined publishing experience.',
      keywords: ['media distribution', 'newsroom updates', 'press stories', 'public visibility'],
    },
    hero: {
      badge: '',
      title: ['Media visibility made', 'clear and publish-ready.'],
      description: 'Turn announcements, company updates, and press-ready stories into a polished archive built for discovery, distribution, and ongoing visibility.',
      primaryCta: { label: 'Browse distributions', href: '/mediaDistribution' },
      secondaryCta: { label: 'Search the archive', href: '/search' },
      searchPlaceholder: 'Search distributions, topics, and updates',
      focusLabel: 'Focus',
      featureCardBadge: 'featured distribution',
      featureCardTitle: 'Lead stories can anchor the homepage with image-first authority.',
      featureCardDescription: 'Fresh posts, related updates, and category-led sections remain powered by the existing feed.',
    },
    intro: {
      badge: 'Built for teams',
      title: 'A polished home for public updates, coverage, and media-ready storytelling.',
      paragraphs: [
        'This site brings together long-form updates, distributions, visuals, and supporting resources in one consistent publishing experience.',
        'The layout is designed to help visitors move from a lead announcement into supporting stories, searchable sections, and related archive content without friction.',
        'It keeps the experience clear on mobile and desktop while preserving the full flexibility of the existing post system.',
      ],
      sideBadge: 'Why it works',
      sidePoints: [
        'Strong editorial hero with clear calls to action.',
        'Search-friendly archive flow for ongoing discovery.',
        'Varied card types that keep scanning visually engaging.',
        'Polished detail pages for announcements, articles, and media assets.',
      ],
      primaryLink: { label: 'Open archive', href: '/mediaDistribution' },
      secondaryLink: { label: 'Contact us', href: '/contact' },
    },
    cta: {
      badge: 'Ready to publish',
      title: 'Keep every media update discoverable long after it goes live.',
      description: 'Move from headline moments to searchable coverage with a cleaner distribution experience that supports ongoing visibility.',
      primaryCta: { label: 'Browse Latest', href: '/mediaDistribution' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About',
    title: 'A calmer, more premium way to present media-facing content.',
    description: `${slot4BrandConfig.siteName} is designed for announcements, updates, and supporting editorial content that should feel credible and easy to explore.`,
    paragraphs: [
      'Instead of fragmenting distribution content across disconnected screens, the platform keeps related stories, assets, and archive surfaces aligned.',
      'Visitors can move from a lead story to related updates, resources, and supporting content without losing context.',
    ],
    values: [
      {
        title: 'Clarity first',
        description: 'The design emphasizes readable hierarchy, restrained motion, and polished spacing so updates feel easy to trust.',
      },
      {
        title: 'Connected discovery',
        description: 'Articles, distributions, visuals, profiles, and resources stay linked through a consistent browsing system.',
      },
      {
        title: 'Built for public-facing content',
        description: 'The site keeps distribution content clean, searchable, and adaptable across multiple content types.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Share a media inquiry, publishing request, or support question.',
    description: 'Use this page to route distribution questions, archive requests, content updates, or general site inquiries through one polished contact flow.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search stories, media distributions, visuals, resources, and archive content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find stories, distributions, and supporting resources faster.',
      description: 'Use keywords, categories, and content types to discover posts across every active section of the site.',
      placeholder: 'Search by title, topic, category, or keyword',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
