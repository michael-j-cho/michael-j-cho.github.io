import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Michael Cho',
  description:
    'Ph.D. candidate at Georgia Tech building machine learning for wearable cardiomechanical sensing, and Applied Machine Learning Scientist Co-op at WHOOP.',
  href: 'https://michaelcho.info',
  author: 'michael',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 6,
}

// Google Analytics
// Configure via environment variable: PUBLIC_GOOGLE_ANALYTICS_ID
export const ANALYTICS = {
  google: import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID || '',
}

// Umami Analytics
// Configure via environment variable: PUBLIC_UMAMI_WEBSITE_ID
export const UMAMI = {
  websiteId: import.meta.env.PUBLIC_UMAMI_WEBSITE_ID || '',
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'Blog',
  },
  {
    href: '/publications',
    label: 'Publications',
  },
  {
    href: '/news',
    label: 'News',
  },
  {
    href: '/about',
    label: 'About',
  },
  {
    href: '/files/cv.pdf',
    label: 'CV',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://www.linkedin.com/in/michael-j-cho/',
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/michael-j-cho',
    label: 'GitHub',
  },
  {
    href: 'https://scholar.google.com/citations?user=AvatR0UAAAAJ&hl=en',
    label: 'Google Scholar'
  },
  {
    href: '/files/cv.pdf',
    label: 'CV',
  },
  // {
  //   href: 'https://twitter.com/username',
  //   label: 'Twitter',
  // },
  {
    href: 'mailto:mcho314@gatech.edu',
    label: 'Email',
  },
  // {
  //   href: '/rss.xml',
  //   label: 'RSS',
  // },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  CV: 'lucide:file-user',
  LinkedIn: 'lucide:linkedin',
  'Google Scholar': 'academicons:google-scholar',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

// Shared by the homepage and About page so both emit the same Person entity
export const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.title,
  url: SITE.href,
  image: `${SITE.href}/profile.jpg`,
  description: SITE.description,
  jobTitle: 'Applied Machine Learning Scientist Co-op',
  worksFor: { '@type': 'Organization', name: 'WHOOP', url: 'https://www.whoop.com' },
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: 'Georgia Institute of Technology',
    url: 'https://www.gatech.edu',
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Washington Bothell' },
  award: 'NSF Graduate Research Fellowship',
  sameAs: SOCIAL_LINKS.filter((link) => link.href.startsWith('http')).map((link) => link.href),
}
