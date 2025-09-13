// Server-side API integration utilities - moved to server actions
export interface ShodanResult {
  ip: string
  port: number
  service: string
  country: string
  city: string
  organization: string
  vulnerability?: string
}

export interface VirusTotalResult {
  hash: string
  detectionRatio: string
  scanDate: string
  positives: number
  total: number
}

export interface ThreatIntelResult {
  ip: string
  reputation: "malicious" | "suspicious" | "clean"
  categories: string[]
  lastSeen: string
}

// Mock data generators for demo purposes
export function generateMockShodanData(query: string): ShodanResult[] {
  const mockResults: ShodanResult[] = [
    {
      ip: "192.168.1.100",
      port: 80,
      service: "HTTP",
      country: "US",
      city: "New York",
      organization: "Example Corp",
      vulnerability: query.includes("apache") ? "CVE-2024-666" : undefined,
    },
    {
      ip: "10.0.0.50",
      port: 22,
      service: "SSH",
      country: "DE",
      city: "Berlin",
      organization: "Tech Solutions",
    },
    {
      ip: "172.16.0.25",
      port: 443,
      service: "HTTPS",
      country: "JP",
      city: "Tokyo",
      organization: "Digital Systems",
    },
  ]

  return mockResults.filter(
    (result) =>
      query.toLowerCase().includes(result.service.toLowerCase()) ||
      query.includes(result.port.toString()) ||
      query.toLowerCase().includes(result.country.toLowerCase()),
  )
}

export function generateMockVirusTotalData(hash: string): VirusTotalResult {
  return {
    hash,
    detectionRatio: "12/67",
    scanDate: new Date().toISOString(),
    positives: 12,
    total: 67,
  }
}

export function generateMockThreatIntel(ip: string): ThreatIntelResult {
  const reputations: ThreatIntelResult["reputation"][] = ["malicious", "suspicious", "clean"]
  const categories = ["malware", "phishing", "botnet", "spam", "proxy"]

  return {
    ip,
    reputation: reputations[Math.floor(Math.random() * reputations.length)],
    categories: categories.slice(0, Math.floor(Math.random() * 3) + 1),
    lastSeen: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
  }
}
