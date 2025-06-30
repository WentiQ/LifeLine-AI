"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, AlertTriangle, Activity } from "lucide-react"

const commonSymptoms = [
  "Fever", "Headache", "Cough", "Fatigue", "Nausea", "Dizziness", "Chest Pain",
  "Shortness of Breath", "Abdominal Pain", "Joint Pain", "Skin Rash", "Sore Throat",
  "Runny Nose", "Muscle Aches"
]

export default function FreePredictPage() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setPrediction(null)
    try {
      const response = await fetch("/api/free-disease-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      })
      const result = await response.json()
      setPrediction(result)
    } catch {
      setPrediction({
        primaryDiagnosis: "Analysis Error",
        confidence: 0,
        recommendations: ["Please try again later."],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-blue-600" />
            Free Disease Prediction
          </CardTitle>
          <CardDescription>
            Select your symptoms and get an instant AI-based prediction. No personal info required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {commonSymptoms.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom}
                  checked={symptoms.includes(symptom)}
                  onCheckedChange={() => handleSymptomToggle(symptom)}
                />
                <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
              </div>
            ))}
          </div>
          <Button
            className="w-full mb-4"
            disabled={symptoms.length === 0 || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? "Analyzing..." : "Predict Disease"}
          </Button>

          {prediction && (
            <div className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-600" />
                    Prediction Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold text-lg mb-2">
                      Primary Diagnosis: {prediction.primaryDiagnosis}
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                      <Progress value={prediction.confidence} className="flex-1 max-w-xs" />
                      <span className="text-sm font-medium ml-2">{prediction.confidence}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {prediction.recommendations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-green-600" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc ml-5">
                      {prediction.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}