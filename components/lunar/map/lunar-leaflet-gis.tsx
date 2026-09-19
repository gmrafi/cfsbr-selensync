"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  Compass, 
  Layers, 
  MapPin, 
  Maximize2, 
  Radio, 
  RotateCcw, 
  Sun, 
  Zap, 
  ShieldCheck, 
  Mountain, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";
import Link from "next/link";

interface LunarLeafletGISProps {
  activeSite: LunarCandidateSite;
  onSelectSite: (site: LunarCandidateSite) => void;
  simulatedDate: Date;
}

// Major lunar south pole craters
const POLAR_CRATERS = [
  { name: "Shackleton", lat: -89.9, lon: 0.0, radiusKm: 10.5, depth: 4200, isPSR: true },
  { name: "de Gerlache", lat: -88.5, lon: -88.3, radiusKm: 16.0, depth: 3800, isPSR: true },
  { name: "Haworth", lat: -87.4, lon: -5.1, radiusKm: 17.5, depth: 3400, isPSR: true },
  { name: "Shoemaker", lat: -88.1, lon: 44.9, radiusKm: 25.5, depth: 3000, isPSR: true },
  { name: "Faustini", lat: -87.3, lon: 77.0, radiusKm: 19.5, depth: 3200, isPSR: true },
  { name: "Cabeus (LCROSS)", lat: -84.9, lon: -35.5, radiusKm: 50.0, depth: 4000, isPSR: true },
  { name: "Malapert", lat: -84.9, lon: 12.9, radiusKm: 34.5, depth: 2800, isPSR: false },
  { name: "Nobile", lat: -85.2, lon: 53.5, radiusKm: 36.5, depth: 3100, isPSR: true },
  { name: "Amundsen", lat: -84.5, lon: 82.8, radiusKm: 52.5, depth: 3600, isPSR: true },
];

