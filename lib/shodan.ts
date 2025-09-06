import { fetchJSON } from "./fetcher";

export interface ShodanHost {
  ip: string;
  org: string | null;
  port: number;
  os: string | null;
  vulns: string[];
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

/**
 * Simple search – returns up to 20 hosts.
 */
export async function shodanSearch(query: string): Promise<ShodanHost[]> {
  const apiKey = process.env.SHODAN_API_KEY!;
  const url = `https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${encodeURIComponent(query)}&facets=org`;

  const raw = await fetchJSON<any>(url);
  return raw.matches.map((m: any) => ({
    ip: m.ip_str,
    org: m.org ?? null,
    port: m.port,
    os: m.os ?? null,
    vulns: m.vulns?.slice(0, 3) ?? [],
    location: {
      latitude: m.location.latitude,
      longitude: m.location.longitude,
      city: m.location.city,
      country: m.location.country_name,
    },
  }));
}

export async function getShodanHostDetails(ip: string): Promise<any> {
  const apiKey = process.env.SHODAN_API_KEY!;
  const url = `https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`;
  const raw = await fetchJSON<any>(url);
  return raw;
}
