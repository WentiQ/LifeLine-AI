"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Activity, Heart, Moon, Footprints, Zap, Bluetooth, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SmartwatchPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [smartwatchData, setSmartwatchData] = useState<any>(null)

  // Simulate smartwatch data
  const generateMockData = () => {
    return {
      heartRate: {
        current: 72,
        resting: 65,
        max: 185,
        trend: "stable",
        data: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          value: 65 + Math.random() * 20,
        })),
      },
      steps: {
        today: 8543,
        goal: 10000,
        weekly: [7200, 8900, 6500, 9200, 8543, 0, 0],
      },
      sleep: {
        lastNight: {
          duration: 7.5,
          quality: 85,
          deepSleep: 2.1,
          remSleep: 1.8,
          awakenings: 2,
        },
        weeklyAverage: 7.2,
      },
      bloodOxygen: {
        current: 98,
        average: 97,
        trend: "normal",
      },
      stress: {
        current: 35,
        average: 42,
        level: "low",
      },
      activity: {
        activeMinutes: 45,
        caloriesBurned: 2150,
        workouts: 1,
      },
    }
  }

  const connectSmartwatch = async () => {
    setIsConnected(true)
    const mockData = generateMockData()
    setSmartwatchData(mockData)
  }

  const analyzeData = async () => {
    if (!smartwatchData) return

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/smartwatch-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heartRate: smartwatchData.heartRate,
          steps: smartwatchData.steps,
          sleep: smartwatchData.sleep,
          bloodOxygen: smartwatchData.bloodOxygen,
          stress: smartwatchData.stress,
          activity: smartwatchData.activity,
          timeRange: "24 hours",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze data")
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (error) {
      console.error("Error analyzing smartwatch data:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const refreshData = () => {
    const newData = generateMockData()
    setSmartwatchData(newData)
    setAnalysis(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Smartwatch Integration</h1>
                <p className="text-gray-600">Real-time health monitoring and AI analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "default" : "secondary"}>
                <Bluetooth className="h-3 w-3 mr-1" />
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              {isConnected && (
                <Button variant="outline" size="sm" onClick={refreshData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <>
            <Card className="max-w-2xl mx-auto mb-6 border-yellow-300 bg-yellow-50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center text-yellow-700">
                  <Bluetooth className="h-6 w-6 mr-2" />
                  Unable to Connect to Most Smartwatches
                </CardTitle>
                <CardDescription>
                  <span className="text-yellow-800">
                    Most smartwatches are not supported for direct connection.<br />
                    This demo uses simulated data. Please check back for real device support in future updates.
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center">
                  <Bluetooth className="h-8 w-8 mr-2 text-blue-600" />
                  Connect Your Smartwatch
                </CardTitle>
                <CardDescription>
                  Connect your smartwatch to get real-time health insights and AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">Apple Watch</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Samsung Galaxy</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium">Fitbit</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium">Garmin</p>
                  </div>
                </div>

                <Button onClick={connectSmartwatch} size="lg" className="px-8">
                  <Bluetooth className="h-5 w-5 mr-2" />
                  Connect Smartwatch (Demo Only)
                </Button>

                <div className="text-sm text-gray-600">
                  <p>Supported metrics:</p>
                  <p>Heart Rate • Steps • Sleep • Blood Oxygen • Stress • Activity</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="space-y-8">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Heart Rate</p>
                      <p className="text-2xl font-bold text-red-500">{smartwatchData?.heartRate.current} BPM</p>
                      <p className="text-xs text-gray-500">Resting: {smartwatchData?.heartRate.resting} BPM</p>
                    </div>
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Steps Today</p>
                      <p className="text-2xl font-bold text-blue-500">{smartwatchData?.steps.today.toLocaleString()}</p>
                      <Progress
                        value={(smartwatchData?.steps.today / smartwatchData?.steps.goal) * 100}
                        className="mt-2"
                      />
                    </div>
                    <Footprints className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sleep Quality</p>
                      <p className="text-2xl font-bold text-purple-500">{smartwatchData?.sleep.lastNight.quality}%</p>
                      <p className="text-xs text-gray-500">{smartwatchData?.sleep.lastNight.duration}h duration</p>
                    </div>
                    <Moon className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Stress Level</p>
                      <p className="text-2xl font-bold text-green-500">{smartwatchData?.stress.current}</p>
                      <Badge variant="outline" className="mt-1">
                        {smartwatchData?.stress.level}
                      </Badge>
                    </div>
                    <Zap className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis Button */}
            {!analysis && (
              <div className="text-center">
                <Button onClick={analyzeData} size="lg" disabled={isAnalyzing} className="px-8">
                  {isAnalyzing ? (
                    <>
                      <Activity className="h-5 w-5 mr-2 animate-pulse" />
                      Analyzing Health Data...
                    </>
                  ) : (
                    <>
                      <Activity className="h-5 w-5 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* AI Analysis Results */}
            {analysis && (
              <div className="space-y-6">
                {/* Overall Health Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>AI Health Analysis</span>
                      <Badge variant={analysis.currentStatus.riskLevel === "Low" ? "default" : "destructive"}>
                        {analysis.currentStatus.riskLevel} Risk
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Overall Health: {analysis.currentStatus.overallHealth}</h4>
                        <ul className="space-y-1">
                          {analysis.currentStatus.keyFindings.map((finding: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600">
                              • {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Health Scores</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Overall</span>
                            <span className="font-medium">{analysis.healthScore.overall}/100</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cardiovascular</span>
                            <span className="font-medium">{analysis.healthScore.cardiovascular}/100</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Sleep</span>
                            <span className="font-medium">{analysis.healthScore.sleep}/100</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Activity</span>
                            <span className="font-medium">{analysis.healthScore.activity}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Predictions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Health Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Immediate (24-48 hours)</h4>
                        <ul className="space-y-2">
                          {analysis.predictions.immediate.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-sm">
                              • {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Short Term (1-2 weeks)</h4>
                        <ul className="space-y-2">
                          {analysis.predictions.shortTerm.interventions.map((intervention: string, index: number) => (
                            <li key={index} className="text-sm">
                              • {intervention}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Urgent</h4>
                        <ul className="space-y-1">
                          {analysis.actionItems.urgent.map((action: string, index: number) => (
                            <li key={index} className="text-sm">
                              • {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Routine</h4>
                        <ul className="space-y-1">
                          {analysis.actionItems.routine.map((action: string, index: number) => (
                            <li key={index} className="text-sm">
                              • {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Lifestyle</h4>
                        <ul className="space-y-1">
                          {analysis.actionItems.lifestyle.map((action: string, index: number) => (
                            <li key={index} className="text-sm">
                              • {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => setAnalysis(null)} variant="outline">
                    New Analysis
                  </Button>
                  <Link href="/future-health" className="flex-1">
                    <Button className="w-full">Predict Future Health</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
