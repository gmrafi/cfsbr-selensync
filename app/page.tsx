import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  Sun,
  Globe,
  Radio,
  Zap,
  Mountain,
  Users,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
  Calendar,
  Layers,
  FileText,
  Compass,
  Download,
  Clock,
  Terminal,
  Cpu,
  Database,
  ExternalLink,
  ChevronRight,
  Scale,
  AlertTriangle,
  Satellite,
  Shield,
  BarChart3,
  Sliders,
  Code,
  GraduationCap,
  Building2,
  Check,
  Flame,
  Award
} from "lucide-react"
import Link from "next/link"
import UniversalHeader from "@/components/universal-header"
import Image from "next/image"
import { LUNAR_SOUTH_POLE_CANDIDATES } from "@/lib/gis/lunar-sites"
import HomeSiteComparison from "@/components/lunar/home-site-comparison"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-[#4e6aff]/20 transition-colors">
      <UniversalHeader variant="light" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Subtle Depth, Tactile Borders, Live Telemetry Cockpit)   */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-14 sm:pt-14 sm:pb-18 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100/80 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-300 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_0.75px,transparent_0.75px)] dark:bg-[radial-gradient(#334155_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#4e6aff]"></span>
              <span className="font-semibold text-slate-900 dark:text-white">NASA International Space Apps Challenge 2026</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-slate-600 dark:text-slate-300">CLPS Lunar Mission Browser</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-[#4e6aff] font-medium">Developed by 2025 Global Nominees</span>
            </div>

            {/* Main Title (H1) - Punchy, Balanced & High-Impact */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white font-sans leading-[1.12]">
              Navigate Lunar South Pole Payloads <br className="hidden sm:inline" />
              with <span className="text-[#4e6aff]">Real-Time Solar &amp; Comms Precision</span>
            </h1>

            {/* Sub-Title Description - Concise & Focused */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Simulate Sun illumination cycles, crater rim topographic shadow masking, and Direct-to-Earth (DTE) communication windows for NASA Artemis and CLPS commercial landers.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
                <span>☀️</span>
                <span>Sun Illumination Modeling</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
                <span>⛰️</span>
                <span>Topographic Shadow Masking</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs">
                <span>📡</span>
                <span>Direct-to-Earth (DTE) Comms</span>
              </div>
            </div>

            {/* Call-to-Actions (CTAs) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-medium px-7 py-5 text-sm rounded-lg shadow-sm transition-colors"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Lunar Browser
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#landing-sites" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium px-7 py-5 text-sm rounded-lg shadow-xs transition-colors"
                >
                  <Compass className="w-4 h-4 mr-2 text-slate-500" />
                  Explore Landing Sites
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Live Telemetry Cockpit Preview (Visual Centerpiece with Crisp Borders) */}
          <div className="mt-8 max-w-4xl mx-auto rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
            {/* Cockpit Header Bar */}
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                </div>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 ml-1.5">
                  MISSION COCKPIT &bull; MALAPERT MASSIF (-85.99°S, 2.93°E)
                </span>
              </div>
              <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 inline-block"></span>
                ACTIVE TELEMETRY
              </Badge>
            </div>

            {/* Cockpit Telemetry Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-slate-50/70 dark:bg-slate-950/70">
              {/* Telemetry Block 1 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans">
                    <Sun className="w-4 h-4 text-amber-500" /> Sun Elevation (θ)
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">Unobstructed</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  +2.84° <span className="text-xs text-slate-500 font-normal">Az: 142.6°</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[78%]"></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Horizon Margin: +2.04°</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">614 W Solar Output</span>
                </div>
              </div>

              {/* Telemetry Block 2 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans">
                    <Radio className="w-4 h-4 text-[#4e6aff]" /> DSN 34m X-Band
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">Link Closed</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  +4.8 dB <span className="text-xs text-slate-500 font-normal">Margin</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4e6aff] h-full w-[88%]"></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span>FSPL: 216.5 dB</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">Goldstone Locked</span>
                </div>
              </div>

              {/* Telemetry Block 3 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-sans">
                    <Mountain className="w-4 h-4 text-slate-600 dark:text-slate-400" /> Horizon Obstacle
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">5000m Elev</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  0.80° <span className="text-xs text-slate-500 font-normal">Max Relief</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 dark:bg-slate-600 h-full w-[35%]"></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Crater Mask: Clear</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">Artemis Baseline</span>
                </div>
              </div>
            </div>

            {/* Cockpit Footer Action */}
            <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#4e6aff]" />
                <span>Ephemeris pipeline calculated topocentrically with NASA LOLA altimetry.</span>
              </div>
              <Link href="/dashboard">
                <Button size="sm" className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-medium h-7 px-3">
                  Open Interactive Studio
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Partners / Trusted By Bar */}
          <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-800 text-center">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Integrated with NASA &amp; Commercial Lunar Ecosystem Standards
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors">NASA Artemis</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors">CLPS Initiative</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors">NASA LRO Mission</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors">Intuitive Machines</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors">Astrobotic</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors">ESA Lunar Exploration</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CORE SOLUTIONS (6 CARDS WITH CRISP BORDERS)                            */}
      {/* ========================================================================= */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-slate-900/60 border-b border-slate-300 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium shadow-xs">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
              Comprehensive Lunar Mission Solutions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              End-to-end telemetry modeling engineered specifically for the extreme conditions of the Lunar South Pole.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 text-slate-700 dark:text-slate-300">
                  <Mountain className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white font-sans font-bold">
                  3D Lunar South Pole Topography
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  High-resolution interactive 3D surface viewer powered by NASA LOLA DEM data. Explore candidate landing zones, crater rims, and surface slope gradients in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex justify-between">
                  <span>Elevation Grid:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">5m–30m DEM Resolution</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center mb-3 text-[#4e6aff]">
                  <Radio className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white font-sans font-bold">
                  Direct-to-Earth (DTE) Comms Windows
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Instant line-of-sight (LOS) calculation between lunar south pole sites and Earth ground stations, accounting for lunar libration and RF link budgets.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex justify-between">
                  <span>RF Frequency:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">8.45 GHz X-Band / DSN</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center mb-3 text-amber-600">
                  <Zap className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white font-sans font-bold">
                  Solar Power Potential Simulator
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Calculate solar incidence angles, solar flux (1,361 W/m²), and battery recharge wattage across 14-day lunar daylight cycles to guarantee lander survival.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex justify-between">
                  <span>Photovoltaic Solar Flux:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">1,361 W/m² (AM0)</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm rounded-xl flex flex-col justify-between transition-all" id="horizon-profiler">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 text-slate-700 dark:text-slate-300">
                  <Compass className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white font-sans font-bold">
                  Topographic Horizon Polar Plot
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  360° fish-eye horizon masking that models local mountain and crater rim obstructions to predict exact shadow entry and exit times down to the minute.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex justify-between">
                  <span>Azimuth Sampling:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">360° Continuous Masking</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 5 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm rounded-xl flex flex-col justify-between transition-all" id="site-comparison">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 text-slate-700 dark:text-slate-300">
                  <Scale className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white font-sans font-bold">
                  Multi-Site Comparative Analysis
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Side-by-side feasibility matrix (Site A vs. Site B) evaluating continuous daylight hours, blackout durations, and RF link reliability for informed decision-making.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex justify-between">
                  <span>Decision Engine:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Direct Trade-Off Matrix</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 6 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center mb-3 text-[#4e6aff]">
                  <Rocket className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white font-sans font-bold">
                  CLPS Mission Presets
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Pre-configured operational parameters for NASA&apos;s commercial landing sites, including Malapert Mountain, Shackleton Ridge, de Gerlache, and Haworth.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex justify-between">
                  <span>Pre-Configured Sites:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">4 NASA Artemis Baselines</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ADVANCED CAPABILITIES (6 CARDS WITH CRISP BORDERS)                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-300 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium shadow-xs">
              Architecture &amp; Intelligence
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
              Advanced Mission Capabilities
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Precision tools built for aerospace engineers, scientific principal investigators, and mission leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Adv Card 1 */}
            <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#4e6aff] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Afshara — AI Lunar Mission Strategist
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Context-aware mission assistant providing real-time operational advice, power risk alerts, and landing window recommendations based on active coordinates.
              </p>
            </div>

            {/* Adv Card 2 */}
            <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Dynamic Time Scrubber
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Smooth 24-hour to 14-day timeline slider allowing interactive visual playback of solar elevation curves and Earth visibility vectors.
              </p>
            </div>

            {/* Adv Card 3 */}
            <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Open Ephemeris &amp; DEM API
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                High-performance REST endpoints delivering topocentric lunar coordinates, azimuth/elevation vectors, and terrain elevation profiles for researchers.
              </p>
            </div>

            {/* Adv Card 4 */}
            <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Dual UX Workspace (Lite vs. Pro)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Seamless toggle between an intuitive educational view for students/public and a high-density telemetry interface for mission engineers.
              </p>
            </div>

            {/* Adv Card 5 */}
            <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Blackout &amp; Cold Survival Assessment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Thermal and battery discharge risk modeling for surviving the ultra-cold, 14-day lunar night and permanently shadowed regions (PSRs).
              </p>
            </div>

            {/* Adv Card 6 */}
            <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Mission Plan Export &amp; Briefing Generator
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                One-click export of comprehensive landing site feasibility reports (PDF/JSON) formatted for aerospace mission architecture reviews.
              </p>
            </div>
          </div>

          {/* Deep Space Architecture Technical Specs (shadcn Accordion) */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-[#4e6aff] border-[#4e6aff]/40 bg-blue-50/50 dark:bg-blue-950/30">
                  NASA Engineering Blueprint
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                Deep Space Mathematical &amp; Sensor Modeling Architecture
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Detailed algorithmic breakdown of the Meeus vector ephemeris pipeline, topographic masking matrix, and DSN RF link budget.
              </p>
            </div>

            <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2.5">
              <AccordionItem value="item-1" className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 bg-slate-50/60 dark:bg-slate-950">
                <AccordionTrigger className="text-sm font-bold text-slate-900 dark:text-white hover:no-underline py-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <Compass className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span>1. Precision Topocentric Ephemeris Engine (Meeus Astronomical Vector Algorithm)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-slate-600 dark:text-slate-300 pb-4 leading-relaxed space-y-2">
                  <p>
                    SelenSync utilizes high-precision astronomical vector mathematics adhering to the International Astronomical Union (IAU) lunar pole coordinate frames. Topocentric conversion accounts for the Moon’s mean radius (1,737.4 km), correcting for selenographic latitude and longitude parallax with sub-second temporal resolution.
                  </p>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    Solar Sub-Altitude: sin(θ) = sin(δ) · sin(φ) + cos(δ) · cos(φ) · cos(H) - π_topo
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 bg-slate-50/60 dark:bg-slate-950">
                <AccordionTrigger className="text-sm font-bold text-slate-900 dark:text-white hover:no-underline py-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <Mountain className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>2. Topographic Horizon Profiling (NASA LOLA Altimetry at 30m/pixel Resolution)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-slate-600 dark:text-slate-300 pb-4 leading-relaxed space-y-2">
                  <p>
                    Calculates full 360° azimuthal horizon skyline elevation obstacle angles using Digital Elevation Models (DEM) from the Lunar Orbiter Laser Altimeter (LOLA) on NASA's Lunar Reconnaissance Orbiter (LRO).
                  </p>
                  <p>
                    If celestial body altitude falls below local ridge obstacle mask (θ_body ≤ θ_horizon), geometric line-of-sight occultation triggers, modeling critical power and DTE comms blackouts.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 bg-slate-50/60 dark:bg-slate-950">
                <AccordionTrigger className="text-sm font-bold text-slate-900 dark:text-white hover:no-underline py-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <Radio className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>3. Direct-To-Earth (DTE) RF Link Budget &amp; NASA DSN Ground Station Relays</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-slate-600 dark:text-slate-300 pb-4 leading-relaxed space-y-2">
                  <p>
                    Direct-to-Earth communications are evaluated across standard X-band (8.45 GHz) links connecting with NASA’s Deep Space Network (DSN) complexes: DSS-14 (Goldstone, USA), DSS-43 (Canberra, Australia), and DSS-65 (Madrid, Spain).
                  </p>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    FSPL = 20·log10(d) + 20·log10(f) + 92.45 dB | Mean Free Space Path Loss ≈ 216.5 dB
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 bg-slate-50/60 dark:bg-slate-950">
                <AccordionTrigger className="text-sm font-bold text-slate-900 dark:text-white hover:no-underline py-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>4. Diviner Cryogenic Thermal &amp; Battery Survival Modeling</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-slate-600 dark:text-slate-300 pb-4 leading-relaxed space-y-2">
                  <p>
                    Surface regolith temperatures in permanently shadowed regions (PSRs) plunge to 40 Kelvin (-233°C). The telemetry engine models internal survival heater power consumption (65 W) against usable Li-ion battery capacity, computing state-of-charge decay rates to assess lander survival during shadowed periods.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CANDIDATE LANDING SITES SECTION (CRISP BORDERS & CLEAR STATS)          */}
      {/* ========================================================================= */}
      <section id="landing-sites" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-slate-900/60 border-b border-slate-300 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium mb-2 shadow-xs">
                NASA Candidate Sites
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                Artemis &amp; CLPS Priority Landing Zones
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-2xl">
                High-resolution elevation and illumination datasets derived from Lunar Reconnaissance Orbiter (LRO) altimetry.
              </p>
            </div>
            <Link href="/dashboard">
              <Button className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-medium shadow-sm">
                Compare in Mission Control
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
              <Card
                key={site.id}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm rounded-xl flex flex-col justify-between transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {site.latitude}°S, {site.longitude}°E
                    </span>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-medium">{site.elevationMeters}m</span>
                  </div>
                  <CardTitle className="text-base text-slate-900 dark:text-white font-sans font-bold">{site.name}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2">
                    {site.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">Sun Illumination:</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{site.solarIlluminationPotential}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">Earth Visibility:</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{site.dteDirectToEarthStatus}</div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {site.targetMissions.map((m, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] font-normal bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Candidate Landing Site Comparison Table (shadcn Table) */}
          <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-[#4e6aff]" />
                  Comparative Altimetry &amp; Telemetry Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Topographic elevation, persistent illumination windows, and Direct-to-Earth link status derived from NASA LOLA altimetry.
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-mono bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                LOLA DEM 30m Altimetry
              </Badge>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 dark:bg-slate-950/60 hover:bg-slate-50/70 dark:hover:bg-slate-950/60">
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-xs">Landing Site</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-xs">Coordinates</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-xs">Elevation</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-xs">Solar Illumination</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-xs">DTE Comms Link</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-xs">Target Missions</TableHead>
                  <TableHead className="text-right font-bold text-slate-900 dark:text-slate-200 text-xs">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                  <TableRow key={site.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                    <TableCell className="font-bold text-slate-900 dark:text-white text-xs">
                      <div>{site.name}</div>
                      <div className="text-[10px] font-normal text-slate-500 line-clamp-1">{site.description}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-700 dark:text-slate-300">
                      {site.latitude}°S, {site.longitude}°E
                    </TableCell>
                    <TableCell className="font-mono font-bold text-xs text-[#4e6aff]">
                      +{site.elevationMeters}m
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 text-[10px] font-semibold">
                        {site.solarIlluminationPotential}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800 text-[10px] font-semibold">
                        {site.dteDirectToEarthStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex flex-wrap gap-1">
                        {site.targetMissions.slice(0, 2).map((m, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {m}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href="/dashboard">
                        <Button size="sm" variant="outline" className="h-7 text-xs font-semibold hover:bg-[#4e6aff] hover:text-white transition-all">
                          Inspect Site →
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. 360° TOPOGRAPHIC HORIZON PROFILER (#horizon-profiler)                   */}
      {/* ========================================================================= */}
      <section id="horizon-profiler" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-300 dark:border-slate-800 scroll-mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-semibold shadow-xs">
              LOLA 30m Digital Elevation Altimetry
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
              360° Polar Horizon Profiler &amp; Shadow Masking
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              At the Lunar South Pole, the Sun grazes the horizon at extreme low angles (under 2°). Surrounding crater rims and mountain massifs cast vast geometric shadow masks that dictate power generation viability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-900 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Low-Elevation Polar Insolation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Because the Moon has an axial tilt of only 1.54°, the Sun never climbs high in polar skies. A 1,000m ridge 30km away can block sunlight for weeks.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-900 flex items-center justify-center font-bold">
                <Mountain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">360° Azimuthal Skyline Profiling</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Raymarching digital elevation maps (DEM) sampled every 1° of azimuth calculates the exact obstacle horizon angle θ_horiz(φ) from the lander's coordinates.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Occultation &amp; Battery Survival</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When solar elevation drops below the obstacle skyline, power drops to 0W and cryogenic heaters engage, computing battery state-of-charge decay.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Interactive 360° Radar Simulator</div>
              <div className="text-sm font-semibold text-white">
                Visualize real-time Sun and Earth positions against the crater rim horizon in our Tactical Cockpit.
              </div>
            </div>
            <Link href="/dashboard">
              <Button className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-bold px-4 py-2 shadow-xs shrink-0">
                Launch 360° Horizon Radar
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DIRECT-TO-EARTH (DTE) COMMUNICATIONS (#dte-windows)                    */}
      {/* ========================================================================= */}
      <section id="dte-windows" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-300 dark:border-slate-800 scroll-mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-semibold shadow-xs">
              NASA Deep Space Network (DSN)
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
              Direct-To-Earth (DTE) Communication Windows
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Without an active orbital lunar relay satellite, commercial landers rely exclusively on direct RF line-of-sight to NASA’s 34-meter and 70-meter ground stations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#4e6aff] border border-blue-200 dark:border-blue-900 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Lunar Libration Wobble (±6.7°)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Earth does not stay stationary in the lunar sky. The Moon’s orbital eccentricity and tilt cause the Earth to trace an apparent Lissajous loop, dipping below the horizon for days at a time.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 border border-purple-200 dark:border-purple-900 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">DSN 3-Station Global Handover</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                SelenSync models real-time visibility across Goldstone (DSS-14, USA), Canberra (DSS-43, Australia), and Madrid (DSS-65, Spain) as Earth rotates every 24 hours.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Link Budget Margin (+4.8 dB)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Computes carrier-to-noise ratio (C/N0), free-space path loss (FSPL ≈ 216.5 dB), and lander high-gain antenna pointing angles to ensure continuous command & telemetry uplink.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">NASA DSN Real-Time Telemetry</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Inspect live Earth line-of-sight elevation angles and DSN station coverage pass schedules.
              </div>
            </div>
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="text-xs font-bold border-slate-300 dark:border-slate-700 hover:bg-[#4e6aff] hover:text-white transition-colors shrink-0">
                Explore DTE Passes in Cockpit →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. INTERACTIVE CANDIDATE SITE COMPARISON (#site-comparison)               */}
      {/* ========================================================================= */}
      <HomeSiteComparison />

      {/* ========================================================================= */}
      {/* 8. WHO WE SERVE (5 CATEGORIES WITH CRISP BORDERS)                        */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-300 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium shadow-xs">
              Ecosystem Alignment
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
              Who We Serve
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Empowering commercial lunar operators, institutional space agencies, academic researchers, and students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* User Category 1 */}
            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                Commercial Lunar Landers (CLPS Providers)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Optimize landing timelines, battery sizing, and payload power distribution before final lunar descent and trajectory burn.
              </p>
            </div>

            {/* User Category 2 */}
            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                Space Agencies &amp; Mission Planners
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Fast-track site selection for robotic rovers and Artemis human outposts without dealing with complex, slow command-line tools.
              </p>
            </div>

            {/* User Category 3 */}
            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                Scientific Payload Teams
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Schedule high-bandwidth direct-to-Earth scientific data downlinks during verified line-of-sight communication windows.
              </p>
            </div>

            {/* User Category 4 */}
            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                Space Systems Engineers &amp; Students
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Validate RF link margins and solar array geometry against actual lunar terrain elevation masks and real orbital physics.
              </p>
            </div>

            {/* User Category 5 */}
            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                Educators &amp; Public Explorers
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Demystify lunar south pole orbital mechanics, extreme lighting conditions, and the realities of deep-space exploration through interactive 3D visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MISSION OPERATIONAL MODES (NASA OPEN-SCIENCE OPERATIONAL PROFILES)     */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 6. MISSION OPERATIONAL MODES (NASA OPEN-SCIENCE OPERATIONAL PROFILES)     */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-slate-900/60 border-b border-slate-300 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium shadow-xs">
              Operational Architecture
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
              Mission Operational Modes
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Standardized flight dynamics and surface telemetry profiles for CLPS robotic landers and Artemis lunar payloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Mode 1 */}
            <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-5 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs font-medium">
                  Mode 01 // Surface Patrol
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                  Autonomous Reconnaissance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Low-power mobile rover traversal and continuous thermal boundary logging
                </p>
                <ul className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Solar grazing tracking (θ &lt; 1.5°)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Diviner regolith thermal logging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>LOLA obstacle slope containment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Periodic DSN beacon telemetry</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full text-xs font-medium border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200">
                  Inspect Flight Profile
                </Button>
              </Link>
            </div>

            {/* Mode 2 (Highlighted Science Mode) */}
            <div className="p-6 rounded-xl border-2 border-[#4e6aff] bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between space-y-5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#4e6aff] text-white text-[10px] font-semibold px-2.5 py-0.5 shadow-xs">
                  HIGH-PRIORITY SCIENCE
                </Badge>
              </div>
              <div className="space-y-3">
                <Badge className="bg-blue-50 dark:bg-blue-950/60 text-[#4e6aff] border-blue-200 dark:border-blue-900/60 text-xs font-medium">
                  Mode 02 // PSR Volatiles
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                  In-Situ Resource Analysis (ISRU)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cryogenic cold trap sampling and volatile ice prospecting in permanently shadowed craters
                </p>
                <ul className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">PSR drill operations at 40 Kelvin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span>Cryo line heater battery drawdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span>8.45 GHz DSN high-rate downlink</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span>MCDA weighted site suitability</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard">
                <Button className="w-full bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-medium shadow-sm">
                  Launch Mission Control
                </Button>
              </Link>
            </div>

            {/* Mode 3 */}
            <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-5 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs font-medium">
                  Mode 03 // Powered Descent
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                  Critical Descent Logistics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Terminal guidance, hazard avoidance, and continuous carrier tracking to touchdown
                </p>
                <ul className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                    <span>LOLA DEM tip-over slope limit (&lt; 10°)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                    <span>Topographic crater shadow entry alert</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                    <span>Earth libration angle tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                    <span>DSN tri-station handover timing</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full text-xs font-medium border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200">
                  Execute Simulation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BACKED BY REAL NUMBERS (CRISP BORDERS)                                */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-300 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
            <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium shadow-xs">
              Platform Metrics
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
              Backed by Real Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">85°–90°S</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Lunar South Pole Target Focus</div>
            </div>

            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">360°</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Continuous Horizon Masking</div>
            </div>

            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#4e6aff] font-mono">&lt; 50ms</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Real-Time Calculation Latency</div>
            </div>

            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Authoritative NASA Open Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. AUTHORITATIVE PLANETARY DATA SOURCES (CRISP BORDERS)                  */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 8. AUTHORITATIVE PLANETARY DATA SOURCES (CRISP BORDERS)                  */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-slate-900/60 border-b border-slate-300 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-medium shadow-xs">
              Data Integrity &amp; Verification
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
              Authoritative Planetary Data Sources
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              All topography, ephemeris calculations, and telemetry vectors are validated directly against official NASA science archives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Source 1 */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm space-y-2 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Database className="w-4 h-4 text-[#4e6aff]" />
                <span>NASA Planetary Data System (PDS)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Official repository for all lunar mission datasets, surface measurements, and orbital records.
              </p>
            </div>

            {/* Source 2 */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm space-y-2 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Mountain className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>NASA LRO LOLA Science Team</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Lunar Orbiter Laser Altimeter Digital Elevation Models (DEM) for precision south pole topography.
              </p>
            </div>

            {/* Source 3 */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm space-y-2 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Cpu className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>NASA JPL Horizons System</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                High-precision solar system ephemeris for exact Sun and Earth lunar topocentric coordinates.
              </p>
            </div>

            {/* Source 4 */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm space-y-2 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Globe className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>USGS Astrogeology Science Center</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Unified Lunar Control Network and Wide Angle Camera (WAC) global terrain mosaics.
              </p>
            </div>

            {/* Source 5 */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm space-y-2 md:col-span-2 lg:col-span-1 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Rocket className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>NASA CLPS Mission Archives</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Candidate landing site profiles and operational payload engineering specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TEAM & CFSBR SPACEWEB SHOWCASE (CRISP BORDERS)                         */}
      {/* ========================================================================= */}
      <section id="team" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-300 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-xs">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>NASA Space Apps Regional 1st Runner-Up &amp; Global Nominee (2025) &bull; Advancing Lunar Exploration in 2026</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight mt-2">
              Built by CFSBR SpaceWeb
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              A cross-disciplinary team combining space telemetry, spatial computing, and intuitive product strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Member 1: Md Golam Mubasshir Rafi */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium px-2.5 py-0.5">
                    Lead: Product Architecture &amp; Spatial Analytics
                  </Badge>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">CFSBR SpaceWeb</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                    Md Golam Mubasshir Rafi
                  </h3>
                  <p className="text-xs text-[#4e6aff] font-medium mt-0.5">
                    Lead: Product Architecture &amp; Spatial Analytics
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Spearheads spatial intelligence, ephemeris integration, Mapbox 3D rendering pipelines, and orbital data science architectures.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Sylhet, Bangladesh</span>
                <Link href="https://github.com/gmrafi" target="_blank">
                  <Button variant="outline" size="sm" className="text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 h-8 px-3">
                    GitHub Profile <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Member 2: Afshara Tasneem Zoa */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-400 dark:hover:border-slate-700 transition-all">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-medium px-2.5 py-0.5">
                    Co-Lead: Strategy &amp; Research
                  </Badge>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">CFSBR SpaceWeb</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                    Afshara Tasneem Zoa
                  </h3>
                  <p className="text-xs text-[#4e6aff] font-medium mt-0.5">
                    Co-Lead: Strategy &amp; Research
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Leads lunar mission research, CLPS regulatory and payload requirement evaluation, and AI decision assistant prompt engineering.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Sylhet, Bangladesh</span>
                <Link href="https://github.com/gmrafi" target="_blank">
                  <Button variant="outline" size="sm" className="text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 h-8 px-3">
                    Research Dossier <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* About CFSBR SpaceWeb Box */}
          <div className="mt-8 max-w-4xl mx-auto p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
            <span className="font-semibold text-slate-900 dark:text-white">About CFSBR SpaceWeb: </span>
            An initiative under the Centre for Fintech &amp; Strategic Business Research (CFSBR), bridging advanced web architecture, orbital mechanics, and intuitive design to solve complex mission planning bottlenecks for NASA&apos;s Artemis and CLPS eras.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CALL TO ACTION & FOOTER (CRISP BORDERS)                              */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-900/70">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs font-medium shadow-xs">
              NASA Space Apps 2026
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900 dark:text-white tracking-tight">
              Ready to Explore Lunar South Pole Landing Windows?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-lg mx-auto">
              Access the interactive dual-pane mission browser with real-time solar curves, 360° LOLA radar plots, and DSN RF link budget matrices.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-medium px-6 py-5 text-sm rounded-lg shadow-sm">
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Lunar Browser
                </Button>
              </Link>
              <Link href="/dashboard/chat">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-5 text-sm rounded-lg font-medium shadow-xs">
                  <Sparkles className="w-4 h-4 mr-2 text-[#4e6aff]" />
                  Consult AI Strategist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4e6aff] flex items-center justify-center text-white shadow-xs">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white font-sans text-sm">SelenSync</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">The Lunar South Pole Mission &amp; Communication Engine</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-700 dark:text-slate-300">
              <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Mission Control</Link>
              <Link href="/#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link>
              <Link href="/#landing-sites" className="hover:text-slate-900 dark:hover:text-white transition-colors">Landing Sites</Link>
              <Link href="/#horizon-profiler" className="hover:text-slate-900 dark:hover:text-white transition-colors">Horizon Profiler</Link>
              <Link href="/dashboard/chat" className="hover:text-slate-900 dark:hover:text-white transition-colors">AI Strategist</Link>
              <Link href="https://github.com/gmrafi/cfsbr-selensync" target="_blank" className="hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <p className="max-w-xl text-center sm:text-left">
              SelenSync: Empowering sustainable lunar exploration through intuitive solar power and communication window intelligence for the CLPS and Artemis generation.
            </p>
            <div className="text-center sm:text-right space-y-0.5">
              <p>&copy; 2026 SelenSync. Built for NASA Space Apps Challenge 2026. Powered by NASA Open Data.</p>
              <p className="text-slate-600 dark:text-slate-400 font-mono">Designed and Developed by Md Golam Mubasshir Rafi | CFSBR SpaceWeb</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
