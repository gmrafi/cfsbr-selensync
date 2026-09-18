"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Factory, FlaskConical, Zap, TrendingUp, AlertCircle } from "lucide-react"
import { useState } from "react"

interface ManufacturingProcess {
  id: string
  name: string
  type: "pharmaceutical" | "semiconductor" | "fiber-optic" | "alloy" | "crystal"
  earthEfficiency: number // 0-100%
  microgravityBoost: number // multiplier
  powerRequired: number // kW
  timeRequired: number // hours
  valuePerKg: number // USD
  marketDemand: number // kg/year
}

const manufacturingProcesses: ManufacturingProcess[] = [
  {
    id: "pharma-1",
    name: "Protein Crystallization",
    type: "pharmaceutical",
    earthEfficiency: 45,
    microgravityBoost: 3.2,
    powerRequired: 2.5,
    timeRequired: 72,
    valuePerKg: 50000,
    marketDemand: 1200
  },
  {
    id: "pharma-2", 
    name: "Tissue Engineering",
    type: "pharmaceutical",
    earthEfficiency: 35,
    microgravityBoost: 4.1,
    powerRequired: 3.8,
    timeRequired: 168,
    valuePerKg: 120000,
    marketDemand: 800
  },
  {
    id: "semi-1",
    name: "Ultra-pure Silicon",
    type: "semiconductor",
    earthEfficiency: 85,
    microgravityBoost: 1.8,
    powerRequired: 12.0,
    timeRequired: 48,
    valuePerKg: 25000,
    marketDemand: 5000
  },
  {
    id: "fiber-1",
    name: "ZBLAN Optical Fiber",
    type: "fiber-optic", 
    earthEfficiency: 60,
    microgravityBoost: 2.5,
    powerRequired: 4.2,
    timeRequired: 24,
    valuePerKg: 15000,
    marketDemand: 3500
  },
  {
    id: "alloy-1",
    name: "Superalloy Components",
    type: "alloy",
    earthEfficiency: 70,
    microgravityBoost: 1.6,
    powerRequired: 18.5,
    timeRequired: 96,
    valuePerKg: 8000,
    marketDemand: 12000
  }
]

