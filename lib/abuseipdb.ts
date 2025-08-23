import { fetchJSON } from "./fetcher";

export interface AbuseIPDBResult {
  ip: string;
  abuseConfidenceScore: number;
  countryCode: string;
  usageType: string;
  domain: string;
  totalReports: number;
}

export async function abuseIPDBCheck(ip: string): Promise<AbuseIPDBResult> {
  const key = process.env.ABUSEIPDB_KEY!;
  const url = `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90`;
  const raw = await fetchJSON<any>(url, {
    headers: {
      "Key": key,
      "Accept": "application/json",
    },
  });
  return {
    ip: raw.data.ipAddress,
    abuseConfidenceScore: raw.data.abuseConfidenceScore,
    countryCode: raw.data.countryCode,
    usageType: raw.data.usageType,
    domain: raw.data.domain,
    totalReports: raw.data.totalReports,
  };
}
