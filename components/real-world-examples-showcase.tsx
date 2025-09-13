"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  Shield,
  ExternalLink,
  Eye,
  Database,
  Camera,
  Globe,
  FileText,
  BookOpen,
  TrendingUp,
  Target,
} from "lucide-react"
import { generateRealWorldExamples, type RealWorldExample } from "@/lib/enhanced-data-generator"

export function RealWorldExamplesShowcase() {
  const [examples] = useState<RealWorldExample[]>(generateRealWorldExamples())
  const [selectedExample, setSelectedExample] = useState<RealWorldExample | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "data exposure":
        return <Database className="w-5 h-5" />
      case "iot security":
        return <Camera className="w-5 h-5" />
      case "web security":
        return <Globe className="w-5 h-5" />
      case "database security":
        return <FileText className="w-5 h-5" />
      case "data leak":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  const filteredExamples = filter === "all" ? examples : examples.filter((example) => example.riskLevel === filter)

  const riskCounts = {
    all: examples.length,
    critical: examples.filter((e) => e.riskLevel === "critical").length,
    high: examples.filter((e) => e.riskLevel === "high").length,
    medium: examples.filter((e) => e.riskLevel === "medium").length,
    low: examples.filter((e) => e.riskLevel === "low").length,
  }

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Real-World Security Examples 🔍
          <Badge variant="outline" className="text-red-400 border-red-400">
            EDUCATIONAL
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(riskCounts).map(([level, count]) => (
            <Button
              key={level}
              variant={filter === level ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(level)}
              className={`${
                filter === level
                  ? getRiskColor(level === "all" ? "info" : level)
                  : "border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)} ({count})
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Examples List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Security Vulnerabilities Found in the Wild
            </h3>
            <ScrollArea className="h-96">
              <div className="space-y-3 pr-4">
                {filteredExamples.map((example, index) => (
                  <Card
                    key={index}
                    className={`bg-slate-800/30 border-slate-600 cursor-pointer transition-all hover:bg-slate-800/50 ${
                      selectedExample === example ? "ring-2 ring-cyan-500/50" : ""
                    }`}
                    onClick={() => setSelectedExample(example)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(example.category)}
                          <h4 className="font-medium text-white">{example.title}</h4>
                        </div>
                        <Badge className={getRiskColor(example.riskLevel)}>{example.riskLevel.toUpperCase()}</Badge>
                      </div>

                      <p className="text-sm text-slate-300 mb-2 line-clamp-2">{example.description}</p>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                          {example.category}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(example.realWorldUrl, "_blank")
                          }}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Detailed View */}
          <div className="space-y-4">
            {selectedExample ? (
              <div className="space-y-4">
                <Card className="bg-slate-800/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {getCategoryIcon(selectedExample.category)}
                      {selectedExample.title}
                      <Badge className={getRiskColor(selectedExample.riskLevel)}>
                        {selectedExample.riskLevel.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300">{selectedExample.description}</p>

                    {/* Screenshot */}
                    {selectedExample.screenshot && (
                      <div className="relative">
                        <img
                          src={selectedExample.screenshot || "/placeholder.svg"}
                          alt={selectedExample.title}
                          className="w-full rounded-lg border border-slate-600"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                            Example Screenshot
                          </Badge>
                        </div>
                      </div>
                    )}

                    <Tabs defaultValue="details" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-slate-700/30">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="impact">Impact</TabsTrigger>
                        <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="space-y-3">
                        <div className="space-y-2">
                          <div>
                            <span className="text-slate-400">Category:</span>
                            <span className="ml-2 text-white">{selectedExample.category}</span>
                          </div>
                          {selectedExample.details.vulnerability && (
                            <div>
                              <span className="text-slate-400">Vulnerability:</span>
                              <span className="ml-2 text-red-400">{selectedExample.details.vulnerability}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-400">Risk Level:</span>
                            <Badge className={`ml-2 ${getRiskColor(selectedExample.riskLevel)}`}>
                              {selectedExample.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="impact" className="space-y-3">
                        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                          <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Potential Impact
                          </h4>
                          <p className="text-red-300 text-sm">{selectedExample.details.impact}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="mitigation" className="space-y-3">
                        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                          <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Mitigation Steps
                          </h4>
                          <p className="text-green-300 text-sm">{selectedExample.details.mitigation}</p>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* References */}
                    <div className="space-y-2">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        References & Resources
                      </h4>
                      <div className="space-y-2">
                        {selectedExample.details.references.map((ref, index) => (
                          <div key={index} className="flex items-center justify-between bg-slate-700/30 p-2 rounded">
                            <span className="text-sm text-slate-300 truncate">{ref}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(ref, "_blank")}
                              className="text-slate-400 hover:text-cyan-400 flex-shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-slate-700">
                      <Button
                        onClick={() => window.open(selectedExample.realWorldUrl, "_blank")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const searchQuery = selectedExample.title.toLowerCase().replace(/\s+/g, "+")
                          window.open(`https://www.google.com/search?q=${searchQuery}+vulnerability`, "_blank")
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Search Similar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-800/30 border-slate-600">
                <CardContent className="p-8 text-center">
                  <Eye className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <div className="text-slate-400 mb-2">Select an example to view details</div>
                  <div className="text-sm text-slate-500">
                    Click on any security vulnerability example to see detailed information, impact analysis, and
                    mitigation strategies.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Note */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-400 mb-1">Educational Purpose 🎓</h4>
                <p className="text-sm text-blue-300">
                  These examples are based on real-world security vulnerabilities found through internet scanning and
                  research. They demonstrate common security misconfigurations and vulnerabilities that organizations
                  face. Use this knowledge to better secure your own systems and understand the importance of
                  cybersecurity best practices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
