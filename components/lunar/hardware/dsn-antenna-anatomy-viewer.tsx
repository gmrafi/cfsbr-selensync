"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Radio, 
  Layers, 
  RotateCcw, 
  Compass, 
  Wifi, 
  Globe2, 
  ShieldCheck, 
  Zap,
  Activity
} from "lucide-react";

interface AntennaSubPart {
  id: string;
  name: string;
  category: "Optics" | "Drive Mechanism" | "Cryogenics" | "Structure";
  description: string;
  specs: { label: string; value: string }[];
  offsetExploded: { x: number; y: number };
}

interface DSNAntennaAnatomyProps {
  stationName?: string;
  stationAperture?: "34m" | "70m";
  frequencyBand?: string;
  isTracking?: boolean;
  isDarkMode?: boolean;
}

export default function DSNAntennaAnatomyViewer({
  stationName = "Goldstone Deep Space Comm Complex (DSS-24)",
  stationAperture = "34m",
  frequencyBand = "8.45 GHz X-Band / 32 GHz Ka-Band",
  isTracking = true,
  isDarkMode = false,
}: DSNAntennaAnatomyProps) {
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [selectedPartId, setSelectedPartId] = useState<string>("dish");
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);

  const parts: AntennaSubPart[] = [
    {
      id: "subreflector",
      name: "Hyperbolic Cassegrain Subreflector & Quadripod",
      category: "Optics",
      description: "Carbon-fiber hyperbolic secondary mirror supported by four aerodynamic struts, directing focused lunar RF waves down the central beam waveguide tube.",
      specs: [
        { label: "Subreflector Diameter", value: "2.8 meters" },
        { label: "Strut Material", value: "Carbon Fiber Reinforced Polymer" },
        { label: "RF Alignment Loss", value: "< 0.08 dB" },
      ],
      offsetExploded: { x: 0, y: -45 },
    },
    {
      id: "dish",
      name: "34-Meter Shaped Parabolic Main Reflector",
      category: "Optics",
      description: "Surface composed of 348 precision-machined aluminum panels with RMS surface accuracy of 0.25 mm, providing 68.2 dBi gain at 8.45 GHz.",
      specs: [
        { label: "Aperture Diameter", value: "34.0 meters (111.5 ft)" },
        { label: "Panel Surface RMS", value: "0.25 mm (Ka-band compliant)" },
        { label: "Peak X-Band Gain", value: "68.2 dBi" },
        { label: "Peak Ka-Band Gain", value: "79.4 dBi" },
      ],
      offsetExploded: { x: 0, y: -20 },
    },
    {
      id: "trunnion",
      name: "Elevation Trunnion Bearing & Ball-Screw Drive",
      category: "Drive Mechanism",
      description: "Dual elevation bull gear drives allowing pitch rotation from 5° horizon mask up to 90° zenith with pointing precision within 0.003 degrees.",
      specs: [
        { label: "Elevation Range", value: "5.0° to 89.5°" },
        { label: "Slew Rate", value: "0.5 deg/sec" },
        { label: "Pointing Accuracy", value: "0.003° (10.8 arcsec)" },
      ],
      offsetExploded: { x: 0, y: 18 },
    },
    {
      id: "alidade",
      name: "Alidade Steel Tower & Azimuth Turntable Ring",
      category: "Structure",
      description: "Rotatable steel superstructure rolling on 4 hardened steel wheels over a 15-meter circular steel runner track for 360° horizontal coverage.",
      specs: [
        { label: "Total Moving Weight", value: "480 metric tons" },
        { label: "Azimuth Coverage", value: "±270° (540° total travel)" },
        { label: "Wind Survivability", value: "Up to 160 km/h (Stowed)" },
      ],
      offsetExploded: { x: 0, y: 45 },
    },
    {
      id: "cryo-pedestal",
      name: "Concrete Pedestal & Helium-Cooled Cryogenic LNA",
      category: "Cryogenics",
      description: "Subterranean control room housing High-Electron-Mobility Transistor (HEMT) Low-Noise Amplifiers cooled by closed-cycle helium to 4 Kelvin (-269°C).",
      specs: [
        { label: "LNA Physical Temp", value: "4.2 Kelvin (Liquid Helium)" },
        { label: "System Noise Temp", value: "18 Kelvin (-255°C equivalent)" },
        { label: "High-Power Uplink", value: "20 kW Continuous Wave X-band" },
      ],
      offsetExploded: { x: 0, y: 75 },
    },
  ];

  const activePart = parts.find((p) => p.id === (hoveredPartId || selectedPartId)) || parts[1];

  const getOffset = (id: string) => {
    if (!isExploded) return { x: 0, y: 0 };
    const p = parts.find((item) => item.id === id);
    return p ? p.offsetExploded : { x: 0, y: 0 };
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md overflow-hidden flex flex-col select-none">
      {/* Header */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-600 text-white border-none font-mono text-[10px] tracking-wider px-2 py-0.5">
            DSN APERTURE ANATOMY
          </Badge>
          <span className="font-semibold text-slate-200 truncate">
            {stationName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExploded(!isExploded)}
            className={`h-7 px-2.5 text-xs font-semibold gap-1.5 transition-all ${
              isExploded
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 font-bold"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? "Exploded Assembly ON" : "Explode Assembly"}</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsExploded(false);
              setSelectedPartId("dish");
            }}
            className="h-7 px-2 text-slate-400 hover:text-white text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Grid: Blueprint Left | Specs Right */}
      <div className="grid grid-cols-12 gap-0 min-h-[360px]">
        {/* Isometric SVG Canvas (Left 7 Cols) */}
        <div className="col-span-12 lg:col-span-7 p-4 bg-slate-950 relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden">
          {/* Engineering Blueprint Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }} />

          {/* DSN Tracking Pulse Status */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest">
              LUNAR TELEMETRY LOCK &bull; 8.45 GHZ
            </span>
          </div>

          <svg viewBox="0 0 460 360" className="w-full h-[320px] max-w-[420px]">
            <g transform="translate(230, 180)">
              {/* PART 4: PEDESTAL & CRYO BASE (Order: 0) */}
              {(() => {
                const off = getOffset("cryo-pedestal");
                const isHov = (hoveredPartId || selectedPartId) === "cryo-pedestal";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("cryo-pedestal")}
                    onMouseEnter={() => setHoveredPartId("cryo-pedestal")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* Shadow on earth ground */}
                    <ellipse cx={0} cy={68} rx={70} ry={14} fill="#020617" opacity={0.8} />
                    {/* Concrete cylindrical pedestal */}
                    <path
                      d="M -48 25 L -48 62 Q 0 74 48 62 L 48 25 Q 0 35 -48 25 Z"
                      fill={isHov ? "#34d399" : "#334155"}
                      stroke="#0f172a"
                      strokeWidth={1.5}
                    />
                    <ellipse cx={0} cy={25} rx={48} ry={11} fill={isHov ? "#6ee7b7" : "#475569"} stroke="#1e293b" strokeWidth={1} />
                    <text x={0} y={48} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace" fontWeight="bold">
                      CRYO-HEMT ROOM (4.2 K)
                    </text>
                  </g>
                );
              })()}

              {/* PART 3: ALIDADE TOWER & AZIMUTH RING (Order: 1) */}
              {(() => {
                const off = getOffset("alidade");
                const isHov = (hoveredPartId || selectedPartId) === "alidade";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("alidade")}
                    onMouseEnter={() => setHoveredPartId("alidade")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* Azimuth track ring */}
                    <ellipse cx={0} cy={20} rx={40} ry={9} fill="#1e293b" stroke={isHov ? "#10b981" : "#64748b"} strokeWidth={1.5} />
                    {/* Steel alidade truss legs */}
                    <polygon points="-32,20 -18,-15 18,-15 32,20 18,20 0,0 -18,20" fill={isHov ? "#10b981" : "#475569"} stroke="#0f172a" strokeWidth={1} />
                  </g>
                );
              })()}

              {/* PART 2: ELEVATION TRUNNION & GOCK (Order: 2) */}
              {(() => {
                const off = getOffset("trunnion");
                const isHov = (hoveredPartId || selectedPartId) === "trunnion";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("trunnion")}
                    onMouseEnter={() => setHoveredPartId("trunnion")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* Elevation axle cylinder */}
                    <rect x={-22} y={-24} width={44} height={14} rx={4} fill={isHov ? "#10b981" : "#64748b"} stroke="#0f172a" strokeWidth={1} />
                    <circle cx={-15} cy={-17} r={4} fill="#0284c7" />
                    <circle cx={15} cy={-17} r={4} fill="#0284c7" />
                  </g>
                );
              })()}

              {/* PART 1: 34-METER MAIN PARABOLIC DISH (Order: 3) */}
              {(() => {
                const off = getOffset("dish");
                const isHov = (hoveredPartId || selectedPartId) === "dish";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("dish")}
                    onMouseEnter={() => setHoveredPartId("dish")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* Rear Support Truss Webbing */}
                    <ellipse cx={0} cy={-30} rx={80} ry={26} fill="#0f172a" stroke="#334155" strokeWidth={1} />

                    {/* Main Parabolic Reflector Rim */}
                    <ellipse
                      cx={0}
                      cy={-42}
                      rx={88}
                      ry={30}
                      fill={isHov ? "#34d399" : "#e2e8f0"}
                      stroke="#0f172a"
                      strokeWidth={2}
                    />
                    {/* Inner Concave Dish Cavity */}
                    <ellipse
                      cx={0}
                      cy={-41}
                      rx={78}
                      ry={24}
                      fill={isHov ? "#059669" : "#cbd5e1"}
                      stroke="#94a3b8"
                      strokeWidth={1}
                    />

                    {/* Concentric Panel Ring Dividers */}
                    <ellipse cx={0} cy={-41} rx={52} ry={16} fill="none" stroke="#94a3b8" strokeWidth={0.7} strokeDasharray="4 2" />
                    <ellipse cx={0} cy={-41} rx={26} ry={8} fill="none" stroke="#94a3b8" strokeWidth={0.7} strokeDasharray="3 2" />

                    {/* Central Beam Waveguide (BWG) Center Hole */}
                    <ellipse cx={0} cy={-41} rx={9} ry={3.5} fill="#0f172a" stroke="#64748b" strokeWidth={1} />
                  </g>
                );
              })()}

              {/* PART 0: SUBREFLECTOR & QUADRIPOD (Order: 4) */}
              {(() => {
                const off = getOffset("subreflector");
                const isHov = (hoveredPartId || selectedPartId) === "subreflector";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("subreflector")}
                    onMouseEnter={() => setHoveredPartId("subreflector")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* 4 Struts from dish rim to focal apex */}
                    <line x1={-60} y1={-44} x2={0} y2={-80} stroke={isHov ? "#34d399" : "#475569"} strokeWidth={1.5} />
                    <line x1={60} y1={-44} x2={0} y2={-80} stroke={isHov ? "#34d399" : "#475569"} strokeWidth={1.5} />
                    <line x1={0} y1={-20} x2={0} y2={-80} stroke={isHov ? "#34d399" : "#64748b"} strokeWidth={1.5} />

                    {/* Hyperbolic Subreflector Mirror */}
                    <ellipse cx={0} cy={-80} rx={16} ry={6} fill={isHov ? "#10b981" : "#0284c7"} stroke="#38bdf8" strokeWidth={1.2} />
                    {/* Apex Antenna Beam Focal Ray to Moon */}
                    <line x1={0} y1={-82} x2={-20} y2={-130} stroke="#10b981" strokeWidth={2} strokeDasharray="4 3" opacity={0.8} />
                    <ellipse cx={-20} cy={-130} rx={14} ry={5} fill="none" stroke="#34d399" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                  </g>
                );
              })()}
            </g>
          </svg>
        </div>

        {/* Right 5 Cols: Telemetry Specs */}
        <div className="col-span-12 lg:col-span-5 p-4 flex flex-col justify-between bg-slate-50 dark:bg-slate-900/50 space-y-3">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-mono px-2 py-0 mb-1 border-emerald-400 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40"
                >
                  {activePart.category} Sub-Assembly
                </Badge>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {activePart.name}
                </h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 shrink-0">
                <Radio className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {activePart.description}
            </p>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block font-sans">
                Engineering Specifications:
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {activePart.specs.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5"
                  >
                    <span className="text-slate-500 text-[10px] block font-sans">{s.label}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate block text-[11px]">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-500 font-sans block">Select Component to Inspect:</span>
            <div className="flex flex-wrap gap-1">
              {parts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPartId(p.id)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                    (hoveredPartId || selectedPartId) === p.id
                      ? "bg-emerald-600 text-white font-bold shadow-xs"
                      : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {p.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
