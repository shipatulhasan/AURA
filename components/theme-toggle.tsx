"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!isClient) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-8 rounded-lg border border-border/50 bg-background/50 opacity-60"
        aria-label="Toggle theme"
      >
        <Sun className="size-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="size-8 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Toggle theme mode"
            >
              {isDark ? (
                <Moon className="size-4 text-cyan-400 transition-transform duration-300 rotate-0" />
              ) : (
                <Sun className="size-4 text-amber-500 transition-transform duration-300 rotate-0" />
              )}
            </Button>
          }
        />
        <TooltipContent side="bottom" className="text-xs">
          <span>Toggle theme</span>
          <kbd className="ml-1.5 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/40">
            D
          </kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