export default function MicrogravitySimulator() {
  const [selectedProcess, setSelectedProcess] = useState<ManufacturingProcess>(manufacturingProcesses[0])
  const [facilityParams, setFacilityParams] = useState({
    powerCapacity: 50, // kW
    operatingDays: 300, // days/year
    facilityCost: 150000000, // USD (facility setup)
    operationalCostPerDay: 50000, // USD
    launchCostPerKg: 3000, // USD
    returnCostPerKg: 8000, // USD
    processingCapacity: 10 // kg/batch
  })

  const [results, setResults] = useState({
    annualProduction: 0,
    annualRevenue: 0,
    operationalCosts: 0,
    netProfit: 0,
    roi: 0,
    paybackPeriod: 0,
    competitiveAdvantage: 0
  })

  const calculateBusinessViability = () => {
    const batchesPerYear = Math.min(
      Math.floor((facilityParams.operatingDays * 24) / selectedProcess.timeRequired),
      Math.floor((facilityParams.powerCapacity / selectedProcess.powerRequired) * facilityParams.operatingDays * 24 / selectedProcess.timeRequired),
      Math.floor(selectedProcess.marketDemand / facilityParams.processingCapacity)
    )

    const annualProduction = batchesPerYear * facilityParams.processingCapacity
    const annualRevenue = annualProduction * selectedProcess.valuePerKg
    
    const launchCosts = annualProduction * facilityParams.launchCostPerKg
    const returnCosts = annualProduction * facilityParams.returnCostPerKg
    const dailyOperationalCosts = facilityParams.operationalCostPerDay * facilityParams.operatingDays
    const operationalCosts = launchCosts + returnCosts + dailyOperationalCosts

    const netProfit = annualRevenue - operationalCosts
    const roi = (netProfit / facilityParams.facilityCost) * 100
    const paybackPeriod = facilityParams.facilityCost / Math.max(netProfit, 1)

    // Competitive advantage calculation
    const earthProduction = selectedProcess.earthEfficiency / 100
    const spaceProduction = (selectedProcess.earthEfficiency / 100) * selectedProcess.microgravityBoost
    const competitiveAdvantage = ((spaceProduction - earthProduction) / earthProduction) * 100

    setResults({
      annualProduction,
      annualRevenue,
      operationalCosts,
      netProfit,
      roi,
      paybackPeriod,
      competitiveAdvantage
    })
  }

  const getProcessIcon = (type: string) => {
    switch (type) {
      case 'pharmaceutical': return <FlaskConical className="w-4 h-4" />
      case 'semiconductor': return <Zap className="w-4 h-4" />
      default: return <Factory className="w-4 h-4" />
    }
  }

  const getProcessColor = (type: string) => {
    switch (type) {
      case 'pharmaceutical': return 'bg-green-100 text-green-700 border-green-200'
      case 'semiconductor': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'fiber-optic': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'alloy': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center">
              <Factory className="w-5 h-5 text-[#4e6aff]" />
            </div>
            <div>
              <CardTitle className="text-lg">Microgravity Manufacturing Simulator</CardTitle>
              <p className="text-sm text-gray-600">Analyze business viability of in-space manufacturing</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="process" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="process">Manufacturing Process</TabsTrigger>
          <TabsTrigger value="facility">Facility Parameters</TabsTrigger>
          <TabsTrigger value="results">Business Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Manufacturing Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {manufacturingProcesses.map((process) => (
                  <Card
                    key={process.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProcess.id === process.id ? 'ring-2 ring-[#4e6aff] border-[#4e6aff]' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedProcess(process)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getProcessColor(process.type)}`}>
                          {getProcessIcon(process.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold text-sm">{process.name}</h3>
                          <Badge className={getProcessColor(process.type)}>
                            {process.type.charAt(0).toUpperCase() + process.type.slice(1)}
                          </Badge>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>Earth Efficiency: {process.earthEfficiency}%</div>
                            <div>μG Boost: {process.microgravityBoost}x</div>
                            <div>Power: {process.powerRequired} kW</div>
                            <div>Value: ${process.valuePerKg.toLocaleString()}/kg</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedProcess && (
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Process Details: {selectedProcess.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Processing Time</div>
                        <div className="font-semibold">{selectedProcess.timeRequired} hours</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Market Demand</div>
                        <div className="font-semibold">{selectedProcess.marketDemand.toLocaleString()} kg/year</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Microgravity Advantage</div>
                        <div className="font-semibold text-green-600">{((selectedProcess.microgravityBoost - 1) * 100).toFixed(0)}% improvement</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Revenue Potential</div>
                        <div className="font-semibold text-blue-600">${(selectedProcess.valuePerKg * selectedProcess.marketDemand / 1000000).toFixed(0)}M/year</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">LEO Manufacturing Facility Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="powerCapacity">Power Capacity (kW)</Label>
                  <Input
                    id="powerCapacity"
                    type="number"
                    value={facilityParams.powerCapacity}
                    onChange={(e) => setFacilityParams(prev => ({ ...prev, powerCapacity: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operatingDays">Operating Days/Year</Label>
                  <Input
                    id="operatingDays"
                    type="number"
                    value={facilityParams.operatingDays}
                    onChange={(e) => setFacilityParams(prev => ({ ...prev, operatingDays: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilityCost">Facility Setup Cost (USD)</Label>
                  <Input
                    id="facilityCost"
                    type="number"
                    value={facilityParams.facilityCost}
                    onChange={(e) => setFacilityParams(prev => ({ ...prev, facilityCost: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operationalCost">Daily Operational Cost (USD)</Label>
                  <Input
                    id="operationalCost"
                    type="number"
                    value={facilityParams.operationalCostPerDay}
                    onChange={(e) => setFacilityParams(prev => ({ ...prev, operationalCostPerDay: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="launchCost">Launch Cost per kg (USD)</Label>
                  <Input
                    id="launchCost"
                    type="number"
                    value={facilityParams.launchCostPerKg}
                    onChange={(e) => setFacilityParams(prev => ({ ...prev, launchCostPerKg: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnCost">Return Cost per kg (USD)</Label>
                  <Input
                    id="returnCost"
                    type="number"
                    value={facilityParams.returnCostPerKg}
                    onChange={(e) => setFacilityParams(prev => ({ ...prev, returnCostPerKg: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingCapacity">Processing Capacity per batch (kg)</Label>
                  <Input
                    id="processingCapacity"
                    type="number"
                    value={facilityParams.processingCapacity}
                    onChange={(e) => setFacilityParams(prev => ({ ...prev, processingCapacity: Number(e.target.value) }))}
                  />
                </div>
              </div>
              
              <Button onClick={calculateBusinessViability} className="w-full bg-[#4e6aff] hover:bg-[#3d54e6]">
                <TrendingUp className="w-4 h-4 mr-2" />
                Calculate Business Viability
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {results.annualRevenue > 0 ? (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Business Viability Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.annualProduction.toFixed(0)} kg</div>
                      <div className="text-sm text-blue-700">Annual Production</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${(results.annualRevenue / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-green-700">Annual Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{results.roi.toFixed(1)}%</div>
                      <div className="text-sm text-purple-700">ROI</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{results.paybackPeriod.toFixed(1)} years</div>
                      <div className="text-sm text-orange-700">Payback Period</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Operational Costs</span>
                      <span className="font-semibold">${(results.operationalCosts / 1000000).toFixed(1)}M/year</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Net Profit</span>
                      <span className={`font-semibold ${results.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${(results.netProfit / 1000000).toFixed(1)}M/year
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Competitive Advantage</span>
                      <span className="font-semibold text-blue-600">{results.competitiveAdvantage.toFixed(0)}% better than Earth</span>
                    </div>
                  </div>

                  {results.netProfit <= 0 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-red-700">Business Model Not Viable</h4>
                        <p className="text-sm text-red-600">Consider reducing operational costs, increasing processing efficiency, or selecting a higher-value product.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sustainability & Innovation Factors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Environmental Benefits</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Reduced Earth-based manufacturing pollution</li>
                        <li>• Lower energy consumption per unit</li>
                        <li>• Minimal waste generation in microgravity</li>
                        <li>• Sustainable resource utilization</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Innovation Opportunities</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Novel material properties impossible on Earth</li>
                        <li>• Advanced pharmaceutical formulations</li>
                        <li>• Ultra-pure manufacturing environment</li>
                        <li>• Scalable production methods</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Run Business Analysis</h3>
                <p className="text-gray-600">Configure your facility parameters and calculate business viability.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
