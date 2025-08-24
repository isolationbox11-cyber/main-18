import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://threatfox-api.abuse.ch/api/v1/');
  if (!res.ok) { throw new Error('ThreatFox API error'); }
    const data = await res.json();
    return NextResponse.json({ source: 'threatfox', results: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch ThreatFox data' }, { status: 500 });
  }
}
