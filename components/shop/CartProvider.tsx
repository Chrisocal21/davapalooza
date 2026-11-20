'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface CartLine {
  slug: string
  size: string // '' when the product has no sizes
  qty: number
}

interface CartCtx {
  /** URL prefix of the shop, e.g. /shop-preview/<key> */
  base: string
  lines: CartLine[]
  count: number
  add: (slug: string, size: string, qty?: number) => void
  setQty: (slug: string, size: string, qty: number) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'sobp-cart-preview'

export function CartProvider({ children, base }: { children: React.ReactNode; base: string }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setLines(JSON.parse(raw))
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(KEY, JSON.stringify(lines))
    } catch {}
  }, [lines, ready])

  const add = useCallback((slug: string, size: string, qty = 1) => {
    setLines(prev => {
      const i = prev.findIndex(l => l.slug === slug && l.size === size)
      if (i === -1) return [...prev, { slug, size, qty }]
      return prev.map((l, j) => (j === i ? { ...l, qty: Math.min(l.qty + qty, 20) } : l))
    })
  }, [])

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setLines(prev =>
      qty <= 0
        ? prev.filter(l => !(l.slug === slug && l.size === size))
        : prev.map(l => (l.slug === slug && l.size === size ? { ...l, qty: Math.min(qty, 20) } : l)),
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])
  const count = lines.reduce((n, l) => n + l.qty, 0)

  return <Ctx.Provider value={{ base, lines, count, add, setQty, clear }}>{children}</Ctx.Provider>
}

export function useCart(): CartCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used inside <CartProvider>')
  return c
}
