"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skull, AlertTriangle, Shield } from "lucide-react"

interface ThreatEvent {
  id: string
  type: "malware" | "phishing" | "breach" | "vulnerability"
  description: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  source: string
}

export function RealTimeThreatFeed() {
  const [threats, setThreats] = useState<ThreatEvent[]>([])

  useEffect(() => {
    let isMounted = true;
    async function fetchThreats() {
      try {
        const res = await fetch("/api/live-threat-feed");
  if (!res.ok) { throw new Error("Failed to fetch live threat feed"); }
        const data = await res.json();
        if (isMounted) {
          setThreats(data.slice(0, 10));
        }
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchThreats();
    const interval = setInterval(fetchThreats, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 border-red-400"
      case "high":
        return "text-orange-400 border-orange-400"
      case "medium":
        return "text-yellow-400 border-yellow-400"
      case "low":
        return "text-green-400 border-green-400"
      default:
        return "text-slate-400 border-slate-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "malware":
        return <Skull className="w-4 h-4 text-red-400" />
      case "phishing":
        return <AlertTriangle className="w-4 h-4 text-orange-400" />
      case "breach":
        return <Shield className="w-4 h-4 text-purple-400" />
      case "vulnerability":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      default:
        return <Shield className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center gap-2">
          👻 Live Threat Feed
          <Badge variant="outline" className="text-orange-400 border-orange-400 animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {threats.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <Skull className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Monitoring the digital underworld...</p>
            </div>
          ) : (
            threats.map((threat) => (
              <div key={threat.id} className="p-3 bg-slate-900/30 rounded border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(threat.type)}
                    <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400">{threat.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300 text-sm mb-2">{threat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Source: {threat.source}</span>
                  <Badge variant="secondary" className="text-xs bg-slate-700">
                    {threat.type.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
