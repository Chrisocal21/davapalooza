// Cloudflare Worker bindings and environment variables
interface CloudflareEnv {
  // Bindings
  DB: D1Database;
  R2: R2Bucket;
  
  // Environment variables
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
  OPENAI_API_KEY?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_R2_ACCESS_KEY_ID?: string;
  CLOUDFLARE_R2_SECRET_ACCESS_KEY?: string;
  CLOUDFLARE_R2_BUCKET_NAME?: string;
  CLOUDFLARE_R2_PUBLIC_URL?: string;
}
