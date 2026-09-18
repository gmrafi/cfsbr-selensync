"use client"

import { useState } from "react"
import UniversalHeader from "@/components/universal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Radio, MapPin, Clock, DollarSign, CheckCircle, Calendar } from "lucide-react"

export default function GroundStationsPage() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null)

  const groundStations = [
    {
      id: "gs1",
      name: "SPARRSO Ground Station",
      location: "Dhaka, Bangladesh",
      lat: 23.8103,
      lng: 90.4125,
      frequency: "S-Band, X-Band",
      availability: "Available",
      pricePerPass: "$45",
      nextAvailable: "Today, 14:30 UTC",
      features: ["Real-time telemetry", "Command uplink", "Data downlink"],
      status: "active",
    },
    {
      id: "gs2",
      name: "BUET Research Station",
      location: "Sylhet, Bangladesh",
      lat: 24.8949,
      lng: 91.8687,
      frequency: "UHF, VHF",
      availability: "Available",
      pricePerPass: "$25",
      nextAvailable: "Tomorrow, 08:15 UTC",
      features: ["Educational access", "Research priority", "Low-cost"],
      status: "active",
    },
    {
      id: "gs3",
      name: "Asia-Pacific Hub",
      location: "Singapore",
      lat: 1.3521,
      lng: 103.8198,
      frequency: "S-Band, X-Band, Ka-Band",
      availability: "Limited",
      pricePerPass: "$120",
      nextAvailable: "Dec 18, 11:00 UTC",
      features: ["High bandwidth", "24/7 support", "Premium SLA"],
      status: "limited",
    },
    {
      id: "gs4",
      name: "Indian Ocean Station",
      location: "Maldives",
      lat: 4.1755,
      lng: 73.5093,
      frequency: "S-Band",
      availability: "Maintenance",
      pricePerPass: "$80",
      nextAvailable: "Dec 20, TBD",
      features: ["Strategic location", "Equatorial coverage"],
      status: "maintenance",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <UniversalHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ground Station Booking</h1>
              <p className="text-gray-600">Reserve ground station passes for your satellites</p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">Professional Plan Feature</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600 mt-1">Available Stations</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600 mt-1">Booked Passes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">$340</div>
                <div className="text-sm text-gray-600 mt-1">Total Spent</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">2h 15m</div>
                <div className="text-sm text-gray-600 mt-1">Next Pass</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ground Stations Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {groundStations.map((station) => (
            <Card 
              key={station.id}
              className={`transition-all cursor-pointer ${
                selectedStation === station.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedStation(station.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{station.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {station.location}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={
                      station.status === 'active' ? 'default' : 
                      station.status === 'limited' ? 'secondary' : 
                      'outline'
                    }
                    className={
                      station.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' :
                      station.status === 'limited' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {station.availability}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Technical Specs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Radio className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{station.frequency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">{station.pricePerPass}/pass</span>
                  </div>
                </div>

                {/* Next Available */}
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">Next Available Pass</div>
                    <div className="text-xs text-blue-700">{station.nextAvailable}</div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Features:</div>
                  <div className="flex flex-wrap gap-2">
                    {station.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1"
                    variant={selectedStation === station.id ? "default" : "outline"}
                    disabled={station.status === 'maintenance'}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book This Station
                  </Button>
                  <Button variant="outline">
                    View Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Summary */}
        {selectedStation && (
          <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Booking Summary</CardTitle>
              <CardDescription>Review your ground station reservation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Selected Station</div>
                  <div className="font-semibold text-gray-900">
                    {groundStations.find(s => s.id === selectedStation)?.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Pass Duration</div>
                  <div className="font-semibold text-gray-900">8-12 minutes (typical)</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Estimated Cost</div>
                  <div className="font-semibold text-gray-900">
                    {groundStations.find(s => s.id === selectedStation)?.pricePerPass}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedStation(null)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="p-3 bg-white rounded-lg">
                <Radio className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-2">How Ground Station Booking Works</div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Select a ground station based on your satellite's orbit and location</li>
                  <li>• Book passes during optimal visibility windows</li>
                  <li>• Receive telemetry data and send commands during the pass</li>
                  <li>• All passes are automatically scheduled and confirmed via email</li>
                  <li>• Professional plan includes 5 free passes/month, additional passes at listed prices</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
