"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Satellite, Maximize2, Minimize2, RefreshCw } from "lucide-react"

interface SatelliteData {
  id: string
  name: string
  lat: number
  lng: number
  altitude: number
  velocity: number
  status: "operational" | "warning" | "critical"
  type: "cubesat" | "communication" | "observation"
}

export default function CommandCenterMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [satellites, setSatellites] = useState<SatelliteData[]>([
    { id: "SAT-001", name: "OrbitEdge Alpha", lat: 40.7128, lng: -74.0060, altitude: 550, velocity: 7.6, status: "operational", type: "cubesat" },
    { id: "SAT-002", name: "OrbitEdge Beta", lat: 51.5074, lng: -0.1278, altitude: 580, velocity: 7.5, status: "operational", type: "cubesat" },
    { id: "SAT-003", name: "OrbitEdge Gamma", lat: 35.6762, lng: 139.6503, altitude: 600, velocity: 7.4, status: "warning", type: "cubesat" },
    { id: "SAT-004", name: "Comm Relay 1", lat: -33.8688, lng: 151.2093, altitude: 620, velocity: 7.3, status: "operational", type: "communication" },
  ])
  const [selectedSat, setSelectedSat] = useState<string | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const loadMapbox = async () => {
      if ((window as any).mapboxgl) {
        initMap()
        return
      }

      const link = document.createElement("link")
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css"
      link.rel = "stylesheet"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js"
      script.onload = initMap
      document.head.appendChild(script)
    }

    const initMap = () => {
      if (!mapRef.current || mapInstance) return

      const mapboxgl = (window as any).mapboxgl
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [0, 30],
        zoom: 1.8,
        attributionControl: false,
      })

      map.on("load", () => {
        // Add satellite markers
        satellites.forEach((sat) => {
          const el = document.createElement("div")
          el.className = "satellite-marker"
          el.style.width = "20px"
          el.style.height = "20px"
          el.style.cursor = "pointer"
          
          const color = sat.status === "operational" ? "#10b981" : sat.status === "warning" ? "#f59e0b" : "#ef4444"
          
          el.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%;">
              <div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: ${color};
                border-radius: 50%;
                animation: satellitePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                opacity: 0.6;
              "></div>
              <div style="
                position: absolute;
                width: 10px;
                height: 10px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid ${color};
                border-radius: 50%;
                box-shadow: 0 0 8px ${color}, 0 0 15px ${color};
              "></div>
            </div>
          `

          new mapboxgl.Marker(el)
            .setLngLat([sat.lng, sat.lat])
            .addTo(map)

          el.addEventListener("click", () => setSelectedSat(sat.id))
        })

        // Simulate satellite movement
        setInterval(() => {
          setSatellites(prev => prev.map(sat => ({
            ...sat,
            lat: sat.lat + (Math.random() - 0.5) * 0.3,
            lng: sat.lng + (Math.random() - 0.5) * 0.6,
          })))
        }, 4000)
      })

      setMapInstance(map)
    }

    loadMapbox()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mapInstance) {
        mapInstance.remove()
      }
    }
  }, [])

  const selectedSatellite = satellites.find(s => s.id === selectedSat)

  return (
    <Card className="bg-white border-0 shadow-xl overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white pb-3 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Satellite className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-sm">Live Tracking</CardTitle>
              <p className="text-blue-100 text-xs">Your Fleet</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-300/30 text-xs px-2 py-0">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full mr-1 animate-pulse"></div>
              {satellites.length} Active
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-7 w-7 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        {/* Map Container */}
        <div ref={mapRef} className="w-full h-[400px] relative">
          {/* Legend */}
          <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-700">Operational</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-gray-700">Warning</span>
              </div>
            </div>
          </div>

          {/* Satellite Info Panel */}
          {selectedSatellite && (
            <div className="absolute bottom-2 left-2 right-2 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-3 border border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedSatellite.status === "operational" ? "bg-emerald-100" :
                    selectedSatellite.status === "warning" ? "bg-amber-100" : "bg-red-100"
                  }`}>
                    <Satellite className={`w-4 h-4 ${
                      selectedSatellite.status === "operational" ? "text-emerald-600" :
                      selectedSatellite.status === "warning" ? "text-amber-600" : "text-red-600"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{selectedSatellite.name}</h3>
                    <p className="text-xs text-gray-600">{selectedSatellite.id}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => setSelectedSat(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-2 border border-blue-200">
                  <p className="text-xs text-gray-600">Altitude</p>
                  <p className="text-sm font-bold text-blue-600">{selectedSatellite.altitude}km</p>
                </div>
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-2 border border-violet-200">
                  <p className="text-xs text-gray-600">Velocity</p>
                  <p className="text-sm font-bold text-violet-600">{selectedSatellite.velocity}km/s</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Satellite List */}
        <div className="border-t border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">Fleet Status</h4>
            <Button size="sm" variant="outline" className="text-xs h-7">
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
          <div className="space-y-2">
            {satellites.map((sat) => (
              <button
                key={sat.id}
                onClick={() => setSelectedSat(sat.id)}
                className={`w-full text-left p-2 rounded-lg border transition-all ${
                  selectedSat === sat.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      sat.status === "operational" ? "bg-emerald-500" :
                      sat.status === "warning" ? "bg-amber-500" : "bg-red-500"
                    }`}></div>
                    <span className="text-xs font-semibold text-gray-900">{sat.name}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {sat.altitude}km
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes satellitePulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.8);
          }
        }
      `}</style>
    </Card>
  )
}
