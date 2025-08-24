import { NextResponse } from "next/server";
import type { AnalyticsResult } from '@/types/domain-intelligence';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!request?.url || typeof request.url !== "string") {
    return NextResponse.json({ error: "Invalid request URL" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const results: AnalyticsResult = { domain: domain || '' };

  try {
    const response = await fetch(`https://api.similarweb.com/v1/similar-rank/${domain}/rank?api_key=${process.env.SIMILARWEB_API_KEY}`);
    if (response.ok) {
      const data = await response.json();
      results.traffic = {
        globalRank: data.similar_rank?.rank ?? null,
        countryRank: data.similar_rank?.country_rank ?? null,
        categoryRank: data.similar_rank?.category_rank ?? null,
        monthlyVisits: data.monthly_visits ?? null,
        bounceRate: data.bounce_rate ?? null,
        avgSessionDuration: data.avg_session_duration ?? null,
      };
    } else {
      results.traffic = null; // explicitly allowed by the type
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    results.traffic = null;
  }

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
}
