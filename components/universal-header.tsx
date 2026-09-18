"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Satellite, Menu, X, Rocket, Compass, Radio, Sparkles, Layers, ShieldCheck, ArrowRight, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

interface UniversalHeaderProps {
  variant?: "light" | "dark"
}

export default function UniversalHeader({ variant = "light" }: UniversalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Slogan */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#4e6aff] rounded-xl flex items-center justify-center text-white shadow-xs group-hover:bg-[#3d59ef] transition-colors">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
                  SelenSync
                </span>
                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 font-medium text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700">
                  2026
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
                The Lunar South Pole Mission &amp; Communication Engine
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/#features"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#landing-sites"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              Landing Sites
            </Link>
            <Link
              href="/#horizon-profiler"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              Horizon Profiler
            </Link>
            <Link
              href="/#dte-windows"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              DTE Windows
            </Link>
            <Link
              href="/#site-comparison"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              Site Comparison
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-xs font-semibold text-[#4e6aff] hover:bg-[#4e6aff]/10 rounded-md transition-colors"
            >
              Mission Control
            </Link>
          </nav>

          {/* Action CTAs + Theme Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Theme Toggle Button (Light/Dark) */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-8 px-2.5 text-xs font-semibold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs gap-1.5"
              title={mounted && resolvedTheme === "dark" ? "Switch to High-Contrast Light Mode" : "Switch to Dark Mode"}
            >
              {mounted && resolvedTheme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark</span>
                </>
              )}
            </Button>

            <Link href="/dashboard/chat">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#4e6aff]" />
                AI Strategist
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-medium text-xs px-4 rounded-lg shadow-xs transition-colors"
              >
                <Rocket className="w-3.5 h-3.5 mr-1.5" />
                Launch Cockpit
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-1 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              aria-label="Toggle theme"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </Button>
            <button
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-2">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            >
              Features
            </Link>
            <Link
              href="/#landing-sites"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            >
              Landing Sites
            </Link>
            <Link
              href="/#horizon-profiler"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            >
              Horizon Profiler
            </Link>
            <Link
              href="/#dte-windows"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            >
              DTE Windows
            </Link>
            <Link
              href="/#site-comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            >
              Site Comparison
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-[#4e6aff] hover:bg-[#4e6aff]/10 rounded-md"
            >
              Mission Control (Cockpit)
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="w-full justify-center text-xs font-semibold border-slate-300 dark:border-slate-700"
              >
                {mounted && resolvedTheme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    Switch to Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 mr-1.5 text-slate-700" />
                    Switch to Dark Mode
                  </>
                )}
              </Button>
              <Link href="/dashboard/chat" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-center text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#4e6aff]" />
                  AI Mission Strategist
                </Button>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full justify-center bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-medium">
                  <Rocket className="w-3.5 h-3.5 mr-1.5" />
                  Launch Cockpit
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
