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
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef, Suspense } from "react"
import { Loader2 } from "lucide-react"
// import ChatAssistantBubble from "@/components/ChatAssistantBubble"
// import FutureHealthContent from "./FutureHealthContent"

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      // Only show loading animation on first mount (hard reload/direct visit)
      setIsPageLoading(true)
      const timer = setTimeout(() => setIsPageLoading(false), 1200)
      if (typeof window !== "undefined") {
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
        setUserName(user.firstName ? user.firstName : "User")
      }
      hasMounted.current = true
      return () => clearTimeout(timer)
    } else {
      // On client-side navigation, skip loading animation
      setIsPageLoading(false)
      if (typeof window !== "undefined") {
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
        setUserName(user.firstName ? user.firstName : "User")
      }
    }
  }, [])

  useEffect(() => {
    setIsNavigating(false)
  }, [])

  const handleSignOut = () => {
    router.push("/")
  }

  const handleNavigate = (href: string) => {
    // Only show loading animation if NOT navigating to dashboard itself
    if (href !== "/dashboard") {
      setIsNavigating(true)
    }
    router.push(href)
  }

  const handleHeaderNavigate = (href: string) => {
    setIsNavigating(true)
    router.push(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Loading Overlay */}
      {(isPageLoading || isNavigating) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
          <div className="relative flex items-center justify-center h-32 w-32">
            {/* Ripple circle */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="ripple-logo absolute inline-block h-28 w-28 rounded-full bg-blue-200 opacity-70"></span>
            </span>
            {/* Animated Heartbeat SVG */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              className="z-10"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline
                points="2 12 6 12 9 3 15 21 18 12 22 12"
                strokeDasharray="100"
                strokeDashoffset="100"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="100;0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </polyline>
            </svg>
          </div>
          <style jsx>{`
            .ripple-logo {
              animation: ripple-effect 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes ripple-effect {
              0% {
                transform: scale(0.8);
                opacity: 0.7;
              }
              70% {
                transform: scale(1.3);
                opacity: 0.2;
              }
              100% {
                transform: scale(1.5);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LifeLine AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => handleHeaderNavigate("/notifications")}>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleHeaderNavigate("/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userName}!</h1>
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
                <Pill className="h-8 w-8 text-orange-600" />
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
          <div onClick={() => handleNavigate("/emergency-guide")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Emergency Guide</CardTitle>
                <CardDescription>Do's and Don'ts for medical emergencies and conditions</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div onClick={() => handleNavigate("/predict")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Disease Prediction</CardTitle>
                <CardDescription>Get AI-powered health predictions based on your symptoms and data</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div onClick={() => handleNavigate("/photo-diagnosis")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Camera className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Photo Diagnosis</CardTitle>
                <CardDescription>Upload or capture photos for instant visual health analysis</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div onClick={() => handleNavigate("/doctors")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Stethoscope className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Find Doctors</CardTitle>
                <CardDescription>Browse top-rated doctors and hospitals in your area</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div onClick={() => handleNavigate("/medications")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Pill className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Medications</CardTitle>
                <CardDescription>Manage your medications and set up reminders</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div onClick={() => handleNavigate("/hospitals")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="h-10 w-10 text-teal-600 mb-2" />
                <CardTitle>Find Hospitals</CardTitle>
                <CardDescription>Locate the best hospitals and medical facilities nearby</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div onClick={() => handleNavigate("/health-coach")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>Health Coach</CardTitle>
                <CardDescription>Get personalized health and wellness recommendations</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div onClick={() => handleNavigate("/future-health")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>Future Health Predictions</CardTitle>
                <CardDescription>See how your habits may affect your future health</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div onClick={() => handleNavigate("/smartwatch")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Smartwatch Integration</CardTitle>
                <CardDescription>Real-time health monitoring and AI analysis</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div onClick={() => handleNavigate("/health-history")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Health History</CardTitle>
                <CardDescription>View your complete health records and trends</CardDescription>
              </CardHeader>
            </Card>
          </div>
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

      {/* Floating AI Assistant Bubble at bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatAssistantBubble />
      </div>
    </div>
  )
}

import React from "react"
// import { useRouter } from "next/navigation"
// import { Loader2, Bot } from "lucide-react"

const ChatAssistantBubble: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleClick = () => {
    setLoading(true)
    router.push("/chat")
  }

  return (
    <button
      className="group bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-2xl border-4 border-white rounded-full p-0.5 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 min-w-[44px] min-h-[44px] flex items-center justify-center relative"
      title="Chat with LifeLine AI"
      onClick={handleClick}
      disabled={loading}
      style={{ boxShadow: "0 8px 32px 0 rgba(34, 139, 230, 0.25)" }}
    >
      <span className="relative flex items-center justify-center w-11 h-11">
        <span className="absolute inline-block w-full h-full rounded-full bg-blue-400 opacity-30 group-hover:animate-ping"></span>
        <span className="absolute inline-block w-8 h-8 rounded-full bg-blue-600 opacity-80"></span>
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5 text-white z-10" />
        ) : (
          <Bot className="h-6 w-6 text-white z-10 drop-shadow-lg" />
        )}
      </span>
      {/* Hand waving greeting on hover */}
      <span className="absolute right-full ml-3 flex items-center space-x-1 font-semibold text-xs px-2 py-0.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-blue-700">
        <span
          className="inline-block"
          style={{
            fontSize: "1.5rem", // Make the hand bigger
            display: "inline-block",
            animation: "wave-hand 1s infinite",
            transformOrigin: "70% 70%",
            background: "none", // Remove any background
          }}
        >
          👋
        </span>
        <span>Hi</span>
      </span>
      <style jsx>{`
        @keyframes wave-hand {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </button>
  )
}

// export function FutureHealthPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <FutureHealthContent />
//     </Suspense>
//   )
// }
