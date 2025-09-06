import { unstable_noStore as noStore } from "next/cache"

// Enhanced API client with richer data structures
export interface EnhancedShodanHost {
  ip_str: string
  port: number
  transport: string
  product?: string
  version?: string
  title?: string
  data: string
  banner: string
  location: {
    country_name: string
    country_code: string
    city: string
    region_code: string
    latitude: number
    longitude: number
  }
  org: string
  isp: string
  asn: string
  hostnames: string[]
  domains: string[]
  timestamp: string
  vulns?: string[]
  tags?: string[]
  cpe?: string[]
  ssl?: {
    cert: {
      subject: { CN: string; O?: string; C?: string }
      issuer: { CN: string; O?: string; C?: string }
      serial: string
      expired: boolean
      expires: string
      issued: string
    }
    chain: string[]
    dhparams?: any
    versions: string[]
  }
  http?: {
    title: string
    server: string
    status: number
    headers: Record<string, string>
    html: string
    robots_hash: string
    favicon?: {
      hash: string
      data: string
      location: string
    }
    components: Array<{
      name: string
      version: string
      categories: string[]
    }>
  }
  screenshot?: {
    data: string
    labels: string[]
  }
}

export interface EnhancedThreatIntel {
  ip: string
  reputation_score: number
  risk_level: "low" | "medium" | "high" | "critical"
  threat_types: string[]
  malware_families: string[]
  attack_vectors: string[]
  geolocation: {
    country: string
    country_code: string
    city: string
    region: string
    timezone: string
    coordinates: [number, number]
  }
  network_info: {
    asn: string
    as_name: string
    isp: string
    organization: string
    network_type: string
  }
  threat_feeds: {
    virustotal: {
      detections: number
      total_engines: number
      last_scan: string
      malicious_urls: string[]
      communicating_files: Array<{
        sha256: string
        name: string
        detection_ratio: string
      }>
    }
    abuseipdb: {
      abuse_confidence: number
      usage_type: string
      total_reports: number
      distinct_users: number
      last_reported: string
      categories: string[]
    }
    greynoise: {
      classification: string
      noise: boolean
      riot: boolean
      first_seen: string
      last_seen: string
      actor: string
      tags: string[]
    }
  }
  historical_data: Array<{
    date: string
    activity_type: string
    description: string
    severity: string
  }>
}

export interface RealTimeEvent {
  id: string
  timestamp: Date
  event_type: "malware_detection" | "botnet_activity" | "vulnerability_scan" | "data_breach" | "phishing_campaign"
  severity: "info" | "low" | "medium" | "high" | "critical"
  source: {
    ip: string
    country: string
    city: string
    coordinates: [number, number]
    asn: string
    organization: string
  }
  target: {
    ip?: string
    domain?: string
    port?: number
    service?: string
    country?: string
  }
  details: {
    title: string
    description: string
    indicators: string[]
    attack_vector: string
    malware_family?: string
    cve_ids?: string[]
    urls?: string[]
    file_hashes?: string[]
  }
  references: Array<{
    type: "report" | "analysis" | "ioc" | "mitigation"
    title: string
    url: string
    source: string
  }>
  mitigation: {
    recommendations: string[]
    blocking_rules: string[]
    detection_signatures: string[]
  }
}

