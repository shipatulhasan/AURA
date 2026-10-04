"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleTaskAction, deleteTaskAction } from "@/lib/action"
import { Task } from "@/lib/db"

export function TaskDetailActions({ task }: { task: Task }) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const isCompleted = task.status === "completed"

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTaskAction(task.id)
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      startTransition(async () => {
        await deleteTaskAction(task.id)
        router.push("/tasks")
      })
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button
        onClick={handleToggle}
        disabled={isPending}
        variant={isCompleted ? "outline" : "default"}
        size="sm"
        className={
          isCompleted
            ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs cursor-pointer"
            : "bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 cursor-pointer"
        }
      >
        <CheckCircle2 className="size-3.5" />
        <span>{isCompleted ? "Mark Incomplete" : "Mark Resolved"}</span>
      </Button>

      <Button
        onClick={handleDelete}
        disabled={isPending}
        variant="ghost"
        size="sm"
        className="text-xs text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 gap-1.5 cursor-pointer"
      >
        <Trash2 className="size-3.5" />
        <span>Delete</span>
      </Button>
    </div>
  )
}
