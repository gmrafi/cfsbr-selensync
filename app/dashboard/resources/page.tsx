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
  ExternalLink, FlaskConical, Search, Satellite,
  Telescope, Thermometer, Zap, Map, ChevronDown, ChevronUp
} from "lucide-react"
import ResourceCard from "@/components/dashboard/resources/resource-card"
import { resources } from "@/lib/resources"

const SCIENTIFIC_PAPERS = [
  { id: 1, category: "Terrain & Illumination", categoryColor: "bg-blue-100 text-blue-800", authors: "Mazarico et al.", year: 2011, title: "Illumination conditions of the lunar polar regions using LOLA topography", journal: "JGR Planets", doi: "https://doi.org/10.1029/2011JE003730", keyFinding: "First LOLA-based polar illumination maps. Shackleton rim identified as prime high-illumination zone. Topographic horizon masking drives solar availability at poles.", keyNumber: "First systematic LOLA illumination atlas", similarity: "SelenSync's horizon profiler & DEM-based illumination fraction directly implement this methodology using LOLA 128ppd data.", difference: "Mazarico et al. produced static maps; SelenSync computes real-time ephemeris-driven illumination for any user-selected date.", icon: Telescope },
  { id: 2, category: "Terrain & Illumination", categoryColor: "bg-blue-100 text-blue-800", authors: "Glaser et al.", year: 2014, title: "Illumination conditions at the lunar south poles using high-resolution digital terrain models", journal: "Icarus", doi: "https://doi.org/10.1016/j.icarus.2013.12.017", keyFinding: "95.65% illumination achieved at 10m above ground level using 20m/pixel LOLA DTM. Mast elevation dramatically improves solar capture at crater rim sites.", keyNumber: "95.65% illumination @ 10m height", similarity: "Asteria's heuristic that vertical mast arrays at 10m height gain significant illumination fraction traces directly to this paper.", difference: "Glaser 2014 used static DTMs; SelenSync integrates live ephemeris + terrain for dynamic illumination windows.", icon: Telescope },
  { id: 3, category: "Terrain & Illumination", categoryColor: "bg-blue-100 text-blue-800", authors: "Glaser et al.", year: 2018, title: "Co-registration of laser altimeter tracks with a LOLA-based slope map for long-term illumination analysis", journal: "Planetary and Space Science", doi: "https://doi.org/10.1016/j.pss.2018.09.004", keyFinding: "18.6-year lunar precessional cycle governs long-term illumination variation. Shackleton rim remains consistently high across the full cycle.", keyNumber: "18.6-year precessional cycle", similarity: "SelenSync's synodic/seasonal averaging and multi-year mission planning is consistent with this precessional cycle.", difference: "Glaser 2018 focuses on long-term statistical illumination; SelenSync extends with real-time mission-specific windows.", icon: Telescope },
  { id: 4, category: "Terrain & Illumination", categoryColor: "bg-blue-100 text-blue-800", authors: "Barker et al.", year: 2021, title: "A new lunar digital elevation model from the Lunar Orbiter Laser Altimeter", journal: "Planetary and Space Science", doi: "https://doi.org/10.1016/j.pss.2020.105117", keyFinding: "5m/pixel DEM with RMS height uncertainty 0.30-0.50m - the highest resolution publicly available LOLA product.", keyNumber: "5m/pixel DEM, 0.30-0.50m accuracy", similarity: "Provides the terrain accuracy foundation constraining SelenSync's horizon masking angle computations.", difference: "SelenSync uses 128ppd operational DEM for real-time computation; Barker 2021 5m product validates horizon angles at key candidate sites.", icon: Map },
  { id: 5, category: "Terrain & Illumination", categoryColor: "bg-blue-100 text-blue-800", authors: "Speyerer & Robinson", year: 2013, title: "Persistently illuminated regions at the lunar poles: Ideal sites for future exploration", journal: "Icarus", doi: "https://doi.org/10.1016/j.icarus.2012.10.010", keyFinding: "LROC WAC image-based validation: Shackleton crater rim = 94% illuminated per lunar year from optical imagery.", keyNumber: "94% illumination per lunar year (Shackleton rim)", similarity: "Standard image-based cross-check validating SelenSync's terrain-to-illumination results.", difference: "Speyerer & Robinson used image mosaics; SelenSync uses mathematical terrain + ephemeris - complementary approaches.", icon: Telescope },
  { id: 6, category: "DTE Communications", categoryColor: "bg-purple-100 text-purple-800", authors: "Bryant", year: 2009, title: "Solar and communications analysis of Lunar South Pole sites", journal: "JPL Technical Report", doi: "https://trs.jpl.nasa.gov/", keyFinding: "CRITICAL: Best South Pole site achieves 92% solar illumination BUT only 51% DTE visibility. Solar and DTE are completely decoupled and cannot be co-optimized.", keyNumber: "92% solar vs 51% DTE - the fatal decoupling", similarity: "PRIMARY scientific justification for SelenSync's dual-factor MCDA. Bryant (2009) proves why illumination alone is insufficient.", difference: "Bryant 2009 is a static report; SelenSync computes DTE windows dynamically for any site, date, and DSN station.", icon: Satellite },
  { id: 7, category: "DTE Communications", categoryColor: "bg-purple-100 text-purple-800", authors: "Koebel et al.", year: 2012, title: "Multi-parameter analysis for landing site selection near the lunar South Pole", journal: "ESA Acta Astronautica", doi: "https://doi.org/10.1016/j.actaastro.2012.05.019", keyFinding: "ESA lander study combining illumination + communications + terrain slope in a multi-parameter framework.", keyNumber: "3-parameter combined site scoring (ESA)", similarity: "Independent ESA validation that multi-parameter site selection is the correct engineering approach.", difference: "Koebel 2012 is ESA-specific without techno-economic analysis; SelenSync adds financial risk metrics and 4 CLPS lander profiles.", icon: Satellite },
  { id: 8, category: "DTE Communications", categoryColor: "bg-purple-100 text-purple-800", authors: "Park et al.", year: 2021, title: "The JPL Planetary and Lunar Ephemerides DE440 and DE441", journal: "Astronomical Journal", doi: "https://doi.org/10.3847/1538-3881/abd414", keyFinding: "DE440/DE441 ephemeris covers 1550-2650 CE with sub-arcsecond accuracy. Primary planetary kinematics dataset.", keyNumber: "1550-2650 CE coverage, sub-arcsecond accuracy", similarity: "SelenSync's ephemeris engine uses DE440/DE441 via astronomy-engine for all sun position and Earth visibility calculations.", difference: "Park et al. published the ephemeris; SelenSync is an application built on top of it for mission planning.", icon: Satellite },
  { id: 9, category: "Thermal Environment", categoryColor: "bg-orange-100 text-orange-800", authors: "Paige et al.", year: 2010, title: "Diviner lunar radiometer observations of cold traps in the south polar region of the Moon", journal: "Science", doi: "https://doi.org/10.1126/science.1187726", keyFinding: "PSR cold trap minimum temperature = 38 Kelvin (-235 deg C). Among the coldest stable surfaces in the entire Solar System.", keyNumber: "38 K minimum PSR temperature", similarity: "SelenSync's 40K minimum thermal floor in PSR survival heater calculations is grounded in this foundational Diviner paper.", difference: "Paige 2010 provides surface temperature maps; SelenSync uses these thresholds to compute lander survival heater drawdown and battery sizing.", icon: Thermometer },
  { id: 10, category: "Thermal Environment", categoryColor: "bg-orange-100 text-orange-800", authors: "Williams et al.", year: 2017, title: "Seasonal polar temperatures on the Moon", journal: "Icarus", doi: "https://doi.org/10.1016/j.icarus.2016.12.033", keyFinding: "250 billion Diviner measurements processed into a thermal model with 0.5 deg spatial / 0.25hr time resolution.", keyNumber: "250 billion measurements, 0.5 deg/0.25hr resolution", similarity: "Validates the resolution capability of SelenSync's thermal environment modeling.", difference: "Williams 2017 is a data product paper; SelenSync applies thermal data to compute real-time survival requirements per site.", icon: Thermometer },
  { id: 11, category: "Thermal Environment", categoryColor: "bg-orange-100 text-orange-800", authors: "Hayne et al.", year: 2021, title: "Micro cold traps on the Moon", journal: "Nature Astronomy", doi: "https://doi.org/10.1038/s41550-021-01417-9", keyFinding: "Micro cold traps exist at scales from 1cm to 1km; total estimated area approx 40,000 km2. Far more abundant than large PSRs.", keyNumber: "40,000 km2 total micro cold trap area", similarity: "Establishes the spatial resolution limitation of SelenSync - our terrain grid cannot resolve cm-scale micro traps.", difference: "Hayne 2021 focuses on micro-scale traps; SelenSync operates at mission-relevant scales (100m-km) for CLPS lander planning.", icon: Thermometer },
  { id: 12, category: "Power Systems", categoryColor: "bg-yellow-100 text-yellow-800", authors: "Fincannon", year: 2007, title: "Lunar polar illumination for power analysis", journal: "NASA Technical Memorandum", doi: "https://ntrs.nasa.gov/", keyFinding: "Shackleton rim illumination fraction = 0.71; battery storage required = 73-117 hours depending on lander base load.", keyNumber: "0.71 illumination fraction; 73-117hr battery need", similarity: "Direct validation of SelenSync's battery mass sizing equation and the blackout endurance parameter range.", difference: "Fincannon 2007 is a static power analysis; SelenSync computes real-time battery requirements for any lander + site + date combination.", icon: Zap },
  { id: 13, category: "Power Systems", categoryColor: "bg-yellow-100 text-yellow-800", authors: "Noda et al.", year: 2008, title: "Illumination conditions at the lunar polar regions by KAGUYA (SELENE) laser altimeter", journal: "Geophysical Research Letters", doi: "https://doi.org/10.1029/2008GL035692", keyFinding: "KAGUYA LALT altimeter independently validates polar illumination zones without relying on LOLA data.", keyNumber: "Independent JAXA validation of polar illumination", similarity: "Japanese (JAXA) independent dataset cross-validates SelenSync's LOLA-based illumination fractions.", difference: "Noda 2008 uses KAGUYA data; SelenSync uses LOLA. Both datasets converge on the same illumination fractions for key sites.", icon: Zap },
  { id: 14, category: "Multi-Criteria MCDA", categoryColor: "bg-green-100 text-green-800", authors: "Smith et al.", year: 2017, title: "Summary of the results from the Lunar Orbiter Laser Altimeter after seven years in lunar orbit", journal: "Icarus", doi: "https://doi.org/10.1016/j.icarus.2016.06.006", keyFinding: "Comprehensive 7-year LOLA mission summary validating all LOLA-derived terrain products. Gold-standard LOLA citation.", keyNumber: "7-year LOLA mission; gold-standard data provenance", similarity: "Primary LOLA data source citation for SelenSync's DEM, horizon profiler, and slope hazard analysis.", difference: "Smith 2017 summarizes the LOLA instrument; SelenSync is an application consuming LOLA-derived products for mission planning.", icon: FlaskConical },
  { id: 15, category: "Multi-Criteria MCDA", categoryColor: "bg-green-100 text-green-800", authors: "Flahaut et al.", year: 2020, title: "Regions of interest (ROI) for future exploration missions to the lunar South Pole", journal: "Planetary and Space Science", doi: "https://doi.org/10.1016/j.pss.2020.104879", keyFinding: "11 ROIs evaluated using GIS-based multi-criteria: temperature <110K, slope <20 deg, water-ice concentration >100ppm.", keyNumber: "11 ROIs, 3-criteria GIS (temp + slope + H2O)", similarity: "Validates SelenSync's MCDA approach - same logical framework applied independently by planetary scientists.", difference: "Flahaut 2020 uses 3 criteria without DTE comms or financial modeling; SelenSync extends to 5 criteria + techno-economic analysis.", icon: FlaskConical },
]

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
  const Icon = paper.icon
  return (
    <Card className="hover:shadow-md transition-all duration-200 border border-gray-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-[#4e6aff]/10 rounded-lg shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-[#4e6aff]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge className={`text-[10px] px-2 py-0 font-medium ${paper.categoryColor}`}>{paper.category}</Badge>
                <span className="text-xs text-gray-500 font-mono">{paper.journal} · {paper.year}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{paper.authors} ({paper.year})</h3>
              <p className="text-xs text-gray-600 mt-0.5 italic line-clamp-2">{paper.title}</p>
            </div>
          </div>
          <a href={paper.doi} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] text-[#4e6aff] border-[#4e6aff]/30 hover:bg-[#4e6aff] hover:text-white gap-1">
              <ExternalLink className="w-3 h-3" />DOI
            </Button>
          </a>
        </div>
        <div className="bg-[#4e6aff]/5 border border-[#4e6aff]/15 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs font-semibold text-[#4e6aff]">Key Finding: {paper.keyNumber}</p>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed mb-3">{paper.keyFinding}</p>
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-[#4e6aff] font-medium hover:underline">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? "Hide" : "Show"} SelenSync Comparison
        </button>
        {expanded && (
          <div className="mt-3 space-y-2">
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <p className="text-[11px] font-semibold text-green-700 mb-0.5">Similarity with SelenSync</p>
              <p className="text-xs text-green-800">{paper.similarity}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-[11px] font-semibold text-amber-700 mb-0.5">What SelenSync Adds</p>
              <p className="text-xs text-amber-800">{paper.difference}</p>
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
  const paperCategories = ["Terrain & Illumination", "DTE Communications", "Thermal Environment", "Power Systems", "Multi-Criteria MCDA"]

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesQ = q ? [r.title, r.description, r.agency, r.category, r.tags.join(" ")].join(" ").toLowerCase().includes(q.toLowerCase()) : true
      const matchesAgency = agency ? r.agency === agency : true
      const matchesCategory = category ? r.category === category : true
      return matchesQ && matchesAgency && matchesCategory
    })
  }, [q, agency, category])

  const filteredPapers = useMemo(() => paperFilter ? SCIENTIFIC_PAPERS.filter(p => p.category === paperFilter) : SCIENTIFIC_PAPERS, [paperFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources & Research Hub</h1>
          <p className="text-gray-600 mt-1 text-sm">Scientific literature, NASA data sources, and learning paths for lunar mission planning</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-[#4e6aff]/10 text-[#4e6aff] border-[#4e6aff]/20">
            <FlaskConical className="w-4 h-4 mr-1" />15 Peer-Reviewed Papers
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            <Award className="w-4 h-4 mr-1" />NASA Space Apps 2026
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="papers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="papers" className="gap-1.5"><FlaskConical className="w-4 h-4" />Scientific Papers</TabsTrigger>
          <TabsTrigger value="data" className="gap-1.5"><Satellite className="w-4 h-4" />Space Data & Tools</TabsTrigger>
          <TabsTrigger value="learn" className="gap-1.5"><BookOpen className="w-4 h-4" />Learning Hub</TabsTrigger>
        </TabsList>

        {/* TAB 1: Scientific Papers */}
        <TabsContent value="papers" className="space-y-6 mt-6">
          <Card className="bg-gradient-to-r from-[#4e6aff]/5 via-purple-50 to-blue-50 border-[#4e6aff]/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#4e6aff] rounded-xl shadow-sm shrink-0">
                  <FlaskConical className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Scientific Literature Review</h2>
                  <p className="text-gray-600 mt-1 text-sm">SelenSync is grounded in <strong>15 peer-reviewed publications</strong> spanning terrain topography, DTE communications, thermal physics, power systems, and multi-criteria site selection. Research compiled by team Co-Lead <strong>Afshara Tasneem Zoa</strong> (CFSBR SpaceWeb).</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">5 Terrain & Illumination</Badge>
                    <Badge className="bg-purple-100 text-purple-800 border-0 text-xs">3 DTE Communications</Badge>
                    <Badge className="bg-orange-100 text-orange-800 border-0 text-xs">3 Thermal Environment</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs">2 Power Systems</Badge>
                    <Badge className="bg-green-100 text-green-800 border-0 text-xs">2 Multi-Criteria MCDA</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => setPaperFilter(null)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${paperFilter === null ? "bg-[#4e6aff] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All 15 Papers</button>
            {paperCategories.map(cat => (
              <button key={cat} onClick={() => setPaperFilter(cat === paperFilter ? null : cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${paperFilter === cat ? "bg-[#4e6aff] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{cat}</button>
            ))}
          </div>

          <p className="text-sm text-gray-500">Showing <strong>{filteredPapers.length}</strong> of 15 papers{paperFilter ? ` in "${paperFilter}"` : ""}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredPapers.map(paper => <PaperCard key={paper.id} paper={paper} />)}
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-white font-bold text-lg mb-3">SelenSync Unique Academic Contribution</h3>
              <p className="text-gray-300 text-sm mb-4">SelenSync is the <strong className="text-[#4e6aff]">only platform</strong> combining all six mission-critical parameters into one interactive web interface:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Terrain illumination (LOLA DEMs)", "DTE link budget (3 DSN complexes)", "Thermal survival (Diviner data)", "Techno-economic analysis", "Real-time DE440 ephemeris", "4 CLPS lander profiles"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                    <CheckCircle className="w-4 h-4 text-[#4e6aff] shrink-0" />
                    <span className="text-xs text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Space Data & Tools */}
        <TabsContent value="data" className="space-y-6 mt-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Space Data & NASA Resources</h2>
            <p className="text-gray-600 text-sm">Curated links to NASA and partner agency datasets, tools, and references.</p>
            <p className="text-xs text-gray-400 mt-1">NASA does not endorse any non-U.S. Government entity and is not responsible for information on non-U.S. Government websites.</p>
          </div>
          <Card className="p-4 border-0 shadow-sm">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search datasets, tools, or agencies" className="pl-9" />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Agency:</span>
                <Badge onClick={() => setAgency(null)} variant={agency === null ? "default" : "outline"} className="cursor-pointer">All</Badge>
                {agencies.map(a => <Badge key={a} onClick={() => setAgency(a)} variant={agency === a ? "default" : "outline"} className="cursor-pointer">{a}</Badge>)}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Category:</span>
                <Badge onClick={() => setCategory(null)} variant={category === null ? "default" : "outline"} className="cursor-pointer">All</Badge>
                {dataCategories.map(c => <Badge key={c} onClick={() => setCategory(c)} variant={category === c ? "default" : "outline"} className="cursor-pointer">{c}</Badge>)}
              </div>
            </div>
          </Card>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredResources.map(r => <ResourceCard key={r.id} title={r.title} agency={r.agency} category={r.category} description={r.description} url={r.url} tags={r.tags} />)}
          </div>
        </TabsContent>

        {/* TAB 3: Learning Hub */}
        <TabsContent value="learn" className="space-y-8 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Learning Hub</h2>
              <p className="text-gray-600 mt-1">Master LEO operations and space commerce with expert-designed courses</p>
            </div>
            <Badge variant="secondary" className="bg-[#4e6aff]/10 text-[#4e6aff] border-[#4e6aff]/20">
              <Award className="w-4 h-4 mr-1" />7 Certificates Available
            </Badge>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-5">Learning Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map(path => {
                const IconComponent = path.icon
                return (
                  <Card key={path.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#4e6aff]/10 rounded-lg"><IconComponent className="w-6 h-6 text-[#4e6aff]" /></div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{path.title}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{path.modules} modules</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{path.duration}</span>
                            <Badge variant="outline" className="text-xs">{path.difficulty}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{path.description}</CardDescription>
                      {path.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-[#4e6aff] font-medium">{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">{path.topics.map((topic, i) => <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>)}</div>
                      <Button className="w-full bg-[#4e6aff] hover:bg-[#4e6aff]/90">{path.progress > 0 ? "Continue Learning" : "Start Learning"}</Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-5">Quick Tutorials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickTutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-[#4e6aff]/10 rounded-lg"><Play className="w-5 h-5 text-[#4e6aff]" /></div>
                      {tutorial.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">{tutorial.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{tutorial.duration}</span>
                      <Badge variant="outline" className="text-xs">{tutorial.type}</Badge>
                    </div>
                    <Button size="sm" variant={tutorial.completed ? "outline" : "default"} className={tutorial.completed ? "" : "bg-[#4e6aff] hover:bg-[#4e6aff]/90"}>
                      {tutorial.completed ? "Review" : "Start"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}