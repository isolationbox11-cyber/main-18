import { NextResponse } from "next/server";
import type {
  SubdomainsResult,
  CertificateInfo,
} from '@/types/domain-intelligence';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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
  const domain = searchParams.get('domain');
  const results: SubdomainsResult = { domain: domain || '' };

  // In a real app, you would fetch subdomains and certificates here.
  // For this example, we'll use fallback data.

  try {
    const certResponse = await fetch(`https://crt.sh/?q=${domain}&output=json`);
    if (certResponse.ok) {
  const crtData = await certResponse.json();
  const crtSubdomains: string[] = [...new Set((crtData as any[]).map((item: any) => item.name_value).filter(Boolean))];

      // Explicitly type the map result – now TypeScript knows it matches CertificateInfo[]
      results.certificates = crtSubdomains.map<CertificateInfo>((sub) => ({
        subdomain: sub,
        source: 'crt.sh',
        issuer: 'Various CAs',
        validFrom: '2023-01-01',
        validTo: '2025-01-01',
      }));
    } else {
      results.certificates = []; // safe fallback
    }
  } catch (error) {
    console.error("Subdomain API error:", error);
    results.certificates = [];
  }

  return new Response(
    JSON.stringify({
      ...results,
      // any other fields
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
