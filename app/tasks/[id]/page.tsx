import Link from "next/link"
import { getTask } from "@/lib/db"
import { TaskDetailActions } from "@/components/task-detail-actions"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  Terminal,
  Shield,
  Layers,
  Cpu,
  Calendar,
} from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const task = await getTask(id)
  return {
    title: task ? `${task.title} // AURA OS` : "Workflow Item // AURA OS",
  }
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const task = await getTask(id)

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center border border-border/50 text-muted-foreground">
          <Terminal className="size-6" />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">Workflow Item Not Found</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          The requested identifier <code className="font-mono text-cyan-400">{id}</code> does not exist in the active matrix.
        </p>
        <Button render={<Link href="/tasks" />} variant="outline" size="sm" className="text-xs gap-1.5">
          <ArrowLeft className="size-3.5" />
          <span>Return to Matrix</span>
        </Button>
      </div>
    )
  }

  const isCompleted = task.status === "completed"

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <Button
            render={<Link href="/tasks" />}
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="Back to tasks"
          >
            <ArrowLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">Matrix /</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold truncate max-w-[200px]">
              {task.id.slice(0, 12)}
            </span>
          </div>
        </div>

        <TaskDetailActions task={task} />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Title, AI Insights, Description, Subtasks (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Status Banner */}
          <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-muted/60 border border-border/50">
                <span
                  className={`size-2 rounded-full ${
                    isCompleted ? "bg-emerald-400" : task.status === "in_progress" ? "bg-cyan-400 animate-pulse" : "bg-slate-400"
                  }`}
                />
                <span className="capitalize">{task.status.replace("_", " ")}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border text-cyan-400 bg-cyan-500/10 border-cyan-500/20">
                <Layers className="size-3" />
                <span>{task.category}</span>
              </span>
            </div>

            <h1
              className={`font-heading text-2xl sm:text-3xl font-bold tracking-tight ${
                isCompleted ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {task.title}
            </h1>

            {task.description ? (
              <div className="pt-2 text-sm text-foreground/80 leading-relaxed whitespace-pre-line border-t border-border/30">
                {task.description}
              </div>
            ) : (
              <p className="pt-2 text-xs italic text-muted-foreground border-t border-border/30">
                No supplementary description provided for this workflow item.
              </p>
            )}
          </div>

          {/* AI Copilot Execution Strategy Callout */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-card/70 to-purple-500/5 p-6 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Sparkles className="size-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground font-heading">
                  AI Copilot Execution Blueprint
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Automated telemetry analysis
                </span>
              </div>
            </div>

            <p className="text-xs text-foreground/90 font-mono leading-relaxed bg-background/50 p-3 rounded-xl border border-border/40">
              {task.aiInsight ||
                "⚡ Task initialized in matrix. Autonomous agents monitoring dependencies and latency thresholds."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="rounded-lg bg-background/40 p-2.5 border border-border/30">
                <div className="text-[10px] text-muted-foreground uppercase">Estimated Complexity</div>
                <div className="text-xs font-semibold text-cyan-400 mt-0.5">
                  {task.priority === "urgent" ? "High (SLA Critical)" : task.priority === "high" ? "Moderate-High" : "Standard"}
                </div>
              </div>
              <div className="rounded-lg bg-background/40 p-2.5 border border-border/30">
                <div className="text-[10px] text-muted-foreground uppercase">Suggested Next Step</div>
                <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                  {isCompleted ? "Verified & Archived" : "Deploy unit benchmarks"}
                </div>
              </div>
            </div>
          </div>

          {/* Subtasks Execution Checklist if available */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                  <Cpu className="size-4 text-cyan-400" />
                  <span>Subtask Decomposition</span>
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} Resolved
                </span>
              </div>

              <div className="space-y-2">
                {task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/40 text-xs"
                  >
                    {sub.completed ? (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={sub.completed ? "line-through text-muted-foreground" : "text-foreground"}>
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Metadata HUD (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-xl space-y-4 text-xs">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Telemetry & Coordinates
            </h3>

            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Shield className="size-3.5" />
                  <span>Priority:</span>
                </span>
                <span className="uppercase font-semibold text-cyan-400">{task.priority}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Layers className="size-3.5" />
                  <span>Category:</span>
                </span>
                <span className="font-semibold text-foreground">{task.category}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>Target SLA:</span>
                </span>
                <span className="text-foreground">{task.dueDate || "Flexible"}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>Created:</span>
                </span>
                <span className="text-muted-foreground">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="pt-2">
                <span className="block text-[10px] font-mono uppercase text-muted-foreground mb-1.5">
                  Matrix Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-muted/60 border border-border/50 font-mono text-[10px] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick link back */}
          <Button
            render={<Link href="/tasks" className="w-full justify-center gap-1.5" />}
            variant="outline"
            size="sm"
            className="w-full text-xs border-border/60"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Matrix</span>
          </Button>
        </div>
      </div>
    </div>
  )
}