"use client"

import { useState } from "react"
import UniversalHeader from "@/components/universal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, Mail, MessageSquare, AlertTriangle, Smartphone, CheckCircle } from "lucide-react"

export default function NotificationsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [smsNotifs, setSmsNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <UniversalHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
              <p className="text-gray-600">Manage how you receive alerts and updates</p>
            </div>
          </div>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Settings saved successfully!</span>
          </div>
        )}

        <div className="grid gap-6">
          {/* Alert Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Collision Alert Channels
              </CardTitle>
              <CardDescription>
                Choose how you want to receive critical collision warnings (48-72 hours in advance)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email Notifications</div>
                    <div className="text-sm text-gray-600 mt-1">Receive collision alerts via email</div>
                    <div className="mt-2">
                      <Input 
                        placeholder="your-email@example.com" 
                        defaultValue="rafi@orbitedge.biz"
                        className="w-72"
                      />
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={emailNotifs} 
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      SMS Notifications
                      <Badge variant="outline" className="text-xs">Professional+</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Instant SMS alerts for critical events</div>
                    <div className="mt-2">
                      <Input 
                        placeholder="+880 1XXX-XXXXXX" 
                        defaultValue="+880 1712-345678"
                        className="w-72"
                      />
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={smsNotifs} 
                    onChange={(e) => setSmsNotifs(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      Push Notifications
                      <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Mobile app notifications (iOS/Android)</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer opacity-50">
                  <input 
                    type="checkbox" 
                    checked={pushNotifs} 
                    onChange={(e) => setPushNotifs(e.target.checked)}
                    disabled
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Alert Types */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Types & Thresholds</CardTitle>
              <CardDescription>Configure when you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="font-semibold text-red-900">Critical Risk</span>
                  </div>
                  <p className="text-sm text-red-700">Collision probability &gt; 1:10,000</p>
                  <div className="mt-2 flex gap-2">
                    <Badge className="bg-red-600 text-white">Email</Badge>
                    <Badge className="bg-red-600 text-white">SMS</Badge>
                  </div>
                </div>

                <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                    <span className="font-semibold text-orange-900">High Risk</span>
                  </div>
                  <p className="text-sm text-orange-700">Collision probability &gt; 1:100,000</p>
                  <div className="mt-2 flex gap-2">
                    <Badge className="bg-orange-600 text-white">Email</Badge>
                  </div>
                </div>

                <div className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                    <span className="font-semibold text-yellow-900">Medium Risk</span>
                  </div>
                  <p className="text-sm text-yellow-700">Collision probability &gt; 1:1,000,000</p>
                  <div className="mt-2 flex gap-2">
                    <Badge className="bg-yellow-600 text-white">Dashboard Only</Badge>
                  </div>
                </div>

                <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="font-semibold text-green-900">Low Risk</span>
                  </div>
                  <p className="text-sm text-green-700">Collision probability &lt; 1:1,000,000</p>
                  <div className="mt-2 flex gap-2">
                    <Badge className="bg-green-600 text-white">No Alert</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Reset to Defaults</Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Save Notification Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
