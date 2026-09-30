"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { 
  RotateCcw, 
  Compass, 
  Layers, 
  Sun, 
  Radio, 
  MapPin, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut,
  Rocket,
  ShieldCheck,
  Globe2,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  X,
  ChevronRight,
  Activity
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { getLunarSunEarthPositions } from "@/lib/celestial/lunar-engine";

interface Lunar3DGlobeProps {
  activeSite: LunarCandidateSite;
  onSelectSite: (site: LunarCandidateSite) => void;
  simulatedDate: Date;
}

// Historical & Planned Lunar Missions with exact lunar landing coordinates
export interface HistoricalLunarMission {
  id: string;
  name: string;
  agency: string;
  year: number;
  type: "Human Landing" | "Robotic Lander" | "Rover Expedition" | "Sample Return" | "Target CLPS";
  lat: number;
  lon: number;
  siteName: string;
  details: string;
  color: string;
}

export const HISTORIC_LUNAR_MISSIONS: HistoricalLunarMission[] = [
  // Apollo Human Landings
  { id: "apollo-11", name: "Apollo 11 (Eagle)", agency: "NASA", year: 1969, type: "Human Landing", lat: 0.674, lon: 23.473, siteName: "Mare Tranquillitatis", details: "First human footsteps on another world (Armstrong & Aldrin).", color: "#38bdf8" },
  { id: "apollo-12", name: "Apollo 12 (Intrepid)", agency: "NASA", year: 1969, type: "Human Landing", lat: -3.012, lon: -23.422, siteName: "Oceanus Procellarum", details: "Pinpoint landing within walking distance of Surveyor 3.", color: "#38bdf8" },
  { id: "apollo-14", name: "Apollo 14 (Antares)", agency: "NASA", year: 1971, type: "Human Landing", lat: -3.645, lon: -17.471, siteName: "Fra Mauro Formation", details: "Investigated Imbrium basin impact ejecta blanket.", color: "#38bdf8" },
  { id: "apollo-15", name: "Apollo 15 (Falcon)", agency: "NASA", year: 1971, type: "Human Landing", lat: 26.132, lon: 3.634, siteName: "Hadley Rille / Apennines", details: "First Lunar Roving Vehicle (LRV) expedition into mountain massifs.", color: "#38bdf8" },
  { id: "apollo-16", name: "Apollo 16 (Orion)", agency: "NASA", year: 1972, type: "Human Landing", lat: -8.973, lon: 15.500, siteName: "Descartes Highlands", details: "Sampled anorthosite lunar crust in the central highlands.", color: "#38bdf8" },
  { id: "apollo-17", name: "Apollo 17 (Challenger)", agency: "NASA", year: 1972, type: "Human Landing", lat: 20.191, lon: 30.772, siteName: "Taurus-Littrow Valley", details: "Longest lunar stay (75 hrs); sampled orange volcanic soil.", color: "#38bdf8" },

  // Historic Robotic & Modern Missions
  { id: "chandrayaan-3", name: "Chandrayaan-3 (Vikram)", agency: "ISRO", year: 2023, type: "Rover Expedition", lat: -69.373, lon: 32.319, siteName: "Shiv Shakti Point", details: "First successful soft landing in the high-latitude southern polar region.", color: "#fb923c" },
  { id: "chang-e-4", name: "Chang'e 4 (Yutu-2)", agency: "CNSA", year: 2019, type: "Rover Expedition", lat: -45.457, lon: 177.589, siteName: "Von Kármán (Far Side)", details: "First landing on the lunar farside in the South Pole-Aitken basin.", color: "#f87171" },
  { id: "chang-e-5", name: "Chang'e 5", agency: "CNSA", year: 2020, type: "Sample Return", lat: 43.058, lon: -51.916, siteName: "Mons Rümker", details: "Returned 1.73 kg of young 2.0-billion-year-old basaltic rock.", color: "#f87171" },
  { id: "im-1", name: "Intuitive Machines IM-1 (Odysseus)", agency: "NASA CLPS", year: 2024, type: "Robotic Lander", lat: -80.13, lon: 1.44, siteName: "Malapert A Rim", details: "First commercial CLPS soft landing near the lunar south pole.", color: "#4e6aff" },
];

