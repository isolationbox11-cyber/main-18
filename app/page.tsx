"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComprehensiveCVEIntelligencePanel } from "@/components/comprehensive-cve-intelligence-panel"
import { DarkWebIntelligencePanel } from "@/components/dark-web-intelligence-panel"
import { RussianDarknetPanel } from "@/components/russian-darknet-panel"
import { ThreatWorldMap } from "@/components/threat-world-map"
import { LiveBotnetTracker } from "@/components/live-botnet-tracker"
import { GoogleDorkExplorer } from "@/components/google-dork-explorer"
import { BeginnerGuide } from "@/components/beginner-guide"
import { DomainIntelligenceDashboard } from "@/components/domain-intelligence-dashboard"
import { FloatingParticles } from "@/components/floating-particles"
import { FloatingEyes } from "@/components/floating-eyes"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"
import { ForensicInvestigationWorkspace } from "@/components/forensic-investigation-workspace"
import { DatabasePoweredInvestigationTracker } from "@/components/database-powered-investigation-tracker"
import { RealTimeThreatIntelligenceHub } from "@/components/real-time-threat-intelligence-hub"
import { Shield, Globe, Bot, Zap, Target, Eye, AlertTriangle, Database, Activity } from "lucide-react"
import { ThreatFeedsPanel } from "@/components/threat-feeds-panel"

