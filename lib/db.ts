export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "completed" | "ai_suggested";
export type TaskCategory = "AI Agent" | "Engineering" | "Design" | "Strategy" | "Research" | "Personal";

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  aiInsight?: string;
  tags?: string[];
  subtasks?: Subtask[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export const globalForDb = globalThis as unknown as { tasks: Task[] };

// Seed intelligent initial tasks so the workspace feels vibrant and production-grade immediately
const initialSeedTasks: Task[] = [
  {
    id: "task-seed-1",
    title: "Deploy Autonomous Neural Inference Agent to Edge Nodes",
    description: "Orchestrate lightweight LLM inference on cloudflare edge workers with streaming response buffers and fallback routing.",
    status: "in_progress",
    priority: "urgent",
    category: "AI Agent",
    aiInsight: "Predicted 42% latency reduction with WebAssembly SIMD enabled.",
    tags: ["edge", "wasm", "inference", "realtime"],
    subtasks: [
      { id: "sub-1-1", title: "Benchmark latency across regional datacenters", completed: true },
      { id: "sub-1-2", title: "Configure auto-scaling threshold rules", completed: true },
      { id: "sub-1-3", title: "Run end-to-end stress tests with simulated 50k RPS", completed: false },
    ],
    dueDate: "Today, 18:00",
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: "task-seed-2",
    title: "Synthesize Q4 Architecture Blueprint & Security Boundary",
    description: "Compile multi-tenant cryptographic isolation review, automated key rotation schedule, and SOC2 compliance audit artifacts.",
    status: "todo",
    priority: "high",
    category: "Strategy",
    aiInsight: "AI Copilot drafted 14 compliance controls ready for engineering signoff.",
    tags: ["security", "soc2", "architecture"],
    subtasks: [
      { id: "sub-2-1", title: "Review zero-trust network boundary draft", completed: false },
      { id: "sub-2-2", title: "Schedule threat modeling sprint with core infra team", completed: false },
    ],
    dueDate: "Tomorrow",
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
  },
  {
    id: "task-seed-3",
    title: "Refactor Glassmorphic Design System with Dynamic Luminescence",
    description: "Upgrade tokenized colors, chromatic glow borders, accessible high-contrast dark mode, and micro-interaction spring physics.",
    status: "completed",
    priority: "high",
    category: "Design",
    aiInsight: "Contrast ratio audited at 9.4:1 across all OLED display specs.",
    tags: ["ui-kit", "glassmorphism", "tokens"],
    subtasks: [
      { id: "sub-3-1", title: "Audit WCAG AAA color luminance on dark backgrounds", completed: true },
      { id: "sub-3-2", title: "Implement hardware-accelerated backdrop blur shaders", completed: true },
    ],
    dueDate: "Yesterday",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
  },
  {
    id: "task-seed-4",
    title: "Optimize Vector Embeddings Index with Hierarchical Navigable Small World",
    description: "Tune HNSW graph connectivity parameters (M=32, efSearch=128) to accelerate cosine similarity lookup for real-time document search.",
    status: "in_progress",
    priority: "medium",
    category: "Engineering",
    aiInsight: "Search recall remains above 99.2% with memory footprint reduced by 18%.",
    tags: ["vector-db", "hnsw", "search"],
    subtasks: [
      { id: "sub-4-1", title: "Profile RAM consumption across 10M embeddings", completed: true },
      { id: "sub-4-2", title: "Run quantised FP16 precision benchmarks", completed: false },
    ],
    dueDate: "Oct 8",
    createdAt: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
  },
  {
    id: "task-seed-5",
    title: "Auto-generate Synthetic Evaluation Datasets for Reasoning Models",
    description: "Prompt pipeline generating 5,000 multi-turn domain challenges with automated semantic grading and adversarial counter-examples.",
    status: "ai_suggested",
    priority: "low",
    category: "AI Agent",
    aiInsight: "Auto-suggested by system monitoring: Agent reasoning variance detected in edge cases.",
    tags: ["evaluation", "synthetic-data", "reasoning"],
    subtasks: [
      { id: "sub-5-1", title: "Generate 500 edge cases for mathematical proofs", completed: false },
    ],
    dueDate: "Oct 12",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
];

const tasks = (globalForDb.tasks ??= [...initialSeedTasks]);

// Helper to deduce realistic AI insight
function generateSmartAiInsight(title: string, category: TaskCategory, priority: TaskPriority): string {
  const t = title.toLowerCase();
  if (t.includes("ai") || t.includes("model") || t.includes("neural") || t.includes("agent")) {
    return "⚡ AI Model suggests allocating GPU batch resources and enabling telemetry stream.";
  }
  if (t.includes("security") || t.includes("auth") || t.includes("audit") || priority === "urgent") {
    return "🛡️ High risk vector flagged. Autonomous sanity check recommended prior to merge.";
  }
  if (t.includes("design") || t.includes("ui") || t.includes("css") || category === "Design") {
    return "🎨 Micro-interaction physics and high contrast color verification suggested.";
  }
  if (t.includes("api") || t.includes("database") || t.includes("backend") || category === "Engineering") {
    return "🚀 Estimated latency impact: <12ms with connection pooling enabled.";
  }
  return "✨ AI copilot ready to assist. Break down into atomic subtasks with one click.";
}

// Helper to auto-categorize if not provided
function inferCategory(title: string): TaskCategory {
  const t = title.toLowerCase();
  if (t.includes("ai") || t.includes("agent") || t.includes("neural") || t.includes("llm") || t.includes("gpt")) return "AI Agent";
  if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("style") || t.includes("css")) return "Design";
  if (t.includes("plan") || t.includes("roadmap") || t.includes("strategy") || t.includes("review")) return "Strategy";
  if (t.includes("research") || t.includes("audit") || t.includes("study")) return "Research";
  if (t.includes("personal") || t.includes("read") || t.includes("buy")) return "Personal";
  return "Engineering";
}

export const getTasks = async (): Promise<Task[]> => {
  return [...tasks];
};

export const addTask = async (
  title: string,
  options?: Partial<Omit<Task, "id" | "title" | "createdAt" | "updatedAt">>
): Promise<Task> => {
  const category = options?.category ?? inferCategory(title);
  const priority = options?.priority ?? "medium";
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: title.trim(),
    description: options?.description?.trim() || undefined,
    status: options?.status ?? "todo",
    priority,
    category,
    aiInsight: options?.aiInsight || generateSmartAiInsight(title, category, priority),
    tags: options?.tags || [category.toLowerCase().replace(/\s+/g, "-")],
    subtasks: options?.subtasks || [],
    dueDate: options?.dueDate || "Flexible",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);
  return newTask;
};

export const getTask = async (id: string): Promise<Task | undefined> => {
  return tasks.find((task) => task.id === id);
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    return true;
  }
  return false;
};

export const updateTask = async (
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt">>
): Promise<Task | null> => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;

  Object.assign(task, updates, {
    updatedAt: new Date().toISOString(),
  });
  return task;
};

export const toggleTaskStatus = async (id: string): Promise<Task | null> => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;

  if (task.status === "completed") {
    task.status = "todo";
  } else {
    task.status = "completed";
  }
  task.updatedAt = new Date().toISOString();
  return task;
};

export const getTaskStats = async () => {
  const all = tasks;
  const total = all.length;
  const completed = all.filter((t) => t.status === "completed").length;
  const inProgress = all.filter((t) => t.status === "in_progress").length;
  const todo = all.filter((t) => t.status === "todo").length;
  const urgent = all.filter((t) => t.priority === "urgent" || t.priority === "high").length;
  const aiSuggested = all.filter((t) => t.status === "ai_suggested").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    todo,
    urgent,
    aiSuggested,
    completionRate,
  };
};