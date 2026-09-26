"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sun,
  Moon,
  Home,
  Compass,
  Calendar,
  ChevronDown
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
  const [showEpochInput, setShowEpochInput] = useState(false);

  const days = Math.floor(timeOffsetHours / 24);
  const hours = Math.floor(timeOffsetHours % 24);
  const metString = `+${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h 00m`;
  
  // Format UTC safely and cleanly: YYYY-MM-DD HH:mm UTC
  const year = simulatedDate.getUTCFullYear();
  const month = String(simulatedDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(simulatedDate.getUTCDate()).padStart(2, "0");
  const hh = String(simulatedDate.getUTCHours()).padStart(2, "0");
  const mm = String(simulatedDate.getUTCMinutes()).padStart(2, "0");
  const utcString = `${year}-${month}-${day} ${hh}:${mm} UTC`;

  return (
    <header className={`h-12 shrink-0 border-b px-3 flex items-center justify-between text-xs select-none z-30 transition-colors whitespace-nowrap overflow-x-auto no-scrollbar ${
      isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-xs"
    }`}>
      {/* ========================================================================= */}
      {/* 1. LEFT ZONE: Brand & Navigation                                          */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
            isDarkMode 
              ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
          }`}
          title="Back to Mission Portal"
        >
          <Home className="w-3.5 h-3.5 text-[#4e6aff]" />
          <span>Home</span>
        </Link>

        <Link
          href="/dashboard/map"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
            isDarkMode 
              ? "bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border-cyan-800/60" 
              : "bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200"
          }`}
          title="Open Lunar South Pole GIS Map"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-500" />
          <span className="hidden sm:inline">GIS Map</span>
        </Link>

        {/* Brand Capsule */}
        <div className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 border-l border-slate-200 dark:border-slate-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold text-xs tracking-tight text-slate-900 dark:text-white">
            SelenSync
          </span>
          <Badge variant="outline" className="text-[9px] font-mono font-bold px-1.5 py-0 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            OPS CONSOLE
          </Badge>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CENTER ZONE: Precision Flight Clocks (Unbreakable Aerospace Capsule)   */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 shrink-0 px-2">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border font-mono text-xs shadow-xs ${
          isDarkMode ? "bg-slate-900/90 border-slate-800 text-slate-200" : "bg-slate-100/90 border-slate-300 text-slate-800"
        }`}>
          {/* Mission Elapsed Time (MET) */}
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5 text-[#4e6aff] shrink-0" />
            <span className="text-[10px] text-slate-500 font-sans font-medium uppercase">MET</span>
            <span className="text-slate-900 dark:text-white tabular-nums tracking-tight">
              {metString}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700 font-sans font-light">|</span>

          {/* Synchronized UTC Timestamp */}
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums tracking-tight">
              {utcString}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700 font-sans font-light">|</span>

          {/* Solstice Epoch Trigger */}
          <div className="relative flex items-center">
            {!showEpochInput ? (
              <button
                onClick={() => setShowEpochInput(true)}
                className="flex items-center gap-1 text-[11px] font-sans font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                title="Click to edit mission baseline epoch"
              >
                <Calendar className="w-3 h-3 text-amber-500" />
                <span>Solstice '26</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-white dark:bg-slate-950 px-1 py-0.5 rounded border border-amber-400">
                <input
                  type="date"
                  autoFocus
                  defaultValue={baseDate.toISOString().slice(0, 10)}
                  onChange={(e) => {
                    if (e.target.value) {
                      onChangeBaseDate(new Date(e.target.value + "T00:00:00Z"));
                      setShowEpochInput(false);
                    }
                  }}
                  onBlur={() => setShowEpochInput(false)}
                  className="bg-transparent font-mono text-[10px] text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT ZONE: Vehicle, Site, Master C&W, and Theme Toggle                */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Lander Profile Selector */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <Rocket className="w-3.5 h-3.5 text-[#4e6aff] shrink-0" />
          <span className="text-slate-500 font-medium text-[10px] hidden md:inline">Lander:</span>
          <select
            value={activeLander.id}
            onChange={(e) => onSelectLander(e.target.value)}
            className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs max-w-[110px] sm:max-w-[140px] truncate"
          >
            {CLPS_LANDER_PROFILES.map((l) => (
              <option key={l.id} value={l.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lunar Site Selector */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-slate-500 font-medium text-[10px] hidden md:inline">Site:</span>
          <select
            value={activeSite.id}
            onChange={(e) => onSelectSite(e.target.value)}
            className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs max-w-[120px] sm:max-w-[160px] truncate"
          >
            {LUNAR_SOUTH_POLE_CANDIDATES.map((s) => (
              <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {s.name.split("(")[0].trim()} ({s.latitude}°S)
              </option>
            ))}
          </select>
        </div>

        {/* Master Caution & Warning (C&W) Status Pill */}
        <div
          className={`px-2.5 py-1 rounded-md font-sans text-xs font-bold border flex items-center gap-1.5 tracking-wide ${
            isSunInShadow || isEarthOccluded
              ? isEarthOccluded && isSunInShadow
                ? "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800"
                : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800"
              : "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800"
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

        {/* High-Contrast Light / Dark Mode Toggle */}
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleDarkMode}
          className={`h-7 w-7 p-0 rounded-md border text-xs shrink-0 ${
            isDarkMode 
              ? "border-slate-800 bg-slate-900 hover:bg-slate-800 text-amber-400" 
              : "border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
          }`}
          title={isDarkMode ? "Switch to High-Contrast Light HUD" : "Switch to Deep-Space Dark HUD"}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </header>
  );
}
