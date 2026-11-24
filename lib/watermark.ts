// Photo watermarking on Cloudflare Workers, using the Images binding
// (`[images] binding = "IMAGES"` in wrangler.toml). Draws the brand watermark
// (sun + DAVAPALOOZA wordmark, lib/watermarkOverlay.ts) in the bottom-right
// corner and caps the long edge at 2400px so gallery photos load fast.
//
// Never throws: if the Images service is unavailable or can't read the photo
// (e.g. an unsupported format), it returns the original untouched so approving
// a photo always works — and says so in the logs.

import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { ImagesBinding, ReadableStream as WorkersStream } from '@cloudflare/workers-types';
import { WATERMARK_PNG_BASE64, WATERMARK_WIDTH, WATERMARK_HEIGHT } from '@/lib/watermarkOverlay';

const MAX_LONG_EDGE = 2400;

function stream(bytes: Uint8Array): WorkersStream<Uint8Array> {
  return new Blob([bytes as BlobPart]).stream() as unknown as WorkersStream<Uint8Array>;
}

function overlayBytes(): Uint8Array {
  const bin = atob(WATERMARK_PNG_BASE64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export interface WatermarkResult {
  bytes: Uint8Array;
  contentType: string;
  /** false when we fell back to the untouched original */
  applied: boolean;
}

export async function watermarkPhoto(original: Uint8Array, originalContentType: string): Promise<WatermarkResult> {
  const fallback: WatermarkResult = { bytes: original, contentType: originalContentType, applied: false };
  try {
    const { env } = getCloudflareContext();
    const images = (env as unknown as { IMAGES?: ImagesBinding }).IMAGES;
    if (!images) {
      console.error('Watermark skipped: IMAGES binding is not configured');
      return fallback;
    }

    const info = await images.info(stream(original));
    if (!('width' in info)) return fallback;

    const longEdge = Math.max(info.width, info.height);
    const shortEdge = Math.min(info.width, info.height);
    const scale = longEdge > MAX_LONG_EDGE ? MAX_LONG_EDGE / longEdge : 1;
    const outShort = shortEdge * scale;

    // watermark ≈ 38% of the photo's short edge, never tiny or huge
    const wmWidth = Math.round(Math.min(Math.max(outShort * 0.38, 180), 800));
    const margin = Math.round(Math.max(outShort * 0.025, 12));

    // Render the watermark at its final size first, then draw that image.
    const overlay = await images
      .input(stream(overlayBytes()))
      .transform({ width: wmWidth, height: Math.round((wmWidth * WATERMARK_HEIGHT) / WATERMARK_WIDTH) })
      .output({ format: 'image/png' });

    let pipeline = images.input(stream(original));
    if (scale < 1) pipeline = pipeline.transform({ width: Math.round(info.width * scale), fit: 'scale-down' });

    const result = await pipeline
      .draw(overlay.image(), { bottom: margin, right: margin, opacity: 0.85 })
      .output({ format: 'image/jpeg', quality: 86 });

    const bytes = new Uint8Array(await result.response().arrayBuffer());
    return { bytes, contentType: 'image/jpeg', applied: true };
  } catch (error) {
    console.error('Watermark failed, using the original photo:', error);
    return fallback;
  }
}
