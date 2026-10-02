import LineupView from '@/components/lineup/LineupView'

// Which event is "upcoming" depends on today's date, so this page is rendered
// per request rather than frozen at build time.
export const dynamic = 'force-dynamic'

export default function LineupPage() {
  return <LineupView initialNow={Date.now()} />
}
