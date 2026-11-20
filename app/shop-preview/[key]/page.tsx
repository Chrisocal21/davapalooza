import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import Icon from '@/components/ui/Icon'
import ProductArt from '@/components/shop/ProductArt'
import { shopBase } from '@/lib/shop/enabled'
import { getProducts, formatPrice, isOnSale, saleDateLabel } from '@/lib/shop/products'

export const dynamic = 'force-dynamic'

export default async function ShopPreviewPage({ params }: { params: Promise<{ key: string }> }) {
  const base = shopBase((await params).key)

  const products = await getProducts()
  const categories = Array.from(new Set(products.map(p => p.category)))

  return (
    <>
      <PageHeader size="xl" eyebrow="Merch" title="Store" lede="Gear from the block party." />
      <div className="bg-cream py-14 sm:py-20">
        <div className="shell space-y-14">
          <p className="flex items-center gap-3 rounded-md border-2 border-ink bg-sun-yellow px-5 py-4 text-lg font-bold leading-snug text-ink shadow-print">
            <Icon name="heart" size={22} className="shrink-0 text-red-ink" />
            All your purchases fund the event.
          </p>
          {categories.map(cat => (
            <section key={cat} aria-labelledby={`cat-${cat}`}>
              <h2 id={`cat-${cat}`} className="eyebrow mb-6 text-muted">{cat}</h2>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.filter(p => p.category === cat).map(p => (
                  <li key={p.slug}>
                    <Link
                      href={`${base}/${p.slug}`}
                      className="group block rounded-md border-2 border-ink bg-paper p-4 shadow-print transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#272B2C]"
                    >
                      <ProductArt product={p} />
                      <div className="mt-4 flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-3xl leading-none">{p.name}</h3>
                        <span className="text-lg font-bold">{formatPrice(p.price)}</span>
                      </div>
                      <p className="mt-2 text-base leading-snug text-ink/80">{p.blurb}</p>
                      {!isOnSale(p) && (
                        <p className="mt-3 inline-block rounded border-2 border-ink bg-sun-yellow px-2 py-1 font-mono text-xs font-bold uppercase tracking-widest text-ink">
                          On sale {saleDateLabel(p, 'short')}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
