"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  Shield,
  Globe,
  Clock,
  MapPin,
  Eye,
  ExternalLink,
  Copy,
  Download,
  FileText,
  Target,
  Skull,
} from "lucide-react"
import { getRealTimeEvents, type RealTimeEvent } from "@/lib/enhanced-api-client"

export function RealTimeEventsFeed() {
  const [events, setEvents] = useState<RealTimeEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<RealTimeEvent | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getRealTimeEvents()
        setEvents(data)
      } catch (error) {
        console.error("Failed to load real-time events:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
    const interval = setInterval(loadEvents, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 border-red-400 bg-red-500/10"
      case "high":
        return "text-orange-400 border-orange-400 bg-orange-500/10"
      case "medium":
        return "text-yellow-400 border-yellow-400 bg-yellow-500/10"
      case "low":
        return "text-green-400 border-green-400 bg-green-500/10"
      default:
        return "text-slate-400 border-slate-400 bg-slate-500/10"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "malware_detection":
        return <Skull className="w-4 h-4 text-red-400" />
      case "botnet_activity":
        return <Activity className="w-4 h-4 text-purple-400" />
      case "vulnerability_scan":
        return <Shield className="w-4 h-4 text-orange-400" />
      case "data_breach":
        return <Eye className="w-4 h-4 text-red-400" />
      case "phishing_campaign":
        return <Target className="w-4 h-4 text-yellow-400" />
      default:
        return <Globe className="w-4 h-4 text-slate-400" />
    }
  }

  const filteredEvents = filter === "all" ? events : events.filter((event) => event.event_type === filter)

  const eventCounts = {
    all: events.length,
    malware_detection: events.filter((e) => e.event_type === "malware_detection").length,
    botnet_activity: events.filter((e) => e.event_type === "botnet_activity").length,
    vulnerability_scan: events.filter((e) => e.event_type === "vulnerability_scan").length,
    data_breach: events.filter((e) => e.event_type === "data_breach").length,
    phishing_campaign: events.filter((e) => e.event_type === "phishing_campaign").length,
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
        <CardContent className="p-8 text-center">
          <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-400">Loading real-time threat events... 🕸️</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Real-Time Threat Events 👻
          <Badge variant="outline" className="text-orange-400 border-orange-400 animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(eventCounts).map(([type, count]) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
              className={`${
                filter === type
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
              }`}
            >
              {type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1)} ({count})
            </Button>
          ))}
        </div>

        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/30">
            <TabsTrigger value="feed">Event Feed</TabsTrigger>
            <TabsTrigger value="details">Event Details</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No {filter === "all" ? "" : filter.replace("_", " ")} events detected</p>
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="bg-slate-800/30 border-slate-600 cursor-pointer hover:bg-slate-800/50 transition-all"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getEventIcon(event.event_type)}
                            <div>
                              <h4 className="font-medium text-white">{event.details.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>
                                  {event.source.city}, {event.source.country}
                                </span>
                                <Clock className="w-3 h-3 ml-2" />
                                <span>{event.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${getSeverityColor(event.severity)}`}>
                              {event.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                              {event.event_type.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm mb-3">{event.details.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Source:</span>
                            <span className="ml-2 text-slate-300 font-mono">{event.source.ip}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Target:</span>
                            <span className="ml-2 text-slate-300 font-mono">
                              {event.target.ip || event.target.domain || "Multiple"}
                            </span>
                          </div>
                        </div>

                        {/* Indicators */}
                        {event.details.indicators.length > 0 && (
                          <div className="mt-3">
                            <span className="text-slate-400 text-sm">IOCs:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {event.details.indicators.slice(0, 3).map((indicator, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-red-400 text-red-400">
                                  {indicator}
                                </Badge>
                              ))}
                              {event.details.indicators.length > 3 && (
                                <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                                  +{event.details.indicators.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {selectedEvent ? (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-3">
                      {getEventIcon(selectedEvent.event_type)}
                      {selectedEvent.details.title}
                      <Badge className={getSeverityColor(selectedEvent.severity)}>
                        {selectedEvent.severity.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEvent(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-cyan-400 font-medium mb-3">Source Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">IP Address:</span>
                          <span className="text-white font-mono">{selectedEvent.source.ip}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Location:</span>
                          <span className="text-white">
                            {selectedEvent.source.city}, {selectedEvent.source.country}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ASN:</span>
                          <span className="text-white font-mono">{selectedEvent.source.asn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Organization:</span>
                          <span className="text-white text-xs">{selectedEvent.source.organization}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-purple-400 font-medium mb-3">Target Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Target:</span>
                          <span className="text-white font-mono">
                            {selectedEvent.target.ip || selectedEvent.target.domain || "Multiple"}
                          </span>
                        </div>
                        {selectedEvent.target.port && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Port:</span>
                            <span className="text-white font-mono">{selectedEvent.target.port}</span>
                          </div>
                        )}
                        {selectedEvent.target.service && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Service:</span>
                            <span className="text-white">{selectedEvent.target.service}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-400">Attack Vector:</span>
                          <span className="text-white">{selectedEvent.details.attack_vector}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicators of Compromise */}
                  <div>
                    <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Indicators of Compromise
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 text-sm">IP Addresses:</span>
                        <div className="space-y-1 mt-2">
                          {selectedEvent.details.indicators
                            .filter((i) => /^\d+\.\d+\.\d+\.\d+$/.test(i))
                            .map((ip, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                                <span className="text-red-400 font-mono text-sm">{ip}</span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(ip)}
                                    className="text-slate-400 hover:text-red-400"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(`https://www.shodan.io/host/${ip}`, "_blank")}
                                    className="text-slate-400 hover:text-red-400"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 text-sm">Domains/URLs:</span>
                        <div className="space-y-1 mt-2">
                          {selectedEvent.details.urls?.map((url, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                              <span className="text-orange-400 font-mono text-sm truncate">{url}</span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(url)}
                                  className="text-slate-400 hover:text-orange-400"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    window.open(`https://urlvoid.com/scan/${encodeURIComponent(url)}`, "_blank")
                                  }
                                  className="text-slate-400 hover:text-orange-400"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* File Hashes */}
                  {selectedEvent.details.file_hashes && selectedEvent.details.file_hashes.length > 0 && (
                    <div>
                      <h4 className="text-yellow-400 font-medium mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        File Hashes
                      </h4>
                      <div className="space-y-2">
                        {selectedEvent.details.file_hashes.map((hash, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                            <span className="text-yellow-400 font-mono text-sm">{hash}</span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(hash)}
                                className="text-slate-400 hover:text-yellow-400"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`https://www.virustotal.com/gui/file/${hash}`, "_blank")}
                                className="text-slate-400 hover:text-yellow-400"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CVE Information */}
                  {selectedEvent.details.cve_ids && selectedEvent.details.cve_ids.length > 0 && (
                    <div>
                      <h4 className="text-purple-400 font-medium mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Related CVEs
                      </h4>
                      <div className="space-y-2">
                        {selectedEvent.details.cve_ids.map((cve, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                            <span className="text-purple-400 font-mono text-sm">{cve}</span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cve}`, "_blank")
                                }
                                className="text-slate-400 hover:text-purple-400"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${cve}`, "_blank")}
                                className="text-slate-400 hover:text-purple-400"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mitigation */}
                  <div>
                    <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Mitigation & Response
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-slate-400 text-sm">Recommendations:</span>
                        <ul className="mt-2 space-y-1">
                          {selectedEvent.mitigation.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-green-300 text-sm flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-slate-400 text-sm">Blocking Rules:</span>
                        <div className="mt-2 space-y-1">
                          {selectedEvent.mitigation.blocking_rules.map((rule, idx) => (
                            <div key={idx} className="bg-slate-900/50 p-2 rounded border border-slate-700">
                              <code className="text-green-400 text-sm">{rule}</code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(rule)}
                                className="ml-2 text-slate-400 hover:text-green-400"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 text-sm">Detection Signatures:</span>
                        <div className="mt-2 space-y-1">
                          {selectedEvent.mitigation.detection_signatures.map((sig, idx) => (
                            <div key={idx} className="bg-slate-900/50 p-2 rounded border border-slate-700">
                              <code className="text-blue-400 text-sm">{sig}</code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(sig)}
                                className="ml-2 text-slate-400 hover:text-blue-400"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* References */}
                  <div>
                    <h4 className="text-blue-400 font-medium mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      References & Reports
                    </h4>
                    <div className="space-y-2">
                      {selectedEvent.references.map((ref, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-900/50 p-3 rounded border border-slate-700"
                        >
                          <div>
                            <p className="text-white font-medium">{ref.title}</p>
                            <p className="text-slate-400 text-sm">
                              {ref.source} • {ref.type}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(ref.url, "_blank")}
                            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const eventData = JSON.stringify(selectedEvent, null, 2)
                        const blob = new Blob([eventData], { type: "application/json" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `threat_event_${selectedEvent.id}.json`
                        a.click()
                      }}
                      className="border-slate-600 text-slate-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(selectedEvent, null, 2))}
                      className="border-slate-600 text-slate-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardContent className="p-8 text-center">
                  <Eye className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select an event from the feed to view detailed information</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Educational Note */}
        <Card className="bg-purple-900/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-400 mb-1">Understanding Real-Time Events 🔮</h4>
                <p className="text-sm text-purple-300">
                  This feed shows live cybersecurity events detected across the internet. Each event includes detailed
                  indicators of compromise (IOCs), mitigation strategies, and actionable intelligence. Security teams
                  use this data to detect, respond to, and prevent similar attacks in their environments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
