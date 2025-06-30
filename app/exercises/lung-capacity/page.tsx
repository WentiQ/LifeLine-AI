"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Square, RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LungCapacityTest() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"prepare" | "inhale" | "hold" | "complete">("prepare")
  const [timeLeft, setTimeLeft] = useState(0)
  const [holdTime, setHoldTime] = useState(0)
  const [bestTime, setBestTime] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Countdown timer for prepare and inhale phases
  useEffect(() => {
    if (isActive && timeLeft > 0 && (phase === "prepare" || phase === "inhale")) {
      countdownRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0 && phase === "prepare") {
      setPhase("inhale")
      setTimeLeft(5)
    } else if (isActive && timeLeft === 0 && phase === "inhale") {
      setPhase("hold")
      setHoldTime(0)
      startHoldTimer()
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current)
      }
    }
  }, [isActive, timeLeft, phase])

  // Hold timer - separate effect for the hold phase
  const startHoldTimer = () => {
    holdTimerRef.current = setInterval(() => {
      setHoldTime((prev) => {
        const newTime = prev + 0.1
        return Math.round(newTime * 10) / 10
      })
    }, 100)
  }

  const startTest = () => {
    setIsActive(true)
    setPhase("prepare")
    setTimeLeft(3)
    setHoldTime(0)
    setAttempt((prev) => prev + 1)
  }

  const stopTest = () => {
    setIsActive(false)
    setPhase("complete")
    if (holdTime > bestTime) {
      setBestTime(holdTime)
    }
    // Clear both timers
    if (countdownRef.current) {
      clearTimeout(countdownRef.current)
    }
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current)
    }
  }

  const resetTest = () => {
    setIsActive(false)
    setPhase("prepare")
    setTimeLeft(0)
    setHoldTime(0)
    setAttempt(0)
    // Clear both timers
    if (countdownRef.current) {
      clearTimeout(countdownRef.current)
    }
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current)
    }
  }

  const getCapacityRating = (time: number) => {
    if (time >= 60) return { rating: "Excellent", color: "text-green-600", bg: "bg-green-100" }
    if (time >= 45) return { rating: "Very Good", color: "text-blue-600", bg: "bg-blue-100" }
    if (time >= 30) return { rating: "Good", color: "text-yellow-600", bg: "bg-yellow-100" }
    if (time >= 20) return { rating: "Fair", color: "text-orange-600", bg: "bg-orange-100" }
    return { rating: "Needs Improvement", color: "text-red-600", bg: "bg-red-100" }
  }

  const currentRating = getCapacityRating(holdTime)
  const bestRating = getCapacityRating(bestTime)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/interactive-health-exercises">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Badge variant="secondary">Lung Capacity Test</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Section */}
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Breath Hold Test</CardTitle>
              <CardDescription>Measure how long you can hold your breath</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Animated Lungs */}
              <div className="relative w-80 h-80 flex items-center justify-center mb-8">
                {phase === "prepare" && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🫁</div>
                    <div className="text-2xl font-bold text-gray-700">Get Ready</div>
                    <div className="text-4xl font-bold text-blue-600">{timeLeft}</div>
                  </div>
                )}

                {phase === "inhale" && (
                  <div className="text-center">
                    <div
                      className="text-6xl mb-4 transition-transform duration-1000"
                      style={{ transform: `scale(${1 + (5 - timeLeft) * 0.2})` }}
                    >
                      🫁
                    </div>
                    <div className="text-2xl font-bold text-blue-600">Deep Breath In</div>
                    <div className="text-4xl font-bold text-blue-600">{timeLeft}</div>
                  </div>
                )}

                {phase === "hold" && (
                  <div className="text-center">
                    <div className="relative">
                      <div className="text-6xl mb-4 animate-pulse">🫁</div>
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-20"></div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">Hold Your Breath</div>
                    <div className="text-6xl font-bold text-green-600">{holdTime}s</div>
                  </div>
                )}

                {phase === "complete" && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <div className="text-2xl font-bold text-green-600">Test Complete!</div>
                    <div className="text-4xl font-bold text-green-600">{holdTime}s</div>
                    <div
                      className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${currentRating.bg} ${currentRating.color}`}
                    >
                      {currentRating.rating}
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                {!isActive && phase !== "complete" ? (
                  <Button onClick={startTest} size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    Start Test
                  </Button>
                ) : phase === "hold" ? (
                  <Button onClick={stopTest} variant="destructive" size="lg">
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                ) : null}

                <Button onClick={resetTest} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Current Results */}
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{holdTime}s</div>
                      <div className="text-sm text-gray-600">Current Hold</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{bestTime}s</div>
                      <div className="text-sm text-gray-600">Best Time</div>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700">Attempt #{attempt}</div>
                    {bestTime > 0 && (
                      <div
                        className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block ${bestRating.bg} ${bestRating.color}`}
                      >
                        {bestRating.rating}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacity Scale */}
            <Card>
              <CardHeader>
                <CardTitle>Capacity Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-100 rounded">
                    <span className="font-medium text-green-700">Excellent</span>
                    <span className="text-green-600">60+ seconds</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-100 rounded">
                    <span className="font-medium text-blue-700">Very Good</span>
                    <span className="text-blue-600">45-59 seconds</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-100 rounded">
                    <span className="font-medium text-yellow-700">Good</span>
                    <span className="text-yellow-600">30-44 seconds</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-100 rounded">
                    <span className="font-medium text-orange-700">Fair</span>
                    <span className="text-orange-600">20-29 seconds</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-100 rounded">
                    <span className="font-medium text-red-700">Needs Improvement</span>
                    <span className="text-red-600">Under 20 seconds</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  <li>1. Sit comfortably and relax</li>
                  <li>2. Click "Start Test" to begin</li>
                  <li>3. Take a deep breath when prompted</li>
                  <li>4. Hold your breath as long as comfortable</li>
                  <li>5. Click "Stop" when you need to breathe</li>
                  <li>6. Never push beyond your comfort zone</li>
                  <li>7. Stop if you feel dizzy or uncomfortable</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
