import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="font-mono text-primary text-sm tracking-widest uppercase mb-4">404</p>
        <h1 className="text-7xl md:text-9xl font-display text-text mb-4 leading-none">
          Lost in<br />South O
        </h1>
        <p className="text-muted text-lg mb-10">
          This page packed up and left. Maybe it&apos;s at the block party.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">Head Home</Button>
        </Link>
      </div>
    </div>
  )
}
