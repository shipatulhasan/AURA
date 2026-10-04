import Link from "next/link"
import { getTasks, getTaskStats } from "@/lib/db"
import { TaskListView } from "@/components/task-list-view"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Terminal, Sparkles } from "lucide-react"

export const metadata = {
  title: "Task Matrix // AURA OS",
  description: "Centralized execution matrix for all active, scheduled, and AI-decomposed workflows.",
}

export default async function TasksPage() {
  const [tasks, stats] = await Promise.all([getTasks(), getTaskStats()])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Terminal className="size-4" />
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Task Matrix
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-cyan-400 border-cyan-500/30">
              {tasks.length} Workflows
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Multi-dimensional registry for engineering initiatives, AI agents, and architectural milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            render={
              <Link href="/tasks/new" className="flex items-center gap-1.5" />
            }
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-sm transition-all hover:shadow-cyan-500/25 active:scale-95"
          >
            <Sparkles className="size-3.5" />
            <span>Architect Task</span>
          </Button>
        </div>
      </div>

      {/* Mini Telemetry Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border/40 bg-card/40 p-3 backdrop-blur-sm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Active Workflows</div>
          <div className="mt-1 text-xl font-bold font-heading text-foreground">{stats.total}</div>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/40 p-3 backdrop-blur-sm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">In Flight</div>
          <div className="mt-1 text-xl font-bold font-heading text-cyan-400">{stats.inProgress}</div>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/40 p-3 backdrop-blur-sm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Urgent Priority</div>
          <div className="mt-1 text-xl font-bold font-heading text-rose-400">{stats.urgent}</div>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/40 p-3 backdrop-blur-sm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Velocity</div>
          <div className="mt-1 text-xl font-bold font-heading text-emerald-400">{stats.completionRate}%</div>
        </div>
      </div>

      {/* Interactive Task List View with Filters & Fast Capture */}
      <TaskListView initialTasks={tasks} />
    </div>
  )
}