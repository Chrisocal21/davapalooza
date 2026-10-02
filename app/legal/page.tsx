import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import { SOCIALS } from '@/lib/site'

const LAST_UPDATED = 'July 2026'

// Section titles, in order. The contents list and the headings both read from here.
const SECTIONS = [
  { id: 'liability', title: 'No liability for personal injury or property loss' },
  { id: 'risk', title: 'Assumption of risk' },
  { id: 'photography', title: 'Photography, video, and likeness' },
  { id: 'submissions', title: 'Photo submissions' },
  { id: 'participation', title: 'Vendor and performer participation' },
  { id: 'changes', title: 'Event changes and cancellation' },
  { id: 'conduct', title: 'Code of conduct' },
  { id: 'website', title: 'Website use' },
  { id: 'contact', title: 'Contact' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

export default function LegalPage() {
  return (
    <>
      {/* Header */}
      <PageHeader
        size="xl"
        eyebrow={`Last updated ${LAST_UPDATED}`}
        title="Legal"
        lede="Liability disclaimer, terms, and rights"
      />

      {/* Content */}
      <div className="bg-cream py-12 sm:py-16 lg:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
          {/* Contents */}
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="eyebrow mb-3 text-muted">On this page</h2>
            <ol className="border-t-2 border-ink">
              {SECTIONS.map(({ id, title }, i) => (
                <li key={id} className="border-b border-ink/15">
                  <a
                    href={`#${id}`}
                    className="flex gap-3 py-2.5 text-[0.95rem] leading-snug text-ink transition-colors hover:text-red-ink"
                  >
                    <span className="w-5 shrink-0 font-mono text-xs leading-[1.6] text-muted">{i + 1}</span>
                    {title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-[65ch] text-[1.0625rem] leading-[1.7] text-ink">
            {/* Intro */}
            <p className="border-l-4 border-sun-yellow pl-5 text-lg leading-relaxed text-ink/85">
              South O Block Party / Davapalooza is a free community event organized by
              private individuals. By attending, performing, vending, submitting content,
              or otherwise participating in the event or this website, you agree to the
              terms below.
            </p>

            <Section id="liability">
              <p>
                Attendance at South O Block Party is voluntary and entirely at your own
                risk. The organizers, volunteers, property owners, and any associated
                individuals or entities are not responsible for any personal injury,
                illness, death, theft, property damage, or loss of any kind that occurs
                before, during, or after the event, whether on or off the event grounds.
              </p>
              <p>
                This includes but is not limited to injuries caused by crowds, music,
                equipment, vehicles, weather, third parties, or any other condition present
                at the event.
              </p>
            </Section>

            <Section id="risk">
              <p>
                By attending you acknowledge that outdoor public events carry inherent
                risks. You assume full responsibility for your own safety and the safety of
                any minors in your care. You agree not to hold the event organizers liable
                for any incident arising from those risks.
              </p>
            </Section>

            <Section id="photography">
              <p>
                South O Block Party is a public event. By attending you acknowledge that
                photography and video recording will take place throughout the event for
                documentation, promotion, and community purposes. Your presence constitutes
                consent to be photographed or recorded in public areas of the event.
              </p>
              <p>
                The organizers reserve the right to use event photography and video in
                promotional materials, on this website, and on social media without
                compensation or prior notice.
              </p>
            </Section>

            <Section id="submissions">
              <p>
                By submitting photos through this website you confirm that you took the
                photos yourself or have full rights to submit them, that no individuals
                depicted have revoked their consent to appear in public event photography,
                and that the content does not violate any law or third-party rights.
              </p>
              <p>
                You grant the organizers a non-exclusive, royalty-free license to display,
                share, and promote submitted photos in connection with the event. You retain
                ownership of your original images. Submitted photos are subject to
                moderation and may be declined or removed without notice.
              </p>
            </Section>

            <Section id="participation">
              <p>
                Vendors and performers participate at their own risk. The organizers are
                not responsible for any loss of income, damage to equipment or property,
                or any other loss arising from participation. No guarantee of attendance,
                revenue, or tip income is made or implied.
              </p>
              <p>
                Vendor booths operate on a tips-only basis. No sales commissions or booth
                fees are collected by the organizers. Vendors are responsible for their
                own compliance with applicable local ordinances, health codes, and any
                other regulations.
              </p>
            </Section>

            <Section id="changes">
              <p>
                The organizers reserve the right to modify, postpone, or cancel the event
                at any time without prior notice, including due to weather, permit issues,
                safety concerns, or any other reason. No compensation will be owed to
                attendees, vendors, or performers in the event of a change or cancellation.
              </p>
            </Section>

            <Section id="conduct">
              <p>
                All attendees, vendors, and performers are expected to treat others with
                respect. The organizers reserve the right to remove any individual from
                the event for any reason, including disruptive, threatening, or harmful
                behavior, without warning and without recourse.
              </p>
            </Section>

            <Section id="website">
              <p>
                This website is provided as-is. The organizers make no guarantees about
                the accuracy, availability, or completeness of any information on this
                site. Use of the site is at your own risk. We are not liable for any
                damages arising from your use of this site or reliance on any information
                found here.
              </p>
            </Section>

            <Section id="contact">
              <p>
                For questions about these terms, reach out via{' '}
                <a
                  href={SOCIALS.instagram || 'https://www.instagram.com/southoblockparty'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link font-semibold"
                >
                  Instagram
                </a>
                .
              </p>
            </Section>

            <p className="mt-12 border-t-2 border-ink pt-6 font-mono text-sm leading-relaxed text-muted">
              These terms are provided for general informational purposes and do not
              constitute legal advice. If you have specific legal concerns, consult a
              licensed attorney.
            </p>

            <p className="mt-8">
              <Link href="/about" className="eyebrow inline-flex items-center gap-2 font-bold text-ink">
                <Icon name="arrow-left" size={15} />
                <span className="link">Back to About</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function Section({ id, children }: { id: SectionId; children: React.ReactNode }) {
  const index = SECTIONS.findIndex(s => s.id === id)
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-12 space-y-4">
      <h2 id={`${id}-title`} className="font-display text-display-sm text-ink">
        <span className="mr-3 text-sun-red">{index + 1}.</span>
        {SECTIONS[index].title}
      </h2>
      {children}
    </section>
  )
}
