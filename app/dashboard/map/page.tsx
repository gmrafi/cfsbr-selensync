"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { getLunarSunEarthPositions } from "@/lib/celestial/lunar-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Globe, 
  MapPin, 
  Radio, 
  Sun, 
  Moon,
  Layers, 
  Mountain, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Calendar,
  Zap,
  Home,
  CheckCircle2,
  AlertTriangle,
  Database,
  Rocket,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

// Dynamically import Leaflet GIS (client-only)
const LunarLeafletGIS = dynamic(
  () => import("@/components/lunar/map/lunar-leaflet-gis"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono tracking-wider">Connecting to USGS Astrogeology & NASA LRO Tile Server...</span>
      </div>
    )
  }
);

// NASA Deep Space Network Ground Complexes
interface DSNStation {
  id: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lon: number;
  primaryDishes: string[];
  bands: string[];
  status: "Active Tracking" | "Standby / Handover" | "Pre-Pass Calibration";
}

const DSN_STATIONS: DSNStation[] = [
  {
    id: "goldstone",
    name: "Goldstone Deep Space Comm Complex",
    location: "Mojave Desert, California",
    country: "USA",
    lat: 35.4267,
    lon: -116.8900,
    primaryDishes: ["DSS-14 (70m Mars)", "DSS-24 (34m BWG)", "DSS-26 (34m BWG)"],
    bands: ["S-band (2.2 GHz)", "X-band (8.4 GHz)", "Ka-band (32 GHz)"],
    status: "Active Tracking"
  },
  {
    id: "madrid",
    name: "Madrid Deep Space Comm Complex",
    location: "Robledo de Chavela",
    country: "Spain",
    lat: 40.4314,
    lon: -4.2480,
    primaryDishes: ["DSS-63 (70m)", "DSS-65 (34m HEF)", "DSS-56 (34m BWG)"],
    bands: ["S-band (2.2 GHz)", "X-band (8.4 GHz)", "Ka-band (32 GHz)"],
    status: "Standby / Handover"
  },
  {
    id: "canberra",
    name: "Canberra Deep Space Comm Complex",
    location: "Tidbinbilla Valley, ACT",
    country: "Australia",
    lat: -35.4014,
    lon: 148.9817,
    primaryDishes: ["DSS-43 (70m Southern Cross)", "DSS-34 (34m BWG)", "DSS-35 (34m BWG)"],
    bands: ["S-band (2.2 GHz)", "X-band (8.4 GHz)", "Ka-band (32 GHz)"],
    status: "Active Tracking"
  }
];

// Altimetric Transect Profile across major Artemis landing sites
interface TransectPoint {
  label: string;
  lat: number;
  lon: number;
  elevationMeters: number;
  slopeDeg: number;
  hazardRisk: "Low" | "Moderate" | "Severe";
  psrTrap: boolean;
}

const POLAR_TRANSECT: TransectPoint[] = [
  { label: "Amundsen Rim Outer", lat: -84.0, lon: 82.0, elevationMeters: 1850, slopeDeg: 6.2, hazardRisk: "Low", psrTrap: false },
  { label: "Amundsen Crater Floor", lat: -84.5, lon: 82.8, elevationMeters: -1750, slopeDeg: 14.8, hazardRisk: "Moderate", psrTrap: true },
  { label: "Malapert Mountain (Peak)", lat: -85.99, lon: 0.0, elevationMeters: 5020, slopeDeg: 8.5, hazardRisk: "Moderate", psrTrap: false },
  { label: "Haworth Rim Crest", lat: -87.4, lon: -5.1, elevationMeters: 1420, slopeDeg: 11.2, hazardRisk: "Moderate", psrTrap: false },
  { label: "Haworth Deep Cold Trap", lat: -87.6, lon: -5.5, elevationMeters: -1980, slopeDeg: 22.4, hazardRisk: "Severe", psrTrap: true },
  { label: "de Gerlache Rim Plateau", lat: -88.5, lon: -88.3, elevationMeters: 2150, slopeDeg: 7.1, hazardRisk: "Low", psrTrap: false },
  { label: "Shackleton Connecting Ridge", lat: -89.4, lon: 120.0, elevationMeters: 1280, slopeDeg: 5.4, hazardRisk: "Low", psrTrap: false },
  { label: "Shackleton Crater Rim", lat: -89.9, lon: 0.0, elevationMeters: 1420, slopeDeg: 12.0, hazardRisk: "Moderate", psrTrap: false },
  { label: "Shackleton PSR Floor", lat: -89.92, lon: 0.0, elevationMeters: -2780, slopeDeg: 29.5, hazardRisk: "Severe", psrTrap: true }
];

