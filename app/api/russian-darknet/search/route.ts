import { NextResponse } from "next/server";

export const runtime = "edge";

// Example: RuTor public index (mirror)
const RUTOR_INDEX = "https://rutor.info/search/0/0/100/";

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
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  console.log("Russian darknet search query:", q);

  try {
    // Fetch Russian darknet search results from RuTor
    console.log("Fetching RuTor search results:", RUTOR_INDEX + encodeURIComponent(q));
    const res = await fetch(RUTOR_INDEX + encodeURIComponent(q));
    if (!res.ok) {
      throw new Error("RuTor request failed");
    }
    const html = await res.text();

    console.log("Received HTML from RuTor:", html.slice(0, 100));

    // Parse RuTor HTML for links, titles, and snippets
  // Use only supported flags for regex (g, i, m, s) and ensure tsconfig targets es2018+
  const itemRegex = /<a href="([^"]+)" class="downgrey">([^<]+)<\/a>.*?<td class="descript">(.*?)<\/td>/gms;
    const results = [];
    let match;
    while ((match = itemRegex.exec(html))) {
      console.log("Match found:", match);
      results.push({
        url: "https://rutor.info" + match[1],
        title: match[2].replace(/<[^>]+>/g, ""),
        snippet: match[3].replace(/<[^>]+>/g, ""),
      });
    }

    console.log("Parsed results:", results);

    return NextResponse.json({ results }, { headers: { "cache-control": "s-maxage=300, stale-while-revalidate=60" } });
  } catch (e: any) {
    console.error("Russian darknet search error:", e);
    return NextResponse.json(
      { error: e.message ?? "Russian darknet search failed" },
      { status: 500 }
    );
  }
}
