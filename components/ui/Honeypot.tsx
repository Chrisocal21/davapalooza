/**
 * Hidden spam trap. Real visitors never see or fill it; bots that auto-fill every
 * input do, and the server then quietly drops the submission (see lib/spam.ts).
 */
export default function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Leave this field empty
        <input
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </label>
    </div>
  )
}