// Generate enhanced realistic data
function generateEnhancedShodanData(query: string): EnhancedShodanHost[] {
  noStore()

  const services = [
    {
      product: "Apache httpd",
      version: "2.4.41",
      port: 80,
      banner: "HTTP/1.1 200 OK\r\nServer: Apache/2.4.41 (Ubuntu)\r\nContent-Type: text/html",
      title: "Apache2 Ubuntu Default Page",
      server: "Apache/2.4.41 (Ubuntu)",
      components: [
        { name: "Apache", version: "2.4.41", categories: ["Web Server"] },
        { name: "Ubuntu", version: "20.04", categories: ["Operating System"] },
      ],
    },
    {
      product: "nginx",
      version: "1.18.0",
      port: 443,
      banner: "HTTP/1.1 200 OK\r\nServer: nginx/1.18.0\r\nContent-Type: text/html",
      title: "Welcome to nginx!",
      server: "nginx/1.18.0",
      components: [
        { name: "nginx", version: "1.18.0", categories: ["Web Server", "Reverse Proxy"] },
        { name: "OpenSSL", version: "1.1.1f", categories: ["Cryptography"] },
      ],
    },
    {
      product: "OpenSSH",
      version: "8.2p1",
      port: 22,
      banner: "SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5",
      title: "SSH Service",
      server: "OpenSSH_8.2p1",
      components: [{ name: "OpenSSH", version: "8.2p1", categories: ["SSH Server"] }],
    },
  ]

  const locations = [
    {
      country_name: "United States",
      country_code: "US",
      city: "New York",
      region_code: "NY",
      lat: 40.7128,
      lng: -74.006,
    },
    { country_name: "Germany", country_code: "DE", city: "Berlin", region_code: "BE", lat: 52.52, lng: 13.405 },
    { country_name: "Japan", country_code: "JP", city: "Tokyo", region_code: "13", lat: 35.6762, lng: 139.6503 },
    {
      country_name: "United Kingdom",
      country_code: "GB",
      city: "London",
      region_code: "ENG",
      lat: 51.5074,
      lng: -0.1278,
    },
  ]

  const organizations = [
    { name: "Amazon Technologies Inc.", asn: "AS16509", isp: "Amazon.com, Inc." },
    { name: "Google LLC", asn: "AS15169", isp: "Google LLC" },
    { name: "Microsoft Corporation", asn: "AS8075", isp: "Microsoft Corporation" },
    { name: "DigitalOcean, LLC", asn: "AS14061", isp: "DigitalOcean, LLC" },
  ]

  const vulnerabilities = ["CVE-2024-6387", "CVE-2024-3094", "CVE-2023-44487", "CVE-2023-38545"]

  const hosts: EnhancedShodanHost[] = []
  const numResults = Math.floor(Math.random() * 12) + 8

  for (let i = 0; i < numResults; i++) {
    const service = services[Math.floor(Math.random() * services.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const org = organizations[Math.floor(Math.random() * organizations.length)]

    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    const hostname = `host${i}.${org.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`

    const host: EnhancedShodanHost = {
      ip_str: ip,
      port: service.port,
      transport: "tcp",
      product: service.product,
      version: service.version,
      title: service.title,
      data: service.banner,
      banner: service.banner,
      location: {
        country_name: location.country_name,
        country_code: location.country_code,
        city: location.city,
        region_code: location.region_code,
        latitude: location.lat,
        longitude: location.lng,
      },
      org: org.name,
      isp: org.isp,
      asn: org.asn,
      hostnames: [hostname],
      domains: [hostname.split(".").slice(-2).join(".")],
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      tags: ["web", service.product.toLowerCase()],
      cpe: [
        `cpe:2.3:a:${service.product.toLowerCase()}:${service.product.toLowerCase()}:${service.version}:*:*:*:*:*:*:*`,
      ],
    }

    // Add HTTP details for web services
    if (service.port === 80 || service.port === 443) {
      host.http = {
        title: service.title,
        server: service.server,
        status: 200,
        headers: {
          Server: service.server,
          "Content-Type": "text/html; charset=UTF-8",
          "X-Powered-By": Math.random() > 0.5 ? "PHP/8.1.2" : undefined,
        },
        html: `<!DOCTYPE html><html><head><title>${service.title}</title></head><body><h1>${service.title}</h1><p>Server running ${service.product} ${service.version}</p></body></html>`,
        robots_hash: Math.random().toString(36).substring(7),
        favicon: {
          hash: Math.random().toString(36).substring(7),
          data: "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=",
          location: "/favicon.ico",
        },
        components: service.components,
      }
    }

    // Add SSL details for HTTPS services
    if (service.port === 443) {
      host.ssl = {
        cert: {
          subject: {
            CN: hostname,
            O: org.name,
            C: location.country_code,
          },
          issuer: {
            CN: "Let's Encrypt Authority X3",
            O: "Let's Encrypt",
            C: "US",
          },
          serial: Math.random().toString(36).substring(2, 15),
          expired: false,
          expires: new Date(Date.now() + 86400000 * 90).toISOString(),
          issued: new Date(Date.now() - 86400000 * 30).toISOString(),
        },
        chain: ["Let's Encrypt Authority X3", "ISRG Root X1"],
        versions: ["TLSv1.2", "TLSv1.3"],
      }
    }

    // Add vulnerabilities based on query or randomly
    if (query.toLowerCase().includes("vuln") || Math.random() > 0.6) {
      host.vulns = [vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)]]
    }

    // Add screenshot for web services
    if (service.port === 80 || service.port === 443) {
      host.screenshot = {
        data: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`,
        labels: ["web", "server", service.product.toLowerCase()],
      }
    }

    hosts.push(host)
  }

  return hosts
}

export async function searchEnhancedShodan(query: string): Promise<{
  matches: EnhancedShodanHost[]
  total: number
  facets: Record<string, Array<{ value: string; count: number }>>
}> {
  console.log(`Enhanced Shodan search: ${query}`)
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const matches = generateEnhancedShodanData(query)

  // Generate facets
  const facets = {
    country: matches.reduce(
      (acc, host) => {
        const country = acc.find((c) => c.value === host.location.country_code)
        if (country) country.count++
        else acc.push({ value: host.location.country_code, count: 1 })
        return acc
      },
      [] as Array<{ value: string; count: number }>,
    ),
    port: matches.reduce(
      (acc, host) => {
        const port = acc.find((p) => p.value === host.port.toString())
        if (port) port.count++
        else acc.push({ value: host.port.toString(), count: 1 })
        return acc
      },
      [] as Array<{ value: string; count: number }>,
    ),
    product: matches.reduce(
      (acc, host) => {
        if (host.product) {
          const product = acc.find((p) => p.value === host.product)
          if (product) product.count++
          else acc.push({ value: host.product, count: 1 })
        }
        return acc
      },
      [] as Array<{ value: string; count: number }>,
    ),
  }

  return {
    matches,
    total: matches.length + Math.floor(Math.random() * 50000),
    facets,
  }
}

export async function getEnhancedThreatIntel(ip: string): Promise<EnhancedThreatIntel> {
  console.log(`Enhanced threat intel for: ${ip}`)
  await new Promise((resolve) => setTimeout(resolve, 800))

  const countries = ["United States", "China", "Russia", "Germany", "United Kingdom"]
  const cities = ["New York", "Beijing", "Moscow", "Berlin", "London"]
  const country = countries[Math.floor(Math.random() * countries.length)]
  const city = cities[Math.floor(Math.random() * cities.length)]

  return {
    ip,
    reputation_score: Math.floor(Math.random() * 100),
    risk_level: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
    threat_types: ["malware", "botnet", "scanning"].slice(0, Math.floor(Math.random() * 3) + 1),
    malware_families: ["Mirai", "Emotet", "TrickBot"].slice(0, Math.floor(Math.random() * 2) + 1),
    attack_vectors: ["brute_force", "vulnerability_exploitation", "social_engineering"].slice(
      0,
      Math.floor(Math.random() * 2) + 1,
    ),
    geolocation: {
      country,
      country_code: country.substring(0, 2).toUpperCase(),
      city,
      region: "Region",
      timezone: "UTC-5",
      coordinates: [40.7128 + Math.random() * 10, -74.006 + Math.random() * 10],
    },
    network_info: {
      asn: `AS${Math.floor(Math.random() * 65535)}`,
      as_name: "Example AS",
      isp: "Example ISP",
      organization: "Example Organization",
      network_type: "hosting",
    },
    threat_feeds: {
      virustotal: {
        detections: Math.floor(Math.random() * 10),
        total_engines: 70,
        last_scan: new Date().toISOString(),
        malicious_urls: [`http://${ip}/malware.exe`, `https://${ip}/phishing.html`].slice(
          0,
          Math.floor(Math.random() * 2) + 1,
        ),
        communicating_files: [
          {
            sha256: "a".repeat(64),
            name: "malware.exe",
            detection_ratio: "15/70",
          },
        ],
      },
      abuseipdb: {
        abuse_confidence: Math.floor(Math.random() * 100),
        usage_type: "Data Center/Web Hosting/Transit",
        total_reports: Math.floor(Math.random() * 100),
        distinct_users: Math.floor(Math.random() * 50),
        last_reported: new Date().toISOString(),
        categories: ["Malware", "Scanning", "Botnet"].slice(0, Math.floor(Math.random() * 2) + 1),
      },
      greynoise: {
        classification: ["benign", "malicious", "unknown"][Math.floor(Math.random() * 3)],
        noise: Math.random() > 0.5,
        riot: Math.random() > 0.8,
        first_seen: new Date(Date.now() - 86400000 * 30).toISOString(),
        last_seen: new Date().toISOString(),
        actor: "Unknown",
        tags: ["scanner", "malware", "botnet"].slice(0, Math.floor(Math.random() * 2) + 1),
      },
    },
    historical_data: [
      {
        date: new Date(Date.now() - 86400000).toISOString(),
        activity_type: "malware_communication",
        description: "Detected communication with known C&C server",
        severity: "high",
      },
      {
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        activity_type: "port_scanning",
        description: "Aggressive port scanning detected",
        severity: "medium",
      },
    ],
  }
}

