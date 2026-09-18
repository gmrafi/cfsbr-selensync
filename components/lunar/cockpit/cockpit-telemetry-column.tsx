"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sun, 
  Globe, 
  Radio, 
  Zap, 
  ThermometerSnowflake, 
  ShieldAlert, 
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
}

export default function CockpitTelemetryColumn({
  lander,
  solarData,
  dteData,
  thermalData,
  batterySoCPercent,
}: CockpitTelemetryColumnProps) {
  return (
    <div className="h-full flex flex-col gap-2 overflow-y-auto pr-0.5 custom-scrollbar text-xs select-none">
      {/* 1. SOLAR ILLUMINATION HUD CARD */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2.5 space-y-2 shadow-xs">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[11px]">
            <Sun className="w-3.5 h-3.5" />
            <span>SOLAR FLUX &amp; ILLUMINATION</span>
          </div>
          <Badge
            variant="outline"
            className={`text-[9px] font-mono font-bold px-1.5 py-0 ${
              solarData.isOccluded
                ? "bg-amber-950/70 text-amber-300 border-amber-500/40 animate-pulse"
                : "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
            }`}
          >
            {solarData.isOccluded ? "CRATER OCCLUSION" : "GRAZING ILLUMINATION"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block uppercase">Sub-Solar Elev (θ)</span>
            <span className={`text-base font-bold ${solarData.elevationDeg > 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {solarData.elevationDeg > 0 ? `+${solarData.elevationDeg.toFixed(2)}°` : `${solarData.elevationDeg.toFixed(2)}°`}
            </span>
            <span className="text-[9px] text-zinc-500 block">Az: {solarData.azimuthDeg.toFixed(1)}°</span>
          </div>

          <div className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block uppercase">PV Array Generation</span>
            <span className="text-base font-bold text-white">
              {solarData.output.netOutputWatts.toFixed(0)} <span className="text-[10px] text-zinc-400">W</span>
            </span>
            <span className="text-[9px] text-zinc-500 block">Flux: {solarData.output.solarFluxWm2} W/m²</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-0.5">
          <span>Array: {lander.solarArray.areaM2}m² ({lander.solarArray.orientation.split("-")[0]})</span>
          <span className="text-amber-300 font-semibold">Eff: {(lander.solarArray.cellEfficiency * 100).toFixed(0)}% GaAs</span>
        </div>
      </div>

      {/* 2. DTE LINK & LUNAR LIBRATION HUD CARD */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2.5 space-y-2 shadow-xs">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-[11px]">
            <Radio className="w-3.5 h-3.5" />
            <span>DTE LINK &amp; LIBRATION</span>
          </div>
          <Badge
            variant="outline"
            className={`text-[9px] font-mono font-bold px-1.5 py-0 ${
              dteData.isOccluded
                ? "bg-rose-950/70 text-rose-300 border-rose-500/40"
                : "bg-cyan-950/70 text-cyan-300 border-cyan-500/40"
            }`}
          >
            {dteData.isOccluded ? "LOS BLOCKED" : "DTE LOCKED"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block uppercase">Earth Elev / Az</span>
            <span className={`text-base font-bold ${dteData.elevationDeg > 0 ? "text-cyan-400" : "text-rose-400"}`}>
              {dteData.elevationDeg > 0 ? `+${dteData.elevationDeg.toFixed(2)}°` : `${dteData.elevationDeg.toFixed(2)}°`}
            </span>
            <span className="text-[9px] text-zinc-500 block">Az: {dteData.azimuthDeg.toFixed(1)}°</span>
          </div>

          <div className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block uppercase">DSN 34m Margin</span>
            <span className={`text-base font-bold ${dteData.rfOutput.isLinkClosed && !dteData.isOccluded ? "text-emerald-400" : "text-rose-400"}`}>
              {dteData.isOccluded ? "0.0 dB" : `+${dteData.rfOutput.linkMarginDb.toFixed(1)} dB`}
            </span>
            <span className="text-[9px] text-zinc-500 block">FSPL: ~216.5 dB</span>
          </div>
        </div>

        {/* Lunar Libration Vector */}
        <div className="bg-zinc-950/60 p-1.5 rounded border border-zinc-800/80 space-y-1 font-mono text-[10px]">
          <div className="flex justify-between text-zinc-300">
            <span>Lunar Libration (Δλ, Δβ):</span>
            <span className="text-cyan-300 font-bold">
              {dteData.libration.longitudeLibrationDeg > 0 ? `+${dteData.libration.longitudeLibrationDeg}°` : `${dteData.libration.longitudeLibrationDeg}°`},{" "}
              {dteData.libration.latitudeLibrationDeg > 0 ? `+${dteData.libration.latitudeLibrationDeg}°` : `${dteData.libration.latitudeLibrationDeg}°`}
            </span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[9px]">
            <span>Active Ground Terminal:</span>
            <span className="text-white font-semibold">
              {dteData.dsn.activeStation.name.split(" ")[0]} ({dteData.dsn.activeStation.primaryAntenna.split(" ")[0]})
            </span>
          </div>
          <div className="flex justify-between text-zinc-500 text-[9px]">
            <span>Next DSN Handover:</span>
            <span className="text-amber-400 font-bold">
              {dteData.dsn.nextStation.name.split(" ")[0]} in {dteData.dsn.handoverCountdownHours}h
            </span>
          </div>
        </div>
      </div>

      {/* 3. DIVINER CRYOGENIC THERMAL & LANDER HEALTH */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2.5 space-y-2 shadow-xs">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
          <div className="flex items-center gap-1.5 text-blue-400 font-mono font-bold text-[11px]">
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            <span>DIVINER THERMAL &amp; HEALTH</span>
          </div>
          <Badge
            variant="outline"
            className={`text-[9px] font-mono font-bold px-1.5 py-0 ${
              thermalData.thermalState === "CRYOGENIC_DANGER"
                ? "bg-rose-950/70 text-rose-300 border-rose-500/40 animate-pulse"
                : thermalData.thermalState === "HEATER_ACTIVE"
                ? "bg-amber-950/70 text-amber-300 border-amber-500/40"
                : "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
            }`}
          >
            {thermalData.thermalState === "CRYOGENIC_DANGER" ? "CRYO DANGER" : thermalData.thermalState}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono">
          {/* Surface Temperature */}
          <div className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block uppercase">Diviner Surface Temp</span>
            <span className="text-base font-bold text-white">
              {thermalData.regolithTempKelvin} <span className="text-[10px] text-zinc-400">K</span>
            </span>
            <span className="text-[9px] text-zinc-500 block">({thermalData.regolithTempCelsius}°C)</span>
          </div>

          {/* Battery SoC & Survival */}
          <div className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800">
            <span className="text-[9px] text-zinc-400 block uppercase">Battery SoC (Li-ion)</span>
            <span className={`text-base font-bold ${batterySoCPercent > 35 ? "text-emerald-400" : "text-rose-400"}`}>
              {batterySoCPercent.toFixed(0)}%
            </span>
            <span className="text-[9px] text-zinc-500 block">
              TTF: {thermalData.timeToFreezeHours > 200 ? "SAFE" : `${thermalData.timeToFreezeHours}h`}
            </span>
          </div>
        </div>

        {/* Slope Tip-Over Risk Assessment */}
        <div className="bg-zinc-950/60 p-1.5 rounded border border-zinc-800/80 space-y-1 font-mono text-[10px]">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">LOLA Slope Hazard:</span>
            <span className={`font-bold ${thermalData.isSlopeSafe ? "text-emerald-400" : "text-rose-400"}`}>
              {thermalData.slopeHazardDegrees}° (Limit: 10.0°)
            </span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${thermalData.isSlopeSafe ? "bg-emerald-500" : "bg-rose-500"}`}
              style={{ width: `${(thermalData.slopeHazardDegrees / 10.0) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-zinc-500">
            <span>Tip-Over Risk: {thermalData.tipOverRiskPercent}%</span>
            <span>Heater Load: {thermalData.cryoHeaterDrawWatts}W</span>
          </div>
        </div>
      </div>
    </div>
  );
}
