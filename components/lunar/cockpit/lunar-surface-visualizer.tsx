"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Sun, Globe, Radio, AlertTriangle, CheckCircle2, Compass, ShieldAlert, Sparkles } from "lucide-react";
import { CLPSLanderProfile } from "@/lib/physics/lander-profiles";
import { LunarCandidateSite } from "@/lib/gis/lunar-sites";

interface LunarSurfaceVisualizerProps {
  site: LunarCandidateSite;
  lander: CLPSLanderProfile;
  sunElevationDeg: number;
  sunAzimuthDeg: number;
  earthElevationDeg: number;
  earthAzimuthDeg: number;
  isSunOccluded: boolean;
  isEarthOccluded: boolean;
  solarWatts: number;
  rfLinkMarginDb: number;
}

export default function LunarSurfaceVisualizer({
  site,
  lander,
  sunElevationDeg,
  sunAzimuthDeg,
  earthElevationDeg,
  earthAzimuthDeg,
  isSunOccluded,
  isEarthOccluded,
  solarWatts,
  rfLinkMarginDb,
}: LunarSurfaceVisualizerProps) {
  // Width and height of the visualizer stage
  const width = 640;
  const height = 300;

  // Calculate Sun position on the horizon sky canvas
  // Elevation ranges from -3° to +10°, normalized to horizon Y coordinate (ground is at Y = 210)
  const horizonY = 210;
  
  // Sun X coordinate mapped from Azimuth (0° to 360° -> 40 to 600)
  const sunX = 40 + ((sunAzimuthDeg % 360) / 360) * (width - 80);
  // Sun Y: elevation relative to horizon. 0° is on horizon (Y=210), 5° is Y=130, -2° is Y=230 (below)
  const sunY = Math.max(40, Math.min(240, horizonY - sunElevationDeg * 16));

  // Earth X and Y coordinate
  const earthX = 40 + ((earthAzimuthDeg % 360) / 360) * (width - 80);
  const earthY = Math.max(35, Math.min(230, horizonY - earthElevationDeg * 14));

  // Lander coordinate at center
  const landerX = width / 2;
  const landerY = horizonY - 12;

  // Shadow length and angle
  const shadowLength = isSunOccluded ? 0 : Math.max(30, Math.min(180, (10 - sunElevationDeg) * 18));
  const shadowDirection = sunX < landerX ? 1 : -1; // Cast away from Sun

  return (
    <div className="relative bg-slate-950 rounded-xl border border-slate-300 shadow-sm overflow-hidden select-none">
      {/* Top Telemetry HUD Overlay */}
      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <Badge className="bg-slate-900/90 text-cyan-400 border border-cyan-500/30 font-mono text-[10px] tracking-wider px-2 py-0.5">
            2.5D POLAR SURFACE SIMULATOR
          </Badge>
          <span className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
            LOC: {site.name.split(" ")[0]} ({site.latitude}°S)
          </span>
        </div>

        {/* Live Vector Badges */}
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold flex items-center gap-1 border ${
            isSunOccluded
              ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
              : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
          }`}>
            <Sun className="w-3 h-3" />
            {isSunOccluded ? "TOPO SHADOW" : `SUN EL ${sunElevationDeg.toFixed(1)}°`}
          </div>

          <div className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold flex items-center gap-1 border ${
            isEarthOccluded
              ? "bg-rose-950/80 text-rose-300 border-rose-500/40"
              : "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
          }`}>
            <Globe className="w-3 h-3" />
            {isEarthOccluded ? "DTE OCCLUDED" : `DTE +${rfLinkMarginDb} dB`}
          </div>
        </div>
      </div>

      {/* Main SVG Simulation Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[270px] sm:h-[300px] block"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Deep Space Sky Gradient */}
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04060b" />
            <stop offset="65%" stopColor="#0b101d" />
            <stop offset="100%" stopColor="#151b2a" />
          </linearGradient>

          {/* Lunar Regolith Ground Gradient */}
          <linearGradient id="regolithGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="25%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Distant Crater Rim Gradient */}
          <linearGradient id="distantCraterGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>

          {/* Sun Glow Filter */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Earth Glow */}
          <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="1" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#0284c7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Deep Space Sky */}
        <rect width={width} height={height} fill="url(#skyGradient)" />

        {/* 2. Star Field Background */}
        {[
          { cx: 30, cy: 35, r: 0.8 },
          { cx: 85, cy: 60, r: 1.2 },
          { cx: 140, cy: 25, r: 0.7 },
          { cx: 210, cy: 45, r: 1.0 },
          { cx: 280, cy: 75, r: 0.8 },
          { cx: 350, cy: 30, r: 1.1 },
          { cx: 420, cy: 55, r: 0.9 },
          { cx: 490, cy: 20, r: 1.2 },
          { cx: 560, cy: 65, r: 0.8 },
          { cx: 610, cy: 40, r: 1.0 },
        ].map((star, i) => (
          <circle key={i} cx={star.cx} cy={star.cy} r={star.r} fill="#ffffff" opacity={0.65} />
        ))}

        {/* 3. Earth Disk in Lunar Sky */}
        <g transform={`translate(${earthX}, ${earthY})`}>
          <circle cx={0} cy={0} r={14} fill="url(#earthGlow)" />
          <circle cx={0} cy={0} r={7} fill="#0284c7" />
          {/* Continents / Clouds impression */}
          <path d="M -3 -3 Q 0 -5 3 -2 Q 2 3 -1 4 Z" fill="#10b981" opacity={0.8} />
          <path d="M -5 1 Q -2 0 -1 3 Q -4 5 -5 1 Z" fill="#f8fafc" opacity={0.6} />
          <text
            x={0}
            y={17}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
          >
            EARTH (DTE)
          </text>
        </g>

        {/* 4. Sun Disk & Grazing Rays */}
        {sunY < horizonY + 20 && (
          <g transform={`translate(${sunX}, ${sunY})`}>
            {/* Sun Corona / Halo */}
            <circle cx={0} cy={0} r={28} fill="url(#sunGlow)" />
            {/* Sun Core */}
            <circle cx={0} cy={0} r={10} fill="#ffffff" stroke="#fef08a" strokeWidth="2" />
            {/* Sun Label */}
            <text
              x={0}
              y={-14}
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              SUN ({sunElevationDeg.toFixed(1)}°)
            </text>

            {/* Directional Sun Ray toward Lander */}
            {!isSunOccluded && (
              <line
                x1={0}
                y1={0}
                x2={landerX - sunX}
                y2={landerY - sunY}
                stroke="#fef08a"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity={0.5}
              />
            )}
          </g>
        )}

        {/* 5. RF Carrier Beam (Lander to Earth) */}
        <line
          x1={landerX}
          y1={landerY - 14}
          x2={earthX}
          y2={earthY}
          stroke={isEarthOccluded ? "#ef4444" : "#00e5ff"}
          strokeWidth={isEarthOccluded ? "1.5" : "2"}
          strokeDasharray={isEarthOccluded ? "4 4" : "none"}
          opacity={isEarthOccluded ? 0.7 : 0.85}
        />

        {/* 6. Distant Rugged Crater Rims (Background Silhouette) */}
        <path
          d={`M 0 ${horizonY - 18} 
              Q 80 ${horizonY - 38} 160 ${horizonY - 24} 
              T 320 ${horizonY - 42} 
              T 480 ${horizonY - 28} 
              T 640 ${horizonY - 36} 
              L 640 ${height} L 0 ${height} Z`}
          fill="url(#distantCraterGradient)"
        />

        {/* 7. Foreground Polar Ridge Terrain */}
        <path
          d={`M 0 ${horizonY} 
              Q 120 ${horizonY - 12} 240 ${horizonY + 2} 
              T ${landerX} ${horizonY} 
              T 460 ${horizonY - 8} 
              T 640 ${horizonY + 4} 
              L 640 ${height} L 0 ${height} Z`}
          fill="url(#regolithGradient)"
          stroke="#475569"
          strokeWidth="1"
        />

        {/* 8. Dynamic Lander Shadow on Ground */}
        {shadowLength > 0 && (
          <ellipse
            cx={landerX + (shadowDirection * shadowLength) / 2}
            cy={horizonY + 4}
            rx={shadowLength / 2}
            ry={4}
            fill="#020617"
            opacity={0.85}
          />
        )}

        {/* 9. CLPS Lander Vehicle Silhouette / Model */}
        <g transform={`translate(${landerX}, ${landerY})`}>
          {/* Lander Body */}
          <rect
            x={-10}
            y={-18}
            width={20}
            height={20}
            fill="#e2e8f0"
            stroke="#1e293b"
            strokeWidth="1.5"
            rx={2}
          />
          {/* Golden Multilayer Insulation (MLI) Foil */}
          <rect x={-8} y={-14} width={16} height={12} fill="#d97706" />
          {/* Vertical Solar Panels */}
          <rect
            x={-14}
            y={-22}
            width={4}
            height={26}
            fill={isSunOccluded ? "#334155" : "#3b82f6"}
            stroke="#93c5fd"
            strokeWidth="0.8"
          />
          <rect
            x={10}
            y={-22}
            width={4}
            height={26}
            fill={isSunOccluded ? "#334155" : "#3b82f6"}
            stroke="#93c5fd"
            strokeWidth="0.8"
          />
          {/* Steerable High Gain Dish Antenna */}
          <path
            d="M -5 -24 Q 0 -28 5 -24"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="2"
          />
          <line x1={0} y1={-18} x2={0} y2={-25} stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Landing Legs */}
          <line x1={-8} y1={2} x2={-16} y2={12} stroke="#94a3b8" strokeWidth="2" />
          <line x1={8} y1={2} x2={16} y2={12} stroke="#94a3b8" strokeWidth="2" />
          <line x1={-18} y1={12} x2={-14} y2={12} stroke="#64748b" strokeWidth="3" />
          <line x1={14} y1={12} x2={18} y2={12} stroke="#64748b" strokeWidth="3" />

          {/* Vehicle Label Tag */}
          <text
            x={0}
            y={24}
            textAnchor="middle"
            fill="#f8fafc"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {lander.name.split(" ")[0]}
          </text>
        </g>

        {/* 10. Horizon Occlusion Alert Banner if Occurred */}
        {isSunOccluded && (
          <g transform={`translate(${width / 2}, 70)`}>
            <rect
              x={-130}
              y={-12}
              width={260}
              height={24}
              rx={6}
              fill="rgba(120, 53, 15, 0.85)"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <text
              x={0}
              y={4}
              textAnchor="middle"
              fill="#fef3c7"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              CRATER RIM SHADOW OCCLUSION ACTIVE
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
