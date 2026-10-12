"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  Maximize2, 
  RotateCcw, 
  Layers, 
  Compass, 
  Flame, 
  Info,
  CheckCircle2,
  ChevronRight,
  Crosshair
} from "lucide-react";
import { CLPSLanderConstraintProfile, CLPS_LANDER_PROFILES, NASA_VIPER_LTV_PROFILE } from "@/lib/data/clps-profiles";
import { CLPSLanderProfile } from "@/lib/physics/lander-profiles";

interface SubAssembly {
  id: string;
  name: string;
  category: "Power" | "Telecom" | "Thermal" | "Propulsion" | "Structure" | "Sensors";
  description: string;
  specs: { label: string; value: string }[];
  offsetExploded: { x: number; y: number }; // Isometric displacement vector when exploded
  renderOrder: number;
}

interface LanderAnatomyViewerProps {
  vehicleId?: string;
  vehicleProfile?: CLPSLanderConstraintProfile | CLPSLanderProfile;
  isDarkMode?: boolean;
}

export default function LanderAnatomyViewer({
  vehicleId = "nova-c",
  vehicleProfile,
  isDarkMode = false,
}: LanderAnatomyViewerProps) {
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [selectedPartId, setSelectedPartId] = useState<string>("antenna");
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);

  // If vehicleProfile is provided, check if it has constraint profile specs or resolve from CLPS_LANDER_PROFILES
  const resolvedProfile: CLPSLanderConstraintProfile = useMemo(() => {
    if (vehicleProfile && "powerSpecs" in vehicleProfile) {
      return vehicleProfile as CLPSLanderConstraintProfile;
    }
    const id = vehicleProfile?.id || vehicleId;
    if (CLPS_LANDER_PROFILES[id]) {
      return CLPS_LANDER_PROFILES[id];
    }
    return NASA_VIPER_LTV_PROFILE;
  }, [vehicleProfile, vehicleId]);

  const profile = resolvedProfile;
  const isViper = profile.id === "viper-ltv-carrier";

  // Sub-assemblies modeled after NASA & Anatomy isometric craft rules
  const subAssemblies: SubAssembly[] = [
    {
      id: "antenna",
      name: "High-Gain Steerable X/Ka-Band Parabolic Antenna",
      category: "Telecom",
      description: "Two-axis articulated gimbal antenna maintaining continuous RF contact with NASA Deep Space Network 34m/70m apertures across 384,400 km.",
      specs: [
        { label: "Frequency Band", value: profile.telecomSpecs?.primaryBand || "X-Band" },
        { label: "Antenna Gain", value: `${profile.telecomSpecs?.antennaGainDbi || 28.5} dBi` },
        { label: "RF Transmit Power", value: `${profile.telecomSpecs?.txPowerWatts || 25} W` },
        { label: "Min Link Margin", value: `+${profile.telecomSpecs?.minLinkMarginDb || 3.8} dB (Closed)` },
        { label: "DSN Required", value: `${profile.telecomSpecs?.dsnApertureRequiredM || 34}m Aperture` },
      ],
      offsetExploded: { x: 0, y: -48 },
      renderOrder: 6,
    },
    {
      id: "solar-left",
      name: "Port Articulated Solar Array Deck",
      category: "Power",
      description: "High-efficiency triple-junction GaAs space solar cells capturing low-grazing polar sunlight (1.5° to 10° elevation) to recharge secondary Li-ion bus.",
      specs: [
        { label: "Peak Generation", value: `${profile.powerSpecs?.solarArrayPeakWatts || 850} W` },
        { label: "Array Orientation", value: profile.powerSpecs?.solarArrayOrientation || "Vertical Cylinder" },
        { label: "Base Load Draw", value: `${profile.powerSpecs?.nominalBaseLoadWatts || 320} W` },
        { label: "Net Daylight Margin", value: `+${(profile.powerSpecs?.solarArrayPeakWatts || 850) - (profile.powerSpecs?.nominalBaseLoadWatts || 320)} W` },
      ],
      offsetExploded: { x: -55, y: -20 },
      renderOrder: 4,
    },
    {
      id: "solar-right",
      name: "Starboard Solar Array & Radiator Wing",
      category: "Power",
      description: "Dual solar array wing with integrated louvers to radiate internal electronic heat during noon peaks and minimize cryogenic loss during shadow.",
      specs: [
        { label: "Cell Efficiency", value: "29.5% AM0" },
        { label: "Degradation Factor", value: "0.95 (Lunar Dust Protected)" },
        { label: "Louver State", value: "Cryo-Insulated Sealed" },
      ],
      offsetExploded: { x: 55, y: -20 },
      renderOrder: 5,
    },
    {
      id: "bus",
      name: "Cryogenic Avionics Bus & Gold MLI Foil",
      category: "Thermal",
      description: "Pressurized central core surrounded by 24-layer Multi-Layer Insulation (MLI) protecting flight computers, batteries, and radioisotope heaters.",
      specs: [
        { label: "Dry Mass", value: `${profile.dryMassKg || 1950} kg` },
        { label: "Battery Capacity", value: `${(profile.powerSpecs?.batteryCapacityWh || 12000).toLocaleString()} Wh` },
        { label: "Survival Heaters", value: `${profile.powerSpecs?.survivalHeaterWatts || 150} W` },
        { label: "Max Shadow Survival", value: `${profile.powerSpecs?.allowableBlackoutHours || 54} Hours in PSR` },
        { label: "Min Operating Temp", value: `${profile.thermalLimits?.minOperatingTempKelvin || 40} K (-233°C)` },
      ],
      offsetExploded: { x: 0, y: 0 },
      renderOrder: 3,
    },
    {
      id: "sensors",
      name: "LiDAR & Altimetric Hazard Detection Unit",
      category: "Sensors",
      description: "Pulse laser terrain scanner and optical hazard cameras measuring boulder heights and slope inclination in real-time during descent.",
      specs: [
        { label: "Max Slope Limit", value: `${profile.terrainTolerances?.maxSlopeDeg || 12}° Tolerance` },
        { label: "Obstacle Clearance", value: `< ${profile.terrainTolerances?.maxObstacleHeightCm || 35} cm` },
        { label: "Bearing Capacity", value: `${profile.terrainTolerances?.surfaceBearingStrengthKPa || 18} kPa` },
      ],
      offsetExploded: { x: 0, y: 32 },
      renderOrder: 2,
    },
    {
      id: "propulsion",
      name: "Main Bipropellant Descent Thruster & RCS",
      category: "Propulsion",
      description: "Deep-throttling liquid methane/oxygen engine providing pinpoint soft-landing deceleration into southern polar crater rims.",
      specs: [
        { label: "Wet Launch Mass", value: `${profile.wetMassKg || 5900} kg` },
        { label: "Payload Capacity", value: `${profile.payloadCapacityKg || 500} kg` },
        { label: "Contractor", value: profile.contractor || "Astrobotic / NASA" },
      ],
      offsetExploded: { x: 0, y: 55 },
      renderOrder: 1,
    },
    {
      id: "legs",
      name: "Crushable Quad Landing Struts & Regolith Footpads",
      category: "Structure",
      description: "Four articulated honeycomb-aluminum shock absorbers equipped with wide snowshoe-style regolith footpads to prevent sinking in soft polar dust.",
      specs: [
        { label: "Footprint Area", value: `${profile.dimensions?.landingFootprintM2 || 18.5} m²` },
        { label: "Pad Diameter", value: "38 cm (Regolith Float)" },
        { label: "Touchdown Velocity", value: "< 1.5 m/s Nominal" },
      ],
      offsetExploded: { x: 0, y: 78 },
      renderOrder: 0,
    },
  ];

  const activePart = subAssemblies.find((p) => p.id === (hoveredPartId || selectedPartId)) || subAssemblies[0];

  // Colors for 4-tone isometric rendering (Anatomy craft style)
  const colors = {
    // Top light face
    top: isDarkMode ? "#38bdf8" : "#0284c7",
    // Left half-light face
    left: isDarkMode ? "#0369a1" : "#0369a1",
    // Right shadowed face
    right: isDarkMode ? "#0c4a6e" : "#075985",
    // Gold MLI foil tones
    goldTop: "#fef08a",
    goldLeft: "#f59e0b",
    goldRight: "#b45309",
    // Solar cell tones
    solarTop: "#60a5fa",
    solarLeft: "#2563eb",
    solarRight: "#1e3a8a",
    // Dark mechanics
    mechTop: isDarkMode ? "#64748b" : "#94a3b8",
    mechLeft: isDarkMode ? "#334155" : "#475569",
    mechRight: isDarkMode ? "#1e293b" : "#334155",
  };

  const getOffset = (partId: string) => {
    if (!isExploded) return { x: 0, y: 0 };
    const part = subAssemblies.find((p) => p.id === partId);
    return part ? part.offsetExploded : { x: 0, y: 0 };
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md overflow-hidden flex flex-col select-none">
      {/* Header Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#4e6aff] text-white border-none font-mono text-[10px] tracking-wider px-2 py-0.5">
            ISOMETRIC HARDWARE ANATOMY
          </Badge>
          <span className="font-semibold text-slate-200 truncate">
            {profile.name} &bull; {profile.missionClass}
          </span>
        </div>

        {/* Controls: Exploded View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExploded(!isExploded)}
            className={`h-7 px-2.5 text-xs font-semibold gap-1.5 transition-all ${
              isExploded
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 font-bold"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
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
              setSelectedPartId("antenna");
              setHoveredPartId(null);
            }}
            className="h-7 px-2 text-slate-400 hover:text-white text-xs"
            title="Reset inspection view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Split Layout: Left Isometric Blueprint Stage | Right Live Component Specs */}
      <div className="grid grid-cols-12 gap-0 min-h-[380px]">
        {/* LEFT 7 COLS: Pure Isometric Vector Assembly Canvas */}
        <div className="col-span-12 lg:col-span-7 p-4 bg-slate-950 relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden">
          {/* Engineering Blueprint Grid Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }} />

          {/* Top Status Capsule */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
              NASA CAD / SPEC-V2 COMPLIANT
            </span>
          </div>

          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-500 z-10">
            Hover or click parts to isolate sub-assembly &amp; read specs
          </div>

          {/* SVG Isometric Exploded Diagram */}
          <svg
            viewBox="0 0 460 380"
            className="w-full h-[340px] sm:h-[380px] max-w-[440px] transition-transform duration-300"
          >
            <defs>
              <filter id="glowPart" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Isometric Origin: (230, 190) */}
            <g transform="translate(230, 185)">
              {/* PART 0: LANDING LEGS & FOOTPADS (Render Order: 0) */}
              {(() => {
                const off = getOffset("legs");
                const isHov = (hoveredPartId || selectedPartId) === "legs";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("legs")}
                    onMouseEnter={() => setHoveredPartId("legs")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                    filter={isHov ? "url(#glowPart)" : undefined}
                  >
                    {/* Shadow underneath on ground */}
                    <ellipse cx={0} cy={74} rx={75} ry={16} fill="#020617" opacity={0.7} />

                    {/* Left Struts */}
                    <line x1={-30} y1={25} x2={-75} y2={65} stroke={isHov ? "#38bdf8" : colors.mechTop} strokeWidth={isHov ? 3.5 : 2.5} strokeLinecap="round" />
                    <line x1={-15} y1={35} x2={-75} y2={65} stroke={colors.mechRight} strokeWidth={2} />
                    {/* Footpad Left */}
                    <polygon points="-86,66 -75,61 -64,66 -75,71" fill={isHov ? "#00e5ff" : colors.mechTop} stroke="#0f172a" strokeWidth={1} />

                    {/* Right Struts */}
                    <line x1={30} y1={25} x2={75} y2={65} stroke={isHov ? "#38bdf8" : colors.mechTop} strokeWidth={isHov ? 3.5 : 2.5} strokeLinecap="round" />
                    <line x1={15} y1={35} x2={75} y2={65} stroke={colors.mechRight} strokeWidth={2} />
                    {/* Footpad Right */}
                    <polygon points="64,66 75,61 86,66 75,71" fill={isHov ? "#00e5ff" : colors.mechTop} stroke="#0f172a" strokeWidth={1} />

                    {/* Front Center Strut */}
                    <line x1={0} y1={35} x2={0} y2={70} stroke={isHov ? "#38bdf8" : colors.mechTop} strokeWidth={isHov ? 3.5 : 2.5} />
                    <polygon points="-10,72 0,67 10,72 0,77" fill={isHov ? "#00e5ff" : colors.mechTop} stroke="#0f172a" strokeWidth={1} />
                  </g>
                );
              })()}

              {/* PART 1: MAIN BIPROPELLANT PROPULSION NOZZLE (Render Order: 1) */}
              {(() => {
                const off = getOffset("propulsion");
                const isHov = (hoveredPartId || selectedPartId) === "propulsion";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("propulsion")}
                    onMouseEnter={() => setHoveredPartId("propulsion")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                    filter={isHov ? "url(#glowPart)" : undefined}
                  >
                    {/* Engine Bell */}
                    <path
                      d="M -12 28 L -18 48 L 18 48 L 12 28 Z"
                      fill={isHov ? "#38bdf8" : "#1e293b"}
                      stroke={isHov ? "#00e5ff" : "#475569"}
                      strokeWidth={1.5}
                    />
                    {/* Throat ring */}
                    <ellipse cx={0} cy={28} rx={12} ry={4} fill="#475569" stroke="#94a3b8" strokeWidth={1} />
                    {/* Exit flare lip */}
                    <ellipse cx={0} cy={48} rx={18} ry={5} fill="#0f172a" stroke="#cbd5e1" strokeWidth={1} />
                    {/* Thruster exhaust glow pulse */}
                    <ellipse cx={0} cy={49} rx={14} ry={3.5} fill="#38bdf8" opacity={0.6} />
                  </g>
                );
              })()}

              {/* PART 2: SENSORS & LIDAR SUITE (Render Order: 2) */}
              {(() => {
                const off = getOffset("sensors");
                const isHov = (hoveredPartId || selectedPartId) === "sensors";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("sensors")}
                    onMouseEnter={() => setHoveredPartId("sensors")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                    filter={isHov ? "url(#glowPart)" : undefined}
                  >
                    {/* LiDAR gimbal dome on lower skirt */}
                    <ellipse cx={-18} cy={20} rx={6} ry={4} fill={isHov ? "#00e5ff" : "#0284c7"} stroke="#38bdf8" strokeWidth={1} />
                    <ellipse cx={18} cy={20} rx={6} ry={4} fill={isHov ? "#00e5ff" : "#0284c7"} stroke="#38bdf8" strokeWidth={1} />
                    {/* Optical HazCam lens */}
                    <circle cx={0} cy={24} r={3} fill="#ef4444" stroke="#f87171" strokeWidth={1} />
                  </g>
                );
              })()}

              {/* PART 3: MAIN AVIONICS BUS & GOLD MLI SHIELD (Render Order: 3) */}
              {(() => {
                const off = getOffset("bus");
                const isHov = (hoveredPartId || selectedPartId) === "bus";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("bus")}
                    onMouseEnter={() => setHoveredPartId("bus")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                    filter={isHov ? "url(#glowPart)" : undefined}
                  >
                    {/* Isometric Hexagonal/Cylindrical Core Body */}
                    {/* Right Face */}
                    <polygon
                      points="0,-22 36,-3 36,22 0,5 Z"
                      fill={isHov ? "#f59e0b" : colors.goldRight}
                      stroke="#78350f"
                      strokeWidth={1}
                    />
                    {/* Left Face */}
                    <polygon
                      points="0,-22 -36,-3 -36,22 0,5 Z"
                      fill={isHov ? "#fbbf24" : colors.goldLeft}
                      stroke="#92400e"
                      strokeWidth={1}
                    />
                    {/* Top Deck */}
                    <polygon
                      points="0,-22 36,-3 0,16 -36,-3 Z"
                      fill={isHov ? "#fef08a" : colors.goldTop}
                      stroke="#d97706"
                      strokeWidth={1}
                    />

                    {/* Gold MLI Facet Grid lines */}
                    <line x1={-18} y1={-12} x2={-18} y2={14} stroke="#b45309" strokeWidth={0.7} opacity={0.6} />
                    <line x1={18} y1={-12} x2={18} y2={14} stroke="#92400e" strokeWidth={0.7} opacity={0.6} />
                    <line x1={-36} y1={10} x2={0} y2={2} stroke="#b45309" strokeWidth={0.7} opacity={0.6} />
                    <line x1={0} y1={2} x2={36} y2={10} stroke="#78350f" strokeWidth={0.7} opacity={0.6} />

                    {/* Mission Badge on Hull */}
                    <text x={0} y={-4} textAnchor="middle" fill="#0f172a" fontSize="7" fontFamily="monospace" fontWeight="bold">
                      NASA CLPS
                    </text>
                  </g>
                );
              })()}

              {/* PART 4: PORT SOLAR WING (Render Order: 4) */}
              {(() => {
                const off = getOffset("solar-left");
                const isHov = (hoveredPartId || selectedPartId) === "solar-left";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("solar-left")}
                    onMouseEnter={() => setHoveredPartId("solar-left")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                    filter={isHov ? "url(#glowPart)" : undefined}
                  >
                    {/* Mounting Boom */}
                    <line x1={-36} y1={-3} x2={-52} y2={-12} stroke={colors.mechTop} strokeWidth={2.5} />
                    {/* Solar Panel Blade (Vertical Cylindrical/Flat Deck) */}
                    <polygon
                      points="-52,-52 -44,-48 -44,14 -52,10 Z"
                      fill={isHov ? "#93c5fd" : colors.solarTop}
                      stroke="#1e3a8a"
                      strokeWidth={1}
                    />
                    <polygon
                      points="-44,-48 -32,-42 -32,20 -44,14 Z"
                      fill={isHov ? "#3b82f6" : colors.solarLeft}
                      stroke="#172554"
                      strokeWidth={1}
                    />

                    {/* Solar Grid Lines */}
                    {[-35, -20, -5, 5].map((y, idx) => (
                      <line key={idx} x1={-52} y1={y} x2={-32} y2={y + 10} stroke="#bfdbfe" strokeWidth={0.6} opacity={0.7} />
                    ))}
                  </g>
                );
              })()}

              {/* PART 5: STARBOARD SOLAR WING (Render Order: 5) */}
              {(() => {
                const off = getOffset("solar-right");
                const isHov = (hoveredPartId || selectedPartId) === "solar-right";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("solar-right")}
                    onMouseEnter={() => setHoveredPartId("solar-right")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                    filter={isHov ? "url(#glowPart)" : undefined}
                  >
                    {/* Mounting Boom */}
                    <line x1={36} y1={-3} x2={52} y2={-12} stroke={colors.mechTop} strokeWidth={2.5} />
                    {/* Solar Panel Blade */}
                    <polygon
                      points="32,-42 44,-48 44,14 32,20 Z"
                      fill={isHov ? "#3b82f6" : colors.solarLeft}
                      stroke="#172554"
                      strokeWidth={1}
                    />
                    <polygon
                      points="44,-48 52,-52 52,10 44,14 Z"
                      fill={isHov ? "#93c5fd" : colors.solarTop}
                      stroke="#1e3a8a"
                      strokeWidth={1}
                    />

                    {/* Solar Grid Lines */}
                    {[-35, -20, -5, 5].map((y, idx) => (
                      <line key={idx} x1={32} y1={y + 10} x2={52} y2={y} stroke="#bfdbfe" strokeWidth={0.6} opacity={0.7} />
                    ))}
                  </g>
                );
              })()}

              {/* PART 6: HIGH-GAIN PARABOLIC DISH ANTENNA (Render Order: 6) */}
              {(() => {
                const off = getOffset("antenna");
                const isHov = (hoveredPartId || selectedPartId) === "antenna";
                return (
                  <g
                    transform={`translate(${off.x}, ${off.y})`}
                    onClick={() => setSelectedPartId("antenna")}
                    onMouseEnter={() => setHoveredPartId("antenna")}
                    onMouseLeave={() => setHoveredPartId(null)}
                    className="cursor-pointer transition-all duration-300"
                    filter={isHov ? "url(#glowPart)" : undefined}
                  >
                    {/* Antenna Mast on Top Deck */}
                    <line x1={0} y1={-20} x2={0} y2={-42} stroke={isHov ? "#00e5ff" : colors.mechTop} strokeWidth={isHov ? 3 : 2} />
                    {/* Gimbal Joint Pivot Sphere */}
                    <circle cx={0} cy={-42} r={3} fill="#0284c7" stroke="#38bdf8" strokeWidth={1} />

                    {/* Parabolic Reflector Dish (Angled toward Earth) */}
                    <ellipse
                      cx={-2}
                      cy={-54}
                      rx={20}
                      ry={9}
                      fill={isHov ? "#00e5ff" : isDarkMode ? "#e2e8f0" : "#f8fafc"}
                      stroke="#0f172a"
                      strokeWidth={1.5}
                      transform="rotate(-15, -2, -54)"
                    />
                    {/* Dish Inner Cavity Shadow */}
                    <ellipse
                      cx={-2}
                      cy={-54}
                      rx={17}
                      ry={6.5}
                      fill={isHov ? "#38bdf8" : isDarkMode ? "#94a3b8" : "#cbd5e1"}
                      stroke="#475569"
                      strokeWidth={0.7}
                      transform="rotate(-15, -2, -54)"
                    />
                    {/* Feed Horn Pod */}
                    <line x1={-2} y1={-54} x2={-6} y2={-64} stroke="#0284c7" strokeWidth={1.5} />
                    <circle cx={-6} cy={-64} r={2} fill="#ef4444" />

                    {/* Active Radio Beam Ripple */}
                    <ellipse cx={-12} cy={-76} rx={12} ry={4} fill="none" stroke="#38bdf8" strokeWidth={1.2} strokeDasharray="3 3" opacity={0.8} />
                  </g>
                );
              })()}
            </g>
          </svg>
        </div>

        {/* RIGHT 5 COLS: Real-Time Sub-Assembly Telemetry & Blueprint Specs */}
        <div className="col-span-12 lg:col-span-5 p-4 flex flex-col justify-between bg-slate-50 dark:bg-slate-900/50 space-y-3">
          <div className="space-y-3">
            {/* Active Component Title & Category Badge */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-mono px-2 py-0 mb-1 border-blue-400 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40"
                >
                  {activePart.category} Sub-Assembly
                </Badge>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {activePart.name}
                </h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#4e6aff] shrink-0">
                {activePart.category === "Power" && <Sun className="w-4 h-4 text-amber-500" />}
                {activePart.category === "Telecom" && <Radio className="w-4 h-4 text-cyan-500" />}
                {activePart.category === "Thermal" && <Zap className="w-4 h-4 text-amber-500" />}
                {activePart.category === "Sensors" && <Crosshair className="w-4 h-4 text-emerald-500" />}
                {activePart.category === "Propulsion" && <Flame className="w-4 h-4 text-rose-500" />}
                {activePart.category === "Structure" && <Layers className="w-4 h-4 text-blue-500" />}
              </div>
            </div>

            {/* Scientific Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {activePart.description}
            </p>

            {/* Numerical Telemetry Spec Matrix */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block font-sans">
                Aerospace Telemetry Specifications:
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

          {/* Quick Sub-Assembly Selector Chips */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-500 font-sans block">Select Component to Inspect:</span>
            <div className="flex flex-wrap gap-1">
              {subAssemblies.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPartId(p.id)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                    (hoveredPartId || selectedPartId) === p.id
                      ? "bg-[#4e6aff] text-white font-bold shadow-xs"
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
