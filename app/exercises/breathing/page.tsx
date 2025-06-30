"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycle, setCycle] = useState(0)
  const [totalCycles] = useState(8)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const phaseConfig = {
    inhale: { duration: 4, next: "hold" as const, color: "bg-blue-500", text: "Breathe In" },
    hold: { duration: 4, next: "exhale" as const, color: "bg-yellow-500", text: "Hold" },
    exhale: { duration: 6, next: "inhale" as const, color: "bg-green-500", text: "Breathe Out" },
  }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      const currentPhase = phaseConfig[phase]
      const nextPhase = currentPhase.next

      if (phase === "exhale") {
        setCycle((prev) => prev + 1)
      }

      if (cycle >= totalCycles && phase === "exhale") {
        setIsActive(false)
        return
      }

      setPhase(nextPhase)
      setTimeLeft(phaseConfig[nextPhase].duration)
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, phase, cycle, totalCycles])

  const startExercise = () => {
    setIsActive(true)
    setPhase("inhale")
    setTimeLeft(4)
    setCycle(0)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimeLeft(4)
    setCycle(0)
  }

  const currentConfig = phaseConfig[phase]
  const progress = ((currentConfig.duration - timeLeft) / currentConfig.duration) * 100
  const overallProgress = (cycle / totalCycles) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/interactive-health-exercises">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Badge variant="secondary">Breathing Exercise</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Animation Section */}
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">4-4-6 Breathing Pattern</CardTitle>
              <CardDescription>Follow the animated circle to regulate your breathing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Animated Breathing Circle */}
              <div className="relative w-80 h-80 flex items-center justify-center mb-8">
                <div
                  className={`absolute rounded-full transition-all duration-1000 ease-in-out ${currentConfig.color} opacity-20`}
                  style={{
                    width: phase === "inhale" ? "320px" : phase === "hold" ? "320px" : "160px",
                    height: phase === "inhale" ? "320px" : phase === "hold" ? "320px" : "160px",
                  }}
                />
                <div
                  className={`absolute rounded-full transition-all duration-1000 ease-in-out ${currentConfig.color} opacity-40`}
                  style={{
                    width: phase === "inhale" ? "240px" : phase === "hold" ? "240px" : "120px",
                    height: phase === "inhale" ? "240px" : phase === "hold" ? "240px" : "120px",
                  }}
                />
                <div
                  className={`absolute rounded-full transition-all duration-1000 ease-in-out ${currentConfig.color}`}
                  style={{
                    width: phase === "inhale" ? "160px" : phase === "hold" ? "160px" : "80px",
                    height: phase === "inhale" ? "160px" : phase === "hold" ? "160px" : "80px",
                  }}
                />

                {/* Center Text */}
                <div className="text-center z-10">
                  <div className="text-3xl font-bold text-white mb-2">{currentConfig.text}</div>
                  <div className="text-6xl font-bold text-white">{timeLeft}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Current Phase</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                {!isActive ? (
                  <Button onClick={startExercise} size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={pauseExercise} variant="outline" size="lg">
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                )}
                <Button onClick={resetExercise} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Session Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Cycles Completed</span>
                      <span>
                        {cycle} / {totalCycles}
                      </span>
                    </div>
                    <Progress value={overallProgress} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4s</div>
                      <div className="text-sm text-gray-600">Inhale</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">4s</div>
                      <div className="text-sm text-gray-600">Hold</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">6s</div>
                      <div className="text-sm text-gray-600">Exhale</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Reduces stress and anxiety
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Improves focus and concentration
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Lowers blood pressure
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Enhances sleep quality
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Boosts immune system
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  <li>1. Sit comfortably with your back straight</li>
                  <li>2. Place one hand on your chest, one on your belly</li>
                  <li>3. Follow the animated circle</li>
                  <li>4. Breathe in for 4 seconds as circle expands</li>
                  <li>5. Hold for 4 seconds as circle stays large</li>
                  <li>6. Breathe out for 6 seconds as circle contracts</li>
                  <li>7. Complete 8 full cycles</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
