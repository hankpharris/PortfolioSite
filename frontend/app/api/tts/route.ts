import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response('Text is required', { status: 400 });
    }

    const audio = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input: text,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await audio.arrayBuffer());

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return new Response('Error generating speech', { status: 500 });
  }
} 