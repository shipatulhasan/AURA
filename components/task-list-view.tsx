"use client"

import * as React from "react"
import Link from "next/link"
import { Search, LayoutGrid, List, Sparkles, Plus, X, Columns3 } from "lucide-react"
import { Task } from "@/lib/db"
import { TaskCard } from "@/components/task-card"
import { TaskKanbanBoard } from "@/components/task-kanban-board"
import { Button } from "@/components/ui/button"
import { quickCreateTask } from "@/lib/action"
import { useRouter } from "next/navigation"

interface TaskListViewProps {
  initialTasks: Task[]
}

export function TaskListView({ initialTasks }: TaskListViewProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [viewMode, setViewMode] = React.useState<"kanban" | "grid" | "list">("kanban")
  const [quickTitle, setQuickTitle] = React.useState("")
  const [isQuickAdding, setIsQuickAdding] = React.useState(false)

  // Filter tasks for grid & list views
  const filteredTasks = React.useMemo(() => {
    return initialTasks.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = t.title.toLowerCase().includes(q)
        const matchesDesc = t.description?.toLowerCase().includes(q)
        const matchesCat = t.category.toLowerCase().includes(q)
        const matchesTags = t.tags?.some((tag) => tag.toLowerCase().includes(q))
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesTags) return false
      }

      // Status
      if (selectedStatus !== "all" && t.status !== selectedStatus) return false

      // Priority
      if (selectedPriority !== "all" && t.priority !== selectedPriority) return false

      // Category
      if (selectedCategory !== "all" && t.category !== selectedCategory) return false

      return true
    })
  }, [initialTasks, searchQuery, selectedStatus, selectedPriority, selectedCategory])

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTitle.trim() || isQuickAdding) return

    setIsQuickAdding(true)
    const formData = new FormData()
    formData.append("title", quickTitle)

    await quickCreateTask(formData)
    setQuickTitle("")
    setIsQuickAdding(false)
    router.refresh()
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedStatus("all")
    setSelectedPriority("all")
    setSelectedCategory("all")
  }

  const hasActiveFilters =
    searchQuery !== "" || selectedStatus !== "all" || selectedPriority !== "all" || selectedCategory !== "all"

  return (
    <div className="space-y-6">
      {/* Quick Add Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 p-2 backdrop-blur-md focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all"
      >
        <div className="flex items-center gap-2 pl-2 text-cyan-400">
          <Plus className="size-4" />
        </div>
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Fast capture: Type a task title & hit Enter..."
          className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!quickTitle.trim() || isQuickAdding}
          className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 cursor-pointer"
        >
          {isQuickAdding ? "Adding..." : "Quick Add"}
        </Button>
      </form>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, categories, or tags..."
            className="w-full rounded-xl border border-border/50 bg-card/60 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:border-cyan-500/40 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* View switcher & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-border/50 bg-card/60 px-2.5 py-1.5 text-xs text-foreground backdrop-blur-sm focus:outline-none focus:border-cyan-500/40 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Flight</option>
            <option value="completed">Resolved</option>
            <option value="ai_suggested">AI Drafts</option>
          </select>

          {/* Priority select (hidden in Kanban view since columns are by priority) */}
          {viewMode !== "kanban" && (
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-lg border border-border/50 bg-card/60 px-2.5 py-1.5 text-xs text-foreground backdrop-blur-sm focus:outline-none focus:border-cyan-500/40 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          )}

          {/* Category select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-border/50 bg-card/60 px-2.5 py-1.5 text-xs text-foreground backdrop-blur-sm focus:outline-none focus:border-cyan-500/40 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="AI Agent">AI Agent</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Strategy">Strategy</option>
            <option value="Research">Research</option>
            <option value="Personal">Personal</option>
          </select>

          {/* View toggle (Kanban, Grid, List) */}
          <div className="flex items-center rounded-lg border border-border/50 bg-card/60 p-0.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-accent text-cyan-400 font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Kanban Board View (Priority Drag & Drop)"
            >
              <Columns3 className="size-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-accent text-cyan-400" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid Matrix View"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-accent text-cyan-400" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Compact List View"
            >
              <List className="size-3.5" />
            </button>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="xs"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
            >
              <X className="size-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Counter row */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
        <span>
          Showing {viewMode === "kanban" ? initialTasks.length : filteredTasks.length} of {initialTasks.length} workflows
        </span>
        {viewMode === "kanban" && (
          <span className="text-cyan-400 font-medium">Kanban Priority Matrix Active</span>
        )}
      </div>

      {/* View Mode Switching: Kanban vs Grid vs List */}
      {viewMode === "kanban" ? (
        <TaskKanbanBoard
          initialTasks={initialTasks}
          searchFilter={searchQuery}
          statusFilter={selectedStatus}
          categoryFilter={selectedCategory}
        />
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center backdrop-blur-md">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4 border border-cyan-500/20">
            <Sparkles className="size-6" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground">No tasks match your query</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Clear your active filters or create a new task into the matrix.
          </p>
          <div className="mt-5 flex gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="cursor-pointer">
                Clear Filters
              </Button>
            )}
            <Button
              render={<Link href="/tasks/new" />}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
            >
              Architect Task
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} compact={viewMode === "list"} />
          ))}
        </div>
      )}
    </div>
  )
}
