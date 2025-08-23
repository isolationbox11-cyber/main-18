
import { NextResponse } from 'next/server';

// Edge‑runtime – runs on V8 isolates, super fast & cheap
export const runtime = 'edge';

// Base URL of the public RuTor index (mirrored)
const RUTOR_INDEX = 'https://rutor.info/search/0/0/100/';

/**
 * GET /api/rutor?q=<search‑term>
 *
 * Returns a JSON payload:
 * {
 *   results: [
 *     { url: string, title: string, snippet: string },
 *     …
 *   ]
 * }
 *
 * If something goes wrong you’ll get:
 * { error: string }  (status 400/500)
 */
export async function GET(request: Request) {
  if (!request?.url || typeof request.url !== "string") {
    return NextResponse.json({ error: "Invalid request URL" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  // ---------------------------------------------------------------
  // 1️⃣ Validate the query string
  // ---------------------------------------------------------------
  if (!q) {
    return NextResponse.json(
      { error: 'Missing query' },
      { status: 400 }
    );
  }

  try {
    // ---------------------------------------------------------------
    // 2️⃣ Pull the raw HTML page from RuTor
    // ---------------------------------------------------------------
    const res = await fetch(RUTOR_INDEX + encodeURIComponent(q));

    if (!res.ok) {
      throw new Error('RuTor request failed');
    }

    const html = await res.text();

    // ---------------------------------------------------------------
    // 3️⃣ Very small “HTML‑scraper” – pull out title / URL / snippet
    // ---------------------------------------------------------------
    const itemRegex =
      /<a href="([^"]+)" class="downgrey">([^<]+)<\/a>.*?<td class="descript">(.*?)<\/td>/gims;

    const results: {
      url: string;
      title: string;
      snippet: string;
    }[] = [];

    let match: RegExpExecArray | null;
    while ((match = itemRegex.exec(html))) {
      results.push({
        // RuTor returns relative URLs – prepend the host
        url: 'https://rutor.info' + match[1],
        title: match[2].replace(/<[^>]+>/g, ''), // strip any stray HTML
        snippet: match[3].replace(/<[^>]+>/g, ''),
      });
    }

    // ---------------------------------------------------------------
    // 4️⃣ Return JSON – cache the result for 5 minutes (stale‑while‑revalidate = 1 min)
    // ---------------------------------------------------------------
    return NextResponse.json(
      { results },
      {
        headers: {
          'cache-control':
            's-maxage=300, stale-while-revalidate=60',
        },
      }
    );
  } catch (e: any) {
    // ---------------------------------------------------------------
    // 5️⃣ Any error → 500 + message
    // ---------------------------------------------------------------
    console.error(e);
    return NextResponse.json(
      {
        error: e?.message ?? 'Russian darknet search failed',
      },
      { status: 500 }
    );
  }
}
