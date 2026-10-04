"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Flame,
  AlertCircle,
  Clock,
  Circle,
  GripVertical,
  CheckCircle2,
  Trash2,
  Plus,
  CheckSquare,
} from "lucide-react"
import { Task, TaskPriority, TaskCategory } from "@/lib/db"
import { updateTaskPriorityAction, toggleTaskAction, deleteTaskAction, quickCreateTask } from "@/lib/action"
import { Button } from "@/components/ui/button"
import { PermissionModal } from "@/components/permission-modal"
import { cn } from "@/lib/utils"

interface TaskKanbanBoardProps {
  initialTasks: Task[]
  searchFilter?: string
  statusFilter?: string
  categoryFilter?: string
}

interface ColumnConfig {
  priority: TaskPriority
  label: string
  sublabel: string
  icon: React.ReactNode
  color: string
  borderColor: string
  glowBg: string
  badgeClass: string
  dropGlow: string
}

const columns: ColumnConfig[] = [
  {
    priority: "urgent",
    label: "Urgent",
    sublabel: "Immediate Execution",
    icon: <Flame className="size-4 text-rose-400" />,
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    glowBg: "from-rose-500/10 via-rose-500/5 to-transparent",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    dropGlow: "border-rose-500/60 bg-rose-500/10 shadow-lg shadow-rose-500/10",
  },
  {
    priority: "high",
    label: "High Priority",
    sublabel: "Critical Path",
    icon: <AlertCircle className="size-4 text-amber-400" />,
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    glowBg: "from-amber-500/10 via-amber-500/5 to-transparent",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dropGlow: "border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10",
  },
  {
    priority: "medium",
    label: "Medium Priority",
    sublabel: "Standard Cadence",
    icon: <Clock className="size-4 text-cyan-400" />,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    glowBg: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    dropGlow: "border-cyan-500/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10",
  },
  {
    priority: "low",
    label: "Low Priority",
    sublabel: "Backlog & Buffer",
    icon: <Circle className="size-4 text-muted-foreground" />,
    color: "text-muted-foreground",
    borderColor: "border-border/50",
    glowBg: "from-slate-500/10 via-slate-500/5 to-transparent",
    badgeClass: "bg-muted text-muted-foreground border-border/50",
    dropGlow: "border-slate-400/60 bg-slate-500/10 shadow-lg shadow-slate-500/10",
  },
]

