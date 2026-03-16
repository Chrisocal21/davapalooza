import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'

// TODO: Fetch from API
const newsPosts: Array<{
  id: number;
  title: string;
  body: string;
  publishedAt: string;
}> = []

export default function NewsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader 
          title="News & Updates" 
          subtitle="Stay in the loop"
        />

        <div className="mt-12 space-y-6">
          {newsPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted text-lg">No news yet. Check back soon for updates!</p>
            </Card>
          ) : (
            newsPosts.map((post) => (
              <Card key={post.id} className="p-8">
                <p className="text-muted text-sm font-mono mb-2">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <h2 className="text-3xl font-display text-primary mb-4">
                  {post.title}
                </h2>
                <p className="text-text text-lg leading-relaxed">
                  {post.body}
                </p>
              </Card>
            ))
          )}
        </div>

        {/* Empty state removed as it's now conditional above */}
      </div>
    </div>
  )
}
