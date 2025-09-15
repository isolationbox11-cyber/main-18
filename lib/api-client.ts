// API client - now uses enhanced data generators for more realistic demo data
export interface ShodanHost {
  ip_str: string
  port: number
  transport: string
  product?: string
  version?: string
  title?: string
  banner?: string
  location: {
    country_name: string
    city: string
    region_code: string
    latitude?: number
    longitude?: number
  }
  org: string
  isp: string
  asn: string
  hostnames: string[]
  domains: string[]
  timestamp: string
  vulns?: string[]
  tags?: string[]
  ssl?: {
    cert: {
      subject: {
        CN: string
      }
      issuer: {
        CN: string
      }
      serial?: string
      expired?: boolean
      expires?: string
    }
  }
  http?: {
    status: number
    title: string
    server: string
    headers: Record<string, string>
    html: string
  }
  screenshot?: string
  favicon?: string
}

export interface ShodanSearchResult {
  matches: ShodanHost[]
  total: number
  facets?: any
}

export interface ThreatIntelResult {
  ip: string
  reputation: "clean" | "suspicious" | "malicious"
  abuseConfidence: number
  countryCode: string
  city: string
  isp: string
  asn: string
  usageType: string
  totalReports: number
  categories: string[]
  lastReportedAt: string
  whitelisted: boolean
  malwareHashes: string[]
  openPorts: number[]
  services: string[]
  riskScore: number
  threatTypes: string[]
  firstSeen: string
  lastSeen: string
}

export interface VirusTotalResult {
  data: {
    attributes: {
      last_analysis_stats: {
        harmless: number
        malicious: number
        suspicious: number
        undetected: number
        timeout: number
      }
      last_analysis_results: Record<string, any>
      reputation: number
      regional_internet_registry: string
      jarm: string
      network: string
      tags: string[]
      country: string
      as_owner: string
      asn: number
    }
  }
}

// Additional interfaces for components
export interface ThreatMapData {
  country: string
  countryCode: string
  threats: number
  botnets: number
  malwareTypes: string[]
  coordinates: [number, number]
}

export interface BotnetData {
  name: string
  size: number
  countries: string[]
  lastSeen: string
  threatLevel: "low" | "medium" | "high" | "critical"
  description: string
  c2Servers: string[]
  affectedPorts: number[]
}

export interface GoogleDorkResult {
  title: string
  link: string
  snippet: string
  displayLink: string
  riskLevel: "info" | "low" | "medium" | "high"
  category: string
}

export interface LiveThreatEvent {
  id: string
  timestamp: Date
  type: "malware" | "botnet" | "phishing" | "vulnerability" | "breach"
  source: string
  target: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  location: {
    country: string
    city: string
    coordinates: [number, number]
  }
}

// Import enhanced data generators
import { generateDetailedShodanData, generateDetailedThreatIntel } from "./enhanced-data-generator"

// Enhanced Shodan search with more realistic data
export async function searchShodan(query: string, page = 1): Promise<ShodanSearchResult> {
  console.log(`Searching Shodan for: ${query} (using enhanced demo data)`)
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

  const detailedHosts = generateDetailedShodanData(query)

  // Convert detailed hosts to standard format
  const matches: ShodanHost[] = detailedHosts.map((host) => ({
    ip_str: host.ip_str,
    port: host.port,
    transport: host.transport,
    product: host.product,
    version: host.version,
    title: host.title,
    banner: host.banner,
    location: {
      country_name: host.location.country_name,
      city: host.location.city,
      region_code: host.location.region_code,
      latitude: host.location.latitude,
      longitude: host.location.longitude,
    },
    org: host.org,
    isp: host.isp,
    asn: host.asn,
    hostnames: host.hostnames,
    domains: host.domains,
    timestamp: host.timestamp,
    vulns: host.vulns,
    tags: host.tags,
    ssl: host.ssl,
    http: host.http,
    screenshot: host.screenshot,
    favicon: host.favicon,
  }))

  return {
    matches,
    total: matches.length + Math.floor(Math.random() * 10000),
  }
}

