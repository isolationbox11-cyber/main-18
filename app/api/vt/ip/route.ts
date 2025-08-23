import { NextResponse } from "next/server";
import { vtCheck } from "@/lib/vt";

export const runtime = "edge";

export async function GET(request: Request) {
  if (!request?.url || typeof request.url !== "string") {
    return NextResponse.json({ error: "Invalid request URL" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip");
  if (!ip) return NextResponse.json({ error: "Missing IP" }, { status: 400 });

  try {
    const result = await vtCheck(ip);
    return NextResponse.json({ result }, { headers: { "cache-control": "s-maxage=300, stale-while-revalidate=60" } });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message ?? "VirusTotal request failed" },
      { status: 500 }
    );
  }
}
