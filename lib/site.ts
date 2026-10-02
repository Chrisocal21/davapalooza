/**
 * Site-wide constants — names, links and socials in one place so the nav,
 * footer and pages can't drift apart.
 */

export const SITE = {
  name: 'South O Block Party',
  event: 'Davapalooza',
  domain: 'southoblockparty.com',
  place: 'Griffin St · Oceanside, CA',
  tagline: ['Live Music', 'Good People', 'Strong Community'],
  hashtags: ['#SouthOBlockParty', '#Davapalooza'],
} as const

/**
 * Social profiles. Leave a value empty and it simply isn't rendered —
 * add the URL here when the account exists and it shows up everywhere.
 */
export const SOCIALS: { instagram: string; tiktok: string } = {
  instagram: 'https://www.instagram.com/southoblockparty',
  tiktok: '',
}

export const NAV_LINKS = [
  { href: '/lineup', label: 'Lineup' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
] as const

/** The one call to action that follows visitors around the site. */
export const NAV_CTA = { href: '/submit', label: 'Submit Photos' } as const
