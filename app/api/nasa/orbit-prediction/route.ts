import { type NextRequest, NextResponse } from "next/server"
import { nasaAPI } from "@/lib/nasa-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const satelliteId = searchParams.get("satelliteId") || "25544"
    const hours = Number.parseInt(searchParams.get("hours") || "24")

    const prediction = await nasaAPI.getOrbitPredictions(satelliteId, hours)

    return NextResponse.json({
      success: true,
      data: prediction,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Orbit Prediction Error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate orbit prediction" }, { status: 500 })
  }
}
