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
import HomeSlideController from "@/components/lunar/home-slide-controller"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-[#4e6aff]/20 transition-colors">
      <UniversalHeader variant="light" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Subtle Depth, Tactile Borders, Live Telemetry Cockpit)   */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (FULL SCREEN SLIDE 1: PUNCHY COLORS, HIGH-CONTRAST BORDERS) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/70 via-slate-100 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b-4 border-[#4e6aff]/40">
        <div className="absolute inset-0 bg-[radial-gradient(#4e6aff_0.75px,transparent_0.75px)] opacity-15 pointer-events-none [background-size:24px_24px]" />
        
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col justify-center my-auto space-y-4 sm:space-y-5 lg:space-y-6">
          <div className="text-center max-w-4xl mx-auto space-y-2.5 sm:space-y-3">
            {/* Top Badge */}
            <div className="inline-flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-[#4e6aff]/40 text-slate-900 dark:text-slate-100 text-[11px] sm:text-xs font-bold shadow-sm">
              <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#4e6aff] animate-pulse"></span>
              <span className="font-bold">NASA Space Apps Challenge 2026</span>
              <span className="text-slate-300 dark:text-slate-600 hidden xs:inline">•</span>
              <span className="text-[#4e6aff]">CLPS Lunar Mission Browser</span>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">From the 2025 Global Nominees</span>
            </div>

            {/* Main Title (H1) */}
            <h1 className="text-2xl sm:text-3xl md:text-[32px] md:leading-[1.2] lg:text-5xl lg:leading-tight font-black tracking-tight text-slate-900 dark:text-white font-sans">
              Navigate Lunar South Pole Payloads <br className="hidden sm:inline" />
              with <span className="text-[#4e6aff] underline decoration-[#4e6aff]/40 decoration-4 underline-offset-4">Real-Time Solar &amp; Comms Precision</span>
            </h1>

            {/* Sub-Title */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-2xl mx-auto font-medium px-2 sm:px-0 leading-relaxed">
              Simulate Sun illumination cycles, crater rim topographic shadow masking, and Direct-to-Earth (DTE) communication windows for NASA Artemis &amp; CLPS commercial landers.
            </p>

            {/* Call-to-Actions (CTAs) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1">
              <Link href="/dashboard">
                <Button
                  size="default"
                  className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-bold px-5 sm:px-6 py-2 text-xs rounded-lg shadow-md transition-all hover:scale-105"
                >
                  <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  Launch Mission Cockpit
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/dashboard/map">
                <Button
                  size="default"
                  variant="outline"
                  className="border-2 border-indigo-400/50 bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 font-bold px-5 sm:px-6 py-2 text-xs rounded-lg shadow-sm transition-all"
                >
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-[#4e6aff]" />
                  Open 3D Moon Globe
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Live Telemetry Cockpit Preview */}
          <div className="max-w-4xl mx-auto w-full rounded-2xl border-2 border-indigo-300 dark:border-indigo-900/60 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
            {/* Cockpit Header Bar */}
            <div className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-900 text-white flex items-center justify-between gap-2 text-xs border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <span className="font-mono font-bold text-white ml-1 tracking-wide text-[10px] sm:text-xs truncate">
                  MISSION COCKPIT &bull; MALAPERT MASSIF (-85.99°S, 2.93°E)
                </span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] sm:text-[10px] font-mono shrink-0 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 inline-block animate-ping"></span>
                ACTIVE TELEMETRY
              </Badge>
            </div>

            {/* Cockpit Telemetry Grid */}
            <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4 bg-slate-50 dark:bg-slate-950">
              {/* Telemetry Block 1: Solar */}
              <div className="bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-300/70 dark:border-amber-700/50 rounded-xl p-2.5 sm:p-3 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between gap-1 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">Sun Elevation <span className="hidden xl:inline">(θ)</span></span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-300 text-[9px] sm:text-[10px] bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-300 font-bold shrink-0">
                    <span className="hidden lg:inline">Unobstructed</span>
                    <span className="lg:hidden">Clear</span>
                  </span>
                </div>
                <div className="text-xl sm:text-xl lg:text-2xl xl:text-3xl font-black font-mono text-amber-950 dark:text-amber-100 flex items-baseline justify-between">
                  <span>+2.84°</span>
                  <span className="text-xs text-amber-700 dark:text-amber-300 font-normal">Az: 142.6°</span>
                </div>
                <div className="w-full bg-amber-200 dark:bg-amber-900/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[78%]"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] lg:text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  <span className="truncate">Margin: +2.04°</span>
                  <span className="font-bold shrink-0">614 W Output</span>
                </div>
              </div>

              {/* Telemetry Block 2: DTE */}
              <div className="bg-blue-50/60 dark:bg-blue-950/20 border-2 border-blue-300/70 dark:border-blue-700/50 rounded-xl p-2.5 sm:p-3 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between gap-1 text-xs font-bold text-blue-900 dark:text-blue-200">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <Radio className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span className="truncate">DSN <span className="hidden lg:inline">34m </span>X-Band</span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-300 text-[9px] sm:text-[10px] bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-300 font-bold shrink-0">
                    Link OK
                  </span>
                </div>
                <div className="text-xl sm:text-xl lg:text-2xl xl:text-3xl font-black font-mono text-blue-950 dark:text-blue-100 flex items-baseline justify-between">
                  <span>+23.6 dB</span>
                  <span className="text-xs text-blue-700 dark:text-blue-300 font-normal">Margin</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-900/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4e6aff] h-full w-[88%]"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] lg:text-[11px] text-blue-800 dark:text-blue-300 font-medium">
                  <span className="truncate">FSPL: 222.7 dB</span>
                  <span className="font-bold shrink-0">DSS-24 Locked</span>
                </div>
              </div>

              {/* Telemetry Block 3: Topography */}
              <div className="bg-indigo-50/60 dark:bg-indigo-950/20 border-2 border-indigo-300/70 dark:border-indigo-700/50 rounded-xl p-2.5 sm:p-3 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between gap-1 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <Mountain className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">Horizon Relief</span>
                  </span>
                  <span className="text-indigo-700 dark:text-indigo-300 text-[9px] sm:text-[10px] bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded border border-indigo-300 font-bold shrink-0">
                    5000m Elev
                  </span>
                </div>
                <div className="text-xl sm:text-xl lg:text-2xl xl:text-3xl font-black font-mono text-indigo-950 dark:text-indigo-100 flex items-baseline justify-between">
                  <span>0.80°</span>
                  <span className="text-xs text-indigo-700 dark:text-indigo-300 font-normal">Max Obstacle</span>
                </div>
                <div className="w-full bg-indigo-200 dark:bg-indigo-900/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[35%]"></div>
                </div>
                <div className="flex justify-between items-center text-[10px] lg:text-[11px] text-indigo-800 dark:text-indigo-300 font-medium">
                  <span className="truncate">Mask: Clear</span>
                  <span className="font-bold shrink-0">Slope &lt; 10° Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TEAM SHOWCASE (SLIDE 2: HORIZONTAL CARDS 3×2, PHOTO-LEFT INFO-RIGHT)   */}
      {/* ========================================================================= */}
      <section id="team" className="min-h-screen flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 via-blue-50/70 to-indigo-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b-4 border-indigo-400/40">
        <div className="container mx-auto max-w-6xl my-auto">
          <div className="text-center max-w-3xl mx-auto mb-5 space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-700 text-xs font-bold text-indigo-900 dark:text-indigo-200 shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>2025 Global Nominees &bull; CFSBR SpaceWeb</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
              Meet Our Team
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto font-medium">
              A multidisciplinary 6-member team blending <span className="font-semibold text-slate-900 dark:text-white">Computer Science &amp; Engineering</span>, <span className="font-semibold text-slate-900 dark:text-white">Electrical &amp; Electronic Engineering</span>, and <span className="font-semibold text-slate-900 dark:text-white">Finance</span>.
            </p>
          </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* Member 1: Md Golam Mubasshir Rafi */}
            <div className="rounded-xl bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 h-64 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden flex flex-row">
              <div className="relative w-44 shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image src="/team/rafi.jpg" alt="Md Golam Mubasshir Rafi" fill className="object-cover object-top" sizes="176px" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0 shadow-xs">Team Lead</Badge>
                    <span className="text-[9px] font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-1.5 py-0.5 rounded">Finance</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans leading-snug">Md Golam Mubasshir Rafi</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-tight">Product Architecture &amp; Mission Strategy</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">CFSBR SpaceWeb</span>
                  <Link href="https://github.com/gmrafi" target="_blank">
                    <Button variant="outline" size="sm" className="text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 h-6 px-2 font-bold">GitHub <ExternalLink className="w-2.5 h-2.5 ml-1" /></Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Member 2: Afshara Tasneem Zoa */}
            <div className="rounded-xl bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 h-64 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden flex flex-row">
              <div className="relative w-44 shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image src="/team/zoa.jpg" alt="Afshara Tasneem Zoa" fill className="object-cover object-top" sizes="176px" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0 shadow-xs">Co-Lead</Badge>
                    <span className="text-[9px] font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-1.5 py-0.5 rounded">CSE</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans leading-snug">Afshara Tasneem Zoa</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-tight">Scientific Research &amp; Systems Strategy</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">CFSBR SpaceWeb</span>
                  <Link href="https://github.com/zoaafshara" target="_blank">
                    <Button variant="outline" size="sm" className="text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 h-6 px-2 font-bold">GitHub <ExternalLink className="w-2.5 h-2.5 ml-1" /></Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Member 3: Kaiba Hasnat */}
            <div className="rounded-xl bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 h-64 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden flex flex-row">
              <div className="relative w-44 shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image src="/team/member3.jpg" alt="Kaiba Hasnat" fill className="object-cover object-top" sizes="176px" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0 shadow-xs">Frontend &amp; UI</Badge>
                    <span className="text-[9px] font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-1.5 py-0.5 rounded">EEE</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans leading-snug">Kaiba Hasnat</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-tight">Avionics Interface &amp; Telemetry UI</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">CFSBR SpaceWeb</span>
                  <Link href="#" target="_blank">
                    <Button variant="outline" size="sm" className="text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 h-6 px-2 font-bold">GitHub <ExternalLink className="w-2.5 h-2.5 ml-1" /></Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Member 4: Labiba Mahzabin */}
            <div className="rounded-xl bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 h-64 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden flex flex-row">
              <div className="relative w-44 shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image src="/team/labiba.jpg" alt="Labiba Mahzabin" fill className="object-cover object-top" sizes="176px" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0 shadow-xs">Data &amp; GIS</Badge>
                    <span className="text-[9px] font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-1.5 py-0.5 rounded">CSE</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans leading-snug">Labiba Mahzabin</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-tight">Planetary GIS &amp; Data Engineering</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">CFSBR SpaceWeb</span>
                  <Link href="#" target="_blank">
                    <Button variant="outline" size="sm" className="text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 h-6 px-2 font-bold">GitHub <ExternalLink className="w-2.5 h-2.5 ml-1" /></Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Member 5: Nafiz Akib Khan */}
            <div className="rounded-xl bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 h-64 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden flex flex-row">
              <div className="relative w-44 shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image src="/team/member5.jpg" alt="Nafiz Akib Khan" fill className="object-cover object-top" sizes="176px" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0 shadow-xs">Analytics</Badge>
                    <span className="text-[9px] font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-1.5 py-0.5 rounded">EEE</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans leading-snug">Nafiz Akib Khan</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-tight">Power Budgeting &amp; Feasibility Modeling</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">CFSBR SpaceWeb</span>
                  <Link href="#" target="_blank">
                    <Button variant="outline" size="sm" className="text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 h-6 px-2 font-bold">GitHub <ExternalLink className="w-2.5 h-2.5 ml-1" /></Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Member 6: Comms & Outreach */}
            <div className="rounded-xl bg-white dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 h-64 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden flex flex-row">
              <div className="relative w-44 shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image src="/team/nowshin.jpg" alt="Nishat Jahan Nowshin" fill className="object-cover object-top" sizes="176px" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0 shadow-xs">Comms</Badge>
                    <span className="text-[9px] font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-1.5 py-0.5 rounded">CSE</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans leading-snug">Nishat Jahan Nowshin</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-tight">Mission Communications &amp; Public Outreach</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">CFSBR SpaceWeb</span>
                  <Link href="#" target="_blank">
                    <Button variant="outline" size="sm" className="text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 h-6 px-2 font-bold">GitHub <ExternalLink className="w-2.5 h-2.5 ml-1" /></Button>
                  </Link>
                </div>
              </div>
            </div>
          </div></div>
      </section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 3. CORE SOLUTIONS (SLIDE 3: 6 CARDS WITH CRISP COLORFUL 2PX BORDERS)      */}
      {/* ========================================================================= */}
      <section id="features" className="min-h-screen flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-blue-50/50 to-indigo-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b-4 border-[#4e6aff]/40">
        <div className="container mx-auto max-w-6xl my-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <Badge variant="outline" className="text-indigo-900 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-300 dark:border-indigo-700 text-xs font-bold shadow-xs">
              Core Capabilities &bull; Flight Telemetry
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
              Comprehensive Lunar Mission Solutions
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium">
              End-to-end telemetry modeling engineered specifically for the extreme conditions of the Lunar South Pole.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <Card className="bg-indigo-50/70 dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-700/70 hover:border-indigo-500 shadow-md rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700 flex items-center justify-center mb-2.5 text-indigo-700 dark:text-indigo-300">
                  <Mountain className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 dark:text-white font-sans font-bold">
                  3D Lunar South Pole Topography
                </CardTitle>
                <CardDescription className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-normal">
                  High-resolution interactive 3D surface viewer powered by NASA LOLA DEM data. Explore candidate landing zones, crater rims, and surface slope gradients in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="p-2 rounded-lg bg-indigo-50/70 dark:bg-slate-950/60 border border-indigo-200 dark:border-indigo-900 text-[11px] text-slate-700 dark:text-slate-300 flex justify-between font-medium">
                  <span>Elevation Grid:</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">5m–30m DEM Resolution</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-blue-50/70 dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-700/70 hover:border-blue-500 shadow-md rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700 flex items-center justify-center mb-2.5 text-[#4e6aff]">
                  <Radio className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 dark:text-white font-sans font-bold">
                  Direct-to-Earth (DTE) Comms Windows
                </CardTitle>
                <CardDescription className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-normal">
                  Instant line-of-sight (LOS) calculation between lunar south pole sites and Earth ground stations, accounting for lunar libration and RF link budgets.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="p-2 rounded-lg bg-blue-50/70 dark:bg-slate-950/60 border border-blue-200 dark:border-blue-900 text-[11px] text-slate-700 dark:text-slate-300 flex justify-between font-medium">
                  <span>RF Frequency:</span>
                  <span className="font-bold text-[#4e6aff]">8.45 GHz X-Band / DSN</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-amber-50/70 dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700/70 hover:border-amber-500 shadow-md rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex items-center justify-center mb-2.5 text-amber-700 dark:text-amber-400">
                  <Zap className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 dark:text-white font-sans font-bold">
                  Solar Power Potential Simulator
                </CardTitle>
                <CardDescription className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-normal">
                  Calculate solar incidence angles, solar flux (1,361 W/m²), and battery recharge wattage across 14-day lunar daylight cycles to guarantee lander survival.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-slate-950/60 border border-amber-200 dark:border-amber-900 text-[11px] text-slate-700 dark:text-slate-300 flex justify-between font-medium">
                  <span>Photovoltaic Solar Flux:</span>
                  <span className="font-bold text-amber-800 dark:text-amber-300">1,361 W/m² (AM0)</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="bg-teal-50/70 dark:bg-slate-900 border-2 border-teal-300 dark:border-teal-700/70 hover:border-teal-500 shadow-md rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 flex items-center justify-center mb-2.5 text-teal-700 dark:text-teal-300">
                  <Compass className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 dark:text-white font-sans font-bold">
                  Topographic Horizon Polar Plot
                </CardTitle>
                <CardDescription className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-normal">
                  360° fish-eye horizon masking that models local mountain and crater rim obstructions to predict exact shadow entry and exit times down to the minute.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="p-2 rounded-lg bg-teal-50/70 dark:bg-slate-950/60 border border-teal-200 dark:border-teal-900 text-[11px] text-slate-700 dark:text-slate-300 flex justify-between font-medium">
                  <span>Azimuth Sampling:</span>
                  <span className="font-bold text-teal-800 dark:text-teal-300">360° Continuous Masking</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 5 */}
            <Card className="bg-purple-50/70 dark:bg-slate-900 border-2 border-purple-300 dark:border-purple-700/70 hover:border-purple-500 shadow-md rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 flex items-center justify-center mb-2.5 text-purple-700 dark:text-purple-300">
                  <Scale className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 dark:text-white font-sans font-bold">
                  Multi-Site Comparative Analysis
                </CardTitle>
                <CardDescription className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-normal">
                  Side-by-side feasibility matrix (Site A vs. Site B) evaluating continuous daylight hours, blackout durations, and RF link reliability for informed decision-making.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="p-2 rounded-lg bg-purple-50/70 dark:bg-slate-950/60 border border-purple-200 dark:border-purple-900 text-[11px] text-slate-700 dark:text-slate-300 flex justify-between font-medium">
                  <span>Decision Engine:</span>
                  <span className="font-bold text-purple-800 dark:text-purple-300">Direct Trade-Off Matrix</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 6 */}
            <Card className="bg-emerald-50/70 dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-700/70 hover:border-emerald-500 shadow-md rounded-xl flex flex-col justify-between transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mb-2.5 text-emerald-700 dark:text-emerald-300">
                  <Rocket className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 dark:text-white font-sans font-bold">
                  CLPS Mission Presets
                </CardTitle>
                <CardDescription className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-normal">
                  Pre-configured operational parameters for NASA&apos;s commercial landing sites, including Malapert Mountain, Shackleton Ridge, de Gerlache, and Haworth.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-slate-950/60 border border-emerald-200 dark:border-emerald-900 text-[11px] text-slate-700 dark:text-slate-300 flex justify-between font-medium">
                  <span>Pre-Configured Sites:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">4 NASA Artemis Baselines</span>
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
                    Selenocentric Elevation: sin(θ_elev) = sin(φ_site) · sin(b_s) + cos(φ_site) · cos(b_s) · cos(l_s - λ_site)
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 bg-slate-50/60 dark:bg-slate-950">
                <AccordionTrigger className="text-sm font-bold text-slate-900 dark:text-white hover:no-underline py-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <Mountain className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>2. Topographic Horizon Profiling (NASA LOLA 128 ppd Altimetry, ~237m/pixel)</span>
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
                    Direct-to-Earth communications are evaluated across standard space research X-band (8.45 GHz downlink / 7.18 GHz uplink) connecting with NASA’s Deep Space Network (DSN) complexes: 34m Beam Waveguide/HEF antennas (DSS-24 Goldstone, DSS-34 Canberra, DSS-65 Madrid) and 70m high-gain apertures (DSS-14, DSS-43, DSS-63).
                  </p>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    FSPL = 20·log10(d_km) + 20·log10(f_GHz) + 92.45 dB | Mean Free Space Path Loss ≈ 222.7 dB (8.45 GHz Downlink)
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
      {/* 4. CANDIDATE LANDING SITES SECTION (SLIDE 4: CRISP 2PX BORDERS & CLEAR STATS) */}
      {/* ========================================================================= */}
      <section id="landing-sites" className="min-h-screen flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 via-indigo-50/50 to-blue-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b-4 border-indigo-400/40">
        <div className="container mx-auto max-w-6xl my-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <Badge variant="outline" className="text-indigo-900 dark:text-indigo-200 bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-700 text-xs font-bold mb-1.5 shadow-xs">
                NASA Artemis Candidate Landing Zones
              </Badge>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
                Artemis &amp; CLPS Priority Landing Zones
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm mt-0.5 max-w-2xl font-medium">
                High-resolution elevation and illumination datasets derived from Lunar Reconnaissance Orbiter (LRO) altimetry.
              </p>
            </div>
            <Link href="/dashboard">
              <Button className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-bold shadow-md h-8 px-3">
                Compare in Mission Control
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
              <Card
                key={site.id}
                className="bg-indigo-50/60 dark:bg-slate-900 border-2 border-indigo-300/80 dark:border-indigo-700/70 hover:border-[#4e6aff] shadow-md rounded-xl flex flex-col justify-between transition-all"
              >
                <CardHeader className="p-3.5 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-900 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                      {site.latitude}°S, {site.longitude}°E
                    </span>
                    <span className="text-[11px] font-mono text-[#4e6aff] font-bold">+{site.elevationMeters}m</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white font-sans">{site.name}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2 mt-0.5">
                    {site.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3.5 pt-0 space-y-1.5 text-xs">
                  <div className="p-1.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
                    <span className="text-amber-800 dark:text-amber-300 text-[10px] font-bold">Sun Illumination:</span>
                    <span className="font-bold text-amber-950 dark:text-amber-200 text-[11px]">{site.solarIlluminationPotential}</span>
                  </div>

                  <div className="p-1.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                    <span className="text-blue-800 dark:text-blue-300 text-[10px] font-bold">Earth Visibility:</span>
                    <span className="font-bold text-blue-950 dark:text-blue-200 text-[11px]">{site.dteDirectToEarthStatus}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {site.targetMissions.map((m, idx) => (
                      <Badge key={idx} variant="outline" className="text-[9px] font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 px-1.5 py-0">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Candidate Landing Site Comparison Table (shadcn Table) */}
          <div className="mt-4 bg-indigo-50/40 dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800/80 rounded-xl overflow-hidden shadow-md">
            <div className="p-3 border-b border-indigo-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 bg-indigo-50/30 dark:bg-slate-950/40">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-[#4e6aff]" />
                Comparative Altimetry &amp; Telemetry Matrix (LOLA DEM 30m Altimetry)
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono bg-white dark:bg-slate-800 border-indigo-200 dark:border-slate-700 text-[#4e6aff] font-bold">
                NASA LRO Altimetry
              </Badge>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-950/60 hover:bg-slate-50/80 border-b border-slate-200 dark:border-slate-800">
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-[11px] py-1.5">Landing Site</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-[11px] py-1.5">Coordinates</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-[11px] py-1.5">Elevation</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-[11px] py-1.5">Solar Illumination</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-[11px] py-1.5">DTE Comms Link</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-[11px] py-1.5">Target Missions</TableHead>
                  <TableHead className="text-right font-bold text-slate-900 dark:text-slate-200 text-[11px] py-1.5">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                  <TableRow key={site.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <TableCell className="font-bold text-slate-900 dark:text-white text-xs py-1.5">
                      <div>{site.name}</div>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-slate-700 dark:text-slate-300 py-1.5">
                      {site.latitude}°S, {site.longitude}°E
                    </TableCell>
                    <TableCell className="font-mono font-bold text-xs text-[#4e6aff] py-1.5">
                      +{site.elevationMeters}m
                    </TableCell>
                    <TableCell className="text-xs py-1.5">
                      <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 text-[10px] font-bold">
                        {site.solarIlluminationPotential}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs py-1.5">
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700 text-[10px] font-bold">
                        {site.dteDirectToEarthStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs py-1.5">
                      <div className="flex flex-wrap gap-1">
                        {site.targetMissions.slice(0, 2).map((m, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1 py-0 rounded border border-slate-200 dark:border-slate-700">
                            {m}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-1.5">
                      <Link href="/dashboard">
                        <Button size="sm" variant="outline" className="h-6 text-[10px] font-bold border-indigo-200 dark:border-slate-700 hover:bg-[#4e6aff] hover:text-white transition-all px-2">
                          Inspect →
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
      {/* 5. 360° TOPOGRAPHIC HORIZON PROFILER (SLIDE 5: CRISP 2PX BORDERS & VIBRANT CARDS) */}
      {/* ========================================================================= */}
      <section id="horizon-profiler" className="min-h-screen flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50 via-cyan-50/60 to-teal-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b-4 border-teal-500/40 scroll-mt-16">
        <div className="container mx-auto max-w-6xl my-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <Badge variant="outline" className="text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border-2 border-teal-400 dark:border-teal-700 text-xs font-bold shadow-xs">
              LOLA 30m Digital Elevation Altimetry &bull; Raymarching
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
              360° Polar Horizon Profiler &amp; Shadow Masking
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto font-medium">
              At the Lunar South Pole, the Sun grazes the horizon at extreme low angles (&lt; 2°). Surrounding crater rims and mountain massifs cast vast geometric shadow masks that dictate power generation viability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl border-2 border-amber-400 dark:border-amber-600 bg-amber-50/40 dark:bg-slate-900/90 shadow-md space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Low-Elevation Polar Insolation</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Because the Moon has an axial tilt of only 1.54°, the Sun never climbs high in polar skies. A 1,000m ridge 30km away can block sunlight for weeks.
              </p>
            </div>

            <div className="p-4 rounded-xl border-2 border-blue-400 dark:border-blue-600 bg-blue-50/40 dark:bg-slate-900/90 shadow-md space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#4e6aff] border border-blue-300 dark:border-blue-700 flex items-center justify-center font-bold">
                <Mountain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">360° Azimuthal Skyline Profiling</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Raymarching digital elevation maps (DEM) sampled every 1° of azimuth calculates the exact obstacle horizon angle θ_horiz(φ) from the lander&apos;s coordinates.
              </p>
            </div>

            <div className="p-4 rounded-xl border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50/40 dark:bg-slate-900/90 shadow-md space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Occultation &amp; Battery Survival</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                When solar elevation drops below the obstacle skyline, power drops to 0W and cryogenic heaters engage, computing battery state-of-charge decay.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-[#4e6aff] shadow-lg">
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Interactive 360° Radar Simulator</div>
              <div className="text-sm font-semibold text-white">
                Visualize real-time Sun and Earth positions against the crater rim horizon in our Tactical Cockpit.
              </div>
            </div>
            <Link href="/dashboard">
              <Button className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-bold px-4 py-2 shadow-md shrink-0">
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Lunar Libration (±6.7° Lat / ±8.0° Lon)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Earth does not stay stationary in the lunar sky. The Moon’s orbital eccentricity and obliquity cause Earth to trace an apparent Lissajous loop, dipping below the horizon for days at a time.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 border border-purple-200 dark:border-purple-900 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">DSN 3-Station Global Handover</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                SelenSync models real-time visibility across NASA DSN 34m Beam Waveguide/HEF stations: Goldstone (DSS-24, USA), Canberra (DSS-34, Australia), and Madrid (DSS-65, Spain) as Earth rotates.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Link Budget Margin (&gt; +3.0 dB)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Computes carrier-to-noise ratio (C/N0), free-space path loss (FSPL ≈ 222.7 dB @ 8.45 GHz downlink), and lander antenna pointing angles ensuring +3.0 dB to +23.6 dB margin.
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
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">PDS</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">NASA Planetary Data System Pipeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. AUTHORITATIVE PLANETARY DATA SOURCES (SLIDE 6: CRISP 2PX BORDERS)      */}
      {/* ========================================================================= */}
      <section id="data-sources" className="min-h-screen flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50 via-blue-50/60 to-sky-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b-4 border-[#4e6aff]/40">
        <div className="container mx-auto max-w-6xl my-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <Badge variant="outline" className="text-blue-900 dark:text-blue-200 bg-blue-50 dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-700 text-xs font-bold shadow-xs">
              NASA Science Mission Directorate &bull; Open Planetary Data
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
              Authoritative Planetary Data Sources
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium">
              All topography, ephemeris calculations, and telemetry vectors are validated directly against official NASA science archives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Source 1 */}
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-slate-900/90 border-2 border-blue-400 dark:border-blue-600 shadow-md space-y-2 hover:border-blue-500 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Database className="w-4 h-4 text-[#4e6aff] shrink-0" />
                <span>NASA Planetary Data System (PDS)</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Official repository for all lunar mission datasets, surface measurements, and orbital records.
              </p>
            </div>

            {/* Source 2 */}
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-slate-900/90 border-2 border-indigo-400 dark:border-indigo-600 shadow-md space-y-2 hover:border-indigo-500 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Mountain className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>NASA LRO LOLA Science Team</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Lunar Orbiter Laser Altimeter Digital Elevation Models (DEM) for precision south pole topography.
              </p>
            </div>

            {/* Source 3 */}
            <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-slate-900/90 border-2 border-purple-400 dark:border-purple-600 shadow-md space-y-2 hover:border-purple-500 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Cpu className="w-4 h-4 text-purple-600 shrink-0" />
                <span>NASA JPL Horizons System</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                High-precision solar system ephemeris for exact Sun and Earth lunar topocentric coordinates.
              </p>
            </div>

            {/* Source 4 */}
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-slate-900/90 border-2 border-emerald-400 dark:border-emerald-600 shadow-md space-y-2 hover:border-emerald-500 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>USGS Astrogeology Science Center</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Unified Lunar Control Network and Wide Angle Camera (WAC) global terrain mosaics.
              </p>
            </div>

            {/* Source 5 */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-900/90 border-2 border-amber-400 dark:border-amber-600 shadow-md space-y-2 md:col-span-2 lg:col-span-1 hover:border-amber-500 transition-all">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white font-sans">
                <Rocket className="w-4 h-4 text-amber-600 shrink-0" />
                <span>NASA CLPS Mission Archives</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Candidate landing site profiles and operational payload engineering specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. UNITED NATIONS SUSTAINABLE DEVELOPMENT GOALS (SLIDE 7: CRISP 2PX BORDERS) */}
      {/* ========================================================================= */}
      <section id="sdgs" className="min-h-screen flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 via-amber-50/70 to-yellow-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b-4 border-amber-500/40">
        <div className="container mx-auto max-w-6xl my-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-700 text-xs font-bold text-slate-900 dark:text-slate-100 shadow-xs">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#4e6aff] animate-pulse"></span>
              <span>United Nations 2030 Agenda for Sustainable Development</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-sans tracking-tight mt-1">
              UN Sustainable Development Goals (SDG) Alignment
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium max-w-2xl mx-auto">
              How SelenSync’s lunar ephemeris intelligence and open aerospace infrastructure directly contribute to global sustainable innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* SDG 9: Industry, Innovation, and Infrastructure */}
            <div className="p-5 rounded-xl bg-orange-50/70 dark:bg-slate-900/90 border-2 border-[#fd6925] shadow-md flex flex-col justify-between space-y-3 hover:shadow-lg transition-all">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#fd6925] hover:bg-[#fd6925] text-white text-[11px] font-bold px-2.5 py-0.5 border-none shadow-xs">
                    SDG 9
                  </Badge>
                  <span className="text-[11px] text-orange-700 dark:text-orange-400 font-mono font-bold">Target 9.5 &bull; 9.b</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                    Industry, Innovation &amp; Infrastructure
                  </h3>
                  <p className="text-xs text-[#fd6925] font-bold mt-0.5">
                    Democratizing Open Space Infrastructure
                  </p>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  Eliminates reliance on proprietary, cost-prohibitive mission planning software. SelenSync provides a browser-native, open-access spatial platform that lowers barriers for emerging space startups, academic institutions, and developing space nations.
                </p>
              </div>
              <div className="pt-2.5 border-t border-orange-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>Space Telemetry Access</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">100% Open Access</span>
              </div>
            </div>

            {/* SDG 7: Affordable and Clean Energy */}
            <div className="p-5 rounded-xl bg-amber-50/70 dark:bg-slate-900/90 border-2 border-[#fcc30b] shadow-md flex flex-col justify-between space-y-3 hover:shadow-lg transition-all">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#fcc30b] hover:bg-[#fcc30b] text-slate-950 text-[11px] font-bold px-2.5 py-0.5 border-none shadow-xs">
                    SDG 7
                  </Badge>
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 font-mono font-bold">Target 7.a &bull; 7.b</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                    Affordable &amp; Clean Energy
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-400 font-bold mt-0.5">
                    Extreme Solar Harvest Optimization
                  </p>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  Calculates solar illumination angles and shadow masks at lunar Peaks of Eternal Light. Our predictive models minimize cryo-battery waste and maximize renewable solar energy collection in the most extreme, unlivable off-world environments.
                </p>
              </div>
              <div className="pt-2.5 border-t border-amber-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>Solar Yield Modeling</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">Zero-Emission Solar</span>
              </div>
            </div>

            {/* SDG 17: Partnerships for the Goals */}
            <div className="p-5 rounded-xl bg-sky-50/70 dark:bg-slate-900/90 border-2 border-[#19486a] dark:border-blue-500 shadow-md flex flex-col justify-between space-y-3 hover:shadow-lg transition-all">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#19486a] dark:bg-blue-600 hover:bg-[#19486a] text-white text-[11px] font-bold px-2.5 py-0.5 border-none shadow-xs">
                    SDG 17
                  </Badge>
                  <span className="text-[11px] text-blue-900 dark:text-blue-300 font-mono font-bold">Target 17.6 &bull; 17.16</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                    Partnerships for the Goals
                  </h3>
                  <p className="text-xs text-[#19486a] dark:text-blue-400 font-bold mt-0.5">
                    Multilateral Space Science Cooperation
                  </p>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  Synthesizes multilateral datasets across NASA PDS, USGS Astrogeology, and JPL Horizons. Supports interoperable standards connecting commercial CLPS landers, international space agencies (ESA, JAXA, ISRO), and academic researchers.
                </p>
              </div>
              <div className="pt-2.5 border-t border-blue-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>Data Interoperability</span>
                <span className="font-bold text-blue-700 dark:text-blue-400">NASA PDS &bull; USGS</span>
              </div>
            </div>
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
              <Link href="/#sdgs" className="hover:text-slate-900 dark:hover:text-white transition-colors">UN SDGs</Link>
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

      {/* Floating Presentation Slide Controller */}
      <HomeSlideController />
    </div>
  )
}




