"use client"

import { useState } from "react"
import UniversalHeader from "@/components/universal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, Key, Copy, CheckCircle, TrendingUp, Zap, Lock } from "lucide-react"

export default function DeveloperPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // Mock API keys
  const apiKeys = [
    {
      id: "key1",
      name: "Production API Key",
      key: "orbit_live_k8j9h3g2f1d4s5a6q7w8e9r0t1y2u3i4",
      tier: "Enterprise",
      quota: "Unlimited",
      usage: "8,432 / ∞",
      created: "2025-11-01",
      status: "active",
    },
    {
      id: "key2",
      name: "Staging Environment",
      key: "orbit_test_x5z4c3v2b1n6m7k8j9h0g1f2d3s4a5q6",
      tier: "Startup",
      quota: "10,000/month",
      usage: "3,245 / 10,000",
      created: "2025-10-15",
      status: "active",
    },
    {
      id: "key3",
      name: "Development Key",
      key: "orbit_dev_p9o8i7u6y5t4r3e2w1q0a1s2d3f4g5h6",
      tier: "Academic",
      quota: "1,000/month",
      usage: "892 / 1,000",
      created: "2025-09-20",
      status: "active",
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Developer Portal</h1>
                <p className="text-gray-600">API key management, usage tracking, and developer resources</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-purple-100 text-purple-700">
                <Zap className="w-3 h-3 mr-1" />
                Enterprise Tier
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                12,569 API Calls This Month
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Services Operational
              </Badge>
            </div>
          </div>

          {/* Generate New Key */}
          <Card className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle>Generate New API Key</CardTitle>
              <CardDescription>Create a new API key for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label>Key Name</Label>
                  <Input placeholder="My App Key" className="bg-white" />
                </div>
                <div>
                  <Label>Tier</Label>
                  <select className="w-full h-10 px-3 rounded-md border bg-white">
                    <option>Academic (1,000/month)</option>
                    <option>Startup (10,000/month)</option>
                    <option>Enterprise (Unlimited)</option>
                  </select>
                </div>
                <div>
                  <Label>Permissions</Label>
                  <select className="w-full h-10 px-3 rounded-md border bg-white">
                    <option>Read Only</option>
                    <option>Read + Write</option>
                    <option>Full Access</option>
                  </select>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Key className="w-4 h-4 mr-2" />
                Generate API Key
              </Button>
            </CardContent>
          </Card>

          {/* Existing API Keys */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-gray-900">Your API Keys</h2>
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                      <CardDescription>Created {apiKey.created} • {apiKey.tier} Tier</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {apiKey.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <Label className="text-sm text-gray-600">API Key</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={apiKey.key} 
                          readOnly 
                          className="font-mono text-sm bg-gray-50"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        >
                          {copied === apiKey.id ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Usage This Month</div>
                        <div className="text-lg font-bold text-gray-900">{apiKey.usage}</div>
                        <div className="text-xs text-gray-500">Quota: {apiKey.quota}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Rate Limit</div>
                        <div className="text-lg font-bold text-gray-900">
                          {apiKey.tier === "Enterprise" ? "No Limit" : "100 req/min"}
                        </div>
                        <div className="text-xs text-gray-500">Per minute</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Last Used</div>
                        <div className="text-lg font-bold text-gray-900">2 hours ago</div>
                        <div className="text-xs text-gray-500">Recent activity</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Regenerate</Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">Revoke</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Code Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Example API calls to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">cURL Example</Label>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-2 overflow-x-auto text-sm">
{`curl -X GET "https://api.orbitedge.space/v1/satellites" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>
                <div>
                  <Label className="text-sm font-semibold">JavaScript Example</Label>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-2 overflow-x-auto text-sm">
{`const response = await fetch('https://api.orbitedge.space/v1/satellites', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`}
                  </pre>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Python Example</Label>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-2 overflow-x-auto text-sm">
{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}
response = requests.get('https://api.orbitedge.space/v1/satellites', headers=headers)
data = response.json()`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
