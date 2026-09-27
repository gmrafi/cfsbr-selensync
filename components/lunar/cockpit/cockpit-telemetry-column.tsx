"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Sun, 
  Globe, 
  Radio, 
  Zap, 
  ThermometerSnowflake, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Activity,
  ArrowRight,
  ChevronDown,
  Info,
  BookOpen
} from "lucide-react";
import { LunarLibrationData } from "@/lib/celestial/lunar-libration";
import { DivinerThermalStatus } from "@/lib/physics/diviner-thermal";
import { DSNNetworkStatus } from "@/lib/physics/dsn-stations";
import { SolarPowerOutput } from "@/lib/physics/solar-power";
import { RFLinkBudgetResult } from "@/lib/physics/rf-link";
import { CLPSLanderProfile } from "@/lib/physics/lander-profiles";

interface CockpitTelemetryColumnProps {
  lander: CLPSLanderProfile;
  solarData: {
    elevationDeg: number;
    azimuthDeg: number;
    isOccluded: boolean;
    output: SolarPowerOutput;
  };
  dteData: {
    elevationDeg: number;
    azimuthDeg: number;
    isOccluded: boolean;
    rfOutput: RFLinkBudgetResult;
    libration: LunarLibrationData;
    dsn: DSNNetworkStatus;
  };
  thermalData: DivinerThermalStatus;
  batterySoCPercent: number;
  isDarkMode?: boolean;
  onOpenGlossary?: () => void;
}

