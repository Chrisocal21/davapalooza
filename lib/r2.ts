// Cloudflare R2 storage client
// Direct R2 binding access (preferred for Cloudflare Workers)

import { R2Bucket } from '@cloudflare/workers-types';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Get R2 bucket from Cloudflare context
export function getR2Bucket(): R2Bucket {
  try {
    const { env } = getCloudflareContext();
    return env.R2 as R2Bucket;
  } catch (error) {
    throw new Error('Unable to access R2 bucket. Make sure R2 binding is configured in wrangler.toml');
  }
}

export const PUBLIC_URL = 'https://pub-a3656c448d10463daaa2f66d77665216.r2.dev';

// R2 path structure
export const R2_PATHS = {
  submissions: {
    pending: (id: string, ext: string) => `submissions/pending/${id}.${ext}`,
  },
  gallery: (id: string, ext: string) => `gallery/${id}.${ext}`,
  artists: (id: string, ext: string) => `artists/${id}.${ext}`,
  news: (id: string, ext: string) => `news/${id}.${ext}`,
};

// Upload file to R2
export async function uploadToR2(
  key: string,
  file: Buffer | Uint8Array,
  contentType: string
): Promise<void> {
  const bucket = getR2Bucket();
  
  await bucket.put(key, file, {
    httpMetadata: {
      contentType,
    },
  });
}

// Download file from R2
export async function downloadFromR2(key: string): Promise<Buffer> {
  const bucket = getR2Bucket();
  
  const object = await bucket.get(key);
  
  if (!object) {
    throw new Error(`File not found in R2: ${key}`);
  }

  // Convert stream to buffer
  const arrayBuffer = await object.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Delete file from R2
export async function deleteFromR2(key: string): Promise<void> {
  const bucket = getR2Bucket();
  await bucket.delete(key);
}

// Get public URL for a file
export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}

// Extract file extension from filename
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts[parts.length - 1].toLowerCase();
}

// Validate file type (images only)
export function isValidImageType(contentType: string): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
  return validTypes.includes(contentType.toLowerCase());
}

// Validate file type for news (images and PDFs)
export function isValidNewsFileType(contentType: string): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'application/pdf'];
  return validTypes.includes(contentType.toLowerCase());
}

// Check if content type is a PDF
export function isPDF(contentType: string): boolean {
  return contentType.toLowerCase() === 'application/pdf';
}

// Validate file size (max 10MB)
export function isValidFileSize(size: number): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  return size <= maxSize;
}
