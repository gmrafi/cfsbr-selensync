"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  MapPin, 
  Clock, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Sun,
  Moon,
  Home
} from "lucide-react";
import Link from "next/link";
import { CLPS_LANDER_PROFILES, CLPSLanderProfile } from "@/lib/physics/lander-profiles";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";

interface CockpitHudBarProps {
  simulatedDate: Date;
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
        {/* Clear Return to Home Button */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            isDarkMode 
              ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700 shadow-xs" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 shadow-2xs"
          }`}
          title="Return to Home Overview"
        >
          <Home className="w-3.5 h-3.5 text-[#4e6aff]" />
          <span>← Home</span>
        </Link>

        {/* Mission Brand Title */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200 dark:border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-sans font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            SelenSync <span className="text-[#4e6aff] font-mono text-xs font-bold">MISSION CONTROL</span>
          </span>
        </div>

        {/* Payload Vehicle Selector */}
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
      </div>

      {/* Center: Mission Clocks (Clear, Legible, High-Contrast) */}
      <div className="hidden md:flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-md border font-mono text-xs ${
          isDarkMode ? "bg-slate-800/90 border-slate-700 text-white" : "bg-slate-900 text-white border-slate-800 shadow-xs"
        }`}>
          <Clock className="w-3.5 h-3.5 text-[#4e6aff]" />
          <span className="font-bold tracking-wide">{metString}</span>
        </div>
        <div className={`px-2.5 py-1 rounded-md border font-mono text-xs font-bold ${
          isDarkMode ? "bg-slate-800/90 border-slate-700 text-emerald-400" : "bg-slate-100 border-slate-300 text-emerald-700"
        }`}>
          {utcFormatted}
        </div>
      </div>

      {/* Right: Site Selector, C&W Status, Dark/Light Toggle, Export */}
      <div className="flex items-center gap-2.5">
        {/* Site Selector */}
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

        {/* Master Caution & Warning Annunciator */}
        <div
          className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold border flex items-center gap-1.5 ${
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

        {/* Dark/Light Mode Switcher */}
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleDarkMode}
          className={`h-7 px-2 border text-xs font-medium ${
            isDarkMode 
              ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-300" 
              : "border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
          }`}
          title={isDarkMode ? "Switch to High-Contrast Light Mode" : "Switch to Slate Night Mode"}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5 mr-1" /> : <Moon className="w-3.5 h-3.5 mr-1" />}
          {isDarkMode ? "Light" : "Dark"}
        </Button>

        {/* Export JSON */}
        <Button
          size="sm"
          onClick={onExportJSON}
          className="h-7 px-2.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold gap-1 shadow-xs"
        >
          <Download className="w-3 h-3" />
          JSON
        </Button>
      </div>
    </header>
  );
}
