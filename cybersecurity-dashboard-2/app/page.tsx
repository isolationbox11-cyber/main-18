"use client"

import { useState, useCallback } from "react"
import { FloatingEyes } from "@/components/floating-eyes"
import { BeginnerGuide } from "@/components/beginner-guide"
import { ThreatWorldMap } from "@/components/threat-world-map"
import { LiveBotnetTracker } from "@/components/live-botnet-tracker"
import { GoogleDorkExplorer } from "@/components/google-dork-explorer"
import { LiveThreatFeed } from "@/components/live-threat-feed"
import { SearchInterface } from "@/components/search-interface"
import { EnhancedHostDetails } from "@/components/enhanced-host-details"
import { RealWorldExamplesShowcase } from "@/components/real-world-examples-showcase"
import { AdvancedShodanDashboard } from "@/components/advanced-shodan-dashboard"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Shield, Globe, Activity, Search, TrendingUp, AlertTriangle, Zap, Settings, BookOpen } from "lucide-react"
import { searchShodan, generateDetailedThreatIntel } from "@/lib/api-client"
import type { ShodanHost } from "@/lib/api-client"

export default function CyberWatchVault() {
  const [searchResults, setSearchResults] = useState<ShodanHost[]>([])
  const [threatIntelData, setThreatIntelData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentQuery, setCurrentQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedHost, setSelectedHost] = useState<ShodanHost | null>(null)

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    setCurrentQuery(query)
    setSelectedHost(null)

    try {
      const shodanResults = await searchShodan(query)
      const hosts = shodanResults?.matches || []
      setSearchResults(hosts)
      setTotalResults(shodanResults?.total || 0)

      // Get enhanced threat intelligence for unique IPs
      const uniqueIPs = [...new Set(hosts.map((host: any) => host.ip_str))].slice(0, 10)

      if (uniqueIPs.length > 0) {
        const threatIntelMap: Record<string, any> = {}

        for (const ip of uniqueIPs) {
          try {
            // Use enhanced threat intel generator
            const intel = generateDetailedThreatIntel(ip)
            threatIntelMap[ip] = intel
          } catch (error) {
            console.warn(`Failed to get threat intel for ${ip}:`, error)
            threatIntelMap[ip] = null
          }
        }

        setThreatIntelData(threatIntelMap)
      }

      setActiveTab("search-results")
    } catch (error) {
      console.error("Search failed:", error)
      setError(error instanceof Error ? error.message : "Search failed. Please try again.")
      setSearchResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleHostSelect = (host: ShodanHost) => {
    setSelectedHost(host)
    setActiveTab("host-details")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Floating Eyes Background */}
      <FloatingEyes />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-lg animate-pulse text-red-600"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Salem Cyber Vault
                </h1>
                <p className="text-slate-400">Advanced Internet Intelligence Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                <Activity className="w-3 h-3 mr-1" />
                Enhanced Data
              </Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <Shield className="w-3 h-3 mr-1" />
                Real Examples
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Beginner Guide */}
        <BeginnerGuide />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-8 bg-slate-800/30 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
              <Globe className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-blue-600">
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Threats
            </TabsTrigger>
            <TabsTrigger value="botnets" className="data-[state=active]:bg-purple-600">
              <Activity className="w-4 h-4 mr-2" />
              Botnets
            </TabsTrigger>
            <TabsTrigger value="dorks" className="data-[state=active]:bg-orange-600">
              <Zap className="w-4 h-4 mr-2" />
              Dorks
            </TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-pink-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-green-600">
              <Settings className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="search-results" className="data-[state=active]:bg-indigo-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ThreatWorldMap />
              <LiveThreatFeed />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">2.1M+</div>
                    <div className="text-sm text-slate-400">Devices Monitored</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">847</div>
                    <div className="text-sm text-slate-400">Active Threats</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">23</div>
                    <div className="text-sm text-slate-400">Active Botnets</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">195</div>
                    <div className="text-sm text-slate-400">Countries Covered</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-8">
            <SearchInterface onSearch={handleSearch} loading={loading} resultCount={totalResults} />
          </TabsContent>

          {/* Threats Tab */}
          <TabsContent value="threats" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ThreatWorldMap />
              <LiveThreatFeed />
            </div>
          </TabsContent>

          {/* Botnets Tab */}
          <TabsContent value="botnets" className="space-y-8">
            <LiveBotnetTracker />
          </TabsContent>

          {/* Google Dorks Tab */}
          <TabsContent value="dorks" className="space-y-8">
            <GoogleDorkExplorer />
          </TabsContent>

          {/* Real-World Examples Tab */}
          <TabsContent value="examples" className="space-y-8">
            <RealWorldExamplesShowcase />
          </TabsContent>

          {/* Advanced Shodan Tab */}
          <TabsContent value="advanced" className="space-y-8">
            <AdvancedShodanDashboard />
          </TabsContent>

          {/* Search Results Tab */}
          <TabsContent value="search-results" className="space-y-8">
            {error && (
              <Card className="bg-red-900/20 border-red-500/30 p-6">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">Search Error</h3>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {searchResults.length > 0 && !loading && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    Search Results
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                      {currentQuery}
                    </Badge>
                  </h2>

                  <div className="text-sm text-slate-400">
                    Showing {searchResults.length} of {totalResults.toLocaleString()} results
                  </div>
                </div>

                <div className="grid gap-6">
                  {searchResults.map((host, index) => (
                    <Card
                      key={`${host.ip_str}-${host.port}-${index}`}
                      className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl hover:bg-slate-900/60 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleHostSelect(host)}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-800/50 rounded-lg">
                              <Globe className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-mono text-white group-hover:text-cyan-400 transition-colors">
                                {host.ip_str}:{host.port}
                              </h3>
                              <p className="text-slate-400 text-sm">
                                {host.product} {host.version && `v${host.version}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {host.vulns && host.vulns.length > 0 && (
                              <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {host.vulns.length} CVE{host.vulns.length > 1 ? "s" : ""}
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-slate-500 text-slate-300">
                              Click for Details
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            <span className="text-slate-400">Location:</span>
                            <span>
                              {host.location.city}, {host.location.country_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <span className="text-slate-400">Organization:</span>
                            <span className="truncate">{host.org}</span>
                          </div>
                        </div>

                        {host.title && (
                          <div className="mt-3 p-2 bg-slate-800/30 rounded text-sm text-slate-300">
                            <strong>Service Title:</strong> {host.title}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length === 0 && !loading && currentQuery && (
              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-12">
                <div className="text-center">
                  <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Results Found</h3>
                  <p className="text-slate-400">
                    No devices or services found for "{currentQuery}". Try a different search query.
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Host Details Tab */}
          <TabsContent value="host-details" className="space-y-8">
            {selectedHost ? (
              <EnhancedHostDetails host={selectedHost} threatIntel={threatIntelData[selectedHost.ip_str]} />
            ) : (
              <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-12">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Host Selected</h3>
                  <p className="text-slate-400">Search for hosts and click on a result to view detailed information.</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
