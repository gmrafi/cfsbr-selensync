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
  Sun, 
  Globe, 
  Radio, 
  Layers
} from "lucide-react";
import { CLPS_LANDER_PROFILES, CLPSLanderProfile } from "@/lib/physics/lander-profiles";
import { LunarCandidateSite } from "@/lib/gis/lunar-sites";

interface MissionClockBarProps {
  simulatedDate: Date;
  timeOffsetHours: number;
  activeSite: LunarCandidateSite;
  activeLander: CLPSLanderProfile;
  onSelectLander: (landerId: string) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  onResetTime: () => void;
  solarElevationDeg: number;
  earthElevationDeg: number;
  isSunInShadow: boolean;
  isEarthOccluded: boolean;
}

export default function MissionClockBar({
  simulatedDate,
  timeOffsetHours,
  activeSite,
  activeLander,
  onSelectLander,
  isAutoPlaying,
  onToggleAutoPlay,
  onResetTime,
  solarElevationDeg,
  earthElevationDeg,
  isSunInShadow,
  isEarthOccluded,
}: MissionClockBarProps) {
  // Format MET: +DDd HHh MMm
  const days = Math.floor(timeOffsetHours / 24);
  const hours = Math.floor(timeOffsetHours % 24);
  const metString = `MET +${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h 00m`;

  const utcFormatted = simulatedDate.toUTCString().replace("GMT", "UTC");

  return (
    <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Mission Clocks & MET */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Mission Elapsed Time */}
          <div className="flex items-center gap-2.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-800 shadow-xs">
            <Clock className="w-4 h-4 text-[#4e6aff] animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Mission Clock</div>
              <div className="font-mono text-xs font-bold text-white tracking-wide">{metString}</div>
            </div>
          </div>

          {/* UTC Ephemeris Time */}
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Simulated Ephemeris (UTC)</div>
            <div className="font-mono text-xs font-bold text-slate-800">{utcFormatted}</div>
          </div>

          {/* Time Controls */}
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={isAutoPlaying ? "destructive" : "default"}
              onClick={onToggleAutoPlay}
              className={`h-8 px-2.5 text-xs font-semibold gap-1.5 shadow-xs ${
                !isAutoPlaying ? "bg-[#4e6aff] hover:bg-[#3d59ef] text-white" : ""
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAutoPlaying ? "Pause Time" : "Advance Time"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onResetTime}
              className="h-8 px-2 text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
              title="Reset to Mission Start (T+00h)"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-500" />
              T+00h
            </Button>
          </div>
        </div>

        {/* Right: Vehicle Architecture Selector & Status Vector */}
        <div className="flex items-center gap-3 flex-wrap lg:justify-end">
          {/* Lander Preset Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <Rocket className="w-4 h-4 text-[#4e6aff]" />
            <div className="text-left">
              <span className="text-[9px] uppercase font-bold text-slate-500 block leading-tight">CLPS Vehicle</span>
              <select
                value={activeLander.id}
                onChange={(e) => onSelectLander(e.target.value)}
                className="text-xs font-bold bg-transparent text-slate-900 focus:outline-none cursor-pointer"
              >
                {CLPS_LANDER_PROFILES.map((lander) => (
                  <option key={lander.id} value={lander.id}>
                    {lander.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Solar Status Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs">
            <Sun className={`w-4 h-4 ${isSunInShadow ? "text-amber-500" : "text-emerald-500"}`} />
            <div>
              <span className="text-[10px] text-slate-500 block leading-tight">Solar El: {solarElevationDeg.toFixed(2)}°</span>
              <span className={`text-[11px] font-bold ${isSunInShadow ? "text-amber-600" : "text-emerald-700"}`}>
                {isSunInShadow ? "SHADOW" : "ILLUMINATED"}
              </span>
            </div>
          </div>

          {/* DTE Status Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs">
            <Globe className={`w-4 h-4 ${isEarthOccluded ? "text-rose-500" : "text-emerald-500"}`} />
            <div>
              <span className="text-[10px] text-slate-500 block leading-tight">Earth El: {earthElevationDeg.toFixed(2)}°</span>
              <span className={`text-[11px] font-bold ${isEarthOccluded ? "text-rose-600" : "text-emerald-700"}`}>
                {isEarthOccluded ? "LOS OCCLUDED" : "DTE OPEN"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
