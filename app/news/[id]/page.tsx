import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import PageHeader from '@/components/ui/PageHeader';
import ShareButton from '@/components/ui/ShareButton';
import { getDB, newsQueries } from '@/lib/db';
import { getPublicUrl } from '@/lib/r2';
import { formatPostDate, isPdf } from '@/lib/format';

interface NewsPost {
  id: string;
  title: string;
  body: string;
  photo_r2_key: string | null;
  published_at: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://davapalooza.com';

function getExcerpt(body: string, length = 150) {
  return body.length <= length ? body : `${body.slice(0, length).trimEnd()}...`;
}

async function getNewsPost(id: string): Promise<NewsPost | null> {
  const db = getDB();
  return newsQueries.getById(db, id);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getNewsPost(id);

  if (!post) {
    return {
      title: 'News | Davapalooza',
      description: 'News update not found.',
    };
  }

  const url = `${SITE_URL}/news/${post.id}`;
  const excerpt = getExcerpt(post.body);

  return {
    title: `${post.title} | Davapalooza`,
    description: excerpt,
    openGraph: {
      title: `${post.title} | Davapalooza`,
      description: excerpt,
      url,
      type: 'article',
      publishedTime: post.published_at,
      authors: ['Davapalooza'],
      images: post.photo_r2_key
        ? [
            {
              url: getPublicUrl(post.photo_r2_key),
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Davapalooza`,
      description: excerpt,
      images: post.photo_r2_key ? [getPublicUrl(post.photo_r2_key)] : undefined,
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function NewsPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getNewsPost(id);

  if (!post) {
    notFound();
  }

  const backLink = (
    <Link href="/news" className="eyebrow inline-flex items-center gap-2 font-bold text-ink">
      <Icon name="arrow-left" size={15} />
      <span className="link">All news</span>
    </Link>
  );

  return (
    <article>
      <PageHeader
        eyebrow={formatPostDate(post.published_at)}
        title={post.title}
      />

      <div className="bg-cream py-12 sm:py-16">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">{backLink}</div>

            {post.photo_r2_key && (
              <div className="mb-10">
                {isPdf(post.photo_r2_key) ? (
                  <iframe
                    src={getPublicUrl(post.photo_r2_key)}
                    className="max-h-[70vh] min-h-[500px] w-full rounded border-2 border-ink bg-white shadow-print"
                    title={post.title}
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getPublicUrl(post.photo_r2_key)}
                    alt={post.title}
                    className="mx-auto max-h-[75vh] w-auto max-w-full rounded border-2 border-ink bg-white shadow-print-lg"
                  />
                )}
              </div>
            )}

            <p className="whitespace-pre-wrap text-[1.1875rem] leading-[1.7] text-ink">
              {post.body}
            </p>

            <div className="mt-12 flex flex-col gap-5 border-t-2 border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
              <ShareButton
                url={`${SITE_URL}/news/${post.id}`}
                text={`Check out this Davapalooza update: ${post.title}`}
                variant="button"
              />
              {backLink}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
