// Advanced Shodan API client with proper error handling and fallbacks
const SHODAN_API_KEY = process.env.NEXT_PUBLIC_SHODAN_API_KEY || ""
const SHODAN_BASE_URL = "https://api.shodan.io"

// Check if API key is properly configured
const isValidApiKey = (apiKey: string) => {
  return apiKey && apiKey.length > 10 && !apiKey.includes("YOUR_") && !apiKey.includes("undefined") && apiKey !== "null"
}

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

// Fallback data generators
const generateFallbackPorts = (): number[] => [
  21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 1433, 1521, 3306, 3389, 5432, 5900, 6379, 8080, 8443,
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
  redis: "Redis Database",
  mongodb: "MongoDB Database",
  vnc: "Virtual Network Computing",
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
  "transport",
]

const generateFallbackQueryTags = (): Array<{ value: string; count: number }> => [
  { value: "webcam", count: 15420 },
  { value: "apache", count: 12890 },
  { value: "nginx", count: 9876 },
  { value: "ssh", count: 8765 },
  { value: "mysql", count: 6543 },
  { value: "mongodb", count: 5432 },
  { value: "redis", count: 4321 },
  { value: "elasticsearch", count: 3210 },
  { value: "docker", count: 2109 },
  { value: "kubernetes", count: 1987 },
]

const generateFallbackQueries = () => ({
  matches: [
    {
      title: "Find Apache Servers",
      description: "Discover Apache web servers worldwide",
      query: "apache",
      votes: 156,
      timestamp: new Date().toISOString(),
      tags: ["web", "apache", "http"],
    },
    {
      title: "SSH Servers by Country",
      description: "Find SSH servers in specific countries",
      query: "port:22 country:US",
      votes: 134,
      timestamp: new Date().toISOString(),
      tags: ["ssh", "security", "remote"],
    },
    {
      title: "Webcam Discovery",
      description: "Locate internet-connected cameras",
      query: "webcam",
      votes: 98,
      timestamp: new Date().toISOString(),
      tags: ["iot", "camera", "surveillance"],
    },
    {
      title: "Database Servers",
      description: "Find exposed database servers",
      query: "mysql mongodb postgresql",
      votes: 87,
      timestamp: new Date().toISOString(),
      tags: ["database", "mysql", "mongodb"],
    },
    {
      title: "Industrial Control Systems",
      description: "Discover SCADA and industrial systems",
      query: "scada modbus",
      votes: 76,
      timestamp: new Date().toISOString(),
      tags: ["industrial", "scada", "iot"],
    },
  ],
  total: 5,
})

// Enhanced host lookup with fallback
export async function getShodanHostDetails(ip: string): Promise<ShodanHostDetails | null> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn(`Host lookup for ${ip} using fallback data (API key not configured)`)
    return null
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/host/${ip}?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Host ${ip} not found in Shodan`)
        return null
      }
      if (response.status === 401) {
        console.warn(`Shodan API authentication failed for host lookup`)
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

// Advanced search with fallback
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
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn(`Shodan search for "${query}" using fallback data (API key not configured)`)
    // Return realistic fallback data
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      matches: [],
      total: 0,
      facets: {},
    }
  }

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
      if (response.status === 401) {
        console.warn("Shodan API authentication failed")
        return { matches: [], total: 0 }
      }
      throw new Error(`Shodan search error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Advanced Shodan search failed:", error)
    return { matches: [], total: 0 }
  }
}

// Get search result count with fallback
export async function getShodanSearchCount(query: string): Promise<number> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn(`Shodan count for "${query}" using fallback data`)
    return Math.floor(Math.random() * 10000) + 1000
  }

  try {
    const response = await fetch(
      `${SHODAN_BASE_URL}/shodan/host/count?key=${SHODAN_API_KEY}&query=${encodeURIComponent(query)}`,
    )

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Shodan API authentication failed for count")
        return 0
      }
      throw new Error(`Shodan count error: ${response.status}`)
    }

    const result = await response.json()
    return result.total || 0
  } catch (error) {
    console.error("Shodan count failed:", error)
    return 0
  }
}

