"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Brain, Calendar, TrendingDown, AlertTriangle, Target } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function FutureHealthPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictions, setPredictions] = useState<any>(null)
  const [badHabits, setBadHabits] = useState<string[]>([])
  const [currentHealth, setCurrentHealth] = useState("")
  const [timeframe, setTimeframe] = useState("")

  const commonBadHabits = [
    "Smoking",
    "Excessive Alcohol",
    "Poor Diet",
    "Sedentary Lifestyle",
    "Lack of Sleep",
    "High Stress",
    "Excessive Screen Time",
    "Skipping Meals",
    "Dehydration",
    "Poor Posture",
    "Excessive Caffeine",
    "Irregular Sleep Schedule",
  ]

  const handleHabitToggle = (habit: string) => {
    setBadHabits((prev) => (prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]))
  }

  const generatePredictions = async () => {
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/future-predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          badHabits,
          currentHealth,
          lifestyle: {
            exercise: document.getElementById("exercise")?.value || "",
            diet: document.getElementById("diet")?.value || "",
            stress: document.getElementById("stress")?.value || "",
            sleep: document.getElementById("sleep")?.value || "",
          },
          timeframe,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate predictions")
      }

      const result = await response.json()
      setPredictions(result)
    } catch (error) {
      console.error("Error generating predictions:", error)
    } finally {
      setIsAnalyzing(false)
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
              <h1 className="text-2xl font-bold text-gray-900">Future Health Predictions</h1>
              <p className="text-gray-600">See how your habits may affect your future health</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!predictions ? (
          <div className="space-y-8">
            {/* Bad Habits Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-6 w-6 mr-2 text-red-600" />
                  Current Bad Habits
                </CardTitle>
                <CardDescription>Select the habits you currently have that may impact your health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonBadHabits.map((habit) => (
                    <div key={habit} className="flex items-center space-x-2">
                      <Checkbox
                        id={habit}
                        checked={badHabits.includes(habit)}
                        onCheckedChange={() => handleHabitToggle(habit)}
                      />
                      <Label htmlFor={habit} className="text-sm">
                        {habit}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Health Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Health Information</CardTitle>
                <CardDescription>Provide details about your current health status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-health">Current Health Conditions</Label>
                  <Textarea
                    id="current-health"
                    placeholder="Describe any current health conditions, medications, or concerns..."
                    value={currentHealth}
                    onChange={(e) => setCurrentHealth(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exercise">Exercise Level</Label>
                    <Select>
                      <SelectTrigger id="exercise">
                        <SelectValue placeholder="Select exercise level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No exercise</SelectItem>
                        <SelectItem value="light">Light (1-2 times/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-4 times/week)</SelectItem>
                        <SelectItem value="heavy">Heavy (5+ times/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diet">Diet Quality</Label>
                    <Select>
                      <SelectTrigger id="diet">
                        <SelectValue placeholder="Select diet quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">Poor (fast food, processed)</SelectItem>
                        <SelectItem value="fair">Fair (mixed healthy/unhealthy)</SelectItem>
                        <SelectItem value="good">Good (mostly healthy)</SelectItem>
                        <SelectItem value="excellent">Excellent (very healthy)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stress">Stress Level</Label>
                    <Select>
                      <SelectTrigger id="stress">
                        <SelectValue placeholder="Select stress level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="extreme">Extreme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleep">Sleep Quality</Label>
                    <Select>
                      <SelectTrigger id="sleep">
                        <SelectValue placeholder="Select sleep quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">Poor (less than 6 hours)</SelectItem>
                        <SelectItem value="fair">Fair (6-7 hours)</SelectItem>
                        <SelectItem value="good">Good (7-8 hours)</SelectItem>
                        <SelectItem value="excellent">Excellent (8+ hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Prediction Timeframe</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select prediction timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="5years">5 Years</SelectItem>
                      <SelectItem value="10years">10 Years</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={generatePredictions}
                size="lg"
                disabled={isAnalyzing || badHabits.length === 0}
                className="px-8"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="h-5 w-5 mr-2 animate-pulse" />
                    Analyzing Future Health...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Predict My Future Health
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Habit Impact Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-orange-600" />
                  Habit Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Most Dangerous Habit</h4>
                    <p className="text-red-700">{predictions.habitImpact.mostDangerous}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Immediate Risks</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      {predictions.habitImpact.immediateRisks.map((risk: string, index: number) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Cumulative Effects</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      {predictions.habitImpact.cumulativeEffects.map((effect: string, index: number) => (
                        <li key={index}>• {effect}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Predictions */}
            <div className="grid gap-6">
              {/* Short Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                    Short Term ({predictions.shortTerm.timeframe})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictions.shortTerm.predictions.map((prediction: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{prediction.condition}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={prediction.severity === "Severe" ? "destructive" : "secondary"}>
                              {prediction.severity}
                            </Badge>
                            <span className="text-sm text-gray-600">{prediction.probability}% probability</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{prediction.description}</p>
                        <div>
                          <h5 className="font-medium mb-2">Prevention Steps:</h5>
                          <ul className="text-sm space-y-1">
                            {prediction.preventionSteps.map((step: string, stepIndex: number) => (
                              <li key={stepIndex} className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Medium Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-orange-600" />
                    Medium Term ({predictions.mediumTerm.timeframe})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictions.mediumTerm.predictions.map((prediction: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{prediction.condition}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={prediction.severity === "Severe" ? "destructive" : "secondary"}>
                              {prediction.severity}
                            </Badge>
                            <span className="text-sm text-gray-600">{prediction.probability}% probability</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{prediction.description}</p>
                        <div>
                          <h5 className="font-medium mb-2">Prevention Steps:</h5>
                          <ul className="text-sm space-y-1">
                            {prediction.preventionSteps.map((step: string, stepIndex: number) => (
                              <li key={stepIndex} className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Long Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-red-600" />
                    Long Term ({predictions.longTerm.timeframe})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictions.longTerm.predictions.map((prediction: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{prediction.condition}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={prediction.severity === "Severe" ? "destructive" : "secondary"}>
                              {prediction.severity}
                            </Badge>
                            <span className="text-sm text-gray-600">{prediction.probability}% probability</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{prediction.description}</p>
                        <div>
                          <h5 className="font-medium mb-2">Prevention Steps:</h5>
                          <ul className="text-sm space-y-1">
                            {prediction.preventionSteps.map((step: string, stepIndex: number) => (
                              <li key={stepIndex} className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Reduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-6 w-6 mr-2 text-green-600" />
                  Risk Reduction Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">If You Quit Now</h4>
                    <p className="text-green-700">{predictions.riskReduction.ifQuitNow}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">If You Continue</h4>
                    <p className="text-red-700">{predictions.riskReduction.ifContinue}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Reversibility</h4>
                  <p className="text-blue-700">{predictions.riskReduction.reversibility}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setPredictions(null)} variant="outline">
                Generate New Prediction
              </Button>
              <Link href="/health-coach" className="flex-1">
                <Button className="w-full">Get Personalized Health Plan</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
