import { fetchJSON } from "./fetcher";

export interface VTResult {
  ip: string;
  reputation: number;
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
}

export async function vtCheck(ip: string): Promise<VTResult> {
  const key = process.env.VT_KEY!;
  const url = `https://www.virustotal.com/api/v3/ip_addresses/${ip}`;
  const raw = await fetchJSON<any>(url, {
    headers: {
      "x-apikey": key,
      "Accept": "application/json",
    },
  });
  return {
    ip: raw.data.id,
    reputation: raw.data.attributes.reputation ?? 0,
    harmless: raw.data.attributes.last_analysis_stats.harmless ?? 0,
    malicious: raw.data.attributes.last_analysis_stats.malicious ?? 0,
    suspicious: raw.data.attributes.last_analysis_stats.suspicious ?? 0,
    undetected: raw.data.attributes.last_analysis_stats.undetected ?? 0,
  };
}
