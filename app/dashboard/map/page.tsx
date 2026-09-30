"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  MessageSquare,
  Maximize2,
  Minimize2
} from "lucide-react";
import Link from "next/link";
import LunarPolarMapCanvas from "@/components/lunar/map/lunar-polar-map-canvas";

// Dynamically import Leaflet GIS (client-only)
const LunarLeafletGIS = dynamic(
  () => import("@/components/lunar/map/lunar-leaflet-gis"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono tracking-wider">Connecting to USGS Astrogeology &amp; NASA LRO Tile Server...</span>
      </div>
    )
  }
);

// Dynamically import 3D Lunar Globe (client-only)
const Lunar3DGlobe = dynamic(
  () => import("@/components/lunar/map/lunar-3d-globe"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#4e6aff] border-t-transparent animate-spin" />
        <span className="text-xs font-mono tracking-wider">Loading 3D Photorealistic NASA Moon Sphere...</span>
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
  const [activeTab, setActiveTab] = useState<string>("3d-globe");

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

  // Fullscreen Moon Mode State & Controller
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapSectionRef = useRef<HTMLElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mapSectionRef.current?.requestFullscreen) {
        mapSectionRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(prev => !prev);
        });
      } else {
        setIsFullscreen(prev => !prev);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          toggleFullscreen();
        }
      }
      if (e.key === "Escape" && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col font-sans select-none antialiased transition-colors ${
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-100/90 text-slate-900"
    }`}>
      {/* 1. TOP TACTICAL HUD BAR (Matching /dashboard exactly) */}
      <header className={`h-12 shrink-0 border-b px-3 sm:px-4 flex items-center justify-between text-xs select-none z-20 transition-colors ${
        isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-xs"
      }`}>
        {/* Left: Home Navigation & Mission Cockpit Switch */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 text-xs font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs"
          >
            <Link href="/" className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#4e6aff]" />
              <span>Home</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="default"
            size="sm"
            className="h-7 text-xs font-semibold bg-[#4e6aff] hover:bg-[#3d57e6] text-white shadow-xs"
          >
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" />
              <span>Mission Cockpit</span>
            </Link>
          </Button>

          {/* Mission Brand Title */}
          <div className="flex items-center gap-1.5 px-2 border-l border-r border-slate-200 dark:border-slate-800">
            <Compass className="w-4 h-4 text-[#4e6aff]" />
            <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-white">
              SelenSync
            </span>
            <Badge variant="outline" className="hidden lg:inline-flex text-[9px] font-mono font-semibold py-0 px-1.5 border-slate-300 dark:border-slate-700">
              PLANETARY GIS
            </Badge>
          </div>

          {/* Target Candidate Site Selector */}
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs shadow-xs ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-500 font-medium text-[10px] hidden sm:inline">Site:</span>
            <select
              value={activeSite.id}
              onChange={(e) => {
                const found = LUNAR_SOUTH_POLE_CANDIDATES.find(s => s.id === e.target.value);
                if (found) setActiveSite(found);
              }}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs max-w-[150px] sm:max-w-[180px] truncate py-1"
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
        <div className="hidden md:flex items-center gap-1.5">
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs shadow-xs ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-slate-500 font-medium text-[10px]">Epoch:</span>
            <input
              type="date"
              value={simulatedDate.toISOString().slice(0, 10)}
              onChange={(e) => {
                if (e.target.value) setSimulatedDate(new Date(e.target.value + "T00:00:00Z"));
              }}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer text-xs font-mono py-1"
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs"
            onClick={() => setSimulatedDate(new Date("2026-06-21T00:00:00Z"))}
          >
            Solstice &apos;26
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs"
            onClick={() => setSimulatedDate(new Date("2026-09-18T00:00:00Z"))}
          >
            Artemis III
          </Button>
        </div>

        {/* Right: NASA JPL Stream Indicator, AI Chat, Light/Dark Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-700 dark:text-blue-300 font-mono shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>IAU / JPL DE440 Model</span>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 text-xs font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs"
          >
            <Link href="/dashboard/chat" className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden sm:inline">AI Strategist</span>
            </Link>
          </Button>

          {/* Clean Light/Dark Mode Switcher */}
          <Button
            size="sm"
            variant="outline"
            onClick={toggleDarkMode}
            className="h-7 px-2.5 text-xs font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs"
            title={isDarkMode ? "Switch to Light mode" : "Switch to Dark mode"}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 mr-1 text-amber-400" /> : <Moon className="w-3.5 h-3.5 mr-1 text-slate-600" />}
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
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {activeSite.maxSlopeDeg}° {activeSite.maxSlopeDeg < 10.0 ? "(<10° Safe)" : "(≥10° Limit)"}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Water Ice (PSR):</span>
                  <span className="font-mono font-semibold text-purple-600 dark:text-purple-300">{activeSite.estimatedIcePurity}</span>
                </div>
              </div>

              {/* Direct Cockpit Launch */}
              <div className="pt-1">
                <Button 
                  asChild
                  className="w-full bg-[#4e6aff] hover:bg-[#3d57e6] text-white font-medium text-xs gap-2 shadow-xs h-8"
                >
                  <Link href="/dashboard">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Engage in Mission Cockpit</span>
                  </Link>
                </Button>
              </div>
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
        <section 
          ref={mapSectionRef}
          className={
            isFullscreen
              ? "fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col p-3 w-screen h-screen overflow-hidden"
              : "col-span-12 lg:col-span-8 h-full overflow-hidden flex flex-col min-h-0"
          }
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col space-y-2">
            <div className="flex items-center justify-between shrink-0 gap-2 flex-wrap pb-0.5">
              <div className="flex items-center gap-2">
                <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 h-8">
                  <TabsTrigger 
                    value="3d-globe" 
                    className="gap-1.5 text-xs px-2.5 py-1 font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#4e6aff] dark:data-[state=active]:text-cyan-300 data-[state=active]:shadow-xs"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>3D Lunar Globe</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="real-gis" 
                    className="gap-1.5 text-xs px-2.5 py-1 font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Photographic 2D GIS</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="polar-gis" 
                    className="gap-1.5 text-xs px-2.5 py-1 font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-xs"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Polar Stereographic</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="dsn-relay" 
                    className="gap-1.5 text-xs px-2.5 py-1 font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-xs"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>NASA DSN Relay</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="transect" 
                    className="gap-1.5 text-xs px-2.5 py-1 font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-xs"
                  >
                    <Mountain className="w-3.5 h-3.5" />
                    <span>Altimetric Transect</span>
                  </TabsTrigger>
                </TabsList>
                {isFullscreen && (
                  <Badge variant="outline" className="hidden md:inline-flex text-[11px] font-mono bg-cyan-950/60 border-cyan-700/60 text-cyan-300">
                    {activeSite.name} ({activeSite.lat.toFixed(2)}°S, {activeSite.lon.toFixed(2)}°E) • LOLA +{activeSite.elevationMeters}m
                  </Badge>
                )}
              </div>

              {/* Fullscreen Toggle Button */}
              <div className="flex items-center gap-2">
                {isFullscreen && (
                  <span className="text-[10px] text-slate-400 font-mono hidden lg:inline">
                    Press &apos;F&apos; or &apos;Esc&apos; to exit
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className={`h-8 px-2.5 text-xs font-semibold shadow-xs gap-1.5 transition-all ${
                    isFullscreen
                      ? "bg-rose-950/50 border-rose-600 text-rose-300 hover:bg-rose-900/70 hover:text-white"
                      : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "View Moon in Fullscreen (F)"}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-[#4e6aff]" />
                      <span>Fullscreen</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* TAB 1: 3D PHOTOREALISTIC LUNAR GLOBE */}
            <TabsContent value="3d-globe" className="m-0 flex-1 min-h-0 overflow-hidden h-full rounded-xl border border-slate-200 dark:border-slate-800">
              <Lunar3DGlobe
                activeSite={activeSite}
                onSelectSite={setActiveSite}
                simulatedDate={simulatedDate}
              />
            </TabsContent>

            {/* TAB 2: PHOTOGRAPHIC 2D GIS MAP */}
            <TabsContent value="real-gis" className="m-0 flex-1 min-h-0 overflow-hidden h-full">
              <LunarLeafletGIS
                activeSite={activeSite}
                onSelectSite={setActiveSite}
                simulatedDate={simulatedDate}
              />
            </TabsContent>

            {/* TAB 3: ORIGINAL LUNAR POLAR STEREOGRAPHIC MAP */}
            <TabsContent value="polar-gis" className="m-0 flex-1 min-h-0 overflow-hidden h-full rounded-xl border border-slate-200 dark:border-slate-800">
              <LunarPolarMapCanvas
                simulatedDate={simulatedDate}
                activeSite={activeSite}
                onSelectSite={setActiveSite}
                isDarkMode={isDarkMode}
                showInspector={false}
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
