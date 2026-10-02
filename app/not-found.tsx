import Button from '@/components/ui/Button'
import SunMark from '@/components/ui/SunMark'

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[78vh] items-center overflow-hidden bg-sky text-ink">
      <SunMark className="pointer-events-none absolute -bottom-40 -right-20 -z-10 h-[26rem] w-[26rem] animate-sun-rise sm:-bottom-52 sm:right-[6%] sm:h-[36rem] sm:w-[36rem]" />
      <div className="halftone fade-to-tr pointer-events-none absolute bottom-0 left-0 -z-10 h-64 w-[32rem] max-w-[75%] text-ink/25" />

      <div className="shell py-20">
        <p className="eyebrow mb-4 animate-rise">404</p>
        <h1 className="animate-rise font-display text-display-xl animate-delay-100">
          Lost in
          <br />
          South O
        </h1>
        <p className="mt-5 max-w-md animate-rise text-xl leading-snug animate-delay-200 sm:text-2xl">
          This page packed up and left. Maybe it&apos;s at the block party.
        </p>
        <div className="mt-9 animate-rise animate-delay-300">
          <Button href="/" variant="primary" size="lg">
            Head Home
          </Button>
        </div>
      </div>
    </div>
  )
}
