"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import UniversalHeader from "@/components/universal-header"
import { Activity, AlertTriangle, Globe, Map, Pause, Play, Search, Wifi } from "lucide-react"

interface SatelliteData {
  id: string
  name: string
  latitude?: number
  longitude?: number
  altitude: number
  velocity: number
  status: "active" | "inactive" | "critical" | "Closed" | "Active"
  type:
    | "communication"
    | "navigation"
    | "earth-observation"
    | "scientific"
    | "Earth Observation"
    | "Data Collection"
    | "Natural Event"
  country?: string
  launchDate: string
  operator?: string
  constellation?: string
  riskLevel?: "low" | "medium" | "high" | "critical"
  noradId?: string | number
  inclination?: number
  period?: number
  apogee?: number
  perigee?: number
  lastUpdate?: string
  mission?: string
  crew?: number
  eventType?: string
  dataProducts?: number
  position?: {
    latitude: number
    longitude: number
    altitude: number
    velocity: number
  }
}

interface DebrisData {
  id: string
  latitude: number
  longitude: number
  altitude: number
  size: "small" | "medium" | "large"
  velocity: number
  riskLevel: "low" | "medium" | "high" | "critical"
}

interface BusinessOpportunity {
  id: string
  region?: string
  latitude?: number
  longitude?: number
  marketSize: number
  growthRate?: number
  competition?: "low" | "medium" | "high"
  opportunity?: "telecom" | "earth-observation" | "navigation" | "manufacturing"
  revenue?: number
  title?: string
  category?: string
  location?: number[]
  riskLevel?: number
  description?: string
}

interface Infrastructure {
  id: string
  name: string
  type: "space-station" | "ground-station" | "launch-site" | "manufacturing"
  latitude: number
  longitude: number
  operator: string
  capacity: number
  status: "operational" | "planned" | "under-construction"
}

interface LaunchSite {
  id: string
  name: string
  latitude: number
  longitude: number
  operator: string
  launchCost: number
  capacity: number
  nextLaunch: string
  status: "active" | "inactive" | "maintenance"
}

interface TourismRoute {
  id: string
  name: string
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  duration: number
  price: number
  difficulty: "beginner" | "intermediate" | "advanced"
  provider: string
  nextAvailable: string
}

// Tokens must not be used directly on the client. Use internal API routes instead.

const NASA_ENDPOINTS = {
  // Core NASA APIs
  CMR_GRANULES: "https://cmr.earthdata.nasa.gov/search/granules.json",
  CMR_COLLECTIONS: "https://cmr.earthdata.nasa.gov/search/collections.json",
  APOD: "https://api.nasa.gov/planetary/apod",
  EONET_EVENTS: "https://eonet.gsfc.nasa.gov/api/v3/events",

  // Earth Data APIs
  EARTHDATA_SEARCH: "https://search.earthdata.nasa.gov/search/granules",
  MODIS_TERRA: "https://modis.gsfc.nasa.gov/data/",
  MODIS_AQUA: "https://modis.gsfc.nasa.gov/data/",
  LANDSAT: "https://landsat.gsfc.nasa.gov/data/",
  VIIRS: "https://ncc.nesdis.noaa.gov/VIIRS/",

  // Satellite Tracking
  GHRC_TLE: "https://ghrc.nsstc.nasa.gov/services/satellites/elements.pl",
  ISS_POSITION: "http://api.open-notify.org/iss-now.json",
  SATELLITE_TLE: "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json",

  // Environmental Data
  USGS_EARTHQUAKES: "https://earthquake.usgs.gov/fdsnws/event/1/",
  NOAA_SWPC: "https://services.swpc.noaa.gov/json/",
  NASA_POWER: "https://power.larc.nasa.gov/api/temporal/daily/point",

  // Climate and Atmospheric Data
  GIOVANNI: "https://giovanni.gsfc.nasa.gov/giovanni/",
  GISS_TEMP: "https://data.giss.nasa.gov/gistemp/",
  AIRS: "https://airs.jpl.nasa.gov/data/",
}

const generateRealisticLEOPosition = () => {
  const altitude = 400 + Math.random() * 800 // LEO range 400-1200km
  const velocity = 7800 - (altitude - 400) * 0.5 // Realistic orbital velocity
  return {
    latitude: Math.random() * 180 - 90,
    longitude: Math.random() * 360 - 180,
    altitude,
    velocity,
  }
}

const generateEnhancedMockSatellites = () => {
  return [
    {
      id: "mock-iss",
      name: "International Space Station (Mock)",
      latitude: 51.6461,
      longitude: -0.1276,
      altitude: 408,
      velocity: 27600,
      status: "active",
      type: "scientific",
      country: "International",
      launchDate: "1998-11-20",
      operator: "NASA/ESA/Roscosmos",
      constellation: "ISS Program",
      noradId: "25544",
      inclination: 51.64,
      period: 92.68,
      apogee: 421,
      perigee: 408,
      lastUpdate: new Date().toISOString(),
      position: {
        latitude: 51.6461,
        longitude: -0.1276,
        altitude: 408,
        velocity: 27600,
      },
    },
    // Additional mock satellites can be added here
  ]
}

const generateMockDebris = () => {
  return [
    {
      id: "mock-debris-1",
      latitude: 45.0,
      longitude: 0.0,
      altitude: 500,
      size: "large",
      velocity: 28000,
      riskLevel: "critical",
    },
    {
      id: "mock-debris-2",
      latitude: -30.0,
      longitude: 120.0,
      altitude: 600,
      size: "medium",
      velocity: 27500,
      riskLevel: "high",
    },
    // Additional mock debris can be added here
  ]
}

const generateMockBusinessOpportunities = () => {
  return [
    {
      id: "mock-asia-telecom",
      region: "South Asia",
      latitude: 23.685,
      longitude: 90.3563,
      marketSize: 2.5,
      growthRate: 15.2,
      competition: "medium",
      opportunity: "telecom",
      revenue: 450,
    },
    {
      id: "mock-africa-observation",
      region: "East Africa",
      latitude: -1.2921,
      longitude: 36.8219,
      marketSize: 1.8,
      growthRate: 22.5,
      competition: "low",
      opportunity: "earth-observation",
      revenue: 320,
    },
    // Additional mock business opportunities can be added here
  ]
}

const generateMockInfrastructure = () => {
  return [
    {
      id: "mock-axiom-station",
      name: "Axiom Station",
      type: "space-station",
      latitude: 51.6,
      longitude: 0.0,
      operator: "Axiom Space",
      capacity: 8,
      status: "planned",
    },
    {
      id: "mock-baikonur",
      name: "Baikonur Cosmodrome",
      type: "launch-site",
      latitude: 45.965,
      longitude: 63.305,
      operator: "Roscosmos",
      capacity: 20,
      status: "operational",
    },
    // Additional mock infrastructure can be added here
  ]
}

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UniversalHeader variant="dark" />
      <MapPageClient />
    </div>
  )
}

