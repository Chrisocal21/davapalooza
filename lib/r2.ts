// Cloudflare R2 storage client
// S3-compatible API for uploading, downloading, and managing files

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client with Cloudflare credentials
export function getR2Client(): S3Client {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing R2 credentials in environment variables');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'southoblockparty-media';
export const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://media.southoblockparty.com';

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
  const client = getR2Client();
  
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );
}

// Download file from R2
export async function downloadFromR2(key: string): Promise<Buffer> {
  const client = getR2Client();
  
  const response = await client.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error('No file body returned from R2');
  }

  // Convert stream to buffer
  const chunks: Uint8Array[] = [];
  for await (const chunk of response.Body as any) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Delete file from R2
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  
  await client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
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

// Validate file size (max 10MB)
export function isValidFileSize(size: number): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  return size <= maxSize;
}
