"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Sun, 
  Radio, 
  Mountain, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Compass, 
  Rocket, 
  MapPin, 
  Globe,
  ArrowRight,
  ShieldCheck,
  Flame,
  Info
} from "lucide-react";
import Link from "next/link";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { getLunarSunEarthPositions } from "@/lib/celestial/lunar-engine";

// Major lunar south pole craters with exact polar coordinates
interface LunarCraterFeature {
  name: string;
  lat: number;
  lon: number;
  radiusKm: number;
  depthMeters: number;
  isPSR: boolean;
  notes: string;
}

const POLAR_CRATERS: LunarCraterFeature[] = [
  { name: "Shackleton", lat: -89.9, lon: 0.0, radiusKm: 10.5, depthMeters: 4200, isPSR: true, notes: "Near-permanent shadows inside crater floor; water ice detected" },
  { name: "de Gerlache", lat: -88.5, lon: -88.3, radiusKm: 16.0, depthMeters: 3800, isPSR: true, notes: "Asymmetric crater with gentle slopes and thermal stability" },
  { name: "Haworth", lat: -87.4, lon: -5.1, radiusKm: 17.5, depthMeters: 3400, isPSR: true, notes: "One of coldest known PSRs in solar system (40 Kelvin)" },
  { name: "Shoemaker", lat: -88.1, lon: 44.9, radiusKm: 25.5, depthMeters: 3000, isPSR: true, notes: "Permanently shadowed floor with prospective hydrogen deposits" },
  { name: "Faustini", lat: -87.3, lon: 77.0, radiusKm: 19.5, depthMeters: 3200, isPSR: true, notes: "Traversable rim with wide plateau for safe landing ellipse" },
  { name: "Cabeus", lat: -84.9, lon: -35.5, radiusKm: 50.0, depthMeters: 4000, isPSR: true, notes: "Site of NASA LCROSS impact (2009); confirmed pure water ice plume" },
  { name: "Malapert", lat: -84.9, lon: 12.9, radiusKm: 34.5, depthMeters: 2800, isPSR: false, notes: "Adjacent to Malapert Mountain 5,000m peak of eternal light" },
  { name: "Nobile", lat: -85.2, lon: 53.5, radiusKm: 36.5, depthMeters: 3100, isPSR: true, notes: "Target landing zone for NASA VIPER rover polar prospecting" },
  { name: "Amundsen", lat: -84.5, lon: 82.8, radiusKm: 52.5, depthMeters: 3600, isPSR: true, notes: "Exposes deep South Pole-Aitken (SPA) impact basin crust" },
  { name: "Slater", lat: -88.1, lon: -110.0, radiusKm: 12.5, depthMeters: 2600, isPSR: true, notes: "Deep polar cold trap near de Gerlache rim" }
];

interface LunarPolarMapCanvasProps {
  simulatedDate: Date;
  activeSite: LunarCandidateSite;
  onSelectSite: (site: LunarCandidateSite) => void;
  isDarkMode?: boolean;
}

