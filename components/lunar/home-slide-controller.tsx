"use client"

import React, { useState, useEffect, useCallback } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const SLIDES = [
  { id: "hero", label: "Mission Overview", selector: "section:first-of-type" },
  { id: "team", label: "Engineering Team", selector: "#team" },
  { id: "features", label: "Core Capabilities", selector: "#features" },
  { id: "landing-sites", label: "Artemis Landing Sites", selector: "#landing-sites" },
  { id: "horizon-profiler", label: "360° Horizon Profiler", selector: "#horizon-profiler" },
  { id: "data-sources", label: "NASA Data Sources", selector: "#data-sources" },
  { id: "sdgs", label: "UN Sustainable Goals", selector: "#sdgs" }
]

export default function HomeSlideController() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const scrollToSlide = useCallback((index: number) => {
    if (index < 0 || index >= SLIDES.length) return
    setCurrentSlideIndex(index)
    const target = document.querySelector(SLIDES[index].selector) as HTMLElement | null
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  // Auto-detect current active slide on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SLIDES.findIndex((s) => {
              const el = document.querySelector(s.selector)
              return el === entry.target
            })
            if (index !== -1) {
              setCurrentSlideIndex(index)
            }
          }
        })
      },
      { threshold: 0.35 }
    )

    SLIDES.forEach((s) => {
      const el = document.querySelector(s.selector)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault()
        scrollToSlide(currentSlideIndex + 1)
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault()
        scrollToSlide(currentSlideIndex - 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSlideIndex, scrollToSlide])

  return (
    <aside 
      aria-label="Slide Navigation Controls"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/95 dark:bg-slate-900/95 border-2 border-[#4e6aff] shadow-2xl backdrop-blur-md text-white select-none transition-all hover:scale-105"
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Previous Slide"
        disabled={currentSlideIndex === 0}
        onClick={() => scrollToSlide(currentSlideIndex - 1)}
        className="h-8 w-8 rounded-full text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
        title="Previous Slide (or Up Arrow)"
      >
        <ChevronUp className="w-5 h-5 text-[#4e6aff]" />
      </Button>

      <span 
        className="font-mono text-[11px] font-bold px-1.5 min-w-[38px] text-center text-slate-200"
        title={SLIDES[currentSlideIndex]?.label || "Slide"}
      >
        {currentSlideIndex + 1}/{SLIDES.length}
      </span>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Next Slide"
        disabled={currentSlideIndex === SLIDES.length - 1}
        onClick={() => scrollToSlide(currentSlideIndex + 1)}
        className="h-8 w-8 rounded-full text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
        title="Next Slide (or Down Arrow)"
      >
        <ChevronDown className="w-5 h-5 text-[#4e6aff]" />
      </Button>
    </aside>
  )
}
