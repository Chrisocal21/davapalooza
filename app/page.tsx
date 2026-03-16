import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-surface to-bg px-4">
        <div className="text-center max-w-4xl mx-auto animate-fade-up">
          <h1 className="text-7xl md:text-9xl font-display text-primary mb-4">
            DAVAPALOOZA
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-2 font-mono">
            #SouthOBlockParty
          </p>
          <p className="text-lg md:text-xl text-text mb-8">
            Date & Location TBD
          </p>
          <Link href="/submit">
            <Button variant="primary" size="lg">
              Submit Your Photos
            </Button>
          </Link>
        </div>
      </section>

      {/* Latest Photos Teaser */}
      <section className="py-16 px-4 animate-fade-up animate-delay-100">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Latest Photos" 
            subtitle="Community snapshots from the block"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {/* TODO: Fetch latest 8 photos from API */}
            <Card className="col-span-2 md:col-span-4 p-8 text-center">
              <p className="text-muted">No photos yet. Be the first to share your Davapalooza moments!</p>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link href="/gallery">
              <Button variant="secondary">View Full Gallery</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Artist Teaser */}
      <section className="py-16 px-4 bg-surface animate-fade-up animate-delay-200">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="The Lineup" 
            subtitle="Artists bringing the heat"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* TODO: Fetch top 3 artists from API */}
            <Card className="col-span-1 md:col-span-3 p-8 text-center">
              <p className="text-muted">Artist lineup coming soon!</p>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link href="/artists">
              <Button variant="secondary">See All Artists</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 px-4 animate-fade-up animate-delay-300">
        <div className="max-w-4xl mx-auto">
          <SectionHeader 
            title="Latest News" 
            subtitle="What's happening"
          />
          {/* TODO: Fetch latest news post from API */}
          <Card className="p-8 mt-8 text-center">
            <p className="text-muted">Check back soon for news and updates!</p>
          </Card>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-16 px-4 bg-gradient-to-t from-surface to-bg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl font-display text-primary mb-4">
            Support the Block
          </h2>
          <p className="text-lg text-text mb-8">
            Help us make Davapalooza bigger and better every year
          </p>
          <Link href="/donate">
            <Button variant="primary" size="lg">
              Donate Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
