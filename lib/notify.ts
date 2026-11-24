// Push notifications to the organizer's phone via ntfy (https://ntfy.sh).
//
// Install the free ntfy app, subscribe to your private topic, and set NTFY_TOPIC.
// Optional: NTFY_SERVER (self-hosted, default https://ntfy.sh), NTFY_TOKEN (access token).
// Never throws — a failed notification must not fail a form submission.

import { getCloudflareContext } from '@opennextjs/cloudflare';

function readEnv(name: string, workerEnv?: Record<string, unknown>): string | undefined {
  // Scheduled (cron) runs have no request context, so the Worker's env is passed in.
  const direct = workerEnv?.[name];
  if (typeof direct === 'string' && direct) return direct;
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
}, workerEnv?: Record<string, unknown>): Promise<boolean> {
  // Returns true when delivered (or when notifications aren't set up at all).
  const topic = readEnv('NTFY_TOPIC', workerEnv);
  if (!topic) return true;

  const server = (readEnv('NTFY_SERVER', workerEnv) || 'https://ntfy.sh').replace(/\/+$/, '');
  const token = readEnv('NTFY_TOKEN', workerEnv);
  const site = (readEnv('NEXT_PUBLIC_SITE_URL', workerEnv) ||'https://www.southoblockparty.com').replace(/\/+$/, '');

  const body = JSON.stringify({
    topic,
    title: opts.title,
    message: opts.message,
    tags: opts.tags,
    click: opts.path ? `${site}${opts.path}` : undefined,
  });

  // ntfy.sh rate-limits per IP (HTTP 429), and Cloudflare Workers share IPs with
  // other sites — so a send can be refused for no fault of ours. Retry a few
  // times with a short back-off instead of silently dropping the notification.
  const DELAYS_MS = [0, 1200, 2500];
  for (let attempt = 0; attempt < DELAYS_MS.length; attempt++) {
    if (DELAYS_MS[attempt]) await new Promise(r => setTimeout(r, DELAYS_MS[attempt]));
    try {
      const res = await fetch(server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body,
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) return true;
      console.error(`ntfy responded ${res.status} (attempt ${attempt + 1}/${DELAYS_MS.length})`);
      if (res.status !== 429 && res.status < 500) return false; // our request is wrong; retrying won't help
    } catch (error) {
      console.error(`Admin notification failed (attempt ${attempt + 1}/${DELAYS_MS.length}):`, error);
    }
  }
  return false;
}
