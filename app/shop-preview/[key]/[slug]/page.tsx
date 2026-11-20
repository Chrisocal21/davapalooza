import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductArt from '@/components/shop/ProductArt'
import AddToCart from '@/components/shop/AddToCart'
import Icon from '@/components/ui/Icon'
import { shopBase } from '@/lib/shop/enabled'
import { getProduct, formatPrice, isOnSale, saleDateLabel } from '@/lib/shop/products'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ key: string; slug: string }> }) {
  const { key, slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  return (
    <div className="bg-cream py-12 sm:py-16">
      <div className="shell">
        <Link href={shopBase(key)} className="eyebrow text-muted hover:text-ink">← All merch</Link>
        <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
          <ProductArt product={product} className="shadow-print-lg" />
          <div>
            <p className="eyebrow text-muted">{product.category}</p>
            <h1 className="mt-2 font-display text-display-md">{product.name}</h1>
            <p className="mt-3 text-3xl font-bold">{formatPrice(product.price)}</p>
            <p className="mt-5 text-xl leading-snug text-ink">{product.blurb}</p>
            {product.notice && (
              <p className="mt-6 rounded border-2 border-ink bg-sun-yellow px-4 py-3 text-base font-semibold leading-snug text-ink">
                {product.notice}
              </p>
            )}
            <div className="mt-8">
              <AddToCart
                slug={product.slug}
                sizes={product.sizes}
                comingSoon={isOnSale(product) ? undefined : `On sale ${saleDateLabel(product)}`}
              />
              <p className="mt-4 flex items-center justify-center gap-2 text-base font-semibold text-ink">
                <Icon name="heart" size={18} className="text-red-ink" />
                All your purchases fund the event.
              </p>
            </div>
            <ul className="mt-8 space-y-1.5 border-t-2 border-ink/10 pt-6 text-base text-ink/80">
              {product.details.map(d => (
                <li key={d}>• {d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
