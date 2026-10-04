import Link from "next/link"
import { Cpu } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-md mt-auto text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand note & status */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 font-mono text-[11px] text-foreground">
              <Cpu className="size-3.5 text-cyan-400" />
              <span className="font-semibold">AURA OS</span>
              <span className="text-muted-foreground">· Autonomous Productivity Suite</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry Normal</span>
            </div>
          </div>

          {/* Keyboard shortcuts reminder */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono">
            <span className="text-muted-foreground">Shortcuts:</span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground border border-border/60">D</kbd>
              <span>Theme</span>
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground border border-border/60">N</kbd>
              <span>New Task</span>
            </span>
          </div>

          {/* Links & credit */}
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/" className="hover:text-foreground transition-colors">Overview</Link>
            <Link href="/tasks" className="hover:text-foreground transition-colors">Matrix</Link>
            <Link href="/tasks/new" className="hover:text-foreground transition-colors">Architect</Link>
            <span className="text-border">|</span>
            <span className="text-muted-foreground font-mono">v2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
