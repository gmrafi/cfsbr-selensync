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
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <UniversalHeader variant="light" />

      {/* 1. HERO SECTION (Clean White, High Legibility, Production-Grade) */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-4xl mx-auto space-y-5">
            {/* Challenge Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#4e6aff]"></span>
              <span>NASA Space Apps Challenge 2026</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">CLPS Lunar Mission Browser</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 font-space-grotesk leading-tight">
              Lunar South Pole Trajectory &amp; Communication Planning
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Simulate solar illumination cycles, topographic crater rim horizon obstruction, and Direct-to-Earth (DTE) communication windows for NASA Artemis and CLPS commercial lander missions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-medium px-6 py-5 text-sm rounded-lg shadow-xs transition-colors"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Mission Control
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#landing-sites" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium px-6 py-5 text-sm rounded-lg transition-colors"
                >
                  <Compass className="w-4 h-4 mr-2 text-slate-500" />
                  Candidate Landing Sites
                </Button>
              </Link>
            </div>

            {/* Key Engineering Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Solar Flux (AM0)
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">1,361 W/m²</div>
                <div className="text-[11px] text-slate-500">Photovoltaic Baseline</div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
                  <Mountain className="w-4 h-4 text-slate-600" />
                  NASA LOLA DEM
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">5m–30m Res</div>
                <div className="text-[11px] text-slate-500">360° Horizon Profiling</div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  DSN 34m X-Band
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">8.45 GHz</div>
                <div className="text-[11px] text-slate-500">Direct-to-Earth Link</div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
                  <Cpu className="w-4 h-4 text-[#4e6aff]" />
                  Ephemeris Model
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">DE440 Topo</div>
                <div className="text-[11px] text-slate-500">Astronomical Ephemeris</div>
              </div>
            </div>
          </div>

          {/* Interactive Live Telemetry HUD Card (Clean Light Styling) */}
          <div className="mt-10 max-w-5xl mx-auto rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Clean Neutral Top Bar */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-700 ml-2">
                  MALAPERT MASSIF (-85.99°S, 2.93°E) &bull; LIVE TELEMETRY SIMULATION
                </span>
              </div>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 inline-block"></span>
                ACTIVE
              </Badge>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/40">
              {/* Telemetry Item 1 */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Sun className="w-4 h-4 text-amber-500" /> Solar Elevation
                  </span>
                  <span className="text-emerald-700 font-semibold text-[11px]">Unobstructed</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  +2.84° <span className="text-xs text-slate-500 font-normal">Az: 142.6°</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[78%]"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Horizon Margin: +2.04°</span>
                  <span className="font-semibold text-slate-900">614 W Output</span>
                </div>
              </div>

              {/* Telemetry Item 2 */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Radio className="w-4 h-4 text-[#4e6aff]" /> DSN 34m X-Band
                  </span>
                  <span className="text-emerald-700 font-semibold text-[11px]">Link Closed</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  +4.8 dB <span className="text-xs text-slate-500 font-normal">Margin</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4e6aff] h-full w-[88%]"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>FSPL: 216.5 dB</span>
                  <span className="font-semibold text-slate-900">Goldstone Lock</span>
                </div>
              </div>

              {/* Telemetry Item 3 */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Mountain className="w-4 h-4 text-slate-600" /> Horizon Profile
                  </span>
                  <span className="text-slate-600 font-semibold text-[11px]">5000m Elev</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  0.80° <span className="text-xs text-slate-500 font-normal">Max Obstacle</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full w-[35%]"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Massif Elevation Advantage</span>
                  <span className="font-semibold text-slate-900">Artemis Site</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Sparkles className="w-4 h-4 text-[#4e6aff]" />
                <span>Ephemeris computed topocentrically for any custom lunar coordinate.</span>
              </div>
              <Link href="/dashboard">
                <Button size="sm" className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-medium">
                  Open Interactive Mission Studio
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHALLENGE ALIGNMENT STRIP (Neutral Subtle Slate) */}
      <section className="py-6 border-b border-slate-200 bg-slate-50/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold text-center text-slate-500 uppercase tracking-wider mb-2.5">
            Engineered for Artemis &amp; Commercial Lunar Payload Services (CLPS) Ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-slate-700">
            <span>NASA Artemis III</span>
            <span className="text-slate-300">&bull;</span>
            <span>Intuitive Machines Nova-C</span>
            <span className="text-slate-300">&bull;</span>
            <span>Astrobotic Griffin</span>
            <span className="text-slate-300">&bull;</span>
            <span>Firefly Blue Ghost</span>
            <span className="text-slate-300">&bull;</span>
            <span>NASA LRO LOLA Altimetry</span>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES GRID (Clean White Cards) */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              Mission Modules
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
              High-Precision Lunar Mission Planning Suite
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Accurate modeling to ensure solar survival, mitigate cryogenic blackout risks, and maintain uninterrupted Direct-to-Earth communication.
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Mountain className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  360° Topographic Horizon Polar Mask
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs">
                  Fish-eye skyline radar displaying crater rims and massif relief against celestial Sun &amp; Earth orbital trajectories.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Azimuth Resolution:</span>
                    <span className="font-semibold text-slate-900">5.0° Slices</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Horizon Profiling:</span>
                    <span className="font-semibold text-emerald-700">Line-of-Sight LOS Check</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Zap className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  Photovoltaic Power Generation
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs">
                  Triple-junction GaAs photovoltaic generation factoring grazing incidence and regolith dust attenuation.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Array Configuration:</span>
                    <span className="font-semibold text-slate-900">Vertical Cylindrical</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dust Degradation:</span>
                    <span className="font-semibold text-slate-900">δ_dust = 0.92</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Radio className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  DSN 34m RF Link Budget
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs">
                  Free space path loss (~216 dB) and Eb/N0 SNR link margin to NASA Deep Space Network ground antennas.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frequency:</span>
                    <span className="font-semibold text-slate-900">8.45 GHz (X-Band)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Link Margin:</span>
                    <span className="font-semibold text-emerald-700">&gt; +3.0 dB Threshold</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Clock className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  14-Day Timeline Simulation
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs">
                  Interactive scrubber allowing continuous timeline simulation across the entire 336-hour lunar diurnal cycle.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timeline Modes:</span>
                    <span className="font-semibold text-slate-900">24h / 7d / 14d Scrubber</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Playback:</span>
                    <span className="font-semibold text-slate-900">1x to 100x Acceleration</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 5 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Scale className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  Site Comparison Matrix
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs">
                  Multi-site feasibility matrix comparing sunlight duration, cryogenic blackout risk, and DTE visibility.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Candidate Sites:</span>
                    <span className="font-semibold text-slate-900">Malapert vs Shackleton</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trade-Off Analysis:</span>
                    <span className="font-semibold text-slate-900">Sunlight vs PSR Proximity</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 6 */}
            <Card className="bg-white border border-slate-200 hover:border-slate-300 shadow-xs rounded-xl flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 text-slate-700">
                  <Sparkles className="w-5 h-5 text-[#4e6aff]" />
                </div>
                <CardTitle className="text-lg text-slate-900 font-space-grotesk font-bold">
                  Afshara AI Strategist
                </CardTitle>
                <CardDescription className="text-slate-600 text-xs">
                  Domain-tuned reasoning assistant specialized in CLPS payload requirements and lunar surface survival.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href="/dashboard/chat">
                  <Button variant="outline" size="sm" className="w-full text-xs font-medium border-slate-300 hover:bg-slate-50 text-slate-700">
                    Open AI Strategist
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. CANDIDATE LANDING SITES SECTION (Alternating Neutral Slate Background) */}
      <section id="landing-sites" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-y border-slate-200">
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

      {/* 5. SCIENTIFIC & MATHEMATICAL ARCHITECTURE (Clean Light Code Blocks) */}
      <section id="scientific-architecture" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              Mathematical Rigor
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
              Celestial &amp; RF Formulations
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Physics pipelines validated against NASA DE440 ephemeris and Deep Space Network link margins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {/* Formula 1 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-600 font-mono text-xs font-semibold">
                <Cpu className="w-4 h-4 text-[#4e6aff]" /> 1. TOPOCENTRIC ELEVATION ANGLE
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">Spherical Law of Cosines</h3>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 font-medium overflow-x-auto">
                {"sin(θ_elev) = sin(φ₁)sin(φ₂) + cos(φ₁)cos(φ₂)cos(λ₂ - λ₁)"}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transforms sub-solar and sub-Earth coordinates into the local observer&apos;s horizon frame.
              </p>
            </div>

            {/* Formula 2 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-600 font-mono text-xs font-semibold">
                <Mountain className="w-4 h-4 text-slate-600" /> 2. TOPOGRAPHIC RAYCASTING
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">Crater Rim Shadow Condition</h3>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 font-medium overflow-x-auto">
                {"Visible ⟺ θ_elev,sun > max(H_topo(α_sun))"}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates whether grazing low-angle sunlight is blocked by distant crater rims or peaks.
              </p>
            </div>

            {/* Formula 3 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-600 font-mono text-xs font-semibold">
                <Zap className="w-4 h-4 text-amber-500" /> 3. PHOTOVOLTAIC ARRAY MODEL
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">Solar Array Output with Dust Factor</h3>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 font-medium overflow-x-auto">
                {"P_net = S₀ · A · η · δ_dust · cos(θ_inc) · I_cleared"}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incorporates AM0 solar flux (1,361 W/m²), 30% cell efficiency, and regolith dust degradation (δ_dust = 0.92).
              </p>
            </div>

            {/* Formula 4 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-600 font-mono text-xs font-semibold">
                <Radio className="w-4 h-4 text-emerald-600" /> 4. DSN RF LINK BUDGET
              </div>
              <h3 className="text-base font-bold text-slate-900 font-space-grotesk">Free Space Path Loss &amp; Margin</h3>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 font-medium overflow-x-auto">
                {"Margin_dB = EIRP - FSPL + (G/T)_ground - k_B - R_data - (Eb/N0)_req"}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates path loss across 384,400 km at 8.45 GHz X-band to ensure closed DSN communication locks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TEAM & CFSBR SPACEWEB SHOWCASE (Clean White Cards) */}
      <section id="team" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-t border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <Badge variant="outline" className="text-slate-700 border-slate-300 text-xs font-medium">
              Organization &amp; Leadership
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 font-space-grotesk tracking-tight">
              CFSBR SpaceWeb Team Roster
            </h2>
            <p className="text-slate-600 text-sm">
              Centre for Fintech &amp; Strategic Business Research (CFSBR).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Member 1: Md Golam Mubasshir Rafi */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-slate-900 text-white text-[11px] font-medium px-2.5 py-0.5">
                    Lead Architect
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
                    Co-Lead &amp; Strategy
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
        </div>
      </section>

      {/* 7. CLEAN CALL TO ACTION CARD */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 sm:p-12 text-center space-y-4 shadow-xs">
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
                  Launch SelenSync Mission Control
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

      {/* 8. CLEAN LIGHT FOOTER */}
      <footer className="py-10 border-t border-slate-200 bg-white text-xs text-slate-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-[#4e6aff] flex items-center justify-center text-white">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 font-space-grotesk text-sm">SelenSync</span>
                <p className="text-[11px] text-slate-500">CLPS Lunar Mission Browser &bull; NASA Space Apps 2026</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-600">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Mission Control</Link>
              <Link href="/#features" className="hover:text-slate-900 transition-colors">Modules</Link>
              <Link href="/#landing-sites" className="hover:text-slate-900 transition-colors">Landing Sites</Link>
              <Link href="/#scientific-architecture" className="hover:text-slate-900 transition-colors">Formulas</Link>
              <Link href="/dashboard/chat" className="hover:text-slate-900 transition-colors">AI Strategist</Link>
              <Link href="https://github.com/gmrafi/cfsbr-selensync" target="_blank" className="hover:text-slate-900 transition-colors">GitHub</Link>
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
