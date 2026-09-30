"use client"

import { useState, useMemo } from "react"
import UniversalHeader from "@/components/universal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen, Play, CheckCircle2, Clock, Rocket, Globe, Shield, Calculator,
  ExternalLink, Search, Satellite, ChevronDown, ChevronUp, FileText, Database,
  GraduationCap, Layers, Check
} from "lucide-react"
import ResourceCard from "@/components/dashboard/resources/resource-card"
import { resources } from "@/lib/resources"

const SCIENTIFIC_PAPERS = [
  {
    id: 1,
    category: "Terrain & Illumination",
    authors: "Mazarico et al.",
    year: 2011,
    title: "Illumination conditions of the lunar polar regions using LOLA topography",
    journal: "JGR Planets",
    doi: "https://doi.org/10.1029/2011JE003730",
    keyFinding: "First LOLA-based polar illumination maps. Shackleton rim identified as prime high-illumination zone. Topographic horizon masking drives solar availability at poles.",
    keyNumber: "Systematic LOLA Polar Illumination Baseline",
    similarity: "SelenSync's horizon profiler and DEM-based illumination fraction directly implement this methodology using LOLA 128ppd data.",
    difference: "Mazarico et al. produced static maps; SelenSync computes real-time ephemeris-driven illumination for user-selected mission epochs."
  },
  {
    id: 2,
    category: "Terrain & Illumination",
    authors: "Gläser et al.",
    year: 2014,
    title: "Illumination conditions at the lunar south poles using high-resolution digital terrain models",
    journal: "Icarus",
    doi: "https://doi.org/10.1016/j.icarus.2013.12.017",
    keyFinding: "95.65% illumination achieved at 10 m above ground level using 20 m/pixel LOLA DTM. Mast elevation significantly improves solar capture at crater rim sites.",
    keyNumber: "95.65% Illumination at 10 m Elevation",
    similarity: "The heuristic that vertical mast arrays at 10 m height gain significant illumination fraction traces directly to this paper.",
    difference: "Gläser 2014 utilized static DTMs; SelenSync integrates live DE440 ephemeris and terrain for dynamic illumination windows."
  },
  {
    id: 3,
    category: "Terrain & Illumination",
    authors: "Gläser et al.",
    year: 2018,
    title: "Co-registration of laser altimeter tracks with a LOLA-based slope map for long-term illumination analysis",
    journal: "Planetary and Space Science",
    doi: "https://doi.org/10.1016/j.pss.2018.09.004",
    keyFinding: "18.6-year lunar precessional cycle governs long-term illumination variation. Shackleton rim remains consistently high across the full cycle.",
    keyNumber: "18.6-Year Precessional Cycle Validation",
    similarity: "SelenSync's synodic/seasonal averaging and multi-year mission planning is consistent with this precessional cycle.",
    difference: "Gläser 2018 focuses on long-term statistical illumination; SelenSync extends with real-time mission-specific temporal windows."
  },
  {
    id: 4,
    category: "Terrain & Illumination",
    authors: "Barker et al.",
    year: 2021,
    title: "A new lunar digital elevation model from the Lunar Orbiter Laser Altimeter",
    journal: "Planetary and Space Science",
    doi: "https://doi.org/10.1016/j.pss.2020.105117",
    keyFinding: "5 m/pixel DEM with RMS height uncertainty 0.30–0.50 m — the highest resolution publicly available LOLA product.",
    keyNumber: "5 m/pixel DEM, ±0.30–0.50 m RMS Accuracy",
    similarity: "Provides the terrain accuracy foundation constraining SelenSync's horizon masking angle computations.",
    difference: "SelenSync uses 128 ppd operational DEM for real-time computation; Barker 2021 validates horizon angles at key candidate sites."
  },
  {
    id: 5,
    category: "Terrain & Illumination",
    authors: "Speyerer & Robinson",
    year: 2013,
    title: "Persistently illuminated regions at the lunar poles: Ideal sites for future exploration",
    journal: "Icarus",
    doi: "https://doi.org/10.1016/j.icarus.2012.10.010",
    keyFinding: "LROC WAC image-based validation: Shackleton crater rim illuminated for ~94% of a lunar year from direct optical imagery.",
    keyNumber: "94% Annual Illumination (Shackleton Rim)",
    similarity: "Standard image-based cross-check validating SelenSync's terrain-derived illumination results against observed sunlight.",
    difference: "Speyerer & Robinson used image mosaics; SelenSync uses mathematical terrain + ephemeris — complementary analytical approaches."
  },
  {
    id: 6,
    category: "DTE Communications",
    authors: "Bryant",
    year: 2009,
    title: "Solar and communications analysis of Lunar South Pole sites",
    journal: "JPL Technical Report 42-176",
    doi: "https://ipnpr.jpl.nasa.gov/progress_report/42-176/176C.html",
    keyFinding: "Best South Pole site achieves 92% solar illumination but only 51% DTE visibility. Solar and DTE availability are decoupled.",
    keyNumber: "92% Solar vs. 51% DTE Decoupling",
    similarity: "Primary scientific justification for SelenSync's dual-factor MCDA. Bryant (2009) proves illumination alone is insufficient for site selection.",
    difference: "Bryant 2009 is a static report; SelenSync computes DTE windows dynamically for any site, date, and DSN station."
  },
  {
    id: 7,
    category: "DTE Communications",
    authors: "Koebel et al.",
    year: 2012,
    title: "Multi-parameter analysis for landing site selection near the lunar South Pole",
    journal: "Acta Astronautica",
    doi: "https://doi.org/10.1016/j.actaastro.2012.05.019",
    keyFinding: "ESA lander study combining illumination, communications, and terrain slope in a multi-parameter framework.",
    keyNumber: "3-Parameter Combined Site Scoring (ESA)",
    similarity: "Independent ESA validation that multi-parameter site selection is the correct aerospace engineering approach.",
    difference: "Koebel 2012 is ESA-specific without techno-economic analysis; SelenSync adds financial risk metrics and 4 CLPS lander profiles."
  },
  {
    id: 8,
    category: "DTE Communications",
    authors: "Park et al.",
    year: 2021,
    title: "The JPL Planetary and Lunar Ephemerides DE440 and DE441",
    journal: "The Astronomical Journal",
    doi: "https://doi.org/10.3847/1538-3881/abd414",
    keyFinding: "DE440/DE441 ephemeris covers 1550–2650 CE with sub-arcsecond accuracy. Primary planetary kinematics dataset for modern spaceflight.",
    keyNumber: "Coverage 1550–2650 CE, Sub-Arcsecond Accuracy",
    similarity: "SelenSync's ephemeris engine uses DE440/DE441 via astronomy-engine for all Sun position and Earth visibility calculations.",
    difference: "Park et al. published the fundamental ephemeris; SelenSync is a mission-planning decision application built on top of it."
  },
  {
    id: 9,
    category: "Thermal Environment",
    authors: "Paige et al.",
    year: 2010,
    title: "Diviner lunar radiometer observations of cold traps in the south polar region of the Moon",
    journal: "Science",
    doi: "https://doi.org/10.1126/science.1187726",
    keyFinding: "PSR cold trap minimum temperature = 38 K (−235 °C). Among the coldest stable surfaces in the Solar System.",
    keyNumber: "38 K Minimum Temperature Floor",
    similarity: "SelenSync's 40 K thermal floor in PSR survival heater calculations is grounded in this foundational Diviner paper.",
    difference: "Paige 2010 provides surface temperature maps; SelenSync uses these thresholds to compute lander survival heater drawdown and battery sizing."
  },
  {
    id: 10,
    category: "Thermal Environment",
    authors: "Williams et al.",
    year: 2017,
    title: "Seasonal polar temperatures on the Moon",
    journal: "Icarus",
    doi: "https://doi.org/10.1016/j.icarus.2016.12.033",
    keyFinding: "250 billion calibrated Diviner measurements; 0.5° spatial resolution and 0.25 hr local-time resolution thermal model.",
    keyNumber: "250 Billion Measurements, 0.5°/0.25 hr Resolution",
    similarity: "Validates the resolution capability of SelenSync's thermal environment modeling.",
    difference: "Williams 2017 is a scientific data product paper; SelenSync applies thermal data to compute real-time survival requirements per site."
  },
  {
    id: 11,
    category: "Thermal Environment",
    authors: "Hayne, Aharonson & Schörghofer",
    year: 2021,
    title: "Micro cold traps on the Moon",
    journal: "Nature Astronomy",
    doi: "https://doi.org/10.1038/s41550-020-1198-9",
    keyFinding: "Micro cold traps exist at 1 cm–1 km scales; total estimated area ≈ 40,000 km². More abundant than large PSRs.",
    keyNumber: "40,000 km² Total Micro Cold Trap Area",
    similarity: "Establishes the spatial resolution boundary of SelenSync — our terrain grid cannot resolve centimetre-scale micro traps.",
    difference: "Hayne 2021 focuses on micro-scale traps; SelenSync operates at mission-relevant scales (100 m–km) for CLPS lander planning."
  },
  {
    id: 12,
    category: "Power Systems",
    authors: "Fincannon",
    year: 2007,
    title: "Lunar South Pole illumination: Review, reassessment, and power system implications",
    journal: "NASA Technical Memorandum TM-2007-215025",
    doi: "https://ntrs.nasa.gov/citations/20070034951",
    keyFinding: "Shackleton rim average illumination fraction = 0.71; battery storage required = 73–117 hr depending on lander base load.",
    keyNumber: "0.71 Illumination Fraction; 73–117 hr Battery Need",
    similarity: "Direct validation of SelenSync's battery mass sizing equation and the blackout endurance parameter range.",
    difference: "Fincannon 2007 is a static power analysis; SelenSync computes real-time battery requirements for any lander, site, and date."
  },
  {
    id: 13,
    category: "Power Systems",
    authors: "Noda et al.",
    year: 2008,
    title: "Illumination conditions at the lunar polar regions by KAGUYA (SELENE) laser altimeter",
    journal: "Geophysical Research Letters",
    doi: "https://doi.org/10.1029/2008GL035692",
    keyFinding: "KAGUYA LALT altimeter independently validates polar illumination zones without relying on LOLA — an independent JAXA cross-check.",
    keyNumber: "Independent JAXA/KAGUYA Altimetry Validation",
    similarity: "Independent dataset cross-validates SelenSync's LOLA-based illumination fractions.",
    difference: "Noda 2008 uses KAGUYA data; SelenSync uses LOLA. Both datasets converge on the same illumination fractions for key sites."
  },
  {
    id: 14,
    category: "Multi-Criteria MCDA",
    authors: "Smith et al.",
    year: 2017,
    title: "Summary of the results from the Lunar Orbiter Laser Altimeter after seven years in lunar orbit",
    journal: "Icarus",
    doi: "https://doi.org/10.1016/j.icarus.2016.06.006",
    keyFinding: "Comprehensive 7-year LOLA mission summary validating all LOLA-derived terrain products. Gold-standard LOLA data provenance citation.",
    keyNumber: "7-Year LOLA Mission Summary (Provenance Standard)",
    similarity: "Primary LOLA data source citation for SelenSync's DEM, horizon profiler, and slope hazard analysis.",
    difference: "Smith 2017 summarises the LOLA instrument; SelenSync consumes LOLA-derived products for mission planning."
  },
  {
    id: 15,
    category: "Multi-Criteria MCDA",
    authors: "Flahaut et al.",
    year: 2020,
    title: "Regions of interest (ROI) for future exploration missions to the lunar South Pole",
    journal: "Planetary and Space Science",
    doi: "https://doi.org/10.1016/j.pss.2019.104750",
    keyFinding: "11 ROIs evaluated using GIS multi-criteria: temperature <110 K, slope <20°, H₂O >100 ppm. Demonstrates multi-parameter South Pole site selection.",
    keyNumber: "11 ROIs, 3-Criteria GIS Spatial Selection",
    similarity: "Validates SelenSync's MCDA approach — same logical framework applied independently by planetary scientists.",
    difference: "Flahaut 2020 uses 3 criteria without DTE or financial modelling; SelenSync extends to 5 criteria plus techno-economic analysis."
  },
]

