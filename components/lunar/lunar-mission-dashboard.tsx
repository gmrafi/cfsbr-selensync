"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  RotateCcw,
  Activity,
  Terminal,
  Cpu,
  Share2
} from "lucide-react";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { getLunarSunEarthPositions, generateLunarEphemerisSeries } from "@/lib/celestial/lunar-engine";
import { calculateSolarPower, DEFAULT_CLPS_SOLAR_SPECS } from "@/lib/physics/solar-power";
import { calculateDTERFLinkBudget, DEFAULT_CLPS_RF_SPECS } from "@/lib/physics/rf-link";
import { generateSyntheticHorizonProfile, isBodyClearedOfTopography } from "@/lib/gis/horizon-elevation";
import { CLPS_LANDER_PROFILES, CLPSLanderProfile } from "@/lib/physics/lander-profiles";
import { calculateDSNNetworkStatus } from "@/lib/physics/dsn-stations";

import MissionClockBar from "./cockpit/mission-clock-bar";
import CockpitPowerThermal from "./cockpit/cockpit-power-thermal";
import CockpitDSNStations from "./cockpit/cockpit-dsn-stations";
import CockpitTelemetryLog from "./cockpit/cockpit-telemetry-log";
import LunarHorizonPolarPlot from "./lunar-horizon-polar-plot";
import SiteComparisonMatrix from "./site-comparison-matrix";
import TimeScrubber from "./time-scrubber";
import TelemetryCharts, { TelemetryDataPoint } from "./telemetry-charts";

