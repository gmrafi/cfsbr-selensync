"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign } from "lucide-react"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

export default function ROIProjections() {
  const projectionData = [
    { year: "Year 1", revenue: 320000, costs: 180000, profit: 140000, roi: 77.8 },
    { year: "Year 2", revenue: 850000, costs: 420000, profit: 430000, roi: 102.4 },
    { year: "Year 3", revenue: 1800000, costs: 780000, profit: 1020000, roi: 130.8 },
    { year: "Year 4", revenue: 3200000, costs: 1200000, profit: 2000000, roi: 166.7 },
    { year: "Year 5", revenue: 5500000, costs: 1800000, profit: 3700000, roi: 205.6 },
  ]

  const scenarios = [
    {
      scenario: "Conservative",
      year5Revenue: "$3.2M",
      roi: "145%",
      probability: "80%",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      scenario: "Base Case",
      year5Revenue: "$5.5M",
      roi: "206%",
      probability: "60%",
      color: "text-[#4e6aff]",
      bgColor: "bg-[#4e6aff]/10",
    },
    {
      scenario: "Optimistic",
      year5Revenue: "$8.9M",
      roi: "285%",
      probability: "30%",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-lg">ROI Projections</CardTitle>
            <p className="text-sm text-gray-600">5-year financial forecasting and return analysis</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ROI Chart */}
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value: any, name: string) => {
                  if (name === "roi") return [`${value}%`, "ROI"]
                  return [
                    `$${(value / 1000).toFixed(0)}K`,
                    name === "revenue" ? "Revenue" : name === "costs" ? "Costs" : "Profit",
                  ]
                }}
              />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#4e6aff" fill="#4e6aff" fillOpacity={0.3} />
              <Area type="monotone" dataKey="costs" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              <Line type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario Analysis */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Scenario Analysis</h4>
          <div className="space-y-3">
            {scenarios.map((scenario, index) => (
              <div key={index} className={`p-4 rounded-lg ${scenario.bgColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className={`font-medium ${scenario.color}`}>{scenario.scenario}</h5>
                  <span className="text-sm text-gray-600">Probability: {scenario.probability}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Year 5 Revenue:</span>
                    <div className={`text-lg font-bold ${scenario.color}`}>{scenario.year5Revenue}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">5-Year ROI:</span>
                    <div className={`text-lg font-bold ${scenario.color}`}>{scenario.roi}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">18 months</div>
            <div className="text-sm text-gray-600">Payback Period</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-[#4e6aff] mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">42%</div>
            <div className="text-sm text-gray-600">IRR (Internal Rate of Return)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
