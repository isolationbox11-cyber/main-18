/* src/types/domain-intelligence.ts */
export interface TrafficInfo {
  globalRank: number | null;
  countryRank: number | null;
  categoryRank: number | null;
  monthlyVisits: number | null;
  bounceRate: number | null;
  avgSessionDuration: number | null;
}
export interface AnalyticsResult {
  domain: string;
  traffic?: TrafficInfo | null;
}
export interface ReverseIpEntry { name: string; }
export interface RelatedDomainsResult {
  domain: string;
  reverseIP?: ReverseIpEntry[];
}
export interface CertificateInfo {
  subdomain: string;
  source: string;
  issuer: string;
  validFrom: string;
  validTo: string;
}
export interface SubdomainsResult {
  domain:string;
  certificates?: CertificateInfo[];
}