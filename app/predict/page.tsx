"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, AlertTriangle, ArrowLeft, Brain, Calendar, Heart, Thermometer, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function PredictPage() {
  const [step, setStep] = useState(1)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)

  // New states for inputs from step 2 form fields
  const [additionalSymptoms, setAdditionalSymptoms] = useState("")
  const [conditions, setConditions] = useState("")
  const [medications, setMedications] = useState("")
  const [familyHistory, setFamilyHistory] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")

  const commonSymptoms = [
    "Fever",
    "Headache",
    "Cough",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Chest Pain",
    "Shortness of Breath",
    "Abdominal Pain",
    "Joint Pain",
    "Skin Rash",
    "Sore Throat",
    "Runny Nose",
    "Muscle Aches",
    "None"
  ]

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/predict-disease", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms,
          medicalHistory: {
            additionalSymptoms,
            conditions,
            medications,
            familyHistory,
          },
          personalInfo: {
            age,
            gender,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze symptoms")
      }

      const result = await response.json()
      setPrediction(result)
      setStep(3)
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
      // Fallback to mock data if API fails
      setPrediction({
        primaryDiagnosis: "Analysis Error - Please Try Again",
        confidence: 0,
        riskLevel: "Unknown",
        recommendations: ["Please consult with a healthcare professional", "Try the analysis again"],
        futureOutlook: {
          withTreatment: "Professional medical evaluation recommended",
          withoutTreatment: "Symptoms should be evaluated by a doctor",
        },
        suggestedTests: ["Complete medical examination"],
        urgency: "Consult healthcare provider",
      })
      setStep(3)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Disease Prediction</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Thermometer className="h-6 w-6 mr-2 text-red-500" />
                Current Symptoms
              </CardTitle>
              <CardDescription>Select all symptoms you're currently experiencing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonSymptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={symptoms.includes(symptom)}
                      onCheckedChange={() => handleSymptomToggle(symptom)}
                    />
                    <Label htmlFor={symptom} className="text-sm">
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional">Additional Symptoms</Label>
                <Textarea
                  id="additional"
                  placeholder="Describe any other symptoms you're experiencing..."
                  rows={3}
                  value={additionalSymptoms}
                  onChange={(e) => setAdditionalSymptoms(e.target.value)}
                />

              </div>

              <Button onClick={() => setStep(2)} className="w-full" disabled={symptoms.length === 0}>
                Continue to Medical History
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-blue-500" />
                Medical History & Information
              </CardTitle>
              <CardDescription>Provide additional information for more accurate predictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter your age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" placeholder="Male/Female/Other" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Existing Medical Conditions</Label>
                <Textarea
                  id="conditions"
                  placeholder="List any chronic conditions, allergies, or ongoing health issues..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea id="medications" placeholder="List all medications you're currently taking..." rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="family-history">Family Medical History</Label>
                <Textarea id="family-history" placeholder="Any relevant family medical history..." rows={3} />
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleAnalyze} className="flex-1">
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold mb-2">Analyzing Your Health Data</h3>
                  <p className="text-gray-600 mb-4">
                    Our AI is processing your symptoms, medical history, and real-time data...
                  </p>
                  <Progress value={75} className="w-full max-w-md mx-auto" />
                </CardContent>
              </Card>
            ) : (
              prediction && (
                <>
                  {/* Primary Diagnosis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Brain className="h-6 w-6 mr-2 text-blue-600" />
                          AI Prediction Results
                        </span>
                        <Badge variant={prediction.riskLevel === "Low" ? "secondary" : "destructive"}>
                          {prediction.riskLevel} Risk
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Primary Diagnosis: {prediction.primaryDiagnosis}
                          </h3>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                            <Progress value={prediction.confidence} className="flex-1 max-w-xs" />
                            <span className="text-sm font-medium ml-2">{prediction.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Future Predictions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                        Future Health Outlook
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">With Proper Treatment</h4>
                          <p className="text-green-700">{prediction?.futureOutlook?.withTreatment}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h4 className="font-semibold text-red-800 mb-2">Without Treatment</h4>
                          <p className="text-red-700">{prediction?.futureOutlook?.withoutTreatment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="h-6 w-6 mr-2 text-red-500" />
                        Treatment Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {prediction?.recommendations?.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Suggested Tests */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-6 w-6 mr-2 text-purple-600" />
                        Suggested Medical Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {prediction?.suggestedTests?.map((test: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-6 w-6 mr-2 text-green-600" />
                        Food Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {prediction?.foodRecommendations?.map((food: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-6 w-6 mr-2 text-red-600" />
                        Foods to Avoid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {prediction?.foodsToAvoid?.map((food: string, index: number) => (
                          <Badge key={index} variant="destructive">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-6 w-6 mr-2 text-blue-600" />
                        Drugs or Medicines
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {prediction?.drugsOrMedicines?.map((drug: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {drug}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-6 w-6 mr-2 text-amber-600" />
                        Remedies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {prediction?.remedies?.map((remedy: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {remedy}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>



                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/doctors" className="flex-1">
                      <Button className="w-full">Find Doctors Near Me</Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep(1)
                        setPrediction(null)
                      }}
                    >
                      New Prediction
                    </Button>
                  </div>

                  {/* Disclaimer */}
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-orange-800">
                          <strong>Medical Disclaimer:</strong> This AI prediction is for informational purposes only and
                          should not replace professional medical advice. Please consult with a qualified healthcare
                          provider for proper diagnosis and treatment.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
} 