import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import TornEdge from '@/components/ui/TornEdge'

const LAST_UPDATED = 'July 2026'

export default function LegalPage() {
  return (
    <div className="min-h-screen">

      {/* Header */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Legal"
            subtitle={`Liability disclaimer, terms, and rights — last updated ${LAST_UPDATED}`}
          />
        </div>
      </section>

      <TornEdge fill="#FDF0DA" />

      {/* Content */}
      <section className="bg-surface py-16 px-4">
        <div className="max-w-2xl mx-auto space-y-10 text-text text-[15px] leading-relaxed">

          {/* Intro */}
          <p className="text-muted font-mono text-sm">
            South O Block Party / Davapalooza is a free community event organized by
            private individuals. By attending, performing, vending, submitting content,
            or otherwise participating in the event or this website, you agree to the
            terms below.
          </p>

          <Section title="1. No liability for personal injury or property loss">
            <p>
              Attendance at South O Block Party is voluntary and entirely at your own
              risk. The organizers, volunteers, property owners, and any associated
              individuals or entities are not responsible for any personal injury,
              illness, death, theft, property damage, or loss of any kind that occurs
              before, during, or after the event, whether on or off the event grounds.
            </p>
            <p className="mt-3">
              This includes but is not limited to injuries caused by crowds, music,
              equipment, vehicles, weather, third parties, or any other condition present
              at the event.
            </p>
          </Section>

          <Section title="2. Assumption of risk">
            <p>
              By attending you acknowledge that outdoor public events carry inherent
              risks. You assume full responsibility for your own safety and the safety of
              any minors in your care. You agree not to hold the event organizers liable
              for any incident arising from those risks.
            </p>
          </Section>

          <Section title="3. Photography, video, and likeness">
            <p>
              South O Block Party is a public event. By attending you acknowledge that
              photography and video recording will take place throughout the event for
              documentation, promotion, and community purposes. Your presence constitutes
              consent to be photographed or recorded in public areas of the event.
            </p>
            <p className="mt-3">
              The organizers reserve the right to use event photography and video in
              promotional materials, on this website, and on social media without
              compensation or prior notice.
            </p>
          </Section>

          <Section title="4. Photo submissions">
            <p>
              By submitting photos through this website you confirm that you took the
              photos yourself or have full rights to submit them, that no individuals
              depicted have revoked their consent to appear in public event photography,
              and that the content does not violate any law or third-party rights.
            </p>
            <p className="mt-3">
              You grant the organizers a non-exclusive, royalty-free license to display,
              share, and promote submitted photos in connection with the event. You retain
              ownership of your original images. Submitted photos are subject to
              moderation and may be declined or removed without notice.
            </p>
          </Section>

          <Section title="5. Vendor and performer participation">
            <p>
              Vendors and performers participate at their own risk. The organizers are
              not responsible for any loss of income, damage to equipment or property,
              or any other loss arising from participation. No guarantee of attendance,
              revenue, or tip income is made or implied.
            </p>
            <p className="mt-3">
              Vendor booths operate on a tips-only basis. No sales commissions or booth
              fees are collected by the organizers. Vendors are responsible for their
              own compliance with applicable local ordinances, health codes, and any
              other regulations.
            </p>
          </Section>

          <Section title="6. Event changes and cancellation">
            <p>
              The organizers reserve the right to modify, postpone, or cancel the event
              at any time without prior notice, including due to weather, permit issues,
              safety concerns, or any other reason. No compensation will be owed to
              attendees, vendors, or performers in the event of a change or cancellation.
            </p>
          </Section>

          <Section title="7. Code of conduct">
            <p>
              All attendees, vendors, and performers are expected to treat others with
              respect. The organizers reserve the right to remove any individual from
              the event for any reason, including disruptive, threatening, or harmful
              behavior, without warning and without recourse.
            </p>
          </Section>

          <Section title="8. Website use">
            <p>
              This website is provided as-is. The organizers make no guarantees about
              the accuracy, availability, or completeness of any information on this
              site. Use of the site is at your own risk. We are not liable for any
              damages arising from your use of this site or reliance on any information
              found here.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              For questions about these terms, reach out via{' '}
              <a
                href="https://www.instagram.com/southoblockparty"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Instagram
              </a>
              .
            </p>
          </Section>

          <p className="text-muted text-xs font-mono border-t border-border pt-6">
            These terms are provided for general informational purposes and do not
            constitute legal advice. If you have specific legal concerns, consult a
            licensed attorney.
          </p>

        </div>
      </section>

      <TornEdge fill="#45BEE4" flip />

      <section className="py-10 px-4 text-center">
        <Link href="/about" className="text-muted text-sm font-mono underline hover:text-text">
          ← Back to About
        </Link>
      </section>

    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-2xl text-ink mb-3">{title}</h3>
      {children}
    </div>
  )
}
