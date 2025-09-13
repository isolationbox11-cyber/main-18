// Advanced Shodan API client with full endpoint coverage and proper error handling
const SHODAN_API_KEY = process.env.NEXT_PUBLIC_SHODAN_API_KEY || ""
const SHODAN_BASE_URL = "https://api.shodan.io"

// Check if API key is properly configured
const isValidApiKey = (apiKey: string) => {
  return (
    apiKey &&
    apiKey.length > 10 &&
    !apiKey.includes("YOUR_") &&
    !apiKey.includes("your_") &&
    apiKey !== "AhDvNPMS9KJyCK7K1BBlDWvDHQ34BHPa"
  ) // Remove demo key
}

// Fallback data generators
const generateFallbackPorts = (): number[] => [
  21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 1433, 1521, 3306, 3389, 5432, 5900, 8080, 8443, 9200,
]

const generateFallbackProtocols = (): Record<string, string> => ({
  http: "Hypertext Transfer Protocol",
  https: "HTTP Secure",
  ssh: "Secure Shell",
  ftp: "File Transfer Protocol",
  telnet: "Telnet Protocol",
  smtp: "Simple Mail Transfer Protocol",
  dns: "Domain Name System",
  mysql: "MySQL Database",
  postgresql: "PostgreSQL Database",
  mongodb: "MongoDB Database",
})

const generateFallbackFacets = (): string[] => [
  "country",
  "city",
  "port",
  "org",
  "domain",
  "product",
  "version",
  "asn",
  "isp",
]

export interface ShodanHostDetails {
  ip_str: string
  ports: number[]
  hostnames: string[]
  country_name: string
  city: string
  region_code: string
  area_code: number
  postal_code: string
  dma_code: number
  country_code: string
  latitude: number
  longitude: number
  org: string
  isp: string
  asn: string
  last_update: string
  data: ShodanService[]
  vulns: string[]
  tags: string[]
}

export interface ShodanService {
  port: number
  transport: string
  product: string
  version: string
  data: string
  timestamp: string
  vulns: string[]
  cpe: string[]
  location: {
    country_name: string
    city: string
    region_code: string
  }
  ssl?: {
    cert: {
      subject: { CN: string }
      issuer: { CN: string }
      expired: boolean
    }
  }
}

export interface ShodanAlert {
  id: string
  name: string
  filters: Record<string, any>
  expires: string
  expiration: string
  created: string
  size: number
}

export interface ShodanScan {
  id: string
  status: "SUBMITTING" | "QUEUE" | "PROCESSING" | "DONE"
  created: string
  credits_left: number
}

export interface ShodanFacets {
  [key: string]: Array<{
    value: string
    count: number
  }>
}

// Enhanced host lookup with full details
export async function getShodanHostDetails(ip: string): Promise<ShodanHostDetails | null> {
  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/host/${ip}?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Host ${ip} not found in Shodan`)
        return null
      }
      throw new Error(`Shodan API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to get host details for ${ip}:`, error)
    return null
  }
}

// Advanced search with facets
export async function advancedShodanSearch(
  query: string,
  options: {
    facets?: string[]
    page?: number
    minify?: boolean
  } = {},
): Promise<{
  matches: any[]
  total: number
  facets?: ShodanFacets
}> {
  try {
    const params = new URLSearchParams({
      key: SHODAN_API_KEY,
      query,
      page: (options.page || 1).toString(),
    })

    if (options.facets) {
      params.append("facets", options.facets.join(","))
    }

    if (options.minify) {
      params.append("minify", "true")
    }

    const response = await fetch(`${SHODAN_BASE_URL}/shodan/host/search?${params}`)

    if (!response.ok) {
      throw new Error(`Shodan search error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Advanced Shodan search failed:", error)
    throw error
  }
}

// Get search result count without full data
export async function getShodanSearchCount(query: string): Promise<number> {
  try {
    const response = await fetch(
      `${SHODAN_BASE_URL}/shodan/host/count?key=${SHODAN_API_KEY}&query=${encodeURIComponent(query)}`,
    )

    if (!response.ok) {
      throw new Error(`Shodan count error: ${response.status}`)
    }

    const result = await response.json()
    return result.total || 0
  } catch (error) {
    console.error("Shodan count failed:", error)
    return 0
  }
}

