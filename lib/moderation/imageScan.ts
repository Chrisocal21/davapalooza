// Image scanning with OpenAI Vision API
// Detects inappropriate visual content in submitted photos

import OpenAI from 'openai';

// Lazy-load OpenAI client to avoid build-time errors
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function scanImage(imageBuffer: Buffer): Promise<'pass' | 'flag' | 'error'> {
  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    // Get OpenAI client
    const openai = getOpenAIClient();

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Does this image contain nudity, violence, graphic content, or any content inappropriate for a public community event? Respond with only: PASS or FLAG',
            },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 10,
    });

    const result = response.choices[0]?.message?.content?.trim().toUpperCase();

    if (result === 'FLAG') {
      return 'flag';
    } else if (result === 'PASS') {
      return 'pass';
    } else {
      // Unexpected response - fail safe to manual review
      console.error('Unexpected OpenAI response:', result);
      return 'error';
    }
  } catch (error) {
    console.error('Error scanning image with OpenAI:', error);
    // On API failure, default to manual review (fail safe)
    return 'error';
  }
}
