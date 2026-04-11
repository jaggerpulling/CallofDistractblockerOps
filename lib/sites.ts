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
  id: "SITE-001",
  name: "YOUTUBE.COM",
  status: "active",
  priority: "critical",
  location: "Video Streaming Platform",
  agents: 0,
  progress: 75,
  startDate: "2025-06-01",
  estimatedCompletion: "2025-12-31",
  description: "High-dopamine video platform. Primary source of passive scroll loops and autoplay traps.",
  objectives: ["Block autoplay feeds", "Redirect focus time", "Save 4.2hrs this week"],
},
{
  id: "SITE-002",
  name: "INSTAGRAM.COM",
  status: "active",
  priority: "critical",
  location: "Social Media Platform",
  agents: 0,
  progress: 60,
  startDate: "2025-06-01",
  estimatedCompletion: "2025-12-31",
  description: "Infinite scroll image feed. Engineered for compulsive checking and FOMO loops.",
  objectives: ["Neutralize scroll trap", "Block reels autoplay", "Reclaim 2.1hrs this week"],
},
{
  id: "SITE-003",
  name: "REDDIT.COM",
  status: "active",
  priority: "high",
  location: "Forum Aggregator Platform",
  agents: 0,
  progress: 50,
  startDate: "2025-06-01",
  estimatedCompletion: "2025-12-31",
  description: "Rabbit hole forum network. Low-effort content consumption disguised as learning.",
  objectives: ["Block front page feed", "Restrict subreddit access", "Reclaim 1.8hrs this week"],
},
{
  id: "SITE-004",
  name: "TWITTER.COM",
  status: "planning",
  priority: "high",
  location: "Microblog Social Platform",
  agents: 0,
  progress: 25,
  startDate: "2025-06-15",
  estimatedCompletion: "2025-12-31",
  description: "Real-time outrage and hot-take engine. Reward loop tied to notifications and trending tabs.",
  objectives: ["Suppress notification pull", "Block trending feed", "Redirect to deep work"],
},
{
  id: "SITE-005",
  name: "TWITCH.TV",
  status: "active",
  priority: "high",
  location: "Live Streaming Platform",
  agents: 0,
  progress: 40,
  startDate: "2025-06-01",
  estimatedCompletion: "2025-12-31",
  description: "Live gaming and entertainment streams. Passive viewing disguised as community engagement.",
  objectives: ["Block live feed access", "Suppress chat dopamine loop", "Reclaim 3.0hrs this week"],
},
{
  id: "SITE-006",
  name: "STEAM.COM",
  status: "compromised",
  priority: "critical",
  location: "Gaming Distribution Platform",
  agents: 0,
  progress: 20,
  startDate: "2025-06-05",
  estimatedCompletion: "2025-12-31",
  description: "Game launcher and storefront. Daily login streaks and sale notifications designed to pull focus.",
  objectives: ["Block storefront browsing", "Disable sale alerts", "Contain launch window access"],
}
]