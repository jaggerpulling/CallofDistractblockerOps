export interface Site {
  id: string
  name: string
  status: "active" | "planning" | "completed" | "compromised"
  priority: "low" | "medium" | "high" | "critical"
  location: string
  agents: number
  progress: number
  startDate: string
  estimatedCompletion: string
  description: string
  objectives: string[]
}

export const sites: Site[] = [
  {
      id: "OP-OMEGA-001",
      name: "SHADOW PROTOCOL",
      status: "active",
      priority: "critical",
      location: "Eastern Europe",
      agents: 5,
      progress: 75,
      startDate: "2025-06-15",
      estimatedCompletion: "2025-06-30",
      description: "Track high-value target in Eastern Europe",
      objectives: ["Locate target", "Establish surveillance", "Extract intelligence"],
    },
    {
      id: "OP-DELTA-002",
      name: "GHOST FIRE",
      status: "planning",
      priority: "high",
      location: "Seoul",
      agents: 3,
      progress: 25,
      startDate: "2025-06-20",
      estimatedCompletion: "2025-07-05",
      description: "Infiltrate cybercrime network in Seoul",
      objectives: ["Penetrate network", "Gather evidence", "Identify key players"],
    },
    {
      id: "OP-SIERRA-003",
      name: "NIGHT STALKER",
      status: "completed",
      priority: "medium",
      location: "Berlin",
      agents: 2,
      progress: 100,
      startDate: "2025-05-28",
      estimatedCompletion: "2025-06-12",
      description: "Monitor rogue agent communications in Berlin",
      objectives: ["Intercept communications", "Decode messages", "Report findings"],
    },
    {
      id: "OP-ALPHA-004",
      name: "CRIMSON TIDE",
      status: "active",
      priority: "high",
      location: "Cairo",
      agents: 4,
      progress: 60,
      startDate: "2025-06-10",
      estimatedCompletion: "2025-06-25",
      description: "Support covert extraction in South America",
      objectives: ["Secure extraction point", "Neutralize threats", "Extract asset"],
    },
    {
      id: "OP-BRAVO-005",
      name: "SILENT BLADE",
      status: "compromised",
      priority: "critical",
      location: "Moscow",
      agents: 6,
      progress: 40,
      startDate: "2025-06-05",
      estimatedCompletion: "2025-06-20",
      description: "Monitor rogue agent communications in Berlin",
      objectives: ["Assess compromise", "Extract personnel", "Damage control"],
    },
]