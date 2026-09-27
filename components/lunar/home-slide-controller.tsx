"use client"

import React, { useState, useEffect } from "react"
import { Play, Pause, ChevronUp, ChevronDown, Maximize2, Presentation, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const SLIDES = [
  { id: "hero", label: "Slide 1: Mission Overview & Cockpit", selector: "header, section:first-of-type" },
  { id: "features", label: "Slide 2: Core Computational Engine", selector: "#features" },
  { id: "landing-sites", label: "Slide 3: Artemis Sites Comparison", selector: "#landing-sites" },
  { id: "horizon-profiler", label: "Slide 4: Topography & Shadow Masking", selector: "#horizon-profiler" },
  { id: "data-sources", label: "Slide 5: NASA Planetary Data Architecture", selector: "#data-sources" },
  { id: "sdgs", label: "Slide 6: UN Sustainable Development Goals", selector: "#sdgs" },
  { id: "team", label: "Slide 7: CFSBR SpaceWeb Team", selector: "#team" }
]

export default function HomeSlideController() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isSlideModeOpen, setIsSlideModeOpen] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  // Scroll to targeted slide
  const scrollToSlide = (index: number) => {
    if (index < 0 || index >= SLIDES.length) return
    setCurrentSlideIndex(index)
    const target = document.querySelector(SLIDES[index].selector) as HTMLElement | null
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Handle Autoplay timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isAutoPlaying && isSlideModeOpen) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => {
          const next = (prev + 1) % SLIDES.length
          const target = document.querySelector(SLIDES[next].selector) as HTMLElement | null
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          return next
        })
      }, 7000) // 7 seconds per slide
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, isSlideModeOpen])

  // Fullscreen toggle helper
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 print:hidden">
      {/* Expanded Slide Mode Controller Panel */}
      {isSlideModeOpen ? (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-slate-700 rounded-2xl p-3.5 shadow-2xl space-y-3 w-72 sm:w-80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4e6aff] animate-pulse"></span>
              <span className="text-xs font-bold font-sans text-slate-900 dark:text-white uppercase tracking-wider">
                Presentation Mode
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullScreen}
                title="Toggle Fullscreen (F11)"
                className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSlideModeOpen(false)
                  setIsAutoPlaying(false)
                }}
                className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Current Slide Display */}
          <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-lg p-2.5 text-center">
            <Badge variant="outline" className="text-[10px] font-mono text-[#4e6aff] border-[#4e6aff]/30 mb-1">
              Slide {currentSlideIndex + 1} of {SLIDES.length}
            </Badge>
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {SLIDES[currentSlideIndex].label}
            </p>
          </div>

          {/* Slide Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentSlideIndex === 0}
              onClick={() => scrollToSlide(currentSlideIndex - 1)}
              className="text-xs border-slate-300 dark:border-slate-700 h-8"
            >
              <ChevronUp className="w-3.5 h-3.5 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentSlideIndex === SLIDES.length - 1}
              onClick={() => scrollToSlide(currentSlideIndex + 1)}
              className="text-xs border-slate-300 dark:border-slate-700 h-8"
            >
              Next <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* Bottom Actions: Auto Play & Reset */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <Button
              size="sm"
              variant={isAutoPlaying ? "default" : "secondary"}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="h-7 text-xs px-3"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3 h-3 mr-1" /> Pause Auto
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" /> Auto Play (7s)
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToSlide(0)}
              className="h-7 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white px-2"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Restart
            </Button>
          </div>
        </div>
      ) : (
        /* Floating Trigger Pill */
        <Button
          onClick={() => {
            setIsSlideModeOpen(true)
            scrollToSlide(0)
          }}
          className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white shadow-xl hover:shadow-2xl rounded-full px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border border-white/20 transition-all hover:scale-105 cursor-pointer"
        >
          <Presentation className="w-4 h-4" />
          <span>Start the Slide</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
        </Button>
      )}
    </div>
  )
}
