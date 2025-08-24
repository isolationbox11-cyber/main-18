import { NextResponse } from 'next/server';
import axios from 'axios';

const SHODAN_ENDPOINT = 'https://api.shodan.io/shodan/host/search';

export async function GET(request: Request) {
  if (!request?.url || typeof request.url !== "string") {
    return NextResponse.json({ error: "Invalid request URL" }, { status: 400 });
  }
  let searchParams;
  try {
    searchParams = new URL(request.url).searchParams;
  } catch {
    return NextResponse.json({ error: "Invalid request URL" }, { status: 400 });
  }
  const q = searchParams.get('q');
  if (!q) { return NextResponse.json({ error: 'Missing query' }, { status: 400 }); }

  // SSR guard for env var
  if (typeof process === 'undefined' || !process.env.SHODAN_API_KEY) {
    return NextResponse.json({ error: 'SHODAN_API_KEY not available server-side' }, { status: 500 });
  }
  try {
    const { data } = await axios.get(SHODAN_ENDPOINT, {
      params: { key: process.env.SHODAN_API_KEY, query: q },
    });
    const safe = data.matches.map((m: any) => ({
      ip: m.ip_str,
      org: m.org,
      port: m.port,
      os: m.os,
      vulns: m.vulns?.slice(0, 3) ?? [],
      location: m.location,
    }));
    return NextResponse.json({ results: safe });
  } catch (err: any) {
    return NextResponse.json({ error: 'Shodan request failed' }, { status: 500 });
  }
}
