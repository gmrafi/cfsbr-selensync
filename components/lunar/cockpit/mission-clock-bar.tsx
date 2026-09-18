"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Rocket, 
  MapPin,
  Sun, 
  Globe, 
  Radio, 
  Download,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";
import { CLPS_LANDER_PROFILES, CLPSLanderProfile } from "@/lib/physics/lander-profiles";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";

interface MissionClockBarProps {
  simulatedDate: Date;
  timeOffsetHours: number;
  activeSite: LunarCandidateSite;
  activeLander: CLPSLanderProfile;
  onSelectSite: (siteId: string) => void;
  onSelectLander: (landerId: string) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  onResetTime: () => void;
  solarElevationDeg: number;
  earthElevationDeg: number;
  isSunInShadow: boolean;
  isEarthOccluded: boolean;
  onExportJSON: () => void;
}

export default function MissionClockBar({
  simulatedDate,
  timeOffsetHours,
  activeSite,
  activeLander,
  onSelectSite,
  onSelectLander,
  isAutoPlaying,
  onToggleAutoPlay,
  onResetTime,
  solarElevationDeg,
  earthElevationDeg,
  isSunInShadow,
  isEarthOccluded,
  onExportJSON,
}: MissionClockBarProps) {
  // Format MET: +DDd HHh MMm
  const days = Math.floor(timeOffsetHours / 24);
  const hours = Math.floor(timeOffsetHours % 24);
  const metString = `MET +${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h 00m`;

  const utcFormatted = simulatedDate.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <header className="bg-white border border-slate-300 rounded-xl p-2.5 sm:px-4 shadow-xs">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Left: Mission Brand, Clocks & Scrub Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Brand Badge */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4e6aff] animate-pulse"></span>
            <span className="font-space-grotesk font-extrabold text-sm text-slate-900 tracking-tight">
              SelenSync <span className="text-[#4e6aff] font-mono text-xs">OPS</span>
            </span>
          </div>

          {/* Mission Elapsed Time (MET) */}
          <div className="flex items-center gap-2 bg-slate-900 text-white px-2.5 py-1 rounded-md border border-slate-800 font-mono shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#4e6aff]" />
            <span className="text-xs font-bold tracking-wide">{metString}</span>
          </div>

          {/* UTC Ephemeris Clock */}
          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md font-mono text-xs text-slate-700">
            <span className="text-[10px] text-slate-400 mr-1.5 uppercase font-semibold">UTC</span>
            <span className="font-bold">{utcFormatted}</span>
          </div>

          {/* Play/Pause & Reset Buttons */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={isAutoPlaying ? "destructive" : "default"}
              onClick={onToggleAutoPlay}
              className={`h-7 px-2.5 text-[11px] font-semibold gap-1 ${
                !isAutoPlaying ? "bg-[#4e6aff] hover:bg-[#3d59ef] text-white" : ""
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isAutoPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onResetTime}
              className="h-7 px-2 text-[11px] border-slate-300 text-slate-700 hover:bg-slate-100"
              title="Reset Timeline to T+00h"
            >
              <RotateCcw className="w-3 h-3 mr-0.5 text-slate-500" />
              T+00h
            </Button>
          </div>
        </div>

        {/* Center/Right: Target Site & Vehicle Selectors */}
        <div className="flex items-center gap-2.5 flex-wrap xl:justify-end">
          {/* Target Site Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#4e6aff]" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Site:</span>
            <select
              value={activeSite.id}
              onChange={(e) => onSelectSite(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer text-xs"
            >
              {LUNAR_SOUTH_POLE_CANDIDATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name.split("(")[0]} ({s.latitude}°S)
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Profile Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs">
            <Rocket className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Lander:</span>
            <select
              value={activeLander.id}
              onChange={(e) => onSelectLander(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer text-xs"
            >
              {CLPS_LANDER_PROFILES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Master Caution & Warning (C&W) Annunciator Pill */}
          <div
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold border flex items-center gap-1.5 ${
              isSunInShadow || isEarthOccluded
                ? isEarthOccluded && isSunInShadow
                  ? "bg-rose-50 text-rose-700 border-rose-300"
                  : "bg-amber-50 text-amber-700 border-amber-300"
                : "bg-emerald-50 text-emerald-700 border-emerald-300"
            }`}
          >
            {isSunInShadow || isEarthOccluded ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>
              {isSunInShadow && isEarthOccluded
                ? "TOTAL BLACKOUT"
                : isSunInShadow
                ? "SHADOW OCCLUSION"
                : isEarthOccluded
                ? "DTE OCCLUDED"
                : "ALL SYSTEMS NOMINAL"}
            </span>
          </div>

          {/* Export Telemetry Button */}
          <Button
            size="sm"
            onClick={onExportJSON}
            className="h-7 px-2.5 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-semibold gap-1"
          >
            <Download className="w-3 h-3" />
            JSON
          </Button>
        </div>
      </div>
    </header>
  );
}
