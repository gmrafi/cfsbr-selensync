"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  Rocket, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sun,
  Moon,
  Home,
  SlidersHorizontal,
  Zap,
  Radio,
  Mountain,
  BatteryCharging,
  ShieldCheck,
  Activity,
  Calendar,
  Compass,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { CLPS_LANDER_PROFILES, CLPSLanderProfile } from "@/lib/physics/lander-profiles";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";

interface CockpitHudBarProps {
  simulatedDate: Date;
  baseDate: Date;
  onChangeBaseDate: (date: Date) => void;
  timeOffsetHours: number;
  activeSite: LunarCandidateSite;
  activeLander: CLPSLanderProfile;
  onSelectSite: (siteId: string) => void;
  onSelectLander: (landerId: string) => void;
  isSunInShadow: boolean;
  isEarthOccluded: boolean;
  onExportJSON?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function CockpitHudBar({
  simulatedDate,
  baseDate,
  onChangeBaseDate,
  timeOffsetHours,
  activeSite,
  activeLander,
  onSelectSite,
  onSelectLander,
  isSunInShadow,
  isEarthOccluded,
  isDarkMode,
  onToggleDarkMode,
}: CockpitHudBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const days = Math.floor(timeOffsetHours / 24);
  const hours = Math.floor(timeOffsetHours % 24);
  const metString = `MET +${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h 00m`;
  const utcFormatted = simulatedDate.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <header className={`h-12 shrink-0 border-b px-3 sm:px-4 flex items-center justify-between text-xs select-none z-20 transition-colors ${
      isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-xs"
    }`}>
      {/* Left: Navigation, Mission Title & Vehicle Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Return to Home */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
            isDarkMode 
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
          }`}
        >
          <Home className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Home</span>
        </Link>

        {/* Link to Dedicated Lunar GIS Map */}
        <Link
          href="/dashboard/map"
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
            isDarkMode 
              ? "bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border-cyan-800/60" 
              : "bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-cyan-500" />
          <span>Planetary Map</span>
        </Link>

        {/* Mission Brand Title */}
        <div className="flex items-center gap-1.5 px-2 border-l border-r border-slate-200 dark:border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
            SelenSync
          </span>
          <Badge variant="outline" className="hidden lg:inline-flex text-[10px] font-semibold py-0 px-1.5 border-slate-300 dark:border-slate-700">
            CLPS OPS
          </Badge>
        </div>

        {/* Payload Vehicle Selector */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${
          isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
        }`}>
          <Rocket className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-slate-500 font-medium text-[11px] hidden sm:inline">Lander:</span>
          <select
            value={activeLander.id}
            onChange={(e) => onSelectLander(e.target.value)}
            className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs"
          >
            {CLPS_LANDER_PROFILES.map((l) => (
              <option key={l.id} value={l.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Mission Clocks & Epoch Date Picker */}
      <div className="hidden md:flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${
          isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
        }`}>
          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-slate-500 font-medium text-[11px]">Epoch:</span>
          <input
            type="date"
            value={baseDate.toISOString().slice(0, 10)}
            onChange={(e) => {
              if (e.target.value) {
                onChangeBaseDate(new Date(e.target.value + "T00:00:00Z"));
              }
            }}
            className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs font-mono"
          />
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-bold ${
          isDarkMode ? "bg-slate-800/90 border-slate-700 text-slate-100" : "bg-slate-100 border-slate-300 text-slate-800"
        }`}>
          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>{metString}</span>
        </div>

        <div className={`hidden lg:block px-2.5 py-1 rounded-md border text-xs font-mono font-semibold ${
          isDarkMode ? "bg-slate-800/90 border-slate-700 text-emerald-400" : "bg-slate-100 border-slate-300 text-emerald-700"
        }`}>
          {utcFormatted}
        </div>
      </div>

      {/* Right: Site Selector, C&W Status, Sheet Drawer, Light/Dark Toggle */}
      <div className="flex items-center gap-2">
        {/* Site Selector */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${
          isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
        }`}>
          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-slate-500 font-medium text-[11px] hidden sm:inline">Site:</span>
          <select
            value={activeSite.id}
            onChange={(e) => onSelectSite(e.target.value)}
            className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs max-w-[140px] sm:max-w-[180px] truncate"
          >
            {LUNAR_SOUTH_POLE_CANDIDATES.map((s) => (
              <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {s.name.split("(")[0]} ({s.latitude}°S)
              </option>
            ))}
          </select>
        </div>

        {/* Master Caution & Warning Indicator */}
        <div
          className={`px-2 py-1 rounded-md font-sans text-xs font-bold border flex items-center gap-1.5 ${
            isSunInShadow || isEarthOccluded
              ? isEarthOccluded && isSunInShadow
                ? "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
              : "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
          }`}
        >
          {isSunInShadow || isEarthOccluded ? (
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>
            {isSunInShadow && isEarthOccluded
              ? "BLACKOUT"
              : isSunInShadow
              ? "SHADOW"
              : isEarthOccluded
              ? "LOS OCCLUDED"
              : "NOMINAL"}
          </span>
        </div>

        {/* Tactical Telemetry Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className={`h-7 px-2 border text-xs font-medium gap-1 ${
                isDarkMode 
                  ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200" 
                  : "border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden sm:inline">Telemetry</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[380px] sm:w-[440px] overflow-y-auto space-y-4">
            <SheetHeader>
              <SheetTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Flight Vehicle & Surface Dossier
              </SheetTitle>
              <SheetDescription className="text-xs">
                Real-time technical specifications for the active Artemis/CLPS payload.
              </SheetDescription>
            </SheetHeader>

            <Separator />

            {/* Vehicle Specifications */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-blue-500" />
                  {activeLander.name}
                </span>
                <span className="text-xs text-slate-500">{activeLander.contractor}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">Solar Array Peak</div>
                  <div className="font-bold text-slate-900 dark:text-white">{activeLander.solarArray.peakWatts} W</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">Battery Capacity</div>
                  <div className="font-bold text-slate-900 dark:text-white">{(activeLander.battery.capacityWh / 1000).toFixed(1)} kWh</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">Cryo Heater Draw</div>
                  <div className="font-bold text-slate-900 dark:text-white">{activeLander.battery.cryoHeaterWatts} W</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">RF Transceiver</div>
                  <div className="font-bold text-slate-900 dark:text-white">{activeLander.telecom.band} @ {activeLander.telecom.txPowerWatts}W</div>
                </div>
              </div>
            </div>

            {/* Site Topographic Altimetry */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-emerald-500" />
                  {activeSite.name}
                </span>
                <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                  {activeSite.elevationMeters}m LOLA
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeSite.description}
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeSite.latitude}°S, {activeSite.longitude}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Solar Illumination:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{activeSite.solarIlluminationPotential}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Earth Direct-to-Earth:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{activeSite.dteDirectToEarthStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Missions:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{activeSite.targetMissions.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* NASA DSN Ground Station Relays */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-2.5">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-500" />
                Deep Space Network (DSN) Relays
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="font-medium">DSS-14 Goldstone (USA)</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">ONLINE 34m/70m</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="font-medium">DSS-43 Canberra (Australia)</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">ONLINE 70m</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="font-medium">DSS-65 Madrid (Spain)</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">ONLINE 34m</Badge>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Dark/Light Mode Switcher */}
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleDarkMode}
          className={`h-7 px-2.5 border text-xs font-semibold ${
            isDarkMode 
              ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-300" 
              : "border-slate-300 bg-white hover:bg-slate-100 text-slate-800"
          }`}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5 mr-1" /> : <Moon className="w-3.5 h-3.5 mr-1" />}
          <span>{isDarkMode ? "Light" : "Dark"}</span>
        </Button>
      </div>
    </header>
  );
}
