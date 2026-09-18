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
  Download, 
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
  Calendar
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
  onExportJSON: () => void;
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
  onExportJSON,
  isDarkMode,
  onToggleDarkMode,
}: CockpitHudBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const days = Math.floor(timeOffsetHours / 24);
  const hours = Math.floor(timeOffsetHours % 24);
  const metString = `MET +${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h 00m 00s`;
  const utcFormatted = simulatedDate.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <header className={`h-12 shrink-0 border-b px-3 sm:px-4 flex items-center justify-between text-xs select-none z-20 transition-colors ${
      isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-300 text-slate-900 shadow-xs"
    }`}>
      {/* Left: Home Navigation, Mission Title & Lander Selector */}
      <div className="flex items-center gap-3">
        {/* Clear Return to Home Button with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                isDarkMode 
                  ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700 shadow-xs" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 shadow-2xs"
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#4e6aff]" />
              <span>← Home</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">Return to Mission Overview Landing Page</TooltipContent>
        </Tooltip>

        {/* Mission Brand Title */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200 dark:border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-sans font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            SelenSync <span className="text-[#4e6aff] font-mono text-xs font-bold">MISSION CONTROL</span>
          </span>
        </div>

        {/* Payload Vehicle Selector with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-300"
            }`}>
              <Rocket className="w-3.5 h-3.5 text-[#4e6aff]" />
              <span className="text-slate-500 font-semibold text-[11px]">Vehicle:</span>
              <select
                value={activeLander.id}
                onChange={(e) => onSelectLander(e.target.value)}
                className="bg-transparent font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs"
              >
                {CLPS_LANDER_PROFILES.map((l) => (
                  <option key={l.id} value={l.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Commercial Lunar Payload Services (CLPS) Vehicle Profile</TooltipContent>
        </Tooltip>
      </div>

      {/* Center: Mission Clocks & Epoch Date Picker (Clear, Legible, High-Contrast) */}
      <div className="hidden md:flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium cursor-pointer ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-300"
            }`}>
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-slate-500 font-semibold text-[11px]">Epoch:</span>
              <input
                type="date"
                value={baseDate.toISOString().slice(0, 10)}
                onChange={(e) => {
                  if (e.target.value) {
                    onChangeBaseDate(new Date(e.target.value + "T00:00:00Z"));
                  }
                }}
                className="bg-transparent font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Change Mission Epoch Date (Compare solar elevation &amp; DTE across seasons)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border font-mono text-xs cursor-help ${
              isDarkMode ? "bg-slate-800/90 border-slate-700 text-white" : "bg-slate-900 text-white border-slate-800 shadow-xs"
            }`}>
              <Clock className="w-3.5 h-3.5 text-[#4e6aff]" />
              <span className="font-bold tracking-wide">{metString}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Mission Elapsed Time (MET) from T-0 Touchdown</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`px-2.5 py-1 rounded-md border font-mono text-xs font-bold cursor-help ${
              isDarkMode ? "bg-slate-800/90 border-slate-700 text-emerald-400" : "bg-slate-100 border-slate-300 text-emerald-700"
            }`}>
              {utcFormatted}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Simulated Topocentric Coordinated Universal Time (UTC)</TooltipContent>
        </Tooltip>
      </div>

      {/* Right: Site Selector, C&W Status, Telemetry Sheet Drawer, Dark/Light Toggle, Export */}
      <div className="flex items-center gap-2">
        {/* Site Selector */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-300"
            }`}>
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-slate-500 font-semibold text-[11px]">Site:</span>
              <select
                value={activeSite.id}
                onChange={(e) => onSelectSite(e.target.value)}
                className="bg-transparent font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs"
              >
                {LUNAR_SOUTH_POLE_CANDIDATES.map((s) => (
                  <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {s.name.split("(")[0]} ({s.latitude}°S)
                  </option>
                ))}
              </select>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Artemis III Candidate Landing Zone</TooltipContent>
        </Tooltip>

        {/* Master Caution & Warning Annunciator with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold border flex items-center gap-1.5 cursor-help ${
                isSunInShadow || isEarthOccluded
                  ? isEarthOccluded && isSunInShadow
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-emerald-100 text-emerald-800 border-emerald-300"
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
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isSunInShadow && isEarthOccluded 
              ? "Critical: Both Solar Power and Direct-to-Earth link are occluded by topography!"
              : isSunInShadow
              ? "Warning: Solar panels masked by crater rim obstacle relief"
              : isEarthOccluded
              ? "Warning: Line-of-sight to Earth occluded; DTE comms down"
              : "All primary telemetry channels nominal and line-of-sight cleared"}
          </TooltipContent>
        </Tooltip>

        {/* Tactical Telemetry Sheet Trigger */}
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
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#4e6aff]" />
              <span className="hidden sm:inline">Telemetry Specs</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6 space-y-6">
            <SheetHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#4e6aff] text-white text-[10px]">AEROSPACE SPECS</Badge>
                <Badge variant="outline" className="text-[10px] font-mono">{activeLander.id.toUpperCase()}</Badge>
              </div>
              <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Engineering Telemetry Inspector
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-500 dark:text-slate-400">
                Detailed avionics, thermal, radio frequency link, and topographic horizon parameters.
              </SheetDescription>
            </SheetHeader>

            {/* Vehicle Architecture Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-[#4e6aff]" />
                  {activeLander.name}
                </span>
                <span className="text-xs text-slate-500 font-mono">{activeLander.contractor}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">Solar Array Peak</div>
                  <div className="font-bold font-mono text-slate-900 dark:text-white">{activeLander.solarArray.peakWatts} W</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">Battery Capacity</div>
                  <div className="font-bold font-mono text-slate-900 dark:text-white">{(activeLander.battery.capacityWh / 1000).toFixed(1)} kWh</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">Cryo Heater Draw</div>
                  <div className="font-bold font-mono text-slate-900 dark:text-white">{activeLander.battery.cryoHeaterWatts} W</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">RF Transceiver</div>
                  <div className="font-bold font-mono text-slate-900 dark:text-white">{activeLander.telecom.band} @ {activeLander.telecom.txPowerWatts}W</div>
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
                <span className="text-xs text-slate-500 font-mono">{activeSite.elevationMeters}m Elev</span>
              </div>
              <Separator />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Topocentric Coordinates:</span>
                  <span className="font-mono font-bold">{activeSite.latitude}°S, {activeSite.longitude}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sub-Solar Potential:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeSite.solarIlluminationPotential}</span>
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

            {/* Quick Export CTA */}
            <Button
              onClick={onExportJSON}
              className="w-full bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-semibold text-xs py-2"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Full Topographic Telemetry JSON
            </Button>
          </SheetContent>
        </Sheet>

        {/* Dark/Light Mode Switcher with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={onToggleDarkMode}
              className={`h-7 px-2 border text-xs font-medium ${
                isDarkMode 
                  ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-300" 
                  : "border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
              }`}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 mr-1" /> : <Moon className="w-3.5 h-3.5 mr-1" />}
              {isDarkMode ? "Light" : "Dark"}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Toggle High-Contrast White / Dark Mode</TooltipContent>
        </Tooltip>

        {/* Export JSON with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={onExportJSON}
              className="h-7 px-2.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold gap-1 shadow-xs"
            >
              <Download className="w-3 h-3" />
              JSON
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Export Instant Telemetry Snapshot (JSON)</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
