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
  set_time: string | null;  instagram: string | null;
  tiktok: string | null;
  spotify: string | null;
  website: string | null;
  photoUrl: string | null;  year: number;
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

  // Sort artists by set_time (convert to 24hr for proper sorting)
  const sortByTime = (a: Artist, b: Artist) => {
    if (!a.set_time) return 1;
    if (!b.set_time) return -1;
    // Simple time comparison - assumes format like "7:00pm" or "1:00pm"
    const timeA = a.set_time.toLowerCase();
    const timeB = b.set_time.toLowerCase();
    return timeA.localeCompare(timeB);
  };

  const currentYearArtists = artists
    .filter(a => a.year === 2026)
    .sort(sortByTime);
  const pastYearsArtists = artists
    .filter(a => a.year < 2026)
    .sort(sortByTime);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Artist Lineup" 
          subtitle="The talent bringing Davapalooza to life"
        />

        {/* Lineup Poster */}
        <div className="mt-8 mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/flyers/DAVAPALOOZA26.jpg" 
            alt="Davapalooza 2026 Lineup" 
            className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
          />
        </div>

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
            <div className="space-y-4">
              {currentYearArtists.map((artist, i) => (
                <Card key={artist.id} className="relative overflow-hidden">
                  <div className="flex gap-4 p-5">
                    {/* Small artist photo or placeholder */}
                    {artist.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={artist.photoUrl} alt={artist.name} className="w-20 h-20 rounded-lg object-cover object-top flex-shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-2xl text-border select-none">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                    )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="text-2xl font-display text-primary mb-0.5 leading-tight">
                          {artist.name}
                        </h4>
                        {artist.genre && (
                          <p className="text-secondary text-xs font-mono tracking-widest uppercase mb-2">
                            {artist.genre}
                          </p>
                        )}
                      </div>
                      {/* Set time - prominently displayed */}
                      {artist.set_time && (
                        <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-md flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
                          </svg>
                          <p className="text-primary text-sm font-mono font-semibold">{artist.set_time}</p>
                        </div>
                      )}
                    </div>
                    
                    {artist.bio && (
                      <p className="text-muted text-sm mb-3 leading-relaxed line-clamp-2">
                        {artist.bio}
                      </p>
                    )}

                    {/* Social links */}
                    {(artist.instagram || artist.tiktok || artist.spotify || artist.website) && (
                      <div className="flex flex-wrap gap-2">
                        {artist.instagram && (
                          <a href={`https://instagram.com/${artist.instagram}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-mono text-muted hover:text-primary transition-colors">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            IG
                          </a>
                        )}
                        {artist.tiktok && (
                          <a href={`https://tiktok.com/@${artist.tiktok}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-mono text-muted hover:text-primary transition-colors">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z"/></svg>
                            TikTok
                          </a>
                        )}
                        {artist.spotify && (
                          <a href={artist.spotify} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-mono text-muted hover:text-success transition-colors">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                            Spotify
                          </a>
                        )}
                        {artist.website && (
                          <a href={artist.website} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-mono text-muted hover:text-primary transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                            Web
                          </a>
                        )}
                      </div>
                    )}
                  </div>
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
