import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

// TODO: Fetch from API
const currentYearArtists: Array<{
  id: number;
  name: string;
  genre: string;
  setTime: string;
  bio: string;
}> = []

const pastYearsArtists: Array<{
  year: number;
  name: string;
  genre: string;
}> = []

export default function ArtistsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Artist Lineup" 
          subtitle="The talent bringing Davapalooza to life"
        />

        {/* Current Year */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-3xl font-display text-text">2026 Lineup</h3>
            <Badge variant="approved">Current</Badge>
          </div>
          {currentYearArtists.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted text-lg">Lineup coming soon! Stay tuned for artist announcements.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentYearArtists.map((artist) => (
                <Card key={artist.id} className="p-6">
                  <div className="w-full aspect-square bg-surface rounded-lg border border-border mb-4 flex items-center justify-center">
                    <span className="text-muted text-sm">Artist Photo</span>
                  </div>
                  <h4 className="text-xl font-display text-primary mb-2">
                    {artist.name}
                  </h4>
                  <p className="text-muted text-sm font-mono mb-2">
                    {artist.genre}
                  </p>
                  <p className="text-text text-sm mb-3">
                    {artist.bio}
                  </p>
                  <div className="border-t border-border pt-3">
                    <p className="text-muted text-xs font-mono">
                      Set Time: {artist.setTime}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Past Years */}
        {pastYearsArtists.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-display text-text mb-6">Past Lineups</h3>
            <details className="bg-surface border border-border rounded-lg">
              <summary className="px-6 py-4 cursor-pointer hover:bg-bg transition-colors font-display text-xl text-text">
                2025 Artists
              </summary>
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastYearsArtists.map((artist, i) => (
                  <div key={i} className="py-3 border-b border-border last:border-0">
                    <p className="text-text font-medium">{artist.name}</p>
                    <p className="text-muted text-sm font-mono">{artist.genre}</p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
