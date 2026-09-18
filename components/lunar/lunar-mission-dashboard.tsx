"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Activity, 
  Layers, 
  Zap, 
  Terminal as TerminalIcon,
  Scale
} from "lucide-react";

import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { getLunarSunEarthPositions, generateLunarEphemerisSeries } from "@/lib/celestial/lunar-engine";
import { calculateSolarPower, DEFAULT_CLPS_SOLAR_SPECS } from "@/lib/physics/solar-power";
import { calculateDTERFLinkBudget, DEFAULT_CLPS_RF_SPECS } from "@/lib/physics/rf-link";
import { generateSyntheticHorizonProfile, isBodyClearedOfTopography } from "@/lib/gis/horizon-elevation";
import { CLPS_LANDER_PROFILES, CLPSLanderProfile } from "@/lib/physics/lander-profiles";
import { calculateDSNNetworkStatus } from "@/lib/physics/dsn-stations";
import { calculateLunarLibration } from "@/lib/celestial/lunar-libration";
import { calculateDivinerThermal } from "@/lib/physics/diviner-thermal";

import CockpitHudBar from "./cockpit/cockpit-hud-bar";
import CockpitTelemetryColumn from "./cockpit/cockpit-telemetry-column";
import LunarSurfaceVisualizer from "./cockpit/lunar-surface-visualizer";
import LunarHorizonPolarPlot from "./lunar-horizon-polar-plot";
import CockpitMCDAMatrix from "./cockpit/cockpit-mcda-matrix";
import CockpitAITerminal from "./cockpit/cockpit-ai-terminal";
import CockpitPowerThermal from "./cockpit/cockpit-power-thermal";
import CockpitTimeDrawer from "./cockpit/cockpit-time-drawer";
import TelemetryCharts, { TelemetryDataPoint } from "./telemetry-charts";
import SiteComparisonMatrix from "./site-comparison-matrix";

