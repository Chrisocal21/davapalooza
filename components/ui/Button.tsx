import React from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost' | 'paper' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface StyleProps {
  variant?: Variant
  size?: Size
  /** Set when the button sits on the ink field, so its edge and shadow still read. */
  onDark?: boolean
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = StyleProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof StyleProps> & { href?: undefined }

type ButtonAsLink = StyleProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof StyleProps | 'href'> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

const base =
  'inline-flex items-center justify-center gap-2 text-center font-sans font-bold uppercase leading-none tracking-[0.08em] ' +
  'rounded border-2 select-none cursor-pointer ' +
  'transition-[transform,box-shadow,background-color,color,border-color] duration-150 ease-out ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ' +
  'aria-disabled:opacity-50 aria-disabled:pointer-events-none'

// A filled button is a sticker: ink edge, hard offset shadow, and it presses
// into that shadow when you push it.
const sticker =
  'hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'

const light: Record<Variant, string> = {
  primary:   `bg-sun-red text-white border-ink shadow-print hover:shadow-[6px_6px_0_0_#272B2C] hover:bg-sun-red-deep ${sticker}`,
  secondary: `bg-sun-yellow text-ink border-ink shadow-print hover:shadow-[6px_6px_0_0_#272B2C] hover:bg-[#F6C74D] ${sticker}`,
  danger:    `bg-danger text-white border-ink shadow-print hover:shadow-[6px_6px_0_0_#272B2C] hover:bg-sun-red ${sticker}`,
  ghost:     'bg-transparent text-ink border-ink hover:bg-ink hover:text-cream',
  // Ghost with a cream fill — for an outline button that sits on artwork.
  paper:     'bg-cream text-ink border-ink hover:bg-ink hover:text-cream',
}

const dark: Record<Variant, string> = {
  primary:   `bg-sun-red text-white border-cream shadow-print-cream hover:shadow-[6px_6px_0_0_#FDF0DA] hover:bg-sun-red-deep ${sticker}`,
  secondary: `bg-sun-yellow text-ink border-sun-yellow shadow-[4px_4px_0_0_#D62D38] hover:shadow-[6px_6px_0_0_#D62D38] hover:bg-[#F6C74D] ${sticker}`,
  danger:    `bg-danger text-white border-cream shadow-print-cream hover:shadow-[6px_6px_0_0_#FDF0DA] ${sticker}`,
  ghost:     'bg-transparent text-cream border-cream hover:bg-cream hover:text-ink',
  paper:     'bg-cream text-ink border-cream hover:bg-sun-yellow hover:border-sun-yellow',
}

// League Spartan sits high in its line box, so the top padding is a touch
// larger than the bottom to put the caps on the optical centre.
const sizes: Record<Size, string> = {
  sm: 'min-h-[2.5rem] px-4 pt-[0.2rem] text-[0.8125rem]',
  md: 'min-h-[3rem] px-5 pt-[0.22rem] text-[0.9375rem] sm:px-6',
  lg: 'min-h-[3.5rem] px-5 pt-[0.25rem] text-[0.9375rem] sm:px-8 sm:text-[1.0625rem]',
}

/**
 * Button. Pass `href` and it renders a real link with the same styling —
 * use that instead of wrapping a <button> in a <Link>.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  onDark = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const cls = [
    base,
    (onDark ? dark : light)[variant],
    onDark ? 'focus-visible:outline-sun-yellow' : 'focus-visible:outline-ink',
    sizes[size],
    className,
  ].join(' ')

  if (props.href !== undefined) {
    const { href, ...rest } = props
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      const external = href.startsWith('http')
      return (
        <a
          href={href}
          className={cls}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...rest}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
