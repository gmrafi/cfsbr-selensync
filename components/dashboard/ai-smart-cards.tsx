"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingDown, AlertTriangle, Sparkles, ArrowRight, Zap, DollarSign, Shield, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface SmartCard {
  id: string
  type: "insight" | "warning" | "optimization" | "prediction"
  icon: any
  title: string
  description: string
  action: string
  priority: "high" | "medium" | "low"
  aiConfidence: number
}

const SMART_CARDS_POOL: SmartCard[] = [
  {
    id: "1",
    type: "warning",
    icon: AlertTriangle,
    title: "Debris Approaching SAT-2024-001",
    description: "AI detected space debris on collision course. Estimated time: 8 hours. Recommended action: orbital adjustment.",
    action: "View AI Recommendation",
    priority: "high",
    aiConfidence: 94
  },
  {
    id: "2",
    type: "optimization",
    icon: DollarSign,
    title: "Cost Savings Opportunity",
    description: "AI analysis found $45,000 annual savings by switching to alternative ground stations in Asia-Pacific region.",
    action: "View Optimization Plan",
    priority: "medium",
    aiConfidence: 87
  },
  {
    id: "3",
    type: "insight",
    icon: Brain,
    title: "Maintenance Alert",
    description: "3 satellites showing early degradation patterns. AI recommends preventive maintenance within 14 days.",
    action: "View Maintenance Schedule",
    priority: "medium",
    aiConfidence: 91
  },
  {
    id: "4",
    type: "prediction",
    icon: TrendingDown,
    title: "Fuel Optimization Opportunity",
    description: "AI predicts you can extend mission duration by 6 months with current fuel reserves using optimal trajectory.",
    action: "View Trajectory Plan",
    priority: "low",
    aiConfidence: 82
  },
  {
    id: "5",
    type: "warning",
    icon: Shield,
    title: "Compliance Gap Detected",
    description: "ISO 24113 standards require debris mitigation update. AI suggests 3 action items to maintain certification.",
    action: "View Compliance Report",
    priority: "high",
    aiConfidence: 96
  },
  {
    id: "6",
    type: "optimization",
    icon: Zap,
    title: "Performance Enhancement",
    description: "AI identified sub-optimal satellite positioning. Repositioning could improve signal coverage by 23%.",
    action: "View Positioning Guide",
    priority: "medium",
    aiConfidence: 88
  }
]

export default function AISmartCards() {
  const [cards, setCards] = useState<SmartCard[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    // Simulate AI analyzing on mount
    setTimeout(() => {
      const shuffled = [...SMART_CARDS_POOL].sort(() => 0.5 - Math.random())
      setCards(shuffled.slice(0, 3))
      setIsAnalyzing(false)
    }, 1500)

    // Rotate cards every 45 seconds
    const interval = setInterval(() => {
      const shuffled = [...SMART_CARDS_POOL].sort(() => 0.5 - Math.random())
      setCards(shuffled.slice(0, 3))
    }, 45000)

    return () => clearInterval(interval)
  }, [])

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "warning":
        return "border-red-200 bg-gradient-to-br from-red-50 to-orange-50"
      case "optimization":
        return "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
      case "insight":
        return "border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50"
      case "prediction":
        return "border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-red-600 bg-red-100"
      case "optimization":
        return "text-green-600 bg-green-100"
      case "insight":
        return "text-blue-600 bg-blue-100"
      case "prediction":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>
      case "medium":
        return <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-300">Medium</Badge>
      case "low":
        return <Badge variant="secondary" className="text-xs">Low Priority</Badge>
    }
  }

  if (isAnalyzing) {
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-2 border-[#4e6aff]/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4e6aff]/10 rounded-lg animate-pulse">
                  <Brain className="h-5 w-5 text-[#4e6aff]" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#4e6aff]" />
          <h2 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h2>
          <Badge variant="secondary" className="text-xs">Live Analysis</Badge>
        </div>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Updated 2 min ago
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card
              key={card.id}
              className={`border-2 ${getTypeStyles(card.type)} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${getIconColor(card.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {getPriorityBadge(card.priority)}
                </div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.description}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">AI Confidence:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            card.aiConfidence >= 90
                              ? "bg-green-500"
                              : card.aiConfidence >= 80
                              ? "bg-yellow-500"
                              : "bg-orange-500"
                          }`}
                          style={{ width: `${card.aiConfidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{card.aiConfidence}%</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] hover:from-[#3d59ef] hover:to-[#5d4bef] text-white group-hover:shadow-md transition-all"
                >
                  {card.action}
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <Button variant="outline" size="sm" className="text-xs">
          <Brain className="h-3 w-3 mr-1" />
          View All AI Insights
        </Button>
      </div>
    </div>
  )
}
