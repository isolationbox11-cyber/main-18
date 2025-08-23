// src/types/api-integrations.ts
// -----------------------------------------------------
//  Types for the third‑party APIs you call from the UI
// -----------------------------------------------------

// ----- Shodan -------------------------------------------------
export interface ShodanResult {
  ip: string;
  org?: string | null;
  port: number;
  os?: string | null;
  service?: string;
  vulns?: string[];
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

// ----- Threat Intel (generic wrapper for OTX/VirusTotal, etc.) -----
// Adjust the fields to match whatever you actually render.
export interface ThreatIntelResult {
  ip: string;
  reputation?: string;
  tags?: string[];
  lastSeen?: string;
  // add any additional keys you consume in the UI
}