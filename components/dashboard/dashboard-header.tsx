"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Satellite, Settings, User, Bell, LogOut } from "lucide-react"
import Link from "next/link"
import { useUser, useClerk } from '@clerk/nextjs'
import { Badge } from "@/components/ui/badge"
import { usePathname, useRouter } from "next/navigation"

export default function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const user: any = null;
  const signOut = async () => {};

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(path)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || "U"
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4e6aff] rounded-lg flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OrbitBiZ</h1> {/* Updated company name */}
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className={`font-medium transition-colors ${
                  isActive("/dashboard") && pathname === "/dashboard"
                    ? "text-[#4e6aff]"
                    : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Overview
              </Link>
              <Link
                href="/dashboard/satellites"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/satellites") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Satellites
              </Link>
              <Link
                href="/dashboard/map"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/map") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Map
              </Link>
              <Link
                href="/dashboard/analytics"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/analytics") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Analytics
              </Link>
              <Link
                href="/dashboard/chat"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/chat") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Chat
              </Link>
              <Link
                href="/dashboard/compliance"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/compliance") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Compliance
              </Link>
              <Link
                href="/dashboard/learn"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/learn") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Learn
              </Link>
              <Link
                href="/dashboard/resources"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/resources") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Resources
              </Link>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs">3</Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                    <AvatarFallback className="bg-[#4e6aff] text-white text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2 text-sm">
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-gray-500 text-xs truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