// Helper: Convert selenographic lat/lon to 3D Cartesian coordinates on sphere
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function Lunar3DGlobe({ activeSite, onSelectSite, simulatedDate }: Lunar3DGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const moonMeshRef = useRef<THREE.Mesh | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const sunGroupRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const earthshineRef = useRef<THREE.DirectionalLight | null>(null);
  const dteBeamLineRef = useRef<THREE.Line | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number | null>(null);

  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [showEarthSun, setShowEarthSun] = useState(true);
  const [hoveredSite, setHoveredSite] = useState<any | null>(null);
  const [selectedHistoric, setSelectedHistoric] = useState<HistoricalLunarMission | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(true);
  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [celestialState, setCelestialState] = useState<{
    sunAlt: number;
    earthAlt: number;
    isDteOk: boolean;
  }>({ sunAlt: 0, earthAlt: 0, isDteOk: false });

  // Initialize Three.js with OrbitControls, Moon, Earth & Sun
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Deep space background stars
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 1200;
      starPos[i + 1] = (Math.random() - 0.5) * 1200;
      starPos[i + 2] = (Math.random() - 0.5) * 1200;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xcfd8dc,
      size: 1.1,
      transparent: true,
      opacity: 0.8,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    // Focus down towards the south pole from an angle
    camera.position.set(0, -18, 20);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls for Flawless Mouse / Wheel Zoom & Rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.75;
    controls.zoomSpeed = 1.2;
    controls.minDistance = 9.8; // Allows zooming right into surface craters!
    controls.maxDistance = 75.0; // Outer zoom limit to see Earth & Sun!
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.8;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Lighting Simulation
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(38, 14, 45);
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const earthshine = new THREE.DirectionalLight(0x38bdf8, 0.35);
    earthshine.position.set(-35, -15, -20);
    scene.add(earthshine);
    earthshineRef.current = earthshine;

    // 6. Moon Mesh with Photographic NASA Texture
    const moonRadius = 9;
    const geometry = new THREE.SphereGeometry(moonRadius, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/lunar_surface_nasa.jpg", () => {
      renderer.render(scene, camera);
    });

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.92,
      metalness: 0.05,
    });

    const moonMesh = new THREE.Mesh(geometry, material);
    scene.add(moonMesh);
    moonMeshRef.current = moonMesh;

    // 7. Celestial Body: 3D Earth (Blue Marble Sphere)
    const earthRadius = 3.2; // 3.6x smaller than real scale for optimal in-frame composition
    const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);
    const earthTex = textureLoader.load("/earth_surface_nasa.jpg");
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.7,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Earth Atmospheric Glow Halo
    const earthAtmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.05, 32, 32);
    const earthAtmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    });
    const earthAtmosphere = new THREE.Mesh(earthAtmosphereGeo, earthAtmosphereMat);
    earthMesh.add(earthAtmosphere);

    // 8. Celestial Body: 3D Glowing Sun
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);
    sunGroupRef.current = sunGroup;

    // Sun Core
    const sunGeo = new THREE.SphereGeometry(3.6, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sunMesh);

    // Sun Corona Glow
    const sunCoronaGeo = new THREE.SphereGeometry(4.8, 32, 32);
    const sunCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
    });
    sunGroup.add(new THREE.Mesh(sunCoronaGeo, sunCoronaMat));

    // 9. Direct-to-Earth (DTE) Dynamic Radio Beam
    const dteBeamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const dteBeamMat = new THREE.LineDashedMaterial({
      color: 0x10b981,
      dashSize: 0.6,
      gapSize: 0.3,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const dteBeam = new THREE.Line(dteBeamGeo, dteBeamMat);
    dteBeam.computeLineDistances();
    scene.add(dteBeam);
    dteBeamLineRef.current = dteBeam;

    // 10. Surface Pins & Landing Markers Group
    const pinsGroup = new THREE.Group();
    moonMesh.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    // Add Artemis Candidate Sites (South Pole focus)
    LUNAR_SOUTH_POLE_CANDIDATES.forEach((site) => {
      const pos = latLonToVector3(site.lat, site.lon, moonRadius);
      const normal = pos.clone().normalize();
      const topPos = pos.clone().add(normal.clone().multiplyScalar(0.75));

      // Stem line
      const stemGeo = new THREE.BufferGeometry().setFromPoints([pos, topPos]);
      const stemMat = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.8,
      });
      pinsGroup.add(new THREE.Line(stemGeo, stemMat));

      // Beacon Sphere
      const beaconGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: site.id === activeSite.id ? 0x22d3ee : 0x0ea5e9,
        emissive: site.id === activeSite.id ? 0x22d3ee : 0x0284c7,
        emissiveIntensity: 0.9,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(topPos);
      (beacon as any).siteData = { ...site, isHistoric: false };
      pinsGroup.add(beacon);

      // Base Halo
      const ringGeo = new THREE.RingGeometry(0.22, 0.32, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.03)));
      ring.lookAt(pos.clone().add(normal));
      pinsGroup.add(ring);
    });

    // Add Historic & Famous Lunar Missions (Apollo, Chang'e, Chandrayaan, Odysseus)
    HISTORIC_LUNAR_MISSIONS.forEach((m) => {
      const pos = latLonToVector3(m.lat, m.lon, moonRadius);
      const normal = pos.clone().normalize();
      const topPos = pos.clone().add(normal.clone().multiplyScalar(0.65));

      const stemGeo = new THREE.BufferGeometry().setFromPoints([pos, topPos]);
      const stemMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(m.color),
        transparent: true,
        opacity: 0.85,
      });
      pinsGroup.add(new THREE.Line(stemGeo, stemMat));

      // Distinct geometric marker (Octahedron for historic missions)
      const pinGeo = new THREE.OctahedronGeometry(0.19);
      const pinMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(m.color),
        emissive: new THREE.Color(m.color),
        emissiveIntensity: 0.8,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(topPos);
      (pin as any).siteData = { ...m, isHistoric: true };
      pinsGroup.add(pin);
    });

    // 11. Polar Ring (-84°S boundary)
    const polarPoints: THREE.Vector3[] = [];
    for (let lon = -180; lon <= 180; lon += 3) {
      polarPoints.push(latLonToVector3(-84, lon, moonRadius + 0.02));
    }
    const polarGeo = new THREE.BufferGeometry().setFromPoints(polarPoints);
    const polarMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.5 });
    moonMesh.add(new THREE.Line(polarGeo, polarMat));

    // Animation Render Loop
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      // Rotate Earth slowly on its axis
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += 0.003;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Earth & Sun Ephemeris Positions based on simulatedDate & activeSite
  useEffect(() => {
    if (!earthMeshRef.current || !sunGroupRef.current || !dteBeamLineRef.current) return;

    // Calculate real astronomical ephemeris for the active site
    const ephem = getLunarSunEarthPositions(activeSite.lat, activeSite.lon, simulatedDate);
    setCelestialState({
      sunAlt: ephem.sun.altitudeDegrees,
      earthAlt: ephem.earth.altitudeDegrees,
      isDteOk: ephem.isDirectToEarthAvailable,
    });

    // 1. Earth 3D Coordinate in Selenocentric Space
    // Position Earth along subEarth vector at a visible orbit distance of 36 units
    const earthPos = latLonToVector3(
      ephem.subEarthPoint.latitude,
      ephem.subEarthPoint.longitude,
      36
    );
    earthMeshRef.current.position.copy(earthPos);
    if (earthshineRef.current) {
      earthshineRef.current.position.copy(earthPos);
    }

    // 2. Sun 3D Coordinate in Selenocentric Space
    // Position Sun along subSolar vector at distance 54 units
    const sunPos = latLonToVector3(
      ephem.subSolarPoint.latitude,
      ephem.subSolarPoint.longitude,
      54
    );
    sunGroupRef.current.position.copy(sunPos);
    if (sunLightRef.current) {
      sunLightRef.current.position.copy(sunPos);
    }

    // 3. Connect DTE Beam between Active Landing Site and Earth
    const siteSurfacePos = latLonToVector3(activeSite.lat, activeSite.lon, 9.1);
    const dtePoints = [siteSurfacePos, earthPos];
    dteBeamLineRef.current.geometry.setFromPoints(dtePoints);
    dteBeamLineRef.current.computeLineDistances();

    // Beam color: Emerald if LOS active, Rose if occluded below lunar horizon
    const beamColor = ephem.isDirectToEarthAvailable ? 0x10b981 : 0xf43f5e;
    (dteBeamLineRef.current.material as THREE.LineDashedMaterial).color.setHex(beamColor);

    // Visibility toggle
    earthMeshRef.current.visible = showEarthSun;
    sunGroupRef.current.visible = showEarthSun;
    dteBeamLineRef.current.visible = showEarthSun;
  }, [activeSite, simulatedDate, showEarthSun]);

  // Toggle Auto Spin in OrbitControls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoSpin;
    }
  }, [isAutoSpin]);

  // Smooth Focus on Site
  const focusOnSite = useCallback((lat: number, lon: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const pos = latLonToVector3(lat, lon, 9);
    const normal = pos.clone().normalize();
    const camTarget = normal.clone().multiplyScalar(19);

    controlsRef.current.autoRotate = false;
    setIsAutoSpin(false);

    // Smoothly set camera position
    const startPos = cameraRef.current.position.clone();
    let progress = 0;

    const lerpCamera = () => {
      progress += 0.04;
      if (progress <= 1 && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerpVectors(startPos, camTarget, progress);
        controlsRef.current.target.set(0, 0, 0);
        requestAnimationFrame(lerpCamera);
      }
    };
    lerpCamera();
  }, []);

  // Sync when activeSite changes from external UI
  useEffect(() => {
    if (activeSite) {
      focusOnSite(activeSite.lat, activeSite.lon);
    }
  }, [activeSite, focusOnSite]);

  // Raycast hover coordinates and clickable pins
  const handlePointerMove = (e: React.PointerEvent) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !moonMeshRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    // Check hit on beacons
    if (pinsGroupRef.current) {
      const pinHits = raycaster.intersectObjects(pinsGroupRef.current.children, true);
      const pinObj = pinHits.find((h) => (h.object as any).siteData);
      if (pinObj) {
        setHoveredSite((pinObj.object as any).siteData);
      } else {
        setHoveredSite(null);
      }
    }

    // Check surface hit for exact Selenographic coordinates
    const surfaceHits = raycaster.intersectObject(moonMeshRef.current, false);
    if (surfaceHits.length > 0) {
      const hit = surfaceHits[0];
      const localPt = hit.point.clone();
      moonMeshRef.current.worldToLocal(localPt);
      const r = localPt.length();
      const lat = 90 - Math.acos(Math.max(-1, Math.min(1, localPt.y / r))) * (180 / Math.PI);
      const lon = (Math.atan2(localPt.z, -localPt.x) * (180 / Math.PI)) - 180;
      const normLon = lon < -180 ? lon + 360 : lon > 180 ? lon - 360 : lon;
      setHoverCoords({ lat: Number(lat.toFixed(2)), lon: Number(normLon.toFixed(2)) });
    } else {
      setHoverCoords(null);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !pinsGroupRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const pinHits = raycaster.intersectObjects(pinsGroupRef.current.children, true);
    const pinObj = pinHits.find((h) => (h.object as any).siteData);
    if (pinObj) {
      const data = (pinObj.object as any).siteData;
      if (data.isHistoric) {
        setSelectedHistoric(data as HistoricalLunarMission);
      } else {
        setSelectedHistoric(null);
        onSelectSite(data as LunarCandidateSite);
      }
      setIsDossierOpen(true);
      focusOnSite(data.lat, data.lon);
    }
  };

  // Zoom controls helper
  const handleZoom = (inOut: "in" | "out") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const factor = inOut === "in" ? 0.78 : 1.25;
    cameraRef.current.position.multiplyScalar(factor);
    controlsRef.current.update();
  };

  // Reset to South Pole View
  const handleResetSouthPole = () => {
    focusOnSite(-89.9, 0.0);
  };

  // View Apollo 11 Equator
  const handleViewApollo11 = () => {
    focusOnSite(0.674, 23.473);
  };

  // View Earth Perspective
  const handleViewEarth = () => {
    if (!cameraRef.current || !earthMeshRef.current || !controlsRef.current) return;
    const earthPos = earthMeshRef.current.position.clone();
    cameraRef.current.position.copy(earthPos.clone().multiplyScalar(1.2));
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <div className="relative w-full h-full min-h-[540px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md flex flex-col select-none">
      {/* Top Floating Controls & Telemetry HUD */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Mode Badge & Quick Preset Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1 rounded-lg shadow-sm">
          <div className="flex items-center gap-1.5 px-2 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-[#4e6aff]" />
            <span className="text-xs font-semibold text-white">3D Solar System View</span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Toggle Earth & Sun Visualization */}
          <Button
            size="sm"
            variant={showEarthSun ? "secondary" : "ghost"}
            onClick={() => setShowEarthSun(!showEarthSun)}
            className={`h-6 px-2 text-[11px] rounded-md font-medium transition-all ${
              showEarthSun
                ? "bg-[#4e6aff] text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
            title="Toggle 3D Earth, Sun & Direct-to-Earth Radio Beam"
          >
            <Globe2 className="w-3 h-3 mr-1" />
            <span>{showEarthSun ? "Earth & Sun Visible" : "Show Earth & Sun"}</span>
          </Button>

          {/* Auto Rotation Button */}
          <Button
            size="sm"
            variant={isAutoSpin ? "secondary" : "ghost"}
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`h-6 px-2 text-[11px] rounded-md font-medium transition-all ${
              isAutoSpin
                ? "bg-[#4e6aff] text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isAutoSpin ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
            <span>{isAutoSpin ? "Pause" : "Spin"}</span>
          </Button>

          {/* South Pole Quick Focus */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleResetSouthPole}
            className="h-6 px-2 text-[11px] rounded-md font-medium text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            <span>South Pole</span>
          </Button>

          {/* View From Earth */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleViewEarth}
            className="h-6 px-2 text-[11px] rounded-md font-medium text-slate-400 hover:text-white hidden lg:inline-flex"
            title="Move camera to perspective of Earth looking back at the Moon"
          >
            <Radio className="w-3 h-3 mr-1 text-emerald-400" />
            <span>View from Earth</span>
          </Button>
        </div>

        {/* Right: Coordinates & Hover Inspector */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Compass className="w-3.5 h-3.5 text-[#4e6aff]" />
            <span className="font-sans text-[11px]">Surface Probe:</span>
          </div>
          {hoverCoords ? (
            <span className="text-cyan-300 font-bold tabular-nums">
              {hoverCoords.lat.toFixed(2)}°{hoverCoords.lat >= 0 ? "N" : "S"}, {Math.abs(hoverCoords.lon).toFixed(2)}°{hoverCoords.lon >= 0 ? "E" : "W"}
            </span>
          ) : (
            <span className="text-slate-500 font-sans text-[11px]">Scroll wheel to zoom | Drag to orbit</span>
          )}
        </div>
      </div>

      {/* Main Interactive Three.js Viewport */}
      <div
        ref={mountRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        className="w-full flex-1 h-full min-h-0 cursor-grab active:cursor-grabbing"
      />

      {/* Pinned Rich Tactical Site Inspector Dossier */}
      {isDossierOpen ? (
        <div className="absolute top-16 left-4 z-20 pointer-events-auto p-4 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl max-w-sm w-80 text-xs space-y-3">
          {/* Header & Close Button */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="space-y-1">
              <Badge 
                className={`text-[10px] font-mono ${
                  selectedHistoric 
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                    : "bg-[#4e6aff]/20 text-cyan-300 border-[#4e6aff]/40"
                }`}
              >
                {selectedHistoric ? `${selectedHistoric.agency} • ${selectedHistoric.year}` : activeSite.clpsPriority}
              </Badge>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5 leading-snug">
                {selectedHistoric ? (
                  <>
                    <Rocket className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{selectedHistoric.name}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-[#4e6aff] shrink-0" />
                    <span>{activeSite.name}</span>
                  </>
                )}
              </h3>
            </div>
            <button 
              onClick={() => setIsDossierOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              title="Minimize panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Historical vs Candidate Site Telemetry Grid */}
          {selectedHistoric ? (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Coordinates</span>
                  <span className="font-bold text-slate-200">
                    {Math.abs(selectedHistoric.lat).toFixed(2)}°{selectedHistoric.lat >= 0 ? "N" : "S"}, {Math.abs(selectedHistoric.lon).toFixed(2)}°{selectedHistoric.lon >= 0 ? "E" : "W"}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Landing Type</span>
                  <span className="font-bold text-amber-300">{selectedHistoric.type}</span>
                </div>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                {selectedHistoric.details}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedHistoric(null)}
                className="w-full h-7 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <span>Return to Active Candidate Site</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">LOLA Elevation</span>
                  <span className="font-bold text-[#4e6aff]">+{activeSite.elevationMeters.toLocaleString()} m</span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Max Terrain Slope</span>
                  <span className="font-bold text-emerald-400">{activeSite.maxSlopeDeg}° (&lt;10° Safe)</span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Sun Elevation</span>
                  <span className={`font-bold ${celestialState.sunAlt > 0 ? "text-amber-400" : "text-slate-400"}`}>
                    {celestialState.sunAlt > 0 ? `+${celestialState.sunAlt.toFixed(1)}° (Sunlit)` : `${celestialState.sunAlt.toFixed(1)}° (Shadow)`}
                  </span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Earth LOS (DTE)</span>
                  <span className={`font-bold ${celestialState.isDteOk ? "text-emerald-400" : "text-rose-400"}`}>
                    {celestialState.earthAlt > 0 ? `+${celestialState.earthAlt.toFixed(1)}° (Active)` : `${celestialState.earthAlt.toFixed(1)}° (Blocked)`}
                  </span>
                </div>
              </div>

              {/* Water Ice & Scientific Note */}
              <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Volatile Signature:</span>
                  <span className="font-mono text-purple-300 font-semibold">{activeSite.estimatedIcePurity}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
                  {activeSite.scientificSignificance}
                </p>
              </div>

              {/* Action Button */}
              <Button asChild className="w-full bg-[#4e6aff] hover:bg-[#3d57e6] text-white font-medium text-xs h-8 gap-1.5 shadow-md">
                <Link href={`/dashboard?site=${activeSite.id}`}>
                  <Compass className="w-3.5 h-3.5" />
                  <span>Analyze in Flight Cockpit</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Minimized Floating Toggle */
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsDossierOpen(true)}
          className="absolute top-16 left-4 z-20 pointer-events-auto h-8 px-3 rounded-lg bg-slate-900/90 border-slate-700 text-xs font-mono text-cyan-300 hover:text-white hover:bg-slate-800 shadow-md gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-[#4e6aff]" />
          <span>Inspect {selectedHistoric ? selectedHistoric.name : activeSite.name.split(" ")[0]}</span>
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      )}

      {/* Floating Celestial Status Capsule (Sun & Earth Visibility) */}
      <div className="absolute bottom-12 left-4 z-10 pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono shadow-md">
        <div className="flex items-center gap-1 text-amber-400">
          <Sun className="w-3.5 h-3.5" />
          <span>Sun:</span>
          <span className="font-bold">
            {celestialState.sunAlt > 0 ? "+" : ""}{celestialState.sunAlt.toFixed(1)}°
          </span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1 text-emerald-400">
          <Globe2 className="w-3.5 h-3.5" />
          <span>Earth (DTE):</span>
          <span className="font-bold">
            {celestialState.earthAlt > 0 ? "+" : ""}{celestialState.earthAlt.toFixed(1)}°
          </span>
        </div>
        <Badge 
          className={`text-[9px] py-0 px-1 font-sans ${
            celestialState.isDteOk 
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
              : "bg-rose-500/20 text-rose-300 border-rose-500/30"
          }`}
        >
          {celestialState.isDteOk ? "LOS ACTIVE" : "OCCLUDED"}
        </Badge>
      </div>

      {/* Bottom Floating Zoom Controls (+ / -) */}
      <div className="absolute bottom-12 right-4 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleZoom("in")}
          className="h-7 w-7 p-0 rounded-md bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shadow-sm"
          title="Zoom In (or use mouse scroll wheel)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleZoom("out")}
          className="h-7 w-7 p-0 rounded-md bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shadow-sm"
          title="Zoom Out (or use mouse scroll wheel)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Bottom Telemetry & Navigation Guide Strip */}
      <div className="border-t border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-200 font-mono text-xs">
              NASA JPL Celestial Ephemeris (Earth-Moon-Sun)
            </span>
          </div>
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
            DTE Telemetry Beam Synced
          </Badge>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>Active Target:</span>
          <span className="text-white font-bold font-sans">
            {activeSite.name.split("(")[0]}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">
            {activeSite.lat.toFixed(2)}°S, {activeSite.lon.toFixed(2)}°E
          </span>
        </div>
      </div>
    </div>
  );
}
