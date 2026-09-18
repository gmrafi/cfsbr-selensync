"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export default function ComplianceOverview() {
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

  const getOverviewStats = () => {
    if (!riskData) {
      return {
        overallScore: 85,
        compliantItems: 12,
        warningItems: 3,
        criticalRisks: 1,
      }
    }

    return {
      overallScore: riskData.riskScore,
      compliantItems: riskData.complianceStatus.filter((c: any) => c.status === "compliant").length,
      warningItems: riskData.complianceStatus.filter((c: any) => c.status === "warning").length,
      criticalRisks: riskData.collisionRisks.filter((r: any) => r.riskLevel === "critical" || r.riskLevel === "high")
        .length,
    }
  }

  const stats = getOverviewStats()

  const overviewCards = [
    {
      title: "Overall Compliance Score",
      value: `${stats.overallScore}%`,
      change: "ISO 24113 Standard",
      icon: Shield,
      color: stats.overallScore > 80 ? "text-green-600" : stats.overallScore > 60 ? "text-yellow-600" : "text-red-600",
      bgColor: stats.overallScore > 80 ? "bg-green-100" : stats.overallScore > 60 ? "bg-yellow-100" : "bg-red-100",
    },
    {
      title: "Compliant Requirements",
      value: stats.compliantItems.toString(),
      change: "Meeting standards",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Warning Items",
      value: stats.warningItems.toString(),
      change: "Require attention",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Critical Risks",
      value: stats.criticalRisks.toString(),
      change: "High priority",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewCards.map((card, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{isLoading ? "..." : card.value}</div>
            <p className="text-xs text-gray-600">{card.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
