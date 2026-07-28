'use client'

import { useState } from 'react'

interface LogoProps {
  /** Extra classes applied to the img element */
  className?: string
  /** Rendered height in px — width scales proportionally */
  height?: number
}

/**
 * Swappable site logo.
 * Drop /public/logo.png to replace the text fallback automatically.
 * Single reference point — do not recreate logo markup elsewhere.
 */
export default function Logo({ className = '', height = 48 }: LogoProps) {
  const [imgFailed, setImgFailed] = useState(false)

  if (imgFailed) {
    return (
      <span
        className={`font-display text-inherit leading-none ${className}`}
        style={{ fontSize: height * 0.6 }}
      >
        SOUTH O
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="South O Block Party"
      height={height}
      style={{ height, width: 'auto' }}
      className={className}
      onError={() => setImgFailed(true)}
    />
  )
}