export default function CyberWatchVault() {
  const [activeTab, setActiveTab] = useState("cve")
  const [testProduct, setTestProduct] = useState("")
  const [testCVEs, setTestCVEs] = useState("")
  // SSR guard: Only render on client
  if (typeof window === "undefined") {
    return null;
  }

  // Error boundary wrapper for each tab content
  function ErrorBoundary({ children }: { children: React.ReactNode }) {
    try {
      return <>{children}</>;
    } catch (err) {
      return (
        <div className="p-8 text-center text-red-400 bg-red-900/20 rounded-xl border border-red-500">
          <p className="font-bold text-lg">Error loading section</p>
          <pre className="mt-2 text-xs">{String(err)}</pre>
        </div>
      );
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto py-8">
        <FloatingParticles />
        <FloatingEyes />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
            <TabsList className="flex-nowrap flex justify-start gap-4 bg-slate-900/60 p-4 rounded-xl shadow-lg border border-slate-800 min-w-[900px] w-full">
            <TabsTrigger value="cve" className="flex items-center gap-2 px-6 py-3 rounded-lg text-blue-400 data-[state=active]:bg-blue-900/40">
              <Shield className="w-5 h-5" /> CVE Intelligence
            </TabsTrigger>
            <TabsTrigger value="threat-map" className="flex items-center gap-2 px-6 py-3 rounded-lg text-green-400 data-[state=active]:bg-green-900/40">
              <Globe className="w-5 h-5" /> Threat Map
            </TabsTrigger>
            <TabsTrigger value="botnet" className="flex items-center gap-2 px-6 py-3 rounded-lg text-purple-400 data-[state=active]:bg-purple-900/40">
              <Bot className="w-5 h-5" /> Botnet Tracker
            </TabsTrigger>
            <TabsTrigger value="domain" className="flex items-center gap-2 px-6 py-3 rounded-lg text-cyan-400 data-[state=active]:bg-cyan-900/40">
              <Database className="w-5 h-5" /> Domain Intelligence
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 px-6 py-3 rounded-lg text-yellow-400 data-[state=active]:bg-yellow-900/40">
              <Activity className="w-5 h-5" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="forensics" className="flex items-center gap-2 px-6 py-3 rounded-lg text-pink-400 data-[state=active]:bg-pink-900/40">
              <Target className="w-5 h-5" /> Forensics
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2 px-6 py-3 rounded-lg text-teal-400 data-[state=active]:bg-teal-900/40">
              <Database className="w-5 h-5" /> Tracking
            </TabsTrigger>
            <TabsTrigger value="intel-hub" className="flex items-center gap-2 px-6 py-3 rounded-lg text-emerald-400 data-[state=active]:bg-emerald-900/40">
              <Zap className="w-5 h-5" /> Intel Hub
            </TabsTrigger>
            <TabsTrigger value="dorking" className="flex items-center gap-2 px-6 py-3 rounded-lg text-indigo-400 data-[state=active]:bg-indigo-900/40">
              <Eye className="w-5 h-5" /> Google Dorking
            </TabsTrigger>
            <TabsTrigger value="darkweb" className="flex items-center gap-2 px-6 py-3 rounded-lg text-red-400 data-[state=active]:bg-red-900/40">
              <AlertTriangle className="w-5 h-5" /> Dark Web
            </TabsTrigger>
            <TabsTrigger value="russian" className="flex items-center gap-2 px-6 py-3 rounded-lg text-orange-400 data-[state=active]:bg-orange-900/40">
              <Globe className="w-5 h-5" /> Russian Darknet
            </TabsTrigger>
            <TabsTrigger value="feeds" className="flex items-center gap-2 px-6 py-3 rounded-lg text-pink-400 data-[state=active]:bg-pink-900/40">
              <Zap className="w-5 h-5" /> Threat Feeds
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2 px-6 py-3 rounded-lg text-slate-400 data-[state=active]:bg-slate-800/40">
              <Eye className="w-5 h-5" /> Beginner Guide
            </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="cve" className="space-y-6"><ErrorBoundary><ComprehensiveCVEIntelligencePanel /></ErrorBoundary></TabsContent>
          <TabsContent value="threat-map" className="space-y-6"><ErrorBoundary><ThreatWorldMap /></ErrorBoundary></TabsContent>
          <TabsContent value="botnet" className="space-y-6"><ErrorBoundary><LiveBotnetTracker /></ErrorBoundary></TabsContent>
          <TabsContent value="domain" className="space-y-6"><ErrorBoundary><DomainIntelligenceDashboard /></ErrorBoundary></TabsContent>
          <TabsContent value="analytics" className="space-y-6"><ErrorBoundary><AdvancedAnalyticsDashboard /></ErrorBoundary></TabsContent>
          <TabsContent value="forensics" className="space-y-6"><ErrorBoundary><ForensicInvestigationWorkspace /></ErrorBoundary></TabsContent>
          <TabsContent value="tracking" className="space-y-6"><ErrorBoundary><DatabasePoweredInvestigationTracker /></ErrorBoundary></TabsContent>
          <TabsContent value="intel-hub" className="space-y-6"><ErrorBoundary><RealTimeThreatIntelligenceHub /></ErrorBoundary></TabsContent>
          <TabsContent value="dorking" className="space-y-6"><ErrorBoundary><GoogleDorkExplorer /></ErrorBoundary></TabsContent>
          <TabsContent value="darkweb" className="space-y-6"><ErrorBoundary><DarkWebIntelligencePanel /></ErrorBoundary></TabsContent>
          <TabsContent value="russian" className="space-y-6"><ErrorBoundary><RussianDarknetPanel /></ErrorBoundary></TabsContent>
          <TabsContent value="feeds" className="space-y-6"><ErrorBoundary><ThreatFeedsPanel /></ErrorBoundary></TabsContent>
          <TabsContent value="guide" className="space-y-6"><ErrorBoundary><BeginnerGuide /></ErrorBoundary></TabsContent>
        </Tabs>
        {/* Footer */}
        <div className="mt-16 text-center text-slate-400">
          <p className="mb-2 text-lg font-bold tracking-wide">🦇 CyberWatch Vault - Comprehensive Cybersecurity Intelligence Platform</p>
          <p className="text-sm">
            Powered by <span className="text-blue-400">CVEDB</span>, <span className="text-purple-400">Shodan</span>, <span className="text-green-400">VirusTotal</span>, <span className="text-pink-400">AbuseIPDB</span>, <span className="text-yellow-400">GreyNoise</span> & <span className="text-indigo-400">Google Custom Search APIs</span>
          </p>
        </div>
      </div>
    </main>
  )
}
