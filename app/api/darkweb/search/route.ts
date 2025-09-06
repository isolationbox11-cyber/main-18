/* This TypeScript code snippet is defining a function named `GET` that handles incoming HTTP GET
requests. Here is a breakdown of what the code is doing: */
import { NextResponse } from "next/server";

export const runtime = "edge";

// Free Ahmia API endpoint for onion site search
const AHMIA_API = "https://ahmia.fi/search/?q=";

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

  try {
    // Fetch onion site search results from Ahmia
    const res = await fetch(AHMIA_API + encodeURIComponent(q));
    if (!res.ok) {
      throw new Error("Ahmia request failed");
    }
    const html = await res.text();

    // Parse Ahmia HTML for onion links, titles, and snippets
    // Remove unsupported 's' flag for compatibility with ES2017
    const onionRegex = /<a href="(http[s]?:\/\/[a-z0-9]{16,56}\.onion[^"]*)"[^>]*>(.*?)<\/a>.*?<p>(.*?)<\/p>/gim;
    const results = [];
    let match;
    while ((match = onionRegex.exec(html))) {
      results.push({
        url: match[1],
        title: match[2].replace(/<[^>]+>/g, ""),
        snippet: match[3].replace(/<[^>]+>/g, ""),
      });
    }

    return NextResponse.json({ results }, { headers: { "cache-control": "s-maxage=300, stale-while-revalidate=60" } });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message ?? "Dark web search failed" },
      { status: 500 }
    );
  }
}
