"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp } from "lucide-react"
import { useState } from "react"

export default function BusinessModelCalculator() {
  const [inputs, setInputs] = useState({
    satellites: 50,
    pricePerSatellite: 50,
    operationalCost: 15,
    acquisitionCost: 200,
  })

  const [results, setResults] = useState({
    monthlyRevenue: 0,
    annualRevenue: 0,
    grossMargin: 0,
    breakEvenMonths: 0,
  })

  const calculateMetrics = () => {
    const monthlyRevenue = inputs.satellites * inputs.pricePerSatellite
    const annualRevenue = monthlyRevenue * 12
    const monthlyCost = inputs.satellites * inputs.operationalCost
    const grossMargin = ((monthlyRevenue - monthlyCost) / monthlyRevenue) * 100
    const breakEvenMonths = inputs.acquisitionCost / (inputs.pricePerSatellite - inputs.operationalCost)

    setResults({
      monthlyRevenue,
      annualRevenue,
      grossMargin,
      breakEvenMonths,
    })
  }

  const handleInputChange = (field: string, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setInputs((prev) => ({ ...prev, [field]: numValue }))
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-[#4e6aff]" />
          </div>
          <div>
            <CardTitle className="text-lg">Business Model Calculator</CardTitle>
            <p className="text-sm text-gray-600">Optimize your satellite inspection pricing strategy</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="satellites">Number of Satellites</Label>
            <Input
              id="satellites"
              type="number"
              value={inputs.satellites}
              onChange={(e) => handleInputChange("satellites", e.target.value)}
              className="focus:border-[#4e6aff] focus:ring-[#4e6aff]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price per Satellite ($)</Label>
            <Input
              id="price"
              type="number"
              value={inputs.pricePerSatellite}
              onChange={(e) => handleInputChange("pricePerSatellite", e.target.value)}
              className="focus:border-[#4e6aff] focus:ring-[#4e6aff]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Operational Cost per Satellite ($)</Label>
            <Input
              id="cost"
              type="number"
              value={inputs.operationalCost}
              onChange={(e) => handleInputChange("operationalCost", e.target.value)}
              className="focus:border-[#4e6aff] focus:ring-[#4e6aff]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acquisition">Customer Acquisition Cost ($)</Label>
            <Input
              id="acquisition"
              type="number"
              value={inputs.acquisitionCost}
              onChange={(e) => handleInputChange("acquisitionCost", e.target.value)}
              className="focus:border-[#4e6aff] focus:ring-[#4e6aff]"
            />
          </div>
        </div>

        <Button onClick={calculateMetrics} className="w-full bg-[#4e6aff] hover:bg-[#3d54e6]">
          <TrendingUp className="w-4 h-4 mr-2" />
          Calculate Business Metrics
        </Button>

        {/* Results */}
        {results.monthlyRevenue > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${(results?.monthlyRevenue ?? 0).toLocaleString()}</div>
              <div className="text-sm text-green-700">Monthly Revenue</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${(results?.annualRevenue ?? 0).toLocaleString()}</div>
              <div className="text-sm text-blue-700">Annual Revenue</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{(results?.grossMargin ?? 0).toFixed(1)}%</div>
              <div className="text-sm text-purple-700">Gross Margin</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{(results?.breakEvenMonths ?? 0).toFixed(1)}</div>
              <div className="text-sm text-orange-700">Break-even (months)</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
