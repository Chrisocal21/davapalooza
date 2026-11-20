import type { Metadata } from 'next'
import IntakeForm from '@/components/forms/IntakeForm'

export const metadata: Metadata = {
  title: 'Sponsor',
  description: 'Back the South O Block Party — sponsor inquiries for Davapalooza.',
}

export default function SponsorsPage() {
  return (
    <IntakeForm
      type="sponsors"
      eyebrow="Sponsor inquiry"
      title="Back the Block"
      lede="Local businesses make a free community event possible. Tell us how you'd like to help."
      asideTitle="Good to know"
      asideItems={[
        'Financial and in-kind support both welcome.',
        'Davapalooza stays free for everyone — sponsors help cover real event costs.',
        "We'll reach out personally to talk it through.",
      ]}
      fields={[
        { key: 'company_name', label: 'Business / Organization', required: true },
        { key: 'contact_name', label: 'Your Name', required: true, placeholder: 'Full name' },
        { key: 'contact_email', label: 'Email', required: true, type: 'email', placeholder: 'you@example.com' },
        { key: 'contact_phone', label: 'Phone (optional)', type: 'tel', placeholder: '(555) 000-0000' },
        {
          key: 'interest_level',
          label: 'How would you like to help?',
          type: 'select',
          wide: true,
          options: [
            { value: 'title', label: 'Title sponsor' },
            { value: 'gold', label: 'Gold' },
            { value: 'silver', label: 'Silver' },
            { value: 'in-kind', label: 'In-kind (goods / services)' },
            { value: 'other', label: 'Something else' },
          ],
        },
        { key: 'message', label: 'Message', type: 'textarea' },
      ]}
      submitLabel="Send Inquiry"
      successIcon="heart"
      successTitle="Thank you!"
      successBody="We got your inquiry and will be in touch soon."
    />
  )
}
