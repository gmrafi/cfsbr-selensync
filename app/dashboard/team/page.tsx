"use client"

import { useState } from "react"
import UniversalHeader from "@/components/universal-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, UserPlus, Mail, Shield, Crown, Eye, Edit, Trash2 } from "lucide-react"

export default function TeamPage() {
  const [inviteEmail, setInviteEmail] = useState("")

  const teamMembers = [
    {
      id: "1",
      name: "Md Golam Mubasshir Rafi",
      email: "rafi@selensync.space",
      role: "Lead",
      title: "Product Architecture & Spatial Analytics",
      avatar: "MR",
      joinedDate: "Nov 2024",
      lastActive: "Active now",
      permissions: ["Full Access", "System Architecture", "Deployment"],
      status: "active",
    },
    {
      id: "2",
      name: "Afshara Tasneem Zoa",
      email: "zoa@selensync.space",
      role: "Co-Lead",
      title: "Strategy & Research",
      avatar: "AZ",
      joinedDate: "Jan 2026",
      lastActive: "Active now",
      permissions: ["Full Access", "Mission Planning", "Science Directives"],
      status: "active",
    },
  ]

  const rolePermissions = {
    Owner: ["Full system access", "Billing management", "User management", "Delete account"],
    Admin: ["Manage satellites", "View analytics", "Manage alerts", "Invite users"],
    Member: ["View satellites", "View reports", "Basic analytics"],
    Viewer: ["Read-only access", "View dashboards"],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <UniversalHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                <p className="text-gray-600">Manage team members and permissions</p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
              Enterprise Plan Feature
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600 mt-1">Team Members</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600 mt-1">Active</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-gray-600 mt-1">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">10</div>
                <div className="text-sm text-gray-600 mt-1">Max Seats</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invite New Member */}
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite Team Member
            </CardTitle>
            <CardDescription>Send an invitation to add someone to your team</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="w-48">
                <Label htmlFor="role">Role</Label>
                <select 
                  id="role"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Member</option>
                  <option>Admin</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team's access and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {member.avatar}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{member.name}</span>
                        {member.role === 'Owner' && (
                          <Crown className="w-4 h-4 text-yellow-600" />
                        )}
                        {member.status === 'pending' && (
                          <Badge variant="outline" className="text-xs">Pending</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Joined {member.joinedDate} • Last active {member.lastActive}
                      </div>
                    </div>
                  </div>

                  {/* Role & Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge 
                        variant={member.role === 'Owner' ? 'default' : 'outline'}
                        className={
                          member.role === 'Owner' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                          member.role === 'Admin' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {member.role}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {member.permissions.length} permissions
                      </div>
                    </div>

                    {member.role !== 'Owner' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>Understanding different access levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(rolePermissions).map(([role, perms]) => (
                <div key={role} className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{role}</span>
                  </div>
                  <ul className="space-y-2">
                    {perms.map((perm, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-600" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
