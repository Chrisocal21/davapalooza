import Hero from '@/components/home/Hero'
import LatestPhotos from '@/components/home/LatestPhotos'
import LineupTeaser from '@/components/home/LineupTeaser'
import LatestNews from '@/components/home/LatestNews'
import GetInvolved from '@/components/home/GetInvolved'
import SupportCta from '@/components/home/SupportCta'
import Marquee from '@/components/ui/Marquee'
import TornEdge from '@/components/ui/TornEdge'
import { SITE } from '@/lib/site'

// The hero depends on today's date (countdown, happening now, or next year), so
// this page is rendered per request rather than frozen at build time.
export const dynamic = 'force-dynamic'

export default function Home() {
  const now = Date.now()

  return (
    <>
      <Hero initialNow={now} />
      <Marquee items={[...SITE.tagline, 'Free', 'Griffin St', 'Oceanside, CA']} />
      <LatestPhotos />
      <TornEdge fill="#272B2C" />
      <LineupTeaser initialNow={now} />
      <TornEdge fill="#FDF0DA" />
      <LatestNews />
      <TornEdge fill="#45BEE4" />
      <GetInvolved />
      <SupportCta />
    </>
  )
}