// Get available search facets with fallback
export async function getShodanSearchFacets(): Promise<string[]> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Using fallback facets data")
    return generateFallbackFacets()
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/host/search/facets?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Shodan API authentication failed for facets")
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

// Get available search filters with fallback
export async function getShodanSearchFilters(): Promise<string[]> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Using fallback filters data")
    return generateFallbackFacets() // Same as facets for fallback
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/host/search/filters?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Shodan API authentication failed for filters")
        return generateFallbackFacets()
      }
      throw new Error(`Shodan filters error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get Shodan filters:", error)
    return generateFallbackFacets()
  }
}

// Get API info and credits with fallback
export async function getShodanAPIInfo(): Promise<{
  query_credits: number
  scan_credits: number
  telnet: boolean
  plan: string
  https: boolean
  unlocked: boolean
}> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Using fallback API info")
    return {
      query_credits: 100,
      scan_credits: 100,
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
        console.warn("Shodan API authentication failed for API info")
        return {
          query_credits: 0,
          scan_credits: 0,
          telnet: false,
          plan: "invalid",
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

// Get available ports for scanning with fallback
export async function getShodanPorts(): Promise<number[]> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Using fallback ports data")
    return generateFallbackPorts()
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/ports?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Shodan API authentication failed for ports")
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

// Get supported protocols with fallback
export async function getShodanProtocols(): Promise<Record<string, string>> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Using fallback protocols data")
    return generateFallbackProtocols()
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/protocols?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Shodan API authentication failed for protocols")
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

// Get all alerts with fallback
export async function getShodanAlerts(): Promise<ShodanAlert[]> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Using fallback alerts data")
    return []
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/alert/info?key=${SHODAN_API_KEY}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Shodan API authentication failed for alerts")
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

// Create alert with fallback
export async function createShodanAlert(
  name: string,
  filters: Record<string, any>,
  expires?: number,
): Promise<ShodanAlert | null> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Cannot create alert - API key not configured")
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
        console.warn("Shodan API authentication failed for alert creation")
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

// Search Shodan queries database with fallback
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
    console.warn("Using fallback queries data")
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateFallbackQueries()
  }

  try {
    const response = await fetch(
      `${SHODAN_BASE_URL}/shodan/query/search?key=${SHODAN_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    )

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Shodan API authentication failed for query search")
        return generateFallbackQueries()
      }
      throw new Error(`Shodan query search error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to search Shodan queries:", error)
    return generateFallbackQueries()
  }
}

// Get popular query tags with fallback
export async function getShodanQueryTags(size = 10): Promise<Array<{ value: string; count: number }>> {
  if (!isValidApiKey(SHODAN_API_KEY)) {
    console.warn("Using fallback query tags data")
    return generateFallbackQueryTags().slice(0, size)
  }

  try {
    const response = await fetch(`${SHODAN_BASE_URL}/shodan/query/tags?key=${SHODAN_API_KEY}&size=${size}`)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Shodan API authentication failed for query tags")
        return generateFallbackQueryTags().slice(0, size)
      }
      throw new Error(`Shodan query tags error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to get Shodan query tags:", error)
    return generateFallbackQueryTags().slice(0, size)
  }
}

// Utility function to check API status
export function getShodanAPIStatus(): {
  configured: boolean
  keyValid: boolean
  message: string
} {
  const configured = !!SHODAN_API_KEY
  const keyValid = isValidApiKey(SHODAN_API_KEY)

  let message = "API Status Unknown"
  if (!configured) {
    message = "API key not provided"
  } else if (!keyValid) {
    message = "API key appears invalid"
  } else {
    message = "API key configured"
  }

  return {
    configured,
    keyValid,
    message,
  }
}
