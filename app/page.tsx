import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#4e6aff]/10">
      <UniversalHeader variant="light" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-4xl mx-auto space-y-5">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <span className="text-amber-500">🏆</span>
              <span className="font-semibold text-slate-900">NASA Space Apps 2026 Challenge</span>
              <span className="text-slate-300">•</span>
              <span>CLPS Lunar Mission Browser</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#4e6aff] font-medium">Built by Global Nominees</span>
            </div>

            {/* Main Title (H1) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 font-space-grotesk leading-[1.15]">
              Intuitive Lunar South Pole <br className="hidden sm:inline" />
              Trajectory &amp; Communication Engine <br className="hidden sm:inline" />
              <span className="text-[#4e6aff]">for Artemis-Era Payloads</span>
            </h1>

            {/* Sub-Title Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Simulate real-time Sun illumination cycles, crater rim topographic shadows, and Direct-to-Earth (DTE) communication windows for CLPS landers and rovers. Powered by NASA LRO, LOLA DEM, and planetary ephemeris.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                <span>☀️</span>
                <span>Sun Illumination Modeling</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                <span>⛰️</span>
                <span>Topographic Shadow Masking</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                <span>📡</span>
                <span>Direct-to-Earth (DTE) Comms</span>
              </div>
            </div>

            {/* Call-to-Actions (CTAs) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-medium px-7 py-5 text-sm rounded-lg shadow-xs transition-colors"
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
                  className="w-full sm:w-auto border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium px-7 py-5 text-sm rounded-lg transition-colors"
                >
                  <Compass className="w-4 h-4 mr-2 text-slate-500" />
                  Explore Landing Sites
                </Button>
              </Link>
            </div>
          </div>

          {/* Partners / Trusted By Bar */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Integrated with NASA &amp; Commercial Lunar Ecosystem Standards
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-600">
              <span className="hover:text-slate-900 transition-colors">NASA Artemis</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-slate-900 transition-colors">CLPS Initiative</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-slate-900 transition-colors">NASA LRO Mission</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-slate-900 transition-colors">Intuitive Machines</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-slate-900 transition-colors">Astrobotic</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-slate-900 transition-colors">ESA Lunar Exploration</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CORE SOLUTIONS (6 CARDS)                                              */}
      {/* ========================================================================= */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
              Comprehensive Lunar Mission Solutions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              End-to-end telemetry modeling engineered specifically for the extreme conditions of the Lunar South Pole.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Mountain className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  3D Lunar South Pole Topography
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs leading-relaxed">
                  High-resolution interactive 3D surface viewer powered by NASA LOLA DEM data. Explore candidate landing zones, crater rims, and surface slope gradients in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex justify-between">
                  <span>Elevation Grid:</span>
                  <span className="font-semibold text-slate-800">5m–30m DEM Resolution</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Radio className="w-5 h-5 text-[#4e6aff]" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  Direct-to-Earth (DTE) Comms Windows
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs leading-relaxed">
                  Instant line-of-sight (LOS) calculation between lunar south pole sites and Earth ground stations, accounting for lunar libration and RF link budgets.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex justify-between">
                  <span>RF Frequency:</span>
                  <span className="font-semibold text-slate-800">8.45 GHz X-Band / DSN</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  Solar Power Potential Simulator
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs leading-relaxed">
                  Calculate solar incidence angles, solar flux (1,361 W/m²), and battery recharge wattage across 14-day lunar daylight cycles to guarantee lander survival.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex justify-between">
                  <span>Photovoltaic Solar Flux:</span>
                  <span className="font-semibold text-slate-800">1,361 W/m² (AM0)</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between" id="horizon-profiler">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Compass className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  Topographic Horizon Polar Plot
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs leading-relaxed">
                  360° fish-eye horizon masking that models local mountain and crater rim obstructions to predict exact shadow entry and exit times down to the minute.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex justify-between">
                  <span>Azimuth Sampling:</span>
                  <span className="font-semibold text-slate-800">360° Continuous Masking</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 5 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between" id="site-comparison">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Scale className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  Multi-Site Comparative Analysis
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs leading-relaxed">
                  Side-by-side feasibility matrix (Site A vs. Site B) evaluating continuous daylight hours, blackout durations, and RF link reliability for informed decision-making.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex justify-between">
                  <span>Decision Engine:</span>
                  <span className="font-semibold text-slate-800">Direct Trade-Off Matrix</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 6 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Rocket className="w-5 h-5 text-[#4e6aff]" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  CLPS Mission Presets
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs leading-relaxed">
                  Pre-configured operational parameters for NASA&apos;s commercial landing sites, including Malapert Mountain, Shackleton Ridge, de Gerlache, and Haworth.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex justify-between">
                  <span>Pre-Configured Sites:</span>
                  <span className="font-semibold text-slate-800">4 NASA Artemis Baselines</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ADVANCED CAPABILITIES (6 CARDS)                                       */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              Architecture &amp; Intelligence
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
              Advanced Mission Capabilities
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Precision tools built for aerospace engineers, scientific principal investigators, and mission leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Adv Card 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#4e6aff] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">
                Afshara — AI Lunar Mission Strategist
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Context-aware mission assistant providing real-time operational advice, power risk alerts, and landing window recommendations based on active coordinates.
              </p>
            </div>

            {/* Adv Card 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">
                Dynamic Time Scrubber
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smooth 24-hour to 14-day timeline slider allowing interactive visual playback of solar elevation curves and Earth visibility vectors.
              </p>
            </div>

            {/* Adv Card 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">
                Open Ephemeris &amp; DEM API
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-performance REST endpoints delivering topocentric lunar coordinates, azimuth/elevation vectors, and terrain elevation profiles for researchers.
              </p>
            </div>

            {/* Adv Card 4 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">
                Dual UX Workspace (Lite vs. Pro)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamless toggle between an intuitive educational view for students/public and a high-density telemetry interface for mission engineers.
              </p>
            </div>

            {/* Adv Card 5 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">
                Blackout &amp; Cold Survival Assessment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thermal and battery discharge risk modeling for surviving the ultra-cold, 14-day lunar night and permanently shadowed regions (PSRs).
              </p>
            </div>

            {/* Adv Card 6 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">
                Mission Plan Export &amp; Briefing Generator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-click export of comprehensive landing site feasibility reports (PDF/JSON) formatted for aerospace mission architecture reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CANDIDATE LANDING SITES SECTION (NASA LRO CANDIDATES)                  */}
      {/* ========================================================================= */}
      <section id="landing-sites" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium mb-2">
                NASA Candidate Sites
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
                Artemis &amp; CLPS Priority Landing Zones
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                High-resolution elevation and illumination datasets derived from Lunar Reconnaissance Orbiter (LRO) altimetry.
              </p>
            </div>
            <Link href="/dashboard">
              <Button className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-medium">
                Compare in Mission Control
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
              <Card
                key={site.id}
                className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {site.latitude}°S, {site.longitude}°E
                    </span>
                    <span className="text-xs font-mono text-slate-500">{site.elevationMeters}m</span>
                  </div>
                  <CardTitle className="text-base text-slate-900 font-space-grotesk font-bold">{site.name}</CardTitle>
                  <CardDescription className="text-slate-600 text-xs line-clamp-2">
                    {site.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                    <div className="text-slate-500 text-[11px]">Sun Illumination:</div>
                    <div className="font-semibold text-slate-800">{site.solarIlluminationPotential}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                    <div className="text-slate-500 text-[11px]">Earth Visibility:</div>
                    <div className="font-semibold text-slate-800">{site.dteDirectToEarthStatus}</div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {site.targetMissions.map((m, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] font-normal bg-slate-50 text-slate-600 border-slate-200">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHO WE SERVE (5 CATEGORIES)                                           */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              Ecosystem Alignment
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
              Who We Serve
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Empowering commercial lunar operators, institutional space agencies, academic researchers, and students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* User Category 1 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4e6aff]/10 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-space-grotesk">
                Commercial Lunar Landers (CLPS Providers)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimize landing timelines, battery sizing, and payload power distribution before final lunar descent and trajectory burn.
              </p>
            </div>

            {/* User Category 2 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4e6aff]/10 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-space-grotesk">
                Space Agencies &amp; Mission Planners
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fast-track site selection for robotic rovers and Artemis human outposts without dealing with complex, slow command-line tools.
              </p>
            </div>

            {/* User Category 3 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4e6aff]/10 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-space-grotesk">
                Scientific Payload Teams
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule high-bandwidth direct-to-Earth scientific data downlinks during verified line-of-sight communication windows.
              </p>
            </div>

            {/* User Category 4 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4e6aff]/10 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-space-grotesk">
                Space Systems Engineers &amp; Students
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Validate RF link margins and solar array geometry against actual lunar terrain elevation masks and real orbital physics.
              </p>
            </div>

            {/* User Category 5 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4e6aff]/10 text-[#4e6aff] flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-space-grotesk">
                Educators &amp; Public Explorers
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demystify lunar south pole orbital mechanics, extreme lighting conditions, and the realities of deep-space exploration through interactive 3D visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PLATFORM TIERS (CHOOSE YOUR MISSION TIER)                             */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              Mission Access Tiers
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
              Choose Your Mission Tier
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              From open-access academic exploration to high-density commercial payload operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Tier 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <Badge variant="outline" className="text-slate-700 bg-slate-100 border-slate-200 text-xs font-medium">
                  Free / Open Access
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 font-space-grotesk">
                  TIER 1: RESEARCH &amp; ACADEMIC
                </h3>
                <p className="text-xs text-slate-500">
                  Perfect for students, educators, and space enthusiasts
                </p>
                <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Access to official CLPS presets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>3D lunar surface viewer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>7-day time scrubbing simulation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic Sun/Earth elevation graphs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Community support</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full text-xs font-medium border-slate-300 hover:bg-slate-50 text-slate-700">
                  Start Exploring
                </Button>
              </Link>
            </div>

            {/* Tier 2 (Highlighted Pro Tier) */}
            <div className="p-6 rounded-xl border-2 border-[#4e6aff] bg-white shadow-sm flex flex-col justify-between space-y-5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#4e6aff] text-white text-[10px] font-semibold px-2.5 py-0.5">
                  POPULAR FOR MISSION TEAMS
                </Badge>
              </div>
              <div className="space-y-3">
                <Badge className="bg-blue-50 text-[#4e6aff] border-blue-200 text-xs font-medium">
                  Pro Tier
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 font-space-grotesk">
                  TIER 2: MISSION PLANNER
                </h3>
                <p className="text-xs text-slate-500">
                  For aerospace researchers, mission planners, and engineers
                </p>
                <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span className="font-semibold text-slate-800">Custom coordinate inputs (-80° to -90°S)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span>360° DEM horizon profiling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span>Sub-meter slope &amp; shadow analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span>Side-by-side site comparison matrix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span>CSV/JSON telemetry dataset export</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard">
                <Button className="w-full bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-medium shadow-xs">
                  Launch Planner
                </Button>
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <Badge variant="outline" className="text-slate-700 bg-slate-100 border-slate-200 text-xs font-medium">
                  Custom Architecture
                </Badge>
                <h3 className="text-xl font-bold text-slate-900 font-space-grotesk">
                  TIER 3: AGENCY &amp; CLPS ENTERPRISE
                </h3>
                <p className="text-xs text-slate-500">
                  Tailored for institutional missions and commercial operators
                </p>
                <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>Dedicated ephemeris API endpoints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>High-fidelity ray-casting simulations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>Custom payload constraint modeling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>Real-time mission control integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>Priority flight dynamics support</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard/chat">
                <Button variant="outline" className="w-full text-xs font-medium border-slate-300 hover:bg-slate-50 text-slate-700">
                  Contact Architecture Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BACKED BY REAL NUMBERS (4 METRICS)                                    */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              Platform Metrics
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
              Backed by Real Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">85°–90°S</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Lunar South Pole Target Focus</div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">360°</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Continuous Horizon Masking</div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#4e6aff] font-mono">&lt; 50ms</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Real-Time Calculation Latency</div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">100%</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Authoritative NASA Open Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. AUTHORITATIVE PLANETARY DATA SOURCES (5 SOURCES)                      */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              Data Integrity &amp; Verification
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
              Authoritative Planetary Data Sources
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              All topography, ephemeris calculations, and telemetry vectors are validated directly against official NASA science archives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Source 1 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 font-space-grotesk">
                <Database className="w-4 h-4 text-[#4e6aff]" />
                <span>NASA Planetary Data System (PDS)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official repository for all lunar mission datasets, surface measurements, and orbital records.
              </p>
            </div>

            {/* Source 2 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 font-space-grotesk">
                <Mountain className="w-4 h-4 text-slate-700" />
                <span>NASA LRO LOLA Science Team</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lunar Orbiter Laser Altimeter Digital Elevation Models (DEM) for precision south pole topography.
              </p>
            </div>

            {/* Source 3 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 font-space-grotesk">
                <Cpu className="w-4 h-4 text-slate-700" />
                <span>NASA JPL Horizons System</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-precision solar system ephemeris for exact Sun and Earth lunar topocentric coordinates.
              </p>
            </div>

            {/* Source 4 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 font-space-grotesk">
                <Globe className="w-4 h-4 text-slate-700" />
                <span>USGS Astrogeology Science Center</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unified Lunar Control Network and Wide Angle Camera (WAC) global terrain mosaics.
              </p>
            </div>

            {/* Source 5 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 font-space-grotesk">
                <Rocket className="w-4 h-4 text-slate-700" />
                <span>NASA CLPS Mission Archives</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candidate landing site profiles and operational payload engineering specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TEAM & CFSBR SPACEWEB SHOWCASE                                        */}
      {/* ========================================================================= */}
      <section id="team" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>NASA Space Apps Regional 1st Runner-Up &amp; Global Nominee (2025) &bull; Advancing Lunar Exploration in 2026</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight mt-2">
              Built by CFSBR SpaceWeb
            </h2>
            <p className="text-slate-600 text-sm">
              A cross-disciplinary team combining space telemetry, spatial computing, and intuitive product strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Member 1: Md Golam Mubasshir Rafi */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-slate-900 text-white text-[11px] font-medium px-2.5 py-0.5">
                    Lead: Product Architecture &amp; Spatial Analytics
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono">CFSBR SpaceWeb</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-space-grotesk">
                    Md Golam Mubasshir Rafi
                  </h3>
                  <p className="text-xs text-[#4e6aff] font-medium mt-0.5">
                    Lead: Product Architecture &amp; Spatial Analytics
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Spearheads spatial intelligence, ephemeris integration, Mapbox 3D rendering pipelines, and orbital data science architectures.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Sylhet, Bangladesh</span>
                <Link href="https://github.com/gmrafi" target="_blank">
                  <Button variant="outline" size="sm" className="text-xs text-slate-700 hover:bg-slate-50 border-slate-300 h-8 px-3">
                    GitHub Profile <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Member 2: Afshara Tasneem Zoa */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-slate-900 text-white text-[11px] font-medium px-2.5 py-0.5">
                    Co-Lead: Strategy &amp; Research
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono">CFSBR SpaceWeb</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-space-grotesk">
                    Afshara Tasneem Zoa
                  </h3>
                  <p className="text-xs text-[#4e6aff] font-medium mt-0.5">
                    Co-Lead: Strategy &amp; Research
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Leads lunar mission research, CLPS regulatory and payload requirement evaluation, and AI decision assistant prompt engineering.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Sylhet, Bangladesh</span>
                <Link href="https://github.com/gmrafi" target="_blank">
                  <Button variant="outline" size="sm" className="text-xs text-slate-700 hover:bg-slate-50 border-slate-300 h-8 px-3">
                    Research Dossier <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* About CFSBR SpaceWeb Box */}
          <div className="mt-8 max-w-4xl mx-auto p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-900">About CFSBR SpaceWeb: </span>
            An initiative under the Centre for Fintech &amp; Strategic Business Research (CFSBR), bridging advanced web architecture, orbital mechanics, and intuitive design to solve complex mission planning bottlenecks for NASA&apos;s Artemis and CLPS eras.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CALL TO ACTION & FOOTER                                              */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-4 shadow-xs">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              NASA Space Apps 2026
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-space-grotesk text-slate-900 tracking-tight">
              Ready to Explore Lunar South Pole Landing Windows?
            </h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Access the interactive dual-pane mission browser with real-time solar curves, 360° LOLA radar plots, and DSN RF link budget matrices.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-medium px-6 py-5 text-sm rounded-lg shadow-xs">
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Lunar Browser
                </Button>
              </Link>
              <Link href="/dashboard/chat">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 bg-white text-slate-700 hover:bg-slate-50 px-6 py-5 text-sm rounded-lg font-medium">
                  <Sparkles className="w-4 h-4 mr-2 text-[#4e6aff]" />
                  Consult AI Strategist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200 bg-white text-xs text-slate-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4e6aff] flex items-center justify-center text-white">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 font-space-grotesk text-sm">SelenSync</span>
                <p className="text-[11px] text-slate-500">The Lunar South Pole Mission &amp; Communication Engine</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-600">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Mission Control</Link>
              <Link href="/#features" className="hover:text-slate-900 transition-colors">Features</Link>
              <Link href="/#landing-sites" className="hover:text-slate-900 transition-colors">Landing Sites</Link>
              <Link href="/#horizon-profiler" className="hover:text-slate-900 transition-colors">Horizon Profiler</Link>
              <Link href="/dashboard/chat" className="hover:text-slate-900 transition-colors">AI Strategist</Link>
              <Link href="https://github.com/gmrafi/cfsbr-selensync" target="_blank" className="hover:text-slate-900 transition-colors">GitHub</Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p className="max-w-xl text-center sm:text-left">
              SelenSync: Empowering sustainable lunar exploration through intuitive solar power and communication window intelligence for the CLPS and Artemis generation.
            </p>
            <div className="text-center sm:text-right space-y-0.5">
              <p>&copy; 2026 SelenSync. Built for NASA Space Apps Challenge 2026. Powered by NASA Open Data.</p>
              <p className="text-slate-400 font-mono">Designed and Developed by Md Golam Mubasshir Rafi | CFSBR SpaceWeb</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
