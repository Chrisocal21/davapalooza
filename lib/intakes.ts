// Config for the generic intake forms (volunteers, sponsors, supporters).
// Bands and vendors have their own bespoke routes/pages.

export type IntakeType = 'volunteers' | 'sponsors' | 'supporters';

export interface IntakeConfig {
  table: string;
  label: string; // plural, for headings
  singular: string; // for notifications
  description: string;
  tag: string; // ntfy emoji shortcode
  titleField: string; // main display name
  fields: { key: string; label: string; required?: boolean }[];
  statuses: string[];
}

export const INTAKES: Record<IntakeType, IntakeConfig> = {
  volunteers: {
    table: 'volunteers',
    label: 'Volunteer Sign-ups',
    singular: 'volunteer',
    description: 'Day-of volunteer roster',
    tag: 'raised_hands',
    titleField: 'name',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', required: true },
      { key: 'phone', label: 'Phone' },
      { key: 'availability', label: 'Availability' },
      { key: 'skills', label: 'Skills' },
      { key: 'other_info', label: 'Anything else' },
    ],
    statuses: ['new', 'reviewed', 'confirmed', 'declined', 'archived'],
  },
  sponsors: {
    table: 'sponsor_inquiries',
    label: 'Sponsor Inquiries',
    singular: 'sponsor inquiry',
    description: 'Paying / backing sponsor tier',
    tag: 'moneybag',
    titleField: 'company_name',
    fields: [
      { key: 'company_name', label: 'Company', required: true },
      { key: 'contact_name', label: 'Contact name', required: true },
      { key: 'contact_email', label: 'Email', required: true },
      { key: 'contact_phone', label: 'Phone' },
      { key: 'interest_level', label: 'Interest level' },
      { key: 'message', label: 'Message' },
    ],
    statuses: ['new', 'reviewed', 'accepted', 'declined', 'archived'],
  },
  supporters: {
    table: 'supporter_submissions',
    label: 'Supporters',
    singular: 'photographer/videographer',
    description: 'Photographer & videographer interest',
    tag: 'camera',
    titleField: 'name',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', required: true },
      { key: 'role', label: 'Role', required: true },
      { key: 'instagram', label: 'Instagram' },
      { key: 'website', label: 'Website' },
      { key: 'portfolio_url', label: 'Portfolio' },
      { key: 'other_info', label: 'Anything else' },
    ],
    statuses: ['new', 'reviewed', 'accepted', 'declined', 'archived'],
  },
};

export function getIntake(type: string): IntakeConfig | null {
  return Object.prototype.hasOwnProperty.call(INTAKES, type) ? INTAKES[type as IntakeType] : null;
}
