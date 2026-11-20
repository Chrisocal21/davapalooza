import type { Product, ProductShape } from '@/lib/shop/products'
import { StackedLogo, BadgeLogo, Sun } from './MerchLogo'
import CalendarDesign from './CalendarDesign'

/**
 * Placeholder product shot: a real photo of the blank item (free Unsplash
 * mockups, see public/shop/CREDITS.md) with the merch logo blended onto it so
 * the fabric's folds and shadows show through the print. Stickers are a flat
 * sheet of die-cut shapes.
 *
 * When real product photos exist, render them here instead.
 */

type Print =
  | { kind: 'stacked' | 'badge' | 'patch'; x: number; y: number; w: number; rotate?: number; squash?: number }
  | { kind: 'poster'; left: number; top: number; w: number; h: number }

/** Where the design sits on each photo, in % of the square image. x/y are the print's centre. */
const PHOTOS: Record<Exclude<ProductShape, 'stickers' | 'calendar'>, { src: string; alt: string; print: Print }> = {
  tee: { src: '/shop/tee.jpg', alt: 'tee', print: { kind: 'stacked', x: 50, y: 37, w: 26 } },
  hoodie: { src: '/shop/hoodie.jpg', alt: 'hoodie', print: { kind: 'stacked', x: 43.6, y: 47, w: 19 } },
  hat: { src: '/shop/hat.jpg', alt: 'hat', print: { kind: 'patch', x: 47, y: 52, w: 22, rotate: -8, squash: 0.9 } },
  tote: { src: '/shop/tote.jpg', alt: 'tote', print: { kind: 'badge', x: 49.7, y: 60, w: 30 } },
  poster: { src: '/shop/poster.jpg', alt: 'poster', print: { kind: 'poster', left: 0, top: 7.6, w: 65.3, h: 87.6 } },
}

function PrintOverlay({ print, id }: { print: Print; id: string }) {
  const blend = { mixBlendMode: 'multiply' as const }
  if (print.kind === 'poster') {
    return (
      <div className="absolute" style={{ left: `${print.left}%`, top: `${print.top}%`, width: `${print.w}%`, height: `${print.h}%`, ...blend }}>
        <PosterDesign />
      </div>
    )
  }
  const place = {
    left: `${print.x}%`,
    top: `${print.y}%`,
    width: `${print.w}%`,
    transform: `translate(-50%, -50%) rotate(${print.rotate ?? 0}deg) scaleX(${print.squash ?? 1})`,
  }
  if (print.kind === 'patch') {
    // A sewn-on patch sits on top of the fabric rather than soaking into it.
    return (
      <div className="absolute" style={{ ...place, filter: 'drop-shadow(0 1.5px 1.5px rgba(0,0,0,0.35))' }}>
        <svg viewBox="0 0 100 100" className="block w-full" aria-hidden="true">
          <defs>
            <radialGradient id={`${id}-patch`} cx="40%" cy="35%" r="70%">
              <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
              <stop offset="1" stopColor="#000" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="49" fill="#272B2C" />
          <circle cx="50" cy="50" r="45.5" fill="#FDF0DA" />
          <circle cx="50" cy="50" r="47.2" fill="none" stroke="#FDF0DA" strokeWidth="0.9" strokeDasharray="1.6 1.4" />
          <BadgeLogo id={id} cx={50} cy={50} R={41} />
          <circle cx="50" cy="50" r="49" fill={`url(#${id}-patch)`} />
        </svg>
      </div>
    )
  }
  return (
    <div className="absolute" style={{ ...place, opacity: 0.93, ...blend }}>
      {print.kind === 'stacked' ? (
        <svg viewBox="0 0 100 68" className="block w-full" aria-hidden="true">
          <StackedLogo x={0} y={0} w={100} />
        </svg>
      ) : (
        <svg viewBox="0 0 100 100" className="block w-full" aria-hidden="true">
          <BadgeLogo id={id} cx={50} cy={50} R={47} />
        </svg>
      )}
    </div>
  )
}

/** The limited-edition gig poster artwork (3:4). */
function PosterDesign() {
  const display = { fontFamily: 'var(--font-display), Impact, sans-serif' }
  const sans = { fontFamily: 'var(--font-sans), sans-serif', fontWeight: 700 }
  return (
    <svg viewBox="0 0 300 403" preserveAspectRatio="none" className="block h-full w-full" aria-hidden="true">
      <rect width="300" height="403" fill="#F7F0E1" />
      <rect x="16" y="16" width="268" height="230" fill="#45BEE4" />
      <g opacity="0.25">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="16" x2="284" y1={28 + i * 9} y2={28 + i * 9} stroke="#fff" strokeWidth="1.4" />
        ))}
      </g>
      <Sun cx={150} cy={168} r={86} />
      <rect x="16" y="242" width="268" height="7" fill="#272B2C" />
      <text x="150" y="303" textAnchor="middle" fontSize="60" textLength="268" lengthAdjust="spacingAndGlyphs" fill="#272B2C" style={display}>
        DAVAPALOOZA
      </text>
      <text x="150" y="326" textAnchor="middle" fontSize="16" textLength="210" lengthAdjust="spacingAndGlyphs" fill="#B3212C" style={sans}>
        SOUTH O BLOCK PARTY
      </text>
      <text x="150" y="348" textAnchor="middle" fontSize="10.5" textLength="236" lengthAdjust="spacingAndGlyphs" fill="#272B2C" style={sans}>
        LIVE MUSIC · GOOD PEOPLE · STRONG COMMUNITY
      </text>
      <text x="150" y="364" textAnchor="middle" fontSize="9" textLength="160" lengthAdjust="spacingAndGlyphs" fill="#272B2C" opacity="0.8" style={{ fontFamily: 'var(--font-mono), monospace' }}>
        GRIFFIN ST · OCEANSIDE CA
      </text>
      <text x="20" y="390" fontSize="11" fill="#6B6B6B" fontStyle="italic" style={{ fontFamily: 'Georgia, serif' }}>
        No. ___ / ___
      </text>
      <text x="280" y="390" textAnchor="end" fontSize="8" fill="#6B6B6B" style={{ fontFamily: 'var(--font-mono), monospace' }}>
        LIMITED EDITION
      </text>
    </svg>
  )
}

