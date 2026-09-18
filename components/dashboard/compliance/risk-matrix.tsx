"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function RiskMatrix() {
  const [riskData, setRiskData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const response = await fetch("/api/risk-analysis?satelliteId=25544")
        const result = await response.json()
        if (result.success) {
          setRiskData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch risk data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRiskData()
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const mockRisks = [
    { id: "RISK-001", type: "Collision", level: "medium", probability: 0.003, description: "Debris proximity alert" },
    { id: "RISK-002", type: "Compliance", level: "low", probability: 0.001, description: "ISO 24113 review due" },
    { id: "RISK-003", type: "Operational", level: "high", probability: 0.015, description: "Altitude decay concern" },
  ]

  const risks = riskData?.collisionRisks || mockRisks

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Risk Assessment Matrix</CardTitle>
            <p className="text-sm text-gray-600">Real-time collision and compliance risk analysis</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Level Distribution */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Risk Level Distribution</h4>
          <div className="grid grid-cols-4 gap-2">
            {["low", "medium", "high", "critical"].map((level) => {
              const count = risks.filter((r: any) => r.riskLevel === level || r.level === level).length
              return (
                <div key={level} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${getRiskColor(level)}`}></div>
                  <div className="text-lg font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-600 capitalize">{level}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Risks */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Active Risk Events</h4>
          <div className="space-y-3">
            {risks.slice(0, 5).map((risk: any, index: number) => (
              <div key={risk.id || index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(risk.riskLevel || risk.level)}`}></div>
                    <span className="font-medium text-gray-900">{risk.debrisId || risk.id || `RISK-${index + 1}`}</span>
                  </div>
                  <Badge className={getRiskBadgeColor(risk.riskLevel || risk.level)}>
                    {(risk.riskLevel || risk.level).toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {risk.recommendedAction || risk.description || "Risk assessment in progress"}
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <span>Probability:</span>
                    <span className="ml-1 font-medium">{((risk.probability || 0.001) * 100).toFixed(3)}%</span>
                  </div>
                  <div>
                    <span>Time to Event:</span>
                    <span className="ml-1 font-medium">
                      {risk.timeToClosestApproach ? `${risk.timeToClosestApproach.toFixed(1)}h` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Trend */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">Risk trend:</span>
            <span className="font-medium text-green-600">Improving (↓ 12% this week)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