export default function LunarMapPage() {
  const [activeSite, setActiveSite] = useState<LunarCandidateSite>(LUNAR_SOUTH_POLE_CANDIDATES[0]);
  const [simulatedDate, setSimulatedDate] = useState<Date>(new Date("2026-06-21T00:00:00Z"));
  const [activeTab, setActiveTab] = useState<string>("real-gis");

  // Light/Dark mode state synced with system
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDarkMode = mounted ? resolvedTheme === "dark" : false;
  const toggleDarkMode = () => setTheme(isDarkMode ? "light" : "dark");

  // Real-time NASA JPL Horizons telemetry
  const [jplData, setJplData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/nasa/lunar-ephemeris?lat=${activeSite.lat}&lon=${activeSite.lon}&date=${encodeURIComponent(simulatedDate.toISOString())}`)
      .then(res => res.json())
      .then(data => setJplData(data))
      .catch(err => console.error("JPL Ephemeris API error:", err));
  }, [activeSite, simulatedDate]);

  // Topocentric celestial angles
  const celestial = useMemo(() => {
    return getLunarSunEarthPositions(activeSite.lat, activeSite.lon, simulatedDate);
  }, [activeSite, simulatedDate]);

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col font-sans select-none antialiased transition-colors ${
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-100/90 text-slate-900"
    }`}>
      {/* 1. TOP TACTICAL HUD BAR (Matching /dashboard exactly) */}
      <header className={`h-12 shrink-0 border-b px-3 sm:px-4 flex items-center justify-between text-xs select-none z-20 transition-colors ${
        isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-xs"
      }`}>
        {/* Left: Home Navigation & Mission Cockpit Switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
              isDarkMode 
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
            }`}
          >
            <Home className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Home</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-xs transition-all"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Mission Cockpit</span>
          </Link>

          {/* Mission Brand Title */}
          <div className="flex items-center gap-1.5 px-2 border-l border-r border-slate-200 dark:border-slate-800">
            <Compass className="w-4 h-4 text-cyan-500" />
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              SelenSync
            </span>
            <Badge variant="outline" className="hidden lg:inline-flex text-[10px] font-semibold py-0 px-1.5 border-slate-300 dark:border-slate-700">
              PLANETARY GIS
            </Badge>
          </div>

          {/* Target Candidate Site Selector */}
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${
            isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
          }`}>
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-500 font-medium text-[11px] hidden sm:inline">Region:</span>
            <select
              value={activeSite.id}
              onChange={(e) => {
                const found = LUNAR_SOUTH_POLE_CANDIDATES.find(s => s.id === e.target.value);
                if (found) setActiveSite(found);
              }}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs max-w-[150px] sm:max-w-[180px] truncate"
            >
              {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                <option key={site.id} value={site.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {site.name.split("(")[0]} ({site.lat.toFixed(1)}°S)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Mission Epoch Date & Preset Targets */}
        <div className="hidden md:flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${
            isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
          }`}>
            <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-slate-500 font-medium text-[11px]">Epoch:</span>
            <input
              type="date"
              value={simulatedDate.toISOString().slice(0, 10)}
              onChange={(e) => {
                if (e.target.value) setSimulatedDate(new Date(e.target.value + "T00:00:00Z"));
              }}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs font-mono"
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            onClick={() => setSimulatedDate(new Date("2026-06-21T00:00:00Z"))}
          >
            Solstice
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            onClick={() => setSimulatedDate(new Date("2026-09-18T00:00:00Z"))}
          >
            Artemis III
          </Button>
        </div>

        {/* Right: NASA JPL Stream Indicator, AI Chat, Light/Dark Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>NASA JPL Live</span>
          </div>

          <Link
            href="/dashboard/chat"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
              isDarkMode 
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden sm:inline">AI Strategist</span>
          </Link>

          {/* Clean Light/Dark Mode Switcher */}
          <Button
            size="sm"
            variant="outline"
            onClick={toggleDarkMode}
            className={`h-7 px-2.5 border text-xs font-semibold ${
              isDarkMode 
                ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-300" 
                : "border-slate-300 bg-white hover:bg-slate-100 text-slate-800"
            }`}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 mr-1" /> : <Moon className="w-3.5 h-3.5 mr-1" />}
            <span>{isDarkMode ? "Light" : "Dark"}</span>
          </Button>
        </div>
      </header>

      {/* 2. MAIN 12-COLUMN DASHBOARD LAYOUT (Locked height, professional placement) */}
      <main className="flex-1 grid grid-cols-12 gap-3 p-3 overflow-hidden min-h-0">
        {/* LEFT 4 COLS: Site Dossier, JPL Telemetry & Layer Controls */}
        <section className="col-span-12 lg:col-span-4 h-full overflow-y-auto space-y-3 pr-1 min-h-0">
          {/* Card 1: Active Landing Site Dossier */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs">
            <CardHeader className="p-3.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700">
                  {activeSite.clpsPriority}
                </Badge>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  {activeSite.lat.toFixed(2)}°S, {activeSite.lon.toFixed(2)}°E
                </span>
              </div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {activeSite.name}
              </CardTitle>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeSite.scientificSignificance}
              </p>
            </CardHeader>

            <CardContent className="p-3.5 space-y-3 text-xs">
              {/* Astronomical Ephemeris Readout */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold">
                    <Sun className="w-3.5 h-3.5" /> Sun Elevation:
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {celestial.sun.altitudeDegrees > 0 
                      ? `+${celestial.sun.altitudeDegrees.toFixed(2)}° (Sunlit)`
                      : `${celestial.sun.altitudeDegrees.toFixed(2)}° (Occluded)`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                    <Radio className="w-3.5 h-3.5" /> Direct-to-Earth:
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {celestial.earth.altitudeDegrees > 0 
                      ? `+${celestial.earth.altitudeDegrees.toFixed(2)}° (LOS OK)`
                      : `${celestial.earth.altitudeDegrees.toFixed(2)}° (Below Horizon)`}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">LOLA Elevation:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                    +{activeSite.elevationMeters.toLocaleString()} m
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Solar Daylight Peak:</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                    {activeSite.solarIlluminationFraction * 100}% of cycle
                  </span>
                </div>
              </div>

              {/* Terrain Safety Envelope */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Slope Margin:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{activeSite.maxSlopeDeg}° (&lt;12° Safe)</span>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Water Ice (PSR):</span>
                  <span className="font-mono font-semibold text-purple-600 dark:text-purple-300">{activeSite.estimatedIcePurity}</span>
                </div>
              </div>

              {/* Direct Cockpit Launch */}
              <Link href="/dashboard" className="block w-full pt-1">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs gap-2">
                  <Compass className="w-4 h-4" />
                  Engage in Mission Cockpit
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 2: NASA JPL Horizons Telemetry & Physics Constants */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs">
            <CardHeader className="p-3.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Database className="w-4 h-4 text-emerald-500" />
                NASA JPL Horizons Ephemeris Constants
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Mean Radius:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">1,737.53 km</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Surface Gravity:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">1.62 m/s² (0.166 g)</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Escape Velocity:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">2.38 km/s</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>One-Way Light Time:</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {jplData?.jplPhysicalData?.oneWayLightTimeSec || "1.282"} s
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: NASA Open Data Attribution */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs shadow-xs">
            <CardContent className="p-3 space-y-1.5 text-[11px]">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">NASA Official Planetary Sources:</span>
              <div>• <strong>NASA LROC WAC</strong>: 100m Global Photographic Mosaic</div>
              <div>• <strong>NASA LOLA</strong>: 128 ppd Laser Altimetry DEM</div>
              <div>• <strong>NASA JPL Horizons</strong>: API v1.2 Ephemeris Stream</div>
              <div>• <strong>USGS Astrogeology</strong>: OpenPlanetary Lunar Coordinate System</div>
            </CardContent>
          </Card>
        </section>

        {/* RIGHT 8 COLS: Full Planetary GIS Map & Relays */}
        <section className="col-span-12 lg:col-span-8 h-full overflow-hidden flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col space-y-2">
            <div className="flex items-center justify-between shrink-0">
              <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <TabsTrigger value="real-gis" className="gap-2 text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-300">
                  <Globe className="w-3.5 h-3.5" />
                  NASA LROC Photographic GIS
                </TabsTrigger>
                <TabsTrigger value="dsn-relay" className="gap-2 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300">
                  <Radio className="w-3.5 h-3.5" />
                  NASA DSN Ground Relay
                </TabsTrigger>
                <TabsTrigger value="transect" className="gap-2 text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300">
                  <Layers className="w-3.5 h-3.5" />
                  Altimetric Transect & Slopes
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: PHOTOGRAPHIC GIS MAP (Fills 100% of height) */}
            <TabsContent value="real-gis" className="m-0 flex-1 min-h-0 overflow-hidden">
              <LunarLeafletGIS
                activeSite={activeSite}
                onSelectSite={setActiveSite}
                simulatedDate={simulatedDate}
              />
            </TabsContent>

            {/* TAB 2: NASA DSN GROUND RELAY */}
            <TabsContent value="dsn-relay" className="m-0 flex-1 min-h-0 overflow-y-auto space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {DSN_STATIONS.map((station) => (
                  <Card key={station.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs">
                    <CardHeader className="p-3.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] ${
                            station.status === "Active Tracking" 
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                          }`}
                        >
                          {station.status}
                        </Badge>
                        <span className="text-xs font-mono text-slate-500">{station.country}</span>
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {station.name}
                      </CardTitle>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{station.location}</p>
                    </CardHeader>
                    <CardContent className="p-3.5 space-y-2 text-xs">
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Coordinates:</span>
                          <span className="font-semibold">{station.lat.toFixed(2)}°N, {station.lon.toFixed(2)}°E</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Antennas:</span>
                          <span className="text-cyan-600 dark:text-cyan-300 font-semibold">{station.primaryDishes.length} active apertures</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">Active Dishes:</span>
                        {station.primaryDishes.map((dish, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{dish}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 block mb-1">RF Allocations:</span>
                        <div className="flex flex-wrap gap-1">
                          {station.bands.map((b, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tri-station 120° Handover Explanation */}
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xs">
                <CardHeader className="p-3.5 pb-1">
                  <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-500" />
                    Tri-Station 120° Geodetic Handover Principle
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3.5 text-xs space-y-1.5 leading-relaxed">
                  <p>
                    Because the Moon is locked in synchronous rotation with Earth, the Lunar South Pole requires uninterrupted ground visibility to maintain Direct-to-Earth (DTE) command uplinks and science data telemetry.
                  </p>
                  <p>
                    NASA Deep Space Network stations are placed approximately 120 degrees apart in longitude—Goldstone (California), Madrid (Spain), and Canberra (Australia). As the Earth rotates, before one complex loses line-of-sight below its 10° horizon mask, the next complex acquires the lunar downlink in an overlap handover window.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: LOLA ALTIMETRIC SLOPE TRANSECT */}
            <TabsContent value="transect" className="m-0 flex-1 min-h-0 overflow-y-auto space-y-3">
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-3.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-purple-500" />
                        Lunar South Pole Altimetric Transect Profile
                      </CardTitle>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Elevation and Slope Gradient Cross-Section from -84°S (Amundsen) to -90°S (Shackleton PSR)
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-300">
                      LOLA Laser Altimeter DEM
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3.5 space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-2">Feature</th>
                          <th className="p-2">Coordinates</th>
                          <th className="p-2">LOLA Elevation (m)</th>
                          <th className="p-2">Local Slope</th>
                          <th className="p-2">PSR Volatiles</th>
                          <th className="p-2">Landing Safety</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                        {POLAR_TRANSECT.map((pt, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="p-2 font-sans font-medium text-slate-900 dark:text-slate-100">
                              {pt.label}
                            </td>
                            <td className="p-2 text-slate-500">
                              {pt.lat.toFixed(2)}°S, {pt.lon.toFixed(2)}°
                            </td>
                            <td className="p-2">
                              <span className={pt.elevationMeters > 0 ? "text-cyan-600 dark:text-cyan-400 font-bold" : "text-purple-600 dark:text-purple-400 font-bold"}>
                                {pt.elevationMeters > 0 ? `+${pt.elevationMeters}` : pt.elevationMeters} m
                              </span>
                            </td>
                            <td className="p-2 text-slate-700 dark:text-slate-300">
                              {pt.slopeDeg}°
                            </td>
                            <td className="p-2">
                              {pt.psrTrap ? (
                                <Badge className="bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-300 text-[10px]">
                                  Ice Trap
                                </Badge>
                              ) : (
                                <span className="text-slate-500 font-sans text-[11px]">Sunlit Ridge</span>
                              )}
                            </td>
                            <td className="p-2">
                              <Badge 
                                className={`text-[10px] ${
                                  pt.hazardRisk === "Low"
                                    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300"
                                    : pt.hazardRisk === "Moderate"
                                    ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300"
                                    : "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-300"
                                }`}
                              >
                                {pt.hazardRisk}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