const CATEGORIES = ["Terrain & Illumination", "DTE Communications", "Thermal Environment", "Power Systems", "Multi-Criteria MCDA"]

const learningPaths = [
  { id: 1, title: "LEO Operations Fundamentals", description: "Master the basics of Low Earth Orbit operations and satellite management", modules: 8, duration: "4 hours", difficulty: "Beginner", progress: 0, icon: Rocket, topics: ["Orbital Mechanics", "Satellite Types", "LEO Environment", "Mission Planning"] },
  { id: 2, title: "Space Commerce & Business Models", description: "Understand the economics of space and commercial LEO opportunities", modules: 6, duration: "3 hours", difficulty: "Intermediate", progress: 25, icon: Globe, topics: ["Market Analysis", "Revenue Models", "Cost Structures", "Investment Strategies"] },
  { id: 3, title: "Risk Analysis & Compliance", description: "Learn space debris mitigation and regulatory compliance (ISO 24113)", modules: 10, duration: "5 hours", difficulty: "Advanced", progress: 60, icon: Shield, topics: ["Debris Tracking", "Collision Prediction", "ISO Standards", "Risk Mitigation"] },
  { id: 4, title: "Financial Modeling for Space", description: "Advanced financial analysis and ROI calculations for space ventures", modules: 7, duration: "4 hours", difficulty: "Advanced", progress: 0, icon: Calculator, topics: ["ROI Analysis", "Cost Modeling", "Revenue Forecasting", "Investment Planning"] },
]

