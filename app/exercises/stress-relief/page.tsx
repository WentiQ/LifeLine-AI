"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, ArrowLeft, Brain } from "lucide-react"
import Link from "next/link"

export default function StressRelief() {
  const [isActive, setIsActive] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [phase, setPhase] = useState<"breathe" | "hold" | "release">("breathe")
  const [timeLeft, setTimeLeft] = useState(0)
  const [cycle, setCycle] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const exercises = [
    {
      name: "Progressive Muscle Relaxation",
      duration: 180, // 3 minutes
      cycles: 6,
      instruction: "Tense and release different muscle groups",
    },
    {
      name: "4-7-8 Breathing",
      duration: 120, // 2 minutes
      cycles: 8,
      instruction: "Inhale 4, hold 7, exhale 8 seconds",
    },
    {
      name: "Mindful Body Scan",
      duration: 300, // 5 minutes
      cycles: 1,
      instruction: "Focus awareness on each part of your body",
    },
  ]

  const breathingPattern = {
    breathe: { duration: 4, next: "hold" as const, color: "bg-blue-500", text: "Breathe In" },
    hold: { duration: 7, next: "release" as const, color: "bg-yellow-500", text: "Hold" },
    release: { duration: 8, next: "breathe" as const, color: "bg-green-500", text: "Breathe Out" },
  }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      if (currentExercise === 1) {
        // 4-7-8 Breathing
        const currentPhase = breathingPattern[phase]
        const nextPhase = currentPhase.next

        if (phase === "release") {
          setCycle((prev) => prev + 1)
          if (cycle + 1 >= exercises[currentExercise].cycles) {
            nextExercise()
            return
          }
        }

        setPhase(nextPhase)
        setTimeLeft(breathingPattern[nextPhase].duration)
      } else {
        nextExercise()
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, phase, cycle, currentExercise])

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise((prev) => prev + 1)
      setTimeLeft(exercises[currentExercise + 1].duration)
      setCycle(0)
      setPhase("breathe")
    } else {
      setIsActive(false)
    }
  }

  const startExercise = () => {
    setIsActive(true)
    setCurrentExercise(0)
    setTimeLeft(exercises[0].duration)
    setCycle(0)
    setPhase("breathe")
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentExercise(0)
    setTimeLeft(0)
    setCycle(0)
    setPhase("breathe")
  }

  const currentEx = exercises[currentExercise]
  const exerciseProgress = ((currentEx.duration - timeLeft) / currentEx.duration) * 100
  const overallProgress = (currentExercise * 100 + exerciseProgress) / exercises.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/interactive-health-exercises">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back 
            </Button>
          </Link>
          <Badge variant="secondary">Stress Relief</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exercise Area */}
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">{currentEx.name}</CardTitle>
              <CardDescription>{currentEx.instruction}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Animation Area */}
              <div className="relative w-80 h-80 flex items-center justify-center mb-8">
                {currentExercise === 0 && ( // Progressive Muscle Relaxation
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🧘‍♀️</div>
                    <div className="text-2xl font-bold text-purple-600">Relax & Release</div>
                    <div className="text-4xl font-bold text-purple-600">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Focus on releasing tension</div>
                  </div>
                )}

                {currentExercise === 1 && ( // 4-7-8 Breathing
                  <div className="text-center">
                    <div
                      className={`w-40 h-40 rounded-full transition-all duration-1000 ease-in-out ${breathingPattern[phase].color} opacity-60 mb-4`}
                      style={{
                        transform: phase === "breathe" ? "scale(1.2)" : phase === "hold" ? "scale(1.2)" : "scale(0.8)",
                      }}
                    />
                    <div className="text-2xl font-bold text-indigo-600">{breathingPattern[phase].text}</div>
                    <div className="text-4xl font-bold text-indigo-600">{timeLeft}</div>
                    <div className="text-sm text-gray-600 mt-2">
                      Cycle {cycle + 1} of {currentEx.cycles}
                    </div>
                  </div>
                )}

                {currentExercise === 2 && ( // Body Scan
                  <div className="text-center">
                    <div className="text-6xl mb-4">🧠</div>
                    <div className="text-2xl font-bold text-pink-600">Body Scan</div>
                    <div className="text-4xl font-bold text-pink-600">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Scan from head to toe</div>
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="w-full mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>
                    Exercise {currentExercise + 1} of {exercises.length}
                  </span>
                  <span>{Math.round(exerciseProgress)}%</span>
                </div>
                <Progress value={exerciseProgress} className="h-2" />
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
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Session Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} />
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-semibold text-purple-700">{currentEx.name}</div>
                    <div className="text-sm text-gray-600">{currentEx.instruction}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Stress Relief Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 text-purple-500 mr-3" />
                    Reduces cortisol levels
                  </li>
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 text-blue-500 mr-3" />
                    Lowers blood pressure
                  </li>
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 text-green-500 mr-3" />
                    Improves sleep quality
                  </li>
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 text-orange-500 mr-3" />
                    Enhances focus and clarity
                  </li>
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 text-red-500 mr-3" />
                    Boosts immune system
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Exercise Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Exercise Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        index === currentExercise
                          ? "bg-purple-100 border-2 border-purple-300"
                          : index < currentExercise
                            ? "bg-green-100"
                            : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-sm text-gray-500">
                          {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{exercise.instruction}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
