// Text filter for moderating user-submitted text
// Scans handle + caption for blocked terms

import { BLOCKED_TERMS } from './blocklist';

export function checkText(text: string): 'pass' | 'flag' {
  if (!text) {
    return 'pass';
  }

  const normalizedText = text.toLowerCase().trim();

  // Check each blocked term
  for (const term of BLOCKED_TERMS) {
    const normalizedTerm = term.toLowerCase();
    if (normalizedText.includes(normalizedTerm)) {
      return 'flag';
    }
  }

  return 'pass';
}

// Check both handle and caption together
export function checkSubmissionText(handle: string, caption?: string): 'pass' | 'flag' {
  const combinedText = `${handle} ${caption || ''}`;
  return checkText(combinedText);
}
