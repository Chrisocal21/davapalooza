/**
 * TornEdge — torn-paper section divider.
 *
 * Drop it between two sections. It rides up over the section above, so that
 * section's colour shows through the tear, and it is filled with the colour of
 * the section below. The tear is a repeating tile, so the fibres stay the same
 * size on a phone and on a wide screen.
 *
 * Usage:
 *   <TornEdge fill="#FDF0DA" />          — the cream section below tears into whatever is above
 *   <TornEdge fill="#45BEE4" flip />     — the sky section above hangs torn over whatever is below
 */
interface TornEdgeProps {
  /** Fill colour — the section BELOW the divider (or the section ABOVE it when flipped) */
  fill?: string
  /** Hang the tear down from the section above instead of rising from the one below */
  flip?: boolean
  className?: string
}

export default function TornEdge({
  fill = '#FDF0DA',
  flip = false,
  className = '',
}: TornEdgeProps) {
  return (
    <div
      aria-hidden="true"
      className={`torn-edge ${flip ? 'torn-edge-flip' : ''} ${className}`}
      style={{ backgroundColor: fill }}
    />
  )
}