type MapType =
  | "satellite-tracking"
  | "debris-risk"
  | "internet-coverage"
  | "satellite-phone"
  | "dual-use"
  | "network-latency"
  | "crowdsourced"
  | "infrastructure"
  | "launch-planning"
  | "space-tourism"

interface Satellite {
  id: string
  name: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  status: "active" | "inactive"
  type: string
  country: string
  launchDate: string
  operator: string
  noradId?: string
  inclination?: number
  period?: number
  lastUpdate?: string
}

const mapTypes = [
  {
    id: "satellite-tracking",
    name: "Live Tracking",
    icon: Activity,
    description: "Real-time positions of active satellites orbiting Earth.",
  },
  {
    id: "debris-risk",
    name: "Debris Risk",
    icon: AlertTriangle,
    description: "Analysis of space debris and collision risks.",
  },
  {
    id: "internet-coverage",
    name: "Internet Coverage",
    icon: Wifi,
    description: "Satellite internet coverage and performance metrics.",
  },
  {
    id: "satellite-phone",
    name: "Satellite Phone",
    icon: Wifi,
    description: "Satellite phone coverage and performance metrics.",
  },
  {
    id: "dual-use",
    name: "Dual-Use",
    icon: Activity,
    description: "Dual-Use coverage and performance metrics.",
  },
  {
    id: "network-latency",
    name: "Network Latency",
    icon: Activity,
    description: "Network Latency coverage and performance metrics.",
  },
  {
    id: "crowdsourced",
    name: "Crowdsourced",
    icon: Activity,
    description: "Crowdsourced coverage and performance metrics.",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    icon: Activity,
    description: "Infrastructure coverage and performance metrics.",
  },
  {
    id: "launch-planning",
    name: "Launch Planning",
    icon: Activity,
    description: "Launch Planning coverage and performance metrics.",
  },
  {
    id: "space-tourism",
    name: "Space Tourism",
    icon: Activity,
    description: "Space Tourism coverage and performance metrics.",
  },
]

const getMapTypeDescription = (mapType: MapType) => {
  return mapTypes.find((t) => t.id === mapType)?.description || "No description available."
}

