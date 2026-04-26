"use client"
import { useBlocker } from "@/app/context/BlockerContext" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CommandCenterPage() {
  const { enabled, setEnabled } = useBlocker()
  
  return (
    <div className="p-6 space-y-6">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* NETWORK ACCESS CONTROL (Replaced Agent Allocation) */}
        <Card className={`lg:col-span-4 bg-neutral-900 border-neutral-700 transition-colors ${enabled ? "border-orange-500/30" : "border-neutral-700"}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex justify-between">
              NETWORK ACCESS CONTROL
              <span className="text-[10px] text-orange-500 animate-pulse">PI-HOLE: CONNECTED</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6 border-b border-neutral-800 pb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">14</div>
                <div className="text-[10px] uppercase text-neutral-500">Domains Blocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">03</div>
                <div className="text-[10px] uppercase text-neutral-500">Tasks Left</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">89%</div>
                <div className="text-[10px] uppercase text-neutral-500">Efficiency</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] text-neutral-500 mb-2 tracking-widest">ACTIVE INTERCEPTIONS</div>
              {[
                { id: "DOM-YT", name: "youtube.com", status: "blocked" },
                { id: "DOM-IG", name: "instagram.com", status: "blocked" },
                { id: "DOM-RX", name: "reddit.com", status: "bypassed" },
                { id: "DOM-X", name: "x.com", status: "blocked" },
              ].map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-2 bg-neutral-800/50 rounded border border-neutral-800 hover:border-neutral-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${enabled && domain.status === "blocked" ? "bg-orange-500 shadow-[0_0_8px_#f97316]" : "bg-neutral-600"}`}></div>
                    <div>
                      <div className="text-[10px] text-white font-mono">{domain.id}</div>
                      <div className="text-[10px] text-neutral-500 uppercase">{domain.name}</div>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-neutral-500">
                    {enabled && domain.status === "blocked" ? "OFFLINE" : "BYPASS"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* INTERCEPTION LOG (Updated Activity Log) */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">THREAT INTERCEPTION LOG</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { time: "09:29:01", event: "DNS_REQ_BLOCKED", target: "youtube.com", origin: "192.168.1.15" },
                { time: "08:12:45", event: "TASK_COMPLETED", target: "Finish UI Design", origin: "TODOIST_API" },
                { time: "07:55:12", event: "SESSION_START", target: "DEEP_FOCUS", origin: "LOCAL_AUTH" },
                { time: "07:44:33", event: "DNS_REQ_BLOCKED", target: "facebook.com", origin: "192.168.1.15" },
              ].map((log, index) => (
                <div key={index} className="text-[10px] border-l-2 border-orange-600 pl-3 py-1">
                  <div className="text-neutral-500 font-mono text-[9px]">{log.time} // {log.event}</div>
                  <div className="text-neutral-300 uppercase">
                    Target: <span className="text-white font-mono">{log.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MASTER TOGGLE (Main Control) */}
        <Card className={`lg:col-span-4 bg-neutral-900 border-neutral-700 transition-all duration-500 ${enabled ? "shadow-[inset_0_0_20px_rgba(249,115,22,0.05)] border-orange-500/50" : ""}`}>
          <CardHeader className="pb-3 text-center">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">BLOCKER PROTOCOL</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-6 cursor-pointer group" onClick={() => setEnabled(!enabled)}>
               {/* Animated Rings */}
              <div className={`absolute inset-0 border-2 rounded-full transition-all duration-700 ${enabled ? "border-orange-500 animate-pulse shadow-[0_0_30px_rgba(249,115,22,0.4)]" : "border-neutral-700 opacity-50"}`}></div>
              <div className={`absolute inset-4 border border-dashed rounded-full transition-all duration-1000 ${enabled ? "border-orange-500/50 rotate-180" : "border-neutral-800"}`}></div>
              
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-xl font-mono font-black tracking-tighter transition-colors ${enabled ? "text-orange-500" : "text-neutral-700"}`}>
                  {enabled ? "ENGAGED" : "LOCKED"}
                </span>
                <span className="text-[8px] text-neutral-500 font-mono mt-1">S-0192-B</span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-500 space-y-2 w-full font-mono bg-black/40 p-3 rounded border border-neutral-800">
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span>STATUS:</span>
                <span className={enabled ? "text-orange-500 animate-pulse" : "text-neutral-600"}>
                  {enabled ? "● PROTOCOL ACTIVE" : "○ STANDBY"}
                </span>
              </div>
              <div className="text-[9px] leading-relaxed uppercase">
                {enabled 
                  ? "> Redirecting distracting traffic to Null Route (0.0.0.0). Task dependency verified."
                  : "> Protection paused. Monitoring mode active. Waiting for Todoist sync."}
              </div>
              <div className="flex gap-2 mt-2">
                <div className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 text-[8px]">TASK_LOCK</div>
                <div className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 text-[8px]">PI_HOLE_v5.0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PRODUCTIVITY ANALYTICS (Replaced Task Activity Chart) */}
        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PRODUCTIVITY YIELD (7-DAY)</CardTitle>
            <div className="text-[10px] text-neutral-500 font-mono">AVG: 8.2 TASKS/DAY</div>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative overflow-hidden bg-black/20 rounded border border-neutral-800/50">
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-scanline opacity-5"></div>
              
              <div className="absolute inset-0 grid grid-cols-7 gap-1 p-4 items-end">
                {[40, 70, 45, 90, 65, 80, 30].map((height, i) => (
                  <div key={i} className="relative group flex flex-col items-center">
                    <div 
                      className={`w-full transition-all duration-1000 ${enabled ? "bg-orange-600/40 border-t border-orange-500" : "bg-neutral-800"}`} 
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-[8px] text-neutral-600 font-mono mt-2">04.{i+10}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MISSION STATS (Replaced Mission Information) */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">LIFETIME STATS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-neutral-800/30 border-l-2 border-green-500">
              <div className="text-[10px] text-neutral-500 uppercase mb-1">Current Streak</div>
              <div className="text-2xl font-bold text-white font-mono">12 DAYS</div>
            </div>
            <div className="p-3 bg-neutral-800/30 border-l-2 border-orange-500">
              <div className="text-[10px] text-neutral-500 uppercase mb-1">Total Focus Time</div>
              <div className="text-2xl font-bold text-white font-mono">142:09:12</div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
               <div className="text-center p-2 bg-black/20 rounded">
                  <div className="text-xs text-white font-mono">842</div>
                  <div className="text-[8px] text-neutral-500 uppercase">Tasks Done</div>
               </div>
               <div className="text-center p-2 bg-black/20 rounded">
                  <div className="text-xs text-white font-mono">08</div>
                  <div className="text-[8px] text-neutral-500 uppercase">Best Week</div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}