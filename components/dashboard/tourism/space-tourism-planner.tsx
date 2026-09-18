"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rocket, Users, Shield, DollarSign, Clock, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface TourismRoute {
  id: string
  name: string
  duration: number // days
  altitude: number // km
  maxPassengers: number
  riskLevel: "low" | "medium" | "high"
  basePrice: number // USD per person
  operationalCost: number // USD per flight
  safetyRating: number // 1-10
  experiences: string[]
}

const tourismRoutes: TourismRoute[] = [
  {
    id: "suborbital-1",
    name: "Suborbital Experience",
    duration: 0.1, // 2-3 hours total
    altitude: 100,
    maxPassengers: 6,
    riskLevel: "medium",
    basePrice: 450000,
    operationalCost: 2500000,
    safetyRating: 8,
    experiences: ["Weightlessness", "Earth View", "Space Border Crossing"]
  },
  {
    id: "leo-station-1", 
    name: "LEO Space Hotel Stay",
    duration: 3,
    altitude: 400,
    maxPassengers: 4,
    riskLevel: "high",
    basePrice: 2500000,
    operationalCost: 8500000,
    safetyRating: 7,
    experiences: ["Extended Weightlessness", "Earth Photography", "Scientific Experiments", "Space Cuisine"]
  },
  {
    id: "orbital-tour-1",
    name: "Orbital Sightseeing Tour", 
    duration: 1,
    altitude: 300,
    maxPassengers: 8,
    riskLevel: "medium",
    basePrice: 1200000,
    operationalCost: 4200000,
    safetyRating: 8,
    experiences: ["Multiple Earth Orbits", "Aurora Viewing", "Satellite Spotting", "Space Photography"]
  },
  {
    id: "research-mission-1",
    name: "Citizen Science Mission",
    duration: 7,
    altitude: 450,
    maxPassengers: 2,
    riskLevel: "high", 
    basePrice: 5500000,
    operationalCost: 15000000,
    safetyRating: 6,
    experiences: ["Research Participation", "Long-term Weightlessness", "Space Lab Work", "Data Collection"]
  }
]

interface SafetyProtocol {
  category: string
  protocols: string[]
  compliance: number // 0-100%
}

const safetyProtocols: SafetyProtocol[] = [
  {
    category: "Pre-flight Training",
    protocols: [
      "6-month astronaut training program",
      "Medical fitness certification",
      "Emergency procedure drills",
      "Spacecraft systems familiarity"
    ],
    compliance: 95
  },
  {
    category: "Launch Safety",
    protocols: [
      "Triple redundancy in critical systems",
      "Automated abort systems", 
      "Real-time health monitoring",
      "Launch weather criteria"
    ],
    compliance: 98
  },
  {
    category: "Orbital Operations",
    protocols: [
      "24/7 ground support communication",
      "Life support system monitoring",
      "Emergency return capability",
      "Space debris avoidance"
    ],
    compliance: 92
  },
  {
    category: "Return & Recovery",
    protocols: [
      "Automated landing systems",
      "Medical team standby",
      "Multiple recovery zones",
      "Post-flight health assessment"
    ],
    compliance: 96
  }
]

