"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { TrendingUp, DollarSign, Target, Zap } from "lucide-react"

export default function ValuationMetrics() {
  const [valuation, setValuation] = useState({
    annualRevenue: 9600000,
    annualProfit: 3860000,
    growthRate: 25,
    industryMultiple: 8.5,
    discountRate: 12,
  })

  const revenueMultiple = valuation.industryMultiple
  const revenueValuation = valuation.annualRevenue * revenueMultiple
  const profitMultiple = 15 // P/E ratio for space tech companies
  const profitValuation = valuation.annualProfit * profitMultiple

  // DCF calculation (simplified 5-year projection)
  const projectedCashFlows = []
  let currentCashFlow = valuation.annualProfit
  for (let i = 1; i <= 5; i++) {
    currentCashFlow = currentCashFlow * (1 + valuation.growthRate / 100)
    projectedCashFlows.push(currentCashFlow / Math.pow(1 + valuation.discountRate / 100, i))
  }
  const terminalValue = (currentCashFlow * 1.03) / (valuation.discountRate / 100 - 0.03)
  const discountedTerminalValue = terminalValue / Math.pow(1 + valuation.discountRate / 100, 5)
  const dcfValuation = projectedCashFlows.reduce((sum, cf) => sum + cf, 0) + discountedTerminalValue

  const averageValuation = (revenueValuation + profitValuation + dcfValuation) / 3

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#4e6aff]" />
          Company Valuation Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
            <Input
              id="annualRevenue"
              type="number"
              value={valuation.annualRevenue}
              onChange={(e) => setValuation({ ...valuation, annualRevenue: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="annualProfit">Annual Profit ($)</Label>
            <Input
              id="annualProfit"
              type="number"
              value={valuation.annualProfit}
              onChange={(e) => setValuation({ ...valuation, annualProfit: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="growthRate">Growth Rate (%)</Label>
            <Input
              id="growthRate"
              type="number"
              value={valuation.growthRate}
              onChange={(e) => setValuation({ ...valuation, growthRate: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="industryMultiple">Revenue Multiple</Label>
            <Input
              id="industryMultiple"
              type="number"
              step="0.1"
              value={valuation.industryMultiple}
              onChange={(e) => setValuation({ ...valuation, industryMultiple: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Valuation Results */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Revenue Multiple</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">${(revenueValuation / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-blue-600 mt-1">{revenueMultiple}x Revenue</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Profit Multiple</span>
            </div>
            <div className="text-2xl font-bold text-green-900">${(profitValuation / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-green-600 mt-1">{profitMultiple}x Profit</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">DCF Valuation</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">${(dcfValuation / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-purple-600 mt-1">5-Year DCF Model</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Average Valuation</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">${(averageValuation / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-orange-600 mt-1">Blended Average</div>
          </div>
        </div>

        {/* Valuation Insights */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Valuation Insights</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Space tech companies typically trade at 6-12x revenue multiples</li>
            <li>• Current profit margin: {((valuation.annualProfit / valuation.annualRevenue) * 100).toFixed(1)}%</li>
            <li>
              • Projected 5-year value: ${(dcfValuation / 1000000).toFixed(1)}M based on {valuation.growthRate}% growth
            </li>
            <li>
              • Enterprise value range: ${((averageValuation * 0.8) / 1000000).toFixed(1)}M - $
              {((averageValuation * 1.2) / 1000000).toFixed(1)}M
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
