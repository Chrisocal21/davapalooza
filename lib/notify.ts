// Push notifications to the organizer's phone via ntfy (https://ntfy.sh).
//
// Install the free ntfy app, subscribe to your private topic, and set NTFY_TOPIC.
// Optional: NTFY_SERVER (self-hosted, default https://ntfy.sh), NTFY_TOKEN (access token).
// Never throws — a failed notification must not fail a form submission.

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

export async function notifyAdmin(opts: {
  title: string;
  message: string;
  /** Site-relative path to open when the notification is tapped, e.g. /admin/bands */
  path?: string;
  tags?: string[];
}): Promise<void> {
  const topic = readEnv('NTFY_TOPIC');
  if (!topic) return;

  const server = (readEnv('NTFY_SERVER') || 'https://ntfy.sh').replace(/\/+$/, '');
  const token = readEnv('NTFY_TOKEN');
  const site = (readEnv('NEXT_PUBLIC_SITE_URL') || 'https://www.southoblockparty.com').replace(/\/+$/, '');

  try {
    const res = await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        topic,
        title: opts.title,
        message: opts.message,
        tags: opts.tags,
        click: opts.path ? `${site}${opts.path}` : undefined,
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) console.error('ntfy responded', res.status);
  } catch (error) {
    console.error('Admin notification failed:', error);
  }
}
