export type Resource = {
  id: string
  title: string
  agency: "NASA" | "USGS" | "CSA" | "ESA" | "EU"
  category: "Debris & Safety" | "Open Data" | "Earth Observation" | "Visualization" | "Policy & History"
  description: string
  url: string
  tags: string[]
  disclaimer?: string
}

export const resources: Resource[] = [
  {
    id: "nasa-odpo",
    title: "NASA Orbital Debris Program Office (ODPO)",
    agency: "NASA",
    category: "Debris & Safety",
    description:
      "Access models (ORDEM, DAS), technical reports, and quarterly news on the orbital debris environment for LEO risk analysis and mitigation.",
    url: "https://orbitaldebris.jsc.nasa.gov/",
    tags: ["debris", "ORDEM", "DAS", "risk", "LEO"],
    disclaimer:
      "NASA does not endorse any non-U.S. Government entity and is not responsible for information on non-U.S. Government websites.",
  },
  {
    id: "nasa-open-data",
    title: "NASA Open Data Portal",
    agency: "NASA",
    category: "Open Data",
    description:
      "Central repository for NASA datasets spanning Earth science, satellite imagery, aeronautics, and space exploration.",
    url: "https://data.nasa.gov/",
    tags: ["open data", "earth science", "satellite", "missions"],
  },
  {
    id: "usgs-earthexplorer",
    title: "USGS EarthExplorer (Landsat Archive)",
    agency: "USGS",
    category: "Earth Observation",
    description:
      "Discover and download 50+ years of Landsat imagery for long-term environmental and commercial trend analysis.",
    url: "https://earthexplorer.usgs.gov/",
    tags: ["landsat", "earth observation", "imagery", "historical"],
  },
  {
    id: "nasa-worldview",
    title: "NASA Worldview (Near Real-Time Imagery)",
    agency: "NASA",
    category: "Visualization",
    description:
      "Browse, layer, and animate global data products—often available within 3 hours—for rapid prototyping and UI demos.",
    url: "https://worldview.earthdata.nasa.gov/",
    tags: ["worldview", "nrt", "visualization", "animation"],
  },
  {
    id: "nasa-library-commercialization",
    title: "NASA Library – Space Commercialization",
    agency: "NASA",
    category: "Policy & History",
    description:
      "Curated information on the history of space commercialization, policies, and standards relevant to LEO business.",
    url: "https://www.nasa.gov/archives/history/",
    tags: ["policy", "history", "commercialization"],
  },
  {
    id: "csa-earth-observation",
    title: "CSA: Earth Observation – Canadian Space Industry",
    agency: "CSA",
    category: "Earth Observation",
    description:
      "How Canada leverages satellites and remote sensing for environmental monitoring, resource management, and disasters.",
    url: "https://www.asc-csa.gc.ca/eng/satellites/earth-observation/industry.asp",
    tags: ["CSA", "earth observation", "industry"],
  },
  {
    id: "esa-copernicus",
    title: "ESA Copernicus Data Space Ecosystem",
    agency: "ESA",
    category: "Earth Observation",
    description:
      "Primary access point for Sentinel satellite data with free, full, and open access for environmental applications.",
    url: "https://dataspace.copernicus.eu/",
    tags: ["ESA", "Copernicus", "Sentinel", "EU", "open data"],
    disclaimer:
      "Participants must comply with data use parameters of the specific website. NASA does not endorse non-U.S. Government entities.",
  },
]