export default function LunarMissionDashboard() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("malapert-mountain");
  const [compareSiteBId, setCompareSiteBId] = useState<string>("shackleton-connecting-ridge");
  const [selectedLanderId, setSelectedLanderId] = useState<string>("nova-c");
  const [activeTab, setActiveTab] = useState<string>("curves");
  
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? resolvedTheme === "dark" : false;
  const toggleDarkMode = () => setTheme(isDarkMode ? "light" : "dark");
  
  const [timeOffsetHours, setTimeOffsetHours] = useState<number>(0);
  const [maxTimeHours, setMaxTimeHours] = useState<number>(336); // 14-day lunar day window
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [baseDate, setBaseDate] = useState<Date>(new Date("2026-06-21T00:00:00Z")); // Solstice baseline

  // Active Lander vehicle profile
  const activeLander = useMemo(() => {
    return CLPS_LANDER_PROFILES.find((l) => l.id === selectedLanderId) || CLPS_LANDER_PROFILES[0];
  }, [selectedLanderId]);

  // Active Lunar Landing Site
  const activeSite = useMemo(() => {
    return LUNAR_SOUTH_POLE_CANDIDATES.find((s) => s.id === selectedSiteId) || LUNAR_SOUTH_POLE_CANDIDATES[0];
  }, [selectedSiteId]);

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

  // Lunar Libration Model
  const librationData = useMemo(() => {
    return calculateLunarLibration(simulatedDate);
  }, [simulatedDate]);

  // Deep Space Network tracking status with handover countdown
  const dsnStatus = useMemo(() => {
    return calculateDSNNetworkStatus(simulatedDate, celestialData.earth.distanceKm, isEarthOccluded);
  }, [simulatedDate, celestialData.earth.distanceKm, isEarthOccluded]);

  // Simulated Battery State of Charge (%)
  const batterySoC = useMemo(() => {
    const netWatts = solarOutput.netOutputWatts - (activeLander.battery.nominalBaseLoadWatts + (isSunOccluded ? 85 : 15));
    if (netWatts >= 0) return 100;
    const hoursInShadow = timeOffsetHours % 14;
    const consumed = Math.abs(netWatts) * hoursInShadow;
    return Math.max(12, Number(((1 - consumed / activeLander.battery.capacityWh) * 100).toFixed(1)));
  }, [solarOutput.netOutputWatts, activeLander, isSunOccluded, timeOffsetHours]);

  // Diviner Cryogenic Thermal Model & Slope Hazard
  const thermalStatus = useMemo(() => {
    return calculateDivinerThermal(
      celestialData.sun.altitudeDegrees,
      isSunOccluded,
      4.2, // Site average slope
      batterySoC,
      activeLander.battery.capacityWh
    );
  }, [celestialData.sun.altitudeDegrees, isSunOccluded, batterySoC, activeLander.battery.capacityWh]);

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

  // Auto-play timeline loop with speed multiplier
  useEffect(() => {
    if (!isAutoPlaying) return;
    const intervalMs = Math.max(50, Math.floor(700 / speedMultiplier));
    const interval = setInterval(() => {
      setTimeOffsetHours((prev) => {
        if (prev >= maxTimeHours) return 0;
        return prev + 1;
      });
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxTimeHours, speedMultiplier]);

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
      libration: librationData,
      dsnNetworkStatus: dsnStatus,
      divinerThermal: thermalStatus,
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

  const rootBg = isDarkMode 
    ? "bg-slate-950 text-slate-100" 
    : "bg-slate-100/90 text-slate-900";

  const panelBg = isDarkMode 
    ? "bg-slate-900 border-slate-800" 
    : "bg-white border-slate-300 shadow-xs";

  return (
    <div className={`h-full w-full overflow-hidden flex flex-col font-sans select-none transition-colors ${rootBg}`}>
      {/* 1. FIXED TOP HUD BAR WITH HOME NAVIGATION & LIGHT/DARK TOGGLE */}
      <CockpitHudBar
        simulatedDate={simulatedDate}
        baseDate={baseDate}
        onChangeBaseDate={setBaseDate}
        timeOffsetHours={timeOffsetHours}
        activeSite={activeSite}
        activeLander={activeLander}
        onSelectSite={(siteId) => setSelectedSiteId(siteId)}
        onSelectLander={(landerId) => setSelectedLanderId(landerId)}
        isSunInShadow={isSunOccluded}
        isEarthOccluded={isEarthOccluded}
        onExportJSON={exportMissionReport}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. MAIN 12-COLUMN TACTICAL SCREEN (flex-1 grid, zero-scroll locked) */}
      <main className="flex-1 grid grid-cols-12 gap-3 p-3 overflow-hidden min-h-0">
        {/* COLUMN 1: Left Telemetry & System Gauges (3 Cols) */}
        <section className="col-span-12 lg:col-span-3 h-full overflow-hidden flex flex-col min-h-0">
          <CockpitTelemetryColumn
            lander={activeLander}
            solarData={{
              elevationDeg: celestialData.sun.altitudeDegrees,
              azimuthDeg: celestialData.sun.azimuthDegrees,
              isOccluded: isSunOccluded,
              output: solarOutput,
            }}
            dteData={{
              elevationDeg: celestialData.earth.altitudeDegrees,
              azimuthDeg: celestialData.earth.azimuthDegrees,
              isOccluded: isEarthOccluded,
              rfOutput: rfLinkOutput,
              libration: librationData,
              dsn: dsnStatus,
            }}
            thermalData={thermalStatus}
            batterySoCPercent={batterySoC}
            isDarkMode={isDarkMode}
          />
        </section>

        {/* COLUMN 2: Center Dual-Stage Visualizer (5 Cols) */}
        <section className="col-span-12 lg:col-span-5 h-full overflow-hidden flex flex-col gap-3 min-h-0">
          {/* Top Half (54% height): 2.5D Polar Surface Simulator */}
          <div className="flex-[54] min-h-0 overflow-hidden">
            <LunarSurfaceVisualizer
              site={activeSite}
              lander={activeLander}
              sunElevationDeg={celestialData.sun.altitudeDegrees}
              sunAzimuthDeg={celestialData.sun.azimuthDegrees}
              earthElevationDeg={celestialData.earth.altitudeDegrees}
              earthAzimuthDeg={celestialData.earth.azimuthDegrees}
              isSunOccluded={isSunOccluded}
              isEarthOccluded={isEarthOccluded}
              solarWatts={solarOutput.netOutputWatts}
              rfLinkMarginDb={rfLinkOutput.linkMarginDb}
            />
          </div>

          {/* Bottom Half (46% height): 360° Polar Horizon Skyline Radar */}
          <div className="flex-[46] min-h-0 overflow-hidden flex flex-col">
            <LunarHorizonPolarPlot
              siteName={activeSite.name}
              sunAltitudeDeg={celestialData.sun.altitudeDegrees}
              sunAzimuthDeg={celestialData.sun.azimuthDegrees}
              earthAltitudeDeg={celestialData.earth.altitudeDegrees}
              earthAzimuthDeg={celestialData.earth.azimuthDegrees}
              horizonProfile={horizonProfileResult.profile}
              isSunOccluded={isSunOccluded}
              isEarthOccluded={isEarthOccluded}
            />
          </div>
        </section>

        {/* COLUMN 3: Right Intelligence & Mission Tabs (4 Cols) */}
        <section className={`col-span-12 lg:col-span-4 h-full overflow-hidden flex flex-col border rounded-xl min-h-0 ${panelBg}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col overflow-hidden">
            <TabsList className="h-9 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 grid grid-cols-5 rounded-none p-0.5 text-xs font-semibold shrink-0">
              <TabsTrigger
                value="curves"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#4e6aff] py-1 text-xs"
              >
                <Activity className="w-3.5 h-3.5 mr-1" />
                Curves
              </TabsTrigger>
              <TabsTrigger
                value="compare"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#4e6aff] py-1 text-xs"
              >
                <Scale className="w-3.5 h-3.5 mr-1" />
                Compare
              </TabsTrigger>
              <TabsTrigger
                value="mcda"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#4e6aff] py-1 text-xs"
              >
                <Layers className="w-3.5 h-3.5 mr-1" />
                MCDA
              </TabsTrigger>
              <TabsTrigger
                value="thermal"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#4e6aff] py-1 text-xs"
              >
                <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" />
                Power
              </TabsTrigger>
              <TabsTrigger
                value="afshara"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#4e6aff] py-1 text-xs"
              >
                <TerminalIcon className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                Afshara
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Synchronized Telemetry Recharts */}
            <TabsContent value="curves" className="flex-1 overflow-hidden m-0 p-3 min-h-0">
              <TelemetryCharts
                data={telemetrySeries}
                currentHourOffset={timeOffsetHours}
                siteName={activeSite.name}
              />
            </TabsContent>

            {/* Tab 2: Interactive Side-by-Side Site Comparison */}
            <TabsContent value="compare" className="flex-1 overflow-y-auto m-0 p-3 min-h-0">
              <SiteComparisonMatrix
                siteAId={selectedSiteId}
                siteBId={compareSiteBId}
                onSelectSiteA={(id) => setSelectedSiteId(id)}
                onSelectSiteB={(id) => setCompareSiteBId(id)}
                isDarkMode={isDarkMode}
              />
            </TabsContent>

            {/* Tab 2: MCDA Decision Matrix */}
            <TabsContent value="mcda" className="flex-1 overflow-hidden m-0 min-h-0">
              <CockpitMCDAMatrix
                activeSiteId={selectedSiteId}
                onSelectSite={(id) => setSelectedSiteId(id)}
                isDarkMode={isDarkMode}
              />
            </TabsContent>

            {/* Tab 3: Thermal & Power Drawdown */}
            <TabsContent value="thermal" className="flex-1 overflow-y-auto m-0 p-3 min-h-0">
              <CockpitPowerThermal
                lander={activeLander}
                currentSolarWatts={solarOutput.netOutputWatts}
                isSunInShadow={isSunOccluded}
                timeOffsetHours={timeOffsetHours}
              />
            </TabsContent>

            {/* Tab 4: Afshara AI Flight Terminal */}
            <TabsContent value="afshara" className="flex-1 overflow-hidden m-0 min-h-0">
              <CockpitAITerminal
                site={activeSite}
                lander={activeLander}
                timeOffsetHours={timeOffsetHours}
                isSunOccluded={isSunOccluded}
                isEarthOccluded={isEarthOccluded}
                solarWatts={solarOutput.netOutputWatts}
                batterySoC={batterySoC}
                isDarkMode={isDarkMode}
              />
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* 3. FIXED BOTTOM FLIGHT SCRUBBER DRAWER */}
      <CockpitTimeDrawer
        currentOffsetHours={timeOffsetHours}
        maxHours={maxTimeHours}
        simulatedDate={simulatedDate}
        isAutoPlaying={isAutoPlaying}
        onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
        onResetTime={() => setTimeOffsetHours(0)}
        onChangeOffsetHours={(h) => setTimeOffsetHours(h)}
        onSetMaxHours={(m) => setMaxTimeHours(m)}
        speedMultiplier={speedMultiplier}
        onChangeSpeedMultiplier={(s) => setSpeedMultiplier(s)}
        isSunInShadow={isSunOccluded}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
