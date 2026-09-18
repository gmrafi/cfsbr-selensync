"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Orbit, AlertTriangle, CheckCircle2, Clock, TrendingDown } from "lucide-react"
import { useState } from "react"

interface SatelliteAsset {
  id: string
  name: string
  launchYear: number
  altitude: number // km
  mass: number // kg
  missionLifespan: number // years
  currentAge: number // years
  disposalMethod: "natural_decay" | "controlled_deorbit" | "graveyard_orbit" | "active_removal"
  disposalCost: number // USD
  riskLevel: "low" | "medium" | "high" | "critical"
  complianceStatus: "compliant" | "at_risk" | "non_compliant"
}

interface DisposalPlan {
  assetId: string
  recommendedMethod: string
  timeframe: string
  estimatedCost: number
  environmentalImpact: string
  complianceRequirements: string[]
  riskMitigation: string[]
}

const sampleAssets: SatelliteAsset[] = [
  {
    id: "SAT-001",
    name: "CommSat Alpha",
    launchYear: 2018,
    altitude: 580,
    mass: 1250,
    missionLifespan: 7,
    currentAge: 6,
    disposalMethod: "natural_decay",
    disposalCost: 0,
    riskLevel: "medium",
    complianceStatus: "compliant"
  },
  {
    id: "SAT-002", 
    name: "EarthObs Beta",
    launchYear: 2015,
    altitude: 750,
    mass: 2100,
    missionLifespan: 10,
    currentAge: 9,
    disposalMethod: "controlled_deorbit",
    disposalCost: 1500000,
    riskLevel: "high",
    complianceStatus: "at_risk"
  },
  {
    id: "SAT-003",
    name: "NavSat Gamma", 
    launchYear: 2020,
    altitude: 400,
    mass: 800,
    missionLifespan: 5,
    currentAge: 4,
    disposalMethod: "natural_decay",
    disposalCost: 0,
    riskLevel: "low",
    complianceStatus: "compliant"
  },
  {
    id: "SAT-004",
    name: "ScienceSat Delta",
    launchYear: 2012,
    altitude: 850,
    mass: 1800,
    missionLifespan: 12,
    currentAge: 12,
    disposalMethod: "graveyard_orbit",
    disposalCost: 800000,
    riskLevel: "critical",
    complianceStatus: "non_compliant"
  }
]

