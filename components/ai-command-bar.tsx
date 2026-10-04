"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, Loader2, Wand2, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { synthesizeAiTasksAction } from "@/lib/action"
import { cn } from "@/lib/utils"

interface AiCommandBarProps {
  className?: string
  placeholder?: string
}

const samplePrompts = [
  "Deploy real-time AI inference pipeline with latency telemetry",
  "Zero-trust security audit & API token rotation protocol",
  "Design responsive glassmorphism HUD dashboard",
  "Optimize vector search index & HNSW recall metrics",
]

export function AiCommandBar({
  className,
  placeholder = "Describe a goal or initiative (e.g., 'Deploy real-time inference pipeline')...",
}: AiCommandBarProps) {
  const router = useRouter()
  const [prompt, setPrompt] = React.useState("")
  const [isSynthesizing, setIsSynthesizing] = React.useState(false)
  const [feedback, setFeedback] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isSynthesizing) return

    setIsSynthesizing(true)
    setFeedback(null)

    try {
      const res = await synthesizeAiTasksAction(prompt)
      if (res.success) {
        setFeedback(`✨ Neural Copilot synthesized ${res.count} atomic tasks into your matrix!`)
        setPrompt("")
        router.refresh()
        setTimeout(() => setFeedback(null), 4000)
      } else {
        setFeedback("Failed to synthesize tasks. Please try again.")
      }
    } catch {
      setFeedback("An error occurred during AI synthesis.")
    } finally {
      setIsSynthesizing(false)
    }
  }

  const handleChipClick = (suggestion: string) => {
    setPrompt(suggestion)
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      <form
        onSubmit={handleSubmit}
        className="relative group rounded-2xl p-1 bg-gradient-to-r from-cyan-500/20 via-primary/20 to-purple-500/20 border border-cyan-500/30 transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-xl focus-within:shadow-cyan-500/10"
      >
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl bg-background/90 backdrop-blur-xl p-2">
          <div className="flex items-center gap-2 px-2 text-cyan-400 shrink-0">
            <Sparkles className="size-5 animate-pulse text-cyan-400" />
            <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider font-semibold text-cyan-400">
              AI Copilot
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              disabled={isSynthesizing}
              className="w-full bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="submit"
              disabled={!prompt.trim() || isSynthesizing}
              size="sm"
              className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-sm transition-all hover:shadow-cyan-500/25 active:scale-95 text-xs px-3.5 cursor-pointer"
            >
              {isSynthesizing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="size-3.5 mr-1.5" />
                  <span>Synthesize with AI</span>
                  <ArrowRight className="size-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Instant Feedback Notice */}
      {feedback && (
        <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-2 text-xs font-mono text-cyan-300 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <Sparkles className="size-4 shrink-0 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
        <span className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground mr-1">
          <Lightbulb className="size-3 text-amber-400" />
          <span>Quick Prompts:</span>
        </span>
        {samplePrompts.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleChipClick(suggestion)}
            className="rounded-full bg-muted/60 hover:bg-cyan-500/10 hover:text-cyan-400 border border-border/40 hover:border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground transition-all truncate max-w-[260px] sm:max-w-none cursor-pointer"
          >
            &ldquo;{suggestion.slice(0, 38)}...&rdquo;
          </button>
        ))}
      </div>
    </div>
  )
}
