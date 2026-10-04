"use client"

import * as React from "react"
import Link from "next/link"
import { createTask } from "@/lib/action"
import { TaskPriority, TaskCategory } from "@/lib/db"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  ArrowLeft,
  Flame,
  AlertCircle,
  Clock,
  Circle,
  Tag,
  Calendar,
  Wand2,
  CheckCircle2,
  Eye,
} from "lucide-react"

const templates = [
  {
    name: "AI Edge Model",
    title: "Deploy Lightweight Quantized LLM on Edge Workers",
    description: "Orchestrate edge inference nodes with real-time token streaming and sub-40ms latency SLA.",
    category: "AI Agent" as TaskCategory,
    priority: "urgent" as TaskPriority,
    dueDate: "Tomorrow, 16:00",
    tags: "edge, wasm, llm, streaming",
  },
  {
    name: "Security Audit",
    title: "Audit Zero-Trust API Boundaries & Rotate HMAC Secrets",
    description: "Comprehensive cryptographic verification of internal microservices and webhook signatures.",
    category: "Strategy" as TaskCategory,
    priority: "high" as TaskPriority,
    dueDate: "End of Week",
    tags: "security, hmac, zero-trust",
  },
  {
    name: "UI Refactor",
    title: "Implement Hardware-Accelerated Glassmorphic Shaders",
    description: "Refactor design system tokens to use OKLCH color spaces, dynamic luminescence, and high-contrast dark modes.",
    category: "Design" as TaskCategory,
    priority: "medium" as TaskPriority,
    dueDate: "Next Sprint",
    tags: "ui-kit, css, shaders",
  },
]

export default function NewTaskPage() {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [priority, setPriority] = React.useState<TaskPriority>("medium")
  const [category, setCategory] = React.useState<TaskCategory>("AI Agent")
  const [dueDate, setDueDate] = React.useState("This Week")
  const [tags, setTags] = React.useState("ai, engineering")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const applyTemplate = (t: (typeof templates)[0]) => {
    setTitle(t.title)
    setDescription(t.description)
    setCategory(t.category)
    setPriority(t.priority)
    setDueDate(t.dueDate)
    setTags(t.tags)
  }

  const priorityOptions: { value: TaskPriority; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "urgent", label: "Urgent", icon: <Flame className="size-3.5" />, color: "text-rose-400 border-rose-500/30 hover:border-rose-500" },
    { value: "high", label: "High", icon: <AlertCircle className="size-3.5" />, color: "text-amber-400 border-amber-500/30 hover:border-amber-500" },
    { value: "medium", label: "Medium", icon: <Clock className="size-3.5" />, color: "text-cyan-400 border-cyan-500/30 hover:border-cyan-500" },
    { value: "low", label: "Low", icon: <Circle className="size-3.5" />, color: "text-muted-foreground border-border/40 hover:border-border" },
  ]

  const categoryOptions: TaskCategory[] = ["AI Agent", "Engineering", "Design", "Strategy", "Research", "Personal"]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              render={<Link href="/tasks" />}
              variant="ghost"
              size="icon-xs"
              className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Task Architect Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground pl-9">
            Synthesize a new workflow item with autonomous classification, priority weighting, and metadata.
          </p>
        </div>

        {/* Quick Templates */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-muted-foreground mr-1 flex items-center gap-1">
            <Wand2 className="size-3 text-cyan-400" />
            <span>Templates:</span>
          </span>
          {templates.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => applyTemplate(tmpl)}
              className="rounded-lg bg-muted/60 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-border/40 px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-cyan-400 transition-all cursor-pointer"
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creation Form (7 cols) */}
        <div className="lg:col-span-7">
          <form
            action={createTask}
            onSubmit={() => setIsSubmitting(true)}
            className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl space-y-6"
          >
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Task Title <span className="text-rose-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deploy Neural Inference Agent..."
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Technical Brief & Execution Notes
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide architectural context, acceptance criteria, or dependencies..."
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all resize-y"
              />
            </div>

            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Priority Allocation
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {priorityOptions.map((opt) => {
                  const isSelected = priority === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPriority(opt.value)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-3 text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? "bg-accent/80 border-cyan-400 shadow-xs text-foreground font-semibold"
                          : `bg-background/40 ${opt.color}`
                      }`}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
              <input type="hidden" name="priority" value={priority} />
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Classification Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((cat) => {
                  const isSelected = category === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 font-semibold"
                          : "bg-background/40 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
              <input type="hidden" name="category" value={category} />
            </div>

            {/* Due Date & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dueDate" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Timeline / SLA
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="dueDate"
                    name="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="e.g., Today 18:00, Oct 12"
                    className="w-full rounded-xl border border-border/60 bg-background/60 pl-9 pr-3 py-2 text-xs text-foreground backdrop-blur-sm focus:border-cyan-500/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tags" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Tags (comma separated)
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="tags"
                    name="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., neural, edge, api"
                    className="w-full rounded-xl border border-border/60 bg-background/60 pl-9 pr-3 py-2 text-xs text-foreground backdrop-blur-sm focus:border-cyan-500/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-3">
              <Button
                render={<Link href="/tasks" />}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-sm transition-all hover:shadow-cyan-500/25 active:scale-95 px-5 cursor-pointer"
              >
                <Sparkles className="size-3.5 mr-1.5" />
                <span>{isSubmitting ? "Committing Workflow..." : "Commit to Matrix"}</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Live Matrix Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Eye className="size-4 text-cyan-400" />
            <span>Real-time Card Preview</span>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-card/80 p-5 backdrop-blur-xl shadow-xl shadow-cyan-500/5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/40">
                <span className="size-1.5 rounded-full bg-slate-400" />
                To Do
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-md border text-cyan-400 bg-cyan-500/10 border-cyan-500/20">
                {category}
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-base text-foreground leading-snug">
                {title.trim() || "Your Task Title Will Appear Here"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {description.trim() ||
                  "A succinct technical description outlining objectives, acceptance criteria, and expected output."}
              </p>
            </div>

            <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-2.5 text-[11px] font-mono text-cyan-300 flex items-start gap-2">
              <Sparkles className="size-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                ⚡ AI Copilot: Auto-allocates execution priority [{priority.toUpperCase()}]. Inferred category [{category}].
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/50"
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>{dueDate}</span>
              </span>
              <span className="text-cyan-400">Ready to Commit</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-xs text-muted-foreground space-y-1 font-mono">
            <div className="text-foreground font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>Autonomous Validation</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Once committed, this task will be instantly indexed into the global matrix and ready for agent delegation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}