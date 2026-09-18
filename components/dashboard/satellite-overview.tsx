import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Satellite, Shield, AlertTriangle, TrendingUp } from "lucide-react"

export default function SatelliteOverview() {
  const stats = [
    {
      title: "Active Satellites",
      value: "24",
      change: "+2 this week",
      icon: Satellite,
      color: "text-[#4e6aff]",
      bgColor: "bg-[#4e6aff]/10",
    },
    {
      title: "Compliance Status",
      value: "98.5%",
      change: "ISO 24113 compliant",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Risk Alerts",
      value: "3",
      change: "2 medium, 1 low",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Monthly Revenue",
      value: "$12,450",
      change: "+15% from last month",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <p className="text-xs text-gray-600">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
