"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Satellite, 
  Shield, 
  Globe, 
  Zap, 
  Radio, 
  Lock, 
  TrendingUp, 
  Cloud, 
  Code, 
  AlertTriangle,
  Activity,
  DollarSign,
  Users
} from "lucide-react"
import Link from "next/link"
import UniversalHeader from "@/components/universal-header"
import CommandCenterMap from "@/components/dashboard/command-center-map"

export default function NewDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      <UniversalHeader variant="dark" />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                OrbitEdge Command Center
              </h1>
              <p className="text-gray-600">AI-Powered Space Traffic Management & Commerce Platform</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                All Systems Operational
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats - Bento Grid Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Satellites</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">127</p>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">+12 this month</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Satellite className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">3</p>
                  <p className="text-xs text-orange-600 mt-1 font-medium">2 high priority</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Safety Score</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">94/100</p>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">Excellent rating</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">API Calls</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">8.4K</p>
                  <p className="text-xs text-violet-600 mt-1 font-medium">1.6K remaining</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Code className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid with Map on Right Side */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Side - Main Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Modules - Bento Grid Layout */}
            <div className="grid grid-cols-1 gap-6">
              {/* Module A: AI Maneuver Autopilot */}
              <Link href="/dashboard">
                <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-gray-900 flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">AI Maneuver Autopilot</span>
                      </CardTitle>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 shadow-sm">ACTIVE</Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      Automated collision avoidance with cost optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 font-medium">Current Threat</span>
                          <Badge className="bg-red-100 text-red-700 border-red-200 shadow-sm">HIGH RISK</Badge>
                        </div>
                        <p className="text-gray-900 font-semibold mb-1">COSMOS 1408-154</p>
                        <p className="text-sm text-gray-600">Distance: 2.3 km • Velocity: 7.6 km/s</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 shadow-sm">
                          <p className="text-xs text-gray-600 mb-1 font-medium">Economy Mode</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">$100</p>
                          <p className="text-xs text-emerald-700 font-medium">85% risk reduction</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-3 shadow-sm">
                          <p className="text-xs text-gray-600 mb-1 font-medium">Emergency Mode</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">$250</p>
                          <p className="text-xs text-blue-700 font-medium">99% risk reduction</p>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/30">
                        View Maneuver Options →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Space Weather */}
              <Link href="/dashboard/weather">
                <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Cloud className="w-5 h-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Space Weather</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Real-time solar activity monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 font-medium">Solar Flare Activity</span>
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm">NORMAL</Badge>
                        </div>
                        <div className="h-16 flex items-end justify-between gap-1">
                          {[3, 5, 4, 7, 6, 8, 7, 5, 4, 3, 2, 4].map((height, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t shadow-sm" style={{ height: `${height * 8}%` }} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Kp-Index</span>
                          <span className="text-gray-900 font-semibold">2.7</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Geomagnetic Storm</span>
                          <span className="text-emerald-600 font-semibold">None</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">X-Ray Flux</span>
                          <span className="text-gray-900 font-semibold">C1.2</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Right Side - Live Satellite Map */}
          <div className="lg:col-span-1">
            <CommandCenterMap />
          </div>
        </div>

        {/* Secondary Modules Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module B: Ground Station Marketplace */}
          <Link href="/dashboard/marketplace">
            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Radio className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Ground Stations</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Book downlink slots worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm font-medium">Available Stations</span>
                    <span className="text-gray-900 font-bold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm font-medium">Next Booking</span>
                    <span className="text-gray-900 font-semibold text-sm">14:30 UTC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm font-medium">Revenue MTD</span>
                    <span className="text-emerald-600 font-bold">$2,450</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mt-2 shadow-lg shadow-emerald-500/30">
                    Browse Marketplace →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Module D: Insurance & Liability */}
          <Link href="/dashboard/analytics">
            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Insurance Score</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Dynamic risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="relative h-32 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border-8 border-violet-200"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border-8 border-transparent border-t-violet-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                    </div>
                    <div className="relative z-10 text-center">
                      <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">94</p>
                      <p className="text-xs text-gray-600 font-medium">Safety Score</p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/30">
                    Generate API Key →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Module: Blockchain Audit */}
          <Link href="/dashboard/security">
            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Blockchain Ledger</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Immutable audit trails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm font-medium">Total Blocks</span>
                    <span className="text-gray-900 font-bold">145,892</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm font-medium">Last Block</span>
                    <span className="text-gray-900 font-semibold text-sm">2m ago</span>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-2 border border-teal-200">
                    <code className="text-xs text-teal-700 font-mono font-medium">
                      3a7bd3e2360a3d29...
                    </code>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white mt-2 shadow-lg shadow-teal-500/30">
                    View Audit Log →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Classic Dashboard Access */}
        <div className="mt-8">
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">Classic 3D Globe View</h3>
                    <p className="text-sm text-gray-600">Real-time tracking of 64,000+ space objects</p>
                  </div>
                </div>
                <Link href="/dashboard/map">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                    Launch Globe View →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
