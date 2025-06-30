"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"

export default function BloodPressureControl() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [timeLeft, setTimeLeft] = useState(6)
  const [cycle, setCycle] = useState(0)
  const [totalCycles] = useState(10)
  const [heartRate, setHeartRate] = useState(72)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const phaseConfig = {
    inhale: { duration: 6, next: "hold" as const, color: "bg-blue-500", text: "Breathe In Slowly" },
    hold: { duration: 2, next: "exhale" as const, color: "bg-yellow-500", text: "Hold Gently" },
    exhale: { duration: 8, next: "inhale" as const, color: "bg-green-500", text: "Breathe Out Slowly" },
  }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        // Simulate heart rate changes during breathing
        updateHeartRate()
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

  const updateHeartRate = () => {
    // Simulate heart rate reduction during the exercise
    const baseRate = 72
    const reduction = Math.min(cycle * 2, 12) // Max 12 bpm reduction
    const variation = Math.sin(Date.now() / 1000) * 2 // Small natural variation
    setHeartRate(Math.round(baseRate - reduction + variation))
  }

  const startExercise = () => {
    setIsActive(true)
    setPhase("inhale")
    setTimeLeft(6)
    setCycle(0)
    setHeartRate(72)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimeLeft(6)
    setCycle(0)
    setHeartRate(72)
  }

  const currentConfig = phaseConfig[phase]
  const progress = ((currentConfig.duration - timeLeft) / currentConfig.duration) * 100
  const overallProgress = (cycle / totalCycles) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/interactive-health-exercises">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Badge variant="secondary">Blood Pressure Control</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exercise Section */}
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">6-2-8 Breathing Pattern</CardTitle>
              <CardDescription>Slow, controlled breathing to lower blood pressure</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Animated Heart and Breathing Circle */}
              <div className="relative w-80 h-80 flex items-center justify-center mb-8">
                {/* Breathing Circle */}
                <div
                  className={`absolute rounded-full transition-all duration-1000 ease-in-out ${currentConfig.color} opacity-20`}
                  style={{
                    width: phase === "inhale" ? "300px" : phase === "hold" ? "300px" : "180px",
                    height: phase === "inhale" ? "300px" : phase === "hold" ? "300px" : "180px",
                  }}
                />
                <div
                  className={`absolute rounded-full transition-all duration-1000 ease-in-out ${currentConfig.color} opacity-40`}
                  style={{
                    width: phase === "inhale" ? "220px" : phase === "hold" ? "220px" : "140px",
                    height: phase === "inhale" ? "220px" : phase === "hold" ? "220px" : "140px",
                  }}
                />

                {/* Center Content */}
                <div className="text-center z-10">
                  <div className="text-4xl mb-2 animate-pulse">❤️</div>
                  <div className="text-xl font-bold text-white mb-2">{currentConfig.text}</div>
                  <div className="text-5xl font-bold text-white mb-2">{timeLeft}</div>
                  <div className="text-sm text-white opacity-80">HR: {heartRate} bpm</div>
                </div>
              </div>

              {/* Phase Progress */}
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
            {/* Session Progress */}
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

                  {/* Vital Signs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <Heart className="h-6 w-6 text-red-500 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-red-600">{heartRate}</div>
                      <div className="text-xs text-gray-600">Heart Rate (bpm)</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.max(120 - cycle * 2, 110)}/{Math.max(80 - cycle, 70)}
                      </div>
                      <div className="text-xs text-gray-600">BP (mmHg)</div>
                    </div>
                  </div>

                  {/* Breathing Pattern */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">6s</div>
                      <div className="text-xs text-gray-600">Inhale</div>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <div className="text-lg font-bold text-yellow-600">2s</div>
                      <div className="text-xs text-gray-600">Hold</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">8s</div>
                      <div className="text-xs text-gray-600">Exhale</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Activates parasympathetic nervous system
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Reduces stress hormones (cortisol)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Improves heart rate variability
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Relaxes blood vessel walls
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Can reduce BP by 5-10 mmHg
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  <li>1. Sit comfortably with feet flat on floor</li>
                  <li>2. Place one hand on chest, one on belly</li>
                  <li>3. Breathe in slowly through nose for 6 seconds</li>
                  <li>4. Hold breath gently for 2 seconds</li>
                  <li>5. Exhale slowly through mouth for 8 seconds</li>
                  <li>6. Focus on belly rising and falling</li>
                  <li>7. Complete 10 full cycles</li>
                  <li>8. Practice daily for best results</li>
                </ol>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Important Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-700">
                  This exercise can help manage blood pressure but should not replace medical treatment. Always consult
                  your healthcare provider for blood pressure management and continue taking prescribed medications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
