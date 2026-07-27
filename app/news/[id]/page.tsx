import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import ShareButton from '@/components/ui/ShareButton';
import { getDB, newsQueries } from '@/lib/db';
import { getPublicUrl } from '@/lib/r2';

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
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title={post.title}
          subtitle={new Date(post.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        />
        <Card className="p-8 mt-8">
          {post.photo_r2_key && (
            <div className="mb-6">
              {post.photo_r2_key.toLowerCase().endsWith('.pdf') ? (
                <div className="w-full">
                  <iframe
                    src={getPublicUrl(post.photo_r2_key)}
                    className="w-full h-[1000px] border border-border rounded-lg"
                    title={post.title}
                  />
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={getPublicUrl(post.photo_r2_key)}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
              )}
            </div>
          )}
          <p className="text-text text-lg leading-relaxed whitespace-pre-wrap">
            {post.body}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ShareButton
              url={`${SITE_URL}/news/${post.id}`}
              text={`Check out this Davapalooza update: ${post.title}`}
              variant="button"
            />
            <p className="text-muted text-sm">Share this post</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
