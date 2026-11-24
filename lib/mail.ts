// Sends email through Resend (https://resend.com) — used for the store launch announcement.
//
// Needs two Worker secrets:
//   RESEND_API_KEY  an API key from the Resend dashboard
//   MAIL_FROM       e.g. "Davapalooza <hello@southoblockparty.com>" (domain must be verified in Resend)
// Never throws; returns how many messages were accepted.

import { getCloudflareContext } from '@opennextjs/cloudflare';

function readEnv(name: string): string | undefined {
  try {
    const { env } = getCloudflareContext();
    const v = (env as unknown as Record<string, unknown>)[name];
    if (typeof v === 'string' && v) return v;
  } catch {
    // not running on Cloudflare (local next dev)
  }
  return process.env[name] || undefined;
}

export function siteUrl(): string {
  return (readEnv('NEXT_PUBLIC_SITE_URL') || 'https://www.southoblockparty.com').replace(/\/+$/, '');
}

export function mailConfigured(): boolean {
  return !!(readEnv('RESEND_API_KEY') && readEnv('MAIL_FROM'));
}

export interface OutgoingMail {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Adds List-Unsubscribe headers so Gmail/Apple Mail show their own "Unsubscribe" button. */
  unsubscribeUrl?: string;
}

/** Sends in batches of 100 (Resend's batch limit). */
export async function sendMail(messages: OutgoingMail[]): Promise<{ sent: number; failed: number; error?: string }> {
  const key = readEnv('RESEND_API_KEY');
  const from = readEnv('MAIL_FROM');
  if (!key || !from) return { sent: 0, failed: messages.length, error: 'Email sending is not set up yet.' };

  let sent = 0;
  let failed = 0;
  let error: string | undefined;

  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100);
    const payload = chunk.map(m => ({
      from,
      to: [m.to],
      subject: m.subject,
      html: m.html,
      text: m.text,
      headers: m.unsubscribeUrl
        ? {
            'List-Unsubscribe': `<${m.unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          }
        : undefined,
    }));
    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        sent += chunk.length;
      } else {
        failed += chunk.length;
        const body = await res.text().catch(() => '');
        error = `Resend ${res.status}: ${body.slice(0, 200)}`;
        console.error('Resend batch failed:', error);
      }
    } catch (e) {
      failed += chunk.length;
      error = e instanceof Error ? e.message : 'Network error';
      console.error('Resend batch error:', e);
    }
  }
  return { sent, failed, error };
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Builds the launch email for one recipient from the admin's plain-text message. */
export function buildLaunchEmail(opts: { subject: string; message: string; unsubscribeUrl: string }): Pick<OutgoingMail, 'html' | 'text'> {
  const store = `${siteUrl()}/store`;
  const paras = opts.message
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const html = `<!doctype html><html><body style="margin:0;background:#f6f1e7;padding:24px 12px;font-family:Helvetica,Arial,sans-serif;color:#1c2330">
<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:14px;padding:32px 28px">
<p style="margin:0 0 20px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#d9534f">Davapalooza &middot; South O Block Party</p>
${paras.map(p => `<p style="margin:0 0 16px;font-size:16px;line-height:1.55">${esc(p).replace(/\n/g, '<br>')}</p>`).join('\n')}
<p style="margin:28px 0"><a href="${store}" style="display:inline-block;background:#d9534f;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:999px">Shop the merch</a></p>
<p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#6b7280">You're getting this because you asked to be told when the Davapalooza store opened.<br><a href="${opts.unsubscribeUrl}" style="color:#6b7280">Unsubscribe</a></p>
</div></body></html>`;

  const text = `${paras.join('\n\n')}\n\nShop the merch: ${store}\n\n---\nYou asked to be told when the store opened. Unsubscribe: ${opts.unsubscribeUrl}\n`;
  return { html, text };
}
