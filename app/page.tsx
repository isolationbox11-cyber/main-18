"use client"

import { useState, useCallback } from "react"
import { FloatingOrbs } from "@/components/floating-orbs"
import { BeginnerGuide } from "@/components/beginner-guide"
import { ThreatWorldMap } from "@/components/threat-world-map"
import { LiveBotnetTracker } from "@/components/live-botnet-tracker"
import { GoogleDorkExplorer } from "@/components/google-dork-explorer"
import { LiveThreatFeed } from "@/components/live-threat-feed"
import { SearchInterface } from "@/components/search-interface"
import { EnhancedHostCard } from "@/components/enhanced-host-card"
import { AdvancedShodanDashboard } from "@/components/advanced-shodan-dashboard"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Shield, Globe, Activity, Search, AlertTriangle, Zap, BookOpen } from "lucide-react"
import { searchShodan, getComprehensiveThreatIntel } from "@/lib/api-client"
import type { ShodanHost } from "@/lib/api-client"

export default function SalemCyberVault() {
  const [searchResults, setSearchResults] = useState<ShodanHost[]>([])
  const [threatIntelData, setThreatIntelData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentQuery, setCurrentQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("search")

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    setCurrentQuery(query)

    try {
      const shodanResults = await searchShodan(query)
      const hosts = shodanResults?.matches || []
      setSearchResults(hosts)
      setTotalResults(shodanResults?.total || 0)

      // Get threat intelligence for unique IPs
      const uniqueIPs = [...new Set(hosts.map((host: any) => host.ip_str))].slice(0, 10)

      if (uniqueIPs.length > 0) {
        const threatIntelPromises = uniqueIPs.map(async (ip) => {
          try {
            const intel = await getComprehensiveThreatIntel(ip)
            return { ip, intel }
          } catch (error) {
            console.warn(`Failed to get threat intel for ${ip}:`, error)
            return { ip, intel: null }
          }
        })

        const threatIntelResults = await Promise.all(threatIntelPromises)
        const threatIntelMap = threatIntelResults.reduce(
          (acc, { ip, intel }) => {
            acc[ip] = intel
            return acc
          },
          {} as Record<string, any>,
        )

        setThreatIntelData(threatIntelMap)
      }

      setActiveTab("search-results")
    } catch (error) {
      console.error("Search failed:", error)
      setError(error instanceof Error ? error.message : "Search failed. Please check your API keys.")
      setSearchResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 relative overflow-hidden">
      {/* Floating Orbs Background */}
      <FloatingOrbs />

      {/* Header */}
      <header className="relative z-10 border-b border-purple-800/30 bg-slate-900/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            {/* Main Title */}
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🦇</span>
                </div>
                <div className="absolute inset-0 bg-purple-400/20 rounded-2xl blur-lg animate-pulse"></div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Salem Cyber Vault
              </h1>
            </div>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive Cybersecurity Intelligence Platform
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                CVE Intelligence
              </Badge>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 px-4 py-2">
                <Search className="w-4 h-4 mr-2" />
                Shodan Integration
              </Badge>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Threat Mapping
              </Badge>
              <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10 px-4 py-2">
                <Activity className="w-4 h-4 mr-2" />
                Botnet Tracking
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Beginner Guide */}
        <div className="mb-8">
          <BeginnerGuide />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/30 border-slate-700/50 backdrop-blur-xl">
            <TabsTrigger
              value="search"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger
              value="cve-intel"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              CVE Intel
            </TabsTrigger>
            <TabsTrigger
              value="threat-map"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Threat Map
            </TabsTrigger>
            <TabsTrigger
              value="botnets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Botnets
            </TabsTrigger>
            <TabsTrigger
              value="dorking"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Dorking
            </TabsTrigger>
            <TabsTrigger
              value="guide"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Guide
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-8">
            <SearchInterface onSearch={handleSearch} loading={loading} resultCount={totalResults} />

            {/* Search Results */}
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
                    <EnhancedHostCard
                      key={`${host.ip_str}-${host.port}-${index}`}
                      host={host}
                      threatIntel={threatIntelData[host.ip_str]}
                    />
                  ))}
                </div>
              </div>
            )}

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

          {/* CVE Intelligence Tab */}
          <TabsContent value="cve-intel" className="space-y-8">
            <AdvancedShodanDashboard />
          </TabsContent>

          {/* Threat Map Tab */}
          <TabsContent value="threat-map" className="space-y-8">
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
          <TabsContent value="dorking" className="space-y-8">
            <GoogleDorkExplorer />
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-8">
            <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-8">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Cybersecurity Learning Center</h2>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  Master the art of cybersecurity intelligence gathering with our comprehensive guides, tutorials, and
                  best practices. Learn to use advanced tools safely and ethically.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Card className="bg-slate-800/30 border-slate-600 p-6">
                    <Shield className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Security Fundamentals</h3>
                    <p className="text-slate-400 text-sm">Learn the basics of cybersecurity and threat intelligence</p>
                  </Card>
                  <Card className="bg-slate-800/30 border-slate-600 p-6">
                    <Search className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">OSINT Techniques</h3>
                    <p className="text-slate-400 text-sm">Master open source intelligence gathering methods</p>
                  </Card>
                  <Card className="bg-slate-800/30 border-slate-600 p-6">
                    <Eye className="w-8 h-8 text-green-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Ethical Guidelines</h3>
                    <p className="text-slate-400 text-sm">Understand responsible disclosure and ethical hacking</p>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-400 border-t border-slate-800/50 pt-8">
          <div className="space-y-2">
            <p className="text-lg font-medium">
              🦇 CyberWatch Vault - Comprehensive Cybersecurity Intelligence Platform
            </p>
            <p className="text-sm">
              Powered by CVEDB, Shodan, VirusTotal, AbuseIPDB, GreyNoise & Google Custom Search APIs
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
