"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Globe, Mountain, AlertTriangle, CheckCircle2, Compass } from "lucide-react";
import { HorizonObstaclePoint } from "@/lib/gis/horizon-elevation";

interface LunarHorizonPolarPlotProps {
  siteName: string;
  sunAltitudeDeg: number;
  sunAzimuthDeg: number;
  earthAltitudeDeg: number;
  earthAzimuthDeg: number;
  horizonProfile: HorizonObstaclePoint[];
  isSunOccluded: boolean;
  isEarthOccluded: boolean;
}

export default function LunarHorizonPolarPlot({
  siteName,
  sunAltitudeDeg,
  sunAzimuthDeg,
  earthAltitudeDeg,
  earthAzimuthDeg,
  horizonProfile,
  isSunOccluded,
  isEarthOccluded,
}: LunarHorizonPolarPlotProps) {
  // SVG Canvas configuration
  const size = 300;
  const center = size / 2;
  const maxRadius = center - 24; // Represents 0° elevation (horizon)
  const zenithRadius = 8;        // Represents 90° elevation (zenith)

  // Scale function: elevation angle 0° to 90° maps to radius (maxRadius down to zenithRadius)
  const getRadiusFromElevation = (elevationAngleDeg: number) => {
    const safeElev = typeof elevationAngleDeg === "number" ? elevationAngleDeg : 0;
    const clampedElev = Math.max(0, Math.min(90, safeElev));
    return maxRadius - (clampedElev / 90) * (maxRadius - zenithRadius);
  };

  // Convert (azimuth, elevation) to Cartesian (x, y) coordinates
  const polarToXY = (azimuthDeg: number, altitudeDeg: number) => {
    const r = getRadiusFromElevation(altitudeDeg);
    const safeAz = typeof azimuthDeg === "number" ? azimuthDeg : 0;
    const angleRad = ((safeAz - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad),
    };
  };

  // Generate SVG path for 360° terrain mask
  const terrainMaskPath = useMemo(() => {
    if (!horizonProfile || horizonProfile.length === 0) return "";
    const points = horizonProfile.map((pt) => polarToXY(pt.azimuthDeg, pt.horizonElevationDeg));
    const pathCommands = points.map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
    return `${pathCommands} Z`;
  }, [horizonProfile]);

  const sunXY = polarToXY(sunAzimuthDeg ?? 0, sunAltitudeDeg ?? 0);
  const earthXY = polarToXY(earthAzimuthDeg ?? 0, earthAltitudeDeg ?? 0);

  return (
    <Card className="border border-slate-300 bg-white shadow-xs overflow-hidden">
      <CardHeader className="py-2.5 px-3.5 bg-slate-900 text-white flex flex-row items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#4e6aff] animate-spin" style={{ animationDuration: '24s' }} />
          <div>
            <CardTitle className="text-xs font-bold font-mono tracking-wider uppercase text-white">
              360° Polar Horizon Skyline Radar
            </CardTitle>
            <div className="text-[10px] text-slate-400 font-mono">Crater Rim Shadow Obstacle Mask</div>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono bg-white/10 text-cyan-300 border-cyan-400/40">
          {siteName.split(" ")[0]}
        </Badge>
      </CardHeader>

      <CardContent className="p-3 flex flex-col items-center">
        {/* SVG Polar Radar Canvas */}
        <div className="relative">
          <svg width={size} height={size} className="overflow-visible select-none">
            {/* Background Sky Disk */}
            <circle cx={center} cy={center} r={maxRadius} fill="#060911" stroke="#1e293b" strokeWidth="2" />

            {/* Elevation Grid Rings (2°, 5°, 10°, 30°, 60°) */}
            {[2, 5, 10, 30].map((ringDeg) => {
              const r = getRadiusFromElevation(ringDeg);
              return (
                <g key={ringDeg}>
                  <circle cx={center} cy={center} r={r} fill="none" stroke="#1e293b" strokeDasharray="2 3" strokeWidth="1" />
                  <text x={center + 3} y={center - r + 9} fill="#475569" fontSize="8" fontFamily="monospace">
                    {ringDeg}°
                  </text>
                </g>
              );
            })}

            {/* Cardinal Direction Lines */}
            <line x1={center} y1={center - maxRadius} x2={center} y2={center + maxRadius} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" />
            <line x1={center - maxRadius} y1={center} x2={center + maxRadius} y2={center} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" />

            {/* Cardinal Labels */}
            <text x={center} y={center - maxRadius - 5} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">N 000°</text>
            <text x={center + maxRadius + 14} y={center + 3} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">E 090°</text>
            <text x={center} y={center + maxRadius + 14} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">S 180°</text>
            <text x={center - maxRadius - 14} y={center + 3} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">W 270°</text>

            {/* Terrain Obstacle Silhouette Polygon */}
            {terrainMaskPath && (
              <path
                d={terrainMaskPath}
                fill="rgba(56, 189, 248, 0.12)"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}

            {/* Earth Vector & Marker */}
            {(earthAltitudeDeg ?? 0) > -10 && (
              <g>
                <line x1={center} y1={center} x2={earthXY.x} y2={earthXY.y} stroke={isEarthOccluded ? "#ef4444" : "#00e5ff"} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
                <circle cx={earthXY.x} cy={earthXY.y} r="6" fill={isEarthOccluded ? "#ef4444" : "#00e5ff"} stroke="#ffffff" strokeWidth="1.5" />
                <text x={earthXY.x + 8} y={earthXY.y - 3} fill={isEarthOccluded ? "#ef4444" : "#00e5ff"} fontSize="9" fontFamily="monospace" fontWeight="bold">
                  EARTH ({(earthAltitudeDeg ?? 0).toFixed(1)}°)
                </text>
              </g>
            )}

            {/* Sun Vector & Marker */}
            {(sunAltitudeDeg ?? 0) > -10 && (
              <g>
                <line x1={center} y1={center} x2={sunXY.x} y2={sunXY.y} stroke={isSunOccluded ? "#f59e0b" : "#eab308"} strokeWidth="1.5" opacity="0.8" />
                <circle cx={sunXY.x} cy={sunXY.y} r="6" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
                <text x={sunXY.x + 8} y={sunXY.y + 9} fill="#eab308" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  SUN ({(sunAltitudeDeg ?? 0).toFixed(1)}°)
                </text>
              </g>
            )}

            {/* Center Origin: Lander position */}
            <circle cx={center} cy={center} r="3" fill="#ffffff" />
            <text x={center + 5} y={center + 3} fill="#64748b" fontSize="7" fontFamily="monospace">LANDER</text>
          </svg>
        </div>

        {/* Live Vector Telemetry Readout */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 font-mono text-[11px]">
          <div className={`p-1.5 rounded border flex items-center gap-1.5 ${isSunOccluded ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}>
            <Sun className={`w-3.5 h-3.5 shrink-0 ${isSunOccluded ? "text-amber-600" : "text-emerald-600"}`} />
            <div>
              <div className="font-bold leading-tight">{isSunOccluded ? "SHADOW" : "DIRECT SUN"}</div>
              <div className="text-[10px] opacity-75">El: {(sunAltitudeDeg ?? 0).toFixed(2)}° | Az: {(sunAzimuthDeg ?? 0).toFixed(1)}°</div>
            </div>
          </div>

          <div className={`p-1.5 rounded border flex items-center gap-1.5 ${isEarthOccluded ? "bg-rose-50 border-rose-200 text-rose-900" : "bg-cyan-50 border-cyan-200 text-cyan-900"}`}>
            <Globe className={`w-3.5 h-3.5 shrink-0 ${isEarthOccluded ? "text-rose-600" : "text-cyan-600"}`} />
            <div>
              <div className="font-bold leading-tight">{isEarthOccluded ? "LOS OCCLUDED" : "DTE VECTOR OPEN"}</div>
              <div className="text-[10px] opacity-75">El: {(earthAltitudeDeg ?? 0).toFixed(2)}° | Az: {(earthAzimuthDeg ?? 0).toFixed(1)}°</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
