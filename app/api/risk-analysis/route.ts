import { type NextRequest, NextResponse } from "next/server"
import { riskAnalysis } from "@/lib/risk-analysis"
import { nasaAPI } from "@/lib/nasa-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const satelliteId = searchParams.get("satelliteId") || "25544"

    // Get satellite data first
    const satelliteData = await nasaAPI.getTLEData([satelliteId])
    const positions = await nasaAPI.getSatellitePositions([satelliteId])

    if (satelliteData.length === 0) {
      return NextResponse.json({ success: false, error: "Satellite data not found" }, { status: 404 })
    }

    const satellite = {
      ...satelliteData[0],
      position: positions[0],
    }

    // Generate comprehensive risk assessment
    const assessment = await riskAnalysis.generateRiskAssessment(satelliteId, satellite)

    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Risk Analysis Error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate risk assessment" }, { status: 500 })
  }
}
