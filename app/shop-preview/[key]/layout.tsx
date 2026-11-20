import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { shopKeyValid, shopBase } from '@/lib/shop/enabled'
import { CartProvider } from '@/components/shop/CartProvider'
import ShopBar from '@/components/shop/ShopBar'

export const metadata: Metadata = {
  title: 'Store preview',
  robots: { index: false, follow: false, nocache: true },
}

export default async function ShopPreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ key: string }>
}) {
  const { key } = await params
  if (!shopKeyValid(key)) notFound()
  return (
    <CartProvider base={shopBase(key)}>
      <ShopBar />
      {children}
    </CartProvider>
  )
}
