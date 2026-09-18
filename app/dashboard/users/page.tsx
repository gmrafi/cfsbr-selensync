"use client"

import { useState } from "react"
import UniversalHeader from "@/components/universal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Shield, Eye, Edit, Trash2, Plus, CheckCircle, AlertCircle } from "lucide-react"

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock user data with RBAC roles
  const users = [
    {
      id: "user1",
      name: "Md Golam Mubasshir Rafi",
      email: "rafi@orbitedge.space",
      role: "Admin",
      status: "active",
      satellites: ["SAT-2024-001", "SAT-2024-005", "SAT-2024-012"],
      permissions: ["Full Access", "User Management", "API Keys", "Billing"],
      lastActive: "2 minutes ago",
    },
    {
      id: "user2",
      name: "Mashrura Meshkat Punno",
      email: "punno@orbitedge.space",
      role: "Operator",
      status: "active",
      satellites: ["SAT-2024-003", "SAT-2024-007"],
      permissions: ["View Satellites", "Execute Maneuvers", "Download Reports"],
      lastActive: "15 minutes ago",
    },
    {
      id: "user3",
      name: "Al Razi",
      email: "razi@orbitedge.space",
      role: "Viewer",
      status: "active",
      satellites: ["SAT-2024-001"],
      permissions: ["View Only"],
      lastActive: "1 hour ago",
    },
    {
      id: "user4",
      name: "Rukaiya Binte Amin",
      email: "rukaiya@orbitedge.space",
      role: "Operator",
      status: "inactive",
      satellites: ["SAT-2024-009"],
      permissions: ["View Satellites", "Download Reports"],
      lastActive: "2 days ago",
    },
  ]

  const roleColors: Record<string, { bg: string; text: string }> = {
    Admin: { bg: "bg-red-100", text: "text-red-700" },
    Operator: { bg: "bg-blue-100", text: "text-blue-700" },
    Viewer: { bg: "bg-gray-100", text: "text-gray-700" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UniversalHeader variant="dark" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Role-Based Access Control (RBAC) for team members</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  4 Active Users
                </Badge>
                <Badge className="bg-gray-100 text-gray-700">
                  <Shield className="w-3 h-3 mr-1" />
                  RBAC Enabled
                </Badge>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </div>
          </div>

          {/* Search & Filter */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Search by name, email, or satellite ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <select className="px-4 py-2 border rounded-md bg-white">
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Operator</option>
                  <option>Viewer</option>
                </select>
                <select className="px-4 py-2 border rounded-md bg-white">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions Legend */}
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle>Role Permissions Overview</CardTitle>
              <CardDescription>Understanding access levels in OrbitEdge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-red-700">Admin</h3>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Full system access</li>
                    <li>✓ User management</li>
                    <li>✓ API key generation</li>
                    <li>✓ Billing & settings</li>
                    <li>✓ Execute maneuvers</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Edit className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-700">Operator</h3>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ View assigned satellites</li>
                    <li>✓ Execute maneuvers</li>
                    <li>✓ Download reports</li>
                    <li>✗ User management</li>
                    <li>✗ Billing access</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <h3 className="font-bold text-gray-700">Viewer</h3>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ View only access</li>
                    <li>✓ Read reports</li>
                    <li>✗ Execute actions</li>
                    <li>✗ Download data</li>
                    <li>✗ Edit settings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
            {users.map((user) => {
              const roleStyle = roleColors[user.role]
              return (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <CardDescription>{user.email}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${roleStyle.bg} ${roleStyle.text}`}>
                          {user.role === "Admin" && <Shield className="w-3 h-3 mr-1" />}
                          {user.role === "Operator" && <Edit className="w-3 h-3 mr-1" />}
                          {user.role === "Viewer" && <Eye className="w-3 h-3 mr-1" />}
                          {user.role}
                        </Badge>
                        <Badge className={user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {user.status === "active" ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Assigned Satellites</div>
                        <div className="text-lg font-bold text-gray-900">{user.satellites.length}</div>
                        <div className="text-xs text-gray-500">{user.satellites.join(", ")}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Permissions</div>
                        <div className="text-lg font-bold text-gray-900">{user.permissions.length}</div>
                        <div className="text-xs text-gray-500">{user.permissions[0]}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Last Active</div>
                        <div className="text-lg font-bold text-gray-900">{user.lastActive}</div>
                        <div className="text-xs text-gray-500">Recent activity</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {user.permissions.map((perm, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit Permissions
                      </Button>
                      <Button size="sm" variant="outline">
                        Change Role
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove User
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
