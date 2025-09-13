"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Zap, Globe, Eye } from "lucide-react"

interface SearchInterfaceProps {
  onSearch: (query: string) => void
  loading: boolean
  resultCount: number
}

export function SearchInterface({ onSearch, loading, resultCount }: SearchInterfaceProps) {
  const [query, setQuery] = useState("")

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim())
    }
  }, [query, onSearch])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const quickSearches = [
    { label: "Webcams", query: "webcam", icon: "📹", gradient: "from-blue-500 to-cyan-500" },
    { label: "SSH Servers", query: "port:22", icon: "🔐", gradient: "from-green-500 to-emerald-500" },
    { label: "Web Servers", query: "port:80,443", icon: "🌐", gradient: "from-purple-500 to-pink-500" },
    { label: "Databases", query: "mysql mongodb", icon: "🗄️", gradient: "from-orange-500 to-red-500" },
    { label: "IoT Devices", query: "iot", icon: "📱", gradient: "from-indigo-500 to-purple-500" },
    { label: "Industrial", query: "scada", icon: "🏭", gradient: "from-yellow-500 to-orange-500" },
  ]

  return (
    <div className="space-y-8">
      {/* Main Search */}
      <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-lg animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Intelligence Scanner
            </h2>
            <p className="text-slate-400 text-lg">Discover devices and services across the digital landscape</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
            <Input
              placeholder="Enter search query (e.g., apache, nginx, port:80, country:US)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 h-16 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-lg rounded-xl"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            size="lg"
            className="h-16 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Quick Searches */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-300 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Quick Searches
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickSearches.map((item) => (
              <Button
                key={item.query}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(item.query)
                  onSearch(item.query)
                }}
                className={`bg-gradient-to-r ${item.gradient} border-0 text-white hover:scale-105 transition-all duration-200 p-4 h-auto flex-col gap-2`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {resultCount > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>
                Found{" "}
                <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-400 border-cyan-500/30">
                  {resultCount.toLocaleString()}
                </Badge>{" "}
                results
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
