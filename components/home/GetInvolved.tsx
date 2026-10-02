import Link from 'next/link'
import Icon, { type IconName } from '@/components/ui/Icon'
import SectionHeader from '@/components/ui/SectionHeader'

const WAYS: { href: string; icon: IconName; title: string; body: string; cta: string }[] = [
  {
    href: '/bands',
    icon: 'music',
    title: 'Play the Show',
    body: "Fill out the form and we'll be in touch. All genres welcome.",
    cta: 'Band inquiry',
  },
  {
    href: '/vendors',
    icon: 'tent',
    title: 'Set Up a Booth',
    body: 'Vendors work for tips — no fees, no sales.',
    cta: 'Request a booth',
  },
  {
    href: '/submit',
    icon: 'camera',
    title: 'Submit Your Photos',
    body: 'Share your Davapalooza moments.',
    cta: 'Send them in',
  },
]

export default function GetInvolved() {
  return (
    <section aria-labelledby="involved-title" className="bg-sky py-20 text-ink sm:py-24 lg:py-28">
      <div className="shell">
        <SectionHeader
          id="involved-title"
          align="left"
          size="lg"
          eyebrow="For the neighborhood, by the neighborhood"
          title="Get Involved"
        />

        <ul className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3 md:gap-6">
          {WAYS.map(({ href, icon, title, body, cta }, i) => (
            <li key={href} className="reveal flex">
              <Link
                href={href}
                className="group flex w-full flex-col rounded-md border-2 border-ink bg-cream p-6 shadow-print transition-[transform,box-shadow] duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#272B2C] sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-sun-yellow">
                    <Icon name={icon} size={22} />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-display-sm sm:text-[2.6rem]">{title}</h3>
                <p className="mt-2 flex-1 text-lg leading-snug text-ink/85">{body}</p>
                <span className="mt-6 inline-flex items-center gap-2 border-t-2 border-ink/10 pt-4 text-sm font-bold uppercase tracking-[0.1em] text-red-ink">
                  {cta}
                  <Icon name="arrow-right" size={17} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
