import UniversalHeader from "@/components/universal-header"
import LunarMissionDashboard from "@/components/lunar/lunar-mission-dashboard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Globe, 
  Layers, 
  MessageSquare, 
  Radio, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Database
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#4e6aff]/20 font-sans">
      <UniversalHeader variant="light" />

      <main className="container mx-auto px-4 py-6 max-w-7xl space-y-5">
        {/* Cockpit Title & Quick Telemetry Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-blue-50 text-[#4e6aff] border-blue-200 text-xs font-semibold">
                NASA CLPS TACTICAL COCKPIT v3.0
              </Badge>
              <span className="text-xs text-slate-500 font-medium font-mono">LUNAR SOUTH POLE OPERATIONS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-space-grotesk tracking-tight">
              SelenSync <span className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] bg-clip-text text-transparent">Mission Operations Console</span>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5 max-w-3xl">
              Solar flux insolation, 360° crater rim shadow obstacle masking, cryogenic battery survival, and Deep Space Network (DSN) Direct-to-Earth link modeling for Artemis &amp; CLPS landers.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link href="/dashboard/map">
              <Button size="sm" className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs gap-1.5 shadow-xs font-semibold">
                <Globe className="w-3.5 h-3.5 text-[#4e6aff]" />
                3D Lunar Map
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button size="sm" className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] hover:from-[#3d59ef] hover:to-[#5d4bef] text-white text-xs gap-1.5 shadow-xs font-semibold">
                <MessageSquare className="w-3.5 h-3.5" />
                AI Flight Strategist
              </Button>
            </Link>
          </div>
        </div>

        {/* Primary Unified Tabbed Cockpit Workspace */}
        <LunarMissionDashboard />
      </main>
    </div>
  )
}