// Get available search facets
export async function getShodanSearchFacets(): Promise<string[]> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Shodan API key not configured, using fallback facets data")
    return generateFallbackFacets()
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/host/search/facets?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid Shodan API key, using fallback facets data")
        return generateFallbackFacets()
      }
      throw new Error(`Shodan facets error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get Shodan facets:", error)
    return generateFallbackFacets()
  }
}

// Get available search filters
export async function getShodanSearchFilters(): Promise<string[]> {
  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/host/search/filters?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      throw new Error(`Shodan filters error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get Shodan filters:", error)
    return []
  }
}

// On-demand scanning
export async function requestShodanScan(ips: string[]): Promise<ShodanScan | null> {
  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/scan?key=${SHODAN_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ips: ips.join(","),
      }),
    })

    if (!response.ok) {
      throw new Error(`Shodan scan request error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to request Shodan scan:", error)
    return null
  }
}

// Get scan status
export async function getShodanScanStatus(scanId: string): Promise<ShodanScan | null> {
  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/scan/${scanId}?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      throw new Error(`Shodan scan status error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to get scan status for ${scanId}:`, error)
    return null
  }
}

// Network Alerts Management
export async function createShodanAlert(
  name: string,
  filters: Record<string, any>,
  expires?: number,
): Promise<ShodanAlert | null> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Cannot create Shodan alert: API key not configured")
    return null
  }

  try {
    const body: any = { name, filters }
    if (expires) body.expires = expires

    const response = await fetch(`${SHODAN_BASE_URL}/shodan/alert?key=${SHODAN_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid Shodan API key for alert creation")
        return null
      }
      throw new Error(`Shodan alert creation error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to create Shodan alert:", error)
    return null
  }
}

export async function getShodanAlerts(): Promise<ShodanAlert[]> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Shodan API key not configured, using demo alerts")
    return [
      {
        id: "demo-alert-1",
        name: "Demo Network Monitor",
        filters: { query: "net:192.168.1.0/24" },
        expires: new Date(Date.now() + 86400000 * 30).toISOString(),
        expiration: new Date(Date.now() + 86400000 * 30).toISOString(),
        created: new Date().toISOString(),
        size: 42,
      },
    ]
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/alert/info?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid Shodan API key for alerts")
        return []
      }
      throw new Error(`Shodan alerts error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get Shodan alerts:", error)
    return []
  }
}

// Delete alert
export async function deleteShodanAlert(alertId: string): Promise<boolean> {
  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/alert/${alertId}?key=${SHODAN_API_KEY}`, {
      method: "DELETE",
    })

    return response.ok
  } catch (error) {
    console.error(`Failed to delete alert ${alertId}:`, error)
    return false
  }
}

// DNS Methods
export async function getShodanDNSInfo(domain: string): Promise<any> {
  try {
    const response = await fetch(`${SHODAN_BASE_URL}/dns/domain/${domain}?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      throw new Error(`Shodan DNS error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to get DNS info for ${domain}:`, error)
    return null
  }
}

