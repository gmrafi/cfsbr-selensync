"use client"

import { useState } from "react"
import UniversalHeader from "@/components/universal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Rocket, Calendar, CloudSun, Radio, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"

export default function LaunchOptimizerPage() {
  const [selectedDate, setSelectedDate] = useState("2025-12-15")

  // Mock launch window analysis
  const launchWindows = [
    {
      date: "2025-12-15",
      time: "06:30 UTC",
      risk: "low",
      trafficDensity: 12,
      weatherScore: 95,
      recommendation: "Optimal",
      kpIndex: 2.1,
      solarFlux: "Low",
      debrisEvents: 0,
    },
    {
      date: "2025-12-15",
      time: "14:45 UTC",
      risk: "medium",
      trafficDensity: 28,
      weatherScore: 78,
      recommendation: "Acceptable",
      kpIndex: 3.5,
      solarFlux: "Medium",
      debrisEvents: 1,
    },
    {
      date: "2025-12-16",
      time: "08:15 UTC",
      risk: "high",
      trafficDensity: 45,
      weatherScore: 62,
      recommendation: "Not Recommended",
      kpIndex: 5.2,
      solarFlux: "High",
      debrisEvents: 3,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UniversalHeader variant="dark" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Launch Window Optimizer</h1>
                <p className="text-gray-600">AI-powered launch timing based on space weather & orbital traffic</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-700">
                <CloudSun className="w-3 h-3 mr-1" />
                Space Weather: Stable
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                <Radio className="w-3 h-3 mr-1" />
                Low Traffic Density
              </Badge>
              <Badge className="bg-purple-100 text-purple-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                Next Optimal: 6h 30m
              </Badge>
            </div>
          </div>

          {/* Launch Window Cards */}
          <div className="grid gap-6 mb-8">
            {launchWindows.map((window, idx) => {
              const riskColor = window.risk === "low" ? "green" : window.risk === "medium" ? "yellow" : "red"
              const riskBg = window.risk === "low" ? "bg-green-50" : window.risk === "medium" ? "bg-yellow-50" : "bg-red-50"
              const riskText = window.risk === "low" ? "text-green-700" : window.risk === "medium" ? "text-yellow-700" : "text-red-700"
              const riskBorder = window.risk === "low" ? "border-green-200" : window.risk === "medium" ? "border-yellow-200" : "border-red-200"

              return (
                <Card key={idx} className={`border-2 ${riskBorder} ${riskBg}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className={`w-5 h-5 ${riskText}`} />
                        <div>
                          <CardTitle className="text-xl">{window.date} at {window.time}</CardTitle>
                          <CardDescription>
                            Traffic Density: {window.trafficDensity} objects/hour • Weather Score: {window.weatherScore}%
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={`${riskBg} ${riskText} border-${riskColor}-300`}>
                        {window.risk === "low" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {window.risk === "high" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {window.recommendation}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-white/50 p-3 rounded-lg border">
                        <div className="text-sm text-gray-600">Kp-Index</div>
                        <div className="text-lg font-bold text-gray-900">{window.kpIndex}</div>
                        <div className="text-xs text-gray-500">Geomagnetic activity</div>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg border">
                        <div className="text-sm text-gray-600">Solar Flux</div>
                        <div className="text-lg font-bold text-gray-900">{window.solarFlux}</div>
                        <div className="text-xs text-gray-500">Radio interference</div>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg border">
                        <div className="text-sm text-gray-600">Debris Events</div>
                        <div className="text-lg font-bold text-gray-900">{window.debrisEvents}</div>
                        <div className="text-xs text-gray-500">Recent collisions</div>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg border">
                        <div className="text-sm text-gray-600">Weather Score</div>
                        <div className="text-lg font-bold text-gray-900">{window.weatherScore}%</div>
                        <div className="text-xs text-gray-500">Overall safety</div>
                      </div>
                    </div>
                    {window.risk === "low" && (
                      <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                        Select This Window
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Analysis Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle>AI Recommendation Summary</CardTitle>
              <CardDescription>Based on 72-hour forecast analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-gray-700">
                    <strong>Best Window:</strong> December 15, 2025 at 06:30 UTC - Minimal traffic (12 objects/hour), stable Kp-Index (2.1)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <p className="text-gray-700">
                    <strong>Caution:</strong> Avoid December 16 afternoon slots - High orbital congestion near ISS orbit
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CloudSun className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-gray-700">
                    <strong>Weather Forecast:</strong> No major solar flares expected in next 48 hours. Ionospheric conditions favorable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
