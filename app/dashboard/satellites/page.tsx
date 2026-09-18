import UniversalHeader from "@/components/universal-header"
import RealTimeTracking from "@/components/dashboard/nasa/real-time-tracking"

export default async function SatellitesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UniversalHeader variant="dark" />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Satellite Monitoring</h1>
              <p className="text-gray-600">
                Real-time LEO satellite tracking powered by NASA, NOAA, and ESA live data feeds
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data Active</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>64,000+ Objects Tracked</div>
                <div>Real-time Updates</div>
              </div>
            </div>
          </div>
        </div>

        <RealTimeTracking />
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Data Sources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• NASA Spot the Station</li>
                <li>• NASA Worldview</li>
                <li>• NOAA Earth Real-Time</li>
                <li>• ESA Sentinel Hub</li>
                <li>• Celestrak TLE Data</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Live Feeds</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• ISS Live Position</li>
                <li>• Satellite Imagery</li>
                <li>• Weather Systems</li>
                <li>• Space Weather</li>
                <li>• Orbital Predictions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Coverage</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Global LEO Tracking</li>
                <li>• Real-time Updates</li>
                <li>• 24/7 Monitoring</li>
                <li>• Multi-agency Data</li>
                <li>• Historical Analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">OrbitBiZ</h3>
              <p className="text-sm text-gray-600 mb-4">
                Pioneering Sustainable LEO Commerce through advanced satellite monitoring and business intelligence.
              </p>
              <p className="text-xs text-gray-500">AIBA SpaceWeb (Sylhet) - NASA Space Apps Challenge 2025</p>
            </div>
          </div>
          <div className="border-t pt-6 mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>© 2025 OrbitBiZ. All rights reserved.</p>
              <p>Powered by NASA Open Data & International Space Agencies</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
