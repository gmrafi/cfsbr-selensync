"use client"

import { useState, useEffect } from "react"

// NASA Earth Data API configuration
const NASA_EARTH_DATA_TOKEN = process.env.NEXT_PUBLIC_NASA_EARTH_DATA_TOKEN || process.env.NASA_EARTH_DATA_TOKEN || ""

const NASA_ENDPOINTS = {
  SATELLITE_TLE: "https://ghrc.nsstc.nasa.gov/services/satellites/elements.pl",
  MODIS_NRT: "https://nrt3.modaps.eosdis.nasa.gov/api/v2/content/archives",
  EARTHDATA_SEARCH: "https://cmr.earthdata.nasa.gov/search/granules.json",
}

export const fetchNASAEarthData = async (dataType: string, params: any = {}) => {
  try {
    const headers = {
      Authorization: `Bearer ${NASA_EARTH_DATA_TOKEN}`,
      "Content-Type": "application/json",
    }

    switch (dataType) {
      case "satellite_tle":
        const tleUrl = `${NASA_ENDPOINTS.SATELLITE_TLE}?satname=${params.satellite}&fromdate=${params.fromDate || new Date().toISOString()}`
        const tleResponse = await fetch(tleUrl, { headers })
        return await tleResponse.text()

      case "modis_data":
        const modisUrl = `${NASA_ENDPOINTS.MODIS_NRT}?product=${params.product || "MOD09GA"}&collection=${params.collection || "6"}`
        const modisResponse = await fetch(modisUrl, { headers })
        return await modisResponse.json()

      case "satellite_search":
        const searchUrl = `${NASA_ENDPOINTS.EARTHDATA_SEARCH}?concept_id=${params.conceptId}&temporal=${params.temporal}`
        const searchResponse = await fetch(searchUrl, { headers })
        return await searchResponse.json()

      default:
        throw new Error(`Unknown data type: ${dataType}`)
    }
  } catch (error) {
    console.error("[v0] NASA Earth Data API Error:", error)
    return null
  }
}

export const useNASASatelliteTracking = () => {
  const [satellites, setSatellites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSatelliteData = async () => {
      try {
        setLoading(true)

        // Fetch TLE data for key LEO satellites
        const keyLEOSatellites = ["TERRA", "AQUA", "LANDSAT-8", "LANDSAT-9", "SENTINEL-1A", "SENTINEL-2A"]
        const satellitePromises = keyLEOSatellites.map(async (satName) => {
          const tleData = await fetchNASAEarthData("satellite_tle", {
            satellite: satName,
            fromDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
          })

          if (tleData) {
            return {
              name: satName,
              tle: tleData,
              position: calculateSatellitePosition(tleData),
              lastUpdate: new Date().toISOString(),
            }
          }
          return null
        })

        const results = await Promise.all(satellitePromises)
        setSatellites(results.filter(Boolean))
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error("[v0] Satellite tracking error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSatelliteData()
    const interval = setInterval(fetchSatelliteData, 5 * 60 * 1000) // Update every 5 minutes

    return () => clearInterval(interval)
  }, [])

  return { satellites, loading, error }
}

const calculateSatellitePosition = (tleData: string) => {
  try {
    // Parse TLE data and calculate current position
    // This is a simplified calculation - in production, use a proper orbital mechanics library
    const lines = tleData.split("\n").filter((line) => line.trim())
    if (lines.length >= 2) {
      // Extract orbital elements from TLE
      const line2 = lines[lines.length - 1]
      const meanMotion = Number.parseFloat(line2.substring(52, 63))
      const epoch = Number.parseFloat(line2.substring(20, 32))

      // Simple position calculation (for demo purposes)
      const currentTime = Date.now() / 1000 / 86400 // Days since epoch
      const orbitalPeriod = 1440 / meanMotion // Minutes
      const currentAngle = (((currentTime * 1440) % orbitalPeriod) / orbitalPeriod) * 360

      return {
        latitude: Math.sin((currentAngle * Math.PI) / 180) * 60, // Simplified
        longitude: ((currentAngle - 180) % 360) - 180,
        altitude: 705, // LEO altitude in km
        velocity: 7.5, // km/s approximate LEO velocity
      }
    }
  } catch (error) {
    console.error("[v0] TLE parsing error:", error)
  }

  return {
    latitude: 0,
    longitude: 0,
    altitude: 705,
    velocity: 7.5,
  }
}

export default {
  fetchNASAEarthData,
  useNASASatelliteTracking,
}
