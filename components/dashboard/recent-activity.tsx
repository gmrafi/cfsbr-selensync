import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Satellite, Shield, TrendingUp, Settings } from "lucide-react"

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "satellite",
      title: "New satellite added",
      description: "OrbitEdge Delta successfully deployed",
      time: "30 minutes ago",
      icon: Satellite,
      color: "text-[#4e6aff]",
      bgColor: "bg-[#4e6aff]/10",
    },
    {
      id: 2,
      type: "compliance",
      title: "Compliance report generated",
      description: "Monthly ISO 24113 assessment completed",
      time: "2 hours ago",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: 3,
      type: "analytics",
      title: "Revenue milestone reached",
      description: "$10K monthly recurring revenue achieved",
      time: "1 day ago",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: 4,
      type: "system",
      title: "System maintenance completed",
      description: "Scheduled maintenance window finished",
      time: "2 days ago",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#4e6aff]" />
          </div>
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <p className="text-sm text-gray-600">Latest system events</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.bgColor}`}
              >
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm mb-1">{activity.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
