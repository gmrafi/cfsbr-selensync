import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import FloatingAIAssistant from "@/components/floating-ai-assistant"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "SelenSync - CLPS Lunar South Pole Mission & Communication Browser",
  description:
    "Intuitive 3D Lunar South Pole Mission & Communication Window Browser for CLPS Operations. NASA Space Apps Challenge 2026.",
  generator: "SelenSync",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} antialiased`}>
      <body className="font-sans antialiased text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 transition-colors" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider delayDuration={150}>
            {children}
            <FloatingAIAssistant />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
