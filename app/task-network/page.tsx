"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, CheckCircle2, Circle, AlertTriangle, Clock, Tag } from "lucide-react"

const TASKS = [
  { id: 1,  name: "Submit robotics MCB pull request",       project: "Fang Robotics", priority: 1, due: "today",     status: "active"   },
  { id: 2,  name: "Review autoFeeder state machine logic",  project: "Fang Robotics", priority: 1, due: "overdue",   status: "overdue"  },
  { id: 3,  name: "Push CloudStorage dashboard updates",    project: "UT Transfer",   priority: 2, due: "today",     status: "active"   },
  { id: 4,  name: "Follow up — Kellie Roberts / UFCU",      project: "Career",        priority: 1, due: "overdue",   status: "overdue"  },
  { id: 5,  name: "Prepare UFCU hackathon pitch notes",     project: "Career",        priority: 2, due: "tomorrow",  status: "active"   },
  { id: 6,  name: "Calculus: curve sketching problem set",  project: "ACC",           priority: 2, due: "today",     status: "active"   },
  { id: 7,  name: "L'Hôpital's rule practice problems",     project: "ACC",           priority: 3, due: "tomorrow",  status: "active"   },
  { id: 8,  name: "Draft UT Austin transfer essay",         project: "UT Transfer",   priority: 1, due: "overdue",   status: "overdue"  },
  { id: 9,  name: "Update GitHub with recent commits",      project: "UT Transfer",   priority: 3, due: "this week", status: "active"   },
  { id: 10, name: "Fix distraction blocker flush DNS fn",   project: "Personal",      priority: 3, due: "today",     status: "active"   },
  { id: 11, name: "Pi-hole DHCP reservation confirmed",     project: "Personal",      priority: 2, due: "done",      status: "complete" },
  { id: 12, name: "Motorcycle license — research TX req.",  project: "Personal",      priority: 4, due: "this week", status: "active"   },
  { id: 13, name: "Computer org: hex/binary problem set",   project: "ACC",           priority: 2, due: "today",     status: "active"   },
  { id: 14, name: "Fang Robotics meeting prep",             project: "Fang Robotics", priority: 2, due: "tomorrow",  status: "active"   },
]

const SECTION_LABELS: Record<string, string> = {
  "Fang Robotics": "ENGINEERING / ROBOTICS",
  "UT Transfer":   "TRANSFER OPS",
  "Career":        "CAREER / COMMS",
  "ACC":           "ACADEMICS",
  "Personal":      "PERSONAL OPS",
}

type Task = typeof TASKS[number]
type Filter = "all" | "today" | "overdue" | "p1" | "complete"

function priorityColor(p: number) {
  if (p === 1) return "bg-red-500"
  if (p === 2) return "bg-orange-500"
  if (p === 3) return "bg-blue-500"
  return "bg-neutral-600"
}

function DueBadge({ task, done }: { task: Task; done: boolean }) {
  if (done)
    return <span className="text-xs px-2 py-1 rounded uppercase tracking-wider bg-emerald-500/20 text-emerald-400">Complete</span>
  if (task.due === "overdue")
    return <span className="text-xs px-2 py-1 rounded uppercase tracking-wider bg-red-500/20 text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Overdue</span>
  if (task.due === "today")
    return <span className="text-xs px-2 py-1 rounded uppercase tracking-wider bg-orange-500/20 text-orange-400">Today</span>
  return <span className="text-xs px-2 py-1 rounded uppercase tracking-wider bg-neutral-700/50 text-neutral-400">{task.due}</span>
}

