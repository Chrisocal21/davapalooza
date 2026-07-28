/**
 * TornEdge — SVG torn-paper section divider.
 *
 * Place between sections to create a rough horizontal break that matches
 * the print/zine texture direction.
 *
 * Usage:
 *   <TornEdge fill="#FDF0DA" />           — cream tear on sky-blue bg above
 *   <TornEdge fill="#45BEE4" flip />      — sky tear on cream section above
 */
interface TornEdgeProps {
  /** Fill color of the torn shape — should match the section BELOW the divider */
  fill?: string
  /** Flip vertically so the tear points up instead of down */
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
      className={`w-full overflow-hidden leading-none ${className}`}
      aria-hidden="true"
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full"
        style={{ height: 48 }}
      >
        <path
          d="M0,48 L0,28
             C40,18 80,32 120,20
             C160,8  200,30 240,16
             C280,4  320,26 360,14
             C400,4  440,28 480,18
             C520,8  560,32 600,20
             C640,10 680,30 720,16
             C760,4  800,26 840,14
             C880,4  920,28 960,18
             C1000,8 1040,32 1080,20
             C1120,8 1160,26 1200,16
             L1200,48 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}
