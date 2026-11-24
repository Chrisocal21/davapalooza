'use client'

/**
 * Year picker for the admin sign-up lists. The current event year is the
 * default; earlier years are the archive. `value` is '' (current), 'all', or a year.
 */
export default function YearSelect({
  years,
  current,
  value,
  onChange,
}: {
  years: number[]
  current: number
  value: string
  onChange: (v: string) => void
}) {
  const shown = value === '' ? String(current) : value
  const viewingArchive = shown !== 'all' && Number(shown) < current
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <label htmlFor="year-select" className="text-xs font-mono uppercase tracking-wider text-muted">
        Year
      </label>
      <select
        id="year-select"
        value={shown}
        onChange={e => onChange(e.target.value === String(current) ? '' : e.target.value)}
        className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
      >
        {years.map(y => (
          <option key={y} value={y}>
            {y}
            {y === current ? ' — current' : ' — archive'}
          </option>
        ))}
        <option value="all">All years</option>
      </select>
      {viewingArchive && (
        <span className="rounded border border-border px-2 py-1 text-xs font-mono text-muted">
          Archive — {shown} entries
        </span>
      )}
    </div>
  )
}
