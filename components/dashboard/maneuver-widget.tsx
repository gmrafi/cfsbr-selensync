"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Zap, TrendingDown, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ManeuverWidget() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Collision Alert
            </CardTitle>
            <Badge className="bg-red-100 text-red-700 border-red-200">
              HIGH RISK
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white/80 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">COSMOS 1408-154</p>
                  <p className="text-xs text-gray-600">Debris approaching at 7.6 km/s</p>
                </div>
                <Badge variant="outline" className="text-red-600 border-red-200">
                  87% probability
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Closest Approach</p>
                  <p className="font-semibold text-gray-900">2.3 km</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Time to Impact</p>
                  <p className="font-semibold text-gray-900">4h 12m</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">AI Recommended Maneuvers:</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">Option 1: Prograde Burn</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">OPTIMAL</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600">Fuel Cost</p>
                    <p className="font-semibold text-gray-900">$250</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Risk Reduction</p>
                    <p className="font-semibold text-green-600">99%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Delta-V</p>
                    <p className="font-semibold text-gray-900">2.5 m/s</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">Option 2: Radial Out</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">BUDGET</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600">Fuel Cost</p>
                    <p className="font-semibold text-gray-900">$100</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Risk Reduction</p>
                    <p className="font-semibold text-blue-600">85%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Delta-V</p>
                    <p className="font-semibold text-gray-900">1.2 m/s</p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowDetails(true)}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Execute Maneuver
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Maneuver Execution Confirmed</DialogTitle>
            <DialogDescription>
              Prograde burn maneuver has been scheduled for execution. Ground station will uplink commands in 15 minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Collision Risk Reduced: 87% → 0.8%</p>
                <p className="text-sm text-gray-600">Estimated fuel consumption: $250 USD</p>
              </div>
            </div>
            <Button onClick={() => setShowDetails(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
