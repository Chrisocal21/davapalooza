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

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [latestNews, setLatestNews] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

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
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-surface to-bg px-4">
        <div className="text-center max-w-4xl mx-auto animate-fade-up">
          <h1 className="text-7xl md:text-9xl font-display text-primary mb-4">
            DAVAPALOOZA
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-2 font-mono">
            #SouthOBlockParty
          </p>
          <p className="text-lg md:text-xl text-text mb-2">
            July 25th, 2026
          </p>
          <p className="text-lg md:text-xl text-text mb-8">
            Griffin ST. · Oceanside, California
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
            {photos.length === 0 ? (
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
      <section className="py-16 px-4 bg-surface animate-fade-up animate-delay-200">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="The Lineup" 
            subtitle="Artists bringing the heat"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {artists.length === 0 ? (
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
            <Card className="p-8 mt-8 text-center">
              <p className="text-muted">Loading...</p>
            </Card>
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