export default function TaskOpsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all")
  const [checked, setChecked] = useState<Set<number>>(
    new Set(TASKS.filter(t => t.status === "complete").map(t => t.id))
  )
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [clock, setClock] = useState("")

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-US", { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  function toggle(id: number) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = TASKS.filter(t => {
    if (activeFilter === "today")    return t.due === "today" && !checked.has(t.id)
    if (activeFilter === "overdue")  return t.due === "overdue" && !checked.has(t.id)
    if (activeFilter === "p1")       return t.priority === 1 && !checked.has(t.id)
    if (activeFilter === "complete") return checked.has(t.id)
    return true
  })

  const projects = [...new Set(filtered.map(t => t.project))]

  const statActive   = TASKS.filter(t => !checked.has(t.id) && t.status !== "complete").length
  const statOverdue  = TASKS.filter(t => !checked.has(t.id) && t.due === "overdue").length
  const statComplete = checked.size
  const statP1       = TASKS.filter(t => !checked.has(t.id) && t.priority === 1).length
  const pct          = Math.round((checked.size / TASKS.length) * 100)

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all",      label: "All Ops"   },
    { key: "today",    label: "Today"     },
    { key: "overdue",  label: "Overdue"   },
    { key: "p1",       label: "Priority 1"},
    { key: "complete", label: "Complete"  },
  ]

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">TASK OPS CENTER</h1>
          <p className="text-sm text-neutral-400 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            TODOIST SYNC · {clock}
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">+ New Mission</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "ACTIVE OPS",  val: statActive,   color: "text-white"        },
          { label: "OVERDUE",     val: statOverdue,   color: "text-red-500"      },
          { label: "COMPLETE",    val: statComplete,  color: "text-emerald-400"  },
          { label: "PRIORITY 1",  val: statP1,        color: "text-orange-500"   },
        ].map(s => (
          <Card key={s.label} className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <p className="text-xs text-neutral-400 tracking-wider mb-1">{s.label}</p>
              <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider whitespace-nowrap">Daily Completion</span>
        <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-orange-500 font-mono min-w-[36px]">{pct}%</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`text-xs px-3 py-1.5 uppercase tracking-wider font-mono border transition-colors rounded-sm ${
              activeFilter === f.key
                ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                : "bg-transparent border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list by section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">MISSION ROSTER</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {projects.length === 0 && (
            <p className="text-center text-neutral-600 font-mono text-sm py-8 uppercase tracking-wider">// No active operations //</p>
          )}
          {projects.map(proj => {
            const items = filtered.filter(t => t.project === proj)
            return (
              <div key={proj}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">{SECTION_LABELS[proj] || proj}</span>
                  <div className="flex-1 h-px bg-neutral-800" />
                  <span className="text-xs font-mono text-neutral-700">{items.length}</span>
                </div>

                {/* Tasks */}
                <div className="space-y-1">
                  {items.map(task => {
                    const done = checked.has(task.id)
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-sm border transition-all cursor-pointer group ${
                          done
                            ? "border-transparent opacity-40"
                            : "border-transparent hover:border-neutral-700 hover:bg-neutral-800"
                        }`}
                        onClick={() => setSelectedTask(task)}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={e => { e.stopPropagation(); toggle(task.id) }}
                          className="flex-shrink-0 text-neutral-600 hover:text-orange-400 transition-colors"
                        >
                          {done
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            : <Circle className="w-4 h-4" />
                          }
                        </button>

                        {/* Priority dot */}
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityColor(task.priority)}`} />

                        {/* Name */}
                        <span className={`flex-1 text-sm ${done ? "line-through text-neutral-600" : "text-neutral-200"}`}>
                          {task.name}
                        </span>

                        {/* Project tag */}
                        <span className="text-xs font-mono text-neutral-600 hidden sm:block">{task.project}</span>

                        {/* Due badge */}
                        <DueBadge task={task} done={done} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Task detail modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTask(null)}
        >
          <Card
            className="bg-neutral-900 border-neutral-700 w-full max-w-lg"
            onClick={e => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${priorityColor(selectedTask.priority)}`} />
                  <CardTitle className="text-base font-bold text-white tracking-wider leading-tight">
                    {selectedTask.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">{selectedTask.project}</p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedTask(null)} className="text-neutral-400 hover:text-white -mt-1">
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> DUE
                  </p>
                  <DueBadge task={selectedTask} done={checked.has(selectedTask.id)} />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> PROJECT
                  </p>
                  <p className="text-sm text-white">{selectedTask.project}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">PRIORITY</p>
                  <span className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${
                    selectedTask.priority === 1 ? "bg-red-500/20 text-red-400"
                    : selectedTask.priority === 2 ? "bg-orange-500/20 text-orange-400"
                    : selectedTask.priority === 3 ? "bg-blue-500/20 text-blue-400"
                    : "bg-neutral-700/50 text-neutral-400"
                  }`}>
                    P{selectedTask.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider mb-1">STATUS</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${checked.has(selectedTask.id) ? "bg-emerald-500" : selectedTask.due === "overdue" ? "bg-red-500" : "bg-white"}`} />
                    <span className="text-xs text-neutral-300 uppercase tracking-wider">
                      {checked.has(selectedTask.id) ? "Complete" : selectedTask.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => { toggle(selectedTask.id); setSelectedTask(null) }}
                >
                  {checked.has(selectedTask.id) ? "Mark Incomplete" : "Mark Complete"}
                </Button>
                <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
                  Open in Todoist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}