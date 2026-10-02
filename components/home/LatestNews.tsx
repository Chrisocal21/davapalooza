'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import SectionHeader from '@/components/ui/SectionHeader'
import { excerpt, formatPostDate, isPdf } from '@/lib/format'

interface NewsPost {
  id: string
  title: string
  body: string
  published_at: string
  photo_r2_key?: string | null
  photoUrl?: string | null
}

export default function LatestNews() {
  // undefined while loading, null when there are no posts
  const [post, setPost] = useState<NewsPost | null | undefined>(undefined)

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => setPost((data.news || [])[0] ?? null))
      .catch(() => setPost(null))
  }, [])

  const image = post && post.photoUrl && !isPdf(post.photo_r2_key) ? post.photoUrl : null

  return (
    <section aria-labelledby="news-title" className="bg-cream py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <SectionHeader
          id="news-title"
          align="left"
          size="lg"
          eyebrow="From the organizers"
          title="Latest News"
          subtitle="What's happening"
          action={
            <Button href="/news" variant="secondary">
              Read More News
              <Icon name="arrow-right" size={18} className="-mt-0.5" />
            </Button>
          }
        />

        <div className="mt-10 sm:mt-12">
          {post === undefined ? (
            <div className="space-y-4 border-t-2 border-ink pt-8" aria-hidden="true">
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton h-14 w-3/4 rounded" />
              <div className="skeleton h-4 w-full max-w-2xl rounded" />
              <div className="skeleton h-4 w-5/6 max-w-2xl rounded" />
            </div>
          ) : post === null ? (
            <p className="border-y-2 border-dashed border-ink/30 py-12 text-center text-xl text-ink">
              Check back soon for news and updates!
            </p>
          ) : (
            <article
              className={`grid gap-8 border-t-2 border-ink pt-8 lg:gap-14 ${image ? 'lg:grid-cols-[1.25fr_1fr]' : ''}`}
            >
              <div className="max-w-3xl">
                <p className="eyebrow text-muted">
                  <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
                </p>
                <h3 className="mt-3 font-display text-display-md text-ink">
                  <Link href={`/news/${post.id}`} className="transition-colors hover:text-sun-red">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-4 text-lg leading-relaxed text-ink/90 sm:text-xl sm:leading-relaxed">
                  {excerpt(post.body, 320)}
                </p>
                <Link
                  href={`/news/${post.id}`}
                  className="group mt-6 inline-flex items-center gap-2 font-bold uppercase tracking-[0.08em] text-red-ink"
                >
                  <span className="link">Read the full post</span>
                  <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {image && (
                <Link
                  href={`/news/${post.id}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="block self-start overflow-hidden rounded border-2 border-ink bg-ink/10 shadow-print-lg transition-transform duration-300 ease-out-expo hover:-translate-x-1 hover:-translate-y-1 lg:rotate-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                </Link>
              )}
            </article>
          )}
        </div>
      </div>
    </section>
  )
}
