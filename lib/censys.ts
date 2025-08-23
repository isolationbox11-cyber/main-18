import { fetchJSON } from "./fetcher";

export interface CensysHost {
  ip: string;
  services: { port: number; service_name: string; transport_protocol: string }[];
  location: { country: string; latitude: number; longitude: number };
}

/**
 * POST request – Censys expects a JSON body with the query
 */
export async function censysSearch(query: string): Promise<CensysHost[]> {
  const uid = process.env.CENSYS_UID!;
  const secret = process.env.CENSYS_SECRET!;

  const url = "https://search.censys.io/api/v2/hosts/search";
  const body = {
    query,
    per_page: 20,
    cursor: null,
  };

  const raw = await fetchJSON<any>(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${uid}:${secret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return raw.result.hits.map((h: any) => ({
    ip: h.ip,
    services: h.services.map((s: any) => ({
      port: s.port,
      service_name: s.service_name,
      transport_protocol: s.transport_protocol,
    })),
    location: {
      country: h.location.country,
      latitude: h.location.latitude,
      longitude: h.location.longitude,
    },
  }));
}
