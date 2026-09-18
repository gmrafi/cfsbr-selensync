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
  Satellite
} from "lucide-react"
import Link from "next/link"
import UniversalHeader from "@/components/universal-header"
import Image from "next/image"
import { LUNAR_SOUTH_POLE_CANDIDATES } from "@/lib/gis/lunar-sites"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#4e6aff]/20 font-sans">
      <UniversalHeader variant="light" />

      {/* 1. HERO SECTION (Soft Blue & Crisp White Glow Canvas) */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-blue-50/30 border-b border-blue-100/80">
        <div className="absolute inset-0 bg-[radial-gradient(#4e6aff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Challenge & Nominee Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-300 shadow-xs">
              <Badge className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-[11px] font-bold px-2.5 py-0.5">
                NASA SPACE APPS 2026
              </Badge>
              <span className="text-xs font-bold text-[#2a45d0]">
                CLPS Lunar Mission Browser &bull; Developed by NASA Space Apps Global Nominees
              </span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 font-space-grotesk leading-[1.15]">
              Intuitive Lunar South Pole <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#324ece] via-[#4e6aff] to-[#6d5bff]">
                Trajectory &amp; Communication
              </span>{" "}
              Engine
            </h1>

            {/* Hero Subtitle */}
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-3xl mx-auto">
              Simulate real-time Sun illumination cycles, crater rim topographic shadows, and Direct-to-Earth (DTE) communication windows for CLPS commercial landers and Artemis surface missions.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] hover:from-[#3d59ef] hover:to-[#5d4bef] text-white font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Launch Lunar Browser
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#landing-sites" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-blue-200 bg-white text-slate-800 hover:bg-blue-50/60 hover:text-[#324ece] font-bold px-8 py-6 text-base rounded-xl shadow-xs transition-all"
                >
                  <Compass className="w-5 h-5 mr-2 text-[#4e6aff]" />
                  Explore Candidate Sites
                </Button>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-6 max-w-4xl mx-auto text-left">
              <div className="bg-white border-2 border-slate-200/90 hover:border-amber-400 p-4 rounded-xl shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold mb-1">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Solar Flux (AM0)
                </div>
                <div className="text-2xl font-extrabold text-slate-950 font-mono">1,361 W/m²</div>
                <div className="text-xs text-slate-600 font-medium">Photovoltaic Constant</div>
              </div>

              <div className="bg-white border-2 border-slate-200/90 hover:border-indigo-400 p-4 rounded-xl shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold mb-1">
                  <Mountain className="w-4 h-4 text-indigo-500" />
                  NASA LOLA DEM
                </div>
                <div className="text-2xl font-extrabold text-slate-950 font-mono">5m–30m Res</div>
                <div className="text-xs text-slate-600 font-medium">360° Horizon Profiling</div>
              </div>

              <div className="bg-white border-2 border-slate-200/90 hover:border-emerald-400 p-4 rounded-xl shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
                  <Radio className="w-4 h-4 text-emerald-500" />
                  DSN 34m X-Band
                </div>
                <div className="text-2xl font-extrabold text-slate-950 font-mono">8.45 GHz</div>
                <div className="text-xs text-slate-600 font-medium">Direct-to-Earth Link</div>
              </div>

              <div className="bg-white border-2 border-slate-200/90 hover:border-blue-400 p-4 rounded-xl shadow-xs transition-all">
                <div className="flex items-center gap-1.5 text-[#324ece] text-xs font-bold mb-1">
                  <Cpu className="w-4 h-4 text-[#4e6aff]" />
                  Ephemeris Engine
                </div>
                <div className="text-2xl font-extrabold text-slate-950 font-mono">DE440 Topo</div>
                <div className="text-xs text-slate-600 font-medium">High-Precision Solver</div>
              </div>
            </div>
          </div>

          {/* Interactive Live Telemetry HUD Card */}
          <div className="mt-12 max-w-5xl mx-auto rounded-2xl border-2 border-blue-200 bg-white shadow-xl overflow-hidden">
            {/* HUD Top Bar in Signature Blue */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-[#324ece] via-[#4e6aff] to-[#6d5bff] text-white flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-300"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                </div>
                <span className="text-xs font-mono font-bold text-white ml-2 tracking-wide">
                  SELEN-SYNC HUD &bull; MALAPERT MASSIF (-85.99°S, 2.93°E)
                </span>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full mr-1.5 animate-pulse inline-block"></span>
                SIMULATED TELEMETRY ACTIVE
              </Badge>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50/30">
              {/* Telemetry Item 1 */}
              <div className="bg-white border-2 border-slate-200/90 rounded-xl p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <Sun className="w-4 h-4 text-amber-500" /> Solar Elevation (θ_elev)
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-extrabold text-[10px]">Unobstructed</span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-slate-950">
                  +2.84° <span className="text-xs text-slate-600 font-semibold">Az: 142.6°</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full w-[78%]"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-700 font-semibold">
                  <span>Horizon Clearance: +2.04°</span>
                  <span className="text-amber-800 font-bold">614.2 Watts</span>
                </div>
              </div>

              {/* Telemetry Item 2 */}
              <div className="bg-white border-2 border-slate-200/90 rounded-xl p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5 text-[#324ece]">
                    <Radio className="w-4 h-4 text-[#4e6aff]" /> DSN 34m X-Band
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-extrabold text-[10px]">Link Closed</span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-slate-950">
                  +4.8 dB <span className="text-xs text-slate-600 font-semibold">Margin</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] h-full w-[88%]"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-700 font-semibold">
                  <span>FSPL: 216.5 dB</span>
                  <span className="text-[#324ece] font-bold">Goldstone Locked</span>
                </div>
              </div>

              {/* Telemetry Item 3 */}
              <div className="bg-white border-2 border-slate-200/90 rounded-xl p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5 text-indigo-700">
                    <Mountain className="w-4 h-4 text-indigo-500" /> 360° Horizon Mask
                  </span>
                  <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-extrabold text-[10px]">5000m Elev</span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-slate-950">
                  0.80° <span className="text-xs text-slate-600 font-semibold">Max Obstacle</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full w-[35%]"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-700 font-semibold">
                  <span>Massif Advantage: +3.2km</span>
                  <span className="text-emerald-700 font-bold">Artemis Baseline</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-blue-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Sparkles className="w-4 h-4 text-[#4e6aff]" />
                <span>Ephemeris pipeline calculated topocentrically for any selenographic coordinate.</span>
              </div>
              <Link href="/dashboard">
                <Button size="sm" className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs gap-1.5 font-bold shadow-sm">
                  Open Interactive Mission Studio
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHALLENGE ALIGNMENT & ECOSYSTEM BAR (Soft Blue Shading) */}
      <section className="py-7 border-b border-blue-100 bg-blue-50/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold text-center text-slate-600 uppercase tracking-wider mb-3">
            Engineered for Artemis &amp; Commercial Lunar Payload Services (CLPS) Ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-slate-800">
            <span className="hover:text-[#4e6aff] transition-colors">NASA Artemis III</span>
            <span>&bull;</span>
            <span className="hover:text-[#4e6aff] transition-colors">Intuitive Machines Nova-C</span>
            <span>&bull;</span>
            <span className="hover:text-[#4e6aff] transition-colors">Astrobotic Griffin</span>
            <span>&bull;</span>
            <span className="hover:text-[#4e6aff] transition-colors">Firefly Blue Ghost</span>
            <span>&bull;</span>
            <span className="hover:text-[#4e6aff] transition-colors">NASA LRO LOLA Altimetry</span>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES BENTO GRID (Pure White Background) */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge className="bg-blue-100 text-[#2a45d0] border-blue-200 text-xs font-bold px-3 py-1">
              ENGINEERING MODULES
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-space-grotesk tracking-tight">
              High-Precision Lunar Mission Planning Suite
            </h2>
            <p className="text-slate-700 font-medium text-sm sm:text-base">
              Accurate modeling to ensure solar survival, mitigate cryogenic blackout risks, and maintain uninterrupted Direct-to-Earth communication.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {/* Bento Card 1: 360° Polar Radar (Span 2 cols) */}
            <Card className="lg:col-span-2 bg-white border-2 border-slate-200 hover:border-[#4e6aff] hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="w-11 h-11 rounded-xl bg-blue-100/80 border border-blue-200 flex items-center justify-center mb-2 text-[#4e6aff]">
                  <Mountain className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl text-slate-950 font-space-grotesk font-extrabold">
                  360° Topographic Horizon Polar Mask
                </CardTitle>
                <CardDescription className="text-slate-700 font-medium text-xs">
                  Fish-eye skyline radar displaying crater rims and massif relief against celestial Sun &amp; Earth orbital trajectories.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Azimuth Resolution:</span>
                    <span className="font-extrabold text-[#324ece]">5.0° Discrete Slices</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">LOLA Elevation Threshold:</span>
                    <span className="font-extrabold text-emerald-700">Line-of-Sight Clearance Check</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Solar Vector Marker:</span>
                    <span className="font-extrabold text-amber-700">Real-time Topocentric Angle</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 2: GaAs Solar Array Model */}
            <Card className="bg-white border-2 border-slate-200 hover:border-[#4e6aff] hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center mb-2 text-amber-700">
                  <Zap className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg text-slate-950 font-space-grotesk font-extrabold">
                  GaAs Solar Array Model
                </CardTitle>
                <CardDescription className="text-slate-700 font-medium text-xs">
                  Triple-junction photovoltaic generation factoring grazing incidence and dust attenuation.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-slate-800 space-y-1">
                  <p className="font-mono font-extrabold text-amber-800">P = A · η · S₀ · cos(θ)</p>
                  <p className="text-slate-600 font-medium text-[11px]">Dust Degradation: 0.92</p>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 3: DSN RF Link Budget */}
            <Card className="bg-white border-2 border-slate-200 hover:border-[#4e6aff] hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="w-11 h-11 rounded-xl bg-blue-100/80 border border-blue-200 flex items-center justify-center mb-2 text-[#4e6aff]">
                  <Radio className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg text-slate-950 font-space-grotesk font-extrabold">
                  DSN 34m Link Budget
                </CardTitle>
                <CardDescription className="text-slate-700 font-medium text-xs">
                  Free space path loss (~216 dB) and Eb/N0 SNR link margin to NASA ground stations.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-slate-800 space-y-1">
                  <p className="font-mono font-extrabold text-[#324ece]">Freq: 8.45 GHz X-Band</p>
                  <p className="text-slate-600 font-medium text-[11px]">Margin Threshold: &gt; 3.0 dB</p>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 4: 14-Day Timeline Scrubber */}
            <Card className="bg-white border-2 border-slate-200 hover:border-[#4e6aff] hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="w-11 h-11 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center mb-2 text-emerald-700">
                  <Clock className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg text-slate-950 font-space-grotesk font-extrabold">
                  14-Day Timeline Scrubber
                </CardTitle>
                <CardDescription className="text-slate-700 font-medium text-xs">
                  Interactive simulation playback across the entire 336-hour diurnal lunar cycle.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-slate-800 space-y-1">
                  <p className="font-bold text-emerald-800">Modes: 24h &bull; 7d &bull; 14d</p>
                  <p className="text-slate-600 font-medium text-[11px]">Automated Playback Engine</p>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 5: Site Comparison Matrix (Span 2 cols) */}
            <Card className="lg:col-span-2 bg-white border-2 border-slate-200 hover:border-[#4e6aff] hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="w-11 h-11 rounded-xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center mb-2 text-indigo-700">
                  <Scale className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl text-slate-950 font-space-grotesk font-extrabold">
                  Side-by-Side Landing Site Feasibility Matrix
                </CardTitle>
                <CardDescription className="text-slate-700 font-medium text-xs">
                  Compare candidate locations on sunlight duration, cryogenic blackout risk, and DTE visibility.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-indigo-900">Malapert Massif</p>
                    <p className="text-xs text-slate-600 font-medium">90% Sunlight &bull; Continuous DTE</p>
                  </div>
                  <div className="text-indigo-400 font-extrabold text-sm px-3 py-1 bg-white rounded-lg border border-indigo-200">VS</div>
                  <div className="text-right">
                    <p className="font-extrabold text-purple-900">Shackleton Rim</p>
                    <p className="text-xs text-slate-600 font-medium">Volatile Cold Trap &bull; PSR Proximity</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 6: Afshara AI Strategist */}
            <Card className="bg-white border-2 border-slate-200 hover:border-[#4e6aff] hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="w-11 h-11 rounded-xl bg-cyan-100/80 border border-cyan-200 flex items-center justify-center mb-2 text-cyan-700">
                  <Sparkles className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg text-slate-950 font-space-grotesk font-extrabold">
                  Afshara AI Strategist
                </CardTitle>
                <CardDescription className="text-slate-700 font-medium text-xs">
                  AI mission reasoning agent specialized in CLPS payloads and lunar surface thermal management.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Link href="/dashboard/chat">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold border-2 border-blue-200 text-[#324ece] hover:bg-blue-50">
                    Chat with AI Strategist
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. CANDIDATE LANDING SITES SECTION (Alternating Soft Slate-50 Background) */}
      <section id="landing-sites" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-50 border-y border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Badge className="bg-blue-100 text-[#2a45d0] border-blue-200 text-xs font-bold mb-2 px-3 py-1">
                NASA CANDIDATE SITES
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-space-grotesk tracking-tight">
                Artemis &amp; CLPS Priority Landing Zones
              </h2>
              <p className="text-slate-700 font-medium text-sm mt-1 max-w-2xl">
                High-resolution elevation and illumination datasets derived from Lunar Reconnaissance Orbiter (LRO) altimetry.
              </p>
            </div>
            <Link href="/dashboard">
              <Button className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs gap-1.5 self-start md:self-auto font-bold shadow-md">
                Compare in Mission Control
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
              <Card
                key={site.id}
                className="bg-white border-2 border-slate-200 hover:border-[#4e6aff] shadow-sm hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#2945d8] bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
                      {site.latitude}°S, {site.longitude}°E
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">{site.elevationMeters}m</span>
                  </div>
                  <CardTitle className="text-base text-slate-950 font-space-grotesk font-extrabold">{site.name}</CardTitle>
                  <CardDescription className="text-slate-700 font-medium text-xs line-clamp-2">
                    {site.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 space-y-3 text-xs">
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1">
                    <div className="text-slate-600 font-semibold text-[11px]">Sun Illumination:</div>
                    <div className="font-extrabold text-amber-900">{site.solarIlluminationPotential}</div>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                    <div className="text-slate-600 font-semibold text-[11px]">Earth Visibility:</div>
                    <div className="font-extrabold text-emerald-900">{site.dteDirectToEarthStatus}</div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {site.targetMissions.map((m, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] font-semibold bg-slate-100 text-slate-800 border-slate-300">
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

      {/* 5. SCIENTIFIC & MATHEMATICAL ARCHITECTURE (Crisp White Background) */}
      <section id="scientific-architecture" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge className="bg-blue-100 text-[#2a45d0] border-blue-200 text-xs font-bold px-3 py-1">
              MATHEMATICAL RIGOR
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-space-grotesk tracking-tight">
              Peer-Grade Celestial &amp; RF Formulations
            </h2>
            <p className="text-slate-700 font-medium text-sm sm:text-base">
              Physics pipelines validated against NASA DE440 ephemeris and Deep Space Network link budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Formula 1 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#4e6aff] shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center gap-2 text-[#324ece] font-mono text-xs font-bold">
                <Cpu className="w-4 h-4 text-[#4e6aff]" /> 1. TOPOCENTRIC ELEVATION ANGLE
              </div>
              <h3 className="text-lg font-extrabold text-slate-950 font-space-grotesk">Spherical Law of Cosines</h3>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 font-bold overflow-x-auto shadow-inner">
                {"sin(θ_elev) = sin(φ₁)sin(φ₂) + cos(φ₁)cos(φ₂)cos(λ₂ - λ₁)"}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Transforms sub-solar and sub-Earth selenographic coordinates directly into the observer&apos;s local horizon coordinate system.
              </p>
            </div>

            {/* Formula 2 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#4e6aff] shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-mono text-xs font-bold">
                <Mountain className="w-4 h-4 text-amber-500" /> 2. TOPOGRAPHIC RAYCASTING
              </div>
              <h3 className="text-lg font-extrabold text-slate-950 font-space-grotesk">Crater Rim Shadow Condition</h3>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-amber-300 font-bold overflow-x-auto shadow-inner">
                {"Visible ⟺ θ_elev,sun > max(H_topo(α_sun))"}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Validates whether the low-elevation grazing Sun is occluded by distant crater massifs or ridge rims.
              </p>
            </div>

            {/* Formula 3 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#4e6aff] shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-bold">
                <Zap className="w-4 h-4 text-emerald-500" /> 3. PHOTOVOLTAIC ARRAY MODEL
              </div>
              <h3 className="text-lg font-extrabold text-slate-950 font-space-grotesk">GaAs Generation with Dust Attenuation</h3>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 font-bold overflow-x-auto shadow-inner">
                {"P_net = S₀ · A · η · δ_dust · cos(θ_inc) · I_cleared"}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Incorporates AM0 solar flux (1,361 W/m²), triple-junction 30% cell efficiency, and lunar regolith dust loss (δ_dust = 0.92).
              </p>
            </div>

            {/* Formula 4 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#4e6aff] shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-mono text-xs font-bold">
                <Radio className="w-4 h-4 text-indigo-500" /> 4. DSN RF LINK BUDGET
              </div>
              <h3 className="text-lg font-extrabold text-slate-950 font-space-grotesk">Free Space Path Loss &amp; SNR Margin</h3>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300 font-bold overflow-x-auto shadow-inner">
                {"Margin_dB = EIRP - FSPL + (G/T)_ground - k_B - R_data - (Eb/N0)_req"}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Calculates path loss across 384,400 km average distance at 8.45 GHz X-band to ensure closed DSN communication locks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TEAM & CFSBR SPACEWEB SHOWCASE (Soft Indigo & Blue Tinted Canvas) */}
      <section id="team" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/40 via-indigo-50/30 to-blue-50/40 border-t border-blue-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge className="bg-blue-100 text-[#2a45d0] border-blue-200 text-xs font-bold px-3 py-1">
              ORGANIZATION &amp; TEAM ROSTER
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-space-grotesk tracking-tight">
              CFSBR SpaceWeb Leadership
            </h2>
            <p className="text-slate-700 font-medium text-sm sm:text-base">
              Centre for Fintech &amp; Strategic Business Research (CFSBR).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Member 1: Md Golam Mubasshir Rafi */}
            <div className="p-7 rounded-2xl bg-white border-2 border-blue-200/90 shadow-md hover:border-[#4e6aff] transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#4e6aff] text-white text-xs font-bold px-3 py-0.5">
                    LEAD ARCHITECT
                  </Badge>
                  <span className="text-xs text-slate-600 font-bold font-mono">CFSBR SpaceWeb</span>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-950 font-space-grotesk">
                    Md Golam Mubasshir Rafi
                  </h3>
                  <p className="text-xs text-[#2a45d0] font-bold mt-0.5">
                    Lead: Product Architecture &amp; Spatial Analytics
                  </p>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Spearheads spatial intelligence, ephemeris integration, Mapbox 3D rendering pipelines, and orbital data science architectures.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Sylhet, Bangladesh</span>
                <Link href="https://github.com/gmrafi" target="_blank">
                  <Button variant="outline" size="sm" className="text-xs text-[#2a45d0] bg-blue-50 border-blue-200 hover:bg-blue-100 h-8 px-3 font-bold">
                    GitHub Profile <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Member 2: Afshara Tasneem Zoa */}
            <div className="p-7 rounded-2xl bg-white border-2 border-purple-200/90 shadow-md hover:border-purple-500 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-600 text-white text-xs font-bold px-3 py-0.5">
                    CO-LEAD &amp; STRATEGY
                  </Badge>
                  <span className="text-xs text-slate-600 font-bold font-mono">CFSBR SpaceWeb</span>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-950 font-space-grotesk">
                    Afshara Tasneem Zoa
                  </h3>
                  <p className="text-xs text-purple-800 font-bold mt-0.5">
                    Co-Lead: Strategy &amp; Research
                  </p>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Leads lunar mission research, CLPS regulatory and payload requirement evaluation, and AI decision assistant prompt engineering.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Sylhet, Bangladesh</span>
                <Link href="https://github.com/gmrafi" target="_blank">
                  <Button variant="outline" size="sm" className="text-xs text-purple-800 bg-purple-50 border-purple-200 hover:bg-purple-100 h-8 px-3 font-bold">
                    Research Dossier <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA BANNER (Rich Signature Blue Gradient Banner) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-r from-[#324ece] via-[#4e6aff] to-[#6d5bff] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl shadow-blue-500/25">
            <Badge className="bg-white/20 text-white border-white/30 text-xs font-bold px-3 py-1">
              NASA SPACE APPS CHALLENGE 2026
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-space-grotesk tracking-tight max-w-2xl mx-auto">
              Ready to Explore Lunar South Pole Landing Windows?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base font-medium max-w-xl mx-auto">
              Access the full dual-pane mission browser with real-time solar curves, 360° LOLA radar plots, and DSN RF link budget matrices.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-blue-50 text-[#324ece] font-extrabold px-8 py-6 text-base rounded-xl shadow-lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  Launch SelenSync Mission Control
                </Button>
              </Link>
              <Link href="/dashboard/chat">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-base rounded-xl font-bold">
                  <Sparkles className="w-5 h-5 mr-2 text-cyan-300" />
                  Consult AI Mission Strategist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (Deep Charcoal Slate Footer for Solid Grounding) */}
      <footer className="py-12 border-t border-slate-200 bg-slate-950 text-xs text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4e6aff] to-[#6d5bff] flex items-center justify-center text-white shadow-md">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white font-space-grotesk text-sm">SelenSync</span>
                <p className="text-[11px] text-slate-400">CLPS Lunar Mission Browser &bull; NASA Space Apps 2026</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-300">
              <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Mission Control</Link>
              <Link href="/#features" className="hover:text-cyan-400 transition-colors">Modules</Link>
              <Link href="/#landing-sites" className="hover:text-cyan-400 transition-colors">Landing Sites</Link>
              <Link href="/#scientific-architecture" className="hover:text-cyan-400 transition-colors">Formulas</Link>
              <Link href="/dashboard/chat" className="hover:text-cyan-400 transition-colors">AI Strategist</Link>
              <Link href="https://github.com/gmrafi/cfsbr-selensync" target="_blank" className="hover:text-cyan-400 transition-colors">GitHub</Link>
            </div>

            <div className="text-center md:text-right text-[11px] text-slate-400 font-mono">
              &copy; 2026 CFSBR SpaceWeb &bull; All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
