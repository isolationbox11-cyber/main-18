// ---------------------------------------------------
//  Central place for the external‑API response typings
// ---------------------------------------------------

// ---- Shodan -------------------------------------------------
export interface ShodanResult {
  ip: string;
  port: number;
  service?: string;
  city?: string;
  country?: string;
  organization?: string;
  vulnerability?: string;
}

// ---- Threat Intel (e.g., OTX, VirusTotal, etc.) ----------
export interface ThreatIntelResult {
  ip: string;
  reputation?: string;
  categories?: string[];
  lastSeen?: string;
}
