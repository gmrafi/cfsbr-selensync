"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  CANDIDATE_SITE_FINANCIAL_PROFILES, 
  TEA_CONSTANTS, 
  calculateDynamicTradeoff,
  SiteFinancialProfile 
} from "@/lib/finance/mission-tea-engine";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Compass, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  BatteryCharging, 
  Coins, 
  Scale, 
  Zap, 
  Radio, 
  ArrowRight, 
  Printer, 
  Layers, 
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
  Home
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

export default function MissionFinancePage() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("malapert-peak");
  const [missionDays, setMissionDays] = useState<number>(28);
  const [heaterWatts, setHeaterWatts] = useState<number>(120);
  const [scienceTargetKg, setScienceTargetKg] = useState<number>(45);

  // Compute dynamic tradeoff analytics
  const simResult = useMemo(() => {
    return calculateDynamicTradeoff({
      missionDays,
      heaterWatts,
      scienceTargetKg,
      selectedSiteId,
    });
  }, [missionDays, heaterWatts, scienceTargetKg, selectedSiteId]);

  const activeSite = simResult.site;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/20 pb-16">
        
        {/* ========================================================================= */}
        {/* 1. TOP AEROSPACE CONSOLE HEADER                                          */}
        {/* ========================================================================= */}
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
                title="Back to Overview"
              >
                <Home className="w-4 h-4" />
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Mission Finance: Techno-Economic &amp; Asset Risk Engine</span>
                  </h1>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-[10px] font-mono font-semibold px-1.5 py-0">
                    TEA ARCHITECTURE
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 hidden sm:block">
                  Aerospace Capital Allocation &bull; Launch Mass Savings &bull; NASA CLPS $1.2M/kg Baseline Model
                </p>
              </div>
            </div>

            {/* Context Controls: Site Selector & Print */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Site Selector Dropdown */}
              <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs">
                <span className="text-zinc-500 text-[11px] font-medium">Site:</span>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="bg-transparent text-zinc-100 font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  {CANDIDATE_SITE_FINANCIAL_PROFILES.slice(0, 3).map((site) => (
                    <option key={site.id} value={site.id} className="bg-zinc-900 text-zinc-100">
                      {site.name} ({site.lat.toFixed(1)}°S)
                    </option>
                  ))}
                </select>
              </div>

              {/* Epoch Toggle (14 Days vs 28 Days) */}
              <Tabs 
                value={missionDays === 14 ? "14" : "28"} 
                onValueChange={(val) => setMissionDays(Number(val))}
                className="hidden sm:inline-block"
              >
                <TabsList className="bg-zinc-900 border border-zinc-800 h-7 p-0.5">
                  <TabsTrigger value="14" className="text-xs px-2.5 py-0.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                    14d Lunar Day
                  </TabsTrigger>
                  <TabsTrigger value="28" className="text-xs px-2.5 py-0.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                    28d Extended
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-7 text-xs border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 gap-1.5"
                title="Print Executive Techno-Economic Report"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Report</span>
              </Button>

              <Link href="/dashboard">
                <Button size="sm" className="h-7 text-xs bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-semibold gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Cockpit</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* MAIN BODY CONTAINER                                                       */}
        {/* ========================================================================= */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

          {/* ======================================================================= */}
          {/* 2. TOP METRIC RIBBON (4 BENTO KPI CARDS)                                */}
          {/* ======================================================================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Net Launch Mass Cost Offset */}
            <Card className="bg-zinc-900/60 border-zinc-800/80 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500"></div>
              <CardHeader className="p-4 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Launch Cost Offset</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-zinc-500 hover:text-zinc-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs max-w-xs">
                      NASA CLPS payload transit to lunar surface costs ~$1.2M per kg. Avoiding crater shadow reduces battery mass buffer, directly saving rocket launch spend.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl lg:text-3xl font-black font-mono tabular-nums text-emerald-400 mt-1">
                  +${simResult.launchSavingsVsBasinM.toFixed(1)}M
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-[11px] text-zinc-400 leading-snug">
                Saved vs. polar basin benchmark from avoiding heavy shadow survival battery ballast.
              </CardContent>
            </Card>

            {/* Card 2: Levelized Cost of Science (LCMD) */}
            <Card className="bg-zinc-900/60 border-zinc-800/80 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-500"></div>
              <CardHeader className="p-4 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Levelized Cost / Day (LCMD)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-zinc-500 hover:text-zinc-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs max-w-xs">
                      Total Mission CAPEX ($120M) divided by productive sunlit operational days. High illumination drastically drives down the cost per science day.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl lg:text-3xl font-black font-mono tabular-nums text-cyan-400 mt-1">
                  ${simResult.lcmdDailyCostM.toFixed(2)}M <span className="text-xs text-zinc-500 font-sans font-normal">/ day</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-[11px] text-zinc-400 leading-snug">
                {Math.round(missionDays * activeSite.illuminationFraction)} active sunlit days out of {missionDays}d. (Basin benchmark: $12.50M/day).
              </CardContent>
            </Card>

            {/* Card 3: Capital-at-Risk Index (CaRI) */}
            <Card className="bg-zinc-900/60 border-zinc-800/80 shadow-xs relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${activeSite.cariPercent < 15 ? "bg-emerald-500" : activeSite.cariPercent < 30 ? "bg-amber-500" : "bg-rose-500"}`}></div>
              <CardHeader className="p-4 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Capital-at-Risk (CaRI)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-zinc-500 hover:text-zinc-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs max-w-xs">
                      Composite risk metric: 50% cryogenic shadow freeze hazard + 30% DSN line-of-sight blackout + 20% landing slope tip-over risk.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-2xl lg:text-3xl font-black font-mono tabular-nums ${activeSite.cariPercent < 15 ? "text-emerald-400" : activeSite.cariPercent < 30 ? "text-amber-400" : "text-rose-400"}`}>
                    {activeSite.cariPercent.toFixed(1)}%
                  </span>
                  <Badge variant="outline" className={`text-[10px] py-0 px-1 font-semibold ${activeSite.cariPercent < 15 ? "border-emerald-500/40 text-emerald-400" : "border-amber-500/40 text-amber-400"}`}>
                    {activeSite.cariPercent < 15 ? "Minimal Risk" : activeSite.cariPercent < 30 ? "Moderate" : "Elevated Risk"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-[11px] text-zinc-400 leading-snug">
                Max shadow: {activeSite.maxShadowHours}h &bull; Slope: {activeSite.maxSlopeDeg}° (&lt;10° Safe envelope).
              </CardContent>
            </Card>

            {/* Card 4: DTE Comm Cost Efficiency */}
            <Card className="bg-zinc-900/60 border-zinc-800/80 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500"></div>
              <CardHeader className="p-4 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">DTE Comm Line-of-Sight</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-zinc-500 hover:text-zinc-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs max-w-xs">
                      Direct-to-Earth coverage eliminates the need to lease expensive commercial lunar relay satellite constellation transponders (~$25M per campaign).
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl lg:text-3xl font-black font-mono tabular-nums text-blue-400 mt-1">
                  {(activeSite.dteAvailabilityFraction * 100).toFixed(1)}%
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-[11px] text-zinc-400 leading-snug">
                Avoids ~$25M in dedicated lunar orbital relay constellation lease fees.
              </CardContent>
            </Card>
          </section>

          {/* ======================================================================= */}
          {/* 3. INTERACTIVE TECHNO-ECONOMIC SIMULATOR (SLIDERS + VISUAL SPLIT)       */}
          {/* ======================================================================= */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Techno-Economic Trade-Off Simulator</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Adjust spacecraft thermal heating and science payload targets to model real-time hardware mass and launch budget optimization.
                </p>
              </div>
              <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-300 bg-zinc-950 font-mono w-fit">
                P_heater: {heaterWatts}W &bull; Duration: {missionDays}d
              </Badge>
            </div>

            {/* Grid: Left Sliders, Right Visual Tradeoff */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left 5 Cols: Sliders */}
              <div className="lg:col-span-5 space-y-4 bg-zinc-950/70 border border-zinc-800/80 p-4 rounded-xl">
                
                {/* Slider A: Mission Duration */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-200">A. Planned Mission Duration</span>
                    <span className="font-mono text-emerald-400 font-bold">{missionDays} Earth Days</span>
                  </div>
                  <Slider
                    min={7}
                    max={45}
                    step={1}
                    value={[missionDays]}
                    onValueChange={(val) => setMissionDays(val[0])}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>7d (Quick Ingress)</span>
                    <span>28d (Full Lunar Cycle)</span>
                    <span>45d (Long Duration)</span>
                  </div>
                </div>

                {/* Slider B: Heater Power Requirement */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-200">B. Survival Heater Draw (Shadow)</span>
                    <span className="font-mono text-rose-400 font-bold">{heaterWatts} Watts</span>
                  </div>
                  <Slider
                    min={80}
                    max={250}
                    step={5}
                    value={[heaterWatts]}
                    onValueChange={(val) => setHeaterWatts(val[0])}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>80W (Minimal)</span>
                    <span>120W (Baseline)</span>
                    <span>250W (Active Lines)</span>
                  </div>
                </div>

                {/* Slider C: Secondary Science Payload Target */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-200">C. Science Payload Target Mass</span>
                    <span className="font-mono text-cyan-400 font-bold">{scienceTargetKg} kg</span>
                  </div>
                  <Slider
                    min={20}
                    max={100}
                    step={5}
                    value={[scienceTargetKg]}
                    onValueChange={(val) => setScienceTargetKg(val[0])}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>20 kg (Compact)</span>
                    <span>45 kg (NASA Nominal)</span>
                    <span>100 kg (Heavy Suite)</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-zinc-400 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800 space-y-1">
                  <div className="flex justify-between">
                    <span>Computed Battery Mass:</span>
                    <span className="font-mono font-bold text-zinc-200">{simResult.batteryMassKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equivalent Launch Cost:</span>
                    <span className="font-mono font-bold text-emerald-400">${simResult.batteryCostM.toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Visual Donut & Capital Reallocation Card */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Donut Chart: Hardware Mass Breakdown */}
                <div className="bg-zinc-950/70 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-200">Spacecraft Mass Allocation</span>
                    <span className="text-[10px] font-mono text-zinc-500">Total ~1,200 kg</span>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={simResult.massBreakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={70}
                          paddingAngle={3}
                        >
                          {simResult.massBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", fontSize: "11px" }}
                          itemStyle={{ color: "#f4f4f5" }}
                          formatter={(value: any) => [`${value} kg`, "Mass"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-zinc-400 font-mono mt-1 border-t border-zinc-800 pt-2">
                    {simResult.massBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="truncate">{item.name}: <strong className="text-zinc-200">{item.value}kg</strong></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capital Reallocation Card */}
                <div className="bg-zinc-950/70 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-[10px] font-mono mb-2">
                      CAPITAL CONVERSION
                    </Badge>
                    <h3 className="text-sm font-bold text-zinc-100">
                      Ballast-to-Science Value Transformation
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      By choosing <strong>{activeSite.name}</strong>, you avoid <strong className="text-emerald-400">+{Math.round(CANDIDATE_SITE_FINANCIAL_PROFILES[3].requiredBatteryKg - simResult.batteryMassKg)} kg</strong> in dead battery ballast.
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2">
                    <div className="text-[11px] text-zinc-400 flex justify-between">
                      <span>Reallocated Capital Value:</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        +${simResult.reallocatedCapitalM.toFixed(1)}M
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex justify-between">
                      <span>Science Payload Capacity:</span>
                      <span className="font-mono text-cyan-400 font-bold text-sm">
                        {scienceTargetKg} kg ({Math.round((scienceTargetKg / 1250) * 100)}% of lander)
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 italic">
                    *Every 1 kg of battery eliminated frees up capacity for multi-spectral spectrometers, drills, or neutron detectors without additional rocket launch fees.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 4. ANALYTICAL CHARTS GRID (2 COLUMNS)                                   */}
          {/* ======================================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Chart 1: Cumulative Capital-at-Risk vs. Solar Elevation Curve (Area Chart) */}
            <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Capital-at-Risk vs. Solar Illumination Curve</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Dual-axis projection: Solar elevation (left, °) vs. Cumulative financial risk accumulation (right, $M).
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simResult.timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickFormatter={(val) => `D+${val}`} />
                    <YAxis yAxisId="left" stroke="#10b981" fontSize={10} domain={[-2, 6]} tickFormatter={(v) => `${v}°`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={10} tickFormatter={(v) => `$${v}M`} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", fontSize: "11px" }}
                      itemStyle={{ color: "#f4f4f5" }}
                      formatter={(value: any, name: any) => [
                        name === "solarElevationDeg" ? `${value}°` : `$${value}M`,
                        name === "solarElevationDeg" ? "Solar Elevation" : "Cumulative Risk",
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="solarElevationDeg"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#solarGradient)"
                      name="Solar Elevation (°)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="cumulativeRiskM"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#riskGradient)"
                      name="Cumulative Risk ($M)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono text-center">
                *Whenever solar elevation dips below 0° (crater shadow), risk increases rapidly as thermal heater draw exhausts battery capacity.
              </div>
            </div>

            {/* Chart 2: Comparative Lifecycle Cost Breakdown (Grouped Bar Chart) */}
            <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Lifecycle Cost Allocation Comparison ($M)</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Comparing Malapert Mountain vs. Shackleton Ridge vs. Polar Basin across cost categories.
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simResult.lifecycleComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="category" stroke="#71717a" fontSize={9} />
                    <YAxis stroke="#71717a" fontSize={10} tickFormatter={(v) => `$${v}M`} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", fontSize: "11px" }}
                      itemStyle={{ color: "#f4f4f5" }}
                      formatter={(val: any) => [`$${val}M`, "Cost"]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="malapert" name="Malapert Mountain" fill="#10b981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="shackleton" name="Shackleton Ridge" fill="#0284c7" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="craterBasin" name="Polar Crater Floor" fill="#64748b" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono text-center">
                *Polar crater floors require $441.5M in battery mass overhead alone, making low-elevation basins financially prohibitive.
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 5. CROSS-SITE FINANCIAL SENSITIVITY MATRIX (TABLE)                     */}
          {/* ======================================================================= */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>Artemis Candidate Sites: Techno-Economic Sensitivity Matrix</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Direct evaluation of landing site solar availability, shadow intervals, required battery reserves, and transit costs.
                </p>
              </div>
              <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-400 bg-emerald-500/10 font-mono w-fit">
                NASA CLPS TEA BENCHMARK
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400 font-semibold">Candidate Landing Site</TableHead>
                    <TableHead className="text-zinc-400 font-semibold text-center">Illumination (%)</TableHead>
                    <TableHead className="text-zinc-400 font-semibold text-center">Max Shadow (hrs)</TableHead>
                    <TableHead className="text-zinc-400 font-semibold text-center">Battery Reserve</TableHead>
                    <TableHead className="text-zinc-400 font-semibold text-center">Launch Transit Cost</TableHead>
                    <TableHead className="text-zinc-400 font-semibold text-center">Capital Risk (CaRI)</TableHead>
                    <TableHead className="text-zinc-400 font-semibold text-right">Net Efficiency Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CANDIDATE_SITE_FINANCIAL_PROFILES.map((site) => {
                    const isOptimal = site.id === "malapert-peak";
                    const isBenchmark = site.id === "polar-basin-benchmark";
                    return (
                      <TableRow 
                        key={site.id} 
                        className={`border-zinc-800/80 transition-colors ${
                          site.id === selectedSiteId 
                            ? "bg-zinc-800/50" 
                            : "hover:bg-zinc-900/50"
                        }`}
                      >
                        <TableCell className="font-semibold text-zinc-200">
                          <div className="flex items-center gap-2">
                            <span>{site.name}</span>
                            {isOptimal && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[9px] px-1 py-0">
                                OPTIMAL
                              </Badge>
                            )}
                            {isBenchmark && (
                              <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-[9px] px-1 py-0">
                                BENCHMARK
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500 block font-mono">
                            {site.lat.toFixed(1)}°S, {site.lon.toFixed(1)}°E &bull; Slope {site.maxSlopeDeg}°
                          </span>
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums font-bold text-zinc-200">
                          {(site.illuminationFraction * 100).toFixed(1)}%
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums text-zinc-300">
                          {site.maxShadowHours} h
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums">
                          <span className="text-rose-400 font-bold">{site.requiredBatteryKg} kg</span>
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums font-semibold text-zinc-200">
                          ${site.batteryLaunchCostM.toFixed(1)}M
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            site.cariPercent < 15 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                              : site.cariPercent < 40 
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" 
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}>
                            {site.cariPercent.toFixed(1)}%
                          </span>
                        </TableCell>

                        <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-400 text-sm">
                          {site.netEfficiencyScore.toFixed(1)} / 100
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200">Techno-Economic Conclusion:</strong> Malapert Mountain (Peak) represents the single most capital-efficient landing target on the lunar south pole. Its 96.4% illumination window limits continuous shadow to just 24.2 hours, saving <strong>+$38.4M in launch mass overhead</strong> compared to crater floors and allowing an extra 32+ kg of scientific equipment to be flown for zero extra rocket transit cost.
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 6. METHODOLOGY & PHYSICAL CITATIONS FOOTER                             */}
          {/* ======================================================================= */}
          <footer className="border-t border-zinc-800 pt-6 text-xs text-zinc-500 space-y-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>
                <strong>SelenSync Techno-Economic Architecture:</strong> Derived from official NASA CLPS Payload Services benchmarks, JPL DE440 ephemeris, and LRO LOLA polar altimetry.
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-200 underline">
                  Mission Cockpit
                </Link>
                <span>&bull;</span>
                <Link href="/dashboard/map" className="text-zinc-400 hover:text-zinc-200 underline">
                  Planetary Map
                </Link>
                <span>&bull;</span>
                <Link href="/" className="text-zinc-400 hover:text-zinc-200 underline">
                  Overview
                </Link>
              </div>
            </div>
            <p className="text-[11px] font-mono text-zinc-600">
              Formulas: M_battery = (P_heater &times; T_shadow) / (180 Wh/kg &times; 0.80 DoD) &bull; LCMD = CAPEX ($120M) / Active Days &bull; CaRI = 0.50&times;Shadow + 0.30&times;Blackout + 0.20&times;Slope
            </p>
          </footer>

        </main>
      </div>
    </TooltipProvider>
  );
}