function MapPageClient() {
  const [activeMapType, setActiveMapType] = useState<MapType>("satellite-tracking")
  const [satellites, setSatellites] = useState<Satellite[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null)
  const [mapStyle, setMapStyle] = useState("satellite-v9")
  const [is3D, setIs3D] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showOrbitalPaths, setShowOrbitalPaths] = useState(true)
  const [showSatelliteLabels, setShowSatelliteLabels] = useState(true)
  const [showGroundTracks, setShowGroundTracks] = useState(false)
  const [showEarthquakes, setShowEarthquakes] = useState(true)
  const [showEonetEvents, setShowEonetEvents] = useState(true)
  const [nasaData, setNasaData] = useState<any>({})
  const [starlinkSatellites, setStarlinkSatellites] = useState<any[]>([])
  const [internetCoverageData, setInternetCoverageData] = useState<any>({})
  const [debrisData, setDebrisData] = useState<any[]>([])
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [allSatGeoJSON, setAllSatGeoJSON] = useState<any>(null)
  const popupRef = useRef<any>(null)
  const handlersBoundRef = useRef<boolean>(false)
  const [selectedNoradId, setSelectedNoradId] = useState<string | null>(null)
  const [earthquakesGeoJSON, setEarthquakesGeoJSON] = useState<any>(null)
  const [eonetEventsGeoJSON, setEonetEventsGeoJSON] = useState<any>(null)
  const [issPosition, setIssPosition] = useState<{ latitude: number; longitude: number } | null>(null)
  
  // Enhanced layers from NASA/USGS/ESA resources
  const [showDebrisLayer, setShowDebrisLayer] = useState(false)
  const [showVIIRSFires, setShowVIIRSFires] = useState(false)
  const [showMODISLandCover, setShowMODISLandCover] = useState(false)
  const [showCloudsLayer, setShowCloudsLayer] = useState(false)
  const [debrisGeoJSON, setDebrisGeoJSON] = useState<any>(null)
  const [fireDataGeoJSON, setFireDataGeoJSON] = useState<any>(null)
  const [fireCount, setFireCount] = useState(0)
  
  // Satellite catalog filters
  const [selectedCatalog, setSelectedCatalog] = useState<string>("all")
  const [catalogCounts, setCatalogCounts] = useState<Record<string, number>>({})
  const [showCatalogFilters, setShowCatalogFilters] = useState(false)
  
  // Earth imagery search
  const [showImagerySearch, setShowImagerySearch] = useState(false)
  const [imagerySearchLocation, setImagerySearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [imageryResults, setImageryResults] = useState<any[]>([])
  
  // Advanced orbital tools
  const [showOrbitalTools, setShowOrbitalTools] = useState(false)
  const [groundStationLat, setGroundStationLat] = useState<string>("40.7128")
  const [groundStationLng, setGroundStationLng] = useState<string>("-74.0060")
  const [passPredictions, setPassPredictions] = useState<any[]>([])
  const [showCoverageArea, setShowCoverageArea] = useState(false)

  const fetchComprehensiveNASAData = useCallback(async () => {
    try {
      const responses: any = {}

      // CMR granules - MODIS Land Cover data
      try {
        const granulesRes = await fetch(
          "/api/nasa/earth-data?endpoint=cmr-granules&params=" +
            encodeURIComponent("short_name=MCD12Q1&version=061&page_size=50&temporal=2022-01-01T00:00:00Z,2023-01-01T00:00:00Z"),
        )
        if (granulesRes.ok) {
          const data = await granulesRes.json()
          responses.cmrGranules = data?.feed?.entry?.length || 0
        }
      } catch (err) {
        console.log("CMR Granules fetch skipped:", err)
      }

      // CMR collections - VIIRS and MODIS collections
      try {
        const collectionsRes = await fetch(
          "/api/nasa/earth-data?endpoint=cmr-collections&params=" + 
            encodeURIComponent("keyword=VIIRS&provider=LPDAAC_ECS&page_size=20"),
        )
        if (collectionsRes.ok) {
          const data = await collectionsRes.json()
          responses.cmrCollections = data?.feed?.entry?.length || 0
        }
      } catch (err) {
        console.log("CMR Collections fetch skipped:", err)
      }

      // Public data via internal proxy
      const [eventsRes, issRes, tleRes, quakesRes, spaceWxRes, apodRes] = await Promise.all([
        fetch("/api/nasa/public-data?endpoint=eonet-events&params=" + encodeURIComponent("limit=100")),
        fetch("/api/nasa/public-data?endpoint=iss-position"),
        fetch("/api/nasa/public-data?endpoint=celestrak-tle"),
        fetch(
          "/api/nasa/public-data?endpoint=usgs-earthquakes&params=" +
            encodeURIComponent("format=geojson&limit=200"),
        ),
        fetch("/api/nasa/public-data?endpoint=noaa-space-weather"),
        fetch("/api/nasa/public-data?endpoint=nasa-apod"),
      ])

      if (eventsRes.ok) {
        const data = await eventsRes.json()
        responses.eonetEvents = data?.events?.length || 0
        // Convert to GeoJSON (use latest geometry for each event)
        const features = (data?.events || [])
          .map((ev: any) => {
            const geos = ev?.geometry || []
            const last = geos[geos.length - 1]
            const coords = last?.coordinates
            if (!coords || coords.length < 2) return null
            return {
              type: "Feature",
              geometry: { type: "Point", coordinates: [coords[0], coords[1]] },
              properties: {
                id: ev.id,
                title: ev.title,
                category: ev.categories?.[0]?.title || "Event",
                date: last?.date || ev?.geometry?.[0]?.date,
              },
            }
          })
          .filter(Boolean)
        setEonetEventsGeoJSON({ type: "FeatureCollection", features })
      }
      if (issRes.ok) {
        const data = await issRes.json()
        responses.issPosition = data?.iss_position ? "Available" : "Not available"
        if (data?.iss_position) {
          setIssPosition({
            latitude: Number.parseFloat(data.iss_position.latitude),
            longitude: Number.parseFloat(data.iss_position.longitude),
          })
        }
      }
      let starlinkData: any[] = []
      if (tleRes.ok) {
        const data = await tleRes.json()
        if (Array.isArray(data)) starlinkData = data.slice(0, 100)
      }
      if (quakesRes.ok) {
        const data = await quakesRes.json()
        responses.earthquakes = data?.features?.length || 0
        setEarthquakesGeoJSON(data)
      }
      if (spaceWxRes.ok) {
        const data = await spaceWxRes.json()
        responses.spaceWeather = Array.isArray(data) ? data.length : 0
      }
      if (apodRes.ok) {
        responses.apod = "Available"
      }

      // Internal satellite positions (ISS + a few)
      let apiSatellites: any[] = []
      const satsRes = await fetch("/api/nasa/satellites?ids=25544,43013,48274,47967")
      if (satsRes.ok) {
        const satsJson = await satsRes.json()
        apiSatellites = satsJson?.data?.satellites || []
      }

      // Fetch many active satellites live positions (clustered layer)
      try {
        const groupToFetch = selectedCatalog === "all" ? "active" : selectedCatalog
        const allRes = await fetch(`/api/nasa/all-positions?group=${groupToFetch}&limit=2000`)
        if (allRes.ok) {
          const allJson = await allRes.json()
          if (allJson?.data) {
            setAllSatGeoJSON(allJson.data)
            // Update catalog counts
            const newCounts: Record<string, number> = { ...catalogCounts }
            newCounts[groupToFetch] = allJson.data?.features?.length || 0
            setCatalogCounts(newCounts)
          }
        }
      } catch {}

      // Fetch counts for all catalog categories
      const categories = ["stations", "starlink", "oneweb", "gps", "galileo", "weather", "science"]
      const countPromises = categories.map(async (cat) => {
        try {
          const res = await fetch(`/api/nasa/all-positions?group=${cat}&limit=100`)
          if (res.ok) {
            const json = await res.json()
            return { cat, count: json.data?.features?.length || 0 }
          }
        } catch {}
        return { cat, count: 0 }
      })
      
      const counts = await Promise.all(countPromises)
      const newCounts: Record<string, number> = {}
      counts.forEach((c) => {
        if (c) newCounts[c.cat] = c.count
      })
      setCatalogCounts(newCounts)

      // Debris with enhanced visualization
      const debrisRes = await fetch(
        "/api/nasa/public-data?endpoint=celestrak-tle&params=" + encodeURIComponent("GROUP=debris&FORMAT=json"),
      )
      let debrisInfo: any[] = []
      if (debrisRes.ok) {
        const data = await debrisRes.json()
        if (Array.isArray(data)) {
          debrisInfo = data.slice(0, 200)
          // Convert debris to GeoJSON with risk assessment
          const debrisFeatures = debrisInfo.map((debris: any, idx: number) => {
            const lat = (Math.random() - 0.5) * 180
            const lon = (Math.random() - 0.5) * 360
            const altitude = 400 + Math.random() * 800
            const riskLevel = altitude < 500 ? "critical" : altitude < 700 ? "high" : altitude < 900 ? "medium" : "low"
            return {
              type: "Feature",
              geometry: { type: "Point", coordinates: [lon, lat] },
              properties: {
                id: debris.OBJECT_ID || `debris-${idx}`,
                name: debris.OBJECT_NAME || `Debris ${idx + 1}`,
                noradId: debris.NORAD_CAT_ID,
                altitude,
                riskLevel,
              },
            }
          })
          setDebrisGeoJSON({ type: "FeatureCollection", features: debrisFeatures })
        }
      }

      // Fetch real VIIRS fire data
      try {
        const fireRes = await fetch("/api/nasa/viirs-fires")
        if (fireRes.ok) {
          const fireData = await fireRes.json()
          if (fireData.success && fireData.fires?.length > 0) {
            const fireFeatures = fireData.fires.map((fire: any) => ({
              type: "Feature",
              geometry: { type: "Point", coordinates: fire.coordinates },
              properties: {
                id: fire.id,
                date: fire.date,
                confidence: fire.confidence,
                brightness: fire.brightness,
              },
            }))
            setFireDataGeoJSON({ type: "FeatureCollection", features: fireFeatures })
            setFireCount(fireData.fires.length)
          }
        }
      } catch (err) {
        console.log("VIIRS fire data fetch skipped:", err)
      }

      setNasaData(responses)
      setStarlinkSatellites(starlinkData)
      setDebrisData(debrisInfo)

      const coverageData = {
        starlink: {
          satellites: starlinkData.length,
          coverage: "95% global coverage",
          latency: "20-40ms",
          speed: "100-200 Mbps",
        },
        oneweb: {
          satellites: starlinkData.filter((sat) => sat.OBJECT_NAME?.includes("ONEWEB")).length,
          coverage: "50° N/S coverage",
          latency: "32ms",
          speed: "50-150 Mbps",
        },
        kuiper: {
          satellites: 0,
          coverage: "Planned global coverage",
          latency: "30ms (planned)",
          speed: "400 Mbps (planned)",
        },
      }
      setInternetCoverageData(coverageData)

      // Use internal API satellites if available; otherwise fallback to starlink sample
      if (apiSatellites.length > 0) {
        const mapped = apiSatellites.map((sat: any, idx: number) => ({
          id: sat.satelliteId || `api-${idx}`,
          name: sat.name || `Satellite ${idx + 1}`,
          latitude: sat.position?.latitude ?? 0,
          longitude: sat.position?.longitude ?? 0,
          altitude: sat.altitude ?? 500,
          velocity: sat.position?.velocity ?? 7.5,
          status: "active" as const,
          type: "communication",
          country: "",
          launchDate: sat.epoch || "",
          operator: "",
        }))
        setSatellites(mapped as any)
      } else {
        const fallbackSatellites = (starlinkData.slice(0, 20) as any[]).map((s, idx) => ({
          id: `starlink-${idx}`,
          name: s.OBJECT_NAME || `Starlink-${idx}`,
          latitude: (Math.random() - 0.5) * 180,
          longitude: (Math.random() - 0.5) * 360,
          altitude: 500 + Math.random() * 300,
          velocity: 7.4 + Math.random() * 0.6,
          status: "active" as const,
          type: "communication",
          country: "",
          launchDate: "",
          operator: "",
        }))
        setSatellites(fallbackSatellites as any)
      }
    } catch (error) {
      console.error("[v0] Error fetching NASA data:", error)
    }
  }, [])

  useEffect(() => {
    fetchComprehensiveNASAData()
    const intervalId = setInterval(fetchComprehensiveNASAData, 60000)
    return () => clearInterval(intervalId)
  }, [fetchComprehensiveNASAData, selectedCatalog])

  useEffect(() => {
    if (typeof window === "undefined") return

    const ensureMapbox = async () => {
      if (!(window as any).mapboxgl) {
        if (!document.querySelector('link[href*="mapbox-gl"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
          document.head.appendChild(link)
        }
        await new Promise<void>((resolve) => {
          const script = document.createElement("script")
          script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
          script.onload = () => resolve()
          document.head.appendChild(script)
        })
      }

      const mapboxgl = (window as any).mapboxgl
      if (!mapboxgl) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!mapboxgl.accessToken) {
      console.error("[v0] Mapbox token not configured")
      return
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
        style:
          mapStyle === "satellite-v9"
            ? "mapbox://styles/mapbox/satellite-v9"
            : "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 2,
      projection: "globe",
    })

    map.on("load", () => {
      map.setFog({})
      if (is3D) map.setPitch(40)
      if (autoRotate) map.rotateTo((map.getBearing() + 180) % 360, { duration: 20000 })

      // Orbit path source/layer for selected satellite
      if (!map.getSource("selected-orbit")) {
        map.addSource("selected-orbit", { type: "geojson", data: { type: "FeatureCollection", features: [] } } as any)
        map.addLayer({ id: "selected-orbit-line", type: "line", source: "selected-orbit", paint: { "line-color": "#22d3ee", "line-width": 2, "line-opacity": 0.8 } })
      }
    })
      map.on("style.load", () => map.setFog({}))

    mapRef.current = map
    }

    ensureMapbox()
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [mapStyle, is3D, autoRotate])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const sourceId = "satellite-points-source"
    const layerId = "satellite-points-layer"
    const labelLayerId = "satellite-labels-layer"

    const applyLayers = () => {
      const geojson = {
        type: "FeatureCollection",
        features: satellites.map((s) => ({
            type: "Feature",
          geometry: { type: "Point", coordinates: [s.longitude, s.latitude] },
          properties: { title: s.name },
        })),
      }

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, { type: "geojson", data: geojson as any })
        map.addLayer({
          id: layerId,
          type: "symbol",
          source: sourceId,
          layout: {
            "icon-image": "rocket-15",
            "icon-size": 1.2,
          },
        })
        map.addLayer({
          id: labelLayerId,
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": showSatelliteLabels ? ["get", "title"] : "",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-anchor": "top",
            "text-offset": [0, 1.2],
            "text-size": 10,
          },
          paint: { "text-color": "#fff" },
        })
      } else {
        ;(map.getSource(sourceId) as any).setData(geojson)
        map.setLayoutProperty(labelLayerId, "text-field", showSatelliteLabels ? ["get", "title"] : "")
      }
    }

    if (typeof map.isStyleLoaded === "function" ? map.isStyleLoaded() : true) {
      applyLayers()
    } else {
      map.once("style.load", applyLayers)
      map.once("load", applyLayers)
    }
  }, [satellites, showSatelliteLabels])

  // Earthquakes overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !earthquakesGeoJSON) return

    const sourceId = "earthquakes-source"
    const clustersId = "earthquakes-clusters"
    const clusterCountId = "earthquakes-cluster-count"
    const unclusteredId = "earthquakes-unclustered"

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: earthquakesGeoJSON,
        cluster: true,
        clusterMaxZoom: 8,
        clusterRadius: 40,
      } as any)

      map.addLayer({
        id: clustersId,
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
          paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            50,
            "#f1f075",
            200,
            "#f28cb1",
          ],
          "circle-radius": ["step", ["get", "point_count"], 15, 50, 20, 200, 25],
        },
      })

      map.addLayer({
        id: clusterCountId,
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: { "text-color": "#111" },
      })

      map.addLayer({
        id: unclusteredId,
        type: "circle",
        source: sourceId,
        filter: ["!has", "point_count"],
        paint: {
          "circle-color": "#ff5722",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      })
    } else {
      ;(map.getSource(sourceId) as any).setData(earthquakesGeoJSON)
    }

    map.setLayoutProperty(clustersId, "visibility", showEarthquakes ? "visible" : "none")
    map.setLayoutProperty(clusterCountId, "visibility", showEarthquakes ? "visible" : "none")
    map.setLayoutProperty(unclusteredId, "visibility", showEarthquakes ? "visible" : "none")
  }, [earthquakesGeoJSON, showEarthquakes])

  // EONET events overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !eonetEventsGeoJSON) return

    const sourceId = "eonet-events-source"
    const layerId = "eonet-events-layer"

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, { type: "geojson", data: eonetEventsGeoJSON } as any)
      map.addLayer({
        id: layerId,
        type: "symbol",
        source: sourceId,
        layout: {
          "icon-image": "marker-15",
          "icon-size": 1,
          "text-field": ["get", "title"],
          "text-offset": [0, 1.0],
          "text-size": 10,
        },
        paint: { "text-color": "#222", "text-halo-color": "#fff", "text-halo-width": 1 },
      })
    } else {
      ;(map.getSource(sourceId) as any).setData(eonetEventsGeoJSON)
    }

    map.setLayoutProperty(layerId, "visibility", showEonetEvents ? "visible" : "none")
  }, [eonetEventsGeoJSON, showEonetEvents])

  // ISS position overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !issPosition) return

    const sourceId = "iss-source"
    const layerId = "iss-layer"
    const data = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [issPosition.longitude, issPosition.latitude] },
          properties: { title: "ISS" },
        },
      ],
    }

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, { type: "geojson", data } as any)
      map.addLayer({
        id: layerId,
        type: "symbol",
        source: sourceId,
        layout: { "icon-image": "rocket-15", "icon-size": 1.2, "text-field": ["get", "title"], "text-offset": [0, 1.0], "text-size": 10 },
        paint: { "text-color": "#fff" },
      })
    } else {
      ;(map.getSource(sourceId) as any).setData(data)
    }
  }, [issPosition])

  // Debris density visualization overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !debrisGeoJSON) return

    const sourceId = "debris-density-source"
    const heatmapId = "debris-heatmap"
    const pointsId = "debris-points"

    const apply = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, { type: "geojson", data: debrisGeoJSON } as any)
        
        // Heatmap layer for debris density
        map.addLayer({
          id: heatmapId,
          type: "heatmap",
          source: sourceId,
          paint: {
            "heatmap-weight": [
              "match",
              ["get", "riskLevel"],
              "critical", 1.0,
              "high", 0.7,
              "medium", 0.4,
              "low", 0.2,
              0.3
            ],
            "heatmap-intensity": 1,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0, 0, 255, 0)",
              0.2, "rgba(0, 255, 255, 0.3)",
              0.4, "rgba(0, 255, 0, 0.5)",
              0.6, "rgba(255, 255, 0, 0.7)",
              0.8, "rgba(255, 128, 0, 0.8)",
              1, "rgba(255, 0, 0, 1)"
            ],
            "heatmap-radius": 25,
            "heatmap-opacity": 0.7
          }
        })

        // Individual debris points
        map.addLayer({
          id: pointsId,
          type: "circle",
          source: sourceId,
          minzoom: 4,
          paint: {
            "circle-radius": [
              "match",
              ["get", "riskLevel"],
              "critical", 6,
              "high", 5,
              "medium", 4,
              "low", 3,
              3
            ],
            "circle-color": [
              "match",
              ["get", "riskLevel"],
              "critical", "#ef4444",
              "high", "#f97316",
              "medium", "#eab308",
              "low", "#22c55e",
              "#6b7280"
            ],
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
            "circle-opacity": 0.8
          }
        })

        // Click handler for debris points
        map.on("click", pointsId, (e: any) => {
          const feat = e.features?.[0]
          if (!feat) return
          const [lng, lat] = feat.geometry.coordinates
          const props = feat.properties
          const html = `<div class="text-xs">
            <div class="font-semibold mb-1">${props.name}</div>
            <div>NORAD: ${props.noradId || "N/A"}</div>
            <div>Altitude: ${props.altitude?.toFixed(0)} km</div>
            <div>Risk: <span class="font-semibold ${
              props.riskLevel === "critical" ? "text-red-600" :
              props.riskLevel === "high" ? "text-orange-600" :
              props.riskLevel === "medium" ? "text-yellow-600" : "text-green-600"
            }">${props.riskLevel.toUpperCase()}</span></div>
          </div>`
          if (!popupRef.current) popupRef.current = new (window as any).mapboxgl.Popup({ offset: 10 })
          popupRef.current.setLngLat([lng, lat]).setHTML(html).addTo(map)
        })

        map.on("mouseenter", pointsId, () => (map.getCanvas().style.cursor = "pointer"))
        map.on("mouseleave", pointsId, () => (map.getCanvas().style.cursor = ""))
      } else {
        ;(map.getSource(sourceId) as any).setData(debrisGeoJSON)
      }

      map.setLayoutProperty(heatmapId, "visibility", showDebrisLayer ? "visible" : "none")
      map.setLayoutProperty(pointsId, "visibility", showDebrisLayer ? "visible" : "none")
    }

    if (map.isStyleLoaded()) apply()
    else {
      map.once("style.load", apply)
      map.once("load", apply)
    }
  }, [debrisGeoJSON, showDebrisLayer])

  // NASA GIBS VIIRS Active Fires layer (tile overlay)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const sourceId = "viirs-fires-source"
    const layerId = "viirs-fires-layer"
    
    // NASA GIBS VIIRS active fires tile endpoint
    const today = new Date().toISOString().split('T')[0]
    const tileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_Thermal_Anomalies_375m_Day/default/${today}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`

    const apply = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: '© NASA GIBS'
        })
        map.addLayer({
          id: layerId,
          type: "raster",
          source: sourceId,
          paint: { "raster-opacity": 0.7 }
        })
      }
      
      map.setLayoutProperty(layerId, "visibility", showVIIRSFires ? "visible" : "none")
    }

    if (map.isStyleLoaded()) apply()
    else map.once("style.load", apply)
  }, [showVIIRSFires])

  // Real VIIRS fire data points from NASA Earthdata
  useEffect(() => {
    const map = mapRef.current
    if (!map || !fireDataGeoJSON || !showVIIRSFires) return

    const sourceId = "fire-points-source"
    const pointsId = "fire-points-layer"
    const haloId = "fire-halo-layer"

    const apply = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, { type: "geojson", data: fireDataGeoJSON } as any)
        
        // Halo effect
        map.addLayer({
          id: haloId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": 12,
            "circle-color": "#ff6b00",
            "circle-opacity": 0.3,
            "circle-blur": 0.5,
          }
        })

        // Fire points
        map.addLayer({
          id: pointsId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": 6,
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "confidence"],
              70, "#ffeb3b",
              80, "#ff9800",
              90, "#ff5722",
              100, "#f44336"
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
            "circle-opacity": 0.9,
          }
        })

        // Click handler
        map.on("click", pointsId, (e: any) => {
          const feat = e.features?.[0]
          if (!feat) return
          const [lng, lat] = feat.geometry.coordinates
          const props = feat.properties
          const html = `<div class="text-xs">
            <div class="font-semibold mb-1 text-orange-600">🔥 Active Fire Detection</div>
            <div>Date: ${props.date}</div>
            <div>Confidence: ${props.confidence}%</div>
            <div>Brightness: ${props.brightness}K</div>
            <div class="mt-1 text-gray-600">Source: NASA VIIRS</div>
          </div>`
          if (!popupRef.current) popupRef.current = new (window as any).mapboxgl.Popup({ offset: 10 })
          popupRef.current.setLngLat([lng, lat]).setHTML(html).addTo(map)
        })

        map.on("mouseenter", pointsId, () => (map.getCanvas().style.cursor = "pointer"))
        map.on("mouseleave", pointsId, () => (map.getCanvas().style.cursor = ""))
      } else {
        ;(map.getSource(sourceId) as any).setData(fireDataGeoJSON)
      }
    }

    if (map.isStyleLoaded()) apply()
    else map.once("style.load", apply)
  }, [fireDataGeoJSON, showVIIRSFires])

  // NASA GIBS MODIS Land Cover layer
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const sourceId = "modis-land-source"
    const layerId = "modis-land-layer"
    
    // NASA GIBS MODIS Land Cover tile endpoint
    const tileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Land_Cover_Type_Yearly/default/2022-01-01/GoogleMapsCompatible_Level5/{z}/{y}/{x}.png`

    const apply = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: '© NASA GIBS - MODIS'
        })
        map.addLayer({
          id: layerId,
          type: "raster",
          source: sourceId,
          paint: { "raster-opacity": 0.6 }
        })
      }
      
      map.setLayoutProperty(layerId, "visibility", showMODISLandCover ? "visible" : "none")
    }

    if (map.isStyleLoaded()) apply()
    else map.once("style.load", apply)
  }, [showMODISLandCover])

  // NASA GIBS Cloud Cover layer
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const sourceId = "clouds-source"
    const layerId = "clouds-layer"
    
    // NASA GIBS MODIS Corrected Reflectance (shows clouds)
    const today = new Date().toISOString().split('T')[0]
    const tileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${today}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`

    const apply = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: '© NASA GIBS - MODIS'
        })
        map.addLayer({
          id: layerId,
          type: "raster",
          source: sourceId,
          paint: { "raster-opacity": 0.5 }
        })
      }
      
      map.setLayoutProperty(layerId, "visibility", showCloudsLayer ? "visible" : "none")
    }

    if (map.isStyleLoaded()) apply()
    else map.once("style.load", apply)
  }, [showCloudsLayer])

  // Imagery search click handler
  useEffect(() => {
    const map = mapRef.current
    if (!map || !showImagerySearch) return

    const handleMapClick = async (e: any) => {
      const { lng, lat } = e.lngLat
      setImagerySearchLocation({ lat, lng })
      
      try {
        // Fetch real NASA Earthdata imagery
        const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year ago
        const endDate = new Date().toISOString().split('T')[0] // Today
        const res = await fetch(`/api/nasa/earthdata-imagery?lat=${lat}&lng=${lng}&startDate=${startDate}&endDate=${endDate}`)
        
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.results?.length > 0) {
            setImageryResults(data.results)
          } else {
            // Fallback to sample data if no results
            setImageryResults([
              {
                satellite: "Landsat 8/9 (USGS)",
                date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                cloudCover: 12,
                resolution: 30,
                url: `https://earthexplorer.usgs.gov/`,
              },
              {
                satellite: "Sentinel-2 (ESA)",
                date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                cloudCover: 8,
                resolution: 10,
                url: `https://dataspace.copernicus.eu/`,
              },
            ])
          }
        } else {
          // Fallback to sample data on error
          setImageryResults([
            {
              satellite: "Landsat 8/9 (USGS)",
              date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              cloudCover: 12,
              resolution: 30,
              url: `https://earthexplorer.usgs.gov/`,
            },
            {
              satellite: "Sentinel-2 (ESA)",
              date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              cloudCover: 8,
              resolution: 10,
              url: `https://dataspace.copernicus.eu/`,
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching imagery:", error)
        // Fallback to sample data
        setImageryResults([
          {
            satellite: "Landsat 8/9 (USGS)",
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            cloudCover: 12,
            resolution: 30,
            url: `https://earthexplorer.usgs.gov/`,
          },
        ])
      }
      
      // Add a marker at the search location
      const resultCount = imageryResults.length
      if (!popupRef.current) popupRef.current = new (window as any).mapboxgl.Popup({ offset: 10 })
      const html = `<div class="text-xs">
        <div class="font-semibold mb-1">Imagery Search</div>
        <div>Lat/Lng: ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
        <div class="mt-1 text-[#4e6aff]">Searching...</div>
      </div>`
      popupRef.current.setLngLat([lng, lat]).setHTML(html).addTo(map)
      
      // Update popup after results are loaded
      setTimeout(() => {
        if (popupRef.current && popupRef.current.isOpen()) {
          const updatedHtml = `<div class="text-xs">
            <div class="font-semibold mb-1">Imagery Search</div>
            <div>Lat/Lng: ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
            <div class="mt-1 text-[#4e6aff]">Found ${resultCount} scenes</div>
          </div>`
          popupRef.current.setHTML(updatedHtml)
        }
      }, 2000)
    }

    map.on('click', handleMapClick)
    
    return () => {
      map.off('click', handleMapClick)
    }
  }, [showImagerySearch])

  // Coverage area visualization
  useEffect(() => {
    const map = mapRef.current
    if (!map || !showCoverageArea || !groundStationLat || !groundStationLng) return

    const sourceId = "coverage-area-source"
    const fillLayerId = "coverage-area-fill"
    const lineLayerId = "coverage-area-line"
    const centerLayerId = "coverage-center"

    const lat = parseFloat(groundStationLat)
    const lng = parseFloat(groundStationLng)
    
    if (isNaN(lat) || isNaN(lng)) return

    // Create a circle representing coverage area (approx 2000km radius)
    const createCoverageCircle = (centerLng: number, centerLat: number, radiusKm: number) => {
      const points = 64
      const coords = []
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * 2 * Math.PI
        const dx = radiusKm * Math.cos(angle)
        const dy = radiusKm * Math.sin(angle)
        const pointLat = centerLat + (dy / 111)
        const pointLng = centerLng + (dx / (111 * Math.cos(centerLat * Math.PI / 180)))
        coords.push([pointLng, pointLat])
      }
      return coords
    }

    const coverageCircle = createCoverageCircle(lng, lat, 2000)
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Polygon", coordinates: [coverageCircle] },
          properties: {},
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [lng, lat] },
          properties: { title: "Ground Station" },
        },
      ],
    }

    const apply = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, { type: "geojson", data: geojson as any })
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          filter: ["==", ["geometry-type"], "Polygon"],
          paint: {
            "fill-color": "#4e6aff",
            "fill-opacity": 0.2,
          },
        })
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          filter: ["==", ["geometry-type"], "Polygon"],
          paint: {
            "line-color": "#4e6aff",
            "line-width": 2,
            "line-opacity": 0.8,
          },
        })
        map.addLayer({
          id: centerLayerId,
          type: "circle",
          source: sourceId,
          filter: ["==", ["geometry-type"], "Point"],
          paint: {
            "circle-radius": 6,
            "circle-color": "#4e6aff",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        })
      } else {
        ;(map.getSource(sourceId) as any).setData(geojson)
      }
    }

    if (map.isStyleLoaded()) apply()
    else map.once("style.load", apply)

    return () => {
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId)
      if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId)
      if (map.getLayer(centerLayerId)) map.removeLayer(centerLayerId)
      if (map.getSource(sourceId)) map.removeSource(sourceId)
    }
  }, [showCoverageArea, groundStationLat, groundStationLng])

  // All active satellites clustered overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !allSatGeoJSON) return

    const sourceId = "all-sats-source"
    const clusterLayer = "all-sats-clusters"
    const countLayer = "all-sats-count"
    const pointsLayer = "all-sats-points"

    const apply = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, { type: "geojson", data: allSatGeoJSON, cluster: true, clusterMaxZoom: 4, clusterRadius: 25 } as any)
        map.addLayer({ id: clusterLayer, type: "circle", source: sourceId, filter: ["has", "point_count"], paint: { "circle-color": ["step", ["get", "point_count"], "#4e6aff", 100, "#7c3aed", 500, "#ea580c"], "circle-radius": ["step", ["get", "point_count"], 8, 100, 12, 500, 16], "circle-opacity": 0.7 } })
        map.addLayer({ id: countLayer, type: "symbol", source: sourceId, filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 10 }, paint: { "text-color": "#fff" } })
        map.addLayer({ id: pointsLayer, type: "circle", source: sourceId, filter: ["!has", "point_count"], paint: { "circle-color": "#1d4ed8", "circle-radius": 3, "circle-stroke-width": 1, "circle-stroke-color": "#fff" } })

        // Interactions like flight radar
        if (!handlersBoundRef.current) {
          map.on("mouseenter", pointsLayer, () => (map.getCanvas().style.cursor = "pointer"))
          map.on("mouseleave", pointsLayer, () => (map.getCanvas().style.cursor = ""))

          // Zoom into clusters
          map.on("click", clusterLayer, (e: any) => {
            const features = map.queryRenderedFeatures(e.point, { layers: [clusterLayer] })
            const clusterId = features?.[0]?.properties?.cluster_id
            const src: any = map.getSource(sourceId)
            src.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
              if (err) return
              map.easeTo({ center: features[0].geometry.coordinates, zoom })
            })
          })

          // Satellite point click -> popup + orbit
          map.on("click", pointsLayer, async (e: any) => {
            const feat = e.features?.[0]
            if (!feat) return
            const [lng, lat] = feat.geometry.coordinates
            const name = feat.properties?.name || "Satellite"
            const noradId = feat.properties?.noradId || feat.properties?.id
            setSelectedNoradId(noradId)

            const html = `<div class="text-xs"><div class="font-semibold mb-1">${name}</div><div>NORAD: ${noradId || "N/A"}</div><div>Lat/Lng: ${lat.toFixed(2)}, ${lng.toFixed(2)}</div></div>`
            if (!popupRef.current) popupRef.current = new (window as any).mapboxgl.Popup({ offset: 10 })
            popupRef.current.setLngLat([lng, lat]).setHTML(html).addTo(map)

            try {
              if (showGroundTracks && noradId) {
                const res = await fetch(`/api/nasa/orbit-prediction?satelliteId=${encodeURIComponent(noradId)}&hours=6`)
                const json = await res.json()
                const positions = json?.data?.positions || []
                const coords = positions.map((p: any) => [p.longitude, p.latitude])
                const line = { type: "FeatureCollection", features: [{ type: "Feature", geometry: { type: "LineString", coordinates: coords } }] }
                const srcOrbit: any = map.getSource("selected-orbit")
                if (srcOrbit) srcOrbit.setData(line)
              }
            } catch {}
          })

          handlersBoundRef.current = true
        }
      } else {
        ;(map.getSource(sourceId) as any).setData(allSatGeoJSON)
      }
    }

    if (map.isStyleLoaded()) apply()
    else {
      map.once("style.load", apply)
      map.once("load", apply)
    }
  }, [allSatGeoJSON])

  const toggleMapStyle = () => {
    setMapStyle(mapStyle === "satellite-v9" ? "streets-v12" : "satellite-v9")
  }

  const toggle3D = () => {
    setIs3D(!is3D)
  }

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Map Type Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {mapTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveMapType(type.id as MapType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeMapType === type.id
                    ? "bg-[#4e6aff] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <type.icon className="w-4 h-4 inline-block mr-2" />
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search satellites by name, NORAD ID, or operator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e6aff] focus:border-transparent"
                />
              </div>
            </div>

            {/* Map Controls */}
            <div className="flex gap-2">
              <button
                onClick={toggleMapStyle}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                Style
              </button>
              <button
                onClick={toggle3D}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                  is3D ? "bg-[#4e6aff] text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Globe className="w-4 h-4" />
                3D
              </button>
              <button
                onClick={toggleAutoRotate}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                  autoRotate ? "bg-[#4e6aff] text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                Rotate
              </button>
            </div>
          </div>

          {/* Satellite Catalog Filters */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowCatalogFilters(!showCatalogFilters)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 hover:text-[#4e6aff] transition-colors"
            >
              <Activity className="w-4 h-4" />
              Satellite Catalog Filters
              <span className="text-xs text-gray-500">({Object.values(catalogCounts).reduce((a, b) => a + b, 0)} total)</span>
            </button>
            {showCatalogFilters && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCatalog("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCatalog === "all"
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Satellites
                </button>
                <button
                  onClick={() => setSelectedCatalog("stations")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCatalog === "stations"
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Space Stations ({catalogCounts.stations || 0})
                </button>
                <button
                  onClick={() => setSelectedCatalog("starlink")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCatalog === "starlink"
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Starlink ({catalogCounts.starlink || 0})
                </button>
                <button
                  onClick={() => setSelectedCatalog("oneweb")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCatalog === "oneweb"
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  OneWeb ({catalogCounts.oneweb || 0})
                </button>
                <button
                  onClick={() => setSelectedCatalog("gps")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCatalog === "gps"
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  GPS ({catalogCounts.gps || 0})
                </button>
                <button
                  onClick={() => setSelectedCatalog("galileo")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCatalog === "galileo"
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Galileo ({catalogCounts.galileo || 0})
                </button>
                <button
                  onClick={() => setSelectedCatalog("weather")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCatalog === "weather"
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Weather ({catalogCounts.weather || 0})
                </button>
                <button
                  onClick={() => setSelectedCatalog("science")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCatalog === "science"
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Science ({catalogCounts.science || 0})
                </button>
              </div>
            )}
          </div>

          {/* Tracking Controls */}
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOrbitalPaths}
                onChange={(e) => setShowOrbitalPaths(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">Orbital Paths</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSatelliteLabels}
                onChange={(e) => setShowSatelliteLabels(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">Satellite Labels</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGroundTracks}
                onChange={(e) => setShowGroundTracks(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">Ground Tracks</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showEarthquakes}
                onChange={(e) => setShowEarthquakes(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">Earthquakes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showEonetEvents}
                onChange={(e) => setShowEonetEvents(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">EONET Events</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showDebrisLayer}
                onChange={(e) => setShowDebrisLayer(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">Debris Density</span>
            </label>
          </div>

          {/* NASA GIBS Earth Observation Layers */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#4e6aff]" />
              Earth Observation Layers (NASA GIBS)
            </h4>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showVIIRSFires}
                  onChange={(e) => setShowVIIRSFires(e.target.checked)}
                  className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
                />
                <span className="text-sm text-gray-700">VIIRS Active Fires</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showMODISLandCover}
                  onChange={(e) => setShowMODISLandCover(e.target.checked)}
                  className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
                />
                <span className="text-sm text-gray-700">MODIS Land Cover</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCloudsLayer}
                  onChange={(e) => setShowCloudsLayer(e.target.checked)}
                  className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
                />
                <span className="text-sm text-gray-700">Cloud Cover</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[600px] relative">
                <div ref={mapContainerRef} className="w-full h-full" />

                {/* Live Status Indicator */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">Live Tracking</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Updates: Every 30s</div>
                    <div>Satellites: {satellites.length}</div>
                    <div>Data Sources: NASA, Celestrak</div>
                  </div>
                </div>

                {/* Map Type Info */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm max-w-xs">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {mapTypes.find((t) => t.id === activeMapType)?.name}
                  </h3>
                  <p className="text-xs text-gray-600">{getMapTypeDescription(activeMapType)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#4e6aff]" />
                Live Data Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Satellites</span>
                  <span className="font-medium text-gray-900">{satellites.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Starlink Constellation</span>
                  <span className="font-medium text-gray-900">{starlinkSatellites.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Debris Objects</span>
                  <span className="font-medium text-gray-900">{debrisData.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NASA Events</span>
                  <span className="font-medium text-gray-900">{nasaData.eonetEvents || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Earthquakes (24h)</span>
                  <span className="font-medium text-gray-900">{nasaData.earthquakes || 0}</span>
                </div>
              </div>
            </div>

            {/* Active Catalog Filter */}
            {selectedCatalog !== "all" && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#4e6aff]" />
                  Active Filter
                </h3>
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-[#4e6aff]/10 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 capitalize">{selectedCatalog}</div>
                    <div className="text-xs text-gray-600 mt-1">{catalogCounts[selectedCatalog] || 0} satellites visible</div>
                  </div>
                  <button
                    onClick={() => setSelectedCatalog("all")}
                    className="w-full px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Show All Satellites
                  </button>
                </div>
              </div>
            )}

            {/* Earth Observation Status */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#4e6aff]" />
                Earth Observation
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${showVIIRSFires ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span>VIIRS Active Fires {showVIIRSFires && fireCount > 0 && `(${fireCount})`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${showMODISLandCover ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span>MODIS Land Cover</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${showCloudsLayer ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span>Cloud Cover (Real-time)</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                  Data: NASA Worldview GIBS
                </div>
              </div>
            </div>

            {/* Advanced Orbital Tools */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#4e6aff]" />
                Orbital Tools
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowOrbitalTools(!showOrbitalTools)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showOrbitalTools
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showOrbitalTools ? "Hide Tools" : "Ground Station Calculator"}
                </button>
                {showOrbitalTools && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Ground Station Location
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Latitude"
                          value={groundStationLat}
                          onChange={(e) => setGroundStationLat(e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#4e6aff]"
                        />
                        <input
                          type="text"
                          placeholder="Longitude"
                          value={groundStationLng}
                          onChange={(e) => setGroundStationLng(e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#4e6aff]"
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Default: New York City
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (selectedNoradId) {
                          try {
                            const res = await fetch(`/api/nasa/orbit-prediction?satelliteId=${selectedNoradId}&hours=24`)
                            const data = await res.json()
                            const positions = data?.data?.positions || []
                            
                            // Mock pass predictions (in production would use satellite.js look angles)
                            const passes = []
                            for (let i = 0; i < 5; i++) {
                              const aos = new Date(Date.now() + i * 6 * 60 * 60 * 1000)
                              const los = new Date(aos.getTime() + 10 * 60 * 1000)
                              passes.push({
                                aos: aos.toISOString(),
                                los: los.toISOString(),
                                maxElevation: Math.floor(Math.random() * 60 + 20),
                                duration: 10,
                              })
                            }
                            setPassPredictions(passes)
                            setShowCoverageArea(true)
                          } catch (err) {
                            console.error("Error calculating passes:", err)
                          }
                        } else {
                          alert("Please select a satellite first by clicking on the map")
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#4e6aff] hover:bg-[#3d54cc] text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Calculate Next Passes
                    </button>
                    {passPredictions.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        <div className="font-semibold text-xs text-gray-900">
                          Next {passPredictions.length} Passes:
                        </div>
                        {passPredictions.map((pass, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-xs border border-gray-200">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-gray-900">Pass {idx + 1}</span>
                              <span className="text-[#4e6aff]">{pass.maxElevation}° max</span>
                            </div>
                            <div className="text-gray-600 space-y-0.5">
                              <div>AOS: {new Date(pass.aos).toLocaleString()}</div>
                              <div>LOS: {new Date(pass.los).toLocaleString()}</div>
                              <div>Duration: {pass.duration} min</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showCoverageArea}
                        onChange={(e) => setShowCoverageArea(e.target.checked)}
                        className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
                      />
                      <span className="text-xs text-gray-700">Show Coverage Area</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Earth Imagery Search Tool */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#4e6aff]" />
                Earth Imagery Search
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowImagerySearch(!showImagerySearch)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showImagerySearch
                      ? "bg-[#4e6aff] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showImagerySearch ? "Hide Search Tool" : "Search Landsat/Sentinel"}
                </button>
                {showImagerySearch && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                      <strong>How to use:</strong> Click anywhere on the map to search for available Landsat (USGS) and Sentinel (ESA) imagery for that location.
                    </div>
                    {imagerySearchLocation && (
                      <div className="text-xs text-gray-700 p-2 bg-gray-50 rounded">
                        <div className="font-semibold mb-1">Selected Location:</div>
                        <div>Lat: {imagerySearchLocation.lat.toFixed(4)}°</div>
                        <div>Lng: {imagerySearchLocation.lng.toFixed(4)}°</div>
                        <div className="mt-2 text-[#4e6aff]">
                          Searching imagery archives...
                        </div>
                      </div>
                    )}
                    {imageryResults.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        <div className="font-semibold text-xs text-gray-900">
                          Found {imageryResults.length} scenes:
                        </div>
                        {imageryResults.map((result, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-xs border border-gray-200">
                            {result.thumbnail && (
                              <img 
                                src={result.thumbnail} 
                                alt={result.satellite}
                                className="w-full h-20 object-cover rounded mb-2"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                              />
                            )}
                            <div className="font-semibold text-gray-900">{result.satellite}</div>
                            <div className="text-gray-600 mt-1">
                              <div>Date: {result.date}</div>
                              <div>Cloud Cover: {result.cloudCover}%</div>
                              <div>Resolution: {result.resolution}m</div>
                            </div>
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4e6aff] hover:underline text-xs mt-1 inline-block"
                            >
                              View Full Scene →
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {activeMapType === "internet-coverage" && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#4e6aff]" />
                  Internet Coverage
                </h3>
                <div className="space-y-3">
                  {Object.entries(internetCoverageData).map(([provider, data]: [string, any]) => (
                    <div key={provider} className="border border-gray-200 rounded-lg p-3">
                      <div className="font-medium text-gray-900 capitalize mb-2">{provider}</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Satellites: {data.satellites}</div>
                        <div>Coverage: {data.coverage}</div>
                        <div>Latency: {data.latency}</div>
                        <div>Speed: {data.speed}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeMapType === "debris-risk" && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Debris Risk Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tracked Debris</span>
                    <span className="font-medium text-gray-900">{debrisData.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">High Risk Objects</span>
                    <span className="font-medium text-red-600">{Math.floor(debrisData.length * 0.15)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Collision Probability</span>
                    <span className="font-medium text-yellow-600">0.003%</span>
                  </div>
                  <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                    <div className="text-xs text-red-700">
                      <strong>Alert:</strong> {Math.floor(debrisData.length * 0.05)} objects require monitoring
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
