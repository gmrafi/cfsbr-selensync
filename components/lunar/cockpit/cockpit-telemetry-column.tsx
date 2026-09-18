"use client";

import React from "react";
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
  ArrowRight
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
}

export default function CockpitTelemetryColumn({
  lander,
  solarData,
  dteData,
  thermalData,
  batterySoCPercent,
  isDarkMode = false,
}: CockpitTelemetryColumnProps) {
  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-300 text-slate-900 shadow-xs";
  const innerBoxBg = isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200";
  const subLabelColor = isDarkMode ? "text-slate-400" : "text-slate-600";

  return (
    <div className="h-full flex flex-col gap-2.5 overflow-y-auto pr-0.5 select-none">
      {/* 1. SOLAR ILLUMINATION HUD CARD */}
      <div className={`${cardBg} border rounded-xl p-3 space-y-2`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="tracking-tight uppercase">Solar Flux &amp; Power</span>
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

        <div className="grid grid-cols-2 gap-2">
          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Sun Elevation</span>
            <span className={`text-lg font-bold ${solarData.elevationDeg > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {solarData.elevationDeg > 0 ? `+${solarData.elevationDeg.toFixed(2)}°` : `${solarData.elevationDeg.toFixed(2)}°`}
            </span>
            <span className={`text-[11px] ${subLabelColor} block font-sans`}>Azimuth: {solarData.azimuthDeg.toFixed(1)}°</span>
          </div>

          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Array Output</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {solarData.output.netOutputWatts.toFixed(0)} <span className="text-xs font-normal text-slate-500">Watts</span>
            </span>
            <span className={`text-[11px] ${subLabelColor} block font-sans`}>Flux: {solarData.output.solarFluxWm2} W/m²</span>
          </div>
        </div>

        <div className={`flex justify-between items-center text-xs ${subLabelColor} pt-1`}>
          <span>Solar Array: {lander.solarArray.areaM2}m²</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">GaAs 30% Efficiency</span>
        </div>
      </div>

      {/* 2. DTE LINK & LUNAR LIBRATION HUD CARD */}
      <div className={`${cardBg} border rounded-xl p-3 space-y-2`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Radio className="w-4 h-4 text-[#4e6aff]" />
            <span className="tracking-tight uppercase">DTE Link &amp; Libration</span>
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

        <div className="grid grid-cols-2 gap-2">
          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Earth Elevation</span>
            <span className={`text-lg font-bold ${dteData.elevationDeg > 0 ? "text-cyan-600 dark:text-cyan-400" : "text-rose-600 dark:text-rose-400"}`}>
              {dteData.elevationDeg > 0 ? `+${dteData.elevationDeg.toFixed(2)}°` : `${dteData.elevationDeg.toFixed(2)}°`}
            </span>
            <span className={`text-[11px] ${subLabelColor} block font-sans`}>Azimuth: {dteData.azimuthDeg.toFixed(1)}°</span>
          </div>

          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>DSN 34m Link Margin</span>
            <span className={`text-lg font-bold ${dteData.rfOutput.isLinkClosed && !dteData.isOccluded ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {dteData.isOccluded ? "0.0 dB" : `+${dteData.rfOutput.linkMarginDb.toFixed(1)} dB`}
            </span>
            <span className={`text-[11px] ${subLabelColor} block font-sans`}>FSPL: ~216.5 dB</span>
          </div>
        </div>

        {/* Lunar Libration & DSN Station Readout */}
        <div className={`${innerBoxBg} p-2 rounded-lg border space-y-1 text-xs`}>
          <div className="flex justify-between font-medium">
            <span className={subLabelColor}>Lunar Libration (Δλ, Δβ):</span>
            <span className="font-mono font-bold text-slate-800 dark:text-cyan-300">
              {dteData.libration.longitudeLibrationDeg > 0 ? `+${dteData.libration.longitudeLibrationDeg}°` : `${dteData.libration.longitudeLibrationDeg}°`},{" "}
              {dteData.libration.latitudeLibrationDeg > 0 ? `+${dteData.libration.latitudeLibrationDeg}°` : `${dteData.libration.latitudeLibrationDeg}°`}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span className={subLabelColor}>Active Station:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {dteData.dsn.activeStation.name.split(" ")[0]} ({dteData.dsn.activeStation.primaryAntenna.split(" ")[0]})
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span className={subLabelColor}>Next DSN Handover:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {dteData.dsn.nextStation.name.split(" ")[0]} in {dteData.dsn.handoverCountdownHours}h
            </span>
          </div>
        </div>
      </div>

      {/* 3. DIVINER CRYOGENIC THERMAL & LANDER HEALTH */}
      <div className={`${cardBg} border rounded-xl p-3 space-y-2`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
            <span className="tracking-tight uppercase">Diviner Thermal &amp; Health</span>
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

        <div className="grid grid-cols-2 gap-2">
          {/* Surface Temperature */}
          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Diviner Surface Temp</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {thermalData.regolithTempKelvin} <span className="text-xs font-normal text-slate-500">K</span>
            </span>
            <span className={`text-[11px] ${subLabelColor} block font-sans`}>({thermalData.regolithTempCelsius}°C)</span>
          </div>

          {/* Battery SoC & Survival */}
          <div className={`${innerBoxBg} p-2 rounded-lg border font-mono`}>
            <span className={`text-xs ${subLabelColor} block font-sans font-medium`}>Battery Charge (SoC)</span>
            <span className={`text-lg font-bold ${batterySoCPercent > 35 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {batterySoCPercent.toFixed(0)}%
            </span>
            <span className={`text-[11px] ${subLabelColor} block font-sans`}>
              Time to Freeze: {thermalData.timeToFreezeHours > 200 ? "Safe" : `${thermalData.timeToFreezeHours}h`}
            </span>
          </div>
        </div>

        {/* Slope Tip-Over Risk Assessment */}
        <div className={`${innerBoxBg} p-2 rounded-lg border space-y-1 text-xs`}>
          <div className="flex justify-between items-center font-medium">
            <span className={subLabelColor}>LOLA Surface Slope:</span>
            <span className={`font-mono font-bold ${thermalData.isSlopeSafe ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {thermalData.slopeHazardDegrees}° (Limit: 10.0°)
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${thermalData.isSlopeSafe ? "bg-emerald-500" : "bg-rose-500"}`}
              style={{ width: `${Math.min(100, (thermalData.slopeHazardDegrees / 10.0) * 100)}%` }}
            />
          </div>
          <div className={`flex justify-between text-[11px] ${subLabelColor}`}>
            <span>Tip-Over Risk: {thermalData.tipOverRiskPercent}%</span>
            <span>Heaters: {thermalData.cryoHeaterDrawWatts}W</span>
          </div>
        </div>
      </div>
    </div>
  );
}
