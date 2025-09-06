import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://isc.sans.edu/api/threatlist/');
  if (!res.ok) { throw new Error('SANS ISC API error'); }
    const data = await res.json();
    return NextResponse.json({ source: 'sans-isc', results: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch SANS ISC data' }, { status: 500 });
  }
}