/** Sticker pack: five die-cut stickers, each a different simple shape and design. */
function StickerSheet({ p }: { p: string }) {
  const display = { fontFamily: 'var(--font-display), Impact, sans-serif' }
  const shadow = `url(#${p}-shadow)`
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`${p}-light`} cx="35%" cy="25%" r="85%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </radialGradient>
        <filter id={`${p}-shadow`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>
      <rect width="400" height="400" fill="#E7E2D8" />
      <rect width="400" height="400" fill={`url(#${p}-light)`} />

      {/* 1 · round badge */}
      <circle cx="122" cy="124" r="78" fill="#fff" filter={shadow} />
      <BadgeLogo id={`${p}-badge`} cx={122} cy={124} R={70} fill="#FDF0DA" />

      {/* 2 · sun circle */}
      <circle cx="296" cy="96" r="54" fill="#fff" filter={shadow} />
      <circle cx="296" cy="96" r="47" fill="#45BEE4" />
      <Sun cx={296} cy={100} r={33} />

      {/* 3 · wordmark rounded rectangle */}
      <g transform="rotate(-6 154 251) translate(-56 4)">
        <rect x="96" y="210" width="228" height="74" rx="20" fill="#fff" filter={shadow} />
        <rect x="103" y="217" width="214" height="60" rx="15" fill="#D62D38" />
        <Sun cx={136} cy={248} r={18} />
        <text x="236" y="262" textAnchor="middle" fontSize="38" textLength="140" lengthAdjust="spacingAndGlyphs" fill="#FDF0DA" style={display}>
          DAVAPALOOZA
        </text>
      </g>

      {/* 4 · "SOUTH O" square */}
      <g transform="rotate(6 328 252) translate(28 -66)">
        <rect x="244" y="262" width="112" height="112" rx="12" fill="#fff" filter={shadow} />
        <rect x="251" y="269" width="98" height="98" rx="8" fill="#EFB936" />
        <text x="300" y="316" textAnchor="middle" fontSize="40" textLength="80" lengthAdjust="spacingAndGlyphs" fill="#272B2C" style={display}>
          SOUTH
        </text>
        <circle cx="300" cy="340" r="17" fill="none" stroke="#272B2C" strokeWidth="7" />
      </g>

      {/* 5 · "GOOD PEOPLE" oval */}
      <g transform="rotate(-8 150 336) translate(22 -4)">
        <ellipse cx="128" cy="340" rx="92" ry="38" fill="#fff" filter={shadow} />
        <ellipse cx="128" cy="340" rx="85" ry="31" fill="#272B2C" />
        <text x="128" y="349" textAnchor="middle" fontSize="26" textLength="120" lengthAdjust="spacingAndGlyphs" fill="#EFB936" style={display}>
          GOOD PEOPLE
        </text>
      </g>
    </svg>
  )
}

export default function ProductArt({ product, className = '' }: { product: Product; className?: string }) {
  const { bg, shape } = product.art
  const p = `pa-${product.slug}`
  const photo = shape === 'stickers' || shape === 'calendar' ? null : PHOTOS[shape]
  return (
    <div
      className={`relative aspect-square overflow-hidden border-2 border-ink ${className}`}
      style={{ background: bg }}
      role="img"
      aria-label={`${product.name} (sample mockup)`}
    >
      {photo ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <PrintOverlay print={photo.print} id={p} />
        </>
      ) : shape === 'calendar' ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/shop/calendar.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div
            className="absolute left-1/2 top-1/2"
            style={{ height: '88%', width: '56.9%', transform: 'translate(-50%, -50%) rotate(-1.5deg)', filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.3))' }}
          >
            <CalendarDesign id={p} />
          </div>
        </>
      ) : (
        <StickerSheet p={p} />
      )}
      {product.badge && (
        <span className="absolute left-2 top-2 rounded border-2 border-ink bg-sun-red px-1.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-white">
          {product.badge}
        </span>
      )}
      <span className="absolute right-2 top-2 rounded border-2 border-ink bg-cream px-1.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-ink">
        Sample
      </span>
    </div>
  )
}
