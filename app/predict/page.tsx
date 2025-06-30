"use client"

import { Suspense, useEffect, useState } from "react"
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
import { useSearchParams } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import jsPDF from "jspdf"

export default function PredictPage() {
  const [step, setStep] = useState(1)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const [showSaved, setShowSaved] = useState(false) // NEW: To show saved prediction
  const [savedPredictions, setSavedPredictions] = useState<any[]>([])

  // New states for inputs from step 2 form fields
  const [additionalSymptoms, setAdditionalSymptoms] = useState("")
  const [conditions, setConditions] = useState("")
  const [medications, setMedications] = useState("")
  const [familyHistory, setFamilyHistory] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")

  const searchParams = useSearchParams();

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

  // On mount, check for share param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedPredictions")
      if (saved) setSavedPredictions(JSON.parse(saved))

      // Check for share param
      const shareId = searchParams?.get("share")
      if (shareId && saved) {
        const arr = JSON.parse(saved)
        const found = arr.find((p: any) => p.id === shareId)
        if (found) {
          setPrediction(found)
          setStep(3)
          setShowSaved(true)
        }
      }
    }
  }, [searchParams])

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setStep(3) // Show loading animation immediately

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

      // Log activity (removed invalid call to Activity)
      // You can implement your own logging here if needed
      // saveActivity({
      //   type: "prediction",
      //   title: "Disease Prediction Completed",
      //   description: `Predicted: ${result.primaryDiagnosis || "Unknown"}`,
      //   icon: "Brain",
      //   timestamp: Date.now(),
      // })
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
      setPrediction({
        primaryDiagnosis: "Analysis Error - Please Try Again",
        confidence: 0,
        riskLevel: "Unknown",
        possibleCauses: ["Insufficient data", "API error", "Please try again later"],
        recommendations: ["Please consult with a healthcare professional", "Try the analysis again"],
        futureOutlook: {
          withTreatment: "Professional medical evaluation recommended",
          withoutTreatment: "Symptoms should be evaluated by a doctor",
        },
        suggestedTests: ["Complete medical examination"],
        foodRecommendations: ["Better consult a nutritionist", "Avoid self-diagnosing"],
        foodsToAvoid: ["Better consult a nutritionist", "Avoid self-diagnosing"],
        drugsOrMedicines: [
          "Better consult a healthcare provider for medication advice",
          "Avoid self-medicating without professional advice",
        ],
        remedies: [
          "Better consult a healthcare provider for remedies",
          "Avoid self-medicating without professional advice",
        ],
        urgency: "Consult healthcare provider",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Save prediction to localStorage (as array, with id)
  const handleSavePrediction = () => {
    if (prediction) {
      const newPrediction = {
        ...prediction,
        savedAt: new Date().toISOString(),
        id: uuidv4(), // unique id for sharing
        // Add user input fields:
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
      }
      const updated = [newPrediction, ...savedPredictions]
      setSavedPredictions(updated)
      localStorage.setItem("savedPredictions", JSON.stringify(updated))
      alert("Prediction saved! You can view it later even offline.")
    }
  }

  // Share handler
  const handleShare = (pred: any) => {
    const url = `${window.location.origin}/predict?share=${pred.id}`
    navigator.clipboard.writeText(url)
    alert("Sharable link copied to clipboard!")
  }

  // View saved prediction handler
  const handleViewSaved = (pred: any) => {
    setPrediction(pred)
    setStep(3)
    setShowSaved(true)
  }

  // PDF Download handler
  const handleDownloadPDF = (pred: any, idx: number) => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.jsPDF({ unit: "pt", format: "a4" });
      const pageHeight = doc.internal.pageSize.height;
      let y = 40;
      const left = 40;
      const wrapWidth = 500;

      function addSectionHeader(text: string, color: [number, number, number] = [33, 37, 41]) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(...color);
        doc.text(text, left, y);
        y += 24;
        doc.setTextColor(33, 37, 41); // reset to default
      }

      function addSubHeader(text: string) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(text, left, y);
        y += 18;
      }

      function addBadge(text: string, color: [number, number, number]) {
        doc.setFillColor(...color);
        doc.roundedRect(left, y - 12, doc.getTextWidth(text) + 20, 20, 6, 6, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(text, left + 10, y + 3);
        doc.setTextColor(33, 37, 41);
        y += 28;
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
          if (y > pageHeight - 40) {
            doc.addPage();
            y = 40;
          }
          doc.text(line, left + 20, y);
          y += 14;
        });
        y += 4;
      }

      function addList(items: string[] | undefined, badgeColor?: [number, number, number]) {
        if (!items || items.length === 0) return;
        items.forEach((item, idx) => {
          if (badgeColor) {
            // Draw badge-like background
            doc.setFillColor(...badgeColor);
            doc.roundedRect(left + 10, y - 10, doc.getTextWidth(item) + 18, 18, 6, 6, "F");
            doc.setTextColor(255, 255, 255);
            doc.text(item, left + 19, y + 3);
            doc.setTextColor(33, 37, 41);
            y += 24;
          } else {
            doc.circle(left + 15, y - 4, 2, "F");
            doc.text(item, left + 25, y);
            y += 16;
          }
          if (y > pageHeight - 40) {
            doc.addPage();
            y = 40;
          }
        });
        y += 2;
      }

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("AI Disease Prediction Report", left, y);
      y += 30;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      addTextBlock("Saved At:", new Date(pred.savedAt).toLocaleString());

      // --- User Provided Information ---
      addSectionHeader("User Provided Information", [59, 130, 246]);
      addTextBlock("Symptoms:", pred.symptoms);
      addTextBlock("Additional Symptoms:", pred.medicalHistory?.additionalSymptoms);
      addTextBlock("Age:", pred.personalInfo?.age ? String(pred.personalInfo.age) : "");
      addTextBlock("Gender:", pred.personalInfo?.gender);
      addTextBlock("Existing Medical Conditions:", pred.medicalHistory?.conditions);
      addTextBlock("Current Medications:", pred.medicalHistory?.medications);
      addTextBlock("Family Medical History:", pred.medicalHistory?.familyHistory);

      y += 10;

      // --- Prediction Results Section ---
      addSectionHeader("AI Prediction Results", [37, 99, 235]);

      // Primary Diagnosis & Risk
      addSubHeader("Primary Diagnosis:");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.text(pred.primaryDiagnosis || "N/A", left + 20, y);
      y += 20;

      // Risk Badge
      if (pred.riskLevel) {
        let badgeColor: [number, number, number] =
          pred.riskLevel === "Low"
            ? [34, 197, 94]
            : pred.riskLevel === "Medium"
            ? [251, 191, 36]
            : [239, 68, 68];
        addBadge(`${pred.riskLevel} Risk`, badgeColor);
      }

      // Confidence
      addTextBlock("Confidence:", pred.confidence !== undefined ? `${pred.confidence}%` : "");

      // Possible Causes
      addSubHeader("Possible Causes:");
      addList(pred.possibleCauses);

      // Future Health Outlook
      if (pred.futureOutlook) {
        addSubHeader("Future Health Outlook:");
        addTextBlock("With Treatment:", pred.futureOutlook.withTreatment);
        addTextBlock("Without Treatment:", pred.futureOutlook.withoutTreatment);
      }

      // Recommendations
      addSubHeader("Treatment Recommendations:");
      addList(pred.recommendations);

      // Suggested Tests
      addSubHeader("Suggested Medical Tests:");
      addList(pred.suggestedTests, [139, 92, 246]);

      // Food Recommendations
      addSubHeader("Food Recommendations:");
      addList(pred.foodRecommendations, [34, 197, 94]);

      // Foods to Avoid
      addSubHeader("Foods to Avoid:");
      addList(pred.foodsToAvoid, [239, 68, 68]);

      // Drugs or Medicines
      addSubHeader("Drugs or Medicines:");
      addList(pred.drugsOrMedicines, [59, 130, 246]);

      // Remedies
      addSubHeader("Remedies:");
      addList(pred.remedies, [251, 191, 36]);

      // Urgency
      addTextBlock("Urgency:", pred.urgency);

      // Disclaimer
      y += 20;
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 40;
      }
      doc.setFontSize(10);
      doc.setTextColor(200, 100, 0);
      const disclaimer =
        "Medical Disclaimer: This AI prediction is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.";
      const disclaimerLines = doc.splitTextToSize(disclaimer, wrapWidth);
      disclaimerLines.forEach((line: string) => {
        doc.text(line, left, y);
        y += 14;
      });

      doc.save(`prediction-${pred.primaryDiagnosis || idx}.pdf`);
    })
  }

  // Delete saved prediction handler
  const handleDeleteSaved = (idx: number) => {
    const updated = savedPredictions.filter((_, i) => i !== idx)
    setSavedPredictions(updated)
    localStorage.setItem("savedPredictions", JSON.stringify(updated))
  }

  // Check if saved prediction exists
  const hasSavedPrediction = typeof window !== "undefined" && !!localStorage.getItem("savedPrediction")

  return (
    <Suspense fallback={<div>Loading...</div>}>
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

          {/* Step 1: Show all saved predictions if available */}
          {step === 1 && (
            <>
              {/* Current Symptoms Card */}
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

              {/* Saved Predictions Section - below symptoms */}
              {savedPredictions.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Saved Predictions</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedPredictions.map((pred, idx) => (
                      <Card key={pred.id || idx} className="relative border-2 border-gray-200 shadow-sm bg-white">
                        <CardContent className="py-4">
                          <div className="mb-2 text-xs text-gray-500">
                            Saved: {new Date(pred.savedAt).toLocaleString()}
                          </div>
                          <div className="font-bold mb-1">{pred.primaryDiagnosis}</div>
                          <div className="mb-2 text-sm">
                            Risk: <span className="font-semibold">{pred.riskLevel}</span>
                          </div>
                          <Button
                            size="sm"
                            className="mr-2"
                            onClick={() => handleViewSaved(pred)}
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
            </>
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

          {/* Step 3: Prediction Results */}
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
                    <div className="w-full max-w-md mx-auto">
                      <div className="h-2.5 bg-blue-200 rounded-full overflow-hidden relative">
                        <div
                          className="h-2.5 bg-blue-600 rounded-full animate-ripple absolute left-0 top-0"
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

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="h-6 w-6 mr-2 text-yellow-600" />
                          Possible Causes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {prediction?.possibleCauses?.map((cause: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <span>{cause}</span>
                            </li>
                          )) ?? (
                            <li className="text-sm text-gray-500">No causes data available.</li>
                          )}
                        </ul>
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
                          setShowSaved(false)
                        }}
                      >
                        New Prediction
                      </Button>
                      {/* Show Save button only if not viewing saved */}
                      {!showSaved && (
                        <Button
                          variant="default"
                          onClick={handleSavePrediction}
                        >
                          Save Prediction
                        </Button>
                      )}
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
    </Suspense>
  )
}