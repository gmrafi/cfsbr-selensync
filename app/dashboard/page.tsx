import UniversalHeader from "@/components/universal-header"
import LunarMissionDashboard from "@/components/lunar/lunar-mission-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Globe, 
  Zap, 
  Radio, 
  Compass, 
  ShieldCheck, 
  Mountain, 
  Database,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#4e6aff]/20 font-sans">
      <UniversalHeader variant="light" />

      <main className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Welcome & Overview Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-blue-50 text-[#4e6aff] border-blue-200 text-xs font-semibold">
                MISSION CONTROL v2.6
              </Badge>
              <span className="text-xs text-slate-500 font-medium">NASA CLPS TACTICAL PLANNER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-space-grotesk tracking-tight">
              SelenSync <span className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] bg-clip-text text-transparent">Lunar Mission Control</span>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5 max-w-3xl">
              Real-time solar power modeling, 360° topographic crater rim shadow masking, and Direct-to-Earth (DTE) communication window engine for Artemis &amp; CLPS lunar landers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xs">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <div className="text-xs">
                <p className="text-slate-500 uppercase text-[10px] font-semibold">Ephemeris Pipeline</p>
                <p className="font-bold text-emerald-700">Astronomy-Engine Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Dual-Pane Lunar Mission Workspace */}
        <LunarMissionDashboard />

        {/* Secondary Tactical & Research Modules */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-space-grotesk">
              <Layers className="w-5 h-5 text-[#4e6aff]" />
              Integrated Lunar Exploration Architecture
            </h2>
            <span className="text-xs text-slate-500 font-medium">CFSBR SpaceWeb Operational Suite</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-slate-200 text-slate-800 shadow-xs hover:border-[#4e6aff] transition-all">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mb-2 text-[#4e6aff]">
                  <Mountain className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 font-bold font-space-grotesk">LRO LOLA Topography</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>Digital elevation models (DEM) derived from NASA Lunar Reconnaissance Orbiter laser altimetry at 5m–30m resolution.</p>
                <div className="font-semibold text-[11px] text-[#4e6aff]">STATUS: 4 CANDIDATE SITES READY</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 text-slate-800 shadow-xs hover:border-amber-500 transition-all">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-2 text-amber-600">
                  <Zap className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 font-bold font-space-grotesk">Solar Insolation Array</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>Photovoltaic generation curve with variable dust attenuation, cell efficiency (30% triple-junction GaAs), and cosine incidence angles.</p>
                <div className="font-semibold text-[11px] text-amber-700">MODEL: 1.361 kW/m² SOL CONSTANT</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 text-slate-800 shadow-xs hover:border-[#4e6aff] transition-all">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mb-2 text-[#4e6aff]">
                  <Radio className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 font-bold font-space-grotesk">DSN RF Link Budget</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>Calculates 8.4 GHz X-band transmission attenuation, free space path loss (~216 dB), and G/T SNR margin to Goldstone/Madrid/Canberra.</p>
                <div className="font-semibold text-[11px] text-[#4e6aff]">DSN APERTURE: 34M/70M BEAM</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 text-slate-800 shadow-xs hover:border-emerald-500 transition-all">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <CardTitle className="text-base text-slate-900 font-bold font-space-grotesk">PSR &amp; Landing Safety</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>Identifies Permanently Shadowed Regions (PSR), slope hazards (&gt; 12°), and optimizes landing ellipse containment for commercial landers.</p>
                <div className="font-semibold text-[11px] text-emerald-700">RISK INDEX: REAL-TIME EVAL</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick links banner */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/80 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 font-space-grotesk">
              Explore Live 3D Globe &amp; Map Visualizer
            </h3>
            <p className="text-xs text-slate-600">
              Access the interactive geospatial map viewer for global planetary and orbital context.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/map">
              <Button className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] hover:from-[#3d59ef] hover:to-[#5d4bef] text-white gap-2 font-semibold text-xs shadow-sm">
                <Globe className="w-4 h-4" />
                Open 3D Map
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold">
                Ask AI Strategist
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
