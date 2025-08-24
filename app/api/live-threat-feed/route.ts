import { NextResponse } from "next/server"
import { getLiveThreatFeed } from "@/lib/api-client"

export async function GET() {
  try {
    const events = await getLiveThreatFeed()
    // Optionally transform timestamps to ISO strings for serialization
    const serialized = events.map((e: any) => ({
      ...e,
      timestamp: typeof e.timestamp === "string" ? e.timestamp : e.timestamp?.toISOString?.() ?? ""
    }))
    return NextResponse.json(serialized)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Failed to fetch live threat feed" }, { status: 500 })
  }
}
