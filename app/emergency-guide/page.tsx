"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function EmergencyGuidePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [guide, setGuide] = useState<any>(null)
  const [selectedCondition, setSelectedCondition] = useState("")
  const [severity, setSeverity] = useState("")
  const [location, setLocation] = useState("")

  const emergencyConditions = [
    "Snake Bite",
    "Heart Attack",
    "Stroke",
    "Choking",
    "Severe Bleeding",
    "Burns",
    "Poisoning",
    "Allergic Reaction",
    "Seizure",
    "Fracture",
    "Drowning",
    "Electric Shock",
    "Heat Stroke",
    "Hypothermia",
    "Asthma Attack",
    "Diabetic Emergency",
    "Head Injury",
    "Spinal Injury",
  ]

  const generateGuide = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/emergency-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          condition: selectedCondition,
          severity,
          location,
          availableResources: ["Phone", "First Aid Kit", "Other People"],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate guide")
      }

      const result = await response.json()
      setGuide(result)
    } catch (error) {
      console.error("Error generating emergency guide:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-gray-900">Emergency Guide</h1>
              <p className="text-gray-600">Do's and Don'ts for medical emergencies</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!guide ? (
          <div className="space-y-8">
            {/* Emergency Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
                  Select Emergency Condition
                </CardTitle>
                <CardDescription>Choose the emergency situation to get specific guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Emergency Condition</Label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select emergency condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {emergencyConditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                        <SelectItem value="life-threatening">Life-threatening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Current Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Home, Office, Outdoors, etc."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Emergency Numbers */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">Emergency Services</p>
                      <p className="text-red-700">911</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">Poison Control</p>
                      <p className="text-red-700">1-800-222-1222</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">Crisis Hotline</p>
                      <p className="text-red-700">988</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center">
              <Button onClick={generateGuide} size="lg" disabled={isGenerating || !selectedCondition} className="px-8">
                {isGenerating ? (
                  <>
                    <AlertTriangle className="h-5 w-5 mr-2 animate-pulse" />
                    Generating Emergency Guide...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Get Emergency Guide
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Emergency Header */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 text-2xl">Emergency Guide: {selectedCondition}</CardTitle>
                <CardDescription className="text-red-700">
                  Follow these instructions carefully. Call 911 if situation is life-threatening.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Immediate Actions */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* DO's */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    DO's - Take These Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guide.immediateActions.dos.map((action: any, index: number) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-green-800">{action.action}</h4>
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            {action.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {action.timing}
                        </p>
                        <p className="text-sm text-green-700">{action.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* DON'Ts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800">
                    <XCircle className="h-6 w-6 mr-2" />
                    DON'Ts - Avoid These Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guide.immediateActions.donts.map((action: any, index: number) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-red-800">{action.action}</h4>
                          <Badge variant="outline" className="text-red-700 border-red-300">
                            {action.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-red-700 mb-1">{action.reason}</p>
                        <p className="text-xs text-red-600">Consequence: {action.consequence}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step by Step Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-blue-600" />
                  Step-by-Step Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guide.stepByStep.map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">{step.instruction}</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-blue-800">Duration:</span>
                            <span className="text-blue-700 ml-1">{step.duration}</span>
                          </div>
                          <div>
                            <span className="font-medium text-blue-800">Watch for:</span>
                            <span className="text-blue-700 ml-1">{step.signs}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Warning Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-orange-600" />
                  Warning Signs to Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Signs of Deterioration</h4>
                    <ul className="space-y-1">
                      {guide.warningSignsigns.deterioration.map((sign: string, index: number) => (
                        <li key={index} className="text-sm text-red-700">
                          • {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Signs of Improvement</h4>
                    <ul className="space-y-1">
                      {guide.warningSignsigns.improvement.map((sign: string, index: number) => (
                        <li key={index} className="text-sm text-green-700">
                          • {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Call 911 If</h4>
                    <ul className="space-y-1">
                      {guide.warningSignsigns.whenToCall911.map((condition: string, index: number) => (
                        <li key={index} className="text-sm text-orange-700">
                          • {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card>
              <CardHeader>
                <CardTitle>Common Mistakes to Avoid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guide.commonMistakes.map((mistake: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">❌ {mistake.mistake}</h4>
                      <p className="text-red-700 text-sm mb-2">Why it's problematic: {mistake.whyBad}</p>
                      <p className="text-green-700 text-sm">✅ Instead: {mistake.instead}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Care */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-purple-600" />
                  Follow-up Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Immediate Next Steps</h4>
                    <p className="text-sm text-purple-700">{guide.followUp.immediateNext}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Monitoring</h4>
                    <p className="text-sm text-purple-700">{guide.followUp.monitoring}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Medical Care</h4>
                    <p className="text-sm text-purple-700">{guide.followUp.medicalCare}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prevention */}
            <Card>
              <CardHeader>
                <CardTitle>Prevention & Preparedness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Future Prevention</h4>
                    <ul className="space-y-1">
                      {guide.prevention.futureAvoidance.map((tip: string, index: number) => (
                        <li key={index} className="text-sm">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Risk Factors</h4>
                    <ul className="space-y-1">
                      {guide.prevention.riskFactors.map((factor: string, index: number) => (
                        <li key={index} className="text-sm">
                          • {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Be Prepared</h4>
                    <ul className="space-y-1">
                      {guide.prevention.preparedness.map((tip: string, index: number) => (
                        <li key={index} className="text-sm">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setGuide(null)} variant="outline">
                Get Guide for Different Emergency
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <Phone className="h-4 w-4 mr-2" />
                Call Emergency Services (911)
              </Button>
            </div>

            {/* Disclaimer */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-800">
                    <strong>Important Disclaimer:</strong> This emergency guide is for informational purposes only and
                    should not replace professional emergency medical services. Always call 911 for life-threatening
                    emergencies. This information is not a substitute for proper first aid training.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
