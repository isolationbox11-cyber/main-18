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
  Eye,
  ExternalLink,
  Code,
  Lock,
  Camera,
  Terminal,
  FileText,
  Network,
  Clock,
  Copy,
  Download,
  Zap,
} from "lucide-react"
import type { DetailedShodanHost, DetailedThreatIntel } from "@/lib/enhanced-data-generator"

interface EnhancedHostDetailsProps {
  host: DetailedShodanHost
  threatIntel?: DetailedThreatIntel
}

export function EnhancedHostDetails({ host, threatIntel }: EnhancedHostDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const getServiceIcon = (product?: string, port?: number) => {
    if (!product && !port) return <Server className="w-5 h-5" />

    const p = product?.toLowerCase() || ""
    if (p.includes("apache") || p.includes("nginx") || p.includes("iis"))
      return <Globe className="w-5 h-5 text-blue-400" />
    if (p.includes("ssh")) return <Terminal className="w-5 h-5 text-green-400" />
    if (p.includes("camera") || p.includes("hikvision")) return <Camera className="w-5 h-5 text-purple-400" />
    if (p.includes("mysql") || p.includes("mongodb") || p.includes("postgres"))
      return <FileText className="w-5 h-5 text-orange-400" />
    if (port === 443) return <Lock className="w-5 h-5 text-green-400" />
    return <Server className="w-5 h-5 text-slate-400" />
  }

  const getRiskLevel = () => {
    let score = 0
    if (host.vulns && host.vulns.length > 0) score += host.vulns.length * 2
    if (threatIntel?.abuseConfidence && threatIntel.abuseConfidence > 50) score += 3
    if (threatIntel?.reputation === "malicious") score += 4
    if (host.product?.toLowerCase().includes("camera")) score += 2

    if (score > 8) return { level: "critical", color: "text-red-400", bg: "bg-red-500/10" }
    if (score > 5) return { level: "high", color: "text-orange-400", bg: "bg-orange-500/10" }
    if (score > 2) return { level: "medium", color: "text-yellow-400", bg: "bg-yellow-500/10" }
    return { level: "low", color: "text-green-400", bg: "bg-green-500/10" }
  }

  const risk = getRiskLevel()

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            {getServiceIcon(host.product, host.port)}
            {host.ip_str}:{host.port}
            <Badge className={`${risk.bg} ${risk.color} border-current/30`}>{risk.level.toUpperCase()}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(host.ip_str, "IP")}
              className="text-slate-400 hover:text-cyan-400"
            >
              <Copy className="w-4 h-4" />
              {copiedText === "IP" ? "Copied!" : "Copy IP"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://www.shodan.io/host/${host.ip_str}`, "_blank")}
              className="text-slate-400 hover:text-cyan-400"
            >
              <ExternalLink className="w-4 h-4" />
              Shodan
            </Button>
          </div>
        </div>
        <div className="text-slate-400">
          {host.product} {host.version} • {host.location.city}, {host.location.country_name} • {host.org}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="service" className="data-[state=active]:bg-blue-600">
              <Server className="w-4 h-4 mr-2" />
              Service
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-red-600">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-purple-600">
              <Network className="w-4 h-4 mr-2" />
              Network
            </TabsTrigger>
            <TabsTrigger value="intel" className="data-[state=active]:bg-orange-600">
              <Zap className="w-4 h-4 mr-2" />
              Intel
            </TabsTrigger>
            <TabsTrigger value="raw" className="data-[state=active]:bg-green-600">
              <Code className="w-4 h-4 mr-2" />
              Raw Data
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Host Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">IP Address:</span>
                      <span className="ml-2 text-white font-mono">{host.ip_str}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Port:</span>
                      <span className="ml-2 text-white">
                        {host.port}/{host.transport}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Service:</span>
                      <span className="ml-2 text-white">{host.product}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Version:</span>
                      <span className="ml-2 text-white">{host.version || "Unknown"}</span>
                    </div>
                  </div>

                  {host.title && (
                    <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-sm text-slate-400 mb-1">Service Title:</div>
                      <div className="text-white font-medium">{host.title}</div>
                    </div>
                  )}

                  {host.hostnames.length > 0 && (
                    <div>
                      <div className="text-sm text-slate-400 mb-2">Hostnames:</div>
                      <div className="flex flex-wrap gap-1">
                        {host.hostnames.map((hostname, index) => (
                          <Badge key={index} variant="outline" className="text-cyan-400 border-cyan-400/30">
                            {hostname}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location & Organization */}
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400">Location:</span>
                      <span className="ml-2 text-white">
                        {host.location.city}, {host.location.country_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Coordinates:</span>
                      <span className="ml-2 text-white font-mono">
                        {host.location.latitude.toFixed(4)}, {host.location.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Organization:</span>
                      <span className="ml-2 text-white">{host.org}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">ISP:</span>
                      <span className="ml-2 text-white">{host.isp}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">ASN:</span>
                      <span className="ml-2 text-white font-mono">{host.asn}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${host.location.latitude},${host.location.longitude}`,
                          "_blank",
                        )
                      }
                      className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Screenshot/Visual */}
            {host.screenshot && (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Service Screenshot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <img
                      src={host.screenshot || "/placeholder.svg"}
                      alt="Service Screenshot"
                      className="w-full max-w-md mx-auto rounded-lg border border-slate-600"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(host.screenshot, "_blank")}
                        className="bg-black/50 text-white hover:bg-black/70"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Service Tab */}
          <TabsContent value="service" className="space-y-6">
            {host.http && (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    HTTP Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Status Code:</span>
                      <Badge
                        className={
                          host.http.status === 200 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }
                      >
                        {host.http.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-slate-400">Server:</span>
                      <span className="ml-2 text-white">{host.http.server}</span>
                    </div>
                  </div>

                  {/* HTTP Headers */}
                  <div>
                    <h4 className="text-white font-medium mb-2">HTTP Headers</h4>
                    <ScrollArea className="h-32 bg-slate-900/50 rounded-lg p-3">
                      <div className="space-y-1 text-sm font-mono">
                        {Object.entries(host.http.headers).map(([key, value]) => (
                          <div key={key} className="flex">
                            <span className="text-cyan-400 min-w-0 flex-shrink-0">{key}:</span>
                            <span className="text-slate-300 ml-2 break-all">{value}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* HTML Preview */}
                  {host.http.html && (
                    <div>
                      <h4 className="text-white font-medium mb-2">HTML Content Preview</h4>
                      <ScrollArea className="h-32 bg-slate-900/50 rounded-lg p-3">
                        <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                          {host.http.html.substring(0, 500)}
                          {host.http.html.length > 500 && "..."}
                        </pre>
                      </ScrollArea>
                    </div>
                  )}

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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`http://${host.ip_str}:${host.port}`, "URL")}
                      className="border-slate-500/30 text-slate-400 hover:bg-slate-500/10"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedText === "URL" ? "Copied!" : "Copy URL"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Banner Information */}
            {host.banner && (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Service Banner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 bg-slate-900/50 rounded-lg p-3">
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{host.banner}</pre>
                  </ScrollArea>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(host.banner || "", "Banner")}
                      className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedText === "Banner" ? "Copied!" : "Copy Banner"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Vulnerabilities */}
            {host.vulns && host.vulns.length > 0 && (
              <Card className="bg-red-900/20 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Known Vulnerabilities ({host.vulns.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {host.vulns.map((cve, index) => (
                      <Card key={index} className="bg-slate-800/30 border-slate-600 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="destructive" className="font-mono">
                            {cve}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${cve}`, "_blank")}
                              className="text-slate-400 hover:text-red-400"
                            >
                              <ExternalLink className="w-3 h-3" />
                              NVD
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cve}`, "_blank")
                              }
                              className="text-slate-400 hover:text-red-400"
                            >
                              <ExternalLink className="w-3 h-3" />
                              MITRE
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-slate-300">
                          Critical security vulnerability - Click links above for detailed information
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SSL Certificate */}
            {host.ssl && (
              <Card className="bg-green-900/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    SSL Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Subject:</span>
                      <span className="ml-2 text-white font-mono">{host.ssl.cert.subject.CN}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Issuer:</span>
                      <span className="ml-2 text-white">{host.ssl.cert.issuer.CN}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Serial:</span>
                      <span className="ml-2 text-white font-mono">{host.ssl.cert.serial}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Expires:</span>
                      <span className="ml-2 text-white">{new Date(host.ssl.cert.expires).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        host.ssl.cert.expired ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                      }
                    >
                      {host.ssl.cert.expired ? "Expired" : "Valid"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Network Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ASN:</span>
                      <span className="text-white font-mono">{host.asn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Organization:</span>
                      <span className="text-white">{host.org}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ISP:</span>
                      <span className="text-white">{host.isp}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Scan Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Seen:</span>
                      <span className="text-white">{new Date(host.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transport:</span>
                      <span className="text-white uppercase">{host.transport}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            {host.tags && host.tags.length > 0 && (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Service Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {host.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-cyan-400 border-cyan-400/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Threat Intelligence Tab */}
          <TabsContent value="intel" className="space-y-6">
            {threatIntel ? (
              <div className="space-y-6">
                {/* Reputation Overview */}
                <Card className="bg-slate-800/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-orange-400 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Threat Intelligence Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400">{threatIntel.riskScore}</div>
                        <div className="text-sm text-slate-400">Risk Score</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-red-400">{threatIntel.abuseConfidence}%</div>
                        <div className="text-sm text-slate-400">Abuse Confidence</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400">{threatIntel.totalReports}</div>
                        <div className="text-sm text-slate-400">Total Reports</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <Badge
                          className={
                            threatIntel.reputation === "malicious"
                              ? "bg-red-500/20 text-red-400"
                              : threatIntel.reputation === "suspicious"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                          }
                        >
                          {threatIntel.reputation.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Threat Categories */}
                {threatIntel.categories.length > 0 && (
                  <Card className="bg-slate-800/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-red-400">Threat Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {threatIntel.categories.map((category, index) => (
                          <Badge key={index} variant="destructive" className="bg-red-500/20 text-red-400">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Services and Ports */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Detected Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {threatIntel.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-blue-400 border-blue-400/30">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-purple-400">Open Ports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {threatIntel.openPorts.map((port, index) => (
                          <Badge key={index} variant="outline" className="text-purple-400 border-purple-400/30">
                            {port}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Malware Hashes */}
                {threatIntel.malwareHashes.length > 0 && (
                  <Card className="bg-red-900/20 border-red-500/30">
                    <CardHeader>
                      <CardTitle className="text-red-400">Associated Malware Hashes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {threatIntel.malwareHashes.map((hash, index) => (
                          <div key={index} className="flex items-center justify-between bg-slate-800/30 p-2 rounded">
                            <span className="font-mono text-sm text-red-400">{hash}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`https://www.virustotal.com/gui/file/${hash}`, "_blank")}
                              className="text-slate-400 hover:text-red-400"
                            >
                              <ExternalLink className="w-3 h-3" />
                              VirusTotal
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardContent className="p-8 text-center">
                  <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <div className="text-slate-400">No threat intelligence data available</div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Raw Data Tab */}
          <TabsContent value="raw" className="space-y-6">
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Raw JSON Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 bg-slate-900/50 rounded-lg p-4">
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                    {JSON.stringify(host, null, 2)}
                  </pre>
                </ScrollArea>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(host, null, 2), "JSON")}
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedText === "JSON" ? "Copied!" : "Copy JSON"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(host, null, 2)], { type: "application/json" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `shodan-${host.ip_str}-${host.port}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
