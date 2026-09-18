"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingDown, AlertCircle, CheckCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function CostOptimization() {
  const costBreakdown = [
    { name: "Infrastructure", value: 35, amount: 63000, color: "#4e6aff" },
    { name: "Personnel", value: 28, amount: 50400, color: "#10b981" },
    { name: "Data & APIs", value: 15, amount: 27000, color: "#f59e0b" },
    { name: "Marketing", value: 12, amount: 21600, color: "#ef4444" },
    { name: "Operations", value: 10, amount: 18000, color: "#8b5cf6" },
  ]

  const optimizations = [
    {
      category: "Infrastructure",
      current: "$63,000",
      optimized: "$45,000",
      savings: "$18,000",
      impact: "High",
      status: "recommended",
      description: "Migrate to more efficient cloud architecture",
    },
    {
      category: "Data & APIs",
      current: "$27,000",
      optimized: "$19,000",
      savings: "$8,000",
      impact: "Medium",
      status: "in-progress",
      description: "Negotiate volume discounts with NASA API providers",
    },
    {
      category: "Operations",
      current: "$18,000",
      optimized: "$14,000",
      savings: "$4,000",
      impact: "Low",
      status: "completed",
      description: "Automate routine monitoring tasks",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "recommended":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "in-progress":
        return AlertCircle
      case "recommended":
        return Zap
      default:
        return AlertCircle
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Cost Optimization</CardTitle>
            <p className="text-sm text-gray-600">Identify savings opportunities and improve margins</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Breakdown Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Current Cost Structure</h4>
          <div className="flex items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">${item.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optimization Opportunities */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Optimization Opportunities</h4>
          <div className="space-y-3">
            {optimizations.map((opt, index) => {
              const StatusIcon = getStatusIcon(opt.status)
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4 text-gray-600" />
                      <h5 className="font-medium text-gray-900">{opt.category}</h5>
                    </div>
                    <Badge className={getStatusColor(opt.status)}>{opt.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{opt.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current:</span>
                      <div className="font-semibold">{opt.current}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Optimized:</span>
                      <div className="font-semibold text-green-600">{opt.optimized}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Annual Savings:</span>
                      <div className="font-semibold text-green-600">{opt.savings}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">$30K</div>
            <div className="text-sm text-green-700">Total Annual Savings</div>
          </div>
          <div className="text-center p-4 bg-[#4e6aff]/10 rounded-lg">
            <div className="text-2xl font-bold text-[#4e6aff]">16.7%</div>
            <div className="text-sm text-[#4e6aff]">Cost Reduction</div>
          </div>
        </div>

        <Button className="w-full bg-[#4e6aff] hover:bg-[#3d54e6]">
          <Zap className="w-4 h-4 mr-2" />
          Implement Recommended Optimizations
        </Button>
      </CardContent>
    </Card>
  )
}
