"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Satellite, Moon, Menu, X, Rocket, Compass, Radio, Sparkles, Layers, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface UniversalHeaderProps {
  variant?: "light" | "dark"
}

export default function UniversalHeader({ variant = "light" }: UniversalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4e6aff] to-[#6d5bff] rounded-xl flex items-center justify-center shadow-md shadow-[#4e6aff]/20 group-hover:scale-105 transition-transform duration-200">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold font-space-grotesk tracking-tight bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] bg-clip-text text-transparent">
                  SelenSync
                </span>
                <Badge className="bg-blue-50 text-[#4e6aff] border-blue-200 text-[10px] font-mono px-1.5 py-0 font-semibold">
                  2026
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                CLPS Lunar South Pole Mission &amp; Communication Browser
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/#features"
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4e6aff] hover:bg-blue-50/60 rounded-lg transition-colors"
            >
              Mission Modules
            </Link>
            <Link
              href="/#landing-sites"
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4e6aff] hover:bg-blue-50/60 rounded-lg transition-colors"
            >
              Candidate Sites
            </Link>
            <Link
              href="/#scientific-architecture"
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4e6aff] hover:bg-blue-50/60 rounded-lg transition-colors"
            >
              Mathematical Models
            </Link>
            <Link
              href="/#matrix"
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4e6aff] hover:bg-blue-50/60 rounded-lg transition-colors"
            >
              Feasibility Matrix
            </Link>
            <Link
              href="/#team"
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#4e6aff] hover:bg-blue-50/60 rounded-lg transition-colors"
            >
              CFSBR SpaceWeb
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/dashboard/chat">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold text-slate-700 hover:text-[#4e6aff] hover:bg-blue-50/50 border-slate-300"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#4e6aff]" />
                AI Strategist
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] hover:from-[#3d59ef] hover:to-[#5d4bef] text-white font-semibold text-xs px-4 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <Rocket className="w-3.5 h-3.5 mr-1.5" />
                Launch Mission Control
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-2 bg-white rounded-b-2xl shadow-lg animate-in slide-in-from-top-2">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#4e6aff] hover:bg-blue-50 rounded-lg"
            >
              Mission Modules
            </Link>
            <Link
              href="/#landing-sites"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#4e6aff] hover:bg-blue-50 rounded-lg"
            >
              Candidate Sites
            </Link>
            <Link
              href="/#scientific-architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#4e6aff] hover:bg-blue-50 rounded-lg"
            >
              Mathematical Models
            </Link>
            <Link
              href="/#matrix"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#4e6aff] hover:bg-blue-50 rounded-lg"
            >
              Feasibility Matrix
            </Link>
            <Link
              href="/#team"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#4e6aff] hover:bg-blue-50 rounded-lg"
            >
              CFSBR SpaceWeb Team
            </Link>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 px-2">
              <Link href="/dashboard/chat" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full text-xs border-slate-300 text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#4e6aff]" />
                  Ask Afshara AI
                </Button>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full text-xs bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] hover:from-[#3d59ef] hover:to-[#5d4bef] text-white">
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
