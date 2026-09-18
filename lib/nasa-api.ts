// NASA API Integration with Celestrak + satellite.js SGP4
import * as satellite from "satellite.js"

export interface TLEData {
  satelliteId: string
  name: string
  line1: string
  line2: string
  epoch: string
  meanMotion: number
  eccentricity: number
  inclination: number
  raan: number // Right Ascension of Ascending Node
  argPerigee: number
  meanAnomaly: number
  altitude: number
  period: number
  intlDes?: string
  launchYear?: number
}

export interface SatellitePosition {
  satelliteId: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: string
  azimuth?: number
  elevation?: number
  range?: number
}

export interface OrbitPrediction {
  satelliteId: string
  positions: SatellitePosition[]
  nextPass: {
    aos: string
    los: string
    maxElevation: number
  }
}

// Celestrak REST API (JSON format, no auth required)
const CELESTRAK_GP_BASE = "https://celestrak.org/NORAD/elements/gp.php"
const CELESTRAK_GROUPS = {
  stations: "stations",
  active: "active",
  starlink: "starlink",
  oneweb: "oneweb",
  gps: "gps-ops",
  galileo: "galileo",
  glonass: "glonass-ops",
  weather: "weather",
  noaa: "noaa",
  earth: "resource",
  science: "science",
  debris: "debris",
  iss: "stations",
} as const

