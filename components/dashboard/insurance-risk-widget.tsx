"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Copy, RefreshCw } from "lucide-react"

interface RiskFactor {
  name: string
  score: number // 0-100
  weight: number // percentage
  status: "good" | "warning" | "critical"
}

export function InsuranceRiskWidget() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Calculate composite risk score based on multiple factors
  const riskFactors: RiskFactor[] = [
    {
      name: "Debris Proximity",
      score: 85,
      weight: 35,
      status: "good",
    },
    {
      name: "ISO 24113 Compliance",
      score: 92,
      weight: 25,
      status: "good",
    },
    {
      name: "Recent Maneuvers",
      score: 78,
      weight: 20,
      status: "warning",
    },
    {
      name: "Orbital Stability",
      score: 88,
      weight: 20,
      status: "good",
    },
  ]

  // Calculate weighted average safety score
  const safetyScore = Math.round(
    riskFactors.reduce((acc, factor) => acc + (factor.score * factor.weight) / 100, 0)
  )

  const generateAPIKey = () => {
    setLoading(true)
    setTimeout(() => {
      const newKey = `osk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      setApiKey(newKey)
      setLoading(false)
    }, 1000)
  }

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      alert("API Key copied to clipboard!")
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-600"
    if (score >= 60) return "from-yellow-500 to-orange-600"
    return "from-red-500 to-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Main Safety Score Card */}
      <Card className="border-2 border-[#4e6aff] shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#4e6aff]" />
                Insurance Safety Score
              </CardTitle>
              <CardDescription>Real-time orbital risk assessment for dynamic pricing</CardDescription>
            </div>
            <Badge className="text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Updated 60s ago
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Gauge Visualization */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${getScoreBgColor(safetyScore)} flex items-center justify-center shadow-2xl`}
              >
                <div className="w-40 h-40 rounded-full bg-white flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${getScoreColor(safetyScore)}`}>{safetyScore}</span>
                  <span className="text-sm text-gray-600 font-medium">out of 100</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2">
                {safetyScore >= 80 ? (
                  <CheckCircle className="w-12 h-12 text-green-600 fill-white" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-yellow-600 fill-white" />
                )}
              </div>
            </div>
          </div>

          {/* Score Interpretation */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 mb-1">Excellent</p>
              <p className="text-sm font-semibold text-green-700">80-100</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-gray-600 mb-1">Moderate</p>
              <p className="text-sm font-semibold text-yellow-700">60-79</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-gray-600 mb-1">High Risk</p>
              <p className="text-sm font-semibold text-red-700">0-59</p>
            </div>
          </div>

          {/* Risk Factor Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4e6aff]" />
              Risk Factor Breakdown
            </h4>
            {riskFactors.map((factor) => (
              <div key={factor.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {factor.name} <span className="text-gray-400">({factor.weight}% weight)</span>
                  </span>
                  <span className={`font-semibold ${getScoreColor(factor.score)}`}>{factor.score}/100</span>
                </div>
                <Progress value={factor.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Access Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Insurance Partner API Access</CardTitle>
          <CardDescription>Generate API keys to integrate real-time risk data into your systems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!apiKey ? (
            <Button
              onClick={generateAPIKey}
              disabled={loading}
              className="w-full bg-[#4e6aff] hover:bg-[#3d59ef]"
              size="lg"
            >
              {loading ? "Generating..." : "Generate Risk API Key"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600 font-medium">YOUR API KEY</p>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="font-mono text-sm text-gray-900 break-all">{apiKey}</p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-900">API Endpoint:</p>
                <code className="block p-3 bg-gray-900 text-green-400 rounded-lg">
                  GET https://api.orbitedge.com/v1/risk-score
                </code>
                <p className="text-xs text-gray-600">
                  Include your API key in the <code className="bg-gray-200 px-1 rounded">Authorization</code> header
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  API Features
                </h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Real-time risk scores updated every 60 seconds</li>
                  <li>• Historical risk data (30-day rolling window)</li>
                  <li>• 99.99% uptime SLA guarantee</li>
                  <li>• Rate limit: 10,000 requests/day (Enterprise)</li>
                </ul>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-600 text-center">
              Need higher rate limits? <a href="#" className="text-[#4e6aff] hover:underline font-semibold">Contact Sales</a> for custom Enterprise plans
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InsuranceRiskWidget
