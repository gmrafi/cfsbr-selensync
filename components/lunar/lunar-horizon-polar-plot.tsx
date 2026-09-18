"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Globe, Mountain, AlertTriangle, CheckCircle2 } from "lucide-react";
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
  const size = 340;
  const center = size / 2;
  const maxRadius = center - 30; // Represents 0° elevation (horizon)
  const zenithRadius = 10;       // Represents 90° elevation (zenith)

  // Scale function: elevation angle 0° to 90° maps to radius (maxRadius down to zenithRadius)
  const getRadiusFromElevation = (elevationAngleDeg: number) => {
    const safeElev = typeof elevationAngleDeg === "number" ? elevationAngleDeg : 0;
    const clampedElev = Math.max(0, Math.min(90, safeElev));
    return maxRadius - (clampedElev / 90) * (maxRadius - zenithRadius);
  };

  // Convert (azimuth, elevation) to Cartesian (x, y) coordinates
  // 0° Azimuth = North (top), 90° = East (right), 180° = South (bottom), 270° = West (left)
  const polarToXY = (azimuthDeg: number, altitudeDeg: number) => {
    const r = getRadiusFromElevation(altitudeDeg);
    const safeAz = typeof azimuthDeg === "number" ? azimuthDeg : 0;
    const angleRad = ((safeAz - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad),
    };
  };

  // Generate SVG path for 360° terrain mask (crater rim obstacle)
  const terrainMaskPath = useMemo(() => {
    if (!horizonProfile || horizonProfile.length === 0) return "";
    const points = horizonProfile.map((pt) => polarToXY(pt.azimuthDeg, pt.horizonElevationDeg));
    const firstPoint = points[0];
    const pathCommands = points.map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
    return `${pathCommands} Z`;
  }, [horizonProfile]);

  const sunXY = polarToXY(sunAzimuthDeg ?? 0, sunAltitudeDeg ?? 0);
  const earthXY = polarToXY(earthAzimuthDeg ?? 0, earthAltitudeDeg ?? 0);

  return (
    <Card className="border border-slate-200 shadow-md bg-white overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-cyan-400" />
            <CardTitle className="text-base font-semibold">360° Topographic Horizon Polar Mask</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs bg-white/10 text-cyan-200 border-cyan-400/40">
            {siteName}
          </Badge>
        </div>
        <CardDescription className="text-slate-300 text-xs">
          Fish-eye skyline displaying crater rims vs celestial trajectories
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col items-center">
        {/* SVG Polar Plot Canvas */}
        <div className="relative">
          <svg width={size} height={size} className="overflow-visible select-none">
            {/* Background Sky Disk */}
            <circle cx={center} cy={center} r={maxRadius} fill="#0a0e1a" stroke="#1e293b" strokeWidth="2" />

            {/* Elevation Grid Rings (10°, 30°, 60°) */}
            {[10, 30, 60].map((ringDeg) => {
              const r = getRadiusFromElevation(ringDeg);
              return (
                <g key={ringDeg}>
                  <circle cx={center} cy={center} r={r} fill="none" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                  <text x={center + 4} y={center - r + 10} fill="#64748b" fontSize="9" fontWeight="500">
                    {ringDeg}°
                  </text>
                </g>
              );
            })}

            {/* Cardinal Direction Lines (N, E, S, W) */}
            <line x1={center} y1={center - maxRadius} x2={center} y2={center + maxRadius} stroke="#334155" strokeWidth="1" strokeDasharray="2 4" />
            <line x1={center - maxRadius} y1={center} x2={center + maxRadius} y2={center} stroke="#334155" strokeWidth="1" strokeDasharray="2 4" />

            {/* Cardinal Labels */}
            <text x={center} y={center - maxRadius - 8} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">N 0°</text>
            <text x={center + maxRadius + 14} y={center + 4} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">E 90°</text>
            <text x={center} y={center + maxRadius + 16} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">S 180°</text>
            <text x={center - maxRadius - 16} y={center + 4} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">W 270°</text>

            {/* Terrain Obstacle Shadow Polygon */}
            {terrainMaskPath && (
              <path
                d={terrainMaskPath}
                fill="rgba(56, 189, 248, 0.08)"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}

            {/* Earth Position Vector & Dot */}
            {(earthAltitudeDeg ?? 0) > -10 && (
              <g>
                <line x1={center} y1={center} x2={earthXY.x} y2={earthXY.y} stroke={isEarthOccluded ? "#ef4444" : "#22c55e"} strokeWidth="1.5" opacity="0.6" />
                <circle cx={earthXY.x} cy={earthXY.y} r="7" fill={isEarthOccluded ? "#ef4444" : "#22c55e"} stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                <text x={earthXY.x + 10} y={earthXY.y - 4} fill={isEarthOccluded ? "#ef4444" : "#22c55e"} fontSize="11" fontWeight="bold">
                  Earth ({(earthAltitudeDeg ?? 0).toFixed(1)}°)
                </text>
              </g>
            )}

            {/* Sun Position Vector & Dot */}
            {(sunAltitudeDeg ?? 0) > -10 && (
              <g>
                <line x1={center} y1={center} x2={sunXY.x} y2={sunXY.y} stroke={isSunOccluded ? "#f59e0b" : "#eab308"} strokeWidth="1.5" opacity="0.7" />
                <circle cx={sunXY.x} cy={sunXY.y} r="8" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                <text x={sunXY.x + 10} y={sunXY.y + 12} fill="#eab308" fontSize="11" fontWeight="bold">
                  Sun ({(sunAltitudeDeg ?? 0).toFixed(1)}°)
                </text>
              </g>
            )}

            {/* Center Zenith Point (90° Overhead) */}
            <circle cx={center} cy={center} r="3" fill="#cbd5e1" />
            <text x={center + 6} y={center + 4} fill="#64748b" fontSize="8">Zenith</text>
          </svg>
        </div>

        {/* Real-time Status Badges */}
        <div className="w-full grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
          <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${isSunOccluded ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}>
            <Sun className={`w-4 h-4 shrink-0 ${isSunOccluded ? "text-amber-600" : "text-emerald-600"}`} />
            <div>
              <div className="font-semibold">{isSunOccluded ? "Sun in Topo Shadow" : "Direct Sunlight Clear"}</div>
              <div className="text-[11px] opacity-80">Elev: {(sunAltitudeDeg ?? 0).toFixed(2)}° | Az: {(sunAzimuthDeg ?? 0).toFixed(1)}°</div>
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${isEarthOccluded ? "bg-rose-50 border-rose-200 text-rose-900" : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}>
            <Globe className={`w-4 h-4 shrink-0 ${isEarthOccluded ? "text-rose-600" : "text-emerald-600"}`} />
            <div>
              <div className="font-semibold">{isEarthOccluded ? "DTE RF Occluded" : "DTE Comm Link Open"}</div>
              <div className="text-[11px] opacity-80">Elev: {(earthAltitudeDeg ?? 0).toFixed(2)}° | Az: {(earthAzimuthDeg ?? 0).toFixed(1)}°</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
