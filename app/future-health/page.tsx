"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  Calendar,
  Target,
  TrendingDown
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from "uuid"


interface Prediction {
  condition: string
  severity: "Mild" | "Moderate" | "Severe"
  probability: number
  description: string
  preventionSteps: string[]
}

interface Predictions {
  riskReduction: any
  longTerm: any
  mediumTerm: any
  habitImpact: {
    mostDangerous: string
    immediateRisks: string[]
    cumulativeEffects: string[]
  }
  shortTerm: {
    timeframe: string
    predictions: Prediction[]
  }
}

export default function FutureHealthPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictions, setPredictions] = useState<Predictions | null>(null)
  const [badHabits, setBadHabits] = useState<string[]>([])
  const [currentHealth, setCurrentHealth] = useState("")
  const [habituationPeriod, setHabituationPeriod] = useState("");
  const [timeframe, setTimeframe] = useState("")
  const [customHabit, setCustomHabit] = useState("")

  // Controlled select values for lifestyle
  const [exercise, setExercise] = useState("")
  const [diet, setDiet] = useState("")
  const [stress, setStress] = useState("")
  const [sleep, setSleep] = useState("")
  const [habitAdded, setHabitAdded] = useState(false)

  const [savedPredictions, setSavedPredictions] = useState<any[]>([])
  const [showSaved, setShowSaved] = useState(false)

  const searchParams = useSearchParams();


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
    "Irregular Sleep Schedule"
  ]

  const handleHabitToggle = (habit: string) => {
    setBadHabits((prev) =>
      prev.includes(habit)
        ? prev.filter((h) => h !== habit)
        : [...prev, habit]
    )
  }

  const handleAddCustomHabit = () => {
    const trimmed = customHabit.trim()
    if (trimmed && !badHabits.includes(trimmed)) {
      setBadHabits((prev) => [...prev, trimmed])
      setCustomHabit("")
      setHabitAdded(true)
      setTimeout(() => setHabitAdded(false), 2000) // Hide after 2 seconds
    }
  }


  const generatePredictions = async () => {
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/future-predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          badHabits,
          currentHealth,
          lifestyle: { exercise, diet, stress, sleep },
          timeframe
        })
      })

      if (!response.ok) throw new Error("Failed to generate predictions")

      const result = await response.json()
      setPredictions(result)
    } catch (error) {
      console.error("Error generating predictions:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSavePrediction = () => {
    if (predictions) {
      const newPrediction = {
        id: uuidv4(),
        savedAt: new Date().toISOString(),
        predictions,
        badHabits,
        currentHealth,
        habituationPeriod,
        exercise,
        diet,
        stress,
        sleep,
      }
      const updated = [newPrediction, ...savedPredictions]
      setSavedPredictions(updated)
      localStorage.setItem("savedFuturePredictions", JSON.stringify(updated))
      alert("Prediction saved! You can view it later even offline.")
    }
  }

  const handleShare = (pred: any) => {
    const url = `${window.location.origin}/future-health?share=${pred.id}`
    navigator.clipboard.writeText(url)
    alert("Sharable link copied to clipboard!")
  }

  const handleDeleteSaved = (idx: number) => {
    const updated = savedPredictions.filter((_, i) => i !== idx)
    setSavedPredictions(updated)
    localStorage.setItem("savedFuturePredictions", JSON.stringify(updated))
  }

  const handleDownloadPDF = (pred: any, idx: number) => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.jsPDF({ unit: "pt", format: "a4" });
      let y = 40;
      const left = 40;
      const wrapWidth = 500;
      const pageHeight = doc.internal.pageSize.height;

      function addSectionHeader(text: string, color: [number, number, number] = [33, 37, 41]) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(...color);
        doc.text(text, left, y);
        y += 24;
        doc.setTextColor(33, 37, 41);
      }
      function addTextBlock(label: string, value: string | string[] | undefined) {
        if (!value || (Array.isArray(value) && value.length === 0)) return;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(label, left, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        y += 14;
        let text = Array.isArray(value) ? value.join(", ") : value;
        const lines = doc.splitTextToSize(text, wrapWidth);
        lines.forEach((line: string) => {
          if (y > pageHeight - 40) { doc.addPage(); y = 40; }
          doc.text(line, left + 20, y);
          y += 14;
        });
        y += 4;
      }
      function addBulletList(items: string[] | undefined) {
        if (!items || items.length === 0) return;
        items.forEach((item) => {
          if (y > pageHeight - 40) { doc.addPage(); y = 40; }
          doc.circle(left + 8, y + 4, 3, "F");
          doc.text(item, left + 20, y + 8);
          y += 18;
        });
        y += 4;
      }

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Future Health Prediction Report", left, y);
      y += 30;
      addTextBlock("Saved At:", new Date(pred.savedAt).toLocaleString());

      addSectionHeader("User Input", [59, 130, 246]);
      addTextBlock("Bad Habits:", pred.badHabits);
      addTextBlock("Current Health:", pred.currentHealth);
      addTextBlock("Habituation Period:", pred.habituationPeriod);
      addTextBlock("Exercise:", pred.exercise);
      addTextBlock("Diet:", pred.diet);
      addTextBlock("Stress:", pred.stress);
      addTextBlock("Sleep:", pred.sleep);

      // Habit Impact
      addSectionHeader("Habit Impact Analysis", [239, 68, 68]);
      addTextBlock("Most Dangerous Habit:", pred.predictions?.habitImpact?.mostDangerous);
      addTextBlock("Immediate Risks:", "");
      addBulletList(pred.predictions?.habitImpact?.immediateRisks);
      addTextBlock("Cumulative Effects:", "");
      addBulletList(pred.predictions?.habitImpact?.cumulativeEffects);

      // Timeline
      ["shortTerm", "mediumTerm", "longTerm"].forEach((term) => {
        const section = pred.predictions?.[term];
        if (section) {
          addSectionHeader(
            `${term === "shortTerm" ? "Short" : term === "mediumTerm" ? "Medium" : "Long"} Term (${section.timeframe})`,
            term === "shortTerm" ? [37, 99, 235] : term === "mediumTerm" ? [251, 191, 36] : [239, 68, 68]
          );
          section.predictions?.forEach((p: any, i: number) => {
            addTextBlock(`Condition:`, p.condition);
            addTextBlock("Severity:", p.severity);
            addTextBlock("Probability:", `${p.probability}%`);
            addTextBlock("Description:", p.description);
            addTextBlock("Prevention Steps:", "");
            addBulletList(p.preventionSteps);
            y += 6;
          });
        }
      });

      // Risk Reduction
      addSectionHeader("Risk Reduction Opportunities", [34, 197, 94]);
      addTextBlock("If You Quit Now:", pred.predictions?.riskReduction?.ifQuitNow);
      addTextBlock("If You Continue:", pred.predictions?.riskReduction?.ifContinue);
      addTextBlock("Reversibility:", pred.predictions?.riskReduction?.reversibility);

      // Disclaimer
      y += 20;
      doc.setFontSize(10);
      doc.setTextColor(200, 100, 0);
      const disclaimer =
        "Medical Disclaimer: This AI prediction is for informational purposes only and should not replace professional medical advice.";
      const disclaimerLines = doc.splitTextToSize(disclaimer, wrapWidth);
      disclaimerLines.forEach((line: string) => {
        doc.text(line, left, y);
        y += 14;
      });

      doc.save(`future-health-${pred.savedAt || idx}.pdf`);
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedFuturePredictions")
      if (saved) setSavedPredictions(JSON.parse(saved))

      // Optional: support share link
      const shareId = searchParams?.get("share")
      if (shareId && saved) {
        const arr = JSON.parse(saved)
        const found = arr.find((p: any) => p.id === shareId)
        if (found) {
          setPredictions(found.predictions)
          setBadHabits(found.badHabits)
          setCurrentHealth(found.currentHealth)
          setHabituationPeriod(found.habituationPeriod)
          setExercise(found.exercise)
          setDiet(found.diet)
          setStress(found.stress)
          setSleep(found.sleep)
          setShowSaved(true)
        }
      }
    }
  }, [searchParams])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50">
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
          {isAnalyzing && !predictions ? (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingDown className="h-16 w-16 text-red-600 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Future Health</h3>
                <p className="text-gray-600 mb-4">
                  Our AI is reviewing your habits and health info to predict your future health...
                </p>
                <div className="w-full max-w-md mx-auto">
                  <div className="h-2.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-2.5 bg-blue-600 rounded-full animate-ripple"
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
          ) : !predictions ? (
            <div className="space-y-8">
          
              {/* Bad Habits Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="h-6 w-6 mr-2 text-red-600" />
                    Current Bad Habits
                  </CardTitle>
                  <CardDescription>Select and add your current bad habits</CardDescription>
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
                        <Label htmlFor={habit} className="text-sm">{habit}</Label>
                      </div>
                    ))}
                  </div>
                  {/* Custom Habit Input */}
                  <div className="mt-6">
                    <Label htmlFor="custom-habit">Add Custom Bad Habit</Label>
                    <div className="flex gap-2 mt-2">
                      <input
                        id="custom-habit"
                        type="text"
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g. Late-night snacking"
                        value={customHabit}
                        onChange={(e) => setCustomHabit(e.target.value)}
                      />
                      <Button onClick={handleAddCustomHabit}>Add</Button>
                      {habitAdded && (
                        <Badge variant="default" className="ml-2 bg-green-500 text-white">
                          Habit Added!
                        </Badge>
                      )}
                      
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Health Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-health">Current Health Conditions</Label>
                    <Textarea
                      id="current-health"
                      placeholder="Describe any current health conditions..."
                      value={currentHealth}
                      onChange={(e) => setCurrentHealth(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Exercise */}
                    <div className="space-y-2">
                      <Label htmlFor="exercise">Exercise Level</Label>
                      <Select value={exercise} onValueChange={setExercise}>
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

                    {/* Diet */}
                    <div className="space-y-2">
                      <Label htmlFor="diet">Diet Quality</Label>
                      <Select value={diet} onValueChange={setDiet}>
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

                    {/* Stress */}
                    <div className="space-y-2">
                      <Label htmlFor="stress">Stress Level</Label>
                      <Select value={stress} onValueChange={setStress}>
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

                    {/* Sleep */}
                    <div className="space-y-2">
                      <Label htmlFor="sleep">Sleep Quality</Label>
                      <Select value={sleep} onValueChange={setSleep}>
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
                    <Label htmlFor="habituationPeriod">Habituation Period</Label>
                    <Input
                      id="habituationPeriod"
                      type="text"
                      placeholder="e.g., 6 months, 2 years"
                      value={habituationPeriod}
                      onChange={(e) => setHabituationPeriod(e.target.value)}
                    />
                  </div>

                </CardContent>
              </Card>

              {/* Predict Button */}
              <div className="text-center">
                <Button
                  onClick={generatePredictions}
                  size="lg"
                  disabled={
                    isAnalyzing ||
                    badHabits.length === 0 ||
                    !exercise ||
                    !diet ||
                    !stress ||
                    !sleep ||
                    !habituationPeriod
                  }
                  className="px-8"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Predict My Future Health
                </Button>
              </div>

              {/* Saved Predictions - ONLY on first page, below the button */}
              {savedPredictions.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Saved Future Health Predictions</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedPredictions.map((pred, idx) => (
                      <Card key={pred.id || idx} className="relative border-2 border-gray-200 shadow-sm bg-white">
                        <CardContent className="py-4">
                          <div className="mb-2 text-xs text-gray-500">
                            Saved: {new Date(pred.savedAt).toLocaleString()}
                          </div>
                          <div className="font-bold mb-1">Most Dangerous Habit: {pred.predictions?.habitImpact?.mostDangerous}</div>
                          <div className="mb-2 text-sm">
                            Bad Habits: <span className="font-semibold">{pred.badHabits?.join(", ")}</span>
                          </div>
                          <Button
                            size="sm"
                            className="mr-2"
                            onClick={() => {
                              setPredictions(pred.predictions)
                              setBadHabits(pred.badHabits)
                              setCurrentHealth(pred.currentHealth)
                              setHabituationPeriod(pred.habituationPeriod)
                              setExercise(pred.exercise)
                              setDiet(pred.diet)
                              setStress(pred.stress)
                              setSleep(pred.sleep)
                              setShowSaved(true)
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="mr-2"
                            onClick={() => handleShare(pred)}
                          >
                            Share
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mr-2"
                            onClick={() => handleDownloadPDF(pred, idx)}
                          >
                            Download PDF
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSaved(idx)}
                          >
                            Delete
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Results display */}
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
                      <p className="text-red-700">{predictions.habitImpact?.mostDangerous}</p>
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

              {!showSaved && (
                <Button
                  variant="default"
                  onClick={handleSavePrediction}
                >
                  Save Prediction
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}
