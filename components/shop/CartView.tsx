'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import ProductArt from './ProductArt'
import { useCart } from './CartProvider'
import { formatPrice, type Product } from '@/lib/shop/products'

export default function CartView({ products }: { products: Product[] }) {
  const { lines, setQty, clear, base } = useCart()
  const rows = lines
    .map(l => ({ ...l, product: products.find(p => p.slug === l.slug) }))
    .filter((r): r is typeof r & { product: Product } => !!r.product)
  const total = rows.reduce((n, r) => n + r.product.price * r.qty, 0)

  if (rows.length === 0) {
    return (
      <div className="rounded-md border-2 border-ink bg-paper p-10 text-center shadow-print">
        <p className="text-xl text-ink">Your cart is empty.</p>
        <Button href={base} variant="secondary" className="mt-6">Back to the shop</Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="space-y-4">
        {rows.map(r => (
          <li key={`${r.slug}-${r.size}`} className="flex gap-4 rounded-md border-2 border-ink bg-paper p-4 shadow-print">
            <ProductArt product={r.product} className="w-24 shrink-0 sm:w-28" />
            <div className="flex min-w-0 flex-1 flex-col">
              <Link href={`${base}/${r.slug}`} className="font-display text-2xl leading-none hover:underline">
                {r.product.name}
              </Link>
              {r.size && <p className="mt-1 text-sm text-muted">Size {r.size}</p>}
              <p className="mt-1 font-semibold">{formatPrice(r.product.price)}</p>
              <div className="mt-auto flex items-center gap-3 pt-3">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQty(r.slug, r.size, r.qty - 1)}
                  className="h-9 w-9 rounded border-2 border-ink bg-cream font-bold"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold" aria-live="polite">{r.qty}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQty(r.slug, r.size, r.qty + 1)}
                  className="h-9 w-9 rounded border-2 border-ink bg-cream font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => setQty(r.slug, r.size, 0)}
                  className="ml-auto text-sm font-semibold text-red-ink underline underline-offset-4"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-md border-2 border-ink bg-paper p-6 shadow-print">
        <h2 className="font-display text-3xl">Order summary</h2>
        <dl className="mt-4 space-y-2 text-lg">
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold">{formatPrice(total)}</dd></div>
          <div className="flex justify-between text-muted"><dt>Shipping</dt><dd>Calculated at checkout</dd></div>
        </dl>
        <p className="mt-5 rounded border-2 border-ink bg-sun-yellow px-3 py-2.5 text-center font-bold text-ink">
          All your purchases fund the event.
        </p>
        <Button variant="primary" size="lg" className="mt-4 w-full" disabled>
          Checkout
        </Button>
        <p className="mt-3 text-sm leading-snug text-muted">
          Checkout isn&apos;t connected yet — a payment provider gets wired in here when the merch is ready.
        </p>
        <button onClick={clear} className="mt-4 text-sm font-semibold underline underline-offset-4">
          Clear cart
        </button>
      </aside>
    </div>
  )
}
