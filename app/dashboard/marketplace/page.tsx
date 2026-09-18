"use client"

import { useState } from "react"
import UniversalHeader from "@/components/universal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Globe,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Radio,
  CheckCircle,
  Star,
  Filter,
  Search,
} from "lucide-react"

// Mock ground station data
const groundStations = [
  {
    id: "gs1",
    name: "Singapore Ground Station",
    location: "Singapore",
    coordinates: { lat: 1.3521, lng: 103.8198 },
    frequency: "S-Band (2.2 GHz)",
    antennaSize: "3.7m",
    availability: 95,
    costPerMinute: 15,
    rating: 4.9,
    provider: "Asia Teleport",
    features: ["Dual Polarization", "Real-time Telemetry", "24/7 Support"],
  },
  {
    id: "gs2",
    name: "Alaska Arctic Station",
    location: "Fairbanks, Alaska",
    coordinates: { lat: 64.8378, lng: -147.7164 },
    frequency: "X-Band (8.4 GHz)",
    antennaSize: "5.0m",
    availability: 88,
    costPerMinute: 25,
    rating: 4.7,
    provider: "Alaska Satellite",
    features: ["Polar Orbit Coverage", "High Bandwidth", "Backup Power"],
  },
  {
    id: "gs3",
    name: "ESA Kiruna Station",
    location: "Kiruna, Sweden",
    coordinates: { lat: 67.8558, lng: 20.2253 },
    frequency: "Ka-Band (26 GHz)",
    antennaSize: "7.3m",
    availability: 92,
    costPerMinute: 35,
    rating: 5.0,
    provider: "ESA Network",
    features: ["Deep Space Compatible", "Cryogenic Cooling", "ESA Certified"],
  },
  {
    id: "gs4",
    name: "Perth Ground Station",
    location: "Perth, Australia",
    coordinates: { lat: -31.9505, lng: 115.8605 },
    frequency: "S-Band (2.2 GHz)",
    antennaSize: "4.5m",
    availability: 90,
    costPerMinute: 18,
    rating: 4.8,
    provider: "Aussie Space Network",
    features: ["Southern Hemisphere", "Low Latency", "ISO Certified"],
  },
  {
    id: "gs5",
    name: "SpaceX Ground Station",
    location: "Hawthorne, California",
    coordinates: { lat: 33.9207, lng: -118.3282 },
    frequency: "Ku-Band (12 GHz)",
    antennaSize: "6.0m",
    availability: 97,
    costPerMinute: 40,
    rating: 4.9,
    provider: "SpaceX",
    features: ["Starlink Compatible", "AI Scheduling", "Priority Access"],
  },
]

export default function MarketplacePage() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [duration, setDuration] = useState(15) // minutes
  const [searchQuery, setSearchQuery] = useState("")

  const selectedStationData = groundStations.find((gs) => gs.id === selectedStation)
  const estimatedCost = selectedStationData ? selectedStationData.costPerMinute * duration : 0
  const commissionFee = estimatedCost * 0.05 // 5% commission

  const filteredStations = groundStations.filter(
    (gs) =>
      gs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gs.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBooking = () => {
    if (!selectedStation || !bookingDate || !bookingTime) {
      alert("Please select a station, date, and time")
      return
    }
    alert(
      `✅ Booking confirmed!\n\nStation: ${selectedStationData?.name}\nDate: ${bookingDate}\nTime: ${bookingTime}\nDuration: ${duration} min\nTotal Cost: $${(estimatedCost + commissionFee).toFixed(2)}`
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UniversalHeader variant="dark" />
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4e6aff] to-[#6d5bff] rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ground Station Marketplace</h1>
              <p className="text-gray-600">Book downlink slots from 500+ global antennas</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              328 Stations Online
            </Badge>
            <Badge className="bg-blue-100 text-blue-700">
              <Radio className="w-3 h-3 mr-1" />
              15 Active Passes
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Station List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by location or station name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Station Cards */}
            {filteredStations.map((station) => (
              <Card
                key={station.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedStation === station.id ? "border-2 border-[#4e6aff] shadow-xl" : "border"
                }`}
                onClick={() => setSelectedStation(station.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{station.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4" />
                        {station.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{station.rating}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {station.availability}% Available
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Frequency</p>
                      <p className="font-semibold text-sm">{station.frequency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Antenna</p>
                      <p className="font-semibold text-sm">{station.antennaSize}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Provider</p>
                      <p className="font-semibold text-sm">{station.provider}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Rate</p>
                      <p className="font-semibold text-sm text-[#4e6aff]">${station.costPerMinute}/min</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {station.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Book Downlink Slot</CardTitle>
                <CardDescription>
                  {selectedStation ? "Complete your booking details" : "Select a station to continue"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedStation && selectedStationData ? (
                  <>
                    <div className="p-4 bg-[#4e6aff]/5 rounded-lg border border-[#4e6aff]/20">
                      <p className="font-semibold text-gray-900 mb-1">{selectedStationData.name}</p>
                      <p className="text-sm text-gray-600">{selectedStationData.location}</p>
                    </div>

                    <div>
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="date"
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="time">Start Time (UTC)</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="time"
                          type="time"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="5"
                        max="60"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                      />
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Base Cost ({duration} min)</span>
                        <span className="font-semibold">${estimatedCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Platform Fee (5%)</span>
                        <span className="font-semibold">${commissionFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total</span>
                        <span className="text-[#4e6aff]">${(estimatedCost + commissionFee).toFixed(2)}</span>
                      </div>
                    </div>

                    <Button onClick={handleBooking} className="w-full bg-[#4e6aff] hover:bg-[#3d59ef]" size="lg">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Cancel up to 24h before for full refund
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a ground station from the list to start booking</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mt-8 bg-gradient-to-r from-[#4e6aff]/10 to-transparent border-[#4e6aff]/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#4e6aff] rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Enterprise Customers Get Commission-Free Access</h3>
                <p className="text-sm text-gray-600">
                  Upgrade to our Enterprise plan to eliminate the 5% platform fee and access exclusive priority
                  bookings, 24/7 support, and custom SLA agreements.
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
