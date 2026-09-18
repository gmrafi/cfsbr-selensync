import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get("endpoint")
    const params = searchParams.get("params")

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint parameter required" }, { status: 400 })
    }

    let apiUrl = ""

    switch (endpoint) {
      case "eonet-events":
        apiUrl = `https://eonet.gsfc.nasa.gov/api/v3/events${params ? `?${params}` : ""}`
        break
      case "iss-position":
        apiUrl = "http://api.open-notify.org/iss-now.json"
        break
      case "celestrak-tle":
        apiUrl = `https://celestrak.org/NORAD/elements/gp.php${params ? `?${params}` : "?GROUP=active&FORMAT=json"}`
        break
      case "usgs-earthquakes":
        apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query${params ? `?${params}` : "?format=geojson&limit=100"}`
        break
      case "noaa-space-weather":
        apiUrl = `https://services.swpc.noaa.gov/json/${params || "planetary_k_index_1m.json"}`
        break
      case "nasa-apod":
        const nasaApiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || process.env.NASA_API_KEY || "DEMO_KEY"
        apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}${params ? `&${params}` : ""}`
        break
      default:
        return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
    }

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "OrbitBiZ/1.0",
      },
    })

    if (!response.ok) {
      console.log(`[v0] Public API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        {
          error: `API error: ${response.status}`,
          details: response.statusText,
        },
        { status: response.status },
      )
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const text = await response.text()
      return NextResponse.json({ data: text, type: "text" })
    }
  } catch (error) {
    console.error("[v0] Public NASA API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch public NASA data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
