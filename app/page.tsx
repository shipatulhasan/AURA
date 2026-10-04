import Link from "next/link"
import { getTasks, getTaskStats } from "@/lib/db"
import { StatsOverview } from "@/components/stats-overview"
import { AiCommandBar } from "@/components/ai-command-bar"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  Zap,
  BarChart3,
  Bot,
  Keyboard,
} from "lucide-react"

export default async function HomePage() {
  const [tasks, stats] = await Promise.all([getTasks(), getTaskStats()])

  // Highlight urgent / in_progress / recent tasks
  const featuredTasks = tasks
    .filter((t) => t.status !== "completed")
    .slice(0, 4)

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center pt-4 sm:pt-8">
        {/* Glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 sm:size-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none -z-10" />

        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono mb-6 transition-all hover:border-cyan-400">
          <Sparkles className="size-3.5 animate-pulse" />
          <span>AURA QUANTUM v2.4</span>
          <span className="text-border">|</span>
          <span className="text-foreground/80">Neural Copilot Live</span>
        </div>

        {/* Primary Headline */}
        <h1 className="max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-heading">
          Autonomous Task Matrix for{" "}
          <span className="text-gradient-ai">Next-Gen Engineers</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Decompose high-level initiatives into atomic subtasks, orchestrate neural agents,
          and accelerate engineering velocity in a precision glassmorphic workspace.
        </p>

        {/* Interactive AI Command Bar */}
        <div className="mt-8 sm:mt-10 w-full max-w-3xl">
          <AiCommandBar placeholder="Enter any project initiative to synthesize into atomic tasks..." />
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-muted-foreground/80">
          <Keyboard className="size-3.5 text-cyan-400" />
          <span>Quick shortcut: Press</span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground border border-border/60">D</kbd>
          <span>to toggle dark mode anytime</span>
        </div>
      </section>

      {/* Real-time Telemetry Stats */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-cyan-400" />
            <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-muted-foreground">
              Telemetry & Velocity
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        </div>
        <StatsOverview stats={stats} />
      </section>

      {/* Featured Tasks Stream */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <Terminal className="size-4 text-cyan-400" />
              <span>Priority Execution Stream</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Highest-impact items awaiting resolution or actively in flight
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              render={<Link href="/tasks" />}
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 border-border/60 hover:border-cyan-500/40"
            >
              <span>Explore All ({tasks.length})</span>
              <ArrowRight className="size-3" />
            </Button>
            <Button
              render={<Link href="/tasks/new" />}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs gap-1.5"
            >
              <Sparkles className="size-3" />
              <span>Architect Task</span>
            </Button>
          </div>
        </div>

        {featuredTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center bg-card/40 backdrop-blur-md">
            <p className="text-sm text-muted-foreground">All priority items resolved. System in equilibrium.</p>
            <Button render={<Link href="/tasks/new" className="mt-3" />} size="sm" variant="outline">
              Create New Task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      {/* Architectural Capabilities Matrix */}
      <section className="rounded-2xl border border-border/50 bg-card/40 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="max-w-xl">
          <Badge variant="outline" className="mb-2 font-mono text-[10px] text-cyan-400 border-cyan-500/30">
            SYSTEM ARCHITECTURE
          </Badge>
          <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
            Engineered for Autonomous Execution
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            A unified interface bridging human strategic direction and high-throughput AI agent coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl border border-border/40 bg-background/50 p-4 space-y-2 hover:border-cyan-500/30 transition-colors">
            <div className="size-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Bot className="size-4" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Neural Decomposition</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Natural language prompts automatically unravel into multi-tier task trees with inferred categories and priority weights.
            </p>
          </div>

          <div className="rounded-xl border border-border/40 bg-background/50 p-4 space-y-2 hover:border-purple-500/30 transition-colors">
            <div className="size-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Zap className="size-4" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Zero Latency Telemetry</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reactive state updates with Next.js 16 server actions, optimistic UI transitions, and atomic cache revalidation.
            </p>
          </div>

          <div className="rounded-xl border border-border/40 bg-background/50 p-4 space-y-2 hover:border-emerald-500/30 transition-colors">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Cpu className="size-4" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Base UI & Shadcn Nova</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unstyled accessible foundations enriched with bespoke OKLCH dark luminescence and hardware-accelerated shaders.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