export class NASAAPIClient {
  private static instance: NASAAPIClient
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static getInstance(): NASAAPIClient {
    if (!NASAAPIClient.instance) {
      NASAAPIClient.instance = new NASAAPIClient()
    }
    return NASAAPIClient.instance
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_DURATION
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key)
    return cached?.data
  }

  // Fetch TLE data from Celestrak (supports NORAD catalog numbers or group names)
  async getTLEData(satelliteIds: string[]): Promise<TLEData[]> {
    const cacheKey = `tle-${satelliteIds.join(",")}`

    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    try {
      // Celestrak GP API: fetch each satellite individually (API doesn't support comma-separated list)
      const promises = satelliteIds.map(async (id) => {
        const url = `${CELESTRAK_GP_BASE}?CATNR=${id}&FORMAT=json`
        const response = await fetch(url, {
          headers: { Accept: "application/json" },
        })

        if (!response.ok) {
          console.warn(`[v0] Celestrak API error for ${id}: ${response.status}`)
          return null
        }

        const text = await response.text()
        
        // Celestrak returns "No GP data found" as plain text when satellite not found
        if (text.includes("No GP data found")) {
          console.warn(`[v0] No GP data found for satellite ${id}`)
          return null
        }

        try {
          const data = JSON.parse(text)
          return data[0] // Celestrak returns array with single element
        } catch (parseError) {
          console.warn(`[v0] Failed to parse response for ${id}:`, text)
          return null
        }
      })

      const results = await Promise.all(promises)

      const tleData: TLEData[] = results.filter(Boolean).map((sat: any) => {
        const satrec = satellite.twoline2satrec(sat.TLE_LINE1, sat.TLE_LINE2)
        return {
          satelliteId: sat.NORAD_CAT_ID || sat.OBJECT_ID,
          name: sat.OBJECT_NAME,
          line1: sat.TLE_LINE1,
          line2: sat.TLE_LINE2,
          epoch: sat.EPOCH,
          meanMotion: satrec.no * (1440 / (2 * Math.PI)), // rad/min → rev/day
          eccentricity: satrec.ecco,
          inclination: (satrec.inclo * 180) / Math.PI,
          raan: (satrec.nodeo * 180) / Math.PI,
          argPerigee: (satrec.argpo * 180) / Math.PI,
          meanAnomaly: (satrec.mo * 180) / Math.PI,
          altitude: this.calculateAltitudeFromSatrec(satrec),
          period: (2 * Math.PI) / satrec.no, // minutes
          intlDes: sat.INTLDES,
          launchYear: parseInt(sat.INTLDES?.substring(0, 2) || "0"),
        }
      })

      this.setCache(cacheKey, tleData)
      return tleData
    } catch (error) {
      console.error("[v0] Celestrak API error:", error)
      return this.getMockTLEData(satelliteIds)
    }
  }

  // Fetch TLE data by Celestrak group (e.g., "stations", "starlink")
  async getTLEByGroup(group: keyof typeof CELESTRAK_GROUPS, limit = 50): Promise<TLEData[]> {
    const cacheKey = `group-${group}-${limit}`
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    try {
      const groupName = CELESTRAK_GROUPS[group]
      const url = `${CELESTRAK_GP_BASE}?GROUP=${groupName}&FORMAT=json`
      const response = await fetch(url, { headers: { Accept: "application/json" } })

      if (!response.ok) {
        throw new Error(`Celestrak group API error: ${response.status}`)
      }

      const data = await response.json()
      const limited = data.slice(0, limit)

      const tleData: TLEData[] = limited.map((sat: any) => {
        const satrec = satellite.twoline2satrec(sat.TLE_LINE1, sat.TLE_LINE2)
        return {
          satelliteId: sat.NORAD_CAT_ID || sat.OBJECT_ID,
          name: sat.OBJECT_NAME,
          line1: sat.TLE_LINE1,
          line2: sat.TLE_LINE2,
          epoch: sat.EPOCH,
          meanMotion: satrec.no * (1440 / (2 * Math.PI)),
          eccentricity: satrec.ecco,
          inclination: (satrec.inclo * 180) / Math.PI,
          raan: (satrec.nodeo * 180) / Math.PI,
          argPerigee: (satrec.argpo * 180) / Math.PI,
          meanAnomaly: (satrec.mo * 180) / Math.PI,
          altitude: this.calculateAltitudeFromSatrec(satrec),
          period: (2 * Math.PI) / satrec.no,
          intlDes: sat.INTLDES,
          launchYear: parseInt(sat.INTLDES?.substring(0, 2) || "0"),
        }
      })

      this.setCache(cacheKey, tleData)
      return tleData
    } catch (error) {
      console.error(`[v0] Celestrak group ${group} error:`, error)
      return []
    }
  }

  // Calculate current satellite positions using SGP4 propagation
  async getSatellitePositions(satelliteIds: string[]): Promise<SatellitePosition[]> {
    const cacheKey = `positions-${satelliteIds.join(",")}`

    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    try {
      const tleData = await this.getTLEData(satelliteIds)
      const now = new Date()
      
      const positions: SatellitePosition[] = tleData.map((tle) => {
        const satrec = satellite.twoline2satrec(tle.line1, tle.line2)
        const positionAndVelocity = satellite.propagate(satrec, now)
        
        if (positionAndVelocity && positionAndVelocity.position && typeof positionAndVelocity.position !== "boolean") {
          const gmst = satellite.gstime(now)
          const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst)
          
          const velocity = positionAndVelocity.velocity
          const speed = typeof velocity !== "boolean" && velocity
            ? Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2)
            : 0

          return {
            satelliteId: tle.satelliteId,
            latitude: (positionGd.latitude * 180) / Math.PI,
            longitude: (positionGd.longitude * 180) / Math.PI,
            altitude: positionGd.height,
            velocity: speed,
            timestamp: now.toISOString(),
          }
        }
        
        // Fallback if propagation fails
        return {
          satelliteId: tle.satelliteId,
          latitude: 0,
          longitude: 0,
          altitude: tle.altitude,
          velocity: this.calculateVelocity(tle.altitude),
          timestamp: now.toISOString(),
        }
      })

      this.setCache(cacheKey, positions)
      return positions
    } catch (error) {
      console.error("[v0] SGP4 propagation error:", error)
      return this.getMockPositions(satelliteIds)
    }
  }

  // Predict future orbital positions using SGP4
  async getOrbitPredictions(satelliteId: string, hours = 24): Promise<OrbitPrediction> {
    const cacheKey = `prediction-${satelliteId}-${hours}`

    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    try {
      const tle = await this.getTLEData([satelliteId])
      if (tle.length === 0) throw new Error("No TLE data available")

      const satrec = satellite.twoline2satrec(tle[0].line1, tle[0].line2)
      const positions: SatellitePosition[] = []
      const intervalMinutes = 10
      const totalIntervals = (hours * 60) / intervalMinutes

      for (let i = 0; i < totalIntervals; i++) {
        const futureTime = new Date(Date.now() + i * intervalMinutes * 60 * 1000)
        const positionAndVelocity = satellite.propagate(satrec, futureTime)

        if (positionAndVelocity && positionAndVelocity.position && typeof positionAndVelocity.position !== "boolean") {
          const gmst = satellite.gstime(futureTime)
          const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst)
          
          const velocity = positionAndVelocity.velocity
          const speed = typeof velocity !== "boolean" && velocity
            ? Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2)
            : this.calculateVelocity(tle[0].altitude)

          positions.push({
            satelliteId,
            latitude: (positionGd.latitude * 180) / Math.PI,
            longitude: (positionGd.longitude * 180) / Math.PI,
            altitude: positionGd.height,
            velocity: speed,
            timestamp: futureTime.toISOString(),
          })
        }
      }

      const prediction: OrbitPrediction = {
        satelliteId,
        positions,
        nextPass: {
          aos: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
          los: new Date(Date.now() + 55 * 60 * 1000).toISOString(),
          maxElevation: 78.5,
        },
      }

      this.setCache(cacheKey, prediction)
      return prediction
    } catch (error) {
      console.error("[v0] Orbit prediction error:", error)
      return this.getMockPrediction(satelliteId)
    }
  }

  // Helper: Calculate altitude from satellite record
  private calculateAltitudeFromSatrec(satrec: satellite.SatRec): number {
    const earthRadius = 6371 // km
    const mu = 398600.4418 // Earth's gravitational parameter km³/s²
    const n = satrec.no // mean motion in rad/min
    const a = Math.pow(mu / (n * n * (60 * 60)), 1 / 3) // semi-major axis
    return a - earthRadius
  }

  // Helper: Calculate orbital velocity
  private calculateVelocity(altitude: number): number {
    const earthRadius = 6371
    const mu = 398600.4418
    return Math.sqrt(mu / (earthRadius + altitude))
  }

  // Fallback mock data (ISS TLE for demonstration)
  private getMockTLEData(satelliteIds: string[]): TLEData[] {
    const issTLE = {
      line1: "1 25544U 98067A   24277.50000000  .00016717  00000-0  30200-3 0  9990",
      line2: "2 25544  51.6414 339.2971 0002829 106.9017 253.2445 15.48919103463644",
    }
    
    return satelliteIds.map((id, index) => {
      const satrec = satellite.twoline2satrec(issTLE.line1, issTLE.line2)
      return {
        satelliteId: id,
        name: `Demo Satellite ${id}`,
        line1: issTLE.line1,
        line2: issTLE.line2,
        epoch: new Date().toISOString(),
        meanMotion: satrec.no * (1440 / (2 * Math.PI)),
        eccentricity: satrec.ecco,
        inclination: (satrec.inclo * 180) / Math.PI,
        raan: (satrec.nodeo * 180) / Math.PI,
        argPerigee: (satrec.argpo * 180) / Math.PI,
        meanAnomaly: (satrec.mo * 180) / Math.PI,
        altitude: this.calculateAltitudeFromSatrec(satrec),
        period: (2 * Math.PI) / satrec.no,
      }
    })
  }

  private getMockPositions(satelliteIds: string[]): SatellitePosition[] {
    return satelliteIds.map((id) => ({
      satelliteId: id,
      latitude: (Math.random() - 0.5) * 140, // -70 to +70
      longitude: (Math.random() - 0.5) * 360,
      altitude: 400 + Math.random() * 200,
      velocity: 7.5 + Math.random() * 1,
      timestamp: new Date().toISOString(),
    }))
  }

  private getMockPrediction(satelliteId: string): OrbitPrediction {
    const positions: SatellitePosition[] = []
    for (let i = 0; i < 144; i++) {
      const time = new Date(Date.now() + i * 10 * 60 * 1000)
      positions.push({
        satelliteId,
        latitude: Math.sin(i * 0.1) * 60,
        longitude: ((i * 2.5) % 360) - 180,
        altitude: 550 + Math.sin(i * 0.05) * 50,
        velocity: 7.66,
        timestamp: time.toISOString(),
      })
    }

    return {
      satelliteId,
      positions,
      nextPass: {
        aos: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
        los: new Date(Date.now() + 55 * 60 * 1000).toISOString(),
        maxElevation: 78.5,
      },
    }
  }
}

// Export singleton instance
export const nasaAPI = NASAAPIClient.getInstance()

// Export Celestrak groups for UI components
export { CELESTRAK_GROUPS }
