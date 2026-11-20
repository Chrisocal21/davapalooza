'use client'

import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import { useCart } from './CartProvider'

/** Preview banner + cart link shown across the shop. */
export default function ShopBar() {
  const { count, base } = useCart()
  return (
    <div className="border-b-2 border-ink bg-sun-yellow text-ink">
      <div className="shell flex flex-wrap items-center justify-between gap-3 py-2.5">
        <p className="font-mono text-xs font-bold uppercase tracking-widest">
          Private preview — sample products, not public
        </p>
        <div className="flex items-center gap-5 text-sm font-bold uppercase tracking-[0.1em]">
          <Link href={base} className="hover:underline">Shop</Link>
          <Link href={`${base}/cart`} className="inline-flex items-center gap-2 hover:underline">
            <Icon name="bag" size={18} />
            Cart ({count})
          </Link>
        </div>
      </div>
    </div>
  )
}
