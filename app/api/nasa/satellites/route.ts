import { type NextRequest, NextResponse } from "next/server"
import { nasaAPI } from "@/lib/nasa-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const satelliteIds = searchParams.get("ids")?.split(",") || ["25544", "43013", "48274", "47967"]

    const [tleData, positions] = await Promise.all([
      nasaAPI.getTLEData(satelliteIds),
      nasaAPI.getSatellitePositions(satelliteIds),
    ])

    return NextResponse.json({
      success: true,
      data: {
        satellites: tleData.map((tle, index) => ({
          ...tle,
          position: positions[index],
        })),
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("NASA API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch satellite data" }, { status: 500 })
  }
}