// Resolve hostname to IP
export async function resolveDNS(hostnames: string[]): Promise<Record<string, string>> {
  try {
    const response = await fetch(
      `${SHODAN_BASE_URL}/dns/resolve?key=${SHODAN_API_KEY}&hostnames=${hostnames.join(",")}`,
    )

    if (!response.ok) {
      throw new Error(`Shodan DNS resolve error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to resolve DNS:", error)
    return {}
  }
}

// Reverse DNS lookup
export async function reverseDNS(ips: string[]): Promise<Record<string, string[]>> {
  try {
    const response = await fetch(`${SHODAN_BASE_URL}/dns/reverse?key=${SHODAN_API_KEY}&ips=${ips.join(",")}`)

    if (!response.ok) {
      throw new Error(`Shodan reverse DNS error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to reverse DNS lookup:", error)
    return {}
  }
}

// Utility methods
export async function getMyIP(): Promise<string | null> {
  try {
    const response = await fetch(`${SHODAN_BASE_URL}/tools/myip?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      throw new Error(`Shodan myip error: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    console.error("Failed to get my IP:", error)
    return null
  }
}

// Get HTTP headers for a website
export async function getHTTPHeaders(url: string): Promise<any> {
  try {
    const response = await fetch(`${SHODAN_BASE_URL}/tools/httpheaders?key=${SHODAN_API_KEY}&url=${url}`)

    if (!response.ok) {
      throw new Error(`Shodan HTTP headers error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to get HTTP headers for ${url}:`, error)
    return null
  }
}

// Get API info and credits
export async function getShodanAPIInfo(): Promise<{
  query_credits: number
  scan_credits: number
  telnet: boolean
  plan: string
  https: boolean
  unlocked: boolean
}> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Shodan API key not configured, using demo API info")
    return {
      query_credits: 100,
      scan_credits: 10,
      telnet: false,
      plan: "demo",
      https: true,
      unlocked: false,
    }
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/api-info?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid Shodan API key, using demo API info")
        return {
          query_credits: 0,
          scan_credits: 0,
          telnet: false,
          plan: "invalid_key",
          https: false,
          unlocked: false,
        }
      }
      throw new Error(`Shodan API info error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get Shodan API info:", error)
    return {
      query_credits: 0,
      scan_credits: 0,
      telnet: false,
      plan: "error",
      https: false,
      unlocked: false,
    }
  }
}

// Get available ports for scanning
export async function getShodanPorts(): Promise<number[]> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Shodan API key not configured, using fallback ports data")
    return generateFallbackPorts()
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/ports?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid Shodan API key, using fallback ports data")
        return generateFallbackPorts()
      }
      throw new Error(`Shodan ports error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get Shodan ports:", error)
    return generateFallbackPorts()
  }
}

// Get supported protocols
export async function getShodanProtocols(): Promise<Record<string, string>> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Shodan API key not configured, using fallback protocols data")
    return generateFallbackProtocols()
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/protocols?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid Shodan API key, using fallback protocols data")
        return generateFallbackProtocols()
      }
      throw new Error(`Shodan protocols error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get Shodan protocols:", error)
    return generateFallbackProtocols()
  }
}

// Search Shodan queries database
export async function searchShodanQueries(
  query: string,
  page = 1,
): Promise<{
  matches: Array<{
    title: string
    description: string
    query: string
    votes: number
    timestamp: string
    tags: string[]
  }>
  total: number
}> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Shodan API key not configured, using demo queries")
    return {
      matches: [
        {
          title: "Apache Servers",
          description: "Find Apache web servers",
          query: "apache",
          votes: 156,
          timestamp: new Date().toISOString(),
          tags: ["web", "apache"],
        },
        {
          title: "SSH Servers",
          description: "Discover SSH services",
          query: "port:22",
          votes: 89,
          timestamp: new Date().toISOString(),
          tags: ["ssh", "remote"],
        },
        {
          title: "Webcams",
          description: "Find internet-connected cameras",
          query: "webcam",
          votes: 234,
          timestamp: new Date().toISOString(),
          tags: ["iot", "camera"],
        },
      ],
      total: 3,
    }
  }

  try {
    const response = await fetch(
      `${SHODAN_BASE_URL}/shodan/query/search?key=${SHODAN_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    )

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid Shodan API key for query search")
        return { matches: [], total: 0 }
      }
      throw new Error(`Shodan query search error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to search Shodan queries:", error)
    return { matches: [], total: 0 }
  }
}

// Get popular query tags
export async function getShodanQueryTags(size = 10): Promise<Array<{ value: string; count: number }>> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Shodan API key not configured, using demo tags")
    return [
      { value: "apache", count: 1234 },
      { value: "nginx", count: 987 },
      { value: "ssh", count: 756 },
      { value: "mysql", count: 543 },
      { value: "webcam", count: 432 },
      { value: "ftp", count: 321 },
      { value: "telnet", count: 234 },
      { value: "mongodb", count: 198 },
    ]
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/query/tags?key=${SHODAN_API_KEY}&size=${size}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid Shodan API key for query tags")
        return []
      }
      throw new Error(`Shodan query tags error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get Shodan query tags:", error)
    return []
  }
}
