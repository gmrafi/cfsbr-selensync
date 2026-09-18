"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Users, DollarSign, TrendingUp, Target } from "lucide-react"

export default function CustomerMetrics() {
  const [metrics, setMetrics] = useState({
    marketingSpend: 50000,
    newCustomers: 100,
    avgRevenue: 600,
    retentionRate: 85,
    churnRate: 15,
  })

  const cac = metrics.marketingSpend / metrics.newCustomers
  const clv = (metrics.avgRevenue * 12 * (metrics.retentionRate / 100)) / (metrics.churnRate / 100)
  const clvCacRatio = clv / cac
  const paybackPeriod = cac / (metrics.avgRevenue * 12)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#4e6aff]" />
          Customer Metrics Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="marketingSpend">Monthly Marketing Spend ($)</Label>
            <Input
              id="marketingSpend"
              type="number"
              value={metrics.marketingSpend}
              onChange={(e) => setMetrics({ ...metrics, marketingSpend: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="newCustomers">New Customers/Month</Label>
            <Input
              id="newCustomers"
              type="number"
              value={metrics.newCustomers}
              onChange={(e) => setMetrics({ ...metrics, newCustomers: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="avgRevenue">Avg Monthly Revenue/Customer ($)</Label>
            <Input
              id="avgRevenue"
              type="number"
              value={metrics.avgRevenue}
              onChange={(e) => setMetrics({ ...metrics, avgRevenue: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="retentionRate">Customer Retention Rate (%)</Label>
            <Input
              id="retentionRate"
              type="number"
              value={metrics.retentionRate}
              onChange={(e) => setMetrics({ ...metrics, retentionRate: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Calculated Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Customer Acquisition Cost</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">${cac.toFixed(0)}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Customer Lifetime Value</span>
            </div>
            <div className="text-2xl font-bold text-green-900">${clv.toFixed(0)}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">CLV:CAC Ratio</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{clvCacRatio.toFixed(1)}:1</div>
            <div className="text-xs text-purple-600 mt-1">
              {clvCacRatio >= 3 ? "Excellent" : clvCacRatio >= 2 ? "Good" : "Needs Improvement"}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Payback Period</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">{paybackPeriod.toFixed(1)} months</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
