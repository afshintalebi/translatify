// app/api/tts/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Get text and language from query parameters
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const lang = searchParams.get('lang');

  if (!text || !lang) {
    return new NextResponse('Missing text or language parameters', { status: 400 });
  }

  // 2. Unofficial Google Translate TTS endpoint
  // 'client=tw-ob' is required to bypass some restrictions
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

  try {
    // 3. Fetch the audio buffer from Google on the server side (Bypasses CORS)
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch audio from TTS service');
    }

    const arrayBuffer = await response.arrayBuffer();

    // 4. Return the audio file to the client with attachment headers forcing a download
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="translation_${lang}.mp3"`,
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);
    return new NextResponse('Error generating audio file', { status: 500 });
  }
}