"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Trash2,
  Tag,
  AlertCircle,
  Flame,
  CheckSquare,
  ArrowRight,
} from "lucide-react"
import { Task, TaskPriority, TaskCategory, TaskStatus } from "@/lib/db"
import { toggleTaskAction, deleteTaskAction } from "@/lib/action"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  compact?: boolean
}

const priorityStyles: Record<TaskPriority, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  urgent: {
    label: "Urgent",
    badgeClass: "bg-rose-500/15 text-rose-400 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300 ring-1 ring-rose-500/20",
    icon: <Flame className="size-3 text-rose-400" />,
  },
  high: {
    label: "High",
    badgeClass: "bg-amber-500/15 text-amber-500 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
    icon: <AlertCircle className="size-3 text-amber-500" />,
  },
  medium: {
    label: "Medium",
    badgeClass: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300",
    icon: <Clock className="size-3 text-cyan-400" />,
  },
  low: {
    label: "Low",
    badgeClass: "bg-muted text-muted-foreground border-border/40",
    icon: <Circle className="size-3 text-muted-foreground" />,
  },
}

const categoryStyles: Record<TaskCategory, string> = {
  "AI Agent": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Engineering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Strategy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Research: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Personal: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

const statusConfig: Record<TaskStatus, { label: string; dotClass: string }> = {
  todo: { label: "To Do", dotClass: "bg-slate-400" },
  in_progress: { label: "In Flight", dotClass: "bg-cyan-400 animate-pulse" },
  completed: { label: "Resolved", dotClass: "bg-emerald-400" },
  ai_suggested: { label: "AI Draft", dotClass: "bg-purple-400" },
}

export function TaskCard({ task, compact = false }: TaskCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [showInsight, setShowInsight] = React.useState(false)

  const isCompleted = task.status === "completed"
  const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium
  const categoryClass = categoryStyles[task.category] || "bg-muted text-muted-foreground"
  const statusInfo = statusConfig[task.status] || statusConfig.todo

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0
  const totalSubtasks = task.subtasks?.length || 0

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      await toggleTaskAction(task.id)
      router.refresh()
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`Delete "${task.title}"?`)) {
      startTransition(async () => {
        await deleteTaskAction(task.id)
        router.refresh()
      })
    }
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border/50 bg-card/60 p-4 transition-all duration-200 backdrop-blur-md",
        "hover:border-cyan-500/30 hover:bg-card/90 hover:shadow-lg hover:shadow-cyan-500/5",
        isCompleted && "opacity-75 bg-muted/20 border-border/30",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      <div className="space-y-3">
        {/* Header row: Status, Priority, Category */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50 border border-border/40">
              <span className={cn("size-1.5 rounded-full", statusInfo.dotClass)} />
              {statusInfo.label}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border",
                priorityInfo.badgeClass
              )}
            >
              {priorityInfo.icon}
              <span>{priorityInfo.label}</span>
            </span>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono border",
              categoryClass
            )}
          >
            <Tag className="size-2.5 opacity-70" />
            <span>{task.category}</span>
          </span>
        </div>

        {/* Task Title & Toggle Checkbox */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isCompleted ? "Mark task incomplete" : "Mark task complete"}
            className="mt-0.5 shrink-0 rounded-lg p-0.5 text-muted-foreground hover:text-cyan-400 focus:outline-none transition-colors cursor-pointer"
          >
            {isCompleted ? (
              <CheckCircle2 className="size-5 text-emerald-400 transition-transform hover:scale-110" />
            ) : (
              <Circle className="size-5 text-muted-foreground/60 transition-transform hover:scale-110 hover:text-cyan-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <Link
              href={`/tasks/${task.id}`}
              className={cn(
                "block text-sm font-semibold tracking-tight leading-snug transition-colors group-hover:text-cyan-400",
                isCompleted ? "line-through text-muted-foreground" : "text-foreground"
              )}
            >
              {task.title}
            </Link>

            {task.description && !compact && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* AI Insight Pill */}
        {task.aiInsight && (
          <div
            onClick={() => setShowInsight(!showInsight)}
            className="cursor-pointer rounded-lg bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1.5 text-[11px] font-mono text-cyan-300/90 transition-all flex items-start gap-2"
          >
            <Sparkles className="size-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span className={cn("leading-relaxed", !showInsight && "line-clamp-1")}>
              {task.aiInsight}
            </span>
          </div>
        )}

        {/* Subtask progress bar if any */}
        {totalSubtasks > 0 && (
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckSquare className="size-3" />
                <span>Execution Steps</span>
              </span>
              <span>
                {completedSubtasks}/{totalSubtasks} ({Math.round((completedSubtasks / totalSubtasks) * 100)}%)
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer / Meta & Actions */}
      <div className="mt-3.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Clock className="size-3 opacity-70" />
              <span>{task.dueDate}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            render={<Link href={`/tasks/${task.id}`} />}
            variant="ghost"
            size="xs"
            className="text-[11px] text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
          >
            <span>Inspect</span>
            <ArrowRight className="size-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDelete}
            className="size-6 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-md cursor-pointer"
            aria-label="Delete task"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
