import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Brain, Calendar, Camera, MapPin, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LifeLine AI</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
              <Link href="/guest">
                <Button variant="secondary">Guest Access</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">AI-Powered Healthcare Prediction</h1>
          <p className="text-xl text-gray-600 mb-8">
            Predict diseases accurately using symptoms, medical history, photos, and real-time data. Get personalized
            treatment recommendations and connect with top-rated doctors.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/guest">
              <Button size="lg" variant="outline" className="px-8">
                Try as Guest
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>AI Disease Prediction</CardTitle>
                <CardDescription>
                  Advanced AI analyzes symptoms, history, and real-time data for accurate predictions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Camera className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Photo Diagnosis</CardTitle>
                <CardDescription>
                  Upload or capture photos for instant visual diagnosis of skin conditions and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Stethoscope className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Doctor Rankings</CardTitle>
                <CardDescription>
                  Find top-rated doctors based on experience, success rate, and patient reviews
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Smart Watch Integration</CardTitle>
                <CardDescription>
                  Connect wearable devices for continuous health monitoring and predictions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Medication Reminders</CardTitle>
                <CardDescription>Never miss a dose with intelligent medication and treatment reminders</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-teal-600 mb-2" />
                <CardTitle>Location-Based Care</CardTitle>
                <CardDescription>
                  Find the best healthcare providers in your area with personalized recommendations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare?</h2>
          <p className="text-xl mb-8">
            Join thousands of users who trust LifeLine AI for their health predictions and care.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="px-8">
              Start Your Health Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Activity className="h-6 w-6" />
            <span className="text-xl font-bold">LifeLine AI</span>
          </div>
          <p className="text-gray-400">
            © 2024 LifeLine AI. All rights reserved. This app is for informational purposes only and should not replace
            professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
