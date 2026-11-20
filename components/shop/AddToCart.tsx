'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { useCart } from './CartProvider'

export default function AddToCart({
  slug,
  sizes,
  comingSoon,
}: {
  slug: string
  sizes: string[]
  /** e.g. "On sale January 1, 2027" — shown instead of add-to-cart until then */
  comingSoon?: string
}) {
  const { add } = useCart()
  const [size, setSize] = useState('')
  const [added, setAdded] = useState(false)
  const needsSize = sizes.length > 0 && !size

  if (comingSoon) {
    return (
      <Button variant="secondary" size="lg" className="w-full" disabled>
        <Icon name="calendar" size={18} /> {comingSoon}
      </Button>
    )
  }

  return (
    <div className="space-y-5">
      {sizes.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-[0.95rem] font-semibold text-ink">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map(s => (
              <label key={s} className="cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={s}
                  checked={size === s}
                  onChange={() => setSize(s)}
                  className="peer sr-only"
                />
                <span className="inline-flex min-w-12 items-center justify-center rounded border-2 border-ink bg-paper px-3 py-2 font-bold peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2">
                  {s}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={needsSize}
        onClick={() => {
          add(slug, size)
          setAdded(true)
          setTimeout(() => setAdded(false), 1800)
        }}
      >
        {added ? (
          <>
            <Icon name="check" size={18} /> Added
          </>
        ) : needsSize ? (
          'Pick a size'
        ) : (
          'Add to cart'
        )}
      </Button>
    </div>
  )
}
