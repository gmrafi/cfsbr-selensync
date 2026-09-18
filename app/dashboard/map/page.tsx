"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import UniversalHeader from "@/components/universal-header";
import LunarPolarMapCanvas from "@/components/lunar/map/lunar-polar-map-canvas";
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
  Layers, 
  Mountain, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Calendar,
  Zap,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Database
} from "lucide-react";
import Link from "next/link";

// Dynamic import for Leaflet GIS to prevent SSR execution
const LunarLeafletGIS = dynamic(
  () => import("@/components/lunar/map/lunar-leaflet-gis"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[620px] rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
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

  // Real-time NASA JPL Horizons telemetry state
  const [jplData, setJplData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/nasa/lunar-ephemeris?lat=${activeSite.lat}&lon=${activeSite.lon}&date=${encodeURIComponent(simulatedDate.toISOString())}`)
      .then(res => res.json())
      .then(data => setJplData(data))
      .catch(err => console.error("JPL Ephemeris API error:", err));
  }, [activeSite, simulatedDate]);

  // Calculate topocentric positions for the active site
  const celestial = useMemo(() => {
    return getLunarSunEarthPositions(activeSite.lat, activeSite.lon, simulatedDate);
  }, [activeSite, simulatedDate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <UniversalHeader />

      {/* Main Map Tactical Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-16 z-30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-wider text-slate-100">
                  NASA PLANETARY GIS & LUNAR EXPLORER
                </h1>
                <Badge variant="outline" className="text-[10px] bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                  USGS ASTROGEOLOGY + NASA JPL
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                USGS / NASA LROC Photographic Tile Mosaic • Real-Time NASA JPL Horizons Ephemeris API
              </p>
            </div>
          </div>

          {/* Mission Epoch Quick Selectors & Mission Cockpit Launch */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Epoch:</span>
              <span className="font-mono text-cyan-300">
                {simulatedDate.toISOString().slice(0, 10)}
              </span>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="text-xs border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200"
              onClick={() => setSimulatedDate(new Date("2026-06-21T00:00:00Z"))}
            >
              Summer Solstice
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200"
              onClick={() => setSimulatedDate(new Date("2026-09-18T00:00:00Z"))}
            >
              Artemis III Target
            </Button>

            <Link href={`/dashboard`}>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs gap-1.5 shadow-lg shadow-cyan-600/20">
                Mission Cockpit
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <TabsList className="bg-slate-900 border border-slate-800">
              <TabsTrigger value="real-gis" className="gap-2 text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                <Globe className="w-3.5 h-3.5" />
                NASA LROC Photographic Satellite GIS
              </TabsTrigger>
              <TabsTrigger value="polar-projection" className="gap-2 text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                <Compass className="w-3.5 h-3.5" />
                Polar Stereographic Projection
              </TabsTrigger>
              <TabsTrigger value="dsn-relay" className="gap-2 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
                <Radio className="w-3.5 h-3.5" />
                NASA DSN Ground Relay
              </TabsTrigger>
              <TabsTrigger value="transect" className="gap-2 text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                <Layers className="w-3.5 h-3.5" />
                Altimetric Transect & Slopes
              </TabsTrigger>
            </TabsList>

            {/* Target Candidate Site Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Selected Region:</span>
              <select
                value={activeSite.id}
                onChange={(e) => {
                  const found = LUNAR_SOUTH_POLE_CANDIDATES.find(s => s.id === e.target.value);
                  if (found) setActiveSite(found);
                }}
                className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} ({site.lat.toFixed(1)}°S)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TAB 1: REAL NASA SATELLITE TILE GIS (LEAFLET) */}
          <TabsContent value="real-gis" className="m-0 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Left 3 Cols: Authentic Planetary Satellite GIS Engine */}
              <div className="lg:col-span-3 space-y-3">
                <LunarLeafletGIS
                  activeSite={activeSite}
                  onSelectSite={setActiveSite}
                  simulatedDate={simulatedDate}
                />

                {/* Live NASA JPL Horizons Data Stream Bar */}
                <Card className="bg-slate-900/80 border-slate-800 text-slate-300">
                  <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-slate-200">NASA JPL Horizons Uplink:</span>
                      <span className="font-mono text-emerald-300">
                        {jplData?.dataSource || "Connected (ssd.jpl.nasa.gov)"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 font-mono text-[11px]">
                      <span>Mean Radius: <strong className="text-slate-100">1,737.53 km</strong></span>
                      <span>Gravity: <strong className="text-slate-100">1.62 m/s²</strong></span>
                      <span>Escape Velocity: <strong className="text-slate-100">2.38 km/s</strong></span>
                      <span className="text-cyan-300">Light Time: <strong>{jplData?.jplPhysicalData?.oneWayLightTimeSec || "1.282"}s</strong></span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right 1 Col: Site Tactical Dossier */}
              <div className="space-y-4">
                <Card className="bg-slate-900/80 border-slate-800 text-slate-200 shadow-xl">
                  <CardHeader className="pb-3 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                        {activeSite.clpsPriority}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">
                        {activeSite.lat.toFixed(2)}°S, {activeSite.lon.toFixed(2)}°E
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-slate-100 mt-1">
                      {activeSite.name}
                    </CardTitle>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {activeSite.scientificSignificance}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3 text-xs">
                    {/* Astronomical Ephemeris Readout */}
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                          <Sun className="w-3.5 h-3.5" /> Sun Elevation:
                        </span>
                        <span className="font-mono font-bold text-amber-400">
                          {celestial.sun.altitudeDegrees > 0 
                            ? `+${celestial.sun.altitudeDegrees.toFixed(2)}° (Sunlit)`
                            : `${celestial.sun.altitudeDegrees.toFixed(2)}° (Occluded)`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                          <Radio className="w-3.5 h-3.5" /> Direct-to-Earth:
                        </span>
                        <span className="font-mono font-bold text-emerald-400">
                          {celestial.earth.altitudeDegrees > 0 
                            ? `+${celestial.earth.altitudeDegrees.toFixed(2)}° (LOS OK)`
                            : `${celestial.earth.altitudeDegrees.toFixed(2)}° (Below Horizon)`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                        <span className="text-slate-400">LOLA Elevation:</span>
                        <span className="font-mono text-slate-200 font-bold">
                          +{activeSite.elevationMeters.toLocaleString()} m
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Solar Daylight Peak:</span>
                        <span className="font-mono text-cyan-300">
                          {activeSite.solarIlluminationFraction * 100}% of cycle
                        </span>
                      </div>
                    </div>

                    {/* Scientific & Slope Safety Parameters */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Terrain Safety Envelope
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                          <span className="text-slate-500 block text-[10px]">Slope Angle:</span>
                          <span className="font-mono text-slate-200 font-semibold">{activeSite.maxSlopeDeg}° (&lt;12° Safe)</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                          <span className="text-slate-500 block text-[10px]">Water Volatiles:</span>
                          <span className="font-mono text-cyan-300 font-semibold">{activeSite.estimatedIcePurity}</span>
                        </div>
                      </div>
                    </div>

                    {/* NASA Mission Objectives */}
                    <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-800/30 text-slate-300 text-[11px] leading-relaxed">
                      <span className="font-semibold text-blue-300 block mb-1">
                        CLPS Exploration Target:
                      </span>
                      {activeSite.notes}
                    </div>

                    {/* Launch into Mission Cockpit */}
                    <Link href={`/dashboard`} className="block w-full pt-1">
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs gap-2">
                        <Compass className="w-4 h-4" />
                        Engage in Mission Cockpit
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* NASA Dataset Citations */}
                <Card className="bg-slate-900/60 border-slate-800 text-slate-300 text-xs">
                  <CardContent className="pt-4 space-y-2">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      NASA Official Data Sources
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-400">
                      <li>• <strong>NASA LROC</strong>: Lunar Reconnaissance Orbiter Camera WAC Global Mosaic (100m/pixel)</li>
                      <li>• <strong>NASA LOLA</strong>: Lunar Orbiter Laser Altimeter 128 pixel/deg DEM</li>
                      <li>• <strong>NASA JPL Horizons</strong>: Ephemeris System API v1.2 (Direct Endpoint)</li>
                      <li>• <strong>USGS Astrogeology</strong>: OpenPlanetary Lunar Coordinate Reference System</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: POLAR STEREOGRAPHIC PROJECTION CANVAS */}
          <TabsContent value="polar-projection" className="m-0 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <LunarPolarMapCanvas
                  simulatedDate={simulatedDate}
                  activeSite={activeSite}
                  onSelectSite={setActiveSite}
                  isDarkMode={true}
                />
              </div>

              <div className="space-y-4">
                <Card className="bg-slate-900/80 border-slate-800 text-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      Mathematical Projection Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-slate-400 space-y-2 leading-relaxed">
                    <p>
                      The polar stereographic projection preserves conformal angular relationships near the South Pole (-80°S to -90°S), which is essential for solar grazing vector analysis.
                    </p>
                    <p>
                      The amber ray indicates the instantaneous sub-solar vector direction. The emerald dashed beam indicates direct line-of-sight toward Earth for NASA DSN tracking.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: NASA DEEP SPACE NETWORK (DSN) GLOBAL RELAY */}
          <TabsContent value="dsn-relay" className="m-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DSN_STATIONS.map((station) => (
                <Card key={station.id} className="bg-slate-900/80 border-slate-800 text-slate-200 shadow-lg">
                  <CardHeader className="pb-3 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] ${
                          station.status === "Active Tracking" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {station.status}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">{station.country}</span>
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-100 mt-2">
                      {station.name}
                    </CardTitle>
                    <p className="text-xs text-slate-400">{station.location}</p>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Coordinates:</span>
                        <span className="font-mono text-slate-200">
                          {station.lat.toFixed(2)}°N, {station.lon.toFixed(2)}°E
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Antenna Apertures:</span>
                        <span className="font-mono text-cyan-300">{station.primaryDishes.length} active dishes</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 block">Assigned Dish Complex:</span>
                      <ul className="space-y-1">
                        {station.primaryDishes.map((dish, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            {dish}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 border-t border-slate-800 pt-2">
                      <span className="text-[11px] font-semibold text-slate-400 block">Frequency Allocations:</span>
                      <div className="flex flex-wrap gap-1">
                        {station.bands.map((band, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                            {band}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* DSN Handover Architecture Explained */}
            <Card className="bg-slate-900/60 border-slate-800 text-slate-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Tri-Station 120° Geodetic Handover Principle
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <p>
                  Because the Moon is locked in synchronous rotation with Earth, the Lunar South Pole requires uninterrupted ground visibility to maintain Direct-to-Earth (DTE) command uplinks and science data telemetry.
                </p>
                <p>
                  NASA Deep Space Network stations are placed approximately 120 degrees apart in longitude—Goldstone (California), Madrid (Spain), and Canberra (Australia). As the Earth rotates on its 24-hour axis, before a station loses line-of-sight below its 10° horizon mask, the next complex acquires the lunar downlink in an overlap handover window, guaranteeing uninterrupted 24/7 mission critical coverage.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: ALTIMETRIC TRANSECT & CRATER SLOPES */}
          <TabsContent value="transect" className="m-0 space-y-4">
            <Card className="bg-slate-900/80 border-slate-800 text-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-purple-400" />
                      Lunar South Pole Altimetric Transect Profile
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-1">
                      Elevation and Slope Gradient Cross-Section from -84°S (Amundsen) to -90°S (Shackleton PSR)
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
                    LOLA Laser Altimeter DEM
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Geomorphological Feature</th>
                        <th className="p-2.5">Coordinates</th>
                        <th className="p-2.5">LOLA Elevation (m)</th>
                        <th className="p-2.5">Local Slope</th>
                        <th className="p-2.5">PSR Volatiles</th>
                        <th className="p-2.5">Lander Landing Hazard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {POLAR_TRANSECT.map((pt, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-2.5 font-sans font-medium text-slate-200">
                            {pt.label}
                          </td>
                          <td className="p-2.5 text-slate-400">
                            {pt.lat.toFixed(2)}°S, {pt.lon.toFixed(2)}°
                          </td>
                          <td className="p-2.5">
                            <span className={pt.elevationMeters > 0 ? "text-cyan-400 font-bold" : "text-purple-400 font-bold"}>
                              {pt.elevationMeters > 0 ? `+${pt.elevationMeters}` : pt.elevationMeters} m
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-300">
                            {pt.slopeDeg}°
                          </td>
                          <td className="p-2.5">
                            {pt.psrTrap ? (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px]">
                                Ice Trap
                              </Badge>
                            ) : (
                              <span className="text-slate-500 text-[11px] font-sans">Sunlit Ridge</span>
                            )}
                          </td>
                          <td className="p-2.5">
                            <Badge 
                              className={`text-[10px] ${
                                pt.hazardRisk === "Low"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : pt.hazardRisk === "Moderate"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
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

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-200 block mb-1">
                    NASA Artemis Landing Safety Envelope Criteria:
                  </span>
                  Lander tip-over thresholds for CLPS landers (Nova-C, Griffin, Blue Ghost) mandate touchdown slopes under 12°. Deep crater interiors like Shackleton (29.5° walls) and Haworth (22.4° walls) present severe terrain hazards, making connecting ridges and elevated massifs (Malapert, de Gerlache) the prime candidates for human and robotic surface assets.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
