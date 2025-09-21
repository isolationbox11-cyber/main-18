// Enhanced data generator with more realistic and detailed information
export interface DetailedShodanHost {
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
  ssl?: {
    cert: {
      subject: { CN: string }
      issuer: { CN: string }
      serial: string
      expired: boolean
      expires: string
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

export interface DetailedThreatIntel {
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

export interface RealWorldExample {
  title: string
  description: string
  category: string
  riskLevel: "info" | "low" | "medium" | "high" | "critical"
  realWorldUrl: string
  screenshot?: string
  details: {
    vulnerability?: string
    impact: string
    mitigation: string
    references: string[]
  }
}

// Generate more realistic Shodan data with actual services and banners
export function generateDetailedShodanData(query: string): DetailedShodanHost[] {
  const realServices = [
    {
      product: "Apache httpd",
      version: "2.4.41",
      port: 80,
      banner:
        "HTTP/1.1 200 OK\r\nDate: Wed, 09 Oct 2024 12:34:56 GMT\r\nServer: Apache/2.4.41 (Ubuntu)\r\nContent-Type: text/html",
      title: "Apache2 Ubuntu Default Page: It works",
      html: "<html><head><title>Apache2 Ubuntu Default Page</title></head><body><h1>It works!</h1></body></html>",
      headers: {
        Server: "Apache/2.4.41 (Ubuntu)",
        "Content-Type": "text/html; charset=UTF-8",
        "X-Powered-By": "PHP/7.4.3",
      },
    },
    {
      product: "OpenSSH",
      version: "8.2p1",
      port: 22,
      banner: "SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5",
      title: "SSH Service",
      html: "",
      headers: {},
    },
    {
      product: "nginx",
      version: "1.18.0",
      port: 443,
      banner: "HTTP/1.1 200 OK\r\nServer: nginx/1.18.0 (Ubuntu)\r\nDate: Wed, 09 Oct 2024 12:34:56 GMT",
      title: "Welcome to nginx!",
      html: "<html><head><title>Welcome to nginx!</title></head><body><h1>Welcome to nginx!</h1><p>If you see this page, the nginx web server is successfully installed and working.</p></body></html>",
      headers: {
        Server: "nginx/1.18.0 (Ubuntu)",
        "Content-Type": "text/html",
        "X-Frame-Options": "DENY",
      },
    },
    {
      product: "Microsoft IIS httpd",
      version: "10.0",
      port: 80,
      banner: "HTTP/1.1 200 OK\r\nServer: Microsoft-IIS/10.0\r\nX-Powered-By: ASP.NET",
      title: "IIS Windows Server",
      html: "<html><head><title>IIS Windows Server</title></head><body><h1>Internet Information Services</h1></body></html>",
      headers: {
        Server: "Microsoft-IIS/10.0",
        "X-Powered-By": "ASP.NET",
        "X-AspNet-Version": "4.0.30319",
      },
    },
    {
      product: "Hikvision IP Camera",
      version: "5.5.0",
      port: 80,
      banner: "HTTP/1.1 200 OK\r\nServer: App-webs/\r\nContent-Type: text/html",
      title: "Web Service",
      html: "<html><head><title>Web Service</title></head><body><div id='loginForm'>IP Camera Login</div></body></html>",
      headers: {
        Server: "App-webs/",
        "Content-Type": "text/html",
      },
    },
    {
      product: "Postfix smtpd",
      version: "3.4.13",
      port: 25,
      banner: "220 mail.example.com ESMTP Postfix (Ubuntu)",
      title: "SMTP Service",
      html: "",
      headers: {},
    },
  ]

  const realLocations = [
    { country: "United States", city: "New York", code: "US", lat: 40.7128, lng: -74.006 },
    { country: "Germany", city: "Berlin", code: "DE", lat: 52.52, lng: 13.405 },
    { country: "Japan", city: "Tokyo", code: "JP", lat: 35.6762, lng: 139.6503 },
    { country: "United Kingdom", city: "London", code: "GB", lat: 51.5074, lng: -0.1278 },
    { country: "France", city: "Paris", code: "FR", lat: 48.8566, lng: 2.3522 },
    { country: "Canada", city: "Toronto", code: "CA", lat: 43.6532, lng: -79.3832 },
    { country: "Australia", city: "Sydney", code: "AU", lat: -33.8688, lng: 151.2093 },
    { country: "Netherlands", city: "Amsterdam", code: "NL", lat: 52.3676, lng: 4.9041 },
  ]

  const realOrganizations = [
    { name: "Amazon Technologies Inc.", asn: "AS16509" },
    { name: "Google LLC", asn: "AS15169" },
    { name: "Microsoft Corporation", asn: "AS8075" },
    { name: "DigitalOcean, LLC", asn: "AS14061" },
    { name: "Cloudflare, Inc.", asn: "AS13335" },
    { name: "Hetzner Online GmbH", asn: "AS24940" },
    { name: "OVH SAS", asn: "AS16276" },
    { name: "Linode, LLC", asn: "AS63949" },
  ]

  const realVulnerabilities = [
    "CVE-2024-6387", // OpenSSH vulnerability
    "CVE-2024-3094", // XZ Utils backdoor
    "CVE-2023-44487", // HTTP/2 Rapid Reset
    "CVE-2023-38545", // curl SOCKS5 heap buffer overflow
    "CVE-2023-4911", // glibc buffer overflow
    "CVE-2022-47939", // keePassXC vulnerability
    "CVE-2022-40684", // Fortinet authentication bypass
    "CVE-2021-44228", // Log4j RCE
  ]

  const hosts: DetailedShodanHost[] = []
  const numResults = Math.floor(Math.random() * 20) + 10

  for (let i = 0; i < numResults; i++) {
    const service = realServices[Math.floor(Math.random() * realServices.length)]
    const location = realLocations[Math.floor(Math.random() * realLocations.length)]
    const org = realOrganizations[Math.floor(Math.random() * realOrganizations.length)]

    // Generate realistic IP addresses
    const ipRanges = [
      () =>
        `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
      () =>
        `185.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`, // European range
      () =>
        `104.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`, // US range
    ]
    const ip = ipRanges[Math.floor(Math.random() * ipRanges.length)]()

    const host: DetailedShodanHost = {
      ip_str: ip,
      port: service.port,
      transport: "tcp",
      product: service.product,
      version: service.version,
      title: service.title,
      banner: service.banner,
      location: {
        country_name: location.country,
        city: location.city,
        region_code: location.code,
        latitude: location.lat + (Math.random() - 0.5) * 0.1,
        longitude: location.lng + (Math.random() - 0.5) * 0.1,
      },
      org: org.name,
      isp: org.name,
      asn: org.asn,
      hostnames: [`host${i}.example.com`, `www${i}.example.com`],
      domains: [`example${i}.com`],
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
      tags: service.port === 80 || service.port === 443 ? ["web", "http"] : ["service"],
    }

    // Add HTTP details for web services
    if (service.port === 80 || service.port === 443) {
      host.http = {
        status: 200,
        title: service.title,
        server: service.headers.Server || service.product,
        headers: service.headers,
        html: service.html,
      }
      host.screenshot = `/placeholder.svg?height=300&width=400&text=Screenshot+of+${encodeURIComponent(service.title)}`
      host.favicon = `/placeholder.svg?height=32&width=32&text=🌐`
    }

    // Add SSL for HTTPS services
    if (service.port === 443) {
      host.ssl = {
        cert: {
          subject: { CN: `${host.hostnames[0]}` },
          issuer: { CN: "Let's Encrypt Authority X3" },
          serial: Math.random().toString(36).substring(2, 15),
          expired: false,
          expires: new Date(Date.now() + 86400000 * 90).toISOString(),
        },
      }
    }

    // Add vulnerabilities based on query or randomly
    if (query.toLowerCase().includes("vuln") || query.toLowerCase().includes("cve") || Math.random() > 0.6) {
      const numVulns = Math.floor(Math.random() * 3) + 1
      host.vulns = []
      for (let j = 0; j < numVulns; j++) {
        const vuln = realVulnerabilities[Math.floor(Math.random() * realVulnerabilities.length)]
        if (!host.vulns.includes(vuln)) {
          host.vulns.push(vuln)
        }
      }
    }

    hosts.push(host)
  }

  return hosts
}

// Generate detailed threat intelligence with more context
export function generateDetailedThreatIntel(ip: string): DetailedThreatIntel {
  const threatCategories = [
    "Malware C&C",
    "Botnet",
    "Phishing",
    "Spam",
    "Scanning",
    "Brute Force",
    "DDoS",
    "Exploit Kit",
    "Ransomware",
    "Banking Trojan",
    "Cryptomining",
  ]

  const usageTypes = [
    "Data Center/Web Hosting/Transit",
    "Commercial",
    "Educational/Academic",
    "Government",
    "Military",
    "Residential",
    "Content Delivery Network",
    "Fixed Line ISP",
  ]

  const services = [
    "HTTP",
    "HTTPS",
    "SSH",
    "FTP",
    "SMTP",
    "DNS",
    "Telnet",
    "SNMP",
    "RDP",
    "VNC",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
  ]

  const malwareHashes = [
    "d41d8cd98f00b204e9800998ecf8427e",
    "5d41402abc4b2a76b9719d911017c592",
    "098f6bcd4621d373cade4e832627b4f6",
    "e3b0c44298fc1c149afbf4c8996fb924",
    "adc83b19e793491b1c6ea0fd8b46cd9f",
  ]

  const abuseConfidence = Math.floor(Math.random() * 100)
  const riskScore = Math.floor(Math.random() * 100)

  return {
    ip,
    reputation: abuseConfidence > 75 ? "malicious" : abuseConfidence > 25 ? "suspicious" : "clean",
    abuseConfidence,
    countryCode: ["US", "CN", "RU", "DE", "GB", "FR", "NL", "CA"][Math.floor(Math.random() * 8)],
    city: ["New York", "Beijing", "Moscow", "Berlin", "London", "Paris", "Amsterdam", "Toronto"][
      Math.floor(Math.random() * 8)
    ],
    isp:
      ["Amazon", "Google", "Microsoft", "DigitalOcean", "Cloudflare", "Hetzner"][Math.floor(Math.random() * 6)] +
      " Inc.",
    asn: `AS${Math.floor(Math.random() * 65535)}`,
    usageType: usageTypes[Math.floor(Math.random() * usageTypes.length)],
    totalReports: Math.floor(Math.random() * 500),
    categories: threatCategories.slice(0, Math.floor(Math.random() * 4) + 1),
    lastReportedAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    whitelisted: Math.random() > 0.9,
    malwareHashes: malwareHashes.slice(0, Math.floor(Math.random() * 3)),
    openPorts: [80, 443, 22, 21, 25, 53, 110, 143, 993, 995].slice(0, Math.floor(Math.random() * 6) + 1),
    services: services.slice(0, Math.floor(Math.random() * 5) + 1),
    riskScore,
    threatTypes: abuseConfidence > 50 ? threatCategories.slice(0, Math.floor(Math.random() * 3) + 1) : [],
    firstSeen: new Date(Date.now() - Math.random() * 86400000 * 365).toISOString(),
    lastSeen: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
  }
}

// Generate real-world examples with actual links and detailed information
export function generateRealWorldExamples(): RealWorldExample[] {
  return [
    {
      title: "Exposed Elasticsearch Cluster",
      description: "Publicly accessible Elasticsearch instance containing sensitive data without authentication",
      category: "Data Exposure",
      riskLevel: "critical",
      realWorldUrl: "https://www.elastic.co/guide/en/elasticsearch/reference/current/security-minimal-setup.html",
      screenshot: "/placeholder.svg?height=200&width=300&text=Elasticsearch+Dashboard",
      details: {
        vulnerability: "CVE-2021-22134",
        impact: "Unauthorized access to sensitive data, potential data theft, compliance violations",
        mitigation: "Enable authentication, configure proper access controls, use VPN or firewall restrictions",
        references: [
          "https://www.elastic.co/guide/en/elasticsearch/reference/current/security-minimal-setup.html",
          "https://nvd.nist.gov/vuln/detail/CVE-2021-22134",
          "https://www.shodan.io/search?query=elasticsearch",
        ],
      },
    },
    {
      title: "Default Webcam Interface",
      description: "IP camera with default credentials accessible from the internet",
      category: "IoT Security",
      riskLevel: "high",
      realWorldUrl:
        "https://www.cisa.gov/news-events/alerts/2013/04/12/risks-default-passwords-internet-connected-devices",
      screenshot: "/placeholder.svg?height=200&width=300&text=IP+Camera+Login",
      details: {
        vulnerability: "Default/Weak Authentication",
        impact: "Unauthorized surveillance, privacy violations, potential use in botnets",
        mitigation: "Change default passwords, enable two-factor authentication, restrict network access",
        references: [
          "https://www.cisa.gov/news-events/alerts/2013/04/12/risks-default-passwords-internet-connected-devices",
          "https://www.shodan.io/search?query=hikvision",
          "https://www.fbi.gov/news/press-releases/fbi-warns-of-teleconferencing-and-online-classroom-hijacking-during-covid-19-pandemic",
        ],
      },
    },
    {
      title: "Exposed Database Backup",
      description: "SQL database backup file accessible via directory listing",
      category: "Data Leak",
      riskLevel: "critical",
      realWorldUrl: "https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration",
      screenshot: "/placeholder.svg?height=200&width=300&text=Directory+Listing",
      details: {
        vulnerability: "Directory Traversal / Information Disclosure",
        impact: "Complete database compromise, customer data theft, financial loss",
        mitigation:
          "Disable directory listings, move sensitive files outside web root, implement proper access controls",
        references: [
          "https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration",
          "https://cwe.mitre.org/data/definitions/22.html",
          "https://www.google.com/search?q=intitle%3A%22index+of%22+%22backup%22",
        ],
      },
    },
    {
      title: "Unsecured MongoDB Instance",
      description: "MongoDB database without authentication containing user records",
      category: "Database Security",
      riskLevel: "critical",
      realWorldUrl: "https://docs.mongodb.com/manual/security/",
      screenshot: "/placeholder.svg?height=200&width=300&text=MongoDB+Interface",
      details: {
        vulnerability: "Missing Authentication",
        impact: "Data breach, ransomware attacks, regulatory fines, reputation damage",
        mitigation: "Enable authentication, configure network restrictions, regular security audits",
        references: [
          "https://docs.mongodb.com/manual/security/",
          "https://www.shodan.io/search?query=mongodb",
          "https://blog.shodan.io/its-the-data-stupid/",
        ],
      },
    },
    {
      title: "Exposed Admin Panel",
      description: "Web application admin interface accessible without proper authentication",
      category: "Web Security",
      riskLevel: "high",
      realWorldUrl: "https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication",
      screenshot: "/placeholder.svg?height=200&width=300&text=Admin+Login+Panel",
      details: {
        vulnerability: "Broken Authentication",
        impact: "Complete system compromise, data manipulation, service disruption",
        mitigation: "Implement strong authentication, use multi-factor authentication, restrict admin access",
        references: [
          "https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication",
          "https://www.google.com/search?q=intitle%3A%22admin%22+%22login%22",
          "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
        ],
      },
    },
  ]
}