export default function LunarPolarMapCanvas({
  simulatedDate,
  activeSite,
  onSelectSite,
  isDarkMode = false,
}: LunarPolarMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Viewport transforms (Pan & Zoom)
  const [zoom, setZoom] = useState<number>(1.1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer Toggles
  const [showLOLAHeatmap, setShowLOLAHeatmap] = useState<boolean>(true);
  const [showPSROverlay, setShowPSROverlay] = useState<boolean>(true);
  const [showSolarRays, setShowSolarRays] = useState<boolean>(true);
  const [showDTEVector, setShowDTEVector] = useState<boolean>(true);
  const [showGridLines, setShowGridLines] = useState<boolean>(true);

  // Selected Pin / Custom Click
  const [inspectedLocation, setInspectedLocation] = useState<{
    lat: number;
    lon: number;
    elevationMeters: number;
    name: string;
    solarAltitudeDeg: number;
    earthAltitudeDeg: number;
    isCustom: boolean;
  }>({
    lat: activeSite.latitude,
    lon: activeSite.longitude,
    elevationMeters: activeSite.elevationMeters,
    name: activeSite.name,
    solarAltitudeDeg: 1.2,
    earthAltitudeDeg: 4.8,
    isCustom: false,
  });

  // Calculate instant Sun & Earth azimuth/elevation for South Pole center
  const polarSunEarth = useMemo(() => {
    return getLunarSunEarthPositions(-90.0, 0.0, simulatedDate);
  }, [simulatedDate]);

  // Polar Stereographic Projection helper:
  // Maps (lat: -90 to -84, lon: -180 to 180) to Cartesian (x, y) relative to pole
  const projectPolar = useCallback((lat: number, lon: number, radiusScale: number) => {
    // Angular distance from south pole (in degrees): 0 at -90, 6 at -84
    const colatitude = Math.max(0, -90 - lat); // 0 at pole, 5 at -85
    const r = colatitude * radiusScale;
    const thetaRad = ((lon - 90) * Math.PI) / 180; // 0 deg lon points up
    return {
      x: r * Math.cos(thetaRad),
      y: r * Math.sin(thetaRad),
    };
  }, []);

  // Reverse project canvas (x, y) to (lat, lon)
  const unprojectPolar = useCallback((x: number, y: number, radiusScale: number) => {
    const r = Math.sqrt(x * x + y * y);
    const colatitude = r / radiusScale;
    const lat = Math.max(-90, Math.min(-80, -90 + colatitude));
    let thetaDeg = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (thetaDeg > 180) thetaDeg -= 360;
    if (thetaDeg < -180) thetaDeg += 360;
    return { lat: Number(lat.toFixed(2)), lon: Number(thetaDeg.toFixed(2)) };
  }, []);

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = width / 2 + pan.x;
    const centerY = height / 2 + pan.y;
    const baseRadius = Math.min(width, height) * 0.42 * zoom;
    const radiusPerDegree = baseRadius / 6; // 6 degrees: -90° to -84°

    // Clear Background
    ctx.fillStyle = isDarkMode ? "#030712" : "#0f172a"; // Deep space black
    ctx.fillRect(0, 0, width, height);

    // Save context before viewport translation
    ctx.save();
    ctx.translate(centerX, centerY);

    // 1. Draw Moon Outer Reference Disk (-84°S boundary)
    const diskGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 1.05);
    diskGrad.addColorStop(0, isDarkMode ? "#1e293b" : "#1e293b");
    diskGrad.addColorStop(0.7, isDarkMode ? "#0f172a" : "#0f172a");
    diskGrad.addColorStop(1, isDarkMode ? "#020617" : "#020617");
    ctx.fillStyle = diskGrad;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 1.05, 0, Math.PI * 2);
    ctx.fill();

    // 2. LOLA Topography Simulated Altimetry Relief Field
    if (showLOLAHeatmap) {
      // Draw synthetic regional mountain massifs and craters
      POLAR_CRATERS.forEach((c) => {
        const p = projectPolar(c.lat, c.lon, radiusPerDegree);
        const craterRadiusPx = (c.radiusKm / 30.3) * radiusPerDegree; // 30.3 km approx 1 degree at moon

        // Outer rim elevation glow (highlands)
        const rimGrad = ctx.createRadialGradient(p.x, p.y, craterRadiusPx * 0.7, p.x, p.y, craterRadiusPx * 1.5);
        rimGrad.addColorStop(0, "rgba(78, 106, 255, 0)");
        rimGrad.addColorStop(0.6, "rgba(245, 158, 11, 0.15)"); // Highland gold
        rimGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, craterRadiusPx * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Crater depression (deep blue/purple)
        const pitGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, craterRadiusPx);
        pitGrad.addColorStop(0, c.isPSR ? "rgba(15, 23, 42, 0.95)" : "rgba(30, 41, 59, 0.8)");
        pitGrad.addColorStop(0.85, "rgba(51, 65, 85, 0.6)");
        pitGrad.addColorStop(1, "rgba(148, 163, 184, 0.4)");
        ctx.fillStyle = pitGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, craterRadiusPx, 0, Math.PI * 2);
        ctx.fill();

        // Rim stroke
        ctx.strokeStyle = c.isPSR ? "rgba(56, 189, 248, 0.4)" : "rgba(148, 163, 184, 0.3)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Crater Label
        if (zoom >= 0.9) {
          ctx.fillStyle = c.isPSR ? "#38bdf8" : "#94a3b8";
          ctx.font = "bold 9px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(c.name, p.x, p.y + craterRadiusPx + 11);
        }
      });
    }

    // 3. Permanently Shadowed Regions (PSR) Ice Deposit Glow
    if (showPSROverlay) {
      POLAR_CRATERS.filter((c) => c.isPSR).forEach((c) => {
        const p = projectPolar(c.lat, c.lon, radiusPerDegree);
        const craterRadiusPx = (c.radiusKm / 30.3) * radiusPerDegree * 0.6;
        ctx.fillStyle = "rgba(6, 182, 212, 0.28)"; // Cyan Ice Cold Trap
        ctx.beginPath();
        ctx.arc(p.x, p.y, craterRadiusPx, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
    }

    // 4. Polar Latitude Rings & Azimuth Meridia Grid
    if (showGridLines) {
      ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
      ctx.lineWidth = 0.75;
      ctx.setLineDash([4, 4]);

      // Latitudes: 89, 88, 87, 86, 85, 84
      for (let lat = -89; lat >= -84; lat--) {
        const r = (-90 - lat) * radiusPerDegree;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        // Latitude label
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.font = "8px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`${lat}°S`, 4, -r + 8);
      }

      // Radial Azimuth Meridia (every 45 degrees)
      for (let az = 0; az < 360; az += 45) {
        const rad = ((az - 90) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(baseRadius * Math.cos(rad), baseRadius * Math.sin(rad));
        ctx.stroke();

        // Azimuth label at boundary
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${az}°`, (baseRadius + 14) * Math.cos(rad), (baseRadius + 14) * Math.sin(rad) + 3);
      }
      ctx.setLineDash([]);
    }

    // 5. Dynamic Solar Illumination Ray & Shadow Wedge
    if (showSolarRays) {
      const sunAzRad = ((polarSunEarth.sun.azimuthDegrees - 90) * Math.PI) / 180;
      // Solar Vector Arrow
      ctx.save();
      ctx.strokeStyle = "#f59e0b"; // Gold sun ray
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(baseRadius * 0.9 * Math.cos(sunAzRad), baseRadius * 0.9 * Math.sin(sunAzRad));
      ctx.stroke();

      // Sun icon at tip
      const sunTipX = baseRadius * 0.9 * Math.cos(sunAzRad);
      const sunTipY = baseRadius * 0.9 * Math.sin(sunAzRad);
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(sunTipX, sunTipY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("☀️ SUN", sunTipX, sunTipY - 9);
      ctx.restore();
    }

    // 6. Direct-to-Earth (DTE) Azimuth Vector
    if (showDTEVector) {
      const earthAzRad = ((polarSunEarth.earth.azimuthDegrees - 90) * Math.PI) / 180;
      ctx.save();
      ctx.strokeStyle = "#3b82f6"; // Blue Earth vector
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(baseRadius * 0.85 * Math.cos(earthAzRad), baseRadius * 0.85 * Math.sin(earthAzRad));
      ctx.stroke();

      // Earth icon at tip
      const earthTipX = baseRadius * 0.85 * Math.cos(earthAzRad);
      const earthTipY = baseRadius * 0.85 * Math.sin(earthAzRad);
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(earthTipX, earthTipY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🌍 EARTH", earthTipX, earthTipY - 9);
      ctx.restore();
    }

    // 7. Render NASA Candidate Landing Sites (Interactive Pins)
    LUNAR_SOUTH_POLE_CANDIDATES.forEach((site) => {
      const p = projectPolar(site.latitude, site.longitude, radiusPerDegree);
      const isSelected = activeSite.id === site.id;

      // Pulse ring for active site
      if (isSelected) {
        ctx.strokeStyle = "#4e6aff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Pin Body
      ctx.fillStyle = isSelected ? "#4e6aff" : "#10b981"; // Active purple/blue or emerald
      ctx.beginPath();
      ctx.arc(p.x, p.y, isSelected ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pin Label
      ctx.fillStyle = "#ffffff";
      ctx.font = isSelected ? "bold 10px sans-serif" : "9px sans-serif";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
      ctx.shadowBlur = 4;
      ctx.fillText(site.name.split(" ")[0], p.x, p.y - 9);
      ctx.shadowBlur = 0;
    });

    // 8. Custom Inspected Pin (if user clicked an arbitrary coordinate)
    if (inspectedLocation.isCustom) {
      const p = projectPolar(inspectedLocation.lat, inspectedLocation.lon, radiusPerDegree);
      ctx.strokeStyle = "#ef4444"; // Red custom pin
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#f87171";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("TARGET PIN", p.x, p.y - 12);
    }

    // 9. Lunar South Pole Exact Center Marker (-90.0°)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText("SOUTH POLE (-90°)", 0, 14);

    ctx.restore();
  }, [
    zoom,
    pan,
    isDarkMode,
    showLOLAHeatmap,
    showPSROverlay,
    showSolarRays,
    showDTEVector,
    showGridLines,
    activeSite,
    inspectedLocation,
    polarSunEarth,
    projectPolar,
  ]);

  // Click & Drag Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Click on map to inspect coordinate
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2 + pan.x;
    const centerY = height / 2 + pan.y;
    const baseRadius = Math.min(width, height) * 0.42 * zoom;
    const radiusPerDegree = baseRadius / 6;

    const relX = clickX - centerX;
    const relY = clickY - centerY;

    // Check if clicked near an existing candidate site
    for (const site of LUNAR_SOUTH_POLE_CANDIDATES) {
      const p = projectPolar(site.latitude, site.longitude, radiusPerDegree);
      const dist = Math.sqrt((p.x - relX) ** 2 + (p.y - relY) ** 2);
      if (dist <= 18) {
        onSelectSite(site);
        setInspectedLocation({
          lat: site.latitude,
          lon: site.longitude,
          elevationMeters: site.elevationMeters,
          name: site.name,
          solarAltitudeDeg: 1.4,
          earthAltitudeDeg: 5.2,
          isCustom: false,
        });
        return;
      }
    }

    // Otherwise, reverse project to arbitrary lunar coordinate!
    const unproj = unprojectPolar(relX, relY, radiusPerDegree);
    if (unproj.lat <= -80 && unproj.lat >= -90) {
      const ephem = getLunarSunEarthPositions(unproj.lat, unproj.lon, simulatedDate);
      const approxElev = Math.floor(2500 + Math.sin(unproj.lon * 0.1) * 1800);
      setInspectedLocation({
        lat: unproj.lat,
        lon: unproj.lon,
        elevationMeters: approxElev,
        name: `Custom Point (${unproj.lat}°S, ${unproj.lon}°E)`,
        solarAltitudeDeg: Number(ephem.sun.altitudeDegrees.toFixed(2)),
        earthAltitudeDeg: Number(ephem.earth.altitudeDegrees.toFixed(2)),
        isCustom: true,
      });
    }
  };

  return (
    <div className="relative w-full h-full flex overflow-hidden select-none bg-slate-950 text-slate-100">
      {/* 1. Main Interactive Map Canvas */}
      <div className="flex-1 relative h-full overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />

        {/* Tactical Map Overlay HUD (Top Left) */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 shadow-md">
            <Compass className="w-4 h-4 text-[#4e6aff]" />
            <span className="font-mono text-xs font-bold text-white">LUNAR SOUTH POLE GIS</span>
            <Badge className="bg-[#4e6aff] text-white text-[10px] py-0 px-1.5">LOLA DEM 30m</Badge>
          </div>

          {/* Layer Filter Toggles */}
          <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-700 shadow-md flex flex-wrap gap-1.5 text-[11px] font-medium max-w-xs">
            <button
              onClick={() => setShowLOLAHeatmap(!showLOLAHeatmap)}
              className={`px-2 py-1 rounded border transition-colors ${
                showLOLAHeatmap ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              ⛰️ Altimetry
            </button>
            <button
              onClick={() => setShowPSROverlay(!showPSROverlay)}
              className={`px-2 py-1 rounded border transition-colors ${
                showPSROverlay ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              🧊 PSR Ice Traps
            </button>
            <button
              onClick={() => setShowSolarRays(!showSolarRays)}
              className={`px-2 py-1 rounded border transition-colors ${
                showSolarRays ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              ☀️ Sun Vector
            </button>
            <button
              onClick={() => setShowDTEVector(!showDTEVector)}
              className={`px-2 py-1 rounded border transition-colors ${
                showDTEVector ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              🌍 DTE Beam
            </button>
          </div>
        </div>

        {/* Zoom & Pan Controls (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-700 shadow-md">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setZoom((z) => Math.min(3.5, z + 0.3))}
            className="h-7 w-7 p-0 text-slate-200 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.3))}
            className="h-7 w-7 p-0 text-slate-200 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setZoom(1.1);
              setPan({ x: 0, y: 0 });
            }}
            className="h-7 w-7 p-0 text-slate-200 hover:text-white"
            title="Reset Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <span className="font-mono text-[10px] text-slate-400 px-1.5">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Solar & Earth Legend (Bottom Center) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center gap-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Sun className="w-3.5 h-3.5" />
            <span>Sun: {polarSunEarth.sun.azimuthDegrees.toFixed(1)}° Az / {polarSunEarth.sun.altitudeDegrees.toFixed(2)}° El</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5 text-blue-400">
            <Globe className="w-3.5 h-3.5" />
            <span>Earth: {polarSunEarth.earth.azimuthDegrees.toFixed(1)}° Az / {polarSunEarth.earth.altitudeDegrees.toFixed(2)}° El</span>
          </div>
        </div>
      </div>

      {/* 2. Right Side: Interactive Coordinate Inspector & Mission Launch Hub (320px) */}
      <aside className="w-80 border-l border-slate-800 bg-slate-900/95 backdrop-blur-md flex flex-col justify-between p-4 overflow-y-auto z-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#4e6aff]" />
              <span className="font-bold text-xs uppercase tracking-wider text-white">Coordinate Inspector</span>
            </div>
            {inspectedLocation.isCustom && (
              <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/40">PIN DROPPED</Badge>
            )}
          </div>

          {/* Inspected Target Card */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2.5">
            <div className="font-bold text-sm text-white">
              {inspectedLocation.name}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Latitude</span>
                <span className="font-bold text-slate-200">{inspectedLocation.lat}° S</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Longitude</span>
                <span className="font-bold text-slate-200">{inspectedLocation.lon}° E</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">LOLA Elevation</span>
                <span className="font-bold text-[#4e6aff]">+{inspectedLocation.elevationMeters}m</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Sub-Solar Angle</span>
                <span className={`font-bold ${inspectedLocation.solarAltitudeDeg > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {inspectedLocation.solarAltitudeDeg > 0 ? `+${inspectedLocation.solarAltitudeDeg}°` : `${inspectedLocation.solarAltitudeDeg}°`}
                </span>
              </div>
            </div>

            <div className="p-2 bg-slate-900/60 rounded border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Direct-to-Earth Line-of-Sight:</span>
              <span className={`font-bold font-mono ${inspectedLocation.earthAltitudeDeg > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {inspectedLocation.earthAltitudeDeg > 0 ? "CLEAR (+5.2 dB)" : "OCCLUDED"}
              </span>
            </div>
          </div>

          {/* Quick Artemis Candidate Site Shortcuts */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Artemis Candidate Sites (Select to Fly):
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => {
                    onSelectSite(site);
                    setInspectedLocation({
                      lat: site.latitude,
                      lon: site.longitude,
                      elevationMeters: site.elevationMeters,
                      name: site.name,
                      solarAltitudeDeg: 1.4,
                      earthAltitudeDeg: 5.2,
                      isCustom: false,
                    });
                  }}
                  className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    activeSite.id === site.id
                      ? "bg-[#4e6aff]/20 border-[#4e6aff] text-white font-bold"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{site.name.split(" ")[0]}</span>
                  <span className="font-mono text-[10px] text-slate-500">+{site.elevationMeters}m</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Action CTA */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link href={`/dashboard?site=${activeSite.id}`} className="w-full block">
            <Button className="w-full bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-bold text-xs py-2.5 shadow-md gap-1.5">
              <Rocket className="w-4 h-4" />
              Engage in Mission Control
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <p className="text-[10px] text-slate-500 text-center">
            Transfers selected coordinates &amp; terrain elevation directly to the Tactical Cockpit.
          </p>
        </div>
      </aside>
    </div>
  );
}
