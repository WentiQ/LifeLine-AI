"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Square, RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HiccupRelief() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"prepare" | "inhale" | "hold" | "complete">("prepare")
  const [timeLeft, setTimeLeft] = useState(0)
  const [holdTime, setHoldTime] = useState(0)
  const [round, setRound] = useState(0)
  const [totalRounds] = useState(3)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const phaseConfig = {
    prepare: { duration: 3, next: "inhale" as const, instruction: "Get ready to take a deep breath" },
    inhale: { duration: 5, next: "hold" as const, instruction: "Take the deepest breath you can" },
    hold: { duration: 15, next: "complete" as const, instruction: "Hold your breath as long as comfortable" },
    complete: { duration: 0, next: "prepare" as const, instruction: "Great! Take a moment to breathe normally" },
  }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        if (phase === "hold") {
          setHoldTime((prev) => prev + 1)
        }
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      const currentPhase = phaseConfig[phase]
      const nextPhase = currentPhase.next

      if (phase === "hold") {
        setPhase("complete")
        setRound((prev) => prev + 1)
        if (round + 1 >= totalRounds) {
          setIsActive(false)
          return
        }
      } else if (phase === "complete") {
        // Wait for user to start next round
        setIsActive(false)
        setPhase("prepare")
      } else {
        setPhase(nextPhase)
        setTimeLeft(phaseConfig[nextPhase].duration)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, phase, round, totalRounds])

  const startExercise = () => {
    if (phase === "complete" && round < totalRounds) {
      setPhase("prepare")
      setTimeLeft(3)
      setHoldTime(0)
    } else if (round === 0) {
      setPhase("prepare")
      setTimeLeft(3)
      setHoldTime(0)
      setRound(0)
    }
    setIsActive(true)
  }

  const stopHold = () => {
    if (phase === "hold") {
      setIsActive(false)
      setPhase("complete")
      setRound((prev) => prev + 1)
    }
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase("prepare")
    setTimeLeft(0)
    setHoldTime(0)
    setRound(0)
  }

  const currentConfig = phaseConfig[phase]
  const overallProgress = (round / totalRounds) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/interactive-health-exercises">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Badge variant="secondary">Hiccup Relief</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exercise Section */}
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Breath Hold Method</CardTitle>
              <CardDescription>Natural hiccup relief through controlled breathing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Animation Area */}
              <div className="relative w-80 h-80 flex items-center justify-center mb-8">
                {phase === "prepare" && (
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🫁</div>
                    <div className="text-2xl font-bold text-orange-600">Get Ready</div>
                    <div className="text-4xl font-bold text-orange-600">{timeLeft}</div>
                    <div className="text-sm text-gray-600 mt-2">
                      Round {round + 1} of {totalRounds}
                    </div>
                  </div>
                )}

                {phase === "inhale" && (
                  <div className="text-center">
                    <div
                      className="text-6xl mb-4 transition-transform duration-1000"
                      style={{ transform: `scale(${1 + (5 - timeLeft) * 0.3})` }}
                    >
                      🫁
                    </div>
                    <div className="text-2xl font-bold text-blue-600">Deep Breath In</div>
                    <div className="text-4xl font-bold text-blue-600">{timeLeft}</div>
                    <div className="text-sm text-gray-600 mt-2">Fill your lungs completely</div>
                  </div>
                )}

                {phase === "hold" && (
                  <div className="text-center">
                    <div className="relative">
                      <div className="text-6xl mb-4">🤐</div>
                      <div className="absolute inset-0 rounded-full border-4 border-yellow-500 animate-pulse opacity-30"></div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">Hold Your Breath</div>
                    <div className="text-6xl font-bold text-yellow-600">{holdTime}s</div>
                    <div className="text-sm text-gray-600 mt-2">Hold as long as comfortable</div>
                  </div>
                )}

                {phase === "complete" && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">{round >= totalRounds ? "🎉" : "✅"}</div>
                    <div className="text-2xl font-bold text-green-600">
                      {round >= totalRounds ? "All Done!" : "Round Complete!"}
                    </div>
                    <div className="text-lg text-green-600">Held for {holdTime} seconds</div>
                    <div className="text-sm text-gray-600 mt-2">
                      {round >= totalRounds
                        ? "Check if hiccups are gone!"
                        : `Round ${round} of ${totalRounds} complete`}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="w-full mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>
                    Round {round} of {totalRounds}
                  </span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                {!isActive && (phase === "prepare" || phase === "complete") && round < totalRounds ? (
                  <Button onClick={startExercise} size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    {round === 0 ? "Start Exercise" : "Next Round"}
                  </Button>
                ) : phase === "hold" ? (
                  <Button onClick={stopHold} variant="destructive" size="lg">
                    <Square className="h-5 w-5 mr-2" />
                    Can't Hold Longer
                  </Button>
                ) : null}

                <Button onClick={resetExercise} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>The Science:</strong> Hiccups are caused by involuntary spasms of the diaphragm. Holding
                    your breath increases CO2 levels in your blood, which can help reset the diaphragm's rhythm.
                  </p>
                  <p>
                    <strong>The Method:</strong> Take the deepest breath possible and hold it for as long as
                    comfortable. The increased pressure and CO2 buildup often stops hiccups immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Step-by-Step Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  <li>1. Sit or stand comfortably</li>
                  <li>2. When prompted, take the deepest breath you can</li>
                  <li>3. Hold your breath for as long as comfortable</li>
                  <li>4. Don't push beyond your comfort zone</li>
                  <li>5. Release when you need to breathe</li>
                  <li>6. Repeat 2-3 times if hiccups persist</li>
                  <li>7. Check if hiccups have stopped</li>
                </ol>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                    <span>Try to hold your breath for at least 10-15 seconds</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                    <span>If one round doesn't work, wait 30 seconds and try again</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                    <span>Never hold your breath until you feel faint</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <span>This method works for most people within 1-3 attempts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Success Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
                  <div className="text-sm text-gray-600">Success rate for stopping hiccups with this method</div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700">
                      Most effective when performed within the first few minutes of hiccup onset
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
