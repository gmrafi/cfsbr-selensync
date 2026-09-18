"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sun,
  Globe,
  Radio,
  Zap,
  Mountain,
  Download,
  Sliders,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { getLunarSunEarthPositions, generateLunarEphemerisSeries } from "@/lib/celestial/lunar-engine";
import { calculateSolarPower, DEFAULT_CLPS_SOLAR_SPECS } from "@/lib/physics/solar-power";
import { calculateDTERFLinkBudget, DEFAULT_CLPS_RF_SPECS } from "@/lib/physics/rf-link";
import { generateSyntheticHorizonProfile, isBodyClearedOfTopography } from "@/lib/gis/horizon-elevation";

import LunarHorizonPolarPlot from "./lunar-horizon-polar-plot";
import SiteComparisonMatrix from "./site-comparison-matrix";
import TimeScrubber from "./time-scrubber";
import TelemetryCharts, { TelemetryDataPoint } from "./telemetry-charts";

export default function LunarMissionDashboard() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("malapert-mountain");
  const [siteBId, setSiteBId] = useState<string>("shackleton-ridge");
  const [timeOffsetHours, setTimeOffsetHours] = useState<number>(0);
  const [maxTimeHours, setMaxTimeHours] = useState<number>(168); // Default 7 days
  const [isProMode, setIsProMode] = useState<boolean>(true);
  const [baseDate, setBaseDate] = useState<Date>(new Date("2026-06-21T00:00:00Z")); // Lunar solstice baseline

  // Custom coordinate overrides
  const [customLat, setCustomLat] = useState<number>(-85.99);
  const [customLon, setCustomLon] = useState<number>(2.93);
  const [isCustomCoords, setIsCustomCoords] = useState<boolean>(false);

  const activeSite = useMemo(() => {
    if (isCustomCoords) {
      return {
        id: "custom-site",
        name: `Custom Landing Site (${(customLat ?? -85.99).toFixed(2)}°S, ${(customLon ?? 2.93).toFixed(2)}°E)`,
        latitude: customLat ?? -85.99,
        longitude: customLon ?? 2.93,
        elevationMeters: 4000,
        description: "User defined coordinate at lunar south pole.",
        scientificInterest: "Custom topographic assessment zone.",
        solarIlluminationPotential: "Dynamic calculated profile",
        dteDirectToEarthStatus: "Dynamic topocentric LOS",
        targetMissions: ["Custom CLPS Architecture"],
      } as LunarCandidateSite;
    }
    return LUNAR_SOUTH_POLE_CANDIDATES.find((s) => s.id === selectedSiteId) || LUNAR_SOUTH_POLE_CANDIDATES[0];
  }, [selectedSiteId, isCustomCoords, customLat, customLon]);

  // Current simulated timestamp
  const simulatedDate = useMemo(() => {
    return new Date(baseDate.getTime() + timeOffsetHours * 3600 * 1000);
  }, [baseDate, timeOffsetHours]);

  // Topographic horizon obstacle mask (360 degrees)
  const horizonProfileResult = useMemo(() => {
    return generateSyntheticHorizonProfile(
      activeSite.id,
      activeSite.latitude,
      activeSite.longitude,
      activeSite.elevationMeters
    );
  }, [activeSite]);

  // Celestial instant calculations
  const celestialData = useMemo(() => {
    return getLunarSunEarthPositions(activeSite.latitude, activeSite.longitude, simulatedDate);
  }, [activeSite, simulatedDate]);

  // Check topographic occlusion
  const isSunOccluded = useMemo(() => {
    return !isBodyClearedOfTopography(
      celestialData.sun.altitudeDegrees,
      celestialData.sun.azimuthDegrees,
      horizonProfileResult.profile
    );
  }, [celestialData.sun, horizonProfileResult]);

  const isEarthOccluded = useMemo(() => {
    return !isBodyClearedOfTopography(
      celestialData.earth.altitudeDegrees,
      celestialData.earth.azimuthDegrees,
      horizonProfileResult.profile
    );
  }, [celestialData.earth, horizonProfileResult]);

  // Physics models
  const solarOutput = useMemo(() => {
    const effectiveSunElev = isSunOccluded ? 0 : celestialData.sun.altitudeDegrees;
    return calculateSolarPower(effectiveSunElev, celestialData.sun.azimuthDegrees, DEFAULT_CLPS_SOLAR_SPECS);
  }, [celestialData.sun, isSunOccluded]);

  const rfLinkOutput = useMemo(() => {
    const effectiveEarthElev = isEarthOccluded ? -1 : celestialData.earth.altitudeDegrees;
    return calculateDTERFLinkBudget(celestialData.earth.distanceKm, effectiveEarthElev, DEFAULT_CLPS_RF_SPECS);
  }, [celestialData.earth, isEarthOccluded]);

  // Time-series ephemeris dataset for Recharts
  const telemetrySeries = useMemo(() => {
    const ephemeris = generateLunarEphemerisSeries(
      activeSite.latitude,
      activeSite.longitude,
      baseDate,
      maxTimeHours,
      Math.max(1, Math.round(maxTimeHours / 48)) // Adaptive resolution step
    );

    return ephemeris.map((pt, idx) => {
      const hoursFromStart = idx * Math.max(1, Math.round(maxTimeHours / 48));
      const ptSunClear = isBodyClearedOfTopography(pt.sun.altitudeDegrees, pt.sun.azimuthDegrees, horizonProfileResult.profile);
      const ptEarthClear = isBodyClearedOfTopography(pt.earth.altitudeDegrees, pt.earth.azimuthDegrees, horizonProfileResult.profile);

      const pwr = calculateSolarPower(ptSunClear ? pt.sun.altitudeDegrees : 0, pt.sun.azimuthDegrees, DEFAULT_CLPS_SOLAR_SPECS);
      const rf = calculateDTERFLinkBudget(pt.earth.distanceKm, ptEarthClear ? pt.earth.altitudeDegrees : -1, DEFAULT_CLPS_RF_SPECS);

      return {
        hour: hoursFromStart,
        timeLabel: `+${hoursFromStart}h`,
        sunElevationDeg: pt.sun.altitudeDegrees,
        earthElevationDeg: pt.earth.altitudeDegrees,
        solarWatts: pwr.netOutputWatts,
        rfLinkMarginDb: rf.linkMarginDb,
        isDTEAvailable: rf.isLinkClosed,
      } as TelemetryDataPoint;
    });
  }, [activeSite, baseDate, maxTimeHours, horizonProfileResult]);

  const exportMissionReport = () => {
    const report = {
      platform: "SelenSync - CLPS Lunar South Pole Mission Browser",
      generatedAtUTC: new Date().toISOString(),
      site: activeSite,
      simulatedInstantUTC: simulatedDate.toISOString(),
      celestialTelemetry: celestialData,
      solarPowerOutput: solarOutput,
      rfLinkBudget: rfLinkOutput,
      horizonProfile: horizonProfileResult,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selensync-mission-plan-${activeSite.id}-${simulatedDate.toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Workspace Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
        {/* Preset Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Landing Site:</span>
          </div>

          <select
            value={isCustomCoords ? "custom" : selectedSiteId}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setIsCustomCoords(true);
              } else {
                setIsCustomCoords(false);
                setSelectedSiteId(e.target.value);
              }
            }}
            className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} ({site.latitude}°S, {site.longitude}°E)
              </option>
            ))}
            <option value="custom">⚙️ Custom Coordinates (-80° to -90°S)...</option>
          </select>

          {isCustomCoords && (
            <div className="flex items-center gap-2 bg-blue-50 p-1.5 rounded-lg border border-blue-200">
              <span className="text-xs text-blue-800 font-semibold">Lat:</span>
              <Input
                type="number"
                min={-90}
                max={-80}
                step={0.01}
                value={customLat}
                onChange={(e) => setCustomLat(Number(e.target.value))}
                className="w-20 h-7 text-xs bg-white"
              />
              <span className="text-xs text-blue-800 font-semibold">Lon:</span>
              <Input
                type="number"
                min={-180}
                max={180}
                step={0.01}
                value={customLon}
                onChange={(e) => setCustomLon(Number(e.target.value))}
                className="w-20 h-7 text-xs bg-white"
              />
            </div>
          )}
        </div>

        {/* Pro / Lite Toggle & Export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setIsProMode(false)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                !isProMode ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-600"
              }`}
            >
              Lite / Educator
            </button>
            <button
              onClick={() => setIsProMode(true)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                isProMode ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-600"
              }`}
            >
              Pro / Engineer
            </button>
          </div>

          <Button
            onClick={exportMissionReport}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export Mission Plan
          </Button>
        </div>
      </div>

      {/* Real-Time Telemetry Quick Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Sun Elevation & Illumination */}
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Solar Elevation (θ_elev)</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {(celestialData?.sun?.altitudeDegrees ?? 0) > 0 ? `+${(celestialData?.sun?.altitudeDegrees ?? 0).toFixed(2)}°` : `${(celestialData?.sun?.altitudeDegrees ?? 0).toFixed(2)}°`}
            </div>
            <div className="text-[11px] mt-1 flex items-center gap-1 font-medium">
              {isSunOccluded ? (
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Topographic Shadow
                </span>
              ) : (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Direct Sun Clear
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Solar Generated Power Output */}
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Array Power Output</span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {(solarOutput?.netOutputWatts ?? 0).toFixed(1)} <span className="text-sm font-normal text-slate-500">Watts</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              Flux: {solarOutput?.solarFluxWm2 ?? 1361} W/m² (AM0)
            </div>
          </CardContent>
        </Card>

        {/* Earth Elevation & Direct-to-Earth Vector */}
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Earth Horizon Elevation</span>
              <Globe className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {(celestialData?.earth?.altitudeDegrees ?? 0) > 0 ? `+${(celestialData?.earth?.altitudeDegrees ?? 0).toFixed(2)}°` : `${(celestialData?.earth?.altitudeDegrees ?? 0).toFixed(2)}°`}
            </div>
            <div className="text-[11px] mt-1 flex items-center gap-1 font-medium">
              {isEarthOccluded ? (
                <span className="text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> RF Line-of-Sight Occluded
                </span>
              ) : (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> DTE Vector Open
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* DSN Link Margin */}
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">DSN 34m RF Link Margin</span>
              <Radio className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {rfLinkOutput?.isLinkClosed ? `+${(rfLinkOutput?.linkMarginDb ?? 0).toFixed(1)} dB` : "NO LINK"}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              FSPL: {rfLinkOutput?.freeSpacePathLossDb ?? 0} dB @ 8.45 GHz
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANE (40% - 5 Columns): 3D Lunar Topographic Viewer & Comparison Matrix */}
        <div className="lg:col-span-5 space-y-6">
          {/* Lunar South Pole Target Card */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-900 text-white pb-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-600 text-white text-xs">Artemis Target Zone</Badge>
                <span className="text-xs text-slate-400 font-mono">Elev: {activeSite.elevationMeters}m</span>
              </div>
              <CardTitle className="text-lg font-bold mt-1 text-white">{activeSite.name}</CardTitle>
              <CardDescription className="text-slate-300 text-xs">{activeSite.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 text-xs">
                <div>
                  <strong className="text-slate-800">Scientific Value:</strong>
                  <p className="text-slate-600 mt-0.5">{activeSite.scientificInterest}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <strong className="text-slate-800">Target Missions:</strong>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {activeSite.targetMissions.map((m, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] bg-white text-slate-700">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Site A vs Site B Comparison Matrix */}
          <SiteComparisonMatrix
            siteAId={selectedSiteId}
            siteBId={siteBId}
            onSelectSiteA={(id) => setSelectedSiteId(id)}
            onSelectSiteB={(id) => setSiteBId(id)}
          />
        </div>

        {/* RIGHT PANE (60% - 7 Columns): Polar Horizon Plot, Time Scrubber & Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          {/* 360° Polar Horizon Plot */}
          <LunarHorizonPolarPlot
            siteName={activeSite.name.split("(")[0]}
            sunAltitudeDeg={celestialData.sun.altitudeDegrees}
            sunAzimuthDeg={celestialData.sun.azimuthDegrees}
            earthAltitudeDeg={celestialData.earth.altitudeDegrees}
            earthAzimuthDeg={celestialData.earth.azimuthDegrees}
            horizonProfile={horizonProfileResult.profile}
            isSunOccluded={isSunOccluded}
            isEarthOccluded={isEarthOccluded}
          />

          {/* Dynamic Time Scrubber */}
          <TimeScrubber
            currentOffsetHours={timeOffsetHours}
            maxHours={maxTimeHours}
            baseDate={baseDate}
            onChangeOffsetHours={(h) => setTimeOffsetHours(h)}
            onSetMaxHours={(m) => setMaxTimeHours(m)}
          />

          {/* Power & RF Link Telemetry Chart */}
          <TelemetryCharts
            data={telemetrySeries}
            currentHourOffset={timeOffsetHours}
            siteName={activeSite.name}
          />
        </div>
      </div>
    </div>
  );
}
