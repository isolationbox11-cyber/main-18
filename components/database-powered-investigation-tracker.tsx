"use client"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
// Supabase integration removed for Next.js compatibility
import { Database, Plus, Save, Search, Clock, Target, CheckCircle, Loader2, RefreshCw } from "lucide-react"

export function DatabasePoweredInvestigationTracker() {
  return (
    <Card className="bg-slate-900/20 border-slate-600">
      <CardContent className="p-8 text-center">
        <Database className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-cyan-400 mb-2">Investigation Tracker (Demo)</h3>
        <p className="text-cyan-200 mb-4">
          Database-powered investigation tracking is currently disabled.<br />
          All features are available in demo mode only.
        </p>
      </CardContent>
    </Card>
  )
}
// All code below this line removed
          <Dialog open={showNewInvestigation} onOpenChange={setShowNewInvestigation}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-700 text-white shadow-lg hover:scale-105 transition-transform">
                <Plus className="w-4 h-4 mr-2" />
                New Investigation
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-slate-900 to-cyan-950 border-cyan-700 rounded-xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Investigation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Investigation Title</label>
                  <Input
                    value={newInvestigationTitle}
                    onChange={(e) => setNewInvestigationTitle(e.target.value)}
                    placeholder="Enter investigation title..."
                    className="bg-slate-800 border-cyan-500 text-white rounded-lg focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Description</label>
                  <Textarea
                    value={newInvestigationDesc}
                    onChange={(e) => setNewInvestigationDesc(e.target.value)}
                    placeholder="Describe the investigation scope and objectives..."
                    className="bg-slate-800 border-cyan-500 text-white rounded-lg focus:ring-2 focus:ring-cyan-400"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewInvestigation(false)} className="border-slate-500 text-slate-300 hover:bg-slate-800">
                    Cancel
                  </Button>
                  <Button onClick={createInvestigation} disabled={loading} className="bg-gradient-to-r from-cyan-500 to-blue-700 text-white shadow-lg hover:scale-105 transition-transform">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Create Investigation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Investigation List */}
  <Card className="bg-gradient-to-br from-slate-900 to-cyan-950 border-cyan-700/60 rounded-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-300 text-xl font-bold">
            <Database className="w-5 h-5 text-cyan-400 drop-shadow" />
            Stored Investigations <span className="bg-cyan-800/30 px-2 py-1 rounded-full text-cyan-200 ml-2">{investigations.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              <span className="ml-2 text-slate-300">Loading investigations...</span>
            </div>
          ) : investigations.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No investigations found. Create your first investigation to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investigations.map((investigation) => (
                <Card
                  key={investigation.id}
                  className={`cursor-pointer rounded-lg shadow-md transition-all duration-200 ${
                    activeInvestigation?.id === investigation.id
                      ? "bg-gradient-to-r from-cyan-900 to-blue-900 border-cyan-500 scale-105"
                      : "bg-slate-800/40 border-slate-600 hover:border-cyan-400 hover:scale-102"
                  }`}
                  onClick={() => setActiveInvestigation(investigation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm line-clamp-1">{investigation.title}</h3>
                      <Badge className={getSeverityColor(investigation.priority) + " px-2 py-1 rounded-full text-xs font-semibold shadow"}>
                        {investigation.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">{investigation.description}</p>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <Badge
                        variant="outline"
                        className={
                          investigation.status === "active"
                            ? "text-green-400 border-green-500 bg-green-900/20"
                            : investigation.status === "completed"
                              ? "text-blue-400 border-blue-500 bg-blue-900/20"
                              : "text-slate-400 border-slate-500 bg-slate-900/20"
                        + " px-2 py-1 rounded-full text-xs font-semibold"}
                      >
                        {investigation.status.toUpperCase()}
                      </Badge>
                      <span className="text-slate-500">{investigation.updated_at_formatted ?? investigation.updated_at}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {activeInvestigation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Add Finding */}
            <Card className="bg-gradient-to-br from-slate-900 to-orange-950 border-orange-700/60 rounded-xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-orange-400" />
                  Add Finding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Select
                    value={selectedFindingType}
                    onValueChange={(value: Finding["type"]) => setSelectedFindingType(value)}
                  >
                    <SelectTrigger className="w-32 bg-slate-800 border-orange-500 text-white rounded-lg focus:ring-2 focus:ring-orange-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="ip">IP Address</SelectItem>
                      <SelectItem value="domain">Domain</SelectItem>
                      <SelectItem value="cve">CVE</SelectItem>
                      <SelectItem value="malware">Malware</SelectItem>
                      <SelectItem value="indicator">Indicator</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={newFinding}
                    onChange={(e) => setNewFinding(e.target.value)}
                    placeholder="Add new finding or observation..."
                    className="bg-slate-800 border-orange-500 text-white rounded-lg focus:ring-2 focus:ring-orange-400"
                  />
                  <Button onClick={addFinding} disabled={loading} className="bg-gradient-to-r from-orange-500 to-yellow-700 text-white shadow-lg hover:scale-105 transition-transform">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Findings */}
            <Card className="bg-gradient-to-br from-slate-900 to-green-950 border-green-700/60 rounded-xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="w-5 h-5 text-green-400" />
                  Findings ({findings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {findings.map((finding) => (
                      <Card key={finding.id} className="bg-slate-800/40 border-green-700/40 rounded-lg shadow hover:scale-102 transition-transform">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs px-2 py-1 rounded-full font-semibold">
                                {finding.type.toUpperCase()}
                              </Badge>
                              <h4 className="font-medium text-white text-sm">{finding.title}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getSeverityColor(finding.severity) + " px-2 py-1 rounded-full text-xs font-semibold shadow"}>
                                {finding.severity.toUpperCase()}
                              </Badge>
                              {finding.verified && <CheckCircle className="w-4 h-4 text-green-400 animate-pulse" />}
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{finding.content}</p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{finding.source}</span>
                            <span>{finding.created_at_formatted ?? finding.created_at}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investigation Details */}
            <Card className="bg-gradient-to-br from-slate-900 to-cyan-950 border-cyan-700/60 rounded-xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Database className="w-5 h-5 text-cyan-400" />
                  Investigation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-cyan-300 mb-1 text-lg drop-shadow">{activeInvestigation.title}</h3>
                  <p className="text-slate-300 text-sm italic">{activeInvestigation.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Status:</span>
                    <Badge className={getSeverityColor(activeInvestigation.status)}>
                      {activeInvestigation.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Priority:</span>
                    <Badge className={getSeverityColor(activeInvestigation.priority)}>
                      {activeInvestigation.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Created:</span>
                    <span className="text-white text-sm">
                      {activeInvestigation.created_at_formatted ?? activeInvestigation.created_at}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Updated:</span>
                    <span className="text-white text-sm">
                      {activeInvestigation.updated_at_formatted ?? activeInvestigation.updated_at}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-gradient-to-br from-slate-900 to-purple-950 border-purple-700/60 rounded-xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Timeline ({timelineEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              event.severity === "critical"
                                ? "bg-red-400"
                                : event.severity === "warning"
                                  ? "bg-yellow-400"
                                  : "bg-blue-400"
                            }`}
                          />
                          {index < timelineEvents.length - 1 && <div className="w-px h-8 bg-slate-600 mt-2" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white text-sm font-medium">{event.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {event.event_type}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-xs mb-2">{event.description}</p>
                          <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>{event.source}</span>
                            <span>{event.event_timestamp_formatted ?? event.event_timestamp}</span>
// All broken hooks and formatting logic removed; only static placeholder remains
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
// End of component