export async function getShodanHostInfo(ip: string): Promise<ShodanHost> {
  console.log(`Getting Shodan host info for: ${ip} (using enhanced demo data)`)
  await new Promise((resolve) => setTimeout(resolve, 800))

  const detailedHosts = generateDetailedShodanData("host")
  const detailedHost = detailedHosts[0]

  // Override IP with requested IP
  detailedHost.ip_str = ip

  return {
    ip_str: detailedHost.ip_str,
    port: detailedHost.port,
    transport: detailedHost.transport,
    product: detailedHost.product,
    version: detailedHost.version,
    title: detailedHost.title,
    banner: detailedHost.banner,
    location: {
      country_name: detailedHost.location.country_name,
      city: detailedHost.location.city,
      region_code: detailedHost.location.region_code,
      latitude: detailedHost.location.latitude,
      longitude: detailedHost.location.longitude,
    },
    org: detailedHost.org,
    isp: detailedHost.isp,
    asn: detailedHost.asn,
    hostnames: detailedHost.hostnames,
    domains: detailedHost.domains,
    timestamp: detailedHost.timestamp,
    vulns: detailedHost.vulns,
    tags: detailedHost.tags,
    ssl: detailedHost.ssl,
    http: detailedHost.http,
    screenshot: detailedHost.screenshot,
    favicon: detailedHost.favicon,
  }
}

export async function getVirusTotalIPReport(ip: string): Promise<VirusTotalResult> {
  console.log(`Getting VirusTotal report for: ${ip} (using enhanced demo data)`)
  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    data: {
      attributes: {
        last_analysis_stats: {
          harmless: Math.floor(Math.random() * 50) + 20,
          malicious: Math.floor(Math.random() * 5),
          suspicious: Math.floor(Math.random() * 3),
          undetected: Math.floor(Math.random() * 10),
          timeout: 0,
        },
        last_analysis_results: {},
        reputation: Math.floor(Math.random() * 100) - 50,
        regional_internet_registry: "ARIN",
        jarm: "29d29d00029d29d00029d29d29d29d",
        network: `${ip}/24`,
        tags: ["malware", "botnet"].slice(0, Math.floor(Math.random() * 2)),
        country: "US",
        as_owner: "Example ISP",
        asn: Math.floor(Math.random() * 65535),
      },
    },
  }
}

export async function getAbuseIPDBReport(ip: string): Promise<ThreatIntelResult> {
  console.log(`Getting AbuseIPDB report for: ${ip} (using enhanced demo data)`)
  await new Promise((resolve) => setTimeout(resolve, 500))

  return generateDetailedThreatIntel(ip)
}

export async function getGreyNoiseContext(ip: string) {
  console.log(`Getting GreyNoise context for: ${ip} (using demo data)`)
  await new Promise((resolve) => setTimeout(resolve, 400))

  return {
    ip,
    noise: Math.random() > 0.5,
    riot: Math.random() > 0.8,
    classification: ["benign", "malicious", "unknown"][Math.floor(Math.random() * 3)],
    name: "Example Scanner",
    link: "https://example.com",
    last_seen: new Date().toISOString(),
  }
}

export async function getCVEDetails(cveId: string) {
  console.log(`Getting CVE details for: ${cveId} (using demo data)`)
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    cve: cveId,
    description: `Security vulnerability ${cveId} allows remote code execution`,
    severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"][Math.floor(Math.random() * 4)],
    publishedDate: new Date(Date.now() - Math.random() * 86400000 * 365).toISOString(),
    affectedSystems: Math.floor(Math.random() * 10000),
    cvss: Math.random() * 10,
  }
}

