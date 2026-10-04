"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Layers, Plus, Terminal, Cpu, Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const navItems = [
    { label: "Overview", href: "/", icon: Layers },
    { label: "Task Matrix", href: "/tasks", icon: Terminal },
    { label: "Architect", href: "/tasks/new", icon: Plus },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-primary/20 to-purple-500/20 ring-1 ring-cyan-500/30 transition-all group-hover:scale-105 group-hover:ring-cyan-400">
              <div className="absolute inset-0 rounded-xl bg-cyan-500/10 blur-sm group-hover:bg-cyan-500/20 transition-all" />
              <Cpu className="relative size-5 text-cyan-400 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-base font-bold tracking-tight text-foreground">
                  AURA
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold px-1 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  AI OS
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono -mt-0.5">
                task synthesis matrix
              </span>
            </div>
          </Link>

          {/* AI Status Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/60 border border-border/50 text-[11px] font-mono text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>Neural Engine 2.4</span>
            <span className="text-border">|</span>
            <span className="text-cyan-500 font-medium">Synced</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                  isActive
                    ? "text-foreground bg-accent/80 shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon className={cn("size-3.5", isActive ? "text-cyan-400" : "text-muted-foreground")} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Button
            render={
              <Link href="/tasks/new" className="hidden sm:inline-flex items-center gap-1.5" />
            }
            size="sm"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-sm transition-all hover:shadow-cyan-500/25 hover:shadow-md active:scale-95 cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            <span>New Task</span>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden size-8"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Neural Engine Online
            </span>
            <span className="text-[10px] text-cyan-400">v2.4.0</span>
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-accent text-foreground font-medium border border-border/60"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("size-4", isActive ? "text-cyan-400" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </div>
                <ArrowUpRight className="size-3.5 opacity-50" />
              </Link>
            )
          })}

          <div className="pt-2">
            <Button
              render={<Link href="/tasks/new" onClick={() => setMobileOpen(false)} />}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white justify-center gap-2"
              size="sm"
            >
              <Sparkles className="size-3.5" />
              <span>Architect New Task</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
