import type { Metadata } from 'next'
import IntakeForm from '@/components/forms/IntakeForm'

export const metadata: Metadata = {
  title: 'Photographers & Videographers',
  description: 'Photographers and videographers: cover Davapalooza and get credited.',
}

export default function SupportersPage() {
  return (
    <IntakeForm
      type="supporters"
      eyebrow="Photographers & videographers"
      title="Capture the Day"
      lede="Shoot the block party and we'll credit and link your work."
      asideTitle="Good to know"
      asideItems={[
        'Share your portfolio so we know your style.',
        'We credit and link back to your work.',
        "We'll email you with details before the event.",
      ]}
      fields={[
        { key: 'name', label: 'Your Name', required: true, placeholder: 'Full name' },
        { key: 'email', label: 'Email', required: true, type: 'email', placeholder: 'you@example.com' },
        {
          key: 'role',
          label: 'What do you shoot?',
          required: true,
          type: 'select',
          options: [
            { value: 'photographer', label: 'Photos' },
            { value: 'videographer', label: 'Video' },
            { value: 'both', label: 'Both' },
          ],
        },
        { key: 'instagram', label: 'Instagram (without @)', placeholder: 'yourhandle' },
        { key: 'website', label: 'Website', type: 'url', placeholder: 'https://yoursite.com' },
        { key: 'portfolio_url', label: 'Portfolio link', type: 'url', placeholder: 'https://…' },
        { key: 'other_info', label: 'Anything else?', type: 'textarea' },
      ]}
      submitLabel="Send It In"
      successIcon="camera"
      successTitle="We got it!"
      successBody="Thanks for reaching out. We'll be in touch."
    />
  )
}
