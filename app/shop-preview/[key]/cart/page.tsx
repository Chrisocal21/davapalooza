import PageHeader from '@/components/ui/PageHeader'
import CartView from '@/components/shop/CartView'
import { getProducts } from '@/lib/shop/products'

export const dynamic = 'force-dynamic'

export default async function CartPage() {
  const products = await getProducts()
  return (
    <>
      <PageHeader size="lg" eyebrow="Store" title="Your cart" />
      <div className="bg-cream py-12 sm:py-16">
        <div className="shell">
          <CartView products={products} />
        </div>
      </div>
    </>
  )
}
