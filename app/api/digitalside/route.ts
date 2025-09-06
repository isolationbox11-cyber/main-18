import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://osint.digitalside.it/api/v1/indicators/all');
  if (!res.ok) { throw new Error('DigitalSide API error'); }
    const data = await res.json();
    return NextResponse.json({ source: 'digitalside', results: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch DigitalSide data' }, { status: 500 });
  }
}
