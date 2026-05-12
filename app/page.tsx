'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'

interface Photo {
  id: string;
  handle: string;
  caption?: string;
  r2_key: string;
  imageUrl: string;
}

interface Artist {
  id: string;
  name: string;
  genre?: string;
  bio?: string;
  year: number;
}

interface NewsPost {
  id: string;
  title: string;
  body: string;
  published_at: string;
}

function useCountdown(target: Date) {
  const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return zero;
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(zero);
  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return t;
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [latestNews, setLatestNews] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const countdown = useCountdown(new Date('2026-07-25T12:00:00'));

  useEffect(() => {
    // Fetch latest photos
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => setPhotos((data.photos || []).slice(0, 8)))
      .catch(err => console.error('Error fetching photos:', err));

    // Fetch artists
    fetch('/api/artists')
      .then(r => r.json())
      .then(data => {
        const currentYear = (data.artists || []).filter((a: Artist) => a.year === 2026).slice(0, 3);
        setArtists(currentYear);
      })
      .catch(err => console.error('Error fetching artists:', err));

    // Fetch latest news
    fetch('/api/news')
      .then(r => r.json())
      .then(data => {
        const posts = data.news || [];
        setLatestNews(posts.length > 0 ? posts[0] : null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="grain relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4">
        {/* Glow orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-up">
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-6 opacity-80">
            Griffin St · Oceanside, CA
          </p>
          <h1 className="text-7xl md:text-[10rem] font-display text-primary leading-none mb-2 drop-shadow-lg">
            DAVA<br className="md:hidden"/>PALOOZA
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-10 font-mono">
            #SouthOBlockParty · July 25, 2026
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-4 md:gap-8 mb-10">
            {[
              { label: 'Days',    val: countdown.days },
              { label: 'Hours',   val: countdown.hours },
              { label: 'Minutes', val: countdown.minutes },
              { label: 'Seconds', val: countdown.seconds },
            ].map(({ label, val }) => (
              <div key={label} className="flex flex-col items-center bg-surface/60 border border-border backdrop-blur-sm rounded-xl px-4 md:px-6 py-3 md:py-4 min-w-[64px]">
                <span className="text-3xl md:text-5xl font-display text-primary leading-none tabular-nums">
                  {String(val).padStart(2, '0')}
                </span>
                <span className="text-muted text-xs font-mono mt-1 tracking-widest uppercase">{label}</span>
              </div>
            ))}
          </div>

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
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-surface animate-pulse" />
              ))
            ) : photos.length === 0 ? (
              <Card className="col-span-2 md:col-span-4 p-8 text-center">
                <p className="text-muted">No photos yet. Be the first to share your Davapalooza moments!</p>
              </Card>
            ) : (
              photos.map((photo) => (
                <Link key={photo.id} href="/gallery">
                  <div className="aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={photo.imageUrl} 
                      alt={photo.caption || `Photo by @${photo.handle}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link href="/gallery">
              <Button variant="secondary">View Full Gallery</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Artist Teaser */}
      <section className="stripe-bg py-16 px-4 bg-surface animate-fade-up animate-delay-200">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="The Lineup" 
            subtitle="Artists bringing the heat"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-surface border border-border p-6 space-y-3 animate-pulse">
                  <div className="h-6 bg-border rounded w-2/3" />
                  <div className="h-3 bg-border rounded w-1/3" />
                  <div className="h-3 bg-border rounded w-full" />
                  <div className="h-3 bg-border rounded w-4/5" />
                </div>
              ))
            ) : artists.length === 0 ? (
              <Card className="col-span-1 md:col-span-3 p-8 text-center">
                <p className="text-muted">Artist lineup coming soon!</p>
              </Card>
            ) : (
              artists.map((artist) => (
                <Card key={artist.id} className="p-6">
                  <h3 className="text-2xl font-display text-primary mb-2">
                    {artist.name}
                  </h3>
                  {artist.genre && (
                    <p className="text-muted text-sm font-mono mb-3">
                      {artist.genre}
                    </p>
                  )}
                  {artist.bio && (
                    <p className="text-text text-sm line-clamp-3">
                      {artist.bio}
                    </p>
                  )}
                </Card>
              ))
            )}
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
          {loading ? (
            <div className="mt-8 rounded-xl bg-surface border border-border p-8 space-y-4 animate-pulse">
              <div className="h-4 bg-border rounded w-1/4" />
              <div className="h-6 bg-border rounded w-3/4" />
              <div className="h-3 bg-border rounded w-full" />
              <div className="h-3 bg-border rounded w-5/6" />
            </div>
          ) : !latestNews ? (
            <Card className="p-8 mt-8 text-center">
              <p className="text-muted">Check back soon for news and updates!</p>
            </Card>
          ) : (
            <Card className="p-8 mt-8">
              <p className="text-muted text-sm font-mono mb-2">
                {new Date(latestNews.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <h3 className="text-3xl font-display text-primary mb-4">
                {latestNews.title}
              </h3>
              <p className="text-text text-lg leading-relaxed line-clamp-4 whitespace-pre-wrap">
                {latestNews.body}
              </p>
              <div className="mt-6">
                <Link href="/news">
                  <Button variant="secondary">Read More News</Button>
                </Link>
              </div>
            </Card>
          )}
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
