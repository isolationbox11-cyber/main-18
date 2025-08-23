import { NextResponse } from "next/server";
import { shodanSearch } from "../../../lib/shodan";
import { censysSearch } from "../../../lib/censys";
import { grayNoiseCheck } from "../../../lib/graynoise";
import { otxCheck } from "../../../lib/otx";
import { vtCheck } from "../../../lib/vt";
import { abuseIPDBCheck } from "../../../lib/abuseipdb";
import axios from "axios";

export const runtime = "edge";

export async function GET(request: Request) {
  if (!request?.url || typeof request.url !== "string") {
    return NextResponse.json({ error: "Invalid request URL" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("q")?.trim() ?? "";
  if (!raw) {
    return NextResponse.json({ error: "Empty query" }, { status: 400 });
  }

  // Decide which backend to use based on simple prefixes
  if (raw.toLowerCase().startsWith("shodan:")) {
    const term = raw.replace(/^shodan:/i, "").trim();
    const data = await shodanSearch(term);
    return NextResponse.json({ source: "shodan", results: data });
  }

  if (raw.toLowerCase().startsWith("censys:")) {
    const term = raw.replace(/^censys:/i, "").trim();
    const data = await censysSearch(term);
    return NextResponse.json({ source: "censys", results: data });
  }

  // IP checks: GrayNoise, OTX, VirusTotal, AbuseIPDB
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(raw)) {
    const gray = await grayNoiseCheck(raw);
    const otx = await otxCheck(raw);
    const vt = await vtCheck(raw);
    const abuse = await abuseIPDBCheck(raw);
    return NextResponse.json({
      source: "ipinfo",
      results: { gray, otx, vt, abuse }
    });
  }

  // final fallback → Google‑style CSE (you already have a CSE id)
  const GOOGLE_ENDPOINT = "https://www.googleapis.com/customsearch/v1";
  const key = process.env.GOOGLE_API_KEY!;
  const cx = process.env.GOOGLE_CX!;
  const { data } = await axios.get(GOOGLE_ENDPOINT, {
    params: { key, cx, q: raw },
  });
  return NextResponse.json({ source: "google", results: data.items });
}
