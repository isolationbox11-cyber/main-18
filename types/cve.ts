// src/types/cve.ts
// -----------------------------------------------------
//  Types used by the comprehensive CVE panel
// -----------------------------------------------------

export interface CVEDetails {
  cve_id: string;
  summary?: string;
  published_time?: string;        // sometimes called `published_date` – keep both optional
  published_date?: string;
  cvss?: number;
  kev?: boolean;                  // Known‑Exploited‑Vulnerability flag
  ransomware_campaign?: string;   // optional text, may be empty
  epss?: number;                  // EPSS score (0‑1)
  propose_action?: string;        // optional remediation text
  references: string[];
  // ── any extra fields you need – just add them as optional ──
  [extra: string]: any;
}

export interface CVEWithCPEs extends CVEDetails {
  cpes?: string[];                // list of CPE strings (optional)
}
