"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen, Play, CheckCircle, Clock, Award, Rocket, Globe, Shield, Calculator,
  ExternalLink, FlaskConical, Search, Satellite, ChevronDown, ChevronUp, FileText
} from "lucide-react"
import ResourceCard from "@/components/dashboard/resources/resource-card"
import { resources } from "@/lib/resources"

const CATEGORY_LABELS: Record<string, string> = {
  "Terrain & Illumination": "Terrain & Illumination",
  "DTE Communications": "DTE Communications",
  "Thermal Environment": "Thermal Environment",
  "Power Systems": "Power Systems",
  "Multi-Criteria MCDA": "Multi-Criteria MCDA",
}

const SCIENTIFIC_PAPERS = [
  { id: 1, category: "Terrain & Illumination", authors: "Mazarico et al.", year: 2011, title: "Illumination conditions of the lunar polar regions using LOLA topography", journal: "JGR Planets", doi: "https://doi.org/10.1029/2011JE003730", keyFinding: "First LOLA-based polar illumination maps. Shackleton rim identified as prime high-illumination zone. Topographic horizon masking drives solar availability at poles.", keyNumber: "First systematic LOLA illumination atlas", similarity: "SelenSync's horizon profiler and DEM-based illumination fraction directly implement this methodology using LOLA 128ppd data.", difference: "Mazarico et al. produced static maps; SelenSync computes real-time ephemeris-driven illumination for any user-selected date." },
  { id: 2, category: "Terrain & Illumination", authors: "Gläser et al.", year: 2014, title: "Illumination conditions at the lunar south poles using high-resolution digital terrain models", journal: "Icarus", doi: "https://doi.org/10.1016/j.icarus.2013.12.017", keyFinding: "95.65% illumination achieved at 10 m above ground level using 20 m/pixel LOLA DTM. Mast elevation dramatically improves solar capture at crater rim sites.", keyNumber: "95.65% illumination at 10 m height", similarity: "The heuristic that vertical mast arrays at 10 m height gain significant illumination fraction traces directly to this paper.", difference: "Gläser 2014 used static DTMs; SelenSync integrates live ephemeris and terrain for dynamic illumination windows." },
  { id: 3, category: "Terrain & Illumination", authors: "Gläser et al.", year: 2018, title: "Co-registration of laser altimeter tracks with a LOLA-based slope map for long-term illumination analysis", journal: "Planetary and Space Science", doi: "https://doi.org/10.1016/j.pss.2018.09.004", keyFinding: "18.6-year lunar precessional cycle governs long-term illumination variation. Shackleton rim remains consistently high across the full cycle.", keyNumber: "18.6-year precessional cycle confirmed", similarity: "SelenSync's synodic/seasonal averaging and multi-year mission planning is consistent with this precessional cycle.", difference: "Gläser 2018 focuses on long-term statistical illumination; SelenSync extends with real-time mission-specific windows." },
  { id: 4, category: "Terrain & Illumination", authors: "Barker et al.", year: 2021, title: "A new lunar digital elevation model from the Lunar Orbiter Laser Altimeter", journal: "Planetary and Space Science", doi: "https://doi.org/10.1016/j.pss.2020.105117", keyFinding: "5 m/pixel DEM with RMS height uncertainty 0.30–0.50 m — the highest resolution publicly available LOLA product.", keyNumber: "5 m/pixel DEM, ±0.30–0.50 m RMS accuracy", similarity: "Provides the terrain accuracy foundation constraining SelenSync's horizon masking angle computations.", difference: "SelenSync uses 128 ppd operational DEM for real-time computation; Barker 2021 validates horizon angles at key candidate sites." },
  { id: 5, category: "Terrain & Illumination", authors: "Speyerer & Robinson", year: 2013, title: "Persistently illuminated regions at the lunar poles: Ideal sites for future exploration", journal: "Icarus", doi: "https://doi.org/10.1016/j.icarus.2012.10.010", keyFinding: "LROC WAC image-based validation: Shackleton crater rim illuminated for ~94% of a lunar year from direct optical imagery.", keyNumber: "94% annual illumination — Shackleton rim", similarity: "Standard image-based cross-check validating SelenSync's terrain-derived illumination results against observed sunlight.", difference: "Speyerer & Robinson used image mosaics; SelenSync uses mathematical terrain + ephemeris — complementary approaches." },
  { id: 6, category: "DTE Communications", authors: "Bryant", year: 2009, title: "Solar and communications analysis of Lunar South Pole sites", journal: "JPL Technical Report 42-176", doi: "https://ipnpr.jpl.nasa.gov/progress_report/42-176/176C.html", keyFinding: "Best South Pole site achieves 92% solar illumination but only 51% DTE visibility. Solar and DTE availability are completely decoupled.", keyNumber: "92% solar vs. 51% DTE — the critical decoupling", similarity: "Primary scientific justification for SelenSync's dual-factor MCDA. Bryant (2009) proves illumination alone is insufficient for site selection.", difference: "Bryant 2009 is a static report; SelenSync computes DTE windows dynamically for any site, date, and DSN station." },
  { id: 7, category: "DTE Communications", authors: "Koebel et al.", year: 2012, title: "Multi-parameter analysis for landing site selection near the lunar South Pole", journal: "Acta Astronautica", doi: "https://doi.org/10.1016/j.actaastro.2012.05.019", keyFinding: "ESA lander study combining illumination, communications, and terrain slope in a multi-parameter framework — methodology mirrors SelenSync.", keyNumber: "3-parameter combined site scoring (ESA)", similarity: "Independent ESA validation that multi-parameter site selection is the correct engineering approach.", difference: "Koebel 2012 is ESA-specific without techno-economic analysis; SelenSync adds financial risk metrics and 4 CLPS lander profiles." },
  { id: 8, category: "DTE Communications", authors: "Park et al.", year: 2021, title: "The JPL Planetary and Lunar Ephemerides DE440 and DE441", journal: "The Astronomical Journal", doi: "https://doi.org/10.3847/1538-3881/abd414", keyFinding: "DE440/DE441 ephemeris covers 1550–2650 CE with sub-arcsecond accuracy. Primary planetary kinematics dataset for all modern missions.", keyNumber: "Coverage 1550–2650 CE, sub-arcsecond accuracy", similarity: "SelenSync's ephemeris engine uses DE440/DE441 via astronomy-engine for all Sun position and Earth visibility calculations.", difference: "Park et al. published the ephemeris; SelenSync is an application built on top of it for mission planning." },
  { id: 9, category: "Thermal Environment", authors: "Paige et al.", year: 2010, title: "Diviner lunar radiometer observations of cold traps in the south polar region of the Moon", journal: "Science", doi: "https://doi.org/10.1126/science.1187726", keyFinding: "PSR cold trap minimum temperature = 38 K (−235 °C). Among the coldest stable surfaces in the Solar System.", keyNumber: "38 K minimum PSR temperature", similarity: "SelenSync's 40 K thermal floor in PSR survival heater calculations is grounded in this foundational Diviner paper.", difference: "Paige 2010 provides surface temperature maps; SelenSync uses these thresholds to compute lander survival heater drawdown and battery sizing." },
  { id: 10, category: "Thermal Environment", authors: "Williams et al.", year: 2017, title: "Seasonal polar temperatures on the Moon", journal: "Icarus", doi: "https://doi.org/10.1016/j.icarus.2016.12.033", keyFinding: "250 billion calibrated Diviner measurements; 0.5° spatial resolution and 0.25 hr local-time resolution thermal model.", keyNumber: "250 billion measurements, 0.5°/0.25 hr resolution", similarity: "Validates the resolution capability of SelenSync's thermal environment modeling.", difference: "Williams 2017 is a data product paper; SelenSync applies the thermal data to compute real-time survival requirements per site." },
  { id: 11, category: "Thermal Environment", authors: "Hayne, Aharonson & Schörghofer", year: 2021, title: "Micro cold traps on the Moon", journal: "Nature Astronomy", doi: "https://doi.org/10.1038/s41550-020-1198-9", keyFinding: "Micro cold traps exist at 1 cm–1 km scales; total estimated area ≈ 40,000 km². More abundant than large PSRs.", keyNumber: "40,000 km² total micro cold trap area", similarity: "Establishes the spatial resolution boundary of SelenSync — our terrain grid cannot resolve centimetre-scale micro traps.", difference: "Hayne 2021 focuses on micro-scale traps; SelenSync operates at mission-relevant scales (100 m–km) for CLPS lander planning." },
  { id: 12, category: "Power Systems", authors: "Fincannon", year: 2007, title: "Lunar South Pole illumination: Review, reassessment, and power system implications", journal: "NASA Technical Memorandum TM-2007-215025", doi: "https://ntrs.nasa.gov/citations/20070034951", keyFinding: "Shackleton rim average illumination fraction = 0.71; battery storage required = 73–117 hr depending on lander base load.", keyNumber: "0.71 illumination fraction; 73–117 hr battery need", similarity: "Direct validation of SelenSync's battery mass sizing equation and the blackout endurance parameter range.", difference: "Fincannon 2007 is a static power analysis; SelenSync computes real-time battery requirements for any lander, site, and date." },
  { id: 13, category: "Power Systems", authors: "Noda et al.", year: 2008, title: "Illumination conditions at the lunar polar regions by KAGUYA (SELENE) laser altimeter", journal: "Geophysical Research Letters", doi: "https://doi.org/10.1029/2008GL035692", keyFinding: "KAGUYA LALT altimeter independently validates polar illumination zones without relying on LOLA — a JAXA cross-check.", keyNumber: "Independent JAXA/KAGUYA validation", similarity: "Independent dataset cross-validates SelenSync's LOLA-based illumination fractions.", difference: "Noda 2008 uses KAGUYA data; SelenSync uses LOLA. Both datasets converge on the same illumination fractions for key sites." },
  { id: 14, category: "Multi-Criteria MCDA", authors: "Smith et al.", year: 2017, title: "Summary of the results from the Lunar Orbiter Laser Altimeter after seven years in lunar orbit", journal: "Icarus", doi: "https://doi.org/10.1016/j.icarus.2016.06.006", keyFinding: "Comprehensive 7-year LOLA mission summary validating all LOLA-derived terrain products. Gold-standard LOLA data citation.", keyNumber: "7-year LOLA mission summary — gold-standard citation", similarity: "Primary LOLA data source citation for SelenSync's DEM, horizon profiler, and slope hazard analysis.", difference: "Smith 2017 summarises the LOLA instrument; SelenSync consumes LOLA-derived products for mission planning." },
  { id: 15, category: "Multi-Criteria MCDA", authors: "Flahaut et al.", year: 2020, title: "Regions of interest (ROI) for future exploration missions to the lunar South Pole", journal: "Planetary and Space Science", doi: "https://doi.org/10.1016/j.pss.2019.104750", keyFinding: "11 ROIs evaluated using GIS multi-criteria: temperature <110 K, slope <20°, H₂O >100 ppm. Demonstrates multi-parameter South Pole site selection.", keyNumber: "11 ROIs, 3-criteria GIS selection", similarity: "Validates SelenSync's MCDA approach — same logical framework applied independently by planetary scientists.", difference: "Flahaut 2020 uses 3 criteria without DTE or financial modelling; SelenSync extends to 5 criteria plus techno-economic analysis." },
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
    <div className="border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors">
      <div className="p-4">
        {/* Top row: number + meta */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{paper.category}</span>
              <span className="text-gray-200">·</span>
              <span className="text-[11px] text-gray-400">{paper.journal}</span>
              <span className="text-gray-200">·</span>
              <span className="text-[11px] text-gray-400">{paper.year}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-0.5">
              {paper.authors} ({paper.year})
            </h3>
            <p className="text-xs text-gray-500 italic leading-snug">{paper.title}</p>
          </div>
          <a href={paper.doi} target="_blank" rel="noopener noreferrer" className="shrink-0 mt-0.5">
            <button className="flex items-center gap-1 text-[11px] text-gray-500 border border-gray-200 rounded px-2 py-1 hover:border-gray-400 hover:text-gray-700 transition-colors">
              <ExternalLink className="w-3 h-3" />
              DOI
            </button>
          </a>
        </div>

        {/* Key finding */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Key Finding</p>
          <p className="text-xs text-gray-700 leading-relaxed">{paper.keyFinding}</p>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? "Hide" : "Show"} comparison with SelenSync
        </button>

        {expanded && (
          <div className="mt-3 space-y-2.5 pt-3 border-t border-gray-100">
            <div>
              <p className="text-[11px] font-semibold text-gray-600 mb-1">Similarity with SelenSync</p>
              <p className="text-xs text-gray-600 leading-relaxed">{paper.similarity}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-600 mb-1">What SelenSync adds</p>
              <p className="text-xs text-gray-600 leading-relaxed">{paper.difference}</p>
            </div>
          </div>
        )}
      </div>
    </div>
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
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resources & Research Hub</h1>
        <p className="text-sm text-gray-500 mt-1">Scientific literature, NASA data sources, and learning paths for lunar mission planning</p>
      </div>

      <Tabs defaultValue="papers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="papers"><FileText className="w-4 h-4 mr-1.5" />Scientific Papers</TabsTrigger>
          <TabsTrigger value="data"><Satellite className="w-4 h-4 mr-1.5" />Space Data & Tools</TabsTrigger>
          <TabsTrigger value="learn"><BookOpen className="w-4 h-4 mr-1.5" />Learning Hub</TabsTrigger>
        </TabsList>

        {/* ── TAB 1: Scientific Papers ── */}
        <TabsContent value="papers" className="mt-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Scientific Literature Review</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                15 peer-reviewed publications underpinning SelenSync's models and MCDA parameters.
                Research compiled by <span className="font-medium text-gray-700">Afshara Tasneem Zoa</span>, Co-Lead, CFSBR SpaceWeb.
              </p>
            </div>
            <span className="shrink-0 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded px-2 py-1 font-medium">
              15 papers
            </span>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setPaperFilter(null)}
              className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                paperFilter === null
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setPaperFilter(cat === paperFilter ? null : cat)}
                className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                  paperFilter === cat
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400">
            Showing {filteredPapers.length} of 15 papers{paperFilter ? ` · ${paperFilter}` : ""}
          </p>

          {/* Paper list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredPapers.map(paper => <PaperCard key={paper.id} paper={paper} />)}
          </div>

          {/* SelenSync positioning note */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-700 mb-2">SelenSync's unique academic contribution</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              The only platform combining terrain illumination (LOLA), DTE link budget (3 DSN complexes), thermal survival (Diviner), techno-economic analysis, real-time DE440 ephemeris, and 4 CLPS lander profiles in one interactive web interface — extending the methodology of Koebel et al. (2012) and Flahaut et al. (2020).
            </p>
          </div>
        </TabsContent>

        {/* ── TAB 2: Space Data & Tools ── */}
        <TabsContent value="data" className="mt-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Space Data & NASA Resources</h2>
            <p className="text-sm text-gray-500 mt-0.5">Curated links to NASA and partner agency datasets, tools, and references.</p>
            <p className="text-xs text-gray-400 mt-1">NASA does not endorse any non-U.S. Government entity and is not responsible for information on non-U.S. Government websites.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search datasets or agencies…" className="pl-9 text-sm" />
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-gray-500">Agency:</span>
              {["All", ...agencies].map(a => (
                <button key={a} onClick={() => setAgency(a === "All" ? null : a)}
                  className={`px-2.5 py-0.5 rounded text-xs border transition-colors ${(a === "All" ? agency === null : agency === a) ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                  {a}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-gray-500">Category:</span>
              {["All", ...dataCategories].map(c => (
                <button key={c} onClick={() => setCategory(c === "All" ? null : c)}
                  className={`px-2.5 py-0.5 rounded text-xs border transition-colors ${(c === "All" ? category === null : category === c) ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredResources.map(r => (
              <ResourceCard key={r.id} title={r.title} agency={r.agency} category={r.category} description={r.description} url={r.url} tags={r.tags} />
            ))}
          </div>
        </TabsContent>

        {/* ── TAB 3: Learning Hub ── */}
        <TabsContent value="learn" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Learning Hub</h2>
              <p className="text-sm text-gray-500 mt-0.5">Master LEO operations and space commerce with expert-designed courses</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded px-2 py-1">
              7 certificates available
            </span>
          </div>

          {/* Learning Paths */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Learning Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningPaths.map(path => {
                const IconComponent = path.icon
                return (
                  <div key={path.id} className="border border-gray-200 rounded-lg bg-white p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{path.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{path.modules} modules</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{path.duration}</span>
                          <span className="border border-gray-200 rounded px-1.5 py-0.5">{path.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{path.description}</p>
                    {path.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-1.5" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {path.topics.map((topic, i) => (
                        <span key={i} className="text-[10px] border border-gray-200 rounded px-1.5 py-0.5 text-gray-500">{topic}</span>
                      ))}
                    </div>
                    <Button size="sm" className="w-full h-8 text-xs bg-gray-900 hover:bg-gray-800 text-white">
                      {path.progress > 0 ? "Continue" : "Start Learning"}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Tutorials */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Quick Tutorials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickTutorials.map((tutorial, index) => (
                <div key={index} className="border border-gray-200 rounded-lg bg-white p-3 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-1.5 bg-gray-100 rounded">
                      <Play className="w-4 h-4 text-gray-600" />
                    </div>
                    {tutorial.completed && <CheckCircle className="w-4 h-4 text-gray-400" />}
                  </div>
                  <p className="font-medium text-gray-900 text-xs mb-2">{tutorial.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
                    <span>{tutorial.duration}</span>
                    <span className="border border-gray-200 rounded px-1.5 py-0.5">{tutorial.type}</span>
                  </div>
                  <Button size="sm" variant={tutorial.completed ? "outline" : "default"}
                    className={`w-full h-7 text-xs ${tutorial.completed ? "border-gray-200 text-gray-600" : "bg-gray-900 hover:bg-gray-800 text-white"}`}>
                    {tutorial.completed ? "Review" : "Start"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}