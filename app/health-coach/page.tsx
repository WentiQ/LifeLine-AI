"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Brain, Clock, Dumbbell, Heart, Moon, Salad, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HealthCoachPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [userProfile, setUserProfile] = useState({
    age: "",
    gender: "",
    activityLevel: "",
    weight: "",
    height: "",
  })
  const [healthGoals, setHealthGoals] = useState<string[]>([])
  const [currentConditions, setCurrentConditions] = useState<string[]>([])

  const availableGoals = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Building",
    "Cardiovascular Health",
    "Better Sleep",
    "Stress Management",
    "Energy Boost",
    "Flexibility",
    "Mental Health",
    "Disease Prevention",
  ]

  const commonConditions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Arthritis",
    "Asthma",
    "Depression",
    "Anxiety",
    "High Cholesterol",
    "Obesity",
    "Sleep Disorders",
  ]

  const handleGoalToggle = (goal: string) => {
    setHealthGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  const handleConditionToggle = (condition: string) => {
    setCurrentConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  const generateRecommendations = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/health-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile,
          healthGoals,
          currentConditions,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate recommendations")
      }

      const result = await response.json()
      setRecommendations(result)
    } catch (error) {
      console.error("Error generating recommendations:", error)
      // Fallback recommendations
      setRecommendations({
        dailyRoutine: {
          morning: ["Start with light stretching", "Drink a glass of water", "Take deep breaths"],
          afternoon: ["Take a 10-minute walk", "Practice mindful eating", "Stay hydrated"],
          evening: ["Wind down with relaxation", "Limit screen time", "Prepare for quality sleep"],
        },
        nutrition: {
          recommendations: [
            "Eat balanced meals with protein, carbs, and healthy fats",
            "Stay hydrated throughout the day",
          ],
          foodsToInclude: ["Leafy greens", "Lean proteins", "Whole grains", "Fruits", "Nuts"],
          foodsToAvoid: ["Processed foods", "Excessive sugar", "Trans fats"],
        },
        exercise: {
          weeklyPlan: ["Cardio: 150 minutes/week", "Strength training: 2-3x/week", "Flexibility: Daily"],
          duration: "30-45 minutes per session",
          intensity: "Moderate",
        },
        lifestyle: {
          sleepRecommendations: [
            "Maintain consistent sleep schedule",
            "Create relaxing bedtime routine",
            "Aim for 7-9 hours",
          ],
          stressManagement: ["Practice meditation", "Engage in hobbies", "Connect with others"],
          habits: ["Regular exercise", "Healthy eating", "Adequate sleep", "Stress management"],
        },
        monitoring: {
          vitalsToTrack: ["Weight", "Blood pressure", "Heart rate", "Sleep quality"],
          frequency: "Weekly for weight, daily for others",
          warningSignsigns: ["Unusual fatigue", "Persistent symptoms", "Significant weight changes"],
        },
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-2xl font-bold text-gray-900">AI Health Coach</h1>
              <p className="text-gray-600">Get personalized health and wellness recommendations</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!recommendations ? (
          <div className="space-y-8">
            {/* User Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-6 w-6 mr-2 text-blue-600" />
                  Your Profile
                </CardTitle>
                <CardDescription>Tell us about yourself to get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={userProfile.age}
                      onChange={(e) => setUserProfile({ ...userProfile, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={userProfile.gender}
                      onValueChange={(value) => setUserProfile({ ...userProfile, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity">Activity Level</Label>
                    <Select
                      value={userProfile.activityLevel}
                      onValueChange={(value) => setUserProfile({ ...userProfile, activityLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Lightly Active</SelectItem>
                        <SelectItem value="moderate">Moderately Active</SelectItem>
                        <SelectItem value="very">Very Active</SelectItem>
                        <SelectItem value="extra">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                  Health Goals
                </CardTitle>
                <CardDescription>Select your health and wellness goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableGoals.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={healthGoals.includes(goal)}
                        onCheckedChange={() => handleGoalToggle(goal)}
                      />
                      <Label htmlFor={goal} className="text-sm">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-6 w-6 mr-2 text-red-600" />
                  Current Health Conditions
                </CardTitle>
                <CardDescription>Select any current health conditions (optional)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={currentConditions.includes(condition)}
                        onCheckedChange={() => handleConditionToggle(condition)}
                      />
                      <Label htmlFor={condition} className="text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={generateRecommendations}
                size="lg"
                disabled={isGenerating || !userProfile.age || !userProfile.gender}
                className="px-8"
              >
                {isGenerating ? (
                  <>
                    <Brain className="h-5 w-5 mr-2 animate-pulse" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Get My Personalized Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Daily Routine */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-blue-600" />
                  Your Daily Routine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Morning</h4>
                    <ul className="space-y-2">
                      {recommendations.dailyRoutine.morning.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Afternoon</h4>
                    <ul className="space-y-2">
                      {recommendations.dailyRoutine.afternoon.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Evening</h4>
                    <ul className="space-y-2">
                      {recommendations.dailyRoutine.evening.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Salad className="h-6 w-6 mr-2 text-green-600" />
                  Nutrition Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">General Recommendations</h4>
                    <ul className="space-y-2">
                      {recommendations.nutrition.recommendations.map((item: string, index: number) => (
                        <li key={index} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Foods to Include</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.nutrition.foodsToInclude.map((food: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Foods to Limit</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.nutrition.foodsToAvoid.map((food: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-red-700 border-red-300">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="h-6 w-6 mr-2 text-purple-600" />
                  Exercise Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Weekly Plan</h4>
                    <ul className="space-y-2">
                      {recommendations.exercise.weeklyPlan.map((exercise: string, index: number) => (
                        <li key={index} className="text-sm">
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Duration</h4>
                    <p className="text-sm">{recommendations.exercise.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Intensity</h4>
                    <Badge variant="outline">{recommendations.exercise.intensity}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Moon className="h-6 w-6 mr-2 text-indigo-600" />
                  Lifestyle Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Sleep</h4>
                    <ul className="space-y-2">
                      {recommendations.lifestyle.sleepRecommendations.map((tip: string, index: number) => (
                        <li key={index} className="text-sm">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Stress Management</h4>
                    <ul className="space-y-2">
                      {recommendations.lifestyle.stressManagement.map((tip: string, index: number) => (
                        <li key={index} className="text-sm">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setRecommendations(null)} variant="outline">
                Generate New Plan
              </Button>
              <Button>Save to Health Profile</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
