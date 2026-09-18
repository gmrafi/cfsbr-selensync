"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, RefreshCw, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function DebrisTracking() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const debrisObjects = [
    {
      id: "DEB-001",
      name: "Fragmentation Debris",
      size: "15 cm",
      distance: "2.3 km",
      riskLevel: "medium",
      velocity: "7.5 km/s",
      lastUpdate: "2 min ago",
    },
    {
      id: "DEB-002",
      name: "Rocket Body Fragment",
      size: "80 cm",
      distance: "15.7 km",
      riskLevel: "low",
      velocity: "7.4 km/s",
      lastUpdate: "5 min ago",
    },
    {
      id: "DEB-003",
      name: "Paint Fleck",
      size: "0.1 cm",
      distance: "0.8 km",
      riskLevel: "high",
      velocity: "7.6 km/s",
      lastUpdate: "1 min ago",
    },
    {
      id: "DEB-004",
      name: "Defunct Satellite",
      size: "2.5 m",
      distance: "45.2 km",
      riskLevel: "low",
      velocity: "7.2 km/s",
      lastUpdate: "8 min ago",
    },
  ]

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Space Debris Tracking</CardTitle>
              <p className="text-sm text-gray-600">Real-time debris monitoring and collision prediction</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Debris Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">{debrisObjects.length}</div>
            <div className="text-sm text-gray-600">Tracked Objects</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">
              {debrisObjects.filter((d) => d.riskLevel === "high").length}
            </div>
            <div className="text-sm text-red-700">High Risk</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600">
              {debrisObjects.filter((d) => d.riskLevel === "medium").length}
            </div>
            <div className="text-sm text-yellow-700">Medium Risk</div>
          </div>
        </div>

        {/* Debris List */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Nearby Debris Objects</h4>
          <div className="space-y-3">
            {debrisObjects.map((debris) => (
              <div key={debris.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-900">{debris.name}</span>
                  </div>
                  <Badge className={getRiskColor(debris.riskLevel)}>{debris.riskLevel.toUpperCase()}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                  <div>
                    <span>Size: </span>
                    <span className="font-medium">{debris.size}</span>
                  </div>
                  <div>
                    <span>Distance: </span>
                    <span className="font-medium">{debris.distance}</span>
                  </div>
                  <div>
                    <span>Velocity: </span>
                    <span className="font-medium">{debris.velocity}</span>
                  </div>
                  <div>
                    <span>Updated: </span>
                    <span className="font-medium">{debris.lastUpdate}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">ID: {debris.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full bg-[#4e6aff] hover:bg-[#3d54e6]">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Detailed Debris Analysis
        </Button>
      </CardContent>
    </Card>
  )
}
