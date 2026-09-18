"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export default function ComplianceReports() {
  const [complianceData, setComplianceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        const response = await fetch("/api/risk-analysis?satelliteId=25544")
        const result = await response.json()
        if (result.success) {
          setComplianceData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch compliance data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComplianceData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return CheckCircle
      case "warning":
        return Clock
      case "non-compliant":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "non-compliant":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const mockReports = [
    {
      id: "RPT-001",
      title: "Monthly ISO 24113 Compliance Report",
      date: "2025-01-15",
      status: "completed",
      type: "Compliance",
    },
    {
      id: "RPT-002",
      title: "Debris Collision Risk Assessment",
      date: "2025-01-14",
      status: "completed",
      type: "Risk Analysis",
    },
    {
      id: "RPT-003",
      title: "Quarterly Safety Review",
      date: "2025-01-10",
      status: "pending",
      type: "Safety",
    },
  ]

  const complianceChecks = complianceData?.complianceStatus || [
    {
      standard: "ISO 24113",
      requirement: "Debris mitigation during operations",
      status: "compliant",
      score: 92,
      lastChecked: "2025-01-15T10:30:00Z",
    },
    {
      standard: "ISO 24113",
      requirement: "Post-mission disposal planning",
      status: "warning",
      score: 75,
      lastChecked: "2025-01-15T10:30:00Z",
    },
    {
      standard: "ISO 24113",
      requirement: "Collision avoidance capabilities",
      status: "compliant",
      score: 88,
      lastChecked: "2025-01-15T10:30:00Z",
    },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* ISO 24113 Compliance Status */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">ISO 24113 Compliance Status</CardTitle>
              <p className="text-sm text-gray-600">Space debris mitigation requirements</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {complianceChecks.map((check, index) => {
            const StatusIcon = getStatusIcon(check.status)
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{check.requirement}</span>
                  </div>
                  <Badge className={getStatusColor(check.status)}>{check.status.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Compliance Score: {check.score}%</span>
                  <span>Last Checked: {new Date(check.lastChecked).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      check.score > 80 ? "bg-green-500" : check.score > 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${check.score}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Compliance Reports */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Compliance Reports</CardTitle>
                <p className="text-sm text-gray-600">Generated compliance documentation</p>
              </div>
            </div>
            <Button size="sm" className="bg-[#4e6aff] hover:bg-[#3d54e6]">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockReports.map((report) => (
            <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{report.title}</h4>
                <Badge
                  className={
                    report.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {report.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(report.date).toLocaleDateString()}</span>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{report.type}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          ))}

          {/* Generate New Report */}
          <div className="pt-4 border-t">
            <Button className="w-full bg-[#4e6aff] hover:bg-[#3d54e6]">
              <FileText className="w-4 h-4 mr-2" />
              Generate New Compliance Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
