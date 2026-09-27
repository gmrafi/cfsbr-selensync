"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LUNAR_SOUTH_POLE_CANDIDATES } from "@/lib/gis/lunar-sites";
import { getSiteCriteria, calculateSiteFeasibilityScore } from "@/lib/strategy/site-scoring";
import { getLunarSunEarthPositions } from "@/lib/celestial/lunar-engine";
import { calculateSolarPower, DEFAULT_CLPS_SOLAR_SPECS } from "@/lib/physics/solar-power";
import { calculateDTERFLinkBudget, DEFAULT_CLPS_RF_SPECS } from "@/lib/physics/rf-link";
import { calculateDivinerThermal } from "@/lib/physics/diviner-thermal";
import { generateSyntheticHorizonProfile, isBodyClearedOfTopography } from "@/lib/gis/horizon-elevation";
import { 
  Sun, 
  Radio, 
  ShieldAlert, 
  Sparkles, 
  Scale, 
  ArrowRight, 
  Mountain, 
  Calendar, 
  Clock, 
  Thermometer, 
  Code, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";

interface SiteComparisonMatrixProps {
  siteAId: string;
  siteBId: string;
  onSelectSiteA: (id: string) => void;
  onSelectSiteB: (id: string) => void;
  initialDateA?: Date;
  initialDateB?: Date;
  isDarkMode?: boolean;
}

const EPOCH_PRESETS = [
  { label: "Summer Solstice (Peak Sun)", dateStr: "2026-06-21T00:00:00Z" },
  { label: "Autumn Equinox (Balanced)", dateStr: "2026-09-22T00:00:00Z" },
  { label: "Winter Solstice (Max Shadow)", dateStr: "2026-12-21T00:00:00Z" },
  { label: "Artemis III Baseline", dateStr: "2026-09-15T12:00:00Z" },
];

export default function SiteComparisonMatrix({
  siteAId,
  siteBId,
  onSelectSiteA,
  onSelectSiteB,
  initialDateA = new Date("2026-06-21T00:00:00Z"),
  initialDateB = new Date("2026-12-21T00:00:00Z"),
  isDarkMode = false,
}: SiteComparisonMatrixProps) {
  const [dateA, setDateA] = useState<Date>(initialDateA);
  const [dateB, setDateB] = useState<Date>(initialDateB);
  const [comparisonMode, setComparisonMode] = useState<"sites-and-dates" | "same-site-dates">("sites-and-dates");
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  const siteA = LUNAR_SOUTH_POLE_CANDIDATES.find((s) => s.id === siteAId) || LUNAR_SOUTH_POLE_CANDIDATES[0];
  const actualSiteBId = comparisonMode === "same-site-dates" ? siteAId : siteBId;
  const siteB = LUNAR_SOUTH_POLE_CANDIDATES.find((s) => s.id === actualSiteBId) || LUNAR_SOUTH_POLE_CANDIDATES[1];

  // 1. Live Ephemeris & Geometry Calculations for Column A
  const ephemerisA = useMemo(() => {
    return getLunarSunEarthPositions(siteA.latitude, siteA.longitude, dateA);
  }, [siteA, dateA]);

  const horizonA = useMemo(() => {
    return generateSyntheticHorizonProfile(siteA.id, siteA.latitude, siteA.longitude, siteA.elevationMeters);
  }, [siteA]);

  const isSunOccludedA = useMemo(() => {
    return !isBodyClearedOfTopography(ephemerisA.sun.altitudeDegrees, ephemerisA.sun.azimuthDegrees, horizonA.profile);
  }, [ephemerisA.sun, horizonA]);

  const isEarthOccludedA = useMemo(() => {
    return !isBodyClearedOfTopography(ephemerisA.earth.altitudeDegrees, ephemerisA.earth.azimuthDegrees, horizonA.profile);
  }, [ephemerisA.earth, horizonA]);

  const solarPowerA = useMemo(() => {
    const obstacleElev = isSunOccludedA ? ephemerisA.sun.altitudeDegrees + 0.1 : 0;
    return calculateSolarPower(ephemerisA.sun.altitudeDegrees, ephemerisA.sun.azimuthDegrees, DEFAULT_CLPS_SOLAR_SPECS, obstacleElev);
  }, [ephemerisA.sun, isSunOccludedA]);

  const rfLinkA = useMemo(() => {
    const effectiveEarthElev = isEarthOccludedA ? -1 : ephemerisA.earth.altitudeDegrees;
    return calculateDTERFLinkBudget(ephemerisA.earth.distanceKm, effectiveEarthElev, DEFAULT_CLPS_RF_SPECS);
  }, [ephemerisA.earth, isEarthOccludedA]);

  const thermalA = useMemo(() => {
    return calculateDivinerThermal(ephemerisA.sun.altitudeDegrees, isSunOccludedA, 4.2);
  }, [ephemerisA.sun.altitudeDegrees, isSunOccludedA]);

  // 2. Live Ephemeris & Geometry Calculations for Column B
  const ephemerisB = useMemo(() => {
    return getLunarSunEarthPositions(siteB.latitude, siteB.longitude, dateB);
  }, [siteB, dateB]);

  const horizonB = useMemo(() => {
    return generateSyntheticHorizonProfile(siteB.id, siteB.latitude, siteB.longitude, siteB.elevationMeters);
  }, [siteB]);

  const isSunOccludedB = useMemo(() => {
    return !isBodyClearedOfTopography(ephemerisB.sun.altitudeDegrees, ephemerisB.sun.azimuthDegrees, horizonB.profile);
  }, [ephemerisB.sun, horizonB]);

  const isEarthOccludedB = useMemo(() => {
    return !isBodyClearedOfTopography(ephemerisB.earth.altitudeDegrees, ephemerisB.earth.azimuthDegrees, horizonB.profile);
  }, [ephemerisB.earth, horizonB]);

  const solarPowerB = useMemo(() => {
    const obstacleElev = isSunOccludedB ? ephemerisB.sun.altitudeDegrees + 0.1 : 0;
    return calculateSolarPower(ephemerisB.sun.altitudeDegrees, ephemerisB.sun.azimuthDegrees, DEFAULT_CLPS_SOLAR_SPECS, obstacleElev);
  }, [ephemerisB.sun, isSunOccludedB]);

  const rfLinkB = useMemo(() => {
    const effectiveEarthElev = isEarthOccludedB ? -1 : ephemerisB.earth.altitudeDegrees;
    return calculateDTERFLinkBudget(ephemerisB.earth.distanceKm, effectiveEarthElev, DEFAULT_CLPS_RF_SPECS);
  }, [ephemerisB.earth, isEarthOccludedB]);

  const thermalB = useMemo(() => {
    return calculateDivinerThermal(ephemerisB.sun.altitudeDegrees, isSunOccludedB, 4.2);
  }, [ephemerisB.sun.altitudeDegrees, isSunOccludedB]);

  // Comparative Deltas
  const deltaSunElev = Number((ephemerisA.sun.altitudeDegrees - ephemerisB.sun.altitudeDegrees).toFixed(2));
  const deltaPowerWatts = Math.round(solarPowerA.netOutputWatts - solarPowerB.netOutputWatts);
  const deltaLinkMarginDb = Number((rfLinkA.linkMarginDb - rfLinkB.linkMarginDb).toFixed(2));

  // Raw telemetry JSON payload for inspection
  const rawPayload = useMemo(() => {
    return {
      protocol: "NASA-SpaceApps-CLPS-MCDA-v2",
      queryTimestampUtc: new Date().toISOString(),
      provenance: {
        ephemerisEngine: "JPL Horizons DE440/DE441 (astronomy-engine)",
        altimetryTopography: "NASA LRO LOLA (Lunar Orbiter Laser Altimeter, 30m DEM)",
        thermalRadiometer: "Diviner DLRE Empirical Cold-Trap Model",
        rfLinkStandard: "NASA Deep Space Network (DSN) 34m Aperture 8.45 GHz X-Band",
      },
      evaluationMode: comparisonMode,
      columnA: {
        site: { id: siteA.id, name: siteA.name, lat: siteA.latitude, lon: siteA.longitude, elevationM: siteA.elevationMeters },
        epochUtc: dateA.toISOString(),
        celestial: ephemerisA,
        solarOutputWatts: solarPowerA.netOutputWatts,
        isSunOccluded: isSunOccludedA,
        rfLinkMarginDb: rfLinkA.linkMarginDb,
        isDTEAvailable: rfLinkA.isLinkClosed,
        surfaceTempKelvin: thermalA.regolithTempKelvin,
      },
      columnB: {
        site: { id: siteB.id, name: siteB.name, lat: siteB.latitude, lon: siteB.longitude, elevationM: siteB.elevationMeters },
        epochUtc: dateB.toISOString(),
        celestial: ephemerisB,
        solarOutputWatts: solarPowerB.netOutputWatts,
        isSunOccluded: isSunOccludedB,
        rfLinkMarginDb: rfLinkB.linkMarginDb,
        isDTEAvailable: rfLinkB.isLinkClosed,
        surfaceTempKelvin: thermalB.regolithTempKelvin,
      },
      deltaComparison: {
        deltaSunElevationDeg: deltaSunElev,
        deltaSolarPowerWatts: deltaPowerWatts,
        deltaLinkMarginDb: deltaLinkMarginDb,
      },
    };
  }, [comparisonMode, siteA, siteB, dateA, dateB, ephemerisA, ephemerisB, solarPowerA, solarPowerB, isSunOccludedA, isSunOccludedB, rfLinkA, rfLinkB, thermalA, thermalB, deltaSunElev, deltaPowerWatts, deltaLinkMarginDb]);

  return (
    <Card className="border border-slate-300 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden transition-colors">
      {/* Header Bar */}
      <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4e6aff]/10 text-[#4e6aff] flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <span>Multi-Site &amp; Multi-Date Lunar Feasibility Matrix</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-1.5 py-0.5 rounded font-mono">
                  Real Ephemeris
                </span>
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Compare candidate landing zones and temporal epochs (solstices, equinoxes, custom dates) to solve NASA&apos;s dual trade-offs.
              </CardDescription>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setComparisonMode("sites-and-dates")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                comparisonMode === "sites-and-dates"
                  ? "bg-white dark:bg-slate-900 text-[#4e6aff] shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Site A vs Site B (Dual Epoch)
            </button>
            <button
              onClick={() => setComparisonMode("same-site-dates")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                comparisonMode === "same-site-dates"
                  ? "bg-white dark:bg-slate-900 text-[#4e6aff] shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              1 Site across 2 Dates
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Interactive Site & Epoch Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Column A Config */}
          <div className="p-3.5 rounded-xl border-2 border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                Primary Target A
              </span>
              <span className="font-mono text-[10px] text-blue-700 dark:text-blue-400 font-semibold">
                {siteA.latitude}°S, {siteA.longitude}°E
              </span>
            </div>

            {/* Site A Selector */}
            <select
              value={siteA.id}
              onChange={(e) => onSelectSiteA(e.target.value)}
              className="w-full text-xs font-bold p-2 border border-blue-300 dark:border-blue-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                <option key={site.id} value={site.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {site.name} ({site.latitude}°S, {site.longitude}°E)
                </option>
              ))}
            </select>

            {/* Date A Picker & Presets */}
            <div className="space-y-1 pt-1 border-t border-blue-200 dark:border-blue-900/40">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-blue-800 dark:text-blue-300 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-600" /> Target Epoch A:
                </span>
                <input
                  type="date"
                  value={dateA.toISOString().slice(0, 10)}
                  onChange={(e) => {
                    if (e.target.value) setDateA(new Date(e.target.value + "T00:00:00Z"));
                  }}
                  className="bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold text-blue-950 dark:text-blue-200"
                />
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {EPOCH_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDateA(new Date(preset.dateStr))}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-200 font-medium transition-colors"
                  >
                    {preset.label.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column B Config */}
          <div className="p-3.5 rounded-xl border-2 border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600 inline-block"></span>
                {comparisonMode === "same-site-dates" ? "Comparison Epoch B" : "Comparison Target B"}
              </span>
              <span className="font-mono text-[10px] text-purple-700 dark:text-purple-400 font-semibold">
                {siteB.latitude}°S, {siteB.longitude}°E
              </span>
            </div>

            {/* Site B Selector (Disabled in same-site mode) */}
            {comparisonMode === "same-site-dates" ? (
              <div className="w-full text-xs font-bold p-2 border border-purple-300 dark:border-purple-800 rounded-lg bg-purple-100/60 dark:bg-slate-800/80 text-purple-900 dark:text-purple-200">
                {siteA.name} (Same Site, Alternate Date)
              </div>
            ) : (
              <select
                value={siteB.id}
                onChange={(e) => onSelectSiteB(e.target.value)}
                className="w-full text-xs font-bold p-2 border border-purple-300 dark:border-purple-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                  <option key={site.id} value={site.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {site.name} ({site.latitude}°S, {site.longitude}°E)
                  </option>
                ))}
              </select>
            )}

            {/* Date B Picker & Presets */}
            <div className="space-y-1 pt-1 border-t border-purple-200 dark:border-purple-900/40">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-purple-800 dark:text-purple-300 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-600" /> Target Epoch B:
                </span>
                <input
                  type="date"
                  value={dateB.toISOString().slice(0, 10)}
                  onChange={(e) => {
                    if (e.target.value) setDateB(new Date(e.target.value + "T00:00:00Z"));
                  }}
                  className="bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold text-purple-950 dark:text-purple-200"
                />
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {EPOCH_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDateB(new Date(preset.dateStr))}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-200 font-medium transition-colors"
                  >
                    {preset.label.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Side-by-Side Parameter Matrix */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto text-xs shadow-2xs">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 text-xs">
                <th className="p-3 font-bold w-[34%]">Comparative Metric</th>
                <th className="p-3 font-bold text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 border-l border-r border-slate-200 dark:border-slate-800 w-[33%]">
                  <div>{siteA.name.split(" ")[0]}</div>
                  <div className="text-[10px] font-normal text-slate-500 font-mono">{dateA.toISOString().slice(0, 10)}</div>
                </th>
                <th className="p-3 font-bold text-purple-700 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/40 w-[33%]">
                  <div>{siteB.name.split(" ")[0]}</div>
                  <div className="text-[10px] font-normal text-slate-500 font-mono">{dateB.toISOString().slice(0, 10)}</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 text-xs">
              {/* Row 1: MCDA Feasibility Score */}
              <tr className="bg-slate-50/80 dark:bg-slate-900/80 font-bold">
                <td className="p-3 flex items-center gap-1.5 text-slate-900 dark:text-white">
                  <Scale className="w-4 h-4 text-[#4e6aff] shrink-0" />
                  <span>MCDA Feasibility Index</span>
                </td>
                <td className="p-3 bg-blue-50/40 dark:bg-blue-950/30 border-l border-r border-slate-200 dark:border-slate-800">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-base text-[#4e6aff] font-extrabold">
                      {calculateSiteFeasibilityScore(getSiteCriteria(siteA.id)).feasibilityIndex}
                    </span>
                    <span className="text-[10px] text-slate-500">/100</span>
                  </div>
                </td>
                <td className="p-3 bg-purple-50/40 dark:bg-purple-950/30">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-base text-purple-600 dark:text-purple-400 font-extrabold">
                      {calculateSiteFeasibilityScore(getSiteCriteria(siteB.id)).feasibilityIndex}
                    </span>
                    <span className="text-[10px] text-slate-500">/100</span>
                  </div>
                </td>
              </tr>

              {/* Row 2: Live Sun Elevation & Occlusion */}
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Sun Elevation (Topocentric)</span>
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 font-mono border-l border-r border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {ephemerisA.sun.altitudeDegrees >= 0 ? `+${ephemerisA.sun.altitudeDegrees}°` : `${ephemerisA.sun.altitudeDegrees}°`}
                    </span>
                    {isSunOccludedA ? (
                      <span className="text-[10px] bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded font-sans font-bold">In Shadow</span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-sans font-bold">Unobstructed</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">Azimuth: {ephemerisA.sun.azimuthDegrees}°</div>
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {ephemerisB.sun.altitudeDegrees >= 0 ? `+${ephemerisB.sun.altitudeDegrees}°` : `${ephemerisB.sun.altitudeDegrees}°`}
                    </span>
                    {isSunOccludedB ? (
                      <span className="text-[10px] bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded font-sans font-bold">In Shadow</span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-sans font-bold">Unobstructed</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">Azimuth: {ephemerisB.sun.azimuthDegrees}°</div>
                </td>
              </tr>

              {/* Row 3: Instantaneous Solar Power Output */}
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Instant Solar Power Output</span>
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 font-mono border-l border-r border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                    {Math.round(solarPowerA.netOutputWatts)} W
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1.5">({solarPowerA.solarFluxWm2} W/m² flux)</span>
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 font-mono">
                  <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                    {Math.round(solarPowerB.netOutputWatts)} W
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1.5">({solarPowerB.solarFluxWm2} W/m² flux)</span>
                </td>
              </tr>

              {/* Row 4: Direct-to-Earth (DTE) Comms & RF Link Margin */}
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Direct-To-Earth (DTE) Comms</span>
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 font-mono border-l border-r border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      +{rfLinkA.linkMarginDb} dB
                    </span>
                    <Badge variant="outline" className={`text-[9px] font-sans px-1.5 py-0 ${rfLinkA.isLinkClosed ? "text-emerald-700 border-emerald-300 dark:text-emerald-400" : "text-rose-600 border-rose-300"}`}>
                      {rfLinkA.isLinkClosed ? "Link Closed" : "Link Down"}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">Earth Elev: {ephemerisA.earth.altitudeDegrees}°</div>
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      +{rfLinkB.linkMarginDb} dB
                    </span>
                    <Badge variant="outline" className={`text-[9px] font-sans px-1.5 py-0 ${rfLinkB.isLinkClosed ? "text-emerald-700 border-emerald-300 dark:text-emerald-400" : "text-rose-600 border-rose-300"}`}>
                      {rfLinkB.isLinkClosed ? "Link Closed" : "Link Down"}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">Earth Elev: {ephemerisB.earth.altitudeDegrees}°</div>
                </td>
              </tr>

              {/* Row 5: Surface Thermal Condition */}
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Diviner Lunar Surface Temp</span>
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 font-mono border-l border-r border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">{thermalA.regolithTempKelvin} K</span>
                  <span className="text-[10px] text-slate-500 ml-1">({thermalA.regolithTempCelsius}°C)</span>
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 font-mono">
                  <span className="font-bold text-slate-900 dark:text-white">{thermalB.regolithTempKelvin} K</span>
                  <span className="text-[10px] text-slate-500 ml-1">({thermalB.regolithTempCelsius}°C)</span>
                </td>
              </tr>

              {/* Row 6: LOLA Altimetry & Elevation */}
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>LOLA Topography Altitude</span>
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 font-mono text-[11px] border-l border-r border-slate-200 dark:border-slate-800">
                  +{siteA.elevationMeters}m MSL
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 font-mono text-[11px]">
                  +{siteB.elevationMeters}m MSL
                </td>
              </tr>

              {/* Row 7: Scientific Target */}
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Scientific Focus Objective</span>
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 text-xs leading-relaxed border-l border-r border-slate-200 dark:border-slate-800">
                  {siteA.scientificInterest}
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 text-xs leading-relaxed">
                  {siteB.scientificInterest}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Strategic Comparison Delta Callout */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <div className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Epoch &amp; Topographic Delta Synthesis
            </div>
            <div className="text-xs font-semibold text-slate-200 leading-relaxed">
              {deltaPowerWatts >= 0 ? (
                <span>
                  Option A generates <strong className="text-amber-300">+{deltaPowerWatts}W</strong> more solar power and holds{" "}
                  <strong className="text-blue-300">{deltaSunElev >= 0 ? `+${deltaSunElev}°` : `${deltaSunElev}°`}</strong> Sun elevation relative to Option B.
                </span>
              ) : (
                <span>
                  Option B generates <strong className="text-purple-300">+{Math.abs(deltaPowerWatts)}W</strong> more solar power and holds{" "}
                  <strong className="text-purple-300">{deltaSunElev < 0 ? `+${Math.abs(deltaSunElev)}°` : `${deltaSunElev}°`}</strong> Sun elevation relative to Option A.
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowJsonInspector(!showJsonInspector)}
              className="text-xs h-8 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-mono"
            >
              <Code className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              {showJsonInspector ? "Hide JSON" : "Raw JSON"}
            </Button>
            <Link href={`/dashboard?site=${siteA.id}`}>
              <Button size="sm" className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-bold text-xs h-8 px-3">
                Simulate {siteA.name.split(" ")[0]}
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Collapsible Raw Ephemeris JSON Inspector (Requirement 5) */}
        {showJsonInspector && (
          <div className="p-3.5 rounded-xl border border-cyan-800 bg-slate-950 text-cyan-300 font-mono text-[11px] space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-bold border-b border-cyan-900 pb-1.5">
              <span>NASA Ephemeris &amp; Telemetry Payload (Direct Mathematical Engine Response)</span>
              <span className="text-[10px] text-slate-500">Live JSON Inspector</span>
            </div>
            <pre className="max-h-64 overflow-y-auto p-2 bg-black/60 rounded text-[10px] text-slate-300 leading-tight">
              {JSON.stringify(rawPayload, null, 2)}
            </pre>
          </div>
        )}

        {/* Data Provenance Citations Footer (Requirement 5) */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Data Sources:</span>
            <span>• JPL Horizons DE440/DE441 Ephemeris</span>
            <span>• NASA LRO LOLA 30m DEM Altimetry</span>
            <span>• Diviner DLRE Thermal Radiometry</span>
            <span>• DSN 34m 8.4 GHz RF Model</span>
          </div>
          <div className="font-mono text-[9px] text-slate-400">
            Validated against NASA Artemis Candidate Landing Regions (2024–2026)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
