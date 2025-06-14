"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Brain, Camera, Clock, Eye, EyeOff, Lock, Stethoscope, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function GuestPage() {
  const [showLimitedFeatures, setShowLimitedFeatures] = useState(false)

  const guestFeatures = [
    {
      icon: Brain,
      title: "Basic Symptom Checker",
      description: "Get basic health insights from common symptoms",
      available: true,
      limitation: "Limited to 3 checks per session",
    },
    {
      icon: Camera,
      title: "Photo Analysis Demo",
      description: "Try our AI photo diagnosis with sample images",
      available: true,
      limitation: "Demo mode only - sample images",
    },
    {
      icon: Stethoscope,
      title: "Doctor Directory",
      description: "Browse public doctor profiles and ratings",
      available: true,
      limitation: "Contact info hidden",
    },
    {
      icon: Users,
      title: "Hospital Finder",
      description: "Find hospitals and medical facilities",
      available: true,
      limitation: "Basic information only",
    },
  ]

  const premiumFeatures = [
    {
      icon: Activity,
      title: "Advanced AI Predictions",
      description: "Comprehensive health analysis with medical history",
      locked: true,
    },
    {
      icon: Clock,
      title: "Health History Tracking",
      description: "Save and track your health data over time",
      locked: true,
    },
    {
      icon: Camera,
      title: "Full Photo Diagnosis",
      description: "Upload your own photos for detailed analysis",
      locked: true,
    },
    {
      icon: Users,
      title: "Doctor Appointments",
      description: "Book appointments and get prescriptions",
      locked: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LifeLine AI</span>
              <Badge variant="secondary">Guest Mode</Badge>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up for Full Access</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LifeLine AI Guest Mode</h1>
          <p className="text-xl text-gray-600 mb-6">Explore our AI-powered healthcare features with limited access</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-yellow-800">
              <strong>Guest Limitations:</strong> Some features are restricted. Sign up for full access to all AI
              predictions, health tracking, and personalized recommendations.
            </p>
          </div>
        </div>

        {/* Available Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available in Guest Mode</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guestFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-10 w-10 text-blue-600" />
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Available
                    </Badge>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-orange-600 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    {feature.limitation}
                  </div>
                  <Link href={`/guest/${feature.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button className="w-full">Try Now</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Premium Features</h2>
            <Button variant="ghost" onClick={() => setShowLimitedFeatures(!showLimitedFeatures)}>
              {showLimitedFeatures ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Details
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show What You're Missing
                </>
              )}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="relative opacity-75">
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <Lock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Sign Up Required</p>
                  </div>
                </div>
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-gray-400" />
                  <CardTitle className="text-gray-600">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-500">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button disabled className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Locked
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready for Full Access?</h3>
            <p className="text-blue-100 mb-6">
              Unlock all features including personalized AI predictions, health tracking, appointment booking, and
              comprehensive medical analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="px-8">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
                >
                  Already Have Account?
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Guest Session Info */}
        <Card className="mt-8 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              <div className="text-sm text-orange-800">
                <strong>Session Notice:</strong> Guest sessions are temporary and data is not saved. Your session will
                expire when you close the browser. Sign up to save your health data permanently.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
