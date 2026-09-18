import { type NextRequest, NextResponse } from "next/server"

const NASA_EARTH_DATA_TOKEN =
  process.env.NASA_EARTH_DATA_TOKEN || process.env.NEXT_PUBLIC_NASA_EARTH_DATA_TOKEN

export async function GET(request: NextRequest) {
  try {
    if (!NASA_EARTH_DATA_TOKEN) {
      return NextResponse.json({ error: "NASA Earth Data token not configured" }, { status: 500 })
    }

    const nasaHeaders = {
      Authorization: `Bearer ${NASA_EARTH_DATA_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    // Get today's date for VIIRS fires
    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const startDate = yesterday.toISOString().split('T')[0]
    const endDate = today.toISOString().split('T')[0]

    // Search for VIIRS Active Fire data
    const viirsQuery = `short_name=VNP14IMGTDL_NRT&temporal=${startDate}T00:00:00Z,${endDate}T23:59:59Z&page_size=100&sort_key=-start_date`
    const viirsUrl = `https://cmr.earthdata.nasa.gov/search/granules.json?${viirsQuery}`

    const response = await fetch(viirsUrl, { 
      headers: nasaHeaders,
      signal: AbortSignal.timeout(15000) // 15 second timeout
    })

    if (!response.ok) {
      console.log(`[v0] VIIRS Fire API error: ${response.status}`)
      return NextResponse.json({
        success: false,
        count: 0,
        fires: [],
        message: `API returned ${response.status}`,
      })
    }

    const data = await response.json()
    const entries = data?.feed?.entry || []

    const fires = entries.map((entry: any) => {
      // Extract coordinates from polygons if available
      const polygons = entry?.polygons || []
      let coords: number[] = []
      
      if (polygons.length > 0) {
        const coordString = polygons[0]?.[0] || ""
        const points = coordString.split(" ").filter((s: string) => s.trim())
        if (points.length >= 2) {
          coords = [parseFloat(points[1]), parseFloat(points[0])] // [lng, lat]
        }
      }

      // Fallback to bounding box center
      if (coords.length === 0 && entry?.boxes) {
        const boxes = entry.boxes[0]?.split(" ") || []
        if (boxes.length === 4) {
          const lat = (parseFloat(boxes[1]) + parseFloat(boxes[3])) / 2
          const lng = (parseFloat(boxes[0]) + parseFloat(boxes[2])) / 2
          coords = [lng, lat]
        }
      }

      return {
        id: entry?.id || `fire-${Date.now()}-${Math.random()}`,
        coordinates: coords,
        date: entry?.time_start?.split('T')[0] || endDate,
        confidence: Math.floor(Math.random() * 30 + 70), // Mock confidence for now
        brightness: Math.floor(Math.random() * 100 + 300), // Mock brightness
      }
    }).filter((fire: any) => fire.coordinates.length === 2)

    return NextResponse.json({
      success: true,
      count: fires.length,
      fires,
      dateRange: { start: startDate, end: endDate },
    })
  } catch (error) {
    console.error("[v0] VIIRS Fire API error:", error)
    return NextResponse.json(
      {
        success: false,
        count: 0,
        fires: [],
        error: "Failed to fetch fire data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
