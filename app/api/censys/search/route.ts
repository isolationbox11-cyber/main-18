import { NextResponse } from "next/server";
import { censysSearch } from "../../../../lib/censys";
import { getGeoData, getDeviceImage, getDeviceFingerprint } from "../../../../lib/device-visuals";
import { translateToEnglish } from "../../../../lib/utils";

export const runtime = "edge";

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
    const hosts = await censysSearch(q);
    // Enhance and normalize each host result
    const enhancedHosts = await Promise.all(
      hosts.map(async (host: any) => {
        // Translate text fields to English
        const translated = { ...host };
        if (host.description) {
          translated.description = await translateToEnglish(host.description);
        }
        if (host.title) {
          translated.title = await translateToEnglish(host.title);
        }
        if (host.snippet) {
          translated.snippet = await translateToEnglish(host.snippet);
        }
        // Add geolocation and country flag
        let geo = null;
        if (host.ip) {
          geo = await getGeoData(host.ip);
          translated.geo = geo;
          translated.countryFlag = geo?.countryFlagUrl || null;
        }
        // Add device fingerprint and image
        translated.deviceFingerprint = getDeviceFingerprint(host);
        translated.deviceImageUrl = getDeviceImage(host);
        // Add more device metadata if available
        translated.deviceType = host.device_type || "Unknown";
        translated.os = host.os || "Unknown";
        translated.product = host.product || "Unknown";
        translated.version = host.version || "Unknown";
        translated.ports = host.services?.map((s: any) => s.port) || [];
        translated.protocols = host.services?.map((s: any) => s.transport_protocol) || [];
        translated.serviceNames = host.services?.map((s: any) => s.service_name) || [];
        // Add last seen and first seen if available
        translated.lastSeen = host.last_seen || null;
        translated.firstSeen = host.first_seen || null;
        // Add location details
        translated.latitude = host.location?.latitude || null;
        translated.longitude = host.location?.longitude || null;
        translated.country = host.location?.country || geo?.country || "Unknown";
        translated.city = geo?.city || null;
        // Add risk score if available
        translated.riskScore = host.risk_score || null;
        // Add tags if available
        translated.tags = host.tags || [];
        // Add a visual badge for LIVE/NEW/UPDATED
        translated.statusBadge = host.last_seen ? "LIVE" : "NEW";
        return translated;
      })
    );
    // Sort by riskScore descending if available
    enhancedHosts.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
    return NextResponse.json({ results: enhancedHosts }, {
      headers: { "cache-control": "s-maxage=300, stale-while-revalidate=60" }
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message ?? "Censys request failed" },
      { status: 500 }
    );
  }
}
