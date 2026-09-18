"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Mountain, Compass, ShieldCheck, Zap, Radio, Globe } from "lucide-react";
import { LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { CLPSLanderProfile } from "@/lib/physics/lander-profiles";

interface EngineeringTelemetryMatrixProps {
  site: LunarCandidateSite;
  lander: CLPSLanderProfile;
}

export default function EngineeringTelemetryMatrix({
  site,
  lander,
}: EngineeringTelemetryMatrixProps) {
  const telemetryRows = [
    { label: "TARGET_SITE_DESIGNATION", value: site.name.split("(")[0].trim(), tag: "PRIMARY" },
    { label: "SELENOGRAPHIC_COORDINATES", value: `${site.latitude.toFixed(2)}°S, ${site.longitude.toFixed(2)}°E`, tag: "LRO LOLA" },
    { label: "SURFACE_ELEVATION_MSL", value: `+${site.elevationMeters} meters`, tag: "ALTIMETRY" },
    { label: "SOLAR_DUTY_CYCLE", value: site.solarIlluminationPotential.split(" ")[0] || "85-90%", tag: "ILLUMINATION" },
    { label: "DTE_VISIBILITY_WINDOW", value: site.dteDirectToEarthStatus.split(" ")[0] || "HIGH", tag: "DSN X-BAND" },
    { label: "CLPS_LANDER_PLATFORM", value: lander.name, tag: lander.contractor },
    { label: "SOLAR_ARRAY_GEOMETRY", value: `${lander.solarArray.areaM2} m² (${lander.solarArray.orientation})`, tag: "GaAs 30%" },
    { label: "BATTERY_RESERVE_CAPACITY", value: `${lander.battery.capacityWh} Wh (${lander.battery.voltageV}V DC)`, tag: "CRYO RATED" },
    { label: "SCIENCE_OBJECTIVE", value: site.scientificInterest.slice(0, 52) + "...", tag: "ARTEMIS" },
  ];

  return (
    <Card className="border border-slate-300 bg-white shadow-xs overflow-hidden">
      <CardHeader className="py-2 px-3.5 bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-[#4e6aff]" />
          <CardTitle className="text-xs font-bold font-mono text-slate-800 tracking-wider uppercase">
            Aerospace Telemetry Matrix (ATM-1)
          </CardTitle>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono bg-white text-slate-600 border-slate-300">
          STATUS: VERIFIED
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 font-mono text-xs">
          {telemetryRows.map((row, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-3.5 py-1.5 hover:bg-slate-50/80 transition-colors"
            >
              <span className="text-[10px] text-slate-500 tracking-tight uppercase">{row.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-[11px]">{row.value}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  {row.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
