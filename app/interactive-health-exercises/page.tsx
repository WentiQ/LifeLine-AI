// import { useNotifications } from "@/context/notification-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Bell, Activity, Heart, Brain, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

export default function Dashboard() {
//   const { notifications, unreadCount } = useNotifications()

  return (
    <div>
        {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Interactive Health Exercises</h1>
              <p className="text-gray-600">Follow along with animated guides to improve your health and wellness</p>
            </div>
          </div>
        </div>
      </header>
      
        {/* Interactive Health Exercises */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4"></h2>
        <p className="text-gray-600 mb-6"></p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/exercises/breathing">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <div className="h-6 w-6 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <Badge variant="secondary">5 min</Badge>
                </div>
                <CardTitle>Breathing Exercise</CardTitle>
                <CardDescription>Guided breathing patterns to reduce stress and improve focus</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/exercises/lung-capacity">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <Badge variant="secondary">3 min</Badge>
                </div>
                <CardTitle>Lung Capacity Test</CardTitle>
                <CardDescription>Measure and improve your lung capacity with guided exercises</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/exercises/blood-pressure">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <Badge variant="secondary">7 min</Badge>
                </div>
                <CardTitle>Blood Pressure Control</CardTitle>
                <CardDescription>Relaxation techniques to help manage blood pressure</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/exercises/stress-relief">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge variant="secondary">10 min</Badge>
                </div>
                <CardTitle>Stress Relief</CardTitle>
                <CardDescription>Mindfulness and relaxation exercises to reduce stress</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/exercises/hiccup-relief">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                    <div className="h-6 w-6 bg-yellow-500 rounded-full animate-bounce"></div>
                  </div>
                  <Badge variant="secondary">2 min</Badge>
                </div>
                <CardTitle>Hiccup Relief</CardTitle>
                <CardDescription>Breath-holding techniques to stop hiccups naturally</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/exercises/eye-exercise">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                    <div className="h-6 w-6 bg-indigo-500 rounded-full animate-ping"></div>
                  </div>
                  <Badge variant="secondary">4 min</Badge>
                </div>
                <CardTitle>Eye Exercise</CardTitle>
                <CardDescription>Reduce eye strain and improve vision with guided movements</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

