// Image watermarking with Sharp
// Applies @handle watermark to bottom-right corner of approved photos

import sharp from 'sharp';

export interface WatermarkOptions {
  handle: string;
  fontSize?: number;
  opacity?: number;
  padding?: number;
}

export async function applyWatermark(
  imageBuffer: Buffer,
  options: WatermarkOptions
): Promise<Buffer> {
  const {
    handle,
    fontSize = 48,
    opacity = 0.7,
    padding = 20,
  } = options;

  // Load the image to get dimensions
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read image dimensions');
  }

  // Create watermark text with SVG
  // Using Space Mono style font appearance with semi-transparent white
  const watermarkText = `@${handle}`;
  const textWidth = watermarkText.length * (fontSize * 0.6); // Approximate width
  const textHeight = fontSize;

  // Position: bottom-right corner with padding
  const x = metadata.width - textWidth - padding;
  const y = metadata.height - textHeight - padding;

  // Create SVG text overlay
  const svgWatermark = Buffer.from(`
    <svg width="${metadata.width}" height="${metadata.height}">
      <style>
        .watermark {
          font-family: 'Space Mono', monospace, 'Courier New', monospace;
          font-size: ${fontSize}px;
          font-weight: 400;
          fill: rgba(255, 255, 255, ${opacity});
          text-anchor: end;
        }
      </style>
      <text x="${metadata.width - padding}" y="${metadata.height - padding}" class="watermark">${watermarkText}</text>
    </svg>
  `);

  // Composite the watermark onto the image
  const watermarkedImage = await image
    .composite([
      {
        input: svgWatermark,
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 90 }) // High quality JPEG output
    .toBuffer();

  return watermarkedImage;
}

// Resize image if needed (max dimensions for web display)
export async function optimizeImage(
  imageBuffer: Buffer,
  maxWidth: number = 2000,
  maxHeight: number = 2000
): Promise<Buffer> {
  return await sharp(imageBuffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .toBuffer();
}

// Apply watermark and optimize in one step
export async function processImageForGallery(
  imageBuffer: Buffer,
  handle: string
): Promise<Buffer> {
  // First optimize the image
  const optimized = await optimizeImage(imageBuffer);
  
  // Then apply watermark
  const watermarked = await applyWatermark(optimized, { handle });
  
  return watermarked;
}
