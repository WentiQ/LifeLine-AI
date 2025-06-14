"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Bell,
  Bot,
  Brain,
  Calendar,
  Camera,
  Heart,
  LogOut,
  MapPin,
  Pill,
  Stethoscope,
  TrendingUp,
  User,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  const handleSignOut = () => {
    // In a real app, this would clear all user data and redirect
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LifeLine AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Here's your health overview and recommendations.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-gray-900">85/100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Risk Level</p>
                  <p className="text-2xl font-bold text-green-600">Low</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Pill className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Medications</p>
                  <p className="text-2xl font-bold text-gray-900">3 Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Next Checkup</p>
                  <p className="text-2xl font-bold text-gray-900">Dec 15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/predict">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Brain className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Disease Prediction</CardTitle>
                <CardDescription>Get AI-powered health predictions based on your symptoms and data</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/photo-diagnosis">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Camera className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Photo Diagnosis</CardTitle>
                <CardDescription>Upload or capture photos for instant visual health analysis</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/doctors">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Stethoscope className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Find Doctors</CardTitle>
                <CardDescription>Browse top-rated doctors and hospitals in your area</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/medications">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Pill className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Medications</CardTitle>
                <CardDescription>Manage your medications and set up reminders</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/health-history">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Activity className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Health History</CardTitle>
                <CardDescription>View your complete health records and trends</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/hospitals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <MapPin className="h-10 w-10 text-teal-600 mb-2" />
                <CardTitle>Find Hospitals</CardTitle>
                <CardDescription>Locate the best hospitals and medical facilities nearby</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/health-coach">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Brain className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>AI Health Coach</CardTitle>
                <CardDescription>Get personalized health and wellness recommendations</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Bot className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>AI Chat Assistant</CardTitle>
                <CardDescription>Chat with LifeLine AI for instant health guidance and support</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/future-health">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>Future Health Predictions</CardTitle>
                <CardDescription>See how your habits may affect your future health</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/smartwatch">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Activity className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Smartwatch Integration</CardTitle>
                <CardDescription>Real-time health monitoring and AI analysis</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/emergency-guide">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Emergency Guide</CardTitle>
                <CardDescription>Do's and Don'ts for medical emergencies and conditions</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest health interactions and predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Disease Prediction Completed</p>
                    <p className="text-sm text-gray-600">Analyzed symptoms for respiratory issues</p>
                  </div>
                </div>
                <Badge variant="secondary">2 hours ago</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Camera className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Photo Analysis</p>
                    <p className="text-sm text-gray-600">Skin condition assessment completed</p>
                  </div>
                </div>
                <Badge variant="secondary">1 day ago</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Pill className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Medication Reminder</p>
                    <p className="text-sm text-gray-600">Took morning medications on time</p>
                  </div>
                </div>
                <Badge variant="secondary">2 days ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