const quickTutorials = [
  { title: "Getting Started with Satellite Tracking", duration: "15 min", type: "Video Tutorial", completed: false },
  { title: "Understanding TLE Data", duration: "10 min", type: "Interactive Guide", completed: true },
  { title: "Risk Assessment Basics", duration: "20 min", type: "Step-by-step", completed: false },
  { title: "Financial Dashboard Overview", duration: "12 min", type: "Video Tutorial", completed: true },
]

function PaperCard({ paper }: { paper: typeof SCIENTIFIC_PAPERS[0] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Card className="hover:border-slate-400 dark:hover:border-slate-600 transition-colors shadow-2xs">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="outline" className="text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300">
                {paper.category}
              </Badge>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[11px] text-slate-500 font-medium">{paper.journal}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[11px] text-slate-500 font-mono">{paper.year}</span>
            </div>
            <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
              {paper.authors} ({paper.year})
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5 line-clamp-2">
              {paper.title}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="h-7 px-2 text-xs shrink-0">
            <a href={paper.doi} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span>DOI</span>
            </a>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
            Key Finding
          </p>
          <p className="text-xs font-medium text-slate-900 dark:text-slate-100 mb-1">
            {paper.keyNumber}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {paper.keyFinding}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="h-7 px-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white justify-start w-full"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
          <span>{expanded ? "Hide comparison" : "Show SelenSync comparison"}</span>
        </Button>

        {expanded && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Methodological Similarity</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400 pl-5 leading-relaxed">{paper.similarity}</p>
            </div>
            <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#4e6aff] shrink-0" />
                <span>SelenSync Operational Extension</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400 pl-5 leading-relaxed">{paper.difference}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ResourcesPage() {
  const [q, setQ] = useState("")
  const [agency, setAgency] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [paperFilter, setPaperFilter] = useState<string | null>(null)

  const agencies = ["NASA", "USGS", "CSA", "ESA"]
  const dataCategories = ["Debris & Safety", "Open Data", "Earth Observation", "Visualization", "Policy & History"]

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesQ = q ? [r.title, r.description, r.agency, r.category, r.tags.join(" ")].join(" ").toLowerCase().includes(q.toLowerCase()) : true
      const matchesAgency = agency ? r.agency === agency : true
      const matchesCategory = category ? r.category === category : true
      return matchesQ && matchesAgency && matchesCategory
    })
  }, [q, agency, category])

  const filteredPapers = useMemo(() =>
    paperFilter ? SCIENTIFIC_PAPERS.filter(p => p.category === paperFilter) : SCIENTIFIC_PAPERS,
    [paperFilter]
  )

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <UniversalHeader />
      
      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Scientific Research & Planetary Resources
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Peer-reviewed literature foundation, official NASA data provenance, and mission engineering resources
            </p>
          </div>
          <Badge variant="secondary" className="font-mono text-xs px-2.5 py-1">
            NASA Space Apps Challenge 2026
          </Badge>
        </div>

        <Tabs defaultValue="papers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="papers" className="gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5" />
              <span>Scientific Papers</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-1.5 text-xs">
              <Database className="w-3.5 h-3.5" />
              <span>NASA Datasets</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="gap-1.5 text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Learning Modules</span>
            </TabsTrigger>
          </TabsList>

          {/* ── TAB 1: Scientific Papers ── */}
          <TabsContent value="papers" className="mt-6 space-y-5">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                      Scientific Literature Review (15 Peer-Reviewed Papers)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                      15 peer-reviewed publications underpinning SelenSync's models and MCDA parameters. Research compiled by <span className="font-medium text-slate-800 dark:text-slate-200">Afshara Tasneem Zoa</span>, <span className="font-medium text-slate-800 dark:text-slate-200">Labiba Mahzabin</span>, and <span className="font-medium text-slate-800 dark:text-slate-200">Nafiz Akib Khan</span> (CFSBR SpaceWeb).
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    15 Citations Verified
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                <Separator />
                
                {/* Category Filters */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-500 font-medium mr-1">Filter:</span>
                  <Button
                    variant={paperFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaperFilter(null)}
                    className="h-7 px-2.5 text-xs"
                  >
                    All Papers (15)
                  </Button>
                  {CATEGORIES.map(cat => (
                    <Button
                      key={cat}
                      variant={paperFilter === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaperFilter(cat === paperFilter ? null : cat)}
                      className="h-7 px-2.5 text-xs"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* Papers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pt-1">
                  {filteredPapers.map(paper => (
                    <PaperCard key={paper.id} paper={paper} />
                  ))}
                </div>

                {/* Synthesis Card */}
                <Card className="bg-slate-900 text-slate-100 border-slate-800 mt-4">
                  <CardContent className="p-4 space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      SelenSync Academic Positioning
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      SelenSync is the first web platform unifying terrain illumination (LOLA), DTE link budget (3 DSN complexes), cryogenic thermal survival (Diviner), techno-economic modeling, real-time DE440 ephemeris, and 4 CLPS commercial lander profiles within an integrated decision-support environment — building directly upon the multi-criteria frameworks of Koebel et al. (2012) and Flahaut et al. (2020).
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 2: Space Data & Tools ── */}
          <TabsContent value="data" className="mt-6 space-y-5">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  NASA & Partner Agency Open Datasets
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Direct access to planetary data system (PDS) archives, USGS astrogeology maps, and space agency APIs
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                <Separator />
                
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      value={q}
                      onChange={e => setQ(e.target.value)}
                      placeholder="Search datasets, missions, or agencies..."
                      className="pl-8 text-xs h-9"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-slate-500">Agency:</span>
                    <Button
                      variant={agency === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAgency(null)}
                      className="h-7 px-2 text-xs"
                    >
                      All
                    </Button>
                    {agencies.map(a => (
                      <Button
                        key={a}
                        variant={agency === a ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAgency(a)}
                        className="h-7 px-2 text-xs"
                      >
                        {a}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-slate-500">Category:</span>
                    <Button
                      variant={category === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategory(null)}
                      className="h-7 px-2 text-xs"
                    >
                      All
                    </Button>
                    {dataCategories.map(c => (
                      <Button
                        key={c}
                        variant={category === c ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategory(c)}
                        className="h-7 px-2 text-xs"
                      >
                        {c}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3.5 pt-2">
                  {filteredResources.map(r => (
                    <ResourceCard
                      key={r.id}
                      title={r.title}
                      agency={r.agency}
                      category={r.category}
                      description={r.description}
                      url={r.url}
                      tags={r.tags}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 3: Learning Modules ── */}
          <TabsContent value="learn" className="mt-6 space-y-5">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                      Mission Engineering & Orbital Operations Curriculum
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Structured learning paths for space commerce, orbital mechanics, risk analysis, and spacecraft economics
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    7 Certificates Available
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-6">
                <Separator />

                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Structured Curriculum Paths
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningPaths.map(path => {
                      const IconComponent = path.icon
                      return (
                        <Card key={path.id} className="hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md shrink-0">
                                <IconComponent className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {path.title}
                                </CardTitle>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    {path.modules} modules
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {path.duration}
                                  </span>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                                    {path.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 space-y-3">
                            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                              {path.description}
                            </CardDescription>
                            {path.progress > 0 && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>Progress</span>
                                  <span className="font-mono">{path.progress}%</span>
                                </div>
                                <Progress value={path.progress} className="h-1.5" />
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {path.topics.map((topic, i) => (
                                <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                            <Button size="sm" className="w-full h-8 text-xs">
                              {path.progress > 0 ? "Continue Learning" : "Start Learning Path"}
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Quick Reference Tutorials
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {quickTutorials.map((tutorial, index) => (
                      <Card key={index} className="p-3.5 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded">
                            <Play className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                          </div>
                          {tutorial.completed && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        </div>
                        <p className="font-medium text-slate-900 dark:text-white text-xs mb-2 leading-snug">
                          {tutorial.title}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                          <span>{tutorial.duration}</span>
                          <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono">
                            {tutorial.type}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant={tutorial.completed ? "outline" : "default"}
                          className="w-full h-7 text-xs"
                        >
                          {tutorial.completed ? "Review" : "Start"}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}