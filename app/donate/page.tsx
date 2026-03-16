import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function DonatePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeader 
          title="Support Davapalooza" 
          subtitle="Help us keep the block party alive"
        />

        <Card className="mt-12 p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-4xl font-display text-primary mb-4">
              Every Dollar Helps
            </h3>
            <p className="text-text text-lg leading-relaxed">
              Davapalooza is a free community event made possible by donations from neighbors like you. 
              Your support helps us pay for stages, sound equipment, artist fees, permits, and all the 
              little things that make this block party special.
            </p>
          </div>

          <div className="border-t border-border pt-8 space-y-6">
            <div className="bg-bg rounded-lg p-6">
              <h4 className="text-xl font-display text-text mb-3">Where Your Money Goes</h4>
              <ul className="space-y-2 text-text">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Sound equipment and stage rentals</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Artist performance fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Event permits and insurance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Safety and security</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Community beautification and cleanup</span>
                </li>
              </ul>
            </div>

            <div className="text-center pt-4">
              <p className="text-muted mb-6 font-mono">
                Donation integration coming soon
              </p>
              <div className="space-y-3">
                <p className="text-text">For now, you can support us directly:</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a 
                    href="https://venmo.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="primary">Donate via Venmo</Button>
                  </a>
                  <a 
                    href="https://cash.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="secondary">Donate via Cash App</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted text-sm">
            Davapalooza is organized by community volunteers. All donations go directly to event costs.
          </p>
        </div>
      </div>
    </div>
  )
}
