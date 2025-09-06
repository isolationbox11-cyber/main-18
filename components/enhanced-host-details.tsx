"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Globe,
  MapPin,
  Server,
  Shield,
  AlertTriangle,
  ExternalLink,
  Code,
  Lock,
  ImageIcon,
  FileText,
  Network,
  Zap,
  Copy,
  Download,
  Terminal,
  Database,
  Wifi,
  Clock,
  TrendingUp,
} from "lucide-react"
import type { EnhancedShodanHost, EnhancedThreatIntel } from "@/lib/enhanced-api-client"

interface EnhancedHostDetailsProps {
  host: EnhancedShodanHost
  threatIntel?: EnhancedThreatIntel
}

export function EnhancedHostDetails({ host, threatIntel }: EnhancedHostDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showBanner, setShowBanner] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/30"
      case "high":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/30"
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30"
    }
  }

  const getServiceIcon = (product?: string) => {
    if (!product) return <Server className="w-5 h-5" />
    const p = product.toLowerCase()
    if (p.includes("apache") || p.includes("nginx")) return <Globe className="w-5 h-5 text-blue-400" />
    if (p.includes("ssh")) return <Lock className="w-5 h-5 text-green-400" />
    if (p.includes("mysql") || p.includes("mongodb")) return <Database className="w-5 h-5 text-purple-400" />
    return <Server className="w-5 h-5 text-slate-400" />
  }

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">{getServiceIcon(host.product)}</div>
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                {host.ip_str}:{host.port}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`${host.ip_str}:${host.port}`)}
                  className="text-slate-400 hover:text-cyan-400"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
              <p className="text-slate-400">
                {host.product} {host.version} • {host.location.city}, {host.location.country_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {host.vulns && host.vulns.length > 0 && (
              <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {host.vulns.length} CVE{host.vulns.length > 1 ? "s" : ""}
              </Badge>
            )}

            {threatIntel && (
              <Badge className={getSeverityColor(threatIntel.risk_level)}>
                <Shield className="w-3 h-3 mr-1" />
                {threatIntel.risk_level.toUpperCase()}
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://www.shodan.io/host/${host.ip_str}`, "_blank")}
              className="text-slate-400 hover:text-cyan-400"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="intel">Intel</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Info */}
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Product:</span>
                    <span className="text-white font-mono">{host.product || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Version:</span>
                    <span className="text-white font-mono">{host.version || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Port:</span>
                    <span className="text-white font-mono">
                      {host.port}/{host.transport}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Seen:</span>
                    <span className="text-white text-sm">{new Date(host.timestamp).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Country:</span>
                    <span className="text-white">{host.location.country_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City:</span>
                    <span className="text-white">{host.location.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coordinates:</span>
                    <span className="text-white font-mono text-sm">
                      {host.location.latitude.toFixed(4)}, {host.location.longitude.toFixed(4)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${host.location.latitude},${host.location.longitude}`,
                        "_blank",
                      )
                    }
                    className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>

              {/* Organization */}
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Network Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Organization:</span>
                    <span className="text-white text-sm">{host.org}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ISP:</span>
                    <span className="text-white text-sm">{host.isp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ASN:</span>
                    <span className="text-white font-mono">{host.asn}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://bgp.he.net/${host.asn}`, "_blank")}
                    className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Network className="w-4 h-4 mr-2" />
                    BGP Info
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Banner */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Service Banner
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBanner(!showBanner)}
                    className="text-slate-400 hover:text-white"
                  >
                    {showBanner ? "Hide" : "Show"} Banner
                  </Button>
                </div>
              </CardHeader>
              {showBanner && (
                <CardContent>
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                      {host.banner || host.data || "No banner data available"}
                    </pre>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(host.banner || host.data)}
                      className="border-slate-600 text-slate-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([host.banner || host.data], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `${host.ip_str}_${host.port}_banner.txt`
                        a.click()
                      }}
                      className="border-slate-600 text-slate-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            {host.http && (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    HTTP Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400">Title:</span>
                      <p className="text-white font-medium">{host.http.title}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Server:</span>
                      <p className="text-white font-mono">{host.http.server}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Status:</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {host.http.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-slate-400">Components:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {host.http.components.map((comp, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-blue-400 text-blue-400">
                            {comp.name} {comp.version}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">HTTP Headers:</span>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 mt-2">
                      <pre className="text-green-400 font-mono text-sm">
                        {Object.entries(host.http.headers)
                          .filter(([_, value]) => value)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join("\n")}
                      </pre>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`http://${host.ip_str}:${host.port}`, "_blank")}
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Site
                    </Button>
                    {host.screenshot && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(host.screenshot!.data, "_blank")}
                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Screenshot
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CPE Information */}
            {host.cpe && host.cpe.length > 0 && (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    CPE Identifiers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {host.cpe.map((cpe, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-700"
                      >
                        <code className="text-yellow-400 text-sm">{cpe}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://nvd.nist.gov/products/cpe/search/results?namingFormat=2.3&keyword=${encodeURIComponent(cpe)}`,
                              "_blank",
                            )
                          }
                          className="text-slate-400 hover:text-yellow-400"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Vulnerabilities */}
            {host.vulns && host.vulns.length > 0 && (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Vulnerabilities ({host.vulns.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {host.vulns.map((cve, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-red-900/20 p-3 rounded border border-red-500/30"
                      >
                        <div>
                          <span className="text-red-400 font-mono font-medium">{cve}</span>
                          <p className="text-slate-300 text-sm mt-1">
                            Critical security vulnerability - immediate attention required
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cve}`, "_blank")
                            }
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            MITRE
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${cve}`, "_blank")}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            NVD
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SSL Certificate */}
            {host.ssl && (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    SSL Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400">Subject:</span>
                      <p className="text-white font-mono text-sm">{host.ssl.cert.subject.CN}</p>
                      {host.ssl.cert.subject.O && <p className="text-slate-300 text-sm">{host.ssl.cert.subject.O}</p>}
                    </div>
                    <div>
                      <span className="text-slate-400">Issuer:</span>
                      <p className="text-white font-mono text-sm">{host.ssl.cert.issuer.CN}</p>
                      {host.ssl.cert.issuer.O && <p className="text-slate-300 text-sm">{host.ssl.cert.issuer.O}</p>}
                    </div>
                    <div>
                      <span className="text-slate-400">Serial:</span>
                      <p className="text-white font-mono text-sm">{host.ssl.cert.serial}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Valid Until:</span>
                      <p className="text-white text-sm">{new Date(host.ssl.cert.expires).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Supported TLS Versions:</span>
                    <div className="flex gap-2 mt-2">
                      {host.ssl.versions.map((version, idx) => (
                        <Badge key={idx} variant="outline" className="text-green-400 border-green-400">
                          {version}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Certificate Chain:</span>
                    <div className="space-y-1 mt-2">
                      {host.ssl.chain.map((cert, idx) => (
                        <div key={idx} className="text-slate-300 text-sm font-mono bg-slate-900/50 p-2 rounded">
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hostnames */}
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    Hostnames & Domains
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-slate-400">Hostnames:</span>
                    <div className="space-y-1 mt-2">
                      {host.hostnames.map((hostname, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                          <span className="text-cyan-400 font-mono text-sm">{hostname}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://${hostname}`, "_blank")}
                            className="text-slate-400 hover:text-cyan-400"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Domains:</span>
                    <div className="space-y-1 mt-2">
                      {host.domains.map((domain, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                          <span className="text-purple-400 font-mono text-sm">{domain}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://whois.net/whois/${domain}`, "_blank")}
                            className="text-slate-400 hover:text-purple-400"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Service Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {host.tags?.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-orange-400 border-orange-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Web Tab */}
          <TabsContent value="web" className="space-y-6">
            {host.http ? (
              <>
                {/* HTML Preview */}
                <Card className="bg-slate-800/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      HTML Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-64">
                        {host.http.html}
                      </pre>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(host.http!.html)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy HTML
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const blob = new Blob([host.http!.html], { type: "text/html" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `${host.ip_str}_${host.port}.html`
                          a.click()
                        }}
                        className="border-slate-600 text-slate-300"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Favicon */}
                {host.http.favicon && (
                  <Card className="bg-slate-800/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-purple-400 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Favicon
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                      <img
                        src={host.http.favicon.data || "/placeholder.svg"}
                        alt="Favicon"
                        className="w-8 h-8 bg-white p-1 rounded"
                      />
                      <div>
                        <p className="text-white font-mono text-sm">{host.http.favicon.location}</p>
                        <p className="text-slate-400 text-sm">Hash: {host.http.favicon.hash}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardContent className="p-8 text-center">
                  <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No web service detected on this host</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Intel Tab */}
          <TabsContent value="intel" className="space-y-6">
            {threatIntel ? (
              <>
                {/* Threat Overview */}
                <Card className="bg-slate-800/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Threat Intelligence Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-red-400">{threatIntel.reputation_score}</div>
                        <div className="text-sm text-slate-400">Reputation Score</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400">
                          {threatIntel.threat_feeds.virustotal.detections}
                        </div>
                        <div className="text-sm text-slate-400">VT Detections</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400">
                          {threatIntel.threat_feeds.abuseipdb.total_reports}
                        </div>
                        <div className="text-sm text-slate-400">Abuse Reports</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{threatIntel.malware_families.length}</div>
                        <div className="text-sm text-slate-400">Malware Families</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400">Threat Types:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {threatIntel.threat_types.map((type, idx) => (
                          <Badge key={idx} variant="destructive" className="bg-red-500/20 text-red-400">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400">Malware Families:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {threatIntel.malware_families.map((family, idx) => (
                          <Badge key={idx} variant="outline" className="text-purple-400 border-purple-400">
                            {family}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Historical Activity */}
                <Card className="bg-slate-800/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Historical Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {threatIntel.historical_data.map((event, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-slate-900/50 rounded border border-slate-700"
                          >
                            <div className="flex-shrink-0">
                              <Clock className="w-4 h-4 text-slate-400 mt-1" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white font-medium">{event.activity_type.replace("_", " ")}</span>
                                <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                              </div>
                              <p className="text-slate-300 text-sm">{event.description}</p>
                              <p className="text-slate-400 text-xs mt-1">{new Date(event.date).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* IOCs and URLs */}
                {threatIntel.threat_feeds.virustotal.malicious_urls.length > 0 && (
                  <Card className="bg-slate-800/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-orange-400 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Malicious URLs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {threatIntel.threat_feeds.virustotal.malicious_urls.map((url, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-orange-900/20 p-2 rounded border border-orange-500/30"
                          >
                            <code className="text-orange-400 text-sm">{url}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(url)}
                              className="text-slate-400 hover:text-orange-400"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardContent className="p-8 text-center">
                  <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No threat intelligence data available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
