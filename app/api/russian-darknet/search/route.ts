import { NextResponse } from "next/server";

export const runtime = "edge";

// Example: RuTor public index (mirror)
const RUTOR_INDEX = "https://rutor.info/search/0/0/100/";

export async function GET(request: Request) {
  if (!request?.url || typeof request.url !== "string") {
    return NextResponse.json({ error: "Invalid request URL" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  try {
    // Fetch Russian darknet search results from RuTor
    const res = await fetch(RUTOR_INDEX + encodeURIComponent(q));
    if (!res.ok) throw new Error("RuTor request failed");
    const html = await res.text();

    // Parse RuTor HTML for links, titles, and snippets
    const itemRegex = /<a href="([^"]+)" class="downgrey">([^<]+)<\/a>.*?<td class="descript">(.*?)<\/td>/gims;
    const results = [];
    let match;
    while ((match = itemRegex.exec(html))) {
      results.push({
        url: "https://rutor.info" + match[1],
        title: match[2].replace(/<[^>]+>/g, ""),
        snippet: match[3].replace(/<[^>]+>/g, ""),
      });
    }

    return NextResponse.json({ results }, { headers: { "cache-control": "s-maxage=300, stale-while-revalidate=60" } });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message ?? "Russian darknet search failed" },
      { status: 500 }
    );
  }
}
