"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Server,
  Shield,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Clock,
  Plus,
  Trash2,
  BookOpen,
  Lock,
  Unlock,
  Calendar,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type BlockGroup = {
  id: string
  name: string
  domains: string[]
}

type ScheduleBlock = {
  id: string
  name: string
  type: "schedule" | "task"
  enabled: boolean
  startTime?: string   // "HH:MM" for schedule type
  endTime?: string     // "HH:MM" for schedule type
  days?: string[]      // for schedule type
  taskName?: string    // for task type
  completionBased?: boolean // for task type — block until task complete
  durationMinutes?: number  // for task type — fixed duration
  groups: string[]     // BlockGroup ids
  status: "active" | "idle" | "paused"
}

type SystemCard = {
  id: string
  name: string
  type: string
  status: "online" | "warning" | "maintenance" | "offline"
  health: number
  cpu: number
  memory: number
  storage: number
  uptime: string
  location: string
  lastMaintenance: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const BLOCK_GROUPS: BlockGroup[] = [
  { id: "grp-1", name: "Social Media",   domains: ["instagram.com", "twitter.com", "reddit.com"] },
  { id: "grp-2", name: "Video",          domains: ["youtube.com", "twitch.tv"] },
  { id: "grp-3", name: "Gaming",         domains: ["steam.com", "epicgames.com"] },
  { id: "grp-4", name: "News",           domains: ["cnn.com", "twitter.com"] },
]

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const INITIAL_SCHEDULES: ScheduleBlock[] = [
  {
    id: "sched-1",
    name: "Morning Focus",
    type: "schedule",
    enabled: true,
    startTime: "08:00",
    endTime: "10:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    groups: ["grp-1", "grp-2"],
    status: "active",
  },
  {
    id: "sched-2",
    name: "Study Block",
    type: "task",
    enabled: true,
    taskName: "Calculus Problem Set",
    completionBased: true,
    durationMinutes: 90,
    groups: ["grp-1", "grp-2", "grp-3"],
    status: "idle",
  },
  {
    id: "sched-3",
    name: "Evening Wind-Down",
    type: "schedule",
    enabled: false,
    startTime: "22:00",
    endTime: "23:59",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    groups: ["grp-3"],
    status: "idle",
  },
]

const SYSTEMS: SystemCard[] = [
  {
    id: "SYS-001", name: "PI-HOLE DNS",         type: "DNS Filter",
    status: "online",      health: 98, cpu: 12, memory: 34, storage: 18,
    uptime: "26 days",     location: "192.168.86.26",  lastMaintenance: "2025-06-01",
  },
  {
    id: "SYS-002", name: "SCHEDULE ENGINE",     type: "Cron Service",
    status: "online",      health: 95, cpu: 4,  memory: 22, storage: 8,
    uptime: "26 days",     location: "Local",          lastMaintenance: "2025-06-01",
  },
  {
    id: "SYS-003", name: "TODOIST SYNC",         type: "API Bridge",
    status: "warning",     health: 81, cpu: 8,  memory: 41, storage: 5,
    uptime: "3 days",      location: "api.todoist.com",lastMaintenance: "2025-06-14",
  },
  {
    id: "SYS-004", name: "BLOCK CONTROLLER",    type: "Python Service",
    status: "online",      health: 99, cpu: 2,  memory: 18, storage: 3,
    uptime: "26 days",     location: "Local",          lastMaintenance: "2025-06-01",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: string) {
  switch (status) {
    case "online":  case "active":  return "bg-white/20 text-white"
    case "warning": case "paused":  return "bg-orange-500/20 text-orange-500"
    case "idle":                    return "bg-neutral-500/20 text-neutral-300"
    case "offline": case "maintenance": return "bg-red-500/20 text-red-500"
    default:                        return "bg-neutral-500/20 text-neutral-300"
  }
}

function healthColor(h: number) {
  if (h >= 90) return "text-white"
  if (h >= 75) return "text-orange-500"
  return "text-red-500"
}

function groupById(id: string) {
  return BLOCK_GROUPS.find(g => g.id === id)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MiniBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
      <div className="bg-orange-500 h-1 rounded-full" style={{ width: `${value}%` }} />
    </div>
  )
}

function DayToggle({
  day, active, onClick,
}: { day: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
        active
          ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
          : "border-neutral-700 text-neutral-600 hover:border-neutral-500 hover:text-neutral-400"
      }`}
    >
      {day}
    </button>
  )
}

function GroupPill({
  group, onRemove,
}: { group: BlockGroup; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-sm">
      {group.name}
      {onRemove && (
        <button onClick={onRemove} className="text-neutral-600 hover:text-red-400 ml-1">
          ×
        </button>
      )}
    </span>
  )
}

// ─── Schedule Card ────────────────────────────────────────────────────────────

function ScheduleCard({
  block,
  onToggle,
  onDelete,
  onEdit,
}: {
  block: ScheduleBlock
  onToggle: () => void
  onDelete: () => void
  onEdit: () => void
}) {
  const isSchedule = block.type === "schedule"
  const assignedGroups = block.groups.map(id => groupById(id)).filter(Boolean) as BlockGroup[]

  return (
    <Card
      className={`bg-neutral-900 border-neutral-700 transition-colors ${
        block.enabled ? "hover:border-orange-500/40" : "opacity-60"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {isSchedule
              ? <Clock className="w-4 h-4 text-neutral-400" />
              : <BookOpen className="w-4 h-4 text-neutral-400" />
            }
            <div>
              <CardTitle className="text-sm font-bold text-white tracking-wider">{block.name}</CardTitle>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                {isSchedule ? "SCHEDULED BLOCK" : "TASK-BASED BLOCK"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={statusColor(block.status)}>{block.status.toUpperCase()}</Badge>
            <button onClick={onToggle} className="text-neutral-500 hover:text-orange-400 transition-colors">
              {block.enabled ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
            <button onClick={onDelete} className="text-neutral-600 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* Schedule info */}
        {isSchedule ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-400 text-xs">TIME</span>
              <span className="text-white font-mono text-xs">{block.startTime} → {block.endTime}</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {DAYS_SHORT.map(d => (
                <span
                  key={d}
                  className={`text-xs px-1.5 py-0.5 rounded-sm ${
                    block.days?.includes(d)
                      ? "bg-orange-500/20 text-orange-400"
                      : "text-neutral-700"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">TASK</span>
              <span className="text-white font-mono truncate ml-2">{block.taskName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">MODE</span>
              <span className="text-white font-mono">
                {block.completionBased ? "Until complete" : `${block.durationMinutes} min`}
              </span>
            </div>
          </div>
        )}

        {/* Assigned groups */}
        <div>
          <p className="text-xs text-neutral-500 mb-1.5 uppercase tracking-wider">Blocked Groups</p>
          <div className="flex flex-wrap gap-1">
            {assignedGroups.length > 0
              ? assignedGroups.map(g => <GroupPill key={g.id} group={g} />)
              : <span className="text-xs text-neutral-700">None assigned</span>
            }
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent text-xs"
        >
          <Settings className="w-3 h-3 mr-1" /> Edit Block
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
  block,
  onSave,
  onClose,
}: {
  block: ScheduleBlock
  onSave: (b: ScheduleBlock) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<ScheduleBlock>({ ...block, days: [...(block.days ?? [])] })

  function toggleDay(day: string) {
    setDraft(d => ({
      ...d,
      days: d.days?.includes(day)
        ? d.days.filter(x => x !== day)
        : [...(d.days ?? []), day],
    }))
  }

  function toggleGroup(id: string) {
    setDraft(d => ({
      ...d,
      groups: d.groups.includes(id) ? d.groups.filter(x => x !== id) : [...d.groups, id],
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <Card className="bg-neutral-900 border-neutral-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-white tracking-wider">
            {draft.id.startsWith("new") ? "NEW BLOCK" : "EDIT BLOCK"}
          </CardTitle>
          <Button variant="ghost" onClick={onClose} className="text-neutral-400 hover:text-white">✕</Button>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-xs text-neutral-400 tracking-wider uppercase block mb-1.5">Block Name</label>
            <input
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-orange-500/50"
              placeholder="e.g. Morning Focus"
            />
          </div>

          {/* Type toggle */}
          <div>
            <label className="text-xs text-neutral-400 tracking-wider uppercase block mb-1.5">Block Type</label>
            <div className="flex gap-2">
              {(["schedule", "task"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setDraft(d => ({ ...d, type: t }))}
                  className={`flex-1 text-xs py-2 border rounded-sm uppercase tracking-wider transition-colors ${
                    draft.type === t
                      ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                      : "border-neutral-700 text-neutral-500 hover:border-neutral-500"
                  }`}
                >
                  {t === "schedule" ? <><Calendar className="w-3 h-3 inline mr-1" />Schedule</> : <><BookOpen className="w-3 h-3 inline mr-1" />Task</>}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule fields */}
          {draft.type === "schedule" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 tracking-wider uppercase block mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={draft.startTime}
                    onChange={e => setDraft(d => ({ ...d, startTime: e.target.value }))}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 tracking-wider uppercase block mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={draft.endTime}
                    onChange={e => setDraft(d => ({ ...d, endTime: e.target.value }))}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-400 tracking-wider uppercase block mb-1.5">Days</label>
                <div className="flex gap-1.5 flex-wrap">
                  {DAYS_SHORT.map(d => (
                    <DayToggle key={d} day={d} active={!!draft.days?.includes(d)} onClick={() => toggleDay(d)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Task fields */}
          {draft.type === "task" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 tracking-wider uppercase block mb-1.5">Task Name</label>
                <input
                  value={draft.taskName ?? ""}
                  onChange={e => setDraft(d => ({ ...d, taskName: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-orange-500/50"
                  placeholder="e.g. Calculus Problem Set"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 tracking-wider uppercase block mb-1.5">Duration Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDraft(d => ({ ...d, completionBased: true }))}
                    className={`flex-1 text-xs py-2 border rounded-sm uppercase tracking-wider transition-colors ${
                      draft.completionBased
                        ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                        : "border-neutral-700 text-neutral-500 hover:border-neutral-500"
                    }`}
                  >
                    <Target className="w-3 h-3 inline mr-1" />Until Complete
                  </button>
                  <button
                    onClick={() => setDraft(d => ({ ...d, completionBased: false }))}
                    className={`flex-1 text-xs py-2 border rounded-sm uppercase tracking-wider transition-colors ${
                      !draft.completionBased
                        ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                        : "border-neutral-700 text-neutral-500 hover:border-neutral-500"
                    }`}
                  >
                    <Clock className="w-3 h-3 inline mr-1" />Fixed Time
                  </button>
                </div>
              </div>
              {!draft.completionBased && (
                <div>
                  <label className="text-xs text-neutral-400 tracking-wider uppercase block mb-1.5">Duration (minutes)</label>
                  <input
                    type="number"
                    value={draft.durationMinutes ?? 60}
                    onChange={e => setDraft(d => ({ ...d, durationMinutes: Number(e.target.value) }))}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-orange-500/50"
                    min={5} step={5}
                  />
                </div>
              )}
            </div>
          )}

          {/* Group selector */}
          <div>
            <label className="text-xs text-neutral-400 tracking-wider uppercase block mb-1.5">Block Groups</label>
            <div className="space-y-1.5">
              {BLOCK_GROUPS.map(g => (
                <button
                  key={g.id}
                  onClick={() => toggleGroup(g.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 border rounded-sm text-sm transition-colors ${
                    draft.groups.includes(g.id)
                      ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                      : "border-neutral-700 text-neutral-400 hover:border-neutral-600"
                  }`}
                >
                  <span>{g.name}</span>
                  <span className="text-xs text-neutral-600 font-mono">{g.domains.length} domains</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-neutral-700">
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => onSave(draft)}
            >
              Save Block
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── System Detail Modal ───────────────────────────────────────────────────────

function SystemModal({ system, onClose }: { system: SystemCard; onClose: () => void }) {
  const getSystemIcon = (type: string) => {
    switch (type) {
      case "DNS Filter":    return <Shield className="w-6 h-6" />
      case "Cron Service":  return <Clock className="w-6 h-6" />
      case "API Bridge":    return <Wifi className="w-6 h-6" />
      case "Python Service":return <Server className="w-6 h-6" />
      default:              return <Server className="w-6 h-6" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-neutral-900 border-neutral-700 w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {getSystemIcon(system.type)}
            <div>
              <CardTitle className="text-xl font-bold text-white tracking-wider">{system.name}</CardTitle>
              <p className="text-sm text-neutral-400">{system.id} · {system.type} · {system.location}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-neutral-400 hover:text-white">✕</Button>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3 text-sm">
              <h3 className="text-xs text-neutral-300 tracking-wider uppercase">System Info</h3>
              {[
                ["Status",           <Badge className={statusColor(system.status)}>{system.status.toUpperCase()}</Badge>],
                ["Uptime",           <span className="font-mono text-white">{system.uptime}</span>],
                ["Last Maintenance", <span className="font-mono text-white">{system.lastMaintenance}</span>],
                ["Health",           <span className={`font-mono ${healthColor(system.health)}`}>{system.health}%</span>],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between items-center">
                  <span className="text-neutral-400">{k}</span>{v}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="text-xs text-neutral-300 tracking-wider uppercase">Resources</h3>
              {[["CPU", system.cpu], ["Memory", system.memory], ["Storage", system.storage]].map(([label, val]) => (
                <div key={String(label)}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">{label}</span>
                    <span className="text-white font-mono">{val}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t border-neutral-700">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Restart</Button>
            <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">View Logs</Button>
            <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">Schedule Maintenance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SystemsPage() {
  const [schedules, setSchedules]       = useState<ScheduleBlock[]>(INITIAL_SCHEDULES)
  const [selectedSystem, setSelectedSystem] = useState<SystemCard | null>(null)
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null)
  const [showSystems, setShowSystems]   = useState(false)

  const onlineCount = SYSTEMS.filter(s => s.status === "online").length
  const activeBlocks = schedules.filter(s => s.status === "active").length
  const enabledBlocks = schedules.filter(s => s.enabled).length

  function toggleBlock(id: string) {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  function deleteBlock(id: string) {
    setSchedules(prev => prev.filter(s => s.id !== id))
  }

  function saveBlock(block: ScheduleBlock) {
    setSchedules(prev =>
      prev.find(s => s.id === block.id)
        ? prev.map(s => s.id === block.id ? block : s)
        : [...prev, { ...block, id: `sched-${Date.now()}`, status: "idle" }]
    )
    setEditingBlock(null)
  }

  function newBlock() {
    setEditingBlock({
      id: `new-${Date.now()}`,
      name: "",
      type: "schedule",
      enabled: true,
      startTime: "09:00",
      endTime: "11:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      groups: [],
      status: "idle",
    })
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SYSTEMS MONITOR</h1>
          <p className="text-sm text-neutral-400">Block scheduling, task sessions, and infrastructure health</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={newBlock} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-1" /> New Block
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Activity className="w-4 h-4 mr-1" /> System Scan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "SYSTEMS ONLINE", val: `${onlineCount}/${SYSTEMS.length}`, icon: <CheckCircle className="w-8 h-8 text-white" />, color: "text-white" },
          { label: "ACTIVE BLOCKS",  val: activeBlocks,  icon: <Lock className="w-8 h-8 text-orange-500" />,  color: "text-orange-500" },
          { label: "SCHEDULED",      val: enabledBlocks,  icon: <Calendar className="w-8 h-8 text-white" />,   color: "text-white" },
          { label: "WARNINGS",       val: SYSTEMS.filter(s => s.status === "warning").length, icon: <AlertTriangle className="w-8 h-8 text-orange-500" />, color: "text-orange-500" },
        ].map(s => (
          <Card key={s.label} className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider">{s.label}</p>
                  <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.val}</p>
                </div>
                {s.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── BLOCK SCHEDULES ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-neutral-300 tracking-wider uppercase">Block Schedules</h2>
          <span className="text-xs text-neutral-600 font-mono">{schedules.length} configured</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {schedules.map(block => (
            <ScheduleCard
              key={block.id}
              block={block}
              onToggle={() => toggleBlock(block.id)}
              onDelete={() => deleteBlock(block.id)}
              onEdit={() => setEditingBlock(block)}
            />
          ))}
          {/* Add new card */}
          <button
            onClick={newBlock}
            className="border border-dashed border-neutral-700 hover:border-orange-500/40 rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-neutral-600 hover:text-orange-400 transition-colors min-h-[200px]"
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs uppercase tracking-wider">New Block</span>
          </button>
        </div>
      </div>

      {/* ── INFRASTRUCTURE ── */}
      <div>
        <button
          onClick={() => setShowSystems(s => !s)}
          className="flex items-center gap-2 text-sm font-medium text-neutral-300 tracking-wider uppercase mb-3 hover:text-white transition-colors"
        >
          {showSystems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Infrastructure
          <span className="text-xs text-neutral-600 font-mono ml-1">{SYSTEMS.length} systems</span>
        </button>

        {showSystems && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {SYSTEMS.map(system => (
              <Card
                key={system.id}
                className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedSystem(system)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xs font-bold text-white tracking-wider">{system.name}</CardTitle>
                      <p className="text-xs text-neutral-500 font-mono">{system.type}</p>
                    </div>
                    <Badge className={statusColor(system.status)}>{system.status.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Health</span>
                    <span className={`font-mono ${healthColor(system.health)}`}>{system.health}%</span>
                  </div>
                  <Progress value={system.health} className="h-1.5" />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[["CPU", system.cpu], ["MEM", system.memory], ["DISK", system.storage]].map(([l, v]) => (
                      <div key={String(l)}>
                        <div className="text-neutral-500 mb-0.5">{l}</div>
                        <div className="text-white font-mono">{v}%</div>
                        <MiniBar value={Number(v)} />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 font-mono">{system.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {editingBlock && (
        <EditModal block={editingBlock} onSave={saveBlock} onClose={() => setEditingBlock(null)} />
      )}
      {selectedSystem && (
        <SystemModal system={selectedSystem} onClose={() => setSelectedSystem(null)} />
      )}
    </div>
  )
}