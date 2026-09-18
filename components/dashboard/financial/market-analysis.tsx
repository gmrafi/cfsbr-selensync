import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

export default function MarketAnalysis() {
  const marketSegments = [
    {
      segment: "Commercial Space Stations",
      size: "$89B",
      growth: "+24%",
      examples: "Axiom, Starlab, Orbital Reef",
      opportunity: "High",
    },
    {
      segment: "Satellite Operators",
      size: "$156B",
      growth: "+18%",
      examples: "SpaceX, OneWeb, Amazon Kuiper",
      opportunity: "High",
    },
    {
      segment: "Telecom & Internet",
      size: "$127B",
      growth: "+15%",
      examples: "Starlink, Viasat, Hughes",
      opportunity: "Medium",
    },
    {
      segment: "Earth Observation",
      size: "$75B",
      growth: "+22%",
      examples: "Planet Labs, Maxar, BlackSky",
      opportunity: "Medium",
    },
  ]

  const competitiveAnalysis = [
    {
      company: "OrbitEdge Global",
      price: "$50",
      features: "AI-powered, Real-time, Compliance",
      advantage: "Cost-effective",
    },
    { company: "Traditional Providers", price: "$200+", features: "Manual reports, Delayed", advantage: "Established" },
    { company: "In-house Solutions", price: "$500+", features: "Custom, Complex", advantage: "Control" },
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Market Analysis</CardTitle>
            <p className="text-sm text-gray-600">$447B global space economy opportunity</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#4e6aff]/5 rounded-lg">
            <div className="text-2xl font-bold text-[#4e6aff]">$447B</div>
            <div className="text-sm text-gray-600">Total Market Size</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">+19%</div>
            <div className="text-sm text-gray-600">Annual Growth</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">$2.8B</div>
            <div className="text-sm text-gray-600">Addressable Market</div>
          </div>
        </div>

        {/* Market Segments */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Target Market Segments</h4>
          <div className="space-y-3">
            {marketSegments.map((segment, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{segment.segment}</h5>
                  <Badge
                    className={
                      segment.opportunity === "High" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {segment.opportunity} Opportunity
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Market Size:</span>
                    <div className="font-semibold">{segment.size}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Growth Rate:</span>
                    <div className="font-semibold text-green-600">{segment.growth}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Key Players:</span>
                    <div className="font-semibold">{segment.examples}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Analysis */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Competitive Positioning</h4>
          <div className="space-y-3">
            {competitiveAnalysis.map((competitor, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  competitor.company === "OrbitEdge Global" ? "border-[#4e6aff] bg-[#4e6aff]/5" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{competitor.company}</h5>
                  <div className="text-lg font-bold text-[#4e6aff]">{competitor.price}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Features:</span>
                    <div className="font-medium">{competitor.features}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Key Advantage:</span>
                    <div className="font-medium">{competitor.advantage}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
