"use client"

import { useState } from "react"
import UniversalHeader from "@/components/universal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Shield, CheckCircle, Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AuditLog {
  id: string
  timestamp: string
  satelliteId: string
  satelliteName: string
  action: string
  operator: string
  hash: string
  blockNumber: number
  verified: boolean
}

export default function SecurityPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock blockchain audit logs with SHA-256 hashes
  const auditLogs: AuditLog[] = [
    {
      id: "log1",
      timestamp: "2025-12-07 14:32:15 UTC",
      satelliteId: "SAT-2024-001",
      satelliteName: "OrbitSat Alpha",
      action: "Maneuver Initiated (Prograde +2.5 m/s)",
      operator: "Mission Control - Rafi",
      hash: "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
      blockNumber: 145892,
      verified: true,
    },
    {
      id: "log2",
      timestamp: "2025-12-07 13:15:42 UTC",
      satelliteId: "SAT-2024-001",
      satelliteName: "OrbitSat Alpha",
      action: "Collision Alert Acknowledged",
      operator: "AI System",
      hash: "8f14e45fceea167a5a36dedd4bea2543c93c4d8f4f6b28c25b41a2ed2c5c5e5d",
      blockNumber: 145887,
      verified: true,
    },
    {
      id: "log3",
      timestamp: "2025-12-07 12:00:00 UTC",
      satelliteId: "SAT-2024-002",
      satelliteName: "CommSat Beta",
      action: "Ground Station Downlink (Singapore)",
      operator: "Asia Teleport",
      hash: "c7f1b93a3d13a7bc1c52e8b7a3d8f5e6c9d2a4b5c6e7f8g9h0i1j2k3l4m5n6o7p",
      blockNumber: 145880,
      verified: true,
    },
    {
      id: "log4",
      timestamp: "2025-12-07 10:45:30 UTC",
      satelliteId: "SAT-2024-003",
      satelliteName: "ScienceSat Gamma",
      action: "Telemetry Data Uploaded",
      operator: "Data Systems - Punno",
      hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      blockNumber: 145875,
      verified: true,
    },
    {
      id: "log5",
      timestamp: "2025-12-07 09:20:18 UTC",
      satelliteId: "SAT-2024-001",
      satelliteName: "OrbitSat Alpha",
      action: "Compliance Report Generated (ISO 24113)",
      operator: "Compliance System",
      hash: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
      blockNumber: 145870,
      verified: true,
    },
    {
      id: "log6",
      timestamp: "2025-12-07 08:00:00 UTC",
      satelliteId: "SAT-2024-004",
      satelliteName: "RemoteSat Delta",
      action: "Orbit Insertion Confirmed",
      operator: "Launch Control",
      hash: "7c9e6679f852e14a9b0a9e6f5b3d9e8c7a2f4b6d8e0c1a3e5f7b9d1c3e5a7b9d1",
      blockNumber: 145865,
      verified: true,
    },
  ]

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.satelliteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.satelliteId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "Satellite ID", "Satellite Name", "Action", "Operator", "Hash", "Block Number", "Verified"],
      ...auditLogs.map((log) => [
        log.timestamp,
        log.satelliteId,
        log.satelliteName,
        log.action,
        log.operator,
        log.hash,
        log.blockNumber,
        log.verified ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orbitedge-audit-logs-${new Date().toISOString()}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UniversalHeader variant="dark" />
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Security & Audit</h1>
              <p className="text-gray-600">Blockchain-backed immutable audit trails for legal compliance</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Blocks Verified
            </Badge>
            <Badge className="bg-blue-100 text-blue-700">
              <Shield className="w-3 h-3 mr-1" />
              SHA-256 Encrypted
            </Badge>
            <Badge className="bg-purple-100 text-purple-700">
              {auditLogs.length} Logs in Chain
            </Badge>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-transparent border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Blockchain Liability Ledger</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Every satellite operation is recorded on an immutable blockchain ledger with SHA-256 cryptographic
                  hashing. These logs serve as legal proof of actions taken, providing transparency and accountability
                  for regulatory compliance and insurance claims.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Tamper-proof</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Court-admissible</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Real-time verification</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Audit Log History</CardTitle>
                <CardDescription>Cryptographically signed records of all satellite operations</CardDescription>
              </div>
              <Button onClick={exportLogs} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by satellite, action, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Satellite ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Action</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Operator</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Block Hash (SHA-256)
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Block #</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{log.satelliteId}</p>
                          <p className="text-xs text-gray-500">{log.satelliteName}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 max-w-xs">{log.action}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{log.operator}</td>
                      <td className="py-3 px-4">
                        <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {log.hash.substring(0, 16)}...
                        </code>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">#{log.blockNumber}</td>
                      <td className="py-3 px-4">
                        {log.verified ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No audit logs found matching your search</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Details Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Hash Algorithm</h4>
                <p className="text-sm text-gray-600 mb-2">
                  SHA-256 (Secure Hash Algorithm 256-bit) ensures cryptographic integrity of each log entry
                </p>
                <code className="block p-3 bg-gray-900 text-green-400 rounded-lg text-xs">
                  hash = SHA256(timestamp + satelliteId + action + operator + prevHash)
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Blockchain Network</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Private consortium blockchain with nodes operated by space agencies and regulatory bodies
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span className="font-semibold">OrbitEdge Chain</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consensus:</span>
                    <span className="font-semibold">Proof of Authority</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Block Time:</span>
                    <span className="font-semibold">5 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
