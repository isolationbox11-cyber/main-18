import { NextResponse } from "next/server";
import type {
  RelatedDomainsResult,
  ReverseIpEntry,
} from '@/types/domain-intelligence';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!request?.url || typeof request.url !== "string") {
    return NextResponse.json({ error: "Invalid request URL" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const results: RelatedDomainsResult = { domain: domain || '' };

  try {
    // SSR guard for env var
    if (typeof process === 'undefined' || !process.env.VIEWDNS_API_KEY) {
      results.reverseIP = [
        { name: `example1.${domain || 'com'}` },
        { name: `example2.${domain || 'com'}` },
        { name: `example3.${domain || 'com'}` },
      ];
    } else {
      const response = await fetch(`https://api.viewdns.info/reverseip/?host=${domain}&apikey=${process.env.VIEWDNS_API_KEY}&output=json`);
      if (response.ok) {
        const data = await response.json();
        results.reverseIP = data.response?.domains?.map((d: any) => ({ name: d.name })) || [];
      } else {
        // Fallback – still type‑correct
        results.reverseIP = [
          { name: `example1.${domain || 'com'}` },
          { name: `example2.${domain || 'com'}` },
          { name: `example3.${domain || 'com'}` },
        ];
      }
    }
  } catch (error) {
    console.error("Related domains API error:", error);
    results.reverseIP = [
      { name: `fallback1.${domain || 'com'}` },
      { name: `fallback2.${domain || 'com'}` },
    ];
  }

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
}
