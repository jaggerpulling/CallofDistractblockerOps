"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, MapPin, Clock, Shield, AlertTriangle, CheckCircle, XCircle, Wifi, WifiOff } from "lucide-react"

import { sites, Site } from "@/lib/sites"

export default function BlacklistPage() {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const siteList: Site[] = Array.isArray(sites) ? sites : []

  const activeCount    = siteList.filter(s => s.status === "active").length
  const completedCount = siteList.filter(s => s.status === "completed").length
  const compromisedCount = siteList.filter(s => s.status === "compromised").length
  const blockedCount   = siteList.filter(s => s.status === "active" || s.status === "completed").length

  const getStatusColor = (status: Site["status"]) => {
    switch (status) {
      case "active":      return "bg-white/20 text-white"
      case "planning":    return "bg-orange-500/20 text-orange-500"
      case "completed":   return "bg-white/20 text-white"
      case "compromised": return "bg-red-500/20 text-red-500"
      default:            return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getPriorityColor = (priority: Site["priority"]) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-500"
      case "high":     return "bg-orange-500/20 text-orange-500"
      case "medium":   return "bg-neutral-500/20 text-neutral-300"
      case "low":      return "bg-white/20 text-white"
      default:         return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getStatusIcon = (status: Site["status"]) => {
    switch (status) {
      case "active":      return <WifiOff className="w-4 h-4 text-white" />
      case "planning":    return <Clock className="w-4 h-4 text-orange-500" />
      case "completed":   return <CheckCircle className="w-4 h-4 text-white" />
      case "compromised": return <Wifi className="w-4 h-4 text-red-500" />
      default:            return <AlertTriangle className="w-4 h-4" />
    }
  }

  // reframe status label for blocking context
  const getStatusLabel = (status: Site["status"]) => {
    switch (status) {
      case "active":      return "BLOCKED"
      case "planning":    return "QUEUED"
      case "completed":   return "NEUTRALIZED"
      case "compromised": return "BYPASSED"
      default:            return status.toUpperCase()
    }
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">KILL ZONE</h1>
          <p className="text-sm text-neutral-400">Distraction targets — DNS block status and containment overview</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Add Target</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Block All</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">BLOCKED</p>
                <p className="text-2xl font-bold text-white font-mono">{activeCount}</p>
              </div>
              <WifiOff className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">NEUTRALIZED</p>
                <p className="text-2xl font-bold text-white font-mono">{completedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">BYPASSED</p>
                <p className="text-2xl font-bold text-red-500 font-mono">{compromisedCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">CONTAINMENT</p>
                <p className="text-2xl font-bold text-white font-mono">
                  {siteList.length > 0 ? Math.round((blockedCount / siteList.length) * 100) : 0}%
                </p>
              </div>
              <Shield className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Site Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {siteList.length > 0 ? (
          siteList.map((site) => (
            <Card
              key={site.id}
              className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors cursor-pointer"
              onClick={() => setSelectedSite(site)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-white tracking-wider">{site.name}</CardTitle>
                    <p className="text-xs text-neutral-400 font-mono">{site.id} · {site.location}</p>
                  </div>
                  <div className="flex items-center gap-2">{getStatusIcon(site.status)}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(site.status)}>{getStatusLabel(site.status)}</Badge>
                  <Badge className={getPriorityColor(site.priority)}>{site.priority.toUpperCase()}</Badge>
                </div>

                <p className="text-sm text-neutral-300">{site.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Target className="w-3 h-3" />
                    <span>{site.objectives.length} active objectives</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Clock className="w-3 h-3" />
                    <span>Op started: {site.startDate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Containment</span>
                    <span className="text-white font-mono">{site.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        site.status === "compromised" ? "bg-red-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${site.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-neutral-400 py-8">
            No targets on blacklist.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedSite.name}</CardTitle>
                <p className="text-sm text-neutral-400 font-mono">{selectedSite.id} · {selectedSite.location}</p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedSite(null)} className="text-neutral-400 hover:text-white">
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">BLOCK STATUS</h3>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(selectedSite.status)}>
                        {getStatusLabel(selectedSite.status)}
                      </Badge>
                      <Badge className={getPriorityColor(selectedSite.priority)}>
                        {selectedSite.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">TARGET DETAILS</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Platform:</span>
                        <span className="text-white">{selectedSite.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Op Start:</span>
                        <span className="text-white font-mono">{selectedSite.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Review Date:</span>
                        <span className="text-white font-mono">{selectedSite.estimatedCompletion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">DNS Rules:</span>
                        <span className="text-white font-mono">{selectedSite.agents > 0 ? selectedSite.agents : "Wildcard"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">CONTAINMENT</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Progress</span>
                        <span className="text-white font-mono">{selectedSite.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            selectedSite.status === "compromised" ? "bg-red-500" : "bg-orange-500"
                          }`}
                          style={{ width: `${selectedSite.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">OBJECTIVES</h3>
                    <div className="space-y-2">
                      {selectedSite.objectives.map((obj, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                          <span className="text-neutral-300">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">INTEL</h3>
                <p className="text-sm text-neutral-300">{selectedSite.description}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  {selectedSite.status === "active" ? "Unblock" : "Block Now"}
                </Button>
                <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
                  Edit Target
                </Button>
                <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
                  View DNS Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}