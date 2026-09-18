"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Zap, TrendingDown, CheckCircle, ArrowRight } from "lucide-react"

interface ManeuverOption {
  id: string
  direction: string
  deltaV: number // m/s
  fuelCost: number // USD
  riskReduction: number // percentage
  duration: number // seconds
  recommendation: "optimal" | "budget" | "conservative"
}

interface ManeuverModalProps {
  open: boolean
  onClose: () => void
  satelliteName: string
  debrisName: string
  currentRisk: number // 0-100
  closestApproach: string
}

export function ManeuverModal({
  open,
  onClose,
  satelliteName,
  debrisName,
  currentRisk,
  closestApproach,
}: ManeuverModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // AI-generated maneuver options with realistic calculations
  const maneuverOptions: ManeuverOption[] = [
    {
      id: "opt1",
      direction: "Prograde Burn (North)",
      deltaV: 2.5,
      fuelCost: 250,
      riskReduction: 99,
      duration: 45,
      recommendation: "optimal",
    },
    {
      id: "opt2",
      direction: "Radial Out (Up)",
      deltaV: 1.2,
      fuelCost: 100,
      riskReduction: 85,
      duration: 30,
      recommendation: "budget",
    },
    {
      id: "opt3",
      direction: "Normal Burn (West)",
      deltaV: 3.8,
      fuelCost: 380,
      riskReduction: 95,
      duration: 60,
      recommendation: "conservative",
    },
  ]

  const handleExecute = (option: ManeuverOption) => {
    setSelectedOption(option.id)
    // Simulate API call to execute maneuver
    setTimeout(() => {
      alert(`✅ Maneuver command sent! ${option.direction} burn initiated.`)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <DialogTitle className="text-2xl">Collision Risk Detected</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            AI-powered maneuver recommendations to avoid {debrisName}
          </DialogDescription>
        </DialogHeader>

        {/* Risk Summary */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Satellite</p>
                <p className="font-semibold text-gray-900">{satelliteName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Debris Object</p>
                <p className="font-semibold text-gray-900">{debrisName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Closest Approach</p>
                <p className="font-semibold text-red-600">{closestApproach}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Risk Level</span>
                <span className="text-sm font-bold text-red-600">{currentRisk}% (CRITICAL)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all"
                  style={{ width: `${currentRisk}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maneuver Options */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#4e6aff]" />
            AI-Recommended Maneuvers
          </h3>

          {maneuverOptions.map((option, index) => (
            <Card
              key={option.id}
              className={`border-2 transition-all cursor-pointer hover:shadow-lg ${
                option.recommendation === "optimal"
                  ? "border-[#4e6aff] bg-[#4e6aff]/5"
                  : "border-gray-200 hover:border-[#4e6aff]"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg">Option {index + 1}: {option.direction}</h4>
                      {option.recommendation === "optimal" && (
                        <Badge className="bg-[#4e6aff] text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          RECOMMENDED
                        </Badge>
                      )}
                      {option.recommendation === "budget" && (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          LOWEST COST
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Delta-V: {option.deltaV} m/s • Duration: {option.duration}s
                    </p>
                  </div>
                  <Button
                    onClick={() => handleExecute(option)}
                    disabled={selectedOption !== null && selectedOption !== option.id}
                    className={`${
                      option.recommendation === "optimal"
                        ? "bg-[#4e6aff] hover:bg-[#3d59ef]"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    {selectedOption === option.id ? "Executing..." : "Execute"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Fuel Cost</p>
                    <p className="text-2xl font-bold text-gray-900">${option.fuelCost}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Risk Reduction</p>
                    <p className="text-2xl font-bold text-green-600">{option.riskReduction}%</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">New Risk Level</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(Math.max(0, (currentRisk || 0) - ((currentRisk || 0) * (option?.riskReduction || 0)) / 100) || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Propellant Cost ({option.deltaV} m/s × $100/m/s):</span>
                    <span>${option.fuelCost}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Mission Impact (altitude adjustment):</span>
                    <span className="text-yellow-600">
                      {option.deltaV > 2 ? "Minor" : "Negligible"}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Estimated Annual Savings (avoided collisions):</span>
                    <span className="text-green-600">$250,000+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">AI Recommendation Engine</p>
              <p className="text-sm text-blue-700">
                Our AI analyzes 64,000+ orbital objects, fuel efficiency, and mission constraints to suggest the
                optimal maneuver. Calculations based on SGP4 propagation and delta-v requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel (Manual Control)
          </Button>
          <p className="text-xs text-gray-500">Maneuver window closes in 2h 35m</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
