"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Satellite, Menu, X, Rocket, Compass, Radio, Sparkles, Layers, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface UniversalHeaderProps {
  variant?: "light" | "dark"
}

export default function UniversalHeader({ variant = "light" }: UniversalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#4e6aff] rounded-lg flex items-center justify-center text-white shadow-xs group-hover:bg-[#3d59ef] transition-colors">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold font-space-grotesk tracking-tight text-slate-900">
                  SelenSync
                </span>
                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 font-medium text-slate-600 border-slate-300">
                  2026
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 font-normal hidden sm:block">
                CLPS Lunar South Pole Mission &amp; Communication Browser
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/#features"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Mission Modules
            </Link>
            <Link
              href="/#landing-sites"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Candidate Sites
            </Link>
            <Link
              href="/#scientific-architecture"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Mathematical Models
            </Link>
            <Link
              href="/#team"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              CFSBR SpaceWeb
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link href="/dashboard/chat">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-300"
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
                Mission Control
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 bg-white space-y-2">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Mission Modules
            </Link>
            <Link
              href="/#landing-sites"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Candidate Sites
            </Link>
            <Link
              href="/#scientific-architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              Mathematical Models
            </Link>
            <Link
              href="/#team"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              CFSBR SpaceWeb
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/dashboard/chat" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-center text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#4e6aff]" />
                  AI Mission Strategist
                </Button>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full justify-center bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-medium">
                  <Rocket className="w-3.5 h-3.5 mr-1.5" />
                  Launch Mission Control
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
