import { NextResponse } from "next/server";
import { abuseIPDBCheck } from "@/lib/abuseipdb";

export const runtime = "edge";

export async function GET(request: Request) {
  if (!request?.url || typeof request.url !== "string") {
    return NextResponse.json({ error: "Invalid request URL" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip");
  if (!ip) return NextResponse.json({ error: "Missing IP" }, { status: 400 });

  try {
    const result = await abuseIPDBCheck(ip);
    return NextResponse.json({ result }, { headers: { "cache-control": "s-maxage=300, stale-while-revalidate=60" } });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message ?? "AbuseIPDB request failed" },
      { status: 500 }
    );
  }
}
