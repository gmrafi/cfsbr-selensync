"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
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
  Home,
  Sun,
  Moon,
  Satellite
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
  Legend,
  ReferenceLine
} from "recharts";

export default function MissionFinancePage() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("malapert-peak");
  const [missionDays, setMissionDays] = useState<number>(28);
  const [heaterWatts, setHeaterWatts] = useState<number>(120);
  const [scienceTargetKg, setScienceTargetKg] = useState<number>(45);

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? resolvedTheme === "dark" : false;
  const toggleTheme = () => setTheme(isDarkMode ? "light" : "dark");

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

  // High-contrast Recharts styling helpers based on active theme
  const chartGridStroke = isDarkMode ? "#27272a" : "#cbd5e1";
  const chartAxisTickColor = isDarkMode ? "#a1a1aa" : "#334155";
  const tooltipStyle = {
    backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
    borderColor: isDarkMode ? "#3f3f46" : "#94a3b8",
    color: isDarkMode ? "#f4f4f5" : "#0f172a",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: isDarkMode 
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.5)" 
      : "0 4px 10px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -2px rgba(0, 0, 0, 0.08)"
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-slate-100/70 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/20 transition-colors pb-16">
        
        {/* ========================================================================= */}
        {/* SINGLE DEDICATED MISSION FINANCE CONSOLE HEADER                           */}
        {/* ========================================================================= */}
        <header className="sticky top-0 z-40 border-b border-slate-300 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 sm:px-6 py-2.5 transition-colors shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Left: Brand + Page Title + Badges */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
                title="Return to SelenSync Mission Portal"
              >
                <Home className="w-4 h-4 text-[#4e6aff]" />
                <span className="text-xs font-bold hidden sm:inline">Home</span>
              </Link>

              <div className="h-6 w-px bg-slate-300 dark:bg-zinc-800 hidden sm:block" />

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Mission Finance: Techno-Economic Analysis (TEA)</span>
                  </span>
                  <Badge variant="outline" className="border-emerald-600 text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 text-[10px] font-mono font-bold px-1.5 py-0">
                    NASA CLPS MODEL
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 hidden lg:block font-medium">
                  Aerospace Capital Allocation &bull; $1.2M/kg Payload Transit Cost &bull; Cryogenic Battery Mass Trade-Offs
                </p>
              </div>
            </div>

            {/* Right: Controls (Site Selector, Epoch, Theme Switcher, Print, Cockpit) */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              
              {/* Site Selector Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
                <span className="text-slate-600 dark:text-zinc-400 text-[11px] font-bold">Site:</span>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-zinc-100 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  {CANDIDATE_SITE_FINANCIAL_PROFILES.slice(0, 3).map((site) => (
                    <option key={site.id} value={site.id} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-medium">
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
                <TabsList className="bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 h-7 p-0.5">
                  <TabsTrigger value="14" className="text-xs font-bold px-2 py-0.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-2xs text-slate-600 dark:text-zinc-400">
                    14d Day
                  </TabsTrigger>
                  <TabsTrigger value="28" className="text-xs font-bold px-2 py-0.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-2xs text-slate-600 dark:text-zinc-400">
                    28d Cycle
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Theme Toggle Button (Light/Dark) */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="h-7 w-7 p-0 border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 transition-colors shadow-2xs"
                title={isDarkMode ? "Switch to High-Contrast Light Mode" : "Switch to Dark Aerospace Mode"}
              >
                {mounted && isDarkMode ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                )}
              </Button>

              {/* Print Report Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-7 text-xs font-semibold border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 gap-1.5 transition-colors shadow-2xs"
                title="Print Executive Techno-Economic Report"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" />
                <span className="hidden sm:inline">Print Report</span>
              </Button>

              {/* Mission Cockpit Link */}
              <Link href="/dashboard">
                <Button size="sm" className="h-7 text-xs bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-bold gap-1.5 shadow-2xs">
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 space-y-6">

          {/* ======================================================================= */}
          {/* 1. TOP METRIC RIBBON (4 HIGH-CONTRAST BENTO KPI CARDS)                  */}
          {/* ======================================================================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Net Launch Mass Cost Offset */}
            <Card className="bg-white dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
              <CardHeader className="p-4 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-zinc-400">Launch Cost Offset</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 dark:bg-zinc-900 border-slate-700 text-white text-xs max-w-xs shadow-md">
                      NASA CLPS payload transit to lunar surface costs ~$1.2M per kg. Avoiding crater shadow reduces battery mass buffer, directly saving rocket launch spend.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl lg:text-3xl font-black font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-1 tracking-tight">
                  +${simResult.launchSavingsVsBasinM.toFixed(1)}M
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-[11px] text-slate-600 dark:text-zinc-400 leading-snug font-medium">
                Saved vs. polar basin benchmark from avoiding heavy shadow survival battery ballast.
              </CardContent>
            </Card>

            {/* Card 2: Levelized Cost of Science (LCMD) */}
            <Card className="bg-white dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-600"></div>
              <CardHeader className="p-4 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-zinc-400">Levelized Cost / Day (LCMD)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 dark:bg-zinc-900 border-slate-700 text-white text-xs max-w-xs shadow-md">
                      Total Mission CAPEX ($120M) divided by productive sunlit operational days. High illumination drastically drives down the cost per science day.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl lg:text-3xl font-black font-mono tabular-nums text-cyan-800 dark:text-cyan-400 mt-1 tracking-tight">
                  ${simResult.lcmdDailyCostM.toFixed(2)}M <span className="text-xs text-slate-500 dark:text-zinc-500 font-sans font-normal">/ day</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-[11px] text-slate-600 dark:text-zinc-400 leading-snug font-medium">
                {Math.round(missionDays * activeSite.illuminationFraction)} active sunlit days out of {missionDays}d. (Basin benchmark: $12.50M/day).
              </CardContent>
            </Card>

            {/* Card 3: Capital-at-Risk Index (CaRI) */}
            <Card className="bg-white dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden transition-all">
              <div className={`absolute top-0 left-0 right-0 h-1 ${activeSite.cariPercent < 15 ? "bg-emerald-600" : activeSite.cariPercent < 30 ? "bg-amber-600" : "bg-rose-600"}`}></div>
              <CardHeader className="p-4 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-zinc-400">Capital-at-Risk (CaRI)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 dark:bg-zinc-900 border-slate-700 text-white text-xs max-w-xs shadow-md">
                      Composite risk metric: 50% cryogenic shadow freeze hazard + 30% DSN line-of-sight blackout + 20% landing slope tip-over risk.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-2xl lg:text-3xl font-black font-mono tabular-nums ${activeSite.cariPercent < 15 ? "text-emerald-700 dark:text-emerald-400" : activeSite.cariPercent < 30 ? "text-amber-700 dark:text-amber-400" : "text-rose-700 dark:text-rose-400"}`}>
                    {activeSite.cariPercent.toFixed(1)}%
                  </span>
                  <Badge variant="outline" className={`text-[10px] py-0 px-1 font-bold ${activeSite.cariPercent < 15 ? "border-emerald-600 text-emerald-800 dark:text-emerald-400 bg-emerald-50" : "border-amber-600 text-amber-800 dark:text-amber-400 bg-amber-50"}`}>
                    {activeSite.cariPercent < 15 ? "Minimal Risk" : activeSite.cariPercent < 30 ? "Moderate" : "Elevated Risk"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-[11px] text-slate-600 dark:text-zinc-400 leading-snug font-medium">
                Max shadow: {activeSite.maxShadowHours}h &bull; Slope: {activeSite.maxSlopeDeg}° (&lt;10° Safe envelope).
              </CardContent>
            </Card>

            {/* Card 4: DTE Comm Cost Efficiency */}
            <Card className="bg-white dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
              <CardHeader className="p-4 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-zinc-400">DTE Comm Line-of-Sight</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 dark:bg-zinc-900 border-slate-700 text-white text-xs max-w-xs shadow-md">
                      Direct-to-Earth coverage eliminates the need to lease expensive commercial lunar relay satellite constellation transponders (~$25M per campaign).
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-2xl lg:text-3xl font-black font-mono tabular-nums text-blue-700 dark:text-blue-400 mt-1 tracking-tight">
                  {(activeSite.dteAvailabilityFraction * 100).toFixed(1)}%
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-[11px] text-slate-600 dark:text-zinc-400 leading-snug font-medium">
                Avoids ~$25M in dedicated lunar orbital relay constellation lease fees.
              </CardContent>
            </Card>
          </section>

          {/* ======================================================================= */}
          {/* 2. INTERACTIVE TECHNO-ECONOMIC SIMULATOR (SLIDERS + VISUAL SPLIT)       */}
          {/* ======================================================================= */}
          <section className="bg-white dark:bg-zinc-900/80 border border-slate-300 dark:border-zinc-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-5 transition-colors">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Interactive Techno-Economic Trade-Off Simulator</span>
                </h2>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 font-medium">
                  Adjust spacecraft thermal heating and science payload targets to model real-time hardware mass and launch budget optimization.
                </p>
              </div>
              <Badge variant="outline" className="text-xs border-slate-400 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-950 font-mono font-bold w-fit">
                P_heater: {heaterWatts}W &bull; Duration: {missionDays}d
              </Badge>
            </div>

            {/* Grid: Left Sliders, Right Visual Tradeoff */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left 5 Cols: Sliders in a distinct elevated card */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl p-4 shadow-2xs">
                
                {/* Slider A: Mission Duration */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">A. Planned Mission Duration</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold">{missionDays} Earth Days</span>
                  </div>
                  <Slider
                    min={7}
                    max={45}
                    step={1}
                    value={[missionDays]}
                    onValueChange={(val) => setMissionDays(val[0])}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-zinc-400 font-mono font-semibold">
                    <span>7d (Quick Ingress)</span>
                    <span>28d (Full Lunar Cycle)</span>
                    <span>45d (Long Duration)</span>
                  </div>
                </div>

                {/* Slider B: Heater Power Requirement */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">B. Survival Heater Draw (Shadow)</span>
                    <span className="font-mono text-rose-700 dark:text-rose-400 font-extrabold">{heaterWatts} Watts</span>
                  </div>
                  <Slider
                    min={80}
                    max={250}
                    step={5}
                    value={[heaterWatts]}
                    onValueChange={(val) => setHeaterWatts(val[0])}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-zinc-400 font-mono font-semibold">
                    <span>80W (Minimal)</span>
                    <span>120W (Baseline)</span>
                    <span>250W (Active Lines)</span>
                  </div>
                </div>

                {/* Slider C: Secondary Science Payload Target */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">C. Science Payload Target Mass</span>
                    <span className="font-mono text-cyan-800 dark:text-cyan-400 font-extrabold">{scienceTargetKg} kg</span>
                  </div>
                  <Slider
                    min={20}
                    max={100}
                    step={5}
                    value={[scienceTargetKg]}
                    onValueChange={(val) => setScienceTargetKg(val[0])}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-zinc-400 font-mono font-semibold">
                    <span>20 kg (Compact)</span>
                    <span>45 kg (NASA Nominal)</span>
                    <span>100 kg (Heavy Suite)</span>
                  </div>
                </div>

                {/* Battery output summary */}
                <div className="pt-2 text-[11px] text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-slate-300 dark:border-zinc-800 space-y-1.5 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Computed Battery Mass:</span>
                    <span className="font-mono font-extrabold text-slate-900 dark:text-zinc-100">{simResult.batteryMassKg} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Equivalent Launch Cost:</span>
                    <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400">${simResult.batteryCostM.toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Visual Donut & Capital Reallocation Card */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Donut Chart: Hardware Mass Breakdown */}
                <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 p-4 rounded-xl flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-zinc-100">Spacecraft Mass Allocation</span>
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-zinc-400">Total ~1,200 kg</span>
                  </div>

                  <div className="h-44 w-full relative flex items-center justify-center">
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
                          stroke={isDarkMode ? "#09090b" : "#ffffff"}
                          strokeWidth={2}
                        >
                          {simResult.massBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={tooltipStyle}
                          formatter={(value: any) => [`${value} kg`, "Mass"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-mono font-black text-slate-900 dark:text-white">1,200 kg</span>
                      <span className="text-[9px] uppercase font-bold text-slate-500">Gross Mass</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-700 dark:text-zinc-300 font-mono mt-1 border-t border-slate-200 dark:border-zinc-800 pt-2 font-semibold">
                    {simResult.massBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-300 dark:border-zinc-700" style={{ backgroundColor: item.color }} />
                        <span className="truncate">{item.name}: <strong className="text-slate-900 dark:text-zinc-100">{item.value}kg</strong></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capital Reallocation Card */}
                <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-2xs">
                  <div>
                    <Badge variant="outline" className="border-emerald-600 text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 text-[10px] font-mono font-bold mb-2">
                      CAPITAL CONVERSION
                    </Badge>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-100">
                      Ballast-to-Science Value Transformation
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 mt-1 leading-relaxed font-medium">
                      By choosing <strong>{activeSite.name}</strong>, you avoid <strong className="text-emerald-700 dark:text-emerald-400 font-bold">+{Math.round(CANDIDATE_SITE_FINANCIAL_PROFILES[3].requiredBatteryKg - simResult.batteryMassKg)} kg</strong> in dead battery ballast.
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg space-y-2 shadow-2xs">
                    <div className="text-[11px] text-slate-700 dark:text-zinc-300 flex justify-between items-center">
                      <span className="font-semibold">Reallocated Capital Value:</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 font-black text-base">
                        +${simResult.reallocatedCapitalM.toFixed(1)}M
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 dark:text-zinc-300 flex justify-between items-center">
                      <span className="font-semibold">Science Payload Capacity:</span>
                      <span className="font-mono text-cyan-800 dark:text-cyan-400 font-black text-sm">
                        {scienceTargetKg} kg ({Math.round((scienceTargetKg / 1250) * 100)}% of lander)
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-600 dark:text-zinc-400 italic">
                    *Every 1 kg of battery eliminated frees up capacity for multi-spectral spectrometers, drills, or neutron detectors without additional rocket launch fees.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 3. ANALYTICAL CHARTS GRID (HIGH CONTRAST, RICH STROKES)                 */}
          {/* ======================================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Chart 1: Cumulative Capital-at-Risk vs. Solar Elevation Curve (Area Chart) */}
            <div className="lg:col-span-6 bg-white dark:bg-zinc-900/80 border border-slate-300 dark:border-zinc-800 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Capital-at-Risk vs. Solar Illumination Curve</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
                    Dual-axis projection: Solar elevation (left, °) vs. Cumulative financial risk accumulation (right, $M).
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simResult.timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                    <XAxis dataKey="day" stroke={chartAxisTickColor} fontSize={10} fontWeight="bold" tickFormatter={(val) => `D+${val}`} />
                    <YAxis yAxisId="left" stroke="#059669" fontSize={10} fontWeight="bold" domain={[-2, 6]} tickFormatter={(v) => `${v}°`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#dc2626" fontSize={10} fontWeight="bold" tickFormatter={(v) => `$${v}M`} />
                    <ReferenceLine yAxisId="left" y={0} stroke="#64748b" strokeDasharray="3 3" label={{ value: "Lunar Horizon 0°", position: "insideBottomLeft", fill: "#64748b", fontSize: 9 }} />
                    <RechartsTooltip
                      contentStyle={tooltipStyle}
                      formatter={(value: any, name: any) => [
                        name === "solarElevationDeg" ? `${value}°` : `$${value}M`,
                        name === "solarElevationDeg" ? "Solar Elevation" : "Cumulative Risk",
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingTop: "8px" }} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="solarElevationDeg"
                      stroke="#059669"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#solarGradient)"
                      name="Solar Elevation (°)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="cumulativeRiskM"
                      stroke="#dc2626"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#riskGradient)"
                      name="Cumulative Risk ($M)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] text-slate-600 dark:text-zinc-400 font-mono text-center font-medium">
                *Whenever solar elevation dips below 0° (crater shadow), risk increases rapidly as thermal heater draw exhausts battery capacity.
              </div>
            </div>

            {/* Chart 2: Comparative Lifecycle Cost Breakdown (Grouped Bar Chart) */}
            <div className="lg:col-span-6 bg-white dark:bg-zinc-900/80 border border-slate-300 dark:border-zinc-800 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                    <span>Lifecycle Cost Allocation Comparison ($M)</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
                    Comparing Malapert Mountain vs. Shackleton Ridge vs. Polar Basin across cost categories.
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simResult.lifecycleComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                    <XAxis dataKey="category" stroke={chartAxisTickColor} fontSize={10} fontWeight="bold" />
                    <YAxis stroke={chartAxisTickColor} fontSize={10} fontWeight="bold" tickFormatter={(v) => `$${v}M`} />
                    <RechartsTooltip
                      contentStyle={tooltipStyle}
                      formatter={(val: any) => [`$${val}M`, "Cost"]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingTop: "8px" }} />
                    <Bar dataKey="malapert" name="Malapert Mountain" fill="#059669" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="shackleton" name="Shackleton Ridge" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="craterBasin" name="Polar Crater Floor" fill="#475569" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] text-slate-600 dark:text-zinc-400 font-mono text-center font-medium">
                *Polar crater floors require $441.5M in battery mass overhead alone, making low-elevation basins financially prohibitive.
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 4. CROSS-SITE FINANCIAL SENSITIVITY MATRIX (HIGH-CONTRAST TABLE)       */}
          {/* ======================================================================= */}
          <section className="bg-white dark:bg-zinc-900/80 border border-slate-300 dark:border-zinc-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Artemis Candidate Sites: Techno-Economic Sensitivity Matrix</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 font-medium">
                  Direct evaluation of landing site solar availability, shadow intervals, required battery reserves, and transit costs.
                </p>
              </div>
              <Badge variant="outline" className="text-xs border-emerald-600 text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 font-mono font-bold w-fit">
                NASA CLPS TEA BENCHMARK
              </Badge>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-zinc-800 rounded-lg">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="border-b-2 border-slate-300 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-100">
                    <TableHead className="text-slate-900 dark:text-zinc-200 font-black">Candidate Landing Site</TableHead>
                    <TableHead className="text-slate-900 dark:text-zinc-200 font-black text-center">Illumination (%)</TableHead>
                    <TableHead className="text-slate-900 dark:text-zinc-200 font-black text-center">Max Shadow (hrs)</TableHead>
                    <TableHead className="text-slate-900 dark:text-zinc-200 font-black text-center">Battery Reserve</TableHead>
                    <TableHead className="text-slate-900 dark:text-zinc-200 font-black text-center">Launch Transit Cost</TableHead>
                    <TableHead className="text-slate-900 dark:text-zinc-200 font-black text-center">Capital Risk (CaRI)</TableHead>
                    <TableHead className="text-slate-900 dark:text-zinc-200 font-black text-right">Net Efficiency Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CANDIDATE_SITE_FINANCIAL_PROFILES.map((site) => {
                    const isOptimal = site.id === "malapert-peak";
                    const isBenchmark = site.id === "polar-basin-benchmark";
                    const isSelected = site.id === selectedSiteId;
                    return (
                      <TableRow 
                        key={site.id} 
                        className={`border-b border-slate-200 dark:border-zinc-800/80 transition-colors ${
                          isSelected 
                            ? "bg-emerald-50 dark:bg-zinc-800/70 border-l-4 border-l-emerald-600 font-medium" 
                            : "hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                        }`}
                      >
                        <TableCell className="font-extrabold text-slate-900 dark:text-zinc-200">
                          <div className="flex items-center gap-2">
                            <span>{site.name}</span>
                            {isOptimal && (
                              <Badge className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0 shadow-2xs">
                                OPTIMAL
                              </Badge>
                            )}
                            {isBenchmark && (
                              <Badge variant="outline" className="border-slate-400 dark:border-zinc-700 text-slate-700 dark:text-zinc-400 text-[9px] px-1 py-0 bg-slate-200 dark:bg-zinc-800 font-bold">
                                BENCHMARK
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-600 dark:text-zinc-400 block font-mono font-normal">
                            {site.lat.toFixed(1)}°S, {site.lon.toFixed(1)}°E &bull; Slope {site.maxSlopeDeg}°
                          </span>
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums font-black text-slate-900 dark:text-zinc-100">
                          {(site.illuminationFraction * 100).toFixed(1)}%
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums text-slate-800 dark:text-zinc-200 font-bold">
                          {site.maxShadowHours} h
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums">
                          <span className="text-rose-700 dark:text-rose-400 font-black">{site.requiredBatteryKg} kg</span>
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums font-bold text-slate-900 dark:text-zinc-100">
                          ${site.batteryLaunchCostM.toFixed(1)}M
                        </TableCell>

                        <TableCell className="text-center font-mono tabular-nums">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                            site.cariPercent < 15 
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30" 
                              : site.cariPercent < 40 
                              ? "bg-amber-100 text-amber-900 border border-amber-400 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30" 
                              : "bg-rose-100 text-rose-900 border border-rose-400 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30"
                          }`}>
                            {site.cariPercent.toFixed(1)}%
                          </span>
                        </TableCell>

                        <TableCell className="text-right font-mono tabular-nums font-black text-emerald-700 dark:text-emerald-400 text-sm">
                          {site.netEfficiencyScore.toFixed(1)} / 100
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-lg text-xs text-slate-700 dark:text-zinc-300 leading-relaxed flex items-start gap-2.5 transition-colors shadow-2xs">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-zinc-100 font-bold">Techno-Economic Conclusion:</strong> Malapert Mountain (Peak) represents the single most capital-efficient landing target on the lunar south pole. Its 96.4% illumination window limits continuous shadow to just 24.2 hours, saving <strong className="text-emerald-700 dark:text-emerald-400 font-bold">+$38.4M in launch mass overhead</strong> compared to crater floors and allowing an extra 32+ kg of scientific equipment to be flown for zero extra rocket transit cost.
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 5. METHODOLOGY & PHYSICAL CITATIONS FOOTER                             */}
          {/* ======================================================================= */}
          <footer className="border-t border-slate-300 dark:border-zinc-800 pt-6 text-xs text-slate-600 dark:text-zinc-400 space-y-2 transition-colors">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="font-medium">
                <strong className="text-slate-800 dark:text-zinc-200">SelenSync Techno-Economic Architecture:</strong> Derived from official NASA CLPS Payload Services benchmarks, JPL DE440 ephemeris, and LRO LOLA polar altimetry.
              </p>
              <div className="flex items-center gap-2 shrink-0 font-semibold">
                <Link href="/dashboard" className="text-slate-700 dark:text-zinc-300 hover:text-[#4e6aff] underline">
                  Mission Cockpit
                </Link>
                <span>&bull;</span>
                <Link href="/dashboard/map" className="text-slate-700 dark:text-zinc-300 hover:text-[#4e6aff] underline">
                  Planetary Map
                </Link>
                <span>&bull;</span>
                <Link href="/" className="text-slate-700 dark:text-zinc-300 hover:text-[#4e6aff] underline">
                  Overview
                </Link>
              </div>
            </div>
            <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
              Formulas: M_battery = (P_heater &times; T_shadow) / (180 Wh/kg &times; 0.80 DoD) &bull; LCMD = CAPEX ($120M) / Active Days &bull; CaRI = 0.50&times;Shadow + 0.30&times;Blackout + 0.20&times;Slope
            </p>
          </footer>

        </main>
      </div>
    </TooltipProvider>
  );
}
