import { NextResponse } from 'next/server';
import axios from 'axios';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export async function POST(request: Request) {
  const { result } = await request.json();
  if (!result) {
    return NextResponse.json({ error: 'Missing result' }, { status: 400 });
  }

  try {
    const { data } = await axios.post(
      OPENAI_ENDPOINT,
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a cybersecurity expert. Explain the following result for a beginner.' },
          { role: 'user', content: JSON.stringify(result) },
        ],
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return NextResponse.json({ explanation: data.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: 'AI explanation failed' }, { status: 500 });
  }
}
