import { CheckCircle2, Clock, Flame, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsProps {
  stats: {
    total: number
    completed: number
    inProgress: number
    todo: number
    urgent: number
    aiSuggested: number
    completionRate: number
  }
}

export function StatsOverview({ stats }: StatsProps) {
  const cards = [
    {
      title: "Total Matrix Items",
      value: stats.total,
      subtext: `${stats.todo} pending review`,
      icon: Layers,
      color: "text-cyan-400",
      bgGlow: "from-cyan-500/10 to-transparent",
      borderColor: "hover:border-cyan-500/40",
    },
    {
      title: "Active In-Flight",
      value: stats.inProgress,
      subtext: "Currently executing",
      icon: Clock,
      color: "text-blue-400",
      bgGlow: "from-blue-500/10 to-transparent",
      borderColor: "hover:border-blue-500/40",
    },
    {
      title: "High & Urgent",
      value: stats.urgent,
      subtext: "Requires immediate focus",
      icon: Flame,
      color: "text-rose-400",
      bgGlow: "from-rose-500/10 to-transparent",
      borderColor: "hover:border-rose-500/40",
    },
    {
      title: "Completion Velocity",
      value: `${stats.completionRate}%`,
      subtext: `${stats.completed} of ${stats.total} resolved`,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgGlow: "from-emerald-500/10 to-transparent",
      borderColor: "hover:border-emerald-500/40",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className={cn(
              "relative overflow-hidden rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-md transition-all duration-300",
              card.borderColor,
              "hover:shadow-lg hover:-translate-y-0.5"
            )}
          >
            {/* Ambient subtle corner glow */}
            <div
              className={cn(
                "absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br blur-2xl opacity-40 pointer-events-none",
                card.bgGlow
              )}
            />

            <div className="relative flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <div className="rounded-lg bg-muted/60 p-1.5 border border-border/40">
                <Icon className={cn("size-4", card.color)} />
              </div>
            </div>

            <div className="relative mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground font-heading">
                {card.value}
              </span>
            </div>

            <div className="relative mt-1 text-[11px] font-mono text-muted-foreground">
              {card.subtext}
            </div>
          </div>
        )
      })}
    </div>
  )
}
