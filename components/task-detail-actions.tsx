"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleTaskAction, deleteTaskAction } from "@/lib/action"
import { Task } from "@/lib/db"
import { PermissionModal } from "@/components/permission-modal"

export function TaskDetailActions({ task }: { task: Task }) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)

  const isCompleted = task.status === "completed"

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTaskAction(task.id)
      router.refresh()
    })
  }

  const handleConfirmDelete = () => {
    startTransition(async () => {
      await deleteTaskAction(task.id)
      setDeleteModalOpen(false)
      router.push("/tasks")
    })
  }

  return (
    <>
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
          onClick={() => setDeleteModalOpen(true)}
          disabled={isPending}
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 gap-1.5 cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span>Delete</span>
        </Button>
      </div>

      <PermissionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Authorize Workflow Decommission"
        description="Are you sure you want to permanently decommission this workflow from the active matrix? This action will purge all associated telemetry and subtasks."
        itemName={task.title}
        confirmText="Confirm & Delete"
        cancelText="Abort"
        onConfirm={handleConfirmDelete}
        isLoading={isPending}
        variant="destructive"
      />
    </>
  )
}