// Enhanced threat intelligence aggregation
export async function getComprehensiveThreatIntel(ip: string) {
  try {
    console.log(`Getting comprehensive threat intel for: ${ip}`)

    const [vtResult, abuseResult, greynoiseResult] = await Promise.allSettled([
      getVirusTotalIPReport(ip),
      getAbuseIPDBReport(ip),
      getGreyNoiseContext(ip),
    ])

    return {
      virustotal: vtResult.status === "fulfilled" ? vtResult.value : null,
      abuseipdb: abuseResult.status === "fulfilled" ? abuseResult.value : null,
      greynoise: greynoiseResult.status === "fulfilled" ? greynoiseResult.value : null,
    }
  } catch (error) {
    console.error("Comprehensive threat intel failed:", error)
    return {
      virustotal: null,
      abuseipdb: null,
      greynoise: null,
    }
  }
}

// Rest of the functions remain the same with enhanced data where applicable
export async function getThreatMapData(): Promise<ThreatMapData[]> {
  console.log("Loading threat map data (demo)")
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      country: "United States",
      countryCode: "US",
      threats: 15420,
      botnets: 23,
      malwareTypes: ["Mirai", "Emotet", "TrickBot"],
      coordinates: [39.8283, -98.5795],
    },
    {
      country: "China",
      countryCode: "CN",
      threats: 12890,
      botnets: 18,
      malwareTypes: ["Gafgyt", "Qbot"],
      coordinates: [35.8617, 104.1954],
    },
    {
      country: "Russia",
      countryCode: "RU",
      threats: 9876,
      botnets: 15,
      malwareTypes: ["Mirai", "Emotet"],
      coordinates: [61.524, 105.3188],
    },
    {
      country: "Germany",
      countryCode: "DE",
      threats: 7654,
      botnets: 12,
      malwareTypes: ["TrickBot", "Qbot"],
      coordinates: [51.1657, 10.4515],
    },
    {
      country: "United Kingdom",
      countryCode: "GB",
      threats: 6543,
      botnets: 10,
      malwareTypes: ["Emotet", "Mirai"],
      coordinates: [55.3781, -3.436],
    },
    {
      country: "France",
      countryCode: "FR",
      threats: 5432,
      botnets: 8,
      malwareTypes: ["Gafgyt", "TrickBot"],
      coordinates: [46.2276, 2.2137],
    },
  ]
}

export async function getCurrentBotnets(): Promise<BotnetData[]> {
  console.log("Loading current botnets (demo)")
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      name: "Mirai Variant Alpha",
      size: 45000,
      countries: ["US", "CN", "RU", "DE", "BR"],
      lastSeen: new Date().toISOString(),
      threatLevel: "critical",
      description: "IoT botnet targeting routers and cameras with new exploits",
      c2Servers: ["192.168.1.100", "10.0.0.50", "172.16.0.25"],
      affectedPorts: [23, 2323, 80, 8080],
    },
    {
      name: "Gafgyt Evolution",
      size: 23000,
      countries: ["CN", "US", "IN", "BR", "RU"],
      lastSeen: new Date(Date.now() - 3600000).toISOString(),
      threatLevel: "high",
      description: "Telnet-based IoT botnet with DDoS capabilities",
      c2Servers: ["203.0.113.1", "198.51.100.1"],
      affectedPorts: [23, 80, 8080, 443],
    },
    {
      name: "Emotet Resurgence",
      size: 18500,
      countries: ["US", "DE", "GB", "FR", "IT"],
      lastSeen: new Date(Date.now() - 7200000).toISOString(),
      threatLevel: "critical",
      description: "Banking trojan with modular architecture",
      c2Servers: ["192.0.2.1", "203.0.113.50"],
      affectedPorts: [80, 443, 8080, 8443],
    },
    {
      name: "TrickBot Network",
      size: 12000,
      countries: ["US", "CA", "AU", "NZ", "ZA"],
      lastSeen: new Date(Date.now() - 10800000).toISOString(),
      threatLevel: "high",
      description: "Multi-purpose malware with banking and espionage modules",
      c2Servers: ["198.51.100.50"],
      affectedPorts: [443, 8443],
    },
    {
      name: "Qbot Infrastructure",
      size: 8900,
      countries: ["US", "GB", "DE", "FR", "NL"],
      lastSeen: new Date(Date.now() - 14400000).toISOString(),
      threatLevel: "medium",
      description: "Banking malware with worm-like spreading capabilities",
      c2Servers: ["203.0.113.100", "192.0.2.100"],
      affectedPorts: [80, 443, 8080],
    },
  ]
}

