"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"

export default function EyeExercise() {
  const [isActive, setIsActive] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [dotPosition, setDotPosition] = useState({ x: 50, y: 50 })
  const [blinkCount, setBlinkCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const exercises = [
    {
      name: "Focus Shifting",
      duration: 30,
      instruction: "Follow the moving dot with your eyes",
      type: "tracking",
    },
    {
      name: "Blinking Exercise",
      duration: 20,
      instruction: "Blink slowly and deliberately",
      type: "blinking",
    },
    {
      name: "Figure 8 Tracking",
      duration: 30,
      instruction: "Follow the dot in a figure-8 pattern",
      type: "figure8",
    },
    {
      name: "Distance Focus",
      duration: 20,
      instruction: "Alternate focus between near and far",
      type: "distance",
    },
    {
      name: "Palming Relaxation",
      duration: 30,
      instruction: "Cover eyes with palms and relax",
      type: "palming",
    },
  ]

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        updateExerciseAnimation()
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise((prev) => prev + 1)
        setTimeLeft(exercises[currentExercise + 1].duration)
      } else {
        setIsActive(false)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, currentExercise])

  const updateExerciseAnimation = () => {
    const exercise = exercises[currentExercise]
    const progress = (exercise.duration - timeLeft) / exercise.duration

    switch (exercise.type) {
      case "tracking":
        // Horizontal movement
        setDotPosition({
          x: 20 + 60 * Math.sin(progress * Math.PI * 4),
          y: 50,
        })
        break
      case "figure8":
        // Figure-8 pattern
        const angle = progress * Math.PI * 4
        setDotPosition({
          x: 50 + 30 * Math.sin(angle),
          y: 50 + 20 * Math.sin(angle * 2),
        })
        break
      case "distance":
        // Pulsing for focus change
        const scale = 0.5 + 0.5 * Math.sin(progress * Math.PI * 6)
        setDotPosition({ x: 50, y: 50 })
        break
      case "blinking":
        if (Math.floor(progress * 20) > blinkCount) {
          setBlinkCount(Math.floor(progress * 20))
        }
        break
    }
  }

  const startExercise = () => {
    setIsActive(true)
    setCurrentExercise(0)
    setTimeLeft(exercises[0].duration)
    setBlinkCount(0)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentExercise(0)
    setTimeLeft(0)
    setDotPosition({ x: 50, y: 50 })
    setBlinkCount(0)
  }

  const currentEx = exercises[currentExercise]
  const overallProgress =
    (currentExercise * 100 + ((currentEx.duration - timeLeft) / currentEx.duration) * 100) / exercises.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/interactive-health-exercises">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Badge variant="secondary">Eye Exercise</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exercise Area */}
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">{currentEx.name}</CardTitle>
              <CardDescription>{currentEx.instruction}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Exercise Animation Area */}
              <div className="relative w-80 h-80 border-2 border-dashed border-gray-300 rounded-lg mb-8 overflow-hidden bg-white">
                {currentEx.type === "tracking" || currentEx.type === "figure8" || currentEx.type === "distance" ? (
                  <div
                    className="absolute w-6 h-6 bg-red-500 rounded-full transition-all duration-1000 ease-in-out"
                    style={{
                      left: `${dotPosition.x}%`,
                      top: `${dotPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                      scale:
                        currentEx.type === "distance" ? 0.5 + 0.5 * Math.sin((currentEx.duration - timeLeft) * 0.5) : 1,
                    }}
                  />
                ) : currentEx.type === "blinking" ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-8xl mb-4">{blinkCount % 2 === 0 ? "👁️" : "😑"}</div>
                      <div className="text-2xl font-bold text-indigo-600">Blink #{blinkCount + 1}</div>
                    </div>
                  </div>
                ) : currentEx.type === "palming" ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🙈</div>
                      <div className="text-2xl font-bold text-purple-600">Relax & Rest</div>
                    </div>
                  </div>
                ) : null}

                {/* Timer Display */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
                  {timeLeft}s
                </div>
              </div>

              {/* Exercise Progress */}
              <div className="w-full mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>
                    Exercise {currentExercise + 1} of {exercises.length}
                  </span>
                  <span>{Math.round(((currentEx.duration - timeLeft) / currentEx.duration) * 100)}%</span>
                </div>
                <Progress value={((currentEx.duration - timeLeft) / currentEx.duration) * 100} className="h-2" />
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
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-lg font-semibold text-indigo-700">{currentEx.name}</div>
                    <div className="text-sm text-gray-600">{currentEx.instruction}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercise List */}
            <Card>
              <CardHeader>
                <CardTitle>Exercise Sequence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === currentExercise
                          ? "bg-indigo-100 border-2 border-indigo-300"
                          : index < currentExercise
                            ? "bg-green-100"
                            : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                            index === currentExercise
                              ? "bg-indigo-500 text-white"
                              : index < currentExercise
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {index < currentExercise ? "✓" : index + 1}
                        </div>
                        <span className="font-medium">{exercise.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{exercise.duration}s</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Eye className="h-4 w-4 text-blue-500 mr-3" />
                    Reduces eye strain and fatigue
                  </li>
                  <li className="flex items-center">
                    <Eye className="h-4 w-4 text-green-500 mr-3" />
                    Improves focus and concentration
                  </li>
                  <li className="flex items-center">
                    <Eye className="h-4 w-4 text-purple-500 mr-3" />
                    Strengthens eye muscles
                  </li>
                  <li className="flex items-center">
                    <Eye className="h-4 w-4 text-orange-500 mr-3" />
                    Prevents dry eyes
                  </li>
                  <li className="flex items-center">
                    <Eye className="h-4 w-4 text-red-500 mr-3" />
                    Enhances visual flexibility
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
