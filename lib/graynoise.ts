import { fetchJSON } from "./fetcher";

export interface GrayNoiseResult {
  ip: string;
  classification: string;
  name: string;
  last_seen: string;
  tags: string[];
  actor: string | null;
}

export async function grayNoiseCheck(ip: string): Promise<GrayNoiseResult> {
  const key = process.env.GRAYNOISE_KEY!;
  const url = `https://api.greynoise.io/v3/community/${ip}`;
  const raw = await fetchJSON<any>(url, {
    headers: {
      "key": key,
      "Accept": "application/json",
    },
  });
  return {
    ip: raw.ip,
    classification: raw.classification,
    name: raw.name,
    last_seen: raw.last_seen,
    tags: raw.tags ?? [],
    actor: raw.actor ?? null,
  };
}
