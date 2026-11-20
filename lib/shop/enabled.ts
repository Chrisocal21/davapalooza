// The shop is a private preview until there is merch to sell.
//
// It lives at /preview/<SHOP_PREVIEW_KEY>/ — an unlisted, unguessable URL
// that isn't linked from anywhere and is marked noindex. Anyone with the link
// can view it (share it with the founders etc.); anyone without it gets a 404.
// The public /store page stays the "Coming Soon" waitlist.
//
// Set SHOP_PREVIEW_KEY in .env.local and as a Worker secret. To rotate the link,
// change the key. To launch for real later: move these pages to /store.

import { getCloudflareContext } from '@opennextjs/cloudflare';

function readEnv(name: string): string | undefined {
  try {
    const { env } = getCloudflareContext();
    const v = (env as unknown as Record<string, unknown>)[name];
    if (typeof v === 'string' && v) return v;
  } catch {
    // not on Cloudflare (local next dev)
  }
  return process.env[name] || undefined;
}

export function shopKeyValid(key: string): boolean {
  const expected = readEnv('SHOP_PREVIEW_KEY');
  if (!expected || expected.length < 12 || key.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < key.length; i++) diff |= key.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

// Public URL; next.config.js rewrites /preview/* to the app/shop-preview/* routes.
export const shopBase = (key: string) => `/preview/${key}`;
