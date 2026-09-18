import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Clock } from "lucide-react"

export default function RiskAlerts() {
  const alerts = [
    {
      id: 1,
      type: "collision",
      severity: "medium",
      title: "Debris Proximity Alert",
      description: "SAT-002 approaching tracked debris",
      time: "2 hours ago",
      satellite: "OrbitEdge Beta",
    },
    {
      id: 2,
      type: "compliance",
      severity: "low",
      title: "ISO 24113 Review Due",
      description: "Quarterly compliance check required",
      time: "1 day ago",
      satellite: "All satellites",
    },
    {
      id: 3,
      type: "maintenance",
      severity: "medium",
      title: "Scheduled Maintenance",
      description: "SAT-003 entering maintenance window",
      time: "3 hours ago",
      satellite: "OrbitEdge Gamma",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "collision":
        return AlertTriangle
      case "compliance":
        return Shield
      case "maintenance":
        return Clock
      default:
        return AlertTriangle
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Risk Alerts</CardTitle>
            <p className="text-sm text-gray-600">Active monitoring alerts</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = getIcon(alert.type)
            return (
              <div key={alert.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{alert.satellite}</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
