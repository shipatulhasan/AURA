"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldAlert, AlertTriangle, Loader2 } from "lucide-react"

interface PermissionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  itemName?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
  variant?: "destructive" | "warning"
}

export function PermissionModal({
  open,
  onOpenChange,
  title = "Security Clearance & Authorization",
  description = "Confirm workflow decommissioning. This action permanently deletes the record from the neural matrix.",
  itemName,
  confirmText = "Authorize & Delete",
  cancelText = "Abort",
  onConfirm,
  isLoading = false,
  variant = "destructive",
}: PermissionModalProps) {
  const isDestructive = variant === "destructive"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10 sm:max-w-md">
        <DialogHeader className="gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-xl border ${
                isDestructive
                  ? "bg-rose-500/15 border-rose-500/30 text-rose-400 ring-2 ring-rose-500/20"
                  : "bg-amber-500/15 border-amber-500/30 text-amber-400 ring-2 ring-amber-500/20"
              }`}
            >
              {isDestructive ? (
                <ShieldAlert className="size-5 animate-pulse" />
              ) : (
                <AlertTriangle className="size-5" />
              )}
            </div>

            <div className="space-y-0.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-rose-400 font-semibold">
                SYSTEM PROTOCOL // DECOMMISSION
              </span>
              <DialogTitle className="text-base font-bold text-foreground font-heading">
                {title}
              </DialogTitle>
            </div>
          </div>

          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Item preview chip */}
        {itemName && (
          <div className="rounded-xl border border-border/50 bg-muted/40 p-3 text-xs font-mono">
            <span className="text-[10px] uppercase text-muted-foreground block mb-1">
              Target Workflow:
            </span>
            <span className="text-foreground font-semibold break-all text-xs">
              &ldquo;{itemName}&rdquo;
            </span>
          </div>
        )}

        <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-2.5 text-[11px] font-mono text-rose-300 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-rose-400 animate-ping" />
          <span>Irreversible Operation: Memory references will be pruned.</span>
        </div>

        <DialogFooter className="mt-2 flex-row justify-end gap-2.5 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-xs border-border/60 hover:bg-muted cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={`text-xs font-medium text-white shadow-sm transition-all cursor-pointer ${
              isDestructive
                ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 hover:shadow-rose-500/25 active:scale-95"
                : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                <span>Authorizing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
