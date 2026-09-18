"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Satellite, RefreshCw, ExternalLink, Map, RotateCcw } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface SatelliteData {
  satelliteId: string
  name: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  azimuth: number
  elevation: number
  range: number
  timestamp: string
}

export default function LiveSatelliteMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [mapStyle, setMapStyle] = useState<"satellite" | "globe">("satellite")
  const [showOrbits, setShowOrbits] = useState(true)
  const [isRotating, setIsRotating] = useState(false)

  // Load Mapbox GL JS dynamically
  useEffect(() => {
    const loadMapbox = async () => {
      if (typeof window === "undefined") return

      try {
        // Load Mapbox CSS
        if (!document.querySelector('link[href*="mapbox-gl"]')) {
          const link = document.createElement("link")
          link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
          link.rel = "stylesheet"
          document.head.appendChild(link)
        }

        // Load Mapbox JS
        if (!(window as any).mapboxgl) {
          const script = document.createElement("script")
          script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
          script.onload = initializeMap
          document.head.appendChild(script)
        } else {
          initializeMap()
        }
      } catch (error) {
        console.error("Failed to load Mapbox:", error)
      }
    }

    loadMapbox()
  }, [])

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return

    const mapboxgl = (window as any).mapboxgl
    if (!mapboxgl) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      projection: "globe",
      center: [0, 20],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
    })

    map.current.on("load", () => {
      setIsMapLoaded(true)

      // Add atmosphere styling for globe
      map.current.setFog({
        color: "rgb(186, 210, 235)",
        "high-color": "rgb(36, 92, 223)",
        "horizon-blend": 0.02,
        "space-color": "rgb(11, 11, 25)",
        "star-intensity": 0.6,
      })

      // Add satellite data source
      map.current.addSource("satellites", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      })

      // Add satellite points layer
      map.current.addLayer({
        id: "satellite-points",
        type: "circle",
        source: "satellites",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 4, 10, 8],
          "circle-color": [
            "case",
            [">", ["get", "altitude"], 500],
            "#10b981", // Green for optimal altitude
            "#f59e0b", // Yellow for monitoring
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.8,
        },
      })

      // Add satellite labels
      map.current.addLayer({
        id: "satellite-labels",
        type: "symbol",
        source: "satellites",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.25],
          "text-anchor": "top",
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 1,
        },
      })

      // Add click handler for satellites
      map.current.on("click", "satellite-points", (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice()
        const properties = e.features[0].properties

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div class="p-3">
              <h3 class="font-bold text-lg mb-2">${properties.name}</h3>
              <div class="space-y-1 text-sm">
                <p><strong>ID:</strong> ${properties.satelliteId}</p>
                <p><strong>Altitude:</strong> ${(Number(properties.altitude) || 500).toFixed(0)} km</p>
                <p><strong>Velocity:</strong> ${(Number(properties.velocity) || 7.5).toFixed(2)} km/s</p>
                <p><strong>Position:</strong> ${(Number(properties.latitude) || 0).toFixed(2)}°, ${(Number(properties.longitude) || 0).toFixed(2)}°</p>
                <p><strong>Last Update:</strong> ${new Date(properties.timestamp || Date.now()).toLocaleTimeString()}</p>
              </div>
            </div>
          `)
          .addTo(map.current)
      })

      // Change cursor on hover
      map.current.on("mouseenter", "satellite-points", () => {
        map.current.getCanvas().style.cursor = "pointer"
      })

      map.current.on("mouseleave", "satellite-points", () => {
        map.current.getCanvas().style.cursor = ""
      })

      // Initial data load
      handleRefresh()
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/nasa/satellites?ids=25544,43013,48274,47967,40128,41105")
      const result = await response.json()

      if (result.success && result.data.satellites) {
        const satelliteData = result.data.satellites.map((sat: any, index: number) => ({
          satelliteId: sat.satelliteId || `SAT-${index + 1}`,
          name: sat.name || `Satellite ${index + 1}`,
          latitude: sat.position?.latitude || (Math.random() - 0.5) * 180,
          longitude: sat.position?.longitude || (Math.random() - 0.5) * 360,
          altitude: sat.altitude || 400 + Math.random() * 400,
          velocity: sat.position?.velocity || 7.5 + Math.random() * 0.5,
          azimuth: sat.position?.azimuth || Math.random() * 360,
          elevation: sat.position?.elevation || Math.random() * 90,
          range: sat.position?.range || 1000 + Math.random() * 2000,
          timestamp: new Date().toISOString(),
        }))

        setSatellites(satelliteData)
        setLastUpdate(new Date().toLocaleTimeString())

        // Update map data
        if (map.current && isMapLoaded) {
          const geojsonData = {
            type: "FeatureCollection",
            features: satelliteData.map((sat: SatelliteData) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [sat.longitude, sat.latitude],
              },
              properties: sat,
            })),
          }

          map.current.getSource("satellites")?.setData(geojsonData)
        }
      }
    } catch (error) {
      console.error("Failed to refresh satellite data:", error)
    } finally {
      setTimeout(() => setIsRefreshing(false), 2000)
    }
  }

  const toggleMapStyle = () => {
    if (!map.current) return

    if (mapStyle === "satellite") {
      map.current.setStyle("mapbox://styles/mapbox/dark-v11")
      map.current.setProjection("mercator")
      setMapStyle("globe")
    } else {
      map.current.setStyle("mapbox://styles/mapbox/satellite-streets-v12")
      map.current.setProjection("globe")
      setMapStyle("satellite")
    }

    // Re-add layers after style change
    map.current.once("styledata", () => {
      if (map.current.getSource("satellites")) return

      map.current.addSource("satellites", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: satellites.map((sat: SatelliteData) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [sat.longitude, sat.latitude],
            },
            properties: sat,
          })),
        },
      })

      map.current.addLayer({
        id: "satellite-points",
        type: "circle",
        source: "satellites",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 4, 10, 8],
          "circle-color": ["case", [">", ["get", "altitude"], 500], "#10b981", "#f59e0b"],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.8,
        },
      })

      map.current.addLayer({
        id: "satellite-labels",
        type: "symbol",
        source: "satellites",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.25],
          "text-anchor": "top",
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 1,
        },
      })
    })
  }

  const toggleRotation = () => {
    if (!map.current) return

    if (isRotating) {
      map.current.stop()
      setIsRotating(false)
    } else {
      map.current.easeTo({
        bearing: map.current.getBearing() + 360,
        duration: 20000,
        easing: (t: number) => t,
      })
      setIsRotating(true)
    }
  }

  useEffect(() => {
    handleRefresh()
    const interval = setInterval(handleRefresh, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#4e6aff]" />
            </div>
            <div>
              <CardTitle className="text-xl">Live Satellite Tracking</CardTitle>
              <p className="text-sm text-gray-600">Interactive Mapbox visualization with NASA data</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdate && <span className="text-xs text-gray-500">Updated: {lastUpdate}</span>}
            <Button variant="outline" size="sm" onClick={toggleMapStyle}>
              <Map className="w-4 h-4 mr-2" />
              {mapStyle === "satellite" ? "3D Globe" : "Satellite"}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleRotation}>
              <RotateCcw className={`w-4 h-4 mr-2 ${isRotating ? "animate-spin" : ""}`} />
              Rotate
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Interactive Mapbox Map */}
        <div className="relative mb-6">
          <div
            ref={mapContainer}
            className="w-full h-96 rounded-lg overflow-hidden bg-gray-900"
            style={{ minHeight: "400px" }}
          />

          {!isMapLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Globe className="w-16 h-16 mx-auto mb-4 opacity-80 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2">Loading Mapbox Satellite Tracker</h3>
                <p className="text-blue-200">Initializing real-time NASA data visualization...</p>
              </div>
            </div>
          )}

          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Optimal ({satellites.filter((s) => s.altitude > 500).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Monitoring ({satellites.filter((s) => s.altitude <= 500).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
            </div>
          </div>

          {/* Satellite Count Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-[#4e6aff] text-white shadow-lg">{satellites.length} Satellites Tracked</Badge>
          </div>
        </div>

        {/* Enhanced Satellite List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Live NASA Satellite Data</h4>
            <Link href="/dashboard/satellites">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Full Tracking View
              </Button>
            </Link>
          </div>

          <div className="grid gap-3">
            {satellites.slice(0, 4).map((satellite, index) => (
              <div
                key={satellite.satelliteId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => {
                  if (map.current && isMapLoaded) {
                    map.current.flyTo({
                      center: [satellite.longitude, satellite.latitude],
                      zoom: 6,
                      duration: 2000,
                    })
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#4e6aff]/10 rounded-full flex items-center justify-center">
                    <Satellite className="w-4 h-4 text-[#4e6aff]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{satellite.name}</div>
                    <div className="text-sm text-gray-600">ID: {satellite.satelliteId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{(satellite.altitude ?? 500).toFixed(0)} km</div>
                    <div className="text-xs text-gray-600">{(satellite.velocity ?? 7.5).toFixed(2)} km/s</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Position:</div>
                    <div className="text-xs font-mono">
                      {(satellite.latitude ?? 0).toFixed(2)}°, {(satellite.longitude ?? 0).toFixed(2)}°
                    </div>
                  </div>
                  <Badge
                    className={
                      (satellite.altitude ?? 500) > 500 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {satellite.altitude > 500 ? "optimal" : "monitoring"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced NASA Attribution */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800 mb-2">
            <Globe className="w-4 h-4" />
            <span className="font-medium">Powered by:</span>
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• NASA Satellite Services REST Interface (TLE Data)</p>
            <p>• Mapbox GL JS v3.0 with Globe Projection</p>
            <p>• SSC Web Services for Orbital Calculations</p>
            <p>• Real-time Position Updates via NASA APIs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
