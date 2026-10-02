import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

export default function SupportCta() {
  return (
    <section
      aria-labelledby="support-title"
      className="relative isolate overflow-hidden border-t-2 border-ink bg-sun-yellow py-20 text-ink sm:py-24 lg:py-28"
    >
      <div className="halftone-lg fade-to-l pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/2 text-sun-orange/60" />

      <div className="shell flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow mb-3 text-ink/80">Free to attend · Run by neighbors</p>
          <h2 id="support-title" className="font-display text-display-xl">
            Support the Block
          </h2>
          <p className="mt-4 max-w-xl text-xl leading-snug sm:text-2xl">
            Help us make Davapalooza bigger and better every year
          </p>
        </div>
        <Button href="/donate" size="lg" className="shrink-0 self-start lg:self-auto">
          <Icon name="heart" size={19} className="-mt-0.5" />
          Donate Now
        </Button>
      </div>
    </section>
  )
}
