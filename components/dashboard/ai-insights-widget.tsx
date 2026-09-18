"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, Brain, Zap, Target } from "lucide-react"
import { useState, useEffect } from "react"

interface AIInsight {
  id: string
  type: "opportunity" | "warning" | "recommendation" | "prediction"
  title: string
  description: string
  confidence: number
  priority: "high" | "medium" | "low"
  icon: any
}

// Smart dummy insights that rotate
const AI_INSIGHTS_POOL: AIInsight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "New Market Opportunity Detected",
    description: "AI identified 3 underserved IoT markets in Southeast Asia. Potential revenue: $1.2M/year.",
    confidence: 87,
    priority: "high",
    icon: Target
  },
  {
    id: "2",
    type: "warning",
    title: "Collision Risk Increasing",
    description: "SAT-2024-001 shows elevated debris proximity. AI recommends maneuver within 48 hours.",
    confidence: 92,
    priority: "high",
    icon: AlertTriangle
  },
  {
    id: "3",
    type: "recommendation",
    title: "Cost Optimization Available",
    description: "Switch to alternative ground stations could reduce operational costs by 18% ($340K/year).",
    confidence: 79,
    priority: "medium",
    icon: Lightbulb
  },
  {
    id: "4",
    type: "prediction",
    title: "Launch Window Analysis",
    description: "Optimal launch conditions predicted for March 15-22. Weather confidence: 94%.",
    confidence: 94,
    priority: "medium",
    icon: TrendingUp
  },
  {
    id: "5",
    type: "opportunity",
    title: "Partnership Opportunity",
    description: "AI matched your satellite capabilities with 2 potential partners in Earth observation sector.",
    confidence: 81,
    priority: "medium",
    icon: Zap
  },
  {
    id: "6",
    type: "warning",
    title: "Battery Degradation Pattern",
    description: "SAT-2024-003 battery shows 12% faster degradation than expected. Maintenance recommended.",
    confidence: 88,
    priority: "high",
    icon: AlertTriangle
  },
  {
    id: "7",
    type: "recommendation",
    title: "Insurance Premium Reduction",
    description: "Your compliance score improved 15%. AI suggests renegotiating insurance for lower premiums.",
    confidence: 85,
    priority: "low",
    icon: Lightbulb
  },
  {
    id: "8",
    type: "prediction",
    title: "LEO Market Trend Shift",
    description: "AI predicts 23% growth in commercial Earth observation demand over next 6 months.",
    confidence: 76,
    priority: "medium",
    icon: TrendingUp
  }
]

export default function AIInsightsWidget() {
  const [currentInsights, setCurrentInsights] = useState<AIInsight[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Rotate insights periodically
  useEffect(() => {
    // Get random 3 insights on mount
    const shuffled = [...AI_INSIGHTS_POOL].sort(() => 0.5 - Math.random())
    setCurrentInsights(shuffled.slice(0, 3))

    // Rotate insights every 30 seconds
    const interval = setInterval(() => {
      const shuffled = [...AI_INSIGHTS_POOL].sort(() => 0.5 - Math.random())
      setCurrentInsights(shuffled.slice(0, 3))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const refreshInsights = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const shuffled = [...AI_INSIGHTS_POOL].sort(() => 0.5 - Math.random())
      setCurrentInsights(shuffled.slice(0, 3))
      setIsGenerating(false)
    }, 1500)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-red-600 bg-red-50 border-red-200"
      case "recommendation":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "prediction":
        return "text-purple-600 bg-purple-50 border-purple-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>
      case "medium":
        return <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">Medium</Badge>
      case "low":
        return <Badge variant="secondary" className="text-xs">Low Priority</Badge>
    }
  }

  return (
    <Card className="border-2 border-[#4e6aff]/20 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Intelligence Insights</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Real-time analysis powered by Afshara AI Engine</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshInsights}
            disabled={isGenerating}
            className="text-xs hover:bg-[#4e6aff] hover:text-white transition-all"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentInsights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border-2 ${getTypeColor(insight.type)} transition-all hover:shadow-md cursor-pointer group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(insight.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">{insight.title}</h4>
                    {getPriorityBadge(insight.priority)}
                  </div>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    {insight.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">AI Confidence:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              insight.confidence >= 85
                                ? "bg-green-500"
                                : insight.confidence >= 70
                                ? "bg-yellow-500"
                                : "bg-orange-500"
                            }`}
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{insight.confidence}%</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Details
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Auto-refreshes every 30 seconds
            </span>
            <Button variant="link" className="text-xs h-auto p-0 text-[#4e6aff]">
              View All Insights →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