export default function SpaceTourismPlanner() {
  const [selectedRoute, setSelectedRoute] = useState<TourismRoute>(tourismRoutes[0])
  const [businessParams, setBusinessParams] = useState({
    flightsPerYear: 12,
    operatingYears: 10,
    initialInvestment: 500000000, // USD
    insuranceCostPercent: 15, // % of revenue
    marketingBudgetPercent: 10,
    regulatoryComplianceCost: 5000000 // USD per year
  })

  const [analysis, setAnalysis] = useState({
    annualRevenue: 0,
    annualCosts: 0,
    netProfit: 0,
    roi: 0,
    breakEvenYear: 0,
    totalPassengers: 0,
    safetyScore: 0
  })

  const calculateBusinessModel = () => {
    const passengersPerFlight = selectedRoute.maxPassengers
    const totalPassengers = businessParams.flightsPerYear * passengersPerFlight
    const annualRevenue = totalPassengers * selectedRoute.basePrice
    
    const operationalCosts = businessParams.flightsPerYear * selectedRoute.operationalCost
    const insuranceCosts = (annualRevenue * businessParams.insuranceCostPercent) / 100
    const marketingCosts = (annualRevenue * businessParams.marketingBudgetPercent) / 100
    const regulatoryCosts = businessParams.regulatoryComplianceCost
    
    const annualCosts = operationalCosts + insuranceCosts + marketingCosts + regulatoryCosts
    const netProfit = annualRevenue - annualCosts
    
    const totalProfitOverPeriod = netProfit * businessParams.operatingYears
    const roi = (totalProfitOverPeriod / businessParams.initialInvestment) * 100
    
    const breakEvenYear = netProfit > 0 ? businessParams.initialInvestment / netProfit : Infinity
    
    // Safety score calculation
    const baseRisk = selectedRoute.riskLevel === 'low' ? 90 : selectedRoute.riskLevel === 'medium' ? 75 : 60
    const safetyScore = (baseRisk + selectedRoute.safetyRating * 5) / 2

    setAnalysis({
      annualRevenue,
      annualCosts,
      netProfit,
      roi,
      breakEvenYear,
      totalPassengers,
      safetyScore
    })
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-[#4e6aff]" />
            </div>
            <div>
              <CardTitle className="text-lg">Sustainable Space Tourism Planner</CardTitle>
              <p className="text-sm text-gray-600">Analyze commercial viability and safety of space tourism ventures</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="routes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="routes">Tourism Routes</TabsTrigger>
          <TabsTrigger value="safety">Safety Protocols</TabsTrigger>
          <TabsTrigger value="business">Business Model</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Space Tourism Route Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tourismRoutes.map((route) => (
                  <Card
                    key={route.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRoute.id === route.id ? 'ring-2 ring-[#4e6aff] border-[#4e6aff]' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-sm">{route.name}</h3>
                          <Badge className={getRiskColor(route.riskLevel)}>
                            {route.riskLevel} risk
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span>{route.duration < 1 ? `${route.duration * 24} hours` : `${route.duration} days`}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-gray-500" />
                            <span>{route.maxPassengers} passengers</span>
                          </div>
                          <div>Altitude: {route.altitude} km</div>
                          <div>Safety: {route.safetyRating}/10</div>
                        </div>

                        <div className="text-lg font-bold text-[#4e6aff]">
                          ${route.basePrice.toLocaleString()}/person
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs font-medium">Experiences:</div>
                          <div className="flex flex-wrap gap-1">
                            {route.experiences.slice(0, 3).map((exp) => (
                              <Badge key={exp} variant="secondary" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedRoute && (
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Selected Route: {selectedRoute.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Full Experience List</div>
                        <ul className="mt-1 space-y-1">
                          {selectedRoute.experiences.map((exp) => (
                            <li key={exp} className="text-xs">• {exp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-gray-600">Operational Cost</div>
                        <div className="font-semibold">${selectedRoute.operationalCost.toLocaleString()}/flight</div>
                        <div className="text-gray-600 mt-2">Revenue per Flight</div>
                        <div className="font-semibold text-green-600">${(selectedRoute.basePrice * selectedRoute.maxPassengers).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Gross Margin</div>
                        <div className="font-semibold text-blue-600">
                          {(((selectedRoute.basePrice * selectedRoute.maxPassengers - selectedRoute.operationalCost) / (selectedRoute.basePrice * selectedRoute.maxPassengers)) * 100).toFixed(1)}%
                        </div>
                        <div className="text-gray-600 mt-2">Annual Capacity</div>
                        <div className="font-semibold">{selectedRoute.maxPassengers * 12} passengers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comprehensive Safety Protocols</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {safetyProtocols.map((protocol) => (
                <Card key={protocol.category} className="border-l-4 border-l-[#4e6aff]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#4e6aff]" />
                        {protocol.category}
                      </h3>
                      <Badge className={protocol.compliance >= 95 ? 'bg-green-100 text-green-700' : protocol.compliance >= 90 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                        {protocol.compliance}% compliant
                      </Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {protocol.protocols.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-[#4e6aff] rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 text-sm">Regulatory Requirements</h4>
                      <div className="text-sm text-blue-700 mt-1 space-y-1">
                        <div>• FAA Commercial Space Transportation License</div>
                        <div>• International Civil Aviation Organization (ICAO) compliance</div>
                        <div>• Informed consent and passenger liability agreements</div>
                        <div>• Environmental impact assessments</div>
                        <div>• Space traffic management coordination</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business Model Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flightsPerYear">Flights per Year</Label>
                  <Input
                    id="flightsPerYear"
                    type="number"
                    value={businessParams.flightsPerYear}
                    onChange={(e) => setBusinessParams(prev => ({ ...prev, flightsPerYear: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operatingYears">Operating Period (Years)</Label>
                  <Input
                    id="operatingYears"
                    type="number"
                    value={businessParams.operatingYears}
                    onChange={(e) => setBusinessParams(prev => ({ ...prev, operatingYears: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialInvestment">Initial Investment (USD)</Label>
                  <Input
                    id="initialInvestment"
                    type="number"
                    value={businessParams.initialInvestment}
                    onChange={(e) => setBusinessParams(prev => ({ ...prev, initialInvestment: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceCost">Insurance Cost (%)</Label>
                  <Input
                    id="insuranceCost"
                    type="number"
                    value={businessParams.insuranceCostPercent}
                    onChange={(e) => setBusinessParams(prev => ({ ...prev, insuranceCostPercent: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingBudget">Marketing Budget (%)</Label>
                  <Input
                    id="marketingBudget"
                    type="number"
                    value={businessParams.marketingBudgetPercent}
                    onChange={(e) => setBusinessParams(prev => ({ ...prev, marketingBudgetPercent: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regulatoryCost">Annual Regulatory Cost (USD)</Label>
                  <Input
                    id="regulatoryCost"
                    type="number"
                    value={businessParams.regulatoryComplianceCost}
                    onChange={(e) => setBusinessParams(prev => ({ ...prev, regulatoryComplianceCost: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={calculateBusinessModel} className="w-full bg-[#4e6aff] hover:bg-[#3d54e6]">
                <DollarSign className="w-4 h-4 mr-2" />
                Calculate Business Viability
              </Button>

              {analysis.annualRevenue > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">${(analysis.annualRevenue / 1000000).toFixed(0)}M</div>
                      <div className="text-sm text-green-700">Annual Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{analysis.totalPassengers}</div>
                      <div className="text-sm text-blue-700">Passengers/Year</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">{analysis.roi.toFixed(1)}%</div>
                      <div className="text-sm text-purple-700">ROI</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-xl font-bold text-orange-600">{analysis.safetyScore.toFixed(0)}/100</div>
                      <div className="text-sm text-orange-700">Safety Score</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Annual Costs</span>
                      <span className="font-semibold">${(analysis.annualCosts / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Net Profit</span>
                      <span className={`font-semibold ${analysis.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${(analysis.netProfit / 1000000).toFixed(1)}M/year
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Break-even</span>
                      <span className="font-semibold">
                        {analysis.breakEvenYear === Infinity ? 'Never' : `${analysis.breakEvenYear.toFixed(1)} years`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sustainable Space Tourism Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-700">Environmental Considerations</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <div className="font-medium">Carbon Footprint Reduction</div>
                      <div className="text-green-700 mt-1">Use of sustainable rocket fuels (methane, hydrogen)</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <div className="font-medium">Space Debris Minimization</div>
                      <div className="text-green-700 mt-1">Reusable spacecraft and responsible orbital practices</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <div className="font-medium">Launch Frequency Optimization</div>
                      <div className="text-green-700 mt-1">Maximize passengers per flight to reduce environmental impact</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-700">Social Impact</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="font-medium">Accessibility Programs</div>
                      <div className="text-blue-700 mt-1">Scholarship and lottery systems for broader access</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="font-medium">Educational Value</div>
                      <div className="text-blue-700 mt-1">STEM education partnerships and public outreach</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="font-medium">Scientific Research</div>
                      <div className="text-blue-700 mt-1">Citizen science participation and data collection</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Long-term Sustainability Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-700">85%</div>
                    <div>Vehicle Reusability Target</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-700">-40%</div>
                    <div>Carbon Emission Reduction</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-700">100%</div>
                    <div>Zero Debris Policy</div>
                  </div>
                </div>
              </div>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Regulatory Compliance Requirements</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• UN Outer Space Treaty adherence</li>
                    <li>• National licensing and safety standards</li>
                    <li>• Environmental impact assessments</li>
                    <li>• International coordination for flight paths</li>
                    <li>• Passenger safety and insurance requirements</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
