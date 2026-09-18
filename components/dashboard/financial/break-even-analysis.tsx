"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { BarChart3, Calculator, TrendingUp, AlertCircle } from "lucide-react"

export default function BreakEvenAnalysis() {
  const [analysis, setAnalysis] = useState({
    fixedCosts: 250000,
    variableCostPerUnit: 150,
    pricePerUnit: 600,
    currentUnits: 800,
  })

  const contributionMargin = analysis.pricePerUnit - analysis.variableCostPerUnit
  const contributionMarginRatio = (contributionMargin / analysis.pricePerUnit) * 100
  const breakEvenUnits = analysis.fixedCosts / contributionMargin
  const breakEvenRevenue = breakEvenUnits * analysis.pricePerUnit
  const currentRevenue = analysis.currentUnits * analysis.pricePerUnit
  const currentProfit = currentRevenue - analysis.fixedCosts - analysis.currentUnits * analysis.variableCostPerUnit
  const marginOfSafety = ((analysis.currentUnits - breakEvenUnits) / analysis.currentUnits) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#4e6aff]" />
          Break-Even Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fixedCosts">Monthly Fixed Costs ($)</Label>
            <Input
              id="fixedCosts"
              type="number"
              value={analysis.fixedCosts}
              onChange={(e) => setAnalysis({ ...analysis, fixedCosts: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="variableCostPerUnit">Variable Cost per Customer ($)</Label>
            <Input
              id="variableCostPerUnit"
              type="number"
              value={analysis.variableCostPerUnit}
              onChange={(e) => setAnalysis({ ...analysis, variableCostPerUnit: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="pricePerUnit">Price per Customer ($)</Label>
            <Input
              id="pricePerUnit"
              type="number"
              value={analysis.pricePerUnit}
              onChange={(e) => setAnalysis({ ...analysis, pricePerUnit: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="currentUnits">Current Monthly Customers</Label>
            <Input
              id="currentUnits"
              type="number"
              value={analysis.currentUnits}
              onChange={(e) => setAnalysis({ ...analysis, currentUnits: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Break-Even Results */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Break-Even Customers</span>
            </div>
            <div className="text-2xl font-bold text-red-900">{Math.ceil(breakEvenUnits)}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Break-Even Revenue</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">${breakEvenRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Current Monthly Profit</span>
            </div>
            <div className="text-2xl font-bold text-green-900">${currentProfit.toLocaleString()}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Margin of Safety</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{marginOfSafety.toFixed(1)}%</div>
            <div className="text-xs text-purple-600 mt-1">
              {marginOfSafety > 20 ? "Strong" : marginOfSafety > 10 ? "Moderate" : "Weak"}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • Contribution Margin: ${contributionMargin} ({contributionMarginRatio.toFixed(1)}%)
            </li>
            <li>• Need {Math.ceil(breakEvenUnits - analysis.currentUnits)} more customers to break even</li>
            <li>• Each additional customer contributes ${contributionMargin} to profit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
