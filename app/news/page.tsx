'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'

interface NewsPost {
  id: string;
  title: string;
  body: string;
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
                <p className="text-text text-lg leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
