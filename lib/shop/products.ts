// SAMPLE catalog — placeholder products so the shop can be designed and tested.
//
// When a provider is chosen (Stripe, Printful, Shopify…), replace getProducts() /
// getProduct() with calls to it and keep the Product shape; the pages don't care
// where products come from.

export type ProductShape = 'tee' | 'hoodie' | 'hat' | 'poster' | 'calendar' | 'stickers' | 'tote';

export interface Product {
  slug: string;
  name: string;
  category: 'Apparel' | 'Prints' | 'Accessories';
  /** Price in cents */
  price: number;
  blurb: string;
  details: string[];
  /** Short tag on the product image, e.g. "Limited edition" */
  badge?: string;
  /** Callout on the product page (fulfillment, exclusivity…) */
  notice?: string;
  /** Empty = one size / no choice needed */
  sizes: string[];
  /** Placeholder art: backdrop colour + which mockup photo to use (swap for real product photos later) */
  art: { bg: string; shape: ProductShape };
  /** First day it can be bought (YYYY-MM-DD, Pacific time). Before then it shows "On sale …". */
  availableFrom?: string;
}

/** Whether the product can be bought yet (see `availableFrom`). */
export function isOnSale(p: Product, now: Date = new Date()): boolean {
  if (!p.availableFrom) return true;
  return now >= new Date(`${p.availableFrom}T00:00:00-08:00`);
}

/** "January 1, 2027" for a product's on-sale date. */
export function saleDateLabel(p: Product, month: 'long' | 'short' = 'long'): string {
  if (!p.availableFrom) return '';
  const [y, m, d] = p.availableFrom.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month,
    day: 'numeric',
    year: month === 'long' ? 'numeric' : undefined,
    timeZone: 'UTC',
  });
}

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

const SAMPLE_PRODUCTS: Product[] = [
  {
    slug: 'sunset-tee',
    name: 'Sunset Logo Tee',
    category: 'Apparel',
    price: 3800,
    blurb: 'The setting sun on soft cotton. The one everybody will be wearing.',
    details: ['100% cotton, unisex fit', 'Screen printed', 'Sample product — final details TBD'],
    sizes: SIZES,
    art: { bg: '#45BEE4', shape: 'tee' },
  },
  {
    slug: 'block-party-hoodie',
    name: 'Block Party Hoodie',
    category: 'Apparel',
    price: 6800,
    blurb: 'For when the ocean air cools off after sunset.',
    details: ['Heavyweight fleece', 'Front pocket', 'Sample product — final details TBD'],
    sizes: SIZES,
    art: { bg: '#F4E2BE', shape: 'hoodie' },
  },
  {
    slug: 'davapalooza-poster',
    name: 'Limited Edition Gig Poster (18×24)',
    category: 'Prints',
    price: 2200,
    blurb:
      "The collector's version of the official lineup poster — the full show artwork with extra detail you won't find on the street copies. Sold only here.",
    badge: 'Limited edition',
    notice:
      'Limited quantity, made when you buy it. Each poster is printed to order, and this edition is not sold anywhere else.',
    details: [
      '18 × 24 in, screen printed',
      'Heavy uncoated stock',
      'The posters around town are a smaller, limited version of the lineup release — this is the full edition',
      'Edition size and print time: TBD (sample product)',
    ],
    sizes: [],
    art: { bg: '#EFB936', shape: 'poster' },
  },
  {
    slug: 'oceanside-calendar',
    name: 'Oceanside 2027 Wall Calendar',
    category: 'Prints',
    price: 2400,
    blurb:
      'Your year in Oceanside — every local event we know of, plus twelve months of the city through the lenses of local photographers.',
    notice: 'Goes on sale January 1 — the day the 2027 event is announced.',
    availableFrom: '2027-01-01',
    details: [
      'Every Oceanside event we know of as of January 1, already on the calendar',
      'Davapalooza marked on its day',
      'A different Oceanside photo each month, shot and credited by local photographers',
      '11 × 17 in when hung, wire bound with a hanging hole',
      'Sample product — events, photos and final details TBD',
    ],
    sizes: [],
    art: { bg: '#B9B9B9', shape: 'calendar' },
  },
  {
    slug: 'sticker-pack',
    name: 'Sticker Pack',
    category: 'Accessories',
    price: 800,
    blurb: 'Five die-cut stickers for laptops, bikes and water bottles.',
    details: ['Pack of 5', 'Weatherproof vinyl', 'Sample product — final details TBD'],
    sizes: [],
    art: { bg: '#363B3D', shape: 'stickers' },
  },
  {
    slug: 'canvas-tote',
    name: 'Canvas Tote',
    category: 'Accessories',
    price: 1800,
    blurb: 'Carry the neighborhood with you.',
    details: ['Heavy canvas', 'Inside pocket', 'Sample product — final details TBD'],
    sizes: [],
    art: { bg: '#E78B39', shape: 'tote' },
  },
  {
    slug: 'trucker-hat',
    name: 'South O Trucker Hat',
    category: 'Apparel',
    price: 2800,
    blurb: 'Foam front, mesh back, the sun up front. Built for the beach.',
    details: ['Foam front panel, breathable mesh back', 'One size, adjustable snapback', 'Sample product — final details TBD'],
    sizes: [],
    art: { bg: '#D62D38', shape: 'hat' },
  },
];

export async function getProducts(): Promise<Product[]> {
  return SAMPLE_PRODUCTS;
}

export async function getProduct(slug: string): Promise<Product | null> {
  return SAMPLE_PRODUCTS.find(p => p.slug === slug) ?? null;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
