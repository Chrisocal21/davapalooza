'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import SunMark from '@/components/ui/SunMark'
import { excerpt, formatPostDate, isPdf } from '@/lib/format'

interface NewsPost {
  id: string;
  title: string;
  body: string;
  photo_r2_key: string | null;
  photoUrl: string | null;
  published_at: string;
}

const thumbOf = (post: NewsPost) => (post.photoUrl && !isPdf(post.photo_r2_key) ? post.photoUrl : null)

// Posts without a photo get a flat colour panel instead; the colours rotate so
// a run of text-only posts still reads as a set.
const PANELS = ['bg-sky text-ink/20', 'bg-ink text-cream/15', 'bg-cream-deep text-ink/15'] as const

function Thumb({ post, index, className }: { post: NewsPost; index: number; className: string }) {
  const src = thumbOf(post)
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
        className={`${className} object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]`}
      />
    )
  }
  return (
    <div className={`${className} halftone relative flex items-center justify-center ${PANELS[index % PANELS.length]}`}>
      <SunMark className="h-20 w-20" />
    </div>
  )
}

const readMore = 'mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold uppercase tracking-[0.1em] text-red-ink'

export default function NewsPage() {
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => { setNewsPosts(data.news || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const [lead, ...rest] = newsPosts

  return (
    <>
      <PageHeader eyebrow="From the organizers" title="News & Updates" lede="Stay in the loop" />

      <div className="min-h-[40vh] bg-cream py-14 sm:py-20">
        <div className="shell">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-80 rounded-md" />)}
            </div>
          ) : newsPosts.length === 0 ? (
            <p className="rounded-md border-2 border-dashed border-ink/30 px-6 py-16 text-center text-xl text-ink">
              No news yet. Check back soon for updates!
            </p>
          ) : (
            <>
              {/* Latest post, set large */}
              <Link
                href={`/news/${lead.id}`}
                className="group grid overflow-hidden rounded-md border-2 border-ink bg-paper shadow-print-lg transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0_0_#272B2C] md:grid-cols-2"
              >
                <div className="overflow-hidden border-b-2 border-ink md:border-b-0 md:border-r-2">
                  <Thumb post={lead} index={0} className="aspect-[16/10] h-full w-full md:aspect-auto md:min-h-[22rem]" />
                </div>
                <div className="flex flex-col p-6 sm:p-9">
                  <p className="eyebrow flex flex-wrap items-center gap-3 text-muted">
                    <span className="rounded-sm bg-sun-red px-1.5 pb-[0.2rem] pt-[0.3rem] font-bold leading-none text-white">
                      Latest
                    </span>
                    <time dateTime={lead.published_at}>{formatPostDate(lead.published_at)}</time>
                  </p>
                  <h2 className="mt-4 font-display text-display-md text-ink transition-colors group-hover:text-sun-red">
                    {lead.title}
                  </h2>
                  <p className="mt-4 line-clamp-4 text-lg leading-relaxed text-ink/85">{excerpt(lead.body, 280)}</p>
                  <span className={readMore}>
                    Read more
                    <Icon name="arrow-right" size={17} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>

              {/* Everything else */}
              {rest.length > 0 && (
                <ul className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {rest.map((post, i) => (
                    <li key={post.id} className="reveal flex">
                      <Link
                        href={`/news/${post.id}`}
                        className="group flex w-full flex-col overflow-hidden rounded-md border-2 border-ink bg-paper shadow-print transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#272B2C]"
                      >
                        {/* Thumbnail */}
                        <div className="overflow-hidden border-b-2 border-ink">
                          <Thumb post={post} index={i + 1} className="aspect-[16/10] w-full" />
                        </div>

                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          <p className="eyebrow text-muted">
                            <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
                          </p>
                          <h2 className="mt-2.5 font-display text-[1.9rem] leading-[0.98] tracking-wide text-ink transition-colors group-hover:text-sun-red">
                            {post.title}
                          </h2>
                          <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/80">{excerpt(post.body)}</p>
                          <span className={readMore}>
                            Read more
                            <Icon name="arrow-right" size={17} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
