import { fetchJSON } from "./fetcher";

export interface OtxResult {
  ip: string;
  pulses: any[];
  tags: string[];
  reputation: number;
}

export async function otxCheck(ip: string): Promise<OtxResult> {
  const key = process.env.OTX_KEY!;
  const url = `https://otx.alienvault.com/api/v1/indicators/IPv4/${ip}/general`;
  const raw = await fetchJSON<any>(url, {
    headers: {
      "X-OTX-API-KEY": key,
      "Accept": "application/json",
    },
  });
  return {
    ip: raw.indicator,
    tags: raw.pulse_info.tags ?? [],
    reputation: raw.reputation ?? 0,
  };
}
