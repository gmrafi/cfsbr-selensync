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
  Home, 
  Sparkles,
  Terminal
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
}: CockpitHudBarProps) {
  const days = Math.floor(timeOffsetHours / 24);
  const hours = Math.floor(timeOffsetHours % 24);
  const metString = `MET +${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h 00m 00s`;
  const utcFormatted = simulatedDate.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <header className="h-11 shrink-0 border-b border-zinc-800 bg-zinc-950/95 px-3 flex items-center justify-between text-xs select-none z-20">
      {/* Left: Mission ID & Payload Selector */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
          title="Return to Mission Overview (Landing Page)"
        >
          <Home className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-1.5 pr-2 border-r border-zinc-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-space-grotesk font-extrabold text-xs tracking-wider text-white">
            SelenSync <span className="text-[#4e6aff] font-mono text-[10px]">FLIGHT CONSOLE</span>
          </span>
        </div>

        <Badge variant="outline" className="hidden sm:inline-flex text-[9px] font-mono bg-emerald-950/60 text-emerald-400 border-emerald-500/40 py-0 px-1.5">
          TELEMETRY LOCK
        </Badge>

        {/* Payload Vehicle Selector */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
          <Rocket className="w-3 h-3 text-[#4e6aff]" />
          <select
            value={activeLander.id}
            onChange={(e) => onSelectLander(e.target.value)}
            className="bg-transparent font-mono font-bold text-zinc-100 focus:outline-none cursor-pointer text-[11px]"
          >
            {CLPS_LANDER_PROFILES.map((l) => (
              <option key={l.id} value={l.id} className="bg-zinc-900 text-white">
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Mission Clock (MET & UTC) */}
      <div className="hidden md:flex items-center gap-3 font-mono">
        <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800 text-[11px]">
          <Clock className="w-3 h-3 text-[#4e6aff]" />
          <span className="text-white font-bold">{metString}</span>
        </div>
        <div className="text-[11px] text-emerald-400 font-bold bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
          {utcFormatted}
        </div>
      </div>

      {/* Right: Landing Site & C&W Annunciator */}
      <div className="flex items-center gap-2">
        {/* Site Selector */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <select
            value={activeSite.id}
            onChange={(e) => onSelectSite(e.target.value)}
            className="bg-transparent font-mono font-bold text-zinc-100 focus:outline-none cursor-pointer text-[11px]"
          >
            {LUNAR_SOUTH_POLE_CANDIDATES.map((s) => (
              <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                {s.name.split("(")[0]} ({s.latitude}°S)
              </option>
            ))}
          </select>
        </div>

        {/* Master Caution & Warning Annunciator */}
        <div
          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border flex items-center gap-1 ${
            isSunInShadow || isEarthOccluded
              ? isEarthOccluded && isSunInShadow
                ? "bg-rose-950/80 text-rose-300 border-rose-500/50"
                : "bg-amber-950/80 text-amber-300 border-amber-500/50"
              : "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
          }`}
        >
          {isSunInShadow || isEarthOccluded ? (
            <AlertTriangle className="w-3 h-3 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3 h-3 shrink-0" />
          )}
          <span>
            {isSunInShadow && isEarthOccluded
              ? "BLACKOUT"
              : isSunInShadow
              ? "SHADOW"
              : isEarthOccluded
              ? "LOS BLOCKED"
              : "NOMINAL"}
          </span>
        </div>

        <Button
          size="sm"
          onClick={onExportJSON}
          className="h-6 px-2 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono"
        >
          <Download className="w-2.5 h-2.5 mr-1" />
          JSON
        </Button>
      </div>
    </header>
  );
}
