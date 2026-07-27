'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import ShareButton from '@/components/ui/ShareButton'
import { getPublicUrl } from '@/lib/r2'

interface NewsPost {
  id: string;
  title: string;
  body: string;
  photo_r2_key: string | null;
  published_at: string;
}

export default function NewsPage() {
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => {
        setNewsPosts(data.news || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader 
          title="News & Updates" 
          subtitle="Stay in the loop"
        />

        <div className="mt-12 space-y-6">
          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted text-lg">Loading...</p>
            </Card>
          ) : newsPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted text-lg">No news yet. Check back soon for updates!</p>
            </Card>
          ) : (
            newsPosts.map((post) => (
              <Card key={post.id} className="p-8">
                <p className="text-muted text-sm font-mono mb-2">
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <h2 className="text-3xl font-display text-primary mb-4">
                  {post.title}
                </h2>
                {post.photo_r2_key && (
                  <div className="mb-6 overflow-hidden rounded-lg border border-border">
                    {post.photo_r2_key.toLowerCase().endsWith('.pdf') ? (
                      <iframe
                        src={getPublicUrl(post.photo_r2_key)}
                        className="w-full min-h-[500px] max-h-[70vh] rounded-lg"
                        title={post.title}
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={getPublicUrl(post.photo_r2_key)}
                        alt={post.title}
                        className="w-full max-h-[70vh] object-contain rounded-lg"
                      />
                    )}
                  </div>
                )}
                <p className="text-text text-lg leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Link href={`/news/${post.id}`} className="text-sm font-medium text-primary hover:underline">
                    Read post
                  </Link>
                  <div className="flex items-center">
                    <ShareButton
                      url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://davapalooza.com'}/news/${post.id}`}
                      text={`Check out this Davapalooza update: ${post.title}`}
                      variant="button"
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