export async function performGoogleDork(dork: string): Promise<GoogleDorkResult[]> {
  console.log(`Performing Google dork: ${dork} (demo)`)
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const results = [
    {
      title: "Admin Login Portal - Company XYZ",
      link: "https://example.com/admin/login",
      snippet: "Administrator login page for system management and configuration",
      displayLink: "example.com",
      riskLevel: "high" as const,
      category: "Admin Panel",
    },
    {
      title: "Index of /backup",
      link: "https://test.com/backup/",
      snippet: "Index of /backup - Parent Directory - database_backup.sql - config_files/",
      displayLink: "test.com",
      riskLevel: "high" as const,
      category: "Directory Listing",
    },
    {
      title: "Server Status Page",
      link: "https://monitor.example.org/server-status",
      snippet: "Apache Server Status for monitor.example.org - Server uptime, requests, and performance metrics",
      displayLink: "monitor.example.org",
      riskLevel: "medium" as const,
      category: "System Information",
    },
    {
      title: "Configuration File Exposed",
      link: "https://site.com/config/database.conf",
      snippet: "Database configuration file with connection parameters",
      displayLink: "site.com",
      riskLevel: "high" as const,
      category: "Sensitive Files",
    },
    {
      title: "Webcam Interface",
      link: "https://camera.local/view/index.shtml",
      snippet: "Live camera feed - Network Camera View",
      displayLink: "camera.local",
      riskLevel: "medium" as const,
      category: "IoT Devices",
    },
  ]

  // Filter results based on dork query
  return results.filter(() => Math.random() > 0.3).slice(0, Math.floor(Math.random() * 4) + 2)
}

export async function getLiveThreatFeed(): Promise<LiveThreatEvent[]> {
  console.log("Loading live threat feed (demo)")
  await new Promise((resolve) => setTimeout(resolve, 600))

  const threats: LiveThreatEvent[] = []
  const threatTypes: LiveThreatEvent["type"][] = ["malware", "botnet", "phishing", "vulnerability", "breach"]
  const severities: LiveThreatEvent["severity"][] = ["low", "medium", "high", "critical"]
  const countries = [
    { name: "United States", city: "New York", coords: [40.7128, -74.006] as [number, number] },
    { name: "China", city: "Beijing", coords: [39.9042, 116.4074] as [number, number] },
    { name: "Russia", city: "Moscow", coords: [55.7558, 37.6176] as [number, number] },
    { name: "Germany", city: "Berlin", coords: [52.52, 13.405] as [number, number] },
    { name: "United Kingdom", city: "London", coords: [51.5074, -0.1278] as [number, number] },
  ]

  const descriptions = [
    "Malware distribution campaign detected",
    "Botnet command and control activity",
    "Phishing campaign targeting financial institutions",
    "Zero-day vulnerability exploitation attempt",
    "Data breach incident reported",
    "Ransomware deployment detected",
    "Credential stuffing attack in progress",
    "DDoS attack infrastructure identified",
  ]

  for (let i = 0; i < 12; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)]
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    threats.push({
      id: `threat-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      type,
      source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      target: type === "botnet" ? "IoT Devices" : "Multiple",
      severity,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      location: {
        country: country.name,
        city: country.city,
        coordinates: country.coords,
      },
    })
  }

  return threats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