export default function CockpitTelemetryColumn({
  lander,
  solarData,
  dteData,
  thermalData,
  batterySoCPercent,
  isDarkMode = false,
  onOpenGlossary,
}: CockpitTelemetryColumnProps) {
  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-300 text-slate-900 shadow-xs";
  const innerBoxBg = isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200";
  const subLabelColor = isDarkMode ? "text-slate-400" : "text-slate-600";

  return (
    <div className="h-full flex flex-col gap-2.5 overflow-y-auto pr-0.5 select-none">
      {/* 1. SOLAR ILLUMINATION HUD CARD (Top 3 numbers visible, deep specs in collapsible) */}
      <div className={`${cardBg} border rounded-xl p-3 space-y-2`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="tracking-tight uppercase">Solar Flux &amp; Power</span>
            <button
              onClick={onOpenGlossary}
              title="Click to open Aerospace Glossary &amp; Field Guide for Solar Physics"
              className="cursor-pointer text-slate-400 hover:text-[#4e6aff] transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-semibold px-2 py-0.5 ${
              solarData.isOccluded
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-emerald-100 text-emerald-900 border-emerald-300"
            }`}
          >
            {solarData.isOccluded ? "Crater Shadow" : "Illuminated"}
          </Badge>
        </div>

        {/* Top-Level Key Numbers (3 metrics: Elevation, Net Watts, Status) */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Sun Elevation</span>
            <span className={`text-lg font-bold ${solarData.elevationDeg > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {solarData.elevationDeg > 0 ? `+${solarData.elevationDeg.toFixed(2)}°` : `${solarData.elevationDeg.toFixed(2)}°`}
            </span>
            <span className={`text-[10px] ${subLabelColor} block font-sans`}>
              {solarData.elevationDeg > 0 ? "Above Horizon" : "Below Horizon"}
            </span>
          </div>

          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Array Output</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {solarData.output.netOutputWatts.toFixed(0)} <span className="text-xs font-normal text-slate-500">Watts</span>
            </span>
            <span className={`text-[10px] ${subLabelColor} block font-sans`}>
              {solarData.output.netOutputWatts > 50 ? "Generating" : "Low Power"}
            </span>
          </div>
        </div>

        {/* Layer 2: Collapsible Technical Parameters (Default Collapsed) */}
        <details className="group border-t border-slate-200 dark:border-slate-800 pt-1.5">
          <summary className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer list-none py-0.5">
            <span className="flex items-center gap-1">
              <span>Technical Parameters</span>
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1 rounded text-slate-500">Flux, Azimuth, GaAs</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <div className={`${innerBoxBg} p-2 rounded-lg border space-y-1 text-xs mt-1.5 font-mono text-[11px]`}>
            <div className="flex justify-between">
              <span className={subLabelColor}>Solar Azimuth (α):</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{solarData.azimuthDeg.toFixed(1)}°</span>
            </div>
            <div className="flex justify-between">
              <span className={subLabelColor}>AM0 Space Solar Flux:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{solarData.output.solarFluxWm2} W/m²</span>
            </div>
            <div className="flex justify-between">
              <span className={subLabelColor}>Lander Solar Array:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{lander.solarArray.areaM2} m² (GaAs 30%)</span>
            </div>
            <div className="flex justify-between">
              <span className={subLabelColor}>Regolith Dust Factor:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">0.95 (5% loss)</span>
            </div>
          </div>
        </details>
      </div>

      {/* 2. DTE LINK & LUNAR LIBRATION HUD CARD */}
      <div className={`${cardBg} border rounded-xl p-3 space-y-2`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Radio className="w-4 h-4 text-[#4e6aff]" />
            <span className="tracking-tight uppercase">DTE Link &amp; Libration</span>
            <button
              onClick={onOpenGlossary}
              title="Click to open Aerospace Glossary &amp; Field Guide for DTE Communications"
              className="cursor-pointer text-slate-400 hover:text-[#4e6aff] transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-semibold px-2 py-0.5 ${
              dteData.isOccluded
                ? "bg-rose-100 text-rose-900 border-rose-300"
                : "bg-cyan-100 text-cyan-900 border-cyan-300"
            }`}
          >
            {dteData.isOccluded ? "LOS Occluded" : "DTE Locked"}
          </Badge>
        </div>

        {/* Top-Level Key Numbers (3 metrics: Earth Elev, Link Margin dB, Status) */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Earth Elevation</span>
            <span className={`text-lg font-bold ${dteData.elevationDeg > 0 ? "text-cyan-600 dark:text-cyan-400" : "text-rose-600 dark:text-rose-400"}`}>
              {dteData.elevationDeg > 0 ? `+${dteData.elevationDeg.toFixed(2)}°` : `${dteData.elevationDeg.toFixed(2)}°`}
            </span>
            <span className={`text-[10px] ${subLabelColor} block font-sans`}>
              {dteData.elevationDeg > 0 ? "Line of Sight" : "Occluded"}
            </span>
          </div>

          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>DSN Link Margin</span>
            <span className={`text-lg font-bold ${dteData.rfOutput.isLinkClosed && !dteData.isOccluded ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {dteData.isOccluded ? "0.0 dB" : `+${dteData.rfOutput.linkMarginDb.toFixed(1)} dB`}
            </span>
            <span className={`text-[10px] ${subLabelColor} block font-sans`}>
              {dteData.rfOutput.isLinkClosed && !dteData.isOccluded ? "Link Margin Closed" : "Link Degraded"}
            </span>
          </div>
        </div>

        {/* Layer 2: Collapsible Deep Space RF Parameters (Default Collapsed) */}
        <details className="group border-t border-slate-200 dark:border-slate-800 pt-1.5">
          <summary className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer list-none py-0.5">
            <span className="flex items-center gap-1">
              <span>Deep Space RF Parameters</span>
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1 rounded text-slate-500">FSPL, Libration, DSN</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <div className={`${innerBoxBg} p-2 rounded-lg border space-y-1 text-xs mt-1.5 font-mono text-[11px]`}>
            <div className="flex justify-between">
              <span className={subLabelColor}>Free-Space Path Loss (FSPL):</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {dteData.rfOutput.freeSpacePathLossDb > 0 ? `${dteData.rfOutput.freeSpacePathLossDb.toFixed(1)} dB` : "222.7 dB"} (8.45 GHz)
              </span>
            </div>
            <div className="flex justify-between">
              <span className={subLabelColor}>Lunar Libration (Δλ, Δβ):</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                {dteData.libration.longitudeLibrationDeg > 0 ? `+${dteData.libration.longitudeLibrationDeg}°` : `${dteData.libration.longitudeLibrationDeg}°`},{" "}
                {dteData.libration.latitudeLibrationDeg > 0 ? `+${dteData.libration.latitudeLibrationDeg}°` : `${dteData.libration.latitudeLibrationDeg}°`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={subLabelColor}>Active Ground Station:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {dteData.dsn.activeStation.name.split(" ")[0]} ({dteData.dsn.activeStation.primaryAntenna.split(" ")[0]})
              </span>
            </div>
            <div className="flex justify-between">
              <span className={subLabelColor}>Next DSN Handover:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {dteData.dsn.nextStation.name.split(" ")[0]} in {dteData.dsn.handoverCountdownHours}h
              </span>
            </div>
          </div>
        </details>
      </div>

      {/* 3. DIVINER CRYOGENIC THERMAL & LANDER HEALTH */}
      <div className={`${cardBg} border rounded-xl p-3 space-y-2`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
            <span className="tracking-tight uppercase">Diviner Thermal &amp; Health</span>
            <button
              onClick={onOpenGlossary}
              title="Click to open Aerospace Glossary &amp; Field Guide for Cryogenic Regolith Physics"
              className="cursor-pointer text-slate-400 hover:text-[#4e6aff] transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-semibold px-2 py-0.5 ${
              thermalData.thermalState === "CRYOGENIC_DANGER"
                ? "bg-rose-100 text-rose-900 border-rose-300"
                : thermalData.thermalState === "HEATER_ACTIVE"
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-emerald-100 text-emerald-900 border-emerald-300"
            }`}
          >
            {thermalData.thermalState === "CRYOGENIC_DANGER" ? "Cryo Danger" : thermalData.thermalState}
          </Badge>
        </div>

        {/* Top-Level Key Numbers (3 metrics: Surface Temp, Battery SoC, Slope Safety) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Surface Temperature */}
          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Diviner Surface Temp</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {thermalData.regolithTempKelvin} <span className="text-xs font-normal text-slate-500">K</span>
            </span>
            <span className={`text-[10px] ${subLabelColor} block font-sans`}>({thermalData.regolithTempCelsius}°C)</span>
          </div>

          {/* Battery SoC & Survival */}
          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Battery Charge (SoC)</span>
            <span className={`text-lg font-bold ${batterySoCPercent > 35 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {batterySoCPercent.toFixed(0)}%
            </span>
            <span className={`text-[10px] ${subLabelColor} block font-sans`}>
              {batterySoCPercent > 50 ? "Healthy Storage" : "Drawdown Active"}
            </span>
          </div>
        </div>

        {/* Layer 2: Collapsible Slope & Cryo Hazard Parameters (Default Collapsed) */}
        <details className="group border-t border-slate-200 dark:border-slate-800 pt-1.5">
          <summary className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer list-none py-0.5">
            <span className="flex items-center gap-1">
              <span>Topographic Slope &amp; Cryo Hazards</span>
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1 rounded text-slate-500">LOLA Slope, Heaters</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <div className={`${innerBoxBg} p-2 rounded-lg border space-y-1 text-xs mt-1.5 font-mono text-[11px]`}>
            <div className="flex justify-between items-center font-medium">
              <span className={subLabelColor}>LOLA Surface Slope:</span>
              <span className={`font-bold ${thermalData.isSlopeSafe ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {thermalData.slopeHazardDegrees}° (Limit: 10.0°)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${thermalData.isSlopeSafe ? "bg-emerald-500" : "bg-rose-500"}`}
                style={{ width: `${Math.min(100, (thermalData.slopeHazardDegrees / 10.0) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] pt-0.5">
              <span className={subLabelColor}>Tip-Over Risk: {thermalData.tipOverRiskPercent}%</span>
              <span className={subLabelColor}>Cryo Heaters: {thermalData.cryoHeaterDrawWatts}W</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className={subLabelColor}>Estimated Time to Freeze:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {thermalData.timeToFreezeHours > 200 ? "Safe (Continuous Solar)" : `${thermalData.timeToFreezeHours} hours`}
              </span>
            </div>
          </div>
        </details>
      </div>

      {/* Attribution & Provenance Micro-Bar */}
      <div className="text-[10px] text-slate-400 dark:text-slate-500 px-1 flex items-center justify-between font-mono">
        <span title="Planetary Ephemeris DE440, LOLA Altimetry 30m DEM, Diviner DLRE">
          JPL DE440 &bull; LOLA &bull; DLRE
        </span>
        {onOpenGlossary && (
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1 text-[10px] font-sans font-semibold text-[#4e6aff] hover:underline cursor-pointer"
          >
            <BookOpen className="w-3 h-3" />
            Field Guide
          </button>
        )}
      </div>
    </div>
  );
}
