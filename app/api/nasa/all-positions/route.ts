import { NextResponse, type NextRequest } from "next/server"

// Compute live positions for many satellites using TLEs from Celestrak and satellite.js
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get("group") || "active"
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "1000", 10), 5000)

    const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${encodeURIComponent(group)}&FORMAT=tle`
    const res = await fetch(url, { headers: { Accept: "text/plain" } })
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch TLEs: ${res.status}` }, { status: res.status })
    }

    const text = await res.text()
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

    const sets: Array<{ name: string; line1: string; line2: string }> = []
    for (let i = 0; i < lines.length - 2; i += 3) {
      const name = lines[i]
      const line1 = lines[i + 1]
      const line2 = lines[i + 2]
      if (line1?.startsWith("1 ") && line2?.startsWith("2 ")) {
        sets.push({ name, line1, line2 })
        if (sets.length >= limit) break
      }
    }

    // Lazy import satellite.js on server
    const sat = await import("satellite.js")
    const now = new Date()
    const gmst = sat.gstime(now)

    const features: any[] = []
    for (const { name, line1, line2 } of sets) {
      try {
        const satrec = sat.twoline2satrec(line1, line2)
        const pv = sat.propagate(satrec, now)
        if (!pv.position) continue
        const geodetic = sat.eciToGeodetic(pv.position, gmst)
        const lat = (geodetic.latitude * 180) / Math.PI
        let lon = (geodetic.longitude * 180) / Math.PI
        // normalize lon
        lon = ((lon + 540) % 360) - 180
        const altitude = geodetic.height // km
        const noradId = line1.substring(2, 7).trim()

        features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: [lon, lat] },
          properties: {
            id: noradId,
            name,
            noradId,
            altitude,
          },
        })
      } catch {
        // skip malformed entries
      }
    }

    return NextResponse.json({
      success: true,
      count: features.length,
      group,
      timestamp: new Date().toISOString(),
      data: { type: "FeatureCollection", features },
    })
  } catch (error) {
    console.error("All positions API error:", error)
    return NextResponse.json({ error: "Failed to compute positions" }, { status: 500 })
  }
}


