"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Camera, Upload, AlertTriangle, Brain, Eye, Zap } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"

export default function PhotoDiagnosisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setAnalysis(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)

    try {
      // Convert image to base64 if it's not already
      const base64Image = selectedImage.split(",")[1] || selectedImage

      const response = await fetch("/api/analyze-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          additionalInfo: "Patient uploaded image for visual health analysis",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (error) {
      console.error("Error analyzing image:", error)
      // Fallback analysis if API fails
      setAnalysis({
        condition: "Analysis Error - Please Try Again",
        confidence: 0,
        severity: "Unknown",
        description:
          "Unable to analyze the image at this time. Please try again or consult with a healthcare professional.",
        recommendations: ["Consult with a dermatologist", "Try uploading a clearer image"],
        whenToSeeDoctor: ["If symptoms persist", "If you have concerns about the condition"],
        similarConditions: [],
        urgency: "Non-urgent",
        homeCareTips: ["Keep area clean", "Avoid irritation"],
        preventionTips: ["Maintain good hygiene", "Protect from sun exposure"],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysis(null)
    setIsAnalyzing(false)
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
              <h1 className="text-2xl font-bold text-gray-900">Photo Diagnosis</h1>
              <p className="text-gray-600">AI-powered visual health analysis</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedImage ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Camera className="h-6 w-6 mr-2 text-blue-600" />
                Upload or Capture Photo
              </CardTitle>
              <CardDescription>Take a clear photo of the affected area for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 flex-col space-y-2"
                  variant="outline"
                >
                  <Upload className="h-8 w-8" />
                  <span>Upload from Gallery</span>
                </Button>

                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="h-32 flex-col space-y-2"
                  variant="outline"
                >
                  <Camera className="h-8 w-8" />
                  <span>Take Photo</span>
                </Button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Guidelines */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Photo Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensure good lighting and clear focus</li>
                    <li>• Take photo from appropriate distance</li>
                    <li>• Include surrounding healthy skin for comparison</li>
                    <li>• Avoid shadows or reflections</li>
                    <li>• Multiple angles may provide better analysis</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="h-6 w-6 mr-2 text-green-600" />
                    Image Preview
                  </span>
                  <Button variant="outline" size="sm" onClick={resetAnalysis}>
                    Upload New Image
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Medical photo for analysis"
                    className="max-w-full max-h-96 rounded-lg shadow-lg"
                  />
                </div>
                {!analysis && !isAnalyzing && (
                  <div className="mt-6 text-center">
                    <Button onClick={handleAnalyze} size="lg">
                      <Brain className="h-5 w-5 mr-2" />
                      Analyze with AI
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold mb-2">Analyzing Image</h3>
                  <p className="text-gray-600 mb-4">
                    Our AI is examining the image for visual patterns and symptoms...
                  </p>
                  <Progress value={85} className="w-full max-w-md mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-6">
                {/* Primary Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Zap className="h-6 w-6 mr-2 text-purple-600" />
                        AI Analysis Results
                      </span>
                      <Badge variant={analysis.severity.includes("Mild") ? "secondary" : "destructive"}>
                        {analysis.severity}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Detected Condition: {analysis.condition}
                        </h3>
                        <div className="flex items-center mb-3">
                          <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                          <Progress value={analysis.confidence} className="flex-1 max-w-xs" />
                          <span className="text-sm font-medium ml-2">{analysis.confidence}%</span>
                        </div>
                        <p className="text-gray-700">{analysis.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* When to See Doctor */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-800">When to Consult a Doctor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.whenToSeeDoctor.map((item: string, index: number) => (
                        <li key={index} className="flex items-start text-orange-800">
                          <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                            !
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Similar Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Other Possible Conditions</CardTitle>
                    <CardDescription>Alternative diagnoses to consider (lower probability)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.similarConditions.map((condition: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{condition.name}</span>
                          <Badge variant="outline">{condition.probability}% match</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/doctors" className="flex-1">
                    <Button className="w-full">Find Dermatologists</Button>
                  </Link>
                  <Button variant="outline" onClick={resetAnalysis}>
                    Analyze New Photo
                  </Button>
                </div>

                {/* Disclaimer */}
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-red-800">
                        <strong>Important Disclaimer:</strong> This AI analysis is for informational purposes only and
                        should not replace professional medical diagnosis. Please consult with a qualified dermatologist
                        or healthcare provider for accurate diagnosis and treatment. If you have concerns about your
                        condition, seek medical attention promptly.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
