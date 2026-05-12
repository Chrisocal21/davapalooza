'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Artist {
  id: string;
  name: string;
  genre: string | null;
  bio: string | null;
  set_time: string | null;
  year: number;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/artists')
      .then(r => r.json())
      .then(data => {
        setArtists(data.artists || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching artists:', err);
        setLoading(false);
      });
  }, []);

  const currentYearArtists = artists.filter(a => a.year === 2026);
  const pastYearsArtists = artists.filter(a => a.year < 2026);

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
          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted text-lg">Loading...</p>
            </Card>
          ) : currentYearArtists.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted text-lg">Lineup coming soon! Stay tuned for artist announcements.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentYearArtists.map((artist, i) => (
                <Card key={artist.id} className="relative p-6 overflow-hidden">
                  {/* Slot number */}
                  <span className="absolute top-4 right-4 font-display text-5xl text-border select-none leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-2xl font-display text-primary mb-1 pr-10">
                    {artist.name}
                  </h4>
                  {artist.genre && (
                    <p className="text-secondary text-xs font-mono tracking-widest uppercase mb-3">
                      {artist.genre}
                    </p>
                  )}
                  {artist.bio && (
                    <p className="text-muted text-sm mb-4 leading-relaxed">
                      {artist.bio}
                    </p>
                  )}
                  {artist.set_time && (
                    <div className="mt-auto pt-3 border-t border-border flex items-center gap-2">
                      <svg className="w-3 h-3 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
                      </svg>
                      <p className="text-primary text-xs font-mono">{artist.set_time}</p>
                    </div>
                  )}
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
                Past Artists
              </summary>
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastYearsArtists.map((artist) => (
                  <div key={artist.id} className="py-3 border-b border-border last:border-0">
                    <p className="text-text font-medium">{artist.name}</p>
                    <p className="text-muted text-sm font-mono">{artist.genre || 'No genre'} • {artist.year}</p>
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