export default function LunarLeafletGIS({ activeSite, onSelectSite, simulatedDate }: LunarLeafletGISProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [jplData, setJplData] = useState<any>(null);
  const [loadingJpl, setLoadingJpl] = useState<boolean>(true);
  const [activeTileLayer, setActiveTileLayer] = useState<"lro" | "clementine">("lro");

  // Fetch live NASA JPL Horizons ephemeris for active site
  useEffect(() => {
    let isCancelled = false;
    setLoadingJpl(true);

    const epochStr = simulatedDate.toISOString();
    const url = `/api/nasa/lunar-ephemeris?lat=${activeSite.lat}&lon=${activeSite.lon}&date=${encodeURIComponent(epochStr)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled) {
          setJplData(data);
          setLoadingJpl(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("JPL ephemeris fetch error:", err);
          setLoadingJpl(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [activeSite, simulatedDate]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically load Leaflet on client side
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Ensure Leaflet CSS is injected
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Custom Lunar CRS / Map instantiation
      const map = L.map(mapContainerRef.current, {
        center: [activeSite.lat, activeSite.lon],
        zoom: 4,
        minZoom: 2,
        maxZoom: 7,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Base Layer 1: NASA LRO WAC Mosaic + LOLA DEM
      const lroTileLayer = L.tileLayer(
        "https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/{z}/{x}/{y}.png",
        {
          attribution: "USGS Astrogeology | NASA LRO WAC | OpenPlanetary",
          maxZoom: 7,
          noWrap: false,
        }
      );

      // Base Layer 2: USGS Clementine B&W High-Res Albedo
      const clementineTileLayer = L.tileLayer(
        "https://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw/{z}/{x}/{y}.jpg",
        {
          attribution: "USGS / NASA Clementine UV-VIS Lunar Basemap",
          maxZoom: 7,
          noWrap: false,
        }
      );

      lroTileLayer.addTo(map);

      // Add custom zoom control in bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add scale control
      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

      // Track cursor coordinates
      map.on("mousemove", (e: any) => {
        setHoverCoords({
          lat: Number(e.latlng.lat.toFixed(4)),
          lon: Number(e.latlng.lng.toFixed(4)),
        });
      });

      map.on("mouseout", () => {
        setHoverCoords(null);
      });

      // Add Crater Geometries & PSR Outlines
      POLAR_CRATERS.forEach((crater) => {
        const craterCircle = L.circle([crater.lat, crater.lon], {
          radius: crater.radiusKm * 1000,
          color: crater.isPSR ? "#8b5cf6" : "#0ea5e9",
          weight: 1.5,
          opacity: 0.8,
          fillColor: crater.isPSR ? "#7c3aed" : "#0284c7",
          fillOpacity: crater.isPSR ? 0.25 : 0.08,
          dashArray: crater.isPSR ? "4, 4" : undefined,
        }).addTo(map);

        craterCircle.bindTooltip(
          `<strong>${crater.name}</strong><br/>${crater.isPSR ? "❄️ Cryogenic PSR Cold Trap" : "High Elevation Rim"} (${crater.depth}m)`,
          { sticky: true, className: "lunar-tooltip" }
        );
      });

      // Add Candidate Landing Sites Markers
      markersRef.current = [];
      LUNAR_SOUTH_POLE_CANDIDATES.forEach((site) => {
        const isSelected = site.id === activeSite.id;

        // Custom tactical SVG marker icon
        const iconHtml = `
          <div class="relative group cursor-pointer flex items-center justify-center">
            <div class="w-6 h-6 rounded-full ${isSelected ? "bg-cyan-400 ring-4 ring-cyan-500/40" : "bg-slate-900/90 ring-2 ring-cyan-400/60"} flex items-center justify-center shadow-lg transition-all transform hover:scale-125">
              <div class="w-2 h-2 rounded-full ${isSelected ? "bg-slate-950" : "bg-cyan-400"}"></div>
            </div>
            <div class="absolute -top-7 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold shadow-md">
              ${site.name.split(" ")[0]}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-lunar-pin",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([site.lat, site.lon], { icon: customIcon }).addTo(map);

        // Interactive Popup
        const popupContent = `
          <div style="min-width: 220px; font-family: ui-sans-serif, system-ui; color: #0f172a; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 700; color: #0891b2; text-transform: uppercase;">
                ${site.clpsPriority}
              </span>
              <span style="font-size: 10px; font-family: monospace; color: #64748b;">
                ${site.lat.toFixed(2)}°S, ${site.lon.toFixed(2)}°E
              </span>
            </div>
            <h4 style="font-size: 13px; font-weight: 800; margin: 0 0 4px 0; color: #0f172a;">
              ${site.name}
            </h4>
            <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.35;">
              ${site.scientificSignificance}
            </p>
            <div style="background: #f1f5f9; border-radius: 6px; padding: 6px; font-size: 11px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #64748b;">Elevation:</span>
                <span style="font-weight: 700; font-family: monospace;">+${site.elevationMeters}m</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Max Slope:</span>
                <span style="font-weight: 700; font-family: monospace; color: ${site.maxSlopeDeg > 10 ? '#ea580c' : '#16a34a'};">${site.maxSlopeDeg}°</span>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on("click", () => {
          onSelectSite(site);
        });

        markersRef.current.push({ siteId: site.id, marker });
      });

      // Layer switching mechanism
      (map as any)._lroLayer = lroTileLayer;
      (map as any)._clementineLayer = clementineTileLayer;
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onSelectSite]);

  // Pan to active site when selected
  useEffect(() => {
    if (mapInstanceRef.current && activeSite) {
      mapInstanceRef.current.flyTo([activeSite.lat, activeSite.lon], 5, {
        duration: 1.2,
      });

      // Open popup for active marker
      const match = markersRef.current.find((m) => m.siteId === activeSite.id);
      if (match && match.marker) {
        setTimeout(() => {
          match.marker.openPopup();
        }, 1300);
      }
    }
  }, [activeSite]);

  // Handle Layer Switcher
  const handleToggleLayer = (layer: "lro" | "clementine") => {
    setActiveTileLayer(layer);
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (layer === "lro") {
      if (map._clementineLayer) map.removeLayer(map._clementineLayer);
      if (map._lroLayer) map.addLayer(map._lroLayer);
    } else {
      if (map._lroLayer) map.removeLayer(map._lroLayer);
      if (map._clementineLayer) map.addLayer(map._clementineLayer);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[540px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-md flex flex-col">
      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Dataset Pill & Layer Selector */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 px-3 py-1.5 rounded-lg shadow-md">
          <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Basemap:</span>
          <button
            onClick={() => handleToggleLayer("lro")}
            className={`text-xs px-2 py-0.5 rounded font-medium transition-all ${
              activeTileLayer === "lro"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            NASA LROC + LOLA
          </button>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <button
            onClick={() => handleToggleLayer("clementine")}
            className={`text-xs px-2 py-0.5 rounded font-medium transition-all ${
              activeTileLayer === "clementine"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            USGS Clementine
          </button>
        </div>

        {/* Live Cursor Coordinate HUD */}
        <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 px-3 py-1.5 rounded-lg shadow-md flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Compass className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Selenographic:</span>
          </div>
          {hoverCoords ? (
            <span className="text-cyan-700 dark:text-cyan-300 font-bold">
              {hoverCoords.lat.toFixed(3)}°S, {hoverCoords.lon.toFixed(3)}°E
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">Hover surface to probe</span>
          )}
        </div>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0 min-h-[440px]" />

      {/* Bottom Telemetry & NASA JPL Live Status Strip */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-[1000]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              {jplData?.dataSource || "NASA/JPL Horizons Ephemeris System"}
            </span>
          </div>
          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 text-[10px]">
            Target: Moon (301)
          </Badge>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          {loadingJpl ? (
            <span className="text-slate-500">Querying NASA JPL telemetry stream...</span>
          ) : jplData ? (
            <>
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                <Sun className="w-3.5 h-3.5" />
                <span>Sun Elev:</span>
                <span className="font-bold">
                  {jplData.celestialConditions?.sun?.altitudeDeg > 0 ? "+" : ""}
                  {jplData.celestialConditions?.sun?.altitudeDeg?.toFixed(2)}°
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300">
                <Radio className="w-3.5 h-3.5" />
                <span>Earth Elev:</span>
                <span className="font-bold">
                  {jplData.celestialConditions?.earth?.altitudeDeg > 0 ? "+" : ""}
                  {jplData.celestialConditions?.earth?.altitudeDeg?.toFixed(2)}°
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <span>OWLT:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">
                  {jplData.jplPhysicalData?.oneWayLightTimeSec}s
                </span>
              </div>
            </>
          ) : null}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([-89.9, 0.0], 4);
              }
            }}
            className="h-6 text-[11px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-500/10 px-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Pole View
          </Button>
        </div>
      </div>
    </div>
  );
}
