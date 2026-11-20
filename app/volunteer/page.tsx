import type { Metadata } from 'next'
import IntakeForm from '@/components/forms/IntakeForm'

export const metadata: Metadata = {
  title: 'Volunteer',
  description: 'Help make Davapalooza happen — sign up to volunteer at the South O Block Party.',
}

export default function VolunteerPage() {
  return (
    <IntakeForm
      type="volunteers"
      eyebrow="Volunteer"
      title="Lend a Hand"
      lede="The block party runs on neighbors. Tell us when you're free and what you're good at."
      asideTitle="Good to know"
      asideItems={[
        'Day-of help with setup, crowd flow, and breakdown.',
        "No experience needed — we'll match you with something that fits.",
        "We'll email you with details once the schedule is set.",
      ]}
      fields={[
        { key: 'name', label: 'Your Name', required: true, placeholder: 'Full name' },
        { key: 'email', label: 'Email', required: true, type: 'email', placeholder: 'you@example.com' },
        { key: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '(555) 000-0000' },
        { key: 'availability', label: 'Availability', placeholder: 'Morning, afternoon, all day…' },
        { key: 'skills', label: 'Skills', wide: true, placeholder: 'Setup, first aid, photography, sound…' },
        { key: 'other_info', label: 'Anything else?', type: 'textarea' },
      ]}
      submitLabel="Sign Me Up"
      successIcon="heart"
      successTitle="You're on the list!"
      successBody="Thanks for volunteering. We'll be in touch with details soon."
    />
  )
}
