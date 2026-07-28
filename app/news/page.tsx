'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import { getPublicUrl } from '@/lib/r2'

interface NewsPost {
  id: string;
  title: string;
  body: string;
  photo_r2_key: string | null;
  published_at: string;
}

function excerpt(body: string, len = 120) {
  return body.length <= len ? body : `${body.slice(0, len).trimEnd()}â€¦`
}

export default function NewsPage() {
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => { setNewsPosts(data.news || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="News & Updates"
          subtitle="Stay in the loop"
        />

        <div className="mt-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-64 bg-surface rounded-xl animate-pulse" />)}
            </div>
          ) : newsPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted text-lg">No news yet. Check back soon for updates!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsPosts.map(post => (
                <Link key={post.id} href={`/news/${post.id}`} className="group block">
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Thumbnail */}
                    {post.photo_r2_key && !post.photo_r2_key.toLowerCase().endsWith('.pdf') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getPublicUrl(post.photo_r2_key)}
                        alt={post.title}
                        className="w-full h-48 object-cover border-b border-border"
                      />
                    ) : (
                      <div className="w-full h-48 bg-surface border-b border-border flex items-center justify-center">
                        <span className="font-display text-4xl text-border select-none">NEWS</span>
                      </div>
                    )}

                    <div className="p-5 flex flex-col gap-2">
                      <p className="text-muted text-xs font-mono">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                      <h2 className="font-display text-2xl text-primary leading-tight group-hover:text-primary/80 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted text-sm leading-relaxed">
                        {excerpt(post.body)}
                      </p>
                      <span className="mt-2 text-xs font-mono text-primary group-hover:underline">
                        Read more â†’
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


interface NewsPost {
  id: string;
  title: string;
  body: string;
  photo_r2_key: string | null;
  published_at: string;
}

