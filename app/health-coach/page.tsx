"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Brain, Clock, Dumbbell, Heart, Moon, Salad, Target, TrendingUp, X } from "lucide-react"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useSearchParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"

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
  const [customGoal, setCustomGoal] = useState("")
  const [customCondition, setCustomCondition] = useState("")
  const [savedPlans, setSavedPlans] = useState<any[]>([])

  const searchParams = useSearchParams();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedHealthPlans")
      if (saved) setSavedPlans(JSON.parse(saved))

      const shareId = searchParams?.get("share")
      if (shareId && saved) {
        const arr = JSON.parse(saved)
        const found = arr.find((p: any) => p.id === shareId)
        if (found) {
          setRecommendations(found.recommendations)
          setUserProfile(found.userProfile)
          setHealthGoals(found.healthGoals)
          setCurrentConditions(found.currentConditions)
        }
      }
    }
  }, [searchParams])

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

  const handleAddCustomGoal = () => {
    if (customGoal.trim() && !healthGoals.includes(customGoal.trim())) {
      setHealthGoals((prev) => [...prev, customGoal.trim()])
      setCustomGoal("")
    }
  }

  const handleRemoveGoal = (goal: string) => {
    setHealthGoals((prev) => prev.filter((g) => g !== goal))
  }

  const handleAddCustomCondition = () => {
    if (customCondition.trim() && !currentConditions.includes(customCondition.trim())) {
      setCurrentConditions((prev) => [...prev, customCondition.trim()])
      setCustomCondition("")
    }
  }

  const handleRemoveCondition = (condition: string) => {
    setCurrentConditions((prev) => prev.filter((c) => c !== condition))
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

  const handleSavePlan = () => {
    if (recommendations) {
      const newPlan = {
        id: uuidv4(),
        savedAt: new Date().toISOString(),
        recommendations,
        userProfile,
        healthGoals,
        currentConditions,
      }
      const updated = [newPlan, ...savedPlans]
      setSavedPlans(updated)
      localStorage.setItem("savedHealthPlans", JSON.stringify(updated))
      alert("Plan saved! You can view it later even offline.")
    }
  }

  const handleSharePlan = (plan: any) => {
    const url = `${window.location.origin}/health-coach?share=${plan.id}`
    navigator.clipboard.writeText(url)
    alert("Sharable link copied to clipboard!")
  }

  const handleDownloadPDF = (plan: any, idx: number) => {
    import("jspdf").then((jsPDF) => {
      const doc = new jsPDF.jsPDF({ unit: "pt", format: "a4" })
      let y = 40
      const left = 40
      const wrapWidth = 500
      const pageHeight = doc.internal.pageSize.height

      function addSectionHeader(text: string, color: [number, number, number] = [59, 130, 246]) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(15)
        doc.setTextColor(...color)
        doc.text(text, left, y)
        y += 24
        doc.setTextColor(33, 37, 41)
      }

      function addBadgeList(items: string[] | undefined, badgeColor: [number, number, number]) {
        if (!items || items.length === 0) return
        let x = left
        const badgeHeight = 22
        const padding = 12
        items.forEach((item, idx) => {
          const badgeWidth = doc.getTextWidth(item) + padding * 2
          if (x + badgeWidth > left + wrapWidth) {
            x = left
            y += badgeHeight + 6
          }
          doc.setFillColor(...badgeColor)
          doc.roundedRect(x, y, badgeWidth, badgeHeight, 8, 8, "F")
          doc.setTextColor(255, 255, 255)
          doc.text(item, x + padding, y + badgeHeight / 1.6)
          doc.setTextColor(33, 37, 41)
          x += badgeWidth + 8
        })
        y += badgeHeight + 10
      }

      function addBulletList(items: string[] | undefined) {
        if (!items || items.length === 0) return
        items.forEach((item) => {
          if (y > pageHeight - 40) {
            doc.addPage()
            y = 40
          }
          doc.circle(left + 8, y + 4, 3, "F")
          doc.text(item, left + 20, y + 8)
          y += 18
        })
        y += 4
      }

      function addTextBlock(label: string, value: string | string[] | undefined) {
        if (!value || (Array.isArray(value) && value.length === 0)) return
        doc.setFont("helvetica", "bold")
        doc.setFontSize(11)
        doc.text(label, left, y)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        y += 14
        let text = Array.isArray(value) ? value.join(", ") : value
        const lines = doc.splitTextToSize(text, wrapWidth)
        lines.forEach((line: string) => {
          doc.text(line, left + 20, y)
          y += 14
        })
        y += 4
      }

      // Title
      doc.setFont("helvetica", "bold")
      doc.setFontSize(20)
      doc.text("AI Health Coach Plan", left, y)
      y += 30
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      addTextBlock("Saved At:", new Date(plan.savedAt).toLocaleString())

      // User Profile
      addSectionHeader("User Profile", [59, 130, 246])
      addTextBlock("Age:", plan.userProfile?.age)
      addTextBlock("Gender:", plan.userProfile?.gender)
      addTextBlock("Activity Level:", plan.userProfile?.activityLevel)
      addTextBlock("Weight:", plan.userProfile?.weight)
      addTextBlock("Height:", plan.userProfile?.height)

      // Health Goals
      addSectionHeader("Health Goals", [34, 197, 94])
      addBadgeList(plan.healthGoals, [34, 197, 94])

      // Current Conditions
      addSectionHeader("Current Conditions", [239, 68, 68])
      addBadgeList(plan.currentConditions, [239, 68, 68])

      // Daily Routine
      addSectionHeader("Daily Routine", [37, 99, 235])
      addTextBlock("Morning:", "")
      addBulletList(plan.recommendations.dailyRoutine?.morning)
      addTextBlock("Afternoon:", "")
      addBulletList(plan.recommendations.dailyRoutine?.afternoon)
      addTextBlock("Evening:", "")
      addBulletList(plan.recommendations.dailyRoutine?.evening)

      // Nutrition
      addSectionHeader("Nutrition", [34, 197, 94])
      addTextBlock("General Recommendations:", "")
      addBulletList(plan.recommendations.nutrition?.recommendations)
      addTextBlock("Foods to Include:", "")
      addBadgeList(plan.recommendations.nutrition?.foodsToInclude, [34, 197, 94])
      addTextBlock("Foods to Avoid:", "")
      addBadgeList(plan.recommendations.nutrition?.foodsToAvoid, [239, 68, 68])

      // Exercise
      addSectionHeader("Exercise", [139, 92, 246])
      addTextBlock("Weekly Plan:", "")
      addBulletList(plan.recommendations.exercise?.weeklyPlan)
      addTextBlock("Duration:", plan.recommendations.exercise?.duration)
      addTextBlock("Intensity:", plan.recommendations.exercise?.intensity)

      // Lifestyle
      addSectionHeader("Lifestyle", [251, 191, 36])
      addTextBlock("Sleep Recommendations:", "")
      addBulletList(plan.recommendations.lifestyle?.sleepRecommendations)
      addTextBlock("Stress Management:", "")
      addBulletList(plan.recommendations.lifestyle?.stressManagement)
      addTextBlock("Habits:", "")
      addBulletList(plan.recommendations.lifestyle?.habits)

      // Monitoring
      addSectionHeader("Monitoring", [59, 130, 246])
      addTextBlock("Vitals to Track:", "")
      addBulletList(plan.recommendations.monitoring?.vitalsToTrack)
      addTextBlock("Frequency:", plan.recommendations.monitoring?.frequency)
      addTextBlock("Warning Signs:", "")
      addBulletList(plan.recommendations.monitoring?.warningSignsigns)

      // Disclaimer
      y += 20
      doc.setFontSize(10)
      doc.setTextColor(200, 100, 0)
      const disclaimer =
        "Medical Disclaimer: This AI health plan is for informational purposes only and should not replace professional medical advice."
      const disclaimerLines = doc.splitTextToSize(disclaimer, wrapWidth)
      disclaimerLines.forEach((line: string) => {
        doc.text(line, left, y)
        y += 14
      })

      doc.save(`health-plan-${plan.userProfile?.age || idx}.pdf`)
    })
  }

  const handleDeletePlan = (idx: number) => {
    const updated = savedPlans.filter((_, i) => i !== idx)
    setSavedPlans(updated)
    localStorage.setItem("savedHealthPlans", JSON.stringify(updated))
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
          {isGenerating && !recommendations ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2">Generating Your Personalized Plan</h3>
                <p className="text-gray-600 mb-4">
                  Our AI is analyzing your profile and goals to create a tailored health plan...
                </p>
                <div className="w-full max-w-md mx-auto">
                  <div className="h-2.5 bg-blue-200 rounded-full overflow-hidden relative">
                    <div
                      className="h-2.5 bg-blue-600 rounded-full animate-ripple absolute left-0 top-0"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                <style jsx global>{`
                  @keyframes ripple {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                  .animate-ripple {
                    animation: ripple 1.2s linear infinite;
                    width: 100%;
                  }
                `}</style>
              </CardContent>
            </Card>
          ) : !recommendations ? (
            <>
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
                    <CardDescription>Select or add your health and wellness goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Display selected goals */}
                    <div className="mb-4">
                      {healthGoals.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {healthGoals.map((goal) => (
                            <Badge key={goal} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                              {goal}
                              <button
                                onClick={() => handleRemoveGoal(goal)}
                                className="ml-2 rounded-full hover:bg-gray-300 p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Predefined goals */}
                    <Label className="text-base">Choose from common goals</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {availableGoals.map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            id={goal}
                            checked={healthGoals.includes(goal)}
                            onCheckedChange={() => handleGoalToggle(goal)}
                          />
                          <Label htmlFor={goal} className="text-sm font-normal">
                            {goal}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Custom goal input */}
                    <div className="mt-4 pt-4 border-t">
                      <Label htmlFor="customGoal" className="text-base">Add a custom goal</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="customGoal"
                          placeholder="e.g., Run a 5k"
                          value={customGoal}
                          onChange={(e) => setCustomGoal(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddCustomGoal()}
                        />
                        <Button onClick={handleAddCustomGoal} variant="outline">
                          Add Goal
                        </Button>
                      </div>
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
                    <CardDescription>Select or add any current health conditions (optional)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Display selected conditions */}
                    <div className="mb-4">
                      {currentConditions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {currentConditions.map((condition) => (
                            <Badge key={condition} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                              {condition}
                              <button
                                onClick={() => handleRemoveCondition(condition)}
                                className="ml-2 rounded-full hover:bg-gray-300 p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Predefined conditions */}
                    <Label className="text-base">Choose from common conditions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {commonConditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={currentConditions.includes(condition)}
                            onCheckedChange={() => handleConditionToggle(condition)}
                          />
                          <Label htmlFor={condition} className="text-sm font-normal">
                            {condition}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Custom condition input */}
                    <div className="mt-4 pt-4 border-t">
                      <Label htmlFor="customCondition" className="text-base">Add a custom condition</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="customCondition"
                          placeholder="e.g., Seasonal allergies"
                          value={customCondition}
                          onChange={(e) => setCustomCondition(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddCustomCondition()}
                        />
                        <Button onClick={handleAddCustomCondition} variant="outline">
                          Add Condition
                        </Button>
                      </div>
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
                    <Brain className="h-5 w-5 mr-2" />
                    Get My Personalized Plan
                  </Button>
                </div>
              </div>
              {savedPlans.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Saved Health Plans</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedPlans.map((plan, idx) => (
                      <Card key={plan.id || idx} className="relative border-2 border-gray-200 shadow-sm bg-white">
                        <CardContent className="py-4">
                          <div className="mb-2 text-xs text-gray-500">
                            Saved: {new Date(plan.savedAt).toLocaleString()}
                          </div>
                          <div className="font-bold mb-1">Goals: {plan.healthGoals?.join(", ")}</div>
                          <div className="mb-2 text-sm">
                            Age: <span className="font-semibold">{plan.userProfile?.age}</span>
                          </div>
                          <Button
                            size="sm"
                            className="mr-2"
                            onClick={() => {
                              setRecommendations(plan.recommendations)
                              setUserProfile(plan.userProfile)
                              setHealthGoals(plan.healthGoals)
                              setCurrentConditions(plan.currentConditions)
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="mr-2"
                            onClick={() => handleSharePlan(plan)}
                          >
                            Share
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mr-2"
                            onClick={() => handleDownloadPDF(plan, idx)}
                          >
                            Download PDF
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePlan(idx)}
                          >
                            Delete
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
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
                <Button onClick={handleSavePlan}>Save to Health Profile</Button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </Suspense>
  )
}