export default function AssetLifecycleManager() {
  const [assets, setAssets] = useState<SatelliteAsset[]>(sampleAssets)
  const [selectedAsset, setSelectedAsset] = useState<SatelliteAsset | null>(null)
  const [disposalPlan, setDisposalPlan] = useState<DisposalPlan | null>(null)
  const [optimizationParams, setOptimizationParams] = useState({
    maxBudget: 10000000, // USD
    prioritizeCompliance: true,
    timeHorizon: 5, // years
    riskTolerance: "medium" as "low" | "medium" | "high"
  })

  const calculateDecayTime = (altitude: number, mass: number): number => {
    // Simplified atmospheric decay calculation
    if (altitude < 300) return 1
    if (altitude < 500) return Math.pow(altitude / 300, 2) * 2
    if (altitude < 600) return Math.pow(altitude / 300, 2) * 5
    if (altitude < 800) return Math.pow(altitude / 300, 2) * 15
    return 50 // Over 25 years - requires active disposal
  }

  const generate25YearCompliancePlan = () => {
    const plans: DisposalPlan[] = assets.map(asset => {
      const decayTime = calculateDecayTime(asset.altitude, asset.mass)
      const remainingLife = asset.missionLifespan - asset.currentAge
      const timeToDisposal = Math.max(0, remainingLife)
      
      let recommendedMethod = "natural_decay"
      let estimatedCost = 0
      let timeframe = `${decayTime.toFixed(1)} years (natural decay)`
      
      // ISO 24113: 25-year rule compliance
      if (decayTime > 25) {
        if (asset.altitude > 600) {
          recommendedMethod = "graveyard_orbit"
          estimatedCost = asset.mass * 500 // $500 per kg for graveyard orbit
          timeframe = `${timeToDisposal + 1} years (active disposal)`
        } else {
          recommendedMethod = "controlled_deorbit"
          estimatedCost = asset.mass * 1200 // $1200 per kg for controlled deorbit
          timeframe = `${timeToDisposal + 0.5} years (controlled deorbit)`
        }
      }

      // High-risk assets need immediate attention
      if (asset.riskLevel === "critical" || asset.complianceStatus === "non_compliant") {
        timeframe = "Immediate action required"
        estimatedCost = estimatedCost * 1.5 // Emergency disposal cost premium
      }

      return {
        assetId: asset.id,
        recommendedMethod,
        timeframe,
        estimatedCost,
        environmentalImpact: decayTime > 25 ? "High - requires active disposal" : "Low - natural decay compliant",
        complianceRequirements: [
          "ISO 24113 compliance",
          "25-year disposal rule",
          "Space debris mitigation",
          "Environmental impact assessment"
        ],
        riskMitigation: [
          "Collision avoidance procedures",
          "Tracking and monitoring",
          "Debris mitigation planning",
          "International coordination"
        ]
      }
    })

    return plans
  }

  const optimizeDisposalSchedule = () => {
    const plans = generate25YearCompliancePlan()
    
    // Sort by priority: compliance status, risk level, cost
    const sortedPlans = plans.sort((a, b) => {
      const assetA = assets.find(asset => asset.id === a.assetId)!
      const assetB = assets.find(asset => asset.id === b.assetId)!
      
      // Prioritize non-compliant assets
      if (assetA.complianceStatus !== assetB.complianceStatus) {
        const statusPriority = { "non_compliant": 3, "at_risk": 2, "compliant": 1 }
        return statusPriority[assetB.complianceStatus] - statusPriority[assetA.complianceStatus]
      }
      
      // Then by risk level
      if (assetA.riskLevel !== assetB.riskLevel) {
        const riskPriority = { "critical": 4, "high": 3, "medium": 2, "low": 1 }
        return riskPriority[assetB.riskLevel] - riskPriority[assetA.riskLevel]
      }
      
      // Finally by cost (lower cost first)
      return a.estimatedCost - b.estimatedCost
    })

    return sortedPlans
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-700 border-green-200'
      case 'at_risk': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'non_compliant': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'critical': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const totalAssets = assets.length
  const compliantAssets = assets.filter(a => a.complianceStatus === 'compliant').length
  const atRiskAssets = assets.filter(a => a.complianceStatus === 'at_risk').length
  const nonCompliantAssets = assets.filter(a => a.complianceStatus === 'non_compliant').length
  const totalDisposalCost = generate25YearCompliancePlan().reduce((sum, plan) => sum + plan.estimatedCost, 0)

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-[#4e6aff]" />
            </div>
            <div>
              <CardTitle className="text-lg">Sustainable Asset Lifecycle Management</CardTitle>
              <p className="text-sm text-gray-600">25-year compliance planning and sustainable disposal optimization</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#4e6aff]">{totalAssets}</div>
            <div className="text-sm text-gray-600">Total Assets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{compliantAssets}</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{atRiskAssets}</div>
            <div className="text-sm text-gray-600">At Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{nonCompliantAssets}</div>
            <div className="text-sm text-gray-600">Non-Compliant</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-gray-700">${(totalDisposalCost / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-600">Disposal Cost</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">Asset Inventory</TabsTrigger>
          <TabsTrigger value="planning">Disposal Planning</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Monitor</TabsTrigger>
          <TabsTrigger value="optimization">Cost Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <div className="grid gap-4">
            {assets.map((asset) => (
              <Card 
                key={asset.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAsset?.id === asset.id ? 'ring-2 ring-[#4e6aff] border-[#4e6aff]' : 'border-gray-200'
                }`}
                onClick={() => setSelectedAsset(asset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{asset.name}</h3>
                        <Badge className={getStatusColor(asset.complianceStatus)}>
                          {asset.complianceStatus.replace('_', ' ')}
                        </Badge>
                        <Badge className={getRiskColor(asset.riskLevel)}>
                          {asset.riskLevel} risk
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Launch Year</div>
                          <div className="font-medium">{asset.launchYear}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Altitude</div>
                          <div className="font-medium">{asset.altitude} km</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Age/Lifespan</div>
                          <div className="font-medium">{asset.currentAge}/{asset.missionLifespan} years</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Mass</div>
                          <div className="font-medium">{asset.mass} kg</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Mission Progress</span>
                          <span>{Math.round((asset.currentAge / asset.missionLifespan) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(asset.currentAge / asset.missionLifespan) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {asset.currentAge >= asset.missionLifespan ? (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          ) : asset.currentAge >= asset.missionLifespan * 0.8 ? (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          <span>
                            {asset.currentAge >= asset.missionLifespan 
                              ? 'Mission complete - disposal required'
                              : asset.currentAge >= asset.missionLifespan * 0.8 
                              ? 'Approaching end of life'
                              : 'Operational'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          {selectedAsset ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Disposal Plan: {selectedAsset.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Asset Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Age:</span>
                        <span className="font-medium">{selectedAsset.currentAge} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining Life:</span>
                        <span className="font-medium">{Math.max(0, selectedAsset.missionLifespan - selectedAsset.currentAge)} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Orbital Altitude:</span>
                        <span className="font-medium">{selectedAsset.altitude} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mass:</span>
                        <span className="font-medium">{selectedAsset.mass} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Disposal Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Natural Decay Time:</span>
                        <span className="font-medium">{calculateDecayTime(selectedAsset.altitude, selectedAsset.mass).toFixed(1)} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>25-Year Compliance:</span>
                        <span className={`font-medium ${calculateDecayTime(selectedAsset.altitude, selectedAsset.mass) <= 25 ? 'text-green-600' : 'text-red-600'}`}>
                          {calculateDecayTime(selectedAsset.altitude, selectedAsset.mass) <= 25 ? 'Compliant' : 'Non-Compliant'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended Method:</span>
                        <span className="font-medium">{selectedAsset.disposalMethod.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Cost:</span>
                        <span className="font-medium">${selectedAsset.disposalCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold">Compliance Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">ISO 24113 Standards</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Post-mission disposal within 25 years</li>
                        <li>• Debris mitigation planning</li>
                        <li>• Collision avoidance procedures</li>
                        <li>• Environmental impact assessment</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Risk Mitigation</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Continuous tracking and monitoring</li>
                        <li>• International coordination</li>
                        <li>• Backup disposal methods</li>
                        <li>• Emergency procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-[#4e6aff] hover:bg-[#3d54e6]">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Generate Detailed Disposal Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Orbit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Asset</h3>
                <p className="text-gray-600">Choose an asset from the inventory to view its disposal plan.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4">
            {generate25YearCompliancePlan().map((plan, index) => {
              const asset = assets.find(a => a.id === plan.assetId)!
              return (
                <Card key={plan.assetId}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold">{asset.name}</h3>
                      <Badge className={getStatusColor(asset.complianceStatus)}>
                        {asset.complianceStatus.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Recommended Method</div>
                        <div className="font-medium">{plan.recommendedMethod.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Timeframe</div>
                        <div className="font-medium">{plan.timeframe}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Estimated Cost</div>
                        <div className="font-medium">${plan.estimatedCost.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm">
                      <div className="text-gray-600">Environmental Impact</div>
                      <div className="font-medium">{plan.environmentalImpact}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Disposal Cost Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxBudget">Maximum Budget (USD)</Label>
                  <Input
                    id="maxBudget"
                    type="number"
                    value={optimizationParams.maxBudget}
                    onChange={(e) => setOptimizationParams(prev => ({ ...prev, maxBudget: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeHorizon">Planning Horizon (Years)</Label>
                  <Input
                    id="timeHorizon"
                    type="number"
                    value={optimizationParams.timeHorizon}
                    onChange={(e) => setOptimizationParams(prev => ({ ...prev, timeHorizon: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold">Optimized Disposal Schedule</h4>
                <div className="space-y-3">
                  {optimizeDisposalSchedule().slice(0, 5).map((plan, index) => {
                    const asset = assets.find(a => a.id === plan.assetId)!
                    return (
                      <div key={plan.assetId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#4e6aff]/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-[#4e6aff]">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-gray-600">{plan.recommendedMethod.replace('_', ' ')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${(plan.estimatedCost / 1000).toFixed(0)}K</div>
                          <div className="text-sm text-gray-600">{plan.timeframe.split(' ')[0]} priority</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">
                        ${(totalDisposalCost / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-green-700">Total Disposal Cost</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round((compliantAssets / totalAssets) * 100)}%
                      </div>
                      <div className="text-sm text-blue-700">Current Compliance</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