export async function getRealTimeEvents(): Promise<RealTimeEvent[]> {
  console.log("Loading real-time threat events")
  await new Promise((resolve) => setTimeout(resolve, 600))

  const events: RealTimeEvent[] = []
  const eventTypes: RealTimeEvent["event_type"][] = [
    "malware_detection",
    "botnet_activity",
    "vulnerability_scan",
    "data_breach",
    "phishing_campaign",
  ]

  for (let i = 0; i < 15; i++) {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const sourceIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

    events.push({
      id: `event-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      event_type: eventType,
      severity: ["info", "low", "medium", "high", "critical"][Math.floor(Math.random() * 5)] as any,
      source: {
        ip: sourceIP,
        country: "United States",
        city: "New York",
        coordinates: [40.7128, -74.006],
        asn: "AS15169",
        organization: "Google LLC",
      },
      target: {
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        port: [80, 443, 22, 3389][Math.floor(Math.random() * 4)],
        service: ["HTTP", "HTTPS", "SSH", "RDP"][Math.floor(Math.random() * 4)],
        country: "Germany",
      },
      details: {
        title: `${eventType.replace("_", " ").toUpperCase()} Detected`,
        description: `Advanced ${eventType.replace("_", " ")} activity detected from ${sourceIP}`,
        indicators: [sourceIP, "suspicious-domain.com", "malware.exe"],
        attack_vector: ["network", "email", "web", "usb"][Math.floor(Math.random() * 4)],
        malware_family: eventType === "malware_detection" ? "Emotet" : undefined,
        cve_ids: eventType === "vulnerability_scan" ? ["CVE-2024-6387"] : undefined,
        urls: [`http://${sourceIP}/malicious-payload`, `https://suspicious-domain.com/phishing`],
        file_hashes: ["a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"],
      },
      references: [
        {
          type: "report",
          title: "Threat Analysis Report",
          url: `https://threatintel.example.com/reports/${eventType}`,
          source: "ThreatIntel Corp",
        },
        {
          type: "ioc",
          title: "Indicators of Compromise",
          url: `https://iocs.example.com/${sourceIP}`,
          source: "IOC Database",
        },
      ],
      mitigation: {
        recommendations: [
          `Block IP address ${sourceIP} at firewall level`,
          "Update security signatures",
          "Monitor for similar patterns",
        ],
        blocking_rules: [`iptables -A INPUT -s ${sourceIP} -j DROP`, `deny ip any host ${sourceIP}`],
        detection_signatures: [
          `alert tcp any any -> any any (msg:"${eventType} detected"; content:"${sourceIP}"; sid:1000001;)`,
        ],
      },
    })
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