const categoryStyles: Record<TaskCategory, string> = {
  "AI Agent": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Engineering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Strategy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Research: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Personal: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

export function TaskKanbanBoard({
  initialTasks,
  searchFilter = "",
  statusFilter = "all",
  categoryFilter = "all",
}: TaskKanbanBoardProps) {
  const router = useRouter()
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [prevInitial, setPrevInitial] = React.useState<Task[]>(initialTasks)

  if (prevInitial !== initialTasks) {
    setPrevInitial(initialTasks)
    setTasks(initialTasks)
  }

  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = React.useState<TaskPriority | null>(null)
  const [isPending, startTransition] = React.useTransition()

  // Deletion modal state
  const [deleteTaskTarget, setDeleteTaskTarget] = React.useState<Task | null>(null)

  // Column quick add state
  const [addingToPriority, setAddingToPriority] = React.useState<TaskPriority | null>(null)
  const [quickTitle, setQuickTitle] = React.useState("")

  // Filter tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((t) => {
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase()
        const matchesTitle = t.title.toLowerCase().includes(q)
        const matchesDesc = t.description?.toLowerCase().includes(q)
        const matchesCat = t.category.toLowerCase().includes(q)
        if (!matchesTitle && !matchesDesc && !matchesCat) return false
      }
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false
      return true
    })
  }, [tasks, searchFilter, statusFilter, categoryFilter])

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("text/plain", task.id)
    e.dataTransfer.effectAllowed = "move"
    setDraggedTaskId(task.id)
  }

  const handleDragOver = (e: React.DragEvent, priority: TaskPriority) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverColumn !== priority) {
      setDragOverColumn(priority)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetPriority: TaskPriority) => {
    e.preventDefault()
    setDragOverColumn(null)
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId
    setDraggedTaskId(null)

    if (!taskId) return

    const targetTask = tasks.find((t) => t.id === taskId)
    if (!targetTask || targetTask.priority === targetPriority) return

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, priority: targetPriority, updatedAt: new Date().toISOString() } : t))
    )

    // Commit to server action
    startTransition(async () => {
      await updateTaskPriorityAction(taskId, targetPriority)
      router.refresh()
    })
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  // Quick add inside column
  const handleColumnQuickAdd = async (priority: TaskPriority) => {
    if (!quickTitle.trim()) {
      setAddingToPriority(null)
      return
    }

    const formData = new FormData()
    formData.append("title", quickTitle)
    formData.append("priority", priority)

    startTransition(async () => {
      const res = await quickCreateTask(formData)
      if (res.success && res.task) {
        setTasks((prev) => [res.task, ...prev])
      }
      setQuickTitle("")
      setAddingToPriority(null)
      router.refresh()
    })
  }

  // Task Toggle
  const handleToggle = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: t.status === "completed" ? "todo" : "completed", updatedAt: new Date().toISOString() }
          : t
      )
    )
    startTransition(async () => {
      await toggleTaskAction(task.id)
      router.refresh()
    })
  }

  // Task Delete confirmed
  const handleConfirmDelete = () => {
    if (!deleteTaskTarget) return
    const id = deleteTaskTarget.id
    setTasks((prev) => prev.filter((t) => t.id !== id))
    startTransition(async () => {
      await deleteTaskAction(id)
      setDeleteTaskTarget(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* Visual Instruction Bar */}
      <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-2.5 text-xs font-mono text-cyan-300 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <GripVertical className="size-4 text-cyan-400 animate-pulse" />
          <span>Priority Drag Matrix: Drag any workflow card between columns to reassign priority SLA</span>
        </div>
        <span className="hidden sm:inline text-[11px] text-cyan-400/80">Real-time Persistence</span>
      </div>

      {/* 4-Column Responsive Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.priority === col.priority)
          const isOver = dragOverColumn === col.priority
          const isAdding = addingToPriority === col.priority

          return (
            <div
              key={col.priority}
              onDragOver={(e) => handleDragOver(e, col.priority)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.priority)}
              className={cn(
                "flex flex-col rounded-2xl border bg-card/40 backdrop-blur-xl transition-all duration-200 min-h-[520px] p-3.5",
                col.borderColor,
                isOver ? col.dropGlow : "hover:border-border/80"
              )}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-muted/70 p-1.5 border border-border/40">
                    {col.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading text-sm font-bold text-foreground">
                        {col.label}
                      </h3>
                      <span className={cn("px-1.5 py-0.2 rounded-full text-[10px] font-mono border font-semibold", col.badgeClass)}>
                        {colTasks.length}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground">{col.sublabel}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setAddingToPriority(isAdding ? null : col.priority)}
                  className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer"
                  title={`Add ${col.label} Task`}
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>

              {/* Inline Quick Add Form in Column */}
              {isAdding && (
                <div className="mt-3 rounded-xl border border-cyan-500/40 bg-background/90 p-2.5 backdrop-blur-md space-y-2 animate-in fade-in zoom-in-95 duration-150">
                  <input
                    type="text"
                    autoFocus
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleColumnQuickAdd(col.priority)
                      if (e.key === "Escape") setAddingToPriority(null)
                    }}
                    placeholder={`New ${col.label} task...`}
                    className="w-full bg-transparent px-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setAddingToPriority(null)}
                      className="text-[10px] h-6 px-2 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => handleColumnQuickAdd(col.priority)}
                      disabled={!quickTitle.trim()}
                      className="text-[10px] h-6 px-2.5 bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {/* Task Cards Container */}
              <div className="mt-3 flex-1 flex flex-col gap-2.5">
                {colTasks.map((task) => {
                  const isCompleted = task.status === "completed"
                  const isDragging = draggedTaskId === task.id
                  const categoryClass = categoryStyles[task.category] || "bg-muted text-muted-foreground"
                  const totalSub = task.subtasks?.length || 0
                  const compSub = task.subtasks?.filter((s) => s.completed).length || 0

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "group relative rounded-xl border border-border/50 bg-card/80 p-3 backdrop-blur-md transition-all duration-150",
                        "hover:border-cyan-500/40 hover:bg-card hover:shadow-md cursor-grab active:cursor-grabbing",
                        isDragging && "opacity-40 scale-95 border-dashed border-cyan-400 ring-2 ring-cyan-400/20",
                        isCompleted && "opacity-60 bg-muted/20"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {/* Drag Handle */}
                        <div className="mt-0.5 text-muted-foreground/40 group-hover:text-cyan-400 transition-colors shrink-0">
                          <GripVertical className="size-3.5" />
                        </div>

                        {/* Complete Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggle(task)}
                          className="mt-0.5 shrink-0 text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer"
                          aria-label="Toggle completion"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="size-4 text-emerald-400" />
                          ) : (
                            <Circle className="size-4 text-muted-foreground/60 hover:text-cyan-400" />
                          )}
                        </button>

                        {/* Title and details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/tasks/${task.id}`}
                            className={cn(
                              "block text-xs font-semibold leading-snug tracking-tight transition-colors group-hover:text-cyan-400",
                              isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                            )}
                          >
                            {task.title}
                          </Link>

                          {task.description && (
                            <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Metadata & Pills */}
                      <div className="mt-2.5 pt-2 border-t border-border/30 flex items-center justify-between text-[10px] font-mono">
                        <span className={cn("px-1.5 py-0.5 rounded border text-[10px]", categoryClass)}>
                          {task.category}
                        </span>

                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          {totalSub > 0 && (
                            <span className="flex items-center gap-1" title="Subtasks">
                              <CheckSquare className="size-3" />
                              <span>{compSub}/{totalSub}</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setDeleteTaskTarget(task)
                            }}
                            className="size-5 rounded flex items-center justify-center text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Decommission workflow"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Empty State / Dropzone Placeholder */}
                {colTasks.length === 0 && (
                  <div
                    className={cn(
                      "flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all",
                      isOver
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                        : "border-border/40 bg-muted/10 text-muted-foreground/60"
                    )}
                  >
                    <GripVertical className="size-5 mb-1.5 opacity-50" />
                    <span className="text-[11px] font-mono">
                      {isOver ? "Release to Assign" : `Drop ${col.label} Items`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Permission Modal for Deleting from Kanban */}
      <PermissionModal
        open={!!deleteTaskTarget}
        onOpenChange={(open) => !open && setDeleteTaskTarget(null)}
        title="Authorize Workflow Decommission"
        description="Are you sure you want to permanently decommission this workflow from the active matrix? This action will purge all associated telemetry and subtasks."
        itemName={deleteTaskTarget?.title}
        confirmText="Confirm & Delete"
        cancelText="Abort"
        onConfirm={handleConfirmDelete}
        isLoading={isPending}
        variant="destructive"
      />
    </div>
  )
}
