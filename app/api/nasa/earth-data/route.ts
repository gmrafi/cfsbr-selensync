import { type NextRequest, NextResponse } from "next/server"

const NASA_EARTH_DATA_TOKEN =
  process.env.NASA_EARTH_DATA_TOKEN || process.env.NEXT_PUBLIC_NASA_EARTH_DATA_TOKEN // Prefer server var, fall back to public for local setups

export async function GET(request: NextRequest) {
  try {
    if (!NASA_EARTH_DATA_TOKEN) {
      return NextResponse.json({ error: "NASA Earth Data token not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get("endpoint")
    const params = searchParams.get("params")

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint parameter required" }, { status: 400 })
    }

    const nasaHeaders = {
      Authorization: `Bearer ${NASA_EARTH_DATA_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    let apiUrl = ""

    switch (endpoint) {
      case "cmr-granules":
        apiUrl = `https://cmr.earthdata.nasa.gov/search/granules.json${params ? `?${params}` : ""}`
        break
      case "cmr-collections":
        apiUrl = `https://cmr.earthdata.nasa.gov/search/collections.json${params ? `?${params}` : ""}`
        break
      case "earthdata-search":
        apiUrl = `https://search.earthdata.nasa.gov/api/v1/search${params ? `?${params}` : ""}`
        break
      case "ghrc-tle":
        apiUrl = `https://ghrc.nsstc.nasa.gov/services/satellites/elements.pl${params ? `?${params}` : ""}`
        break
      default:
        return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
    }

    const response = await fetch(apiUrl, {
      headers: nasaHeaders,
      method: "GET",
    })

    if (!response.ok) {
      console.log(`[v0] NASA API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        {
          error: `NASA API error: ${response.status}`,
          details: response.statusText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] NASA Earth Data API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch NASA Earth Data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