export default function LunarMissionDashboard() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("malapert-mountain");
  const [siteBId, setSiteBId] = useState<string>("shackleton-ridge");
  const [selectedLanderId, setSelectedLanderId] = useState<string>("nova-c");
  const [activeTab, setActiveTab] = useState<string>("tactical");
  
  const [timeOffsetHours, setTimeOffsetHours] = useState<number>(0);
  const [maxTimeHours, setMaxTimeHours] = useState<number>(168); // 7 days window
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [baseDate, setBaseDate] = useState<Date>(new Date("2026-06-21T00:00:00Z")); // Solstice baseline

  // Custom coordinate overrides
  const [customLat, setCustomLat] = useState<number>(-85.99);
  const [customLon, setCustomLon] = useState<number>(2.93);
  const [isCustomCoords, setIsCustomCoords] = useState<boolean>(false);

  // Active Lander vehicle profile
  const activeLander = useMemo(() => {
    return CLPS_LANDER_PROFILES.find((l) => l.id === selectedLanderId) || CLPS_LANDER_PROFILES[0];
  }, [selectedLanderId]);

  // Active Lunar Landing Site
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

  // Physics models tailored to selected lander
  const solarOutput = useMemo(() => {
    const effectiveSunElev = isSunOccluded ? 0 : celestialData.sun.altitudeDegrees;
    const landerSpecs = {
      ...DEFAULT_CLPS_SOLAR_SPECS,
      name: `${activeLander.name} Array`,
      totalAreaM2: activeLander.solarArray.areaM2,
      cellEfficiency: activeLander.solarArray.cellEfficiency,
      orientation: activeLander.solarArray.orientation,
      dustDegradationFactor: activeLander.solarArray.dustDegradationFactor,
    };
    return calculateSolarPower(effectiveSunElev, celestialData.sun.azimuthDegrees, landerSpecs);
  }, [celestialData.sun, isSunOccluded, activeLander]);

  const rfLinkOutput = useMemo(() => {
    const effectiveEarthElev = isEarthOccluded ? -1 : celestialData.earth.altitudeDegrees;
    const landerRF = {
      ...DEFAULT_CLPS_RF_SPECS,
      txPowerWatts: activeLander.telecom.txPowerWatts,
      txAntennaGainDbi: activeLander.telecom.antennaGainDbi,
      dataRateKbps: activeLander.telecom.downlinkRateKbps,
    };
    return calculateDTERFLinkBudget(celestialData.earth.distanceKm, effectiveEarthElev, landerRF);
  }, [celestialData.earth, isEarthOccluded, activeLander]);

  // Deep Space Network tracking status
  const dsnStatus = useMemo(() => {
    return calculateDSNNetworkStatus(simulatedDate, celestialData.earth.distanceKm, isEarthOccluded);
  }, [simulatedDate, celestialData.earth.distanceKm, isEarthOccluded]);

  // Time-series ephemeris dataset for Recharts
  const telemetrySeries = useMemo(() => {
    const stepHours = Math.max(1, Math.round(maxTimeHours / 48));
    const ephemeris = generateLunarEphemerisSeries(
      activeSite.latitude,
      activeSite.longitude,
      baseDate,
      maxTimeHours,
      stepHours
    );

    return ephemeris.map((pt, idx) => {
      const hoursFromStart = idx * stepHours;
      const ptSunClear = isBodyClearedOfTopography(pt.sun.altitudeDegrees, pt.sun.azimuthDegrees, horizonProfileResult.profile);
      const ptEarthClear = isBodyClearedOfTopography(pt.earth.altitudeDegrees, pt.earth.azimuthDegrees, horizonProfileResult.profile);

      const pwr = calculateSolarPower(
        ptSunClear ? pt.sun.altitudeDegrees : 0, 
        pt.sun.azimuthDegrees, 
        {
          ...DEFAULT_CLPS_SOLAR_SPECS,
          totalAreaM2: activeLander.solarArray.areaM2,
          cellEfficiency: activeLander.solarArray.cellEfficiency,
        }
      );
      const rf = calculateDTERFLinkBudget(
        pt.earth.distanceKm, 
        ptEarthClear ? pt.earth.altitudeDegrees : -1, 
        {
          ...DEFAULT_CLPS_RF_SPECS,
          txPowerWatts: activeLander.telecom.txPowerWatts,
          txAntennaGainDbi: activeLander.telecom.antennaGainDbi,
        }
      );

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
  }, [activeSite, baseDate, maxTimeHours, horizonProfileResult, activeLander]);

  // Auto-play timeline loop
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setTimeOffsetHours((prev) => {
        if (prev >= maxTimeHours) return 0;
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxTimeHours]);

  const exportMissionReport = () => {
    const report = {
      platform: "SelenSync - CLPS Lunar South Pole Mission Operations Cockpit",
      generatedAtUTC: new Date().toISOString(),
      activeLander: activeLander,
      site: activeSite,
      simulatedInstantUTC: simulatedDate.toISOString(),
      metHours: timeOffsetHours,
      celestialTelemetry: celestialData,
      solarPowerOutput: solarOutput,
      rfLinkBudget: rfLinkOutput,
      dsnNetworkStatus: dsnStatus,
      horizonProfile: horizonProfileResult,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selensync-${activeLander.id}-${activeSite.id}-t+${timeOffsetHours}h.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* 1. Global Flight Bar & UTC/MET Clocks */}
      <MissionClockBar
        simulatedDate={simulatedDate}
        timeOffsetHours={timeOffsetHours}
        activeSite={activeSite}
        activeLander={activeLander}
        onSelectLander={(id) => setSelectedLanderId(id)}
        isAutoPlaying={isAutoPlaying}
        onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
        onResetTime={() => setTimeOffsetHours(0)}
        solarElevationDeg={celestialData.sun.altitudeDegrees}
        earthElevationDeg={celestialData.earth.altitudeDegrees}
        isSunInShadow={isSunOccluded}
        isEarthOccluded={isEarthOccluded}
      />

      {/* 2. Tactical Site Selector & Operational Controls */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-xs flex items-center justify-between flex-wrap gap-3">
        {/* Site Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#4e6aff]" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Target Landing Site:</span>
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
            className="text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4e6aff] text-slate-800"
          >
            {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} ({site.latitude}°S, {site.longitude}°E)
              </option>
            ))}
            <option value="custom">⚙️ Custom Coordinates (-80° to -90°S)...</option>
          </select>

          {isCustomCoords && (
            <div className="flex items-center gap-2 bg-blue-50 p-1 rounded-lg border border-blue-200">
              <span className="text-xs text-blue-900 font-semibold">Lat:</span>
              <Input
                type="number"
                min={-90}
                max={-80}
                step={0.01}
                value={customLat}
                onChange={(e) => setCustomLat(Number(e.target.value))}
                className="w-18 h-7 text-xs bg-white"
              />
              <span className="text-xs text-blue-900 font-semibold">Lon:</span>
              <Input
                type="number"
                min={-180}
                max={180}
                step={0.01}
                value={customLon}
                onChange={(e) => setCustomLon(Number(e.target.value))}
                className="w-18 h-7 text-xs bg-white"
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Badge variant="outline" className="text-xs font-mono bg-slate-50 border-slate-300 text-slate-700">
            {activeSite.elevationMeters}m MSL
          </Badge>
          <Button
            onClick={exportMissionReport}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 shadow-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            Export Telemetry (.JSON)
          </Button>
        </div>
      </div>

      {/* 3. Modular Cockpit Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-200/80 p-1 rounded-xl border border-slate-300/80 grid grid-cols-2 sm:grid-cols-5 gap-1 w-full text-xs">
          <TabsTrigger
            value="tactical"
            className="data-[state=active]:bg-white data-[state=active]:text-[#4e6aff] data-[state=active]:shadow-xs font-bold gap-1.5 py-2 text-xs"
          >
            <Activity className="w-3.5 h-3.5" />
            Tactical Flight Deck
          </TabsTrigger>
          <TabsTrigger
            value="power-thermal"
            className="data-[state=active]:bg-white data-[state=active]:text-[#4e6aff] data-[state=active]:shadow-xs font-bold gap-1.5 py-2 text-xs"
          >
            <Zap className="w-3.5 h-3.5" />
            Power &amp; Cryo Battery
          </TabsTrigger>
          <TabsTrigger
            value="dsn-network"
            className="data-[state=active]:bg-white data-[state=active]:text-[#4e6aff] data-[state=active]:shadow-xs font-bold gap-1.5 py-2 text-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            NASA DSN Network
          </TabsTrigger>
          <TabsTrigger
            value="trade-study"
            className="data-[state=active]:bg-white data-[state=active]:text-[#4e6aff] data-[state=active]:shadow-xs font-bold gap-1.5 py-2 text-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            Site Trade Study
          </TabsTrigger>
          <TabsTrigger
            value="telemetry-log"
            className="data-[state=active]:bg-white data-[state=active]:text-[#4e6aff] data-[state=active]:shadow-xs font-bold gap-1.5 py-2 text-xs"
          >
            <Terminal className="w-3.5 h-3.5" />
            Telemetry Log &amp; Uplink
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: TACTICAL FLIGHT DECK */}
        <TabsContent value="tactical" className="space-y-4 mt-0">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Solar Elevation */}
            <Card className="border border-slate-300 bg-white shadow-xs">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Solar Elevation (θ_elev)</span>
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {(celestialData?.sun?.altitudeDegrees ?? 0) > 0 ? `+${(celestialData?.sun?.altitudeDegrees ?? 0).toFixed(2)}°` : `${(celestialData?.sun?.altitudeDegrees ?? 0).toFixed(2)}°`}
                </div>
                <div className="text-[11px] mt-1 font-medium">
                  {isSunOccluded ? (
                    <span className="text-amber-600 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3" /> Crater Rim Shadow
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Direct Solar Grazing
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Solar Generated Power */}
            <Card className="border border-slate-300 bg-white shadow-xs">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Solar Power Gen</span>
                  <Zap className="w-4 h-4 text-[#4e6aff]" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {(solarOutput?.netOutputWatts ?? 0).toFixed(1)} <span className="text-xs font-normal text-slate-500">Watts</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  Flux: {solarOutput?.solarFluxWm2 ?? 1361} W/m² (AM0)
                </div>
              </CardContent>
            </Card>

            {/* Earth Elevation */}
            <Card className="border border-slate-300 bg-white shadow-xs">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Earth Horizon Elevation</span>
                  <Globe className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {(celestialData?.earth?.altitudeDegrees ?? 0) > 0 ? `+${(celestialData?.earth?.altitudeDegrees ?? 0).toFixed(2)}°` : `${(celestialData?.earth?.altitudeDegrees ?? 0).toFixed(2)}°`}
                </div>
                <div className="text-[11px] mt-1 font-medium">
                  {isEarthOccluded ? (
                    <span className="text-rose-600 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3" /> RF Horizon Occluded
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Direct-to-Earth Open
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* DSN Link Margin */}
            <Card className="border border-slate-300 bg-white shadow-xs">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">DSN Link Margin</span>
                  <Radio className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {rfLinkOutput?.isLinkClosed ? `+${(rfLinkOutput?.linkMarginDb ?? 0).toFixed(1)} dB` : "NO CARRIER"}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  FSPL: {rfLinkOutput?.freeSpacePathLossDb ?? 0} dB @ 8.45 GHz
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dual Pane Layout: Left Polar Plot & Site Info, Right Telemetry & Scrubber */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* LEFT (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
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

              <Card className="border border-slate-300 bg-white shadow-xs">
                <CardHeader className="p-3.5 pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-50 text-[#4e6aff] border-blue-200 text-[10px] font-semibold">
                      CLPS Target Dossier
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">{activeLander.contractor}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 mt-1">{activeSite.name}</CardTitle>
                  <CardDescription className="text-xs text-slate-600">{activeSite.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-3.5 space-y-2 text-xs">
                  <div>
                    <strong className="text-slate-800">Scientific Significance:</strong>
                    <p className="text-slate-600 mt-0.5">{activeSite.scientificInterest}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between">
                    <span className="text-slate-500">Target Missions:</span>
                    <span className="font-semibold text-slate-800">{activeSite.targetMissions.join(", ")}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <TimeScrubber
                currentOffsetHours={timeOffsetHours}
                maxHours={maxTimeHours}
                baseDate={baseDate}
                onChangeOffsetHours={(h) => setTimeOffsetHours(h)}
                onSetMaxHours={(m) => setMaxTimeHours(m)}
              />

              <TelemetryCharts
                data={telemetrySeries}
                currentHourOffset={timeOffsetHours}
                siteName={activeSite.name}
              />
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: POWER & CRYO BATTERY */}
        <TabsContent value="power-thermal" className="space-y-4 mt-0">
          <CockpitPowerThermal
            lander={activeLander}
            currentSolarWatts={solarOutput.netOutputWatts}
            isSunInShadow={isSunOccluded}
            timeOffsetHours={timeOffsetHours}
          />
        </TabsContent>

        {/* TAB 3: NASA DSN NETWORK */}
        <TabsContent value="dsn-network" className="space-y-4 mt-0">
          <CockpitDSNStations
            dsnStatus={dsnStatus}
            lander={activeLander}
            isLunarLOSOccluded={isEarthOccluded}
            rfLinkMarginDb={rfLinkOutput.linkMarginDb}
          />
        </TabsContent>

        {/* TAB 4: SITE TRADE STUDY */}
        <TabsContent value="trade-study" className="space-y-4 mt-0">
          <SiteComparisonMatrix
            siteAId={selectedSiteId}
            siteBId={siteBId}
            onSelectSiteA={(id) => setSelectedSiteId(id)}
            onSelectSiteB={(id) => setSiteBId(id)}
          />
        </TabsContent>

        {/* TAB 5: TELEMETRY LOG & UPLINK */}
        <TabsContent value="telemetry-log" className="space-y-4 mt-0">
          <CockpitTelemetryLog
            timeOffsetHours={timeOffsetHours}
            siteName={activeSite.name}
            isSunInShadow={isSunOccluded}
            isEarthOccluded={isEarthOccluded}
            rfLinkMarginDb={rfLinkOutput.linkMarginDb}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
