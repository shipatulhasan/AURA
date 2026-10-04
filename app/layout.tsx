import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AURA // Autonomous AI Task OS & Synthesis Engine",
  description: "Exclusive next-generation productivity matrix powered by autonomous AI task decomposition, real-time telemetry, and precision glassmorphic UI.",
  keywords: ["AI Task Manager", "Autonomous Agent", "Productivity OS", "Shadcn", "Next.js 16"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-cyan-500/20 selection:text-cyan-300">
        {/* Background Atmospheric Glowing Mesh Orbs */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-[120px] rounded-full" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[500px] bg-gradient-to-b from-purple-500/8 via-indigo-500/4 to-transparent blur-[130px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[400px] bg-gradient-to-tr from-cyan-600/8 to-transparent blur-[110px] rounded-full" />
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] dark:opacity-[0.05]" />
        </div>

        <ThemeProvider>
          <TooltipProvider delay={200}>
            <Navbar />
            <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
              {children}
            </main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
