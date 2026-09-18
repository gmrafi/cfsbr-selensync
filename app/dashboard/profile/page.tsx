import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, Shield, User } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"

export default async function ProfilePage() {
  const user = {
    id: "user_mock123",
    firstName: "Guest",
    lastName: "User",
    username: "guestuser",
    imageUrl: "",
    createdAt: Date.now(),
    emailAddresses: [
      { emailAddress: "guest@example.com", verification: { status: "unverified" } }
    ]
  };

  if (!user) {
    return null
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.[0] || ''
    const last = lastName?.[0] || ''
    return `${first}${last}`.toUpperCase() || 'U'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0f0f1e]">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your OrbitEdge account and preferences</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] mb-6">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
            <CardDescription className="text-gray-400">
              Your personal details and account status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Avatar & Name */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#2a2a3e]">
              <Avatar className="h-20 w-20 border-2 border-[#4e6aff]">
                <AvatarImage src={user.imageUrl} alt={user.firstName || 'User'} />
                <AvatarFallback className="bg-[#4e6aff]/20 text-[#4e6aff] text-xl">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-400">
                  @{user.username || user.emailAddresses[0]?.emailAddress.split('@')[0]}
                </p>
                <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Active Account
                </Badge>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4e6aff]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#4e6aff]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="text-white font-medium">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
                {user.emailAddresses[0]?.verification?.status === 'verified' && (
                  <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4e6aff]/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#4e6aff]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-white font-medium">{joinDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4e6aff]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#4e6aff]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="text-white font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e] mb-6">
          <CardHeader>
            <CardTitle className="text-white">Subscription Plan</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your OrbitEdge subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Free Trial</h3>
                <p className="text-sm text-gray-400">
                  Access to basic features and satellite tracking
                </p>
              </div>
              <Button className="bg-[#4e6aff] hover:bg-[#3d5aef] text-white">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-[#1a1a2e] border-[#2a2a3e]">
          <CardHeader>
            <CardTitle className="text-white">Account Management</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href={`https://accounts.clerk.dev/user`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full justify-start text-white border-[#2a2a3e] hover:bg-[#2a2a3e]">
                <User className="w-4 h-4 mr-2" />
                Manage Account with Clerk
              </Button>
            </a>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-start text-white border-[#2a2a3e] hover:bg-[#2a2a3e]">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
